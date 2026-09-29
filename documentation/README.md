# Project Documentation & Architecture Guide

Welcome to the plain-English guide for the **AI Goal Journal & Accountability Coach** project.

This directory contains human-explainable documentation for all important files in the repository. Instead of complex technical jargon or raw API endpoint lists, each file is described by **what it actually does**, **where it receives data from**, **how it processes that information**, and **how to explain it to an evaluator or client**.

---

## 🗂️ How This Documentation is Organized

The documentation mirrors the three main pillars of the codebase:

1. **[`model/`](./model/)** — Custom AI & Deep Learning Model (The PyTorch Mood & Emotion Analyzer)
   - Covers where the model was trained, the neural network architecture, dataset engineering, tokenization, and local CPU inference.
2. **[`backend/`](./backend/)** — Server, Core Services & AI Orchestration (FastAPI & Python)
   - Covers audio transcription (Whisper), AI goal/blocker extraction (Gemini), AES journal encryption, database storage (PostgreSQL), and business engines (habits, productivity scoring, Google Calendar).
3. **[`frontend/`](./frontend/)** — Web User Interface (React + Vite + Tailwind CSS)
   - Covers user pages (Journal, Dashboard, AI Coach, Roadmap), browser voice recording, real-time feedback, and authentication.

---

## 🎯 Quick Cheat Sheet: The Most Frequently Asked Questions

| If an Evaluator Asks: | Point To These Documentation Files: |
| :--- | :--- |
| **"Where did you train the custom AI model?"** | [`model/training/train.md`](./model/training/train.md) & [`model/training/Journal_Mood_Analyzer.md`](./model/training/Journal_Mood_Analyzer.md) |
| **"What is the architecture of your neural network?"** | [`model/model/architecture.md`](./model/model/architecture.md) |
| **"Where do you handle voice recordings and speech-to-text?"** | [`backend/services/whisper_service.md`](./backend/services/whisper_service.md) & [`frontend/components/VoiceRecorder.md`](./frontend/components/VoiceRecorder.md) |
| **"Where does AI extract goals, blockers, and progress?"** | [`backend/services/gemini_service.md`](./backend/services/gemini_service.md) & [`backend/prompts/journal_extraction.md`](./backend/prompts/journal_extraction.md) |
| **"How do you keep users' private journals secure?"** | [`backend/core/crypto.md`](./backend/core/crypto.md) & [`backend/services/encryption_service.md`](./backend/services/encryption_service.md) |
| **"Where is user authentication handled?"** | [`backend/core/auth.md`](./backend/core/auth.md) & [`frontend/context/AuthContext.md`](./frontend/context/AuthContext.md) |
| **"How are productivity and consistency calculated?"** | [`backend/services/productivity_service.md`](./backend/services/productivity_service.md) |
| **"How does Google Calendar synchronization work?"** | [`backend/services/google_calendar_service.md`](./backend/services/google_calendar_service.md) |

---

## 🚀 Navigation
- Browse through any subfolder to find the markdown file matching the exact filename from the repository (e.g. `whisper_service.py` $\rightarrow$ `whisper_service.md`).
