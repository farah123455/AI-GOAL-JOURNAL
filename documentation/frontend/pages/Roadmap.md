# Roadmap.jsx (Phased Execution Roadmap View)

## 📌 What This File Does
This screen allows users to **create and follow comprehensive AI-generated roadmaps** for large-scale ambitions (e.g. *"Become a Data Scientist"*, *"Run a Half Marathon in 6 Months"*). 

It renders a visual milestone timeline showing progressive phases, step-by-step tasks, and overall progress completion.

---

## 📥 Where It Gets Data
- Roadmap structure from `/api/v1/roadmap` or `roadmapApi.js`.
- User goal prompt typed into the Roadmap Generator input.

---

## ⚙️ How It Works (Step-by-Step)
1. **Interactive Roadmap Generator**: Users input their dream goal and target duration, and the AI crafts a tailored multi-stage roadmap.
2. **Visual Phased Timeline**: Displays phases as progressive milestone nodes connected by a timeline line.
3. **Interactive Task Checkboxes**: Checking off tasks updates milestone completion percentages and advances the overall roadmap progress bar.
4. **Celebration Moments**: Finishing a full roadmap triggers `RoadmapCelebration.jsx` with full celebratory animations.

---

## 📤 Where the Output Goes
- Rendered at `/roadmap` for structured, long-term habit and goal execution.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This screen visualizes AI-generated execution roadmaps. It deconstructs multi-month goals into visual phases and checkable milestones, turning intimidating long-term ambitions into an organized step-by-step pathway."*
