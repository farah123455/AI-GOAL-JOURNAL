"""
app/services/goal_service.py

Business logic for Goal Management and SQL query execution.
Ensures all queries and mutations are user-scoped.
"""

from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate
from app.core.exceptions import ResourceNotFoundException


def create_goal(goal: GoalCreate, user_id: int, db: Session) -> Goal:
    """Creates a new Goal for the specified user."""
    db_goal = Goal(
        user_id=user_id,
        title=goal.title,
        description=goal.description,
        status=goal.status
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


def get_goals(user_id: int, db: Session) -> List[Goal]:
    """Retrieves all goals owned by the specified user."""
    return db.query(Goal).filter(Goal.user_id == user_id).all()


def get_goal(goal_id: int, user_id: int, db: Session) -> Goal:
    """Retrieves a single goal by ID for the specified user, or raises ResourceNotFoundException."""
    goal = (
        db.query(Goal)
        .filter(
            Goal.id == goal_id,
            Goal.user_id == user_id
        )
        .first()
    )
    if not goal:
        raise ResourceNotFoundException(f"Goal with id {goal_id} not found")
    return goal


def update_goal(
    goal_id: int,
    user_id: int,
    goal: GoalUpdate,
    db: Session
) -> Goal:
    """Updates an existing goal owned by the user."""
    db_goal = get_goal(goal_id, user_id, db)

    if goal.title is not None:
        db_goal.title = goal.title
    if goal.description is not None:
        db_goal.description = goal.description
    if goal.status is not None:
        db_goal.status = goal.status

    db.commit()
    db.refresh(db_goal)
    return db_goal


def delete_goal(
    goal_id: int,
    user_id: int,
    db: Session
) -> bool:
    """Deletes a goal owned by the user."""
    db_goal = get_goal(goal_id, user_id, db)
    db.delete(db_goal)
    db.commit()
    return True