import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import {
  register as firebaseRegister,
  login as firebaseLogin,
  logout as firebaseLogout,
} from '../services/authService';

const AuthContext = createContext(null);

// ===== TEMPORARY DEV-ONLY AUTH BYPASS (remove after Habit UI testing) =====
// Same gate as ProtectedRoute.jsx: active ONLY on the Vite dev server
// (import.meta.env.DEV) AND only when VITE_DEV_BYPASS_AUTH=true is set in .env.
// When active, Firebase's onAuthStateChanged subscription is skipped (which
// also avoids the auth/api-key-not-valid startup error from placeholder
// credentials) and a mock local development user is injected instead.
// Production builds statically evaluate DEV as false, so this entire block is
// dead-code-eliminated and real Firebase authentication is completely
// unaffected. To revert: delete the blocks marked with these banners.
const DEV_BYPASS_ACTIVE =
  import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

const DEV_MOCK_USER = {
  uid: 'dev-local-user',
  email: 'dev-user@local.test',
  displayName: 'Local Dev User',
};
// ===== END TEMPORARY DEV-ONLY AUTH BYPASS =====

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // ===== TEMPORARY DEV-ONLY AUTH BYPASS (remove after Habit UI testing) =====
    if (DEV_BYPASS_ACTIVE) {
      setUser(DEV_MOCK_USER);
      setCheckingAuth(false);
      return;
    }
    // ===== END TEMPORARY DEV-ONLY AUTH BYPASS =====

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // ===== TEMPORARY DEV-ONLY AUTH BYPASS (remove after Habit UI testing) =====
  // In bypass mode the auth actions below no-op against the mock user so the
  // Login/Register pages don't hit Firebase with invalid credentials.
  // ===== END TEMPORARY DEV-ONLY AUTH BYPASS =====
  async function login(email, password) {
    if (DEV_BYPASS_ACTIVE) return DEV_MOCK_USER;
    const user = await firebaseLogin(email, password);
    return user;
  }

  async function register(email, password) {
    if (DEV_BYPASS_ACTIVE) return DEV_MOCK_USER;
    const user = await firebaseRegister(email, password);
    return user;
  }

  async function logout() {
    if (DEV_BYPASS_ACTIVE) {
      setUser(null);
      return;
    }
    await firebaseLogout();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        checkingAuth,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
}
