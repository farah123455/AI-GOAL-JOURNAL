# whisper_service.py (Voice Audio Transcription Service)

## 📌 What This File Does
This file is the **ears of the application**. When a user records a voice journal on their phone or laptop microphone instead of typing, this file takes that raw audio file and turns it into readable English text in seconds.

It uses **Faster-Whisper** (a high-performance, optimized version of OpenAI's Whisper model) that runs locally on the server.

---

## 📥 Where It Gets Data
- **Audio Bytes**: Receives the raw recorded audio stream sent from the frontend browser (usually in `.webm`, `.wav`, or `.mp3` format).
- **Settings**: Reads model configurations from `config.py` (e.g. model size `"tiny"` or `"base"`, CPU vs. GPU device, and 8-bit integer quantization).

---

## ⚙️ How It Works (Step-by-Step)
1. **Singleton & Lazy Loading**:
   - The Whisper model is loaded into memory only once when the server boots or on the first voice call. This prevents re-loading the heavy neural network every time an audio file arrives.
2. **Safe Temporary Audio Handling (Privacy First)**:
   - Temporarily writes the audio bytes to an isolated system file to perform acoustic analysis.
   - Immediately wipes and deletes the temporary file as soon as transcription finishes (Zero Audio Persistence guarantee so user voices are never permanently saved to disk).
3. **Speech-to-Text Processing**:
   - Analyzes speech waveforms, filters background noise, and accurately transcribes spoken thoughts into clear sentences.
   - Detects the spoken language and audio duration.
4. **Error Recovery**:
   - If the audio is silent or corrupt, it safely returns an empty transcription rather than crashing the server.

---

## 📤 Where the Output Goes
- Returns a 3-part result:
  - **`transcription`**: The full text transcript of what the user said.
  - **`duration`**: The length of the recording in seconds.
  - **`language`**: Detected language (e.g. `"en"`).
- This text is immediately passed to:
  1. `mood_service.py` to detect the emotion of what was said.
  2. `gemini_service.py` to extract goals and tasks mentioned in the speech.
  3. `crypto.py` to encrypt the text before saving it to PostgreSQL.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'How does voice journaling work?': When the user finishes recording their voice in the browser, the audio is sent to `whisper_service.py`. We run an optimized local Faster-Whisper model that transcribes speech into text in near real-time. For user privacy, the audio bytes are discarded immediately after transcription so raw voice recordings are never stored on disk."*
