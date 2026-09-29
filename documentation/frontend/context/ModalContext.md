# ModalContext.jsx (Universal Popup & Dialog Manager)

## 📌 What This File Does
This file manages **popups, modal dialogs, and celebratory alert overlays** across the application. 

Instead of cluttering individual pages with duplicate popup markup, this file provides a clean way to open or close any modal (such as "Add Goal", "Sync Google Calendar", or "Goal Completed Celebration!") from any button in the app.

---

## 📥 Where It Gets Data
- Trigger events from buttons (e.g. clicking "New Goal" or hitting 100% completion).

---

## ⚙️ How It Works (Step-by-Step)
1. **Modal State Stack**: Tracks which modal is currently active and any custom data passed to it.
2. **Backdrop & Focus Handling**: Disables background scrolling when a modal opens and handles outside-click dismissals.
3. **Trigger Hooks (`useModal`)**: Allows any component to invoke `openModal('NEW_GOAL')` or `closeModal()` cleanly.

---

## 📤 Where the Output Goes
- Renders the active modal overlay above the main page content.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This Context provides centralized dialog management, allowing any component to trigger forms, calendar setup dialogs, or celebration animations through a clean declarative API."*
