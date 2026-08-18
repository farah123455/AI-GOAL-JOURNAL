from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class JournalCreate(BaseModel):
    user_id: Optional[int] = None
    title: Optional[str] = None
    content: str


class JournalUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class JournalResponse(BaseModel):
    id: int
    user_id: int
    title: Optional[str] = None
    content: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)