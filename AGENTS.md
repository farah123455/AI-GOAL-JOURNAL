# AI Goal Journal & Accountability Coach — AGENTS.md

> **Root Agent Contract & DOX Directory**  
> *Methodology*: DOX (Documentation-as-Context) Hierarchy  
> *Target Environment*: Local MVP (React + Vite + Firebase Auth + FastAPI + faster-whisper Tiny + PyTorch 10-Class Attention BiLSTM Mood Analyzer + Groq Cloud API + Google Gemini Flash-Lite + Dual PostgreSQL/SQLite Persistence + AES-256-GCM Encryption)

---

## 1. Project Overview & Mission

**AI Goal Journal & Accountability Coach** is an intelligent personal reflection, habit consistency, and goal-tracking platform tailored for students, working professionals, freelancers, and entrepreneurs. The application eliminates the friction of manual productivity tracking by using AI to transform conversational text or voice journals into structured activities (completed vs. planned), active blockers, goal progress markers, smart goal prioritization, 10-class emotional state detection, interactive two-way accountability coaching, and weekly AI reflections.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3 (Custom Calm Moss design system), React Router DOM 6, Anime.js, Canvas Confetti.
- **Backend**: FastAPI, Python 3.10+, Uvicorn, Pydantic v2.
- **Authentication**: Firebase Authentication (Client-side modular SDK + Backend Firebase Admin / Google public cert token verification).
- **Speech-to-Text**: `faster-whisper` (Model: `tiny`, Device: `cpu`, Compute: `int8`, lazy singleton).
- **Custom Emotion AI**: PyTorch 10-Class 4-Head Attention BiLSTM (`models/mood_analyzer/weights/emotion_model.pth`, CPU inference, ~30 MB RAM, ~3–5 ms latency).
- **Conversational AI Coach**: Groq Cloud API (`openai/gpt-oss-120b`, fallback `qwen/qwen3.8-27b`, `openai/gpt-oss-20b`) for ultra-low latency context-grounded coaching.
- **Reasoning AI Engine**: Google Gemini API (`gemini-3.1-flash-lite` via `google-genai` SDK) for structured activity, goal, and roadmap generation.
- **Security & Cryptography**: AES-256-GCM field encryption (`cryptography`), plaintext backward compatibility, zero-downtime key rotation.
- **Persistence (Primary)**: PostgreSQL (via dedicated Docker container `ai_goal_journal_db` on port 5433) with SQLAlchemy ORM and Alembic migrations.
- **Persistence (Fallback)**: Automatic, transparent local SQLite fallback (`sqlite:///./app.db`) whenever Docker/PostgreSQL is stopped or unreachable.

---

## 3. Universal Development Rules for AI Agents

1. **DO NOT Install or Clone DOX**: DOX is a documentation methodology based on `AGENTS.md` files. Do NOT install DOX as an npm package, Python dependency, or Git submodule.
2. **Dual-Persistence: PostgreSQL Primary (Docker) with Automatic SQLite Fallback**:
   - **Dedicated Docker Container**: PostgreSQL runs in a dedicated container (`ai_goal_journal_db` mapped to host port `5433:5432`) configured via `docker-compose.yml`, avoiding collisions with other database containers on port 5432.
   - **Automatic Local Fallback**: If Docker Desktop is closed, stopped, or unreachable, `connection.py` automatically and transparently falls back to local SQLite (`sqlite:///./app.db`) with `check_same_thread=False`. The app runs reliably in both environments.
   - **Dynamic Table Initialization**: `init_db()` automatically provisions all ORM tables (`users`, `journals`, `goals`, `progress`, `habits`, `habit_logs`, `ai_summaries`, `roadmaps`) in whichever database is active, and performs schema alterations dynamically.
3. **DO NOT Break or Mock Firebase Authentication**: Preserve `src/firebase.js`, `src/services/authService.js`, and `src/context/AuthContext.jsx`. All protected backend endpoints must authenticate requests using verified Firebase ID tokens (`Authorization: Bearer <token>`). Never trust a client-supplied user ID.
4. **4 GB RAM PC Constraint**:
   - Only `faster-whisper` **Tiny** model with **INT8** quantization on **CPU** is permitted.
   - Lazy-load the Whisper model and PyTorch Mood Analyzer as singletons.
   - The PyTorch mood model runs on **CPU** with tiny memory overhead (~30 MB).
   - All heavy LLM reasoning (Gemini Flash-Lite and Groq conversational coaching) runs **100% in the cloud via remote APIs** with zero local RAM impact.
   - No local GPU, CUDA, or heavy local LLM dependencies.
5. **AI Cost & Usage Rules**:
   - Use `gemini-3.1-flash-lite` via the `google-genai` Python SDK for structured extraction.
   - Use Groq Cloud API for two-way interactive coaching (`openai/gpt-oss-120b`).
   - Keep `GEMINI_API_KEY` and `GROQ_API_KEY` exclusively on the backend in `.env`. Never prefix with `VITE_` or expose to client JavaScript.
   - Target 1 structured extraction call per journal submission. Retries must be explicit and bounded.
   - Weekly AI summaries must be generated on-demand only.
   - Unit tests must NEVER make live Gemini API calls, Groq calls, Firebase network calls, or load the Whisper model.
6. **Field-Level Encryption & Backward Compatibility**:
   - Sensitive user journal entries and coaching summaries are encrypted using AES-256-GCM with the `enc:v1:` prefix.
   - Plaintext records created prior to encryption must be decrypted transparently without errors.
   - AI services must always receive decrypted plaintext.
7. **Preserve User Data on AI Errors**: If an AI provider fails to return valid responses, preserve the raw journal entry in the database and return a clean warning. Never discard user data.
8. **Maintain Calm Moss Aesthetic**: Uphold the tailored Tailwind theme (`paper`, `ink`, `moss`, `ember`, `line`) with `Fraunces` serif headings and `Inter` body text.

---

## 4. Current Implementation Status Matrix

| Component | Status | Details |
| :--- | :--- | :--- |
| **Firebase Auth (Client)** | **Complete** | Registration, Login, Logout (redirects to `/`), Session persistence, Protected Routes. |
| **Firebase Token Verification (Server)** | **Complete** | FastAPI dependency `get_current_user` in `backend/app/core/auth.py`. |
| **Persistence (Dual)** | **Complete** | Dedicated Docker PostgreSQL container (`ai_goal_journal_db` on port 5433) with automatic seamless SQLite fallback (`sqlite:///./app.db`). |
| **Speech-to-Text (faster-whisper)** | **Complete** | Tiny model CPU INT8 lazy singleton; ephemeral audio cleanup; `/voice/transcribe`. |
| **10-Class PyTorch Mood Analyzer** | **Complete** | 4-Head Attention BiLSTM (`models/mood_analyzer/`), CPU inference (~30 MB RAM, ~3–5 ms latency), automatic keyword extraction & confidence scoring. |
| **Two-Way Conversational AI Coach** | **Complete** | Groq Cloud API (`openai/gpt-oss-120b`), rich context grounding (goals, habits, recent journals, emotional pulse), prompt pills, interactive chat. |
| **Habits Tracker & Instant Caching** | **Complete** | Single-request enriched endpoint (`completed_today`, `current_streak`, `recent_logs`), `DataContext` 0 ms cache, optimistic toggles, Monday–Sunday sequence. |
| **AI Journal & In-Place Analysis** | **Complete** | `gemini-3.1-flash-lite` extraction + PyTorch mood detection; in-place emotional pulse card, Calm Moss mood badges, and keyword tags. |
| **Goals Management & Prioritization** | **Complete** | CRUD endpoints, deterministic goal matching, smart priority, auto-sync 100% progress on completion. |
| **Historical Progress & Trend API** | **Complete** | Chronological ordering, deltas (`change_from_previous`), trend direction (`improving`), completed badges. |
| **Progress Analytics Dashboard** | **Complete** | Real-time SVG TrendChart component (`components/TrendChart.jsx`), progress gained, streak analytics, and Mood Rhythm card. |
| **Data Migration Service** | **Complete** | Safe batch migration from legacy plaintext to AES-256-GCM (`app/services/migration_service.py`, `scripts/migrate_existing_data.py`). |
| **Field Encryption & Key Rotation** | **Complete** | AES-256-GCM envelope encryption, backward compatibility, `KeyRotationManager`. |
| **Productivity Score API (0–100)** | **Complete** | Multi-factor deterministic formula mounted at `/api/v1/productivity-score`. |
| **Cost & Deployment Documentation** | **Complete** | Dedicated API token model (`docs/COST_ANALYSIS.md`) and deployment/hosting architecture (`docs/deployment_costs.md`). |
| **Brand Identity & Navigation** | **Complete** | Custom quill & AI chip logo (`public/logo.png`), responsive sidebar spacing, calendar padding. |

---

## 5. Security & Environment Rules

- **Zero Secret Commits**: Never commit `.env` or hardcode secrets in source code, documentation, or tests.
- **Frontend vs. Backend Variables**:
  - Frontend: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
  - Backend: `GEMINI_API_KEY`, `GEMINI_MODEL`, `GROQ_API_KEY`, `GROQ_MODEL`, `WHISPER_MODEL`, `WHISPER_DEVICE`, `WHISPER_COMPUTE_TYPE`, `FIREBASE_PROJECT_ID`, `ENCRYPTION_KEY`, `ENCRYPTION_OLD_KEYS`.
- **Audio Privacy**: Temporary audio uploaded for transcription is written to temporary files and immediately deleted after transcription.

---

## 6. Subtree DOX Directory Index

Before modifying any file in a subtree, agents MUST read the corresponding `AGENTS.md`:

- **Model Assets (`models/mood_analyzer/`)**:
  - [`models/mood_analyzer/README.md`](file:///models/mood_analyzer/README.md) — PyTorch BiLSTM architecture, training methodology, weights, vocabulary, and inference scripts.
- **Documentation Suite (`docs/`)**:
  - [`docs/COST_ANALYSIS.md`](file:///docs/COST_ANALYSIS.md) — Token mathematical models, local hardware consumption, faster-whisper savings, and API guardrails.
  - [`docs/deployment_costs.md`](file:///docs/deployment_costs.md) — Hosting platforms (Vercel, Render, VPS), Docker containerization, scaling tiers, and manual deployment instructions.
  - [`docs/KEY_ROTATION_STRATEGY.md`](file:///docs/KEY_ROTATION_STRATEGY.md) — Dual-key crypto rotation lifecycle and zero-downtime re-encryption.
  - [`docs/PRODUCTIVITY_SCORE_SPEC.md`](file:///docs/PRODUCTIVITY_SCORE_SPEC.md) — Mathematical specification of the deterministic 0–100 productivity score.
  - [`docs/ENCRYPTION_PRIVACY_RESEARCH.md`](file:///docs/ENCRYPTION_PRIVACY_RESEARCH.md) — AES-256-GCM envelope encryption architecture.
- **Frontend Subtrees**:
  - [`src/AGENTS.md`](file:///src/AGENTS.md) — Frontend overview, styling tokens, React standards, pages, and components.
  - [`src/components/AGENTS.md`](file:///src/components/AGENTS.md) — Reusable UI component contracts and accessibility standards.
  - [`src/context/AGENTS.md`](file:///src/context/AGENTS.md) — Auth state context, DataContext, ModalContext.
  - [`src/pages/AGENTS.md`](file:///src/pages/AGENTS.md) — Page routing, views, loading/empty states.
  - [`src/services/AGENTS.md`](file:///src/services/AGENTS.md) — Frontend API client and Firebase auth service wrappers.
- **Backend Subtrees**:
  - [`backend/AGENTS.md`](file:///backend/AGENTS.md) — Backend architecture, environment, and error handling.
  - [`backend/app/AGENTS.md`](file:///backend/app/AGENTS.md) — FastAPI application structure, CORS, and middleware.
  - [`backend/app/api/AGENTS.md`](file:///backend/app/api/AGENTS.md) — API v1 route specifications and status code contracts.
  - [`backend/app/core/AGENTS.md`](file:///backend/app/core/AGENTS.md) — Settings, Auth, AES-256-GCM crypto, Key Rotation.
  - [`backend/app/models/AGENTS.md`](file:///backend/app/models/AGENTS.md) — Internal domain entity representations.
  - [`backend/app/repositories/AGENTS.md`](file:///backend/app/repositories/AGENTS.md) — Dual persistence contracts and migration boundary.
  - [`backend/app/schemas/AGENTS.md`](file:///backend/app/schemas/AGENTS.md) — Pydantic validation schemas.
  - [`backend/app/services/AGENTS.md`](file:///backend/app/services/AGENTS.md) — Business services (Whisper, Gemini, Mood, Groq, Goals, Journals, Progress, Productivity, Coach, Migration).
