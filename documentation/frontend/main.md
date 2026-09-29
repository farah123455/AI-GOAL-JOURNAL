# main.jsx (React Web Application Bootstrapper)

## 📌 What This File Does
This file is the **starting spark of the frontend application**. When you open the web app in your browser, this file runs first. It finds the HTML root element on the webpage and mounts the entire React component hierarchy into the browser's Document Object Model (DOM).

---

## 📥 Where It Gets Data
- Connects to the root `<div id="root">` inside `index.html`.
- Loads global stylesheets (`index.css`), Tailwind CSS styles, and typography fonts.

---

## ⚙️ How It Works (Step-by-Step)
1. **React 18 Concurrent Root**: Uses `ReactDOM.createRoot` for fast modern React rendering.
2. **Context Provider Wrapping**: Wraps the core application with `AuthContextProvider` and `DataContextProvider` so every page has access to user login state and live goal data.
3. **Mounts App**: Renders the master `<App />` component.

---

## 📤 Where the Output Goes
- Displays the interactive web app in the user's browser.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This is the standard React 18 client entry point. It loads our global Tailwind styles, sets up top-level state providers, and mounts the application into the root DOM container."*
