"""
app/main.py

AI Goal Journal & Accountability Coach - FastAPI Main Application Entry Point.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.users import router as users_router
from app.db.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager to initialize database tables on startup.
    """
    init_db()
    yield

app = FastAPI(
    title="AI Goal Journal API",
    description="Backend API for AI Goal Journal & Accountability Coach",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local development & frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production origin URLs if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "AI Goal Journal Backend Running",
        "status": "active",
        "documentation": "/docs"
    }

# Include v1 Routers
app.include_router(users_router, prefix="/api/v1")