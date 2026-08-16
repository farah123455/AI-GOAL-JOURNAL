from datetime import datetime

from pydantic import BaseModel, ConfigDict


class GoalCreate(BaseModel):
    title: str
    description: str | None = None
    status: str = "active"


class GoalUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None


class GoalResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)