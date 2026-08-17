import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import {
  register as firebaseRegister,
  login as firebaseLogin,
  logout as firebaseLogout,
} from '../services/authService';
import { UserService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('demo_firebase_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [backendUser, setBackendUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        syncBackend(currentUser);
      }
      setCheckingAuth(false);
    }, (err) => {
      // Handle Firebase config error gracefully
      setCheckingAuth(false);
    });

    // Check saved dev user if any
    const saved = localStorage.getItem('demo_firebase_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      syncBackend(parsed);
    }

    setCheckingAuth(false);
    return () => unsubscribe();
  }, []);

  async function syncBackend(currentUser) {
    if (!currentUser) return;
    try {
      const synced = await UserService.syncUser({
        firebase_uid: currentUser.uid,
        email: currentUser.email || `${currentUser.uid}@example.com`,
        display_name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
      });
      setBackendUser(synced);
    } catch (err) {
      console.warn('Backend auto-sync note:', err.message);
    }
  }

  async function login(email, password) {
    const authUser = await firebaseLogin(email, password);
    setUser(authUser);
    await syncBackend(authUser);
    return authUser;
  }

  async function register(email, password) {
    const authUser = await firebaseRegister(email, password);
    setUser(authUser);
    await syncBackend(authUser);
    return authUser;
  }

  async function logout() {
    await firebaseLogout();
    setUser(null);
    setBackendUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        backendUser,
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
