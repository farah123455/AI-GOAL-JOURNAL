# AppShell.jsx (Main Application Layout Wrapper)

## 📌 What This File Does
This file defines the **visual frame and master layout of the authenticated dashboard**. It stitches together the persistent sidebar on the left, the top navigation header, and the main scrollable content area where individual pages (like Journal, Goals, or Habits) are displayed.

---

## 📥 Where It Gets Data
- Current active route from React Router.
- Children components (the specific page currently being viewed).

---

## ⚙️ How It Works (Step-by-Step)
1. **Responsive Layout Grid**:
   - On desktop: Renders an expanded or collapsible left sidebar alongside the main viewport.
   - On mobile/tablet: Automatically collapses the sidebar into a touch-friendly drawer menu.
2. **Top Navigation Header**: Hosts the search bar, notification indicators, quick "New Journal" button, and user profile avatar.
3. **Scroll Isolation**: Keeps the sidebar fixed while allowing the main content view to scroll smoothly.

---

## 📤 Where the Output Goes
- Renders the unified dashboard skeleton surrounding all protected application screens.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This component is our master responsive layout shell. It provides consistent navigation, mobile drawer transitions, and responsive content padding across the entire authenticated application."*
