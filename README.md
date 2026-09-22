# AI Goal Journal & Accountability Coach

<p align="center">
  <strong>Transform natural voice and text reflections into structured milestones, actionable habits, AI-generated learning roadmaps, and automated accountability coaching.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS 3" />
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white" alt="Python 3.10+" />
  <img src="https://img.shields.io/badge/Google_Gemini-3.1_Flash--Lite-4285F4?logo=google&logoColor=white" alt="Gemini Flash-Lite" />
  <img src="https://img.shields.io/badge/faster--whisper-Tiny_INT8-FF6F00" alt="Faster Whisper" />
  <img src="https://img.shields.io/badge/Security-AES--256--GCM-critical" alt="AES-256-GCM" />
</p>

---

## Overview

Traditional productivity applications require tedious manual bookkeeping: checking boxes, adjusting sliders, and categorizing tasks into rigid spreadsheets.

**AI Goal Journal & Accountability Coach** eliminates tracking friction. Users reflect naturally—either by speaking through their microphone or typing conversationally. The platform leverages private on-device speech-to-text (`faster-whisper` CPU INT8) and Google Gemini structured reasoning to extract completed activities, future plans, active blockers, sentiment trends, and milestone progress. It automatically aligns your daily narrative with long-term goals, breaks down accepted goals into structured step-by-step AI roadmaps, calculates progress velocity, prioritizes deadlines, and delivers context-aware positive reinforcement.

All sensitive personal reflections and coaching records are cryptographically protected at rest using authenticated **AES-256-GCM** envelope encryption with automated zero-downtime key rotation.

---

## Core Feature Pillars

### 1. 🎙️ Dual Voice & Text Conversational Journaling
- **Edge Speech Recognition**: Embedded `faster-whisper` (Tiny model, INT8 quantized on CPU) provides low-latency, zero-cost audio transcription directly on your local system without transmitting raw audio to third parties.
- **Ephemeral Audio Lifecycle**: Uploaded audio is transcribed in temporary memory and wiped immediately after processing.
- **In-Place AI Synthesis**: Smooth transition from entry drafting to structured extraction, summarizing mood, achievements, future tasks, and friction points.

### 2. 🗺️ AI-Powered Goal Roadmaps & Structured Milestones
- **Sequential Learning Roadmaps**: Gemini transforms any accepted goal into 4–8 sequential milestones with clear task titles, descriptions, logical learning sequences, and realistic durations.
- **Milestone Persistence**: Milestone completions are stored at the database level and persist seamlessly across page refreshes.
- **Bidirectional Progress Sync**: Completing roadmap milestones automatically synchronizes the parent goal's progress value (up to 100% upon completion).
- **Rule-Based Fallback**: Built-in intelligent fallback for offline or zero-key environments (e.g., Python, Frontend, and General curricula).

### 3. 🌟 User Validation & Positive Reinforcement System
- **Grounding in Behavioral Science**: Built on the Progress Principle (Amabile & Kramer) and Self-Determination Theory to foster genuine intrinsic motivation.
- **Four-Tier Reinforcement Hierarchy**:
  - **Tier 1 (Micro-Momentum)**: Instant affirmative acknowledgment on task check-off with updated progress percentages.
  - **Tier 2 (Progress Velocity)**: Velocity milestone alerts at 25%, 50%, and 75% thresholds celebrating consistency.
  - **Tier 3 (Milestone Mastery)**: Dedicated accomplishment cards for completed milestone sections with coach recommendations.
  - **Tier 4 (Epic Completion)**: Dual-cannon Canvas Confetti celebration, trophy badges, and full completion recaps upon reaching 100%.
- **Anti-Fatigue Guardrails**: Idempotent state tracking ensures page reloads never re-trigger historic celebratory bursts.

### 4. 📈 Configurable Progress Analytics & Trend Visualization
- **User-Selectable Analytics Periods**: Analyze progress velocity across **Last 7 days**, **Last 30 days**, **Last 90 days**, or **All time**.
- **Accurate Metric Calculations**:
  - **Average Progress Change**: True average of progress deltas between consecutive updates.
  - **Stagnant Updates**: Exact tally of updates where no progress change occurred.
  - **Period Progress Gain**: Net progress delta within the chosen time window compared to pre-period baseline.
- **Responsive SVG Trend Chart**: Smooth SVG line chart displaying historical progress curves and date points.

### 5. 🎯 Smart Goal Management & "Focus Next" Intelligence
- **Deterministic Alignment**: Extracted activities are token-matched against active goals to prevent duplicate milestones and ensure accurate tracking.
- **Dynamic Prioritization**: Automated classification into **High**, **Medium**, or **Low** priority based on deadline proximity, current percentage, and stalled states.
- **"Focus Next" Recommendations**: Recommends the highest-leverage goal to tackle next with contextual rationale and a clear action item.

### 6. 📅 Habit Consistency Tracker & Streaks
- **Monday–Sunday Grid Sequence**: Track daily routines with formatted ordinal dates (e.g. `21st`).
- **Streak Calculation**: Continuous daily streak momentum tracking with optimistic instant check-offs.
- **Today-Only Enforcement**: Guardrails enforcing realistic habit completion for the active date.

### 7. 🛡️ Enterprise-Grade Security & Field-Level Encryption
- **AES-256-GCM Envelope Encryption**: Sensitive journal content and coaching suggestions are stored as authenticated envelopes (`enc:v1:...`).
- **Zero-Knowledge AI in RAM**: Plaintext is held transiently in process memory only during model execution and never written unencrypted to disk.
- **Automated Data Migration**: CLI (`migrate_existing_data.py`) supporting dry-run inspection and live migration.
- **Zero-Downtime Key Rotation**: Dedicated `KeyRotationManager` enabling key rotation with multi-key backward compatibility.

---

## Technology Stack

| Domain | Technology | Configuration / Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | `18.2.0` | Declarative reactive user interface |
| **Build Tool** | Vite | `5.0.0` | HMR development server with backend API proxy |
| **Styling** | Tailwind CSS | `3.4.0` | Calm Moss aesthetic (`paper`, `ink`, `moss`, `ember`) |
| **Visuals & Motion** | Lucide React / Canvas Confetti | Latest | Accessible icons and celebratory visual feedback |
| **Backend** | FastAPI | `0.110+` | High-performance asynchronous Python REST API |
| **Server** | Uvicorn | `0.28+` | Production ASGI web server |
| **Validation** | Pydantic | `v2` | Strict request/response schemas and serialization |
| **Auth** | Firebase Authentication | Client SDK v10 + Server JWT | Secure user identity and token verification |
| **Speech-to-Text** | `faster-whisper` | Tiny, INT8, CPU | On-device transcription with zero cloud API latency/cost |
| **AI Engine** | Google Gemini API | `gemini-3.1-flash-lite` | Structured activity, goal, and roadmap generation |
| **Encryption** | `cryptography` | AES-256-GCM | Authenticated field-level encryption at rest |
| **Persistence** | In-Memory / SQLAlchemy | Thread-safe isolated stores | RAM storage for local MVP, prepared for PostgreSQL |

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
│   ├── deployment_costs.md       # Production hosting & scale analysis
│   └── sampleRoadmap.json        # Reference Gemini structured roadmap payload
├── src/                          # React Single Page Application (SPA)
│   ├── components/               # Reusable UI components:
│   │   ├── Roadmap.jsx           # Interactive visual roadmap component
│   │   ├── RoadmapCelebration.jsx# 4-tier positive reinforcement & celebration card
│   │   ├── TrendChart.jsx        # Responsive SVG progress trend chart
│   │   ├── GoalCalendar.jsx      # Interactive deadline & activity calendar
│   │   ├── GoalCelebration.jsx   # High-density Canvas Confetti celebration
│   │   ├── Sidebar.jsx           # Collapsible navigation rail
│   │   └── VoiceRecorder.jsx     # On-device audio recorder widget
│   ├── context/                  # AuthContext, DataContext, ModalContext
│   ├── pages/                    # Views:
│   │   ├── Dashboard.jsx         # Momentum metrics, Focus Next, & Progress Trend
│   │   ├── Roadmap.jsx           # Dedicated Goal AI Roadmap page
│   │   ├── Journal.jsx           # Voice/text journaling & in-place analysis
│   │   ├── Goals.jsx             # Smart goal management & priority filters
│   │   ├── Habits.jsx            # Habit consistency tracker & streaks
│   │   ├── progress.jsx          # Configurable period progress analytics
│   │   └── AiCoach.jsx           # Weekly accountability synthesis reports
│   ├── services/                 # API client (api.js, roadmapApi.js) & auth wrappers
│   ├── App.jsx                   # React Router route declarations
│   └── index.css                 # Calm Moss theme tokens & animations
├── backend/                      # FastAPI Python Application
│   ├── alembic/                  # Version-controlled database migrations:
│   │   └── versions/             # Migration scripts (goals, habits, roadmaps)
│   ├── app/
│   │   ├── api/v1/               # API Endpoints:
│   │   │   ├── journals.py       # Journal CRUD & voice transcription
│   │   │   ├── goals.py          # Goal management & roadmap retrieval
│   │   │   ├── roadmap.py        # Dedicated roadmap generation & sample APIs
│   │   │   ├── progress.py       # Historical progress & trend analytics
│   │   │   ├── habits.py         # Habit tracking & completion constraints
│   │   │   ├── summaries.py      # Weekly AI accountability synthesis
│   │   │   └── productivity.py   # Deterministic Productivity Score (0-100)
│   │   ├── core/                 # Auth verification, AES-256 crypto, settings
│   │   ├── database/             # SQLAlchemy ORM models (GoalORM, RoadmapORM)
│   │   ├── models/               # Domain models
│   │   ├── repositories/         # Thread-safe in-memory & SQL repositories
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── services/             # Gemini, Whisper, Goal, Roadmap, Progress services
│   │   └── main.py               # FastAPI application factory & routes
│   └── tests/                    # Automated pytest test suites:
│       ├── test_roadmap_api.py   # Roadmap endpoints & milestone completion
│       ├── test_progress_trends.py # Period metrics & delta analytics
│       ├── test_migration.py     # Encryption migration idempotency
│       └── test_unit.py          # Isolation & unit test suite
├── AGENTS.md                     # Universal agent contract & DOX guidelines
├── README.md                     # Project documentation
└── package.json                  # Frontend dependencies and scripts
```

---

## Quickstart Guide

### Prerequisites
- **Python**: `3.10` or higher
- **Node.js**: `18.0.0` or higher (`npm`)
- **Google Gemini API Key**: [Obtain from Google AI Studio](https://aistudio.google.com/)
- **Firebase Project**: [Firebase Console](https://console.firebase.google.com/) with Email/Password Auth enabled

---

### Step 1: Configure Environment Variables

Create `.env` in the root directory (or copy from `.env.example`):

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.1-flash-lite

# Faster-Whisper Speech-to-Text
WHISPER_MODEL=tiny
WHISPER_DEVICE=cpu
WHISPER_COMPUTE_TYPE=int8

# AES-256-GCM Field Encryption
ENCRYPTION_KEY=ai-goal-journal-default-secret-dev-key-change-in-prod

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### Step 2: Launch Backend API

1. Install Python dependencies:
   ```bash
   python -m pip install -r backend/requirements.txt
   ```
2. Start the FastAPI server on port 8000:
   ```bash
   python -m uvicorn app.main:app --app-dir backend --port 8000 --reload
   ```
3. Verify backend connectivity:
   - **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - **Health Check**: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

---

### Step 3: Launch Frontend Application

1. In a separate terminal, install node dependencies:
   ```bash
   npm install
   ```
2. Start Vite development server:
   ```bash
   npm run dev
   ```
3. Open the web application:
   - **URL**: [http://localhost:5173](http://localhost:5173)

---

### Step 4: Testing Features & Development Preview Mode

- **Local Preview Mode**: If testing without configured Firebase credentials, the application automatically enters **Dev Preview Mode** (`VITE_DEV_PREVIEW=true`), allowing direct navigation to all features with a verified local mock token.
- **AI Roadmap Experience**:
  1. Open **Goals** (`/goals`) and create an active goal (e.g. *"Learn Frontend Development"*).
  2. Click the **Roadmap** button on the goal card to navigate to `/goals/:goalId/roadmap`.
  3. Explore the ordered milestones, estimated durations, and actionable checkpoints.
  4. Check off individual action items: observe the **Tier 1 (Micro-Momentum)** and **Tier 2 (Progress Velocity)** feedback in the AI Encouragement card.
  5. Complete all items in a milestone: observe **Tier 3 (Milestone Mastery)**.
  6. Complete the entire roadmap (100%): experience the **Tier 4 (Grand Celebration)** with full-screen Canvas Confetti.
- **Progress Analytics**:
  1. Open **Progress** (`/progress`).
  2. Switch between **Last 7 days**, **Last 30 days**, **Last 90 days**, and **All time** to observe dynamic recalculations of period gains and average progress changes.

---

## Automated Test Suites

The backend features rigorous test suites covering cryptography, roadmap generation, progress mathematics, and authorization boundaries:

```bash
# Run full test suite
python -m pytest backend/tests/ -v

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
- **Intrinsically Rewarding**: Positive reinforcement highlights tangible progress and mastery rather than artificial dopamine loops.
- **Zero External Server Overhead**: In-memory architecture ensures rapid local execution on modest hardware (4 GB RAM PCs).
