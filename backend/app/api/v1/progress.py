from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.progress import (
    ProgressCreate,
    ProgressUpdate,
    ProgressResponse
)
from app.services.progress_service import (
    create_progress,
    get_user_progress,
    get_progress_by_id,
    update_progress,
    delete_progress
)

router = APIRouter(prefix="/progress", tags=["Progress"])


# CREATE PROGRESS
@router.post("/", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED)
def create_new_progress(
    progress: ProgressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    created = create_progress(current_user.id, progress, db)
    if not created:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found or does not belong to the current user"
        )
    return created


# GET ALL PROGRESS FOR AUTHENTICATED USER (Optionally filtered by goal_id)
@router.get("/", response_model=list[ProgressResponse])
def read_progress(
    goal_id: Optional[int] = Query(None, description="Optional goal ID filter"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_progress(current_user.id, db, goal_id=goal_id)


# GET ONE PROGRESS RECORD
@router.get("/{progress_id}", response_model=ProgressResponse)
def read_progress_by_id(
    progress_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress = get_progress_by_id(progress_id, current_user.id, db)

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress record not found"
        )

    return progress


# UPDATE PROGRESS RECORD
@router.put("/{progress_id}", response_model=ProgressResponse)
def update_existing_progress(
    progress_id: int,
    progress_data: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated = update_progress(
        progress_id,
        current_user.id,
        progress_data,
        db
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress record not found"
        )

    return updated


# DELETE PROGRESS RECORD
@router.delete("/{progress_id}")
def delete_existing_progress(
    progress_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deleted = delete_progress(
        progress_id,
        current_user.id,
        db
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress record not found"
        )

    return {
        "message": "Progress deleted successfully"
    }