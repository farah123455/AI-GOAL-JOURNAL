# journal_extraction.py (AI Prompt Engineering & System Instructions)

## 📌 What This File Does
This file contains the **expert prompt instructions given to the Gemini AI**. The quality of an AI's output depends directly on how clearly its instructions are written. 

This file defines the system rules that instruct Gemini to act as an empathetic, razor-sharp productivity coach, and specifies the exact JSON format the AI must follow when extracting goals, achievements, and blockers.

---

## 📥 Where It Gets Data
- **User Journal Content**: The text written or dictated by the user.
- **Current Date**: The current date string injected dynamically so the AI knows what date "tomorrow" or "next Monday" refers to.

---

## ⚙️ Key Instructions Given to the AI
1. **Goal Extraction Rules**:
   - Only extract actionable, specific goals (e.g. *"Complete DSA assignment on trees by Friday"*).
   - Ignore vague wishes (e.g. *"I wish I had more free time"* is not a goal).
2. **Activity vs. Goal Distinction**:
   - What the user already finished today is marked as a **completed activity**.
   - What the user plans to do in the future is marked as a **goal**.
3. **Blocker & Friction Detection**:
   - Detects technical problems, procrastination triggers, fatigue, or social interruptions and tags them as blockers.
4. **Strict JSON Schema Enforcement**:
   - Explicitly instructs the AI to return raw JSON with keys: `goals`, `completed_activities`, `blockers`, and `sentiment_summary`—with no conversational preamble or markdown fences.

---

## 📤 Where the Output Goes
- Injected directly into the API calls executed by `gemini_service.py`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'How do you prevent the AI from hallucinating or returning bad data?': We use carefully engineered system prompts in `journal_extraction.py`. It clearly differentiates completed past actions from forward-looking goals, enforces ISO date resolution, and mandates strict JSON responses adhering to our backend schema."*
