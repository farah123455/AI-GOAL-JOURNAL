## System Architecture

The application follows a **modular layered architecture** consisting of a **React frontend**, **Firebase Authentication**, a **FastAPI backend**, a **Google Gemini AI processing service**, and a **PostgreSQL database**.

### Architecture Diagram

![AI Goal Journal Architecture](../architecture-diagram.png)

### Architecture Overview

```text
Client / Frontend
        ↓
Firebase Authentication
        ↓
FastAPI Backend
        ├── API Layer
        ├── Authentication & Authorization
        ├── Validation Layer
        ├── Service Layer
        └── Data Access Layer
        ↓
Google Gemini AI Processing Service
        ↓
PostgreSQL Database
```

### Backend Layers

* **API Layer:** Exposes REST endpoints such as `/users`, `/journals`, `/goals`, `/progress`, `/summaries`, `/timeline`, and `/ai/extract`.
* **Auth & Authorization:** Verifies Firebase ID tokens, extracts the Firebase UID, and authorizes access to user-specific data.
* **Validation Layer:** Uses **Pydantic schemas** for request validation and structured error handling.
* **Service Layer:** Contains business logic for users, journals, goals, progress tracking, summaries, timeline activities, and AI processing.
* **Data Access Layer:** Uses **SQLAlchemy ORM** and database models for interaction with PostgreSQL.

### AI Processing Workflow

```text
User Journal Entry (Text / Voice)
        ↓
Speech-to-Text (for voice entries)
        ↓
Gemini API Prompt
        ↓
Goal Extraction
        ↓
Task & Progress Detection
        ↓
Blocker Identification
        ↓
Structured JSON Response
        ↓
PostgreSQL Storage
```

### Data Flow Summary

1. User authenticates through **Firebase Authentication**.
2. The frontend receives a **Firebase ID Token**.
3. The token is sent with API requests to **FastAPI**.
4. FastAPI verifies the token and extracts the **Firebase UID**.
5. Journal content is processed by the **Gemini AI service**.
6. Gemini returns structured insights containing goals, completed activities, blockers, and progress information.
7. The backend stores journals and AI-generated insights in **PostgreSQL**.
8. The frontend retrieves the processed data and displays it through the dashboard, goals, progress tracking, weekly summaries, and analytics views.

### AI Processing Responsibilities

The Gemini AI service is responsible for:

* extracting goals from journal entries,
* identifying completed tasks and activities,
* detecting blockers and recurring challenges,
* estimating progress trends,
* generating personalized insights,
* producing weekly and periodic summaries.

### Cross-Cutting Concerns

* **Security:** Firebase ID Token / `X-Firebase-UID` verification, HTTPS communication, and user-level authorization scoping across all data entities.
* **Validation:** Pydantic V2 validation and structured exception handling.
* **Logging:** Request logs, error logs, and debugging support.
* **Configuration:** Environment-variable-based configuration and `.env` management.
* **Scalability:** Modular layered architecture that decouples API routers, service layers, SQLAlchemy models, and Pydantic schemas.

---

## API Endpoints Reference

All protected endpoints require either `Authorization: Bearer <token_or_uid>` or `X-Firebase-UID: <uid>` header.

### User API (`/api/v1/users`)
- `GET /api/v1/users/health` — Health check endpoint (Public)
- `POST /api/v1/users/sync` — Sync Firebase user identity to PostgreSQL DB
- `GET /api/v1/users/me` — Retrieve current authenticated user profile
- `PUT /api/v1/users/me` — Update user profile information
- `PUT /api/v1/users/me/preferences` — Update user settings & preferences

### Journal API (`/api/v1/journals`)
- `POST /api/v1/journals/` — Create new journal entry (auto-scoped to current user)
- `GET /api/v1/journals/` — List all journal entries owned by current user
- `GET /api/v1/journals/{journal_id}` — Get single journal entry owned by current user
- `PUT /api/v1/journals/{journal_id}` — Update journal entry owned by current user
- `DELETE /api/v1/journals/{journal_id}` — Delete journal entry owned by current user

### Goal API (`/api/v1/goals`)
- `POST /api/v1/goals/` — Create new goal for current user
- `GET /api/v1/goals/` — List all goals owned by current user
- `GET /api/v1/goals/{goal_id}` — Get single goal owned by current user
- `PUT /api/v1/goals/{goal_id}` — Update goal owned by current user
- `DELETE /api/v1/goals/{goal_id}` — Delete goal owned by current user

### Progress API (`/api/v1/progress`)
- `POST /api/v1/progress/` — Record progress entry for user's goal
- `GET /api/v1/progress/` — List all progress entries for current user (optional `?goal_id=<id>`)
- `GET /api/v1/progress/{progress_id}` — Get single progress record owned by current user
- `PUT /api/v1/progress/{progress_id}` — Update progress record owned by current user
- `DELETE /api/v1/progress/{progress_id}` — Delete progress record owned by current user

