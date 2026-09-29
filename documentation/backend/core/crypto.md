# crypto.py (AES-256 Journal Encryption & Privacy Shield)

## 📌 What This File Does
This file handles **military-grade encryption for user journals**. Personal journals contain vulnerable, private thoughts, daily struggles, and confidential goals. 

To ensure that even if the database is leaked or inspected, nobody can read the raw text, this file encrypts journal entries into unreadable cipher strings before saving them to disk, and decrypts them only when the authorized owner views them.

---

## 📥 Where It Gets Data
- **Plain Text**: The raw text of a journal entry written by the user.
- **Master Encryption Key**: Secure 32-byte key stored safely in environment variables (never committed to GitHub).
- **Encrypted Cipher**: Scrambled data retrieved from PostgreSQL when a user loads their journal history.

---

## ⚙️ How It Works (Step-by-Step)
1. **Industry-Standard AES-256 (GCM Mode)**:
   - Uses Advanced Encryption Standard with Galois/Counter Mode (AES-256-GCM).
   - This provides both **confidentiality** (data cannot be read) and **integrity** (data cannot be tampered with).
2. **Unique Initialization Vector (Nonce) Per Entry**:
   - For every single journal saved, it generates a fresh, random 12-byte cryptographic nonce.
   - Even if a user writes the exact same sentence twice, the two encrypted strings in the database look completely different.
3. **Encryption (`encrypt_text`)**:
   - Takes raw plaintext, encrypts it using the master key and random nonce, and prepends the nonce to the result.
   - Encodes it into a safe Base64 string for database storage.
4. **Decryption (`decrypt_text`)**:
   - Extracts the nonce, checks the authentication tag to ensure no one tampered with the message, and decrypts back to the original plaintext for the user.

---

## 📤 Where the Output Goes
- Outputs scrambled encrypted strings to PostgreSQL columns (`content_encrypted`), ensuring privacy at rest.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"Privacy is a core design principle of our project. In `crypto.py`, we implement AES-256-GCM authenticated encryption. All journal thoughts are encrypted at rest with unique nonces before they ever touch the PostgreSQL database, ensuring compliance with privacy standards and safeguarding personal reflections."*
