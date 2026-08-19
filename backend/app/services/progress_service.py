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
from app.core.exceptions import ResourceNotFoundException


def create_progress(user_id: int, progress_data: ProgressCreate, db: Session) -> Progress:
    """
    Creates a new progress record after verifying that the target goal exists
    and belongs to the authenticated user.
    """
    goal = db.query(Goal).filter(
        Goal.id == progress_data.goal_id,
        Goal.user_id == user_id
    ).first()

    if not goal:
        raise ResourceNotFoundException("Goal not found or does not belong to the current user")

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
    """Retrieves all progress records owned by the authenticated user, optionally filtered by goal_id."""
    query = (
        db.query(Progress)
        .join(Goal, Progress.goal_id == Goal.id)
        .filter(Goal.user_id == user_id)
    )

    if goal_id is not None:
        query = query.filter(Progress.goal_id == goal_id)

    return query.order_by(Progress.created_at.desc()).all()


def get_progress_by_id(progress_id: int, user_id: int, db: Session) -> Progress:
    """Retrieves a single progress record by ID for the user, or raises ResourceNotFoundException."""
    progress = (
        db.query(Progress)
        .join(Goal, Progress.goal_id == Goal.id)
        .filter(
            Progress.id == progress_id,
            Goal.user_id == user_id
        )
        .first()
    )
    if not progress:
        raise ResourceNotFoundException(f"Progress record with id {progress_id} not found")
    return progress


def update_progress(
    progress_id: int,
    user_id: int,
    progress_data: ProgressUpdate,
    db: Session
) -> Progress:
    """Updates an existing progress record owned by the user."""
    progress = get_progress_by_id(progress_id, user_id, db)

    if progress_data.progress_value is not None:
        progress.progress_value = progress_data.progress_value
    if progress_data.note is not None:
        progress.note = progress_data.note

    db.commit()
    db.refresh(progress)
    return progress


def delete_progress(progress_id: int, user_id: int, db: Session) -> bool:
    """Deletes a progress record owned by the user."""
    progress = get_progress_by_id(progress_id, user_id, db)
    db.delete(progress)
    db.commit()
    return True
