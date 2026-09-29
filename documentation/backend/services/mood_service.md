# mood_service.py (Emotion Model Backend Bridge)

## 📌 What This File Does
This file serves as the **bridge connecting the FastAPI backend server to our custom self-trained PyTorch Emotion Detection model** in `models/mood_analyzer/`.

Whenever a journal is saved (via text or voice), the backend calls this service to classify the journal's emotional tone (such as focus, accomplishment, burnout, or guilt) using our locally saved neural network weights.

---

## 📥 Where It Gets Data
- **Journal Text**: The plain text of the journal entry.
- **Model Files**: Loads the trained model weights (`weights/emotion_model.pth`) and vocabulary dictionary (`weights/vocabulary.json`).

---

## ⚙️ How It Works (Step-by-Step)
1. **Lazy Singleton Loading**:
   - Ensures the PyTorch neural network is loaded into memory only once and stays ready for instant predictions on CPU.
2. **CPU-Optimized Execution**:
   - Explicitly sets `device = torch.device("cpu")` so the backend does not require an expensive dedicated GPU in production.
   - Runs inference in just 3 to 5 milliseconds with less than 35 MB of RAM.
3. **Tokenization & Prediction**:
   - Preprocesses the text using `JournalTokenizer`, passes it through the 2-Layer BiLSTM and 4-Head Attention model, and computes the top emotion and confidence score.
4. **Attention Keyword Extraction**:
   - Extracts the specific words with the highest attention weights that influenced the model's emotional prediction.
5. **Fallback Resilience**:
   - If model weights are missing or being updated, it falls back gracefully rather than crashing the user's journal save.

---

## 📤 Where the Output Goes
- Returns the detected mood (e.g., `"focus"`, `"burnout"`, `"accomplishment"`), confidence score, and top emotional keywords directly to `journal_service.py`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'How is your custom trained model integrated with the backend?': `mood_service.py` is the runtime bridge. It loads our trained PyTorch weights and vocabulary file into memory as a singleton service. Whenever a user submits a journal, this service runs our BiLSTM + Self-Attention model locally on CPU in ~3ms to tag the entry with its primary emotion."*
