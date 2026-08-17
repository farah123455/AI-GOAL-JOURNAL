import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';

export async function register(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    // If Firebase API key is not configured yet in local environment, provide seamless local dev mock user
    if (err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key-not-valid')) {
      console.warn('Firebase API key not set in .env — using local development identity fallback');
      const devUid = 'fb_user_' + Math.abs(hashCode(email));
      const mockUser = {
        uid: devUid,
        email: email,
        displayName: email.split('@')[0],
      };
      localStorage.setItem('demo_firebase_user', JSON.stringify(mockUser));
      return mockUser;
    }
    throw err;
  }
}

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    // If Firebase API key is not configured yet in local environment, provide seamless local dev mock user
    if (err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key-not-valid')) {
      console.warn('Firebase API key not set in .env — using local development identity fallback');
      const devUid = 'fb_user_' + Math.abs(hashCode(email));
      const mockUser = {
        uid: devUid,
        email: email,
        displayName: email.split('@')[0],
      };
      localStorage.setItem('demo_firebase_user', JSON.stringify(mockUser));
      return mockUser;
    }
    throw err;
  }
}

export async function logout() {
  localStorage.removeItem('demo_firebase_user');
  try {
    await signOut(auth);
  } catch (e) {
    // Ignore signout error if using mock dev user
  }
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
