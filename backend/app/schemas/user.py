from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


class UserCreate(BaseModel):
    firebase_uid: str
    email: EmailStr
    display_name: str | None = None
    profession: str | None = None
    bio: str | None = None
    timezone: str | None = "UTC"
    preferences: dict | None = None


class UserUpdate(BaseModel):
    display_name: str | None = None
    profession: str | None = None
    bio: str | None = None
    timezone: str | None = None


class UserPreferencesUpdate(BaseModel):
    preferences: dict


class UserResponse(BaseModel):
    id: int
    firebase_uid: str
    email: str
    display_name: str | None = None
    profession: str | None = None
    bio: str | None = None
    timezone: str | None = None
    preferences: dict | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)