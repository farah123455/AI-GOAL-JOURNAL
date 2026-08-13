"""
app/schemas/user.py

Pydantic schemas for User Management, Firebase UID Sync, and User Preferences/Settings.
"""

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional, List, Dict, Any

class UserPreferences(BaseModel):
    theme: str = Field(default="dark", description="UI Theme preference ('dark', 'light', 'system')")
    daily_reminder_time: str = Field(default="20:00", description="Preferred daily journal reminder time (HH:MM)")
    ai_coaching_tone: str = Field(default="encouraging", description="AI coaching style ('encouraging', 'direct', 'analytical')")
    focus_areas: List[str] = Field(default_factory=lambda: ["Productivity", "Study", "Personal Growth"])
    email_notifications: bool = Field(default=True, description="Enable email reminders")
    push_notifications: bool = Field(default=True, description="Enable push reminders")

class UserCreate(BaseModel):
    firebase_uid: str
    email: EmailStr
    display_name: Optional[str] = None
    profession: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    timezone: Optional[str] = "UTC"
    preferences: Optional[UserPreferences] = None

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    profession: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    timezone: Optional[str] = None

class UserPreferencesUpdate(BaseModel):
    preferences: UserPreferences

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    firebase_uid: str
    email: str
    display_name: Optional[str] = None
    profession: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    timezone: str = "UTC"
    preferences: Dict[str, Any]
    created_at: datetime
    updated_at: datetime