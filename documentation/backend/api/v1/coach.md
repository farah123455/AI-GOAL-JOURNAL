# coach.py (AI Accountability Coach Chat Handler)

## 📌 What This File Does
This file powers the **interactive AI Coach chat experience**. When a user opens the "AI Coach" page and asks for advice (e.g. *"I'm feeling really behind on my placement preparation, what should I focus on?"*), this file handles the conversation, injects the user's recent goals and mood history as background context, and returns empathetic, personalized coaching feedback.

---

## 📥 Where It Gets Data
- **User Chat Messages**: The question or reflection typed by the user.
- **User Context**: The user's recent goals, active blockers, and latest emotional moods fetched from the database to give the AI context on the user's real situation.

---

## ⚙️ Core Actions Handled
1. **Context-Aware Prompting**: Blends the user's chat message with their real goal progress and emotional state so the coach isn't answering blindly.
2. **AI Provider Routing**: Sends the conversation to Gemini (or Groq for ultra-low latency).
3. **Structured & Safe Responses**: Formats the coach's answer into actionable bullet points, practical daily steps, and positive reinforcement.

---

## 📤 Where the Output Goes
- Delivers real-time chat messages to the AiCoach frontend interface.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This endpoint manages the AI Coach chat. Unlike a generic chatbot, it enriches the conversation with the user's real goal data, habit history, and emotional state from PostgreSQL so the advice is genuinely personalized and context-aware."*
