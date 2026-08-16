from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


class UserCreate(BaseModel):
    firebase_uid: str
    email: EmailStr
    display_name: str | None = None
    profession: str | None = None


class UserResponse(UserCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)