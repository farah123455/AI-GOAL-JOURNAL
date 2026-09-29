# build_10_class_dataset.py (Dataset Preparation & Data Engineering)

## 📌 What This File Does
This is the **data engineering script** that created the master training dataset. It took raw emotion datasets (which only had generic emotions like joy or anger) and transformed them into 10 nuanced, goal-oriented categories (like focus, burnout, guilt, breakthrough, and accomplishment).

It blends general text samples with authentic goal-setting and personal reflection sentences to make the dataset represent real daily journaling.

---

## 📥 Where It Gets Data
- **Raw Kaggle / Academic Emotion Datasets**: Found in `training/data/raw/`.
- **Domain-Specific Journal Samples**: Authentic sentences found in `training/data/domain_journal_samples.csv` covering study sessions, gym workouts, software engineering sprints, exam preparation, and daily habits.

---

## ⚙️ How It Works (Step-by-Step)
1. **Label Mapping & Filtering**: Re-maps generic emotions into productivity states (e.g. mapping feelings of overwhelm, stress, and anxiety into *"overwhelmed"* or *"burnout"*).
2. **Domain Augmentation**: Injects specialized phrases commonly typed in productivity apps (e.g. *"pomodoro"*, *"hit my step goal"*, *"wasted time scrolling TikTok"*, *"solved 5 LeetCode problems"*).
3. **Deduplication & Quality Cleaning**: Removes empty lines, duplicate sentences, and noisy text.
4. **Stratified Splitting**: Splits the clean data into three distinct sets while keeping class proportions equal:
   - **Training Set (80%)**: ~16,979 examples to teach the model.
   - **Validation Set (10%)**: ~2,023 examples to evaluate tuning during training.
   - **Test Set (10%)**: ~2,000 examples for final unbiased testing.

---

## 📤 Where the Output Goes
- Outputs `GoalEmotion_10_Classes_Kaggle.csv` (over 21,000 rows ready for Kaggle) and the three split files in `training/data/processed/`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"If asked 'Where did you get your dataset?': We created a specialized 21,000+ sample goal journaling dataset. This script merges standard NLP emotion corpora with domain-specific productivity and habit reflection samples, balancing all 10 emotion classes and splitting them into clean train, validation, and test sets."*
