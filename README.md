# AI Goal Journal & Accountability Coach

An intelligent personal journaling and goal-tracking platform tailored for students, working professionals, freelancers, and entrepreneurs. The application eliminates the manual overhead of traditional productivity tools by using local speech-to-text and AI semantic reasoning to transform daily conversational reflections into structured activities, active blockers, progress indicators, and weekly accountability coaching insights.

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React SPA (Vite)                       │
│  - Public Landing Page (/) & Smart Auth Routing             │
│  - Modular Firebase Auth (Register, Login, Session Context) │
│  - MediaRecorder Voice Capture with Editable Review Screen  │
│  - Calm Moss Design System (Fraunces + Inter Typography)    │
│  - Reactive Dashboard, Goals Board, AI Coach, Journal Page  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Authorization: Bearer <Firebase ID Token>
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                        │
│  - Firebase ID Token Verification via Google Public Certs   │
│  - REST API Routers: /users, /journals, /goals, /summaries  │
│  - Deterministic Business & Goal-Matching Engine            │
│  - Progress Tracking & AI Progress Detection Engine         │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────┐  ┌─────────────────────────────┐
│       faster-whisper        │  │      Google Gemini API      │
│  - Model: tiny (~75 MB)     │  │  - SDK: google-genai        │
│  - Execution: CPU + INT8    │  │  - Model: gemini-3.1-flash-lite
│  - $0.00 Speech-to-Text     │  │  - Structured JSON Output   │
└─────────────────────────────┘  └─────────────────────────────┘
               │                              │
               └──────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│             Repository & Persistence Layer                  │
│  - Thread-Safe In-Memory Stores (Default for Local MVP)     │
│  - Docker PostgreSQL Service (port 5432 via docker-compose) │
│  - Abstract Interfaces (AbstractUserRepository, etc.)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3 (Calm Moss design system), React Router DOM 6.
- **Backend**: FastAPI, Python 3.10+, Uvicorn.
- **Authentication**: Firebase Authentication (Modular client SDK + Backend token verification via Google public X509 certificates).
- **Speech-to-Text**: `faster-whisper` (Model: `tiny`, Device: `cpu`, Compute: `int8`).
- **AI Engine**: Google Gemini API (`gemini-3.1-flash-lite` via `google-genai` Python SDK).
- **Database / Container**: Docker PostgreSQL 15 container (`docker-compose.yml`) + In-memory repository layer for thread-safe local isolation.

---

## 3. Project Specifications & Design Specifications

The project includes technical design specifications located in the root directory:

- [`PROJECT_CONTEXT.md`](file:///d:/MyFiles/AI-GOAL-JOURNAL/PROJECT_CONTEXT.md) — Complete mission, status matrix, and feature roadmap.
- [`PRODUCTIVITY_SCORE_SPEC.md`](file:///d:/MyFiles/AI-GOAL-JOURNAL/PRODUCTIVITY_SCORE_SPEC.md) — Personal Productivity Score (0–100) design specification, formula, weightings, and example calculations.
- [`ENCRYPTION_PRIVACY_RESEARCH.md`](file:///d:/MyFiles/AI-GOAL-JOURNAL/ENCRYPTION_PRIVACY_RESEARCH.md) — Application-layer envelope encryption (AES-256-GCM + Cloud KMS) architecture.
- [`AGENTS.md`](file:///d:/MyFiles/AI-GOAL-JOURNAL/AGENTS.md) — Root agent contract and DOX directory guidelines.

---

## 4. Upcoming Planned Features Roadmap

```text
Goal Progress ────► Habit Tracker ────► Daily Streak System
Goals + target_date ────► Calendar ────► Reminders
Journals + Progress + Activity + Blockers ────► Personal Productivity Score
```

1. **Habit Tracker (Planned)**: Recurring daily/weekly habits and automatic journal-based habit detection.
2. **Daily Streak System (Planned)**: Consecutive active reflection days calculated from goal progress and habit activity.
3. **Goal Calendar + Reminders (Planned)**: Calendar grid displaying `target_date` deadlines and timely notifications.
4. **Personal Productivity Score (Planned)**: Deterministic daily 0–100 index derived from completed activities, goal progress, journal consistency, and blocker penalties.

---

## 5. Prerequisites & Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `3.10+`
- **Docker Desktop** (optional, for PostgreSQL database container)

### 🚀 1-Click Launcher (Windows)

Simply double-click the [`run_project.bat`](file:///d:/MyFiles/AI-GOAL-JOURNAL/run_project.bat) file in the root directory. It will:
1. Start the Docker PostgreSQL container on port 5432 (if Docker is available).
2. Start the FastAPI backend server on `http://localhost:8000`.
3. Start the React Vite dev server on `http://localhost:5173`.
4. Open your default browser automatically.

---

## 6. Manual Setup & Installation

### Step 1: Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure environment credentials in `.env`:

```env
# Frontend Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

# Backend Configuration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.1-flash-lite

# Whisper Configuration
WHISPER_MODEL=tiny
WHISPER_DEVICE=cpu
WHISPER_COMPUTE_TYPE=int8
FIREBASE_PROJECT_ID=your_project_id

# PostgreSQL Database (Docker Postgres)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_goal_journal
```

### Step 2: Install Python & Node Dependencies

```bash
# Python Backend Dependencies
python -m pip install -r backend/requirements.txt

# Node Frontend Dependencies
npm install
```

### Step 3: Start Docker PostgreSQL (Optional)

```bash
docker compose up -d postgres
```

### Step 4: Run Dev Servers

```bash
# Terminal 1: Backend
python -m uvicorn app.main:app --app-dir backend --reload --port 8000

# Terminal 2: Frontend
npm run dev
```

---

## 7. API Reference (`/api/v1/`)

All endpoints (except `/health`) require `Authorization: Bearer <Firebase ID Token>`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health, model status, and runtime info. |
| `GET` | `/api/v1/users/me` | Fetch authenticated user profile and live metrics. |
| `PUT` | `/api/v1/users/me` | Update user display name and profession. |
| `GET` | `/api/v1/goals` | List goals with optional `?status=` filter (Active, Completed, Stalled). |
| `POST` | `/api/v1/goals` | Create a new goal milestone. |
| `GET` | `/api/v1/goals/{id}` | Retrieve specific goal details. |
| `PUT` | `/api/v1/goals/{id}` | Update goal attributes or status. |
| `DELETE` | `/api/v1/goals/{id}` | Delete goal. |
| `POST` | `/api/v1/goals/{id}/progress` | Record 0–100% progress entry for a goal (auto-completes goal at 100%). |
| `GET` | `/api/v1/goals/{id}/progress` | Retrieve progress history log for a goal. |
| `GET` | `/api/v1/journals` | List user journal entries (newest first). |
| `POST` | `/api/v1/journals` | Create journal entry + run Gemini structured analysis & progress detection. |
| `GET` | `/api/v1/journals/{id}` | Retrieve single journal entry with AI breakdown. |
| `PUT` | `/api/v1/journals/{id}` | Update journal content. |
| `DELETE` | `/api/v1/journals/{id}` | Delete journal entry. |
| `POST` | `/api/v1/journals/voice/transcribe`| Upload audio file $\rightarrow$ local faster-whisper Tiny transcript. |
| `GET` | `/api/v1/summaries/weekly` | Get latest weekly AI coaching summary. |
| `POST` | `/api/v1/summaries/weekly` | Generate fresh weekly AI coaching summary. |

---

## 8. Testing & Verification

### Automated Unit Tests

```bash
python -m pytest -v
```

### Integration Verification (Whisper Tiny + Gemini 3.1 Flash-Lite)

```bash
python backend/tests/test_integration.py
```

### Frontend Production Build

```bash
npm run build
```
