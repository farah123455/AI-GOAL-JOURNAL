# postgres.py (PostgreSQL Repository & Database Access Layer)

## 📌 What This File Does
This file is the **dedicated database librarian**. Following the Repository Design Pattern, it isolates all direct SQL and SQLAlchemy queries from the business logic. 

Whenever any service needs to fetch a user, save a journal, look up goals, or update habit streaks, it calls methods in this repository instead of writing raw database queries across the application.

---

## 📥 Where It Gets Data
- Active SQLAlchemy database sessions from `connection.py`.
- Filter parameters like `user_id`, date ranges, goal IDs, and status flags.

---

## ⚙️ Key Operations Handled
1. **User Scoping**:
   - Every single query automatically includes a `WHERE user_id = current_user_id` clause, making cross-user data leakage physically impossible.
2. **Journal Queries**:
   - Creating, fetching by date, paginating history, and soft/hard deletions.
3. **Goal Queries**:
   - Querying active goals, filtering by category, updating progress percentages, and recording calendar event links.
4. **Habit Queries**:
   - Fetching active habit routines, recording daily check-in logs, and recalculating streaks.
5. **Transactional Integrity**:
   - Wraps database operations in commits and rollbacks to guarantee that if a multi-step update fails, the database cleanly resets to its previous valid state.

---

## 📤 Where the Output Goes
- Returns SQLAlchemy model instances or cleanly formatted Python lists to the service layer.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"We follow the Repository Pattern. `postgres.py` centralizes all database queries and transactions. It guarantees strict user-level data isolation on every single query and abstracts the database implementation away from the business services."*
