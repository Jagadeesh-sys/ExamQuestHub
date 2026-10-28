import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../firebase/config.js';

const AuthContext = createContext();

const LOCAL_ADMIN_KEY = 'eqh_demo_admin_user';
const BOOTSTRAP_ADMIN_EMAILS = [
  'koppisettijagadeesh123@gmail.com',
  'admin@examquesthub.com'
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          const emailLower = (user.email || '').toLowerCase();
          const isBootstrapAdmin = BOOTSTRAP_ADMIN_EMAILS.includes(emailLower);

          try {
            if (db) {
              const adminDoc = await getDoc(doc(db, 'admins', user.uid));
              if (adminDoc.exists()) {
                setIsAdmin(true);
              } else if (isBootstrapAdmin) {
                // Ensure admin document is recorded in Firestore
                await setDoc(doc(db, 'admins', user.uid), {
                  email: user.email,
                  role: 'SuperAdmin',
                  createdAt: new Date().toISOString()
                }, { merge: true });
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }
            } else {
              setIsAdmin(isBootstrapAdmin);
            }
          } catch (e) {
            console.warn('Could not verify admin document in Firestore:', e);
            setIsAdmin(isBootstrapAdmin);
          }
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Check local storage for persistent demo admin session
      try {
        const saved = localStorage.getItem(LOCAL_ADMIN_KEY);
        if (saved) {
          const userObj = JSON.parse(saved);
          setCurrentUser(userObj);
          setIsAdmin(true);
        }
      } catch (e) {
        console.warn('Error reading demo auth state', e);
      }
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    if (isFirebaseConfigured && auth) {
      try {
        const credential = await signInWithPopup(auth, googleProvider);
        setCurrentUser(credential.user);
        const emailLower = (credential.user.email || '').toLowerCase();
        const isAuthAdmin = BOOTSTRAP_ADMIN_EMAILS.includes(emailLower);
        setIsAdmin(isAuthAdmin);
        return { success: true, user: credential.user };
      } catch (err) {
        console.error('Google Sign-in failed:', err);
        const msg = err.message || 'Google sign-in was cancelled or failed.';
        setAuthError(msg);
        return { success: false, error: msg };
      }
    }
  };

  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    if (isFirebaseConfigured && auth) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser(credential.user);
        setIsAdmin(true);
        return { success: true, user: credential.user };
      } catch (err) {
        let msg = 'Failed to log in. Please check your credentials.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'Invalid email or password.';
        } else if (err.code === 'auth/too-many-requests') {
          msg = 'Too many attempts. Please try again later.';
        }
        setAuthError(msg);
        return { success: false, error: msg };
      }
    } else {
      // Local preview / demo authentication mode
      if (email.toLowerCase().includes('admin') || password.length >= 6) {
        const demoUser = {
          uid: 'demo-admin-uid-101',
          email: email || 'admin@examquesthub.com',
          displayName: 'Editorial Administrator',
          isDemo: true
        };
        localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(demoUser));
        setCurrentUser(demoUser);
        setIsAdmin(true);
        return { success: true, user: demoUser };
      } else {
        const msg = 'Please enter a valid admin email and password (minimum 6 characters).';
        setAuthError(msg);
        return { success: false, error: msg };
      }
    }
  };

  const logoutAdmin = async () => {
    setAuthError(null);
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY);
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
