import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from '../firebase/config.js';
import {
  EXAM_CATEGORIES,
  INITIAL_EXAM_SYLLABI,
  buildNormalizedSubjectsAndTopics,
  getExamChapterCount
} from '../data/syllabus/syllabusRegistry.js';
import { logAppError } from '../utils/errorLogger.js';

const STORAGE_KEYS = {
  CATEGORIES: 'eqh_syllabus_categories_v1',
  SYLLABI: 'eqh_syllabus_exams_v1',
  PROGRESS: 'eqh_syllabus_progress_v1',
  RECENT: 'eqh_syllabus_recent_v1'
};

const MAX_INLINE_BYTES = 700000;

function getLocal(key, fallback) {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage?.getItem(key) : null;
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Quota warnings shouldn't break reading/writing state
  }
}

function safeId(raw, prefix = 'exam') {
  const cleaned = String(raw || `${prefix}-${Date.now()}`)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
  return cleaned || `${prefix}-${Date.now()}`;
}

function stripUndefined(value) {
  if (value === undefined) return undefined;
  if (value === null || typeof value !== 'object') return value;
  if (typeof value.toDate === 'function') return value;
  if (Array.isArray(value)) {
    return value.map(stripUndefined).filter((item) => item !== undefined);
  }
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (v === undefined) continue;
    const cleaned = stripUndefined(v);
    if (cleaned !== undefined) out[k] = cleaned;
  }
  return out;
}

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null
    }
  };
  logAppError({
    category: 'FirestoreSyllabus',
    message: JSON.stringify(errInfo),
    component: `syllabusService.${operationType}`
  });
  return errInfo.error;
}

function isDraftExam(exam) {
  const status = String(exam?.status || '').toLowerCase();
  return status === 'draft' || status === 'unpublished' || exam?.active === false;
}

/**
 * Merges Firestore custom/updated records with the built-in 2026 Syllabus Registry,
 * preventing duplicate IDs or examCodes while letting admin edits override built-in items.
 */
export function mergeSyllabiWithInitial(customItems = []) {
  const custom = Array.isArray(customItems) ? customItems : [];
  if (custom.length === 0) return [...INITIAL_EXAM_SYLLABI];

  const byId = new Map();
  const byCode = new Map();

  for (const base of INITIAL_EXAM_SYLLABI) {
    byId.set(base.id, base);
    if (base.examCode) byCode.set(base.examCode.toUpperCase(), base.id);
  }

  for (const item of custom) {
    if (!item || !item.id) continue;
    const existingByCode = item.examCode ? byCode.get(String(item.examCode).toUpperCase()) : null;
    if (existingByCode && existingByCode !== item.id && byId.has(existingByCode)) {
      byId.delete(existingByCode);
    }
    byId.set(item.id, item);
    if (item.examCode) byCode.set(String(item.examCode).toUpperCase(), item.id);
  }

  return Array.from(byId.values());
}

export async function getExamCategories() {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'examCategories'));
      if (!snap.empty) {
        const remote = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.order || 99) - (b.order || 99));
        const byId = new Map(EXAM_CATEGORIES.map((c) => [c.id, c]));
        remote.forEach((c) => byId.set(c.id, c));
        const merged = Array.from(byId.values()).sort((a, b) => (a.order || 99) - (b.order || 99));
        saveLocal(STORAGE_KEYS.CATEGORIES, merged);
        return merged;
      }
    } catch (err) {
      handleFirestoreError(err, 'list', 'examCategories');
    }
  }
  const cached = getLocal(STORAGE_KEYS.CATEGORIES, null);
  return Array.isArray(cached) && cached.length > 0 ? cached : EXAM_CATEGORIES;
}

export async function getExamSyllabi(includeDrafts = false) {
  let customItems = getLocal(STORAGE_KEYS.SYLLABI, []);

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'examSyllabi'));
      if (!snap.empty) {
        const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        customItems = remote;
        saveLocal(STORAGE_KEYS.SYLLABI, remote);
      }
    } catch (err) {
      handleFirestoreError(err, 'list', 'examSyllabi');
    }
  }

  const merged = mergeSyllabiWithInitial(customItems);
  return includeDrafts ? merged : merged.filter((item) => !isDraftExam(item));
}

export async function getExamSyllabusById(id, includeDrafts = false) {
  if (!id) return null;
  const all = await getExamSyllabi(includeDrafts);
  const direct = all.find((item) => item.id === id || item.examCode?.toLowerCase() === id.toLowerCase());
  if (direct) return direct;

  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'examSyllabi', id));
      if (snap.exists()) {
        const found = { id: snap.id, ...snap.data() };
        if (!includeDrafts && isDraftExam(found)) return null;
        return found;
      }
    } catch (err) {
      handleFirestoreError(err, 'get', `examSyllabi/${id}`);
    }
  }
  return null;
}

/**
 * Validates and saves a syllabus record (both to local cache and Firestore `examSyllabi`).
 * Prevents duplicate exam codes or colliding exam names unless updating the same record.
 */
export async function saveExamSyllabus(exam, existingList = null) {
  const id = safeId(exam.id || exam.examCode || exam.name, 'exam');
  const examCode = String(exam.examCode || id.toUpperCase()).trim().toUpperCase();
  const normalizedName = String(exam.name || '').trim().toLowerCase();

  if (!normalizedName) {
    throw new Error('Examination Name is required.');
  }
  if (!exam.categoryId) {
    throw new Error('Primary Exam Category is required.');
  }

  const currentList = existingList || (await getExamSyllabi(true));
  const duplicate = currentList.find(
    (entry) =>
      entry.id !== id &&
      ((examCode && entry.examCode?.toUpperCase() === examCode) ||
        entry.name?.trim().toLowerCase() === normalizedName)
  );
  if (duplicate) {
    throw new Error(`Duplicate exam detected: "${duplicate.name}" (${duplicate.examCode}) already exists.`);
  }

  const nowIso = new Date().toISOString().split('T')[0];
  const pdfStr = exam.officialSyllabusPdfUrl || '';
  if (typeof pdfStr === 'string' && pdfStr.startsWith('data:') && pdfStr.length > MAX_INLINE_BYTES) {
    throw new Error('Uploaded PDF exceeds Firestore inline limit (700 KB). Please link to the official PDF URL instead.');
  }

  const version = exam.syllabusVersion || `v${exam.notificationYear || 2026}.1`;
  const existingHistory = Array.isArray(exam.versionHistory) && exam.versionHistory.length > 0
    ? exam.versionHistory
    : [
        {
          version,
          year: Number(exam.notificationYear) || 2026,
          updatedAt: exam.lastVerifiedDate || nowIso,
          notes: `Initial syllabus configuration (${exam.officialNotificationRef || 'Official Pattern'}).`
        }
      ];

  const payload = stripUndefined({
    ...exam,
    id,
    examCode,
    shortName: exam.shortName || exam.name,
    status: exam.status || 'Published',
    active: (exam.status || 'Published') !== 'Draft',
    notificationYear: Number(exam.notificationYear) || 2026,
    lastVerifiedDate: exam.lastVerifiedDate || nowIso,
    syllabusVersion: version,
    versionHistory: existingHistory,
    updatedAt: new Date().toISOString()
  });

  const cached = getLocal(STORAGE_KEYS.SYLLABI, []);
  const idx = cached.findIndex((item) => item.id === id);
  if (idx >= 0) cached[idx] = payload;
  else cached.unshift(payload);
  saveLocal(STORAGE_KEYS.SYLLABI, cached);

  let firestoreSynced = false;
  let syncError = null;
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'examSyllabi', id), { ...payload, serverUpdatedAt: serverTimestamp() }, { merge: true });
      firestoreSynced = true;
    } catch (err) {
      syncError = handleFirestoreError(err, 'write', `examSyllabi/${id}`);
    }
  }

  return { ...payload, _firestoreSynced: firestoreSynced, _syncError: syncError };
}

export async function deleteExamSyllabus(id) {
  if (!id) return false;
  const cached = getLocal(STORAGE_KEYS.SYLLABI, []);
  saveLocal(
    STORAGE_KEYS.SYLLABI,
    cached.filter((item) => item.id !== id)
  );

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'examSyllabi', id));
    } catch (err) {
      const msg = handleFirestoreError(err, 'delete', `examSyllabi/${id}`);
      throw new Error(`Firestore delete failed: ${msg}`);
    }
  }
  return true;
}

export async function togglePublishExamSyllabus(exam) {
  const nextStatus = exam.status === 'Draft' ? 'Published' : 'Draft';
  return saveExamSyllabus({
    ...exam,
    status: nextStatus,
    active: nextStatus === 'Published'
  });
}

/**
 * Updates an exam syllabus for a new annual cycle while preserving full historical versions.
 */
export async function bumpAnnualSyllabusVersion(exam, newYear, notes) {
  const yr = Number(newYear) || new Date().getFullYear() + 1;
  const currentHistory = Array.isArray(exam.versionHistory) ? [...exam.versionHistory] : [];
  const nextVersion = `v${yr}.1`;
  const today = new Date().toISOString().split('T')[0];

  const nextHistory = [
    {
      version: nextVersion,
      year: yr,
      updatedAt: today,
      notes: notes || `Annual syllabus update for ${yr} examination cycle.`
    },
    ...currentHistory.filter((h) => h.version !== nextVersion)
  ];

  return saveExamSyllabus({
    ...exam,
    notificationYear: yr,
    syllabusVersion: nextVersion,
    lastVerifiedDate: today,
    verificationStatus: `Verified ${yr}`,
    versionHistory: nextHistory
  });
}

/**
 * Bulk JSON import for exam syllabi with schema validation and duplicate protection.
 */
export async function importSyllabiFromJson(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    return { ok: 0, skipped: 0, errors: [`Invalid JSON syntax: ${err.message}`], duplicates: [] };
  }

  const list = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.syllabi)
      ? parsed.syllabi
      : Array.isArray(parsed?.exams)
        ? parsed.exams
        : null;

  if (!list || list.length === 0) {
    return { ok: 0, skipped: 0, errors: ['Expected a non-empty JSON array of exam syllabi.'], duplicates: [] };
  }

  const existing = await getExamSyllabi(true);
  const existingCodes = new Set(existing.map((e) => e.examCode?.toUpperCase()).filter(Boolean));
  const existingNames = new Set(existing.map((e) => e.name?.trim().toLowerCase()).filter(Boolean));

  let ok = 0;
  const errors = [];
  const duplicates = [];

  for (let i = 0; i < list.length; i += 1) {
    const item = list[i];
    const label = item?.name || item?.examCode || `Item ${i + 1}`;
    if (!item?.name || !item?.categoryId || !item?.authority) {
      errors.push(`${label} — missing required fields (name, categoryId, authority).`);
      continue;
    }

    const codeKey = String(item.examCode || '').trim().toUpperCase();
    const nameKey = String(item.name || '').trim().toLowerCase();
    if ((codeKey && existingCodes.has(codeKey)) || existingNames.has(nameKey)) {
      duplicates.push(`${label} — already exists in syllabus library.`);
      continue;
    }

    try {
      // eslint-disable-next-line no-await-in-loop
      const saved = await saveExamSyllabus(item, existing);
      existing.push(saved);
      if (saved.examCode) existingCodes.add(saved.examCode.toUpperCase());
      existingNames.add(nameKey);
      ok += 1;
    } catch (err) {
      errors.push(`${label} — ${err.message}`);
    }
  }

  return { ok, skipped: duplicates.length, errors, duplicates };
}

/**
 * Seeds `examCategories`, `examSyllabi`, `examSubjects`, and `examTopics`
 * into Firestore in safe batches (<400 writes per batch) without overwriting
 * any unrelated existing Firestore collections.
 */
export async function seedSyllabusLibraryToFirestore(onProgress = null) {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured in this build.');
  }

  const currentSyllabi = await getExamSyllabi(true);
  const { examSubjects, examTopics } = buildNormalizedSubjectsAndTopics(currentSyllabi);

  const ops = [];
  for (const cat of EXAM_CATEGORIES) {
    ops.push({ ref: doc(db, 'examCategories', cat.id), data: stripUndefined(cat) });
  }
  for (const subj of examSubjects) {
    ops.push({ ref: doc(db, 'examSubjects', subj.id), data: stripUndefined(subj) });
  }
  for (const topic of examTopics) {
    ops.push({ ref: doc(db, 'examTopics', topic.id), data: stripUndefined(topic) });
  }
  for (const exam of currentSyllabi) {
    ops.push({
      ref: doc(db, 'examSyllabi', exam.id),
      data: stripUndefined({ ...exam, serverUpdatedAt: serverTimestamp() })
    });
  }

  const CHUNK = 350;
  let completed = 0;
  for (let i = 0; i < ops.length; i += CHUNK) {
    const slice = ops.slice(i, i + CHUNK);
    const batch = writeBatch(db);
    slice.forEach((op) => {
      batch.set(op.ref, op.data, { merge: true });
    });
    // eslint-disable-next-line no-await-in-loop
    await batch.commit();
    completed += slice.length;
    if (onProgress) onProgress({ completed, total: ops.length });
  }

  return {
    categories: EXAM_CATEGORIES.length,
    syllabi: currentSyllabi.length,
    subjects: examSubjects.length,
    topics: examTopics.length,
    totalWrites: ops.length
  };
}

// =========================================================================
// STUDENT CHAPTER PROGRESS & RECENTLY VIEWED TRACKERS
// =========================================================================

export function getAllSyllabusProgress() {
  return getLocal(STORAGE_KEYS.PROGRESS, {});
}

export async function getSyllabusProgress(examId) {
  const all = getAllSyllabusProgress();
  const localEntry = all[examId] || { examId, completedChapters: [], totalChapters: 0, completionPercent: 0 };

  if (isFirebaseConfigured && db && auth?.currentUser?.uid) {
    const progressId = `${auth.currentUser.uid}__${safeId(examId, 'exam')}`;
    try {
      const snap = await getDoc(doc(db, 'syllabusProgress', progressId));
      if (snap.exists()) {
        const data = snap.data();
        all[examId] = data;
        saveLocal(STORAGE_KEYS.PROGRESS, all);
        return data;
      }
    } catch (err) {
      handleFirestoreError(err, 'get', `syllabusProgress/${progressId}`);
    }
  }

  return localEntry;
}

export async function toggleChapterProgress(exam, chapterId) {
  if (!exam || !exam.id || !chapterId) return null;
  const totalChapters = Math.max(getExamChapterCount(exam), 1);
  const all = getAllSyllabusProgress();
  const current = all[exam.id] || { examId: exam.id, completedChapters: [] };
  const set = new Set(Array.isArray(current.completedChapters) ? current.completedChapters : []);

  if (set.has(chapterId)) set.delete(chapterId);
  else set.add(chapterId);

  const completedChapters = Array.from(set);
  const completionPercent = Math.min(100, Math.round((completedChapters.length / totalChapters) * 100));
  const updated = {
    examId: exam.id,
    completedChapters,
    totalChapters,
    completionPercent,
    updatedAt: new Date().toISOString()
  };

  all[exam.id] = updated;
  saveLocal(STORAGE_KEYS.PROGRESS, all);

  if (isFirebaseConfigured && db && auth?.currentUser?.uid) {
    const progressId = `${auth.currentUser.uid}__${safeId(exam.id, 'exam')}`;
    try {
      await setDoc(
        doc(db, 'syllabusProgress', progressId),
        { ...updated, userId: auth.currentUser.uid },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, 'write', `syllabusProgress/${progressId}`);
    }
  }

  return updated;
}

export function getRecentlyViewedSyllabi() {
  const ids = getLocal(STORAGE_KEYS.RECENT, []);
  return Array.isArray(ids) ? ids : [];
}

export function recordRecentlyViewedSyllabus(examId) {
  if (!examId) return;
  const current = getRecentlyViewedSyllabi().filter((id) => id !== examId);
  const next = [examId, ...current].slice(0, 8);
  saveLocal(STORAGE_KEYS.RECENT, next);
}
