# authService.js (Authentication & Account Operations)

## 📌 What This File Does
This file contains the **methods for signing in, signing up, resetting passwords, and signing out**. It directly communicates with the Firebase Authentication SDK in the browser.

---

## 📥 Where It Gets Data
- Email, password, and Google OAuth credentials submitted via login/register forms.

---

## ⚙️ Key Methods Provided
1. **`loginWithEmail(email, password)`**: Signs in an existing user with Firebase.
2. **`registerWithEmail(email, password, displayName)`**: Registers a new user account and sets their initial display name.
3. **`loginWithGoogle()`**: Launches Google's one-click login popup.
4. **`logoutUser()`**: Signs out the current user and clears local session tokens.
5. **`resetPassword(email)`**: Sends an automated password recovery link to the user's email.

---

## 📤 Where the Output Goes
- Returns Firebase user credentials to `AuthContext.jsx`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This service abstracts the Firebase Authentication client methods, offering clean functions for email/password authentication, Google OAuth sign-in, password resets, and session termination."*
