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
  return (questions || []).filter((question) => {
    if (!question) return false;

    // 1. Verify Category matches
    const catMatch =
      question.categoryId === categoryId ||
      (categoryId === 'cse' && (question.categoryId === 'cse' || question.subjectId === 'computer-science' || question.subject === 'Computer Science')) ||
      (categoryId === 'quant' && (question.categoryId === 'quant' || question.subjectId === 'quantitative-aptitude' || question.subject === 'Quantitative Aptitude')) ||
      (categoryId === 'reasoning' && (question.categoryId === 'reasoning' || question.subjectId === 'reasoning' || question.subject === 'Reasoning')) ||
      (categoryId === 'english' && (question.categoryId === 'english' || question.subjectId === 'english-language' || question.subject === 'English Language')) ||
      (categoryId === 'gk' && (question.categoryId === 'gk' || question.subjectId === 'general-knowledge' || question.subjectId === 'general-science' || question.subjectId === 'current-affairs'));

    if (!catMatch) return false;

    // 2. Verify Subject / Topic matches
    let subMatch = question.subjectId === subjectId || question.topicId === subjectId;
    if (!subMatch && subjectId) {
      const cleanSub = String(subjectId).toLowerCase().replace(/[^a-z0-9]/g, '');
      const qTopic = String(question.topicId || question.subtopic || question.subjectId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (qTopic.includes(cleanSub) || cleanSub.includes(qTopic)) {
        subMatch = true;
      }
    }

    // Allow category-wide questions if subject pool is being filtered within category
    if (!subMatch && (categoryId === 'cse' || categoryId === 'quant' || categoryId === 'reasoning' || categoryId === 'english')) {
      if (question.categoryId === categoryId || (categoryId === 'cse' && question.subjectId === 'computer-science')) {
        subMatch = true;
      }
    }

    if (!subMatch) return false;

    // 3. Question Type verification
    if (!wanted) return true;
    return normalizeQuestionType(question.questionType) === wanted;
  });
}

/**
 * Complete Topic & Subtopic Taxonomy for each Subject.
 * Covers all official syllabus topics and subtopics requested by the user.
 */
export const SUBJECT_TOPIC_TAXONOMY = {
  'general-knowledge': {
    id: 'general-knowledge',
    title: 'General Knowledge',
    shortTitle: 'GK',
    themeColor: '#D97706',
    topics: [
      {
        id: 'indian-history',
        name: 'Indian History',
        description: 'Ancient, Medieval, Modern History & Indian National Movement',
        subtopics: [
          'Indus Valley Civilization & Vedic Age',
          'Buddhism & Jainism',
          'Maurya & Gupta Empires',
          'Delhi Sultanate & Mughal Empire',
          'Maratha Empire & Vijayanagara',
          'British East India Company Rule',
          'Revolt of 1857',
          'Indian Freedom Struggle (1885–1947)',
          'Governor Generals & Viceroys',
          'Social & Religious Reform Movements'
        ]
      },
      {
        id: 'indian-polity',
        name: 'Indian Polity & Constitution',
        description: 'Constitution, Governance, Judiciary, Parliament & Rights',
        subtopics: [
          'Indian Constitution',
          'Preamble',
          'Fundamental Rights',
          'Fundamental Duties',
          'Directive Principles of State Policy',
          'President',
          'Vice President',
          'Prime Minister',
          'Parliament',
          'Supreme Court',
          'High Courts',
          'Constitutional Amendments',
          'Emergency Provisions',
          'Union and State Government',
          'Panchayati Raj & Municipalities',
          'Election Commission & CAG'
        ]
      },
      {
        id: 'indian-geography',
        name: 'Indian Geography',
        description: 'Physical Geography, River Systems, Climate, Soil & Resources',
        subtopics: [
          'Physiographic Divisions of India',
          'Himalayas & Northern Plains',
          'Peninsular Plateau & Coastal Plains',
          'River Systems & Drainage (Himalayan & Peninsular)',
          'Monsoon & Climate of India',
          'Soils & Natural Vegetation of India',
          'Agriculture & Major Crops',
          'Mineral & Energy Resources',
          'National Parks & Biosphere Reserves',
          'Major Ports & Transport Networks'
        ]
      },
      {
        id: 'indian-economy',
        name: 'Indian Economy',
        description: 'National Income, Banking, Fiscal Policy, Inflation & NITI Aayog',
        subtopics: [
          'National Income & GDP/GNP Concepts',
          'Reserve Bank of India (RBI) & Monetary Policy',
          'Commercial Banking & Financial Institutions',
          'Inflation, Deflation & Price Indices (CPI, WPI)',
          'Union Budget & Public Finance',
          'Taxation Structure & GST',
          'Five Year Plans & NITI Aayog',
          'Poverty, Unemployment & Human Development',
          'Foreign Trade & Balance of Payments',
          'Stock Exchanges & SEBI'
        ]
      },
      {
        id: 'general-science',
        name: 'General Science',
        description: 'Integrated Physics, Chemistry and Biology for General Studies',
        subtopics: [
          'Everyday Physics & Natural Phenomena',
          'Chemical Substances in Daily Life',
          'Human Body & Vital Organs',
          'Health, Nutrition & Diseases',
          'Environmental Science & Ecology'
        ]
      },
      {
        id: 'physics',
        name: 'Physics',
        description: 'Mechanics, Optics, Thermodynamics, Electricity & Magnetism',
        subtopics: [
          'SI Units & Dimensions',
          'Laws of Motion & Gravitation',
          'Work, Power & Energy',
          'Light, Reflection & Refraction (Optics)',
          'Sound Waves & Acoustic Phenomena',
          'Electricity, Voltage, Current & Resistance',
          'Magnetism & Electromagnetism',
          'Nuclear Physics & Radioactivity'
        ]
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        description: 'Elements, Periodic Table, Acids, Bases, Salts & Metals',
        subtopics: [
          'Matter & Atomic Structure',
          'Periodic Table & Periodic Properties',
          'Acids, Bases, Salts & pH Scale',
          'Metals, Non-Metals & Alloys',
          'Carbon & Its Compounds',
          'Chemical Reactions & Equations',
          'Everyday Chemistry & Polymers'
        ]
      },
      {
        id: 'biology',
        name: 'Biology',
        description: 'Cell Biology, Genetics, Human Physiology & Plant Kingdoms',
        subtopics: [
          'Cell Structure, Functions & Organelles',
          'Plant Kingdom & Photosynthesis',
          'Animal Kingdom & Classification',
          'Human Digestive & Respiratory Systems',
          'Circulatory & Excretory Systems',
          'Nervous & Endocrine Systems',
          'Genetics & Heredity',
          'Vitamins, Deficiency Diseases & Immunity'
        ]
      },
      {
        id: 'static-gk',
        name: 'Static GK',
        description: 'Superlatives, Firsts in India, Dams, Airports & Monuments',
        subtopics: [
          'First in India & World (Male & Female)',
          'Longest, Highest, Largest & Smallest (Superlatives)',
          'Famous Monuments, UNESCO World Heritage Sites',
          'Major Dams, Reservoirs & Waterfalls',
          'Major Airports, Ports & Railway Zones',
          'Folk Dances, Classical Dances & Martial Arts',
          'State Capitals, Chief Ministers & Governors'
        ]
      },
      {
        id: 'art-culture',
        name: 'Art and Culture',
        description: 'Classical Dances, Folk Arts, Architecture, Music & Festivals',
        subtopics: [
          'Classical Dances of India (8 Forms)',
          'Folk Dances & Traditional Theatres',
          'Music Traditions (Hindustani & Carnatic)',
          'Temple Architecture (Nagara, Dravida, Vesara)',
          'Major Festivals of Indian States',
          'Traditional Handicrafts & GI Tags'
        ]
      },
      {
        id: 'awards-honours',
        name: 'Awards and Honours',
        description: 'Bharat Ratna, Padma Awards, Gallantry Awards, Nobel & Sports Honours',
        subtopics: [
          'Bharat Ratna & Padma Awards',
          'Military Gallantry Awards (Param Vir Chakra, etc.)',
          'Literary Awards (Jnanpith, Sahitya Akademi)',
          'Cinema & Media Awards (Dadasaheb Phalke, Oscars)',
          'Major Dhyan Chand Khel Ratna & Arjuna Awards',
          'Nobel Prizes, Booker Prize & Magsaysay Award'
        ]
      },
      {
        id: 'books-authors',
        name: 'Books and Authors',
        description: 'Historical Texts, Biographies, Autobiographies & Famous Authors',
        subtopics: [
          'Ancient & Medieval Literary Masterpieces',
          'Freedom Struggle Literature & Famous Slogans',
          'Autobiographies of World Leaders & Legends',
          'Notable Contemporary Books & Man Booker Winners'
        ]
      },
      {
        id: 'important-days',
        name: 'Important Days',
        description: 'National and International Commemorative Days and Annual Themes',
        subtopics: [
          'National Days of India (Pravasi Bharatiya, Republic, etc.)',
          'UN International Commemorative Days',
          'Environment, Wildlife & Health Days',
          'Science, Technology & Youth Days',
          'Annual Commemorative Themes'
        ]
      },
      {
        id: 'sports',
        name: 'Sports',
        description: 'Olympics, Asian Games, World Cups, Trophies & Terminology',
        subtopics: [
          'Olympic Games & Paralympics',
          'Asian Games & Commonwealth Games',
          'Cricket World Cups & ICC Tournaments',
          'FIFA World Cup & Football Championships',
          'Grand Slam Tennis Tournaments',
          'National Sports Cups & Trophies',
          'Sports Personalities & Terminology'
        ]
      },
      {
        id: 'organisations',
        name: 'National and International Organisations',
        description: 'UN Agencies, Bretton Woods, Regional Blocs & Indian Apex Bodies',
        subtopics: [
          'United Nations & Its Principal Organs',
          'UN Agencies (WHO, UNESCO, UNICEF, ILO, FAO)',
          'Bretton Woods Institutions (IMF, World Bank, WTO)',
          'Regional Blocs (SAARC, ASEAN, BRICS, G20, SCO)',
          'Indian Apex Bodies (ISRO, DRDO, RBI, SEBI, NITI Aayog)'
        ]
      }
    ]
  },

  'english-language': {
    id: 'english-language',
    title: 'English Language',
    shortTitle: 'English',
    themeColor: '#2563EB',
    topics: [
      {
        id: 'grammar',
        name: 'Grammar',
        description: 'Parts of Speech, Tenses, Subject-Verb Agreement, Articles & Prepositions',
        subtopics: [
          'Nouns, Pronouns & Adjectives',
          'Verbs, Tenses & Conditionals',
          'Subject-Verb Agreement',
          'Prepositions & Phrasal Verbs',
          'Articles, Determiners & Modifiers',
          'Conjunctions & Sentence Connectors'
        ]
      },
      {
        id: 'vocabulary',
        name: 'Vocabulary',
        description: 'Word Power, Synonyms, Antonyms, Contextual Meanings & Word Usage',
        subtopics: [
          'High-Frequency Competitive Vocab',
          'Contextual Word Meaning',
          'Confusing Words & Homonyms',
          'Spelling Rules & Misspelt Words',
          'One Word Substitutions'
        ]
      },
      {
        id: 'synonyms-antonyms',
        name: 'Synonyms and Antonyms',
        description: 'Precision Word Pairs, Nuances and Contextual Contrasts',
        subtopics: [
          'Frequently Tested Synonyms in SSC/Banking',
          'Frequently Tested Antonyms',
          'Contextual Opposites'
        ]
      },
      {
        id: 'error-detection',
        name: 'Error Detection',
        description: 'Spotting Grammatical, Syntactic and Idiomatic Errors in Sentences',
        subtopics: [
          'Subject-Verb Agreement Errors',
          'Tense & Aspect Inconsistency',
          'Misplaced Modifiers & Dangling Participles',
          'Prepositional & Idiomatic Slip-ups',
          'Parallelism & Conjunction Errors'
        ]
      },
      {
        id: 'sentence-improvement',
        name: 'Sentence Improvement',
        description: 'Upgrading Sentence Structure, Conciseness and Grammatical Correctness',
        subtopics: [
          'Replacing Awkward Phrasing',
          'Subjunctive Mood & Inversion',
          'Eliminating Redundancy',
          'Improving Idiomatic Usage'
        ]
      },
      {
        id: 'reading-comprehension',
        name: 'Reading Comprehension',
        description: 'Passage Analysis, Central Themes, Inference & Tone Identification',
        subtopics: [
          'Main Idea & Supporting Details',
          'Inference & Implicit Meaning',
          'Author Tone & Attitude',
          'Vocabulary in Passage Context',
          'Title & Central Theme Formulation'
        ]
      },
      {
        id: 'voice',
        name: 'Active and Passive Voice',
        description: 'Transformation of Active Sentences to Passive Across All Tenses',
        subtopics: [
          'Simple & Continuous Tense Voice Changes',
          'Perfect Tense Voice Transformations',
          'Imperative & Interrogative Sentences in Passive',
          'Modal Auxiliary Verbs in Passive Voice'
        ]
      },
      {
        id: 'speech',
        name: 'Direct and Indirect Speech',
        description: 'Narration Conversion, Reporting Verbs and Pronoun/Tense Shifts',
        subtopics: [
          'Assertive Sentence Conversion',
          'Interrogative Sentence Narration',
          'Imperative Sentence Commands & Requests',
          'Exclamatory & Optative Sentences'
        ]
      },
      {
        id: 'fill-in-the-blanks',
        name: 'Fill in the Blanks',
        description: 'Single and Double Fillers Testing Collocations and Grammar',
        subtopics: [
          'Grammar-Based Fillers',
          'Vocabulary & Collocation Fillers',
          'Double Fillers for Advanced Exams'
        ]
      },
      {
        id: 'cloze-test',
        name: 'Cloze Test',
        description: 'Paragraph Fillers Testing Flow, Cohesion and Vocabulary Fit',
        subtopics: [
          'Story-Based Cloze Tests',
          'Economic & Scientific Editorial Cloze Tests',
          'Grammar and Preposition-Centric Cloze Tests'
        ]
      }
    ]
  },

  'reasoning': {
    id: 'reasoning',
    title: 'Reasoning',
    shortTitle: 'Reasoning',
    themeColor: '#9333EA',
    topics: [
      {
        id: 'analogy',
        name: 'Analogy',
        description: 'Word, Letter and Number Analogies Testing Relationships',
        subtopics: [
          'Semantic & Word Analogies',
          'Alphabet & Letter-Shift Analogies',
          'Number & Mathematical Analogies',
          'General Knowledge-Based Analogies'
        ]
      },
      {
        id: 'classification',
        name: 'Classification',
        description: 'Spotting the Odd One Out in Groups of Words, Letters or Numbers',
        subtopics: [
          'Word Classification (Odd Word Out)',
          'Letter Group Classification',
          'Number Classification (Primes, Squares, Cubes)',
          'GK-Based Classification'
        ]
      },
      {
        id: 'number-series',
        name: 'Number Series',
        description: 'Progressions, Difference of Differences, Squares and Prime Sequences',
        subtopics: [
          'Arithmetic & Geometric Progressions',
          'Difference & Tiered Difference Series',
          'Square, Cube & Prime Pattern Series',
          'Alternating & Twin Number Series',
          'Wrong Number Identification in Series'
        ]
      },
      {
        id: 'alphabet-series',
        name: 'Alphabet Series',
        description: 'Continuous Letter Patterns, Letter Clusters and Gap Fillers',
        subtopics: [
          'Letter Position-Shift Series',
          'Continuous Pattern / Repeated Letter Series',
          'Alphanumeric Hybrid Series'
        ]
      },
      {
        id: 'coding-decoding',
        name: 'Coding and Decoding',
        description: 'Letter Coding, Substitution, Matrix Coding and Binary Ciphers',
        subtopics: [
          'Letter-Shift Coding (+N / -N)',
          'Opposite Letter Coding (A-Z, B-Y)',
          'Direct Substitution & Symbol Coding',
          'Fictitious Language / Chinese Coding',
          'Number-to-Word Matrix Coding'
        ]
      },
      {
        id: 'blood-relations',
        name: 'Blood Relations',
        description: 'Family Trees, Coded Relations (A+B means A is father of B) & Puzzles',
        subtopics: [
          'Single-Statement / Pointing-Type Relations',
          'Coded Blood Relations (Symbols A+B, A-B)',
          'Family Tree Structural Puzzles'
        ]
      },
      {
        id: 'direction-sense',
        name: 'Direction Sense',
        description: 'Navigational Turns, Angles, Shadow Problems & Shortest Path (Pythagoras)',
        subtopics: [
          'Cardinal & Intercardinal Directions',
          'Angular Rotations (Clockwise & Anti-clockwise)',
          'Shadow Problems at Sunrise & Sunset',
          'Shortest Distance by Pythagoras Theorem'
        ]
      },
      {
        id: 'ranking',
        name: 'Ranking',
        description: 'Order and Ranking in Rows, Overlapping Positions & Interchanges',
        subtopics: [
          'Finding Total Persons in a Row',
          'Position from Opposite End',
          'Interchange of Positions in a Line',
          'Ordering by Height, Age or Weight'
        ]
      },
      {
        id: 'syllogism',
        name: 'Syllogism',
        description: 'Venn Diagram Deductions, Only a Few, Possibility Cases',
        subtopics: [
          'Universal Affirmative & Negative (All/No)',
          'Particular Statements (Some/Some Not)',
          'Possibility Cases & "Can Be" Conclusions',
          'Modern Patterns: "Only a Few", "Each", "At Least"'
        ]
      },
      {
        id: 'venn-diagrams',
        name: 'Venn Diagrams',
        description: 'Geometric Regions, Category Overlaps and Set Unions',
        subtopics: [
          '3-Class Relational Venn Diagrams',
          'Numerical Venn Diagrams with Overlapping Sets',
          'Geometrical Figure Intersections (Circle, Triangle, Rectangle)'
        ]
      },
      {
        id: 'seating-arrangement',
        name: 'Seating Arrangement',
        description: 'Linear, Dual Row, Circular and Square Arrangements',
        subtopics: [
          'Linear Row Facing North / South',
          'Dual Parallel Rows Facing Each Other',
          'Circular Arrangement (Facing Center / Outside)',
          'Square & Rectangular Table Arrangements'
        ]
      },
      {
        id: 'puzzles',
        name: 'Puzzles',
        description: 'Floor Puzzles, Box Stacking, Day-Month Scheduling and Matrix Puzzles',
        subtopics: [
          'Floor & Flat Puzzles',
          'Box Stacking & Priority Ordering',
          'Day, Month & Year Scheduling Puzzles',
          'Multi-Attribute Matrix Matching'
        ]
      },
      {
        id: 'non-verbal',
        name: 'Non-Verbal Reasoning',
        description: 'Paper Folding, Mirror Images, Embedded Figures, Cubes and Dices',
        subtopics: [
          'Mirror & Water Images of Figures',
          'Paper Folding & Punch Cutting',
          'Embedded Figure Identification',
          'Figure Matrix & Figure Completion',
          'Cubes & Open Dice Unfolding'
        ]
      }
    ]
  },

  'quantitative-aptitude': {
    id: 'quantitative-aptitude',
    title: 'Quantitative Aptitude',
    shortTitle: 'Quant',
    themeColor: '#059669',
    topics: [
      {
        id: 'number-system',
        name: 'Number System',
        description: 'Divisibility Rules, Prime Factorization, Unit Digit, Remainder Theorem, LCM & HCF',
        subtopics: [
          'Classification of Numbers (Primes, Rationals, Reals)',
          'Divisibility Rules (2 through 19)',
          'Unit Digit & Cyclicity of Powers',
          'Remainder Theorem & Chinese Remainder',
          'LCM & HCF Word Problems & Relations',
          'Fractions, Decimals & Recurring Decimals',
          'Surds & Indices Laws'
        ]
      },
      {
        id: 'simplification',
        name: 'Simplification',
        description: 'BODMAS Rule, Algebraic Identities, Square & Cube Roots, Approximations',
        subtopics: [
          'BODMAS / VBODMAS Priority Rules',
          'Application of Algebraic Identities in Arithmetic',
          'Square Roots, Cube Roots & Power Reductions',
          'Approximation & Estimation for Fast Calculation'
        ]
      },
      {
        id: 'percentage',
        name: 'Percentage',
        description: 'Fraction-to-Percentage Conversions, Successive Changes, Population & Income-Expenditure',
        subtopics: [
          'Standard Fractional Equivalents (1/2 to 1/20)',
          'Successive Percentage Change Formula',
          'Price-Consumption-Expenditure Balancing',
          'Population Growth & Depreciation Formulae',
          'Income, Savings & Tax Percentage Problems'
        ]
      },
      {
        id: 'profit-loss',
        name: 'Profit and Loss',
        description: 'Cost Price, Selling Price, Marked Price, Discount, Dishonest Shopkeeper',
        subtopics: [
          'Basic Cost Price, Selling Price & Margin',
          'Marked Price & Single Equivalent Discount',
          'Dishonest Dealer & Faulty Weights',
          'Break-Even Points & Combined Sale Scenarios'
        ]
      },
      {
        id: 'ratio-proportion',
        name: 'Ratio and Proportion',
        description: 'Direct & Inverse Proportions, Mean/Third Proportional, Partnership & Age Problems',
        subtopics: [
          'Compounded & Duplicate Ratios',
          'Mean Proportional & Fourth Proportional',
          'Ratio Sharing & Coins Problems',
          'Problems Based on Ages',
          'Partnership Investments & Profit Distribution',
          'Alligation & Weighted Average of Mixtures'
        ]
      },
      {
        id: 'average',
        name: 'Average',
        description: 'Arithmetic Mean, Deviation Method, Replacement, Batsman / Bowler Averages',
        subtopics: [
          'Basic Formula & Consecutive Numbers Average',
          'Deviation Method for Fast Averaging',
          'Inclusion, Exclusion & Replacement in Groups',
          'Cricket Batting & Bowling Average Word Problems'
        ]
      },
      {
        id: 'time-work',
        name: 'Time and Work',
        description: 'Work Efficiency, Alternate Days, Man-Day-Hour (MDH) Formula, Pipes and Cisterns',
        subtopics: [
          'Individual Work Rates & LCM Method',
          'Alternate Days Working Scenarios',
          'Efficiency Ratios & Wage Distribution',
          'MDH (Men-Days-Hours) Formula Problems',
          'Inlet & Outlet Pipes in Cisterns'
        ]
      },
      {
        id: 'time-speed-distance',
        name: 'Time, Speed and Distance',
        description: 'Average Speed, Relative Speed, Train Length & Platform Crossing, Boats & Streams',
        subtopics: [
          'Units Conversion (km/h <-> m/s)',
          'Average Speed for Fixed Distance / Time',
          'Relative Speed in Same & Opposite Directions',
          'Trains Crossing Pole, Platform & Moving Trains',
          'Boats & Streams (Upstream, Downstream, Still Water)',
          'Circular Tracks & Head Starts in Races'
        ]
      },
      {
        id: 'interest',
        name: 'Simple and Compound Interest',
        description: 'Simple Interest Formula, Compounding Periods, Difference Between CI & SI, Installments',
        subtopics: [
          'Simple Interest & Varying Rates over Time',
          'Compound Interest with Annual, Half-Yearly Compounding',
          'Difference between CI and SI for 2 & 3 Years',
          'Equal Annual Loan Installments (EMI Problems)'
        ]
      },
      {
        id: 'geometry',
        name: 'Geometry',
        description: 'Lines, Angles, Triangles, Centers of Triangle, Circles, Chords & Tangents',
        subtopics: [
          'Parallel Lines & Transversal Angles',
          'Triangles: Congruence & Similarity Criteria',
          'Triangle Centers (Incenter, Circumcenter, Orthocenter, Centroid)',
          'Circles: Arc, Chord & Secant Theorems',
          'Tangents to a Circle & Common Tangents',
          'Cyclic Quadrilaterals & Chord Intersections'
        ]
      },
      {
        id: 'mensuration',
        name: 'Mensuration',
        description: '2D Perimeter & Area (Polygons, Circles), 3D Surface Area & Volume (Cylinder, Cone, Sphere)',
        subtopics: [
          '2D Polygons: Triangles, Rectangles, Parallelograms, Rhombus',
          'Circles, Sectors & Annulus Area',
          '3D Cubes, Cuboids & Cylinders',
          'Cones, Frustums & Spheres / Hemispheres',
          'Melting & Recasting 3D Shapes into New Forms'
        ]
      },
      {
        id: 'algebra',
        name: 'Algebra',
        description: 'Linear & Quadratic Equations, Polynomial Factorization, Maximum & Minimum Values',
        subtopics: [
          'Standard Algebraic Identities & Symmetry',
          'Quadratic Equations, Roots & Discriminant',
          'Linear Equations in Two Variables',
          'Remainder & Factor Theorem for Polynomials',
          'Maxima and Minima of Quadratic Expressions'
        ]
      },
      {
        id: 'trigonometry',
        name: 'Trigonometry',
        description: 'Ratios, Complementary Angles, Trigonometric Identities, Heights and Distances',
        subtopics: [
          'Trigonometric Ratios (sin, cos, tan, etc.)',
          'Values at Standard Angles (0, 30, 45, 60, 90)',
          'Fundamental Identities (sin^2 + cos^2 = 1)',
          'Complementary Angle Reductions',
          'Heights & Distances (Angle of Elevation & Depression)'
        ]
      },
      {
        id: 'data-interpretation',
        name: 'Data Interpretation',
        description: 'Bar Graphs, Pie Charts, Line Charts, Tables, Histograms and Caselets',
        subtopics: [
          'Table Charts & Matrix Data Evaluation',
          'Bar Graphs & Dual Bar Comparisons',
          'Pie Charts (Single & Dual Degree / Percentage Split)',
          'Line Graphs & Trend Analysis',
          'Caselet Paragraph DI with Variable Equations'
        ]
      }
    ]
  },

  'general-science': {
    id: 'general-science',
    title: 'General Science',
    shortTitle: 'Science',
    themeColor: '#7C3AED',
    topics: [
      {
        id: 'physics',
        name: 'Physics',
        description: 'Newtonian Mechanics, Thermodynamics, Waves, Optics, Electricity & Modern Physics',
        subtopics: [
          'Motion, Velocity, Acceleration & Momentum',
          'Newton\'s Laws of Motion & Friction',
          'Gravitation, Escape Velocity & Keplers Laws',
          'Hydrostatics, Atmospheric Pressure & Archimedes Principle',
          'Heat, Temperature Scales & Thermal Expansion',
          'Light: Mirrors, Lenses, Total Internal Reflection & Dispersion',
          'Electric Current, Ohm\'s Law & Resistance Combinations',
          'Nuclear Energy, Fission & Fusion'
        ]
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        description: 'Atomic Models, Chemical Bonding, Acids & Bases, Metallurgy, Everyday Chemicals',
        subtopics: [
          'Subatomic Particles & Isotopes/Isobars',
          'Chemical Bonding (Ionic, Covalent, Coordinate)',
          'Modern Periodic Table Groups & Trends',
          'Acids, Bases, Indicators & Neutralization',
          'Metals, Extraction & Corrosion Prevention',
          'Non-Metals (Hydrogen, Oxygen, Nitrogen, Carbon)',
          'Important Everyday Chemical Compounds & Formulae',
          'Chemical Reactions (Oxidation, Reduction, Redox)'
        ]
      },
      {
        id: 'biology',
        name: 'Biology',
        description: 'Cytology, Plant Physiology, Animal Physiology, Ecology & Evolution',
        subtopics: [
          'Cell Organelles: Mitochondria, Ribosomes, Nucleus',
          'Cell Division: Mitosis & Meiosis',
          'Plant Tissues (Xylem, Phloem, Meristem)',
          'Photosynthesis, Transpiration & Plant Hormones',
          'Ecosystems, Food Chains & Biogeochemical Cycles',
          'Biodiversity & Conservation of Flora and Fauna'
        ]
      },
      {
        id: 'human-body',
        name: 'Human Body',
        description: 'Anatomy, Vital Organ Systems, Hormones, Sensory Organs & Blood Groups',
        subtopics: [
          'Circulatory System & Human Heart Anatomy',
          'Blood Groups (ABO System, Rh Factor) & Components',
          'Digestive System & Digestive Enzymes',
          'Respiratory System & Gas Exchange',
          'Nervous System, Brain Parts & Reflex Action',
          'Endocrine Glands & Major Hormones (Insulin, Thyroid)',
          'Skeletal System, Bones & Joints in Human Body'
        ]
      },
      {
        id: 'diseases',
        name: 'Diseases',
        description: 'Infectious Diseases, Pathogens, Vaccines, Deficiencies & Lifestyle Disorders',
        subtopics: [
          'Bacterial Diseases (Tuberculosis, Cholera, Typhoid)',
          'Viral Diseases (Polio, Rabies, Hepatitis, Dengue)',
          'Protozoan & Fungal Diseases (Malaria, Ringworm)',
          'Vitamin & Mineral Deficiency Disorders',
          'Vaccines, Antibiotics & Immunity Mechanisms',
          'Genetic & Non-Communicable Lifestyle Diseases'
        ]
      },
      {
        id: 'scientific-instruments',
        name: 'Scientific Instruments',
        description: 'Measuring Devices, Principles of Operation, SI Units and Calibration',
        subtopics: [
          'Atmospheric & Pressure Gauges (Barometer, Manometer)',
          'Optical Instruments (Microscope, Telescope, Periscope)',
          'Electrical Measuring Devices (Ammeter, Voltmeter, Galvanometer)',
          'Specialized Detectors (Seismograph, Hygrometer, Lactometer)',
          'SI Base Units & Derived Scientific Units'
        ]
      },
      {
        id: 'inventions-discoveries',
        name: 'Inventions and Discoveries',
        description: 'Pioneering Scientists, Inventions, Nobel Breakthroughs and Milestones',
        subtopics: [
          'Major Physical Inventions (Dynamo, Telephone, Steam Engine)',
          'Chemical Breakthroughs (Periodic Law, Penicillin, Radium)',
          'Biological Discoveries (Blood Circulation, Cell, DNA Double Helix)',
          'Indian Scientists and Their Contributions (Raman, Bose, Kalam)'
        ]
      }
    ]
  },

  'computer-science': {
    id: 'computer-science',
    title: 'Computer Science',
    shortTitle: 'Computer',
    themeColor: '#0284C7',
    topics: [
      {
        id: 'fundamentals',
        name: 'Computer Fundamentals',
        description: 'Hardware, CPU Architecture, Memory Hierarchy, BIOS, Input/Output & MS Office',
        subtopics: [
          'Generations & Classification of Computers',
          'Von Neumann Architecture & CPU Components',
          'Primary Memory (RAM, ROM, Cache) & Secondary Storage',
          'Input and Output Peripherals',
          'BIOS, Booting Process & Firmware',
          'MS Office Suite (Word, Excel, PowerPoint) & Key Shortcuts'
        ]
      },
      {
        id: 'operating-systems',
        name: 'Operating Systems',
        description: 'Process Scheduling, Deadlocks, Memory Management, File Systems & Linux Commands',
        subtopics: [
          'Functions of OS & Types (Batch, Time-sharing, Real-time)',
          'Process States, PCB & CPU Scheduling Algorithms',
          'Process Synchronization & Deadlock Conditions',
          'Virtual Memory, Paging, Segmentation & Thrashing',
          'File Systems (FAT, NTFS, ext4) & Disk Scheduling',
          'Linux / Unix Shell Concepts & Fundamental Commands'
        ]
      },
      {
        id: 'dbms',
        name: 'DBMS',
        description: 'Relational Model, SQL Queries, Normalization, ACID Properties & Transactions',
        subtopics: [
          'ER Model, Entities, Attributes & Cardinality',
          'Relational Schemas, Primary, Foreign & Candidate Keys',
          'SQL DDL, DML, DQL Commands & Joins',
          'Functional Dependencies & Normalization (1NF, 2NF, 3NF, BCNF)',
          'ACID Properties, Transactions & Concurrency Control',
          'Indexing & Hashing for Fast Retrieval'
        ]
      },
      {
        id: 'networks',
        name: 'Computer Networks',
        description: 'OSI Reference Model, TCP/IP Suite, Routing, Switching, IP Addressing & Subnetting',
        subtopics: [
          'Network Topologies (Star, Mesh, Ring, Bus)',
          'OSI 7-Layer Model & Functions of Each Layer',
          'TCP/IP Protocol Suite & Differences from OSI',
          'IPv4 & IPv6 Addressing, Classes & Subnetting (CIDR)',
          'Routing Protocols & Hardware (Routers, Switches, Bridges)',
          'Application Protocols (HTTP, HTTPS, FTP, DNS, DHCP, SMTP)'
        ]
      },
      {
        id: 'programming',
        name: 'Programming Languages',
        description: 'Compilers, Interpreters, C/C++/Java/Python Basics & OOP Principles',
        subtopics: [
          'Compilers, Interpreters, Assemblers & Linkers',
          'Data Types, Variables, Scope & Control Flow',
          'Functions, Recursion & Parameter Passing',
          'Object-Oriented Programming (Encapsulation, Inheritance, Polymorphism)',
          'Pointers, Dynamic Memory Allocation & Garbage Collection'
        ]
      },
      {
        id: 'data-structures',
        name: 'Data Structures',
        description: 'Arrays, Stacks, Queues, Linked Lists, Trees, Graphs & Algorithm Complexity',
        subtopics: [
          'Asymptotic Notations (Big-O, Omega, Theta)',
          'Arrays, Strings & Matrix Manipulations',
          'Stacks (LIFO) & Applications (Infix to Postfix)',
          'Queues (FIFO), Circular Queues & Priority Queues',
          'Singly, Doubly & Circular Linked Lists',
          'Binary Trees, BST, Traversals (Inorder, Preorder, Postorder)',
          'Searching (Binary Search) & Sorting (Merge, Quick, Heap)'
        ]
      },
      {
        id: 'cyber-security',
        name: 'Cyber Security',
        description: 'Malware Types, Cryptography, Firewalls, Authentication & IT Act Provisions',
        subtopics: [
          'Malware Varieties (Viruses, Worms, Trojans, Ransomware)',
          'Attacks (Phishing, Spoofing, Denial of Service, Man-in-the-Middle)',
          'Cryptography (Symmetric vs Asymmetric, RSA, DES)',
          'Firewalls, IDS, IPS & Antivirus Protection',
          'Digital Signatures, SSL/TLS Certificates & Biometrics',
          'Cyber Ethics & India\'s Information Technology Act'
        ]
      },
      {
        id: 'web-tech',
        name: 'Internet and Web Technologies',
        description: 'Web Architecture, HTML/CSS/JS, URL Encoding, Cookies, Sessions & Cloud Basics',
        subtopics: [
          'Client-Server Architecture & World Wide Web (WWW)',
          'URLs, Domain Name System (DNS) Resolution',
          'HTML5 Structure, Semantic Tags & CSS Styling',
          'Client-Side Scripting, Cookies & Session Storage',
          'Cloud Computing Models (IaaS, PaaS, SaaS)'
        ]
      }
    ]
  },

  'current-affairs': {
    id: 'current-affairs',
    title: 'Current Affairs',
    shortTitle: 'Current Affairs',
    themeColor: '#E11D48',
    topics: [
      {
        id: 'national-affairs',
        name: 'National Affairs',
        description: 'Union Cabinet Decisions, State Initiatives, Infrastructure & Bills',
        subtopics: [
          'Key Union Cabinet Decisions & Acts',
          'State Government Initiatives & Welfare Policies',
          'National Infrastructure, Expressways & Bullet Trains',
          'Indices & National Rankings'
        ]
      },
      {
        id: 'international-summits',
        name: 'International Summits',
        description: 'G20, BRICS, SCO, UN Climate Summits & Bilateral Agreements',
        subtopics: [
          'G20 & G7 Leader Summits',
          'BRICS & SCO Summits and Expansions',
          'Bilateral MoUs Signed by India',
          'Global Indices (Human Development, Hunger, Press)'
        ]
      },
      {
        id: 'economy-banking',
        name: 'Economy and Banking',
        description: 'RBI Monetary Policy, GDP Forecasts, Mergers & Financial Regulations',
        subtopics: [
          'RBI Bi-monthly MPC Policy & Repo Rates',
          'GDP Forecasts by IMF, World Bank & ADB',
          'Banking Reforms, FinTech & Digital Rupee (CBDC)',
          'Budgetary Allocations & Economic Survey Highlights'
        ]
      },
      {
        id: 'defence-space',
        name: 'Defence and Space',
        description: 'ISRO Satellite Launches, Joint Military Exercises, Missiles & Warships',
        subtopics: [
          'ISRO Space Missions (Gaganyaan, Chandrayaan, PSLV/LVM3)',
          'Joint Bilateral Military Exercises',
          'Indigenous Warships, Submarines & Aircraft (INS Vikrant, Tejas)',
          'Missile Tests & Air Defence Systems'
        ]
      },
      {
        id: 'sports-events',
        name: 'Sports Events',
        description: 'Medals at Global Tournaments, Cricket Cups & National Games',
        subtopics: [
          'International Championships & Olympic Quotas',
          'Cricket World Cups, IPL & ICC Trophies',
          'National Games of India & Khelo India Games',
          'Major Records Broken in Athletics and Sports'
        ]
      },
      {
        id: 'awards-appointments',
        name: 'Awards and Appointments',
        description: 'Constitutional Appointments, CEOs, Ambassadors & Prestigious Awards',
        subtopics: [
          'Key Constitutional Appointments (CJIs, Election Commissioners)',
          'Heads of Apex Bodies (ISRO, DRDO, SEBI, SBI)',
          'International Organization Heads (UN, World Bank)',
          'Recent National & Global Award Laureates'
        ]
      },
      {
        id: 'government-schemes',
        name: 'Government Schemes',
        description: 'Central Welfare Schemes, Pradhan Mantri Yojanas, Portals & Targets',
        subtopics: [
          'Flagship Pradhan Mantri Yojanas (Jan Dhan, Awas, Mudra)',
          'Digital Public Infrastructure & Government Portals',
          'Agriculture, Farmer Welfare & Rural Development Schemes',
          'Health, Women & Child Empowerment Schemes'
        ]
      },
      {
        id: 'science-environment',
        name: 'Science and Environment',
        description: 'Climate Agreements, COP Summits, New Species, AI & Green Energy',
        subtopics: [
          'COP Climate Agreements & Renewable Energy Targets',
          'Ramsar Wetland Additions & Tiger Reserves',
          'AI Breakthroughs, Supercomputers & Semiconductors',
          'New Botanical & Zoological Discoveries in India'
        ]
      }
    ]
  }
};

/**
 * Returns all topics configured for a given subject ID.
 */
export function getTopicsForSubject(subjectId) {
  if (!subjectId || subjectId === 'all') {
    // Return all topics combined
    return Object.values(SUBJECT_TOPIC_TAXONOMY).flatMap((s) => s.topics);
  }
  return SUBJECT_TOPIC_TAXONOMY[subjectId]?.topics || [];
}

/**
 * Returns topic metadata by subjectId and topicId.
 */
export function getTopicMetadata(subjectId, topicId) {
  const topics = getTopicsForSubject(subjectId);
  return topics.find((t) => t.id === topicId) || null;
}

/**
 * Robust, deterministic question classifier.
 * Guarantees that every question is unambiguously tagged with its true subjectId
 * and mapped to an appropriate topic.
 */
export function classifyQuestion(question) {
  if (!question) {
    return {
      subjectId: 'general-knowledge',
      subjectName: 'General Knowledge',
      topicId: 'static-gk',
      topicName: 'Static GK',
      subtopic: 'Static GK & General Awareness'
    };
  }

  const rawSub = String(question.subject || question.subjectId || '').toLowerCase();
  const rawCat = String(question.categoryId || '').toLowerCase();
  const rawSubtopic = String(question.subtopic || '').toLowerCase();

  const safeQText = typeof question.question === 'string'
    ? question.question
    : (typeof question.question?.en === 'string'
        ? question.question.en
        : (typeof question.question?.te === 'string' ? question.question.te : ''));

  const safeOptsText = Array.isArray(question.options?.en)
    ? question.options.en.join(' ')
    : (question.options && typeof question.options === 'object'
        ? Object.values(question.options).filter(v => typeof v === 'string').join(' ')
        : '');

  const text = (
    safeQText +
    ' ' +
    (question.subtopic || '') +
    ' ' +
    safeOptsText
  ).toLowerCase();

  // 1. Current Affairs
  if (
    rawSub.includes('current-affairs') ||
    rawCat === 'ca' ||
    String(question.id || '').startsWith('dec25-') ||
    String(question.id || '').startsWith('nov25-') ||
    String(question.id || '').startsWith('oct25-') ||
    String(question.id || '').startsWith('jan26-')
  ) {
    let topicId = 'national-affairs';
    let topicName = 'National Affairs';
    if (text.includes('summit') || text.includes('g20') || text.includes('brics') || text.includes('treaty') || text.includes('mou')) {
      topicId = 'international-summits';
      topicName = 'International Summits';
    } else if (text.includes('rbi') || text.includes('repo') || text.includes('gdp') || text.includes('inflation') || text.includes('bank')) {
      topicId = 'economy-banking';
      topicName = 'Economy and Banking';
    } else if (text.includes('defence') || text.includes('isro') || text.includes('missile') || text.includes('exercise') || text.includes('satellite')) {
      topicId = 'defence-space';
      topicName = 'Defence and Space';
    } else if (text.includes('award') || text.includes('appointed') || text.includes('governor') || text.includes('honour')) {
      topicId = 'awards-appointments';
      topicName = 'Awards and Appointments';
    } else if (text.includes('olympic') || text.includes('cricket') || text.includes('trophy') || text.includes('cup') || text.includes('medal')) {
      topicId = 'sports-events';
      topicName = 'Sports Events';
    } else if (text.includes('scheme') || text.includes('yojana') || text.includes('portal') || text.includes('pradhan mantri')) {
      topicId = 'government-schemes';
      topicName = 'Government Schemes';
    } else if (text.includes('climate') || text.includes('cop') || text.includes('species') || text.includes('green energy')) {
      topicId = 'science-environment';
      topicName = 'Science and Environment';
    }
    return {
      subjectId: 'current-affairs',
      subjectName: 'Current Affairs',
      topicId,
      topicName,
      subtopic: question.subtopic || topicName
    };
  }

  // 2. English Language
  if (rawSub.includes('english') || rawCat === 'english' || (question.sectionName && question.sectionName.toLowerCase().includes('english'))) {
    let topicId = 'grammar';
    let topicName = 'Grammar';
    if (rawSubtopic.includes('idiom') || text.includes('idiom') || text.includes('phrase')) {
      topicId = 'vocabulary';
      topicName = 'Vocabulary';
    } else if (rawSubtopic.includes('synonym') || rawSubtopic.includes('antonym') || text.includes('synonym') || text.includes('antonym')) {
      topicId = 'synonyms-antonyms';
      topicName = 'Synonyms and Antonyms';
    } else if (rawSubtopic.includes('error') || text.includes('spotting error') || text.includes('error detection') || text.includes('contains an error')) {
      topicId = 'error-detection';
      topicName = 'Error Detection';
    } else if (rawSubtopic.includes('improvement') || text.includes('sentence improvement') || text.includes('improve the underlined')) {
      topicId = 'sentence-improvement';
      topicName = 'Sentence Improvement';
    } else if (rawSubtopic.includes('comprehension') || text.includes('reading comprehension') || text.includes('passage')) {
      topicId = 'reading-comprehension';
      topicName = 'Reading Comprehension';
    } else if (rawSubtopic.includes('voice') || text.includes('passive voice') || text.includes('active voice')) {
      topicId = 'voice';
      topicName = 'Active and Passive Voice';
    } else if (rawSubtopic.includes('speech') || text.includes('indirect speech') || text.includes('direct speech') || text.includes('reported speech')) {
      topicId = 'speech';
      topicName = 'Direct and Indirect Speech';
    } else if (rawSubtopic.includes('cloze') || text.includes('cloze test')) {
      topicId = 'cloze-test';
      topicName = 'Cloze Test';
    } else if (rawSubtopic.includes('blank') || text.includes('fill in the blank')) {
      topicId = 'fill-in-the-blanks';
      topicName = 'Fill in the Blanks';
    }
    return {
      subjectId: 'english-language',
      subjectName: 'English Language',
      topicId,
      topicName,
      subtopic: question.subtopic || topicName
    };
  }

  // 3. Quantitative Aptitude (strictly isolated)
  if (
    rawSub.includes('quant') ||
    rawSub.includes('math') ||
    rawCat === 'quant' ||
    (question.sectionName && question.sectionName.toLowerCase().includes('quantitative')) ||
    (question.sectionName && question.sectionName.toLowerCase().includes('mathematics'))
  ) {
    let topicId = 'number-system';
    let topicName = 'Number System';

    if (rawSubtopic.includes('data interpretation') || text.includes('bar graph') || text.includes('pie chart') || text.includes('histogram') || text.includes('table shows')) {
      topicId = 'data-interpretation';
      topicName = 'Data Interpretation';
    } else if (rawSubtopic.includes('trigonometry') || text.includes('trigonometr') || text.includes('sin ') || text.includes('cos ') || text.includes('tan ') || text.includes('cot ')) {
      topicId = 'trigonometry';
      topicName = 'Trigonometry';
    } else if (rawSubtopic.includes('algebra') || text.includes('polynomial') || text.includes('linear equation') || text.includes('quadratic')) {
      topicId = 'algebra';
      topicName = 'Algebra';
    } else if (rawSubtopic.includes('mensuration') || text.includes('cylinder') || text.includes('cone') || text.includes('sphere') || text.includes('perimeter') || text.includes('volume') || text.includes('surface area')) {
      topicId = 'mensuration';
      topicName = 'Mensuration';
    } else if (rawSubtopic.includes('geometry') || text.includes('triangle') || text.includes('circle') || text.includes('tangent') || text.includes('chord') || text.includes('angle of')) {
      topicId = 'geometry';
      topicName = 'Geometry';
    } else if (rawSubtopic.includes('interest') || text.includes('compound interest') || text.includes('simple interest') || text.includes('per annum')) {
      topicId = 'interest';
      topicName = 'Simple and Compound Interest';
    } else if (rawSubtopic.includes('time, speed') || text.includes('speed') || text.includes('distance') || text.includes('train') || text.includes('km/h') || text.includes('boat')) {
      topicId = 'time-speed-distance';
      topicName = 'Time, Speed and Distance';
    } else if (rawSubtopic.includes('time and work') || text.includes('days to finish') || text.includes('pipe') || text.includes('cistern') || text.includes('together can do')) {
      topicId = 'time-work';
      topicName = 'Time and Work';
    } else if (rawSubtopic.includes('profit') || text.includes('profit') || text.includes('loss') || text.includes('cost price') || text.includes('selling price') || text.includes('discount')) {
      topicId = 'profit-loss';
      topicName = 'Profit and Loss';
    } else if (rawSubtopic.includes('percentage') || text.includes('percent') || text.includes('% of')) {
      topicId = 'percentage';
      topicName = 'Percentage';
    } else if (rawSubtopic.includes('ratio') || text.includes('ratio') || text.includes('proportion') || text.includes('mixture') || text.includes('alloy')) {
      topicId = 'ratio-proportion';
      topicName = 'Ratio and Proportion';
    } else if (rawSubtopic.includes('average') || text.includes('average') || text.includes('mean')) {
      topicId = 'average';
      topicName = 'Average';
    } else if (rawSubtopic.includes('simplification') || text.includes('simplify') || text.includes('value of')) {
      topicId = 'simplification';
      topicName = 'Simplification';
    }

    return {
      subjectId: 'quantitative-aptitude',
      subjectName: 'Quantitative Aptitude',
      topicId,
      topicName,
      subtopic: question.subtopic || topicName
    };
  }

  // 4. Reasoning (strictly isolated)
  if (
    rawSub.includes('reason') ||
    rawCat === 'reasoning' ||
    (question.sectionName && question.sectionName.toLowerCase().includes('reasoning')) ||
    (question.sectionName && question.sectionName.toLowerCase().includes('intelligence'))
  ) {
    let topicId = 'number-series';
    let topicName = 'Number Series';

    if (rawSubtopic.includes('analogy') || text.includes('related to') || text.includes('same relationship') || text.includes('analogy')) {
      topicId = 'analogy';
      topicName = 'Analogy';
    } else if (rawSubtopic.includes('classification') || text.includes('odd one out') || text.includes('does not belong')) {
      topicId = 'classification';
      topicName = 'Classification';
    } else if (rawSubtopic.includes('coding') || text.includes('coded as') || text.includes('coding') || text.includes('written as')) {
      topicId = 'coding-decoding';
      topicName = 'Coding and Decoding';
    } else if (rawSubtopic.includes('blood') || text.includes('father') || text.includes('mother') || text.includes('sister') || text.includes('brother') || text.includes('daughter') || text.includes('son of')) {
      topicId = 'blood-relations';
      topicName = 'Blood Relations';
    } else if (rawSubtopic.includes('direction') || text.includes('turns left') || text.includes('turns right') || text.includes('facing north') || text.includes('shadow')) {
      topicId = 'direction-sense';
      topicName = 'Direction Sense';
    } else if (rawSubtopic.includes('ranking') || text.includes('rank') || text.includes('from the left') || text.includes('from the right') || text.includes('in a row')) {
      topicId = 'ranking';
      topicName = 'Ranking';
    } else if (rawSubtopic.includes('syllogism') || text.includes('statement') && text.includes('conclusion')) {
      topicId = 'syllogism';
      topicName = 'Syllogism';
    } else if (rawSubtopic.includes('venn') || text.includes('venn diagram')) {
      topicId = 'venn-diagrams';
      topicName = 'Venn Diagrams';
    } else if (rawSubtopic.includes('seating') || text.includes('seated around') || text.includes('sitting in a line') || text.includes('circular table')) {
      topicId = 'seating-arrangement';
      topicName = 'Seating Arrangement';
    } else if (rawSubtopic.includes('puzzle') || text.includes('box') && text.includes('stacked') || text.includes('floor')) {
      topicId = 'puzzles';
      topicName = 'Puzzles';
    } else if (rawSubtopic.includes('non-verbal') || text.includes('paper fold') || text.includes('mirror image') || text.includes('water image') || text.includes('embedded figure') || text.includes('dice')) {
      topicId = 'non-verbal';
      topicName = 'Non-Verbal Reasoning';
    } else if (rawSubtopic.includes('alphabet') || text.includes('letter series')) {
      topicId = 'alphabet-series';
      topicName = 'Alphabet Series';
    }

    return {
      subjectId: 'reasoning',
      subjectName: 'Reasoning',
      topicId,
      topicName,
      subtopic: question.subtopic || topicName
    };
  }

  // 5. Computer Science (strictly isolated from GS/GK)
  const isComputerKeywords =
    text.includes('operating system') ||
    text.includes('ms-dos') ||
    text.includes('linux') ||
    text.includes('windows') ||
    text.includes('kernel') ||
    text.includes('ip address') ||
    text.includes('tcp/ip') ||
    text.includes('osi model') ||
    text.includes('lan ') ||
    text.includes('wan ') ||
    text.includes('ethernet') ||
    text.includes('router') ||
    text.includes('database') ||
    text.includes('dbms') ||
    text.includes('sql') ||
    text.includes('rdbms') ||
    text.includes('compiler') ||
    text.includes('programming') ||
    text.includes('algorithm') ||
    text.includes('binary tree') ||
    text.includes('data structure') ||
    text.includes('motherboard') ||
    text.includes('microprocessor') ||
    text.includes('logic gate') ||
    text.includes('truth table') ||
    text.includes('ms excel') ||
    text.includes('ms word') ||
    text.includes('ms powerpoint') ||
    text.includes('spreadsheet') ||
    text.includes('malware') ||
    text.includes('antivirus') ||
    text.includes('phishing') ||
    text.includes('firewall') ||
    text.includes('cyber security') ||
    text.includes('hard disk') ||
    text.includes('cache memory') ||
    text.includes('system bus') ||
    text.includes('ascii') ||
    text.includes('ebcdic') ||
    text.includes('unicode') ||
    text.includes('peripheral') ||
    text.includes('supercomputer') ||
    text.includes('full form of ram') ||
    text.includes('full form of rom') ||
    text.includes('full form of cpu') ||
    text.includes('full form of url') ||
    text.includes('full form of http') ||
    text.includes('full form of html') ||
    text.includes('shortcut key in');

  if (
    rawSub.includes('computer') ||
    rawCat === 'cse' ||
    rawSubtopic.includes('operating systems') ||
    rawSubtopic.includes('database') ||
    rawSubtopic.includes('computer networks') ||
    rawSubtopic.includes('digital logic') ||
    rawSubtopic.includes('software engineering') ||
    rawSubtopic.includes('programming') ||
    rawSubtopic.includes('data structures') ||
    isComputerKeywords
  ) {
    let topicId = 'fundamentals';
    let topicName = 'Computer Fundamentals';

    if (rawSubtopic.includes('operating systems') || text.includes('operating system') || text.includes('windows') || text.includes('linux') || text.includes('kernel') || text.includes('ms-dos')) {
      topicId = 'operating-systems';
      topicName = 'Operating Systems';
    } else if (rawSubtopic.includes('database') || text.includes('dbms') || text.includes('sql') || text.includes('rdbms') || text.includes('relational')) {
      topicId = 'dbms';
      topicName = 'DBMS';
    } else if (rawSubtopic.includes('network') || text.includes('osi') || text.includes('tcp/ip') || text.includes('ip address') || text.includes('router') || text.includes('topology')) {
      topicId = 'networks';
      topicName = 'Computer Networks';
    } else if (rawSubtopic.includes('programming') || text.includes('compiler') || text.includes('oop') || text.includes('java') || text.includes('c++') || text.includes('python')) {
      topicId = 'programming';
      topicName = 'Programming Languages';
    } else if (rawSubtopic.includes('data structures') || text.includes('array') || text.includes('stack') || text.includes('queue') || text.includes('binary tree') || text.includes('linked list')) {
      topicId = 'data-structures';
      topicName = 'Data Structures';
    } else if (text.includes('malware') || text.includes('virus') || text.includes('firewall') || text.includes('cyber') || text.includes('cryptography')) {
      topicId = 'cyber-security';
      topicName = 'Cyber Security';
    } else if (text.includes('html') || text.includes('http') || text.includes('browser') || text.includes('url') || text.includes('cookie') || text.includes('web')) {
      topicId = 'web-tech';
      topicName = 'Internet and Web Technologies';
    }

    return {
      subjectId: 'computer-science',
      subjectName: 'Computer Science',
      topicId,
      topicName,
      subtopic: question.subtopic || topicName
    };
  }

  // 6. General Science (strictly isolated)
  if (
    rawSub.includes('general-science') ||
    rawSub.includes('general science') ||
    rawCat === 'general-science' ||
    rawCat === 'science' ||
    rawSubtopic.includes('physics') ||
    rawSubtopic.includes('chemistry') ||
    rawSubtopic.includes('biology')
  ) {
    let topicId = 'physics';
    let topicName = 'Physics';

    if (rawSubtopic.includes('chemistry') || text.includes('acid') || text.includes('base') || text.includes('periodic table') || text.includes('element') || text.includes('compound') || text.includes('chemical reaction')) {
      topicId = 'chemistry';
      topicName = 'Chemistry';
    } else if (rawSubtopic.includes('biology') || text.includes('cell') || text.includes('tissue') || text.includes('plant') || text.includes('photosynthesis')) {
      topicId = 'biology';
      topicName = 'Biology';
    } else if (text.includes('heart') || text.includes('blood group') || text.includes('digestive') || text.includes('brain') || text.includes('hormone') || text.includes('human')) {
      topicId = 'human-body';
      topicName = 'Human Body';
    } else if (text.includes('disease') || text.includes('vitamin') || text.includes('deficiency') || text.includes('bacteria') || text.includes('virus') || text.includes('malaria')) {
      topicId = 'diseases';
      topicName = 'Diseases';
    } else if (text.includes('barometer') || text.includes('seismograph') || text.includes('lactometer') || text.includes('measuring instrument') || text.includes('si unit')) {
      topicId = 'scientific-instruments';
      topicName = 'Scientific Instruments';
    } else if (text.includes('invented by') || text.includes('discovered by') || text.includes('discovery of')) {
      topicId = 'inventions-discoveries';
      topicName = 'Inventions and Discoveries';
    }

    return {
      subjectId: 'general-science',
      subjectName: 'General Science',
      topicId,
      topicName,
      subtopic: question.subtopic || topicName
    };
  }

  // 7. General Knowledge (default fallthrough for all GS questions)
  let gkTopicId = 'static-gk';
  let gkTopicName = 'Static GK';

  if (
    rawSubtopic.includes('polity') ||
    text.includes('constitution') ||
    text.includes('article ') ||
    text.includes('amendment') ||
    text.includes('parliament') ||
    text.includes('lok sabha') ||
    text.includes('rajya sabha') ||
    text.includes('president') ||
    text.includes('prime minister') ||
    text.includes('supreme court') ||
    text.includes('fundamental right') ||
    text.includes('directive principle')
  ) {
    gkTopicId = 'indian-polity';
    gkTopicName = 'Indian Polity';
  } else if (
    rawSubtopic.includes('history') ||
    text.includes('mughal') ||
    text.includes('british') ||
    text.includes('dynasty') ||
    text.includes('gandhi') ||
    text.includes('battle of') ||
    text.includes('revolt') ||
    text.includes('ancient') ||
    text.includes('medieval') ||
    text.includes('vedic') ||
    text.includes('harappa') ||
    text.includes('ashoka')
  ) {
    gkTopicId = 'indian-history';
    gkTopicName = 'Indian History';
  } else if (
    rawSubtopic.includes('geography') ||
    text.includes('river') ||
    text.includes('mountain') ||
    text.includes('plateau') ||
    text.includes('lake') ||
    text.includes('monsoon') ||
    text.includes('national park') ||
    text.includes('soil') ||
    text.includes('glacier') ||
    text.includes('tropic of')
  ) {
    gkTopicId = 'indian-geography';
    gkTopicName = 'Indian Geography';
  } else if (
    rawSubtopic.includes('economy') ||
    text.includes('gdp') ||
    text.includes('rbi') ||
    text.includes('budget') ||
    text.includes('inflation') ||
    text.includes('five year plan') ||
    text.includes('fiscal') ||
    text.includes('niti aayog')
  ) {
    gkTopicId = 'indian-economy';
    gkTopicName = 'Indian Economy';
  } else if (
    text.includes('dance') ||
    text.includes('festival') ||
    text.includes('temple') ||
    text.includes('music') ||
    text.includes('folk') ||
    text.includes('painting') ||
    text.includes('monument')
  ) {
    gkTopicId = 'art-culture';
    gkTopicName = 'Art and Culture';
  } else if (
    text.includes('award') ||
    text.includes('bharat ratna') ||
    text.includes('nobel') ||
    text.includes('padma') ||
    text.includes('oscar') ||
    text.includes('khel ratna') ||
    text.includes('gallantry')
  ) {
    gkTopicId = 'awards-honours';
    gkTopicName = 'Awards and Honours';
  } else if (
    text.includes('written by') ||
    text.includes('author of') ||
    text.includes('autobiography') ||
    text.includes('famous book')
  ) {
    gkTopicId = 'books-authors';
    gkTopicName = 'Books and Authors';
  } else if (
    text.includes('day is celebrated') ||
    text.includes('theme of') ||
    text.includes('international day') ||
    text.includes('world day') ||
    text.includes('celebrated on')
  ) {
    gkTopicId = 'important-days';
    gkTopicName = 'Important Days';
  } else if (
    text.includes('olympic') ||
    text.includes('cricket') ||
    text.includes('world cup') ||
    text.includes('badminton') ||
    text.includes('trophy') ||
    text.includes('stadium') ||
    text.includes('fifa')
  ) {
    gkTopicId = 'sports';
    gkTopicName = 'Sports';
  } else if (
    text.includes('united nations') ||
    text.includes('unesco') ||
    text.includes('unicef') ||
    text.includes('world bank') ||
    text.includes('imf') ||
    text.includes('headquarters of') ||
    text.includes('isro') ||
    text.includes('drdo')
  ) {
    gkTopicId = 'organisations';
    gkTopicName = 'National and International Organisations';
  }

  return {
    subjectId: 'general-knowledge',
    subjectName: 'General Knowledge',
    topicId: gkTopicId,
    topicName: gkTopicName,
    subtopic: question.subtopic || gkTopicName
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
