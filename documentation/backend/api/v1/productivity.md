# productivity.py (Productivity Score & Insights Route Handler)

## 📌 What This File Does
This file serves the **productivity analytics endpoints**. When the dashboard loads and displays a user's overall productivity score (e.g. 84/100), weekly trends, or category breakdowns, this file calls `productivity_service.py` to calculate and return those numbers.

---

## 📥 Where It Gets Data
- Authenticated user ID.
- Historical journal, goal, and habit metrics from the database.

---

## ⚙️ Core Actions Handled
1. **Fetch Current Score**: Computes the real-time score out of 100 based on consistency, execution, and habit streaks.
2. **Fetch Trend History**: Returns daily scores over the past 7 to 30 days for trend line visualization.
3. **Pillar Breakdown**: Breaks down the score into individual pillars (Consistency, Focus, Execution, Resilience) so users see exactly where to improve.

---

## 📤 Where the Output Goes
- Powers the circular score rings, trend graphs, and performance metrics on the Dashboard and Insights pages.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This route provides the user's computed productivity scores and historical trends. It feeds the frontend charts with four-pillar breakdowns so users understand their performance trajectory over time."*
