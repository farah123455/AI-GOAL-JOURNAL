# GoalCalendar.jsx (Interactive Goal Calendar & Deadline View)

## 📌 What This File Does
This file renders a **visual monthly and weekly calendar** displaying all of the user's upcoming goal deadlines, study milestones, and completed achievements directly on the dates they belong to.

---

## 📥 Where It Gets Data
- List of goals and target due dates from `DataContext`.
- Selected month/year view state.

---

## ⚙️ How It Works (Step-by-Step)
1. **Date Grid Generation**: Computes days in the month and builds a responsive calendar grid.
2. **Goal Tagging**:
   - Maps each goal to its target date square.
   - Color-codes pills by category (e.g. Blue for Study, Emerald for Health, Purple for Career).
3. **Interactive Day Selection**:
   - Clicking any day highlights the specific goals due on that date.
4. **Status Badges**:
   - Shows checkmarks on milestones that have already been achieved.

---

## 📤 Where the Output Goes
- Rendered on the dedicated Calendar page (`src/pages/Calendar.jsx`) and Dashboard overview.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This component renders a dynamic monthly calendar mapping all user deadlines. It groups goals by date and category, giving users an immediate visual overview of their upcoming commitments."*
