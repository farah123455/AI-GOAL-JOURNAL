from fastapi import FastAPI

# Import models so SQLAlchemy knows about all relationships
from app.models.user import User
from app.models.journal import Journal
from app.models.goal import Goal
from app.models.progress import Progress
from app.models.ai_summary import AISummary


from app.api.v1.users import router as users_router
from app.api.v1.goals import router as goals_router
from app.api.v1.journals import router as journals_router
from app.api.v1.progress import router as progress_router
app = FastAPI(title="AI Goal Journal API")


@app.get("/")
def root():
    return {"message": "AI Goal Journal Backend Running"}


app.include_router(users_router, prefix="/api/v1")
app.include_router(goals_router, prefix="/api/v1")
app.include_router(journals_router, prefix="/api/v1")
app.include_router(progress_router, prefix="/api/v1")