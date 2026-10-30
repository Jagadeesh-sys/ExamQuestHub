import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config.js';
import {
  INITIAL_UPDATES,
  INITIAL_CURRENT_AFFAIRS,
  INITIAL_QUESTIONS,
  INITIAL_RESOURCES
} from '../data/initialData.js';
import { logAppError } from '../utils/errorLogger.js';

// Local storage fallback storage keys (Offline Cache Only)
const STORAGE_KEYS = {
  UPDATES: 'eqh_db_updates_v1',
  CURRENT_AFFAIRS: 'eqh_db_current_affairs_v1',
  QUESTIONS: 'eqh_db_questions_v1',
  RESOURCES: 'eqh_db_resources_v1',
  ADMINS: 'eqh_db_admins_v1'
};

function getLocalData(key, defaultData) {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage?.getItem(key) : null;
    if (!raw) return defaultData;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[Cache] Read error for key', key, e);
    return defaultData;
  }
}

function saveLocalData(key, data) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.warn('[Cache] Save error for key', key, e);
  }
}

// Default Topic Images for all 12+ categories
export const DEFAULT_TOPIC_IMAGES = {
  'National Affairs': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
  'National news': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
  'International Affairs': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
  'International affairs': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
  'Science and Technology': 'https://images.unsplash.com/photo-1517976487502-d216f9f6e632?auto=format&fit=crop&w=600&q=80',
  'Science and technology': 'https://images.unsplash.com/photo-1517976487502-d216f9f6e632?auto=format&fit=crop&w=600&q=80',
  'Defence': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
  'Economy': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
  'Banking': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80',
  'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
  'Awards and Honours': 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=600&q=80',
  'Awards and honours': 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=600&q=80',
  'Appointments': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
  'Important Days': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
  'Environment': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
  'Government Schemes': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
  'Government schemes': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
  'Andhra Pradesh current affairs': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
  'Telangana current affairs': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
  'Default': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
};

export const getDefaultImageForTopic = (topic) => {
  return DEFAULT_TOPIC_IMAGES[topic] || DEFAULT_TOPIC_IMAGES['Default'];
};

// Automatic one-time seeding helpers when Firestore collections are empty
let isSeedingUpdates = false;
async function seedInitialUpdatesIfEmpty() {
  if (!isFirebaseConfigured || !db || isSeedingUpdates) return;
  try {
    isSeedingUpdates = true;
    for (const item of INITIAL_UPDATES) {
      const docRef = doc(db, 'updates', item.id);
      await setDoc(docRef, { ...item, serverCreatedAt: serverTimestamp() }, { merge: true });
    }
    console.info('[Firestore] Initial updates synced to Firestore.');
  } catch (err) {
    console.debug('[Firestore] Background seed updates skipped:', err.message);
  } finally {
    isSeedingUpdates = false;
  }
}

let isSeedingCA = false;
async function seedInitialCAIfEmpty() {
  if (!isFirebaseConfigured || !db || isSeedingCA) return;
  try {
    isSeedingCA = true;
    for (const item of INITIAL_CURRENT_AFFAIRS) {
      const docRef = doc(db, 'currentAffairs', item.id);
      await setDoc(docRef, { ...item, serverCreatedAt: serverTimestamp() }, { merge: true });
    }
    console.info('[Firestore] Initial current affairs synced to Firestore.');
  } catch (err) {
    console.debug('[Firestore] Background seed CA skipped:', err.message);
  } finally {
    isSeedingCA = false;
  }
}

/**
 * -------------------------------------------------------------
 * 1. UPDATES & JOB NOTIFICATIONS SERVICE
 * -------------------------------------------------------------
 */
export async function getUpdates(includeDrafts = false) {
  if (isFirebaseConfigured && db) {
    try {
      const updatesRef = collection(db, 'updates');
      const q = query(updatesRef, orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        saveLocalData(STORAGE_KEYS.UPDATES, items);
        return includeDrafts ? items : items.filter(item => item.status !== 'Draft');
      } else {
        // Collection in Firestore is empty -> seed and return initial dataset
        seedInitialUpdatesIfEmpty();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('[Firestore] getUpdates error, using local fallback:', msg);
      logAppError({
        category: 'Firestore',
        message: `getUpdates query failed: ${msg}`,
        component: 'firestoreService.getUpdates'
      });
    }
  }

  // Fallback to local storage
  const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
  if (includeDrafts) return list;
  return list.filter(item => item.status !== 'Draft');
}

export function subscribeToUpdates(callback, includeDrafts = false) {
  if (isFirebaseConfigured && db) {
    try {
      const updatesRef = collection(db, 'updates');
      const q = query(updatesRef, orderBy('publishedAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            saveLocalData(STORAGE_KEYS.UPDATES, items);
            const filtered = includeDrafts ? items : items.filter(i => i.status !== 'Draft');
            callback(filtered);
          } else {
            seedInitialUpdatesIfEmpty();
            const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
            callback(includeDrafts ? list : list.filter(i => i.status !== 'Draft'));
          }
        },
        (error) => {
          console.warn('[Firestore] subscribeToUpdates listener fallback:', error.message);
          logAppError({
            category: 'Firestore',
            message: `subscribeToUpdates error: ${error.message}`,
            component: 'subscribeToUpdates'
          });
          const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
          callback(includeDrafts ? list : list.filter(i => i.status !== 'Draft'));
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('[Firestore] Failed to attach real-time updates listener:', err);
    }
  }

  // Fallback
  const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
  callback(includeDrafts ? list : list.filter(i => i.status !== 'Draft'));
  return () => {};
}

export async function getUpdateById(id) {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'updates', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
    } catch (err) {
      console.warn('[Firestore] getUpdateById error, using local data:', err);
    }
  }
  const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
  return list.find(item => item.id === id || item.slug === id) || null;
}

export async function saveUpdate(item) {
  const nowIso = new Date().toISOString();
  const rawId = item.id || `notif-${Date.now()}`;
  const id = rawId
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/(^-|-$)/g, '');

  const rawSlug = item.slug || (typeof item.title === 'string' ? item.title : item.title?.en || 'job');
  const slug = rawSlug
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/(^-|-$)/g, '');

  const payload = {
    ...item,
    id,
    slug,
    updatedAt: nowIso,
    verifiedAt: item.status !== 'Draft' ? (item.verifiedAt || nowIso) : null
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'updates', id);
      await setDoc(docRef, { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Firestore] saveUpdate failed:', err);
      logAppError({
        category: 'Firestore',
        message: `saveUpdate failed for ID ${id}: ${msg}`,
        component: 'firestoreService.saveUpdate'
      });
      throw new Error(`Firestore save failed: ${msg}`);
    }
  }

  // Update local offline cache
  const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
  const index = list.findIndex(i => i.id === id);
  if (index >= 0) {
    list[index] = payload;
  } else {
    list.unshift(payload);
  }
  saveLocalData(STORAGE_KEYS.UPDATES, list);
  return payload;
}

export async function deleteUpdate(id) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'updates', id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Firestore] deleteUpdate failed:', err);
      logAppError({
        category: 'Firestore',
        message: `deleteUpdate failed for ID ${id}: ${msg}`,
        component: 'firestoreService.deleteUpdate'
      });
      throw new Error(`Firestore delete failed: ${msg}`);
    }
  }
  const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
  const filtered = list.filter(item => item.id !== id);
  saveLocalData(STORAGE_KEYS.UPDATES, filtered);
  return true;
}

/**
 * -------------------------------------------------------------
 * 2. CURRENT AFFAIRS SERVICE
 * -------------------------------------------------------------
 */
export async function getCurrentAffairs() {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'currentAffairs');
      const q = query(colRef, orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
          imageUrl: d.data().imageUrl || getDefaultImageForTopic(d.data().topic),
          examRelevance: d.data().examRelevance?.length ? d.data().examRelevance : ['UPSC', 'APPSC', 'SSC']
        }));
        saveLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, list);
        return list;
      } else {
        seedInitialCAIfEmpty();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('[Firestore] getCurrentAffairs fallback:', msg);
      logAppError({
        category: 'Firestore',
        message: `getCurrentAffairs failed: ${msg}`,
        component: 'firestoreService.getCurrentAffairs'
      });
    }
  }

  const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  return list.map(item => ({
    ...item,
    imageUrl: item.imageUrl || getDefaultImageForTopic(item.topic),
    examRelevance: item.examRelevance?.length ? item.examRelevance : ['UPSC', 'APPSC', 'SSC']
  }));
}

export function subscribeToCurrentAffairs(callback) {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'currentAffairs');
      const q = query(colRef, orderBy('publishedAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map(d => ({
              id: d.id,
              ...d.data(),
              imageUrl: d.data().imageUrl || getDefaultImageForTopic(d.data().topic),
              examRelevance: d.data().examRelevance?.length ? d.data().examRelevance : ['UPSC', 'APPSC', 'SSC']
            }));
            saveLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, list);
            callback(list);
          } else {
            seedInitialCAIfEmpty();
            const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS).map(d => ({
              ...d,
              imageUrl: d.imageUrl || getDefaultImageForTopic(d.topic),
              examRelevance: d.examRelevance?.length ? d.examRelevance : ['UPSC', 'APPSC', 'SSC']
            }));
            callback(list);
          }
        },
        (error) => {
          console.warn('[Firestore] subscribeToCurrentAffairs error, using local data:', error.message);
          logAppError({
            category: 'Firestore',
            message: `subscribeToCurrentAffairs error: ${error.message}`,
            component: 'subscribeToCurrentAffairs'
          });
          const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
          callback(list);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('[Firestore] Failed to attach real-time CA listener:', err);
    }
  }

  const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  callback(list);
  return () => {};
}

export async function getCurrentAffairById(id) {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'currentAffairs', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          ...data,
          imageUrl: data.imageUrl || getDefaultImageForTopic(data.topic),
          examRelevance: data.examRelevance?.length ? data.examRelevance : ['UPSC', 'APPSC', 'SSC']
        };
      }
    } catch (err) {
      console.warn('[Firestore] getCurrentAffairById error:', err);
    }
  }
  const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  const found = list.find(item => item.id === id || item.slug === id) || null;
  if (!found) return null;
  return {
    ...found,
    imageUrl: found.imageUrl || getDefaultImageForTopic(found.topic),
    examRelevance: found.examRelevance?.length ? found.examRelevance : ['UPSC', 'APPSC', 'SSC']
  };
}

export async function saveCurrentAffair(article) {
  const nowIso = new Date().toISOString();
  const rawId = article.id || `ca-${Date.now()}`;
  const id = rawId
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/(^-|-$)/g, '');

  const rawSlug = article.slug || (typeof article.headline === 'string' ? article.headline : article.headline?.en || 'article');
  const slug = rawSlug
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/(^-|-$)/g, '');

  const payload = {
    ...article,
    id,
    slug,
    verifiedAt: nowIso
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'currentAffairs', id);
      await setDoc(docRef, { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Firestore] saveCurrentAffair failed:', err);
      logAppError({
        category: 'Firestore',
        message: `saveCurrentAffair failed for ID ${id}: ${msg}`,
        component: 'firestoreService.saveCurrentAffair'
      });
      throw new Error(`Firestore save failed: ${msg}`);
    }
  }

  const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  const index = list.findIndex(i => i.id === id);
  if (index >= 0) {
    list[index] = payload;
  } else {
    list.unshift(payload);
  }
  saveLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, list);
  return payload;
}

export async function deleteCurrentAffair(id) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'currentAffairs', id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Firestore] deleteCurrentAffair failed:', err);
      logAppError({
        category: 'Firestore',
        message: `deleteCurrentAffair failed for ID ${id}: ${msg}`,
        component: 'firestoreService.deleteCurrentAffair'
      });
      throw new Error(`Firestore delete failed: ${msg}`);
    }
  }
  const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  saveLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, list.filter(i => i.id !== id));
  return true;
}

/**
 * -------------------------------------------------------------
 * 3. QUESTIONS SERVICE
 * -------------------------------------------------------------
 */
export async function getQuestions() {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'questions');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        saveLocalData(STORAGE_KEYS.QUESTIONS, items);
        return items;
      }
    } catch (err) {
      console.warn('[Firestore] getQuestions error:', err);
    }
  }
  return getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
}

export async function saveQuestion(question) {
  const id = (question.id || `gk-${Date.now()}`)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/(^-|-$)/g, '');

  const payload = { ...question, id };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'questions', id), { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Firestore] saveQuestion failed:', err);
      throw new Error(`Firestore save failed: ${msg}`);
    }
  }
  const list = getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  const index = list.findIndex(i => i.id === id);
  if (index >= 0) {
    list[index] = payload;
  } else {
    list.unshift(payload);
  }
  saveLocalData(STORAGE_KEYS.QUESTIONS, list);
  return payload;
}

export async function deleteQuestion(id) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'questions', id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Firestore] deleteQuestion failed:', err);
      throw new Error(`Firestore delete failed: ${msg}`);
    }
  }
  const list = getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  saveLocalData(STORAGE_KEYS.QUESTIONS, list.filter(i => i.id !== id));
  return true;
}

/**
 * -------------------------------------------------------------
 * 4. RESOURCES (Syllabus & Previous Papers)
 * -------------------------------------------------------------
 */
export async function getResources() {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'resources');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        saveLocalData(STORAGE_KEYS.RESOURCES, items);
        return items;
      }
    } catch (err) {
      console.warn('[Firestore] getResources error:', err);
    }
  }
  return getLocalData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
}

export async function saveResource(res) {
  const id = (res.id || `res-${Date.now()}`)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/(^-|-$)/g, '');

  const payload = { ...res, id };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'resources', id), { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Firestore] saveResource failed:', err);
      throw new Error(`Firestore save failed: ${msg}`);
    }
  }
  const list = getLocalData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  const index = list.findIndex(i => i.id === id);
  if (index >= 0) {
    list[index] = payload;
  } else {
    list.unshift(payload);
  }
  saveLocalData(STORAGE_KEYS.RESOURCES, list);
  return payload;
}

export async function deleteResource(id) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'resources', id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Firestore] deleteResource failed:', err);
      throw new Error(`Firestore delete failed: ${msg}`);
    }
  }
  const list = getLocalData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  saveLocalData(STORAGE_KEYS.RESOURCES, list.filter(i => i.id !== id));
  return true;
}

/**
 * Reset all local storage datasets to pristine initial defaults
 */
export function resetDemonstrationData() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEYS.UPDATES);
      window.localStorage.removeItem(STORAGE_KEYS.CURRENT_AFFAIRS);
      window.localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
      window.localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    }
  } catch (e) {
    console.error('Failed to reset storage:', e);
  }
}
