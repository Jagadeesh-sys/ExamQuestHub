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
  withEffectiveStatusList
} from '../utils/notificationStatus.js';
import { getDefaultImageForTopic as defaultImageForTopic, DEFAULT_TOPIC_IMAGES } from './topicImages.js';
import { loadAllRRBQuestions } from '../services/rrbMockService.js';

export { DEFAULT_TOPIC_IMAGES };

const STORAGE_KEYS = {
  UPDATES: 'eqh_db_updates_v1',
  CURRENT_AFFAIRS: 'eqh_db_current_affairs_v1',
  QUESTIONS: 'eqh_db_questions_v1',
  MOCK_QUESTIONS: 'eqh_db_mock_questions_v1',
  RESOURCES: 'eqh_db_resources_v1',
  ADMINS: 'eqh_db_admins_v1'
};

const MAX_INLINE_BYTES = 700000;
let lastFirestoreError = null;

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
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.warn('[Cache] Save error for key', key, e);
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
    return bv.localeCompare(av);
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

export async function getUpdates(includeDrafts = false) {
  if (isFirebaseConfigured && db) {
    try {
      const items = sortByDateDesc(await fetchCollection('updates'));
      saveLocalData(STORAGE_KEYS.UPDATES, items);
      markSyncSuccess();
      return withEffectiveStatusList(includeDrafts ? items : items.filter((item) => !isDraft(item)));
    } catch (err) {
      recordError('firestoreService.getUpdates', err);
      markSyncFailure(err);
      const cached = cachedOrEmpty(STORAGE_KEYS.UPDATES);
      const list = cached.length ? cached : [];
      return withEffectiveStatusList(includeDrafts ? list : list.filter((item) => !isDraft(item)));
    }
  }

  const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
  return withEffectiveStatusList(includeDrafts ? list : list.filter((item) => !isDraft(item)));
}

export function subscribeToUpdates(callback, includeDrafts = false) {
  let settled = false;
  const emit = (items) => {
    settled = true;
    callback(
      withEffectiveStatusList(includeDrafts ? items : items.filter((item) => !isDraft(item)))
    );
  };

  if (isFirebaseConfigured && db) {
    const timeoutId = setTimeout(() => {
      if (!settled) {
        emit(cachedOrEmpty(STORAGE_KEYS.UPDATES));
      }
    }, 8000);

    try {
      const unsubscribe = onSnapshot(
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
          emit(cachedOrEmpty(STORAGE_KEYS.UPDATES));
        }
      );
      return () => {
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } catch (err) {
      clearTimeout(timeoutId);
      recordError('subscribeToUpdates', err);
    }
  }

  emit(getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES));
  return () => {};
}

export async function getUpdateById(id) {
  if (!id) return null;

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

  const list = getLocalData(STORAGE_KEYS.UPDATES, INITIAL_UPDATES);
  const found = list.find((item) => item.id === id || item.slug === id);
  return found ? withEffectiveStatus(found) : null;
}

export async function saveUpdate(item) {
  requireFirebaseWrite();

  const nowIso = new Date().toISOString();
  const id = safeId(item.id || `notif-${Date.now()}`, 'notif');
  const rawSlug = item.slug || (typeof item.title === 'string' ? item.title : item.title?.en || id);
  const slug = safeId(rawSlug, id);
  const publishedAt = item.publishedAt || nowIso.split('T')[0];

  // A "Closed" that was only worked out from a passed deadline is not the admin's
  // own choice: the marker is never stored, and if the last date has since been
  // moved into the future the notification reopens instead of staying closed.
  const { [AUTO_CLOSED_FLAG]: statusAutoClosed, ...fields } = item;
  const status =
    statusAutoClosed && !hasDeadlinePassed(fields.deadline)
      ? 'Applications Open'
      : fields.status;

  const payload = stripUndefined({
    ...fields,
    status,
    id,
    slug,
    publishedAt,
    updatedAt: nowIso,
    verifiedAt: isDraft(fields) ? fields.verifiedAt || null : fields.verifiedAt || nowIso
  });
  assertInlineSize(payload);

  try {
    await setDoc(doc(db, 'updates', id), { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    const msg = recordError('firestoreService.saveUpdate', err);
    markSyncFailure(err);
    throw new Error(`Firestore save failed: ${msg}`);
  }

  const list = cachedOrEmpty(STORAGE_KEYS.UPDATES);
  const index = list.findIndex((entry) => entry.id === id);
  if (index >= 0) list[index] = payload;
  else list.unshift(payload);
  saveLocalData(STORAGE_KEYS.UPDATES, list);
  markSyncSuccess();
  return payload;
}

export async function deleteUpdate(id) {
  requireFirebaseWrite();
  try {
    await deleteDoc(doc(db, 'updates', id));
  } catch (err) {
    const msg = recordError('firestoreService.deleteUpdate', err);
    throw new Error(`Firestore delete failed: ${msg}`);
  }
  const list = cachedOrEmpty(STORAGE_KEYS.UPDATES).filter((item) => item.id !== id);
  saveLocalData(STORAGE_KEYS.UPDATES, list);
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
      return includeDrafts ? cached : cached.filter((item) => !isDraft(item));
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
  let settled = false;
  const decorate = (list) =>
    list.map((item) => ({
      ...item,
      imageUrl: item.imageUrl || getDefaultImageForTopic(item.topic),
      examRelevance: item.examRelevance?.length ? item.examRelevance : ['UPSC', 'APPSC', 'SSC']
    }));
  const emit = (items) => {
    settled = true;
    const next = decorate(items);
    callback(includeDrafts ? next : next.filter((item) => !isDraft(item)));
  };

  if (isFirebaseConfigured && db) {
    const timeoutId = setTimeout(() => {
      if (!settled) emit(cachedOrEmpty(STORAGE_KEYS.CURRENT_AFFAIRS));
    }, 8000);

    try {
      const unsubscribe = onSnapshot(
        collection(db, 'currentAffairs'),
        (snapshot) => {
          clearTimeout(timeoutId);
          const list = sortByDateDesc(snapshot.docs.map((d) => hydrateDoc(d.id, d.data())));
          saveLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, list);
          markSyncSuccess();
          emit(list);
        },
        (error) => {
          clearTimeout(timeoutId);
          recordError('subscribeToCurrentAffairs', error);
          markSyncFailure(error);
          emit(cachedOrEmpty(STORAGE_KEYS.CURRENT_AFFAIRS));
        }
      );
      return () => {
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } catch (err) {
      clearTimeout(timeoutId);
      recordError('subscribeToCurrentAffairs', err);
    }
  }

  emit(getLocalData(STORAGE_KEYS.CURRENT_AFFAIRS, INITIAL_CURRENT_AFFAIRS));
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
      return cachedOrEmpty(STORAGE_KEYS.QUESTIONS);
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
  let categoryId = q.categoryId || 'gk';
  let subjectId = q.subjectId || 'static-gk';

  if (!q.categoryId || !q.subjectId || q.subjectId === 'general-knowledge' || q.subjectId === 'quantitative-aptitude') {
    const sub = (q.subject || '').toLowerCase();
    const text = ((q.question?.en || '') + ' ' + (q.subtopic || '')).toLowerCase();

    if (text.includes('operating system') || text.includes('windows') || text.includes('linux')) {
      categoryId = 'cse';
      subjectId = 'operating-systems';
    } else if (text.includes('network') || text.includes('internet') || text.includes('protocol') || text.includes('ip address')) {
      categoryId = 'cse';
      subjectId = 'computer-networks';
    } else if (text.includes('database') || text.includes('dbms') || text.includes('sql')) {
      categoryId = 'cse';
      subjectId = 'dbms';
    } else if (sub.includes('science')) {
      categoryId = 'gk';
      subjectId = 'general-science';
    } else if (sub.includes('quant') || sub.includes('math')) {
      categoryId = 'quant';
      if (text.includes('work') || text.includes('pipe') || text.includes('speed') || text.includes('distance') || text.includes('train')) {
        subjectId = 'time-speed-distance-work';
      } else if (text.includes('profit') || text.includes('loss') || text.includes('discount') || text.includes('interest') || text.includes('percent')) {
        subjectId = 'percentage-profit-loss';
      } else if (text.includes('ratio') || text.includes('proportion') || text.includes('mixture') || text.includes('average')) {
        subjectId = 'ratio-proportion-mixtures';
      } else if (text.includes('area') || text.includes('perimeter') || text.includes('volume') || text.includes('triangle') || text.includes('circle')) {
        subjectId = 'mensuration-geometry';
      } else if (text.includes('algebra') || text.includes('equation') || text.includes('trigonometr') || text.includes('sin') || text.includes('cos')) {
        subjectId = 'algebra-trigonometry';
      } else {
        subjectId = 'number-system';
      }
    } else if (sub.includes('reason')) {
      categoryId = 'reasoning';
      if (text.includes('blood') || text.includes('direction') || text.includes('facing')) {
        subjectId = 'blood-relations-directions';
      } else if (text.includes('syllogism') || text.includes('conclusion')) {
        subjectId = 'syllogism-conclusions';
      } else if (text.includes('circular') || text.includes('table') || text.includes('seating') || text.includes('row')) {
        subjectId = 'puzzles-seating';
      } else if (text.includes('mirror') || text.includes('water image') || text.includes('paper folding')) {
        subjectId = 'non-verbal-reasoning';
      } else if (text.includes('analogy') || text.includes('related') || text.includes('odd one')) {
        subjectId = 'analogies-classification';
      } else {
        subjectId = 'series-coding-decoding';
      }
    } else if (sub.includes('english')) {
      categoryId = 'english';
      if (text.includes('idiom') || text.includes('phrase')) {
        subjectId = 'idioms-phrases';
      } else if (text.includes('synonym') || text.includes('antonym')) {
        subjectId = 'vocabulary';
      } else if (text.includes('one word') || text.includes('spelt') || text.includes('spelling')) {
        subjectId = 'one-word-substitution';
      } else if (text.includes('passage') || text.includes('comprehension') || text.includes('cloze')) {
        subjectId = 'reading-comprehension';
      } else if (text.includes('jumbled') || text.includes('rearrangement')) {
        subjectId = 'sentence-rearrangement';
      } else {
        subjectId = 'grammar-error-spotting';
      }
    } else {
      categoryId = 'gk';
      if (text.includes('article') || text.includes('constitution') || text.includes('amendment') || text.includes('court') || text.includes('parliament') || text.includes('president') || text.includes('polity')) {
        subjectId = 'indian-polity';
      } else if (text.includes('dynasty') || text.includes('battle') || text.includes('british') || text.includes('gandhi') || text.includes('mughal') || text.includes('history') || text.includes('war')) {
        subjectId = 'indian-history';
      } else if (text.includes('river') || text.includes('mountain') || text.includes('soil') || text.includes('climate') || text.includes('geography') || text.includes('lake') || text.includes('ocean')) {
        subjectId = 'geography';
      } else if (text.includes('rbi') || text.includes('gdp') || text.includes('bank') || text.includes('inflation') || text.includes('economy') || text.includes('market') || text.includes('tax')) {
        subjectId = 'indian-economy';
      } else if (text.includes('national park') || text.includes('sanctuary') || text.includes('biosphere') || text.includes('biodiversity') || text.includes('ecology')) {
        subjectId = 'environment-ecology';
      } else if (text.includes('2024') || text.includes('2025') || text.includes('2026') || text.includes('olympics') || text.includes('summit')) {
        subjectId = 'current-affairs';
      } else {
        subjectId = 'static-gk';
      }
    }
  }

  const isSsc = q.examType === 'SSC CGL' || String(q.id || '').startsWith('ssc-cgl');

  return {
    ...q,
    categoryId,
    subjectId,
    questionType: 'PYQ',
    difficulty: q.difficulty || 'Medium',
    verificationStatus: 'VERIFIED',
    source: q.source || (isSsc ? 'SSC CGL 2020 Tier-I Official Question Paper (QMaths)' : q.examLevel === 'Graduate' ? 'RRB NTPC Graduate 2025 Official Answer Key (CEN 06/2025)' : 'RRB Official Answer Key (CEN 07/2025)'),
    paperUrl: q.paperUrl || (isSsc ? '/assets/aistudio/SSC_CGL_2020_All_21_Sets_English.pdf' : q.examLevel === 'Graduate' ? '/assets/aistudio/RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key.pdf' : '/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf'),
    paperFileName: q.paperFileName || (isSsc ? 'SSC_CGL_2020_All_21_Sets_English.pdf' : q.examLevel === 'Graduate' ? 'RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key.pdf' : 'RRB-NTPC-UG-2025-EN-All-Papers.pdf')
  };
}

/**
 * Subject-wise mock test questions (PYQ / IMPORTANT / PRACTICE).
 * Combines all questions extracted from the 32 official examination shifts
 * with admin-authored and custom Firestore mock questions.
 */
export async function getMockQuestions() {
  let firestoreOrCached = [];
  if (isFirebaseConfigured && db) {
    try {
      firestoreOrCached = await fetchCollection('mockQuestions');
      saveLocalData(STORAGE_KEYS.MOCK_QUESTIONS, firestoreOrCached);
      markSyncSuccess();
    } catch (err) {
      recordError('firestoreService.getMockQuestions', err);
      markSyncFailure(err);
      firestoreOrCached = cachedOrEmpty(STORAGE_KEYS.MOCK_QUESTIONS);
    }
  } else {
    firestoreOrCached = cachedOrEmpty(STORAGE_KEYS.MOCK_QUESTIONS);
  }

  // Combine with the extracted RRB bank (Under-Graduate + Graduate)
  let rrbQuestions = [];
  try {
    const rawRrb = await loadAllRRBQuestions();
    rrbQuestions = (rawRrb || []).map(mapRrbToMockQuestion);
  } catch (err) {
    console.error('Failed to load RRB questions for mock pool:', err);
  }

  const map = new Map();
  // Add RRB questions
  for (const q of rrbQuestions) {
    map.set(q.id, q);
  }
  // Add/override with Firestore or custom questions
  for (const q of firestoreOrCached) {
    map.set(q.id, { ...(map.get(q.id) || {}), ...q });
  }

  return Array.from(map.values());
}

export async function saveMockQuestion(question) {
  requireFirebaseWrite();
  const nowIso = new Date().toISOString();
  const id = safeId(question.id || `mock-${Date.now()}`, 'mock');

  const payload = stripUndefined({
    ...question,
    id,
    createdAt: question.createdAt || nowIso,
    updatedAt: nowIso
  });

  try {
    await setDoc(doc(db, 'mockQuestions', id), { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    const msg = recordError('firestoreService.saveMockQuestion', err);
    markSyncFailure(err);
    throw new Error(`Firestore save failed: ${msg}`);
  }

  const list = cachedOrEmpty(STORAGE_KEYS.MOCK_QUESTIONS);
  const index = list.findIndex((entry) => entry.id === id);
  if (index >= 0) list[index] = payload;
  else list.unshift(payload);
  saveLocalData(STORAGE_KEYS.MOCK_QUESTIONS, list);
  markSyncSuccess();
  return payload;
}

/**
 * Bulk upsert mock questions into Firestore with batched writes (450 docs per
 * commit, under the 500-operation limit). Used by the admin action that stores
 * the entire RRB question bank on the server.
 */
export async function bulkSaveMockQuestions(questions, onProgress) {
  requireFirebaseWrite();
  const list = Array.isArray(questions) ? questions : [];
  const CHUNK_SIZE = 450;
  let saved = 0;

  try {
    for (let i = 0; i < list.length; i += CHUNK_SIZE) {
      const batch = writeBatch(db);
      const slice = list.slice(i, i + CHUNK_SIZE);
      for (const question of slice) {
        const id = safeId(question.id || `mock-${Date.now()}`, 'mock');
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
  } catch (err) {
    const msg = recordError('firestoreService.bulkSaveMockQuestions', err);
    markSyncFailure(err);
    throw new Error(`Firestore bulk save failed after ${saved} of ${list.length}: ${msg}`);
  }

  saveLocalData(STORAGE_KEYS.MOCK_QUESTIONS, list);
  markSyncSuccess();
  return saved;
}

export async function deleteMockQuestion(id) {
  requireFirebaseWrite();
  try {
    await deleteDoc(doc(db, 'mockQuestions', id));
  } catch (err) {
    const msg = recordError('firestoreService.deleteMockQuestion', err);
    throw new Error(`Firestore delete failed: ${msg}`);
  }
  saveLocalData(
    STORAGE_KEYS.MOCK_QUESTIONS,
    cachedOrEmpty(STORAGE_KEYS.MOCK_QUESTIONS).filter((item) => item.id !== id)
  );
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
      return cachedOrEmpty(STORAGE_KEYS.RESOURCES);
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
      window.localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    }
  } catch (e) {
    console.error('Failed to reset storage:', e);
  }
}
