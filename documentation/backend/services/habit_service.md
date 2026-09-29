# habit_service.py (Habit Tracking & Streak Management Engine)

## 📌 What This File Does
This file manages **daily habits, routine completion, and streak calculations** (like keeping a 7-day workout or 14-day coding streak). It tracks when habits are checked off each day, automatically increments current streaks, preserves the user's all-time best record, and resets streaks if a day is skipped.

---

## 📥 Where It Gets Data
- Habit definitions (name, frequency, category) created by the user.
- Daily check-in timestamps and user ID.

---

## ⚙️ How It Works (Step-by-Step)
1. **Habit Lifecycle**: Allows users to create, update, pause, or archive habits.
2. **Streak Computation**:
   - Compares the date of the latest check-in with today's date.
   - If checked in consecutively: Current Streak += 1.
   - If Current Streak exceeds Best Streak: Updates Best Streak record.
   - If more than 24-48 hours have passed without an entry: Resets current streak to 0 while keeping the historical best record intact.
3. **Daily Habit Logs**:
   - Records each check-in in the `habit_logs` table for calendar heatmaps and historical trend graphs.

---

## 📤 Where the Output Goes
- Populates the Habit Tracker grid, streak counters, and weekly habit completion percentages on the frontend.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This service handles atomic habit tracking and streak logic. It logs daily completions, computes unbroken streak lengths, protects personal best records, and feeds streak consistency into the overall productivity scoring system."*
