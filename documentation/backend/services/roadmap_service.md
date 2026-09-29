# roadmap_service.py (AI-Generated Execution Roadmaps)

## 📌 What This File Does
Big ambitious goals (like *"Become a Full-Stack Developer"* or *"Prepare for Campus Placements"*) can feel overwhelming. 

This file uses AI to take a user's large, overarching goal and break it down into a **multi-stage, phased execution roadmap**. Each phase contains manageable milestones, realistic timelines, and specific checkable steps.

---

## 📥 Where It Gets Data
- **Goal Statement**: The target objective and desired timeline provided by the user.
- **Gemini AI**: Generates the logical step-by-step breakdown.
- **PostgreSQL**: Stores the resulting roadmap structure.

---

## ⚙️ How It Works (Step-by-Step)
1. **Curates Prompt Context**: Asks the LLM to structure the goal into progressive phases (e.g. Phase 1: Foundations, Phase 2: Core Projects, Phase 3: Advanced Optimization).
2. **Schema Validation**: Validates the AI response against strict Pydantic models (`RoadmapResponse`, `Milestone`) to guarantee clean JSON.
3. **Storage & Task Linking**: Saves the roadmap in PostgreSQL, allowing the user to mark individual milestones as completed as they make progress.
4. **Mock Fallback Support**: Includes high-quality fallback roadmaps so users can preview sample roadmaps even when offline or testing without an API key.

---

## 📤 Where the Output Goes
- Powers the interactive visual Roadmap page on the frontend, with timeline steps, celebratory completion confetti, and progress bars.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"In `roadmap_service.py`, our AI decomposes vague, high-level ambitions into actionable phased roadmaps with concrete milestones and deadlines, turning intimidating goals into an organized execution plan."*
