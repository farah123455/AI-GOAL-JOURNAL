# calendar.py (Google Calendar Integration Route Handler)

## 📌 What This File Does
This file manages the web routes for **connecting, syncing, and disconnecting Google Calendar**. When a user clicks "Connect Google Calendar" in the app, this file handles the OAuth authorization handshakes and synchronizes their goals with their personal calendar.

---

## 📥 Where It Gets Data
- Google OAuth authorization codes and tokens from the frontend.
- Goal IDs selected for calendar scheduling.
- Authenticated user ID.

---

## ⚙️ Core Actions Handled
1. **OAuth Exchange**: Safely exchanges temporary authorization codes for persistent Google Calendar refresh tokens.
2. **Sync Status**: Checks if the user currently has an active Google Calendar link.
3. **Manual / Auto Sync**: Pushes all current goal deadlines to Google Calendar as timed reminders.
4. **Disconnect**: Safely revokes and removes Google credentials upon user request.

---

## 📤 Where the Output Goes
- Returns calendar connection status and sync confirmations to the frontend Calendar and Settings pages.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This controller coordinates Google Calendar OAuth2 authentication and event syncing. It manages user authorization tokens and exposes endpoints to push goal milestones directly to Google Calendar."*
