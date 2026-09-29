# Habits.jsx (Daily Habit Tracker & Streak Dashboard)

## 📌 What This File Does
This screen is the **habit building and consistency headquarters**. Users can manage their recurring daily and weekly routines (e.g. *"Read 20 pages"*, *"Code 1 hour"*, *"Drink 3L water"*), track active streaks, see their all-time personal best records, and check off completed habits each day.

---

## 📥 Where It Gets Data
- Habit list, streak counters, and daily logs from `DataContext` and `/api/v1/habits`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Daily Checklist Grid**: Displays cards for each active habit with immediate toggle checkboxes.
2. **Streak Counter Badges**: Displays 🔥 flame icons showing consecutive days maintained.
3. **Consistency Heatmap Calendar**: Renders a GitHub-style activity contribution grid showing green dots for days with consistent habit completion.
4. **Create & Manage Habits**: Modal form to add new habits with custom frequencies and target categories.

---

## 📤 Where the Output Goes
- Rendered at `/habits`, updating live streaks and feeding into the daily Productivity Score.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This page delivers an atomic habit tracking interface. It offers instant daily check-ins, calculates active streaks and best records, and visualizes consistency through GitHub-style activity heatmaps."*
