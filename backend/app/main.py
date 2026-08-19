"""
app/main.py

Main FastAPI application entry point for AI Goal Journal & Accountability Coach.
Configures middleware, centralized exception handlers, database tables, and API routers.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.database.connection import engine, Base
from app.core.exceptions import AppException
from app.core.exception_handlers import (
    app_exception_handler,
    custom_http_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler
)

# Import models so SQLAlchemy registers all relationships
from app.models.user import User
from app.models.journal import Journal
from app.models.goal import Goal
from app.models.progress import Progress
from app.models.ai_summary import AISummary

# Import API routers
from app.api.v1.users import router as users_router
from app.api.v1.goals import router as goals_router
from app.api.v1.journals import router as journals_router
from app.api.v1.progress import router as progress_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

tags_metadata = [
    {
        "name": "Users",
        "description": "User profile management, Firebase UID sync, and user preferences."
    },
    {
        "name": "Journals",
        "description": "CRUD operations for daily voice and text journal entries."
    },
    {
        "name": "Goals",
        "description": "Goal tracking, goal status updates (Active, Completed, Stalled), and goal deletion."
    },
    {
        "name": "Progress",
        "description": "Goal progress updates, quantitative progress logging, and activity timelines."
    }
]

app = FastAPI(
    title="AI Goal Journal API",
    description=(
        "AI-powered personal productivity platform that converts daily voice or text journal entries "
        "into structured goals, progress tracking, blocker detection, and personalized coaching summaries."
    ),
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Register CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Centralized Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(HTTPException, custom_http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)


@app.get("/", tags=["Health Check"], summary="Root Health Check", description="Returns health status message of the API backend.")
def root():
    return {
        "message": "AI Goal Journal Backend Running",
        "status": "online",
        "version": "1.0.0"
    }


# Include API v1 routers
app.include_router(users_router, prefix="/api/v1")
app.include_router(goals_router, prefix="/api/v1")
app.include_router(journals_router, prefix="/api/v1")
app.include_router(progress_router, prefix="/api/v1")