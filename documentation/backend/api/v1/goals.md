# goals.py (Goal Management Route Handler)

## 📌 What This File Does
This file handles web requests for **creating, viewing, editing, and completing user goals**. When you see goals displayed on your dashboard, check off a completed task, or adjust a target deadline, this file handles the communication between the browser and the backend database.

---

## 📥 Where It Gets Data
- Goal creation forms (title, description, category, due date).
- Goal status updates (e.g. updating progress to 80% or marking completed).
- Authenticated user ID.

---

## ⚙️ Core Actions Handled
1. **Fetch Goals**: Returns all active and completed goals for the logged-in user.
2. **Create Goal**: Validates and stores a new user goal.
3. **Update Progress**: Adjusts percentage completion and triggers celebration flags when reaching 100%.
4. **Delete Goal**: Removes a goal and cleans up any linked Google Calendar events.

---

## 📤 Where the Output Goes
- Sends live goal lists and status updates back to the Goals and Dashboard screens on the frontend.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This controller exposes the RESTful endpoints for user goals. It handles goal creation, progress updates, filtering by category, and integrates with the goal service to trigger calendar syncing and celebration events."*
