# Goals.jsx (Goal Management & Progress Tracking Screen)

## 📌 What This File Does
This screen is the **dedicated management hub for all personal and professional goals**. Users can organize goals into categories (Career, Health, Study, Finance), track their completion percentages from 0% to 100%, filter by active or completed status, and manually create new goals.

---

## 📥 Where It Gets Data
- List of goals from `DataContext`.
- Category filters selected by the user.

---

## ⚙️ How It Works (Step-by-Step)
1. **Category Filtering**: Tabs allow users to filter goals by category or view all at once.
2. **Interactive Progress Sliders**: Users can drag progress sliders or click quick increments (+10%, +25%) to update progress on the fly.
3. **Completion Celebrations**: Reaching 100% on any goal immediately triggers `GoalCelebration.jsx` with confetti.
4. **Google Calendar Status**: Shows a small calendar icon on goals that are actively synced to the user's real Google Calendar.

---

## 📤 Where the Output Goes
- Updates the goals state in PostgreSQL and refreshes Dashboard metrics.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This page provides full goal lifecycle management, allowing users to categorize goals, track incremental progress percentages, trigger celebratory milestones, and verify Google Calendar sync states."*
