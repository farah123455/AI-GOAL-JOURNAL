import uuid
import logging
from typing import Optional
from app.models.domain import Progress, Goal
from app.schemas.progress import ProgressCreate
from app.repositories.in_memory import progress_repo, goal_repo

logger = logging.getLogger(__name__)

class ProgressService:
    def record_progress(self, user_id: str, goal_id: str, data: ProgressCreate) -> Optional[Progress]:
        # 1. Verify goal belongs to authenticated user
        goal = goal_repo.get_by_id(user_id=user_id, goal_id=goal_id)
        if not goal:
            logger.warning("Attempted to record progress for nonexistent or unauthorized goal %s", goal_id)
            return None

        # 2. Create progress entry
        progress_entry = Progress(
            id=str(uuid.uuid4()),
            goal_id=goal_id,
            progress_value=data.progress_value,
            note=data.note.strip() if data.note else None,
        )

        saved = progress_repo.create(progress_entry)

        # 3. Update goal status & progress_value on goal
        updates = {
            "progress_value": data.progress_value,
            "latest_progress_note": data.note,
        }
        if data.progress_value >= 100:
            updates["status"] = "Completed"
        elif goal.status == "Completed" and data.progress_value < 100:
            updates["status"] = "Active"

        goal_repo.update(user_id=user_id, goal_id=goal_id, **updates)
        logger.info("Recorded progress %d%% for goal %s (user %s)", data.progress_value, goal_id, user_id)
        return saved

    def get_latest_progress(self, user_id: str, goal_id: str) -> Optional[Progress]:
        goal = goal_repo.get_by_id(user_id=user_id, goal_id=goal_id)
        if not goal:
            return None
        return progress_repo.get_latest_by_goal(goal_id)

    def get_progress_history(self, user_id: str, goal_id: str) -> list[Progress]:
        goal = goal_repo.get_by_id(user_id=user_id, goal_id=goal_id)
        if not goal:
            return []
        return progress_repo.get_all_by_goal(goal_id)

progress_service = ProgressService()
