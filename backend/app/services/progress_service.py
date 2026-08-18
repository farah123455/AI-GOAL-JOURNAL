"""
app/services/progress_service.py

Service layer handling business logic and database access for Progress records.
Ensures progress operations are scoped to goals owned by the authenticated user.
"""

from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.progress import Progress
from app.models.goal import Goal
from app.schemas.progress import ProgressCreate, ProgressUpdate


def create_progress(user_id: int, progress_data: ProgressCreate, db: Session) -> Optional[Progress]:
    # Verify that the target goal exists and belongs to the authenticated user
    goal = db.query(Goal).filter(
        Goal.id == progress_data.goal_id,
        Goal.user_id == user_id
    ).first()

    if not goal:
        return None

    new_progress = Progress(
        goal_id=progress_data.goal_id,
        progress_value=progress_data.progress_value,
        note=progress_data.note
    )
    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)
    return new_progress


def get_user_progress(user_id: int, db: Session, goal_id: Optional[int] = None) -> List[Progress]:
    query = (
        db.query(Progress)
        .join(Goal, Progress.goal_id == Goal.id)
        .filter(Goal.user_id == user_id)
    )

    if goal_id is not None:
        query = query.filter(Progress.goal_id == goal_id)

    return query.order_by(Progress.created_at.desc()).all()


def get_progress_by_id(progress_id: int, user_id: int, db: Session) -> Optional[Progress]:
    return (
        db.query(Progress)
        .join(Goal, Progress.goal_id == Goal.id)
        .filter(
            Progress.id == progress_id,
            Goal.user_id == user_id
        )
        .first()
    )


def update_progress(
    progress_id: int,
    user_id: int,
    progress_data: ProgressUpdate,
    db: Session
) -> Optional[Progress]:
    progress = get_progress_by_id(progress_id, user_id, db)
    if not progress:
        return None

    if progress_data.progress_value is not None:
        progress.progress_value = progress_data.progress_value
    if progress_data.note is not None:
        progress.note = progress_data.note

    db.commit()
    db.refresh(progress)
    return progress


def delete_progress(progress_id: int, user_id: int, db: Session) -> bool:
    progress = get_progress_by_id(progress_id, user_id, db)
    if not progress:
        return False

    db.delete(progress)
    db.commit()
    return True
