"""
app/core/auth.py

Firebase Authentication & Token Verification Utilities.
Extracts and verifies Firebase ID Token (via firebase_admin.auth.verify_id_token)
with fallback support for direct X-Firebase-UID header and local developer testing.
"""

from typing import Optional
import os
import logging
from fastapi import Header, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User

logger = logging.getLogger("ai_goal_journal.auth")

# Attempt Firebase Admin SDK initialization
firebase_admin_available = False
try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth, credentials

    if not firebase_admin._apps:
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            firebase_admin_available = True
        else:
            try:
                firebase_admin.initialize_app()
                firebase_admin_available = True
            except Exception:
                logger.info("Firebase Admin SDK not initialized (missing credentials). Operating in dev token fallback mode.")
    else:
        firebase_admin_available = True
except ImportError:
    logger.info("firebase_admin package not initialized. Operating in dev token fallback mode.")


def verify_firebase_id_token(token: str) -> Optional[str]:
    """
    Verifies a Firebase ID token using firebase_admin.auth.verify_id_token().
    Returns the verified UID if valid, or None if verification fails/uninitialized.
    """
    if not firebase_admin_available:
        return None

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token.get("uid")
    except Exception as e:
        logger.warning(f"Firebase ID token verification failed: {e}")
        return None


def get_current_user_uid(
    authorization: Optional[str] = Header(None),
    x_firebase_uid: Optional[str] = Header(None, alias="X-Firebase-UID", description="Direct Firebase UID for developer testing")
) -> str:
    """
    Dependency to extract and verify authenticated Firebase user UID.

    Order of Resolution:
    1. 'X-Firebase-UID' header (for direct local dev testing).
    2. 'Authorization: Bearer <id_token>' header -> verified via firebase_admin.auth.verify_id_token().
    3. Fallback default UID for unauthenticated local dev testing ("demo_firebase_uid_123").
    """
    if x_firebase_uid and x_firebase_uid.strip():
        return x_firebase_uid.strip()

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ")[1].strip()
        if token:
            verified_uid = verify_firebase_id_token(token)
            if verified_uid:
                return verified_uid
            # Fallback for local dev mode if token is raw UID or testing without firebase_admin certs
            return token

    return "demo_firebase_uid_123"


def get_current_user(
    db: Session = Depends(get_db),
    firebase_uid: str = Depends(get_current_user_uid)
) -> User:
    """
    Dependency to resolve the authenticated User SQLAlchemy model instance from the database
    using the extracted Firebase UID.
    Auto-provisions the user if absent so testing journals/goals/progress works instantly.
    """
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()

    if not user:
        user = User(
            firebase_uid=firebase_uid,
            email=f"{firebase_uid}@example.com" if "@" not in firebase_uid else firebase_uid,
            display_name=f"User ({firebase_uid})",
            profession="Productivity Analyst"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user
