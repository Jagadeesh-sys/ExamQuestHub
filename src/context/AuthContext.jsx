import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase/config.js';
import { logAppError } from '../utils/errorLogger.js';

const AuthContext = createContext(null);

const LEGACY_LOCAL_ADMIN_KEY = 'eqh_demo_admin_user';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 30000;

const BOOTSTRAP_ADMIN_EMAILS = [
  'lokeshsamatham66@gmail.com',
  'jagadeeshkoppisetti694@gmail.com',
  'koppisettijagadeesh978@gmail.com',
  'koppisettijagadesh916@gmail.com',
  'admin@examquesthub.com'
];

function isVerifiedBootstrapAccount(user) {
  if (!user || !user.email) return false;
  const emailLower = String(user.email).trim().toLowerCase();
  if (!BOOTSTRAP_ADMIN_EMAILS.includes(emailLower)) return false;

  // Require verified email for federated providers, or explicit password sign-in
  const isPasswordProvider = Array.isArray(user.providerData) &&
    user.providerData.some((p) => p?.providerId === 'password');
  return user.emailVerified === true || isPasswordProvider;
}

async function resolveAdminStatus(user) {
  if (!user || !user.uid) return false;
  const isBootstrapAdmin = isVerifiedBootstrapAccount(user);

  if (db) {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) return true;
      if (isBootstrapAdmin) {
        try {
          await setDoc(
            doc(db, 'admins', user.uid),
            {
              email: user.email,
              role: 'SuperAdmin',
              createdAt: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (writeErr) {
          console.warn('Could not write admin profile (rules may require Console setup):', writeErr);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Could not verify admin document in Firestore:', e);
      return isBootstrapAdmin;
    }
  }

  return false;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const failedAttemptsRef = useRef({ count: 0, lockedUntil: 0 });

  useEffect(() => {
    // Purge any legacy insecure client-only demo admin token
    try {
      window.localStorage?.removeItem(LEGACY_LOCAL_ADMIN_KEY);
    } catch {
      // ignore storage failure
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const admin = await resolveAdminStatus(user);
          setCurrentUser(admin ? user : null);
          setIsAdmin(admin);
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }

    setCurrentUser(null);
    setIsAdmin(false);
    setLoading(false);
    return undefined;
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    if (!isFirebaseConfigured || !auth) {
      const msg = 'Firebase Authentication is required for administrator access.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const admin = await resolveAdminStatus(credential.user);
      if (!admin) {
        await signOut(auth);
        const msg = 'This Google account is not authorized for the admin dashboard.';
        setAuthError(msg);
        setCurrentUser(null);
        setIsAdmin(false);
        return { success: false, error: msg };
      }
      failedAttemptsRef.current = { count: 0, lockedUntil: 0 };
      setCurrentUser(credential.user);
      setIsAdmin(true);
      return { success: true, user: credential.user };
    } catch (err) {
      console.error('Google Sign-in failed:', err);
      const msg = err?.code === 'auth/popup-closed-by-user'
        ? 'Sign-in window was closed before completing authentication.'
        : 'Google sign-in failed. Please try again.';
      setAuthError(msg);
      logAppError({ category: 'Auth', message: err?.message || msg, component: 'loginWithGoogle' });
      return { success: false, error: msg };
    }
  };

  const loginWithEmail = async (email, password) => {
    setAuthError(null);

    const now = Date.now();
    if (failedAttemptsRef.current.lockedUntil > now) {
      const secs = Math.ceil((failedAttemptsRef.current.lockedUntil - now) / 1000);
      const msg = `Too many failed sign-in attempts. Please wait ${secs}s before trying again.`;
      setAuthError(msg);
      return { success: false, error: msg };
    }

    if (!isFirebaseConfigured || !auth) {
      const msg = 'Firebase Authentication is not configured. Admin login requires a verified Firebase Auth connection.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    const cleanEmail = String(email || '').trim();
    const cleanPassword = String(password || '');
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanPassword.length < 6) {
      const msg = 'Please enter a valid admin email and password (minimum 6 characters).';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const admin = await resolveAdminStatus(credential.user);
      if (!admin) {
        await signOut(auth);
        const msg = 'This account is not authorized for the admin dashboard.';
        setAuthError(msg);
        setCurrentUser(null);
        setIsAdmin(false);
        return { success: false, error: msg };
      }
      failedAttemptsRef.current = { count: 0, lockedUntil: 0 };
      setCurrentUser(credential.user);
      setIsAdmin(true);
      return { success: true, user: credential.user };
    } catch (err) {
      const nextCount = failedAttemptsRef.current.count + 1;
      failedAttemptsRef.current = {
        count: nextCount,
        lockedUntil: nextCount >= MAX_FAILED_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0
      };

      let msg = 'Failed to log in. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.';
      }
      setAuthError(msg);
      logAppError({ category: 'Auth', message: msg, component: 'loginWithEmail' });
      return { success: false, error: msg };
    }
  };

  const logoutAdmin = async () => {
    setAuthError(null);
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    try {
      window.localStorage?.removeItem(LEGACY_LOCAL_ADMIN_KEY);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        authError,
        setAuthError,
        loginWithGoogle,
        loginWithEmail,
        logoutAdmin,
        isFirebaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
