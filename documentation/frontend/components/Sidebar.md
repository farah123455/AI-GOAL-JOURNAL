# Sidebar.jsx (Dashboard Navigation Menu)

## 📌 What This File Does
This file renders the **navigation sidebar** on the left side of the dashboard. It lets users switch between different core sections with a single click: Dashboard, Journal, Goals, Habits, AI Coach, Roadmap, Calendar, and Insights.

---

## 📥 Where It Gets Data
- Current URL path from `useLocation()` to highlight the active menu item.
- User profile info from `AuthContext`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Navigation Links**: Renders visual icons and labels for each section.
2. **Active State Highlighting**: Highlights the current page in an accented brand color so the user always knows where they are.
3. **Quick Action Shortcuts**: Includes a prominent "Quick Record" button to instantly launch a journal entry.
4. **Sign Out Action**: Houses the logout button at the bottom of the sidebar.

---

## 📤 Where the Output Goes
- Displayed persistently inside `AppShell.jsx`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This component manages the primary application navigation sidebar, featuring route-aware active states, quick action shortcuts, and responsive collapse controls."*
