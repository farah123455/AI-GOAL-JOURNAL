"""
app/api/v1/users.py

REST API endpoints for User Profile Management, Firebase UID Sync, and Settings/Preferences.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserPreferences,
    UserPreferencesUpdate,
    UserResponse
)
from app.services.user_service import (
    sync_firebase_user,
    get_user_by_firebase_uid,
    update_user_profile,
    update_user_preferences
)
from app.core.auth import get_current_user_uid

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/health")
def health():
    """
    Health check endpoint for users router.
    """
    return {
        "status": "online",
        "service": "users_router",
        "message": "User API & Profile Management operational"
    }

@router.post("/sync", response_model=UserResponse, status_code=status.HTTP_200_OK)
def sync_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Syncs Firebase authenticated user details to PostgreSQL database.
    Map Firebase UID to user table entry.
    """
    return sync_firebase_user(db=db, user_data=user_data)

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_uid: str = Depends(get_current_user_uid),
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user profile and settings.
    """
    return get_user_by_firebase_uid(db=db, firebase_uid=current_uid)

@router.put("/me", response_model=UserResponse)
def update_profile(
    profile_data: UserUpdate,
    current_uid: str = Depends(get_current_user_uid),
    db: Session = Depends(get_db)
):
    """
    Update profile information (display_name, profession, bio, avatar_url, timezone).
    """
    return update_user_profile(db=db, firebase_uid=current_uid, update_data=profile_data)

@router.put("/me/preferences", response_model=UserResponse)
@router.patch("/me/preferences", response_model=UserResponse)
def update_preferences(
    preferences_payload: UserPreferencesUpdate,
    current_uid: str = Depends(get_current_user_uid),
    db: Session = Depends(get_db)
):
    """
    Update user preferences and application settings.
    """
    return update_user_preferences(
        db=db,
        firebase_uid=current_uid,
        preferences=preferences_payload.preferences
    )