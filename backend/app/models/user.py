"""
app/models/user.py

SQLAlchemy ORM model for User Management, Firebase UID mapping, and hashed passwords.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)  # Encrypted password column (bcrypt)
    display_name = Column(String(255), nullable=True)
    profession = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    timezone = Column(String(100), default="UTC")

    # Store user preferences & settings (theme, daily_reminder_time, ai_coaching_tone, focus_areas, notifications)
    preferences = Column(
        JSON,
        default=lambda: {
            "theme": "dark",
            "daily_reminder_time": "20:00",
            "ai_coaching_tone": "encouraging",
            "focus_areas": ["Productivity", "Study", "Personal Growth"],
            "email_notifications": True,
            "push_notifications": True
        }
    )

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    journals = relationship("Journal", back_populates="user")
    goals = relationship("Goal", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, firebase_uid='{self.firebase_uid}', email='{self.email}')>"