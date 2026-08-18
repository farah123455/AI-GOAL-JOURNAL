from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.journal import (
    JournalCreate,
    JournalUpdate,
    JournalResponse
)
from app.services.journal_service import (
    create_journal,
    get_user_journals,
    get_journal_by_id,
    update_journal,
    delete_journal
)

router = APIRouter(prefix="/journals", tags=["Journals"])


# CREATE JOURNAL
@router.post("/", response_model=JournalResponse, status_code=status.HTTP_201_CREATED)
def create_new_journal(
    journal: JournalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_journal(current_user.id, journal, db)


# GET ALL JOURNALS FOR AUTHENTICATED USER
@router.get("/", response_model=list[JournalResponse])
def read_journals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_journals(current_user.id, db)


# GET ONE JOURNAL
@router.get("/{journal_id}", response_model=JournalResponse)
def read_journal(
    journal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    journal = get_journal_by_id(journal_id, current_user.id, db)

    if not journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal not found"
        )

    return journal


# UPDATE JOURNAL
@router.put("/{journal_id}", response_model=JournalResponse)
def update_existing_journal(
    journal_id: int,
    journal_data: JournalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated_journal = update_journal(
        journal_id,
        current_user.id,
        journal_data,
        db
    )

    if not updated_journal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal not found"
        )

    return updated_journal


# DELETE JOURNAL
@router.delete("/{journal_id}")
def delete_existing_journal(
    journal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deleted = delete_journal(
        journal_id,
        current_user.id,
        db
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal not found"
        )

    return {
        "message": "Journal deleted successfully"
    }