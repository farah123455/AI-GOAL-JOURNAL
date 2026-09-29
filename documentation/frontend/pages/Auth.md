# Auth.jsx, Login.jsx & Register.jsx (User Authentication Screens)

## 📌 What These Files Do
These screens handle the **login and sign-up user experience**. They provide modern, beautiful forms for users to sign into existing accounts, create a new profile with email/password, or use instant One-Click Google Authentication.

---

## 📥 Where It Gets Data
- User credentials entered in form inputs (email, password, display name).
- Google OAuth popup flow from `authService.js`.

---

## ⚙️ How It Works (Step-by-Step)
1. **Form Validation**: Checks for valid email syntax and secure password length before submitting.
2. **Firebase Auth Integration**: Calls `loginWithEmail` or `registerWithEmail`.
3. **Google Sign-In Button**: Triggers `loginWithGoogle()` with branded Google UI.
4. **Backend Profile Provisioning**: Once Firebase confirms the login, it calls the backend `/sync` endpoint to ensure the user exists in PostgreSQL.
5. **Auto Redirect**: Smoothly navigates the user to `/dashboard` upon successful authentication.

---

## 📤 Where the Output Goes
- Rendered at `/login`, `/register`, or `/auth`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"These components manage the authentication user flows. They interface with Firebase Auth for email/password and Google OAuth, handle client validation, and trigger backend user profile synchronization before redirecting to the dashboard."*
