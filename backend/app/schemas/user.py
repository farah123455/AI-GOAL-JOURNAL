from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    firebase_uid: str
    email: EmailStr
    display_name: str | None = None
    profession: str | None = None

class UserResponse(UserCreate):
    pass