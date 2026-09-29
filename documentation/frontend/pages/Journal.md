# Journal.jsx (Interactive Journaling & Voice Entry Screen)

## 📌 What This File Does
This is the **heart of the daily reflection experience**. It gives users a clean, distraction-free space to capture their daily thoughts, study progress, or work challenges—either by typing on the keyboard or speaking directly into the microphone.

As soon as an entry is saved, this page displays the instant results: the detected emotional mood badge, newly extracted goals, finished tasks, and any blockers identified by the AI.

---

## 📥 Where It Gets Data
- User typed text or recorded audio from `VoiceRecorder.jsx`.
- Past journal entries list from `DataContext`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Dual Entry Modes (Text & Voice)**:
   - **Text Mode**: Full-featured text area with distraction-free focus mode and word counts.
   - **Voice Mode**: Microphone recorder with real-time waveform and recording timer.
2. **Instant AI Feedback Banner**:
   - Once submitted, it displays an immediate breakdown showing:
     - 🎭 Emotion classification pill (e.g., *Focus 94%*).
     - 🎯 Proposed new goals ready for user approval.
     - 🚧 Identified blockers and friction points.
3. **Journal History Timeline**:
   - Scrollable feed of previous entries with date filters, search, and emotion tags.

---

## 📤 Where the Output Goes
- Submits data to `/api/v1/journals`, updates global cache in `DataContext`, and adds new goals to the Goals list.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This is the primary user interface for daily journaling. It seamlessly supports both text and voice entries, triggers speech transcription and emotion classification, and immediately displays extracted goals and blockers for user confirmation."*
