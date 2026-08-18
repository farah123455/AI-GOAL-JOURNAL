"""
app/services/journal_service.py

Service layer handling business logic and database access for Journal entries.
Ensures all operations are strictly scoped to the authenticated user.
"""

from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.journal import Journal
from app.schemas.journal import JournalCreate, JournalUpdate


def create_journal(user_id: int, journal_data: JournalCreate, db: Session) -> Journal:
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
    return (
        db.query(Journal)
        .filter(Journal.user_id == user_id)
        .order_by(Journal.created_at.desc())
        .all()
    )


def get_journal_by_id(journal_id: int, user_id: int, db: Session) -> Optional[Journal]:
    return (
        db.query(Journal)
        .filter(
            Journal.id == journal_id,
            Journal.user_id == user_id
        )
        .first()
    )


def update_journal(
    journal_id: int,
    user_id: int,
    journal_data: JournalUpdate,
    db: Session
) -> Optional[Journal]:
    journal = get_journal_by_id(journal_id, user_id, db)
    if not journal:
        return None

    if journal_data.title is not None:
        journal.title = journal_data.title
    if journal_data.content is not None:
        journal.content = journal_data.content

    db.commit()
    db.refresh(journal)
    return journal


def delete_journal(journal_id: int, user_id: int, db: Session) -> bool:
    journal = get_journal_by_id(journal_id, user_id, db)
    if not journal:
        return False

    db.delete(journal)
    db.commit()
    return True
