# AuthContext.jsx (Global Authentication State Provider)

## 📌 What This File Does
This file maintains the **login state of the user across the entire frontend app**. Instead of every page having to repeatedly ask Firebase *"Is someone logged in?"*, this file listens for auth changes once and shares the user's login info, profile details, and auth tokens with any component that needs it.

---

## 📥 Where It Gets Data
- `onAuthStateChanged` listener from Firebase.
- Profile synchronization responses from the backend `/api/v1/users/sync`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Persistent Auth Listening**: Listens to Firebase auth events (login, logout, token refresh).
2. **Backend Profile Syncing**: When a user logs in, it calls the backend `/sync` endpoint to ensure the user's database profile is ready in PostgreSQL.
3. **Token Management**: Retrieves the latest Firebase ID token and attaches it to outgoing backend API requests.
4. **Convenience Hooks (`useAuth`)**: Exposes functions like `login`, `register`, `loginWithGoogle`, and `logout` to any UI button with a single line of code.

---

## 📤 Where the Output Goes
- Supplies `user`, `loading`, `token`, and auth methods to the entire component tree.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This is our React Context for authentication. It listens for Firebase auth state changes, synchronizes user profiles with PostgreSQL on login, and provides a custom `useAuth()` hook for components to access user identity and auth tokens."*
