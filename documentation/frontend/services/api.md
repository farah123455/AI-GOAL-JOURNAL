# api.js (Frontend HTTP Client & Backend Connector)

## 📌 What This File Does
This file is the **bridge connecting the React user interface to the FastAPI backend**. 

Whenever the frontend needs to fetch journals, submit a voice recording, update goal progress, or ask the AI coach a question, this file handles the actual HTTP network request.

---

## 📥 Where It Gets Data
- Backend base URL (e.g. `http://localhost:8000` or production API URL).
- Firebase JWT token from `AuthContext`.
- Form data, audio blobs, and JSON payloads from frontend pages.

---

## ⚙️ How It Works (Step-by-Step)
1. **Centralized Fetch Wrapper**: Configures headers, base URLs, and timeout settings.
2. **Automatic Auth Token Attachment**: Automatically injects the user's `Authorization: Bearer <token>` into every outgoing request so developers don't have to remember to do it manually.
3. **Multipart Form Support**: Handles uploading raw audio binary streams (`FormData`) for voice journaling to `/api/v1/journals`.
4. **Unified Error Handling**: Catches 401 Unauthorized, 404 Not Found, and 500 Server errors, presenting user-friendly error messages rather than letting components crash.

---

## 📤 Where the Output Goes
- Returns clean JavaScript objects and promises to React components and Context providers.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This file is our centralized API communication client. It automatically injects Firebase authentication tokens into HTTP headers, handles multipart audio uploads for voice journaling, and provides standardized error handling across all backend calls."*
