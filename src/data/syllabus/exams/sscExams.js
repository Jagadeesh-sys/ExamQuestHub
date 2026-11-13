import { buildExamSyllabus, fromBlueprint } from './examBuilder.js';

export const SSC_EXAMS = [
  buildExamSyllabus({
    id: 'ssc-cgl',
    examCode: 'SSC-CGL',
    name: 'SSC CGL (Combined Graduate Level)',
    shortName: 'SSC CGL',
    categoryId: 'ssc',
    popular: true,
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'India’s premier graduate-level recruitment for Group B and Group C Central Government posts including ASO (CSS/MEA/AFHQ), Inspector of Income Tax, GST/Excise Inspector, AAO, Auditor, Accountant, and Tax Assistant.',
    qualification: 'Bachelor’s Degree from a recognized University (Statistics/Economics required for JSO; Commerce/CA/CS desirable for AAO).',
    ageLimit: '18–27, 20–30, or 18–32 years depending on post.',
    selectionProcess: 'Tier-I (Qualifying Screening) → Tier-II (Paper-I Compulsory Merit + Paper-II Statistics for JSO) + DEST (Typing) → Document Verification.',
    stages: [
      { name: 'Tier-I', mode: 'Computer Based Examination', qualifyingOnly: true, description: '100 Qs / 200 Marks in 60 minutes; qualifying screening for Tier-II.' },
      { name: 'Tier-II Paper-I (Session I & II)', mode: 'Computer Based Examination', qualifyingOnly: false, description: 'Section I (Math+Reasoning: 180), Section II (English+GA: 210) = 390 Marks Merit + Section III Computer (60 Marks Qualifying) + DEST Typing (Qualifying).' },
      { name: 'Tier-II Paper-II (Statistics — JSO only)', mode: 'Computer Based Examination', qualifyingOnly: false, description: '100 Qs / 200 Marks in 2 hours for Junior Statistical Officer applicants.' }
    ],
    examPattern: [
      {
        stageName: 'Tier-I (100 Qs · 200 Marks · 60 Mins)',
        sections: [
          { subject: 'General Intelligence & Reasoning', questions: 25, marks: 50 },
          { subject: 'General Awareness', questions: 25, marks: 50 },
          { subject: 'Quantitative Aptitude', questions: 25, marks: 50 },
          { subject: 'English Comprehension', questions: 25, marks: 50 }
        ]
      },
      {
        stageName: 'Tier-II Paper-I (150 Qs · 450 Marks · 2 Hrs 15 Mins + 15 Min DEST)',
        sections: [
          { subject: 'Section I: Mathematical Abilities (30 Qs) + Reasoning (30 Qs)', questions: 60, marks: 180 },
          { subject: 'Section II: English Language & Comprehension (45 Qs) + General Awareness (25 Qs)', questions: 70, marks: 210 },
          { subject: 'Section III Module I: Computer Knowledge (Qualifying)', questions: 20, marks: 60 },
          { subject: 'Section III Module II: Data Entry Speed Test (DEST)', questions: '2000 Key Depressions', marks: 'Qualifying (15 Mins)' }
        ]
      }
    ],
    totalQuestions: 'Tier-I: 100 Qs | Tier-II Paper-I: 150 Qs',
    totalMarks: 'Tier-I: 200 | Tier-II Merit: 390 (+60 Computer Qualifying)',
    duration: 'Tier-I: 60 Mins | Tier-II Paper-I: 2 Hrs 15 Mins + 15 Mins DEST',
    negativeMarking: 'Tier-I: 0.50 marks per wrong answer | Tier-II Paper-I: 1 mark per wrong answer (1/3rd of 3 marks).',
    subjects: [
      fromBlueprint('quantitative-aptitude', { stageTag: 'Tier-I & Tier-II Section I' }),
      fromBlueprint('reasoning', { stageTag: 'Tier-I & Tier-II Section I' }),
      fromBlueprint('english-language', { stageTag: 'Tier-I & Tier-II Section II' }),
      fromBlueprint('general-awareness', { stageTag: 'Tier-I & Tier-II Section II', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Tier-II Section III (Qualifying)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-cyber-security', 'cs-info-security'] })
    ],
    practicalTechnicalTopics: [
      'DEST (Data Entry Speed Test): 2000 key depressions in 15 minutes (~27 WPM) in English on computer; mandatory for all posts in Tier-II Session II.',
      'Tier-II Statistics (JSO): Collection/Classification of Data, Measures of Central Tendency/Dispersion, Moments, Correlation/Regression, Probability, Random Variables, Sampling & Index Numbers'
    ],
    languages: ['English', 'Hindi (except English Comprehension section)'],
    physicalStandards: { medicalStandard: 'Physical/Medical tests apply only to Inspector (Central Excise/Preventive/Examiner), Sub-Inspector (CBI/NIA/CBN) — Male height 157.5 cm, Female 152 cm.' },
    skillTestDetails: 'DEST (15 minutes, 2000 key depressions) is mandatory & qualifying across all CGL posts (higher accuracy cutoffs for CPT posts like ASO CSS/MEA/Tax Assistant).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC CGL 2026 Examination Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    officialSyllabusPdfUrl: '/assets/aistudio/SSC_CGL_2020_All_21_Sets_English.pdf',
    syllabusPdfLabel: 'SSC CGL Question Paper & Portal Reference',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026',
    linkedMockCategory: 'ssc-cgl'
  }),

  buildExamSyllabus({
    id: 'ssc-chsl',
    examCode: 'SSC-CHSL',
    name: 'SSC CHSL (Combined Higher Secondary 10+2 Level)',
    shortName: 'SSC CHSL',
    categoryId: 'ssc',
    popular: true,
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Recruits 10+2 qualified candidates for Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO / DEO Grade A) across Central Ministries.',
    qualification: '12th Standard or equivalent examination from a recognized Board (12th Science with Mathematics required for DEO in C&AG/Ministries).',
    ageLimit: '18 to 27 years.',
    selectionProcess: 'Tier-I (Qualifying) → Tier-II (Merit + Computer + Typing/Skill Test) → Document Verification.',
    stages: [
      { name: 'Tier-I', mode: 'Computer Based Examination', qualifyingOnly: true, description: '100 Qs / 200 Marks in 60 minutes.' },
      { name: 'Tier-II Session I & II', mode: 'CBE + Skill/Typing Test', qualifyingOnly: false, description: '135 Objective Qs (360 Merit + 45 Computer Qualifying) followed by Skill/Typing Test.' }
    ],
    examPattern: [
      {
        stageName: 'Tier-I (100 Qs · 200 Marks · 60 Mins)',
        sections: [
          { subject: 'English Language', questions: 25, marks: 50 },
          { subject: 'General Intelligence', questions: 25, marks: 50 },
          { subject: 'Quantitative Aptitude', questions: 25, marks: 50 },
          { subject: 'General Awareness', questions: 25, marks: 50 }
        ]
      },
      {
        stageName: 'Tier-II (135 Qs · 405 Marks · 2 Hrs 15 Mins + Skill Test)',
        sections: [
          { subject: 'Section I: Mathematical Abilities (30) + Reasoning (30)', questions: 60, marks: 180 },
          { subject: 'Section II: English Language (40) + General Awareness (20)', questions: 60, marks: 180 },
          { subject: 'Section III Module I: Computer Knowledge (Qualifying)', questions: 15, marks: 45 },
          { subject: 'Section III Module II: Skill Test (DEO) / Typing Test (LDC/JSA)', questions: '8000-15000 KDPH / 35 WPM', marks: 'Qualifying' }
        ]
      }
    ],
    totalQuestions: 'Tier-I: 100 Qs | Tier-II: 135 Qs',
    totalMarks: 'Tier-I: 200 | Tier-II Merit: 360 (+45 Computer Qualifying)',
    duration: 'Tier-I: 60 Mins | Tier-II: 2 Hrs 15 Mins + Skill/Typing Test',
    negativeMarking: 'Tier-I: 0.50 marks per wrong answer | Tier-II: 1 mark per wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Tier-I & Tier-II' }),
      fromBlueprint('reasoning', { stageTag: 'Tier-I & Tier-II' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Tier-I & Tier-II', recommendedChapterIds: ['qa-statistics', 'qa-probability'] }),
      fromBlueprint('general-awareness', { stageTag: 'Tier-I & Tier-II', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Tier-II Section III', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-cyber-security'] })
    ],
    practicalTechnicalTopics: [
      'DEO Skill Test: 8,000 Key Depressions Per Hour (15,000 KDPH for C&AG/specified departments) in 15 minutes',
      'LDC/JSA Typing Test: 35 WPM English or 30 WPM Hindi in 10 minutes'
    ],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'Qualifying Skill Test for DEO (15 mins) and Typing Test for LDC/JSA (10 mins) conducted on the same day as Tier-II.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC CHSL 2026 Examination Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ssc-mts',
    examCode: 'SSC-MTS',
    name: 'SSC MTS & Havaldar (CBIC & CBN)',
    shortName: 'SSC MTS',
    categoryId: 'ssc',
    popular: true,
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Recruits Multi-Tasking (Non-Technical) Staff in Central Government Offices (Pay Level-1) and Havaldar in CBIC & CBN.',
    qualification: 'Matriculation (10th Class Pass) from a recognized Board.',
    ageLimit: '18–25 years (MTS & CBN Havaldar) / 18–27 years (CBIC Havaldar & certain MTS posts).',
    selectionProcess: 'Single-Day Computer Based Examination (Session I Qualifying + Session II Merit) → PET/PST (for Havaldar only) → DV.',
    stages: [
      { name: 'CBE Session I', mode: 'Computer Based Examination', qualifyingOnly: true, description: '40 Qs / 120 Marks in 45 minutes; NO negative marking; Qualifying only.' },
      { name: 'CBE Session II', mode: 'Computer Based Examination', qualifyingOnly: false, description: '50 Qs / 150 Marks in 45 minutes; Final merit decided purely on Session II.' },
      { name: 'PET / PST (Havaldar Only)', mode: 'Physical Test', qualifyingOnly: true, description: 'Walking 1600m (Male) / 1km (Female) & height/chest measurements.' }
    ],
    examPattern: [
      {
        stageName: 'Session I (40 Qs · 120 Marks · 45 Mins · No Negative Marking)',
        sections: [
          { subject: 'Numerical and Mathematical Ability', questions: 20, marks: 60 },
          { subject: 'Reasoning Ability and Problem Solving', questions: 20, marks: 60 }
        ]
      },
      {
        stageName: 'Session II (50 Qs · 150 Marks · 45 Mins · -1 Negative Marking)',
        sections: [
          { subject: 'General Awareness', questions: 25, marks: 75 },
          { subject: 'English Language and Comprehension', questions: 25, marks: 75 }
        ]
      }
    ],
    totalQuestions: '90 Questions (40 + 50)',
    totalMarks: '270 Marks (Merit based on 150 Marks of Session II)',
    duration: '90 Minutes (45 Mins Session I + 45 Mins Session II)',
    negativeMarking: 'Session I: NO negative marking | Session II: 1 mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('quantitative-aptitude', { stageTag: 'Session I (Qualifying)', excludeChapterIds: ['qa-trigonometry', 'qa-height-distance', 'qa-algebra', 'qa-geometry', 'qa-probability', 'qa-statistics'] }),
      fromBlueprint('reasoning', { stageTag: 'Session I (Qualifying)', excludeChapterIds: ['rs-puzzles', 'rs-seating-arrangement', 'rs-data-sufficiency'] }),
      fromBlueprint('general-awareness', { stageTag: 'Session II (Merit — 75 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('english-language', { stageTag: 'Session II (Merit — 75 Marks)' })
    ],
    practicalTechnicalTopics: ['Havaldar PET: Male Walking 1600m in 15 mins | Female Walking 1 km in 20 mins'],
    languages: ['English', 'Hindi', '13 Regional Languages including Telugu, Tamil, Kannada, Malayalam, Bengali, Marathi, Gujarati, etc.'],
    physicalStandards: {
      heightMale: '157.5 cm (Havaldar) | Chest: 81 cm (5 cm expansion)',
      heightFemale: '152 cm | Weight: 48 kg (Havaldar)'
    },
    skillTestDetails: 'No skill or typing test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC MTS & Havaldar 2025/2026 Examination Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ssc-gd',
    examCode: 'SSC-GD',
    name: 'SSC GD Constable (CAPFs, SSF, Rifleman Assam Rifles & NCB)',
    shortName: 'SSC GD Constable',
    categoryId: 'ssc',
    secondaryCategoryIds: ['police'],
    popular: true,
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Recruits Constables (General Duty) in BSF, CISF, CRPF, SSB, ITBP, Assam Rifles, SSF, and Sepoy in NCB.',
    qualification: 'Matriculation or 10th Class Examination passed from a recognized Board/University.',
    ageLimit: '18 to 23 years (with category relaxations).',
    selectionProcess: 'Computer Based Examination (CBE) → Physical Standard Test (PST) & Physical Efficiency Test (PET) → Medical Examination (DME/RME) & Document Verification.',
    stages: [
      { name: 'CBE', mode: 'Computer Based Examination', qualifyingOnly: false, description: '80 Qs / 160 Marks in 60 minutes.' },
      { name: 'PET & PST', mode: 'Physical Ground Test', qualifyingOnly: true, description: '5 km / 1.6 km running + height/chest standards.' },
      { name: 'DME / RME', mode: 'Detailed Medical', qualifyingOnly: true, description: 'CAPF medical fitness guidelines.' }
    ],
    examPattern: [
      {
        stageName: 'CBE Pattern (80 Qs · 160 Marks · 60 Mins)',
        sections: [
          { subject: 'General Intelligence & Reasoning', questions: 20, marks: 40 },
          { subject: 'General Knowledge & General Awareness', questions: 20, marks: 40 },
          { subject: 'Elementary Mathematics', questions: 20, marks: 40 },
          { subject: 'English / Hindi (Candidate Choice)', questions: 20, marks: 40 }
        ]
      }
    ],
    totalQuestions: '80 Questions',
    totalMarks: '160 Marks',
    duration: '60 Minutes',
    negativeMarking: '0.25 marks deducted per wrong answer (updated SSC GD 1/8th negative marking norm; check active cycle notice).',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'CBE (40 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'CBE (40 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBE Elementary Math (40 Marks)', excludeChapterIds: ['qa-trigonometry', 'qa-height-distance', 'qa-algebra', 'qa-geometry'] }),
      fromBlueprint('english-language', { stageTag: 'CBE English/Hindi Option (40 Marks)' })
    ],
    practicalTechnicalTopics: ['5 km endurance run in 24 minutes (Male) / 1.6 km in 8.5 minutes (Female) — Ladakh region 1.6 km/800m norms'],
    languages: ['English', 'Hindi', '13 Regional Languages including Telugu, Tamil, Kannada, Malayalam, Bengali, Odia, etc.'],
    physicalStandards: {
      heightMale: 'General/OBC/SC: 170 cm | ST: 162.5 cm',
      heightFemale: 'General/OBC/SC: 157 cm | ST: 150 cm',
      chestMale: '80 cm unexpanded, minimum 5 cm expansion (ST: 76/81 cm)',
      petMale: '5 km in 24 minutes (Ladakh: 1.6 km in 7 mins)',
      petFemale: '1.6 km in 8.5 minutes (Ladakh: 800m in 5 mins)'
    },
    skillTestDetails: 'PET/PST conducted by CAPF nodal agency (CRPF).',
    interviewDetails: 'No Interview (NCC C/B/A certificate holders receive 5%/3%/2% bonus marks).',
    officialNotificationRef: 'SSC Constable (GD) 2025/2026 Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ssc-cpo',
    examCode: 'SSC-CPO',
    name: 'SSC CPO (Sub-Inspector in Delhi Police & CAPFs)',
    shortName: 'SSC CPO (SI)',
    categoryId: 'ssc',
    secondaryCategoryIds: ['police'],
    popular: true,
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Recruits Sub-Inspectors (Executive) in Delhi Police and Sub-Inspectors (GD) in BSF, CISF, CRPF, ITBP, and SSB.',
    qualification: 'Bachelor’s Degree from a recognized University (Valid LMV Driving License required for Male Delhi Police SI candidates at PET stage).',
    ageLimit: '20 to 25 years.',
    selectionProcess: 'Paper-I (CBE) → PST & PET → Paper-II (English Comprehension) → Detailed Medical Examination (DME).',
    stages: [
      { name: 'Paper-I', mode: 'Computer Based Examination', qualifyingOnly: false, description: '200 Qs / 200 Marks in 2 hours (Merit + PET shortlisting).' },
      { name: 'PST & PET', mode: 'Physical Ground Test', qualifyingOnly: true, description: '100m sprint, 1.6km/800m run, long jump, high jump & shot put.' },
      { name: 'Paper-II', mode: 'Computer Based Examination', qualifyingOnly: false, description: '200 Qs / 200 Marks of English Language & Comprehension in 2 hours; combined Paper-I + II merit.' },
      { name: 'Medical & DV', mode: 'CAPF Medical', qualifyingOnly: true, description: 'Vision 6/6 & 6/9 without glasses, flat foot/knock knee checks.' }
    ],
    examPattern: [
      {
        stageName: 'Paper-I (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'General Intelligence & Reasoning', questions: 50, marks: 50 },
          { subject: 'General Knowledge & General Awareness', questions: 50, marks: 50 },
          { subject: 'Quantitative Aptitude', questions: 50, marks: 50 },
          { subject: 'English Comprehension', questions: 50, marks: 50 }
        ]
      },
      {
        stageName: 'Paper-II (200 Qs · 200 Marks · 120 Mins)',
        sections: [{ subject: 'English Language and Comprehension', questions: 200, marks: 200 }]
      }
    ],
    totalQuestions: 'Paper-I: 200 Qs | Paper-II: 200 Qs',
    totalMarks: '400 Marks (Paper-I 200 + Paper-II 200)',
    duration: '120 Minutes per Paper',
    negativeMarking: '0.25 marks deducted for each wrong answer in Paper-I & Paper-II.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Paper-I (50 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (50 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Paper-I (50 Marks)' }),
      fromBlueprint('english-language', { stageTag: 'Paper-I (50 Marks) & Paper-II (200 Marks)' })
    ],
    practicalTechnicalTopics: ['Male PET: 100m in 16s, 1.6km in 6.5 mins, Long Jump 3.65m, High Jump 1.2m, Shot Put (16 lbs) 4.5m'],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      heightMale: '170 cm (Hill areas 165 cm, ST 162.5 cm) | Chest: 80–85 cm',
      heightFemale: '157 cm (Hill areas 155 cm, ST 154 cm)',
      petMale: '100m in 16s, 1600m in 6.5m, Long Jump 3.65m (3 chances), High Jump 1.2m, Shot Put 4.5m',
      petFemale: '100m in 18s, 800m in 4m, Long Jump 2.7m, High Jump 0.9m'
    },
    skillTestDetails: 'PET/PST mandatory; Valid LMV Driving License for Male Delhi Police SI.',
    interviewDetails: 'No Interview (NCC C/B/A bonus marks: 10 / 6 / 4 per paper).',
    officialNotificationRef: 'SSC CPO SI 2025/2026 Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ssc-je-civil',
    examCode: 'SSC-JE-CE',
    name: 'SSC JE Civil Engineering',
    shortName: 'SSC JE Civil',
    categoryId: 'ssc',
    secondaryCategoryIds: ['engineering'],
    popular: true,
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Recruits Junior Engineers (Civil) in CPWD, MES, BRO, CWC, Farakka Barrage, and NTRO (Pay Level-6).',
    qualification: '3-Year Diploma or Degree in Civil Engineering from a recognized University/Institute (2 years experience required for BRO Diploma holders).',
    ageLimit: 'Up to 30 years (CPWD: up to 32 years).',
    selectionProcess: 'Paper-I (Objective CBE) → Paper-II (Objective Technical CBE) → Document Verification.',
    stages: [
      { name: 'Paper-I', mode: 'Computer Based Examination', qualifyingOnly: false, description: '200 Qs / 200 Marks in 2 hours (50 Reasoning + 50 GA + 100 Civil Engineering).' },
      { name: 'Paper-II', mode: 'Computer Based Examination (Objective)', qualifyingOnly: false, description: '100 Civil Engineering Qs / 300 Marks in 2 hours (Scientific Calculator & Steam Tables/IS Codes as specified by SSC).' }
    ],
    examPattern: [
      {
        stageName: 'Paper-I (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'General Intelligence & Reasoning', questions: 50, marks: 50 },
          { subject: 'General Awareness', questions: 50, marks: 50 },
          { subject: 'General Engineering (Civil & Structural)', questions: 100, marks: 100 }
        ]
      },
      {
        stageName: 'Paper-II (100 Qs · 300 Marks · 120 Mins)',
        sections: [{ subject: 'Part A: Civil & Structural Engineering (Objective)', questions: 100, marks: 300 }]
      }
    ],
    totalQuestions: 'Paper-I: 200 Qs | Paper-II: 100 Qs',
    totalMarks: '500 Marks (200 + 300)',
    duration: '120 Minutes per Paper',
    negativeMarking: 'Paper-I: 0.25 marks per wrong answer | Paper-II: 1 mark per wrong answer.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Paper-I (50 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (50 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('eng-civil', { stageTag: 'Paper-I (100 Marks) & Paper-II (300 Marks)', excludeChapterIds: ['ce-eng-math'] })
    ],
    practicalTechnicalTopics: ['Building Materials Testing, Surveying Instruments, Estimating/Costing, Rate Analysis, Concrete Mix Design & IS 456:2000 Provisions'],
    languages: ['English', 'Hindi'],
    physicalStandards: { medicalStandard: 'BRO requires specific physical & medical fitness standards.' },
    skillTestDetails: 'No skill test; Paper-II is purely objective (MCQs).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC Junior Engineer 2025/2026 Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ssc-je-mechanical',
    examCode: 'SSC-JE-ME',
    name: 'SSC JE Mechanical Engineering',
    shortName: 'SSC JE Mechanical',
    categoryId: 'ssc',
    secondaryCategoryIds: ['engineering'],
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Recruits Junior Engineers (Mechanical) in MES, BRO, CWC, DGQA, and Central Water & Power Research Station.',
    qualification: '3-Year Diploma or Degree in Mechanical Engineering from a recognized institution.',
    ageLimit: 'Up to 30 years.',
    selectionProcess: 'Paper-I (CBE) → Paper-II (Objective Technical CBE) → Document Verification.',
    stages: [
      { name: 'Paper-I', mode: 'Computer Based Examination', qualifyingOnly: false, description: '200 Qs / 200 Marks in 2 hours.' },
      { name: 'Paper-II', mode: 'Computer Based Examination', qualifyingOnly: false, description: '100 Mechanical Engineering Qs / 300 Marks in 2 hours.' }
    ],
    examPattern: [
      {
        stageName: 'Paper-I (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'General Intelligence & Reasoning', questions: 50, marks: 50 },
          { subject: 'General Awareness', questions: 50, marks: 50 },
          { subject: 'General Engineering (Mechanical)', questions: 100, marks: 100 }
        ]
      },
      {
        stageName: 'Paper-II (100 Qs · 300 Marks · 120 Mins)',
        sections: [{ subject: 'Part C: Mechanical Engineering (Objective)', questions: 100, marks: 300 }]
      }
    ],
    totalQuestions: 'Paper-I: 200 Qs | Paper-II: 100 Qs',
    totalMarks: '500 Marks (200 + 300)',
    duration: '120 Minutes per Paper',
    negativeMarking: 'Paper-I: 0.25 marks | Paper-II: 1 mark per wrong answer.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Paper-I (50 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (50 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('eng-mechanical', { stageTag: 'Paper-I (100 Marks) & Paper-II (300 Marks)', excludeChapterIds: ['me-eng-math'] })
    ],
    practicalTechnicalTopics: ['Boilers Classification, Centrifugal/Reciprocating Pumps, Air Compressors, Steam Nozzles, Welding & Machining Operations'],
    languages: ['English', 'Hindi'],
    physicalStandards: { medicalStandard: 'BRO posts require physical efficiency & medical compliance.' },
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC Junior Engineer 2025/2026 Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ssc-je-electrical',
    examCode: 'SSC-JE-EE',
    name: 'SSC JE Electrical Engineering',
    shortName: 'SSC JE Electrical',
    categoryId: 'ssc',
    secondaryCategoryIds: ['engineering'],
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Recruits Junior Engineers (Electrical) in CPWD, MES, BRO, CWC, and Farakka Barrage Project.',
    qualification: '3-Year Diploma or Degree in Electrical Engineering.',
    ageLimit: 'Up to 30 years (CPWD: up to 32 years).',
    selectionProcess: 'Paper-I (CBE) → Paper-II (Objective Technical CBE) → Document Verification.',
    stages: [
      { name: 'Paper-I', mode: 'Computer Based Examination', qualifyingOnly: false, description: '200 Qs / 200 Marks in 2 hours.' },
      { name: 'Paper-II', mode: 'Computer Based Examination', qualifyingOnly: false, description: '100 Electrical Engineering Qs / 300 Marks in 2 hours.' }
    ],
    examPattern: [
      {
        stageName: 'Paper-I (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'General Intelligence & Reasoning', questions: 50, marks: 50 },
          { subject: 'General Awareness', questions: 50, marks: 50 },
          { subject: 'General Engineering (Electrical)', questions: 100, marks: 100 }
        ]
      },
      {
        stageName: 'Paper-II (100 Qs · 300 Marks · 120 Mins)',
        sections: [{ subject: 'Part B: Electrical Engineering (Objective)', questions: 100, marks: 300 }]
      }
    ],
    totalQuestions: 'Paper-I: 200 Qs | Paper-II: 100 Qs',
    totalMarks: '500 Marks (200 + 300)',
    duration: '120 Minutes per Paper',
    negativeMarking: 'Paper-I: 0.25 marks | Paper-II: 1 mark per wrong answer.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Paper-I (50 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (50 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('eng-electrical', { stageTag: 'Paper-I (100 Marks) & Paper-II (300 Marks)', excludeChapterIds: ['ee-eng-math'] })
    ],
    practicalTechnicalTopics: ['Estimation & Costing, IE Rules, Illumination Design, Earthing, Switchgear Protection & Domestic/Industrial Wiring'],
    languages: ['English', 'Hindi'],
    physicalStandards: { medicalStandard: 'BRO posts require medical fitness.' },
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC Junior Engineer 2025/2026 Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ssc-je-cs-it',
    examCode: 'SSC-JE-CS-IT',
    name: 'SSC JE Computer Science / IT (Status & Reference)',
    shortName: 'SSC JE CS / IT',
    categoryId: 'ssc',
    secondaryCategoryIds: ['engineering'],
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Important Official Notice: Standard annual SSC JE notifications officially cover only Civil, Mechanical, and Electrical Engineering streams. Computer Science / IT posts under SSC are separately notified through SSC Selection Post (Technical/IT) or SSC Scientific Assistant (IMD). This syllabus reference covers CS/IT technical preparation aligned with SSC technical pattern.',
    qualification: 'B.E./B.Tech/Diploma in Computer Science / IT (when separately notified under SSC technical/selection cadres).',
    ageLimit: '18 to 30 years (as per notified SSC technical cadre).',
    selectionProcess: 'Paper-I / CBE (General + Technical CS/IT) → Document Verification.',
    stages: [
      { name: 'Provisional / Reference Pattern', mode: 'Computer Based Examination', qualifyingOnly: false, description: 'Not part of standard SSC JE (CE/ME/EE) notification; verify official ssc.gov.in notices.' }
    ],
    examPattern: [
      {
        stageName: 'Reference SSC Technical CS/IT Structure (Provisional — Check Active Notification)',
        sections: [
          { subject: 'General Intelligence & Reasoning', questions: 50, marks: 50 },
          { subject: 'General Awareness', questions: 50, marks: 50 },
          { subject: 'Core Computer Science / IT', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: 'Notified per special SSC technical advertisement',
    totalMarks: 'Notified per special SSC advertisement',
    duration: '120 Minutes (standard SSC CBE norm)',
    negativeMarking: '0.25 marks / 0.50 marks per wrong answer (as per SSC scheme).',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'General Paper' }),
      fromBlueprint('general-awareness', { stageTag: 'General Paper', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('eng-cse', { stageTag: 'Technical CS/IT Reference' })
    ],
    practicalTechnicalTopics: ['Database Administration, Network Troubleshooting, Cyber Hygiene & Web Application Architecture'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'Refer to specific SSC Selection Post / IMD notification.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'NOT OFFICIALLY NOTIFIED in standard SSC JE (CE/ME/EE) — Verify ssc.gov.in',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Provisional — Verify Notification',
    provisionalNote: 'Official SSC Junior Engineer (JE) notifications historically notify ONLY Civil, Mechanical, and Electrical engineering branches. Do not assume CS/IT is included in standard SSC JE unless explicitly announced in a new SSC gazette. CS/IT aspirants should also check SSC Scientific Assistant (IMD) and SSC Selection Post.'
  }),

  buildExamSyllabus({
    id: 'ssc-stenographer',
    examCode: 'SSC-STENO',
    name: 'SSC Stenographer Grade C and D',
    shortName: 'SSC Stenographer C & D',
    categoryId: 'ssc',
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Recruits Grade C (Group B Non-Gazetted) and Grade D (Group C) Stenographers in Central Ministries, Departments, and Attached Offices.',
    qualification: '12th Standard or equivalent examination from a recognized Board.',
    ageLimit: 'Grade C: 18–30 years | Grade D: 18–27 years.',
    selectionProcess: 'Computer Based Examination (200 Marks — No Maths section!) → Stenography Skill Test (Qualifying) → DV.',
    stages: [
      { name: 'Computer Based Examination', mode: 'Online Objective', qualifyingOnly: false, description: '200 MCQs in 2 hours across Reasoning (50), GA (50), and English (100).' },
      { name: 'Skill Test in Stenography', mode: 'Shorthand + Typing', qualifyingOnly: true, description: 'Grade C: 100 WPM | Grade D: 80 WPM dictation for 10 mins + computer transcription.' }
    ],
    examPattern: [
      {
        stageName: 'CBE Pattern (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'General Intelligence & Reasoning', questions: 50, marks: 50 },
          { subject: 'General Awareness', questions: 50, marks: 50 },
          { subject: 'English Language and Comprehension', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: '200 Questions',
    totalMarks: '200 Marks',
    duration: '120 Minutes (160 Minutes for PwBD)',
    negativeMarking: '0.25 marks deducted per wrong answer.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'CBE (50 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'CBE (50 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('english-language', { stageTag: 'CBE (100 Marks)' })
    ],
    practicalTechnicalTopics: [
      'Grade D Transcription Time: 50 mins (English) / 65 mins (Hindi) at 80 WPM shorthand dictation',
      'Grade C Transcription Time: 40 mins (English) / 55 mins (Hindi) at 100 WPM shorthand dictation'
    ],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: '10-minute shorthand dictation (80 WPM for Grade D, 100 WPM for Grade C) followed by computer transcription; error percentage cutoffs apply (typically 5–7% UR).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC Stenographer Grade C & D 2025/2026 Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ssc-selection-post',
    examCode: 'SSC-SEL-POST',
    name: 'SSC Selection Post (Phase Recruitment)',
    shortName: 'SSC Selection Post',
    categoryId: 'ssc',
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Recruits specialized Group B & Group C posts across Central Ministries across three qualification levels: Matriculation, Higher Secondary (10+2), and Graduation & above.',
    qualification: 'Post-wise: 10th Pass, 12th Pass, or Graduation/Post-Graduation (plus post-specific experience/diploma).',
    ageLimit: '18–25 / 18–27 / 18–30 years depending on post code.',
    selectionProcess: 'Single-Stage CBE (Separate difficulty per EQ level) → Scrutiny of Documents → Skill/Typing/Physical Test (where specified) → Final DV.',
    stages: [
      { name: 'Computer Based Examination', mode: 'Online Objective', qualifyingOnly: false, description: '100 Qs / 200 Marks in 60 minutes tailored to Matric / 10+2 / Graduate level.' },
      { name: 'Document Scrutiny & Skill Test', mode: 'Offline / Skill', qualifyingOnly: true, description: 'Hardcopy/portal scrutiny of qualification & experience certificates; Skill Test if post requires.' }
    ],
    examPattern: [
      {
        stageName: 'CBE Pattern — All 3 Levels (100 Qs · 200 Marks · 60 Mins)',
        sections: [
          { subject: 'General Intelligence', questions: 25, marks: 50 },
          { subject: 'General Awareness', questions: 25, marks: 50 },
          { subject: 'Quantitative Aptitude (Basic Arithmetic)', questions: 25, marks: 50 },
          { subject: 'English Language (Basic Knowledge)', questions: 25, marks: 50 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '200 Marks',
    duration: '60 Minutes (80 Minutes for PwBD)',
    negativeMarking: '0.50 marks deducted per wrong answer.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'CBE (50 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'CBE (50 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBE (50 Marks)', recommendedChapterIds: ['qa-trigonometry', 'qa-geometry', 'qa-algebra'] }),
      fromBlueprint('english-language', { stageTag: 'CBE (50 Marks)' })
    ],
    practicalTechnicalTopics: ['Post-specific trade/typing/laboratory skill tests as designated in Phase Post-Code annexure'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'Applicable only to specific post codes (e.g., Data Entry, Storekeeper, Technician, Pharmacist).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC Selection Post Phase-XII / XIII (2025-26)',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'ssc-jht',
    examCode: 'SSC-JHT',
    name: 'SSC JHT (Junior Hindi Translator & Senior Hindi Translator)',
    shortName: 'SSC JHT',
    categoryId: 'ssc',
    authority: 'Staff Selection Commission (ssc.gov.in)',
    introduction:
      'Recruits Junior Hindi Translators, Junior Translators, and Senior Hindi Translators in Central Government Ministries, Armed Forces Headquarters, and Subordinate Offices.',
    qualification: 'Master’s Degree in Hindi with English as a compulsory/elective subject OR Master’s Degree in English with Hindi, plus Diploma/Certificate in Translation (or 2 years translation experience).',
    ageLimit: '18 to 30 years.',
    selectionProcess: 'Paper-I (Objective CBE) → Paper-II (Descriptive Translation & Essay) → Document Verification.',
    stages: [
      { name: 'Paper-I (Objective)', mode: 'Computer Based Examination', qualifyingOnly: false, description: '200 Qs / 200 Marks in 2 hours (100 General Hindi + 100 General English).' },
      { name: 'Paper-II (Descriptive)', mode: 'Pen & Paper', qualifyingOnly: false, description: '200 Marks in 2 hours: Translation passages (Hindi↔English) + 2 Essays (Hindi & English).' }
    ],
    examPattern: [
      {
        stageName: 'Paper-I (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'General Hindi', questions: 100, marks: 100 },
          { subject: 'General English', questions: 100, marks: 100 }
        ]
      },
      {
        stageName: 'Paper-II (Descriptive · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'Translation (1 Passage Hindi to English + 1 Passage English to Hindi)', questions: '2 Passages', marks: 100 },
          { subject: 'Essays (1 Essay in Hindi + 1 Essay in English)', questions: '2 Essays', marks: 100 }
        ]
      }
    ],
    totalQuestions: 'Paper-I: 200 Qs | Paper-II: 4 Descriptive Tasks',
    totalMarks: '400 Marks (200 + 200)',
    duration: '120 Minutes per Paper',
    negativeMarking: 'Paper-I: 0.25 marks deducted per wrong answer | Paper-II: Descriptive evaluation.',
    subjects: [
      fromBlueprint('specialized-clinical-hindi', { stageTag: 'Paper-I & Paper-II Translation/Hindi', includeChapterIds: ['sd-ssc-jht'] }),
      fromBlueprint('english-language', { stageTag: 'Paper-I General English (100 Marks)' })
    ],
    practicalTechnicalTopics: ['Official Rajbhasha Administrative Glossary, Parliamentary/Legal Idiomatic Translation & Precis/Essay Drafting'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'Paper-II assesses practical bilingual translation proficiency & essay composition.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC JHT / CHT Examination 2025/2026',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'ssc-imd-sa',
    examCode: 'SSC-IMD-SA',
    name: 'SSC Scientific Assistant in IMD (India Meteorological Department)',
    shortName: 'SSC Scientific Assistant IMD',
    categoryId: 'ssc',
    secondaryCategoryIds: ['engineering', 'other-central'],
    authority: 'Staff Selection Commission (for India Meteorological Department)',
    introduction:
      'Recruits Group B Non-Gazetted Scientific Assistants in IMD (Pay Level-6) with choice of Physics, Computer Science & IT, or Electronics & Telecommunication in Part-II.',
    qualification: 'Bachelor’s Degree in Science (with Physics as one of the subjects) / Computer Science / IT / Computer Applications OR Diploma in Electronics & Telecommunication Engineering (minimum 60% marks).',
    ageLimit: 'Not exceeding 30 years.',
    selectionProcess: 'Single-Stage Computer Based Examination (Part-I + Part-II) → Document Verification.',
    stages: [
      { name: 'Single-Stage CBE', mode: 'Computer Based Examination', qualifyingOnly: false, description: '200 MCQs / 200 Marks in 120 minutes (100 General Part-I + 100 Subject Part-II).' }
    ],
    examPattern: [
      {
        stageName: 'Single-Stage CBE (200 Qs · 200 Marks · 120 Mins)',
        sections: [
          { subject: 'Part-I: General Intelligence & Reasoning', questions: 25, marks: 25 },
          { subject: 'Part-I: Quantitative Aptitude', questions: 25, marks: 25 },
          { subject: 'Part-I: English Language & Comprehension', questions: 25, marks: 25 },
          { subject: 'Part-I: General Awareness', questions: 25, marks: 25 },
          { subject: 'Part-II: Physics OR Computer Science/IT OR Electronics & Telecom', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: '200 Questions',
    totalMarks: '200 Marks',
    duration: '120 Minutes',
    negativeMarking: '0.25 marks deducted per wrong answer.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Part-I (25 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Part-I (25 Marks)' }),
      fromBlueprint('english-language', { stageTag: 'Part-I (25 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'Part-I (25 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('eng-cse', { stageTag: 'Part-II Option B: CS & IT (100 Marks)' }),
      fromBlueprint('eng-electronics', { stageTag: 'Part-II Option C: Electronics & Telecom (100 Marks)' })
    ],
    practicalTechnicalTopics: [
      'Part-II Option A (Physics): Mechanics, Thermal Physics, Waves & Optics, Electricity & Magnetism, Atomic Structure & Modern Physics, Electronics',
      'Meteorological Instrumentation & Atmospheric Data Processing Basics (Recommended)'
    ],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC Scientific Assistant IMD (Latest Official Cycle)',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2024,
    verificationStatus: 'Latest Official (2024)'
  }),

  buildExamSyllabus({
    id: 'ssc-dp-constable',
    examCode: 'SSC-DP-CONST',
    name: 'SSC Delhi Police Constable (Executive) Male & Female',
    shortName: 'Delhi Police Constable',
    categoryId: 'ssc',
    secondaryCategoryIds: ['police'],
    authority: 'Staff Selection Commission (for Delhi Police)',
    introduction:
      'Recruits Constables (Executive) Male and Female in Delhi Police (Pay Level-3).',
    qualification: '10+2 (Senior Secondary) passed from a recognized Board; Male candidates must possess a valid LMV Driving License (Motor Cycle or Car) as on date of PE&MT.',
    ageLimit: '18 to 25 years.',
    selectionProcess: 'Computer Based Examination (100 Marks) → Physical Endurance & Measurement Test (PE&MT) → Medical & Document Verification.',
    stages: [
      { name: 'CBE', mode: 'Computer Based Examination', qualifyingOnly: false, description: '100 MCQs / 100 Marks in 90 minutes (50 GK/CA + 25 Reasoning + 15 Math + 10 Computer).' },
      { name: 'PE&MT', mode: 'Physical Ground Test', qualifyingOnly: true, description: '1600m race, long jump, high jump & height/chest checks.' }
    ],
    examPattern: [
      {
        stageName: 'CBE Pattern (100 Qs · 100 Marks · 90 Mins)',
        sections: [
          { subject: 'General Knowledge / Current Affairs', questions: 50, marks: 50 },
          { subject: 'Reasoning', questions: 25, marks: 25 },
          { subject: 'Numerical Ability', questions: 15, marks: 15 },
          { subject: 'Computer Fundamentals, MS Excel, MS Word, Communication, Internet, WWW & Web Browsers', questions: 10, marks: 10 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '90 Minutes',
    negativeMarking: '0.25 marks deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CBE (50 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'CBE (25 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBE Numerical Ability (15 Marks)', excludeChapterIds: ['qa-trigonometry', 'qa-height-distance', 'qa-algebra', 'qa-geometry'] }),
      fromBlueprint('computer-it', { stageTag: 'CBE Computer (10 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-web-tech'] })
    ],
    practicalTechnicalTopics: ['MS Word & MS Excel Formatting, Shortcuts, Email Protocols & Web Browsers'],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      heightMale: '170 cm | Chest: 81–85 cm',
      heightFemale: '157 cm',
      petMale: 'Up to 30 yrs: 1600m in 6 mins | Long Jump: 14 ft | High Jump: 3 ft 9 in',
      petFemale: 'Up to 30 yrs: 1600m in 8 mins | Long Jump: 10 ft | High Jump: 3 ft'
    },
    skillTestDetails: 'Valid LMV Driving License mandatory for Male candidates during PE&MT.',
    interviewDetails: 'No Interview (NCC & RRU Degree/Diploma bonus marks up to 5%).',
    officialNotificationRef: 'SSC Delhi Police Constable (Executive) Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'ssc-dp-hc',
    examCode: 'SSC-DP-HC',
    name: 'SSC Delhi Police Head Constable (Ministerial & AWO/TPO)',
    shortName: 'Delhi Police Head Constable',
    categoryId: 'ssc',
    secondaryCategoryIds: ['police'],
    authority: 'Staff Selection Commission (for Delhi Police)',
    introduction:
      'Recruits Head Constable (Ministerial) — Pay Level-4 — and Head Constable (Assistant Wireless Operator / Tele-Printer Operator).',
    qualification: 'Ministerial: 10+2 pass + Typing speed 30 WPM Eng / 25 WPM Hindi. AWO/TPO: 10+2 with Science & Mathematics OR NTC in Mechanic-cum-Operator Electronic Communication System.',
    ageLimit: '18–25 years (Ministerial) | 18–27 years (AWO/TPO).',
    selectionProcess: 'CBE (100 Marks) → PE&MT (Qualifying) → Typing Test (25 Marks Merit for Ministerial) / Trade Test (Qualifying for AWO/TPO) → Computer Formatting Test.',
    stages: [
      { name: 'CBE', mode: 'Computer Based Examination', qualifyingOnly: false, description: '100 MCQs / 100 Marks in 90 minutes (Ministerial includes English 25; AWO/TPO includes General Science 25).' },
      { name: 'PE&MT', mode: 'Physical Ground Test', qualifyingOnly: true, description: '1600m/800m running, long jump & high jump.' },
      { name: 'Typing / Trade & Computer Formatting Test', mode: 'Skill Test', qualifyingOnly: false, description: 'Ministerial Typing Test carries 25 Merit Marks + Formatting Test (Qualifying); AWO/TPO Reading/Dictation & PC Test (Qualifying).' }
    ],
    examPattern: [
      {
        stageName: 'Ministerial CBE (100 Qs · 100 Marks · 90 Mins) + Typing (25 Marks)',
        sections: [
          { subject: 'General Awareness', questions: 20, marks: 20 },
          { subject: 'Quantitative Aptitude', questions: 20, marks: 20 },
          { subject: 'General Intelligence', questions: 25, marks: 25 },
          { subject: 'English Language', questions: 25, marks: 25 },
          { subject: 'Computer Fundamentals (MS Excel, Word, Comm, Internet)', questions: 10, marks: 10 }
        ]
      },
      {
        stageName: 'AWO/TPO CBE (100 Qs · 100 Marks · 90 Mins)',
        sections: [
          { subject: 'General Awareness', questions: 20, marks: 20 },
          { subject: 'General Science (Physics & Chemistry)', questions: 25, marks: 25 },
          { subject: 'Mathematics', questions: 25, marks: 25 },
          { subject: 'Reasoning', questions: 20, marks: 20 },
          { subject: 'Computer Fundamentals', questions: 10, marks: 10 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: 'Ministerial: 125 Marks (100 CBE + 25 Typing) | AWO/TPO: 100 Marks',
    duration: '90 Minutes (CBE)',
    negativeMarking: 'Ministerial: 0.50 marks per wrong answer | AWO/TPO: No negative marking (per latest official scheme).',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CBE (20 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBE (20–25 Marks)' }),
      fromBlueprint('reasoning', { stageTag: 'CBE (20–25 Marks)' }),
      fromBlueprint('english-language', { stageTag: 'Ministerial CBE (25 Marks)' }),
      fromBlueprint('general-science', { stageTag: 'AWO/TPO CBE (25 Marks)', excludeChapterIds: ['gs-bio-cell', 'gs-bio-systems', 'gs-bio-nutrition', 'gs-bio-respiration', 'gs-bio-circulation', 'gs-bio-excretion', 'gs-bio-nervous', 'gs-bio-reproduction', 'gs-bio-genetics', 'gs-bio-evolution', 'gs-bio-diseases', 'gs-bio-plant-phys', 'gs-bio-ecology'] }),
      fromBlueprint('computer-it', { stageTag: 'CBE (10 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-web-tech'] })
    ],
    practicalTechnicalTopics: [
      'Computer Formatting Test (Qualifying): 10 mins each in MS Word, MS PowerPoint & MS Excel (minimum 6/10 formatting features required)',
      'AWO/TPO Trade Test: Reading & Dictation (Hindi & English) + Basic Computer Operations'
    ],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      heightMale: '165 cm | Chest: 78–82 cm',
      heightFemale: '157 cm',
      petMale: '1600m in 7 mins | Long Jump: 12.5 ft | High Jump: 3.5 ft',
      petFemale: '800m in 5 mins | Long Jump: 9 ft | High Jump: 3 ft'
    },
    skillTestDetails: 'Ministerial Typing Test (10 mins, max 25 Marks based on speed) + Computer Formatting Test (Qualifying).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC Delhi Police Head Constable Official Cycle',
    officialWebsiteUrl: 'https://ssc.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  })
];
