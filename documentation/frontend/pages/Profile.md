# Profile.jsx & Settings.jsx (User Profile & Account Preferences Screens)

## 📌 What These Files Do
These screens allow users to **manage their personal account, customize preferences, and control integrations**. Users can view their account creation date, edit their display name, adjust notification and theme preferences, inspect security details, and link or unlink Google Calendar.

---

## 📥 Where It Gets Data
- User profile info from `AuthContext` and `/api/v1/users/me`.
- Calendar connection status from `/api/v1/calendar`.

---

## ⚙️ Key Features Handled
1. **Profile Details**: Displays user email, avatar, display name, and joined timestamp.
2. **Account Updates**: Form to change display name or update password.
3. **Integration Management**:
   - Google Calendar connection toggle with status indicator.
4. **Data Privacy & Security**:
   - Explains that journal entries are stored encrypted with AES-256.
   - Option to export or delete user data.

---

## 📤 Where the Output Goes
- Rendered at `/profile` and `/settings`.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"These pages provide user profile and application settings management. Users can update their display profile, verify their AES-256 encryption status, manage Google Calendar integrations, and control account security."*
