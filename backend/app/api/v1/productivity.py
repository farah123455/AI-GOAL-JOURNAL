from fastapi import APIRouter, Depends
from app.core.auth import get_current_user, AuthenticatedUser
from app.schemas.productivity import ProductivityScoreResponse
from app.services.productivity_service import ProductivityScoreService
from app.repositories.in_memory import goal_repo, journal_repo

router = APIRouter(prefix="/productivity-score", tags=["Productivity"])

@router.get("", response_model=ProductivityScoreResponse)
@router.get("/", response_model=ProductivityScoreResponse, include_in_schema=False)
def get_productivity_score(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    goals = goal_repo.get_all_by_user(user_id=current_user.uid)
    recent_journals = journal_repo.get_all_by_user(user_id=current_user.uid)

    return ProductivityScoreService.compute_score(
        goals=goals,
        recent_journals=recent_journals
    )