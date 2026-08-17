from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.journal import Journal
from app.models.user import User
from app.schemas.journal import (
    JournalCreate,
    JournalUpdate,
    JournalResponse
)

router = APIRouter(prefix="/journals", tags=["Journals"])


# CREATE JOURNAL
@router.post("/", response_model=JournalResponse)
def create_journal(
    journal: JournalCreate,
    db: Session = Depends(get_db)
):
    # Check whether the user exists
    user = db.query(User).filter(User.id == journal.user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    new_journal = Journal(
        user_id=journal.user_id,
        title=journal.title,
        content=journal.content
    )

    db.add(new_journal)
    db.commit()
    db.refresh(new_journal)

    return new_journal


# GET ALL JOURNALS
@router.get("/", response_model=list[JournalResponse])
def get_journals(
    db: Session = Depends(get_db)
):
    return db.query(Journal).all()


# GET ONE JOURNAL
@router.get("/{journal_id}", response_model=JournalResponse)
def get_journal(
    journal_id: int,
    db: Session = Depends(get_db)
):
    journal = db.query(Journal).filter(
        Journal.id == journal_id
    ).first()

    if not journal:
        raise HTTPException(
            status_code=404,
            detail="Journal not found"
        )

    return journal


# UPDATE JOURNAL
@router.put("/{journal_id}", response_model=JournalResponse)
def update_journal(
    journal_id: int,
    journal_data: JournalUpdate,
    db: Session = Depends(get_db)
):
    journal = db.query(Journal).filter(
        Journal.id == journal_id
    ).first()

    if not journal:
        raise HTTPException(
            status_code=404,
            detail="Journal not found"
        )

    if journal_data.title is not None:
        journal.title = journal_data.title

    if journal_data.content is not None:
        journal.content = journal_data.content

    db.commit()
    db.refresh(journal)

    return journal


# DELETE JOURNAL
@router.delete("/{journal_id}")
def delete_journal(
    journal_id: int,
    db: Session = Depends(get_db)
):
    journal = db.query(Journal).filter(
        Journal.id == journal_id
    ).first()

    if not journal:
        raise HTTPException(
            status_code=404,
            detail="Journal not found"
        )

    db.delete(journal)
    db.commit()

    return {
        "message": "Journal deleted successfully"
    }