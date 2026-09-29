# Dashboard.jsx (Central Productivity Command Center)

## 📌 What This File Does
This is the **main home screen that users see after logging in**. It synthesizes all parts of the app into a single, cohesive command center: today's priority goals, current habit streaks, recent emotional trends, overall productivity score, and upcoming calendar deadlines.

---

## 📥 Where It Gets Data
- Aggregated user state from `DataContext` and `AuthContext`.
- Productivity metrics from `productivity_service.py`.

---

## ⚙️ Key Dashboard Widgets
1. **Welcome & Daily Streak Header**: Greets the user by name, displays their active journaling streak, and shows motivational words.
2. **Productivity Score Ring**: Circular progress ring showing their real-time performance score (0-100).
3. **Priority Goals Card**: Lists goals due today or soonest, with direct progress slider updates.
4. **Habit Streak Tracker**: Fast one-click check-off boxes for daily habits.
5. **Recent Mood Timeline**: Visual pills displaying the emotional trajectory over the past few days.
6. **Quick Action Trigger**: Direct shortcut to record a quick voice journal or create a new goal.

---

## 📤 Where the Output Goes
- Serves as the primary operational hub rendered at `/dashboard`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"The Dashboard is our central executive view. It unifies productivity scoring, priority goals, habit streaks, and emotional state trends into an actionable daily overview."*
