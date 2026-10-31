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
      { id: 'static-gk', name: 'Static GK' },
      { id: 'current-affairs', name: 'Current Affairs' }
    ]
  },
  {
    id: 'cse',
    name: 'Computer Science (CSE)',
    shortName: 'CSE',
    icon: Cpu,
    tagline: 'Networks, DBMS, operating systems, DSA and programming',
    accent: { chip: 'bg-[#EFEAFF] text-[#4C1D95]', bar: 'bg-[#6D28D9]' },
    subjects: [
      { id: 'computer-networks', name: 'Computer Networks' },
      { id: 'dbms', name: 'Database Management Systems' },
      { id: 'operating-systems', name: 'Operating Systems' },
      { id: 'data-structures-algorithms', name: 'Data Structures & Algorithms' },
      { id: 'programming-oop', name: 'Programming & OOP' },
      { id: 'digital-logic', name: 'Digital Logic & Computer Organization' },
      { id: 'software-engineering', name: 'Software Engineering' }
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
      { id: 'series-coding-decoding', name: 'Series & Coding-Decoding' },
      { id: 'blood-relations-directions', name: 'Blood Relations & Direction Sense' },
      { id: 'syllogism-conclusions', name: 'Syllogism & Statement Conclusions' },
      { id: 'puzzles-seating', name: 'Puzzles & Seating Arrangement' },
      { id: 'non-verbal-reasoning', name: 'Non-Verbal Reasoning' }
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
      { id: 'percentage-profit-loss', name: 'Percentage, Profit & Loss' },
      { id: 'time-speed-distance-work', name: 'Time, Speed, Distance & Work' },
      { id: 'ratio-proportion-mixtures', name: 'Ratio, Proportion & Mixtures' },
      { id: 'mensuration-geometry', name: 'Mensuration & Geometry' },
      { id: 'data-interpretation', name: 'Data Interpretation' },
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
      { id: 'grammar-error-spotting', name: 'Grammar & Error Spotting' },
      { id: 'vocabulary', name: 'Vocabulary, Synonyms & Antonyms' },
      { id: 'idioms-phrases', name: 'Idioms & Phrases' },
      { id: 'reading-comprehension', name: 'Reading Comprehension' },
      { id: 'sentence-rearrangement', name: 'Sentence Rearrangement & Cloze Test' },
      { id: 'one-word-substitution', name: 'One Word Substitution & Spelling' }
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

/** Counts available questions per subject, split by test type. */
export function countQuestionsBySubject(questions) {
  const counts = {};
  for (const question of questions || []) {
    const key = `${question.categoryId}::${question.subjectId}`;
    if (!counts[key]) {
      counts[key] = { PYQ: 0, IMPORTANT: 0, PRACTICE: 0, total: 0 };
    }
    counts[key][normalizeQuestionType(question.questionType)] += 1;
    counts[key].total += 1;
  }
  return counts;
}

/** Filters a question list down to a single test. */
export function selectTestQuestions(questions, { categoryId, subjectId, questionType }) {
  const wanted = normalizeQuestionType(questionType);
  return (questions || []).filter(
    (question) =>
      question.categoryId === categoryId &&
      question.subjectId === subjectId &&
      normalizeQuestionType(question.questionType) === wanted
  );
}
