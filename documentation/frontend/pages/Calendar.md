# Calendar.jsx (Interactive Goal Calendar View Screen)

## 📌 What This File Does
This screen provides a **full-page interactive calendar view** showing all user goal deadlines, milestone dates, and daily habit check-ins laid out across the month. 

It also includes the control center for linking or syncing with Google Calendar.

---

## 📥 Where It Gets Data
- Goals and deadlines from `DataContext`.
- Google Calendar sync status from `/api/v1/calendar`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Interactive Monthly Grid**: Embeds `GoalCalendar.jsx` with month navigation (previous/next month, jump to today).
2. **Google Calendar Sync Banner**: Shows current sync status, last synchronized timestamp, and a button to trigger manual sync or launch `SyncGoogleCalendarModal.jsx`.
3. **Selected Day Inspector**: Clicking on any date opens an agenda sidebar showing all tasks, deadlines, and journal reflections recorded on that specific day.

---

## 📤 Where the Output Goes
- Rendered at `/calendar`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This page serves as the user's temporal agenda. It visualizes goals and habit check-ins on a calendar grid and manages bidirectional synchronization with Google Calendar."*
