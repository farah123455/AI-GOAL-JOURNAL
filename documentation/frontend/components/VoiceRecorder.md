# VoiceRecorder.jsx (In-Browser Microphone Audio Recorder)

## 📌 What This File Does
This file is the **voice recording studio right inside the user's browser**. When someone clicks the microphone icon to record a voice journal, this component requests permission to use their microphone, captures the live audio, displays an animated recording timer and waveform, and bundles the audio into a clean file ready for backend Whisper transcription.

---

## 📥 Where It Gets Data
- **User Microphone**: Captures the audio stream via the browser's native `navigator.mediaDevices.getUserMedia` Web API.

---

## ⚙️ How It Works (Step-by-Step)
1. **Microphone Permissions**: Safely prompts the user for browser microphone access.
2. **MediaRecorder Web API**:
   - Records the incoming audio in modern compressed web audio formats (e.g. `audio/webm;codecs=opus`).
   - Collects audio chunks into an in-memory array as the user speaks.
3. **Recording Timer & Visualizer**:
   - Displays live recording duration (minutes and seconds).
   - Animates a pulsing visual indicator to give visual feedback that audio is actively being captured.
4. **Stop & Package**:
   - When the user hits stop, it combines all audio chunks into a single `Blob` (binary audio file).
   - Passes the file to the journal submission pipeline so it can be uploaded to `whisper_service.py` on the backend.
5. **Reset & Cancel**:
   - Allows users to cancel or re-record their entry if they made a mistake.

---

## 📤 Where the Output Goes
- Hands the final audio `Blob` to `Journal.jsx` and `api.js` to send to the backend for speech-to-text processing.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'How do you record voice in the browser?': `VoiceRecorder.jsx` uses the browser's native HTML5 `MediaRecorder` API. It records audio via the microphone into a WebM Opus audio blob with live visual feedback, and forwards that audio blob to our backend Whisper service for transcription."*
