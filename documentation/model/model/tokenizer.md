# tokenizer.py (Journal Text Tokenizer)

## 📌 What This File Does
Computers and neural networks cannot directly understand English words like *"motivated"* or *"distracted"*; they only understand numbers. 

This file acts as the **translator** between human language and the neural network. It cleans up user text, expands contractions, splits sentences into individual words (tokens), and replaces each word with a unique numerical ID from a saved vocabulary dictionary.

---

## 📥 Where It Gets Data
- **During Training**: Scans the entire training dataset to find all unique words and build a vocabulary list.
- **During Prediction**: Reads user journal sentences and references `weights/vocabulary.json`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Lowercasing & Normalization**: Converts all text to lowercase and strips unnecessary punctuation or weird symbols.
2. **Contraction Expansion**: Expands common English abbreviations so the model grasps the full sentiment (e.g., *"can't"* $\rightarrow$ *"cannot"*, *"won't"* $\rightarrow$ *"will not"*, *"didn't"* $\rightarrow$ *"did not"*).
3. **Special Tokens**: Reserves special IDs:
   - `<PAD>` (ID `0`): Used to pad shorter sentences to a fixed length.
   - `<UNK>` (ID `1`): Assigned to any rare or unseen word not in the vocabulary dictionary.
4. **Sequence Truncation & Padding**: Ensures every journal sentence fits a standard sequence length (e.g. 80 tokens maximum), chopping off excessive text or adding padding zeros.
5. **Vocabulary Saving & Loading**: Saves the vocabulary mapping into `vocabulary.json` so the exact same word-to-ID numbering is preserved during production inference.

---

## 📤 Where the Output Goes
- Converts any English text string into a fixed-length list of integers (e.g., `[45, 128, 2, 701, 0, 0, ...]`) ready for PyTorch tensor computation.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This is our custom NLP preprocessor and tokenizer. It cleans text, expands negative contractions to preserve sentiment meaning, and indexes words into integers using our saved 10,000-word vocabulary dictionary."*
