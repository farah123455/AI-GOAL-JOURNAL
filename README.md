# AI Goal Journal & Accountability Coach

An AI-powered personal journaling and goal-tracking platform designed to help users track daily progress, maintain accountability, and receive AI-driven insights.

---

## Final Project Structure

```
AI Goal Journal/
├── src/
│   ├── components/
│   │   ├── AppShell.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Sidebar.jsx
│   │   └── VoiceRecorder.jsx        # Browser-native voice recorder prototype
│   ├── context/
│   │   └── AuthContext.jsx           # Firebase Authentication state context
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Goals.jsx
│   │   ├── Journal.jsx               # Journal page with text entry & VoiceRecorder
│   │   ├── Login.jsx                 # Firebase Email/Password Login
│   │   ├── Profile.jsx
│   │   └── Register.jsx              # Firebase Email/Password Registration
│   ├── services/
│   │   ├── api.js                    # Helper for Firebase Bearer ID tokens
│   │   └── authService.js            # Centralized Firebase modular auth calls
│   ├── App.jsx                       # Main router & ProtectedRoute wrappers
│   ├── firebase.js                   # Single Firebase initialization module
│   ├── index.css
│   └── main.jsx                      # App root with AuthProvider & BrowserRouter
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── users.py          # User API endpoints
│   │   ├── models/
│   │   │   └── user.py               # User Pydantic model
│   │   ├── schemas/
│   │   │   └── user.py              # User Pydantic schemas
│   │   ├── services/
│   │   │   └── user_service.py       # User service logic
│   │   └── main.py                   # FastAPI main entry point
│   └── requirements.txt
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .env                              # Real Firebase keys (git-ignored)
├── .env.example                      # Template without credentials
├── .gitignore
└── README.md
```

---

## Setup & Running Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

*Note: Never commit `.env` to version control.*

### 2. Running the Frontend

Install dependencies and start the Vite development server:

```bash
# In project root
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

### 3. Running the Backend

Install Python dependencies and start the FastAPI server:

```bash
# In backend directory
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

The backend API will run at `http://127.0.0.1:8000` (or `http://127.0.0.1:8001` if port 8000 is occupied).

---

## Architecture & Implementation Overview

### Authentication Architecture (Firebase)

- **Initialization**: Single Firebase instance in `src/firebase.js` using `import.meta.env.VITE_FIREBASE_*`.
- **Auth Service**: `src/services/authService.js` wraps modular Firebase SDK functions (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`).
- **Auth Context**: `src/context/AuthContext.jsx` subscribes to real-time session updates via `onAuthStateChanged`. Mock authentication and `localStorage` session state have been completely removed.
- **Route Protection**: `src/components/ProtectedRoute.jsx` checks `checkingAuth` state during initial session lookup before enforcing authenticated access to `/dashboard`, `/journal`, `/goals`, and `/profile`.

### Voice Recording Prototype

- **Component**: `src/components/VoiceRecorder.jsx` built on native browser `MediaRecorder` API and `navigator.mediaDevices.getUserMedia()`.
- **Features**:
  - Microphone permission handling and denial detection.
  - Recording start/stop with live duration timer.
  - Audio chunk collection into an `audio/webm` Blob.
  - Temporary Object URL playback via native `<audio controls />`.
  - Discard/reset with automatic memory URL and stream track cleanup (`track.stop()`).
  - Fallback for legacy browsers without MediaRecorder support.
- **Integration**: Embedded into `src/pages/Journal.jsx` as a "Voice Entry" section alongside the text journal editor.

---

## Speech-to-Text Status: Research / Decision Pending

The current implementation stops at browser-native voice recording, producing an audio Blob with temporary local playback preview.

Candidate options for future team evaluation:
- Whisper-based solution (OpenAI API / Local Whisper model)
- Google Cloud Speech-to-Text API
- Browser Web Speech API (`SpeechRecognition` API)
- Other stack-compatible options

### Intended Future Pipeline Flow
```
VoiceRecorder Component
         ↓
Audio Blob (WebM / WAV)
         ↓
Future backend upload endpoint
         ↓
Selected Speech-to-Text Engine (TBD)
         ↓
Transcribed Journal Text
         ↓
Gemini AI Analysis Service
```

---

## Team Module Boundaries

### Implemented Now (Swayam - Day 3/4)
- Firebase Authentication setup and UI integration (`Login`, `Register`, `Navbar` logout, `ProtectedRoute`).
- Auth service and context overhaul (`authService.js`, `AuthContext.jsx`).
- Browser-native Voice Recording prototype (`VoiceRecorder.jsx`).
- Speech-to-text research documentation & project workspace consolidation.

### Future Integration / Team Member Responsibilities
- **Aditya**: User model/schemas, User Profile API endpoints, Firebase UID ➔ PostgreSQL mapping.
- **Farah**: PostgreSQL database setup, SQLAlchemy ORM models, Journal CRUD backend services.
- **Panshobh**: Frontend layout foundation, design system styling, page components.
- **Sheryl**: Gemini API integration, AI journal entry analysis, goal tracking AI.
