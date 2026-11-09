/**
 * Service to manage RRB NTPC UG 2025 Mock Tests & Questions
 * Provides fast local caching, subject filtering, Firestore synchronization,
 * and complete examination data management.
 */

import { RRB_NTPC_SHIFTS, RRB_CORE_SUBJECTS } from '../data/rrbNtpcMetadata.js';

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

let cachedQuestions = null;
let cachedShifts = null;

/**
 * Extracted question banks merged into one pool:
 * - RRB NTPC Under-Graduate 2025 papers (32 shifts, 3,200 Qs)
 * - RRB NTPC Graduate 2025 papers (47 shifts, 4,700 Qs)
 * - SSC CGL 2020 Tier-I papers (21 sets, 2,100 Qs)
 * - SSC CGL 2026 Tier-I papers (14 shifts, 1,400 Qs)
 * Total: 11,400 official examination questions across 114 shifts!
 */
const RRB_DATA_FILES = [
  'rrbNtpc2025Full.json',
  'rrbNtpcGraduate2025Full.json',
  'sscCgl2020Full.json',
  'sscCgl2026Full.json'
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
  if (typeof window === 'undefined') {
    return null;
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

    return JSON.parse(trimmed);
  };

  try {
    return await fetchAndParseJson(primaryUrl, 'no-cache');
  } catch (err) {
    // Try fallback path with relative URL and cache-busting timestamp
    try {
      const fallbackUrl = `/data/${fileName}?_t=${Date.now()}`;
      return await fetchAndParseJson(fallbackUrl, 'reload');
    } catch {
      // If still unavailable, log a single warning and return null gracefully
      console.warn(`Static question bank ${fileName} not available via fetch; using live database.`);
      return null;
    }
  }
}

/**
 * Fetch and cache all RRB questions from the merged JSON banks.
 */
export async function loadAllRRBQuestions() {
  if (cachedQuestions && cachedQuestions.length > 0) {
    return applyLocalOverrides(cachedQuestions);
  }

  const merged = [];
  const mergedShifts = [];
  for (const fileName of RRB_DATA_FILES) {
    try {
      const data = await loadRrbDataFile(fileName);
      if (data) {
        if (Array.isArray(data.questions)) merged.push(...data.questions);
        if (Array.isArray(data.shifts)) mergedShifts.push(...data.shifts);
      }
    } catch (err) {
      console.warn(`Notice while loading ${fileName}:`, err?.message || err);
    }
  }

  if (merged.length > 0) cachedQuestions = merged;
  if (mergedShifts.length > 0) cachedShifts = mergedShifts;
  return applyLocalOverrides(cachedQuestions || []);
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

export async function loadAllShifts() {
  if (cachedShifts && cachedShifts.length > 0) return getAllShifts();
  await loadAllRRBQuestions();
  return getAllShifts();
}

/**
 * Get all mock tests metadata (combining default shifts with any overrides)
 */
export function getAllShifts() {
  try {
    const overrides = JSON.parse(localStorage.getItem(STORAGE_KEY_TEST_OVERRIDES) || '{}');
    const base = (cachedShifts && cachedShifts.length > 0) ? cachedShifts : RRB_NTPC_SHIFTS;
    return base.map((shift) => {
      const ov = overrides[shift.id];
      return ov ? { ...shift, ...ov } : shift;
    });
  } catch {
    return (cachedShifts && cachedShifts.length > 0) ? cachedShifts : RRB_NTPC_SHIFTS;
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
/**
 * Get all questions for a given subject (across all 32 shifts and local overrides)
 * @param {string} subjectIdOrName e.g. 'general-knowledge', 'reasoning', 'quantitative-aptitude', 'general-science'
 */
export async function getQuestionsForSubject(subjectIdOrName) {
  const all = await loadAllRRBQuestions();
  if (!subjectIdOrName || subjectIdOrName === 'All' || subjectIdOrName === 'all' || subjectIdOrName === 'full') {
    return all;
  }

  const cleanTarget = subjectIdOrName.toLowerCase().replace(/[^a-z]/g, '');

  return all.filter((q) => {
    const qSub = (q.subject || '').toLowerCase().replace(/[^a-z]/g, '');
    const qSubId = (q.subjectId || '').toLowerCase().replace(/[^a-z]/g, '');
    const qCat = (q.categoryId || '').toLowerCase();

    if (cleanTarget.includes('computer') || cleanTarget.includes('cse')) {
      return qSub.includes('computer') || qSubId.includes('computer') || qCat === 'cse';
    }
    if (cleanTarget.includes('english')) {
      return qSub.includes('english') || qSubId.includes('english') || qCat === 'english';
    }
    if (cleanTarget.includes('science') || cleanTarget.includes('generalscience')) {
      return qSub.includes('generalscience') || (qSub.includes('science') && !qSub.includes('computer')) || qSubId.includes('science') || qCat === 'general-science';
    }
    if (cleanTarget.includes('quant') || cleanTarget.includes('math')) {
      return qSub.includes('quant') || qSubId.includes('quant') || qCat === 'quant';
    }
    if (cleanTarget.includes('reason')) {
      return qSub.includes('reason') || qSubId.includes('reason') || qCat === 'reasoning';
    }
    if (cleanTarget.includes('gk') || cleanTarget.includes('generalknowledge') || cleanTarget.includes('generalawareness')) {
      return (qSub.includes('generalknowledge') || qSubId.includes('generalknowledge') || qSubId.includes('gk') || qCat === 'gk') && !qSub.includes('computer');
    }
    return qSub.includes(cleanTarget) || cleanTarget.includes(qSub);
  });
}

/**
 * Get count summary for each subject
 */
export async function getSubjectStatistics() {
  const all = await loadAllRRBQuestions();
  let gk = 0;
  let quant = 0;
  let reasoning = 0;
  let science = 0;
  let english = 0;

  for (const q of all) {
    const sub = (q.subject || '').toLowerCase();
    if (sub.includes('english')) english++;
    else if (sub.includes('science')) science++;
    else if (sub.includes('knowledge') || sub.includes('gk')) gk++;
    else if (sub.includes('quant') || sub.includes('math')) quant++;
    else if (sub.includes('reason')) reasoning++;
  }

  return {
    total: all.length,
    gk,
    quant,
    reasoning,
    science,
    english
  };
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

function formatToEngineQuestions(questions) {
  return questions.map((q, idx) => ({
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
    // The engine UI compares options ('A'..'D') against `correctAnswer`, so expose
    // the correct option letter under that name. Source banks store the index.
    correctAnswer: ['A', 'B', 'C', 'D'][q.correctAnswer] || q.correctLetter || 'A',
    explanation: q.explanation?.en || `Official answer is Option (${q.correctLetter || 'A'}). Preserved from RRB NTPC UG 2025 official answer key.`,
    explanationTe: q.explanation?.te || '',
    examName: q.examName || 'RRB NTPC UG 2025',
    examYear: q.examYear || '2025',
    shift: q.shiftNumber ? `Shift ${q.shiftNumber}` : 'Master PYQ Pool',
    examDate: q.examDate,
    shiftTiming: q.shiftTiming,
    subject: q.subject,
    subtopic: q.subtopic,
    verificationStatus: q.status === 'Published' ? 'VERIFIED' : 'UNVERIFIED',
    source: q.source || 'RRB Official Answer Key (CEN 07/2025)'
  }));
}

/**
 * Build Engine-compatible test object
 */
export async function getEngineMockTest(testId, subjectParam = null) {
  const shifts = getAllShifts();
  const allQuestions = await loadAllRRBQuestions();

  // 1. Unified Subject Tests: e.g. "subject-gk-master", "subject-reasoning-master", "subject-quant-50q", etc.
  if (testId.startsWith('subject-') || testId.startsWith('unified-') || testId.startsWith('topic-') || testId.startsWith('full-cbt-')) {
    let subject = subjectParam;
    let title = 'Subject Master Mock Test';
    let targetCount = 100;
    let duration = 90;

    // Topic-wise tests carry their topic in the id. Resolving it before the subject
    // checks below keeps the test scoped to its own subject and topic.
    let topicName = '';
    if (testId.startsWith('topic-')) {
      const { subjectId, topicSlug } = parseTopicTestId(testId);
      if (subjectId) subject = subjectId;
      topicName = resolveTopicName(subjectId, topicSlug);
    }

    if (testId.includes('gk') || subject === 'general-knowledge' || subject === 'General Knowledge') {
      subject = 'General Knowledge';
      title = 'General Knowledge Master PYQ Mock Test';
    } else if (testId.includes('reasoning') || subject === 'reasoning' || subject === 'Reasoning') {
      subject = 'Reasoning';
      title = 'Reasoning & Mental Ability Master Mock Test';
    } else if (testId.includes('quant') || subject === 'quantitative-aptitude' || subject === 'Quantitative Aptitude') {
      subject = 'Quantitative Aptitude';
      title = 'Quantitative Aptitude Master Mock Test';
    } else if (testId.includes('english') || subject === 'english-language' || subject === 'English Language') {
      subject = 'English Language';
      title = 'English Language Master Mock Test';
    } else if (testId.includes('computer') || subject === 'computer-science' || subject === 'Computer Science') {
      // Checked before the science rule: "computer-science" contains "science".
      subject = 'Computer Science';
      title = 'Computer Science Master Mock Test';
    } else if (testId.includes('science') || subject === 'general-science' || subject === 'General Science') {
      subject = 'General Science';
      title = 'General Science Master Mock Test';
    } else if (testId.startsWith('full-cbt-')) {
      subject = 'full';
      title = 'RRB NTPC UG 2025 Full CBT Master Mock Test (100 Qs)';
    }

    if (testId.includes('25q') || testId.includes('speed') || testId.includes('practice-1')) {
      targetCount = 25;
      duration = 25;
      title = `${subject} · Speed Practice Test (25 Qs)`;
    } else if (testId.includes('50q') || testId.includes('high-yield') || testId.includes('test-2')) {
      targetCount = 50;
      duration = 45;
      title = `${subject} · High-Yield PYQs Test (50 Qs)`;
    } else if (testId.includes('master-2') || testId.includes('test-3')) {
      targetCount = 100;
      duration = 90;
      title = `${subject} · Full Comprehensive Test 2 (100 Qs)`;
    }

    // Filter questions
    let picked = [];
    if (subject === 'full') {
      const qQuant = allQuestions.filter((q) => q.subject === 'Quantitative Aptitude').slice(0, 30);
      const qGk = allQuestions.filter((q) => q.subject === 'General Knowledge').slice(0, 30);
      const qSci = allQuestions.filter((q) => q.subject === 'General Science').slice(0, 10);
      const qReas = allQuestions.filter((q) => q.subject === 'Reasoning').slice(0, 30);
      picked = [...qQuant, ...qGk, ...qSci, ...qReas];
    } else {
      const subjectPool = await getQuestionsForSubject(subject);
      picked = subjectPool.slice(0, targetCount);

      if (topicName) {
        // A topic test serves only the questions classified under its own topic. When
        // nothing matches we keep the full subject pool instead of showing an empty test.
        const topicPool =
          subject === 'General Knowledge'
            ? subjectPool.filter((q) => classifyGkTopic(q) === topicName)
            : subject === 'Computer Science'
              ? subjectPool.filter((q) => classifyComputerTopic(q) === topicName)
              : [];
        if (topicPool.length > 0) picked = topicPool.slice(0, targetCount);
        title = `${subject} · ${topicName} Topic Test`;
        duration = Math.max(5, Math.min(duration, picked.length));
      } else if (picked.length < targetCount && subjectPool.length > 0) {
        picked = subjectPool;
      }
    }

    const engineQuestions = formatToEngineQuestions(picked);

    const isEnglish = subject === 'English Language';
    return {
      meta: {
        id: testId,
        code: `MOCK-${(subject || 'CBT').slice(0, 5).toUpperCase()}`,
        title,
        subtitle: isEnglish ? `SSC CGL 2020 Official Tier-I Question Bank` : `ExamQuestHub Master CBT · Official 2025 Question Pool`,
        examName: isEnglish ? 'SSC CGL 2020 Tier-I (CBE)' : 'RRB NTPC Under Graduate 2025 (CEN 07/2025)',
        examYear: isEnglish ? '2020' : '2025',
        subjectLabel: subject === 'full' ? 'All 4 Subjects' : subject,
        targetSubject: subject,
        questionsCount: engineQuestions.length,
        timeMinutes: duration,
        marks: isEnglish ? engineQuestions.length * 2 : engineQuestions.length,
        negativeMarking: isEnglish ? 0.5 : 0.33,
        pdfUrl: isEnglish
          ? '/assets/aistudio/SSC_CGL_2020_All_21_Sets_English.pdf'
          : '/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf',
        pdfFileName: isEnglish ? 'SSC_CGL_2020_All_21_Sets_English.pdf' : 'RRB-NTPC-UG-2025-EN-All-Papers.pdf',
        subjectTest: subject !== 'full'
      },
      questions: engineQuestions
    };
  }

  // 2. Legacy / Individual Shift resolution if ever requested
  let shiftId = testId;
  let targetSubject = subjectParam;

  if (testId.includes('--')) {
    const parts = testId.split('--');
    shiftId = parts[0];
    targetSubject = parts[1];
  }

  const shift = shifts.find((s) => s.id === shiftId || s.code.toLowerCase() === shiftId.toLowerCase()) || shifts[0];
  const questions = await getQuestionsForShift(shift?.shiftNumber || 1, targetSubject);

  let subjectLabel = 'Full Shift CBT (All Subjects)';
  if (targetSubject && targetSubject !== 'full') {
    const foundSub = RRB_CORE_SUBJECTS.find((s) => s.id === targetSubject || s.title.toLowerCase() === targetSubject.toLowerCase());
    subjectLabel = foundSub ? foundSub.title : targetSubject;
  }

  const isFull = !targetSubject || targetSubject === 'full' || questions.length >= 70;
  const duration = isFull ? (shift?.durationMinutes || 90) : Math.max(15, questions.length);

  const engineQuestions = formatToEngineQuestions(questions);

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

