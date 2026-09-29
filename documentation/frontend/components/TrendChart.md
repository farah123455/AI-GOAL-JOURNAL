# TrendChart.jsx (Productivity & Streak Trend Graph)

## 📌 What This File Does
This file renders a **smooth visual line graph** showing the user's productivity score, journal frequency, and task completion trends over the last 7 to 30 days.

---

## 📥 Where It Gets Data
- Historical daily performance arrays fetched from `productivity_service.py`.

---

## ⚙️ How It Works (Step-by-Step)
1. **SVG / Chart Rendering**: Plots historical data points along a timeline axis.
2. **Interactive Tooltips**: Hovering over any point on the graph reveals the exact score, date, and top activities finished on that day.
3. **Smooth Curves & Gradient Fills**: Uses aesthetic color gradients to make progress easily readable at a glance.

---

## 📤 Where the Output Goes
- Displayed prominently on the Dashboard and Insights pages.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This component visualizes longitudinal productivity trends, allowing users to track their weekly momentum and spot consistency dips over time."*
