# productivity_service.py (Productivity Scoring & Behavioral Analytics)

## 📌 What This File Does
This file calculates a **dynamic, mathematically grounded Productivity Score (from 0 to 100)** for each user. 

Rather than giving a generic arbitrary number, it combines journal consistency, completed milestones, habit streaks, and active blockers into a meaningful daily and weekly performance rating.

---

## 📥 Where It Gets Data
- **Journal Frequency**: How consistently the user writes or records journals.
- **Goal Milestones**: Ratio of completed vs. stalled goals.
- **Habit Streaks**: Daily habit check-offs from `habit_service.py`.
- **Blocker Impact**: Deductions for persistent unresolved blockers.

---

## ⚙️ The Scoring Formula (Plain English)
The score is composed of 4 key pillars:
1. **Consistency Weight (30%)**: Did the user check in today and maintain their streak?
2. **Execution Weight (35%)**: Did the user finish planned tasks and advance goal percentages?
3. **Habit Adherence (20%)**: Did the user stick to their daily morning/evening routines?
4. **Resilience & Recovery (15%)**: Did the user overcome previous obstacles or report positive emotional breakthroughs?

---

## 📤 Where the Output Goes
- Powers the circular progress gauges, trend charts, and weekly productivity widgets on the Dashboard and Insights pages.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'How do you measure productivity?': In `productivity_service.py`, we implement a multi-factor scoring algorithm. It evaluates journal frequency, task completion rates, habit streaks, and blocker resolution to provide an objective score from 0 to 100 with actionable feedback."*
