from datetime import datetime, timedelta
import logging
from typing import Optional

from app.models.domain import Progress
from app.schemas.progress import ProgressCreate
from app.repositories.postgres import progress_repo, goal_repo


logger = logging.getLogger(__name__)


class ProgressService:

    def create_progress(
        self,
        user_id: str,
        goal_id: str,
        progress_value: int,
        note: Optional[str] = None,
    ) -> Progress:
        """
        Create a historical progress record for a goal.
        The goal must belong to the authenticated user.
        """

        goal = goal_repo.get_by_id(
            user_id=user_id,
            goal_id=goal_id,
        )

        if not goal:
            raise LookupError("Goal not found")

        progress = Progress(
            id="",
            goal_id=goal_id,
            progress_value=progress_value,
            note=note.strip() if note else None,
            created_at=datetime.utcnow(),
        )

        saved = progress_repo.create(progress)

        # Update goal progress value and status in goal repository
        updates = {"progress_value": progress_value}

        if progress_value >= 100:
            updates["status"] = "Completed"

        goal_repo.update(
            user_id=user_id,
            goal_id=goal_id,
            **updates,
        )

        logger.info(
            "Recorded progress %d%% for goal %s",
            progress_value,
            goal_id,
        )

        return saved

    def record_progress(
        self,
        user_id: str,
        goal_id: str,
        data: ProgressCreate,
    ) -> Optional[Progress]:
        """
        Compatibility method used by the Goal API and AI journal pipeline.
        Saves AI/manual progress to PostgreSQL.
        """

        goal = goal_repo.get_by_id(
            user_id=user_id,
            goal_id=goal_id,
        )

        if not goal:
            logger.warning(
                "Attempted to record progress for nonexistent "
                "or unauthorized goal %s",
                goal_id,
            )
            return None

        return self.create_progress(
            user_id=user_id,
            goal_id=goal_id,
            progress_value=data.progress_value,
            note=data.note,
        )

    def get_progress_history(
        self,
        user_id: str,
        goal_id: str,
    ) -> list[Progress]:

        goal = goal_repo.get_by_id(
            user_id=user_id,
            goal_id=goal_id,
        )

        if not goal:
            return []

        raw_history = progress_repo.get_by_goal(
            user_id=user_id,
            goal_id=goal_id,
        )

        # Return in chronological order (oldest to newest)
        return sorted(
            raw_history,
            key=lambda p: p.created_at,
        )

    def get_progress_trend(
        self,
        user_id: str,
        goal_id: str,
        period_days: int = 7,
    ):
        from app.schemas.progress import (
            ProgressHistoryItem,
            ProgressTrendResponse,
        )

        goal = goal_repo.get_by_id(
            user_id=user_id,
            goal_id=goal_id,
        )

        if not goal:
            raise LookupError("Goal not found")

        raw_history = progress_repo.get_by_goal(
            user_id=user_id,
            goal_id=goal_id,
        )

        # Chronological forward order (oldest to newest)
        history_sorted = sorted(
            raw_history,
            key=lambda p: p.created_at,
        )

        # If no explicit progress checkpoints exist yet,
        # supply initial baseline from goal creation
        if not history_sorted:
            history_sorted = [
                Progress(
                    id=f"init-{goal.id}",
                    goal_id=goal.id,
                    progress_value=goal.progress_value or 0,
                    note="Initial goal milestone",
                    created_at=goal.created_at or datetime.utcnow(),
                )
            ]

        # If goal is marked Completed or has 100% progress,
        # guarantee the 100% milestone is present in the trend
        if (
            goal.status == "Completed"
            or (goal.progress_value or 0) >= 100
        ) and history_sorted[-1].progress_value < 100:

            history_sorted.append(
                Progress(
                    id=f"comp-{goal.id}",
                    goal_id=goal.id,
                    progress_value=100,
                    note=(
                        goal.latest_progress_note
                        or "Goal marked as completed (100%)"
                    ),
                    created_at=(
                        goal.updated_at
                        or datetime.utcnow()
                    ),
                )
            )

        history_items: list[ProgressHistoryItem] = []

        for i, rec in enumerate(history_sorted):
            prev_val = (
                history_sorted[i - 1].progress_value
                if i > 0
                else rec.progress_value
            )

            delta = rec.progress_value - prev_val

            history_items.append(
                ProgressHistoryItem(
                    id=rec.id,
                    goal_id=rec.goal_id,
                    progress_value=rec.progress_value,
                    note=rec.note,
                    created_at=rec.created_at,
                    change_from_previous=delta,
                )
            )

        current_val = goal.progress_value or 0

        if history_items:
            current_val = history_items[-1].progress_value
            initial_val = history_items[0].progress_value

            net_change = (
                current_val - initial_val
            )

            # Determine trend direction
            recent_delta = (
                history_items[-1].change_from_previous
                if len(history_items) > 1
                else net_change
            )

            if recent_delta > 0 or net_change > 0:
                trend_direction = "improving"

            elif recent_delta < 0 or net_change < 0:
                trend_direction = "declining"

            else:
                trend_direction = "stagnant"

        else:
            initial_val = current_val
            net_change = 0
            trend_direction = "stagnant"

        # Calculate average progress change and stagnant updates
        progress_changes = [
            item.change_from_previous
            for item in history_items[1:]
        ]

        if progress_changes:
            average_progress_change = round(
                sum(progress_changes)
                / len(progress_changes),
                2,
            )

            stagnant_updates = sum(
                1
                for change in progress_changes
                if change == 0
            )

        else:
            average_progress_change = 0.0
            stagnant_updates = 0

        # Calculate progress gained during the selected recent period
        cutoff_date = (
            datetime.utcnow()
            - timedelta(days=period_days)
        )

        period_records = [
            item
            for item in history_items
            if item.created_at >= cutoff_date
        ]

        if period_records:
            records_before_period = [
                item
                for item in history_items
                if item.created_at < cutoff_date
            ]

            if records_before_period:
                period_start_value = (
                    records_before_period[-1]
                    .progress_value
                )

            else:
                period_start_value = (
                    period_records[0]
                    .progress_value
                )

            period_end_value = (
                period_records[-1]
                .progress_value
            )

            period_progress_gain = (
                period_end_value
                - period_start_value
            )

        else:
            period_progress_gain = 0

        return ProgressTrendResponse(
            goal_id=goal_id,
            goal_title=goal.title,
            current_progress=current_val,
            initial_progress=initial_val,
            net_change=net_change,
            average_progress_change=average_progress_change,
            stagnant_updates=stagnant_updates,
            period_days=period_days,
            period_progress_gain=period_progress_gain,
            trend_direction=trend_direction,
            total_updates=len(history_items),
            history=history_items,
        )

    def get_latest_progress(
        self,
        user_id: str,
        goal_id: str,
    ) -> Optional[Progress]:

        goal = goal_repo.get_by_id(
            user_id=user_id,
            goal_id=goal_id,
        )

        if not goal:
            return None

        return progress_repo.get_latest_by_goal(
            user_id=user_id,
            goal_id=goal_id,
        )


progress_service = ProgressService()