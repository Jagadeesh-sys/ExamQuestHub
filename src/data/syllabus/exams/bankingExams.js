import { buildExamSyllabus, fromBlueprint } from './examBuilder.js';

export const BANKING_EXAMS = [
  buildExamSyllabus({
    id: 'ibps-po',
    examCode: 'IBPS-PO',
    name: 'IBPS PO / MT (Probationary Officer)',
    shortName: 'IBPS PO',
    categoryId: 'banking',
    popular: true,
    authority: 'Institute of Banking Personnel Selection (ibps.in)',
    introduction:
      'Common Recruitment Process (CRP PO/MT) for Probationary Officers / Management Trainees across 11 Public Sector Banks in India.',
    qualification: 'Graduate Degree in any discipline from a recognized University (with working computer literacy).',
    ageLimit: '20 to 30 years.',
    selectionProcess: 'Preliminary Exam (Qualifying) → Main Exam (Objective 200 + Descriptive 25) → Interview (100 Marks) → 80:20 Final Merit.',
    stages: [
      { name: 'Preliminary Examination', mode: 'Online Objective (Sectional Timing)', qualifyingOnly: true, description: '100 Qs / 100 Marks in 60 minutes (20 mins per section).' },
      { name: 'Main Examination', mode: 'Online Objective + Descriptive', qualifyingOnly: false, description: '155 Objective Qs (200 Marks, 180 mins) + 2 Descriptive English Tasks (25 Marks, 30 mins).' },
      { name: 'Interview', mode: 'Panel Interview', qualifyingOnly: false, description: '100 Marks (Min 40% qualifying); Final ratio 80% Mains : 20% Interview.' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (100 Qs · 100 Marks · 60 Mins Sectional)',
        sections: [
          { subject: 'English Language (20 Mins)', questions: 30, marks: 30 },
          { subject: 'Quantitative Aptitude (20 Mins)', questions: 35, marks: 35 },
          { subject: 'Reasoning Ability (20 Mins)', questions: 35, marks: 35 }
        ]
      },
      {
        stageName: 'Mains (155 Obj + 2 Desc · 225 Marks · 3 Hrs 30 Mins)',
        sections: [
          { subject: 'Reasoning & Computer Aptitude (60 Mins)', questions: 45, marks: 60 },
          { subject: 'General / Economy / Banking Awareness (35 Mins)', questions: 40, marks: 40 },
          { subject: 'English Language (40 Mins)', questions: 35, marks: 40 },
          { subject: 'Data Analysis & Interpretation (45 Mins)', questions: 35, marks: 60 },
          { subject: 'Descriptive Test: Letter Writing & Essay (30 Mins)', questions: 2, marks: 25 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 100 | Mains: 155 Obj + 2 Desc',
    totalMarks: 'Prelims: 100 | Mains: 225 | Interview: 100',
    duration: 'Prelims: 60 Mins | Mains: 210 Mins',
    negativeMarking: '0.25 (1/4th) mark deducted per wrong answer in Prelims & Mains.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims & Mains Data Analysis' }),
      fromBlueprint('reasoning', { stageTag: 'Prelims & Mains High-Level Puzzles' }),
      fromBlueprint('general-awareness', { stageTag: 'Mains Banking & Economy Awareness', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-international-ca', 'ga-govt-schemes', 'ga-awards-honours', 'ga-important-days'] }),
      fromBlueprint('computer-it', { stageTag: 'Mains Computer Aptitude', includeChapterIds: ['cs-fundamentals', 'cs-number-systems', 'cs-networks', 'cs-cyber-security'] }),
      fromBlueprint('banking-specialized', { stageTag: 'Mains Descriptive Essay & Letter', includeChapterIds: ['bk-descriptive'] })
    ],
    practicalTechnicalTopics: ['High-Level Caselet DI, Seating/Scheduling Puzzles & Typed Descriptive Letter/Essay'],
    languages: ['English', 'Hindi (for Reasoning, Quant, GA & Computer)'],
    physicalStandards: null,
    skillTestDetails: 'Online typed Descriptive English (Letter + Essay) immediately after Mains objective.',
    interviewDetails: '100 Marks Interview (20% final weightage alongside 80% Mains score).',
    officialNotificationRef: 'IBPS CRP PO/MT-XV (2025/2026 Cycle)',
    officialWebsiteUrl: 'https://www.ibps.in',
    officialNotificationUrl: 'https://www.ibps.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ibps-clerk',
    examCode: 'IBPS-CLERK',
    name: 'IBPS Clerk / CSA (Customer Service Associate)',
    shortName: 'IBPS Clerk',
    categoryId: 'banking',
    popular: true,
    authority: 'Institute of Banking Personnel Selection (ibps.in)',
    introduction:
      'Recruits Clerical Cadre (Customer Service Associates) across Participating Public Sector Banks across States/UTs.',
    qualification: 'Graduate Degree in any discipline + Computer Literacy + Local/Official Language proficiency of the applied State/UT.',
    ageLimit: '20 to 28 years.',
    selectionProcess: 'Preliminary Exam → Main Exam (190 Qs / 200 Marks) → Local Language Proficiency Test (LPT — if not studied in 10th/12th).',
    stages: [
      { name: 'Prelims', mode: 'Online Objective', qualifyingOnly: true, description: '100 Qs / 100 Marks in 60 mins (20 mins per section).' },
      { name: 'Mains', mode: 'Online Objective', qualifyingOnly: false, description: '190 Qs / 200 Marks in 160 mins; sole determinant of final merit.' },
      { name: 'Language Proficiency Test (LPT)', mode: 'Qualifying Test', qualifyingOnly: true, description: 'Reading, writing & speaking proficiency in State official language.' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (100 Qs · 100 Marks · 60 Mins)',
        sections: [
          { subject: 'English Language (20 Mins)', questions: 30, marks: 30 },
          { subject: 'Numerical Ability (20 Mins)', questions: 35, marks: 35 },
          { subject: 'Reasoning Ability (20 Mins)', questions: 35, marks: 35 }
        ]
      },
      {
        stageName: 'Mains (190 Qs · 200 Marks · 160 Mins)',
        sections: [
          { subject: 'General / Financial Awareness (35 Mins)', questions: 50, marks: 50 },
          { subject: 'General English (35 Mins)', questions: 40, marks: 40 },
          { subject: 'Reasoning Ability & Computer Aptitude (45 Mins)', questions: 50, marks: 60 },
          { subject: 'Quantitative Aptitude (45 Mins)', questions: 50, marks: 50 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 100 Qs | Mains: 190 Qs',
    totalMarks: 'Prelims: 100 | Mains: 200',
    duration: 'Prelims: 60 Mins | Mains: 160 Mins',
    negativeMarking: '1/4th (0.25) mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('reasoning', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('general-awareness', { stageTag: 'Mains Financial Awareness', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-govt-schemes', 'ga-static-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Mains Computer Aptitude', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks'] })
    ],
    practicalTechnicalTopics: ['Speed Arithmetic, Simplification, Banking Terminology & State Language Reading/Writing'],
    languages: ['English', 'Hindi', '13 Regional Languages including Telugu (in Prelims & Mains except English section)'],
    physicalStandards: null,
    skillTestDetails: 'LPT (Local Language Proficiency Test) only for candidates without 10th/12th marksheet in the state language.',
    interviewDetails: 'No Interview (abolished for clerical posts).',
    officialNotificationRef: 'IBPS CRP CSA / Clerk XIV–XV (2025/2026 Cycle)',
    officialWebsiteUrl: 'https://www.ibps.in',
    officialNotificationUrl: 'https://www.ibps.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ibps-so',
    examCode: 'IBPS-SO',
    name: 'IBPS SO (Specialist Officer — IT, Agri, Law, HR, Marketing, Rajbhasha)',
    shortName: 'IBPS SO',
    categoryId: 'banking',
    authority: 'Institute of Banking Personnel Selection (ibps.in)',
    introduction:
      'Recruits Scale-I Specialist Officers across IT Officer, Agricultural Field Officer (AFO), Rajbhasha Adhikari, Law Officer, HR/Personnel Officer, and Marketing Officer.',
    qualification: 'Post-specific Professional Degree (B.Tech/MCA for IT, B.Sc. Agri for AFO, LLB for Law, MBA for HR/Marketing, PG Hindi/Sanskrit for Rajbhasha).',
    ageLimit: '20 to 30 years.',
    selectionProcess: 'Prelims (125 Marks) → Mains Professional Knowledge (60 Marks) → Interview (100 Marks) → 80:20 Final Merit.',
    stages: [
      { name: 'Prelims', mode: 'Online Objective', qualifyingOnly: true, description: '150 Qs / 125 Marks in 120 mins (English+Reasoning+Quant for IT/Agri/HR/Mktg; English+Reasoning+GA for Law/Rajbhasha).' },
      { name: 'Mains (Professional Knowledge)', mode: 'Online Objective (+2 Desc for Rajbhasha)', qualifyingOnly: false, description: '60 Qs / 60 Marks in 45 minutes strictly on Professional Stream.' },
      { name: 'Interview', mode: 'Panel Interview', qualifyingOnly: false, description: '100 Marks (80:20 Mains-to-Interview ratio).' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (IT / AFO / HR / Marketing · 150 Qs · 125 Marks · 120 Mins)',
        sections: [
          { subject: 'English Language (40 Mins)', questions: 50, marks: 25 },
          { subject: 'Reasoning (40 Mins)', questions: 50, marks: 50 },
          { subject: 'Quantitative Aptitude (or GA for Law/Rajbhasha — 40 Mins)', questions: 50, marks: 50 }
        ]
      },
      {
        stageName: 'Mains (60 Qs · 60 Marks · 45 Mins)',
        sections: [{ subject: 'Professional Knowledge (IT / Agriculture / Law / HR / Marketing / Rajbhasha)', questions: 60, marks: 60 }]
      }
    ],
    totalQuestions: 'Prelims: 150 | Mains: 60',
    totalMarks: 'Prelims: 125 | Mains: 60 + Interview: 100',
    duration: 'Prelims: 120 Mins | Mains: 45 Mins',
    negativeMarking: '1/4th mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Prelims (25 Marks)' }),
      fromBlueprint('reasoning', { stageTag: 'Prelims (50 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims (50 Marks)' }),
      fromBlueprint('eng-it', { stageTag: 'Mains Professional Knowledge (IT Officer)' }),
      fromBlueprint('banking-specialized', { stageTag: 'Mains ARD / Management Reference', includeChapterIds: ['bk-ard', 'bk-management'] })
    ],
    practicalTechnicalTopics: ['IT Officer: DBMS, SQL, Networking, Cyber Security, OS, SDLC | AFO: Soil Science, Agronomy, Animal Husbandry & Rural Banking | Law: Banking Acts (NI Act, SARFAESI, IBC, RBI/BR Act)'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'No separate skill test.',
    interviewDetails: '100 Marks Interview (20% final weightage).',
    officialNotificationRef: 'IBPS CRP SPL-XV (2025/2026 Cycle)',
    officialWebsiteUrl: 'https://www.ibps.in',
    officialNotificationUrl: 'https://www.ibps.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ibps-rrb-scale1',
    examCode: 'IBPS-RRB-S1',
    name: 'IBPS RRB Officer Scale I (Assistant Manager)',
    shortName: 'IBPS RRB Scale I',
    categoryId: 'banking',
    popular: true,
    authority: 'Institute of Banking Personnel Selection (for Regional Rural Banks)',
    introduction:
      'Recruits Group-A Officer Scale-I (Assistant Managers) across Regional Rural Banks (RRBs) nationwide.',
    qualification: 'Bachelor’s Degree in any discipline + Proficiency in Local Language of the participating RRB State.',
    ageLimit: '18 to 30 years.',
    selectionProcess: 'Prelims (80 Marks — No English in Prelims!) → Mains (200 Marks) → Interview (100 Marks) → 80:20 Final Merit.',
    stages: [
      { name: 'Prelims', mode: 'Online Objective', qualifyingOnly: true, description: '80 Qs / 80 Marks in 45 minutes (Reasoning 40 + Quantitative Aptitude 40).' },
      { name: 'Mains', mode: 'Online Objective', qualifyingOnly: false, description: '200 Qs / 200 Marks in 120 minutes (with choice between English & Hindi Language).' },
      { name: 'Interview', mode: 'NABARD/RRB Panel', qualifyingOnly: false, description: '100 Marks (80:20 ratio).' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (80 Qs · 80 Marks · 45 Mins)',
        sections: [
          { subject: 'Reasoning', questions: 40, marks: 40 },
          { subject: 'Quantitative Aptitude', questions: 40, marks: 40 }
        ]
      },
      {
        stageName: 'Mains (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'Reasoning (1.25 Marks/Q)', questions: 40, marks: 50 },
          { subject: 'Computer Knowledge (0.50 Marks/Q)', questions: 40, marks: 20 },
          { subject: 'General Awareness', questions: 40, marks: 40 },
          { subject: 'English Language OR Hindi Language', questions: 40, marks: 40 },
          { subject: 'Quantitative Aptitude (1.25 Marks/Q)', questions: 40, marks: 50 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 80 | Mains: 200',
    totalMarks: 'Prelims: 80 | Mains: 200 + Interview: 100',
    duration: 'Prelims: 45 Mins | Mains: 120 Mins',
    negativeMarking: '1/4th (0.25) of marks assigned to that question.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('general-awareness', { stageTag: 'Mains (40 Marks)', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-govt-schemes', 'ga-static-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Mains Computer (20 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-dbms'] }),
      fromBlueprint('english-language', { stageTag: 'Mains English/Hindi Option (40 Marks)' })
    ],
    practicalTechnicalTopics: ['Rural Banking Schemes, Priority Sector Lending (PSL), KCC & NABARD Refinance Awareness'],
    languages: ['English', 'Hindi', 'Regional Languages (including Telugu)'],
    physicalStandards: null,
    skillTestDetails: 'Local language proficiency check.',
    interviewDetails: '100 Marks Interview (80:20 weightage).',
    officialNotificationRef: 'IBPS CRP RRBs-XIV (2025/2026 Cycle)',
    officialWebsiteUrl: 'https://www.ibps.in',
    officialNotificationUrl: 'https://www.ibps.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ibps-rrb-scale2',
    examCode: 'IBPS-RRB-S2',
    name: 'IBPS RRB Officer Scale II (General Banking & Specialist Officers)',
    shortName: 'IBPS RRB Scale II',
    categoryId: 'banking',
    authority: 'Institute of Banking Personnel Selection (ibps.in)',
    introduction:
      'Direct Single-Exam + Interview recruitment for Experienced Middle-Management Officers (Manager Scale-II) in General Banking, IT, CA, Law, Treasury, Marketing, and Agriculture.',
    qualification: 'Bachelor’s/Professional Degree (50% marks) + 2 years (1 year for Law/CA/Specialist) relevant experience.',
    ageLimit: '21 to 32 years.',
    selectionProcess: 'Single Online Examination (200 Marks) → Interview (100 Marks) → 80:20 Final Merit.',
    stages: [
      { name: 'Single Online Exam', mode: 'Online Objective', qualifyingOnly: false, description: 'GBO: 200 Qs / 200 Marks (120 mins) | Specialist: 240 Qs / 200 Marks (150 mins including Professional Knowledge).' },
      { name: 'Interview', mode: 'Panel Interview', qualifyingOnly: false, description: '100 Marks.' }
    ],
    examPattern: [
      {
        stageName: 'General Banking Officer (GBO · 200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'Reasoning (1.25 Marks/Q)', questions: 40, marks: 50 },
          { subject: 'Financial Awareness', questions: 40, marks: 40 },
          { subject: 'English Language OR Hindi Language', questions: 40, marks: 40 },
          { subject: 'Computer Knowledge (0.50 Marks/Q)', questions: 40, marks: 20 },
          { subject: 'Quantitative Aptitude & Data Interpretation (1.25 Marks/Q)', questions: 40, marks: 50 }
        ]
      }
    ],
    totalQuestions: 'GBO: 200 Qs | Specialist: 240 Qs',
    totalMarks: '200 Marks (Single Exam) + 100 Interview',
    duration: 'GBO: 120 Mins | Specialist: 150 Mins',
    negativeMarking: '1/4th mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Single Exam (50 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'Financial Awareness (40 Marks)', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-govt-schemes'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Quant & DI (50 Marks)' }),
      fromBlueprint('computer-it', { stageTag: 'Computer Knowledge (20 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-cyber-security'] }),
      fromBlueprint('english-language', { stageTag: 'English/Hindi Option (40 Marks)' })
    ],
    practicalTechnicalTopics: ['Specialist Streams: Core Banking IT/CBS, Basel III Risk, Treasury Operations, Agricultural Credit & NPA Recovery'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: '100 Marks Interview.',
    officialNotificationRef: 'IBPS CRP RRBs Scale-II Official Pattern',
    officialWebsiteUrl: 'https://www.ibps.in',
    officialNotificationUrl: 'https://www.ibps.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ibps-rrb-scale3',
    examCode: 'IBPS-RRB-S3',
    name: 'IBPS RRB Officer Scale III (Senior Manager)',
    shortName: 'IBPS RRB Scale III',
    categoryId: 'banking',
    authority: 'Institute of Banking Personnel Selection (ibps.in)',
    introduction:
      'Recruits Senior Managers (Scale-III) in Regional Rural Banks with minimum 5 years of Banking/Financial Institution officer experience.',
    qualification: 'Bachelor’s Degree (minimum 50% marks) + 5 years experience as an Officer in a Bank or Financial Institution.',
    ageLimit: '21 to 40 years.',
    selectionProcess: 'Single Online Examination (200 Marks) → Interview (100 Marks).',
    stages: [
      { name: 'Single Online Exam', mode: 'Online Objective', qualifyingOnly: false, description: '200 Qs / 200 Marks in 120 minutes.' },
      { name: 'Interview', mode: 'Panel Interview', qualifyingOnly: false, description: '100 Marks.' }
    ],
    examPattern: [
      {
        stageName: 'Single Online Exam (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'Reasoning (1.25 Marks/Q)', questions: 40, marks: 50 },
          { subject: 'Financial Awareness', questions: 40, marks: 40 },
          { subject: 'English Language OR Hindi Language', questions: 40, marks: 40 },
          { subject: 'Computer Knowledge (0.50 Marks/Q)', questions: 40, marks: 20 },
          { subject: 'Quantitative Aptitude & Data Interpretation (1.25 Marks/Q)', questions: 40, marks: 50 }
        ]
      }
    ],
    totalQuestions: '200 Questions',
    totalMarks: '200 Marks + 100 Interview',
    duration: '120 Minutes',
    negativeMarking: '1/4th mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Single Exam (50 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'Financial Awareness (40 Marks)', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-govt-schemes'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Quant & DI (50 Marks)' }),
      fromBlueprint('computer-it', { stageTag: 'Computer Knowledge (20 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-cyber-security'] }),
      fromBlueprint('english-language', { stageTag: 'English/Hindi Option (40 Marks)' })
    ],
    practicalTechnicalTopics: ['Branch Credit Appraisal, RBI Prudential Norms, Treasury Management & Audit Compliance'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: '100 Marks Interview.',
    officialNotificationRef: 'IBPS CRP RRBs Scale-III Official Pattern',
    officialWebsiteUrl: 'https://www.ibps.in',
    officialNotificationUrl: 'https://www.ibps.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ibps-rrb-office-assistant',
    examCode: 'IBPS-RRB-OA',
    name: 'IBPS RRB Office Assistant (Multipurpose)',
    shortName: 'IBPS RRB Clerk / OA',
    categoryId: 'banking',
    popular: true,
    authority: 'Institute of Banking Personnel Selection (ibps.in)',
    introduction:
      'Clerical cadre recruitment for Office Assistants (Multipurpose) in Regional Rural Banks across States.',
    qualification: 'Bachelor’s Degree in any discipline + Proficiency in Local Language + Working knowledge of Computer.',
    ageLimit: '18 to 28 years.',
    selectionProcess: 'Prelims (80 Marks — Reasoning & Numerical Ability) → Mains (200 Marks) → Document Verification.',
    stages: [
      { name: 'Prelims', mode: 'Online Objective', qualifyingOnly: true, description: '80 Qs / 80 Marks in 45 minutes.' },
      { name: 'Mains', mode: 'Online Objective', qualifyingOnly: false, description: '200 Qs / 200 Marks in 120 minutes; No Interview.' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (80 Qs · 80 Marks · 45 Mins)',
        sections: [
          { subject: 'Reasoning', questions: 40, marks: 40 },
          { subject: 'Numerical Ability', questions: 40, marks: 40 }
        ]
      },
      {
        stageName: 'Mains (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'Reasoning (1.25 Marks/Q)', questions: 40, marks: 50 },
          { subject: 'Computer Knowledge (0.50 Marks/Q)', questions: 40, marks: 20 },
          { subject: 'General Awareness', questions: 40, marks: 40 },
          { subject: 'English Language OR Hindi Language', questions: 40, marks: 40 },
          { subject: 'Numerical Ability (1.25 Marks/Q)', questions: 40, marks: 50 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 80 | Mains: 200',
    totalMarks: 'Prelims: 80 | Mains: 200',
    duration: 'Prelims: 45 Mins | Mains: 120 Mins',
    negativeMarking: '1/4th mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims & Mains Numerical Ability' }),
      fromBlueprint('general-awareness', { stageTag: 'Mains (40 Marks)', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-govt-schemes', 'ga-static-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Mains (20 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks'] }),
      fromBlueprint('english-language', { stageTag: 'Mains English/Hindi Option (40 Marks)' })
    ],
    practicalTechnicalTopics: ['High-speed Simplification, Number Series & Regional Rural Banking Awareness'],
    languages: ['English', 'Hindi', 'Regional Languages including Telugu'],
    physicalStandards: null,
    skillTestDetails: 'Local language verification.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'IBPS CRP RRBs Office Assistant Official Pattern',
    officialWebsiteUrl: 'https://www.ibps.in',
    officialNotificationUrl: 'https://www.ibps.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'sbi-po',
    examCode: 'SBI-PO',
    name: 'SBI PO (State Bank of India Probationary Officer)',
    shortName: 'SBI PO',
    categoryId: 'banking',
    popular: true,
    authority: 'State Bank of India (sbi.co.in/careers)',
    introduction:
      'Recruits Junior Management Grade Scale-I (JMGS-I) Probationary Officers in State Bank of India.',
    qualification: 'Graduation in any discipline (final-year students eligible provisionally).',
    ageLimit: '21 to 30 years.',
    selectionProcess: 'Phase-I Prelims (100 Marks) → Phase-II Mains (200 Obj + 50 Desc) → Phase-III Psychometric Test + Group Exercise (20) & Interview (30) → 75:25 Normalized Final Merit.',
    stages: [
      { name: 'Phase-I Preliminary Exam', mode: 'Online Objective', qualifyingOnly: true, description: '100 Qs / 100 Marks in 60 mins (No sectional cutoff in SBI PO Prelims; 10x merit).' },
      { name: 'Phase-II Main Exam', mode: 'Online Objective + Descriptive', qualifyingOnly: false, description: '155 Objective Qs (200 Marks, 3 hrs) + 2 Descriptive English (50 Marks, 30 mins).' },
      { name: 'Phase-III Psychometric, Group Exercise & Interview', mode: 'Psychometric + GD + Interview', qualifyingOnly: false, description: 'Psychometric test + GE (20 Marks) + Interview (30 Marks) = 50 Marks normalized to 25% alongside 75% Mains.' }
    ],
    examPattern: [
      {
        stageName: 'Phase-I Prelims (100 Qs · 100 Marks · 60 Mins)',
        sections: [
          { subject: 'English Language (20 Mins)', questions: 30, marks: 30 },
          { subject: 'Quantitative Aptitude (20 Mins)', questions: 35, marks: 35 },
          { subject: 'Reasoning Ability (20 Mins)', questions: 35, marks: 35 }
        ]
      },
      {
        stageName: 'Phase-II Mains (200 Objective + 50 Descriptive = 250 Marks · 3 Hrs 30 Mins)',
        sections: [
          { subject: 'Reasoning & Computer Aptitude (50 Mins)', questions: 40, marks: 50 },
          { subject: 'Data Analysis & Interpretation (45 Mins)', questions: 30, marks: 50 },
          { subject: 'General / Economy / Banking Awareness (45 Mins)', questions: 50, marks: 60 },
          { subject: 'English Language (40 Mins)', questions: 35, marks: 40 },
          { subject: 'Descriptive Test: Letter Writing & Essay (30 Mins)', questions: 2, marks: 50 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 100 | Mains: 155 Obj + 2 Desc',
    totalMarks: 'Prelims: 100 | Mains: 250 | Phase-III: 50',
    duration: 'Prelims: 60 Mins | Mains: 210 Mins',
    negativeMarking: '1/4th mark deducted per wrong answer in Objective tests.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims & Mains Data Analysis' }),
      fromBlueprint('reasoning', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('general-awareness', { stageTag: 'Mains Banking & Economy (60 Marks)', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-international-ca', 'ga-govt-schemes'] }),
      fromBlueprint('computer-it', { stageTag: 'Mains Computer Aptitude', includeChapterIds: ['cs-fundamentals', 'cs-number-systems', 'cs-networks', 'cs-cyber-security'] }),
      fromBlueprint('banking-specialized', { stageTag: 'Mains Descriptive Essay & Letter (50 Marks)', includeChapterIds: ['bk-descriptive'] })
    ],
    practicalTechnicalTopics: ['SBI Psychometric Personality Assessment, Group Exercise Prioritization & Descriptive Essay/Letter'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'Descriptive typing test (50 Marks) + Group Exercise (20 Marks).',
    interviewDetails: 'Phase-III carries 50 Marks (20 GE + 30 Interview) scaled to 25% of final merit.',
    officialNotificationRef: 'SBI PO Recruitment Cycle (2025/2026)',
    officialWebsiteUrl: 'https://sbi.co.in/web/careers',
    officialNotificationUrl: 'https://sbi.co.in/web/careers',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'sbi-clerk',
    examCode: 'SBI-CLERK',
    name: 'SBI Clerk (Junior Associate — Customer Support & Sales)',
    shortName: 'SBI Clerk',
    categoryId: 'banking',
    popular: true,
    authority: 'State Bank of India (sbi.co.in/careers)',
    introduction:
      'Recruits Junior Associates (Customer Support & Sales) in State Bank of India clerical cadre across State/Circle circles.',
    qualification: 'Graduation in any discipline + Proficiency in specified opted local language.',
    ageLimit: '20 to 28 years.',
    selectionProcess: 'Preliminary Exam (100 Marks) → Main Exam (200 Marks) → Local Language Test (Qualifying) → Final Selection (No Interview).',
    stages: [
      { name: 'Phase-I Prelims', mode: 'Online Objective', qualifyingOnly: true, description: '100 Qs / 100 Marks in 60 mins (No sectional cutoff).' },
      { name: 'Phase-II Mains', mode: 'Online Objective', qualifyingOnly: false, description: '190 Qs / 200 Marks in 160 mins; sole merit stage.' },
      { name: 'Specified Opted Local Language Test', mode: 'Qualifying Test', qualifyingOnly: true, description: 'Exempted if candidate studied the opted local language in 10th/12th.' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (100 Qs · 100 Marks · 60 Mins)',
        sections: [
          { subject: 'English Language (20 Mins)', questions: 30, marks: 30 },
          { subject: 'Numerical Ability (20 Mins)', questions: 35, marks: 35 },
          { subject: 'Reasoning Ability (20 Mins)', questions: 35, marks: 35 }
        ]
      },
      {
        stageName: 'Mains (190 Qs · 200 Marks · 160 Mins)',
        sections: [
          { subject: 'General / Financial Awareness (35 Mins)', questions: 50, marks: 50 },
          { subject: 'General English (35 Mins)', questions: 40, marks: 40 },
          { subject: 'Quantitative Aptitude (45 Mins)', questions: 50, marks: 50 },
          { subject: 'Reasoning Ability & Computer Aptitude (45 Mins)', questions: 50, marks: 60 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 100 | Mains: 190',
    totalMarks: 'Prelims: 100 | Mains: 200',
    duration: 'Prelims: 60 Mins | Mains: 160 Mins',
    negativeMarking: '1/4th mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('reasoning', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('general-awareness', { stageTag: 'Mains Financial Awareness (50 Marks)', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-govt-schemes', 'ga-static-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Mains Computer Aptitude', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks'] })
    ],
    practicalTechnicalTopics: ['No Sectional Cutoffs in Prelims/Mains; high-accuracy speed calculation & banking awareness'],
    languages: ['English', 'Hindi', '13 Regional Languages including Telugu'],
    physicalStandards: null,
    skillTestDetails: 'Local language proficiency check if not on 10th/12th certificate.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SBI Junior Associates 2025/2026 Cycle',
    officialWebsiteUrl: 'https://sbi.co.in/web/careers',
    officialNotificationUrl: 'https://sbi.co.in/web/careers',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'sbi-so',
    examCode: 'SBI-SO',
    name: 'SBI SO (Specialist Cadre Officers — Systems, Credit, Wealth, Law)',
    shortName: 'SBI SO',
    categoryId: 'banking',
    authority: 'State Bank of India (sbi.co.in/careers)',
    introduction:
      'Recruits Specialist Cadre Officers (Regular & Contractual) across IT/Systems, Assistant Manager (Network/Security), Deputy Manager (Systems/Law/Chartered Accountant), and Wealth Management.',
    qualification: 'B.E./B.Tech in CS/IT/ECE, MCA, M.Sc.(CS/IT), CA, CFA, MBA Finance, or LLB with role-specific experience.',
    ageLimit: 'Role-specific (typically 21–32 or 25–40 years).',
    selectionProcess: 'Written Test (for Systems/Assistant Manager) + Shortlisting & Interview (100 Marks; 70:30 written-to-interview where test applies).',
    stages: [
      { name: 'Online Written Test (Where Applicable)', mode: 'Online Objective', qualifyingOnly: false, description: 'General Aptitude (Qualifying: Reasoning, Quant, English) + Professional Knowledge (Merit: 100–150 Marks).' },
      { name: 'Interview', mode: 'Panel Interview', qualifyingOnly: false, description: '100 Marks technical & banking domain interview.' }
    ],
    examPattern: [
      {
        stageName: 'SBI SO Technical/Systems Pattern (Check Specific Advt)',
        sections: [
          { subject: 'Part-I Qualifying: Reasoning (50), Quantitative Aptitude (35), English (35) — 90 Mins', questions: 120, marks: '120 (Qualifying)' },
          { subject: 'Part-II Merit: Professional Knowledge (IT / Role Specific — 70 Mins)', questions: 75, marks: 150 }
        ]
      }
    ],
    totalQuestions: 'Role-dependent (typically 120 Qualifying + 50–75 Professional)',
    totalMarks: 'Professional Knowledge 100–150 Marks + 100 Interview',
    duration: '135–160 Minutes',
    negativeMarking: '1/4th mark deducted per wrong answer (where written test is held).',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Part-I Qualifying' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Part-I Qualifying' }),
      fromBlueprint('english-language', { stageTag: 'Part-I Qualifying' }),
      fromBlueprint('eng-it', { stageTag: 'Part-II Professional Knowledge (Systems / IT Roles)' })
    ],
    practicalTechnicalTopics: ['Cloud Security, Core Banking Architecture, Java/Python/SQL Systems & Credit Risk Appraisal'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: '100 Marks Technical & Domain Interview (Shortlisting + Interview only for senior/contractual SO posts).',
    officialNotificationRef: 'SBI Specialist Cadre Officers Notifications (2025/2026)',
    officialWebsiteUrl: 'https://sbi.co.in/web/careers',
    officialNotificationUrl: 'https://sbi.co.in/web/careers',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'rbi-grade-b',
    examCode: 'RBI-GRADE-B',
    name: 'RBI Grade B Officer (General, DEPR & DSIM)',
    shortName: 'RBI Grade B',
    categoryId: 'banking',
    popular: true,
    authority: 'Reserve Bank of India Services Board (opportunities.rbi.org.in)',
    introduction:
      'Central Banking Officer recruitment in the Reserve Bank of India across General (DR), Department of Economic & Policy Research (DEPR), and Department of Statistics & Information Management (DSIM).',
    qualification: 'General: Graduation (60% marks; 50% SC/ST/PwBD) or PG (55%) | DEPR: Master’s in Economics/Finance | DSIM: Master’s in Statistics/Math.',
    ageLimit: '21 to 30 years (M.Phil +2 yrs, Ph.D +4 yrs).',
    selectionProcess: 'Phase-I Online Objective (200 Marks) → Phase-II (3 Papers: ESI, English Writing, Finance & Management = 300 Marks) → Interview (75 Marks).',
    stages: [
      { name: 'Phase-I Examination', mode: 'Online Objective', qualifyingOnly: true, description: '200 Qs / 200 Marks in 120 mins across GA (80), Reasoning (60), English (30) & Quant (30).' },
      { name: 'Phase-II Examination', mode: 'Objective + Descriptive Typing', qualifyingOnly: false, description: 'Paper-I ESI (100 Marks: 50 Obj + 50 Desc) + Paper-II English Writing (100 Marks Desc) + Paper-III Finance & Management (100 Marks: 50 Obj + 50 Desc).' },
      { name: 'Interview', mode: 'RBI Services Board', qualifyingOnly: false, description: '75 Marks; combined with 300 Phase-II marks for final merit out of 375.' }
    ],
    examPattern: [
      {
        stageName: 'Phase-I (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'General Awareness (25 Mins)', questions: 80, marks: 80 },
          { subject: 'English Language (25 Mins)', questions: 30, marks: 30 },
          { subject: 'Quantitative Aptitude (25 Mins)', questions: 30, marks: 30 },
          { subject: 'Reasoning (45 Mins)', questions: 60, marks: 60 }
        ]
      },
      {
        stageName: 'Phase-II (300 Marks · 3 Papers)',
        sections: [
          { subject: 'Paper-I: Economic & Social Issues (50% Objective + 50% Descriptive — 120 Mins)', questions: 'Obj + Desc', marks: 100 },
          { subject: 'Paper-II: English Writing Skills (Essay, Précis, Comprehension — 90 Mins)', questions: 'Descriptive', marks: 100 },
          { subject: 'Paper-III: Finance & Management (50% Objective + 50% Descriptive — 120 Mins)', questions: 'Obj + Desc', marks: 100 }
        ]
      }
    ],
    totalQuestions: 'Phase-I: 200 Qs | Phase-II: 3 Mixed Papers',
    totalMarks: 'Phase-I: 200 | Final Merit: 375 (300 Phase-II + 75 Interview)',
    duration: 'Phase-I: 120 Mins | Phase-II: 330 Mins across 3 Papers',
    negativeMarking: '1/4th mark deducted per wrong objective answer in Phase-I & Phase-II.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Phase-I (80 Marks)', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-international-ca', 'ga-govt-schemes', 'ga-reports', 'ga-static-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Phase-I (60 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Phase-I (30 Marks)' }),
      fromBlueprint('english-language', { stageTag: 'Phase-I (30 Marks)' }),
      fromBlueprint('banking-specialized', { stageTag: 'Phase-II ESI, Finance, Management & Descriptive (300 Marks)', includeChapterIds: ['bk-esi', 'bk-finance', 'bk-management', 'bk-descriptive'] })
    ],
    practicalTechnicalTopics: ['RBI Circulars, Monetary Policy Reports, Economic Survey, Union Budget & Keyboard Descriptive Answer Drafting'],
    languages: ['English', 'Hindi (for Phase-I except English & Phase-II Paper I/III; Interview in English or Hindi)'],
    physicalStandards: null,
    skillTestDetails: 'Phase-II descriptive answers are typed via keyboard on computer.',
    interviewDetails: '75 Marks Interview + optional Psychometric Assessment.',
    officialNotificationRef: 'RBI Grade B DR (General/DEPR/DSIM) 2025/2026 Cycle',
    officialWebsiteUrl: 'https://opportunities.rbi.org.in',
    officialNotificationUrl: 'https://opportunities.rbi.org.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'rbi-assistant',
    examCode: 'RBI-ASST',
    name: 'RBI Assistant',
    shortName: 'RBI Assistant',
    categoryId: 'banking',
    authority: 'Reserve Bank of India (opportunities.rbi.org.in)',
    introduction:
      'Recruits Assistants (Clerical Cadre) across RBI Regional Offices in India.',
    qualification: 'Bachelor’s Degree in any discipline with minimum 50% marks (pass class for SC/ST/PwBD) + PC word processing knowledge + Local Language proficiency.',
    ageLimit: '20 to 28 years.',
    selectionProcess: 'Preliminary Exam (100 Marks) → Main Exam (200 Marks) → Language Proficiency Test (LPT — Qualifying).',
    stages: [
      { name: 'Preliminary Exam', mode: 'Online Objective', qualifyingOnly: true, description: '100 Qs / 100 Marks in 60 mins.' },
      { name: 'Main Exam', mode: 'Online Objective', qualifyingOnly: false, description: '200 Qs / 200 Marks in 135 mins across 5 sections.' },
      { name: 'Language Proficiency Test (LPT)', mode: 'Qualifying Test', qualifyingOnly: true, description: 'Mandatory for all candidates in Regional Office language.' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (100 Qs · 100 Marks · 60 Mins)',
        sections: [
          { subject: 'English Language (20 Mins)', questions: 30, marks: 30 },
          { subject: 'Numerical Ability (20 Mins)', questions: 35, marks: 35 },
          { subject: 'Reasoning Ability (20 Mins)', questions: 35, marks: 35 }
        ]
      },
      {
        stageName: 'Mains (200 Qs · 200 Marks · 135 Mins)',
        sections: [
          { subject: 'Test of Reasoning (30 Mins)', questions: 40, marks: 40 },
          { subject: 'Test of English Language (30 Mins)', questions: 40, marks: 40 },
          { subject: 'Test of Numerical Ability (30 Mins)', questions: 40, marks: 40 },
          { subject: 'Test of General Awareness (25 Mins)', questions: 40, marks: 40 },
          { subject: 'Test of Computer Knowledge (20 Mins)', questions: 40, marks: 40 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 100 | Mains: 200',
    totalMarks: 'Prelims: 100 | Mains: 200',
    duration: 'Prelims: 60 Mins | Mains: 135 Mins',
    negativeMarking: '1/4th (0.25) mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims & Mains Numerical Ability' }),
      fromBlueprint('reasoning', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('general-awareness', { stageTag: 'Mains (40 Marks)', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-govt-schemes', 'ga-static-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Mains Computer Knowledge (40 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-dbms', 'cs-cyber-security'] })
    ],
    practicalTechnicalTopics: ['Regional Language Proficiency (Reading/Writing/Speaking) & High-Speed Accuracy'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'Language Proficiency Test (LPT) mandatory at respective RBI Office.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'RBI Assistant Official Recruitment Pattern',
    officialWebsiteUrl: 'https://opportunities.rbi.org.in',
    officialNotificationUrl: 'https://opportunities.rbi.org.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'nabard-grade-a',
    examCode: 'NABARD-GA',
    name: 'NABARD Grade A (Assistant Manager — RDBS & Rajbhasha)',
    shortName: 'NABARD Grade A',
    categoryId: 'banking',
    authority: 'National Bank for Agriculture and Rural Development (nabard.org)',
    introduction:
      'Recruits Assistant Managers in Grade A across Rural Development Banking Service (RDBS), Rajbhasha, and Legal disciplines.',
    qualification: 'Bachelor’s Degree in any subject (60% marks; 55% SC/ST/PwBD) or Post-Graduate Degree (55%) for General RDBS; discipline degrees for Specialist posts.',
    ageLimit: '21 to 30 years.',
    selectionProcess: 'Phase-I Prelims (200 Marks — Merit sections: GA, ESI & ARD) → Phase-II Mains (200 Marks) → Interview (50 Marks).',
    stages: [
      { name: 'Phase-I Preliminary Exam', mode: 'Online Objective', qualifyingOnly: true, description: '200 Qs / 200 Marks in 120 mins. Only GA, ESI & ARD (100 Marks total) count for Merit shortlisting; remaining 5 sections (100 Marks) are Qualifying.' },
      { name: 'Phase-II Main Exam', mode: 'Objective + Descriptive Typing', qualifyingOnly: false, description: 'Paper-I General English Descriptive (100 Marks) + Paper-II ESI & ARD (100 Marks: 50 Obj + 50 Desc).' },
      { name: 'Interview', mode: 'NABARD Panel', qualifyingOnly: false, description: '50 Marks; Final Merit out of 250 Marks.' }
    ],
    examPattern: [
      {
        stageName: 'Phase-I Prelims (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'Qualifying Sections: Reasoning (20), English (30), Computer (20), Quant (20), Decision Making (10)', questions: 100, marks: '100 (Qualifying)' },
          { subject: 'Merit Sections: General Awareness (20), Economic & Social Issues (40), Agriculture & Rural Development (40)', questions: 100, marks: '100 (Merit)' }
        ]
      },
      {
        stageName: 'Phase-II Mains (200 Marks)',
        sections: [
          { subject: 'Paper-I: General English (Descriptive — 90 Mins)', questions: '3 Questions', marks: 100 },
          { subject: 'Paper-II: Economic & Social Issues and Agriculture & Rural Development (50 Obj + 50 Desc — 120 Mins)', questions: '30 Obj + 6 Desc', marks: 100 }
        ]
      }
    ],
    totalQuestions: 'Phase-I: 200 Qs | Phase-II: 2 Papers',
    totalMarks: '250 Final Merit (200 Mains + 50 Interview)',
    duration: 'Phase-I: 120 Mins | Phase-II: 210 Mins',
    negativeMarking: '1/4th mark deducted per wrong objective answer.',
    subjects: [
      fromBlueprint('banking-specialized', { stageTag: 'Phase-I & II ESI, ARD & Descriptive', includeChapterIds: ['bk-esi', 'bk-ard', 'bk-descriptive'] }),
      fromBlueprint('general-awareness', { stageTag: 'Phase-I GA (20 Marks)', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-govt-schemes'] }),
      fromBlueprint('reasoning', { stageTag: 'Phase-I Qualifying' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Phase-I Qualifying' }),
      fromBlueprint('english-language', { stageTag: 'Phase-I Qualifying' }),
      fromBlueprint('computer-it', { stageTag: 'Phase-I Qualifying', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks'] })
    ],
    practicalTechnicalTopics: ['NABARD Annual Report, Rural Infrastructure Development Fund (RIDF), SHG-Bank Linkage & Decision Making'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'Online keyboard typing for Phase-II Descriptive papers.',
    interviewDetails: '50 Marks Interview.',
    officialNotificationRef: 'NABARD Grade A (RDBS) 2025/2026 Cycle',
    officialWebsiteUrl: 'https://www.nabard.org',
    officialNotificationUrl: 'https://www.nabard.org',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'nabard-grade-b',
    examCode: 'NABARD-GB',
    name: 'NABARD Grade B (Manager — RDBS)',
    shortName: 'NABARD Grade B',
    categoryId: 'banking',
    authority: 'National Bank for Agriculture and Rural Development (nabard.org)',
    introduction:
      'Recruits Managers in Grade B (Rural Development Banking Service) in NABARD (conducted periodically based on vacancy indents).',
    qualification: 'Post-Graduate Degree in any subject with minimum 60% marks (55% for SC/PwBD) + minimum 3 years experience in Banking/Finance/Agriculture/Rural Development.',
    ageLimit: '25 to 32 years.',
    selectionProcess: 'Phase-I Prelims (200 Marks) → Phase-II Mains (3 Papers = 300 Marks) → Interview (75 Marks).',
    stages: [
      { name: 'Phase-I Prelims', mode: 'Online Objective', qualifyingOnly: true, description: '200 Qs / 200 Marks (Qualifying + Merit ESI/ARD/GA).' },
      { name: 'Phase-II Mains', mode: 'Objective + Descriptive', qualifyingOnly: false, description: 'Paper-I English Descriptive (100) + Paper-II ESI & ARD (100) + Paper-III Development Economics, Statistics, Finance & Management (100).' },
      { name: 'Interview', mode: 'NABARD Board', qualifyingOnly: false, description: '75 Marks.' }
    ],
    examPattern: [
      {
        stageName: 'Phase-II Mains (3 Papers · 300 Marks)',
        sections: [
          { subject: 'Paper-I: General English (Descriptive)', questions: 'Descriptive', marks: 100 },
          { subject: 'Paper-II: Economic & Social Issues and Agriculture & Rural Development', questions: 'Obj + Desc', marks: 100 },
          { subject: 'Paper-III: Development Economics, Statistics, Finance & Management', questions: 'Obj + Desc', marks: 100 }
        ]
      }
    ],
    totalQuestions: 'Phase-I: 200 Qs | Phase-II: 3 Papers',
    totalMarks: '375 Final Merit (300 Mains + 75 Interview)',
    duration: '120 Mins per Paper',
    negativeMarking: '1/4th mark deducted per wrong objective answer.',
    subjects: [
      fromBlueprint('banking-specialized', { stageTag: 'Phase-II ESI, ARD, Finance & Management' }),
      fromBlueprint('general-awareness', { stageTag: 'Phase-I GA', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-govt-schemes'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Phase-I & Paper-III Statistics', includeChapterIds: ['qa-statistics', 'qa-probability', 'qa-data-interpretation'] })
    ],
    practicalTechnicalTopics: ['Rural Credit Policy, Development Economics & Project Finance Appraisal'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'Descriptive typing on computer.',
    interviewDetails: '75 Marks Interview.',
    officialNotificationRef: 'NABARD Grade B (Manager RDBS — Verify Active Cycle)',
    officialWebsiteUrl: 'https://www.nabard.org',
    officialNotificationUrl: 'https://www.nabard.org',
    notificationYear: 2024,
    verificationStatus: 'Provisional — Verify Notification',
    provisionalNote: 'NABARD Grade B Manager vacancies are released selectively rather than annually; confirm active cycle on nabard.org.'
  })
];
