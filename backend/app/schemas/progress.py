from datetime import datetime
from pydantic import BaseModel


class ProgressCreate(BaseModel):
    goal_id: int
    progress_value: int
    note: str | None = None


class ProgressUpdate(BaseModel):
    progress_value: int | None = None
    note: str | None = None


class ProgressResponse(BaseModel):
    id: int
    goal_id: int
    progress_value: int
    note: str | None
    created_at: datetime

    class Config:
        from_attributes = True