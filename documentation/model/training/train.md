# train.py (Model Training Pipeline)

## 📌 What This File Does
This file is the **main engine that trained the custom Emotion Neural Network**. It takes thousands of labeled goal journal entries, feeds them repeatedly through the model, computes how far off the predictions are (the error/loss), and adjusts the model's internal neural weights so it becomes progressively smarter at recognizing emotions.

It can be run locally via terminal or in cloud servers with GPU acceleration.

---

## 📥 Where It Gets Data
- **Datasets**: Reads the processed training, validation, and test CSV files from `training/data/processed/` (over 21,000 labeled journal examples).
- **Hyperparameters**: Settings like learning rate (e.g., `0.001`), batch size (`64`), number of training cycles/epochs (`10` to `15`), and dropout rates.

---

## ⚙️ How It Works (Step-by-Step)
1. **Vocabulary Building**: Scans all training texts and creates the word vocabulary list.
2. **Class Imbalance Balancing**: Calculates inverse class weights. If some emotions have fewer examples in the dataset (like *"breakthrough"* vs. *"neutral"*), it penalizes the model more heavily for getting rare emotions wrong so every emotion is learned fairly.
3. **Loss Function & Optimizer**:
   - Uses **CrossEntropyLoss** with class weights to measure prediction error.
   - Uses the **AdamW optimizer** with weight decay to update network parameters smoothly without overfitting.
4. **Learning Rate Scheduler**: Gradually decreases the learning rate as training progresses (Cosine Annealing) to fine-tune the weights near the end.
5. **Validation & Checkpointing**:
   - At the end of every epoch, tests the model on unseen validation data.
   - Evaluates accuracy and macro F1-score.
   - Whenever a new high validation score is reached, it saves the model weights to `weights/emotion_model.pth`.

---

## 📤 Where the Output Goes
- Generates and saves three production artifacts in `weights/`:
  - `emotion_model.pth`: The final trained binary weights (~9.5 MB).
  - `vocabulary.json`: The word-to-index mapping dictionary.
  - `label_mapping.json`: Mapping between emotion names and IDs.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'Where did you train your model?': We trained it using `train.py`. It uses PyTorch, AdamW optimizer, and class-weighted Cross-Entropy loss over 21,000+ domain-specific goal journal entries across 10 classes. The best performing checkpoint is saved automatically as `emotion_model.pth`."*
