# summary_service.py (Weekly AI Progress & Accountability Summary)

## 📌 What This File Does
This file acts as a **personal accountability coach doing a weekly retrospective**. Every Sunday or on demand, it looks back over the past 7 days of a user's journals, goals achieved, habits maintained, and recurring blockers. 

It generates an insightful, encouraging narrative summary that highlights what went well, spots hidden patterns (like always feeling burned out on Thursdays), and suggests 2–3 concrete adjustments for next week.

---

## 📥 Where It Gets Data
- All journal entries, mood ratings, and blockers recorded during the past 7 days.
- Goal progress updates and habit streak logs.

---

## ⚙️ How It Works (Step-by-Step)
1. **Aggregates Weekly Metrics**:
   - Total journals written.
   - Goals advanced vs. goals untouched.
   - Predominant emotional trends (e.g. 4 days of focus, 2 days of burnout).
2. **AI Reflection Generation**:
   - Prompts Gemini with the weekly digest to generate:
     - **Key Achievements**: Highlighting tangible progress.
     - **Pattern Detection**: Spotting recurrent obstacles or time wasters.
     - **Coaching Action Plan**: 2–3 specific, realistic targets for the upcoming week.
3. **Caching**:
   - Saves the generated summary in `weekly_summaries` so the user can review past weeks without needing to re-run expensive AI queries.

---

## 📤 Where the Output Goes
- Displayed on the Insights & Weekly Review dashboard on the frontend.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This service generates automated weekly reviews. It aggregates 7 days of journal thoughts, habit consistency, and blockers, and uses Gemini to produce structured feedback highlighting patterns, celebrating wins, and recommending tactical improvements for the week ahead."*
