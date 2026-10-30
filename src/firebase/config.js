import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setDoc, serverTimestamp } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';
import { logAppError } from '../utils/errorLogger.js';

function isStaleFirebaseValue(value) {
  if (!value) return true;
  const text = String(value);
  return (
    text.includes('gen-lang-client') ||
    text.includes('153399621413') ||
    text.includes('ai-studio-examquesthub')
  );
}

function pickConfig(envValue, jsonValue) {
  const env = typeof envValue === 'string' ? envValue.trim() : '';
  if (env && !isStaleFirebaseValue(env)) return env;
  return jsonValue || '';
}

// Resolve configuration from json file or environment variables.
// Ignore leftover AI Studio / old-project Vercel env vars so they cannot override examquesthub.
const resolvedConfig = {
  projectId: pickConfig(import.meta.env?.VITE_FIREBASE_PROJECT_ID, rawConfig.projectId),
  appId: pickConfig(import.meta.env?.VITE_FIREBASE_APP_ID, rawConfig.appId),
  apiKey: pickConfig(import.meta.env?.VITE_FIREBASE_API_KEY, rawConfig.apiKey),
  authDomain: pickConfig(import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN, rawConfig.authDomain),
  firestoreDatabaseId: pickConfig(import.meta.env?.VITE_FIREBASE_DATABASE_ID, rawConfig.firestoreDatabaseId),
  storageBucket: pickConfig(import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET, rawConfig.storageBucket),
  messagingSenderId: pickConfig(import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID, rawConfig.messagingSenderId),
  measurementId: pickConfig(import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID, rawConfig.measurementId)
};

const firebaseConfig = {
  apiKey: resolvedConfig.apiKey,
  authDomain: resolvedConfig.authDomain,
  projectId: resolvedConfig.projectId,
  storageBucket: resolvedConfig.storageBucket,
  messagingSenderId: resolvedConfig.messagingSenderId,
  appId: resolvedConfig.appId,
  measurementId: resolvedConfig.measurementId
};

let app = null;
let db = null;
let auth = null;
let analytics = null;
let isFirebaseConfigured = false;
let initError = null;

try {
  if (resolvedConfig.apiKey && resolvedConfig.projectId) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    // Use named database only when explicitly set; otherwise default `(default)`.
    db = resolvedConfig.firestoreDatabaseId
      ? getFirestore(app, resolvedConfig.firestoreDatabaseId)
      : getFirestore(app);
    auth = getAuth(app);
    isFirebaseConfigured = true;

    if (typeof window !== 'undefined' && resolvedConfig.measurementId) {
      isSupported()
        .then((supported) => {
          if (supported && app) {
            analytics = getAnalytics(app);
          }
        })
        .catch((analyticsError) => {
          console.debug('[ExamQuestHub] Analytics unavailable:', analyticsError);
        });
    }
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
 * End-to-end connection health check for Firestore.
 *
 * IMPORTANT: this must never report a successful connection unless it has been
 * genuinely verified. A read that resolves *is* proof the backend answered; a
 * `not-found` response still counts (the collection is simply empty). Any throw
 * is reported as a failure with an actionable reason.
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
    await getDocFromServer(doc(db, 'test', 'connection'));
    return {
      connected: true,
      verified: true,
      latencyMs: Date.now() - startTime,
      databaseId: resolvedConfig.firestoreDatabaseId
    };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    const msg = err instanceof Error ? err.message : String(err);
    const code = err?.code || '';

    // Firestore API disabled / database not provisioned in this GCP project.
    if (
      msg.includes('has not been used in project') ||
      msg.includes('SERVICE_DISABLED') ||
      code === 'firestore/failed-precondition'
    ) {
      return {
        connected: false,
        latencyMs,
        error: `Cloud Firestore is not enabled for project "${resolvedConfig.projectId}". Create the Firestore database in the Firebase Console.`
      };
    }

    if (code === 'firestore/permission-denied' || msg.includes('insufficient permissions')) {
      return {
        connected: false,
        latencyMs,
        error: 'Firestore answered, but the read was denied. Publish the security rules from firestore.rules in the Firebase Console.'
      };
    }

    if (msg.includes('offline') || code === 'firestore/unavailable') {
      return { connected: false, latencyMs, error: 'Client is offline or the network is blocking Firestore.' };
    }

    return { connected: false, latencyMs, error: msg };
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

export { app, db, auth, analytics, isFirebaseConfigured, resolvedConfig, initError };
