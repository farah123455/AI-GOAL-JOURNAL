# roadmap.py (AI Roadmap Generation & Tracking Route Handler)

## 📌 What This File Does
This file exposes the endpoints for **generating and interacting with AI Roadmaps**. When a user types a broad goal (e.g. *"Learn Machine Learning in 3 months"*), this file initiates the AI generation workflow and delivers the multi-phase roadmap back to the user.

---

## 📥 Where It Gets Data
- User's goal prompt and timeline preferences.
- Authenticated user ID.

---

## ⚙️ Core Actions Handled
1. **Generate Roadmap**: Calls `roadmap_service.py` to prompt Gemini for a structured phase-by-phase execution plan.
2. **Fetch User Roadmaps**: Retrieves previously created roadmaps so users can resume their journey.
3. **Toggle Milestone Progress**: Updates the completion state of individual roadmap steps and triggers progress recalculation.

---

## 📤 Where the Output Goes
- Powers the interactive Roadmap view on the frontend, rendering milestones, checkboxes, and milestone celebration animations.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This API router handles AI roadmap generation and milestone tracking. It allows users to prompt the AI for structured multi-phase plans and track milestone completion step-by-step."*
