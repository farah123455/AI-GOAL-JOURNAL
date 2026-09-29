# ProductivityCalculator.jsx (Interactive Performance Simulator)

## 📌 What This File Does
This file is an **interactive simulator tool** on the dashboard. It lets users slide virtual dials (like adjusting their daily study hours, habit streak targets, or journal consistency) to see in real-time how changing their daily habits would boost their overall Productivity Score.

---

## 📥 Where It Gets Data
- User slider inputs (journaling frequency, habit consistency, task completion).
- The mathematical scoring weights defined in `productivity_service.py`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Interactive Sliders**: Provides draggable slider bars for daily habits and study goals.
2. **Instant Score Recalculation**: Runs the scoring formula in the browser on every slider drag, instantly animating the predicted score.
3. **Actionable Suggestions**: Shows personalized tips on which habit adjustment yields the highest productivity boost.

---

## 📤 Where the Output Goes
- Rendered on the Dashboard and Insights pages as an educational self-improvement widget.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This interactive widget allows users to simulate the impact of prospective habit changes on their productivity score, giving them tangible insight into which habits have the greatest leverage."*
