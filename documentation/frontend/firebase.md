# firebase.js (Firebase Client Initialization & Auth Bridge)

## 📌 What This File Does
This file initializes the **Firebase Client SDK in the browser**. It connects the frontend with Google Firebase Authentication so users can sign up with email/password or use One-Click "Sign in with Google".

---

## 📥 Where It Gets Data
- Frontend environment variables (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, etc.).

---

## ⚙️ How It Works (Step-by-Step)
1. **Initializes Firebase App**: Boots up the connection with the user's specific Firebase project.
2. **Exports Auth Instance**: Sets up and exports `auth` using `getAuth()`.
3. **Google Auth Provider**: Configures the `GoogleAuthProvider` for quick popup or redirect Google logins.

---

## 📤 Where the Output Goes
- Used by `AuthContext.jsx` and `authService.js` to manage login, signout, and token retrieval.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This file initializes the client-side Firebase SDK using Vite environment variables, providing the authentication instance for email/password and Google OAuth sign-in."*
