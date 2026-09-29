# users.py (User Profile & Account Sync Route Handler)

## 📌 What This File Does
This file handles **user onboarding, profile management, and synchronization between Firebase Auth and PostgreSQL**. 

When a user signs in for the first time via Google or email, this file makes sure an account record is automatically provisioned in PostgreSQL with their email, display name, and preferences.

---

## 📥 Where It Gets Data
- Authenticated user payload from Firebase token (`uid`, `email`, `name`).
- Profile update forms submitted from the frontend Settings page.

---

## ⚙️ Core Actions Handled
1. **User Sync (`/sync`)**: Verifies the Firebase UID and ensures a matching user record exists in PostgreSQL, creating one if it's the user's first login.
2. **Get Profile (`/me`)**: Returns the logged-in user's profile details, creation date, and linked integration statuses.
3. **Update Profile**: Allows users to update their name, timezone, or productivity preferences.

---

## 📤 Where the Output Goes
- Powers user state initialization across the entire frontend application.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This route manages user account synchronization. Whenever someone logs in via Firebase on the frontend, this endpoint validates their identity and seamlessly provisions or retrieves their PostgreSQL profile."*
