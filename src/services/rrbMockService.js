/**
 * Service to manage RRB NTPC UG 2025 Mock Tests & Questions
 * Provides fast local caching, subject filtering, Firestore synchronization,
 * and complete examination data management.
 */

import { RRB_NTPC_SHIFTS, RRB_CORE_SUBJECTS } from '../data/rrbNtpcMetadata.js';

const STORAGE_KEY_CUSTOM_QUESTIONS = 'eqh_custom_mock_questions_v1';
const STORAGE_KEY_TEST_OVERRIDES = 'eqh_mock_test_overrides_v1';

let cachedFullData = null;
let cachedQuestions = null;

/**
 * Fetch and cache all questions from public/data/rrbNtpc2025Full.json
 */
export async function loadAllRRBQuestions() {
  if (cachedQuestions && cachedQuestions.length > 0) {
    return applyLocalOverrides(cachedQuestions);
  }

  try {
    let data;
    if (typeof window === 'undefined') {
      const fs = await import('fs');
      const content = fs.readFileSync('public/data/rrbNtpc2025Full.json', 'utf-8');
      data = JSON.parse(content);
    } else {
      const url = `${window.location.origin}/data/rrbNtpc2025Full.json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      data = await res.json();
    }
    cachedFullData = data;
    cachedQuestions = data.questions || [];
    return applyLocalOverrides(cachedQuestions);
  } catch (err) {
    console.error('Failed to load RRB questions JSON:', err);
    return [];
  }
}

/**
 * Apply any admin overrides stored in localStorage (or Firestore)
 */
function applyLocalOverrides(baseQuestions) {
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS) || '[]');
    if (!custom || custom.length === 0) return baseQuestions;

    const map = new Map(baseQuestions.map((q) => [q.id, { ...q }]));
    for (const cq of custom) {
      if (cq._deleted) {
        map.delete(cq.id);
      } else {
        map.set(cq.id, { ...map.get(cq.id), ...cq });
      }
    }
    return Array.from(map.values());
  } catch {
    return baseQuestions;
  }
}

/**
 * Save an edited or new question
 */
export function saveLocalQuestionOverride(question) {
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS) || '[]');
    const existingIndex = custom.findIndex((q) => q.id === question.id);
    if (existingIndex >= 0) {
      custom[existingIndex] = question;
    } else {
      custom.push(question);
    }
    localStorage.setItem(STORAGE_KEY_CUSTOM_QUESTIONS, JSON.stringify(custom));
    // Invalidate memory cache so next read picks it up
    if (cachedQuestions) {
      const idx = cachedQuestions.findIndex((q) => q.id === question.id);
      if (idx >= 0) {
        cachedQuestions[idx] = question;
      } else {
        cachedQuestions.push(question);
      }
    }
    return true;
  } catch (err) {
    console.error('Failed to save question override:', err);
    return false;
  }
}

/**
 * Delete a question
 */
export function deleteLocalQuestionOverride(questionId) {
  try {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS) || '[]');
    const existing = custom.find((q) => q.id === questionId);
    if (existing) {
      existing._deleted = true;
    } else {
      custom.push({ id: questionId, _deleted: true });
    }
    localStorage.setItem(STORAGE_KEY_CUSTOM_QUESTIONS, JSON.stringify(custom));
    if (cachedQuestions) {
      cachedQuestions = cachedQuestions.filter((q) => q.id !== questionId);
    }
    return true;
  } catch (err) {
    console.error('Failed to delete question override:', err);
    return false;
  }
}

/**
 * Get all mock tests metadata (combining default shifts with any overrides)
 */
export function getAllShifts() {
  try {
    const overrides = JSON.parse(localStorage.getItem(STORAGE_KEY_TEST_OVERRIDES) || '{}');
    return RRB_NTPC_SHIFTS.map((shift) => {
      const ov = overrides[shift.id];
      return ov ? { ...shift, ...ov } : shift;
    });
  } catch {
    return RRB_NTPC_SHIFTS;
  }
}

/**
 * Save mock test metadata override (duration, negative marking, status)
 */
export function saveShiftOverride(shiftId, updates) {
  try {
    const overrides = JSON.parse(localStorage.getItem(STORAGE_KEY_TEST_OVERRIDES) || '{}');
    overrides[shiftId] = { ...(overrides[shiftId] || {}), ...updates };
    localStorage.setItem(STORAGE_KEY_TEST_OVERRIDES, JSON.stringify(overrides));
    return true;
  } catch (err) {
    console.error('Failed to save shift override:', err);
    return false;
  }
}

/**
 * Get questions for a specific shift and optional subject
 * @param {string|number} shiftNumberOrId e.g. 1 or 'rrb-ntpc-ug-2025-shift-1'
 * @param {string|null} subject e.g. 'Quantitative Aptitude', 'General Knowledge', 'General Science', 'Reasoning', or null for all
 */
export async function getQuestionsForShift(shiftNumberOrId, subject = null) {
  const all = await loadAllRRBQuestions();
  let shiftNum = typeof shiftNumberOrId === 'number' ? shiftNumberOrId : null;
  if (!shiftNum && typeof shiftNumberOrId === 'string') {
    const m = shiftNumberOrId.match(/shift-(\d+)/i) || shiftNumberOrId.match(/s(\d+)/i);
    if (m) shiftNum = parseInt(m[1], 10);
  }

  return all.filter((q) => {
    const matchShift = shiftNum ? q.shiftNumber === shiftNum : true;
    if (!matchShift) return false;

    if (!subject || subject === 'All' || subject === 'full') return true;

    // Normalize subject check
    const qSub = (q.subject || '').toLowerCase().replace(/[^a-z]/g, '');
    const targetSub = subject.toLowerCase().replace(/[^a-z]/g, '');
    return qSub.includes(targetSub) || targetSub.includes(qSub);
  });
}

/**
 * Build Engine-compatible test object
 */
export async function getEngineMockTest(testId, subjectParam = null) {
  const shifts = getAllShifts();
  
  // Parse testId: could be rrb-ntpc-ug-2025-shift-1 or rrb-ntpc-ug-2025-shift-1--general-science
  let shiftId = testId;
  let targetSubject = subjectParam;

  if (testId.includes('--')) {
    const parts = testId.split('--');
    shiftId = parts[0];
    targetSubject = parts[1];
  }

  const shift = shifts.find((s) => s.id === shiftId || s.code.toLowerCase() === shiftId.toLowerCase()) || shifts[0];
  const questions = await getQuestionsForShift(shift?.shiftNumber || 1, targetSubject);

  // Subject title resolution
  let subjectLabel = 'Full Shift CBT (All Subjects)';
  if (targetSubject && targetSubject !== 'full') {
    const foundSub = RRB_CORE_SUBJECTS.find((s) => s.id === targetSubject || s.title.toLowerCase() === targetSubject.toLowerCase());
    subjectLabel = foundSub ? foundSub.title : targetSubject;
  }

  // Duration: 90 mins for full test, or proportional for subject test (approx 1 min/question, min 15 mins)
  const isFull = !targetSubject || targetSubject === 'full' || questions.length >= 70;
  const duration = isFull ? (shift?.durationMinutes || 90) : Math.max(15, questions.length);

  // Format into engine format
  const engineQuestions = questions.map((q, idx) => ({
    id: q.id,
    number: idx + 1,
    originalNumber: q.questionNumber,
    question: q.question?.en || '',
    questionTe: q.question?.te || '',
    options: {
      A: q.options?.en?.[0] || '',
      B: q.options?.en?.[1] || '',
      C: q.options?.en?.[2] || '',
      D: q.options?.en?.[3] || ''
    },
    optionsTe: {
      A: q.options?.te?.[0] || '',
      B: q.options?.te?.[1] || '',
      C: q.options?.te?.[2] || '',
      D: q.options?.te?.[3] || ''
    },
    correctOption: ['A', 'B', 'C', 'D'][q.correctAnswer] || q.correctLetter || 'A',
    explanation: q.explanation?.en || `Official answer is Option (${q.correctLetter || 'A'}). Preserved from RRB NTPC UG 2025 Shift ${q.shiftNumber}.`,
    explanationTe: q.explanation?.te || '',
    examName: q.examName || 'RRB NTPC UG 2025',
    examYear: q.examYear || '2025',
    shift: `Shift ${q.shiftNumber}`,
    examDate: q.examDate,
    shiftTiming: q.shiftTiming,
    subject: q.subject,
    subtopic: q.subtopic,
    verificationStatus: q.status === 'Published' ? 'VERIFIED' : 'UNVERIFIED',
    source: q.source || 'RRB Official Key'
  }));

  return {
    meta: {
      id: testId,
      shiftId: shift?.id,
      shiftNumber: shift?.shiftNumber || 1,
      code: `${shift?.code || 'RRB-NTPC'}${targetSubject && targetSubject !== 'full' ? `-${targetSubject.slice(0, 4).toUpperCase()}` : ''}`,
      title: `${shift?.title || 'RRB NTPC UG 2025'} · ${subjectLabel}`,
      subtitle: `${shift?.examDate || ''} · ${shift?.shiftTiming || ''}`,
      examName: shift?.examName || 'RRB NTPC Under Graduate 2025 (CEN 07/2025)',
      examYear: shift?.examYear || '2025',
      subjectLabel,
      targetSubject: targetSubject || 'full',
      questionsCount: engineQuestions.length,
      timeMinutes: duration,
      marks: engineQuestions.length,
      negativeMarking: shift?.negativeMarking || 0.33,
      pdfUrl: '/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf',
      pdfFileName: 'RRB-NTPC-UG-2025-EN-All-Papers.pdf',
      subjectTest: !isFull
    },
    questions: engineQuestions
  };
}

export { RRB_CORE_SUBJECTS };
