/**
 * Service to manage RRB NTPC UG 2025 Mock Tests & Questions
 * Provides fast local caching, subject filtering, Firestore synchronization,
 * and complete examination data management.
 */

import { RRB_NTPC_SHIFTS, RRB_CORE_SUBJECTS } from '../data/rrbNtpcMetadata.js';
import { ALL_CBT_SHIFTS } from '../data/allShiftsMetadata.js';
import {
  classifyQuestion,
  SUBJECT_TOPIC_TAXONOMY,
  MOCK_CATEGORIES,
  resolveCanonicalTopicId
} from '../constants/mockTaxonomy.js';
import { CANONICAL_SUBJECTS, getExamStageConfig } from '../constants/examHierarchy.js';
import { MOCK_QUESTIONS_DATABASE } from '../data/mockTestsData.js';
import {
  computeUnifiedStats,
  getCachedUnifiedStats,
  saveCachedUnifiedStats
} from '../utils/questionStats.js';
import { extractProvenance, getOptionTexts, getQuestionText } from '../utils/questionClassifier.js';
import {
  generateCustomOrPracticeMock,
  generateOfficialFullMock,
  isPlayableQuestion
} from './questionSelectionEngine.js';
import { safeJsonParse, stripDangerousKeys } from '../utils/security.js';

const STORAGE_KEY_CUSTOM_QUESTIONS = 'eqh_custom_mock_questions_v1';
const STORAGE_KEY_TEST_OVERRIDES = 'eqh_mock_test_overrides_v1';

/**
 * Computer Science is a syllabus unit of the General Awareness section. It gets its own
 * subject entry in the mocks hub (rather than one General Knowledge topic) so it can carry
 * the standard Computer Science units used by government examinations.
 */
export const COMPUTER_SCIENCE_SUBJECT = {
  id: 'computer-science',
  title: 'Computer Science',
  name: 'Computer Science (Computer Awareness)',
  description:
    'Fundamentals, Operating Systems, Computer Networks, DBMS, DSA, Programming, Digital Logic & Software Engineering',
  color: 'from-cyan-600 to-cyan-700',
  badge: 'Computer',
  topics: [
    'Computer Fundamentals & Awareness',
    'Operating Systems',
    'Computer Networks',
    'Database Management Systems',
    'Data Structures & Algorithms',
    'Programming & OOP',
    'Digital Logic & Computer Organization',
    'Software Engineering'
  ]
};

export const ENGLISH_SUBJECT = {
  id: 'english-language',
  title: 'English Language',
  name: 'English Comprehension & Grammar',
  description:
    'Grammar & Error Spotting, Vocabulary, Synonyms & Antonyms, Idioms & Phrases, Reading Comprehension & Cloze Test',
  color: 'from-sky-600 to-sky-700',
  badge: 'English',
  topics: [
    'Reading Comprehension & Cloze Test',
    'Grammar & Error Spotting',
    'Vocabulary, Synonyms & Antonyms',
    'Idioms & Phrases',
    'One Word Substitution & Spelling',
    'Sentence Rearrangement & Para Jumbles'
  ]
};

/** Subjects offered in the mocks hub: core subjects, English Language, plus Computer Science. */
export const RRB_MOCK_SUBJECTS = [...RRB_CORE_SUBJECTS, ENGLISH_SUBJECT, COMPUTER_SCIENCE_SUBJECT];

const toKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/** Stable slug for a topic name. Shared with the mock hub so topic links resolve here. */
export function slugifyTopic(topic) {
  return String(topic || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Splits `topic-<subjectId>-<topicSlug>` so the engine can scope the test by topic. */
function parseTopicTestId(testId) {
  const rest = String(testId).slice('topic-'.length);
  const subjectId =
    RRB_MOCK_SUBJECTS.map((subject) => subject.id).find(
      (id) => rest === id || rest.startsWith(`${id}-`)
    ) || null;
  return { subjectId, topicSlug: subjectId ? rest.slice(subjectId.length + 1) : rest };
}

/** Maps a topic slug back to the topic name declared on that subject. */
function resolveTopicName(subjectId, topicSlug) {
  const subject = RRB_MOCK_SUBJECTS.find((item) => item.id === subjectId);
  const declared = (subject?.topics || []).find((topic) => slugifyTopic(topic) === topicSlug);
  return declared || titleCaseTopic(topicSlug);
}

/** 'computer-science' -> 'Computer Science' */
function titleCaseTopic(topicSlug) {
  return String(topicSlug || '')
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * The extracted papers record every General Knowledge question as
 * "General Awareness & Studies", so a GK topic test has to work out the topic from
 * the question text. Rules are checked in order and the first match wins; questions
 * that match nothing stay under Static GK.
 */
const GK_TOPIC_RULES = [
  [
    'Computer Science',
    /\b(computer|cpu|software|hardware|internet|website|browser|http|url|binary|operating system|firewall|compiler|motherboard|database|network|email|keyboard|mouse|printer|byte|processor|cyber|algorithm|excel|ms word|powerpoint|wifi|bluetooth)\b/
  ],
  [
    'Polity & Constitution',
    /\b(constitution|article|amendment|parliament|lok sabha|rajya sabha|president|prime minister|vice president|supreme court|high court|governor|fundamental rights?|directive principles?|election commission|panchayat|judiciary|chief minister|speaker|attorney|census|bill|ordinance)\b/
  ],
  [
    'Indian History',
    /\b(ancient|medieval|mughal|sultanate|british|dynasty|battle|gandhi|nehru|independence|vedic|harappan|indus valley|ashoka|akbar|shivaji|maratha|revolt|freedom struggle|harappa|mohenjo)\b/
  ],
  [
    'Geography',
    /\b(river|mountain|plateau|desert|soil|climate|monsoon|lake|ocean|latitude|longitude|continent|tropic|glacier|valley|island|national park|forest|rainfall|mineral|dam|tributary|peninsula|delta)\b/
  ],
  [
    'Economy',
    /\b(gdp|gross domestic|inflation|rbi|reserve bank|budget|tax|gst|economy|economic|trade|currency|rupee|crore|lakh|agriculture|industry|five year plan|poverty|national income|fiscal|monetary|niti aayog|sebi|sensex)\b/
  ],
  [
    'Government Schemes',
    /\b(scheme|yojana|abhiyan|pradhan mantri|mudra|jan dhan|subsidy|welfare)\b/
  ],
  ['Current Affairs', /\b20(1[5-9]|2[0-9])\b/]
];

/** Topic a General Knowledge question belongs to. */
export function classifyGkTopic(question) {
  if (toKey(question?.subtopic) === 'computerawareness') return 'Computer Science';
  const text = `${question?.question?.en || ''} ${(question?.options?.en || []).join(' ')}`.toLowerCase();
  for (const [topic, pattern] of GK_TOPIC_RULES) {
    if (pattern.test(text)) return topic;
  }
  return 'Static GK';
}

/**
 * Computer Science unit a computer question belongs to, following the units used by
 * government examinations. Basic awareness questions (hardware, memory, MS Office,
 * shortcuts) fall through to the fundamentals bucket.
 */
const COMPUTER_TOPIC_RULES = [
  [
    'Database Management Systems',
    /\b(database|dbms|rdbms|sql|primary key|foreign key|normalization|oracle|mysql|table|query)\b/
  ],
  [
    'Operating Systems',
    /\b(operating system|windows|linux|unix|ms-?dos|kernel|booting|bios|file system|taskbar|device driver|gui|command prompt)\b/
  ],
  [
    'Computer Networks',
    /\b(network|lan|wan|internet|intranet|protocol|http|https|ftp|smtp|tcp|ip address|router|switch|modem|ethernet|wifi|wi-fi|bluetooth|topology|server|client|url|www|browser|website|web page|email|e-mail|firewall|bandwidth|cloud)\b/
  ],
  [
    'Data Structures & Algorithms',
    /\b(data structure|array|stack|queue|linked list|binary tree|algorithm|sorting|searching|complexity|recursion|pointer)\b/
  ],
  [
    'Programming & OOP',
    /\b(programming language|programming|compiler|interpreter|assembler|java|python|c\+\+|object oriented|oop|inheritance|polymorphism|encapsulation|source code|machine language|high level language|assembly language|cobol|fortran|pascal|html|xml|javascript)\b/
  ],
  [
    'Software Engineering',
    /\b(software engineering|sdlc|waterfall|agile|software testing|debugging|malware|virus|antivirus|spyware|trojan|worm|hacking|phishing|encryption|backup|syntax error)\b/
  ],
  [
    'Digital Logic & Computer Organization',
    /\b(logic gate|gates|nand|nor|xor|truth table|flip.?flop|register|counter|number system|hexadecimal|octal|binary|ascii|ebcdic|unicode|alu|microprocessor|instruction|clock speed|system bus)\b/
  ]
];

/** Computer Science topic a computer question belongs to. */
export function classifyComputerTopic(question) {
  const text = `${question?.question?.en || ''} ${(question?.options?.en || []).join(' ')}`.toLowerCase();
  for (const [topic, pattern] of COMPUTER_TOPIC_RULES) {
    if (pattern.test(text)) return topic;
  }
  return 'Computer Fundamentals & Awareness';
}

const STORAGE_KEY_CACHED_SHIFTS = 'eqh_cached_cbt_shifts_v10';
const OPTIONAL_DATA_FILES = new Set(['appscGroup2Prelims2024Full.json']);

let cachedQuestions = null;
let cachedShifts = null;
let cachedManifest = null;
let cachedShiftQuestionsMap = new Map();
let cachedPaperInventory = null;
let inflightLoadPromise = null;
let inflightManifestPromise = null;

/**
 * Fast-path loader for precomputed `public/data/bankManifest.json` (<50ms)
 * so hubs render instant statistics without parsing ~28 MB JSON archives on mount.
 */
export async function loadBankManifest(forceRefresh = false) {
  if (!forceRefresh && cachedManifest) return cachedManifest;
  if (!forceRefresh && inflightManifestPromise) return inflightManifestPromise;

  inflightManifestPromise = (async () => {
    try {
      const data = await loadRrbDataFile('bankManifest.json');
      if (data && data.stats) {
        cachedManifest = data;
        if (Array.isArray(data.shifts) && data.shifts.length > 0 && (!cachedShifts || cachedShifts.length === 0)) {
          cachedShifts = data.shifts;
        }
        return data;
      }
      return null;
    } finally {
      inflightManifestPromise = null;
    }
  })();

  return inflightManifestPromise;
}

function getInitialShifts() {
  if (cachedShifts && cachedShifts.length > 0) return cachedShifts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CACHED_SHIFTS);
    if (raw) {
      const parsed = safeJsonParse(raw, null, 4 * 1024 * 1024);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedShifts = parsed;
        return cachedShifts;
      }
    }
  } catch {
    // Ignore storage parse issues
  }
  return ALL_CBT_SHIFTS && ALL_CBT_SHIFTS.length > 0 ? ALL_CBT_SHIFTS : RRB_NTPC_SHIFTS;
}

/**
 * Extracted official CBT question banks merged into one unified pool:
 * - RRB NTPC Under-Graduate 2024 papers (57 shifts · CEN 06/2024)
 * - RRB NTPC Graduate 2024 papers (47 shifts · CEN 06/2024)
 * - RRB NTPC Graduate 2025-26 papers (24 shifts · CEN 06/2025)
 * - SSC CGL 2020 & 2026 Tier-I papers (35 shifts)
 * - RRB Group D 2025 Level-1 papers (48 shifts · CEN 09/2025)
 * - APPSC Group-2 Paper-1 & Paper-2 (2025) & optional Prelims (2024)
 */
const RRB_DATA_FILES = [
  'rrbNtpcUg2024Full.json',
  'rrbNtpcGraduate2024Full.json',
  'rrbNtpcGraduate2025Full.json',
  'sscCgl2020Full.json',
  'sscCgl2026Full.json',
  'rrbGroupD2025Full.json',
  'appscGroup2Prelims2024Full.json',
  'appscGroup2Paper12025Full.json',
  'appscGroup2Paper22025Full.json'
];

function getDataFileUrl(fileName) {
  if (typeof window === 'undefined') return `/data/${fileName}`;
  // Handle sandbox/iframe where window.location.origin is "null" or missing
  const origin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '';
  const basePath = import.meta.env.BASE_URL || '/';
  const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return `${origin}${cleanBase}/data/${fileName}`;
}

async function loadRrbDataFile(fileName) {
  if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions?.node) {
    try {
      const fsModule = `fs/${'promises'}`;
      const pathModule = `${'pa'}th`;
      const fs = await import(/* @vite-ignore */ fsModule);
      const path = await import(/* @vite-ignore */ pathModule);
      const fullPath = path.resolve(process.cwd(), 'public/data', fileName);
      const fileData = await fs.readFile(fullPath, 'utf-8');
      return safeJsonParse(fileData, null, 25 * 1024 * 1024);
    } catch {
      return null;
    }
  }

  const primaryUrl = getDataFileUrl(fileName);

  const fetchAndParseJson = async (fetchUrl, cacheMode = 'default') => {
    const res = await fetch(fetchUrl, {
      headers: {
        Accept: 'application/json, text/plain, */*'
      },
      cache: cacheMode
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const text = await res.text();
    const trimmed = text.trim();

    // Check if the response is actually an HTML error or SPA fallback
    if (!trimmed || trimmed.startsWith('<') || trimmed.toLowerCase().startsWith('<!doctype')) {
      // Clear poisoned cache from service worker if present
      if (typeof window !== 'undefined' && 'caches' in window) {
        try {
          const cache = await window.caches.open('question-banks-cache');
          await cache.delete(fetchUrl);
          await cache.delete(`/data/${fileName}`);
        } catch {
          // Ignore cache errors
        }
      }
      throw new Error(`Received HTML instead of JSON for ${fileName}`);
    }

    return safeJsonParse(trimmed, null, 25 * 1024 * 1024);
  };

  try {
    return await fetchAndParseJson(primaryUrl, 'default');
  } catch (err) {
    // Try fallback path with relative URL
    try {
      const fallbackUrl = `/data/${fileName}?_t=${Date.now()}`;
      return await fetchAndParseJson(fallbackUrl, 'default');
    } catch {
      if (!OPTIONAL_DATA_FILES.has(fileName)) {
        console.warn(`Static question bank ${fileName} not available via fetch; using live database.`);
      }
      return null;
    }
  }
}

function getShiftBucketKeyFromQuestion(q) {
  if (!q) return null;
  const qId = String(q.id || '').toLowerCase();
  const examType = String(q.examType || '');
  const examYear = String(q.examYear || '');
  const shiftNum = q.shiftNumber || q.setNumber || 1;

  if (examType === 'APPSC Group II' || qId.includes('appsc')) {
    if (q.paperNumber === 0 || examYear === '2024' || qId.includes('2024-prelims')) {
      return 'appsc-group2-2024-prelims-shift-1';
    }
    if (q.paperNumber === 1 || qId.includes('-p1-') || qId.includes('paper1')) {
      return 'appsc-group2-2025-paper1-shift-1';
    }
    return 'appsc-group2-2025-paper2-shift-1';
  }
  if (examType === 'RRB Group D' || qId.includes('rrb-group-d')) {
    return `groupd-2025-shift-${shiftNum}`;
  }
  if (examType === 'SSC CGL' || qId.includes('ssc')) {
    const year = examYear === '2026' || qId.includes('2026') ? '2026' : '2020';
    return `ssc-${year}-shift-${shiftNum}`;
  }
  if (q.examLevel === 'Graduate' || qId.includes('grad')) {
    const year =
      examYear === '2026' || qId.includes('grad-2026') || String(q.examDate || '').includes('2026') || String(q.examDate || '').includes('Mar')
        ? '2026'
        : '2024';
    return `grad-${year}-shift-${shiftNum}`;
  }
  return `ug-2024-shift-${shiftNum}`;
}

export function getPaperInventorySummary() {
  return cachedPaperInventory;
}

/**
 * Fetch and cache all RRB, SSC & APPSC examination questions in parallel.
 * Sub-second sync with inflight promise deduplication.
 */
export async function loadAllRRBQuestions(forceRefresh = false) {
  if (!forceRefresh && cachedQuestions && cachedQuestions.length > 0) {
    return applyLocalOverrides(cachedQuestions);
  }

  if (inflightLoadPromise) {
    return inflightLoadPromise;
  }

  inflightLoadPromise = (async () => {
    try {
      const results = await Promise.allSettled(
        RRB_DATA_FILES.map((fileName) => loadRrbDataFile(fileName))
      );

      const dedupQuestionsMap = new Map();
      const textSignatures = new Set();
      const dedupShiftsMap = new Map();
      const shiftQuestionsCollector = new Map();

      let rawPaperTotal = 0;
      let validPaperTotal = 0;
      let incompleteSkipped = 0;
      let duplicateTextSkipped = 0;
      const fileBreakdown = [];

      for (let i = 0; i < results.length; i++) {
        const fileName = RRB_DATA_FILES[i];
        const item = results[i];
        if (item.status === 'fulfilled' && item.value) {
          const data = item.value;
          const fileQs = Array.isArray(data.questions) ? data.questions : [];
          let fileValid = 0;
          let fileUnique = 0;
          let fileIncomplete = 0;
          let fileDup = 0;

          for (const rawQ of fileQs) {
            rawPaperTotal++;
            if (!rawQ || !rawQ.id) {
              fileIncomplete++;
              incompleteSkipped++;
              continue;
            }

            const rawText = getQuestionText(rawQ);
            const optsArray = getOptionTexts(rawQ);
            const validOpts = optsArray.filter((o) => typeof o === 'string' && o.trim().length > 0);
            const isBrokenExtraction = !rawText || rawText.length < 2 || validOpts.length < 2;

            if (isBrokenExtraction) {
              fileIncomplete++;
              incompleteSkipped++;
            } else {
              fileValid++;
              validPaperTotal++;
            }

            // Normalize graduate exam years consistently
            const isGrad = rawQ.examLevel === 'Graduate' || String(rawQ.id).includes('rrb-ntpc-grad');
            let q = { ...rawQ, _sourceOrigin: 'previous-paper' };
            if (isGrad) {
              const is2026 =
                q.examYear === '2026' ||
                String(q.id).includes('grad-2026') ||
                String(q.examDate || '').includes('2026') ||
                String(q.examDate || '').includes('Mar');
              if (is2026) {
                q.examYear = '2026';
                q.examName = 'RRB NTPC Graduate 2025-26 (CEN 06/2025)';
                q.examLevelLabel = 'Graduate (March 2026 Exam)';
              } else {
                q.examYear = '2024';
                q.examName = 'RRB NTPC Graduate 2024 (CBT-1)';
                q.examLevelLabel = 'Graduate 2024';
                q.source = 'RRB NTPC Graduate 2024 Official Answer Key (CEN 06/2024)';
              }
            }

            // Preserve per-shift question list BEFORE cross-shift deduplication so every
            // official shift paper (e.g. SSC CGL 2026 Shifts 1–14) plays with its full 100 Qs.
            const shiftKey = getShiftBucketKeyFromQuestion(q);
            if (shiftKey) {
              if (!shiftQuestionsCollector.has(shiftKey)) {
                shiftQuestionsCollector.set(shiftKey, []);
              }
              shiftQuestionsCollector.get(shiftKey).push(q);
            }

            // Deduplicate globally for the unique Question Bank
            if (dedupQuestionsMap.has(q.id)) {
              fileDup++;
              duplicateTextSkipped++;
              continue;
            }

            const cleanText = rawText.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanOpts = optsArray.map((o) => String(o || '').toLowerCase().replace(/[^a-z0-9]/g, '')).join('|');
            const signature = cleanText.length >= 6 ? `${cleanText}:::${cleanOpts}` : null;
            if (signature && textSignatures.has(signature)) {
              fileDup++;
              duplicateTextSkipped++;
              continue;
            }
            if (signature) textSignatures.add(signature);

            dedupQuestionsMap.set(q.id, q);
            fileUnique++;
          }

          const fileShifts = Array.isArray(data.shifts) ? data.shifts : [];
          fileBreakdown.push({
            fileName,
            status: 'loaded',
            shiftsCount: fileShifts.length,
            rawCount: fileQs.length,
            validCount: fileValid,
            uniqueCount: fileUnique,
            incompleteCount: fileIncomplete,
            duplicateCount: fileDup
          });

          for (const rawS of fileShifts) {
            if (!rawS || !rawS.id) continue;
            if (!dedupShiftsMap.has(rawS.id)) {
              let s = { ...rawS, hasLoadedQuestions: true };
              const isGrad = s.examLevel === 'Graduate' || String(s.id).includes('grad');
              if (isGrad) {
                const is2026 =
                  s.examYear === '2026' ||
                  String(s.id).includes('grad-2026') ||
                  String(s.examDate || '').includes('2026') ||
                  String(s.examDate || '').includes('Mar');
                if (is2026) {
                  s.examYear = '2026';
                  s.examName = 'RRB NTPC Graduate 2025-26 (CEN 06/2025)';
                  s.examLevelLabel = 'Graduate (March 2026 Exam)';
                } else {
                  s.examYear = '2024';
                  s.examName = 'RRB NTPC Graduate 2024 (CBT-1)';
                  s.examLevelLabel = 'Graduate 2024';
                }
              }
              dedupShiftsMap.set(s.id, s);
            }
          }
        } else {
          fileBreakdown.push({
            fileName,
            status: 'missing',
            shiftsCount: 0,
            rawCount: 0,
            validCount: 0,
            uniqueCount: 0,
            incompleteCount: 0,
            duplicateCount: 0
          });
          if (!OPTIONAL_DATA_FILES.has(fileName) && item.reason) {
            console.warn(`Notice while loading question bank ${fileName}:`, item.reason);
          }
        }
      }

      // Incorporate Current Affairs monthly MCQs
      let caCount = 0;
      if (MOCK_QUESTIONS_DATABASE) {
        for (const [, caList] of Object.entries(MOCK_QUESTIONS_DATABASE)) {
          if (Array.isArray(caList)) {
            for (const caQ of caList) {
              if (!caQ || !caQ.id || dedupQuestionsMap.has(caQ.id)) continue;
              const formattedCa = {
                id: caQ.id,
                questionNumber: caQ.qNumber,
                question: { en: caQ.question, te: '' },
                options: {
                  en: [caQ.options?.A || '', caQ.options?.B || '', caQ.options?.C || '', caQ.options?.D || ''],
                  te: []
                },
                correctAnswer: ['A', 'B', 'C', 'D'].indexOf(caQ.correctAnswer) >= 0 ? ['A', 'B', 'C', 'D'].indexOf(caQ.correctAnswer) : 0,
                correctLetter: caQ.correctAnswer || 'A',
                explanation: { en: caQ.explanation || '', te: '' },
                subject: 'Current Affairs',
                subjectId: 'current-affairs',
                categoryId: 'ca',
                subtopic: caQ.topic || 'National & International Current Affairs',
                difficulty: caQ.difficulty || 'Medium',
                status: 'Published',
                verificationStatus: 'VERIFIED',
                examName: 'Current Affairs 2025-2026',
                examYear: String(caQ.id || '').startsWith('jan26-') ? '2026' : '2025',
                source: 'ExamQuestHub Monthly Current Affairs Compendium',
                _sourceOrigin: 'current-affairs'
              };
              dedupQuestionsMap.set(caQ.id, formattedCa);
              caCount++;
            }
          }
        }
      }

      const merged = Array.from(dedupQuestionsMap.values());
      const mergedShifts = Array.from(dedupShiftsMap.values());

      cachedShiftQuestionsMap = shiftQuestionsCollector;
      cachedPaperInventory = {
        rawPaperTotal,
        validPaperTotal,
        incompleteSkipped,
        duplicateTextSkipped,
        currentAffairsCount: caCount,
        uniqueStaticTotal: merged.length,
        loadedShiftsCount: mergedShifts.length,
        fileBreakdown
      };

      if (merged.length > 0) {
        cachedQuestions = merged;
      }
      if (mergedShifts.length > 0) {
        cachedShifts = mergedShifts;
        try {
          localStorage.setItem(STORAGE_KEY_CACHED_SHIFTS, JSON.stringify(mergedShifts));
        } catch {
          // Ignore local storage quota limits
        }
      }

      return applyLocalOverrides(cachedQuestions || []);
    } finally {
      inflightLoadPromise = null;
    }
  })();

  return inflightLoadPromise;
}

/**
 * Apply any admin overrides stored in localStorage (or Firestore)
 */
function applyLocalOverrides(baseQuestions) {
  try {
    const custom = safeJsonParse(localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS) || '[]', []);
    if (!Array.isArray(custom) || custom.length === 0) return baseQuestions;

    const map = new Map(baseQuestions.map((q) => [q.id, { ...q }]));
    for (const cq of custom) {
      if (!cq || typeof cq !== 'object' || !cq.id) continue;
      if (cq._deleted) {
        map.delete(cq.id);
      } else if (map.has(cq.id)) {
        map.set(cq.id, { ...map.get(cq.id), ...cq });
      } else {
        map.set(cq.id, { _sourceOrigin: 'uploaded', ...cq });
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
    const cleanQuestion = stripDangerousKeys(question);
    const parsed = safeJsonParse(localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS) || '[]', []);
    const custom = Array.isArray(parsed) ? parsed : [];
    const existingIndex = custom.findIndex((q) => q.id === cleanQuestion.id);
    if (existingIndex >= 0) {
      custom[existingIndex] = cleanQuestion;
    } else {
      custom.push(cleanQuestion);
    }
    localStorage.setItem(STORAGE_KEY_CUSTOM_QUESTIONS, JSON.stringify(custom));
    if (cachedQuestions) {
      const idx = cachedQuestions.findIndex((q) => q.id === cleanQuestion.id);
      if (idx >= 0) {
        cachedQuestions[idx] = { ...cachedQuestions[idx], ...cleanQuestion };
      } else {
        cachedQuestions.push({ _sourceOrigin: 'uploaded', ...cleanQuestion });
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
    const parsed = safeJsonParse(localStorage.getItem(STORAGE_KEY_CUSTOM_QUESTIONS) || '[]', []);
    const custom = Array.isArray(parsed) ? parsed : [];
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

export async function loadAllShifts() {
  if (cachedShifts && cachedShifts.length > 0 && cachedPaperInventory) return getAllShifts();
  await loadAllRRBQuestions();
  return getAllShifts();
}

/**
 * Get all mock tests metadata (combining loaded shifts with any overrides)
 */
export function getAllShifts() {
  try {
    const parsed = safeJsonParse(localStorage.getItem(STORAGE_KEY_TEST_OVERRIDES) || '{}', {});
    const overrides = parsed && typeof parsed === 'object' ? parsed : {};
    const base = (cachedShifts && cachedShifts.length > 0) ? cachedShifts : getInitialShifts();
    return base.map((shift) => {
      const ov = overrides[shift.id];
      return ov ? { ...shift, ...ov } : shift;
    });
  } catch {
    return (cachedShifts && cachedShifts.length > 0) ? cachedShifts : getInitialShifts();
  }
}

/**
 * Save mock test metadata override (duration, negative marking, status)
 */
export function saveShiftOverride(shiftId, updates) {
  try {
    const cleanUpdates = stripDangerousKeys(updates);
    const parsed = safeJsonParse(localStorage.getItem(STORAGE_KEY_TEST_OVERRIDES) || '{}', {});
    const overrides = parsed && typeof parsed === 'object' ? parsed : {};
    overrides[shiftId] = { ...(overrides[shiftId] || {}), ...cleanUpdates };
    localStorage.setItem(STORAGE_KEY_TEST_OVERRIDES, JSON.stringify(overrides));
    return true;
  } catch (err) {
    console.error('Failed to save shift override:', err);
    return false;
  }
}

/**
 * Get questions for a specific shift and optional subject
/**
 * Canonical subject identifier mapping.
 * Ensures consistent subject IDs across the entire app.
 */
export function normalizeSubjectId(raw) {
  if (!raw) return 'all';
  const s = String(raw).toLowerCase().trim();
  if (s === 'all' || s === 'all mock' || s === 'all-mock' || s === 'full') return 'all';
  if (s.includes('current') || s === 'ca' || s === 'current-affairs' || s === 'national-affairs') return 'current-affairs';
  if (
    s.includes('english') ||
    s === 'eng' ||
    s === 'english-language' ||
    s === 'grammar-error-spotting' ||
    s === 'vocabulary' ||
    s === 'idioms-phrases' ||
    s === 'reading-comprehension' ||
    s === 'sentence-rearrangement' ||
    s === 'one-word-substitution'
  ) return 'english-language';
  if (
    s.includes('quant') ||
    s.includes('math') ||
    s === 'quantitative-aptitude' ||
    s === 'number-system' ||
    s === 'percentage-profit-loss' ||
    s === 'time-speed-distance-work' ||
    s === 'ratio-proportion-mixtures' ||
    s === 'mensuration-geometry' ||
    s === 'data-interpretation' ||
    s === 'algebra-trigonometry'
  ) return 'quantitative-aptitude';
  if (
    s.includes('reason') ||
    s === 'reasoning' ||
    s === 'analogies-classification' ||
    s === 'series-coding-decoding' ||
    s === 'blood-relations-directions' ||
    s === 'syllogism-conclusions' ||
    s === 'puzzles-seating' ||
    s === 'non-verbal-reasoning'
  ) return 'reasoning';
  if (
    s.includes('computer') ||
    s.includes('cse') ||
    s === 'computer-science' ||
    s === 'computer-networks' ||
    s === 'dbms' ||
    s === 'operating-systems' ||
    s === 'data-structures-algorithms' ||
    s === 'programming-oop' ||
    s === 'digital-logic' ||
    s === 'software-engineering'
  ) return 'computer-science';
  if (
    s === 'general-science' ||
    s === 'science' ||
    s === 'sci' ||
    s === 'physics' ||
    s === 'chemistry' ||
    s === 'biology'
  ) return 'general-science';
  if (
    s.includes('gk') ||
    s.includes('knowledge') ||
    s.includes('general awareness') ||
    s === 'general-knowledge' ||
    s === 'indian-polity' ||
    s === 'indian-history' ||
    s === 'geography' ||
    s === 'indian-economy' ||
    s === 'environment-ecology' ||
    s === 'static-gk'
  ) return 'general-knowledge';
  return 'general-knowledge';
}

const classificationCache = new WeakMap();

function classifyQuestionCached(question) {
  if (!question || typeof question !== 'object') {
    return classifyQuestion(question);
  }
  const cached = classificationCache.get(question);
  if (cached) return cached;
  const result = classifyQuestion(question);
  classificationCache.set(question, result);
  return result;
}

export function shuffleArray(items) {
  const arr = Array.isArray(items) ? [...items] : [];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function deriveQuestionExamYear(q) {
  if (q?.examYear) return String(q.examYear);
  const id = String(q?.id || '');
  const name = String(q?.examName || '');
  const combined = `${id} ${name}`;
  if (combined.includes('2026')) return '2026';
  if (combined.includes('2025')) return '2025';
  if (combined.includes('2024')) return '2024';
  if (combined.includes('2020')) return '2020';
  return '2025';
}

function formatExamBucketLabel(examName, examYear) {
  const cleanName = String(examName || 'Official CBT Paper').trim();
  const cleanYear = String(examYear || '').trim();
  if (!cleanYear) return cleanName;
  if (cleanName.includes(cleanYear)) return cleanName;
  return `${cleanName} (${cleanYear})`;
}

/**
 * Stratified random sampling across every exam and year represented in `pool`.
 * Guarantees questions are randomly drawn from all available exams/years rather than
 * slicing sequentially from the first file loaded (e.g. RRB NTPC UG 2024).
 */
export function sampleStratifiedRandomQuestions(pool, limit = null) {
  if (!Array.isArray(pool) || pool.length === 0) return [];

  const bucketsMap = new Map();
  for (const q of pool) {
    if (!q) continue;
    const examName = q.examName || q.examType || 'Official CBT Paper';
    const examYear = deriveQuestionExamYear(q);
    const key = `${examName}:::${examYear}`;
    if (!bucketsMap.has(key)) bucketsMap.set(key, []);
    bucketsMap.get(key).push(q);
  }

  const buckets = shuffleArray(Array.from(bucketsMap.values())).map((items) => shuffleArray(items));
  const numericLimit = limit !== null && limit !== undefined ? Number(limit) : 0;
  const hasLimit = Number.isFinite(numericLimit) && numericLimit > 0 && numericLimit < pool.length;
  const targetCount = hasLimit ? numericLimit : pool.length;

  const picked = [];
  let cursor = 0;
  while (picked.length < targetCount) {
    let addedInRound = false;
    const roundItems = [];
    for (const bucket of buckets) {
      if (cursor < bucket.length) {
        roundItems.push(bucket[cursor]);
        addedInRound = true;
      }
    }
    if (!addedInRound) break;
    // Shuffle each round so even "all" mode opens with mixed exams/years on question #1+
    const shuffledRound = shuffleArray(roundItems);
    for (const item of shuffledRound) {
      if (picked.length >= targetCount) break;
      picked.push(item);
    }
    cursor++;
  }

  return hasLimit ? shuffleArray(picked) : picked;
}

export function summarizeIncludedExams(questions) {
  const countsMap = new Map();
  const yearsSet = new Set();

  for (const q of questions || []) {
    if (!q) continue;
    const examName = String(q.examName || 'Official CBT Paper').trim();
    const examYear = deriveQuestionExamYear(q);
    if (examYear) yearsSet.add(examYear);

    const key = `${examName}:::${examYear}`;
    if (!countsMap.has(key)) {
      countsMap.set(key, {
        examName,
        examYear,
        label: formatExamBucketLabel(examName, examYear),
        count: 0
      });
    }
    countsMap.get(key).count += 1;
  }

  const includedExams = Array.from(countsMap.values()).sort((a, b) => {
    const yearCmp = String(b.examYear).localeCompare(String(a.examYear));
    if (yearCmp !== 0) return yearCmp;
    return b.count - a.count;
  });

  const yearsList = Array.from(yearsSet).sort((a, b) => String(a).localeCompare(String(b)));
  const yearsText = yearsList.length > 0 ? yearsList.join(', ') : '2020–2026';
  const examsSummaryText = includedExams.length > 0
    ? includedExams.map((e) => e.label).join(' · ')
    : 'All Official PYQ Papers';

  return {
    includedExams,
    yearsList,
    yearsText,
    examsSummaryText
  };
}

function getFallbackPaperInfo(q) {
  if (q?.paperUrl) {
    return {
      paperUrl: q.paperUrl,
      paperFileName: q.paperFileName || q.paperUrl.split('/').pop() || 'Official_Paper.pdf'
    };
  }
  const id = String(q?.id || '').toLowerCase();
  const examName = String(q?.examName || '').toLowerCase();
  const examType = String(q?.examType || '').toLowerCase();
  const examYear = String(q?.examYear || '');

  if (examType.includes('appsc') || id.includes('appsc')) {
    const isPrelims2024 =
      q?.paperNumber === 0 ||
      examYear === '2024' ||
      id.includes('2024-prelims') ||
      examName.includes('prelims');
    if (isPrelims2024) {
      return {
        paperUrl: '/assets/aistudio/APPSC-Group-II-Preliminary-Exam-Official-Paper-Held-On_-25-Feb-2024_3a12a02d.pdf',
        paperFileName: 'APPSC-Group-II-Preliminary-Exam-Official-Paper-Held-On_-25-Feb-2024.pdf'
      };
    }
    const isPaper1 = q?.paperNumber === 1 || id.includes('-p1-') || id.includes('paper1') || examName.includes('paper-1');
    if (isPaper1) {
      return {
        paperUrl: '/assets/aistudio/Group-2-_-Prelims-Exam-Question-Paper-1-2025_copy_0f4dabbf.pdf',
        paperFileName: 'Group-2-_-Prelims-Exam-Question-Paper-1-2025.pdf'
      };
    }
    return {
      paperUrl: '/assets/aistudio/Group-2-_-Prelims-Exam-Question-Paper-2-2025_copy_f6e37955.pdf',
      paperFileName: 'Group-2-_-Prelims-Exam-Question-Paper-2-2025.pdf'
    };
  }
  if (examType.includes('group d') || id.includes('group-d')) {
    return {
      paperUrl: '/assets/aistudio/RRB-Group-D-2025-EN-All-Sections_dece0c81.pdf',
      paperFileName: 'RRB-Group-D-2025-EN-All-Sections.pdf'
    };
  }
  if (examType.includes('ssc') || id.includes('ssc-cgl')) {
    return {
      paperUrl: '/assets/aistudio/SSC_CGL_2020_All_21_Sets_English.pdf',
      paperFileName: examYear === '2026' ? 'SSC_CGL_2026_All_Shift_Papers.pdf' : 'SSC_CGL_2020_All_21_Sets_English.pdf'
    };
  }
  if (q?.examLevel === 'Graduate' || id.includes('grad')) {
    if (examYear === '2026' || id.includes('grad-2026')) {
      return {
        paperUrl: '/assets/aistudio/RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key.pdf',
        paperFileName: 'RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key.pdf'
      };
    }
    return {
      paperUrl: '/assets/aistudio/RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key_887400b5.pdf',
      paperFileName: 'RRB-NTPC-Graduate-2024-CBT1-Official-Answer-Key.pdf'
    };
  }
  if (id.includes('ug-2024') || examName.includes('under graduate')) {
    return {
      paperUrl: '/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf',
      paperFileName: 'RRB-NTPC-UG-2025-EN-All-Papers.pdf'
    };
  }
  return { paperUrl: '', paperFileName: '' };
}

/**
 * Get all questions for a given subject with strict, reliable filtering.
 * Guaranteed: When General Knowledge is selected, only GK questions are returned.
 * When Quant is selected, only Quant questions are returned.
 * When Reasoning is selected, only Reasoning questions are returned.
 */
export async function getQuestionsForSubject(subjectIdOrName) {
  const all = (await loadAllRRBQuestions()).filter(isPlayableQuestion);
  const targetSubjectId = normalizeSubjectId(subjectIdOrName);
  if (targetSubjectId === 'all') {
    return all;
  }

  return all.filter((q) => {
    const classification = classifyQuestionCached(q);
    return classification.subjectId === targetSubjectId;
  });
}

/**
 * Get questions strictly for a specific topic within a subject.
 * Honors canonical topic IDs and legacy topic slug aliases without leaking unrelated topics.
 */
export async function getQuestionsForTopic(subjectId, topicSlug, limit = null) {
  const canonicalSub = normalizeSubjectId(subjectId);
  const subjectQuestions = await getQuestionsForSubject(canonicalSub);
  const cleanSlug = String(topicSlug || '').toLowerCase().trim();
  const canonicalSlug = resolveCanonicalTopicId(cleanSlug);

  let filtered = subjectQuestions.filter((q) => {
    const c = classifyQuestionCached(q);
    const qTopicCanonical = resolveCanonicalTopicId(c.topicId || q.topicId || '');
    return (
      c.topicId === cleanSlug ||
      c.topicId === canonicalSlug ||
      qTopicCanonical === canonicalSlug ||
      slugifyTopic(c.topicName) === cleanSlug ||
      slugifyTopic(q.subtopic) === cleanSlug ||
      String(q.subtopic || '').toLowerCase().includes(cleanSlug.replace(/-/g, ' '))
    );
  });

  // Fallback keyword search within the same subject pool if strict slug gave 0
  if (filtered.length === 0) {
    const keywords = cleanSlug.split('-').filter((k) => k.length > 3);
    if (keywords.length > 0) {
      filtered = subjectQuestions.filter((q) => {
        const text = `${getQuestionText(q)} ${q.subtopic || ''}`.toLowerCase();
        return keywords.some((k) => text.includes(k));
      });
    }
  }

  const parsedLimit = limit && limit !== 'all' ? parseInt(limit, 10) : null;
  const effectiveLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null;
  return sampleStratifiedRandomQuestions(filtered, effectiveLimit);
}

/**
 * Resolve an ordered list of saved question IDs back into formatted engine questions.
 * Used to preserve the active question set across page refreshes during an unfinished CBT test.
 */
export async function getQuestionsByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const all = await loadAllRRBQuestions();
  const byId = new Map(all.map((q) => [q.id, q]));
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
  return formatToEngineQuestions(ordered);
}

export async function getVerifiedMockStats() {
  const cached = getCachedUnifiedStats();
  if (cached) {
    return cached;
  }

  const all = await loadAllRRBQuestions();
  const statsSnapshot = computeUnifiedStats(all, getAllShifts());
  if (all.length > 0) {
    saveCachedUnifiedStats(statsSnapshot);
  }
  return statsSnapshot;
}

/**
 * Get count summary for each subject
 */
export async function getSubjectStatistics() {
  return getVerifiedMockStats();
}

/**
 * Get questions for a specific shift and optional subject
 */
export async function getQuestionsForShift(shiftNumberOrId, subject = null, options = {}) {
  const all = await loadAllRRBQuestions();
  let shiftNum = typeof shiftNumberOrId === 'number' ? shiftNumberOrId : null;
  let isGrad2026 = false;
  let isGrad2024 = false;
  let isUg = false;
  let isSsc = false;
  let isGroupD = false;
  let isAppsc = false;

  if (typeof shiftNumberOrId === 'string') {
    const sId = shiftNumberOrId.toLowerCase();
    isAppsc = sId.includes('appsc');
    isGroupD = !isAppsc && (sId.includes('group-d') || sId.includes('level-1') || sId.includes('groupd'));
    isGrad2026 = !isAppsc && !isGroupD && (sId.includes('grad-2026') || sId.includes('graduate-2026'));
    isGrad2024 = !isAppsc && !isGroupD && (sId.includes('grad-2024') || sId.includes('graduate-2024') || sId.includes('grad-2025'));
    isUg = !isAppsc && !isGroupD && (sId.includes('ug') || sId.includes('undergraduate'));
    isSsc = !isAppsc && !isGroupD && sId.includes('ssc');

    const m = shiftNumberOrId.match(/shift-(\d+)/i) || shiftNumberOrId.match(/s(\d+)/i);
    if (m) shiftNum = parseInt(m[1], 10);
  }

  const requestedStr = typeof shiftNumberOrId === 'string' ? shiftNumberOrId.toLowerCase() : '';
  let directBucketKey = null;
  if (isAppsc) {
    if (requestedStr.includes('prelims') || requestedStr.includes('2024')) {
      directBucketKey = 'appsc-group2-2024-prelims-shift-1';
    } else if (requestedStr.includes('paper1') || requestedStr.includes('paper-1') || requestedStr.includes('-p1')) {
      directBucketKey = 'appsc-group2-2025-paper1-shift-1';
    } else {
      directBucketKey = 'appsc-group2-2025-paper2-shift-1';
    }
  } else if (isGroupD && shiftNum !== null) {
    directBucketKey = `groupd-2025-shift-${shiftNum}`;
  } else if (isSsc && shiftNum !== null) {
    const year = requestedStr.includes('2026') ? '2026' : '2020';
    directBucketKey = `ssc-${year}-shift-${shiftNum}`;
  } else if (isGrad2026 && shiftNum !== null) {
    directBucketKey = `grad-2026-shift-${shiftNum}`;
  } else if (isGrad2024 && shiftNum !== null) {
    directBucketKey = `grad-2024-shift-${shiftNum}`;
  } else if (isUg && shiftNum !== null) {
    directBucketKey = `ug-2024-shift-${shiftNum}`;
  }

  const directBucket = directBucketKey ? cachedShiftQuestionsMap.get(directBucketKey) : null;
  let shiftFiltered = [];

  if (directBucket && directBucket.length > 0) {
    const overridesById = new Map(all.map((q) => [q.id, q]));
    shiftFiltered = directBucket.map((q) => overridesById.get(q.id) || q);
  } else {
    shiftFiltered = all.filter((q) => {
      if (isAppsc) {
        if (q.examType !== 'APPSC Group II' && !String(q.id).includes('appsc')) return false;
        const isPrelimsReq = requestedStr.includes('prelims') || requestedStr.includes('2024');
        const isP1Req = requestedStr.includes('paper1') || requestedStr.includes('paper-1') || requestedStr.includes('-p1');
        const isP2Req = requestedStr.includes('paper2') || requestedStr.includes('paper-2') || requestedStr.includes('-p2');
        const isQPrelims2024 =
          q.paperNumber === 0 ||
          q.examYear === '2024' ||
          String(q.id).includes('2024-prelims') ||
          String(q.examName || '').toLowerCase().includes('prelims');
        const isQPaper1 =
          !isQPrelims2024 &&
          (q.paperNumber === 1 || String(q.id).includes('-p1-') || String(q.examName || '').includes('Paper-1'));
        if (isPrelimsReq) return isQPrelims2024;
        if (isP1Req) return isQPaper1;
        if (isP2Req) return !isQPrelims2024 && !isQPaper1;
      } else if (isGroupD) {
        if (q.examType !== 'RRB Group D' && !String(q.id).includes('rrb-group-d')) return false;
      } else if (isGrad2026) {
        if (q.examYear !== '2026' && !String(q.id).includes('grad-2026')) return false;
      } else if (isGrad2024) {
        if ((q.examYear !== '2024' && !String(q.id).includes('grad-2024') && !String(q.id).includes('grad-2025')) || q.examYear === '2026') return false;
      } else if (isUg) {
        if (q.examLevel !== 'Under Graduate' && !String(q.id).includes('ug-2024') && !String(q.id).includes('ug-2025')) return false;
      } else if (isSsc) {
        if (q.examType !== 'SSC CGL' && !String(q.id).includes('ssc')) return false;
      }

      if (shiftNum !== null && !isAppsc) {
        const matchShift = q.shiftNumber === shiftNum || q.setNumber === shiftNum;
        if (!matchShift) return false;
      }
      return true;
    });
  }

  // Strictly sort official paper questions by original order (1..N)
  shiftFiltered = [...shiftFiltered].sort(
    (a, b) => (a.originalOrder || a.questionNumber || 0) - (b.originalOrder || b.questionNumber || 0)
  );

  // Exclude broken empty PDF placeholders during CBT playback unless Admin explicitly requests all raw rows
  if (!options?.includeIncomplete) {
    shiftFiltered = shiftFiltered.filter(
      (q) => getQuestionText(q).length >= 2 && getOptionTexts(q).filter((o) => o.length > 0).length >= 2
    );
  }

  if (!subject || subject === 'All' || subject === 'all' || subject === 'full') {
    return shiftFiltered;
  }

  const targetSubjectId = normalizeSubjectId(subject);
  return shiftFiltered.filter((q) => classifyQuestionCached(q).subjectId === targetSubjectId);
}

function formatToEngineQuestions(questions) {
  return questions.map((q, idx) => {
    const c = classifyQuestionCached(q);
    let sectionName = 'General Awareness';
    if (c.subjectId === 'quantitative-aptitude') {
      sectionName = 'Quantitative Aptitude';
    } else if (c.subjectId === 'reasoning') {
      sectionName = 'General Intelligence & Reasoning';
    } else if (c.subjectId === 'english-language') {
      sectionName = 'English Comprehension';
    } else if (c.subjectId === 'computer-science') {
      sectionName = 'Computer Awareness';
    } else if (c.subjectId === 'general-science') {
      sectionName = 'General Science';
    } else {
      sectionName = 'General Awareness';
    }

    const safeQEn = typeof q.question === 'string'
      ? q.question.trim()
      : (typeof q.question?.en === 'string'
          ? q.question.en.trim()
          : (typeof q.question?.te === 'string' ? q.question.te.trim() : ''));

    const safeQTe = typeof q.question?.te === 'string'
      ? q.question.te.trim()
      : (typeof q.questionTe === 'string' ? q.questionTe.trim() : '');

    const optA = typeof q.options?.en?.[0] === 'string'
      ? q.options.en[0]
      : (typeof q.options?.A === 'string' ? q.options.A : (typeof q.options?.[0] === 'string' ? q.options[0] : ''));
    const optB = typeof q.options?.en?.[1] === 'string'
      ? q.options.en[1]
      : (typeof q.options?.B === 'string' ? q.options.B : (typeof q.options?.[1] === 'string' ? q.options[1] : ''));
    const optC = typeof q.options?.en?.[2] === 'string'
      ? q.options.en[2]
      : (typeof q.options?.C === 'string' ? q.options.C : (typeof q.options?.[2] === 'string' ? q.options[2] : ''));
    const optD = typeof q.options?.en?.[3] === 'string'
      ? q.options.en[3]
      : (typeof q.options?.D === 'string' ? q.options.D : (typeof q.options?.[3] === 'string' ? q.options[3] : ''));

    let correctLetter = 'A';
    if (q.correctAnswer === 0 || q.correctAnswer === 'A' || q.correctLetter === 'A') correctLetter = 'A';
    else if (q.correctAnswer === 1 || q.correctAnswer === 'B' || q.correctLetter === 'B') correctLetter = 'B';
    else if (q.correctAnswer === 2 || q.correctAnswer === 'C' || q.correctLetter === 'C') correctLetter = 'C';
    else if (q.correctAnswer === 3 || q.correctAnswer === 'D' || q.correctLetter === 'D') correctLetter = 'D';
    else if (['A', 'B', 'C', 'D'].includes(String(q.correctAnswer).toUpperCase())) {
      correctLetter = String(q.correctAnswer).toUpperCase();
    }

    const safeExpEn = typeof q.explanation === 'string'
      ? q.explanation.trim()
      : (typeof q.explanation?.en === 'string'
          ? q.explanation.en.trim()
          : `Official answer is Option (${correctLetter}). Preserved from official examination key.`);

    const resolvedYear = deriveQuestionExamYear(q);
    const paperInfo = getFallbackPaperInfo(q);

    return {
      id: q.id,
      number: idx + 1,
      originalNumber: q.questionNumber || idx + 1,
      question: safeQEn,
      questionTe: safeQTe,
      options: {
        A: optA,
        B: optB,
        C: optC,
        D: optD
      },
      optionsTe: {
        A: q.options?.te?.[0] || q.optionsTe?.A || '',
        B: q.options?.te?.[1] || q.optionsTe?.B || '',
        C: q.options?.te?.[2] || q.optionsTe?.C || '',
        D: q.options?.te?.[3] || q.optionsTe?.D || ''
      },
      correctAnswer: correctLetter,
      explanation: safeExpEn,
      explanationTe: q.explanation?.te || '',
      examName: q.examName || 'Official CBT Paper',
      examYear: resolvedYear,
      examType: q.examType || '',
      examLevel: q.examLevel || '',
      examLevelLabel: q.examLevelLabel || '',
      shiftNumber: q.shiftNumber || null,
      shift: q.shiftNumber ? `Shift ${q.shiftNumber}` : 'Official Question Bank',
      examDate: q.examDate,
      shiftTiming: q.shiftTiming,
      sectionName: q.sectionName || sectionName,
      subject: c.subjectName,
      subjectId: c.subjectId,
      topic: c.topicName,
      topicId: c.topicId,
      subtopic: q.subtopic || c.topicName,
      verificationStatus: q.status === 'Published' || q.verificationStatus === 'VERIFIED' ? 'VERIFIED' : 'UNVERIFIED',
      source: q.source || 'Official Answer Key',
      paperUrl: paperInfo.paperUrl,
      paperFileName: paperInfo.paperFileName,
      imageUrl: q.imageUrl || '',
      marksPerQuestion: q.marksPerQuestion ?? null,
      negativeMarkingPerQuestion: q.negativeMarkingPerQuestion ?? null,
      provenance: q.provenance || extractProvenance(q),
      originalOrder: q.originalOrder || q.questionNumber || idx + 1,
      classificationConfidence: q.classificationConfidence ?? c.confidence ?? 90,
      classificationTier: q.classificationTier || c.confidenceTier || 'HIGH',
      classificationStatus: q.classificationStatus || c.classificationStatus || 'AUTO_VERIFIED',
      qualityFlags: Array.isArray(q.qualityFlags) ? q.qualityFlags : (c.qualityFlags || []),
      eligibleExams: Array.isArray(q.eligibleExams) ? q.eligibleExams : (c.eligibleExams || []),
      suggestedClassification: q.suggestedClassification || null,
      classificationHistory: Array.isArray(q.classificationHistory) ? q.classificationHistory : [],
      duplicateGroupId: q.duplicateGroupId || null
    };
  });
}

function pickSectionStratified(primaryPool, fallbackPool, count, sectionName, alreadyPickedIds) {
  const safePrimary = primaryPool.filter((q) => q && !alreadyPickedIds.has(q.id));
  let chosen = sampleStratifiedRandomQuestions(safePrimary, count);
  chosen.forEach((q) => alreadyPickedIds.add(q.id));

  if (chosen.length < count && Array.isArray(fallbackPool) && fallbackPool.length > 0) {
    const remainingNeeded = count - chosen.length;
    const safeFallback = fallbackPool.filter((q) => q && !alreadyPickedIds.has(q.id));
    const extras = sampleStratifiedRandomQuestions(safeFallback, remainingNeeded);
    extras.forEach((q) => alreadyPickedIds.add(q.id));
    chosen = [...chosen, ...extras];
  }

  return chosen.map((q) => ({ ...q, sectionName }));
}

/**
 * Generate a user-configured Custom Mock Test from URL search parameters.
 */
export async function generateCustomMockTest(params = {}) {
  const allQuestions = await loadAllRRBQuestions();
  const examStageId = params.examStage || 'all';
  const subjectIds = String(params.subjects || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const topicIds = String(params.topics || '')
    .split(',')
    .map((s) => resolveCanonicalTopicId(s.trim()))
    .filter(Boolean);
  const difficulty = params.difficulty || 'All';
  const count = params.count === 'all' ? 'all' : Math.max(5, Math.min(200, parseInt(params.count || '30', 10) || 30));
  const questionType = params.questionType || 'ALL';
  const negOverride = params.negMarking !== undefined && params.negMarking !== '' ? String(params.negMarking) : 'official';

  const result = generateCustomOrPracticeMock(allQuestions, {
    examStageId,
    subjectIds,
    topicIds,
    difficulty,
    questionType,
    count,
    sortOrder: 'stratified'
  });

  const stageResolved = examStageId && examStageId !== 'all' ? getExamStageConfig(examStageId) : null;
  const subjectNameById = Object.fromEntries(CANONICAL_SUBJECTS.map((s) => [s.id, s.name]));

  const defaultMarksPerQ = stageResolved?.stage?.marksPerQuestion || (subjectIds.length === 1 && subjectIds[0] === 'english-language' ? 2 : 1);
  const defaultNegRate =
    negOverride === 'none' || negOverride === '0'
      ? 0
      : stageResolved?.stage?.negativeMarking ?? (subjectIds.length === 1 && subjectIds[0] === 'english-language' ? 0.5 : 0.33);

  const sectionCountsMap = new Map();

  const tagged = result.questions.map((q) => {
    const cls = classifyQuestionCached(q);
    const canonicalSecName = subjectNameById[cls.subjectId] || cls.subjectName || 'General Knowledge';

    let qMarks = defaultMarksPerQ;
    let qNeg = defaultNegRate;
    if (stageResolved?.stage?.sections && negOverride !== 'none' && negOverride !== '0') {
      const matchedSection = stageResolved.stage.sections.find((sec) =>
        Array.isArray(sec.subjectIds) && sec.subjectIds.includes(cls.subjectId)
      );
      if (matchedSection) {
        qMarks = matchedSection.marksPerQuestion ?? defaultMarksPerQ;
        qNeg = matchedSection.negativeMarking ?? defaultNegRate;
      }
    }

    if (!sectionCountsMap.has(canonicalSecName)) {
      sectionCountsMap.set(canonicalSecName, {
        name: canonicalSecName,
        count: 0,
        marksPerQuestion: qMarks,
        negativeMarking: qNeg
      });
    }
    sectionCountsMap.get(canonicalSecName).count += 1;

    return {
      ...q,
      sectionName: canonicalSecName,
      marksPerQuestion: qMarks,
      negativeMarkingPerQuestion: qNeg
    };
  });

  const engineQuestions = formatToEngineQuestions(tagged);
  const examSummary = summarizeIncludedExams(engineQuestions);
  const parsedDuration = parseInt(params.duration || '', 10);
  const duration =
    Number.isFinite(parsedDuration) && parsedDuration >= 5
      ? Math.min(180, parsedDuration)
      : Math.max(10, Math.min(180, engineQuestions.length || 30));

  const readableSubjects =
    subjectIds.length > 0
      ? subjectIds.map((id) => subjectNameById[id] || id).join(', ')
      : 'All Canonical Subjects';

  const totalMarks = engineQuestions.reduce(
    (sum, q) => sum + (q.marksPerQuestion ?? defaultMarksPerQ),
    0
  );

  return {
    meta: {
      id: 'custom',
      code: 'CUSTOM-CBT',
      title: stageResolved
        ? `${stageResolved.exam.shortName} (${stageResolved.stage.shortName}) – Custom Mock`
        : 'Custom Practice Mock Test',
      subtitle: `${engineQuestions.length} Qs · ${readableSubjects} · ${difficulty} Difficulty${result.difficultyFallbackUsed ? ' (mixed top-up applied)' : ''}`,
      examName: stageResolved ? stageResolved.exam.shortName : examSummary.examsSummaryText,
      examYear: examSummary.yearsText,
      includedExams: examSummary.includedExams,
      yearsList: examSummary.yearsList,
      subjectLabel: readableSubjects,
      targetSubject: subjectIds[0] || 'all',
      questionsCount: engineQuestions.length,
      timeMinutes: duration,
      marksPerQuestion: defaultMarksPerQ,
      marks: totalMarks,
      negativeMarking: defaultNegRate,
      sections: Array.from(sectionCountsMap.values()),
      pdfUrl: '',
      pdfFileName: '',
      subjectTest: subjectIds.length === 1,
      isRandomizedPool: true,
      shortfalls: result.shortfall > 0 ? [{ section: 'Custom Selection', requested: result.requestedCount, available: engineQuestions.length }] : []
    },
    questions: engineQuestions
  };
}

/**
 * Build Engine-compatible test object
 */
export async function getEngineMockTest(testId, subjectParam = null, limitParam = null, customQuery = null) {
  if (testId === 'custom' && customQuery) {
    return generateCustomMockTest(customQuery);
  }
  const shifts = getAllShifts();
  const allQuestions = await loadAllRRBQuestions();

  const rawParsedLimit = limitParam && limitParam !== 'all' ? parseInt(limitParam, 10) : null;
  const parsedLimitNum = Number.isFinite(rawParsedLimit) && rawParsedLimit > 0 ? rawParsedLimit : null;

  // 1. Topic-Wise Mock Tests: e.g. "topic-general-knowledge-indian-polity"
  if (testId.startsWith('topic-')) {
    const rest = testId.slice('topic-'.length);
    const knownSubjects = [
      'general-knowledge',
      'quantitative-aptitude',
      'reasoning',
      'general-science',
      'computer-science',
      'english-language',
      'current-affairs'
    ];
    const matchedSubjectId = knownSubjects.find((s) => rest === s || rest.startsWith(`${s}-`)) || 'general-knowledge';
    const topicSlug = rest.slice(matchedSubjectId.length + 1) || rest;

    const targetSubjectName = SUBJECT_TOPIC_TAXONOMY[matchedSubjectId]?.title || 'Subject';
    const topicMeta = SUBJECT_TOPIC_TAXONOMY[matchedSubjectId]?.topics.find((t) => t.id === topicSlug);
    const topicTitle = topicMeta ? topicMeta.name : titleCaseTopic(topicSlug);

    const topicQuestions = await getQuestionsForTopic(matchedSubjectId, topicSlug, parsedLimitNum);
    const isEnglish = matchedSubjectId === 'english-language';
    const isSSC = isEnglish;
    const duration = Math.max(5, Math.min(120, Math.round(topicQuestions.length * (isSSC ? 0.75 : 1))));

    const engineQuestions = formatToEngineQuestions(topicQuestions);
    const examSummary = summarizeIncludedExams(engineQuestions);

    return {
      meta: {
        id: testId,
        code: `TOPIC-${matchedSubjectId.slice(0, 3).toUpperCase()}`,
        title: `${targetSubjectName} – ${topicTitle}`,
        subtitle: `Randomly sampled across ${examSummary.examsSummaryText}`,
        examName: examSummary.examsSummaryText,
        examYear: examSummary.yearsText,
        includedExams: examSummary.includedExams,
        yearsList: examSummary.yearsList,
        subjectLabel: targetSubjectName,
        targetSubject: matchedSubjectId,
        topicName: topicTitle,
        topicId: topicSlug,
        questionsCount: engineQuestions.length,
        timeMinutes: duration,
        marks: isSSC ? engineQuestions.length * 2 : engineQuestions.length,
        negativeMarking: isSSC ? 0.5 : 0.33,
        pdfUrl: '',
        pdfFileName: '',
        subjectTest: true,
        isRandomizedPool: true
      },
      questions: engineQuestions
    };
  }

  // 2. Full Mock Tests by Exam Pattern (using official EXAM_HIERARCHY & eligibleExams) or Subject:
  const isOfficialExamFullMock =
    testId.startsWith('rrb-group-d-cbt1-mock-') ||
    testId.startsWith('rrb-group-d-mock-') ||
    testId.startsWith('rrb-ntpc-cbt1-mock-') ||
    testId.startsWith('rrb-ntpc-ug-cbt1-mock-') ||
    testId.startsWith('rrb-ntpc-ug-cbt2-mock-') ||
    testId.startsWith('rrb-ntpc-grad-cbt1-mock-') ||
    testId.startsWith('rrb-ntpc-grad-cbt2-mock-') ||
    testId.startsWith('full-cbt-') ||
    testId === 'rrb-ntpc-cbt1-full-01' ||
    testId === 'rrb-ntpc-cbt1-full-02' ||
    testId.startsWith('ssc-cgl-tier1-mock-') ||
    testId.startsWith('ssc-cgl-tier2-mock-') ||
    testId === 'ssc-cgl-full-mock-01' ||
    testId.startsWith('ssc-chsl-tier1-mock-') ||
    testId.startsWith('ssc-chsl-tier2-mock-') ||
    testId.startsWith('ssc-mts-tier1-mock-') ||
    testId.startsWith('ssc-mts-mock-') ||
    testId.startsWith('appsc-group2-prelims-mock-') ||
    testId.startsWith('appsc-group2-mains-p1-mock-') ||
    testId.startsWith('appsc-group2-mains-p2-mock-');

  if (
    isOfficialExamFullMock ||
    testId.startsWith('subject-') ||
    testId.startsWith('sec-') ||
    testId.startsWith('unified-') ||
    testId.startsWith('ca-mock-')
  ) {
    let mockNum = 1;
    const numMatch = testId.match(/-(\d+)$/);
    if (numMatch) mockNum = parseInt(numMatch[1], 10);

    if (isOfficialExamFullMock) {
      const stageResolved = getExamStageConfig(testId);
      const targetStageId = stageResolved?.stage?.stageId || 'rrb-ntpc-ug-cbt1';
      const generated = generateOfficialFullMock(allQuestions, targetStageId, {
        variantIndex: Math.max(0, mockNum - 1)
      });
      const engineQuestions = formatToEngineQuestions(generated.questions);
      const examSummary = summarizeIncludedExams(engineQuestions);

      return {
        meta: {
          id: testId,
          code: `${targetStageId.toUpperCase()}-M${mockNum.toString().padStart(2, '0')}`,
          title: `${generated.meta.examName} ${generated.meta.stageName} Full Mock – ${mockNum.toString().padStart(2, '0')}`,
          subtitle: `${stageResolved?.stage?.sections.map((s) => `${s.count} ${s.name.split(':')[0]}`).join(' · ')}`,
          examName: `${generated.meta.examName} (${generated.meta.stageName})`,
          examYear: examSummary.yearsText,
          includedExams: examSummary.includedExams,
          yearsList: examSummary.yearsList,
          subjectLabel: `All Sections (${engineQuestions.length} Qs)`,
          targetSubject: 'full',
          questionsCount: engineQuestions.length,
          timeMinutes: generated.meta.timeMinutes,
          marksPerQuestion: generated.meta.marksPerQuestion,
          marks: generated.meta.totalMarks,
          negativeMarking: generated.meta.negativeMarking,
          sections: generated.meta.sections,
          shortfalls: generated.shortfalls,
          note: stageResolved?.stage?.note || '',
          pdfUrl: '',
          pdfFileName: '',
          subjectTest: false,
          isRandomizedPool: true
        },
        questions: engineQuestions
      };
    }

    // Monthly Current Affairs Compendium Tests (ca-mock-01 .. ca-mock-06)
    if (testId.startsWith('ca-mock-') && Array.isArray(MOCK_QUESTIONS_DATABASE?.[testId]) && MOCK_QUESTIONS_DATABASE[testId].length > 0) {
      const caRaw = shuffleArray(MOCK_QUESTIONS_DATABASE[testId]).map((caQ) => ({
        id: caQ.id,
        questionNumber: caQ.qNumber,
        question: { en: caQ.question, te: '' },
        options: {
          en: [caQ.options?.A || '', caQ.options?.B || '', caQ.options?.C || '', caQ.options?.D || ''],
          te: []
        },
        correctAnswer: ['A', 'B', 'C', 'D'].indexOf(caQ.correctAnswer) >= 0 ? ['A', 'B', 'C', 'D'].indexOf(caQ.correctAnswer) : 0,
        correctLetter: caQ.correctAnswer || 'A',
        explanation: { en: caQ.explanation || '', te: '' },
        subject: 'Current Affairs',
        subjectId: 'current-affairs',
        categoryId: 'ca',
        subtopic: caQ.topic || 'National & International Current Affairs',
        difficulty: caQ.difficulty || 'Medium',
        status: 'Published',
        verificationStatus: 'VERIFIED',
        examName: 'Current Affairs 2025-2026',
        examYear: String(caQ.id || '').startsWith('jan26-') ? '2026' : '2025',
        source: 'ExamQuestHub Monthly Current Affairs Compendium'
      }));
      const engineQuestions = formatToEngineQuestions(parsedLimitNum ? caRaw.slice(0, parsedLimitNum) : caRaw);
      const examSummary = summarizeIncludedExams(engineQuestions);
      return {
        meta: {
          id: testId,
          code: 'MOCK-CA',
          title: 'Current Affairs – Official Compendium Mock',
          subtitle: `Curated Monthly Current Affairs (${examSummary.yearsText})`,
          examName: examSummary.examsSummaryText,
          examYear: examSummary.yearsText,
          includedExams: examSummary.includedExams,
          yearsList: examSummary.yearsList,
          subjectLabel: 'Current Affairs',
          targetSubject: 'current-affairs',
          questionsCount: engineQuestions.length,
          timeMinutes: Math.max(15, Math.min(90, engineQuestions.length)),
          marks: engineQuestions.length,
          negativeMarking: 0.33,
          pdfUrl: '',
          pdfFileName: '',
          subjectTest: true,
          isRandomizedPool: true
        },
        questions: engineQuestions
      };
    }

    // Subject Full Mocks & Sectionals
    let subject = subjectParam;
    let title = 'Subject Master Mock Test';
    let targetCount = 100;
    let duration = 90;
    let canonicalSub = 'all';

    if (
      testId.includes('general-knowledge') ||
      testId.includes('subject-gk') ||
      testId.includes('sec-gk') ||
      subject === 'general-knowledge' ||
      subject === 'General Knowledge' ||
      subject === 'gk'
    ) {
      canonicalSub = 'general-knowledge';
      subject = 'General Knowledge';
      title = 'General Knowledge – Comprehensive Full Mock';
    } else if (
      testId.includes('quantitative-aptitude') ||
      testId.includes('subject-quant') ||
      testId.includes('sec-quant') ||
      subject === 'quantitative-aptitude' ||
      subject === 'Quantitative Aptitude' ||
      subject === 'quant'
    ) {
      canonicalSub = 'quantitative-aptitude';
      subject = 'Quantitative Aptitude';
      title = 'Quantitative Aptitude – Comprehensive Full Mock';
    } else if (
      testId.includes('reasoning') ||
      testId.includes('subject-reasoning') ||
      testId.includes('sec-reasoning') ||
      subject === 'reasoning' ||
      subject === 'Reasoning'
    ) {
      canonicalSub = 'reasoning';
      subject = 'Reasoning';
      title = 'Reasoning & Mental Ability – Comprehensive Full Mock';
    } else if (
      testId.includes('english-language') ||
      testId.includes('subject-english') ||
      testId.includes('sec-english') ||
      subject === 'english-language' ||
      subject === 'English Language' ||
      subject === 'english'
    ) {
      canonicalSub = 'english-language';
      subject = 'English Language';
      title = 'English Language – Comprehensive Full Mock';
    } else if (
      testId.includes('computer-science') ||
      testId.includes('subject-computer') ||
      testId.includes('sec-computer') ||
      subject === 'computer-science' ||
      subject === 'Computer Science' ||
      subject === 'computer' ||
      subject === 'cse'
    ) {
      canonicalSub = 'computer-science';
      subject = 'Computer Science';
      title = 'Computer Science – Comprehensive Full Mock';
    } else if (
      testId.includes('general-science') ||
      testId.includes('subject-science') ||
      testId.includes('sec-science') ||
      subject === 'general-science' ||
      subject === 'General Science' ||
      subject === 'science'
    ) {
      canonicalSub = 'general-science';
      subject = 'General Science';
      title = 'General Science – Comprehensive Full Mock';
    } else if (
      testId.includes('current-affairs') ||
      testId.includes('ca-mock') ||
      testId.includes('sec-ca') ||
      subject === 'current-affairs' ||
      subject === 'Current Affairs' ||
      subject === 'ca'
    ) {
      canonicalSub = 'current-affairs';
      subject = 'Current Affairs';
      title = 'Current Affairs 2025–2026 – Full Mega Mock';
    }

    if (parsedLimitNum) {
      targetCount = parsedLimitNum;
      duration = Math.max(10, Math.min(120, targetCount));
    } else if (testId === 'sec-gk-01') {
      targetCount = 40;
      duration = 30;
      title = `${subject} – Comprehensive Sectional Mock (40 Qs)`;
    } else if (testId === 'sec-quant-01' || testId === 'sec-reasoning-01') {
      targetCount = 30;
      duration = 30;
      title = `${subject} – CBT Sectional Mock (30 Qs)`;
    } else if (testId === 'sec-english-01' || testId === 'sec-science-01' || testId === 'sec-ca-01' || testId === 'sec-computer-01') {
      targetCount = 25;
      duration = 20;
      title = `${subject} – High Yield Speed Drill (25 Qs)`;
    } else if (testId.includes('30q') || testId.includes('-30') || testId.includes('30-q')) {
      targetCount = 30;
      duration = 30;
      title = `${subject} – 30 Questions Practice Mock`;
    } else if (testId.includes('speed') || testId.includes('25q') || testId.includes('quick')) {
      targetCount = 25;
      duration = 25;
      title = `${subject} – Speed Drill Mock (25 Qs)`;
    } else if (testId.includes('sectional') || testId.includes('50q') || testId.includes('sec-')) {
      targetCount = 50;
      duration = 45;
      title = `${subject} – Sectional CBT Drill (50 Qs)`;
    } else if (testId.includes('pyq-master') || testId.includes('mixed') || testId.includes('100q')) {
      targetCount = 100;
      duration = 90;
      title = `${subject} – Previous Year Master Mock (100 Qs)`;
    } else {
      targetCount = 30;
      duration = 30;
    }

    let picked = [];
    if (canonicalSub === 'all' || subject === 'full') {
      const playableAll = allQuestions.filter(isPlayableQuestion);
      const usedIds = new Set();
      picked = [
        ...pickSectionStratified(playableAll.filter((q) => classifyQuestionCached(q).subjectId === 'quantitative-aptitude'), null, 30, 'Quantitative Aptitude', usedIds),
        ...pickSectionStratified(playableAll.filter((q) => classifyQuestionCached(q).subjectId === 'reasoning'), null, 30, 'General Intelligence & Reasoning', usedIds),
        ...pickSectionStratified(playableAll.filter((q) => ['general-knowledge', 'current-affairs'].includes(classifyQuestionCached(q).subjectId)), null, 30, 'General Awareness', usedIds),
        ...pickSectionStratified(playableAll.filter((q) => classifyQuestionCached(q).subjectId === 'general-science'), null, 10, 'General Science', usedIds)
      ];
    } else {
      const subjectPool = await getQuestionsForSubject(canonicalSub);
      const count = limitParam === 'all' ? subjectPool.length : Math.min(targetCount, subjectPool.length);
      picked = sampleStratifiedRandomQuestions(subjectPool, limitParam === 'all' ? null : count);
    }

    const isEnglish = canonicalSub === 'english-language';
    const marksPerQ = isEnglish ? 2 : 1;
    const negRate = isEnglish ? 0.5 : 0.33;
    const taggedPicked = picked.map((q) => ({
      ...q,
      marksPerQuestion: marksPerQ,
      negativeMarkingPerQuestion: negRate
    }));
    const engineQuestions = formatToEngineQuestions(taggedPicked);
    const examSummary = summarizeIncludedExams(engineQuestions);

    return {
      meta: {
        id: testId,
        code: `MOCK-${(canonicalSub || 'CBT').slice(0, 4).toUpperCase()}`,
        title,
        subtitle: `Randomly sampled PYQs across ${examSummary.examsSummaryText}`,
        examName: examSummary.examsSummaryText,
        examYear: examSummary.yearsText,
        includedExams: examSummary.includedExams,
        yearsList: examSummary.yearsList,
        subjectLabel: subject === 'full' ? 'All Subjects' : subject,
        targetSubject: canonicalSub,
        questionsCount: engineQuestions.length,
        timeMinutes: duration,
        marks: isEnglish ? engineQuestions.length * 2 : engineQuestions.length,
        negativeMarking: isEnglish ? 0.5 : 0.33,
        pdfUrl: '',
        pdfFileName: '',
        subjectTest: subject !== 'full',
        isRandomizedPool: true
      },
      questions: engineQuestions
    };
  }

  // 3. Category & Subject Mock Tests: e.g. "cse--operating-systems--pyq", "quant--number-system--pyq"
  if (testId.includes('--')) {
    const parts = testId.split('--');
    const knownCategories = ['cse', 'quant', 'reasoning', 'gk', 'english', 'ca', 'science'];
    if (knownCategories.includes(parts[0].toLowerCase())) {
      const categoryId = parts[0].toLowerCase();
      const subSubjectId = parts[1] || '';
      const testTypeId = (parts[2] || 'PYQ').toUpperCase();

      const canonicalSub = normalizeSubjectId(subSubjectId || categoryId);
      const categoryMeta = MOCK_CATEGORIES.find((c) => c.id === categoryId);
      const subjectMeta = categoryMeta?.subjects?.find((s) => s.id === subSubjectId);
      const subjectDisplayName = subjectMeta?.name || categoryMeta?.name || 'Subject Mock Test';

      let targetCount = 30;
      if (parsedLimitNum) {
        targetCount = parsedLimitNum;
      } else if (testId.includes('25q')) {
        targetCount = 25;
      } else if (testId.includes('50q')) {
        targetCount = 50;
      }

      // Fetch playable questions strictly belonging to this subject & topic pool (NO cross-topic leakage)
      const subjectQuestions = await getQuestionsForSubject(canonicalSub);
      const canonicalTopicTarget = resolveCanonicalTopicId(subSubjectId);

      let topicMatched = subjectQuestions.filter((q) => {
        const c = classifyQuestionCached(q);
        const qTopicCanonical = resolveCanonicalTopicId(c.topicId || q.topicId || '');
        if (canonicalSub === 'general-science' || canonicalSub === 'current-affairs') {
          return c.subjectId === canonicalSub;
        }
        return (
          c.topicId === subSubjectId ||
          qTopicCanonical === canonicalTopicTarget ||
          slugifyTopic(c.topicName) === subSubjectId
        );
      });

      // Prefer verified PYQ records when PYQ test type is requested
      if (testTypeId === 'PYQ') {
        const pyqTopicOnly = topicMatched.filter((q) => q.examName && deriveQuestionExamYear(q));
        if (pyqTopicOnly.length > 0) topicMatched = pyqTopicOnly;
      }

      const effectiveLimit = limitParam === 'all' ? null : targetCount;
      const finalQuestions = sampleStratifiedRandomQuestions(topicMatched, effectiveLimit);
      const isEnglish = canonicalSub === 'english-language';
      const marksPerQ = isEnglish ? 2 : 1;
      const negRate = isEnglish ? 0.5 : 0.33;

      const engineQuestions = formatToEngineQuestions(
        finalQuestions.map((q) => ({
          ...q,
          marksPerQuestion: marksPerQ,
          negativeMarkingPerQuestion: negRate
        }))
      );
      const examSummary = summarizeIncludedExams(engineQuestions);
      const duration = Math.max(10, Math.min(120, engineQuestions.length));

      return {
        meta: {
          id: testId,
          code: `${categoryId.toUpperCase()}-${testTypeId}`,
          title: `${subjectDisplayName} – ${testTypeId} Mock Test`,
          subtitle: `Strictly filtered (${topicMatched.length} available) across ${examSummary.examsSummaryText}`,
          examName: examSummary.examsSummaryText,
          examYear: examSummary.yearsText,
          includedExams: examSummary.includedExams,
          yearsList: examSummary.yearsList,
          subjectLabel: subjectDisplayName,
          targetSubject: canonicalSub,
          questionsCount: engineQuestions.length,
          timeMinutes: duration,
          marksPerQuestion: marksPerQ,
          marks: engineQuestions.length * marksPerQ,
          negativeMarking: negRate,
          pdfUrl: '',
          pdfFileName: '',
          subjectTest: true,
          isRandomizedPool: true
        },
        questions: engineQuestions
      };
    }
  }

  // 4. Shift / PYQ Resolution: e.g. "rrb-ntpc-ug-2024-shift-1", "ssc-cgl-2020-shift-1", etc.
  let shiftId = testId;
  let targetSubject = subjectParam;

  if (testId.includes('--')) {
    const parts = testId.split('--');
    shiftId = parts[0];
    targetSubject = parts[1];
  }

  const shift = shifts.find((s) => s.id === shiftId || s.code.toLowerCase() === shiftId.toLowerCase()) || shifts[0];
  const questions = await getQuestionsForShift(shift?.id || shift?.shiftNumber || 1, targetSubject);

  let subjectLabel = 'Full Shift CBT (All Subjects)';
  if (targetSubject && targetSubject !== 'full') {
    const foundSub = RRB_CORE_SUBJECTS.find((s) => s.id === targetSubject || s.title.toLowerCase() === targetSubject.toLowerCase());
    subjectLabel = foundSub ? foundSub.title : targetSubject;
  }

  const isFull = !targetSubject || targetSubject === 'full' || questions.length >= 70;
  const duration = isFull ? (shift?.durationMinutes || 90) : Math.max(15, questions.length);

  const isAppsc = shift?.examType === 'APPSC Group II' || String(shift?.id || '').includes('appsc');
  const isGroupD = !isAppsc && (shift?.examType === 'RRB Group D' || String(shift?.id || '').includes('group-d') || String(shift?.id || '').includes('level-1'));
  const isGrad2026 = !isAppsc && !isGroupD && (shift?.examYear === '2026' || String(shift?.id || '').includes('grad-2026'));
  const isGrad2024 = !isAppsc && !isGroupD && (shift?.examLevel === 'Graduate' || String(shift?.id || '').includes('grad')) && !isGrad2026;
  const isSsc = !isAppsc && !isGroupD && (shift?.examType === 'SSC CGL' || String(shift?.id || '').includes('ssc'));

  const isAppscPrelims2024 = isAppsc && (
    shift?.paperNumber === 0 ||
    shift?.examYear === '2024' ||
    String(shift?.id || '').toLowerCase().includes('prelims') ||
    String(testId || '').toLowerCase().includes('prelims') ||
    String(shift?.id || '').toLowerCase().includes('2024') ||
    String(testId || '').toLowerCase().includes('2024')
  );
  const isAppscPaper1 = isAppsc && !isAppscPrelims2024 && (
    shift?.paperNumber === 1 ||
    String(shift?.id || '').toLowerCase().includes('paper1') ||
    String(testId || '').toLowerCase().includes('paper1')
  );

  let defaultPdfUrl = '/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf';
  let defaultPdfFileName = 'RRB-NTPC-UG-2025-EN-All-Papers.pdf';

  if (isAppscPrelims2024) {
    defaultPdfUrl = '/assets/aistudio/APPSC-Group-II-Preliminary-Exam-Official-Paper-Held-On_-25-Feb-2024_3a12a02d.pdf';
    defaultPdfFileName = 'APPSC-Group-II-Preliminary-Exam-Official-Paper-Held-On_-25-Feb-2024.pdf';
  } else if (isAppscPaper1) {
    defaultPdfUrl = '/assets/aistudio/Group-2-_-Prelims-Exam-Question-Paper-1-2025_copy_0f4dabbf.pdf';
    defaultPdfFileName = 'Group-2-_-Prelims-Exam-Question-Paper-1-2025.pdf';
  } else if (isAppsc) {
    defaultPdfUrl = '/assets/aistudio/Group-2-_-Prelims-Exam-Question-Paper-2-2025_copy_f6e37955.pdf';
    defaultPdfFileName = 'Group-2-_-Prelims-Exam-Question-Paper-2-2025.pdf';
  } else if (isGroupD) {
    defaultPdfUrl = '/assets/aistudio/RRB-Group-D-2025-EN-All-Sections_dece0c81.pdf';
    defaultPdfFileName = 'RRB-Group-D-2025-EN-All-Sections.pdf';
  } else if (isGrad2026) {
    defaultPdfUrl = '/assets/aistudio/RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key.pdf';
    defaultPdfFileName = 'RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key.pdf';
  } else if (isGrad2024) {
    defaultPdfUrl = '/assets/aistudio/RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key_887400b5.pdf';
    defaultPdfFileName = 'RRB-NTPC-Graduate-2024-CBT1-Official-Answer-Key.pdf';
  } else if (isSsc) {
    defaultPdfUrl = '/assets/aistudio/SSC_CGL_2020_All_21_Sets_English.pdf';
    defaultPdfFileName = 'SSC_CGL_2020_All_21_Sets_English.pdf';
  }

  const engineQuestions = formatToEngineQuestions(
    questions.map((q) => ({
      ...q,
      marksPerQuestion: q.marksPerQuestion ?? (isSsc ? 2 : 1),
      negativeMarkingPerQuestion: q.negativeMarkingPerQuestion ?? (shift?.negativeMarking || (isSsc ? 0.5 : 0.33))
    }))
  );

  return {
    meta: {
      id: testId,
      shiftId: shift?.id,
      shiftNumber: shift?.shiftNumber || 1,
      code: `${shift?.code || 'CBT'}${targetSubject && targetSubject !== 'full' ? `-${targetSubject.slice(0, 4).toUpperCase()}` : ''}`,
      title: `${shift?.title || 'Official CBT Paper'} · ${subjectLabel}`,
      subtitle: `${shift?.examDate || ''} · ${shift?.shiftTiming || ''}`,
      examName: shift?.examName || (isAppscPrelims2024 ? 'APPSC Group-2 Prelims (2024)' : isAppscPaper1 ? 'APPSC Group-2 Paper-1 (2025)' : isAppsc ? 'APPSC Group-2 Paper-2 (2025)' : (isGroupD ? 'RRB Group D 2025 (CEN 09/2025)' : (isGrad2026 ? 'RRB NTPC Graduate 2025-26' : (isGrad2024 ? 'RRB NTPC Graduate 2024' : (isSsc ? 'SSC CGL Tier-I' : 'RRB NTPC Under Graduate 2025'))))),
      examYear: shift?.examYear || (isAppscPrelims2024 ? '2024' : isGrad2026 ? '2026' : (isGrad2024 ? '2024' : '2025')),
      subjectLabel,
      targetSubject: targetSubject || 'full',
      questionsCount: engineQuestions.length,
      timeMinutes: duration,
      marksPerQuestion: isSsc ? 2 : 1,
      marks: isSsc ? engineQuestions.length * 2 : engineQuestions.length,
      negativeMarking: shift?.negativeMarking || (isSsc ? 0.5 : 0.33),
      pdfUrl: shift?.pdfUrl || defaultPdfUrl,
      pdfFileName: shift?.pdfFileName || defaultPdfFileName,
      subjectTest: !isFull
    },
    questions: engineQuestions
  };
}

export { RRB_CORE_SUBJECTS };

