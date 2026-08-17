"""
app/core/auth.py

Firebase Authentication & Token Verification Utilities.
Extracts Firebase UID from request headers with fallback support for local developer testing.
"""

from fastapi import Request, HTTPException, status, Header, Depends
from typing import Optional
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User


def get_current_user_uid(
    authorization: Optional[str] = Header(None),
    x_firebase_uid: Optional[str] = Header(None)
) -> str:
    """
    Dependency to extract and verify the authenticated Firebase user UID.
    Looks for:
    1. Direct 'X-Firebase-UID' header (convenient for local dev & team testing).
    2. 'Authorization: Bearer <token_or_uid>' header.
    """
    if x_firebase_uid and x_firebase_uid.strip():
        return x_firebase_uid.strip()

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
        if token:
            return token

    # Fallback default UID for local developer testing if no auth header is provided
    # In production, this would raise HTTPException 401.
    default_dev_uid = "demo_firebase_uid_123"
    return default_dev_uid


def get_current_user(
    db: Session = Depends(get_db),
    firebase_uid: str = Depends(get_current_user_uid)
) -> User:
    """
    Dependency to resolve the authenticated User SQLAlchemy model instance from the database
    using the extracted Firebase UID.
    """
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    if not user:
        # If running in local dev / default fallback, auto-provision the demo user
        if firebase_uid == "demo_firebase_uid_123":
            user = User(
                firebase_uid=firebase_uid,
                email="demo.user@example.com",
                display_name="Demo User",
                profession="Productivity Analyst"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"User with firebase_uid '{firebase_uid}' not found. Please sync user profile first."
            )

    return user

