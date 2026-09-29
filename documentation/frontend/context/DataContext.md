# DataContext.jsx (Live Application Data & Cache Manager)

## 📌 What This File Does
This file manages the **live data cache of goals, journal entries, habits, and productivity scores**. 

When a user writes a new journal or completes a goal, this file immediately updates the app's state in memory so that changes show up everywhere (Dashboard, Goals page, Progress charts) without forcing the user to refresh their browser.

---

## 📥 Where It Gets Data
- Backend REST API responses (journals, goals, habits, productivity metrics).

---

## ⚙️ How It Works (Step-by-Step)
1. **Initial Data Hydration**: When the user logs in, it loads all recent goals, active habits, and journal entries in parallel.
2. **Optimistic Updates**: When a user checks off a habit or updates a goal percentage, it immediately updates the UI so the app feels instantly responsive, while sending the update to the server in the background.
3. **Global Re-fetchers**: Provides helper refresh functions (e.g. `refreshGoals()`, `refreshJournals()`) that child components can call whenever an action finishes.

---

## 📤 Where the Output Goes
- Supplies `goals`, `journals`, `habits`, `productivityScore`, and update methods to the rest of the application via `useData()`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This Context acts as our client-side state store. It caches goals, habits, and journal records in memory, enabling optimistic UI updates and keeping dashboard metrics synchronized across multiple screens."*
