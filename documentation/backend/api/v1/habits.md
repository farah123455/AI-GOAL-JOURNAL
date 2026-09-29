# habits.py (Habit & Streak Route Handler)

## 📌 What This File Does
This file manages all web communication for **daily habit tracking and streaks**. When a user checks off their morning run, marks their coding practice as done, or sets up a new habit, this file routes the request, computes updated streaks, and saves the result.

---

## 📥 Where It Gets Data
- Habit creation payloads (habit title, target frequency, category).
- Daily toggle check-ins (habit ID, completion date).
- Authenticated user ID.

---

## ⚙️ Core Actions Handled
1. **Fetch Habits**: Returns the user's active habits, current streaks, and completion status for today.
2. **Toggle Check-In**: Marks a habit as done or undone for the current date, automatically updating streak counts.
3. **Habit History**: Returns historical completion logs to render heatmap activity calendars.

---

## 📤 Where the Output Goes
- Delivers updated streak stats, badge milestones, and completion flags to the frontend Habits page.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This API router handles habit creation, daily toggle check-ins, and streak recalculations, giving users immediate feedback on their habit streaks and powering the activity heatmaps."*
