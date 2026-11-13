import { buildExamSyllabus, fromBlueprint } from './examBuilder.js';

export const APPSC_EXAMS = [
  buildExamSyllabus({
    id: 'appsc-group-1',
    examCode: 'APPSC-G1',
    name: 'APPSC Group 1 Services (Deputy Collector, DSP, CTO)',
    shortName: 'APPSC Group 1',
    categoryId: 'appsc',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Andhra Pradesh',
    popular: true,
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Top-tier State Civil Services recruitment in Andhra Pradesh for Deputy Collectors (Civil Services), Deputy Superintendents of Police (DSP), Commercial Tax Officers, Regional Transport Officers, and Municipal Commissioners.',
    qualification: 'Bachelor’s Degree from any University in India established or incorporated by or under a Central/State Act.',
    ageLimit: '18 to 42 years (DSP/Jailor: 21–28/30 years with physical standards; SC/ST/BC/EWS +5 yrs).',
    selectionProcess: 'Preliminary Examination (Screening Objective) → Main Examination (7 Descriptive Papers: 2 Qualifying Languages + 5 Merit Papers = 750 Marks) → Oral Test / Interview (75 Marks).',
    stages: [
      { name: 'Preliminary (Screening Test)', mode: 'Offline / OMR Objective', qualifyingOnly: true, description: 'Two Papers (Paper I & Paper II), 120 Qs / 120 Marks each (240 Total).' },
      { name: 'Main Examination (Written)', mode: 'Descriptive / Conventional', qualifyingOnly: false, description: 'Qualifying Telugu & English (150 each) + 5 Merit Papers (Essay, Paper II, III, IV, V × 150 = 750 Marks).' },
      { name: 'Interview (Oral Test)', mode: 'Personality Test Board', qualifyingOnly: false, description: '75 Marks; Final merit out of 825 Marks (750 Mains + 75 Interview).' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (240 Qs · 240 Marks · 240 Mins Total)',
        sections: [
          { subject: 'Paper-I: History & Culture, Constitution/Polity/Social Justice/IR, Indian & AP Economy, Geography (120 Mins)', questions: 120, marks: 120 },
          { subject: 'Paper-II: General Mental Ability, Administrative/Psychological Abilities, Science & Tech, Current Events (120 Mins)', questions: 120, marks: 120 }
        ]
      },
      {
        stageName: 'Mains Written (7 Papers · 750 Merit Marks · 3 Hrs per Paper)',
        sections: [
          { subject: 'Qualifying Papers: General English & General Telugu (Min 40% OC)', questions: 'Descriptive', marks: '150 + 150 (Qualifying)' },
          { subject: 'Paper-I: General Essay (3 Essays)', questions: 'Descriptive', marks: 150 },
          { subject: 'Paper-II: History, Culture & Geography of India and Andhra Pradesh', questions: 'Descriptive', marks: 150 },
          { subject: 'Paper-III: Polity, Constitution, Governance, Law & Ethics', questions: 'Descriptive', marks: 150 },
          { subject: 'Paper-IV: Economy & Development of India and Andhra Pradesh', questions: 'Descriptive', marks: 150 },
          { subject: 'Paper-V: Science & Technology and Environmental Issues', questions: 'Descriptive', marks: 150 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 240 MCQs | Mains: 7 Descriptive Papers',
    totalMarks: 'Prelims: 240 | Mains + Interview: 825 Marks (750 + 75)',
    duration: 'Prelims: 120 Mins per Paper | Mains: 3 Hours per Paper',
    negativeMarking: 'Prelims: 1/3rd mark deducted per wrong answer | Mains: Descriptive evaluation.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Prelims Paper-I/II & Mains GS' }),
      fromBlueprint('state-psc-specifics', { stageTag: 'AP History, Culture, Economy & Bifurcation', includeChapterIds: ['sp-ap-history-culture', 'sp-ap-economy-bifurcation'] }),
      fromBlueprint('reasoning', { stageTag: 'Prelims Paper-II Mental Ability' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims Paper-II Data Interpretation & Numeracy', includeChapterIds: ['qa-percentage', 'qa-ratio-proportion', 'qa-average', 'qa-data-interpretation', 'qa-statistics', 'qa-probability'] })
    ],
    practicalTechnicalTopics: ['AP Bifurcation Act 2014 Case Studies, Administrative Ethics & Telugu/English Précis Drafting'],
    languages: ['English', 'Telugu'],
    physicalStandards: { medicalStandard: 'Required for DSP & District Fire Officer (Height Male 167.6 cm, Female 152.5 cm, Chest 86.3 cm).' },
    skillTestDetails: 'No typing test.',
    interviewDetails: '75 Marks Personality Test (1:2 ratio shortlisted from Mains).',
    officialNotificationRef: 'APPSC Group-I Services Notification (Latest Cycle)',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'appsc-group-2',
    examCode: 'APPSC-G2',
    name: 'APPSC Group 2 Services (ASO, Deputy Tahsildar, Sub-Registrar)',
    shortName: 'APPSC Group 2',
    categoryId: 'appsc',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Andhra Pradesh',
    popular: true,
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Recruits Executive and Non-Executive posts in Andhra Pradesh including Deputy Tahsildar, Sub-Registrar Grade-II, Assistant Section Officer (Secretariat), Prohibition & Excise SI, and Senior Accountant.',
    qualification: 'Bachelor’s Degree from any recognized University (Post-specific Commerce/Law preferences for certain non-executive cadres).',
    ageLimit: '18 to 42 years (Excise SI: 18–28 years).',
    selectionProcess: 'Screening Test (Prelims 150 Marks) → Main Examination (2 Objective Papers: 300 Marks) → Computer Proficiency Test (CPT — Qualifying) → DV.',
    stages: [
      { name: 'Screening Test (Prelims)', mode: 'OMR / CBT Objective', qualifyingOnly: true, description: 'Single paper of 150 Qs / 150 Marks in 150 mins across 5 equal 30-mark sections.' },
      { name: 'Main Examination (Paper I & II)', mode: 'Objective', qualifyingOnly: false, description: 'Two papers of 150 Marks each (Total 300 Marks) determining final merit.' },
      { name: 'Computer Proficiency Test (CPT)', mode: 'Practical Office Suite Test', qualifyingOnly: true, description: 'Qualifying practical exam (MS Word, Excel, PowerPoint, Email & Internet).' }
    ],
    examPattern: [
      {
        stageName: 'Screening Test (150 Qs · 150 Marks · 150 Mins)',
        sections: [
          { subject: 'Indian History (Ancient, Medieval, Modern)', questions: 30, marks: 30 },
          { subject: 'Geography (General & Physical, Indian & AP)', questions: 30, marks: 30 },
          { subject: 'Indian Society (Structure, Social Issues, Welfare Mechanisms)', questions: 30, marks: 30 },
          { subject: 'Current Affairs (International, National & Regional AP)', questions: 30, marks: 30 },
          { subject: 'Mental Ability (Logical Reasoning, Mental Ability & Basic Numeracy)', questions: 30, marks: 30 }
        ]
      },
      {
        stageName: 'Main Examination (300 Qs · 300 Marks · 150 Mins each Paper)',
        sections: [
          { subject: 'Paper-I: Social & Cultural History of Andhra Pradesh (75) + Indian Constitution (75)', questions: 150, marks: 150 },
          { subject: 'Paper-II: Indian & AP Economy (75) + Science & Technology (75)', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 150 Qs | Mains: 300 Qs',
    totalMarks: 'Prelims: 150 | Mains: 300 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer in Prelims & Mains.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Prelims & Mains', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('state-psc-specifics', { stageTag: 'Mains Paper-I & II (AP Focus)', includeChapterIds: ['sp-ap-history-culture', 'sp-ap-economy-bifurcation'] }),
      fromBlueprint('reasoning', { stageTag: 'Prelims Mental Ability (30 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims Basic Numeracy', includeChapterIds: ['qa-number-system', 'qa-percentage', 'qa-ratio-proportion', 'qa-average', 'qa-profit-loss', 'qa-time-work', 'qa-time-speed-distance', 'qa-data-interpretation'] })
    ],
    practicalTechnicalTopics: ['APPSC Computer Proficiency Test (CPT): MS Word formatting, MS Excel formulas/charts, PowerPoint slides & Internet/Email (100 Marks practical — qualifying min 40% OC)'],
    languages: ['English', 'Telugu'],
    physicalStandards: { medicalStandard: 'Excise SI post requires physical standards (Male 165 cm, Female 152.5 cm).' },
    skillTestDetails: 'CPT (Computer Proficiency Test) is mandatory qualifying stage before final appointment.',
    interviewDetails: 'No Interview (abolished by AP Government for Group-2 posts).',
    officialNotificationRef: 'APPSC Group-II Services Revised Syllabus (2024–2026 Cycle)',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'appsc-group-3',
    examCode: 'APPSC-G3',
    name: 'APPSC Group 3 (Panchayat Secretary Grade-IV)',
    shortName: 'APPSC Group 3',
    categoryId: 'appsc',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Andhra Pradesh',
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Recruits Panchayat Secretaries (Grade-IV) in Andhra Pradesh Panchayat Raj & Rural Development Department (note: recent cycles also conducted via Grama Sachivalayam; notified selectively by APPSC).',
    qualification: 'Bachelor’s Degree from any recognized University.',
    ageLimit: '18 to 42 years.',
    selectionProcess: 'Screening Test (if applicants >25,000) → Main Examination (Paper I General Studies + Paper II Rural Development & AP Issues) → DV.',
    stages: [
      { name: 'Screening Test (If applicable)', mode: 'Objective', qualifyingOnly: true, description: '150 Qs / 150 Marks screening test when applicant count exceeds threshold.' },
      { name: 'Main Examination', mode: 'Objective', qualifyingOnly: false, description: 'Paper-I (GS & Mental Ability: 150 Marks) + Paper-II (Rural Development & Problems in Rural Areas with Special Reference to AP: 150 Marks).' }
    ],
    examPattern: [
      {
        stageName: 'Main Examination (300 Qs · 300 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies and Mental Ability', questions: 150, marks: 150 },
          { subject: 'Paper-II: Rural Development & Rural Problems (Special Reference to Andhra Pradesh)', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: '300 Questions (Mains)',
    totalMarks: '300 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I Mental Ability' }),
      {
        id: 'appsc-g3-rural-dev',
        name: 'Rural Development, Panchayat Raj & AP Rural Economy',
        shortName: 'Rural Development (AP)',
        code: 'RD-AP',
        stageTag: 'Paper-II (150 Marks)',
        chapters: [
          { id: 'ag3-pri', title: 'Evolution of Panchayat Raj System & 73rd Constitutional Amendment', topicType: 'official', subtopics: ['Balwant Rai Mehta, Ashok Mehta, GVK Rao & LM Singhvi Committees', 'AP Panchayat Raj Act 1994, Gram Sabha, Gram Sachivalayam & Powers/Functions of Panchayat Secretary'] },
          { id: 'ag3-rural-schemes', title: 'Rural Development Programmes, Rural Credit & Cooperatives', topicType: 'official', subtopics: ['MGNREGS, PMAY-G, NRLM, Swachh Bharat Gramin, Rural Water Supply & Sanitation', 'NABARD, RRBs, Cooperatives, SHGs & Rural Infrastructure in AP'] }
        ]
      }
    ],
    practicalTechnicalTopics: ['Panchayat Accounting, Gram Panchayat Development Plan (GPDP) & e-Panchayat Records'],
    languages: ['English', 'Telugu'],
    physicalStandards: null,
    skillTestDetails: 'No skill test unless specified in active cycle.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'APPSC Group-III (Where Notified — Verify Active Cycle)',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2024,
    verificationStatus: 'Provisional — Verify Notification',
    provisionalNote: 'Panchayat Secretary recruitments in AP were merged into AP Grama Sachivalayam during recent cycles; APPSC Group-3 is held only when specifically notified by APPSC.'
  }),

  buildExamSyllabus({
    id: 'appsc-group-4',
    examCode: 'APPSC-G4',
    name: 'APPSC Group 4 (Junior Assistant cum Computer Assistant)',
    shortName: 'APPSC Group 4',
    categoryId: 'appsc',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Andhra Pradesh',
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Recruits Junior Assistants cum Computer Assistants in AP Revenue and Endowments Departments.',
    qualification: 'Bachelor’s Degree from a recognized University (with Computer Proficiency qualification at CPT stage).',
    ageLimit: '18 to 42 years.',
    selectionProcess: 'Screening Test (150 Marks) → Main Examination (300 Marks) → Computer Proficiency Test (CPT Qualifying) → DV.',
    stages: [
      { name: 'Screening Test', mode: 'Objective', qualifyingOnly: true, description: '150 Qs / 150 Marks (100 GS & Mental Ability + 50 General English & Telugu).' },
      { name: 'Main Examination', mode: 'Objective', qualifyingOnly: false, description: 'Paper-I (GS & Mental Ability: 150) + Paper-II (General English & General Telugu SSC Standard: 150).' },
      { name: 'Computer Proficiency Test (CPT)', mode: 'Practical Test', qualifyingOnly: true, description: 'Office Automation practical qualifying test.' }
    ],
    examPattern: [
      {
        stageName: 'Main Examination (300 Qs · 300 Marks · 150 Mins each Paper)',
        sections: [
          { subject: 'Paper-I: General Studies and Mental Ability', questions: 150, marks: 150 },
          { subject: 'Paper-II: General English (75 Marks) + General Telugu (75 Marks) — SSC Standard', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 150 Qs | Mains: 300 Qs',
    totalMarks: 'Prelims: 150 | Mains: 300 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I General Studies', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I Mental Ability' }),
      fromBlueprint('english-language', { stageTag: 'Paper-II General English (75 Marks)' }),
      {
        id: 'appsc-g4-telugu',
        name: 'General Telugu (SSC Standard)',
        shortName: 'General Telugu',
        code: 'TEL',
        stageTag: 'Paper-II (75 Marks)',
        chapters: [
          { id: 'tel-grammar', title: 'తెలుగు వ్యాకరణం, పర్యాయపదాలు, నానార్థాలు, సంధులు, సమాసాలు & అనువాదం', topicType: 'official', subtopics: ['పర్యాయపదాలు, వ్యతిరేకపదాలు, జాతీయాలు, సామెతలు', 'సంధులు, సమాసాలు, అలంకారాలు, వాక్య నిర్మాణం & పఠన అవగాహన (Comprehension)'] }
        ]
      }
    ],
    practicalTechnicalTopics: ['CPT Practical: MS Word, Excel Spreadsheets, PowerPoint, Access & E-Governance Mail'],
    languages: ['English', 'Telugu'],
    physicalStandards: null,
    skillTestDetails: 'Computer Proficiency Test (CPT) — 100 Marks practical (qualifying).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'APPSC Group-IV Services Latest Official Pattern',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2024,
    verificationStatus: 'Latest Official (2024)'
  }),

  buildExamSyllabus({
    id: 'appsc-degree-lecturer',
    examCode: 'APPSC-DL',
    name: 'APPSC Degree College Lecturer (DL)',
    shortName: 'APPSC Degree Lecturer',
    categoryId: 'appsc',
    secondaryCategoryIds: ['teaching'],
    scope: 'State',
    state: 'Andhra Pradesh',
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Recruits Lecturers in Government Degree Colleges across Andhra Pradesh Collegiate Education Service in Arts, Science, and Commerce disciplines.',
    qualification: 'Master’s Degree in relevant subject with minimum 55% marks (50% for SC/ST/BC/PwD) + UGC NET / APSET / Ph.D. as per UGC Regulations.',
    ageLimit: '18 to 42 years.',
    selectionProcess: 'Written Examination (CBE — 450 Marks) → Oral Test / Interview (50 Marks, where notified) → DV.',
    stages: [
      { name: 'Written Exam (Paper I & Paper II)', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I General Studies (150 Marks) + Paper-II Concerned Subject PG Level (150 Qs × 2 = 300 Marks).' },
      { name: 'Interview / Oral Test', mode: 'Academic Board', qualifyingOnly: false, description: '50 Marks (subject to active notification rules).' }
    ],
    examPattern: [
      {
        stageName: 'Written Examination (300 Qs · 450 Marks)',
        sections: [
          { subject: 'Paper-I: General Studies & Mental Ability (Degree Standard)', questions: 150, marks: 150 },
          { subject: 'Paper-II: Concerned Subject (PG Level — 2 Marks per Question)', questions: 150, marks: 300 }
        ]
      }
    ],
    totalQuestions: '300 Questions',
    totalMarks: '450 Marks (Written) + 50 Marks (Interview if notified)',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I Mental Ability' }),
      fromBlueprint('teaching-pedagogy', { stageTag: 'Subject Pedagogy & UGC Research Reference', recommendedChapterIds: ['tp-ugc-research'] })
    ],
    practicalTechnicalTopics: ['PG-level Subject Specialization (Mathematics, Physics, Chemistry, Botany, Zoology, Commerce, Economics, History, English, Telugu, Computer Science)'],
    languages: ['English (Paper-I bilingual English & Telugu; Paper-II English except Language subjects)'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: '50 Marks Oral Test / Interview (verify active notification as interview applicability varies by GO).',
    officialNotificationRef: 'APPSC Degree College Lecturer (Notif. 26/2023–2025 Cycle)',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'appsc-junior-lecturer',
    examCode: 'APPSC-JL',
    name: 'APPSC Junior Lecturer (JL)',
    shortName: 'APPSC Junior Lecturer',
    categoryId: 'appsc',
    secondaryCategoryIds: ['teaching'],
    scope: 'State',
    state: 'Andhra Pradesh',
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Recruits Junior Lecturers in Government Junior Colleges (Intermediate Education) across AP.',
    qualification: 'Second Class Master’s Degree (minimum 50% marks) in the concerned subject from a recognized University.',
    ageLimit: '18 to 42 years.',
    selectionProcess: 'Written Examination (450 Marks: Paper-I GS 150 + Paper-II Subject 300) → Certificate Verification.',
    stages: [
      { name: 'Written Examination', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I General Studies (150 Qs/150 Marks) + Paper-II Concerned Subject PG Level (150 Qs/300 Marks).' }
    ],
    examPattern: [
      {
        stageName: 'Written Examination (300 Qs · 450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies & Mental Ability', questions: 150, marks: 150 },
          { subject: 'Paper-II: Concerned Subject (Post-Graduate Standard)', questions: 150, marks: 300 }
        ]
      }
    ],
    totalQuestions: '300 Questions',
    totalMarks: '450 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I Mental Ability' }),
      fromBlueprint('eng-cse', { stageTag: 'Subject Option Reference (if CS)' })
    ],
    practicalTechnicalTopics: ['Post-Graduate Level Concerned Subject Mastery across Intermediate Subjects (MPC, BiPC, CEC, HEC, Languages)'],
    languages: ['English', 'Telugu'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview (Selection purely by Written Exam Merit).',
    officialNotificationRef: 'APPSC Junior Lecturer Notification 22/2023–2025 Cycle',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'appsc-polytechnic-lecturer',
    examCode: 'APPSC-PL',
    name: 'APPSC Polytechnic Lecturer (Government Polytechnics)',
    shortName: 'APPSC Polytechnic Lecturer',
    categoryId: 'appsc',
    secondaryCategoryIds: ['engineering', 'teaching'],
    scope: 'State',
    state: 'Andhra Pradesh',
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Recruits Lecturers in Government Polytechnics (AP Technical Education Service) across Engineering & Non-Engineering branches.',
    qualification: 'First Class B.E./B.Tech in relevant Engineering discipline (CE, ME, EEE, ECE, CSE, etc.) OR First Class Master’s Degree for Non-Engineering subjects.',
    ageLimit: '18 to 42 years.',
    selectionProcess: 'Computer Based Examination (450 Marks) → Document Verification.',
    stages: [
      { name: 'Written Examination', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I General Studies & Mental Ability (150 Marks) + Paper-II Engineering/Subject Discipline (300 Marks).' }
    ],
    examPattern: [
      {
        stageName: 'Written Examination (300 Qs · 450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies & Mental Ability', questions: 150, marks: 150 },
          { subject: 'Paper-II: Concerned Engineering / Subject Branch (2 Marks/Q)', questions: 150, marks: 300 }
        ]
      }
    ],
    totalQuestions: '300 Questions',
    totalMarks: '450 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I Mental Ability' }),
      fromBlueprint('eng-civil', { stageTag: 'Paper-II Option: Civil Engg (300 Marks)' }),
      fromBlueprint('eng-mechanical', { stageTag: 'Paper-II Option: Mechanical Engg (300 Marks)' }),
      fromBlueprint('eng-electrical', { stageTag: 'Paper-II Option: Electrical Engg (300 Marks)' }),
      fromBlueprint('eng-electronics', { stageTag: 'Paper-II Option: ECE (300 Marks)' }),
      fromBlueprint('eng-cse', { stageTag: 'Paper-II Option: CSE (300 Marks)' })
    ],
    practicalTechnicalTopics: ['Polytechnic Laboratory Instruction, AICTE Curriculum Standards & Engineering Graphics'],
    languages: ['English (Technical Paper-II)', 'English & Telugu (Paper-I)'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'APPSC Lecturers in Govt Polytechnics (Notif. 25/2023–2025 Cycle)',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'appsc-ae',
    examCode: 'APPSC-AE',
    name: 'APPSC Assistant Engineer (AE — Civil / Mechanical / Electrical)',
    shortName: 'APPSC Assistant Engineer',
    categoryId: 'appsc',
    secondaryCategoryIds: ['engineering'],
    scope: 'State',
    state: 'Andhra Pradesh',
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Recruits Assistant Engineers across AP R&B, Irrigation (Water Resources), Panchayat Raj, Rural Water Supply, Public Health & Municipal Engineering Departments.',
    qualification: '3-Year Diploma (LCE/LME/LEE) or Bachelor’s Degree in Civil/Mechanical/Electrical Engineering.',
    ageLimit: '18 to 42 years.',
    selectionProcess: 'Screening Test (if >25k) → Main Examination (450 Marks: 3 Papers) → DV.',
    stages: [
      { name: 'Written Examination (Main)', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I GS & Mental Ability (150) + Paper-II Engineering Common/Core (150) + Paper-III Discipline Core (150).' }
    ],
    examPattern: [
      {
        stageName: 'Main Examination (450 Qs · 450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies & Mental Ability', questions: 150, marks: 150 },
          { subject: 'Paper-II: Engineering Mechanics & Strength of Materials / Branch Core Paper-1 (Diploma Standard)', questions: 150, marks: 150 },
          { subject: 'Paper-III: Concerned Engineering Discipline Core Paper-2 (Diploma Standard)', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: '450 Questions',
    totalMarks: '450 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I Mental Ability' }),
      fromBlueprint('eng-civil', { stageTag: 'Paper-II & III Civil', excludeChapterIds: ['ce-eng-math'] }),
      fromBlueprint('eng-mechanical', { stageTag: 'Paper-II & III Mechanical', excludeChapterIds: ['me-eng-math'] }),
      fromBlueprint('eng-electrical', { stageTag: 'Paper-II & III Electrical', excludeChapterIds: ['ee-eng-math'] })
    ],
    practicalTechnicalTopics: ['AP Standard Schedule of Rates (SSR), Field Surveying, Construction Supervision & Quality Control'],
    languages: ['English (Paper-II & III)', 'English & Telugu (Paper-I)'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'APPSC Assistant Engineers (Latest Official Pattern)',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'appsc-aee',
    examCode: 'APPSC-AEE',
    name: 'APPSC Assistant Executive Engineer (AEE)',
    shortName: 'APPSC AEE',
    categoryId: 'appsc',
    secondaryCategoryIds: ['engineering'],
    scope: 'State',
    state: 'Andhra Pradesh',
    popular: true,
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Gazetted State Engineering Service recruitment for Assistant Executive Engineers in AP Water Resources, R&B, Panchayat Raj, Tribal Welfare, and Public Health Engineering.',
    qualification: 'Bachelor’s Degree (B.E./B.Tech) in Civil, Mechanical, Electrical, or Agricultural Engineering.',
    ageLimit: '18 to 42 years.',
    selectionProcess: 'Screening Test (if applicable) → Main Examination (450 Marks: 3 Objective Papers) → DV.',
    stages: [
      { name: 'Written Examination', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I GS (150) + Paper-II Engineering Core-1 (150) + Paper-III Engineering Core-2 (150).' }
    ],
    examPattern: [
      {
        stageName: 'Main Examination (450 Qs · 450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies & Mental Ability (Degree Standard)', questions: 150, marks: 150 },
          { subject: 'Paper-II: Engineering Core Paper-1 (Degree Standard)', questions: 150, marks: 150 },
          { subject: 'Paper-III: Engineering Core Paper-2 (Degree Standard)', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: '450 Questions',
    totalMarks: '450 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I Mental Ability' }),
      fromBlueprint('eng-civil', { stageTag: 'Paper-II & III Civil (Degree Standard)' }),
      fromBlueprint('eng-mechanical', { stageTag: 'Paper-II & III Mechanical (Degree Standard)' }),
      fromBlueprint('eng-electrical', { stageTag: 'Paper-II & III Electrical (Degree Standard)' })
    ],
    practicalTechnicalTopics: ['Polavaram & Major Irrigation Dam Hydraulics, IS 456/800/1893 Codes & Structural Design'],
    languages: ['English (Paper-II & III)', 'English & Telugu (Paper-I)'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'APPSC AEE Services Official Pattern',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'appsc-fro',
    examCode: 'APPSC-FRO',
    name: 'APPSC Forest Range Officer (FRO)',
    shortName: 'APPSC FRO',
    categoryId: 'appsc',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Andhra Pradesh',
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Recruits Forest Range Officers in AP Forest Service responsible for forest conservation, wildlife protection, and silviculture.',
    qualification: 'Bachelor’s Degree in Agriculture, Botany, Chemistry, Computer Applications/Science, Engineering, Environmental Science, Forestry, Geology, Horticulture, Mathematics, Physics, Statistics, Veterinary Science, or Zoology.',
    ageLimit: '18 to 30 years (with relaxations).',
    selectionProcess: 'Screening Test → Main Examination (4 Papers: 600 Marks) → Walking Test & Medical Examination → DV.',
    stages: [
      { name: 'Screening Test', mode: 'Objective', qualifyingOnly: true, description: '150 Qs / 150 Marks (General Studies, Mental Ability & General Forestry).' },
      { name: 'Main Examination', mode: 'Objective', qualifyingOnly: false, description: 'Qualifying English & Telugu (100 Marks) + Paper-I GS & Mental Ability (150) + Paper-II Mathematics SSC Standard (150) + Paper-III General Forestry-I (150) + Paper-IV General Forestry-II (150).' },
      { name: 'Walking Test & Medical', mode: 'Physical Ground Test', qualifyingOnly: true, description: '25 km walk in 4 hours (Male) / 16 km walk in 4 hours (Female).' }
    ],
    examPattern: [
      {
        stageName: 'Main Examination (600 Merit Marks + 100 Qualifying)',
        sections: [
          { subject: 'Qualifying Paper: General English (50) + General Telugu (50)', questions: 100, marks: '100 (Qualifying)' },
          { subject: 'Paper-I: General Studies & Mental Ability', questions: 150, marks: 150 },
          { subject: 'Paper-II: Mathematics (SSC Standard)', questions: 150, marks: 150 },
          { subject: 'Paper-III: General Forestry Paper-I', questions: 150, marks: 150 },
          { subject: 'Paper-IV: General Forestry Paper-II', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: '700 Questions (Mains)',
    totalMarks: '600 Merit Marks (+100 Qualifying)',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Paper-II SSC Standard Math (150 Marks)' }),
      {
        id: 'appsc-fro-forestry',
        name: 'General Forestry (Paper I & Paper II)',
        shortName: 'Forestry & Wildlife',
        code: 'FOR',
        stageTag: 'Paper-III & IV (300 Marks)',
        chapters: [
          { id: 'fro-silviculture', title: 'Silviculture, Agroforestry, Forest Mensuration & Working Plans', topicType: 'official', subtopics: ['Forest Regeneration, Nursery Management, Social & Farm Forestry, Tree Growth & Yield Tables'] },
          { id: 'fro-ecology-law', title: 'Forest Ecology, Biodiversity, Wildlife Conservation & Forest Laws', topicType: 'official', subtopics: ['AP Forest Act 1967, Wildlife Protection Act 1972, Forest Conservation Act 1980, Protected Areas & Remote Sensing/GIS in Forestry'] }
        ]
      }
    ],
    practicalTechnicalTopics: ['25 km (Male) / 16 km (Female) Endurance Walking Test in 4 Hours & Forest Surveying/Mensuration'],
    languages: ['English', 'Telugu'],
    physicalStandards: {
      heightMale: '163 cm | Chest: 79–84 cm',
      heightFemale: '150 cm | Chest: 74–79 cm',
      petMale: '25 km walk in 4 hours',
      petFemale: '16 km walk in 4 hours'
    },
    skillTestDetails: 'Physical Walking Test & Medical Fitness mandatory.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'APPSC Forest Range Officer Official Cycle',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'appsc-dyeo',
    examCode: 'APPSC-DYEO',
    name: 'APPSC Deputy Educational Officer (DyEO)',
    shortName: 'APPSC DyEO',
    categoryId: 'appsc',
    secondaryCategoryIds: ['teaching'],
    scope: 'State',
    state: 'Andhra Pradesh',
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Recruits Gazetted Deputy Educational Officers in AP School Education Service.',
    qualification: 'First or Second Class Post-Graduate Degree (with minimum 50% marks) in prescribed Arts/Science subjects + B.Ed.',
    ageLimit: '18 to 42 years.',
    selectionProcess: 'Screening Test (150 Marks) → Main Examination (450 Marks: GS + Two Education Papers) → DV.',
    stages: [
      { name: 'Screening Test', mode: 'Objective', qualifyingOnly: true, description: '150 Qs / 150 Marks (GS & Mental Ability).' },
      { name: 'Main Examination', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I GS & Mental Ability (150) + Paper-II Education-I (150) + Paper-III Education-II (150).' }
    ],
    examPattern: [
      {
        stageName: 'Main Examination (450 Qs · 450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies & Mental Ability', questions: 150, marks: 150 },
          { subject: 'Paper-II: Education-I (Philosophical, Sociological & Psychological Foundations of Education)', questions: 150, marks: 150 },
          { subject: 'Paper-III: Education-II (Educational Administration, Planning, Policies, NEP 2020 & Assessment)', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 150 Qs | Mains: 450 Qs',
    totalMarks: '450 Marks (Mains Merit)',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I Mental Ability' }),
      fromBlueprint('teaching-pedagogy', { stageTag: 'Paper-II & III Education Core (300 Marks)' })
    ],
    practicalTechnicalTopics: ['AP School Education Governance, RTE Act 2009, NEP 2020 Implementation & School Inspection Audits'],
    languages: ['English', 'Telugu'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'APPSC DyEO Notification 10/2023–2025 Cycle',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'appsc-tech-assistant',
    examCode: 'APPSC-TECH-ASST',
    name: 'APPSC Technical Assistant & Specialized Notified Posts',
    shortName: 'APPSC Technical Assistant',
    categoryId: 'appsc',
    secondaryCategoryIds: ['engineering'],
    scope: 'State',
    state: 'Andhra Pradesh',
    authority: 'Andhra Pradesh Public Service Commission (psc.ap.gov.in)',
    introduction:
      'Covers Technical Assistants in AP Mines & Geology, Geophysics, Hydrology, Town & Country Planning, Sericulture, Fisheries, and Groundwater Departments.',
    qualification: 'Diploma / Bachelor’s / Master’s Degree in relevant technical branch (Geology, Geophysics, Civil, Agriculture, Fisheries, Sericulture, etc.).',
    ageLimit: '18 to 42 years.',
    selectionProcess: 'Computer Based Examination (Paper-I GS + Paper-II Technical Subject) → Certificate Verification.',
    stages: [
      { name: 'Written Examination', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I General Studies & Mental Ability (150 Marks) + Paper-II Concerned Technical Discipline (150/300 Marks).' }
    ],
    examPattern: [
      {
        stageName: 'Written Examination (300 Qs · 300/450 Marks · 150 Mins per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies & Mental Ability', questions: 150, marks: 150 },
          { subject: 'Paper-II: Concerned Technical / Domain Subject', questions: 150, marks: 150 }
        ]
      }
    ],
    totalQuestions: '300 Questions',
    totalMarks: '300 or 450 Marks (depending on notification)',
    duration: '150 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (150 Marks)', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I Mental Ability' }),
      fromBlueprint('eng-civil', { stageTag: 'Technical Option (Planning/Hydrology/Civil)', excludeChapterIds: ['ce-eng-math'] })
    ],
    practicalTechnicalTopics: ['GIS Mapping, Hydrological Surveys, Mineral Exploration & Department-Specific Technical Modules'],
    languages: ['English', 'Telugu'],
    physicalStandards: null,
    skillTestDetails: 'No skill test unless post requires CPT.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'APPSC Technical Assistant / Gazetted Technical Notifications',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  })
];
