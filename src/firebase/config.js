import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setDoc, serverTimestamp } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';
import { logAppError } from '../utils/errorLogger.js';

// Resolve configuration from json file or environment variables
const resolvedConfig = {
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || rawConfig.appId,
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || rawConfig.apiKey,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain,
  firestoreDatabaseId: import.meta.env?.VITE_FIREBASE_DATABASE_ID || rawConfig.firestoreDatabaseId,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig.messagingSenderId
};

let app = null;
let db = null;
let auth = null;
let isFirebaseConfigured = false;
let initError = null;

try {
  if (resolvedConfig.apiKey && resolvedConfig.projectId) {
    app = getApps().length > 0 ? getApp() : initializeApp(resolvedConfig);
    // Connect to the specific database instance
    db = resolvedConfig.firestoreDatabaseId
      ? getFirestore(app, resolvedConfig.firestoreDatabaseId)
      : getFirestore(app);
    auth = getAuth(app);
    isFirebaseConfigured = true;
  } else {
    throw new Error('Firebase credentials (apiKey or projectId) are missing.');
  }
} catch (err) {
  initError = err?.message || String(err);
  console.warn('[ExamQuestHub] Firebase initialization warning:', initError);
  logAppError({
    category: 'Firebase',
    message: `Firebase initialization failed: ${initError}`,
    component: 'config.js'
  });
}

export const googleProvider = new GoogleAuthProvider();
// Enable select_account prompt
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * End-to-end connection health check for Firestore (Reads and verifies connection)
 */
export async function testFirestoreConnection() {
  if (!db || !isFirebaseConfigured) {
    return {
      connected: false,
      error: initError || 'Firestore is not initialized.'
    };
  }

  const startTime = Date.now();
  try {
    const testDocRef = doc(db, 'test', 'connection');
    // Try pinging server
    await getDocFromServer(testDocRef);
    const latencyMs = Date.now() - startTime;
    return { connected: true, latencyMs, databaseId: resolvedConfig.firestoreDatabaseId };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('offline')) {
      return { connected: false, latencyMs, error: 'Client is offline or network is restricted.' };
    }
    // If doc doesn't exist, reading it is still a valid Firestore response
    if (msg.includes('Missing or insufficient permissions')) {
      return { connected: false, latencyMs, error: 'Permission denied for /test/connection' };
    }
    return { connected: true, latencyMs, databaseId: resolvedConfig.firestoreDatabaseId, note: msg };
  }
}

/**
 * Live Write Test (for Admin Diagnostics)
 */
export async function testFirestoreWrite() {
  if (!db || !isFirebaseConfigured) {
    return { success: false, error: 'Firestore is not initialized.' };
  }
  const startTime = Date.now();
  try {
    const testRef = doc(db, 'test', 'write-check');
    await setDoc(testRef, {
      ping: true,
      testedAt: new Date().toISOString(),
      timestamp: serverTimestamp()
    });
    return { success: true, latencyMs: Date.now() - startTime };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

// Initial passive connection check
if (typeof window !== 'undefined' && db) {
  testFirestoreConnection().catch((e) => {
    console.debug('[ExamQuestHub] Initial Firestore connection ping caught:', e);
  });
}

export { app, db, auth, isFirebaseConfigured, resolvedConfig, initError };
