from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.progress import Progress
from app.models.goal import Goal
from app.schemas.progress import (
    ProgressCreate,
    ProgressUpdate,
    ProgressResponse
)

router = APIRouter(prefix="/progress", tags=["Progress"])


# CREATE PROGRESS
@router.post("/", response_model=ProgressResponse)
def create_progress(
    progress: ProgressCreate,
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(
        Goal.id == progress.goal_id
    ).first()

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    new_progress = Progress(
        goal_id=progress.goal_id,
        progress_value=progress.progress_value,
        note=progress.note
    )

    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)

    return new_progress


# GET ALL PROGRESS
@router.get("/", response_model=list[ProgressResponse])
def get_progress(
    db: Session = Depends(get_db)
):
    return db.query(Progress).all()


# GET ONE PROGRESS
@router.get("/{progress_id}", response_model=ProgressResponse)
def get_progress_by_id(
    progress_id: int,
    db: Session = Depends(get_db)
):
    progress = db.query(Progress).filter(
        Progress.id == progress_id
    ).first()

    if not progress:
        raise HTTPException(
            status_code=404,
            detail="Progress record not found"
        )

    return progress


# UPDATE PROGRESS
@router.put("/{progress_id}", response_model=ProgressResponse)
def update_progress(
    progress_id: int,
    progress_data: ProgressUpdate,
    db: Session = Depends(get_db)
):
    progress = db.query(Progress).filter(
        Progress.id == progress_id
    ).first()

    if not progress:
        raise HTTPException(
            status_code=404,
            detail="Progress record not found"
        )

    if progress_data.progress_value is not None:
        progress.progress_value = progress_data.progress_value

    if progress_data.note is not None:
        progress.note = progress_data.note

    db.commit()
    db.refresh(progress)

    return progress


# DELETE PROGRESS
@router.delete("/{progress_id}")
def delete_progress(
    progress_id: int,
    db: Session = Depends(get_db)
):
    progress = db.query(Progress).filter(
        Progress.id == progress_id
    ).first()

    if not progress:
        raise HTTPException(
            status_code=404,
            detail="Progress record not found"
        )

    db.delete(progress)
    db.commit()

    return {
        "message": "Progress deleted successfully"
    }