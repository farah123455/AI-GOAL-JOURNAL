# Insights.jsx (Weekly AI Summaries & Productivity Analytics Screen)

## 📌 What This File Does
This screen acts as the **weekly retrospective and data analytics room**. It compiles the user's historical performance over weeks and months, showing longitudinal productivity curves, recurring blocker patterns, emotional mood distributions, and AI-generated weekly coaching summaries.

---

## 📥 Where It Gets Data
- Weekly summary cache from `summary_service.py`.
- Historical productivity metrics from `productivity_service.py`.
- Emotion distribution counts from the mood classifier history.

---

## ⚙️ Key Visualizations & Sections
1. **Weekly AI Coach Summary Card**: Displays the AI-generated retrospective—celebrating key wins, highlighting obstacles, and outlining recommendations for next week.
2. **Productivity Trend Graph**: Renders `TrendChart.jsx` showing score trajectories over 7, 14, or 30 days.
3. **Emotional Breakdown Chart**: Visual distribution of the 10 emotion states (showing percentage of days spent in focus vs. burnout vs. accomplishment).
4. **Blocker Frequency List**: Highlights the most frequently repeated obstacles (e.g. social media distraction, fatigue, exam anxiety) so users can address root causes.

---

## 📤 Where the Output Goes
- Rendered at `/insights` for deep self-reflection and accountability reviews.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This page provides high-level behavioral analytics. It combines longitudinal trend graphs, emotion distribution breakdowns, and automated AI weekly retrospectives to give users deep insight into their productivity patterns."*
