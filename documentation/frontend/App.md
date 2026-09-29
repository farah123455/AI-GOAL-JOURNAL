# App.jsx (Master Client Router & Page Navigation)

## 📌 What This File Does
This file is the **switchboard and roadmap of the web app**. It defines all the different screens/pages in the application and decides which page to display based on the URL in the browser (e.g. `/journal`, `/dashboard`, `/goals`, `/coach`, `/roadmap`).

It also enforces **Route Protection**, ensuring that sensitive pages (like private journals and roadmaps) are inaccessible unless a user is authenticated.

---

## 📥 Where It Gets Data
- Browser URL location bar.
- User authentication status from `AuthContext`.

---

## ⚙️ How It Works (Step-by-Step)
1. **React Router Setup**: Implements client-side routing using `BrowserRouter`, `Routes`, and `Route`.
2. **Public vs. Protected Routes**:
   - **Public Pages**: Landing page (`/`), Login (`/login`), and Registration (`/register`).
   - **Protected Pages**: Wrapped in `<ProtectedRoute>` (Dashboard, Journal, Goals, AiCoach, Roadmap, Habits, Calendar, Insights). If an unauthenticated user tries to visit `/journal`, they are automatically redirected to the login screen.
3. **App Shell Layout**: Renders the persistent sidebar and top navigation bar on internal pages so users can switch between views seamlessly.

---

## 📤 Where the Output Goes
- Renders the selected page layout onto the screen.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This file defines our client-side routing hierarchy using React Router. It sets up route guards to protect authenticated dashboard views and manages smooth transitions between pages."*
