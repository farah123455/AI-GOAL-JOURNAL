from datetime import datetime
from typing import Optional

from app.models.domain import Progress
from app.repositories.postgres import progress_repo, goal_repo


class ProgressService:

    def create_progress(
        self,
        user_id: str,
        goal_id: str,
        progress_value: int,
        note: Optional[str] = None,
    ) -> Progress:

        # Verify that this goal actually belongs to the logged-in user.
        goal = goal_repo.get_by_id(
            user_id=user_id,
            goal_id=goal_id
        )

        if not goal:
            raise LookupError("Goal not found")

        progress = Progress(
            id="",
            goal_id=goal_id,
            progress_value=progress_value,
            note=note,
            created_at=datetime.utcnow(),
        )

        return progress_repo.create(progress)

    def get_progress_history(
        self,
        user_id: str,
        goal_id: str
    ) -> list[Progress]:

        return progress_repo.get_by_goal(
            user_id=user_id,
            goal_id=goal_id
        )

    def get_latest_progress(
        self,
        user_id: str,
        goal_id: str
    ) -> Optional[Progress]:

        return progress_repo.get_latest_by_goal(
            user_id=user_id,
            goal_id=goal_id
        )


progress_service = ProgressService()