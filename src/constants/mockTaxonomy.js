/**
 * Mock Test taxonomy: Category -> Subject -> Test type.
 *
 * Categories and subjects are fixed lists derived from standard government
 * examination syllabi. Admin-authored questions choose from these lists, which
 * keeps the Category -> Subject navigation stable and stops near-duplicate
 * subject names ("Computer Network" vs "Computer Networks") from fragmenting
 * the tree.
 *
 * This module is client-only and is never imported by the build-time SEO
 * script, so it is safe to keep the icon components here.
 */

import { Landmark, Cpu, BrainCircuit, Calculator, Languages } from 'lucide-react';
import { CANONICAL_SUBJECTS, SUBJECT_TOPIC_TREE } from './examHierarchy.js';
import { classifyQuestionConceptually } from '../utils/questionClassifier.js';

export const LEGACY_TOPIC_ALIAS_MAP = {
  // Quantitative Aptitude legacy slugs -> canonical topicId
  geometry: 'mensuration-geometry',
  mensuration: 'mensuration-geometry',
  percentage: 'percentage-profit-loss',
  'profit-loss': 'percentage-profit-loss',
  interest: 'percentage-profit-loss',
  'ratio-proportion': 'ratio-proportion-mixtures',
  average: 'ratio-proportion-mixtures',
  'time-work': 'time-speed-distance-work',
  'time-speed-distance': 'time-speed-distance-work',
  algebra: 'algebra-trigonometry',
  trigonometry: 'algebra-trigonometry',
  simplification: 'number-system',
  // General Knowledge legacy slugs -> canonical topicId
  'indian-geography': 'geography',
  'indian-society': 'government-schemes',
  'art-culture': 'static-gk',
  'awards-honours': 'static-gk',
  'books-authors': 'static-gk',
  'important-days': 'static-gk',
  sports: 'static-gk',
  organisations: 'static-gk',
  // General Science legacy slugs -> canonical topicId
  'human-body': 'biology',
  diseases: 'biology',
  'scientific-instruments': 'physics',
  'inventions-discoveries': 'physics',
  'science-technology': 'science-tech-ca',
  // Computer Science legacy slugs -> canonical topicId
  fundamentals: 'computer-fundamentals',
  networks: 'computer-networks',
  programming: 'programming-oop',
  'data-structures': 'data-structures-algorithms',
  'cyber-security': 'software-engineering',
  'web-tech': 'computer-networks',
  // Current Affairs legacy slugs -> canonical topicId
  'international-summits': 'international-affairs',
  'economy-banking': 'economy-banking-ca',
  'defence-space': 'defence-summits-ca',
  'sports-events': 'sports-awards-ca',
  'awards-appointments': 'sports-awards-ca',
  'science-environment': 'science-tech-ca',
  // English legacy slugs -> canonical topicId
  grammar: 'grammar-error-spotting',
  'error-detection': 'grammar-error-spotting',
  'sentence-improvement': 'grammar-error-spotting',
  voice: 'grammar-error-spotting',
  speech: 'grammar-error-spotting',
  'fill-in-the-blanks': 'grammar-error-spotting',
  'synonyms-antonyms': 'vocabulary',
  'cloze-test': 'reading-comprehension',
  // Reasoning legacy slugs -> canonical topicId
  analogy: 'analogies-classification',
  classification: 'analogies-classification',
  'number-series': 'series-coding-decoding',
  'alphabet-series': 'series-coding-decoding',
  'coding-decoding': 'series-coding-decoding',
  'mathematical-operations': 'series-coding-decoding',
  'blood-relations': 'blood-relations-directions',
  'direction-sense': 'blood-relations-directions',
  ranking: 'blood-relations-directions',
  syllogism: 'syllogism-conclusions',
  'venn-diagrams': 'syllogism-conclusions',
  'seating-arrangement': 'puzzles-seating',
  puzzles: 'puzzles-seating',
  'non-verbal': 'non-verbal-reasoning'
};

export function resolveCanonicalTopicId(topicId) {
  const clean = String(topicId || '').toLowerCase().trim();
  return LEGACY_TOPIC_ALIAS_MAP[clean] || clean;
}

export const MOCK_CATEGORIES = [
  {
    id: 'gk',
    name: 'GK & General Studies',
    shortName: 'GK & GS',
    icon: Landmark,
    tagline: 'Polity, history, geography, economy and general science',
    accent: { chip: 'bg-[#EAF3FF] text-[#12345A]', bar: 'bg-[#12345A]' },
    subjects: [
      { id: 'indian-polity', name: 'Indian Polity & Constitution' },
      { id: 'indian-history', name: 'Indian History' },
      { id: 'geography', name: 'Geography' },
      { id: 'indian-economy', name: 'Indian Economy' },
      { id: 'general-science', name: 'General Science' },
      { id: 'environment-ecology', name: 'Environment & Ecology' },
      { id: 'government-schemes', name: 'Government Schemes & Society' },
      { id: 'static-gk', name: 'Static GK & Culture' },
      { id: 'current-affairs', name: 'Current Affairs' }
    ]
  },
  {
    id: 'cse',
    name: 'Computer Science (CSE)',
    shortName: 'CSE',
    icon: Cpu,
    tagline: 'Fundamentals, networks, DBMS, operating systems, DSA and programming',
    accent: { chip: 'bg-[#EFEAFF] text-[#4C1D95]', bar: 'bg-[#6D28D9]' },
    subjects: [
      { id: 'computer-fundamentals', name: 'Computer Fundamentals & MS Office' },
      { id: 'computer-networks', name: 'Computer Networks & Internet' },
      { id: 'dbms', name: 'Database Management Systems (DBMS)' },
      { id: 'operating-systems', name: 'Operating Systems' },
      { id: 'data-structures-algorithms', name: 'Data Structures & Algorithms' },
      { id: 'programming-oop', name: 'Programming & OOP' },
      { id: 'digital-logic', name: 'Digital Logic & Number Systems' },
      { id: 'software-engineering', name: 'Cyber Security & Software Engineering' }
    ]
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    shortName: 'Reasoning',
    icon: BrainCircuit,
    tagline: 'Series, syllogism, puzzles and non-verbal reasoning',
    accent: { chip: 'bg-[#E7F7ED] text-[#065F46]', bar: 'bg-[#047857]' },
    subjects: [
      { id: 'analogies-classification', name: 'Analogy & Classification' },
      { id: 'series-coding-decoding', name: 'Series, Coding-Decoding & Operations' },
      { id: 'blood-relations-directions', name: 'Blood Relations & Direction Sense' },
      { id: 'syllogism-conclusions', name: 'Syllogism, Venn Diagrams & Logic' },
      { id: 'puzzles-seating', name: 'Puzzles & Seating Arrangement' },
      { id: 'non-verbal-reasoning', name: 'Non-Verbal & Visual Reasoning' }
    ]
  },
  {
    id: 'quant',
    name: 'Quantitative Aptitude',
    shortName: 'Quant',
    icon: Calculator,
    tagline: 'Arithmetic, mensuration, data interpretation and algebra',
    accent: { chip: 'bg-[#FDF0E6] text-[#9A3412]', bar: 'bg-[#EA580C]' },
    subjects: [
      { id: 'number-system', name: 'Number System & Simplification' },
      { id: 'percentage-profit-loss', name: 'Percentage, Profit & Loss & Interest' },
      { id: 'time-speed-distance-work', name: 'Time, Work, Speed & Distance' },
      { id: 'ratio-proportion-mixtures', name: 'Ratio, Proportion, Averages & Mixtures' },
      { id: 'mensuration-geometry', name: 'Geometry & Mensuration' },
      { id: 'data-interpretation', name: 'Data Interpretation, Statistics & Probability' },
      { id: 'algebra-trigonometry', name: 'Algebra & Trigonometry' }
    ]
  },
  {
    id: 'english',
    name: 'English Language',
    shortName: 'English',
    icon: Languages,
    tagline: 'Grammar, vocabulary, comprehension and sentence skills',
    accent: { chip: 'bg-[#E8F4FD] text-[#075985]', bar: 'bg-[#0284C7]' },
    subjects: [
      { id: 'grammar-error-spotting', name: 'Grammar, Error Spotting & Sentence Improvement' },
      { id: 'vocabulary', name: 'Vocabulary, Synonyms & Antonyms' },
      { id: 'idioms-phrases', name: 'Idioms & Phrases' },
      { id: 'reading-comprehension', name: 'Reading Comprehension & Cloze Test' },
      { id: 'sentence-rearrangement', name: 'Sentence Rearrangement (Para Jumbles)' },
      { id: 'one-word-substitution', name: 'One-Word Substitution & Spelling' }
    ]
  }
];

/**
 * The three test types offered for every subject.
 * `PYQ` carries real previous-year questions only — never generated content.
 */
export const MOCK_TEST_TYPES = [
  {
    id: 'PYQ',
    label: 'Previous Year Questions',
    shortLabel: 'Previous Year',
    description:
      'Actual questions from government examination papers, organised by exam name and year with the source reference recorded.',
    accent: { chip: 'bg-[#EAF3FF] text-[#12345A]', button: 'bg-[#12345A] hover:bg-[#0B1F3A]' }
  },
  {
    id: 'IMPORTANT',
    label: 'Most Important Questions',
    shortLabel: 'Most Important',
    description:
      'Syllabus-mapped questions on the concepts that repeat most often across previous papers for SSC, RRB, SSC JE, Scientific Assistant IMD and similar examinations.',
    accent: { chip: 'bg-[#FDF0E6] text-[#9A3412]', button: 'bg-[#EA580C] hover:bg-[#C2410C]' }
  },
  {
    id: 'PRACTICE',
    label: 'Practice Questions',
    shortLabel: 'Practice',
    description:
      'Syllabus-based practice questions for revision. These are practice questions, not previous-year questions.',
    accent: { chip: 'bg-[#E7F7ED] text-[#065F46]', button: 'bg-[#047857] hover:bg-[#065F46]' }
  }
];

export const MOCK_EXAM_NAMES = [
  'SSC CGL',
  'SSC CHSL',
  'SSC MTS',
  'SSC JE',
  'SSC GD Constable',
  'RRB NTPC',
  'RRB Group D',
  'RRB ALP',
  'RRB JE',
  'Scientific Assistant IMD',
  'UPSC CSE',
  'APPSC Group I',
  'APPSC Group II',
  'TSPSC Group II',
  'IBPS PO',
  'IBPS Clerk',
  'SBI PO',
  'SBI Clerk',
  'Other Government Examination'
];

export const MOCK_DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export const MOCK_VERIFICATION = {
  VERIFIED: 'VERIFIED',
  UNVERIFIED: 'UNVERIFIED'
};

const TEST_ID_SEPARATOR = '--';

export function getCategoryById(categoryId) {
  return MOCK_CATEGORIES.find((category) => category.id === categoryId) || null;
}

export function getSubjectsForCategory(categoryId) {
  return getCategoryById(categoryId)?.subjects || [];
}

export function getSubjectById(categoryId, subjectId) {
  return getSubjectsForCategory(categoryId).find((subject) => subject.id === subjectId) || null;
}

export function getSubjectName(categoryId, subjectId) {
  return getSubjectById(categoryId, subjectId)?.name || subjectId || '';
}

export function getTestTypeById(testTypeId) {
  const key = String(testTypeId || '').toUpperCase();
  return MOCK_TEST_TYPES.find((type) => type.id === key) || null;
}

/** Stable id for one (category, subject, test type) test. */
export function buildTestId(categoryId, subjectId, testTypeId) {
  return [categoryId, subjectId, String(testTypeId || '').toLowerCase()].join(TEST_ID_SEPARATOR);
}

/** Inverse of `buildTestId`. Returns null when the id is not a subject test id. */
export function parseTestId(testId) {
  const parts = String(testId || '').split(TEST_ID_SEPARATOR);
  if (parts.length !== 3) return null;

  const [categoryId, subjectId, rawType] = parts;
  const testType = getTestTypeById(rawType);
  if (!getCategoryById(categoryId) || !getSubjectById(categoryId, subjectId) || !testType) return null;

  return { categoryId, subjectId, questionType: testType.id };
}

/** Normalises a stored `questionType` value to one of PYQ / IMPORTANT / PRACTICE. */
export function normalizeQuestionType(value) {
  const key = String(value || '').trim().toUpperCase();
  if (key === 'PYQ' || key === 'PREVIOUS YEAR' || key === 'PREVIOUS-YEAR') return 'PYQ';
  if (key === 'IMPORTANT' || key === 'MOST IMPORTANT') return 'IMPORTANT';
  return 'PRACTICE';
}

/** A PYQ counts as verified only when a source reference is recorded. */
export function isVerifiedPyq(question) {
  return (
    normalizeQuestionType(question?.questionType) === 'PYQ' &&
    String(question?.verificationStatus || '').toUpperCase() === MOCK_VERIFICATION.VERIFIED
  );
}

/**
 * Integrity gate for admin-authored questions.
 * Enforces the "never label an unsourced question as a PYQ" rule at the data layer.
 */
export function validateMockQuestion(question) {
  const errors = [];
  const options = Array.isArray(question?.options?.en) ? question.options.en : [];

  if (!question?.question?.en?.trim()) errors.push('Question (English) is required.');
  if (options.length !== 4 || options.some((opt) => !String(opt || '').trim())) {
    errors.push('Exactly 4 non-empty English options are required.');
  }

  const correct = Number(question?.correctAnswer);
  if (!Number.isInteger(correct) || correct < 0 || correct > 3) {
    errors.push('Correct answer must be one of Option A, B, C or D.');
  }

  if (!question?.explanation?.en?.trim()) errors.push('Explanation (English) is required.');

  const type = normalizeQuestionType(question?.questionType);
  if (type === 'PYQ') {
    if (!String(question?.examName || '').trim()) errors.push('Exam name is required for a PYQ.');
    if (!String(question?.examYear || '').trim()) errors.push('Exam year is required for a PYQ.');
  }

  if (
    String(question?.verificationStatus || '').toUpperCase() === MOCK_VERIFICATION.VERIFIED &&
    !String(question?.source || '').trim()
  ) {
    errors.push('A source reference is required before a question can be marked verified.');
  }

  return errors;
}

/**
 * Converts a `mockQuestions` Firestore record into the shape the CBT engine renders.
 * The engine keys options by letter; stored records key them by index.
 */
export function toEngineQuestion(question, index) {
  const letters = ['A', 'B', 'C', 'D'];
  const enOptions = Array.isArray(question?.options?.en) ? question.options.en : [];
  const teOptions = Array.isArray(question?.options?.te) ? question.options.te : [];
  const answerIndex = Number(question?.correctAnswer);

  const options = {};
  const optionsTe = {};
  letters.forEach((letter, i) => {
    options[letter] = enOptions[i] || '';
    if (teOptions[i]) optionsTe[letter] = teOptions[i];
  });

  return {
    id: question?.id || `mock-q-${index + 1}`,
    qNumber: index + 1,
    topic: getSubjectName(question?.categoryId, question?.subjectId) || question?.subjectId || '',
    difficulty: question?.difficulty || 'Medium',
    question: question?.question?.en || '',
    questionTe: question?.question?.te || '',
    options,
    optionsTe,
    correctAnswer: letters[Number.isInteger(answerIndex) ? answerIndex : 0],
    explanation: question?.explanation?.en || '',
    explanationTe: question?.explanation?.te || '',
    // Attribution shown next to the question. Never invented: straight from the record.
    questionType: normalizeQuestionType(question?.questionType),
    examName: question?.examName || '',
    examYear: question?.examYear || '',
    source: question?.source || '',
    paperUrl: question?.paperUrl || '',
    paperFileName: question?.paperFileName || '',
    imageUrl: question?.imageUrl || '',
    verificationStatus:
      String(question?.verificationStatus || '').toUpperCase() === MOCK_VERIFICATION.VERIFIED
        ? MOCK_VERIFICATION.VERIFIED
        : MOCK_VERIFICATION.UNVERIFIED
  };
}

/** Lower-cased, punctuation-free form used to detect duplicate questions. */
export function normalizeQuestionText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Finds an existing question that duplicates `candidate`.
 * A question is a duplicate when its English text matches within the same
 * category and subject, regardless of test type.
 */
export function findDuplicateQuestion(candidate, existingQuestions) {
  const key = normalizeQuestionText(candidate?.question?.en);
  if (!key) return null;

  return (
    (existingQuestions || []).find(
      (existing) =>
        existing.id !== candidate?.id &&
        existing.categoryId === candidate?.categoryId &&
        existing.subjectId === candidate?.subjectId &&
        normalizeQuestionText(existing.question?.en) === key
    ) || null
  );
}

/** Counts available questions per category/subject/topic, split by test type. */
export function countQuestionsBySubject(questions) {
  const counts = {};
  const addCount = (catId, subId, qType) => {
    const key = `${catId}::${subId}`;
    if (!counts[key]) {
      counts[key] = { PYQ: 0, IMPORTANT: 0, PRACTICE: 0, total: 0 };
    }
    counts[key][qType] += 1;
    counts[key].total += 1;
  };

  for (const question of questions || []) {
    if (!question) continue;
    const qType = normalizeQuestionType(question.questionType);
    const subId = question.subjectId || 'general-knowledge';
    const topicId = resolveCanonicalTopicId(question.topicId || question.subjectId || '');

    let catId = question.categoryId;
    if (!catId || catId === 'ca' || catId === 'general-science' || catId === 'science') {
      if (subId === 'quantitative-aptitude') catId = 'quant';
      else if (subId === 'reasoning') catId = 'reasoning';
      else if (subId === 'english-language') catId = 'english';
      else if (subId === 'computer-science') catId = 'cse';
      else catId = 'gk';
    }

    if (subId === 'general-science') {
      addCount('gk', 'general-science', qType);
    } else if (subId === 'current-affairs') {
      addCount('gk', 'current-affairs', qType);
    } else if (topicId) {
      addCount(catId, topicId, qType);
    } else if (subId) {
      addCount(catId, subId, qType);
    }
  }
  return counts;
}

/** Filters a question list down to a single category/subject/topic test without cross-topic leakage. */
export function selectTestQuestions(questions, { categoryId, subjectId, questionType }) {
  const wanted = normalizeQuestionType(questionType);
  const canonicalTarget = resolveCanonicalTopicId(subjectId);

  return (questions || []).filter((question) => {
    if (!question) return false;

    const qSubId = question.subjectId || '';
    const qCatId =
      question.categoryId === 'ca' || question.categoryId === 'general-science' || question.categoryId === 'science'
        ? 'gk'
        : question.categoryId;

    // 1. Verify Category matches
    const catMatch =
      qCatId === categoryId ||
      (categoryId === 'cse' && (qCatId === 'cse' || qSubId === 'computer-science')) ||
      (categoryId === 'quant' && (qCatId === 'quant' || qSubId === 'quantitative-aptitude')) ||
      (categoryId === 'reasoning' && (qCatId === 'reasoning' || qSubId === 'reasoning')) ||
      (categoryId === 'english' && (qCatId === 'english' || qSubId === 'english-language')) ||
      (categoryId === 'gk' &&
        (qCatId === 'gk' ||
          qSubId === 'general-knowledge' ||
          qSubId === 'general-science' ||
          qSubId === 'current-affairs'));

    if (!catMatch) return false;

    // 2. Strictly verify Subject / Topic matches (no cross-topic category-wide fallback)
    const qTopicCanonical = resolveCanonicalTopicId(question.topicId || '');
    const subMatch =
      question.subjectId === subjectId ||
      question.topicId === subjectId ||
      (canonicalTarget && (qTopicCanonical === canonicalTarget || question.subjectId === canonicalTarget));

    if (!subMatch) return false;

    // 3. Question Type verification
    if (!wanted) return true;
    return normalizeQuestionType(question.questionType) === wanted;
  });
}

const SUBJECT_DISPLAY_THEME = {
  'general-knowledge': { title: 'General Knowledge', shortTitle: 'GK', themeColor: '#D97706' },
  'english-language': { title: 'English Language', shortTitle: 'English', themeColor: '#2563EB' },
  reasoning: { title: 'Reasoning', shortTitle: 'Reasoning', themeColor: '#9333EA' },
  'quantitative-aptitude': { title: 'Quantitative Aptitude', shortTitle: 'Quant', themeColor: '#059669' },
  'general-science': { title: 'General Science', shortTitle: 'Science', themeColor: '#7C3AED' },
  'computer-science': { title: 'Computer Science', shortTitle: 'Computer', themeColor: '#0284C7' },
  'current-affairs': { title: 'Current Affairs', shortTitle: 'Current Affairs', themeColor: '#E11D48' }
};

/**
 * Complete Topic & Subtopic Taxonomy aligned cleanly with the 43 canonical topics
 * in `SUBJECT_TOPIC_TREE` (examHierarchy.js).
 */
export const SUBJECT_TOPIC_TAXONOMY = Object.fromEntries(
  CANONICAL_SUBJECTS.map((sub) => {
    const theme = SUBJECT_DISPLAY_THEME[sub.id] || {
      title: sub.name,
      shortTitle: sub.shortName,
      themeColor: '#12345A'
    };
    const topics = (SUBJECT_TOPIC_TREE[sub.id] || []).map((t) => ({
      id: t.id,
      name: t.name,
      description: t.subtopics.slice(0, 4).join(', '),
      subtopics: t.subtopics
    }));
    return [
      sub.id,
      {
        id: sub.id,
        title: theme.title,
        shortTitle: theme.shortTitle,
        themeColor: theme.themeColor,
        topics
      }
    ];
  })
);

/**
 * Returns all topics configured for a given subject ID.
 */
export function getTopicsForSubject(subjectId) {
  if (!subjectId || subjectId === 'all') {
    return Object.values(SUBJECT_TOPIC_TAXONOMY).flatMap((s) => s.topics);
  }
  return SUBJECT_TOPIC_TAXONOMY[subjectId]?.topics || [];
}

/**
 * Returns topic metadata by subjectId and topicId (supporting legacy slug aliases).
 */
export function getTopicMetadata(subjectId, topicId) {
  const topics = getTopicsForSubject(subjectId);
  const canonicalId = resolveCanonicalTopicId(topicId);
  return topics.find((t) => t.id === canonicalId || t.id === topicId) || null;
}

/**
 * Conceptual multi-signal question classifier delegating to `classifyQuestionConceptually`.
 */
export function classifyQuestion(question) {
  if (question && question.manualClassificationOverride && question.subjectId && question.topicId) {
    const subMeta = CANONICAL_SUBJECTS.find((s) => s.id === question.subjectId);
    const topicMeta = (SUBJECT_TOPIC_TREE[question.subjectId] || []).find((t) => t.id === question.topicId);
    const catMap = {
      'quantitative-aptitude': 'quant',
      reasoning: 'reasoning',
      'english-language': 'english',
      'computer-science': 'cse',
      'general-science': 'general-science',
      'current-affairs': 'ca',
      'general-knowledge': 'gk'
    };
    return {
      subjectId: question.subjectId,
      subjectName: question.subject || subMeta?.name || 'General Knowledge',
      categoryId: question.categoryId || catMap[question.subjectId] || 'gk',
      topicId: question.topicId,
      topicName: question.topic || topicMeta?.name || question.subtopic || 'Static GK & Culture',
      subtopic: question.subtopic || topicMeta?.name || 'Static GK & Culture',
      confidence: Number(question.classificationConfidence ?? 100),
      confidenceTier: question.classificationTier || 'HIGH',
      classificationStatus: question.classificationStatus || 'ADMIN_VERIFIED',
      eligibleExams: Array.isArray(question.eligibleExams) ? question.eligibleExams : [],
      qualityFlags: Array.isArray(question.qualityFlags) ? question.qualityFlags : [],
      reasoning: 'Manually verified/overridden by Admin'
    };
  }
  const cls = classifyQuestionConceptually(question || {});
  return {
    subjectId: cls.subjectId,
    subjectName: cls.subjectName,
    categoryId: cls.categoryId,
    topicId: cls.topicId,
    topicName: cls.topicName,
    subtopic: cls.subtopic,
    confidence: cls.confidence,
    confidenceTier: cls.confidenceTier,
    classificationStatus: cls.classificationStatus,
    eligibleExams: cls.eligibleExams,
    qualityFlags: cls.qualityFlags,
    reasoning: cls.reasoning
  };
}

export const SUBJECT_ICON_ASSETS = {
  'all': '/assets/aistudio/examquesthub_all_mock_icon_92222837.png',
  'current-affairs': '/assets/aistudio/examquesthub_current_affairs_icon_fdc345ae.png',
  'general-knowledge': '/assets/aistudio/examquesthub_general_awareness_icon_2f897e54.png',
  'gk': '/assets/aistudio/examquesthub_general_awareness_icon_2f897e54.png',
  'quantitative-aptitude': '/assets/aistudio/examquesthub_mathematics_icon_ab20c36e.png',
  'quant': '/assets/aistudio/examquesthub_mathematics_icon_ab20c36e.png',
  'reasoning': '/assets/aistudio/examquesthub_reasoning_icon_b6acb299.png',
  'english-language': '/assets/aistudio/examquesthub_english_icon_cb4147e7.png',
  'english': '/assets/aistudio/examquesthub_english_icon_cb4147e7.png',
  'general-science': '/assets/aistudio/examquesthub_general_science_icon_02b3df39.png',
  'computer-science': '/assets/aistudio/examquesthub_computer_science_icon_573cd928.png',
  'cse': '/assets/aistudio/examquesthub_computer_science_icon_573cd928.png'
};

export function getSubjectIconAsset(id) {
  if (!id) return SUBJECT_ICON_ASSETS['all'];
  const normalized = String(id).toLowerCase();
  return SUBJECT_ICON_ASSETS[normalized] || SUBJECT_ICON_ASSETS['all'];
}
