# main.py (FastAPI Application Server Entry Point)

## 📌 What This File Does
This is the **master switch and front door of the backend server**. When you start the backend, this file runs first. It initializes the FastAPI application, sets up security rules (CORS), connects the database, registers all service routes, and pre-warms the AI models into memory so the app responds instantly to user requests.

---

## 📥 Where It Gets Data
- **Configuration**: Loads database URLs, secret keys, and AI model settings from `app.core.config`.
- **API Routers**: Imports and connects all route controllers (journals, goals, habits, AI coach, calendar, etc.).

---

## ⚙️ How It Works (Step-by-Step)
1. **Creates FastAPI Instance**: Sets up the web server with API title, versioning, and auto-generated interactive Swagger API documentation.
2. **CORS Security**: Configures Cross-Origin Resource Sharing so the React frontend (running on localhost or Vercel) can securely talk to the backend without browser blocking.
3. **Lifespan Manager (Startup & Shutdown)**:
   - On server boot: Connects to the PostgreSQL database.
   - Preloads the local AI models (like Whisper and the PyTorch Emotion Analyzer) in the background so the very first user request doesn't experience cold-start lag.
   - On shutdown: Closes database connections cleanly.
4. **Attaches Routes**: Mounts every functional route under `/api/v1/` (e.g. `/api/v1/journals`, `/api/v1/goals`, `/api/v1/coach`).
5. **Health Check**: Provides a quick `/health` endpoint to monitor if the server is alive and functioning.

---

## 📤 Where the Output Goes
- Serves as the central server listening on port `8000` (or cloud port) handling incoming HTTP requests from the React frontend.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This is our main FastAPI server entry point. It configures CORS, initializes the database connection pool, registers our modular API routes, and preloads our local AI models on startup to eliminate cold-start latency."*
