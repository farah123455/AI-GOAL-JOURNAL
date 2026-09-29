# config.py (Application Configuration & Environment Settings)

## 📌 What This File Does
This file is the **central control panel for all configuration settings, API keys, and environment variables** in the backend. 

Instead of hardcoding database passwords, AI API keys, or server ports across different files (which is insecure and error-prone), this file uses Pydantic's `BaseSettings` to load, validate, and provide all settings in one safe, centralized place.

---

## 📥 Where It Gets Data
- Reads settings directly from the local `.env` file or cloud environment variables (e.g. Render, Railway, Docker).

---

## ⚙️ Key Settings Managed
1. **Database Configuration**:
   - `DATABASE_URL`: Connection string pointing to PostgreSQL.
2. **AI & Machine Learning Keys**:
   - `GEMINI_API_KEY`: API token for Google Gemini model inference.
   - `GROQ_API_KEY`: API token for ultra-fast Groq LLM inference.
   - `WHISPER_MODEL`: Specifies which Whisper speech model to use (defaulting to lightweight `"tiny"` or `"base"`).
   - `WHISPER_DEVICE` & `WHISPER_COMPUTE_TYPE`: Configures CPU vs. GPU (CUDA) execution and quantization (e.g. `int8`).
3. **Security & Cryptography**:
   - `ENCRYPTION_KEY`: The 32-byte secret key used for AES-256 journal encryption.
   - `FIREBASE_PROJECT_ID`: Identifies the Firebase project for token verification.
4. **Google Calendar Integration**:
   - Client ID and Client Secret for OAuth calendar syncing.

---

## 📤 Where the Output Goes
- Exposes a clean, strongly typed `settings` object that any other backend file can import (e.g., `from app.core.config import settings`).

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"We follow the 12-Factor App methodology. `config.py` uses Pydantic Settings to validate all environment variables, API keys, database URLs, and AI model configurations at startup, preventing sensitive keys from ever being hardcoded in our source repository."*
