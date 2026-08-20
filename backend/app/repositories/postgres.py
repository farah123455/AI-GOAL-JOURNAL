from datetime import datetime
from typing import Optional

from app.database.connection import SessionLocal
from app.database.orm_models import UserORM, JournalORM, GoalORM
from app.models.domain import User, JournalEntry, Goal
from app.repositories.base import (
    AbstractUserRepository,
    AbstractJournalRepository,
    AbstractGoalRepository,
)

class PostgresUserRepository(AbstractUserRepository):

    def _to_domain(self, row: UserORM) -> User:
        return User(
            firebase_uid=row.firebase_uid,
            email=row.email,
            display_name=row.display_name,
            profession=row.profession,
            created_at=row.created_at,
            # Existing PostgreSQL users table has no updated_at column yet.
            updated_at=row.created_at,
        )

    def get_or_create(
        self,
        uid: str,
        email: str,
        name: Optional[str] = None
    ) -> User:

        db = SessionLocal()

        try:
            user = (
                db.query(UserORM)
                .filter(UserORM.firebase_uid == uid)
                .first()
            )

            if user:
                # Fill missing profile information when Firebase provides it.
                changed = False

                if email and user.email != email:
                    user.email = email
                    changed = True

                if name and not user.display_name:
                    user.display_name = name
                    changed = True

                if changed:
                    db.commit()
                    db.refresh(user)

                return self._to_domain(user)

            user = UserORM(
                firebase_uid=uid,
                email=email,
                display_name=name,
                profession=None,
                created_at=datetime.utcnow(),
            )

            db.add(user)
            db.commit()
            db.refresh(user)

            return self._to_domain(user)

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    def get_by_uid(
        self,
        uid: str
    ) -> Optional[User]:

        db = SessionLocal()

        try:
            user = (
                db.query(UserORM)
                .filter(UserORM.firebase_uid == uid)
                .first()
            )

            if not user:
                return None

            return self._to_domain(user)

        finally:
            db.close()

    def update_profile(
        self,
        uid: str,
        display_name: Optional[str] = None,
        profession: Optional[str] = None
    ) -> Optional[User]:

        db = SessionLocal()

        try:
            user = (
                db.query(UserORM)
                .filter(UserORM.firebase_uid == uid)
                .first()
            )

            if not user:
                return None

            if display_name is not None:
                user.display_name = display_name

            if profession is not None:
                user.profession = profession

            db.commit()
            db.refresh(user)

            return self._to_domain(user)

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()
class PostgresJournalRepository(AbstractJournalRepository):

    def _get_internal_user_id(self, db, firebase_uid: str) -> Optional[int]:
        user = (
            db.query(UserORM)
            .filter(UserORM.firebase_uid == firebase_uid)
            .first()
        )

        return user.id if user else None

    def create(self, journal: JournalEntry) -> JournalEntry:
        db = SessionLocal()

        try:
            internal_user_id = self._get_internal_user_id(
                db,
                journal.user_id
            )

            if internal_user_id is None:
                raise LookupError(
                    "Authenticated Firebase user does not exist in PostgreSQL"
                )

            db_journal = JournalORM(
                user_id=internal_user_id,
                content=journal.content,
                source=journal.source,
                ai_analysis=journal.ai_analysis,
                created_at=journal.created_at,
                updated_at=journal.updated_at,
            )

            db.add(db_journal)
            db.commit()
            db.refresh(db_journal)

            return JournalEntry(
                id=str(db_journal.id),
                user_id=journal.user_id,
                content=db_journal.content,
                source=db_journal.source,
                ai_analysis=db_journal.ai_analysis,
                created_at=db_journal.created_at,
                updated_at=db_journal.updated_at,
            )

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    def get_by_id(
        self,
        user_id: str,
        journal_id: str
    ) -> Optional[JournalEntry]:

        db = SessionLocal()

        try:
            internal_user_id = self._get_internal_user_id(
                db,
                user_id
            )

            if internal_user_id is None:
                return None

            try:
                db_journal_id = int(journal_id)
            except ValueError:
                return None

            db_journal = (
                db.query(JournalORM)
                .filter(
                    JournalORM.id == db_journal_id,
                    JournalORM.user_id == internal_user_id
                )
                .first()
            )

            if not db_journal:
                return None

            return JournalEntry(
                id=str(db_journal.id),
                user_id=user_id,
                content=db_journal.content,
                source=db_journal.source or "text",
                ai_analysis=db_journal.ai_analysis,
                created_at=db_journal.created_at,
                updated_at=db_journal.updated_at,
            )

        finally:
            db.close()

    def get_all_by_user(
        self,
        user_id: str
    ) -> list[JournalEntry]:

        db = SessionLocal()

        try:
            internal_user_id = self._get_internal_user_id(
                db,
                user_id
            )

            if internal_user_id is None:
                return []

            rows = (
                db.query(JournalORM)
                .filter(
                    JournalORM.user_id == internal_user_id
                )
                .order_by(
                    JournalORM.created_at.desc()
                )
                .all()
            )

            return [
                JournalEntry(
                    id=str(row.id),
                    user_id=user_id,
                    content=row.content,
                    source=row.source or "text",
                    ai_analysis=row.ai_analysis,
                    created_at=row.created_at,
                    updated_at=row.updated_at,
                )
                for row in rows
            ]

        finally:
            db.close()

    def update(
        self,
        user_id: str,
        journal_id: str,
        content: str
    ) -> Optional[JournalEntry]:

        db = SessionLocal()

        try:
            internal_user_id = self._get_internal_user_id(
                db,
                user_id
            )

            if internal_user_id is None:
                return None

            try:
                db_journal_id = int(journal_id)
            except ValueError:
                return None

            db_journal = (
                db.query(JournalORM)
                .filter(
                    JournalORM.id == db_journal_id,
                    JournalORM.user_id == internal_user_id
                )
                .first()
            )

            if not db_journal:
                return None

            db_journal.content = content
            db_journal.updated_at = datetime.utcnow()

            db.commit()
            db.refresh(db_journal)

            return JournalEntry(
                id=str(db_journal.id),
                user_id=user_id,
                content=db_journal.content,
                source=db_journal.source or "text",
                ai_analysis=db_journal.ai_analysis,
                created_at=db_journal.created_at,
                updated_at=db_journal.updated_at,
            )

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    def delete(
        self,
        user_id: str,
        journal_id: str
    ) -> bool:

        db = SessionLocal()

        try:
            internal_user_id = self._get_internal_user_id(
                db,
                user_id
            )

            if internal_user_id is None:
                return False

            try:
                db_journal_id = int(journal_id)
            except ValueError:
                return False

            db_journal = (
                db.query(JournalORM)
                .filter(
                    JournalORM.id == db_journal_id,
                    JournalORM.user_id == internal_user_id
                )
                .first()
            )

            if not db_journal:
                return False

            db.delete(db_journal)
            db.commit()

            return True

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

class PostgresGoalRepository(AbstractGoalRepository):

    def _get_internal_user_id(
        self,
        db,
        firebase_uid: str
    ) -> Optional[int]:

        user = (
            db.query(UserORM)
            .filter(UserORM.firebase_uid == firebase_uid)
            .first()
        )

        return user.id if user else None

    def _to_domain(
        self,
        row: GoalORM,
        firebase_uid: str
    ) -> Goal:

        return Goal(
            id=str(row.id),
            user_id=firebase_uid,
            title=row.title,
            description=row.description,
            category=row.category,
            status=row.status,
            target_date=row.target_date,
            created_at=row.created_at,
            updated_at=row.updated_at,
        )

    def create(self, goal: Goal) -> Goal:
        db = SessionLocal()

        try:
            internal_user_id = self._get_internal_user_id(
                db,
                goal.user_id
            )

            if internal_user_id is None:
                raise LookupError(
                    "Authenticated Firebase user does not exist in PostgreSQL"
                )

            db_goal = GoalORM(
                user_id=internal_user_id,
                title=goal.title,
                description=goal.description,
                category=goal.category,
                status=goal.status,
                target_date=goal.target_date,
                created_at=goal.created_at,
                updated_at=goal.updated_at,
            )

            db.add(db_goal)
            db.commit()
            db.refresh(db_goal)

            return self._to_domain(
                db_goal,
                goal.user_id
            )

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    def get_by_id(
        self,
        user_id: str,
        goal_id: str
    ) -> Optional[Goal]:

        db = SessionLocal()

        try:
            internal_user_id = self._get_internal_user_id(
                db,
                user_id
            )

            if internal_user_id is None:
                return None

            try:
                db_goal_id = int(goal_id)
            except ValueError:
                return None

            row = (
                db.query(GoalORM)
                .filter(
                    GoalORM.id == db_goal_id,
                    GoalORM.user_id == internal_user_id
                )
                .first()
            )

            if not row:
                return None

            return self._to_domain(row, user_id)

        finally:
            db.close()

    def get_all_by_user(
        self,
        user_id: str,
        status: Optional[str] = None
    ) -> list[Goal]:

        db = SessionLocal()

        try:
            internal_user_id = self._get_internal_user_id(
                db,
                user_id
            )

            if internal_user_id is None:
                return []

            query = db.query(GoalORM).filter(
                GoalORM.user_id == internal_user_id
            )

            if status:
                query = query.filter(
                    GoalORM.status.ilike(status)
                )

            rows = query.order_by(
                GoalORM.created_at.desc()
            ).all()

            return [
                self._to_domain(row, user_id)
                for row in rows
            ]

        finally:
            db.close()

    def update(
        self,
        user_id: str,
        goal_id: str,
        **kwargs
    ) -> Optional[Goal]:

        db = SessionLocal()

        try:
            internal_user_id = self._get_internal_user_id(
                db,
                user_id
            )

            if internal_user_id is None:
                return None

            try:
                db_goal_id = int(goal_id)
            except ValueError:
                return None

            row = (
                db.query(GoalORM)
                .filter(
                    GoalORM.id == db_goal_id,
                    GoalORM.user_id == internal_user_id
                )
                .first()
            )

            if not row:
                return None

            allowed_fields = {
                "title",
                "description",
                "category",
                "status",
                "target_date",
            }

            for key, value in kwargs.items():
                if key in allowed_fields and value is not None:
                    setattr(row, key, value)

            row.updated_at = datetime.utcnow()

            db.commit()
            db.refresh(row)

            return self._to_domain(row, user_id)

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    def delete(
        self,
        user_id: str,
        goal_id: str
    ) -> bool:

        db = SessionLocal()

        try:
            internal_user_id = self._get_internal_user_id(
                db,
                user_id
            )

            if internal_user_id is None:
                return False

            try:
                db_goal_id = int(goal_id)
            except ValueError:
                return False

            row = (
                db.query(GoalORM)
                .filter(
                    GoalORM.id == db_goal_id,
                    GoalORM.user_id == internal_user_id
                )
                .first()
            )

            if not row:
                return False

            db.delete(row)
            db.commit()

            return True

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()            


user_repo = PostgresUserRepository()
journal_repo = PostgresJournalRepository()
goal_repo = PostgresGoalRepository()