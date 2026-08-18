# AI Goal Journal Backend Service

FastAPI REST backend for the AI Goal Journal & Accountability Coach platform.

## Architecture

The backend follows a **modular layered architecture**:

```text
backend/app/
├── api/          # Route handlers & endpoint controllers (FastAPI)
├── core/         # Security, authentication dependencies, and configuration
├── database/     # SQLAlchemy engine & session setup
├── models/       # SQLAlchemy ORM database models
├── schemas/      # Pydantic data schemas & request/response validation
├── services/     # Business logic layer (User, Journal, Goal, Progress, Gemini)
├── prompts/      # AI prompt templates
└── main.py       # FastAPI application entry point & CORS configuration
```

## Running the Server Locally

```bash
cd backend
uvicorn app.main:app --reload
```

Swagger UI will be available at: `http://127.0.0.1:8000/docs`

## Running Automated Tests

```bash
cd backend
python -m pytest
```

All 24 automated unit and integration tests cover:
- User management, sync, profile, and preferences
- User-level goal creation, listing, updating, and deleting
- User-isolated journal entry CRUD operations
- Goal progress tracking, goal ownership validation, and filtering
- Gemini structured JSON extraction validation and repair handling
