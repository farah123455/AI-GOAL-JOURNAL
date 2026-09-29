# gemini_service.py (LLM Reasoning & Goal Extraction Engine)

## 📌 What This File Does
This file is the **AI brain of the entire application**. While humans write journals in unstructured, emotional stories (e.g. *"I finally finished chapter 4 of operating systems, but I couldn't understand page replacement algorithms and got distracted for an hour"*), this file uses Google's Gemini Large Language Model (LLM) to read that story and extract structured, actionable productivity data.

It identifies:
- New goals the user wants to achieve.
- Completed tasks and activities.
- Obstacles or blockers preventing progress.
- Multi-step roadmaps.
- Personalized coaching recommendations.

---

## 📥 Where It Gets Data
- **Journal Text**: The plain English journal written or spoken by the user.
- **System Prompts**: Structured instructions from `backend/app/prompts/journal_extraction.py`.
- **Existing User Goals**: Context on what the user was previously working on to detect progress updates.

---

## ⚙️ How It Works (Step-by-Step)
1. **Prompt Engineering & Context Injection**:
   - Constructs a prompt containing the user's journal, today's date, and strict JSON formatting rules.
2. **Calling the Gemini API**:
   - Sends the prompt to Google Gemini (`gemini-2.0-flash` or `gemini-1.5-flash`) via the modern `google-genai` SDK.
3. **Structured Extraction**:
   - Extracts:
     - `goals`: Clear, actionable goals with target deadlines and categories.
     - `completed_activities`: Concrete achievements finished today.
     - `blockers`: Distractions, technical bugs, fatigue, or confusion mentioned by the user.
4. **Self-Healing & Repair Loops**:
   - If the AI returns malformed JSON or invalid dates, this file triggers an automatic **Repair Prompt** (`REPAIR_PROMPT_TEMPLATE`), asking the model to fix its response without failing the user's request.
5. **Smart Date Normalization**:
   - Parses casual human date expressions like *"tomorrow"*, *"next Friday"*, *"by 15th of this month"*, or *"in 3 days"* into standardized calendar dates (`YYYY-MM-DD`).

---

## 📤 Where the Output Goes
- Returns validated Pydantic models (`ExtractionResult`, `RoadmapResponse`) used by `journal_service.py` to populate user goal dashboards, progress charts, and calendar invites.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'Where is the generative AI handled?': In `gemini_service.py`. We use Google's Gemini API with structured prompting to parse free-form text into strict JSON. It extracts newly set goals, completed tasks, and blockers, and normalizes natural-language deadlines like 'tomorrow' into ISO dates. It also includes self-healing retry logic to guarantee 100% schema validation."*
