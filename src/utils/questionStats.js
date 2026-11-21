/**
 * Single deterministic source of truth for classifying Verified vs Important
 * questions and computing unified question-bank statistics across the app.
 */

import { classifyQuestion, SUBJECT_TOPIC_TAXONOMY } from '../constants/mockTaxonomy.js';
import { FULL_MOCK_SERIES, SECTIONAL_TESTS, SUBJECT_MOCK_TESTS } from '../data/fullMockSeriesData.js';
import { MOCK_TESTS_METADATA } from '../data/mockTestsMetadata.js';
import { safeJsonParse } from './security.js';

export const MOCK_STATS_STORAGE_KEY = 'eqh_db_mock_stats_v10';
export const MOCK_STATS_VERSION = 10;

export const TOTAL_TOPIC_UNITS = Object.values(SUBJECT_TOPIC_TAXONOMY || {}).reduce(
  (acc, sub) => acc + (Array.isArray(sub?.topics) ? sub.topics.length : 0),
  0
);

/**
 * Canonical rule matching AdminMockTestsTab:
 * A question is counted under Important / Needs Review if it is marked
 * Needs Review, Draft, UNVERIFIED, IMPORTANT, or isVerified === false.
 */
export function isImportantOrReviewQuestion(q) {
  if (!q || typeof q !== 'object') return false;
  return (
    q.status === 'Needs Review' ||
    q.status === 'Draft' ||
    String(q.verificationStatus || '').toUpperCase() === 'UNVERIFIED' ||
    String(q.questionType || '').toUpperCase() === 'IMPORTANT' ||
    q.isVerified === false
  );
}

/**
 * Canonical rule for Verified questions.
 * Partition guarantee: for every valid question q, either isVerifiedQuestion(q)
 * is true OR isImportantOrReviewQuestion(q) / needs-review is true, so
 * verifiedQuestions + importantQuestions === totalQuestions ALWAYS holds.
 */
export function isVerifiedQuestion(q) {
  if (!q || typeof q !== 'object') return false;
  if (isImportantOrReviewQuestion(q)) return false;
  return (
    q.status === 'Published' ||
    String(q.verificationStatus || '').toUpperCase() === 'VERIFIED'
  );
}

/**
 * True when a question originated from Firestore / Admin custom uploads
 * rather than the bundled static JSON paper archives or Monthly CA sets.
 */
export function isUploadedQuestion(q) {
  if (!q || typeof q !== 'object') return false;
  if (q._sourceOrigin === 'uploaded') return true;
  const id = String(q.id || '');
  return id.startsWith('custom-') || id.startsWith('mock-');
}

export function getDisplaySubjectName(subjectId) {
  switch (subjectId) {
    case 'current-affairs':
      return 'Current Affairs';
    case 'quantitative-aptitude':
      return 'Quantitative Aptitude';
    case 'reasoning':
      return 'Reasoning';
    case 'general-science':
      return 'General Science';
    case 'computer-science':
      return 'Computer Science';
    case 'english-language':
      return 'English Language';
    case 'general-knowledge':
    default:
      return 'General Knowledge';
  }
}

export function computeMockTestsCount(shifts = []) {
  const playableShiftsCount = Array.isArray(shifts)
    ? shifts.filter((s) => s && s.hasLoadedQuestions !== false).length
    : 0;

  return (
    FULL_MOCK_SERIES.length +
    SECTIONAL_TESTS.length +
    SUBJECT_MOCK_TESTS.length +
    MOCK_TESTS_METADATA.length +
    playableShiftsCount +
    TOTAL_TOPIC_UNITS
  );
}

/**
 * Compute complete, exact, self-consistent statistics across all loaded
 * Previous Year Papers + Current Affairs + Uploaded Questions (+ Daily GK).
 */
export function computeUnifiedStats(questions = [], shifts = [], options = {}) {
  const list = Array.isArray(questions) ? questions : [];
  const gkCount = Number(options.gkQuestionsCount) || 0;

  let verifiedQuestions = 0;
  let importantQuestions = 0;
  let uploadedQuestions = 0;
  let currentAffairsBankQuestions = 0;

  let underGraduate = 0;
  let graduate = 0;
  let graduate2026 = 0;
  let graduate2024 = 0;
  let groupD2025 = 0;
  let sscCgl = 0;
  let sscCgl2020 = 0;
  let sscCgl2026 = 0;
  let appscGroup2 = 0;
  let appsc2024Prelims = 0;
  let otherUploaded = 0;

  const subjectCounts = {
    all: list.length,
    'general-knowledge': 0,
    'current-affairs': 0,
    'quantitative-aptitude': 0,
    reasoning: 0,
    'general-science': 0,
    'computer-science': 0,
    'english-language': 0
  };

  const bySubjectLabel = {
    'General Knowledge': 0,
    'Current Affairs': 0,
    Reasoning: 0,
    'Quantitative Aptitude': 0,
    'General Science': 0,
    'English Language': 0,
    'Computer Science': 0
  };

  const topicCounts = {};
  const byTopic = {};
  const topicsBySubject = {
    'General Knowledge': {},
    'Current Affairs': {},
    Reasoning: {},
    'Quantitative Aptitude': {},
    'General Science': {},
    'English Language': {},
    'Computer Science': {}
  };

  for (const q of list) {
    if (!q || typeof q !== 'object') continue;

    if (isVerifiedQuestion(q)) {
      verifiedQuestions++;
    } else {
      importantQuestions++;
    }

    if (isUploadedQuestion(q)) {
      uploadedQuestions++;
    }

    const qId = String(q.id || '');
    const examType = String(q.examType || '');
    const examLevel = String(q.examLevel || '');
    const examDate = String(q.examDate || '');
    const examYear = String(q.examYear || '');

    if (
      q._sourceOrigin === 'current-affairs' ||
      String(q.source || '').includes('Current Affairs Compendium')
    ) {
      currentAffairsBankQuestions++;
    }

    if (examType === 'APPSC Group II' || qId.includes('appsc')) {
      appscGroup2++;
      if (
        q.paperNumber === 0 ||
        examYear === '2024' ||
        qId.toLowerCase().includes('2024-prelims')
      ) {
        appsc2024Prelims++;
      }
    } else if (
      examType === 'SSC CGL' ||
      examLevel.includes('CGL') ||
      qId.startsWith('ssc-cgl')
    ) {
      sscCgl++;
      if (examYear === '2026' || qId.includes('2026')) {
        sscCgl2026++;
      } else {
        sscCgl2020++;
      }
    } else if (
      examType === 'RRB Group D' ||
      qId.includes('group-d')
    ) {
      groupD2025++;
    } else if (examLevel === 'Graduate' || qId.includes('rrb-ntpc-grad')) {
      graduate++;
      const is2026 =
        examYear === '2026' ||
        qId.includes('2026') ||
        examDate.includes('2026') ||
        examDate.includes('Mar');
      if (is2026) {
        graduate2026++;
      } else {
        graduate2024++;
      }
    } else if (
      examLevel === 'Under Graduate' ||
      qId.includes('rrb-ntpc-ug')
    ) {
      underGraduate++;
    } else if (q._sourceOrigin !== 'current-affairs') {
      otherUploaded++;
    }

    const c = classifyQuestion(q);
    const sid = subjectCounts[c.subjectId] !== undefined ? c.subjectId : 'general-knowledge';
    subjectCounts[sid]++;

    const displaySub = getDisplaySubjectName(sid);
    bySubjectLabel[displaySub] = (bySubjectLabel[displaySub] || 0) + 1;

    const topicKey = `${sid}::${c.topicId}`;
    topicCounts[topicKey] = (topicCounts[topicKey] || 0) + 1;

    const subtopicLabel = q.subtopic || c.topicName;
    if (subtopicLabel) {
      byTopic[subtopicLabel] = (byTopic[subtopicLabel] || 0) + 1;
      if (topicsBySubject[displaySub]) {
        topicsBySubject[displaySub][subtopicLabel] =
          (topicsBySubject[displaySub][subtopicLabel] || 0) + 1;
      }
    }
  }

  const shiftsArr = Array.isArray(shifts) ? shifts : [];
  const playableShifts = shiftsArr.filter((s) => s && s.hasLoadedQuestions !== false);
  const totalShifts = playableShifts.length > 0 ? playableShifts.length : shiftsArr.length;
  const totalMockTests = computeMockTestsCount(shiftsArr);
  const previousPaperQuestions = Math.max(
    0,
    list.length - currentAffairsBankQuestions - uploadedQuestions
  );

  return {
    statsVersion: MOCK_STATS_VERSION,
    total: list.length,
    totalQuestions: list.length,
    verifiedQuestions,
    published: verifiedQuestions,
    importantQuestions,
    needsReview: importantQuestions,
    unverifiedQuestions: importantQuestions,
    uploadedQuestions,
    previousPaperQuestions,
    currentAffairsBankQuestions,
    gkPracticeQuestions: gkCount,
    allPlatformQuestions: list.length + gkCount,
    totalShifts,
    metadataShifts: shiftsArr.length,
    totalSubtopics: TOTAL_TOPIC_UNITS,
    totalMockTests,
    underGraduate,
    graduate,
    graduate2026,
    graduate2024,
    groupD2025,
    sscCgl,
    sscCgl2020,
    sscCgl2026,
    appscGroup2,
    appsc2024Prelims,
    otherUploaded,
    subjectCounts,
    bySubject: bySubjectLabel,
    topicCounts,
    byTopic,
    topicsBySubject,
    source: `Verified Question Bank (${list.length.toLocaleString()} Qs • ${verifiedQuestions.toLocaleString()} Verified • ${importantQuestions.toLocaleString()} Important · ${totalShifts} Shifts)`,
    computedAt: new Date().toISOString()
  };
}

export function getCachedUnifiedStats() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage?.getItem(MOCK_STATS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = safeJsonParse(raw, null, 256 * 1024);
    if (
      parsed &&
      parsed.statsVersion === MOCK_STATS_VERSION &&
      typeof parsed.totalQuestions === 'number' &&
      parsed.totalQuestions > 0 &&
      typeof parsed.verifiedQuestions === 'number' &&
      typeof parsed.importantQuestions === 'number'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCachedUnifiedStats(stats) {
  if (typeof window === 'undefined' || !stats) return;
  try {
    window.localStorage?.setItem(MOCK_STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore quota failures
  }
}
