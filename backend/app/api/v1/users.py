"""
app/api/v1/users.py

REST API endpoints for User Profile Management, Firebase UID Sync, and Settings/Preferences.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserPreferencesUpdate,
    UserResponse
)
from app.schemas.common import ErrorResponse
from app.services.user_service import (
    sync_firebase_user,
    get_user_by_firebase_uid,
    update_user_profile,
    update_user_preferences
)
from app.core.auth import get_current_user_uid

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/health",
    summary="User Service Health Check",
    description="Returns the operational status of the User API & Profile Management module."
)
def health():
    """Health check endpoint for users router."""
    return {
        "status": "online",
        "service": "users_router",
        "message": "User API & Profile Management operational"
    }


@router.post(
    "/sync",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Sync Firebase Authenticated User",
    description="Syncs Firebase authenticated user details to PostgreSQL database. Maps Firebase UID to user table entry."
)
def sync_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Syncs Firebase UID to local database record, auto-creating user if not found."""
    return sync_firebase_user(db=db, user_data=user_data)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Current User Profile",
    description="Retrieves profile information, profession, bio, timezone, and settings for the authenticated user."
)
def get_current_user_profile(
    current_uid: str = Depends(get_current_user_uid),
    db: Session = Depends(get_db)
):
    """Retrieves current user profile."""
    return get_user_by_firebase_uid(db=db, firebase_uid=current_uid)


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update User Profile",
    description="Updates display_name, profession, bio, avatar_url, and timezone for the authenticated user."
)
def update_profile(
    profile_data: UserUpdate,
    current_uid: str = Depends(get_current_user_uid),
    db: Session = Depends(get_db)
):
    """Updates user profile attributes."""
    return update_user_profile(db=db, firebase_uid=current_uid, update_data=profile_data)


@router.put(
    "/me/preferences",
    response_model=UserResponse,
    summary="Update User Preferences (PUT)",
    description="Updates application settings and user preferences (theme, reminders, AI tone, focus areas)."
)
@router.patch(
    "/me/preferences",
    response_model=UserResponse,
    summary="Update User Preferences (PATCH)",
    description="Updates application settings and user preferences."
)
def update_preferences(
    preferences_payload: UserPreferencesUpdate,
    current_uid: str = Depends(get_current_user_uid),
    db: Session = Depends(get_db)
):
    """Updates user preferences dictionary."""
    return update_user_preferences(
        db=db,
        firebase_uid=current_uid,
        preferences=preferences_payload.preferences
    )