from sqlalchemy.orm import Session

from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate


def create_goal(goal: GoalCreate, user_id: int, db: Session):
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


def get_goals(user_id: int, db: Session):
    return db.query(Goal).filter(Goal.user_id == user_id).all()


def get_goal(goal_id: int, user_id: int, db: Session):
    return (
        db.query(Goal)
        .filter(
            Goal.id == goal_id,
            Goal.user_id == user_id
        )
        .first()
    )


def update_goal(
    goal_id: int,
    user_id: int,
    goal: GoalUpdate,
    db: Session
):
    db_goal = get_goal(goal_id, user_id, db)

    if not db_goal:
        return None

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
):
    db_goal = get_goal(goal_id, user_id, db)

    if not db_goal:
        return False

    db.delete(db_goal)
    db.commit()

    return True