from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from app.services.goal_service import (
    create_goal,
    get_goals,
    get_goal,
    update_goal,
    delete_goal
)

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.post("/", response_model=GoalResponse)
def create_new_goal(
    goal: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_goal(goal, current_user.id, db)


@router.get("/", response_model=list[GoalResponse])
def read_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_goals(current_user.id, db)


@router.get("/{goal_id}", response_model=GoalResponse)
def read_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = get_goal(goal_id, current_user.id, db)

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    return goal


@router.put("/{goal_id}", response_model=GoalResponse)
def update_existing_goal(
    goal_id: int,
    goal: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_goal = update_goal(
        goal_id,
        current_user.id,
        goal,
        db
    )

    if not updated_goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    return updated_goal


@router.delete("/{goal_id}")
def delete_existing_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deleted = delete_goal(
        goal_id,
        current_user.id,
        db
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    return {"message": "Goal deleted successfully"}