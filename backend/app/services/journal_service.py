"""
app/services/journal_service.py

Service layer handling business logic and database access for Journal entries.
Ensures all operations are strictly scoped to the authenticated user.
"""

from typing import List
from sqlalchemy.orm import Session

from app.models.journal import Journal
from app.schemas.journal import JournalCreate, JournalUpdate
from app.core.exceptions import ResourceNotFoundException


def create_journal(user_id: int, journal_data: JournalCreate, db: Session) -> Journal:
    """Creates a new journal entry for the authenticated user."""
    new_journal = Journal(
        user_id=user_id,
        title=journal_data.title,
        content=journal_data.content
    )
    db.add(new_journal)
    db.commit()
    db.refresh(new_journal)
    return new_journal


def get_user_journals(user_id: int, db: Session) -> List[Journal]:
    """Retrieves all journals owned by the user, ordered by creation date descending."""
    return (
        db.query(Journal)
        .filter(Journal.user_id == user_id)
        .order_by(Journal.created_at.desc())
        .all()
    )


def get_journal_by_id(journal_id: int, user_id: int, db: Session) -> Journal:
    """Retrieves a specific journal by ID for the user, or raises ResourceNotFoundException."""
    journal = (
        db.query(Journal)
        .filter(
            Journal.id == journal_id,
            Journal.user_id == user_id
        )
        .first()
    )
    if not journal:
        raise ResourceNotFoundException(f"Journal with id {journal_id} not found")
    return journal


def update_journal(
    journal_id: int,
    user_id: int,
    journal_data: JournalUpdate,
    db: Session
) -> Journal:
    """Updates an existing journal entry owned by the user."""
    journal = get_journal_by_id(journal_id, user_id, db)

    if journal_data.title is not None:
        journal.title = journal_data.title
    if journal_data.content is not None:
        journal.content = journal_data.content

    db.commit()
    db.refresh(journal)
    return journal


def delete_journal(journal_id: int, user_id: int, db: Session) -> bool:
    """Deletes a journal entry owned by the user."""
    journal = get_journal_by_id(journal_id, user_id, db)
    db.delete(journal)
    db.commit()
    return True
