from app.schemas.user import UserCreate

def create_user(user: UserCreate):
    return {
        "message": "User service ready",
        "user": user.dict()
    }