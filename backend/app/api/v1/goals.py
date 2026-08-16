from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
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
    user_id: int,
    db: Session = Depends(get_db)
):
    return create_goal(goal, user_id, db)


@router.get("/", response_model=list[GoalResponse])
def read_goals(
    user_id: int,
    db: Session = Depends(get_db)
):
    return get_goals(user_id, db)


@router.get("/{goal_id}", response_model=GoalResponse)
def read_goal(
    goal_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    goal = get_goal(goal_id, user_id, db)

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
    user_id: int,
    db: Session = Depends(get_db)
):
    updated_goal = update_goal(
        goal_id,
        user_id,
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
    user_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_goal(
        goal_id,
        user_id,
        db
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    return {"message": "Goal deleted successfully"}