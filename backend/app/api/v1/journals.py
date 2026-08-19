"""
app/api/v1/journals.py

REST API endpoints for Journal management (Create, Read, Update, Delete).
Scoped to the authenticated user.
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.journal import (
    JournalCreate,
    JournalUpdate,
    JournalResponse
)
from app.schemas.common import MessageResponse, ErrorResponse
from app.services.journal_service import (
    create_journal,
    get_user_journals,
    get_journal_by_id,
    update_journal,
    delete_journal
)

router = APIRouter(prefix="/journals", tags=["Journals"])


@router.post(
    "/",
    response_model=JournalResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Journal Entry",
    description="Creates a new daily voice or text journal entry for the authenticated user."
)
def create_new_journal(
    journal: JournalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new journal entry."""
    return create_journal(current_user.id, journal, db)


@router.get(
    "/",
    response_model=List[JournalResponse],
    summary="List User Journal Entries",
    description="Retrieves all journal entries belonging to the authenticated user, ordered by creation date descending."
)
def read_journals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lists user's journal entries."""
    return get_user_journals(current_user.id, db)


@router.get(
    "/{journal_id}",
    response_model=JournalResponse,
    responses={404: {"model": ErrorResponse, "description": "Journal entry not found"}},
    summary="Get Single Journal Entry",
    description="Retrieves a specific journal entry by ID."
)
def read_journal(
    journal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves a single journal entry by ID."""
    return get_journal_by_id(journal_id, current_user.id, db)


@router.put(
    "/{journal_id}",
    response_model=JournalResponse,
    responses={404: {"model": ErrorResponse, "description": "Journal entry not found"}},
    summary="Update Journal Entry",
    description="Updates the title or content of an existing journal entry."
)
def update_existing_journal(
    journal_id: int,
    journal_data: JournalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates a journal entry."""
    return update_journal(journal_id, current_user.id, journal_data, db)


@router.delete(
    "/{journal_id}",
    response_model=MessageResponse,
    responses={404: {"model": ErrorResponse, "description": "Journal entry not found"}},
    summary="Delete Journal Entry",
    description="Deletes a journal entry owned by the user."
)
def delete_existing_journal(
    journal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a journal entry by ID."""
    delete_journal(journal_id, current_user.id, db)
    return MessageResponse(message="Journal deleted successfully")