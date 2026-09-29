# AiCoach.jsx (AI Accountability Coach & Chat Screen)

## 📌 What This File Does
This screen provides an **interactive chat interface with the user's personal AI Accountability Coach**. 

Unlike a generic chat window, the AI coach on this screen already knows the user's active goals, habit streaks, recent journal struggles, and emotional state. When a user asks for advice on staying motivated or managing heavy workloads, the coach gives hyper-personalized, practical suggestions.

---

## 📥 Where It Gets Data
- Chat input typed by the user.
- Chat history stream from `/api/v1/coach`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Context Banner**: Displays a summary of the context the AI is using (e.g. *"Currently tracking 4 goals, 2 active blockers"*).
2. **Suggested Prompt Chips**: Provides one-click conversation starters like *"Why am I feeling burned out this week?"*, *"Help me plan tomorrow's study block"*, or *"How can I beat procrastination today?"*.
3. **Formatted Message Rendering**: Uses `FormattedChatMessage.jsx` to render formatted markdown, bulleted action items, and highlighted advice cleanly.
4. **Fast Response Indicator**: Shows an animated typing indicator while Gemini or Groq generates the response.

---

## 📤 Where the Output Goes
- Renders the interactive conversation thread at `/coach`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This page provides a personalized conversational coaching experience. The AI coach references the user's real goals and emotional history to deliver actionable, tailored accountability advice rather than generic canned answers."*
