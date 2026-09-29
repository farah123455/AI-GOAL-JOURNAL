# google_calendar_service.py (Google Calendar Two-Way Sync)

## 📌 What This File Does
This file connects the app with **Google Calendar**. When a goal has a due date or milestone deadline, this service can automatically create a scheduled event on the user's real Google Calendar, complete with reminders and links back to the app.

---

## 📥 Where It Gets Data
- **OAuth Credentials**: The user's Google OAuth refresh and access tokens stored in the `users` table.
- **Goal Details**: Title, category, description, and target completion date.

---

## ⚙️ How It Works (Step-by-Step)
1. **Token Refresh**: Uses Google OAuth2 client libraries to verify the user's Google token, automatically refreshing it if expired.
2. **Event Creation**:
   - Formats the goal into an all-day or timed Google Calendar event.
   - Adds color coding based on the goal category (e.g. green for Health, blue for Study).
   - Inserts helpful reminders (notifications 24 hours and 1 hour before the deadline).
3. **Event Updates & Deletion**:
   - If a user changes a goal deadline in the app, this service updates the existing event on Google Calendar using the stored `calendar_event_id`.
   - If a goal is deleted, the corresponding calendar event is removed.

---

## 📤 Where the Output Goes
- Pushes events directly to Google Calendar's servers via the official Google Calendar API v3.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'How does calendar sync work?': We integrate directly with the Google Calendar API v3 using OAuth2. When users set goal deadlines or milestones, `google_calendar_service.py` automatically schedules calendar events with reminders, bridging in-app goal planning with their real-world schedule."*
