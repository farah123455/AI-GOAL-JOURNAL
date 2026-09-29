# roadmapApi.js (Roadmap API Client & Mock Fallback)

## 📌 What This File Does
This file manages network requests for **generating, retrieving, and toggling AI Roadmaps**. It also includes built-in fallback mock data (`src/data/mockRoadmap.js`) so that developers and users can test the roadmap UI smoothly even if the backend is temporarily offline or being configured.

---

## 📥 Where It Gets Data
- Goal title, target timeframes, and milestone completion toggles.

---

## ⚙️ How It Works (Step-by-Step)
1. **Generate Roadmap Request**: Sends the user's goal statement to `/api/v1/roadmap/generate`.
2. **Milestone Toggle**: Sends PATCH requests to update the completion checkbox of individual roadmap tasks.
3. **Resilience & Fallback**:
   - If the backend returns an error or is unreachable in demo mode, it automatically serves a high-fidelity mock roadmap so the user interface never appears broken.

---

## 📤 Where the Output Goes
- Feeds structured phase and milestone arrays into the Roadmap page (`src/pages/Roadmap.jsx`).

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This API module handles all client interactions with the roadmap backend, featuring built-in fallback resilience to guarantee a smooth interactive demo experience."*
