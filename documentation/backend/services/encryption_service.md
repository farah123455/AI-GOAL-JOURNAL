# encryption_service.py (High-Level Encryption Management)

## 📌 What This File Does
This file provides a clean, unified service interface wrapping around low-level cryptographic functions from `app.core.crypto`. It offers helper methods to encrypt, decrypt, and re-key user data, shielding the rest of the application from raw byte manipulations and cipher algorithms.

---

## 📥 Where It Gets Data
- Plaintext journal contents, user notes, and secret database attributes.
- Master encryption keys and optional key rotation versions.

---

## ⚙️ How It Works (Step-by-Step)
1. **Abstraction**: Encapsulates encryption and decryption calls into simple one-liner functions.
2. **Safe Fallback & Migration Support**:
   - If legacy unencrypted journals exist from an earlier prototype, it gracefully detects them and migrates them to encrypted ciphertext without corrupting user data.
3. **Key Versioning**:
   - Supports key rotation identifiers so if the system security keys are ever rotated, older entries can still be read and upgraded.

---

## 📤 Where the Output Goes
- Supplies encrypted strings to database models and clean decrypted strings to API response serializers.

---

## 🎤 How to Explain to an Evaluator / Interviewer
> *"This service acts as the clean architectural facade for our AES-256 encryption. It abstracts cryptographic operations from the rest of the backend and ensures smooth backward-compatibility for legacy data migration."*
