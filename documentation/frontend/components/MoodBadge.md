# MoodBadge.jsx (Emotion Pill & Attention Keyword Tag)

## 📌 What This File Does
This file renders the **color-coded emotional mood pills** attached to journal entries (e.g. 🎯 Focus, 🏆 Accomplishment, ⚡ Breakthrough, ☕ Burnout, 🧘 Gratitude). 

It visually displays the emotion detected by our custom PyTorch neural network, showing the confidence percentage and top keyword triggers when hovered over.

---

## 📥 Where It Gets Data
- Dominant emotion name (e.g. `"focus"`), confidence score, and attention keywords from the backend journal response.

---

## ⚙️ How It Works (Step-by-Step)
1. **Emotion-to-Style Mapping**: Maps each of the 10 emotion classes to custom Tailwind gradients, border accents, and matching emojis.
2. **Interactive Tooltip**: Hovering over the badge reveals the model's confidence level (e.g. *92% confidence*) and the specific words that triggered the emotion.

---

## 📤 Where the Output Goes
- Displayed beside journal cards on the Journal Feed, Dashboard timeline, and Insights history.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This component visually renders the output of our custom PyTorch Emotion Classifier. It displays the emotion category as an aesthetic pill badge with interactive tooltips showing classification confidence and influential attention keywords."*
