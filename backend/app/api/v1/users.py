from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import create_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/health")
def health():
    return {"status": "users router working"}


@router.post("/sync", response_model=UserResponse)
def sync_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user(user, db)