"""
app/db/database.py

SQLAlchemy Database Configuration & Session Management.
Supports PostgreSQL (production) and SQLite (zero-config local dev & testing fallback).
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Default to SQLite in-memory or local file if DATABASE_URL is not set
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./ai_goal_journal.db"
)

# Fix PostgreSQL URI scheme if using postgres:// format (common on Railway/Heroku)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configure SQLite specific args if needed
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    FastAPI dependency to yield a database session per request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Creates all database tables defined in models.
    """
    Base.metadata.create_all(bind=engine)
