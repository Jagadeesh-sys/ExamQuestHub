import { buildExamSyllabus, fromBlueprint } from './examBuilder.js';

export const TGPSC_EXAMS = [
  buildExamSyllabus({
    id: 'tgpsc-group-1',
    examCode: 'TGPSC-G1',
    name: 'TGPSC Group 1 Services (Deputy Collector, DSP, CTO)',
    shortName: 'TGPSC Group 1',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Telangana',
    popular: true,
    authority: 'Telangana Public Service Commission (tgpsc.gov.in)',
    introduction:
      'Telangana’s highest state civil service recruitment for Deputy Collectors, DSPs, Commercial Tax Officers, Municipal Commissioners, and District Panchayat Officers.',
    qualification: 'Bachelor’s Degree from any recognized University.',
    ageLimit: '18 to 46 years (relaxed upper age limit; DSP/Fire/Excise have post-specific limits).',
    selectionProcess: 'Preliminary Test (150 Marks Objective) → Main Examination (6 Descriptive Merit Papers = 900 Marks + Qualifying General English) → Document Verification.',
    stages: [
      { name: 'Preliminary Test', mode: 'OMR Objective', qualifyingOnly: true, description: '150 Qs / 150 Marks in 2.5 hours; shortlists 1:50 candidates for Mains.' },
      { name: 'Main Examination', mode: 'Descriptive / Conventional', qualifyingOnly: false, description: 'Qualifying General English (150 Marks) + 6 Merit Papers (150 Marks each = 900 Marks).' }
    ],
    examPattern: [
      {
        stageName: 'Preliminary Test (150 Qs · 150 Marks · 150 Mins)',
        sections: [{ subject: 'General Studies and Mental Ability (13 Units including Telangana History, Society, Policies)', questions: 150, marks: 150 }]
      },
      {
        stageName: 'Main Examination (900 Merit Marks + 150 Qualifying · 3 Hrs per Paper)',
        sections: [
          { subject: 'Qualifying Paper: General English (Class X Standard)', questions: 'Descriptive', marks: '150 (Qualifying)' },
          { subject: 'Paper-I: General Essay', questions: '3 Essays', marks: 150 },
          { subject: 'Paper-II: History, Culture and Geography (India & Telangana)', questions: 'Descriptive', marks: 150 },
          { subject: 'Paper-III: Indian Society, Constitution and Governance', questions: 'Descriptive', marks: 150 },
          { subject: 'Paper-IV: Economy and Development (India & Telangana)', questions: 'Descriptive', marks: 150 },
          { subject: 'Paper-V: Science & Technology and Data Interpretation', questions: 'Descriptive', marks: 150 },
          { subject: 'Paper-VI: Telangana Movement and State Formation', questions: 'Descriptive', marks: 150 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 150 MCQs | Mains: 7 Descriptive Papers',
    totalMarks: 'Prelims: 150 | Mains: 900 Merit Marks (+150 Qualifying English)',
    duration: 'Prelims: 150 Mins | Mains: 3 Hours per Paper',
    negativeMarking: 'No negative marking in TGPSC Prelims (per latest TGPSC Group-1 notification).',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Prelims & Mains GS', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('state-psc-specifics', { stageTag: 'Telangana Movement, Society & Economy', includeChapterIds: ['sp-tg-movement', 'sp-tg-society-economy'] }),
      fromBlueprint('reasoning', { stageTag: 'Prelims Mental Ability' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Mains Paper-V Data Interpretation', includeChapterIds: ['qa-data-interpretation', 'qa-percentage', 'qa-ratio-proportion', 'qa-average', 'qa-statistics'] })
    ],
    practicalTechnicalTopics: ['Paper-VI Special Focus: Telangana Agitation Phases (1948–2014), Srikrishna Committee Report & Statehood Policies'],
    languages: ['English', 'Telugu', 'Urdu'],
    physicalStandards: { medicalStandard: 'DSP & Fire Services require physical standards (Male 167.6 cm, Female 152.5 cm).' },
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview (Interview abolished by Telangana Govt for Group-1; 900 Mains marks solely decide rank).',
    officialNotificationRef: 'TGPSC Group-I Services Notification (2024–2026 Cycle)',
    officialWebsiteUrl: 'https://www.tgpsc.gov.in',
    officialNotificationUrl: 'https://www.tgpsc.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'tgpsc-group-2',
    examCode: 'TGPSC-G2',
    name: 'TGPSC Group 2 Services (ASO, Municipal Commissioner, Naib Tahsildar)',
    shortName: 'TGPSC Group 2',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Telangana',
    popular: true,
    authority: 'Telangana Public Service Commission (tgpsc.gov.in)',
    introduction:
      'Recruits Municipal Commissioners, Assistant Commercial Tax Officers, Deputy Tahsildars, Sub-Registrars, Prohibition & Excise SIs, and ASOs across Telangana.',
    qualification: 'Bachelor’s Degree from a recognized University.',
    ageLimit: '18 to 46 years.',
    selectionProcess: 'Single-Stage Written Examination (4 Objective Papers = 600 Marks) → Document Verification.',
    stages: [
      { name: 'Written Examination (4 Papers)', mode: 'OMR / CBT Objective', qualifyingOnly: false, description: '4 Papers × 150 Marks = 600 Total Marks.' }
    ],
    examPattern: [
      {
        stageName: 'Written Examination (600 Qs · 600 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies and General Abilities', questions: 150, marks: 150 },
          { subject: 'Paper-II: History, Polity and Society (India & Telangana)', questions: 150, marks: 150 },
          { subject: 'Paper-III: Economy and Development (India & Telangana + Issues of Development)', questions: 150, marks: 150 },
          { subject: 'Paper-IV: Telangana Movement and State Formation', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: '600 Questions (4 Papers × 150)',
    totalMarks: '600 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I, II & III', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('state-psc-specifics', { stageTag: 'Paper-II, III & IV (Telangana Special)', includeChapterIds: ['sp-tg-movement', 'sp-tg-society-economy'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I General Abilities' })
    ],
    practicalTechnicalTopics: ['Telangana Society, Caste/Tribe Issues, Land Reforms, Kaleshwaram/Mission Bhagiratha & State Welfare Policies'],
    languages: ['English', 'Telugu', 'Urdu'],
    physicalStandards: { medicalStandard: 'Excise SI requires physical height/chest standards.' },
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview (Interview removed for TGPSC Group-2).',
    officialNotificationRef: 'TGPSC Group-II Services Official Syllabus (2024–2026 Cycle)',
    officialWebsiteUrl: 'https://www.tgpsc.gov.in',
    officialNotificationUrl: 'https://www.tgpsc.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'tgpsc-group-3',
    examCode: 'TGPSC-G3',
    name: 'TGPSC Group 3 Services (Senior Assistant, Junior Assistant, Auditor)',
    shortName: 'TGPSC Group 3',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Telangana',
    popular: true,
    authority: 'Telangana Public Service Commission (tgpsc.gov.in)',
    introduction:
      'Recruits Senior Assistants, Junior Assistants, Senior Auditors, and Assistant Section Officers across Telangana State Heads of Departments.',
    qualification: 'Bachelor’s Degree from a recognized University (Commerce/Economics for specific Auditor posts).',
    ageLimit: '18 to 46 years.',
    selectionProcess: 'Single-Stage Written Examination (3 Objective Papers = 450 Marks) → Document Verification.',
    stages: [
      { name: 'Written Examination (3 Papers)', mode: 'OMR / CBT Objective', qualifyingOnly: false, description: '3 Papers × 150 Marks = 450 Marks.' }
    ],
    examPattern: [
      {
        stageName: 'Written Examination (450 Qs · 450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies and General Abilities', questions: 150, marks: 150 },
          { subject: 'Paper-II: History, Polity and Society (India & Telangana)', questions: 150, marks: 150 },
          { subject: 'Paper-III: Economy and Development (India & Telangana)', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: '450 Questions',
    totalMarks: '450 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I, II & III', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('state-psc-specifics', { stageTag: 'Telangana Society, History & Economy', includeChapterIds: ['sp-tg-society-economy'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I General Abilities' })
    ],
    practicalTechnicalTopics: ['Public Administration & Telangana Socio-Economic Outlook'],
    languages: ['English', 'Telugu', 'Urdu'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'TGPSC Group-III Services Official Pattern',
    officialWebsiteUrl: 'https://www.tgpsc.gov.in',
    officialNotificationUrl: 'https://www.tgpsc.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'tgpsc-group-4',
    examCode: 'TGPSC-G4',
    name: 'TGPSC Group 4 Services (Junior Assistant, Junior Accountant, Ward Officer)',
    shortName: 'TGPSC Group 4',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Telangana',
    popular: true,
    authority: 'Telangana Public Service Commission (tgpsc.gov.in)',
    introduction:
      'Mass recruitment for Junior Assistants, Junior Accountants, Junior Auditors, and Ward Officers across Telangana Secretariat & District Offices.',
    qualification: 'Bachelor’s Degree from any recognized University.',
    ageLimit: '18 to 46 years.',
    selectionProcess: 'Written Examination (2 Objective Papers = 300 Marks) → Document Verification.',
    stages: [
      { name: 'Written Examination', mode: 'OMR Objective', qualifyingOnly: false, description: 'Paper-I General Knowledge (150 Marks) + Paper-II Secretarial Abilities (150 Marks).' }
    ],
    examPattern: [
      {
        stageName: 'Written Examination (300 Qs · 300 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Knowledge (Current Affairs, IR, General Science, Environment, History, Geography, Polity, Telangana Movement & Policies)', questions: 150, marks: 150 },
          { subject: 'Paper-II: Secretarial Abilities (Mental Ability, Logical Reasoning, Comprehension, Précis Rearrangement, Numerical & Arithmetical Abilities)', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: '300 Questions',
    totalMarks: '300 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I General Knowledge (150 Marks)', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('state-psc-specifics', { stageTag: 'Paper-I Telangana Special', includeChapterIds: ['sp-tg-movement', 'sp-tg-society-economy'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-II Secretarial Abilities (150 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Paper-II Numerical & Arithmetical Abilities' }),
      fromBlueprint('english-language', { stageTag: 'Paper-II Comprehension & Sentence Rearrangement', includeChapterIds: ['en-comprehension', 'en-sentence-rearrangement', 'en-para-jumbles', 'en-error-detection'] })
    ],
    practicalTechnicalTopics: ['Secretarial Comprehension, Administrative Data Interpretation & Telangana Office Procedures'],
    languages: ['English', 'Telugu', 'Urdu'],
    physicalStandards: null,
    skillTestDetails: 'No separate typing test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'TGPSC Group-IV Services Official Syllabus',
    officialWebsiteUrl: 'https://www.tgpsc.gov.in',
    officialNotificationUrl: 'https://www.tgpsc.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'tgpsc-jl',
    examCode: 'TGPSC-JL',
    name: 'TGPSC Junior Lecturer (Intermediate Education)',
    shortName: 'TGPSC Junior Lecturer',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['teaching'],
    scope: 'State',
    state: 'Telangana',
    authority: 'Telangana Public Service Commission (tgpsc.gov.in)',
    introduction:
      'Recruits Junior Lecturers in Government Junior Colleges under Telangana Intermediate Education.',
    qualification: 'Post-Graduate Degree in relevant subject with at least 50% marks.',
    ageLimit: '18 to 46 years.',
    selectionProcess: 'Computer Based Recruitment Test (450 Marks: Paper-I GS 150 + Paper-II Subject 300) → Certificate Verification.',
    stages: [{ name: 'CBRT Written Exam', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I (150 Qs/150 Marks) + Paper-II Concerned PG Subject (150 Qs/300 Marks).' }],
    examPattern: [
      {
        stageName: 'CBRT (300 Qs · 450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies and General Abilities', questions: 150, marks: 150 },
          { subject: 'Paper-II: Concerned Subject (PG Level — 2 Marks per Q)', questions: 150, marks: 300 }
        ]
      }
    ],
    totalQuestions: '300 Questions',
    totalMarks: '450 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I General Abilities' })
    ],
    practicalTechnicalTopics: ['Post-Graduate Level Subject Mastery for Intermediate Teaching'],
    languages: ['English (Subject Paper)', 'English & Telugu (Paper-I)'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'TGPSC Junior Lecturer Official Notification',
    officialWebsiteUrl: 'https://www.tgpsc.gov.in',
    officialNotificationUrl: 'https://www.tgpsc.gov.in',
    notificationYear: 2024,
    verificationStatus: 'Latest Official (2024)'
  }),

  buildExamSyllabus({
    id: 'tgpsc-dl',
    examCode: 'TGPSC-DL',
    name: 'TGPSC Degree Lecturer (Government Degree Colleges)',
    shortName: 'TGPSC Degree Lecturer',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['teaching'],
    scope: 'State',
    state: 'Telangana',
    authority: 'Telangana Public Service Commission (tgpsc.gov.in)',
    introduction:
      'Recruits Lecturers in Government Degree Colleges under Telangana Collegiate Education.',
    qualification: 'Master’s Degree (55% marks) + NET / SLET / Ph.D. as per UGC Regulations.',
    ageLimit: '18 to 46 years.',
    selectionProcess: 'CBRT Written Exam (450 Marks) → Document Verification.',
    stages: [{ name: 'Written Exam', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I GS (150 Marks) + Paper-II Concerned Subject PG Level (300 Marks).' }],
    examPattern: [
      {
        stageName: 'Written Exam (300 Qs · 450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies and General Abilities', questions: 150, marks: 150 },
          { subject: 'Paper-II: Concerned Subject (PG Level — 2 Marks per Q)', questions: 150, marks: 300 }
        ]
      }
    ],
    totalQuestions: '300 Questions',
    totalMarks: '450 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('teaching-pedagogy', { stageTag: 'Research & Higher Education Reference', includeChapterIds: ['tp-ugc-research'] })
    ],
    practicalTechnicalTopics: ['Higher Education Pedagogy, UGC Research & PG Subject Specialization'],
    languages: ['English', 'Telugu (Paper-I)'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'TGPSC Degree Lecturer Notification',
    officialWebsiteUrl: 'https://www.tgpsc.gov.in',
    officialNotificationUrl: 'https://www.tgpsc.gov.in',
    notificationYear: 2024,
    verificationStatus: 'Latest Official (2024)'
  }),

  buildExamSyllabus({
    id: 'tgpsc-polytechnic-lecturer',
    examCode: 'TGPSC-PL',
    name: 'TGPSC Polytechnic Lecturer (Technical Education)',
    shortName: 'TGPSC Polytechnic Lecturer',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['engineering', 'teaching'],
    scope: 'State',
    state: 'Telangana',
    authority: 'Telangana Public Service Commission (tgpsc.gov.in)',
    introduction:
      'Recruits Lecturers in Government Polytechnics across Engineering & Applied Science departments in Telangana.',
    qualification: 'First Class B.E./B.Tech in relevant branch (CE, ME, EEE, ECE, CSE, Automobile, Metallurgy) or First Class PG for Humanities/Sciences.',
    ageLimit: '18 to 46 years.',
    selectionProcess: 'CBRT Written Examination (450 Marks) → Document Verification.',
    stages: [{ name: 'Written Exam', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I GS (150 Marks) + Paper-II Engineering Branch (300 Marks).' }],
    examPattern: [
      {
        stageName: 'CBRT (300 Qs · 450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies and General Abilities', questions: 150, marks: 150 },
          { subject: 'Paper-II: Concerned Engineering / Subject Branch (2 Marks/Q)', questions: 150, marks: 300 }
        ]
      }
    ],
    totalQuestions: '300 Questions',
    totalMarks: '450 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('eng-civil', { stageTag: 'Paper-II Civil Option' }),
      fromBlueprint('eng-mechanical', { stageTag: 'Paper-II Mechanical Option' }),
      fromBlueprint('eng-electrical', { stageTag: 'Paper-II Electrical Option' }),
      fromBlueprint('eng-electronics', { stageTag: 'Paper-II ECE Option' }),
      fromBlueprint('eng-cse', { stageTag: 'Paper-II CSE Option' })
    ],
    practicalTechnicalTopics: ['Engineering Labs, Workshop Instrumentation & AICTE Polytechnic Syllabus'],
    languages: ['English'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'TGPSC Polytechnic Lecturer Notification',
    officialWebsiteUrl: 'https://www.tgpsc.gov.in',
    officialNotificationUrl: 'https://www.tgpsc.gov.in',
    notificationYear: 2024,
    verificationStatus: 'Latest Official (2024)'
  }),

  buildExamSyllabus({
    id: 'tg-police-si',
    examCode: 'TG-POLICE-SI',
    name: 'Telangana Police SI (TGLPRB SCT Sub-Inspector)',
    shortName: 'Telangana Police SI',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['police'],
    scope: 'State',
    state: 'Telangana',
    popular: true,
    authority: 'Telangana State Level Police Recruitment Board (tgprb.in)',
    introduction:
      'Recruits Stipendiary Cadet Trainee (SCT) Sub-Inspectors of Police (Civil, AR, SAR CPL, TSSP, SPF, Fire & Excise/Transport) in Telangana.',
    qualification: 'Bachelor’s Degree from any recognized University.',
    ageLimit: '21 to 25/28 years (with relaxations as notified).',
    selectionProcess: 'Preliminary Written Test (PWT) → Physical Measurement Test (PMT) & Physical Efficiency Test (PET) → Final Written Examination (FWE — 4 Papers) → Medical & DV.',
    stages: [
      { name: 'Preliminary Written Test (PWT)', mode: 'OMR Objective', qualifyingOnly: true, description: '200 Qs / 200 Marks in 3 hours (100 Arithmetic & Reasoning + 100 General Studies).' },
      { name: 'PMT & PET', mode: 'Physical Ground Test', qualifyingOnly: false, description: '1600m/800m run + Long Jump + Shot Put (carries weightage for AR/TSSP).' },
      { name: 'Final Written Examination (FWE)', mode: 'OMR Objective + Descriptive Languages', qualifyingOnly: false, description: 'Paper-I English (100 Qualifying) + Paper-II Telugu/Urdu (100 Qualifying) + Paper-III Arithmetic & Reasoning (200 Merit) + Paper-IV General Studies (200 Merit).' }
    ],
    examPattern: [
      {
        stageName: 'Preliminary Test (200 Qs · 200 Marks · 3 Hrs)',
        sections: [
          { subject: 'Arithmetic and Test of Reasoning / Mental Ability', questions: 100, marks: 100 },
          { subject: 'General Studies (including Telangana History, Movement & Culture)', questions: 100, marks: 100 }
        ]
      },
      {
        stageName: 'Final Written Exam (400 Merit Marks + 200 Qualifying Languages)',
        sections: [
          { subject: 'Paper-I: English (Descriptive + Objective — Qualifying 40%/35%/30%)', questions: 'Mixed', marks: '100 (Qualifying)' },
          { subject: 'Paper-II: Telugu / Urdu (Descriptive + Objective — Qualifying)', questions: 'Mixed', marks: '100 (Qualifying)' },
          { subject: 'Paper-III: Arithmetic and Test of Reasoning / Mental Ability', questions: 200, marks: 200 },
          { subject: 'Paper-IV: General Studies', questions: 200, marks: 200 }
        ]
      }
    ],
    totalQuestions: 'PWT: 200 Qs | FWE Merit: 400 Qs',
    totalMarks: '400 Marks (Civil SI) + PET Weightage (AR/TSSP)',
    duration: '3 Hours per Paper',
    negativeMarking: '1/5th (0.20) mark deducted per wrong answer for MCQs in TGLPRB SI (check active notification for exact fraction).',
    subjects: [
      fromBlueprint('quantitative-aptitude', { stageTag: 'PWT & FWE Paper-III' }),
      fromBlueprint('reasoning', { stageTag: 'PWT & FWE Paper-III' }),
      fromBlueprint('general-awareness', { stageTag: 'PWT & FWE Paper-IV', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('state-psc-specifics', { stageTag: 'Telangana Movement & Society', includeChapterIds: ['sp-tg-movement', 'sp-tg-society-economy'] }),
      fromBlueprint('english-language', { stageTag: 'FWE Paper-I Qualifying' })
    ],
    practicalTechnicalTopics: ['1600m Run (Male: 7m 15s max), 800m Run (Female: 5m 20s max), Long Jump (4.0m M / 2.75m F) & Shot Put (6.0m M / 4.0m F)'],
    languages: ['English', 'Telugu', 'Urdu'],
    physicalStandards: {
      heightMale: '167.6 cm (Agency ST: 160 cm)',
      heightFemale: '152.5 cm (Agency ST: 150 cm)',
      petMale: '1600m run (within 7m 15s), Long Jump 4m, Shot Put 7.26 kg — 6m',
      petFemale: '800m run (within 5m 20s), Long Jump 2.75m, Shot Put 4 kg — 4m'
    },
    skillTestDetails: 'PET marks count directly for Armed Reserve (AR) & TSSP SI posts.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'TGLPRB SCT SI Notification (Latest Official Cycle)',
    officialWebsiteUrl: 'https://www.tgprb.in',
    officialNotificationUrl: 'https://www.tgprb.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'tg-police-constable',
    examCode: 'TG-POLICE-PC',
    name: 'Telangana Police Constable (TGLPRB SCT PC)',
    shortName: 'Telangana Police Constable',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['police'],
    scope: 'State',
    state: 'Telangana',
    popular: true,
    authority: 'Telangana State Level Police Recruitment Board (tgprb.in)',
    introduction:
      'Recruits SCT Police Constables (Civil, AR, SAR CPL, TSSP, SPF, Firemen, Warders, Excise & Transport Constables) in Telangana.',
    qualification: 'Intermediate (10+2) or equivalent examination passed.',
    ageLimit: '18 to 22/25 years (plus state relaxations).',
    selectionProcess: 'Preliminary Written Test (200 Marks) → PMT & PET → Final Written Examination (200 Marks) → Medical & DV.',
    stages: [
      { name: 'Preliminary Written Test', mode: 'OMR Objective', qualifyingOnly: true, description: '200 Qs / 200 Marks in 3 hours (Minimum 30% qualifying across categories).' },
      { name: 'PMT & PET', mode: 'Physical Ground Test', qualifyingOnly: false, description: '1600m/800m run, Long Jump & Shot Put.' },
      { name: 'Final Written Exam', mode: 'OMR Objective', qualifyingOnly: false, description: '200 Qs / 200 Marks in 3 hours.' }
    ],
    examPattern: [
      {
        stageName: 'PWT & FWE Pattern (200 Qs · 200 Marks · 3 Hrs)',
        sections: [
          { subject: 'English (Intermediate Standard)', questions: 25, marks: 25 },
          { subject: 'Arithmetic & Test of Reasoning / Mental Ability', questions: 60, marks: 60 },
          { subject: 'General Science, History of India, Indian Culture, Indian National Movement & Telangana History/Movement', questions: 65, marks: 65 },
          { subject: 'Indian Geography, Polity, Economy, Current Affairs & Personality Development', questions: 50, marks: 50 }
        ]
      }
    ],
    totalQuestions: '200 Questions',
    totalMarks: '200 Marks (FWE)',
    duration: '180 Minutes',
    negativeMarking: '1/5th (0.20) mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'PWT & FWE' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'PWT & FWE Arithmetic' }),
      fromBlueprint('reasoning', { stageTag: 'PWT & FWE Reasoning' }),
      fromBlueprint('general-awareness', { stageTag: 'PWT & FWE GS', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('general-science', { stageTag: 'PWT & FWE General Science' }),
      fromBlueprint('state-psc-specifics', { stageTag: 'Telangana History & Movement', includeChapterIds: ['sp-tg-movement'] })
    ],
    practicalTechnicalTopics: ['1600m Endurance Run, Long Jump & Shot Put PET Mechanics'],
    languages: ['English', 'Telugu', 'Urdu'],
    physicalStandards: {
      heightMale: '167.6 cm (Agency ST: 160 cm)',
      heightFemale: '152.5 cm (Agency ST: 150 cm)',
      petMale: '1600m run (within 7m 15s), Long Jump 4m, Shot Put 6m',
      petFemale: '800m run (within 5m 20s), Long Jump 2.75m, Shot Put 4m'
    },
    skillTestDetails: 'PET marks apply directly for AR/TSSP Constable merit.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'TGLPRB SCT Police Constable Official Pattern',
    officialWebsiteUrl: 'https://www.tgprb.in',
    officialNotificationUrl: 'https://www.tgprb.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'telangana-dsc',
    examCode: 'TG-DSC',
    name: 'Telangana DSC / TRT (SGT, School Assistant, Language Pandit, PET)',
    shortName: 'Telangana DSC',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['teaching', 'state-govt'],
    scope: 'State',
    state: 'Telangana',
    popular: true,
    authority: 'Department of School Education, Government of Telangana',
    introduction:
      'Teacher Recruitment Test (TRT / Mega DSC) for Secondary Grade Teachers (SGT), School Assistants (SA), Language Pandits, and Physical Education Teachers across Telangana Government & ZP/Mandal schools.',
    qualification: 'SGT: Intermediate + D.El.Ed/B.Ed + TG TET Paper-I Pass. SA: Graduation + B.Ed + TG TET Paper-II Pass.',
    ageLimit: '18 to 46 years.',
    selectionProcess: 'Computer Based Written Test (80 Marks = 160 Qs) + TG TET Score Weightage (20 Marks) = 100 Marks Final Merit.',
    stages: [
      { name: 'TRT / DSC Written Test (80%)', mode: 'Computer Based Test', qualifyingOnly: false, description: '160 MCQs / 80 Marks in 150 minutes.' },
      { name: 'TG TET Weightage (20%)', mode: 'Score Normalization', qualifyingOnly: false, description: '20% weightage from valid TG TET / CTET marks.' }
    ],
    examPattern: [
      {
        stageName: 'DSC / TRT Written Exam (160 Qs · 80 Marks · 150 Mins) + 20 Marks TET Weightage',
        sections: [
          { subject: 'General Knowledge & Current Affairs', questions: 20, marks: 10 },
          { subject: 'Perspectives in Education', questions: 20, marks: 10 },
          { subject: 'Classroom Implications of Educational Psychology (SA) / Teaching Methodology (SGT)', questions: 20, marks: 10 },
          { subject: 'Content (Concerned School Subject / Primary Subjects) + Pedagogy/Methodology', questions: 100, marks: 50 }
        ]
      }
    ],
    totalQuestions: '160 Questions',
    totalMarks: '100 Marks (80 DSC CBT + 20 TG TET Weightage)',
    duration: '150 Minutes',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'GK & Current Affairs (10 Marks)', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('teaching-pedagogy', { stageTag: 'Perspectives in Education & Psychology (20 Marks)' }),
      fromBlueprint('english-language', { stageTag: 'SGT / SA English Content & Methodology' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'SGT / SA Mathematics Content' }),
      fromBlueprint('general-science', { stageTag: 'SGT / SA Science & EVS Content' })
    ],
    practicalTechnicalTopics: ['Telangana SCERT Textbooks (Class 1–10), Perspectives in Education (NEP 2020, RTE 2009, NCF) & Classroom Pedagogy'],
    languages: ['Telugu', 'English', 'Urdu', 'Hindi', 'Marathi', 'Kannada', 'Tamil'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'Telangana DSC (School Education) 2024–2026 Cycle',
    officialWebsiteUrl: 'https://tgdsc.aptonline.in',
    officialNotificationUrl: 'https://schooledu.telangana.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'tg-forest-dept',
    examCode: 'TG-FOREST',
    name: 'Telangana Forest Department (FRO, FSO & FBO)',
    shortName: 'Telangana Forest Exams',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Telangana',
    authority: 'Telangana Public Service Commission (tgpsc.gov.in)',
    introduction:
      'Recruits Forest Range Officers (FRO), Forest Section Officers (FSO), and Forest Beat Officers (FBO) in Telangana Forest Department.',
    qualification: 'FBO: Intermediate (10+2) | FSO/FRO: Bachelor’s Degree in Science/Forestry/Agriculture/Engineering.',
    ageLimit: '18 to 31/36 years (post-specific with state relaxations).',
    selectionProcess: 'Written Examination (Objective) → Walking Test (25 km Male / 16 km Female in 4 hours) & PMT → Medical & DV.',
    stages: [
      { name: 'Written Exam', mode: 'OMR / CBT Objective', qualifyingOnly: false, description: 'FBO: GS (100) + Maths (100) = 200 Marks | FRO: Qualifying Languages + GS (150) + Maths (150) + Forestry (150).' },
      { name: 'Walking Test & PMT', mode: 'Physical Ground Test', qualifyingOnly: true, description: 'Mandatory 25 km (Male) / 16 km (Female) walk in 4 hours.' }
    ],
    examPattern: [
      {
        stageName: 'FBO / FSO Standard Pattern (200 Qs · 200 Marks · 180 Mins)',
        sections: [
          { subject: 'Paper-I: General Knowledge (100 Qs)', questions: 100, marks: 100 },
          { subject: 'Paper-II: General Mathematics (SSC Standard — 100 Qs)', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: 'FBO/FSO: 200 Qs | FRO: 450 Qs',
    totalMarks: 'FBO/FSO: 200 Marks | FRO: 450 Merit Marks',
    duration: '90–150 Minutes per Paper',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I GK (100 Marks)', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Paper-II Mathematics SSC Standard (100 Marks)' }),
      fromBlueprint('general-science', { stageTag: 'Forest Ecology & Biology Reference' })
    ],
    practicalTechnicalTopics: ['Telangana Forest Act 1967, Haritha Haram / Biodiversity, Forestry Mensuration & 25 km Endurance Walk'],
    languages: ['English', 'Telugu', 'Urdu'],
    physicalStandards: {
      heightMale: '163 cm | Chest: 79–84 cm',
      heightFemale: '150 cm | Chest: 74–79 cm',
      petMale: '25 km walk in 4 hours',
      petFemale: '16 km walk in 4 hours'
    },
    skillTestDetails: 'Walking test & physical measurement mandatory.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'TGPSC Forest Recruitment (FRO/FSO/FBO)',
    officialWebsiteUrl: 'https://www.tgpsc.gov.in',
    officialNotificationUrl: 'https://www.tgpsc.gov.in',
    notificationYear: 2024,
    verificationStatus: 'Latest Official (2024)'
  }),

  buildExamSyllabus({
    id: 'tg-ae-aee',
    examCode: 'TGPSC-AE-AEE',
    name: 'Telangana Assistant Engineer & AEE (TGPSC AE / AEE)',
    shortName: 'Telangana AE / AEE',
    categoryId: 'tgpsc',
    secondaryCategoryIds: ['engineering'],
    scope: 'State',
    state: 'Telangana',
    authority: 'Telangana Public Service Commission (tgpsc.gov.in)',
    introduction:
      'Recruits Assistant Engineers (Diploma/Degree) and Assistant Executive Engineers (B.E./B.Tech) across Telangana Irrigation, R&B, Mission Bhagiratha (RWS), Panchayat Raj, and Municipal Engineering.',
    qualification: 'AE: 3-Year Diploma / Degree in Civil, Mechanical, or Electrical | AEE: B.E./B.Tech in Civil, Mechanical, Electrical, or Agricultural Engg.',
    ageLimit: '18 to 46 years.',
    selectionProcess: 'CBRT / OMR Written Exam (Paper-I GS 150 + Paper-II Technical 300 = 450 Marks) → Document Verification.',
    stages: [{ name: 'Written Examination', mode: 'OMR / CBRT Objective', qualifyingOnly: false, description: 'Paper-I General Studies (150 Qs/150 Marks) + Paper-II Concerned Engineering Subject (150 Qs × 2 = 300 Marks).' }],
    examPattern: [
      {
        stageName: 'TGPSC AE / AEE Pattern (300 Qs · 450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies and General Abilities', questions: 150, marks: 150 },
          { subject: 'Paper-II: Concerned Engineering Discipline (2 Marks per Question)', questions: 150, marks: 300 }
        ]
      }
    ],
    totalQuestions: '300 Questions',
    totalMarks: '450 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I General Abilities' }),
      fromBlueprint('eng-civil', { stageTag: 'Paper-II Civil Engineering (300 Marks)' }),
      fromBlueprint('eng-mechanical', { stageTag: 'Paper-II Mechanical Engineering (300 Marks)' }),
      fromBlueprint('eng-electrical', { stageTag: 'Paper-II Electrical Engineering (300 Marks)' })
    ],
    practicalTechnicalTopics: ['Kaleshwaram Lift Irrigation Hydraulics, Mission Bhagiratha Water Supply Networks & IS Engineering Codes'],
    languages: ['English (Paper-II Technical)', 'English & Telugu (Paper-I)'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'TGPSC AE & AEE Official Notifications',
    officialWebsiteUrl: 'https://www.tgpsc.gov.in',
    officialNotificationUrl: 'https://www.tgpsc.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  })
];
