# dataset.py (Dataset Loader & Emotion Mapping)

## 📌 What This File Does
This file is the **data feeder** for training the deep learning model. It converts raw CSV files containing text journals and emotion labels into organized mathematical tensors that PyTorch can easily process in batches during training and validation.

It also defines the official **10 Emotion Classes** tailored specifically for personal development and goal accountability.

---

## 🎭 The 10 Goal Journaling Emotion Classes

| Emotion | Real-Life Journal Meaning |
| :--- | :--- |
| **`accomplishment`** | Completing assignments, hitting targets, shipping features, finishing tasks. |
| **`motivation`** | High energy to start new habits, excitement to tackle priorities. |
| **`focus`** | Entering deep work flow state, studying for hours without distraction. |
| **`gratitude`** | Appreciation for personal growth, mentors, peaceful reflection. |
| **`breakthrough`** | Sudden lightbulb moments, solving difficult bugs or roadblocks. |
| **`burnout`** | Exhaustion from long study/work hours, cognitive fatigue, brain fog. |
| **`overwhelmed`** | Approaching deadlines, too many tasks at once, exam stress. |
| **`frustration`** | Blocked by bugs, interrupted flow, slow progress, tool issues. |
| **`guilt`** | Regret over procrastination, breaking habit streaks, wasted screen time. |
| **`neutral`** | Standard daily logs, objective routine checks without strong emotion. |

---

## 📥 Where It Gets Data
- Reads structured CSV files containing two main columns: `text` (the journal text) and `emotion` or `label` (the emotion category).
- Uses the project's `JournalTokenizer` to convert raw text into numerical token lists.

---

## ⚙️ How It Works (Step-by-Step)
1. **Maps Labels to Numbers**: Converts text emotions (like `"accomplishment"`) into integers from `0` to `9`.
2. **PyTorch Dataset (`EmotionDataset`)**: Encapsulates each entry so PyTorch can index through thousands of rows quickly.
3. **Smart Batch Padding (`collate_batch`)**: Since journal entries have different sentence lengths, this function pads shorter sentences with zeros (`<PAD>`) so they can be grouped into uniform batches for GPU/CPU training.
4. **DataLoaders**: Shuffles the data during training and splits it into mini-batches (e.g. 32 or 64 samples at a time).

---

## 📤 Where the Output Goes
- Feeds cleanly formatted batches of input IDs and target labels directly into the training loop inside `train.py`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"Instead of generic sentiment (positive/negative), our dataset handler defines 10 domain-specific emotional classes specifically designed for productivity and goal journaling—such as focus, burnout, guilt, and breakthrough. It prepares and pads the batches for PyTorch training."*
