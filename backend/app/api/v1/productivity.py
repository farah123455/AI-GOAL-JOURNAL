from fastapi import APIRouter, Depends
from datetime import datetime, timezone, timedelta
from app.schemas.productivity import ProductivityScoreResponse
from app.services.productivity_service import ProductivityScoreService
# Import your repository or DB session and auth dependencies
# from app.repositories.goal_repository import GoalRepository
# from app.repositories.journal_repository import JournalRepository
# from app.dependencies import get_current_user

router = APIRouter(prefix="/productivity-score", tags=["Productivity"])

@router.get("", response_model=ProductivityScoreResponse)
async def get_productivity_score(
    # current_user = Depends(get_current_user),
    # db: AsyncSession = Depends(get_db)
):
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    
    # 1. Fetch user's goals
    # goals = await goal_repo.get_all_by_user(user_id=current_user.id)
    goals = [] 

    # 2. Fetch user's journals from the last 7 days
    # recent_journals = await journal_repo.get_since(user_id=current_user.id, since=seven_days_ago)
    recent_journals = []

    # 3. Compute deterministic score
    return ProductivityScoreService.compute_score(
        goals=goals,
        recent_journals=recent_journals
    )