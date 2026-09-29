# journals.py (Journal Web Endpoints & User Route Handler)

## 📌 What This File Does
This file is the **traffic controller for everything related to journaling**. When a user types a journal entry, uploads a voice recording, edits an old reflection, or browses past entries, the React frontend sends its web request to this file.

It unpacks the request, verifies user authentication, forwards the work to `journal_service.py`, and sends back clean JSON to the frontend.

---

## 📥 Where It Gets Data
- Text journal payloads or uploaded voice audio files (`multipart/form-data`).
- Authenticated user credentials verified by `auth.py`.
- Pagination query parameters (e.g. page number, limit, date filters).

---

## ⚙️ Core Actions Handled
1. **Submit Text Journal**: Receives user reflections, triggers mood analysis and goal extraction, and saves encrypted data.
2. **Submit Voice Journal**: Accepts uploaded audio recordings, triggers local Whisper transcription, and processes the resulting text.
3. **Fetch Journal Feed**: Retrieves the authenticated user's past journal entries with pagination and search.
4. **Update or Delete**: Allows users to edit their reflections or delete an entry.

---

## 📤 Where the Output Goes
- Returns JSON responses containing the saved entry, detected mood badges, extracted goals, and audio transcription metrics back to the frontend.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This is the API router for all journal actions. It handles both written text entries and voice audio uploads, delegating transcription, emotion classification, and AES encryption to our backend services while enforcing user authentication."*
