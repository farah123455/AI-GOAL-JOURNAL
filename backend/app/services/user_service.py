"""
app/services/user_service.py

Business logic for User Management, Firebase UID -> PostgreSQL mapping, User Preferences,
and bcrypt password hashing.
"""

from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserPreferences
from app.core.security import hash_password
from app.core.exceptions import BadRequestException

DEFAULT_PREFERENCES = {
    "theme": "dark",
    "daily_reminder_time": "20:00",
    "ai_coaching_tone": "encouraging",
    "focus_areas": ["Productivity", "Study", "Personal Growth"],
    "email_notifications": True,
    "push_notifications": True
}


def sync_firebase_user(db: Session, user_data: UserCreate) -> User:
    """
    Syncs Firebase authenticated user with PostgreSQL database.
    Creates a new user record if absent (encrypting password with bcrypt if provided),
    or updates existing user details. Enforces unique email check across accounts.
    """
    user = db.query(User).filter(User.firebase_uid == user_data.firebase_uid).first()

    # Verify if email is already registered to a different user account
    existing_email_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_email_user and (not user or existing_email_user.id != user.id):
        raise BadRequestException("An account with this email address already exists.")

    if not user:
        prefs = user_data.preferences.model_dump() if user_data.preferences else DEFAULT_PREFERENCES
        hashed_pwd = hash_password(user_data.password) if user_data.password else None
        user = User(
            firebase_uid=user_data.firebase_uid,
            email=user_data.email,
            hashed_password=hashed_pwd,
            display_name=user_data.display_name or user_data.email.split("@")[0].capitalize(),
            profession=user_data.profession,
            bio=user_data.bio,
            avatar_url=user_data.avatar_url,
            timezone=user_data.timezone or "UTC",
            preferences=prefs
        )
        db.add(user)
    else:
        # Update mutable synced properties if provided
        user.email = user_data.email
        if user_data.password:
            user.hashed_password = hash_password(user_data.password)
        if user_data.display_name:
            user.display_name = user_data.display_name
        if user_data.profession:
            user.profession = user_data.profession
        if user_data.bio:
            user.bio = user_data.bio
        if user_data.avatar_url:
            user.avatar_url = user_data.avatar_url
        if user_data.timezone:
            user.timezone = user_data.timezone
        if user_data.preferences:
            user.preferences = user_data.preferences.model_dump()

    db.commit()
    db.refresh(user)
    return user


def get_user_by_firebase_uid(db: Session, firebase_uid: str) -> User:
    """
    Retrieves user profile by Firebase UID. Auto-provisions user if absent.
    """
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if not user:
        email_prefix = firebase_uid.split("@")[0] if "@" in firebase_uid else firebase_uid
        user = User(
            firebase_uid=firebase_uid,
            email=f"{firebase_uid}@example.com" if "@" not in firebase_uid else firebase_uid,
            display_name=f"User ({email_prefix})",
            profession="Productivity Enthusiast",
            bio="Focusing on daily goals, habit tracking, and continuous improvement.",
            timezone="UTC",
            preferences=DEFAULT_PREFERENCES
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def update_user_profile(db: Session, firebase_uid: str, update_data: UserUpdate) -> User:
    """
    Updates authenticated user's profile details.
    """
    user = get_user_by_firebase_uid(db, firebase_uid)

    if update_data.display_name is not None:
        user.display_name = update_data.display_name
    if update_data.profession is not None:
        user.profession = update_data.profession
    if update_data.bio is not None:
        user.bio = update_data.bio
    if update_data.avatar_url is not None:
        user.avatar_url = update_data.avatar_url
    if update_data.timezone is not None:
        user.timezone = update_data.timezone

    db.commit()
    db.refresh(user)
    return user


def update_user_preferences(db: Session, firebase_uid: str, preferences: UserPreferences) -> User:
    """
    Updates user settings and preferences.
    """
    user = get_user_by_firebase_uid(db, firebase_uid)
    prefs_dict = preferences.model_dump()
    user.preferences = prefs_dict

    db.query(User).filter(User.id == user.id).update({"preferences": prefs_dict})
    db.commit()
    db.refresh(user)
    return user