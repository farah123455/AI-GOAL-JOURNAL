from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.database.connection import Base


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)

    goal_id = Column(
        Integer,
        ForeignKey("goals.id"),
        nullable=False
    )

    progress_value = Column(Integer, nullable=False)

    note = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    goal = relationship(
        "Goal",
        back_populates="progress"
    )