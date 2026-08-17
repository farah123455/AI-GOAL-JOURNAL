from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserPreferencesUpdate, UserResponse
from app.services.user_service import create_user, update_user_profile, update_user_preferences

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/health")
def health():
    return {"status": "online", "service": "users_router"}


@router.post("/sync", response_model=UserResponse)
def sync_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user(user, db)


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated = update_user_profile(current_user.id, update_data, db)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated


@router.put("/me/preferences", response_model=UserResponse)
def update_my_preferences(
    pref_data: UserPreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated = update_user_preferences(current_user.id, pref_data, db)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated