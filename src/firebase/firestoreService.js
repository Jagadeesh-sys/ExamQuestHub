import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch,
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
import {
  AUTO_CLOSED_FLAG,
  hasDeadlinePassed,
  withEffectiveStatus,
  withEffectiveStatusList,
  normalizeDateIST,
  getApplicationStartDate,
  getApplicationLastDate,
  calculateJobStatus,
  formatDateIST
} from '../utils/notificationStatus.js';
import { getDefaultImageForTopic as defaultImageForTopic, DEFAULT_TOPIC_IMAGES } from './topicImages.js';
import { loadAllRRBQuestions, getAllShifts } from '../services/rrbMockService.js';
import { getIdbItem, setIdbItem, removeIdbItem } from '../utils/idbCache.js';
import {
  MOCK_STATS_STORAGE_KEY,
  MOCK_STATS_VERSION,
  computeUnifiedStats,
  getCachedUnifiedStats,
  saveCachedUnifiedStats
} from '../utils/questionStats.js';

export { DEFAULT_TOPIC_IMAGES };

const STORAGE_KEYS = {
  UPDATES: 'eqh_db_updates_v1',
  CURRENT_AFFAIRS: 'eqh_db_current_affairs_v1',
  QUESTIONS: 'eqh_db_questions_v1',
  MOCK_QUESTIONS: 'eqh_db_mock_questions_v1',
  MOCK_STATS: MOCK_STATS_STORAGE_KEY,
  RESOURCES: 'eqh_db_resources_v1',
  ADMINS: 'eqh_db_admins_v1'
};

const IDB_MOCK_DOCS_KEY = 'mockQuestions_v2';
const IDB_MOCK_META_KEY = 'mockQuestions_meta_v2';
const MOCK_DOCS_TTL_MS = 6 * 60 * 60 * 1000;
const QUOTA_BACKOFF_MS = 5 * 60 * 1000;

const MAX_INLINE_BYTES = 700000;
let lastFirestoreError = null;
let inMemoryCurrentAffairs = null;
let cachedFirestoreMockDocs = null;
let cachedFirestoreMockMeta = null;
let inflightMockFetchPromise = null;
let firestoreQuotaBlockedUntil = 0;

export function getLastFirestoreError() {
  return lastFirestoreError;
}

/**
 * Live sync state, updated only from real Firestore responses.
 * `live` stays false until a read genuinely succeeds, so the UI never claims
 * a healthy connection that has not been verified.
 */
const syncState = {
  configured: !!(isFirebaseConfigured && db),
  live: false,
  lastError: null,
  lastSyncAt: null
};
const syncSubscribers = new Set();

function updateSyncState(patch) {
  Object.assign(syncState, patch);
  const snapshot = { ...syncState };
  syncSubscribers.forEach((fn) => {
    try {
      fn(snapshot);
    } catch (e) {
      // A broken subscriber must never break data loading.
    }
  });
}

function markSyncSuccess() {
  lastFirestoreError = null;
  updateSyncState({ live: true, lastError: null, lastSyncAt: new Date().toISOString() });
}

function markSyncFailure(err) {
  const msg = err instanceof Error ? err.message : String(err);
  updateSyncState({ live: false, lastError: msg });
  return msg;
}

export function getSyncState() {
  return { ...syncState };
}

export function subscribeToSyncState(callback) {
  syncSubscribers.add(callback);
  callback({ ...syncState });
  return () => syncSubscribers.delete(callback);
}

export const getDefaultImageForTopic = defaultImageForTopic;

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
      if (key === STORAGE_KEYS.MOCK_QUESTIONS) {
        // Large question collections exceed the 5 MB localStorage quota and stall JSON serialization
        return;
      }
      const serialized = JSON.stringify(data);
      if (serialized.length > 1500000) {
        return;
      }
      window.localStorage.setItem(key, serialized);
    }
  } catch (e) {
    if (e?.name !== 'QuotaExceededError') {
      console.warn('[Cache] Save error for key', key, e);
    }
  }
}

function serializeValue(value) {
  if (value && typeof value.toDate === 'function') {
    try {
      return value.toDate().toISOString();
    } catch {
      return String(value);
    }
  }
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value && typeof value === 'object' && value.constructor === Object) {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = serializeValue(v);
    }
    return out;
  }
  return value;
}

function hydrateDoc(id, data) {
  return { id, ...serializeValue(data || {}) };
}

function stripUndefined(value) {
  if (value === undefined) return undefined;
  if (value === null || typeof value !== 'object') return value;
  if (typeof value.toDate === 'function') return value;
  if (Array.isArray(value)) {
    return value.map(stripUndefined).filter((item) => item !== undefined);
  }
  const out = {};
  for (const [key, nested] of Object.entries(value)) {
    if (nested === undefined) continue;
    const cleaned = stripUndefined(nested);
    if (cleaned !== undefined) out[key] = cleaned;
  }
  return out;
}

function sortByDateDesc(items, field = 'publishedAt') {
  return [...items].sort((a, b) => {
    const av = String(a[field] || a.eventDate || a.updatedAt || '');
    const bv = String(b[field] || b.eventDate || b.updatedAt || '');
    if (bv !== av) return bv.localeCompare(av);
    const au = String(a.updatedAt || a.id || '');
    const bu = String(b.updatedAt || b.id || '');
    return bu.localeCompare(au);
  });
}

function isDraft(item) {
  const status = String(item?.status || '').toLowerCase();
  return status === 'draft' || status === 'unpublished' || item?.published === false;
}

function safeId(raw, prefix) {
  const source = String(raw || `${prefix}-${Date.now()}`);
  return source
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '') || `${prefix}-${Date.now()}`;
}

function recordError(component, err) {
  const msg = err instanceof Error ? err.message : String(err);
  lastFirestoreError = msg;
  logAppError({
    category: 'Firestore',
    message: msg,
    component
  });
  return msg;
}

function assertInlineSize(payload) {
  const image = payload.imageUrl || payload.pdfUrl || payload.downloadUrl || '';
  if (typeof image === 'string' && image.startsWith('data:') && image.length > MAX_INLINE_BYTES) {
    throw new Error('File is too large for Firestore (1 MB document limit). Use an image/PDF URL instead of uploading a large file.');
  }
}

function requireFirebaseWrite() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase is not connected. The change was not saved for other devices.');
  }
}

async function fetchCollection(name) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map((d) => hydrateDoc(d.id, d.data()));
}

function cachedOrEmpty(key) {
  const cached = getLocalData(key, null);
  return Array.isArray(cached) ? cached : [];
}

const updatesSubscribers = new Set();

export function mergeUpdatesWithInitial(customItems) {
  const custom = Array.isArray(customItems) ? customItems : [];
  if (custom.length === 0) return INITIAL_UPDATES;

  const customIds = new Set(custom.map((c) => c.id).filter(Boolean));
  const customTitles = new Set(
    custom.map((c) => (c.title?.en || c.title || '').toLowerCase().trim()).filter(Boolean)
  );

  const nonOverlapping = INITIAL_UPDATES.filter((base) => {
    if (customIds.has(base.id)) return false;
    const titleKey = (base.title?.en || base.title || '').toLowerCase().trim();
    if (titleKey && customTitles.has(titleKey)) return false;
    return true;
  });

  return sortByDateDesc([...custom, ...nonOverlapping]);
}

function notifyUpdatesSubscribers(items) {
  const merged = mergeUpdatesWithInitial(items);
  updatesSubscribers.forEach((subscriber) => {
    try {
      subscriber(merged);
    } catch (err) {
      console.warn('[UpdatesSubscriber] Error in listener:', err);
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.UPDATES) {
      try {
        const next = JSON.parse(e.newValue || '[]');
        notifyUpdatesSubscribers(next);
      } catch (err) {
        // ignore
      }
    }
  });
}

export async function getUpdates(includeDrafts = false) {
  if (isFirebaseConfigured && db) {
    try {
      const items = sortByDateDesc(await fetchCollection('updates'));
      if (items.length > 0) {
        saveLocalData(STORAGE_KEYS.UPDATES, items);
      }
      markSyncSuccess();
      const merged = mergeUpdatesWithInitial(items);
      return withEffectiveStatusList(includeDrafts ? merged : merged.filter((item) => !isDraft(item)));
    } catch (err) {
      recordError('firestoreService.getUpdates', err);
      markSyncFailure(err);
      const cached = cachedOrEmpty(STORAGE_KEYS.UPDATES);
      const merged = mergeUpdatesWithInitial(cached);
      return withEffectiveStatusList(includeDrafts ? merged : merged.filter((item) => !isDraft(item)));
    }
  }

  const cached = getLocalData(STORAGE_KEYS.UPDATES, []);
  const merged = mergeUpdatesWithInitial(cached);
  return withEffectiveStatusList(includeDrafts ? merged : merged.filter((item) => !isDraft(item)));
}

export function subscribeToUpdates(callback, includeDrafts = false) {
  let settled = false;
  const emit = (rawItems) => {
    settled = true;
    const resolved = mergeUpdatesWithInitial(rawItems);
    callback(
      withEffectiveStatusList(includeDrafts ? resolved : resolved.filter((item) => !isDraft(item)))
    );
  };

  // 1. Immediately emit current cached/local updates so UI doesn't hang or delay
  const cached = cachedOrEmpty(STORAGE_KEYS.UPDATES);
  emit(cached.length ? cached : INITIAL_UPDATES);

  // 2. Register in-memory reactive listener
  const memoryListener = (mergedItems) => {
    callback(
      withEffectiveStatusList(includeDrafts ? mergedItems : mergedItems.filter((item) => !isDraft(item)))
    );
  };
  updatesSubscribers.add(memoryListener);

  let unsubscribeFirestore = () => {};

  if (isFirebaseConfigured && db) {
    const timeoutId = setTimeout(() => {
      if (!settled) {
        const c = cachedOrEmpty(STORAGE_KEYS.UPDATES);
        emit(c.length ? c : INITIAL_UPDATES);
      }
    }, 8000);

    try {
      unsubscribeFirestore = onSnapshot(
        collection(db, 'updates'),
        (snapshot) => {
          clearTimeout(timeoutId);
          const items = sortByDateDesc(snapshot.docs.map((d) => hydrateDoc(d.id, d.data())));
          saveLocalData(STORAGE_KEYS.UPDATES, items);
          markSyncSuccess();
          emit(items);
        },
        (error) => {
          clearTimeout(timeoutId);
          recordError('subscribeToUpdates', error);
          markSyncFailure(error);
          const c = cachedOrEmpty(STORAGE_KEYS.UPDATES);
          emit(c.length ? c : INITIAL_UPDATES);
        }
      );
    } catch (err) {
      clearTimeout(timeoutId);
      recordError('subscribeToUpdates', err);
      const c = cachedOrEmpty(STORAGE_KEYS.UPDATES);
      emit(c.length ? c : INITIAL_UPDATES);
    }
  }

  return () => {
    updatesSubscribers.delete(memoryListener);
    unsubscribeFirestore();
  };
}

export async function getUpdateById(id) {
  if (!id) return null;

  // Check local/merged collection first for immediate zero-latency display
  const cached = getLocalData(STORAGE_KEYS.UPDATES, []);
  const list = mergeUpdatesWithInitial(cached);
  const foundLocal = list.find((item) => item.id === id || item.slug === id);
  if (foundLocal) {
    return withEffectiveStatus(foundLocal);
  }

  if (isFirebaseConfigured && db) {
    try {
      const direct = await getDoc(doc(db, 'updates', id));
      if (direct.exists()) {
        return withEffectiveStatus(hydrateDoc(direct.id, direct.data()));
      }
      const items = await fetchCollection('updates');
      const found = items.find((item) => item.id === id || item.slug === id);
      return found ? withEffectiveStatus(found) : null;
    } catch (err) {
      recordError('firestoreService.getUpdateById', err);
    }
  }

  return null;
}

export async function saveUpdate(item) {
  const nowIso = new Date().toISOString();
  const id = safeId(item.id || `notif-${Date.now()}`, 'notif');
  const rawSlug = item.slug || (typeof item.title === 'string' ? item.title : item.title?.en || id);
  const slug = safeId(rawSlug, id);
  const publishedAt = item.publishedAt || formatDateIST(new Date());

  const { [AUTO_CLOSED_FLAG]: _unused, ...fields } = item;

  const startDate = normalizeDateIST(getApplicationStartDate(fields));
  const lastDate = normalizeDateIST(getApplicationLastDate(fields));

  let status = fields.status;
  if (!isDraft(fields)) {
    if (startDate || lastDate) {
      status = calculateJobStatus(startDate, lastDate);
    }
  }

  const payload = stripUndefined({
    ...fields,
    applicationStartDate: startDate || undefined,
    applicationLastDate: lastDate || undefined,
    openingDate: startDate || fields.openingDate || undefined,
    deadline: lastDate || fields.deadline || undefined,
    publishedAt: normalizeDateIST(fields.publishedAt) || fields.publishedAt || publishedAt,
    examDate: fields.examDate ? String(fields.examDate).trim() : undefined,
    admitCardDate: fields.admitCardDate ? (normalizeDateIST(fields.admitCardDate) || fields.admitCardDate) : undefined,
    resultDate: fields.resultDate ? (normalizeDateIST(fields.resultDate) || fields.resultDate) : undefined,
    status,
    id,
    slug,
    updatedAt: nowIso,
    verifiedAt: isDraft(fields) ? fields.verifiedAt || null : fields.verifiedAt || nowIso
  });
  assertInlineSize(payload);

  // 1. Immediately store in local cache so this browser session and all public pages reflect it instantly
  const list = cachedOrEmpty(STORAGE_KEYS.UPDATES);
  const index = list.findIndex((entry) => entry.id === id);
  if (index >= 0) list[index] = payload;
  else list.unshift(payload);
  saveLocalData(STORAGE_KEYS.UPDATES, list);

  // 2. Notify all active in-memory subscribers across the app (JobsPage, HomePage, LiveAlerts)
  notifyUpdatesSubscribers(list);

  // 3. Attempt Firestore persist if configured
  let firestoreSynced = false;
  let syncError = null;
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'updates', id), { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
      markSyncSuccess();
      firestoreSynced = true;
    } catch (err) {
      const msg = recordError('firestoreService.saveUpdate', err);
      markSyncFailure(err);
      syncError = msg;
      console.warn('Firestore write warning (saved locally to this browser):', msg);
    }
  }

  return { ...payload, _firestoreSynced: firestoreSynced, _syncError: syncError };
}

export async function deleteUpdate(id) {
  const current = cachedOrEmpty(STORAGE_KEYS.UPDATES);
  const filtered = current.filter((item) => item.id !== id);
  saveLocalData(STORAGE_KEYS.UPDATES, filtered);
  notifyUpdatesSubscribers(filtered);

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'updates', id));
      markSyncSuccess();
    } catch (err) {
      recordError('firestoreService.deleteUpdate', err);
      markSyncFailure(err);
    }
  }
  return true;
}

export async function deleteAllUpdates() {
  saveLocalData(STORAGE_KEYS.UPDATES, []);
  notifyUpdatesSubscribers([]);

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'updates'));
      const deletePromises = snap.docs.map((d) => deleteDoc(doc(db, 'updates', d.id)));
      await Promise.all(deletePromises);
      markSyncSuccess();
    } catch (err) {
      recordError('firestoreService.deleteAllUpdates', err);
      markSyncFailure(err);
      console.warn('Firestore deleteAllUpdates warning:', err);
    }
  }
  return true;
}

export async function getCurrentAffairs(includeDrafts = false) {
  if (isFirebaseConfigured && db) {
    try {
      const list = sortByDateDesc(await fetchCollection('currentAffairs')).map((item) => ({
        ...item,
        imageUrl: item.imageUrl || getDefaultImageForTopic(item.topic),
        examRelevance: item.examRelevance?.length ? item.examRelevance : ['UPSC', 'APPSC', 'SSC']
      }));
      saveLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, list);
      markSyncSuccess();
      return includeDrafts ? list : list.filter((item) => !isDraft(item));
    } catch (err) {
      recordError('firestoreService.getCurrentAffairs', err);
      markSyncFailure(err);
      const cached = cachedOrEmpty(STORAGE_KEYS.CURRENT_AFFAIRS);
      const source = cached.length ? cached : INITIAL_CURRENT_AFFAIRS;
      const list = source.map((item) => ({
        ...item,
        imageUrl: item.imageUrl || getDefaultImageForTopic(item.topic),
        examRelevance: item.examRelevance?.length ? item.examRelevance : ['UPSC', 'APPSC', 'SSC']
      }));
      return includeDrafts ? list : list.filter((item) => !isDraft(item));
    }
  }

  const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS).map((item) => ({
    ...item,
    imageUrl: item.imageUrl || getDefaultImageForTopic(item.topic),
    examRelevance: item.examRelevance?.length ? item.examRelevance : ['UPSC', 'APPSC', 'SSC']
  }));
  return includeDrafts ? list : list.filter((item) => !isDraft(item));
}

export function subscribeToCurrentAffairs(callback, includeDrafts = false) {
  let liveSettled = false;
  const decorate = (list) => {
    const source = Array.isArray(list) && list.length > 0 ? list : INITIAL_CURRENT_AFFAIRS;
    return sortByDateDesc(source).map((item) => ({
      ...item,
      imageUrl: item.imageUrl || getDefaultImageForTopic(item.topic),
      examRelevance: item.examRelevance?.length ? item.examRelevance : ['UPSC', 'APPSC', 'SSC']
    }));
  };
  const emit = (items) => {
    const next = decorate(items);
    callback(includeDrafts ? next : next.filter((item) => !isDraft(item)));
  };

  // 1. Immediately emit in-memory, cached, or seed articles so ALL current affairs open instantaneously (0ms)
  const initialCached = inMemoryCurrentAffairs?.length
    ? inMemoryCurrentAffairs
    : cachedOrEmpty(STORAGE_KEYS.CURRENT_AFFAIRS);
  emit(initialCached.length ? initialCached : INITIAL_CURRENT_AFFAIRS);

  if (isFirebaseConfigured && db) {
    const timeoutId = setTimeout(() => {
      if (!liveSettled) {
        const cached = cachedOrEmpty(STORAGE_KEYS.CURRENT_AFFAIRS);
        if (cached.length) emit(cached);
      }
    }, 3500);

    try {
      const unsubscribe = onSnapshot(
        collection(db, 'currentAffairs'),
        (snapshot) => {
          liveSettled = true;
          clearTimeout(timeoutId);
          const list = sortByDateDesc(snapshot.docs.map((d) => hydrateDoc(d.id, d.data())));
          if (list.length > 0) {
            inMemoryCurrentAffairs = list;
            saveLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, list);
          }
          markSyncSuccess();
          emit(list);
        },
        (error) => {
          liveSettled = true;
          clearTimeout(timeoutId);
          recordError('subscribeToCurrentAffairs', error);
          markSyncFailure(error);
        }
      );
      return () => {
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } catch (err) {
      liveSettled = true;
      clearTimeout(timeoutId);
      recordError('subscribeToCurrentAffairs', err);
    }
  }

  return () => {};
}

export async function getCurrentAffairById(id) {
  if (!id) return null;
  const decorate = (item) =>
    item
      ? {
          ...item,
          imageUrl: item.imageUrl || getDefaultImageForTopic(item.topic),
          examRelevance: item.examRelevance?.length ? item.examRelevance : ['UPSC', 'APPSC', 'SSC']
        }
      : null;

  if (isFirebaseConfigured && db) {
    try {
      const direct = await getDoc(doc(db, 'currentAffairs', id));
      if (direct.exists()) return decorate(hydrateDoc(direct.id, direct.data()));
      const items = await fetchCollection('currentAffairs');
      return decorate(items.find((item) => item.id === id || item.slug === id) || null);
    } catch (err) {
      recordError('firestoreService.getCurrentAffairById', err);
    }
  }

  const list = getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS);
  return decorate(list.find((item) => item.id === id || item.slug === id) || null);
}

export async function saveCurrentAffair(article) {
  requireFirebaseWrite();

  const nowIso = new Date().toISOString();
  const id = safeId(article.id || `ca-${Date.now()}`, 'ca');
  const rawSlug = article.slug || (typeof article.headline === 'string' ? article.headline : article.headline?.en || id);
  const slug = safeId(rawSlug, id);
  const status = article.status || 'Published';

  const payload = stripUndefined({
    ...article,
    id,
    slug,
    status,
    publishedAt: article.publishedAt || nowIso.split('T')[0],
    createdAt: article.createdAt || nowIso,
    verifiedAt: nowIso,
    imageUrl: article.imageUrl || getDefaultImageForTopic(article.topic)
  });
  assertInlineSize(payload);

  try {
    await setDoc(doc(db, 'currentAffairs', id), { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    const msg = recordError('firestoreService.saveCurrentAffair', err);
    markSyncFailure(err);
    throw new Error(`Firestore save failed: ${msg}`);
  }

  const list = cachedOrEmpty(STORAGE_KEYS.CURRENT_AFFAIRS);
  const index = list.findIndex((entry) => entry.id === id);
  if (index >= 0) list[index] = payload;
  else list.unshift(payload);
  saveLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, list);
  markSyncSuccess();
  return payload;
}

export async function deleteCurrentAffair(id) {
  requireFirebaseWrite();
  try {
    await deleteDoc(doc(db, 'currentAffairs', id));
  } catch (err) {
    const msg = recordError('firestoreService.deleteCurrentAffair', err);
    throw new Error(`Firestore delete failed: ${msg}`);
  }
  saveLocalData(
    STORAGE_KEYS.CURRENT_AFFAIRS,
    cachedOrEmpty(STORAGE_KEYS.CURRENT_AFFAIRS).filter((item) => item.id !== id)
  );
  return true;
}

export async function getQuestions() {
  if (isFirebaseConfigured && db) {
    try {
      const items = await fetchCollection('questions');
      saveLocalData(STORAGE_KEYS.QUESTIONS, items);
      return items;
    } catch (err) {
      recordError('firestoreService.getQuestions', err);
      const cached = cachedOrEmpty(STORAGE_KEYS.QUESTIONS);
      return cached.length ? cached : INITIAL_QUESTIONS;
    }
  }
  return getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
}

export async function saveQuestion(question) {
  requireFirebaseWrite();
  const id = safeId(question.id || `gk-${Date.now()}`, 'gk');
  const payload = stripUndefined({ ...question, id });
  try {
    await setDoc(doc(db, 'questions', id), { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    const msg = recordError('firestoreService.saveQuestion', err);
    throw new Error(`Firestore save failed: ${msg}`);
  }
  const list = cachedOrEmpty(STORAGE_KEYS.QUESTIONS);
  const index = list.findIndex((entry) => entry.id === id);
  if (index >= 0) list[index] = payload;
  else list.unshift(payload);
  saveLocalData(STORAGE_KEYS.QUESTIONS, list);
  return payload;
}

export async function deleteQuestion(id) {
  requireFirebaseWrite();
  try {
    await deleteDoc(doc(db, 'questions', id));
  } catch (err) {
    const msg = recordError('firestoreService.deleteQuestion', err);
    throw new Error(`Firestore delete failed: ${msg}`);
  }
  saveLocalData(STORAGE_KEYS.QUESTIONS, cachedOrEmpty(STORAGE_KEYS.QUESTIONS).filter((item) => item.id !== id));
  return true;
}

export function mapRrbToMockQuestion(q) {
  const safeQText = typeof q.question === 'string'
    ? q.question
    : (typeof q.question?.en === 'string' ? q.question.en : (typeof q.question?.te === 'string' ? q.question.te : ''));
  const safeOptsText = Array.isArray(q.options?.en)
    ? q.options.en.join(' ')
    : (q.options && typeof q.options === 'object' ? Object.values(q.options).filter(v => typeof v === 'string').join(' ') : '');
  const text = (safeQText + ' ' + (q.subtopic || '') + ' ' + safeOptsText).toLowerCase();
  const rawSub = (q.subject || '').toLowerCase();
  const rawCat = (q.categoryId || '').toLowerCase();

  let subject = 'General Knowledge';
  let categoryId = 'gk';
  let subjectId = 'general-knowledge';
  let subtopic = q.subtopic || q.topic || 'Static GK & Culture';

  // 0. Current Affairs (check explicitly before generic GK fallthrough)
  if (
    rawSub.includes('current affair') ||
    rawSub.includes('current-affairs') ||
    rawCat === 'ca' ||
    String(q.subjectId || '').toLowerCase() === 'current-affairs'
  ) {
    subject = 'Current Affairs';
    categoryId = q.categoryId || 'gk';
    subjectId = 'current-affairs';
    subtopic = q.subtopic || q.topic || 'National Affairs';
  }
  // 1. English Language
  else if (rawSub.includes('english') || rawCat === 'english' || q.sectionName?.includes('English')) {
    subject = 'English Language';
    categoryId = 'english';
    subjectId = 'english-language';
    subtopic = q.subtopic || 'Grammar & Error Spotting';
    if (!q.subtopic) {
      if (text.includes('idiom') || text.includes('phrase')) subtopic = 'Idioms & Phrases';
      else if (text.includes('synonym') || text.includes('antonym')) subtopic = 'Vocabulary, Synonyms & Antonyms';
      else if (text.includes('one word') || text.includes('spelt') || text.includes('spelling') || text.includes('misspelt')) subtopic = 'One Word Substitution & Spelling';
      else if (text.includes('passage') || text.includes('comprehension') || text.includes('cloze')) subtopic = 'Reading Comprehension & Cloze Test';
      else if (text.includes('jumbled') || text.includes('rearrangement') || text.includes('rearrange')) subtopic = 'Sentence Rearrangement & Para Jumbles';
    }
  }
  // 2. Computer Science
  else if (
    rawSub.includes('computer') || rawCat === 'cse' ||
    q.subtopic?.includes('Computer') || q.subtopic === 'Operating Systems' || q.subtopic === 'Computer Networks' || q.subtopic === 'Database Management Systems' || q.subtopic === 'Programming & OOP' || q.subtopic === 'Software Engineering' || q.subtopic === 'Digital Logic & Computer Organization' ||
    (!q.topicId && (
      text.includes('operating system') || text.includes('windows') || text.includes('linux') || text.includes('kernel') || text.includes('ms-dos') ||
      text.includes('ip address') || text.includes('lan ') || text.includes('wan ') || text.includes('computer network') || text.includes('tcp/ip') || text.includes('router') ||
      text.includes('database') || text.includes('dbms') || text.includes('sql') || text.includes('rdbms') ||
      text.includes('compiler') || text.includes('programming') || text.includes('algorithm') || text.includes('binary tree') ||
      text.includes('ms office') || text.includes('ms word') || text.includes('ms excel') || text.includes('spreadsheet') || text.includes('powerpoint') ||
      text.includes('motherboard') || text.includes('microprocessor') || text.includes('logic gate') || text.includes('digital logic')
    ))
  ) {
    subject = 'Computer Science';
    categoryId = 'cse';
    subjectId = 'computer-science';
    subtopic = q.subtopic || 'Computer Fundamentals & Awareness';
    if (!q.subtopic) {
      if (text.includes('operating system') || text.includes('windows') || text.includes('linux') || text.includes('kernel')) subtopic = 'Operating Systems';
      else if (text.includes('network') || text.includes('ip address') || text.includes('lan ') || text.includes('internet') || text.includes('protocol')) subtopic = 'Computer Networks';
      else if (text.includes('database') || text.includes('dbms') || text.includes('sql')) subtopic = 'Database Management Systems';
      else if (text.includes('programming') || text.includes('compiler') || text.includes('java') || text.includes('python')) subtopic = 'Programming & OOP';
      else if (text.includes('software') || text.includes('testing') || text.includes('malware') || text.includes('virus')) subtopic = 'Software Engineering';
      else if (text.includes('logic gate') || text.includes('binary') || text.includes('digital logic')) subtopic = 'Digital Logic & Computer Organization';
    }
  }
  // 3. Quantitative Aptitude
  else if (rawSub.includes('quant') || rawSub.includes('math') || rawCat === 'quant' || q.sectionName?.includes('Quantitative') || q.sectionName?.includes('Mathematics')) {
    subject = 'Quantitative Aptitude';
    categoryId = 'quant';
    subjectId = 'quantitative-aptitude';
    subtopic = q.subtopic || q.topic || 'Number System & Simplification';
    if (!q.subtopic) {
      if (text.includes('work') || text.includes('pipe') || text.includes('cistern') || text.includes('speed') || text.includes('distance') || text.includes('train') || text.includes('boat')) subtopic = 'Time, Speed, Distance & Work';
      else if (text.includes('profit') || text.includes('loss') || text.includes('discount') || text.includes('interest') || text.includes('percent')) subtopic = 'Percentage, Profit & Loss';
      else if (text.includes('ratio') || text.includes('proportion') || text.includes('mixture') || text.includes('average') || text.includes('partnership')) subtopic = 'Ratio, Proportion & Mixtures';
      else if (text.includes('area') || text.includes('perimeter') || text.includes('volume') || text.includes('surface') || text.includes('triangle') || text.includes('circle') || text.includes('cylinder') || text.includes('cone') || text.includes('sphere') || text.includes('prism')) subtopic = 'Mensuration & Geometry';
      else if (text.includes('algebra') || text.includes('equation') || text.includes('trigonometr') || text.includes('sin ') || text.includes('cos ') || text.includes('tan ') || text.includes('sec ') || text.includes('cosec ') || text.includes('cot ')) subtopic = 'Algebra & Trigonometry';
      else if (text.includes('pie chart') || text.includes('bar graph') || text.includes('histogram') || text.includes('table')) subtopic = 'Data Interpretation';
    }
  }
  // 4. Reasoning
  else if (rawSub.includes('reason') || rawCat === 'reasoning' || q.sectionName?.includes('Intelligence') || q.sectionName?.includes('Reasoning')) {
    subject = 'Reasoning';
    categoryId = 'reasoning';
    subjectId = 'reasoning';
    subtopic = q.subtopic || q.topic || 'Series & Coding-Decoding';
    if (!q.subtopic) {
      if (text.includes('blood') || text.includes('direction') || text.includes('facing') || text.includes('turns left') || text.includes('turns right')) subtopic = 'Blood Relations & Direction Sense';
      else if (text.includes('syllogism') || text.includes('conclusion') || text.includes('statement') || text.includes('assumption')) subtopic = 'Syllogisms & Statements';
      else if (text.includes('seating') || text.includes('circular table') || text.includes('row') || text.includes('floor') || text.includes('puzzle')) subtopic = 'Puzzles & Seating Arrangement';
      else if (text.includes('mirror') || text.includes('water image') || text.includes('paper fold') || text.includes('cube') || text.includes('dice') || text.includes('figure')) subtopic = 'Non-Verbal Reasoning';
      else if (text.includes('analogy') || text.includes('related') || text.includes('odd one') || text.includes('share the same relationship')) subtopic = 'Analogy & Classification';
    }
  }
  // 5. General Science
  else if (
    rawSub.includes('science') || rawCat === 'general-science' || rawCat === 'science' ||
    (!q.topicId && (
      text.includes('acid') || text.includes('base') || text.includes('element') || text.includes('compound') || text.includes('metal') || text.includes('chemical') || text.includes('periodic table') ||
      text.includes('cell') || text.includes('tissue') || text.includes('organ') || text.includes('vitamin') || text.includes('protein') || text.includes('disease') || text.includes('bacteria') || text.includes('virus') || text.includes('blood') || text.includes('plant') || text.includes('respiration') ||
      text.includes('force') || text.includes('gravity') || text.includes('motion') || text.includes('energy') || text.includes('lens') || text.includes('optics') || text.includes('sound') || text.includes('frequency') || text.includes('voltage') || text.includes('resistance') || text.includes('newton') || text.includes('watt')
    ))
  ) {
    subject = 'General Science';
    categoryId = 'general-science';
    subjectId = 'general-science';
    subtopic = q.subtopic || q.topic || 'Physics';
    if (!q.subtopic) {
      if (text.includes('cell') || text.includes('tissue') || text.includes('organ') || text.includes('vitamin') || text.includes('disease') || text.includes('blood') || text.includes('plant') || text.includes('biology')) subtopic = 'Biology';
      else if (text.includes('acid') || text.includes('base') || text.includes('chemical') || text.includes('reaction') || text.includes('metal') || text.includes('chemistry')) subtopic = 'Chemistry';
    }
  }
  // 6. General Knowledge
  else {
    subject = 'General Knowledge';
    categoryId = 'gk';
    subjectId = 'general-knowledge';
    subtopic = q.subtopic || q.topic || 'Static GK & Culture';
    if (!q.subtopic) {
      if (text.includes('article') || text.includes('constitution') || text.includes('amendment') || text.includes('court') || text.includes('parliament') || text.includes('president') || text.includes('polity') || text.includes('fundamental rights') || text.includes('lok sabha') || text.includes('rajya sabha')) subtopic = 'Indian Polity & Constitution';
      else if (text.includes('dynasty') || text.includes('battle') || text.includes('british') || text.includes('gandhi') || text.includes('mughal') || text.includes('history') || text.includes('harappa') || text.includes('ashoka') || text.includes('akbar')) subtopic = 'Indian History';
      else if (text.includes('river') || text.includes('mountain') || text.includes('soil') || text.includes('climate') || text.includes('geography') || text.includes('lake') || text.includes('ocean') || text.includes('pass') || text.includes('tributary')) subtopic = 'Geography';
      else if (text.includes('rbi') || text.includes('gdp') || text.includes('bank') || text.includes('inflation') || text.includes('economy') || text.includes('budget') || text.includes('tax') || text.includes('five year plan')) subtopic = 'Indian Economy';
      else if (text.includes('national park') || text.includes('sanctuary') || text.includes('biosphere') || text.includes('wetland') || text.includes('ecology') || text.includes('environment')) subtopic = 'Environment & Ecology';
      else if (text.includes('scheme') || text.includes('yojana') || text.includes('pradhan mantri')) subtopic = 'Government Schemes';
      else if (text.includes('2024') || text.includes('2025') || text.includes('2026') || text.includes('olympic') || text.includes('summit') || text.includes('award') || text.includes('current affair')) subtopic = 'Current Affairs';
    }
  }

  const isAppsc =
    q.examType === 'APPSC Group II' ||
    String(q.id || '').includes('appsc');
  const isGroupD =
    !isAppsc && (
      q.examType === 'RRB Group D' ||
      String(q.id || '').includes('rrb-group-d') ||
      String(q.examLevel || '').toLowerCase().includes('group d') ||
      String(q.examLevel || '').toLowerCase().includes('level-1')
    );
  const isSsc = !isAppsc && !isGroupD && (q.examType === 'SSC CGL' || String(q.id || '').startsWith('ssc-cgl'));
  const isUnverified =
    q.status === 'Needs Review' ||
    q.status === 'Draft' ||
    String(q.verificationStatus || '').toUpperCase() === 'UNVERIFIED' ||
    String(q.questionType || '').toUpperCase() === 'IMPORTANT' ||
    q.isVerified === false;

  const verificationStatus = isUnverified ? 'UNVERIFIED' : (q.verificationStatus || 'VERIFIED');
  const status = isUnverified ? (q.status || 'Needs Review') : (q.status || 'Published');
  const questionType = isUnverified ? 'IMPORTANT' : (q.questionType || 'PYQ');

  const isAppscPrelims2024 = isAppsc && (
    q.paperNumber === 0 ||
    q.examYear === '2024' ||
    String(q.id || '').toLowerCase().includes('2024-prelims') ||
    String(q.examName || '').toLowerCase().includes('prelims')
  );
  const isAppscPaper1 = isAppsc && !isAppscPrelims2024 && (
    q.paperNumber === 1 ||
    String(q.id || '').toLowerCase().includes('-p1-') ||
    String(q.examName || '').toLowerCase().includes('paper-1')
  );

  // Graduate 2026 (March 16-27, 2026 CBT-1) vs Previous Graduate (05/06/2025 relabeled to 2024) vs Group D 2025 vs APPSC Group II
  let examLevel = q.examLevel || (isAppsc ? 'Group II' : (isGroupD ? 'Level-1 (Group D)' : (isSsc ? 'Graduate' : 'Under Graduate')));
  let examLevelLabel = q.examLevelLabel || (isAppscPrelims2024 ? 'APPSC Group-II Prelims (2024)' : isAppscPaper1 ? 'APPSC Group-II Paper-I (2025)' : isAppsc ? 'APPSC Group-II Paper-II (2025)' : (isGroupD ? 'Level-1 (Group D · CEN 09/2025)' : (isSsc ? 'SSC CGL' : 'Under Graduate')));
  let examYear = q.examYear || (isSsc ? '2020' : '2025');
  let examName = q.examName || (isAppscPrelims2024 ? 'APPSC Group-2 Prelims (2024)' : isAppscPaper1 ? 'APPSC Group-2 Paper-1 (2025)' : isAppsc ? 'APPSC Group-2 Paper-2 (2025)' : (isGroupD ? 'RRB Group D 2025 (CEN 09/2025)' : (isSsc ? 'SSC CGL 2020 Tier-I' : 'RRB NTPC Under Graduate 2025 (CEN 07/2025)')));
  let source = q.source;
  let paperUrl = q.paperUrl;
  let paperFileName = q.paperFileName;

  const isGrad = !isAppsc && !isGroupD && (q.examLevel === 'Graduate' || String(q.id || '').includes('rrb-ntpc-grad'));
  if (isAppsc) {
    examLevel = 'Group II';
    examLevelLabel = isAppscPrelims2024 ? 'APPSC Group-II Prelims (2024)' : isAppscPaper1 ? 'APPSC Group-II Paper-I (2025)' : 'APPSC Group-II Paper-II (2025)';
    examYear = q.examYear || (isAppscPrelims2024 ? '2024' : '2025');
    examName = q.examName || (isAppscPrelims2024 ? 'APPSC Group-2 Prelims (2024)' : isAppscPaper1 ? 'APPSC Group-2 Paper-1 (2025)' : 'APPSC Group-2 Paper-2 (2025)');
    source = q.source || (isAppscPrelims2024
      ? 'APPSC Group-2 Prelims (25 Feb 2024) Official Question Paper · Booklet Series (A)'
      : isAppscPaper1
      ? 'APPSC Group-2 Paper-1 (2025) Official Question Paper · Series (C)'
      : 'APPSC Group-2 Paper-2 (2025) Official Question Paper · Series (C)');
    paperUrl = q.paperUrl || (isAppscPrelims2024
      ? '/assets/aistudio/APPSC-Group-II-Preliminary-Exam-Official-Paper-Held-On_-25-Feb-2024_3a12a02d.pdf'
      : isAppscPaper1
      ? '/assets/aistudio/Group-2-_-Prelims-Exam-Question-Paper-1-2025_copy_0f4dabbf.pdf'
      : '/assets/aistudio/Group-2-_-Prelims-Exam-Question-Paper-2-2025_copy_f6e37955.pdf');
    paperFileName = q.paperFileName || (isAppscPrelims2024
      ? 'APPSC-Group-II-Preliminary-Exam-Official-Paper-Held-On_-25-Feb-2024.pdf'
      : isAppscPaper1
      ? 'Group-2-_-Prelims-Exam-Question-Paper-1-2025.pdf'
      : 'Group-2-_-Prelims-Exam-Question-Paper-2-2025.pdf');
  } else if (isGroupD) {
    examLevel = 'Level-1 (Group D)';
    examLevelLabel = 'Level-1 (Group D · CEN 09/2025)';
    examYear = q.examYear || '2025';
    examName = q.examName || 'RRB Group D 2025 (CEN 09/2025)';
    source = q.source || 'RRB Group D 2025 Official Answer Key (CEN 09/2025)';
    paperUrl = q.paperUrl || '/assets/aistudio/RRB-Group-D-2025-EN-All-Sections_dece0c81.pdf';
    paperFileName = q.paperFileName || 'RRB-Group-D-2025-EN-All-Sections.pdf';
  } else if (isGrad) {
    examLevel = 'Graduate';
    const is2026Exam =
      q.examYear === '2026' ||
      String(q.id || '').includes('grad-2026') ||
      String(q.examDate || '').includes('2026') ||
      String(q.examDate || '').includes('Mar') ||
      String(q.source || '').includes('2025-26') ||
      String(q.paperFileName || '').includes('Complete-Paper');

    if (is2026Exam) {
      examYear = '2026';
      examName = 'RRB NTPC Graduate 2025-26 (CEN 06/2025)';
      examLevelLabel = 'Graduate (March 2026 Exam)';
      source = q.source || 'RRB NTPC Graduate 2025-26 Official Answer Key (CEN 06/2025 · Sets 1-24)';
      paperUrl = '/assets/aistudio/RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key.pdf';
      paperFileName = 'RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key.pdf';
    } else {
      // User explicitly requested: "then change previous rrb ntpc graduate 2025 to 2024"
      examYear = '2024';
      examName = 'RRB NTPC Graduate 2024 (CBT-1)';
      examLevelLabel = 'Graduate 2024';
      source = q.source || 'RRB NTPC Graduate 2024 Official Answer Key (CEN 06/2024)';
      paperUrl = '/assets/aistudio/RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key_887400b5.pdf';
      paperFileName = 'RRB-NTPC-Graduate-2024-CBT1-Official-Answer-Key.pdf';
    }
  } else if (isSsc) {
    source = q.source || 'SSC CGL Tier-I Official Question Paper (QMaths / SSC)';
    paperUrl = q.paperUrl || '/assets/aistudio/SSC_CGL_2020_All_21_Sets_English.pdf';
    paperFileName = q.paperFileName || 'SSC_CGL_2020_All_21_Sets_English.pdf';
  } else {
    source = q.source || 'RRB Official Answer Key (CEN 07/2025)';
    paperUrl = q.paperUrl || '/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf';
    paperFileName = q.paperFileName || 'RRB-NTPC-UG-2025-EN-All-Papers.pdf';
  }

  return {
    ...q,
    examLevel,
    examLevelLabel,
    examYear,
    examName,
    subject,
    categoryId,
    subjectId,
    topicId: q.topicId,
    topic: q.topic || subtopic,
    subtopic,
    pdfSubtopic: q.pdfSubtopic,
    questionType,
    difficulty: q.difficulty || 'Medium',
    status,
    verificationStatus,
    source,
    paperUrl,
    paperFileName
  };
}

function getMockQuestionSignature(q) {
  if (!q) return null;
  const rawText = typeof q.question === 'object'
    ? (q.question?.en || q.question?.te || '')
    : (q.question || q.questionText || '');
  const cleanText = String(rawText || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (cleanText.length < 6) return null;
  const opts = Array.isArray(q.options?.en)
    ? q.options.en
    : (q.options && typeof q.options === 'object' ? Object.values(q.options) : []);
  const cleanOpts = opts.map((o) => String(o || '').toLowerCase().replace(/[^a-z0-9]/g, '')).join('|');
  return `${cleanText}:::${cleanOpts}`;
}

async function persistFirestoreMockCache(docs, serverSyncedAt = null) {
  const cleanDocs = (Array.isArray(docs) ? docs : []).filter(
    (d) => d && d.id && d.id !== '_stats_' && d.id !== '_test_ping_'
  );
  cachedFirestoreMockDocs = cleanDocs;
  const meta = {
    fetchedAt: Date.now(),
    serverSyncedAt: serverSyncedAt || cachedFirestoreMockMeta?.serverSyncedAt || null,
    count: cleanDocs.length
  };
  cachedFirestoreMockMeta = meta;
  await Promise.all([
    setIdbItem(IDB_MOCK_DOCS_KEY, cleanDocs),
    setIdbItem(IDB_MOCK_META_KEY, meta)
  ]);
  return cleanDocs;
}

async function fetchFirestoreMockDocs(forceRefresh = false) {
  if (
    !forceRefresh &&
    Array.isArray(cachedFirestoreMockDocs) &&
    cachedFirestoreMockMeta?.fetchedAt &&
    Date.now() - cachedFirestoreMockMeta.fetchedAt < MOCK_DOCS_TTL_MS
  ) {
    return cachedFirestoreMockDocs;
  }

  if (inflightMockFetchPromise && !forceRefresh) {
    return inflightMockFetchPromise;
  }

  const runFetch = async () => {
    const [idbDocsRaw, idbMetaRaw] = await Promise.all([
      getIdbItem(IDB_MOCK_DOCS_KEY),
      getIdbItem(IDB_MOCK_META_KEY)
    ]);

    const legacyLocal = cachedOrEmpty(STORAGE_KEYS.MOCK_QUESTIONS);
    let localDocs = Array.isArray(idbDocsRaw) ? idbDocsRaw : [];
    if (localDocs.length === 0 && legacyLocal.length > 0) {
      localDocs = legacyLocal;
    }

    if (
      !forceRefresh &&
      localDocs.length > 0 &&
      idbMetaRaw?.fetchedAt &&
      Date.now() - idbMetaRaw.fetchedAt < MOCK_DOCS_TTL_MS
    ) {
      cachedFirestoreMockDocs = localDocs;
      cachedFirestoreMockMeta = idbMetaRaw;
      return localDocs;
    }

    if (isFirebaseConfigured && db && Date.now() >= firestoreQuotaBlockedUntil) {
      try {
        if (!forceRefresh && localDocs.length > 0 && idbMetaRaw?.serverSyncedAt) {
          try {
            const statsSnap = await getDoc(doc(db, 'mockQuestions', '_stats_'));
            if (statsSnap.exists()) {
              const serverStats = statsSnap.data();
              if (
                serverStats?.syncedAt &&
                String(serverStats.syncedAt) <= String(idbMetaRaw.serverSyncedAt)
              ) {
                markSyncSuccess();
                await persistFirestoreMockCache(localDocs, serverStats.syncedAt);
                return localDocs;
              }
            }
          } catch (statsErr) {
            const checkMsg = String(statsErr?.message || '');
            if (checkMsg.includes('resource-exhausted') || checkMsg.includes('Quota')) {
              firestoreQuotaBlockedUntil = Date.now() + QUOTA_BACKOFF_MS;
              markSyncFailure(statsErr);
              cachedFirestoreMockDocs = localDocs;
              cachedFirestoreMockMeta = idbMetaRaw || { fetchedAt: Date.now(), count: localDocs.length };
              return localDocs;
            }
          }
        }

        const fetched = await fetchCollection('mockQuestions');
        const statsEntry = fetched.find((d) => d && d.id === '_stats_');
        const cleanDocs = fetched.filter(
          (d) => d && d.id && d.id !== '_stats_' && d.id !== '_test_ping_'
        );
        markSyncSuccess();
        await persistFirestoreMockCache(
          cleanDocs,
          statsEntry?.syncedAt || new Date().toISOString()
        );
        return cleanDocs;
      } catch (err) {
        const msg = recordError('firestoreService.getMockQuestions', err);
        markSyncFailure(err);
        if (msg.includes('resource-exhausted') || msg.includes('Quota')) {
          firestoreQuotaBlockedUntil = Date.now() + QUOTA_BACKOFF_MS;
        }
      }
    }

    cachedFirestoreMockDocs = localDocs;
    cachedFirestoreMockMeta = idbMetaRaw || { fetchedAt: Date.now(), count: localDocs.length };
    return localDocs;
  };

  inflightMockFetchPromise = runFetch().finally(() => {
    inflightMockFetchPromise = null;
  });

  return inflightMockFetchPromise;
}

function mergeStaticAndFirestoreQuestions(rrbQuestions, firestoreDocs) {
  const map = new Map();
  const seenSignatures = new Set();

  for (const q of rrbQuestions || []) {
    if (!q || !q.id) continue;
    map.set(q.id, q);
    const sig = getMockQuestionSignature(q);
    if (sig) seenSignatures.add(sig);
  }

  for (const raw of firestoreDocs || []) {
    if (!raw || raw.id === '_stats_' || raw.id === '_test_ping_' || raw._deleted) continue;
    if (map.has(raw.id)) {
      const existing = map.get(raw.id);
      map.set(raw.id, {
        ...existing,
        ...raw,
        _sourceOrigin: existing?._sourceOrigin || raw._sourceOrigin || 'previous-paper'
      });
      continue;
    }

    const q = mapRrbToMockQuestion({
      ...raw,
      _sourceOrigin: raw._sourceOrigin || 'uploaded'
    });
    const sig = getMockQuestionSignature(q);
    if (sig && seenSignatures.has(sig)) {
      continue;
    }
    if (sig) seenSignatures.add(sig);
    map.set(q.id, q);
  }

  return Array.from(map.values());
}

/**
 * Unified aggregation of Mock Test metrics across static paper archives,
 * Monthly Current Affairs, and Firestore/uploaded questions.
 */
export async function getDirectFirestoreMockStats(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = getCachedUnifiedStats();
    if (cached) {
      return cached;
    }

    if (isFirebaseConfigured && db && Date.now() >= firestoreQuotaBlockedUntil) {
      try {
        const statsSnap = await getDoc(doc(db, 'mockQuestions', '_stats_'));
        if (statsSnap.exists()) {
          const serverStats = statsSnap.data();
          if (
            serverStats &&
            serverStats.statsVersion === MOCK_STATS_VERSION &&
            typeof serverStats.totalQuestions === 'number' &&
            typeof serverStats.verifiedQuestions === 'number' &&
            typeof serverStats.importantQuestions === 'number'
          ) {
            saveCachedUnifiedStats(serverStats);
            return serverStats;
          }
        }
      } catch (err) {
        const msg = String(err?.message || '');
        if (msg.includes('resource-exhausted') || msg.includes('Quota')) {
          firestoreQuotaBlockedUntil = Date.now() + QUOTA_BACKOFF_MS;
        }
      }
    }
  }

  await getMockQuestions(forceRefresh);
  return (
    getCachedUnifiedStats() ||
    computeUnifiedStats([], getAllShifts(), { gkQuestionsCount: INITIAL_QUESTIONS.length })
  );
}

/**
 * Subject-wise mock test questions (PYQ / IMPORTANT / PRACTICE).
 * Combines all questions extracted from the official examination shifts
 * with admin-authored and custom Firestore/IndexedDB mock questions.
 */
export async function getMockQuestions(forceRefresh = false) {
  const [firestoreResult, rawRrbResult] = await Promise.allSettled([
    fetchFirestoreMockDocs(forceRefresh),
    loadAllRRBQuestions()
  ]);

  const firestoreOrCached =
    firestoreResult.status === 'fulfilled' && Array.isArray(firestoreResult.value)
      ? firestoreResult.value
      : [];

  let rrbQuestions = [];
  if (rawRrbResult.status === 'fulfilled' && Array.isArray(rawRrbResult.value)) {
    rrbQuestions = rawRrbResult.value.map(mapRrbToMockQuestion);
  } else if (rawRrbResult.status === 'rejected') {
    console.error('Failed to load examination questions for mock pool:', rawRrbResult.reason);
  }

  const merged = mergeStaticAndFirestoreQuestions(rrbQuestions, firestoreOrCached);

  try {
    const gkLocal = getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const gkCount = Array.isArray(gkLocal) ? gkLocal.length : INITIAL_QUESTIONS.length;
    const stats = computeUnifiedStats(merged, getAllShifts(), { gkQuestionsCount: gkCount });
    saveCachedUnifiedStats(stats);
  } catch {
    // Ignore storage sync notice
  }

  return merged;
}

export async function saveMockQuestion(question) {
  requireFirebaseWrite();
  const nowIso = new Date().toISOString();
  const id = safeId(question.id || `mock-${Date.now()}`, 'mock');

  const sanitized = mapRrbToMockQuestion({
    _sourceOrigin: question._sourceOrigin || 'uploaded',
    ...question,
    id,
    createdAt: question.createdAt || nowIso,
    updatedAt: nowIso
  });

  const payload = stripUndefined(sanitized);

  try {
    await setDoc(doc(db, 'mockQuestions', id), { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    const msg = recordError('firestoreService.saveMockQuestion', err);
    markSyncFailure(err);
    throw new Error(`Firestore save failed: ${msg}`);
  }

  // Update in-memory & IndexedDB Firestore doc cache cleanly
  try {
    const existingDocs = Array.isArray(cachedFirestoreMockDocs)
      ? cachedFirestoreMockDocs
      : ((await getIdbItem(IDB_MOCK_DOCS_KEY)) || []);
    const nextDocs = Array.isArray(existingDocs) ? [...existingDocs] : [];
    const index = nextDocs.findIndex((entry) => entry && entry.id === id);
    if (index >= 0) nextDocs[index] = payload;
    else nextDocs.unshift(payload);
    await persistFirestoreMockCache(nextDocs, nowIso);

    // Recompute full unified stats across static archives + Firestore docs
    const rawRrb = await loadAllRRBQuestions().catch(() => []);
    const staticBank = Array.isArray(rawRrb) ? rawRrb.map(mapRrbToMockQuestion) : [];
    const fullMergedBank = mergeStaticAndFirestoreQuestions(staticBank, nextDocs);
    const gkLocal = getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const gkCount = Array.isArray(gkLocal) ? gkLocal.length : INITIAL_QUESTIONS.length;
    const updatedStats = {
      ...computeUnifiedStats(fullMergedBank, getAllShifts(), { gkQuestionsCount: gkCount }),
      source: 'Firestore Server (examquesthub • mockQuestions)',
      syncedAt: nowIso
    };
    saveCachedUnifiedStats(updatedStats);
    setDoc(doc(db, 'mockQuestions', '_stats_'), updatedStats, { merge: true }).catch(() => {});
  } catch {
    // Cache/stats sync best-effort after doc write
  }

  markSyncSuccess();
  return payload;
}

/**
 * Bulk upsert mock questions into Firestore with batched writes (450 docs per
 * commit, under the 500-operation limit). Recomputes `_stats_` across the full
 * merged bank so partial uploads (e.g. a single paper) never shrink total counts.
 */
export async function bulkSaveMockQuestions(questions, onProgress) {
  requireFirebaseWrite();
  const rawList = Array.isArray(questions) ? questions : [];
  if (rawList.length === 0) return 0;

  // Deduplicate strictly by question ID and content signature to prevent duplicate questions in Firestore
  const dedupMap = new Map();
  const seenSignatures = new Set();

  for (const item of rawList) {
    if (!item) continue;
    const clean = mapRrbToMockQuestion({
      _sourceOrigin: item._sourceOrigin || 'uploaded',
      ...item
    });
    const id = safeId(clean.id || `mock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, 'mock');

    if (dedupMap.has(id)) continue;

    const signature = getMockQuestionSignature(clean);
    if (signature && seenSignatures.has(signature)) {
      continue;
    }
    if (signature) seenSignatures.add(signature);

    dedupMap.set(id, { ...clean, id });
  }

  const list = Array.from(dedupMap.values());
  if (list.length === 0) return 0;

  const CHUNK_SIZE = 450;
  let saved = 0;

  try {
    for (let i = 0; i < list.length; i += CHUNK_SIZE) {
      const batch = writeBatch(db);
      const slice = list.slice(i, i + CHUNK_SIZE);
      for (const question of slice) {
        const id = question.id;
        batch.set(
          doc(db, 'mockQuestions', id),
          { ...stripUndefined({ ...question, id }), serverUpdatedAt: serverTimestamp() },
          { merge: true }
        );
      }
      await batch.commit();
      saved += slice.length;
      if (typeof onProgress === 'function') onProgress(saved, list.length);
    }

    const nowIso = new Date().toISOString();

    // Merge newly saved items into cached Firestore docs without dropping existing remote docs
    let existingDocs = Array.isArray(cachedFirestoreMockDocs)
      ? cachedFirestoreMockDocs
      : ((await getIdbItem(IDB_MOCK_DOCS_KEY)) || []);
    if (!Array.isArray(existingDocs)) existingDocs = [];

    const docMap = new Map();
    for (const d of existingDocs) {
      if (d && d.id && d.id !== '_stats_' && d.id !== '_test_ping_') {
        docMap.set(d.id, d);
      }
    }
    for (const item of list) {
      docMap.set(item.id, item);
    }
    const mergedFirestoreDocs = Array.from(docMap.values());
    await persistFirestoreMockCache(mergedFirestoreDocs, nowIso);

    // Save consolidated server stats across static archives + all Firestore docs
    try {
      const rawRrb = await loadAllRRBQuestions().catch(() => []);
      const staticBank = Array.isArray(rawRrb) ? rawRrb.map(mapRrbToMockQuestion) : [];
      const fullMergedBank = mergeStaticAndFirestoreQuestions(staticBank, mergedFirestoreDocs);
      const gkLocal = getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
      const gkCount = Array.isArray(gkLocal) ? gkLocal.length : INITIAL_QUESTIONS.length;

      const serverStats = {
        ...computeUnifiedStats(fullMergedBank, getAllShifts(), { gkQuestionsCount: gkCount }),
        source: 'Firestore Server (examquesthub • mockQuestions)',
        syncedAt: nowIso
      };

      await setDoc(doc(db, 'mockQuestions', '_stats_'), serverStats, { merge: true });
      saveCachedUnifiedStats(serverStats);
    } catch (statsErr) {
      console.warn('Could not write server stats doc:', statsErr.message);
    }
  } catch (err) {
    const msg = recordError('firestoreService.bulkSaveMockQuestions', err);
    markSyncFailure(err);
    throw new Error(`Firestore bulk save failed after ${saved} of ${list.length}: ${msg}`);
  }

  markSyncSuccess();
  return saved;
}

/**
 * Migrate existing older Graduate questions in Firestore (dates like 05/06/2025)
 * to RRB NTPC Graduate 2024 as requested by the user, while keeping new March 2026
 * questions under RRB NTPC Graduate 2025-26.
 */
export async function migrateOlderGraduateQuestionsTo2024(onProgress) {
  requireFirebaseWrite();
  if (!isFirebaseConfigured || !db) return 0;

  const snap = await getDocs(collection(db, 'mockQuestions'));
  const toUpdate = [];

  snap.forEach((d) => {
    if (d.id === '_stats_' || d.id === '_test_ping_') return;
    const data = d.data();
    const isGraduate = data.examLevel === 'Graduate' || String(d.id).includes('rrb-ntpc-grad');
    const isOlderExam =
      data.examYear === '2025' ||
      data.examDate === '05/06/2025' ||
      String(data.examName || '').includes('2025') ||
      String(d.id).includes('grad-2025');
    const isMarch2026Exam =
      data.examYear === '2026' ||
      String(d.id).includes('grad-2026') ||
      String(data.examDate || '').includes('2026') ||
      String(data.examDate || '').includes('Mar');

    if (isGraduate && isOlderExam && !isMarch2026Exam) {
      toUpdate.push({
        id: d.id,
        examYear: '2024',
        examName: 'RRB NTPC Graduate 2024 (CBT-1)',
        examLevel: 'Graduate',
        examLevelLabel: 'Graduate 2024',
        source: 'RRB NTPC Graduate 2024 Official Answer Key (CEN 06/2024)',
        paperFileName: 'RRB-NTPC-Graduate-2024-CBT1-Official-Answer-Key.pdf'
      });
    }
  });

  const CHUNK_SIZE = 450;
  let updatedCount = 0;
  for (let i = 0; i < toUpdate.length; i += CHUNK_SIZE) {
    const batch = writeBatch(db);
    const slice = toUpdate.slice(i, i + CHUNK_SIZE);
    for (const item of slice) {
      batch.set(
        doc(db, 'mockQuestions', item.id),
        {
          examYear: item.examYear,
          examName: item.examName,
          examLevelLabel: item.examLevelLabel,
          source: item.source,
          serverUpdatedAt: serverTimestamp()
        },
        { merge: true }
      );
    }
    await batch.commit();
    updatedCount += slice.length;
    if (typeof onProgress === 'function') {
      onProgress(updatedCount, toUpdate.length);
    }
  }

  return updatedCount;
}

export async function deleteMockQuestion(id) {
  requireFirebaseWrite();
  try {
    await deleteDoc(doc(db, 'mockQuestions', id));
  } catch (err) {
    const msg = recordError('firestoreService.deleteMockQuestion', err);
    throw new Error(`Firestore delete failed: ${msg}`);
  }

  const baseDocs = Array.isArray(cachedFirestoreMockDocs)
    ? cachedFirestoreMockDocs
    : ((await getIdbItem(IDB_MOCK_DOCS_KEY)) || []);
  const nextDocs = (baseDocs || []).filter((item) => item && item.id !== id);
  const nowIso = new Date().toISOString();
  await persistFirestoreMockCache(nextDocs, nowIso);

  try {
    const rawRrb = (await loadAllRRBQuestions()).map(mapRrbToMockQuestion);
    const merged = mergeStaticAndFirestoreQuestions(rawRrb, nextDocs);
    const gkLocal = getLocalData(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const gkCount = Array.isArray(gkLocal) ? gkLocal.length : INITIAL_QUESTIONS.length;
    const updatedStats = computeUnifiedStats(merged, getAllShifts(), { gkQuestionsCount: gkCount });
    saveCachedUnifiedStats(updatedStats);
    await setDoc(doc(db, 'mockQuestions', '_stats_'), { ...updatedStats, syncedAt: nowIso }, { merge: true }).catch(() => {});
  } catch {
    // Non-fatal stats refresh error
  }

  return true;
}

export async function getResources() {
  if (isFirebaseConfigured && db) {
    try {
      const items = await fetchCollection('resources');
      saveLocalData(STORAGE_KEYS.RESOURCES, items);
      return items;
    } catch (err) {
      recordError('firestoreService.getResources', err);
      const cached = cachedOrEmpty(STORAGE_KEYS.RESOURCES);
      return cached.length ? cached : INITIAL_RESOURCES;
    }
  }
  return getLocalData(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
}

export async function saveResource(res) {
  requireFirebaseWrite();
  const id = safeId(res.id || `res-${Date.now()}`, 'res');
  const payload = stripUndefined({ ...res, id });
  assertInlineSize(payload);
  try {
    await setDoc(doc(db, 'resources', id), { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    const msg = recordError('firestoreService.saveResource', err);
    throw new Error(`Firestore save failed: ${msg}`);
  }
  const list = cachedOrEmpty(STORAGE_KEYS.RESOURCES);
  const index = list.findIndex((entry) => entry.id === id);
  if (index >= 0) list[index] = payload;
  else list.unshift(payload);
  saveLocalData(STORAGE_KEYS.RESOURCES, list);
  return payload;
}

export async function deleteResource(id) {
  requireFirebaseWrite();
  try {
    await deleteDoc(doc(db, 'resources', id));
  } catch (err) {
    const msg = recordError('firestoreService.deleteResource', err);
    throw new Error(`Firestore delete failed: ${msg}`);
  }
  saveLocalData(STORAGE_KEYS.RESOURCES, cachedOrEmpty(STORAGE_KEYS.RESOURCES).filter((item) => item.id !== id));
  return true;
}

export function resetDemonstrationData() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEYS.UPDATES);
      window.localStorage.removeItem(STORAGE_KEYS.CURRENT_AFFAIRS);
      window.localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
      window.localStorage.removeItem(STORAGE_KEYS.MOCK_QUESTIONS);
      window.localStorage.removeItem(STORAGE_KEYS.MOCK_STATS);
      window.localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    }
    cachedFirestoreMockDocs = null;
    cachedFirestoreMockMeta = null;
    removeIdbItem(IDB_MOCK_DOCS_KEY);
    removeIdbItem(IDB_MOCK_META_KEY);
  } catch (e) {
    console.error('Failed to reset storage:', e);
  }
}
