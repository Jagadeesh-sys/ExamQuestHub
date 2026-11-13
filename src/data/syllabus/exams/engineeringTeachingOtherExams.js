import { buildExamSyllabus, fromBlueprint } from './examBuilder.js';

/**
 * Engineering Government Examinations, Teaching Examinations,
 * State Government Examinations, and Other Central Government Examinations (2026).
 *
 * Note: SSC JE CE/ME/EE/CS-IT, UPSC ESE, APPSC/TGPSC AE/AEE/PL, Coast Guard Yantrik
 * appear under 'engineering' via secondaryCategoryIds.
 * Telangana DSC, APPSC/TGPSC DL/JL/PL/DyEO appear under 'teaching' via secondaryCategoryIds.
 */
export const ENGINEERING_TEACHING_OTHER_EXAMS = [
  // =========================================================================
  // ENGINEERING GOVERNMENT EXAMINATIONS
  // =========================================================================
  buildExamSyllabus({
    id: 'rrb-je-civil',
    examCode: 'RRB-JE-CE',
    name: 'RRB JE Civil Engineering (Junior Engineer — Civil)',
    shortName: 'RRB JE Civil',
    categoryId: 'engineering',
    secondaryCategoryIds: ['rrb'],
    popular: true,
    authority: 'Railway Recruitment Boards (RRBs), Ministry of Railways',
    introduction:
      'Branch-specific Civil Engineering CBT-1 & CBT-2 syllabus for Railway Junior Engineer (Works, P-Way, Bridge, Drawing & Design) posts.',
    qualification: '3-year Diploma in Civil Engineering or B.E./B.Tech in Civil Engineering from a recognized University/Institute.',
    ageLimit: '18 to 36 years (with Central Govt relaxations).',
    selectionProcess: 'CBT Stage-1 (Screening) → CBT Stage-2 (Merit — General + 100 Civil Technical Qs) → Document Verification & Medical.',
    stages: [
      { name: 'CBT Stage-1', mode: 'Computer Based Test', qualifyingOnly: true, description: '100 Qs / 100 Marks in 90 mins (Maths, Reasoning, GA, General Science).' },
      { name: 'CBT Stage-2 (Civil)', mode: 'Computer Based Test', qualifyingOnly: false, description: '150 Qs / 150 Marks in 120 mins (100 Qs Civil Technical + 50 General).' }
    ],
    examPattern: [
      {
        stageName: 'CBT-2 Civil (150 Qs · 150 Marks · 120 Mins)',
        sections: [
          { subject: 'General Awareness (15), Physics & Chemistry (15), Basics of Computers (10), Basics of Environment (10)', questions: 50, marks: 50 },
          { subject: 'Technical Abilities — Civil & Allied Engineering', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: 'CBT-1: 100 Qs | CBT-2: 150 Qs',
    totalMarks: 'CBT-1: 100 Marks | CBT-2: 150 Marks',
    duration: 'CBT-1: 90 Mins | CBT-2: 120 Mins',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('eng-civil', { stageTag: 'CBT-2 Technical Abilities (100 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT-1 Maths (30 Marks)' }),
      fromBlueprint('reasoning', { stageTag: 'CBT-1 Reasoning (25 Marks)' }),
      fromBlueprint('general-science', { stageTag: 'CBT-1 Science + CBT-2 Physics/Chem' }),
      fromBlueprint('computer-it', { stageTag: 'CBT-2 Computer Basics (10 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-number-systems', 'cs-cyber-security'] })
    ],
    practicalTechnicalTopics: ['AutoCAD Civil Drafting, Railway Track Geometry, Estimating/Costing & IS 456 Concrete Testing'],
    languages: ['English', 'Hindi', '13 Regional Languages incl. Telugu'],
    physicalStandards: { medicalStandard: 'A-3 (6/9 vision) for P-Way/Works & B-1/C-1 standards.' },
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'RRB CEN 03/2024 & 2025-26 JE Cycle',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'rrb-je-mechanical',
    examCode: 'RRB-JE-ME',
    name: 'RRB JE Mechanical Engineering (Junior Engineer — Mechanical)',
    shortName: 'RRB JE Mechanical',
    categoryId: 'engineering',
    secondaryCategoryIds: ['rrb'],
    authority: 'Railway Recruitment Boards (RRBs), Ministry of Railways',
    introduction:
      'Dedicated Mechanical & Allied Engineering syllabus for RRB Junior Engineer (Carriage & Wagon, Diesel/Electric Loco Workshop, Production Units).',
    qualification: '3-year Diploma or B.E./B.Tech in Mechanical, Production, Automobile, Manufacturing, Mechatronics, or Industrial Engineering.',
    ageLimit: '18 to 36 years.',
    selectionProcess: 'CBT Stage-1 (Screening) → CBT Stage-2 (Merit — 100 Mechanical Technical Qs + 50 General) → DV & Medical.',
    stages: [
      { name: 'CBT Stage-1', mode: 'Computer Based Test', qualifyingOnly: true, description: '100 Qs / 100 Marks in 90 mins.' },
      { name: 'CBT Stage-2 (Mechanical)', mode: 'Computer Based Test', qualifyingOnly: false, description: '150 Qs / 150 Marks in 120 mins.' }
    ],
    examPattern: [
      {
        stageName: 'CBT-2 Mechanical (150 Qs · 150 Marks · 120 Mins)',
        sections: [
          { subject: 'GA (15), Physics & Chemistry (15), Computer Basics (10), Environment & Pollution (10)', questions: 50, marks: 50 },
          { subject: 'Technical Abilities — Mechanical & Allied Engineering', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: 'CBT-1: 100 Qs | CBT-2: 150 Qs',
    totalMarks: 'CBT-1: 100 Marks | CBT-2: 150 Marks',
    duration: 'CBT-1: 90 Mins | CBT-2: 120 Mins',
    negativeMarking: '1/3rd mark per wrong answer.',
    subjects: [
      fromBlueprint('eng-mechanical', { stageTag: 'CBT-2 Technical Abilities (100 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT-1 Maths (30 Marks)' }),
      fromBlueprint('reasoning', { stageTag: 'CBT-1 Reasoning (25 Marks)' }),
      fromBlueprint('general-science', { stageTag: 'CBT-1 & CBT-2 Science' }),
      fromBlueprint('computer-it', { stageTag: 'CBT-2 Computer Basics (10 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-cyber-security'] })
    ],
    practicalTechnicalTopics: ['Machining, Welding Metallurgy, Metrology, CNC/CAD & Rolling Stock Bogie/Brake Systems'],
    languages: ['English', 'Hindi', '13 Regional Languages incl. Telugu'],
    physicalStandards: { medicalStandard: 'A-3 / B-1 / C-1 depending on Mechanical Workshop/Loco post.' },
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'RRB JE Mechanical Official Syllabus',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'rrb-je-electrical',
    examCode: 'RRB-JE-EE',
    name: 'RRB JE Electrical Engineering (Junior Engineer — Electrical)',
    shortName: 'RRB JE Electrical',
    categoryId: 'engineering',
    secondaryCategoryIds: ['rrb'],
    authority: 'Railway Recruitment Boards (RRBs), Ministry of Railways',
    introduction:
      'Dedicated Electrical & Allied Engineering syllabus for RRB Junior Engineer (TRD Traction Distribution, TRS Rolling Stock, General Electrical Services).',
    qualification: '3-year Diploma or B.E./B.Tech in Electrical or Electronics & Electrical Engineering.',
    ageLimit: '18 to 36 years.',
    selectionProcess: 'CBT Stage-1 (Screening) → CBT Stage-2 (Merit — 100 Electrical Qs + 50 General) → DV & Medical.',
    stages: [
      { name: 'CBT Stage-1', mode: 'Computer Based Test', qualifyingOnly: true, description: '100 Qs / 100 Marks in 90 mins.' },
      { name: 'CBT Stage-2 (Electrical)', mode: 'Computer Based Test', qualifyingOnly: false, description: '150 Qs / 150 Marks in 120 mins.' }
    ],
    examPattern: [
      {
        stageName: 'CBT-2 Electrical (150 Qs · 150 Marks · 120 Mins)',
        sections: [
          { subject: 'GA (15), Physics & Chemistry (15), Computer Basics (10), Environment & Pollution (10)', questions: 50, marks: 50 },
          { subject: 'Technical Abilities — Electrical & Allied Engineering', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: 'CBT-1: 100 Qs | CBT-2: 150 Qs',
    totalMarks: 'CBT-1: 100 Marks | CBT-2: 150 Marks',
    duration: 'CBT-1: 90 Mins | CBT-2: 120 Mins',
    negativeMarking: '1/3rd mark per wrong answer.',
    subjects: [
      fromBlueprint('eng-electrical', { stageTag: 'CBT-2 Technical Abilities (100 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT-1 Maths (30 Marks)' }),
      fromBlueprint('reasoning', { stageTag: 'CBT-1 Reasoning (25 Marks)' }),
      fromBlueprint('general-science', { stageTag: 'CBT-1 & CBT-2 Science' }),
      fromBlueprint('computer-it', { stageTag: 'CBT-2 Computer Basics (10 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-cyber-security'] })
    ],
    practicalTechnicalTopics: ['25 kV AC OHE Traction Substations, 3-Phase Induction/Traction Motors, Switchgear & IE Rules'],
    languages: ['English', 'Hindi', '13 Regional Languages incl. Telugu'],
    physicalStandards: { medicalStandard: 'A-3 / B-1 / C-1 Railway medical standards.' },
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'RRB JE Electrical Official Syllabus',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'rrb-je-electronics',
    examCode: 'RRB-JE-ECE',
    name: 'RRB JE Electronics Engineering (S&T / Telecommunication)',
    shortName: 'RRB JE Electronics',
    categoryId: 'engineering',
    secondaryCategoryIds: ['rrb'],
    authority: 'Railway Recruitment Boards (RRBs), Ministry of Railways',
    introduction:
      'Dedicated Electronics, Telecommunication & Instrumentation syllabus for RRB Junior Engineer (Signal & Telecommunication — S&T, IT/Computer).',
    qualification: '3-year Diploma or B.E./B.Tech in Electronics, ECE, Instrumentation, Telecommunication, or Computer Science/IT.',
    ageLimit: '18 to 36 years.',
    selectionProcess: 'CBT Stage-1 (Screening) → CBT Stage-2 (Merit — 100 ECE Technical Qs + 50 General) → DV & Medical.',
    stages: [
      { name: 'CBT Stage-1', mode: 'Computer Based Test', qualifyingOnly: true, description: '100 Qs / 100 Marks in 90 mins.' },
      { name: 'CBT Stage-2 (Electronics)', mode: 'Computer Based Test', qualifyingOnly: false, description: '150 Qs / 150 Marks in 120 mins.' }
    ],
    examPattern: [
      {
        stageName: 'CBT-2 Electronics (150 Qs · 150 Marks · 120 Mins)',
        sections: [
          { subject: 'GA (15), Physics & Chemistry (15), Computer Basics (10), Environment & Pollution (10)', questions: 50, marks: 50 },
          { subject: 'Technical Abilities — Electronics & Allied Engineering', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: 'CBT-1: 100 Qs | CBT-2: 150 Qs',
    totalMarks: 'CBT-1: 100 Marks | CBT-2: 150 Marks',
    duration: 'CBT-1: 90 Mins | CBT-2: 120 Mins',
    negativeMarking: '1/3rd mark per wrong answer.',
    subjects: [
      fromBlueprint('eng-electronics', { stageTag: 'CBT-2 Technical Abilities (100 Marks)' }),
      fromBlueprint('computer-it', { stageTag: 'CBT-2 Computer Basics & CS/IT Allied', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-dbms', 'cs-c-programming'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT-1 Maths' }),
      fromBlueprint('reasoning', { stageTag: 'CBT-1 Reasoning' })
    ],
    practicalTechnicalTopics: ['Electronic Interlocking, Optical Fiber Communication, Microprocessor 8085/8086 & Control Systems'],
    languages: ['English', 'Hindi', '13 Regional Languages incl. Telugu'],
    physicalStandards: { medicalStandard: 'A-3 / B-1 / C-1 Railway medical standards (colour vision mandatory for S&T).' },
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'RRB JE Electronics Official Syllabus',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'gate',
    examCode: 'GATE-2026',
    name: 'GATE (Graduate Aptitude Test in Engineering — CS, CE, ME, EE, EC)',
    shortName: 'GATE 2026',
    categoryId: 'engineering',
    popular: true,
    authority: 'IITs & IISc (Organized by IIT Guwahati for GATE 2026)',
    introduction:
      'National-level examination testing comprehensive undergraduate engineering & science knowledge for PSU recruitment (IOCL, NTPC, ONGC, BHEL, PGCIL, DRDO, BARC) and M.Tech/Ph.D. admissions.',
    qualification: 'Candidates currently studying in 3rd or higher years of any undergraduate degree or who have completed B.E./B.Tech/B.Arch/M.Sc/MCA.',
    ageLimit: 'No age limit for appearing in GATE (PSU age limits apply separately during recruitment).',
    selectionProcess: 'Single 3-Hour Computer Based Test (GATE Score valid for 3 years) → PSU Shortlisting & Personal Interview / COAP-CCMT Counselling.',
    stages: [
      { name: 'GATE CBT Examination', mode: 'Computer Based Test (MCQ + MSQ + NAT)', qualifyingOnly: false, description: '65 Questions / 100 Marks in 180 minutes (15 Marks General Aptitude + 85 Marks Engineering Math & Core Subject).' },
      { name: 'PSU Interview / GD (Post-GATE)', mode: 'PSU Board Assessment', qualifyingOnly: false, description: 'Separate shortlist and interview by Maharatna/Navratna PSUs based on GATE rank.' }
    ],
    examPattern: [
      {
        stageName: 'GATE 3-Hour CBT (65 Qs · 100 Marks · 180 Mins)',
        sections: [
          { subject: 'General Aptitude (Verbal, Quantitative, Analytical & Spatial Aptitude)', questions: 10, marks: 15 },
          { subject: 'Engineering Mathematics (Discrete Math for CS)', questions: '~8-10', marks: '13–15' },
          { subject: 'Core Engineering Discipline (CE / ME / EE / ECE / CSE / IT)', questions: '~45-47', marks: '70–72' }
        ]
      }
    ],
    totalQuestions: '65 Questions (MCQ, MSQ & NAT)',
    totalMarks: '100 Marks',
    duration: '3 Hours (180 Minutes)',
    negativeMarking: 'MCQs: 1/3rd negative (0.33 for 1-mark, 0.66 for 2-mark). ZERO negative marking for MSQs and Numerical Answer Type (NAT).',
    subjects: [
      fromBlueprint('eng-cse', { stageTag: 'GATE CS/DA Stream (85 Marks)' }),
      fromBlueprint('eng-civil', { stageTag: 'GATE CE Stream (85 Marks)' }),
      fromBlueprint('eng-mechanical', { stageTag: 'GATE ME Stream (85 Marks)' }),
      fromBlueprint('eng-electrical', { stageTag: 'GATE EE Stream (85 Marks)' }),
      fromBlueprint('eng-electronics', { stageTag: 'GATE EC Stream (85 Marks)' }),
      fromBlueprint('quantitative-aptitude', {
        stageTag: 'General Aptitude (15 Marks)',
        includeChapterIds: ['qa-number-system', 'qa-percentage', 'qa-ratio-proportion', 'qa-time-work', 'qa-time-speed-distance', 'qa-algebra', 'qa-geometry', 'qa-data-interpretation', 'qa-probability']
      })
    ],
    practicalTechnicalTopics: [
      'Question Types: Multiple Choice (MCQ), Multiple Select (MSQ — all correct options required), and Numerical Answer Type (NAT — virtual keypad)',
      'On-screen Scientific Calculator usage & Dimensional Analysis verification'
    ],
    languages: ['English only'],
    physicalStandards: null,
    skillTestDetails: 'No skill test; PSU interviews test conceptual engineering fundamentals.',
    interviewDetails: 'Conducted individually by PSUs (NTPC, IOCL, ONGC, PGCIL, BHEL, GAIL, NPCIL) for shortlisted GATE rankers.',
    officialNotificationRef: 'GATE 2026 Information Brochure (IIT Guwahati)',
    officialWebsiteUrl: 'https://gate2026.iitg.ac.in',
    officialNotificationUrl: 'https://gate2026.iitg.ac.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'state-ae-aee',
    examCode: 'STATE-AE-AEE',
    name: 'State AE & AEE Examinations (Assistant Executive Engineer & AE)',
    shortName: 'State AE & AEE',
    categoryId: 'engineering',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    authority: 'State Public Service Commissions (APPSC, TGPSC, BPSC, UPPSC, RPSC, TNPSC, KPSC)',
    introduction:
      'Combined State Engineering Services blueprint for Assistant Executive Engineer (B.E./B.Tech) and Assistant Engineer (Diploma/Degree) across Irrigation, R&B, Panchayat Raj, Public Health & Power Utilities.',
    qualification: 'AEE: B.E./B.Tech in Civil/Mechanical/Electrical/Agricultural Engineering | AE: Diploma or B.E./B.Tech in relevant branch.',
    ageLimit: '18/21 to 42/44/46 years (varies by State).',
    selectionProcess: 'Written Examination (Paper-I General Studies + Paper-II/III Technical Discipline Papers) → Document Verification.',
    stages: [
      { name: 'Paper-I: General Studies & Mental Ability', mode: 'CBT / OMR', qualifyingOnly: false, description: '150 Qs / 150 Marks in 150 mins (Polity, Economy, Geo, History, Current Affairs, State GK).' },
      { name: 'Paper-II (& III): Technical Discipline Paper', mode: 'CBT / OMR', qualifyingOnly: false, description: '150 Qs / 300 Marks (or 150 Marks) covering Civil, Mechanical, Electrical or Electronics.' }
    ],
    examPattern: [
      {
        stageName: 'Standard State AE/AEE Pattern (300–450 Marks)',
        sections: [
          { subject: 'Paper-I: General Studies, Mental Ability & State Heritage/Schemes', questions: 150, marks: 150 },
          { subject: 'Paper-II: Core Engineering Subject (Civil / Mechanical / Electrical)', questions: 150, marks: '150–300' }
        ]
      }
    ],
    totalQuestions: '300 to 450 Questions',
    totalMarks: '300 to 450 Marks',
    duration: '150 Minutes per Paper',
    negativeMarking: 'State-specific (1/3rd in APPSC; Nil in TGPSC).',
    subjects: [
      fromBlueprint('eng-civil', { stageTag: 'Civil Branch Paper' }),
      fromBlueprint('eng-mechanical', { stageTag: 'Mechanical Branch Paper' }),
      fromBlueprint('eng-electrical', { stageTag: 'Electrical Branch Paper' }),
      fromBlueprint('general-awareness', { stageTag: 'Paper-I General Studies' })
    ],
    practicalTechnicalTopics: ['State Public Works Department (PWD) Specifications, Irrigation Canals, Highway Geometric Standards & Substation Design'],
    languages: ['English', 'State Regional Language (for Paper-I in bilingual states)'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'Abolished for Group-II/AE/AEE in AP & Telangana; retained in selected State Engineering Services (UPPSC/BPSC/RPSC).',
    officialNotificationRef: 'State Engineering Services (AE/AEE) 2026 Reference',
    officialWebsiteUrl: 'https://psc.ap.gov.in',
    officialNotificationUrl: 'https://www.tgpsc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'state-je',
    examCode: 'STATE-JE',
    name: 'State Junior Engineer (JE) Examinations (Civil, Mechanical, Electrical)',
    shortName: 'State JE Exams',
    categoryId: 'engineering',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    authority: 'State Subordinate Service Selection Boards (RSSB, UPSSSC, OSSSC, UKPSC, HSSC, State Power Utilities)',
    introduction:
      'Diploma-level State Junior Engineer (JE) recruitment covering Technical Trade/Branch subjects, General Studies, State GK, Reasoning, and Computer Awareness.',
    qualification: '3-year Polytechnic Diploma (or B.E./B.Tech where permitted) in Civil, Mechanical, Electrical, or Electronics Engineering.',
    ageLimit: '18 to 40/44 years (State-specific).',
    selectionProcess: 'CBT / OMR Written Examination → Document Verification.',
    stages: [
      { name: 'Single / Dual Stage Written Test', mode: 'OMR / CBT', qualifyingOnly: false, description: '60–80% Technical Diploma Engineering + 20–40% General Studies, Reasoning & Computer.' }
    ],
    examPattern: [
      {
        stageName: 'Standard State JE Pattern (100–150 Qs · 2–3 Hrs)',
        sections: [
          { subject: 'Core Engineering Branch (Civil / Mechanical / Electrical)', questions: '80–100', marks: '80–100' },
          { subject: 'General Awareness, State GK, Reasoning & Basic Computer', questions: '20–50', marks: '20–50' }
        ]
      }
    ],
    totalQuestions: '100 to 150 Questions',
    totalMarks: '100 to 300 Marks',
    duration: '120 to 180 Minutes',
    negativeMarking: 'Varies by State Board (typically 1/4th or 1/3rd).',
    subjects: [
      fromBlueprint('eng-civil', { stageTag: 'Civil Diploma Level' }),
      fromBlueprint('eng-mechanical', { stageTag: 'Mechanical Diploma Level' }),
      fromBlueprint('eng-electrical', { stageTag: 'Electrical Diploma Level' }),
      fromBlueprint('computer-it', { stageTag: 'Computer Basics', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks'] }),
      fromBlueprint('general-awareness', { stageTag: 'State & General GK' })
    ],
    practicalTechnicalTopics: ['Surveying Field Book, Estimating & Costing, Workshop Practice & Electrical Wiring/IE Rules'],
    languages: ['English', 'Hindi', 'Respective State Language'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview (Group C technical post).',
    officialNotificationRef: 'All-State Junior Engineer Diploma Syllabus Reference',
    officialWebsiteUrl: 'https://upsssc.gov.in',
    officialNotificationUrl: 'https://rssb.rajasthan.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  // =========================================================================
  // TEACHING EXAMINATIONS
  // =========================================================================
  buildExamSyllabus({
    id: 'ctet-paper-1',
    examCode: 'CTET-P1',
    name: 'CTET Paper 1 (Primary Teacher — Classes I to V)',
    shortName: 'CTET Paper 1',
    categoryId: 'teaching',
    popular: true,
    authority: 'Central Board of Secondary Education (ctet.nic.in)',
    introduction:
      'Central Teacher Eligibility Test Paper-I qualifying certification required for Primary Teacher (PRT, Classes I–V) appointments in Kendriya Vidyalaya (KVS), Navodaya Vidyalaya (NVS), and Central/UT schools.',
    qualification: 'Senior Secondary (10+2) with at least 50% marks + 2-year Diploma in Elementary Education (D.El.Ed / B.El.Ed) per NCTE norms.',
    ageLimit: 'No upper age limit to appear for CTET (Certificate valid for lifetime).',
    selectionProcess: 'Offline OMR Qualifying Exam (Minimum 60% = 90/150 Marks for General; 55% = 82/150 for reserved categories as per appointing authority).',
    stages: [
      { name: 'CTET Paper-I Examination', mode: 'Offline OMR MCQ', qualifyingOnly: true, description: '150 Objective Qs / 150 Marks in 2.5 hours; lifetime eligibility certificate.' }
    ],
    examPattern: [
      {
        stageName: 'CTET Paper 1 (150 Qs · 150 Marks · 150 Mins)',
        sections: [
          { subject: 'Child Development and Pedagogy (Primary School Child 6–11 yrs)', questions: 30, marks: 30 },
          { subject: 'Language I (Comprehension + Pedagogy of Language Development)', questions: 30, marks: 30 },
          { subject: 'Language II (Comprehension + Pedagogy)', questions: 30, marks: 30 },
          { subject: 'Mathematics (Content 15 + Pedagogical Issues 15)', questions: 30, marks: 30 },
          { subject: 'Environmental Studies (EVS Content 15 + Pedagogical Issues 15)', questions: 30, marks: 30 }
        ]
      }
    ],
    totalQuestions: '150 Questions',
    totalMarks: '150 Marks',
    duration: '2 Hours 30 Minutes (150 Minutes)',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('teaching-pedagogy', { stageTag: 'CDP (30 Marks) + Subject Pedagogy', includeChapterIds: ['tp-child-dev', 'tp-inclusive', 'tp-learning-pedagogy'] }),
      fromBlueprint('english-language', { stageTag: 'Language I / II Option (30 Marks)', includeChapterIds: ['en-comprehension', 'en-parts-of-speech', 'en-tenses', 'en-error-detection', 'en-vocabulary'] }),
      fromBlueprint('quantitative-aptitude', {
        stageTag: 'Primary Mathematics (15 Content + 15 Pedagogy)',
        includeChapterIds: ['qa-number-system', 'qa-simplification', 'qa-lcm-hcf', 'qa-geometry', 'qa-mensuration-2d', 'qa-data-interpretation']
      }),
      fromBlueprint('general-awareness', {
        stageTag: 'Environmental Studies (EVS — Family, Food, Shelter, Water, Travel)',
        includeChapterIds: ['ga-environment-ecology', 'ga-indian-geography', 'ga-biology']
      })
    ],
    practicalTechnicalTopics: ['NEP 2020 Foundational Literacy & Numeracy (FLN / NIPUN Bharat), NCF 2005 & Classroom Activity Pedagogy'],
    languages: ['English', 'Hindi', '20 Scheduled Languages opted for Language I & II'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview (Qualifying Eligibility Certificate).',
    officialNotificationRef: 'CBSE CTET 2026 Information Bulletin',
    officialWebsiteUrl: 'https://ctet.nic.in',
    officialNotificationUrl: 'https://ctet.nic.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ctet-paper-2',
    examCode: 'CTET-P2',
    name: 'CTET Paper 2 (Elementary Teacher — Classes VI to VIII)',
    shortName: 'CTET Paper 2',
    categoryId: 'teaching',
    popular: true,
    authority: 'Central Board of Secondary Education (ctet.nic.in)',
    introduction:
      'Central Teacher Eligibility Test Paper-II certifying eligibility for Trained Graduate Teachers (TGT / Elementary Classes VI–VIII) in Mathematics & Science or Social Studies/Social Science.',
    qualification: 'Graduation + 2-year D.El.Ed OR Graduation (50%) + 1-year/2-year B.Ed / 4-year B.El.Ed / B.A.B.Ed / B.Sc.B.Ed per NCTE norms.',
    ageLimit: 'No upper age limit (Lifetime Certificate Validity).',
    selectionProcess: 'Offline OMR Qualifying Exam (60% = 90/150 Marks qualifying benchmark).',
    stages: [
      { name: 'CTET Paper-II Examination', mode: 'Offline OMR MCQ', qualifyingOnly: true, description: '150 Objective Qs / 150 Marks in 150 minutes.' }
    ],
    examPattern: [
      {
        stageName: 'CTET Paper 2 (150 Qs · 150 Marks · 150 Mins)',
        sections: [
          { subject: 'Child Development and Pedagogy (Elementary Child 11–14 yrs)', questions: 30, marks: 30 },
          { subject: 'Language I (Comprehension + Pedagogy)', questions: 30, marks: 30 },
          { subject: 'Language II (Comprehension + Pedagogy)', questions: 30, marks: 30 },
          { subject: 'Mathematics & Science (30+30) OR Social Studies / Social Science (60)', questions: 60, marks: 60 }
        ]
      }
    ],
    totalQuestions: '150 Questions',
    totalMarks: '150 Marks',
    duration: '2 Hours 30 Minutes (150 Minutes)',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('teaching-pedagogy', { stageTag: 'CDP (30 Marks) + Subject Pedagogy', includeChapterIds: ['tp-child-dev', 'tp-inclusive', 'tp-learning-pedagogy'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Mathematics Stream (30 Marks)' }),
      fromBlueprint('general-science', { stageTag: 'Science Stream (30 Marks)' }),
      fromBlueprint('general-awareness', {
        stageTag: 'Social Studies Stream (60 Marks — History, Geography, Civics)',
        includeChapterIds: ['ga-ancient-history', 'ga-medieval-history', 'ga-modern-history', 'ga-national-movement', 'ga-constitution', 'ga-polity', 'ga-indian-geography', 'ga-world-geography', 'ga-physical-geography']
      }),
      fromBlueprint('english-language', { stageTag: 'Language I / II Option (30 Marks)' })
    ],
    practicalTechnicalTopics: ['NCERT Class VI–VIII Textbook Concepts & Subject-Specific Pedagogical Assessment (Diagnostic & Remedial Teaching)'],
    languages: ['English', 'Hindi', '20 Languages for Language I & II'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CBSE CTET 2026 Information Bulletin',
    officialWebsiteUrl: 'https://ctet.nic.in',
    officialNotificationUrl: 'https://ctet.nic.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ap-tet',
    examCode: 'AP-TET',
    name: 'AP TET (Andhra Pradesh Teacher Eligibility Test — Paper 1A, 1B, 2A, 2B)',
    shortName: 'AP TET',
    categoryId: 'teaching',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Andhra Pradesh',
    popular: true,
    authority: 'Department of School Education, Govt. of Andhra Pradesh (cse.ap.gov.in)',
    introduction:
      'State Teacher Eligibility Test mandatory for AP DSC recruitment; AP TET score carries 20% weightage in final AP DSC merit across Paper 1A (SGT), 1B (Special Ed), 2A (School Assistant), and 2B (Special Ed).',
    qualification: 'Paper 1A: Intermediate + D.El.Ed | Paper 2A: Degree + B.Ed / Language Pandit.',
    ageLimit: 'No upper age limit for AP TET.',
    selectionProcess: 'Computer Based Test (150 Marks — 60% OC, 50% BC, 40% SC/ST/PwBD qualifying); 20% weightage transferred to AP DSC.',
    stages: [
      { name: 'AP TET CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '150 Qs / 150 Marks in 150 minutes; lifetime validity + 20% weightage in DSC.' }
    ],
    examPattern: [
      {
        stageName: 'AP TET Paper 1A & Paper 2A (150 Qs · 150 Marks · 150 Mins)',
        sections: [
          { subject: 'Child Development & Pedagogy (incl. ICT Integration)', questions: 30, marks: 30 },
          { subject: 'Language I (Telugu / Urdu / Hindi / Kannada / Tamil / Odia)', questions: 30, marks: 30 },
          { subject: 'Language II (English — Content 24 + Methodology 6)', questions: 30, marks: 30 },
          { subject: 'Paper 1A: Maths (30) + EVS (30) | Paper 2A: Subject Content (48) + Methodology (12)', questions: 60, marks: 60 }
        ]
      }
    ],
    totalQuestions: '150 Questions',
    totalMarks: '150 Marks',
    duration: '150 Minutes',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('teaching-pedagogy', { stageTag: 'CDP & ICT (30 Marks)', includeChapterIds: ['tp-child-dev', 'tp-inclusive', 'tp-learning-pedagogy'] }),
      fromBlueprint('english-language', { stageTag: 'Language II — English (30 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Maths Content & Methodology (Paper 1A / 2A)' }),
      fromBlueprint('general-science', { stageTag: 'EVS / Physical & Biological Science' }),
      fromBlueprint('general-awareness', { stageTag: 'Social Studies & AP SCERT Textbooks', includeChapterIds: ['ga-ancient-history', 'ga-medieval-history', 'ga-modern-history', 'ga-constitution', 'ga-indian-geography', 'ga-ap-gk'] })
    ],
    practicalTechnicalTopics: ['AP SCERT Classes 1–10 Revised Textbooks, ICT in Education (Computer Basics) & Special Education Modules (1B/2B)'],
    languages: ['English & Telugu / Opted Medium'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'AP TET Official Syllabus (CSE AP)',
    officialWebsiteUrl: 'https://cse.ap.gov.in',
    officialNotificationUrl: 'https://aptet.apcfss.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'tg-tet',
    examCode: 'TG-TET',
    name: 'TG TET (Telangana Teacher Eligibility Test — Paper I & Paper II)',
    shortName: 'TG TET',
    categoryId: 'teaching',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Telangana',
    popular: true,
    authority: 'Department of School Education, Govt. of Telangana (schooledu.telangana.gov.in)',
    introduction:
      'Twice-yearly Telangana Teacher Eligibility Test certifying candidates for Classes I–V (Paper-I) and Classes VI–VIII (Paper-II), contributing 20% weightage to Telangana DSC.',
    qualification: 'Paper-I: 10+2 + D.El.Ed | Paper-II: Degree + B.Ed / B.El.Ed.',
    ageLimit: 'No age bar for appearing in TG TET.',
    selectionProcess: 'Computer Based Test (150 Marks — 60% Gen, 50% BC, 40% SC/ST/PwBD qualifying); 20% weightage in TG DSC.',
    stages: [
      { name: 'TG TET CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '150 Qs / 150 Marks in 150 minutes; lifetime validity.' }
    ],
    examPattern: [
      {
        stageName: 'TG TET Paper I & Paper II (150 Qs · 150 Marks · 150 Mins)',
        sections: [
          { subject: 'Child Development and Pedagogy', questions: 30, marks: 30 },
          { subject: 'Language I (Telugu / Urdu / Hindi / Bengali / Kannada / Marathi / Tamil / Gujarati)', questions: 30, marks: 30 },
          { subject: 'Language II (English — Content 24 + Pedagogy 6)', questions: 30, marks: 30 },
          { subject: 'Paper I: Maths (30) + EVS (30) | Paper II: Maths & Science (60) OR Social Studies (60)', questions: 60, marks: 60 }
        ]
      }
    ],
    totalQuestions: '150 Questions',
    totalMarks: '150 Marks',
    duration: '2 Hours 30 Minutes',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('teaching-pedagogy', { stageTag: 'CDP & Pedagogy (30 Marks)', includeChapterIds: ['tp-child-dev', 'tp-inclusive', 'tp-learning-pedagogy'] }),
      fromBlueprint('english-language', { stageTag: 'Language II — English (30 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Mathematics Content & Pedagogy' }),
      fromBlueprint('general-science', { stageTag: 'EVS / Science Content & Pedagogy' }),
      fromBlueprint('general-awareness', { stageTag: 'Social Studies & Telangana SCERT', includeChapterIds: ['ga-ancient-history', 'ga-medieval-history', 'ga-modern-history', 'ga-constitution', 'ga-indian-geography', 'ga-telangana-gk'] })
    ],
    practicalTechnicalTopics: ['Telangana SCERT Classes 1–10 Textbooks & Subject Pedagogy'],
    languages: ['English & Telugu / Urdu / Opted Medium'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'TG TET 2025-26 Official Notification',
    officialWebsiteUrl: 'https://schooledu.telangana.gov.in',
    officialNotificationUrl: 'https://tgtet2024.aptonline.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ap-dsc',
    examCode: 'AP-DSC',
    name: 'AP DSC (Mega DSC — SGT, School Assistant, TGT, PGT & PET)',
    shortName: 'AP DSC',
    categoryId: 'teaching',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Andhra Pradesh',
    popular: true,
    authority: 'Department of School Education, Govt. of Andhra Pradesh (apdsc.apcfss.in)',
    introduction:
      'Statewide teacher recruitment for Secondary Grade Teachers (SGT), School Assistants (SA), Trained Graduate Teachers (TGT), Post Graduate Teachers (PGT), and Physical Education Teachers (PET) in AP Government, ZP/MPP, Municipal & Residential schools.',
    qualification: 'SGT: Intermediate + D.El.Ed + AP TET Paper 1 | SA: Degree + B.Ed + AP TET Paper 2 | PGT: PG + B.Ed.',
    ageLimit: '18 to 44 years (with AP Govt age relaxations).',
    selectionProcess: 'AP DSC Computer Based Test (80% Weightage — 80 Marks) + AP TET Score (20% Weightage — 20 Marks) = 100 Marks Final Merit (100% DSC for PGT/PET).',
    stages: [
      { name: 'AP DSC Written CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '160 Qs / 80 Marks (0.5 mark per question) in 150 minutes for SGT & School Assistant; 200 Qs / 100 Marks for PGT/PET.' },
      { name: 'Certificate Verification', mode: 'District Verification', qualifyingOnly: true, description: 'Merit-based district counseling and posting.' }
    ],
    examPattern: [
      {
        stageName: 'AP DSC SGT & School Assistant Pattern (160 Qs · 80 Marks + 20 TET = 100)',
        sections: [
          { subject: 'General Knowledge & Current Affairs', questions: 16, marks: 8 },
          { subject: 'Perspectives in Education', questions: 8, marks: 4 },
          { subject: 'Classroom Implications of Educational Psychology', questions: 16, marks: 8 },
          { subject: 'Subject Content (Language, Maths, Science, Social Studies — Post Specific)', questions: 80, marks: 40 },
          { subject: 'Subject Methodology / Pedagogy', questions: 40, marks: 20 }
        ]
      }
    ],
    totalQuestions: 'SGT/SA: 160 Qs | PGT/PET: 200 Qs',
    totalMarks: '80 Marks DSC + 20 Marks TET = 100 Marks',
    duration: '2 Hours 30 Minutes (SGT/SA) | 3 Hours (PGT/PET)',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'GK & Current Affairs (AP + National)', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('teaching-pedagogy', { stageTag: 'Perspectives in Education, Educational Psychology & Methodology' }),
      fromBlueprint('english-language', { stageTag: 'English Content & Methodology' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Mathematics Content & Methodology' }),
      fromBlueprint('general-science', { stageTag: 'Physical & Biological Science Content' })
    ],
    practicalTechnicalTopics: ['AP SCERT Textbooks (Classes 1–10 for SGT/SA, Inter/PG for PGT/TGT), NEP 2020, RTE Act 2009 & English Proficiency Test (for Model/Residential PGT/TGT)'],
    languages: ['English', 'Telugu', 'Urdu'],
    physicalStandards: null,
    skillTestDetails: 'No skill test (Physical Education achievements verified for PET).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'AP Mega DSC Official Recruitment Rules',
    officialWebsiteUrl: 'https://cse.ap.gov.in',
    officialNotificationUrl: 'https://apdsc.apcfss.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'kvs-prt',
    examCode: 'KVS-PRT',
    name: 'KVS PRT (Kendriya Vidyalaya Sangathan Primary Teacher)',
    shortName: 'KVS PRT',
    categoryId: 'teaching',
    popular: true,
    authority: 'Kendriya Vidyalaya Sangathan (kvsangathan.nic.in)',
    introduction:
      'Central Government permanent teaching recruitment for Primary Teachers (Classes I–V) across 1,250+ Kendriya Vidyalayas in India and abroad.',
    qualification: 'Senior Secondary (50%) + 2-year D.El.Ed / JBT / B.El.Ed + CTET Paper 1 Qualified.',
    ageLimit: 'Maximum 30 years (SC/ST +5, OBC +3, Women +10 years relaxation for KVS teaching posts).',
    selectionProcess: 'CBT Written Examination (180 Marks — 70% weightage) → Demo Teaching & Interview (60 Marks — 30% weightage).',
    stages: [
      { name: 'Written CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '180 Qs / 180 Marks in 180 minutes across Languages, GA/Reasoning/Computer, Perspectives on Education & Subject Concerned.' },
      { name: 'Professional Competency Test', mode: 'Demo Teaching (30) + Interview (30)', qualifyingOnly: false, description: '60 Marks total; 70:30 ratio between Written and Demo+Interview.' }
    ],
    examPattern: [
      {
        stageName: 'KVS PRT CBT (180 Qs · 180 Marks · 180 Mins)',
        sections: [
          { subject: 'Part I: Proficiency in Languages — General English (10) & General Hindi (10)', questions: 20, marks: 20 },
          { subject: 'Part II: General Awareness & CA (10), Reasoning (5), Computer Literacy (5)', questions: 20, marks: 20 },
          { subject: 'Part III: Perspectives on Education and Leadership', questions: 60, marks: 60 },
          { subject: 'Part IV: Subject Concerned (English, Hindi, Maths & EVS — NCERT Class I–V level)', questions: 80, marks: 80 }
        ]
      }
    ],
    totalQuestions: '180 Questions',
    totalMarks: '180 Written + 60 Demo/Interview',
    duration: '180 Minutes (No sectional time limit)',
    negativeMarking: 'No negative marking in KVS CBT.',
    subjects: [
      fromBlueprint('teaching-pedagogy', { stageTag: 'Part III: Perspectives on Education & Leadership (60 Marks)' }),
      fromBlueprint('english-language', { stageTag: 'Part I & Part IV English' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Part IV Primary Maths (NCERT)', includeChapterIds: ['qa-number-system', 'qa-simplification', 'qa-lcm-hcf', 'qa-percentage', 'qa-geometry', 'qa-mensuration-2d', 'qa-data-interpretation'] }),
      fromBlueprint('general-awareness', { stageTag: 'Part II GA & Part IV EVS', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Part II Computer Literacy (5 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks'] })
    ],
    practicalTechnicalTopics: ['Demo Teaching (30 Marks): Classroom lesson delivery, TLM usage, bilingual communication & NEP 2020 NIPUN Bharat'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: '30-Mark Demo Teaching class before the selection panel.',
    interviewDetails: '30-Mark Personal Interview + 30-Mark Demo Teaching (combined 30% weightage in final merit).',
    officialNotificationRef: 'KVS PRT Official Recruitment Syllabus',
    officialWebsiteUrl: 'https://kvsangathan.nic.in',
    officialNotificationUrl: 'https://kvsangathan.nic.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'kvs-tgt',
    examCode: 'KVS-TGT',
    name: 'KVS TGT (Kendriya Vidyalaya Trained Graduate Teacher)',
    shortName: 'KVS TGT',
    categoryId: 'teaching',
    authority: 'Kendriya Vidyalaya Sangathan (kvsangathan.nic.in)',
    introduction:
      'Central Government recruitment for Trained Graduate Teachers (Classes VI–X) in English, Hindi, Sanskrit, Mathematics, Science, Social Studies, Art, PHE, and Work Experience.',
    qualification: 'Bachelor’s Degree with minimum 50% marks in concerned subject combination + B.Ed + CTET Paper 2 Qualified.',
    ageLimit: 'Maximum 35 years (Women +10 yrs, SC/ST +5 yrs, OBC +3 yrs).',
    selectionProcess: 'CBT Written Examination (180 Marks — 70% weightage) → Demo Teaching (30) + Interview (30) (30% weightage).',
    stages: [
      { name: 'Written CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '180 Qs / 180 Marks in 180 minutes (80 General/Pedagogy + 100 Subject Specific).' },
      { name: 'Demo Teaching & Interview', mode: 'Panel Assessment', qualifyingOnly: false, description: '60 Marks (30 Demo + 30 Interview).' }
    ],
    examPattern: [
      {
        stageName: 'KVS TGT CBT (180 Qs · 180 Marks · 180 Mins)',
        sections: [
          { subject: 'Part I: General English (10) & General Hindi (10)', questions: 20, marks: 20 },
          { subject: 'Part II: GA & CA (10), Reasoning (5), Computer Literacy (5)', questions: 20, marks: 20 },
          { subject: 'Part III: Perspectives on Education and Leadership', questions: 40, marks: 40 },
          { subject: 'Part IV: Subject Specific Syllabus (NCERT Classes VI–X & Graduation Level)', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: '180 Questions',
    totalMarks: '180 Written + 60 Demo/Interview',
    duration: '180 Minutes',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('teaching-pedagogy', { stageTag: 'Part III: Perspectives on Education (40 Marks)' }),
      fromBlueprint('english-language', { stageTag: 'Part I General English & TGT English Option' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'TGT Mathematics Subject Option' }),
      fromBlueprint('general-science', { stageTag: 'TGT Science Subject Option' }),
      fromBlueprint('general-awareness', { stageTag: 'Part II GA & TGT Social Studies Option', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Part II Computer Literacy (5 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks'] })
    ],
    practicalTechnicalTopics: ['NCERT Class VI–X Complete Subject Mastery & Pedagogical Lesson Planning for Demo Teaching'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: '30-Mark Demo Teaching evaluation.',
    interviewDetails: '30-Mark Personal Interview + 30-Mark Demo Teaching.',
    officialNotificationRef: 'KVS TGT Official Syllabus Reference',
    officialWebsiteUrl: 'https://kvsangathan.nic.in',
    officialNotificationUrl: 'https://kvsangathan.nic.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'kvs-pgt',
    examCode: 'KVS-PGT',
    name: 'KVS PGT (Kendriya Vidyalaya Post Graduate Teacher)',
    shortName: 'KVS PGT',
    categoryId: 'teaching',
    authority: 'Kendriya Vidyalaya Sangathan (kvsangathan.nic.in)',
    introduction:
      'Recruits Post Graduate Teachers (Classes XI–XII) across Physics, Chemistry, Maths, Biology, History, Geography, Economics, Commerce, Computer Science, English, Hindi & Biotech.',
    qualification: 'Master’s Degree in concerned subject with at least 50% marks + B.Ed (B.Ed not mandatory for PGT Computer Science).',
    ageLimit: 'Maximum 40 years (Women +10 yrs, SC/ST +5 yrs, OBC +3 yrs).',
    selectionProcess: 'CBT Written Examination (180 Marks — 70% weightage) → Demo Teaching (30) + Interview (30) (30% weightage).',
    stages: [
      { name: 'Written CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '180 Qs / 180 Marks in 180 minutes (80 General/Pedagogy + 100 Senior Secondary & PG Subject).' },
      { name: 'Demo Teaching & Interview', mode: 'Panel Assessment', qualifyingOnly: false, description: '60 Marks (30 Demo + 30 Interview).' }
    ],
    examPattern: [
      {
        stageName: 'KVS PGT CBT (180 Qs · 180 Marks · 180 Mins)',
        sections: [
          { subject: 'Part I: General English (10) & General Hindi (10)', questions: 20, marks: 20 },
          { subject: 'Part II: GA & CA (10), Reasoning (5), Computer Literacy (5)', questions: 20, marks: 20 },
          { subject: 'Part III: Perspectives on Education and Leadership', questions: 40, marks: 40 },
          { subject: 'Part IV: Concerned Post Graduate Subject (NCERT Class XI–XII + PG Depth)', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: '180 Questions',
    totalMarks: '180 Written + 60 Demo/Interview',
    duration: '180 Minutes',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('teaching-pedagogy', { stageTag: 'Part III: Perspectives on Education (40 Marks)' }),
      fromBlueprint('computer-it', { stageTag: 'Part II Computer + PGT Computer Science Subject Option (100 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'Part II GA + PGT History/Geo/Polity/Economics', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('english-language', { stageTag: 'Part I & PGT English Option' })
    ],
    practicalTechnicalTopics: ['CBSE Class XI–XII NCERT Core Concepts (Python/SQL/Networks for PGT CS; Calculus/Vectors for PGT Maths; Organic/Physical Chem; Electromagnetism)'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: '30-Mark Demo Teaching at Class XI–XII level.',
    interviewDetails: '30-Mark Personal Interview + 30-Mark Demo Teaching.',
    officialNotificationRef: 'KVS PGT Official Syllabus Reference',
    officialWebsiteUrl: 'https://kvsangathan.nic.in',
    officialNotificationUrl: 'https://kvsangathan.nic.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'nvs-tgt',
    examCode: 'NVS-TGT',
    name: 'NVS TGT (Navodaya Vidyalaya Samiti Trained Graduate Teacher)',
    shortName: 'NVS TGT',
    categoryId: 'teaching',
    authority: 'Navodaya Vidyalaya Samiti (navodaya.gov.in)',
    introduction:
      'Recruits residential Trained Graduate Teachers (Classes VI–X) for Jawahar Navodaya Vidyalayas across India.',
    qualification: 'Bachelor’s Degree with 50% marks in concerned subject + B.Ed + CTET Paper 2 Qualified.',
    ageLimit: 'Maximum 35 years (with Central Govt relaxations).',
    selectionProcess: 'CBT Written Examination (120 Merit Marks + 30 Language Qualifying) → Personal Interview.',
    stages: [
      { name: 'Written CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '150 Qs / 150 Marks in 180 mins (Part I–V = 120 Merit; Part VI Language Competency = 30 Qualifying with 40% min in each language).' },
      { name: 'Personal Interview', mode: 'Panel Interview', qualifyingOnly: false, description: 'Assesses residential school adaptability and subject pedagogy.' }
    ],
    examPattern: [
      {
        stageName: 'NVS TGT CBT (150 Qs · 120 Merit + 30 Qualifying · 180 Mins)',
        sections: [
          { subject: 'Part I: General Awareness (10) & Part II: Reasoning Ability (10)', questions: 20, marks: 20 },
          { subject: 'Part III: Knowledge of ICT (10) & Part IV: Teaching Aptitude (10)', questions: 20, marks: 20 },
          { subject: 'Part V: Domain Knowledge (Concerned Subject + NEP 2020 + Experiential Learning)', questions: 80, marks: 80 },
          { subject: 'Part VI: Language Competency (English 10, Hindi 10, Regional Language 10 — 40% Qualifying)', questions: 30, marks: '30 (Qualifying)' }
        ]
      }
    ],
    totalQuestions: '150 Questions',
    totalMarks: '120 Merit Marks + 30 Qualifying Language Marks',
    duration: '3 Hours (180 Minutes)',
    negativeMarking: '0.25 marks deducted for every wrong answer.',
    subjects: [
      fromBlueprint('teaching-pedagogy', { stageTag: 'Part IV Teaching Aptitude & NEP 2020' }),
      fromBlueprint('computer-it', { stageTag: 'Part III Knowledge of ICT (10 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-cyber-security'] }),
      fromBlueprint('general-awareness', { stageTag: 'Part I General Awareness (10 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'Part II Reasoning Ability (10 Marks)' }),
      fromBlueprint('english-language', { stageTag: 'Part VI Language Competency & TGT English' })
    ],
    practicalTechnicalTopics: ['Experiential Activity-Based Pedagogy, NEP 2020 & Residential School Mentorship'],
    languages: ['English', 'Hindi', 'Regional Language for Part VI (incl. Telugu)'],
    physicalStandards: null,
    skillTestDetails: 'No separate demo test (evaluated during interview).',
    interviewDetails: 'Personal Interview at NVS regional centers.',
    officialNotificationRef: 'NVS Direct Recruitment Drive Syllabus',
    officialWebsiteUrl: 'https://navodaya.gov.in',
    officialNotificationUrl: 'https://navodaya.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'nvs-pgt',
    examCode: 'NVS-PGT',
    name: 'NVS PGT (Navodaya Vidyalaya Samiti Post Graduate Teacher)',
    shortName: 'NVS PGT',
    categoryId: 'teaching',
    authority: 'Navodaya Vidyalaya Samiti (navodaya.gov.in)',
    introduction:
      'Recruits residential Post Graduate Teachers (Classes XI–XII) in Jawahar Navodaya Vidyalayas across Humanities, Commerce, Sciences, and Computer Science.',
    qualification: 'Master’s Degree in concerned subject with minimum 50% marks + B.Ed (except PGT CS where B.Ed is desirable/relaxed as per notice).',
    ageLimit: 'Maximum 40 years (with relaxations).',
    selectionProcess: 'CBT Written Examination (130 Merit + 20 Qualifying Language) → Personal Interview.',
    stages: [
      { name: 'Written CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '150 Qs in 180 mins (130 Merit Marks + 20 Qualifying Language Test).' },
      { name: 'Personal Interview', mode: 'Panel Interview', qualifyingOnly: false, description: 'Subject depth and residential pedagogy interview.' }
    ],
    examPattern: [
      {
        stageName: 'NVS PGT CBT (150 Qs · 130 Merit + 20 Qualifying · 180 Mins)',
        sections: [
          { subject: 'Part I: General Awareness (10) & Part II: Reasoning Ability (20)', questions: 30, marks: 30 },
          { subject: 'Part III: Knowledge of ICT (10) & Part IV: Teaching Aptitude (10)', questions: 20, marks: 20 },
          { subject: 'Part V: Domain Knowledge (Concerned PG Subject + NEP 2020 + Case Study Pedagogy)', questions: 80, marks: 80 },
          { subject: 'Part VI: Language Competency (General English 10 + General Hindi 10 — 40% Qualifying)', questions: 20, marks: '20 (Qualifying)' }
        ]
      }
    ],
    totalQuestions: '150 Questions',
    totalMarks: '130 Merit Marks + 20 Qualifying',
    duration: '3 Hours (180 Minutes)',
    negativeMarking: '0.25 marks deducted per wrong answer.',
    subjects: [
      fromBlueprint('teaching-pedagogy', { stageTag: 'Part IV Teaching Aptitude & NEP 2020' }),
      fromBlueprint('computer-it', { stageTag: 'Part III ICT + PGT Computer Science Option' }),
      fromBlueprint('reasoning', { stageTag: 'Part II Reasoning (20 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'Part I GA & PGT Humanities/Eco', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('english-language', { stageTag: 'Part VI English & PGT English' })
    ],
    practicalTechnicalTopics: ['Senior Secondary CBSE Curriculum Depth, Case-Study Pedagogy & Experiential Learning'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'No separate typing test.',
    interviewDetails: 'Personal Interview conducted by NVS.',
    officialNotificationRef: 'NVS Direct PGT Recruitment Pattern',
    officialWebsiteUrl: 'https://navodaya.gov.in',
    officialNotificationUrl: 'https://navodaya.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'ugc-net',
    examCode: 'NTA-UGC-NET',
    name: 'UGC NET (Assistant Professor, JRF & Ph.D. Eligibility — 85 Subjects)',
    shortName: 'UGC NET',
    categoryId: 'teaching',
    popular: true,
    authority: 'National Testing Agency (ugcnet.nta.ac.in)',
    introduction:
      'National eligibility examination conducted twice a year (June & December) for Junior Research Fellowship (JRF), Assistant Professor appointment, and Ph.D. admission across 85 Humanities, Social Science, Commerce, Management, Law, and Computer Science subjects.',
    qualification: 'Master’s Degree or equivalent with at least 55% marks (50% for OBC-NCL/SC/ST/PwD/Third Gender); final-year PG students & 4-year UG Honours (75%) also eligible.',
    ageLimit: 'JRF: Maximum 30 years (+5 yrs SC/ST/OBC-NCL/PwD/Women) | Assistant Professor & Ph.D.: No upper age limit.',
    selectionProcess: 'Single 3-Hour Computer Based Test (Paper 1 + Paper 2 combined without break) → Category-wise Percentile/Cutoff Merit.',
    stages: [
      { name: 'Paper 1 (Teaching & Research Aptitude)', mode: 'CBT Objective (Compulsory)', qualifyingOnly: false, description: '50 Questions / 100 Marks covering 10 standardized NTA units.' },
      { name: 'Paper 2 (Subject Specific — 85 Subjects)', mode: 'CBT Objective', qualifyingOnly: false, description: '100 Questions / 200 Marks in opted Postgraduate subject.' }
    ],
    examPattern: [
      {
        stageName: 'UGC NET CBT (150 Qs · 300 Marks · 180 Mins Continuous)',
        sections: [
          { subject: 'Paper 1: Teaching Aptitude, Research Aptitude, Comprehension, Communication, Math/Reasoning, Logical Reasoning, DI, ICT, People/Environment, Higher Education', questions: 50, marks: 100 },
          { subject: 'Paper 2: Subject Selected by Candidate (Commerce, CS, English, History, Pol Sci, Economics, Education, Law, etc.)', questions: 100, marks: 200 }
        ]
      }
    ],
    totalQuestions: '150 Questions (Paper 1: 50 + Paper 2: 100)',
    totalMarks: '300 Marks (2 Marks per Question)',
    duration: '3 Hours (180 Minutes, no break)',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('teaching-pedagogy', { stageTag: 'Paper 1: Teaching, Research & Higher Education (Units 1, 2, 10)' }),
      fromBlueprint('reasoning', { stageTag: 'Paper 1: Mathematical & Logical Reasoning (Indian Logic — Pramanas, Hetvabhasa)', includeChapterIds: ['rs-number-series', 'rs-alphabet-series', 'rs-coding-decoding', 'rs-blood-relations', 'rs-direction-sense', 'rs-syllogism', 'rs-venn-diagrams', 'rs-analogy'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Paper 1: Data Interpretation & Math Reasoning', includeChapterIds: ['qa-percentage', 'qa-ratio-proportion', 'qa-average', 'qa-profit-loss', 'qa-simple-interest', 'qa-data-interpretation'] }),
      fromBlueprint('computer-it', { stageTag: 'Paper 1 ICT + Paper 2 Computer Science & Applications (Code 87)' }),
      fromBlueprint('general-awareness', { stageTag: 'Paper 1 People, Development & Environment (Unit 9)', includeChapterIds: ['ga-environment-ecology', 'ga-polity', 'ga-govt-schemes'] })
    ],
    practicalTechnicalTopics: ['Paper 1 Indian Logic (Nyaya, Anumana, Vyapti, Hetvabhasa), ICT Initiatives (SWAYAM, SWAYAMPRABHA, MOOCs, NAD) & NEP 2020'],
    languages: ['English', 'Hindi (Paper 1 & most Paper 2 subjects bilingual)'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview for NET/JRF (universities conduct Ph.D./Faculty interviews post-qualification).',
    officialNotificationRef: 'NTA UGC NET June / December 2026',
    officialWebsiteUrl: 'https://ugcnet.nta.ac.in',
    officialNotificationUrl: 'https://www.ugcnetonline.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'csir-net',
    examCode: 'CSIR-UGC-NET',
    name: 'CSIR NET (Joint CSIR-UGC NET — Science Subjects)',
    shortName: 'CSIR NET',
    categoryId: 'teaching',
    authority: 'National Testing Agency / CSIR (csirnet.nta.ac.in)',
    introduction:
      'National eligibility test for JRF, Assistant Professor, and Ph.D. in five science disciplines: Chemical Sciences, Earth/Atmospheric/Ocean/Planetary Sciences, Life Sciences, Mathematical Sciences, and Physical Sciences.',
    qualification: 'M.Sc. or equivalent degree / Integrated BS-MS / BS-4 years / B.E./B.Tech / B.Pharma / MBBS with at least 55% marks (50% for SC/ST/OBC-NCL/PwD).',
    ageLimit: 'JRF: Maximum 30 years (relaxable up to 5 years) | Assistant Professor & Ph.D.: No upper age limit.',
    selectionProcess: 'Single-Session Computer Based Test (Part A General Aptitude + Part B & C Research/Subject Analytical Questions).',
    stages: [
      { name: 'CSIR NET CBT', mode: 'Computer Based Test (3 Parts)', qualifyingOnly: false, description: '200 Marks in 180 minutes across General Aptitude (30 Marks) and Subject Parts B & C (170 Marks).' }
    ],
    examPattern: [
      {
        stageName: 'CSIR NET CBT (200 Marks · 180 Mins — Subject-Wise Question Count)',
        sections: [
          { subject: 'Part A (Common): General Aptitude (Logical Reasoning, Graphical Analysis, Numerical Ability, Quantitative Comparison, Puzzles)', questions: '20 (Attempt 15)', marks: 30 },
          { subject: 'Part B: Subject-Related Conventional MCQs (Concept-Based)', questions: '25–50 (Attempt capped per subject)', marks: '70–75' },
          { subject: 'Part C: Higher-Order Scientific Concept Application & Research Analytical Problems', questions: '30–75 (Attempt capped per subject)', marks: '95–100' }
        ]
      }
    ],
    totalQuestions: 'Attempt ~60–75 Questions out of 120–145',
    totalMarks: '200 Marks',
    duration: '3 Hours (180 Minutes)',
    negativeMarking: '25% negative marking in all parts (33% in Part C of Chemical/Earth/Physical; NO negative marking in Part C of Mathematical Sciences).',
    subjects: [
      fromBlueprint('quantitative-aptitude', {
        stageTag: 'Part A General Aptitude (30 Marks)',
        includeChapterIds: ['qa-number-system', 'qa-percentage', 'qa-ratio-proportion', 'qa-average', 'qa-mensuration-2d', 'qa-mensuration-3d', 'qa-data-interpretation', 'qa-statistics', 'qa-probability']
      }),
      fromBlueprint('reasoning', {
        stageTag: 'Part A Logical & Graphical Reasoning',
        includeChapterIds: ['rs-number-series', 'rs-alphabet-series', 'rs-coding-decoding', 'rs-puzzles', 'rs-venn-diagrams', 'rs-non-verbal']
      }),
      fromBlueprint('general-science', {
        stageTag: 'Part B & C Foundation (Plus PG Depth in Life / Chemical / Physical Sciences)',
        extraChapters: [
          {
            id: 'csir-subject-tracks',
            title: 'CSIR NET Five Discipline Tracks (Part B & Part C PG Level)',
            topicType: 'official',
            subtopics: [
              'Life Sciences: Molecules & Cellular Organization, Fundamental Processes, Cell Signaling, Developmental Biology, System Physiology, Genetics, Ecology & Evolution',
              'Chemical Sciences: Inorganic (Coordination, Organometallics, Bioinorganic), Physical (Quantum Chemistry, Thermodynamics, Kinetics, Spectroscopy) & Organic (Stereochemistry, Pericyclic, Reagents)',
              'Physical Sciences: Mathematical Physics, Classical Mechanics, Electromagnetic Theory, Quantum Mechanics, Thermodynamics & Statistical Physics, Condensed Matter & Nuclear Physics',
              'Mathematical Sciences: Real & Complex Analysis, Linear & Abstract Algebra, Topology, ODEs/PDEs, Numerical Analysis & Probability/Statistics',
              'Earth Sciences: Geology, Applied Geophysics, Meteorology, Oceanography & Planetary Sciences'
            ]
          }
        ]
      })
    ],
    practicalTechnicalTopics: ['Experimental Design, Spectroscopy Interpretation, Molecular Biology Techniques & Statistical Data Analysis (Part C)'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview for NET/JRF qualification.',
    officialNotificationRef: 'NTA Joint CSIR-UGC NET 2026',
    officialWebsiteUrl: 'https://csirnet.nta.ac.in',
    officialNotificationUrl: 'https://csirhrdg.res.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  // =========================================================================
  // STATE GOVERNMENT EXAMINATIONS (Category 11)
  // =========================================================================
  buildExamSyllabus({
    id: 'ap-grama-sachivalayam',
    examCode: 'AP-SACHIVALAYAM',
    name: 'AP Grama / Ward Sachivalayam Recruitment (Panchayat Secretary, VRO, Digital/Engineering/Welfare Asst)',
    shortName: 'AP Grama Sachivalayam',
    categoryId: 'state-govt',
    secondaryCategoryIds: ['appsc'],
    scope: 'State',
    state: 'Andhra Pradesh',
    popular: true,
    authority: 'Panchayat Raj & Rural Development / Municipal Administration / APPSC (vsws.ap.gov.in)',
    introduction:
      'Massive Andhra Pradesh state recruitment for Village & Ward Secretariat functionaries including Panchayat Secretary Grade-V, VRO, Mahila Police, Welfare & Education Assistant, Engineering Assistant, and Digital Assistant.',
    qualification: 'Category I (Panchayat Secretary, Welfare, Mahila Police): Any Bachelor’s Degree | VRO: SSC/Inter/ITI | Digital/Engineering Asst: B.Tech/Diploma/Degree in CSE/IT/Civil/Mech.',
    ageLimit: '18 to 42 years (with AP Govt relaxations).',
    selectionProcess: 'Single OMR/CBT Written Examination (150 Qs / 150 Marks: Part A General Studies + Part B Subject/Core) → District Merit & Verification.',
    stages: [
      { name: 'Written Examination', mode: 'OMR / CBT Objective', qualifyingOnly: false, description: 'Part A: General Studies & Mental Ability (50 or 75 Marks) + Part B: Post-Specific Core Syllabus (100 or 75 Marks).' }
    ],
    examPattern: [
      {
        stageName: 'Category I & Technical Posts (150 Qs · 150 Marks · 150 Mins)',
        sections: [
          { subject: 'Part A: General Mental Ability, Reasoning, Quantitative Aptitude, Comprehension, General English, General Science, History, Polity, AP Bifurcation, Sustainable Dev & Women Empowerment', questions: 75, marks: 75 },
          { subject: 'Part B: Post-Specific Core (Rural Development/Economy/Panchayati Raj OR Civil/CS/Agri Technical)', questions: 75, marks: 75 }
        ]
      }
    ],
    totalQuestions: '150 Questions',
    totalMarks: '150 Marks',
    duration: '150 Minutes',
    negativeMarking: '0.25 marks deducted for each wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Part A General Studies & AP GK', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('state-psc-specifics', { stageTag: 'Part A & B AP Bifurcation & Economy', includeChapterIds: ['sp-ap-history-culture', 'sp-ap-economy-bifurcation'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Part A Quant & DI' }),
      fromBlueprint('reasoning', { stageTag: 'Part A Mental Ability' }),
      fromBlueprint('computer-it', { stageTag: 'Digital Assistant (Part B — 100 Marks)' })
    ],
    practicalTechnicalTopics: ['73rd & 74th Constitutional Amendments, Grama/Ward Secretariat Service Delivery & AP Rural Welfare Schemes'],
    languages: ['English', 'Telugu'],
    physicalStandards: null,
    skillTestDetails: 'No typing test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'AP Grama/Ward Sachivalayam Official Pattern',
    officialWebsiteUrl: 'https://gramawardsachivalayam.ap.gov.in',
    officialNotificationUrl: 'https://psc.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'tg-treirb-gurukul',
    examCode: 'TG-TREIRB',
    name: 'Telangana TREIRB Gurukul Recruitment (TGT, PGT, JL, DL & Librarian)',
    shortName: 'Telangana TREIRB Gurukul',
    categoryId: 'state-govt',
    secondaryCategoryIds: ['teaching', 'tgpsc'],
    scope: 'State',
    state: 'Telangana',
    authority: 'Telangana Residential Educational Institutions Recruitment Board (treirb.telangana.gov.in)',
    introduction:
      'Telangana State recruitment for Trained Graduate Teachers, Post Graduate Teachers, Junior Lecturers, Degree Lecturers, Physical Directors, and Librarians in BC/SC/ST/Minority Welfare Residential Schools.',
    qualification: 'TGT: Degree + B.Ed + TET | PGT: PG + B.Ed | JL/DL: Post Graduation (NET/SET/Ph.D. for DL).',
    ageLimit: '18 to 44/46 years.',
    selectionProcess: 'CBT Written Examination (Paper I General Studies + Paper II Pedagogy + Paper III Concerned Subject) → Certificate Verification.',
    stages: [
      { name: 'Paper I: General Studies & General Abilities', mode: 'OMR / CBT', qualifyingOnly: false, description: '100 Qs / 100 Marks (GS, English, Telangana Movement & Culture).' },
      { name: 'Paper II: Pedagogy of Concerned Subject', mode: 'OMR / CBT', qualifyingOnly: false, description: '100 Qs / 100 Marks (for TGT & PGT).' },
      { name: 'Paper III: Subject Content', mode: 'OMR / CBT', qualifyingOnly: false, description: '100 Qs / 100 Marks (Degree/PG subject depth).' }
    ],
    examPattern: [
      {
        stageName: 'TREIRB TGT/PGT (3 Papers · 300 Marks) | JL/DL (2 Papers · 200/300 Marks)',
        sections: [
          { subject: 'Paper I: General Studies, Basic English & Telangana GK', questions: 100, marks: 100 },
          { subject: 'Paper II: Subject Pedagogy (TGT/PGT)', questions: 100, marks: 100 },
          { subject: 'Paper III: Core Subject Content', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: '300 Questions (TGT/PGT)',
    totalMarks: '300 Marks',
    duration: '120 Minutes per Paper',
    negativeMarking: '1/4th mark (0.25) deducted for wrong answers in TREIRB CBT.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper I General Studies', excludeChapterIds: ['ga-ap-gk'] }),
      fromBlueprint('teaching-pedagogy', { stageTag: 'Paper II Subject Pedagogy' }),
      fromBlueprint('english-language', { stageTag: 'Paper I Basic English & English Stream' })
    ],
    practicalTechnicalTopics: ['Residential School Pedagogy, Demonstration Test (where notified for JL/DL) & Subject Curriculum Mastery'],
    languages: ['English', 'Telugu'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview (Demo test where specifically notified).',
    officialNotificationRef: 'TG TREIRB Official Syllabus Reference',
    officialWebsiteUrl: 'https://treirb.telangana.gov.in',
    officialNotificationUrl: 'https://treirb.telangana.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'state-psc-pcs-overview',
    examCode: 'STATE-PCS-IND',
    name: 'State PSC Combined Civil Services (UPPSC, BPSC, MPPSC, RPSC RAS, WBCS, MPSC)',
    shortName: 'State PSC / PCS',
    categoryId: 'state-govt',
    scope: 'State',
    authority: 'Respective State Public Service Commissions across India',
    introduction:
      'Unified preparation blueprint for State Civil Services (SDM, DSP, Commercial Tax Officer, BDO, Tehsildar) across major Indian states aligned with UPSC GS & State-Specific Modules.',
    qualification: 'Bachelor’s Degree in any discipline from a recognized University.',
    ageLimit: '21 to 35/40/42 years (State-specific).',
    selectionProcess: 'Preliminary Exam (GS + CSAT) → Mains Written Examination (Essay + GS Papers I–IV + State Papers) → Personality Test / Interview.',
    stages: [
      { name: 'Prelims (Objective)', mode: 'Offline OMR', qualifyingOnly: true, description: 'GS Paper-I (Merit Cutoff) + CSAT Paper-II (33% Qualifying in most States).' },
      { name: 'Mains Written (Descriptive)', mode: 'Pen & Paper', qualifyingOnly: false, description: 'General Hindi/Language + Essay + GS Papers I–IV (incl. State History, Geo, Polity & Economy).' },
      { name: 'Personality Test', mode: 'State PSC Board', qualifyingOnly: false, description: '100 to 150 Marks Interview.' }
    ],
    examPattern: [
      {
        stageName: 'Unified State PCS Prelims + Mains Pattern',
        sections: [
          { subject: 'Prelims Paper-I: General Studies + State Special GK', questions: '100–150', marks: '150–200' },
          { subject: 'Prelims Paper-II: CSAT / Aptitude (Qualifying)', questions: '80–100', marks: '100–200' },
          { subject: 'Mains: Language, Essay & GS Papers I–IV/V/VI (Descriptive)', questions: 'Descriptive', marks: '800–1500' }
        ]
      }
    ],
    totalQuestions: 'Prelims: ~250 Qs | Mains: 6–8 Descriptive Papers',
    totalMarks: 'Mains + Interview (~900 to 1600 Marks)',
    duration: '2 Hrs (Prelims) | 3 Hrs per Paper (Mains)',
    negativeMarking: '1/3rd or 1/4th negative marking in Prelims (nil in selected States like MPPSC).',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Prelims GS Paper-I' }),
      fromBlueprint('upsc-gs-mains', { stageTag: 'Mains Essay, GS Papers I–IV & CSAT' })
    ],
    practicalTechnicalTopics: ['State-Specific History, Geography, Economy, Budget, Welfare Schemes & Administrative Structure'],
    languages: ['English', 'Hindi', 'Respective State Official Language'],
    physicalStandards: { medicalStandard: 'Height/Chest requirements apply for DSP, Excise & Jail Superintendent posts.' },
    skillTestDetails: 'No skill test.',
    interviewDetails: '100–150 Marks State PSC Board Interview.',
    officialNotificationRef: 'All-India State PCS Unified Reference 2026',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://uppsc.up.nic.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  // =========================================================================
  // OTHER CENTRAL GOVERNMENT EXAMINATIONS (Category 12)
  // =========================================================================
  buildExamSyllabus({
    id: 'ib-acio',
    examCode: 'MHA-IB-ACIO',
    name: 'IB ACIO Grade-II / Executive (Intelligence Bureau)',
    shortName: 'IB ACIO Grade II',
    categoryId: 'other-central',
    secondaryCategoryIds: ['police'],
    popular: true,
    authority: 'Intelligence Bureau, Ministry of Home Affairs (mha.gov.in)',
    introduction:
      'Prestigious Group-C (Non-Gazetted, Executive) Central Government intelligence recruitment under the Ministry of Home Affairs.',
    qualification: 'Graduation or equivalent from a recognized University (desirable: knowledge of computers).',
    ageLimit: '18 to 27 years (SC/ST +5 yrs, OBC +3 yrs).',
    selectionProcess: 'Tier-I Objective CBT (100 Marks) → Tier-II Descriptive Test (50 Marks) → Tier-III Interview (100 Marks).',
    stages: [
      { name: 'Tier-I CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '100 Qs / 100 Marks in 60 mins across Current Affairs, GS, Numerical Aptitude, Reasoning & English.' },
      { name: 'Tier-II Descriptive', mode: 'Pen & Paper', qualifyingOnly: false, description: 'Essay (20 Marks), Reading Comprehension (10 Marks) & Precis Writing (20 Marks) in 60 mins.' },
      { name: 'Tier-III Interview', mode: 'MHA Panel + Psychometric Test', qualifyingOnly: false, description: '100 Marks Interview (after Psychometric/Aptitude Assessment).' }
    ],
    examPattern: [
      {
        stageName: 'Tier-I CBT (100 Qs · 100 Marks · 60 Mins) + Tier-II (50 Marks) + Tier-III (100 Marks)',
        sections: [
          { subject: 'Current Affairs', questions: 20, marks: 20 },
          { subject: 'General Studies', questions: 20, marks: 20 },
          { subject: 'Numerical Aptitude', questions: 20, marks: 20 },
          { subject: 'Reasoning / Logical Aptitude', questions: 20, marks: 20 },
          { subject: 'English Language', questions: 20, marks: 20 }
        ]
      }
    ],
    totalQuestions: 'Tier-I: 100 Qs | Tier-II: Essay + Precis + Comprehension',
    totalMarks: '250 Marks Total (100 + 50 + 100)',
    duration: 'Tier-I: 60 Mins | Tier-II: 60 Mins',
    negativeMarking: '1/4th mark (0.25) deducted for each wrong answer in Tier-I.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Current Affairs (20) + General Studies (20)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Numerical Aptitude (20 Marks)' }),
      fromBlueprint('reasoning', { stageTag: 'Reasoning & Logical Aptitude (20 Marks)' }),
      fromBlueprint('english-language', { stageTag: 'English (20 Marks) + Tier-II Descriptive' })
    ],
    practicalTechnicalTopics: ['Internal Security, Geopolitics, Border Issues, Cyber Intelligence & Psychometric Assessment in Tier-III'],
    languages: ['English', 'Hindi (Tier-II Essay/Precis in English)'],
    physicalStandards: null,
    skillTestDetails: 'No typing test; Psychometric test precedes Interview.',
    interviewDetails: '100-Mark Personal Interview assessing analytical clarity, security awareness & situational judgment.',
    officialNotificationRef: 'MHA IB ACIO-II/Exe Recruitment Pattern',
    officialWebsiteUrl: 'https://www.mha.gov.in',
    officialNotificationUrl: 'https://www.mha.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'fci-ag3-manager',
    examCode: 'FCI-AG3-MGR',
    name: 'FCI Assistant Grade III & Manager (General, Depot, Accounts, Technical)',
    shortName: 'FCI AG-III & Manager',
    categoryId: 'other-central',
    authority: 'Food Corporation of India (fci.gov.in)',
    introduction:
      'Central PSU recruitment under Ministry of Consumer Affairs, Food & Public Distribution for Assistant Grade III (General, Depot, Accounts, Technical, Hindi) and Category-II Managers.',
    qualification: 'AG-III General/Depot: Any Graduate | AG-III Technical: B.Sc Agriculture/Botany/Biotech | Accounts: B.Com | Manager: Degree/MBA/CA.',
    ageLimit: 'AG-III: Maximum 27 years | Manager: Maximum 28 years.',
    selectionProcess: 'Phase-I Online Test (Prelims Qualifying) → Phase-II Online Test (Paper I Common + Paper II Technical/Accounts/Hindi) → Document Verification (+ Interview for Manager).',
    stages: [
      { name: 'Phase-I Preliminary CBT', mode: 'Computer Based Test (Sectional Timing)', qualifyingOnly: true, description: '100 Qs / 100 Marks in 60 mins (15 mins per section).' },
      { name: 'Phase-II Mains CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper I (120 Qs / 120 Marks — 90 mins) for General/Depot; Paper I + Paper II (60 Technical Qs / 120 Marks) for Technical/Accounts.' }
    ],
    examPattern: [
      {
        stageName: 'Phase-I (100 Qs · 100 Marks · 60 Mins) & Phase-II Paper I (120 Qs · 120 Marks)',
        sections: [
          { subject: 'Phase-I: English (25), Reasoning (25), Numerical Aptitude (25), General Studies (25 — History/Geo/Eco 20 + CA 5)', questions: 100, marks: 100 },
          { subject: 'Phase-II Paper I: English (25), Reasoning (25), Numerical Aptitude (25), General Studies (45 — History/Geo/Eco/Sci/CA/Computer)', questions: 120, marks: 120 }
        ]
      }
    ],
    totalQuestions: 'Phase-I: 100 Qs | Phase-II: 120 (or 180 for Tech/Accts)',
    totalMarks: 'Phase-I: 100 | Phase-II: 120 (or 240 for Tech/Accts)',
    duration: 'Phase-I: 60 Mins | Phase-II: 90 Mins (+60 Mins Paper II)',
    negativeMarking: '1/4th mark deducted for wrong answers in Phase-I & Phase-II.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Phase-I & Phase-II (25 Qs)' }),
      fromBlueprint('reasoning', { stageTag: 'Phase-I & Phase-II (25 Qs)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Phase-I & Phase-II (25 Qs)' }),
      fromBlueprint('general-awareness', { stageTag: 'Phase-I (25) & Phase-II (45)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Phase-II Paper I Computer (5 Qs)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks'] })
    ],
    practicalTechnicalTopics: ['AG-III Technical Paper II: Agriculture, Food Storage, Entomology, Plant Protection, Biotechnology & Microbiology'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'No typing test for General/Depot/Tech (Skill test for Typist Hindi/Steno Grade II).',
    interviewDetails: 'No Interview for Assistant Grade III; Interview conducted for Manager (Category-II) posts.',
    officialNotificationRef: 'FCI Category-II & Category-III Official Syllabus',
    officialWebsiteUrl: 'https://fci.gov.in',
    officialNotificationUrl: 'https://fci.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'isro-scientist-technician',
    examCode: 'ISRO-ICRB',
    name: 'ISRO Scientist/Engineer ‘SC’ & Technician-B / Technical Assistant',
    shortName: 'ISRO Scientist & Tech',
    categoryId: 'other-central',
    secondaryCategoryIds: ['engineering'],
    popular: true,
    authority: 'ISRO Centralised Recruitment Board (isro.gov.in)',
    introduction:
      'Recruits Scientist/Engineer ‘SC’ (Electronics, Mechanical, Computer Science, Civil, Electrical) and Diploma Technical Assistants / ITI Technicians across VSSC, SDSC, URSC, SAC, and LPSC centres.',
    qualification: 'Scientist ‘SC’: B.E./B.Tech (65% or 6.84 CGPA) | Technical Assistant: First Class 3-yr Diploma | Technician-B: SSLC + ITI/NTC.',
    ageLimit: 'Scientist ‘SC’: 28/30 years | Technical Assistant / Technician-B: 18 to 35 years.',
    selectionProcess: 'Written Examination (Part A Core Engineering + Part B Aptitude/Ability) → Interview (Scientist/TA) OR Trade Skill Test (Technician-B).',
    stages: [
      { name: 'Written CBT / OMR Exam', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Scientist SC: 95 Qs / 100 Marks in 120 mins (80 Core Tech + 15 Aptitude/Ability) | Tech Asst: 80 Core Qs in 90 mins.' },
      { name: 'Interview / Skill Test', mode: 'ISRO Technical Panel / Workshop', qualifyingOnly: false, description: '100-Mark Interview for Scientist SC (60% qualifying; 50:50 weightage with Written); Qualifying Trade Skill Test for TA/Technician-B.' }
    ],
    examPattern: [
      {
        stageName: 'ISRO Scientist/Engineer ‘SC’ Revised Pattern (95 Qs · 100 Marks · 120 Mins)',
        sections: [
          { subject: 'Part A: Area / Discipline Specific Engineering (ECE / ME / CS / CE / EE)', questions: 80, marks: 80 },
          { subject: 'Part B: Aptitude / Ability Test (Numerical, Logical, Spatial & Data Interpretation)', questions: 15, marks: 20 }
        ]
      }
    ],
    totalQuestions: '95 Questions (Scientist SC) | 80 Questions (TA/Tech)',
    totalMarks: '100 Marks (Scientist SC)',
    duration: '120 Minutes (Scientist SC) | 90 Minutes (TA/Tech)',
    negativeMarking: '1/3rd negative marking in Part A (NO negative marking in Part B for Scientist SC).',
    subjects: [
      fromBlueprint('eng-electronics', { stageTag: 'Scientist/TA Electronics & Allied' }),
      fromBlueprint('eng-mechanical', { stageTag: 'Scientist/TA Mechanical & Allied' }),
      fromBlueprint('eng-cse', { stageTag: 'Scientist/TA Computer Science' }),
      fromBlueprint('eng-civil', { stageTag: 'Scientist/TA Civil' }),
      fromBlueprint('eng-electrical', { stageTag: 'Scientist/TA Electrical' }),
      fromBlueprint('reasoning', { stageTag: 'Part B Aptitude & Spatial Reasoning (20 Marks)', includeChapterIds: ['rs-analogy', 'rs-number-series', 'rs-non-verbal', 'rs-data-sufficiency', 'rs-puzzles'] })
    ],
    practicalTechnicalTopics: ['Spacecraft Subsystems, Control Theory, Embedded C/Verilog, Orbital Mechanics Basics & Workshop/Lab Skill Test (Technician-B)'],
    languages: ['English (Scientist SC)', 'English & Hindi (Technical Assistant / Technician)'],
    physicalStandards: null,
    skillTestDetails: 'Go/No-Go Practical Skill Test (min 60%) for Technician-B and Technical Assistant.',
    interviewDetails: 'ISRO Technical Selection Committee Interview (50% Written + 50% Interview weightage for Scientist ‘SC’).',
    officialNotificationRef: 'ISRO ICRB 2025-26 Recruitment Pattern',
    officialWebsiteUrl: 'https://www.isro.gov.in',
    officialNotificationUrl: 'https://www.isro.gov.in/Careers.html',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'drdo-ceptam',
    examCode: 'DRDO-CEPTAM',
    name: 'DRDO CEPTAM (Senior Technical Assistant-B & Technician-A)',
    shortName: 'DRDO CEPTAM',
    categoryId: 'other-central',
    secondaryCategoryIds: ['engineering'],
    authority: 'Centre for Personnel Talent Management, DRDO (drdo.gov.in)',
    introduction:
      'Defence Research & Development Organisation recruitment for Senior Technical Assistant-B (STA-B, Group B Non-Gazetted) and Technician-A (Tech-A, Group C) across Electronics, Mechanical, CS, Chemical, Electrical, and ITI trades.',
    qualification: 'STA-B: B.Sc. OR 3-year Diploma in Engineering/Technology/CS | Technician-A: 10th Pass + ITI Certificate.',
    ageLimit: '18 to 28 years (with Central Govt relaxations).',
    selectionProcess: 'Tier-I CBT (Screening) → Tier-II CBT (Technical Subject/Trade Merit) → Trade Skill Test (for Technician-A) & Document Verification.',
    stages: [
      { name: 'Tier-I Screening CBT', mode: 'Computer Based Test', qualifyingOnly: true, description: 'STA-B: 120 Qs/120 Marks in 90 mins (General) | Tech-A: 120 Qs (40 General + 80 Trade).' },
      { name: 'Tier-II Final Merit CBT (STA-B) / Trade Test (Tech-A)', mode: 'CBT / Practical', qualifyingOnly: false, description: 'STA-B Tier-II: 100 Technical Subject Qs / 100 Marks in 90 mins; Tech-A: Qualifying Trade Skill Test.' }
    ],
    examPattern: [
      {
        stageName: 'STA-B Tier-I (120 Qs · 90 Mins) & Tier-II Technical (100 Qs · 90 Mins)',
        sections: [
          { subject: 'Tier-I: Quantitative Ability, General Intelligence/Reasoning, General Awareness, English Language & General Science', questions: 120, marks: 120 },
          { subject: 'Tier-II (STA-B): Specific Technical Subject (CS/ECE/Mech/EE/Civil/Chem/Physics)', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: 'STA-B: Tier-I 120 + Tier-II 100 | Tech-A: 120 Qs',
    totalMarks: 'STA-B Tier-II: 100 Marks | Tech-A CBT: 120 Marks',
    duration: '90 Minutes per Tier',
    negativeMarking: 'No negative marking in DRDO CEPTAM.',
    subjects: [
      fromBlueprint('quantitative-aptitude', { stageTag: 'Tier-I Screening' }),
      fromBlueprint('reasoning', { stageTag: 'Tier-I Screening' }),
      fromBlueprint('general-awareness', { stageTag: 'Tier-I Screening', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('english-language', { stageTag: 'Tier-I Screening' }),
      fromBlueprint('general-science', { stageTag: 'Tier-I Screening' }),
      fromBlueprint('eng-electronics', { stageTag: 'Tier-II Technical Option (ECE)' }),
      fromBlueprint('eng-cse', { stageTag: 'Tier-II Technical Option (CS)' })
    ],
    practicalTechnicalTopics: ['ITI Trade Skill Test (Welder, Fitter, Turner, Machinist, Electrician, COPA) for Technician-A'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'Trade/Skill Test (Qualifying) applicable for Technician-A.',
    interviewDetails: 'No Interview for STA-B & Technician-A.',
    officialNotificationRef: 'DRDO CEPTAM STA-B & Tech-A Syllabus',
    officialWebsiteUrl: 'https://www.drdo.gov.in',
    officialNotificationUrl: 'https://www.drdo.gov.in/careers',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'lic-aao',
    examCode: 'LIC-AAO',
    name: 'LIC AAO (Assistant Administrative Officer — Generalist & Specialist)',
    shortName: 'LIC AAO',
    categoryId: 'other-central',
    secondaryCategoryIds: ['banking'],
    authority: 'Life Insurance Corporation of India (licindia.in)',
    introduction:
      'Class-I Officer recruitment in Life Insurance Corporation of India for Generalist, IT, Chartered Accountant, Actuarial, and Rajbhasha AAO posts.',
    qualification: 'Generalist: Bachelor’s Degree in any discipline | Specialist: B.E./B.Tech (CS/IT), CA, or Actuarial passes as specified.',
    ageLimit: '21 to 30 years.',
    selectionProcess: 'Phase-I Preliminary CBT → Phase-II Main Examination (Objective 300 Marks + Descriptive 25 Marks Qualifying) → Phase-III Interview.',
    stages: [
      { name: 'Phase-I Prelims', mode: 'Online CBT (Sectional Timing)', qualifyingOnly: true, description: '100 Qs (English 30 Qs Qualifying; Reasoning 35 + Quant 35 = 70 Merit Marks) in 60 mins.' },
      { name: 'Phase-II Mains', mode: 'Online Objective + Descriptive', qualifyingOnly: false, description: '300 Marks Objective (Reasoning, GK/CA, Data Analysis, Insurance & Financial Market Awareness) + 25 Marks Descriptive English (Qualifying).' },
      { name: 'Phase-III Interview', mode: 'LIC Board Interview', qualifyingOnly: false, description: '60 Marks (Minimum 30 qualifying for UR).' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (70 Merit + 30 Qual.) & Mains (300 Merit + 25 Qual.)',
        sections: [
          { subject: 'Prelims: Reasoning (35), Quantitative Aptitude (35), English Language (30 — Qualifying)', questions: 100, marks: '70 (+30 Qual.)' },
          { subject: 'Mains: Reasoning (90), GK & Current Affairs (60), Data Analysis & Interpretation (90), Insurance & Financial Market Awareness (60)', questions: 120, marks: 300 },
          { subject: 'Mains Descriptive: Letter & Essay Writing in English (Qualifying — 10/25 min)', questions: 2, marks: '25 (Qualifying)' }
        ]
      }
    ],
    totalQuestions: 'Prelims: 100 Qs | Mains: 120 Obj + 2 Desc',
    totalMarks: 'Mains Merit: 300 + Interview: 60',
    duration: 'Prelims: 60 Mins | Mains: 120 Mins Obj + 30 Mins Desc',
    negativeMarking: 'No negative marking in LIC AAO Prelims & Mains (verify current year brochure).',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Prelims & Mains' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims Quant & Mains Data Analysis' }),
      fromBlueprint('english-language', { stageTag: 'Prelims Qualifying & Mains Descriptive' }),
      fromBlueprint('banking-specialized', { stageTag: 'Insurance & Financial Market Awareness', includeChapterIds: ['bk-finance', 'bk-descriptive'] }),
      fromBlueprint('general-awareness', { stageTag: 'Mains GK & CA', includeChapterIds: ['ga-banking-financial', 'ga-indian-economy', 'ga-national-ca', 'ga-international-ca', 'ga-govt-schemes'] })
    ],
    practicalTechnicalTopics: ['Life Insurance Principles, IRDAI Guidelines, Policy Terminology, Annuities, Reinsurance & Financial Market Instruments'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: '60 Marks Personal Interview at LIC Zonal Offices.',
    officialNotificationRef: 'LIC AAO Recruitment Pattern Reference',
    officialWebsiteUrl: 'https://licindia.in',
    officialNotificationUrl: 'https://licindia.in/bottom-links/careers',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'esic-sso-udc',
    examCode: 'ESIC-SSO-UDC',
    name: 'ESIC SSO & UDC (Social Security Officer & Upper Division Clerk)',
    shortName: 'ESIC SSO / UDC',
    categoryId: 'other-central',
    secondaryCategoryIds: ['banking'],
    authority: 'Employees’ State Insurance Corporation (esic.gov.in)',
    introduction:
      'Recruits Social Security Officers / Managers Grade-II and Upper Division Clerks (UDC) under the Ministry of Labour & Employment across ESIC Regional Offices and Hospitals.',
    qualification: 'Graduation from a recognized University (working knowledge of computers including MS Office & database usage).',
    ageLimit: 'SSO: 21 to 27 years | UDC: 18 to 27 years.',
    selectionProcess: 'Phase-I Preliminary CBT (Qualifying) → Phase-II Main CBT (Merit) → Phase-III Computer Skill Test & Descriptive English (for SSO).',
    stages: [
      { name: 'Phase-I Preliminary CBT', mode: 'Online Objective', qualifyingOnly: true, description: '100 Qs / 100 Marks (SSO: Eng 30, Reason 35, Quant 35 | UDC: GI 25, GA 25, Quant 25, Eng 25).' },
      { name: 'Phase-II Main CBT', mode: 'Online Objective', qualifyingOnly: false, description: 'SSO: 150 Qs / 200 Marks in 120 mins | UDC: 200 Qs / 200 Marks in 120 mins.' },
      { name: 'Phase-III Computer Skill Test', mode: 'Practical MS Office + Descriptive (SSO)', qualifyingOnly: true, description: '50 Marks Computer Skill Test (PowerPoint 10, MS Word 20, MS Excel 20) — 30 mins.' }
    ],
    examPattern: [
      {
        stageName: 'ESIC SSO Mains (150 Qs · 200 Marks · 120 Mins) & UDC Mains (200 Qs · 200 Marks)',
        sections: [
          { subject: 'Reasoning / General Intelligence', questions: '40 (SSO) / 50 (UDC)', marks: '60 (SSO) / 50 (UDC)' },
          { subject: 'General / Economy / Financial / Insurance Awareness', questions: '40 (SSO) / 50 (UDC)', marks: '40 (SSO) / 50 (UDC)' },
          { subject: 'English Language', questions: '30 (SSO) / 50 (UDC)', marks: '40 (SSO) / 50 (UDC)' },
          { subject: 'Quantitative Aptitude', questions: '40 (SSO) / 50 (UDC)', marks: '60 (SSO) / 50 (UDC)' }
        ]
      }
    ],
    totalQuestions: 'Phase-I: 100 | Phase-II: 150 (SSO) / 200 (UDC)',
    totalMarks: 'Phase-II Merit: 200 Marks + 50 Qualifying Computer Skill Test',
    duration: 'Phase-I: 60 Mins | Phase-II: 120 Mins | Phase-III: 30 Mins',
    negativeMarking: '1/4th mark deducted for every wrong answer in Phase-I & Phase-II.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Phase-I & Phase-II' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Phase-I & Phase-II' }),
      fromBlueprint('english-language', { stageTag: 'Phase-I & Phase-II + SSO Descriptive' }),
      fromBlueprint('general-awareness', { stageTag: 'General, Economy & Social Security Awareness', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Phase-III Computer Skill Test', includeChapterIds: ['cs-fundamentals', 'cs-os'] })
    ],
    practicalTechnicalTopics: [
      'Phase-III Computer Skill Test (50 Marks): 2 PowerPoint Slides (10 Marks), MS Word Formatting Letter/Notice (20 Marks), MS Excel Table with Formulas (20 Marks) in 30 mins',
      'Social Security & ESI Act 1948 / Labour Codes Overview'
    ],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: '50-Mark MS Office Practical Skill Test (PowerPoint, Word, Excel) is qualifying in Phase-III.',
    interviewDetails: 'No Interview for UDC & SSO.',
    officialNotificationRef: 'ESIC SSO & UDC Recruitment Reference',
    officialWebsiteUrl: 'https://www.esic.gov.in',
    officialNotificationUrl: 'https://www.esic.gov.in/recruitments',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  })
];
