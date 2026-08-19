"""
app/api/v1/progress.py

REST API endpoints for Progress tracking, progress logging, and activity timelines.
Scoped to goals owned by the authenticated user.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.progress import (
    ProgressCreate,
    ProgressUpdate,
    ProgressResponse
)
from app.schemas.common import MessageResponse, ErrorResponse
from app.services.progress_service import (
    create_progress,
    get_user_progress,
    get_progress_by_id,
    update_progress,
    delete_progress
)

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.post(
    "/",
    response_model=ProgressResponse,
    status_code=status.HTTP_201_CREATED,
    responses={404: {"model": ErrorResponse, "description": "Goal not found or unauthorized"}},
    summary="Log Progress",
    description="Logs a new progress entry (quantitative progress_value and optional note) against a user's goal."
)
def create_new_progress(
    progress: ProgressCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a progress log entry."""
    return create_progress(current_user.id, progress, db)


@router.get(
    "/",
    response_model=List[ProgressResponse],
    summary="List Progress Logs",
    description="Retrieves progress logs for the authenticated user, optionally filtered by goal_id."
)
def read_progress(
    goal_id: Optional[int] = Query(None, description="Optional goal ID filter"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lists progress entries for user goals."""
    return get_user_progress(current_user.id, db, goal_id=goal_id)


@router.get(
    "/{progress_id}",
    response_model=ProgressResponse,
    responses={404: {"model": ErrorResponse, "description": "Progress record not found"}},
    summary="Get Single Progress Record",
    description="Retrieves a specific progress log by ID."
)
def read_progress_by_id(
    progress_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves a single progress record by ID."""
    return get_progress_by_id(progress_id, current_user.id, db)


@router.put(
    "/{progress_id}",
    response_model=ProgressResponse,
    responses={404: {"model": ErrorResponse, "description": "Progress record not found"}},
    summary="Update Progress Record",
    description="Updates progress_value or note for an existing progress log."
)
def update_existing_progress(
    progress_id: int,
    progress_data: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates a progress record."""
    return update_progress(progress_id, current_user.id, progress_data, db)


@router.delete(
    "/{progress_id}",
    response_model=MessageResponse,
    responses={404: {"model": ErrorResponse, "description": "Progress record not found"}},
    summary="Delete Progress Record",
    description="Deletes a progress log owned by the user."
)
def delete_existing_progress(
    progress_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a progress record by ID."""
    delete_progress(progress_id, current_user.id, db)
    return MessageResponse(message="Progress deleted successfully")