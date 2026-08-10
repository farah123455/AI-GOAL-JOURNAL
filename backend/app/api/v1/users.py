from fastapi import APIRouter
from app.schemas.user import UserCreate
from app.services.user_service import create_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/health")
def health():
    return {"status": "users router working"}

@router.post("/sync")
def sync_user(user: UserCreate):
    return create_user(user)