from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate


def create_user(user: UserCreate, db: Session):
    db_user = User(
        firebase_uid=user.firebase_uid,
        email=user.email,
        display_name=user.display_name,
        profession=user.profession
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

