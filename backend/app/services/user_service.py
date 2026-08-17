from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserPreferencesUpdate


def create_user(user: UserCreate, db: Session):
    existing = db.query(User).filter(User.firebase_uid == user.firebase_uid).first()
    if existing:
        if user.display_name is not None:
            existing.display_name = user.display_name
        if user.profession is not None:
            existing.profession = user.profession
        if user.bio is not None:
            existing.bio = user.bio
        if user.timezone is not None:
            existing.timezone = user.timezone
        if user.preferences is not None:
            existing.preferences = user.preferences
        db.commit()
        db.refresh(existing)
        return existing

    db_user = User(
        firebase_uid=user.firebase_uid,
        email=user.email,
        display_name=user.display_name,
        profession=user.profession,
        bio=user.bio,
        timezone=user.timezone or "UTC",
        preferences=user.preferences or {}
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def update_user_profile(user_id: int, update_data: UserUpdate, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    if update_data.display_name is not None:
        user.display_name = update_data.display_name
    if update_data.profession is not None:
        user.profession = update_data.profession
    if update_data.bio is not None:
        user.bio = update_data.bio
    if update_data.timezone is not None:
        user.timezone = update_data.timezone
    db.commit()
    db.refresh(user)
    return user


def update_user_preferences(user_id: int, pref_data: UserPreferencesUpdate, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
    user.preferences = pref_data.preferences
    db.commit()
    db.refresh(user)
    return user
