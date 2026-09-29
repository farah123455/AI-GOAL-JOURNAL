# connection.py (Database Engine & Session Management)

## 📌 What This File Does
This file manages the **highway connecting the FastAPI backend to the PostgreSQL database**. 

It initializes the SQLAlchemy connection pool, handles automatic reconnection if the network dips, and provides safe database sessions (`get_db`) to API endpoints so every database operation opens cleanly, executes transactions safely, and closes immediately to prevent memory or connection leaks.

---

## 📥 Where It Gets Data
- `settings.DATABASE_URL`: Connection string containing database host, port, username, password, and database name.

---

## ⚙️ How It Works (Step-by-Step)
1. **Engine Creation**: Creates the SQLAlchemy database engine with connection pooling (reusing open connections rather than reconnecting from scratch on every user click).
2. **Session Factory (`SessionLocal`)**: Sets up a factory that produces fresh, isolated database sessions.
3. **Dependency Injection (`get_db`)**:
   - Uses FastAPI's `Depends(get_db)` pattern.
   - When a user makes a request (e.g. saving a journal), a database session is handed to the endpoint.
   - Once the request completes, the `finally` block automatically closes the session and returns the connection back to the pool.
4. **Fallback Handling**: Gracefully handles testing and local development modes (such as SQLite fallback during isolated unit testing).

---

## 📤 Where the Output Goes
- Supplies active database sessions to all repository and service layers.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This file configures our SQLAlchemy database engine and connection pool for PostgreSQL. It implements the standard FastAPI dependency injection pattern (`get_db`) with automatic session cleanup to prevent database connection exhaustion."*
