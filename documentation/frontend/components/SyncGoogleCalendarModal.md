# SyncGoogleCalendarModal.jsx (Google Calendar Setup & Authorization Dialog)

## 📌 What This File Does
This file renders the **step-by-step setup modal for linking Google Calendar**. When a user wants their goal deadlines to automatically appear on their real Google Calendar, this dialog explains the permissions requested, triggers the Google OAuth login window, and confirms when synchronization is active.

---

## 📥 Where It Gets Data
- Google OAuth credentials and connection states from `calendar.py`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Clear Permission Explanations**: Informs the user that the app only requests permission to add and edit goal events, never to read private personal calendar entries.
2. **OAuth Trigger**: Launches the Google OAuth2 consent popup.
3. **Synchronization Handshake**: Passes the resulting authorization code to the backend to store the refresh token.
4. **Success State & Instant Sync**: Triggers an immediate initial sync of all current user goals to the user's Google Calendar.

---

## 📤 Where the Output Goes
- Appears as a modal dialog managed by `ModalContext.jsx`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This component manages the Google Calendar OAuth onboarding modal. It provides transparent permission explanations, launches the authorization flow, and initiates the initial goal schedule synchronization."*
