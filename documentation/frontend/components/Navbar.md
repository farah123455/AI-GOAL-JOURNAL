# Navbar.jsx (Top Navigation Bar & User Controls)

## 📌 What This File Does
This file renders the **horizontal bar at the very top of the application**. It displays page context, breadcrumbs, user notification badges, Google Calendar sync status, and the user profile dropdown menu.

---

## 📥 Where It Gets Data
- Authenticated user's name and photo from `AuthContext`.
- Google Calendar connection state.

---

## ⚙️ How It Works (Step-by-Step)
1. **Contextual Title**: Displays the current page heading (e.g. *"Today's Journal"* or *"Active Goals"*).
2. **Calendar Status Indicator**: Shows a green indicator if Google Calendar is actively synced, or a sync button if disconnected.
3. **User Profile Dropdown**: Clicking the user avatar opens quick access to Profile settings and Logout.

---

## 📤 Where the Output Goes
- Mounted at the top of `AppShell.jsx`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This component is our persistent top navigation header, housing page title indicators, quick Google Calendar integration toggles, and user profile management controls."*
