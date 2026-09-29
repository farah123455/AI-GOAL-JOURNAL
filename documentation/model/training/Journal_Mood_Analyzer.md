# Journal_Mood_Analyzer.ipynb (Interactive Jupyter / Colab Training Notebook)

## 📌 What This File Does
This is an **interactive Jupyter Notebook** that allows anyone to train, experiment with, and evaluate the emotion analyzer model step-by-step, either in Google Colab (with free cloud GPUs) or in local Jupyter.

It contains interactive charts, loss curves, confusion matrices, and quick test cells to type a custom journal sentence and immediately see how the trained model responds.

---

## 📥 Where It Gets Data
- Connects directly to Google Drive or local storage to pull the 10-class dataset (`GoalEmotion_10_Classes_Kaggle.csv`).

---

## ⚙️ What's Inside the Notebook
1. **Environment Setup**: One-click cell to install PyTorch and dependencies.
2. **Data Exploration & Visualizations**: Bar graphs showing the distribution of the 10 emotion classes to verify data balance.
3. **Interactive Model Training**: Runs the training loop while displaying live progress bars and loss reduction graphs epoch-by-epoch.
4. **Performance Evaluation**:
   - Generates a full **Confusion Matrix** showing which emotions the model gets right and where it gets confused.
   - Computes precision, recall, and F1-score for each emotion category.
5. **Live Interactive Testing Playground**: A dedicated cell where you can type any text (e.g., *"I studied 4 hours of DSA and solved 3 hard questions, feeling unstoppable!"*) and see the model predict `"accomplishment"` with attention highlights.

---

## 📤 Where the Output Goes
- Exports the final trained model weights (`emotion_model.pth`) directly to Google Drive or the local project directory.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This notebook is our interactive experimentation environment. If an evaluator asks for a visual demonstration of how the model was trained, we can open this notebook in Google Colab to show the training curves, confusion matrix, and test live predictions in real-time."*
