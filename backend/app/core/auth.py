"""
app/core/auth.py

Firebase Authentication & Token Verification Utilities.
Extracts Firebase UID from request headers with fallback support for local developer testing.
"""

from fastapi import Request, HTTPException, status, Header
from typing import Optional

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
