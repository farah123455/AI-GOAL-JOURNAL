# AI Goal Journal & Accountability Coach

<p align="center">
  <strong>Transform natural voice and text reflections into structured milestones, 10-class emotional state detection, interactive conversational coaching, actionable habits, and AI-generated learning roadmaps.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS 3" />
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white" alt="Python 3.10+" />
  <img src="https://img.shields.io/badge/PyTorch-CPU_Inference-EE4C2C?logo=pytorch&logoColor=white" alt="PyTorch" />
  <img src="https://img.shields.io/badge/Groq_Cloud-GPT--OSS--120B-F55036" alt="Groq Cloud" />
  <img src="https://img.shields.io/badge/Google_Gemini-3.1_Flash--Lite-4285F4?logo=google&logoColor=white" alt="Gemini Flash-Lite" />
  <img src="https://img.shields.io/badge/faster--whisper-Tiny_INT8-FF6F00" alt="Faster Whisper" />
  <img src="https://img.shields.io/badge/PostgreSQL-Port_5433-336791?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Security-AES--256--GCM-critical" alt="AES-256-GCM" />
</p>

---

## Overview

Traditional productivity applications require tedious manual bookkeeping: checking boxes, adjusting sliders, and categorizing tasks into rigid spreadsheets.

**AI Goal Journal & Accountability Coach** eliminates tracking friction. Users reflect naturally—either by speaking through their microphone or typing conversationally. The platform combines:
- **On-Device Speech Recognition (`faster-whisper` CPU INT8)**: Local, private, zero-cloud transcription.
- **Custom PyTorch Emotion AI (4-Head Attention BiLSTM)**: Rapid, on-device detection across 10 emotional states with trigger keyword extraction in ~3–5 ms.
- **Interactive Two-Way AI Coach (Groq Cloud API)**: Lightning-fast conversational coaching grounded with active goals, habit streaks, recent reflections, and emotional pulse.
- **Reasoning AI Engine (Google Gemini Flash-Lite)**: Structured extraction of completed activities, future plans, active blockers, and step-by-step goal roadmaps.
- **High-Performance Habit Tracker**: Enriched single-request backend endpoint with 0 ms instant UI rendering.
- **Enterprise-Grade Security**: AES-256-GCM envelope encryption at rest with automated key rotation.
- **Dual-Persistence Architecture**: Dedicated PostgreSQL container with automatic, transparent SQLite fallback.

---

## Core Feature Pillars

### 1. 🎙️ Dual Voice & Text Conversational Journaling
- **Edge Speech Recognition**: Embedded `faster-whisper` (Tiny model, INT8 quantized on CPU) provides low-latency, zero-cost audio transcription directly on your local system without transmitting raw audio to third parties.
- **Ephemeral Audio Lifecycle**: Uploaded audio is transcribed in temporary memory and wiped immediately after processing.
- **In-Place AI Synthesis**: Smooth transition from entry drafting to structured extraction, highlighting achievements, future tasks, friction points, and emotional pulse.

### 2. 🧠 Custom 10-Class PyTorch Mood & Emotional State Analyzer
- **4-Head Attention BiLSTM Architecture**: Custom-trained neural network classifying reflections into 10 nuanced emotional classes: `accomplishment`, `motivation`, `focus`, `gratitude`, `breakthrough`, `burnout`, `overwhelmed`, `frustration`, `guilt`, and `neutral`.
- **4 GB RAM PC Optimized**: Lightweight CPU inference consuming only **~30 MB RAM** with **~3–5 ms latency** per journal entry.
- **Trigger Keyword Extraction**: Automatically isolates the specific phrases responsible for the detected emotion.
- **Calm Moss Badges**: Distinct visual indicators mapped across the UI (Journal, Dashboard, and Coach).

### 3. 💬 Interactive Two-Way Conversational AI Coach
- **Groq Cloud Speed**: Powered by `openai/gpt-oss-120b` (with automatic fallback to `qwen/qwen3.8-27b` and `openai/gpt-oss-20b`) for ultra-low latency conversational interaction.
- **Full Context Grounding**: The AI Coach inspects active goals, habit streaks, recent journal reflections, and the user's emotional rhythm to provide personalized, non-generic advice.
- **Quick-Prompt Suggestions**: One-click prompt pills for instant accountability check-ins (*"How am I doing on my goals this week?"*, *"I'm feeling stuck on a blocker"*, *"Review my habit consistency"*).
- **On-Demand Weekly Synthesis**: Deep-dive weekly progress reports generated on demand.

### 4. 🗺️ AI-Powered Goal Roadmaps & Structured Milestones
- **Sequential Learning Roadmaps**: Gemini transforms any accepted goal into 4–8 sequential milestones with clear task titles, descriptions, logical sequences, and realistic durations.
- **Milestone Persistence**: Milestone completions are stored at the database level and persist seamlessly across page refreshes.
- **Bidirectional Progress Sync**: Completing roadmap milestones automatically synchronizes the parent goal's progress value (up to 100% upon completion).
- **Offline Rule Fallback**: Built-in intelligent fallback for offline or zero-key environments (Python, Frontend, and General curricula).

### 5. ⚡ High-Performance Habit Tracker & Streaks
- **Zero Latency (0 ms) Render**: Enriched `GET /api/v1/habits` calculates `completed_today`, `current_streak`, and `recent_logs` in a single SQL query, completely eliminating $N+1$ request waterfalls.
- **Optimistic Caching**: React `DataContext` caches habit states for instantaneous page navigation and responsive check-offs.
- **Monday–Sunday Grid Sequence**: Track daily routines with formatted ordinal dates (e.g. `21st`) and week navigation (`<`, `>`).

### 6. 🌟 Positive Reinforcement & Celebrations
- **Grounding in Behavioral Science**: Built on the Progress Principle (Amabile & Kramer) and Self-Determination Theory to foster genuine intrinsic motivation.
- **Four-Tier Reinforcement Hierarchy**:
  - **Tier 1 (Micro-Momentum)**: Instant affirmative acknowledgment on task check-off.
  - **Tier 2 (Progress Velocity)**: Velocity milestone alerts at 25%, 50%, and 75% thresholds.
  - **Tier 3 (Milestone Mastery)**: Accomplishment cards for completed milestone sections.
  - **Tier 4 (Epic Completion)**: Dual-cannon Canvas Confetti celebration and trophy badges upon reaching 100%.

### 7. 📈 Configurable Progress Analytics & Trend Visualization
- **User-Selectable Periods**: Analyze progress velocity across **Last 7 days**, **Last 30 days**, **Last 90 days**, or **All time**.
- **Accurate Metric Calculations**:
  - **Average Progress Change**: True average of progress deltas between consecutive updates.
  - **Stagnant Updates**: Exact tally of updates where no progress change occurred.
  - **Period Progress Gain**: Net progress delta within the chosen time window.
- **Responsive SVG Trend Chart**: Smooth SVG line chart displaying historical progress curves.

### 8. 🎯 Smart Goal Management & "Focus Next" Intelligence
- **Deterministic Alignment**: Extracted activities are token-matched against active goals to prevent duplicate milestones.
- **Dynamic Prioritization**: Automated classification into **High**, **Medium**, or **Low** priority based on deadline proximity and progress velocity.
- **"Focus Next" Recommendations**: Identifies the highest-leverage goal to tackle next with contextual rationale.

### 9. 🛡️ Enterprise-Grade Security & Field-Level Encryption
- **AES-256-GCM Envelope Encryption**: Sensitive journal content and coaching suggestions are stored as authenticated envelopes (`enc:v1:...`).
- **Zero-Knowledge AI in RAM**: Plaintext is held transiently in process memory only during model execution and never written unencrypted to disk.
- **Automated Data Migration**: CLI (`migrate_existing_data.py`) supporting dry-run inspection and live migration.
- **Zero-Downtime Key Rotation**: Dedicated `KeyRotationManager` enabling key rotation with multi-key backward compatibility.

### 10. 🐳 Dual-Persistence Architecture
- **PostgreSQL Primary**: Dedicated container `ai_goal_journal_db` mapped to port `5433:5432` to avoid collisions with other local containers.
- **Automatic SQLite Fallback**: Seamless, transparent fallback to local SQLite (`sqlite:///./app.db`) whenever Docker is closed or unreachable.

---

## Technology Stack

| Domain | Technology | Configuration / Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | `18.3.1` | Declarative reactive user interface |
| **Build Tool** | Vite | `5.4.21` | Fast HMR dev server & production bundler |
| **Styling** | Tailwind CSS | `3.4.4` | Custom Calm Moss aesthetic (`paper`, `ink`, `moss`, `ember`) |
| **Visuals & Motion** | Lucide React / Canvas Confetti / Anime.js | Latest | Accessible icons and celebratory feedback |
| **Backend** | FastAPI | `0.110+` | High-performance asynchronous Python REST API |
| **Server** | Uvicorn | `0.28+` | Production ASGI web server |
| **Validation** | Pydantic | `v2` | Strict request/response schemas and serialization |
| **Auth** | Firebase Authentication | Client SDK v10 + Server JWT | Secure user identity and token verification |
| **Speech-to-Text** | `faster-whisper` | Tiny, INT8, CPU | On-device speech-to-text with zero cloud cost |
| **Custom Emotion AI** | PyTorch BiLSTM + Attention | CPU Inference (~30 MB RAM) | 10-Class mood analysis and trigger keyword extraction |
| **Conversational Coach** | Groq Cloud API | `openai/gpt-oss-120b` | Low-latency context-grounded accountability coaching |
| **Reasoning AI Engine** | Google Gemini API | `gemini-3.1-flash-lite` | Structured activity, goal, and roadmap generation |
| **Encryption** | `cryptography` | AES-256-GCM | Authenticated field-level encryption at rest |
| **Primary Database** | PostgreSQL | Docker container (Port 5433) | Robust relational persistence |
| **Fallback Database** | SQLite | `sqlite:///./app.db` | Transparent local persistence if Docker is offline |

---

## Project Structure

```text
AI-GOAL-JOURNAL/
├── public/                       # Static public assets, logos, and icons
├── docs/                         # Architecture and research documentation
│   ├── POSITIVE_REINFORCEMENT_SPEC.md # Positive reinforcement & validation spec
│   ├── COST_ANALYSIS.md          # Token economics & local compute efficiency
│   ├── PRODUCTIVITY_SCORE_SPEC.md# Deterministic productivity scoring spec
│   ├── KEY_ROTATION_STRATEGY.md  # Multi-key crypto rotation lifecycle
│   ├── ENCRYPTION_PRIVACY_RESEARCH.md # AES-256-GCM privacy standards
│   └── deployment_costs.md       # Production hosting & scale analysis
├── models/                       # Custom Machine Learning Models
│   └── mood_analyzer/            # 10-Class Attention BiLSTM Mood Analyzer
│       ├── weights/              # emotion_model.pth, vocabulary.json, label_mapping.json
│       ├── model/                # architecture.py, tokenizer.py, dataset.py
│       ├── training/             # training scripts, datasets, and Jupyter notebook
│       └── inference.py          # Standalone CPU test inference harness
├── src/                          # React Single Page Application (SPA)
│   ├── components/               # Reusable UI components:
│   │   ├── MoodBadge.jsx         # 10-Class Calm Moss emotion badge
│   │   ├── Roadmap.jsx           # Interactive visual roadmap component
│   │   ├── RoadmapCelebration.jsx# 4-tier positive reinforcement card
│   │   ├── TrendChart.jsx        # Responsive SVG progress trend chart
│   │   ├── GoalCalendar.jsx      # Interactive deadline & activity calendar
│   │   ├── GoalCelebration.jsx   # High-density Canvas Confetti celebration
│   │   ├── Sidebar.jsx           # Collapsible navigation rail
│   │   └── VoiceRecorder.jsx     # On-device audio recorder widget
│   ├── context/                  # AuthContext, DataContext (with habits caching), ModalContext
│   ├── pages/                    # Views:
│   │   ├── Dashboard.jsx         # Momentum metrics, Mood Rhythm card, Progress Trend
│   │   ├── Journal.jsx           # Dual text/voice journaling & in-place emotion analysis
│   │   ├── AiCoach.jsx           # Interactive 2-way Groq chat & weekly synthesis
│   │   ├── Goals.jsx             # Smart goal management & priority filters
│   │   ├── Roadmap.jsx           # Dedicated Goal AI Roadmap page
│   │   ├── Habits.jsx            # 0 ms instant habit consistency tracker & streaks
│   │   └── progress.jsx          # Configurable period progress analytics
│   ├── services/                 # API client (api.js, coachApi, roadmapApi.js) & auth wrappers
│   ├── App.jsx                   # React Router route declarations
│   └── index.css                 # Calm Moss theme tokens & animations
├── backend/                      # FastAPI Python Application
│   ├── alembic/                  # Database migrations
│   ├── app/
│   │   ├── api/v1/               # API Endpoints:
│   │   │   ├── journals.py       # Journal CRUD, STT & mood metadata
│   │   │   ├── coach.py          # Two-way conversational AI coach chat
│   │   │   ├── goals.py          # Goal management & roadmap retrieval
│   │   │   ├── roadmap.py        # Dedicated roadmap generation & sample APIs
│   │   │   ├── progress.py       # Historical progress & trend analytics
│   │   │   ├── habits.py         # Enriched single-request habit endpoints
│   │   │   ├── summaries.py      # Weekly AI accountability synthesis
│   │   │   └── productivity.py   # Deterministic Productivity Score (0-100)
│   │   ├── core/                 # Auth verification, AES-256 crypto, settings
│   │   ├── database/             # SQLAlchemy ORM models, dual connection, and auto-migrations
│   │   ├── models/               # Domain models
│   │   ├── repositories/         # In-memory and dual PostgreSQL/SQLite repositories
│   │   ├── schemas/              # Pydantic validation schemas (journal, coach, habit, goal)
│   │   ├── services/             # mood_service, groq_service, gemini_service, whisper_service
│   │   └── main.py               # FastAPI application factory & routes
│   └── tests/                    # Automated pytest test suites:
│       ├── test_mood_and_coach.py# Mood inference & Groq coach tests
│       ├── test_roadmap_api.py   # Roadmap endpoints & milestone completion
│       ├── test_progress_trends.py # Period metrics & delta analytics
│       ├── test_migration.py     # Encryption migration idempotency
│       └── test_unit.py          # Isolation & unit test suite
├── docker-compose.yml            # Dedicated PostgreSQL container on port 5433
├── run.bat                       # One-click Windows development launcher
├── AGENTS.md                     # Universal agent contract & DOX guidelines
├── README.md                     # Project documentation
└── package.json                  # Frontend dependencies and scripts
```

---

## Quickstart Guide

### Prerequisites
- **Python**: `3.10` or higher
- **Node.js**: `18.0.0` or higher (`npm`)
- **Docker Desktop** (Optional, recommended for PostgreSQL; transparent SQLite fallback active if omitted)
- **Google Gemini API Key**: [Obtain from Google AI Studio](https://aistudio.google.com/)
- **Groq API Key**: [Obtain from Groq Console](https://console.groq.com/)
- **Firebase Project**: [Firebase Console](https://console.firebase.google.com/) with Email/Password Auth enabled

---

### Step 1: Configure Environment Variables

Create `.env` in the root directory (or copy from `.env.example`):

```env
# Google Gemini API (Structured Extraction & Roadmaps)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.1-flash-lite

# Groq Cloud API (Two-Way Conversational AI Coach)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

# Faster-Whisper Speech-to-Text (Local CPU INT8)
WHISPER_MODEL=tiny
WHISPER_DEVICE=cpu
WHISPER_COMPUTE_TYPE=int8

# AES-256-GCM Field Encryption
ENCRYPTION_KEY=ai-goal-journal-default-secret-dev-key-change-in-prod

# Database Configuration (Docker PostgreSQL on port 5433; auto SQLite fallback if down)
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/ai_goal_journal

# Firebase Configuration (Authentication)
FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### Step 2: One-Click Launch (Windows)

Simply double-click or run:
```cmd
run.bat
```
The launcher will automatically:
1. Verify Python 3.10+ and Node.js 18+.
2. Check `.env` configuration.
3. Check and start the dedicated PostgreSQL Docker container (`ai_goal_journal_db` on port 5433) or activate the SQLite fallback.
4. Launch the FastAPI backend on [http://127.0.0.1:8000](http://127.0.0.1:8000).
5. Launch the React Vite frontend on [http://localhost:5173](http://localhost:5173).
6. Open your default web browser automatically.

---

### Step 3: Manual Launch (Alternative)

**Backend**:
```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn app.main:app --app-dir backend --port 8000 --reload
```
- Interactive Swagger API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

**Frontend**:
```bash
npm install
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## Automated Test Suites

The backend includes a comprehensive 66-test suite covering machine learning inference, conversational coaching, cryptography, roadmap generation, and performance:

```bash
# Run full test suite (66 tests passed)
python -m pytest backend/tests/ -v

# Run Mood Analyzer & Groq AI Coach tests
python -m pytest backend/tests/test_mood_and_coach.py -v

# Run Roadmap API & milestone persistence tests
python -m pytest backend/tests/test_roadmap_api.py -v

# Run Progress Analytics & trend calculations
python -m pytest backend/tests/test_progress_trends.py -v

# Run Field Encryption & Key Rotation tests
python -m pytest backend/tests/test_encryption.py -v
```

---

## Design Principles

- **Mindful Calm Moss Palette**: Calm, focused workspaces using earth tones (`paper`, `ink`, `moss`, `ember`, `line`) to minimize anxiety and enhance deep reflection.
- **Privacy by Design**: Sensitive user data is encrypted at rest; audio data is never retained; AI operations use RAM-only plaintext.
- **4 GB RAM PC Friendly**: Local CPU inference uses less than 30 MB RAM; all heavy LLM reasoning is offloaded to high-speed cloud APIs.
- **Reliable Fallbacks**: Docker PostgreSQL automatically falls back to local SQLite; Groq model queries cascade across 3 models; Gemini extracts gracefully degrade.
