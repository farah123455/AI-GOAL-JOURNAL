# CircularProgress.jsx (Animated Radial Progress Ring)

## 📌 What This File Does
This file renders a **circular progress ring** (like the activity rings on smartwatches). It displays percentages from 0% to 100% with smooth animations and dynamic color shifts (e.g. amber for beginning, blue for midway, emerald green for near completion).

---

## 📥 Where It Gets Data
- Any numeric percentage or score (e.g. Goal completion %, Productivity Score out of 100).

---

## ⚙️ How It Works (Step-by-Step)
1. **SVG Circle Geometry**: Uses mathematical SVG stroke-dasharray and stroke-dashoffset to dynamically fill the circle perimeter.
2. **Smooth Spring Animations**: Animates the ring filling up smoothly when the component loads or when progress increases.
3. **Dynamic Threshold Coloring**: Shifts ring colors based on achievement levels.

---

## 📤 Where the Output Goes
- Used across Goal cards, the Dashboard Productivity widget, and Roadmap milestones.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This reusable UI component renders animated SVG radial gauges with dynamic color transitions to represent goal percentages and productivity metrics."*
