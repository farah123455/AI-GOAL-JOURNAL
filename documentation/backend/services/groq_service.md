# groq_service.py (High-Speed LLM Inference & Failover Service)

## 📌 What This File Does
This file provides **lightning-fast backup LLM capabilities using Groq's LPU (Language Processing Unit) hardware**.

If Google Gemini ever experiences high latency, rate limits, or network downtime, this service steps in to process coaching chats and text analysis in fractions of a second (often under 300 milliseconds), guaranteeing that the app never feels slow or unresponsive.

---

## 📥 Where It Gets Data
- **User Messages & Prompts**: Conversation history and coaching questions from the user.
- **Groq API Key**: Loaded securely from `config.py` (`settings.GROQ_API_KEY`).

---

## ⚙️ How It Works (Step-by-Step)
1. **Initializes Groq Client**: Connects to Groq's high-speed inference engine using models like `llama-3.3-70b-versatile` or `mixtral-8x7b-32768`.
2. **Streaming & Non-Streaming Completions**: Supports rapid responses for the AI Coach conversation page.
3. **Structured Fallback**: Can parse JSON structured outputs just like Gemini in case of primary API outages.

---

## 📤 Where the Output Goes
- Delivers rapid conversational responses back to the AI Coach chat endpoint (`backend/app/api/v1/coach.py`).

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"We implemented high-availability AI architecture. In `groq_service.py`, we utilize Groq's ultra-low-latency LPU chips as a fast conversational coach and failover provider, ensuring our platform maintains sub-second responsiveness even during peak traffic."*
