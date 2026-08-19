"""
app/api/v1/goals.py

REST API endpoints for Goal creation, retrieval, updates, and deletion.
Strictly scoped to the authenticated user.
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from app.schemas.common import MessageResponse, ErrorResponse
from app.services.goal_service import (
    create_goal,
    get_goals,
    get_goal,
    update_goal,
    delete_goal
)

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.post(
    "/",
    response_model=GoalResponse,
    status_code=status.HTTP_200_OK,
    summary="Create Goal",
    description="Creates a new user goal with an initial status ('Active', 'Completed', or 'Stalled')."
)
def create_new_goal(
    goal: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new goal for the current authenticated user."""
    return create_goal(goal, current_user.id, db)


@router.get(
    "/",
    response_model=List[GoalResponse],
    summary="List User Goals",
    description="Retrieves all goals belonging to the authenticated user."
)
def read_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lists all active, completed, and stalled goals for the user."""
    return get_goals(current_user.id, db)


@router.get(
    "/{goal_id}",
    response_model=GoalResponse,
    responses={404: {"model": ErrorResponse, "description": "Goal not found"}},
    summary="Get Single Goal",
    description="Retrieves details for a specific goal by ID."
)
def read_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves a single goal by ID."""
    return get_goal(goal_id, current_user.id, db)


@router.put(
    "/{goal_id}",
    response_model=GoalResponse,
    responses={404: {"model": ErrorResponse, "description": "Goal not found"}},
    summary="Update Goal",
    description="Updates title, description, or status of an existing user goal."
)
def update_existing_goal(
    goal_id: int,
    goal: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates goal attributes and status."""
    return update_goal(goal_id, current_user.id, goal, db)


@router.delete(
    "/{goal_id}",
    response_model=MessageResponse,
    responses={404: {"model": ErrorResponse, "description": "Goal not found"}},
    summary="Delete Goal",
    description="Deletes a goal owned by the user."
)
def delete_existing_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a goal by ID."""
    delete_goal(goal_id, current_user.id, db)
    return MessageResponse(message="Goal deleted successfully")