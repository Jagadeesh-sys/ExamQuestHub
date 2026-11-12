/**
 * Full Mock Test Series Configurations following official examination patterns.
 * - RRB NTPC CBT-1: 100 Qs | 90 Mins | 100 Marks | -0.33 Negative (30 Math, 30 Reasoning, 40 GA)
 * - SSC CGL Tier-1: 100 Qs | 60 Mins | 200 Marks | -0.50 Negative (25 Math, 25 Reasoning, 25 English, 25 GA)
 * - SSC CHSL Tier-1: 100 Qs | 60 Mins | 200 Marks | -0.50 Negative (25 Math, 25 Reasoning, 25 English, 25 GA)
 * - SSC MTS: 90 Qs | 90 Mins | 270 Marks | -1.0 Negative (Session 1 & Session 2)
 */

export const FULL_MOCK_SERIES = [
  // --- RRB NTPC CBT-1 Series ---
  {
    id: 'rrb-ntpc-cbt1-mock-01',
    examId: 'rrb-ntpc',
    examName: 'RRB NTPC',
    mockNumber: 'Mock 01',
    title: 'RRB NTPC CBT–1 Full Mock – 01',
    subtitle: 'Standard Level CBT · Official Pattern with Section Timing',
    pattern: '30 Math · 30 Reasoning · 40 General Awareness',
    questionsCount: 100,
    timeMinutes: 90,
    marks: 100,
    negativeMarking: '-0.25 Negative Marking',
    difficulty: 'Medium',
    difficultyBadge: 'bg-[#FEF9C3] text-[#854D0E]',
    isFree: true,
    attempts: '58.2K Attempts',
    agency: 'RRB',
    agencyColor: 'bg-[#FFE4E6] text-[#E11D48]',
    targetSubject: 'all',
    sections: [
      { name: 'Quantitative Aptitude', count: 30 },
      { name: 'General Intelligence & Reasoning', count: 30 },
      { name: 'General Awareness', count: 40 }
    ]
  },
  {
    id: 'ssc-cgl-tier1-mock-01',
    examId: 'ssc-cgl',
    examName: 'SSC CGL',
    mockNumber: 'Tier-1 Mock 01',
    title: 'SSC CGL Tier–I Mock – 01',
    subtitle: 'Official 60-Minute Tier-1 Pattern · 200 Marks Standard Test',
    pattern: '25 Reasoning · 25 GA · 25 Quant · 25 English',
    questionsCount: 100,
    timeMinutes: 60,
    marks: 200,
    negativeMarking: '-0.25 Negative Marking',
    difficulty: 'Medium',
    difficultyBadge: 'bg-[#FEF9C3] text-[#854D0E]',
    isFree: true,
    attempts: '42.6K Attempts',
    agency: 'SSC',
    agencyColor: 'bg-[#DCFCE7] text-[#15803D]',
    targetSubject: 'all',
    sections: [
      { name: 'General Intelligence & Reasoning', count: 25 },
      { name: 'General Awareness', count: 25 },
      { name: 'Quantitative Aptitude', count: 25 },
      { name: 'English Comprehension', count: 25 }
    ]
  },
  {
    id: 'rrb-ntpc-cbt1-mock-02',
    examId: 'rrb-ntpc',
    examName: 'RRB NTPC',
    mockNumber: 'Mock 02',
    title: 'RRB NTPC CBT–1 Full Mock – 02',
    subtitle: 'High-Yield Expected Questions · Complete CBT-1 Syllabus Revision',
    pattern: '30 Math · 30 Reasoning · 40 General Awareness',
    questionsCount: 100,
    timeMinutes: 90,
    marks: 100,
    negativeMarking: '-0.25 Negative Marking',
    difficulty: 'Hard',
    difficultyBadge: 'bg-[#F3E8FF] text-[#7E22CE]',
    isFree: true,
    attempts: '36.8K Attempts',
    agency: 'RRB',
    agencyColor: 'bg-[#FFE4E6] text-[#E11D48]',
    targetSubject: 'all',
    sections: [
      { name: 'Quantitative Aptitude', count: 30 },
      { name: 'General Intelligence & Reasoning', count: 30 },
      { name: 'General Awareness', count: 40 }
    ]
  },
  {
    id: 'rrb-ntpc-cbt1-mock-04',
    examId: 'rrb-ntpc',
    examName: 'RRB NTPC',
    mockNumber: 'Mock 04',
    title: 'RRB NTPC CBT-1 Full Mock Test 04',
    subtitle: 'Speed & Accuracy Booster · Latest 2025 Exam Paper Trends',
    pattern: '30 Math · 30 Reasoning · 40 General Awareness',
    questionsCount: 100,
    timeMinutes: 90,
    marks: 100,
    negativeMarking: '1/3 (-0.33)',
    difficulty: 'Medium',
    difficultyBadge: 'bg-[#FEF3C7] text-[#D97706]',
    isFree: true,
    attempts: '22.9K Attempts',
    agency: 'RRB',
    agencyColor: 'bg-[#EAF3FF] text-[#12345A]',
    targetSubject: 'all',
    sections: [
      { name: 'Quantitative Aptitude', count: 30 },
      { name: 'General Intelligence & Reasoning', count: 30 },
      { name: 'General Awareness', count: 40 }
    ]
  },
  {
    id: 'rrb-ntpc-cbt1-mock-05',
    examId: 'rrb-ntpc',
    examName: 'RRB NTPC',
    mockNumber: 'Mock 05',
    title: 'RRB NTPC CBT-1 Full Mock Test 05',
    subtitle: 'Comprehensive All India Rank Predictor · Full Authentic Pool',
    pattern: '30 Math · 30 Reasoning · 40 General Awareness',
    questionsCount: 100,
    timeMinutes: 90,
    marks: 100,
    negativeMarking: '1/3 (-0.33)',
    difficulty: 'Hard',
    difficultyBadge: 'bg-[#FEE2E2] text-[#DC2626]',
    isFree: true,
    attempts: '19.4K Attempts',
    agency: 'RRB',
    agencyColor: 'bg-[#EAF3FF] text-[#12345A]',
    targetSubject: 'all',
    sections: [
      { name: 'Quantitative Aptitude', count: 30 },
      { name: 'General Intelligence & Reasoning', count: 30 },
      { name: 'General Awareness', count: 40 }
    ]
  },
  {
    id: 'rrb-ntpc-cbt1-mock-06',
    examId: 'rrb-ntpc',
    examName: 'RRB NTPC',
    mockNumber: 'Mock 06',
    title: 'RRB NTPC CBT-1 Full Mock Test 06',
    subtitle: 'Pro Exam Simulator · Master Test Before the Real Exam',
    pattern: '30 Math · 30 Reasoning · 40 General Awareness',
    questionsCount: 100,
    timeMinutes: 90,
    marks: 100,
    negativeMarking: '1/3 (-0.33)',
    difficulty: 'Medium',
    difficultyBadge: 'bg-[#FEF3C7] text-[#D97706]',
    isFree: true,
    attempts: '16.7K Attempts',
    agency: 'RRB',
    agencyColor: 'bg-[#EAF3FF] text-[#12345A]',
    targetSubject: 'all',
    sections: [
      { name: 'Quantitative Aptitude', count: 30 },
      { name: 'General Intelligence & Reasoning', count: 30 },
      { name: 'General Awareness', count: 40 }
    ]
  },

  // --- SSC CGL Tier-1 Series (Continued) ---
  {
    id: 'ssc-cgl-tier1-mock-02',
    examId: 'ssc-cgl',
    examName: 'SSC CGL',
    mockNumber: 'Tier-1 Mock 02',
    title: 'SSC CGL Tier-1 Full Mock Test 02',
    subtitle: 'Speed & Time Management Specialist Test · Authentic Questions',
    pattern: '25 Reasoning · 25 GA · 25 Quant · 25 English',
    questionsCount: 100,
    timeMinutes: 60,
    marks: 200,
    negativeMarking: '0.50 (-0.5)',
    difficulty: 'Medium',
    difficultyBadge: 'bg-[#FEF3C7] text-[#D97706]',
    isFree: true,
    attempts: '41.8K Attempts',
    agency: 'SSC',
    agencyColor: 'bg-[#FEF08A] text-[#854D0E]',
    targetSubject: 'all',
    sections: [
      { name: 'General Intelligence & Reasoning', count: 25 },
      { name: 'General Awareness', count: 25 },
      { name: 'Quantitative Aptitude', count: 25 },
      { name: 'English Comprehension', count: 25 }
    ]
  },
  {
    id: 'ssc-cgl-tier1-mock-03',
    examId: 'ssc-cgl',
    examName: 'SSC CGL',
    mockNumber: 'Tier-1 Mock 03',
    title: 'SSC CGL Tier-1 Full Mock Test 03',
    subtitle: 'High Difficulty Rank Booster · Advanced Algebra, Geometry & Vocab',
    pattern: '25 Reasoning · 25 GA · 25 Quant · 25 English',
    questionsCount: 100,
    timeMinutes: 60,
    marks: 200,
    negativeMarking: '0.50 (-0.5)',
    difficulty: 'Hard',
    difficultyBadge: 'bg-[#FEE2E2] text-[#DC2626]',
    isFree: true,
    attempts: '33.5K Attempts',
    agency: 'SSC',
    agencyColor: 'bg-[#FEF08A] text-[#854D0E]',
    targetSubject: 'all',
    sections: [
      { name: 'General Intelligence & Reasoning', count: 25 },
      { name: 'General Awareness', count: 25 },
      { name: 'Quantitative Aptitude', count: 25 },
      { name: 'English Comprehension', count: 25 }
    ]
  },
  {
    id: 'ssc-cgl-tier1-mock-04',
    examId: 'ssc-cgl',
    examName: 'SSC CGL',
    mockNumber: 'Tier-1 Mock 04',
    title: 'SSC CGL Tier-1 Full Mock Test 04',
    subtitle: 'Recent 2026 Examination Trend Predictor Mock',
    pattern: '25 Reasoning · 25 GA · 25 Quant · 25 English',
    questionsCount: 100,
    timeMinutes: 60,
    marks: 200,
    negativeMarking: '0.50 (-0.5)',
    difficulty: 'Hard',
    difficultyBadge: 'bg-[#FEE2E2] text-[#DC2626]',
    isFree: true,
    attempts: '26.9K Attempts',
    agency: 'SSC',
    agencyColor: 'bg-[#FEF08A] text-[#854D0E]',
    targetSubject: 'all',
    sections: [
      { name: 'General Intelligence & Reasoning', count: 25 },
      { name: 'General Awareness', count: 25 },
      { name: 'Quantitative Aptitude', count: 25 },
      { name: 'English Comprehension', count: 25 }
    ]
  },

  // --- SSC CHSL Tier-1 Series ---
  {
    id: 'ssc-chsl-tier1-mock-01',
    examId: 'ssc-chsl',
    examName: 'SSC CHSL',
    mockNumber: 'Tier-1 Mock 01',
    title: 'SSC CHSL Tier-1 Full Mock Test 01',
    subtitle: 'Official 10+2 Combined Higher Secondary Level Pattern',
    pattern: '25 Reasoning · 25 GA · 25 Quant · 25 English',
    questionsCount: 100,
    timeMinutes: 60,
    marks: 200,
    negativeMarking: '0.50 (-0.5)',
    difficulty: 'Medium',
    difficultyBadge: 'bg-[#FEF3C7] text-[#D97706]',
    isFree: true,
    attempts: '38.4K Attempts',
    agency: 'SSC',
    agencyColor: 'bg-[#FEF08A] text-[#854D0E]',
    targetSubject: 'all',
    sections: [
      { name: 'General Intelligence', count: 25 },
      { name: 'General Awareness', count: 25 },
      { name: 'Quantitative Aptitude', count: 25 },
      { name: 'English Language', count: 25 }
    ]
  },
  {
    id: 'ssc-chsl-tier1-mock-02',
    examId: 'ssc-chsl',
    examName: 'SSC CHSL',
    mockNumber: 'Tier-1 Mock 02',
    title: 'SSC CHSL Tier-1 Full Mock Test 02',
    subtitle: 'Pro CHSL High Yield Practice Mock',
    pattern: '25 Reasoning · 25 GA · 25 Quant · 25 English',
    questionsCount: 100,
    timeMinutes: 60,
    marks: 200,
    negativeMarking: '0.50 (-0.5)',
    difficulty: 'Medium',
    difficultyBadge: 'bg-[#FEF3C7] text-[#D97706]',
    isFree: true,
    attempts: '21.7K Attempts',
    agency: 'SSC',
    agencyColor: 'bg-[#FEF08A] text-[#854D0E]',
    targetSubject: 'all',
    sections: [
      { name: 'General Intelligence', count: 25 },
      { name: 'General Awareness', count: 25 },
      { name: 'Quantitative Aptitude', count: 25 },
      { name: 'English Language', count: 25 }
    ]
  },

  // --- SSC MTS Series ---
  {
    id: 'ssc-mts-tier1-mock-01',
    examId: 'ssc-mts',
    examName: 'SSC MTS',
    mockNumber: 'Mock 01',
    title: 'SSC MTS Full Mock Test 01',
    subtitle: 'Session 1 (Qualifying 40 Qs) + Session 2 (Merit 50 Qs)',
    pattern: 'Session 1: 40 Qs (Math+Reas) · Session 2: 50 Qs (GA+Eng)',
    questionsCount: 90,
    timeMinutes: 90,
    marks: 270,
    negativeMarking: 'Session 2: -1.0',
    difficulty: 'Easy',
    difficultyBadge: 'bg-[#DCFCE7] text-[#166534]',
    isFree: true,
    attempts: '29.3K Attempts',
    agency: 'SSC',
    agencyColor: 'bg-[#FEF08A] text-[#854D0E]',
    targetSubject: 'all',
    sections: [
      { name: 'Session 1: Numerical Ability', count: 20 },
      { name: 'Session 1: Reasoning Ability', count: 20 },
      { name: 'Session 2: General Awareness', count: 25 },
      { name: 'Session 2: English Language', count: 25 }
    ]
  },
  {
    id: 'ssc-mts-tier1-mock-02',
    examId: 'ssc-mts',
    examName: 'SSC MTS',
    mockNumber: 'Mock 02',
    title: 'SSC MTS Full Mock Test 02',
    subtitle: 'Multi-Tasking Staff & Havaldar Complete CBT Simulator',
    pattern: 'Session 1: 40 Qs · Session 2: 50 Qs',
    questionsCount: 90,
    timeMinutes: 90,
    marks: 270,
    negativeMarking: 'Session 2: -1.0',
    difficulty: 'Medium',
    difficultyBadge: 'bg-[#FEF3C7] text-[#D97706]',
    isFree: true,
    attempts: '18.9K Attempts',
    agency: 'SSC',
    agencyColor: 'bg-[#FEF08A] text-[#854D0E]',
    targetSubject: 'all',
    sections: [
      { name: 'Session 1: Numerical Ability', count: 20 },
      { name: 'Session 1: Reasoning Ability', count: 20 },
      { name: 'Session 2: General Awareness', count: 25 },
      { name: 'Session 2: English Language', count: 25 }
    ]
  }
];

export const SECTIONAL_TESTS = [
  {
    id: 'sec-quant-01',
    subjectId: 'quantitative-aptitude',
    subjectName: 'Mathematics',
    title: 'Quantitative Aptitude – CBT Sectional Mock (30 Qs)',
    subtitle: 'Time & Work, Profit & Loss, SI/CI, Algebra, Mensuration',
    questionsCount: 30,
    timeMinutes: 30,
    marks: 30,
    isFree: true,
    agency: 'MATH',
    agencyColor: 'bg-[#DCFCE7] text-[#166534]'
  },
  {
    id: 'sec-reasoning-01',
    subjectId: 'reasoning',
    subjectName: 'Reasoning',
    title: 'Reasoning & Mental Ability – CBT Sectional Mock (30 Qs)',
    subtitle: 'Syllogisms, Puzzles, Series, Coding-Decoding, Blood Relations',
    questionsCount: 30,
    timeMinutes: 30,
    marks: 30,
    isFree: true,
    agency: 'REAS',
    agencyColor: 'bg-[#DBEAFE] text-[#1E40AF]'
  },
  {
    id: 'sec-gk-01',
    subjectId: 'general-knowledge',
    subjectName: 'General Awareness',
    title: 'General Awareness – Comprehensive Sectional Mock (40 Qs)',
    subtitle: 'History, Polity, Geography, Economy, Science & Static GK',
    questionsCount: 40,
    timeMinutes: 30,
    marks: 40,
    isFree: true,
    agency: 'GA',
    agencyColor: 'bg-[#FEF08A] text-[#854D0E]'
  },
  {
    id: 'sec-english-01',
    subjectId: 'english-language',
    subjectName: 'English Language',
    title: 'English Language – Tier-1 Sectional Mock (25 Qs)',
    subtitle: 'Grammar, Error Spotting, Synonyms, Antonyms, Cloze Test',
    questionsCount: 25,
    timeMinutes: 15,
    marks: 50,
    isFree: true,
    agency: 'ENG',
    agencyColor: 'bg-[#EFF6FF] text-[#1D4ED8]'
  },
  {
    id: 'sec-science-01',
    subjectId: 'general-science',
    subjectName: 'General Science',
    title: 'General Science – High Yield Speed Drill (25 Qs)',
    subtitle: 'Physics, Chemistry, Biology & Everyday Scientific Principles',
    questionsCount: 25,
    timeMinutes: 20,
    marks: 25,
    isFree: true,
    agency: 'SCI',
    agencyColor: 'bg-[#F3E8FF] text-[#6B21A8]'
  }
];
