# goal_service.py (Goal Tracking & Lifecycle Management)

## 📌 What This File Does
This file manages the **lifecycle of all user goals**—from when a goal is first proposed by the AI or manually created by the user, to tracking its ongoing progress, setting target deadlines, and marking it as completed.

---

## 📥 Where It Gets Data
- AI-extracted goals sent from `gemini_service.py`.
- Manual goal creations and edits submitted by the user on the frontend.
- Authenticated user ID ensuring users only manage their own goals.

---

## ⚙️ How It Works (Step-by-Step)
1. **Creation & Deduplication**:
   - Creates new goals with title, description, category (Career, Health, Study, Finance), and due date.
   - Prevents duplicate goals from being accidentally generated multiple times.
2. **Progress Calculation**:
   - Updates completion percentage (`0%` to `100%`).
   - Automatically transitions status between `active`, `completed`, or `stalled` based on recent user activity.
3. **Calendar Integration**:
   - If the user has linked their Google Calendar, this service coordinates with `google_calendar_service.py` to create or update scheduled calendar events matching goal deadlines.
4. **Filtering & Retrieval**:
   - Fetches active, completed, or upcoming goals sorted by urgency and priority.

---

## 📤 Where the Output Goes
- Updates the `goals` table in PostgreSQL and provides live goal arrays to the frontend Goals and Dashboard pages.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This service handles full CRUD operations and progress calculations for goals. It ensures goal deduplication, automatically updates completion percentages, manages status transitions, and synchronizes milestones with the user's Google Calendar."*
