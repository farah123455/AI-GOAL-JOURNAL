from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.database.connection import Base


class AISummary(Base):
    __tablename__ = "ai_summaries"

    id = Column(Integer, primary_key=True, index=True)

    journal_id = Column(
        Integer,
        ForeignKey("journals.id"),
        nullable=False
    )

    summary = Column(Text, nullable=True)
    insights = Column(Text, nullable=True)
    blockers = Column(Text, nullable=True)
    activities = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    journal = relationship(
        "Journal",
        back_populates="ai_summaries"
    )