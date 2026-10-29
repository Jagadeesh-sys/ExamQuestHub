import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config.js';
import {
  INITIAL_UPDATES,
  INITIAL_CURRENT_AFFAIRS,
  INITIAL_QUESTIONS,
  INITIAL_RESOURCES
} from '../data/initialData.js';

// Local storage fallback storage keys
const STORAGE_KEYS = {
  UPDATES: 'eqh_db_updates_v1',
  CURRENT_AFFAIRS: 'eqh_db_current_affairs_v1',
  QUESTIONS: 'eqh_db_questions_v1',
  RESOURCES: 'eqh_db_resources_v1',
  ADMINS: 'eqh_db_admins_v1'
};

function getLocalData(key, defaultData) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Local storage read error for key', key, e);
    return defaultData;
  }
}

function saveLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Local storage save error for key', key, e);
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
      let q;
      if (includeDrafts) {
        q = query(updatesRef, orderBy('publishedAt', 'desc'));
      } else {
        q = query(updatesRef, where('status', '!=', 'Draft'), orderBy('publishedAt', 'desc'));
      }
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore getUpdates error, falling back to local dataset:', err);
    }
  }

  // Fallback to local storage
  const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
  if (includeDrafts) return list;
  return list.filter(item => item.status !== 'Draft');
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
      console.warn('Firestore getUpdateById error, using local data:', err);
    }
  }
  const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
  return list.find(item => item.id === id || item.slug === id) || null;
}

export async function saveUpdate(item) {
  const nowIso = new Date().toISOString();
  const id = item.id || `notif-${Date.now()}`;
  const slug = item.slug || (typeof item.title === 'string' ? item.title : item.title?.en || 'job')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
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
      console.error('Firestore saveUpdate failed:', err);
    }
  }

  // Also maintain in local store
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
      console.error('Firestore deleteUpdate failed:', err);
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
const DEFAULT_TOPIC_IMAGES = {
  'Andhra Pradesh current affairs': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
  'National news': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
  'Government schemes': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
  'Economy': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
  'Science and technology': 'https://images.unsplash.com/photo-1517976487502-d216f9f6e632?auto=format&fit=crop&w=600&q=80',
  'Environment': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
  'Defence': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
  'Awards and honours': 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=600&q=80',
  'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
  'Telangana current affairs': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80',
  'International affairs': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
  'Default': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
};

export const getDefaultImageForTopic = (topic) => {
  return DEFAULT_TOPIC_IMAGES[topic] || DEFAULT_TOPIC_IMAGES['Default'];
};

export async function getCurrentAffairs() {
  let list = [];
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'currentAffairs');
      const q = query(colRef, orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore getCurrentAffairs fallback:', err);
    }
  }
  if (!list || list.length === 0) {
    list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  }

  // Ensure every article has valid image and exam relevance tags
  return list.map(item => ({
    ...item,
    imageUrl: item.imageUrl || getDefaultImageForTopic(item.topic),
    examRelevance: item.examRelevance && item.examRelevance.length > 0
      ? item.examRelevance
      : ['UPSC', 'APPSC', 'SSC']
  }));
}

export async function getCurrentAffairById(id) {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'currentAffairs', id));
      if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.warn('Firestore getCurrentAffairById fallback:', err);
    }
  }
  const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  return list.find(i => i.id === id || i.slug === id) || null;
}

export async function saveCurrentAffair(article) {
  const nowIso = new Date().toISOString();
  const id = article.id || `ca-${Date.now()}`;
  const slug = article.slug || (typeof article.headline === 'string' ? article.headline : article.headline?.en || 'article')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const payload = {
    ...article,
    id,
    slug,
    verifiedAt: nowIso
  };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'currentAffairs', id), payload, { merge: true });
    } catch (err) {
      console.error('Firestore saveCurrentAffair failed:', err);
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
      console.error('Firestore deleteCurrentAffair failed:', err);
    }
  }
  const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  saveLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, list.filter(i => i.id !== id));
  return true;
}

/**
 * -------------------------------------------------------------
 * 3. GK QUESTIONS SERVICE
 * -------------------------------------------------------------
 */
export async function getQuestions() {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'questions');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore getQuestions fallback:', err);
    }
  }
  return getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
}

export async function saveQuestion(question) {
  const id = question.id || `gk-${Date.now()}`;
  const payload = { ...question, id };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'questions', id), payload, { merge: true });
    } catch (err) {
      console.error('Firestore saveQuestion failed:', err);
    }
  }

  const list = getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  const idx = list.findIndex(i => i.id === id);
  if (idx >= 0) {
    list[idx] = payload;
  } else {
    list.push(payload);
  }
  saveLocalData(STORAGE_KEYS.QUESTIONS, list);
  return payload;
}

export async function deleteQuestion(id) {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'questions', id));
    } catch (err) {
      console.error('Firestore deleteQuestion failed:', err);
    }
  }
  const list = getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  saveLocalData(STORAGE_KEYS.QUESTIONS, list.filter(i => i.id !== id));
  return true;
}

/**
 * -------------------------------------------------------------
 * 4. STUDY RESOURCES SERVICE
 * -------------------------------------------------------------
 */
export async function getResources() {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'resources');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn('Firestore getResources fallback:', err);
    }
  }
  return getLocalData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
}

export async function saveResource(res) {
  const id = res.id || `res-${Date.now()}`;
  const payload = { ...res, id };

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'resources', id), payload, { merge: true });
    } catch (err) {
      console.error('Firestore saveResource failed:', err);
    }
  }

  const list = getLocalData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  const idx = list.findIndex(i => i.id === id);
  if (idx >= 0) {
    list[idx] = payload;
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
      console.error('Firestore deleteResource failed:', err);
    }
  }
  const list = getLocalData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  saveLocalData(STORAGE_KEYS.RESOURCES, list.filter(i => i.id !== id));
  return true;
}

/**
 * Reset all local records back to initial demonstration state
 */
export function resetDemonstrationData() {
  localStorage.setItem(STORAGE_KEYS.UPDATES, JSON.stringify(INITIAL_UPDATES));
  localStorage.setItem(STORAGE_KEYS.CURRENT_AFFAIRS, JSON.stringify(INITIAL_CURRENT_AFFAIRS));
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
  localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
  return true;
}
