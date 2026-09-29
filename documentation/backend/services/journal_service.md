# journal_service.py (Journal Business Logic & AI Orchestrator)

## 📌 What This File Does
This file is the **conductor of the journal experience**. When a user clicks "Save Journal" (or stops recording voice), this file orchestrates the entire workflow:
1. It transcribes audio if it was a voice recording.
2. It runs our trained PyTorch model to detect the emotional mood.
3. It triggers Gemini AI to extract goals and blockers.
4. It encrypts the private text using AES-256.
5. It stores the entry in the PostgreSQL database.
6. It automatically creates newly discovered goals and logs progress updates.

---

## 📥 Where It Gets Data
- Text or audio uploads submitted by the user.
- Authenticated user ID from Firebase.
- Database session from `connection.py`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Audio Transcription**: If the input is audio, it calls `whisper_service.py` to get the clean text.
2. **Mood Classification**: Calls `mood_service.py` to classify emotional state (e.g. *"burnout"*, *"focus"*).
3. **AI Goal Extraction**: Calls `gemini_service.py` to identify goals, tasks finished, and blockers.
4. **Encryption**: Calls `crypto.py` to encrypt the plain text into an AES-256 cipher string before database persistence.
5. **Database Storage**: Commits the encrypted journal and AI metadata to PostgreSQL.
6. **Decryption for Display**: When the user requests their journal history, this service reads the encrypted records, decrypts them back into readable English, and delivers them cleanly to the frontend.

---

## 📤 Where the Output Goes
- Saves data to PostgreSQL and returns a clean, decrypted journal summary to the user's screen.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'What happens end-to-end when a user submits a journal?': `journal_service.py` coordinates the whole pipeline. It takes the text or audio, transcribes it via Whisper, classifies the mood using our PyTorch model, extracts goals and blockers using Gemini, encrypts the sensitive text with AES-256, and saves it in PostgreSQL."*
