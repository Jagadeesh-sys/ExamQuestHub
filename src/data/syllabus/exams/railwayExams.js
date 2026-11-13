import { buildExamSyllabus, fromBlueprint } from './examBuilder.js';

const RRB_LANGUAGES = [
  'English', 'Hindi', 'Assamese', 'Bengali', 'Gujarati', 'Kannada', 'Konkani',
  'Malayalam', 'Manipuri', 'Marathi', 'Odia', 'Punjabi', 'Tamil', 'Telugu', 'Urdu'
];

export const RAILWAY_EXAMS = [
  buildExamSyllabus({
    id: 'rrb-ntpc-graduate',
    examCode: 'RRB-NTPC-GRAD',
    name: 'RRB NTPC Graduate Level',
    shortName: 'RRB NTPC Graduate',
    categoryId: 'rrb',
    popular: true,
    authority: 'Railway Recruitment Boards (RRBs), Ministry of Railways',
    introduction:
      'Recruits graduates for Non-Technical Popular Categories (NTPC) Level-5 & Level-6 posts including Chief Commercial cum Ticket Supervisor, Station Master, Goods Train Manager, Junior Account Assistant cum Typist, and Senior Clerk cum Typist.',
    qualification: 'Bachelor’s Degree in any discipline from a recognized University or equivalent.',
    ageLimit: '18 to 36 years (with age relaxation as per Central Govt rules for SC/ST/OBC/PwBD/Ex-SM).',
    selectionProcess: 'CBT Stage-1 (Screening) → CBT Stage-2 (Merit) → CBAT (for Station Master) / Typing Skill Test (for Typist posts) → Document Verification & Medical Examination.',
    stages: [
      { name: 'CBT Stage-1', mode: 'Computer Based Test (Objective)', qualifyingOnly: true, description: 'Common screening test; normalized score shortlists 15x vacancies for CBT-2.' },
      { name: 'CBT Stage-2', mode: 'Computer Based Test (Objective)', qualifyingOnly: false, description: '120 questions in 90 minutes; primary merit stage across Pay Levels 5 & 6.' },
      { name: 'CBAT / Typing Skill Test', mode: 'Aptitude / Typing', qualifyingOnly: false, description: 'CBAT for Station Master (30% weightage in final merit); Typing Skill Test (qualifying) for Clerk/Account Assistant.' },
      { name: 'Document Verification & Medical', mode: 'Offline Verification', qualifyingOnly: true, description: 'Verification of certificates and A-2/C-2 medical fitness standards.' }
    ],
    examPattern: [
      {
        stageName: 'CBT Stage-1 (100 Qs · 100 Marks · 90 Mins)',
        sections: [
          { subject: 'General Awareness', questions: 40, marks: 40 },
          { subject: 'Mathematics', questions: 30, marks: 30 },
          { subject: 'General Intelligence and Reasoning', questions: 30, marks: 30 }
        ]
      },
      {
        stageName: 'CBT Stage-2 (120 Qs · 120 Marks · 90 Mins)',
        sections: [
          { subject: 'General Awareness', questions: 50, marks: 50 },
          { subject: 'Mathematics', questions: 35, marks: 35 },
          { subject: 'General Intelligence and Reasoning', questions: 35, marks: 35 }
        ]
      }
    ],
    totalQuestions: 'CBT-1: 100 Qs | CBT-2: 120 Qs',
    totalMarks: 'CBT-1: 100 Marks | CBT-2: 120 Marks',
    duration: '90 Minutes per CBT (120 Minutes for eligible PwBD candidates with scribe)',
    negativeMarking: '1/3rd mark deducted for every wrong answer in CBT-1 & CBT-2; No negative marking in CBAT.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CBT 1 & CBT 2', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT 1 & CBT 2', recommendedChapterIds: ['qa-probability'] }),
      fromBlueprint('reasoning', { stageTag: 'CBT 1 & CBT 2' }),
      fromBlueprint('general-science', { subjectId: 'rrb-ntpc-grad-science', subjectName: 'General Science (NCERT Class X Standard)', stageTag: 'Part of General Awareness' })
    ],
    practicalTechnicalTopics: [
      'CBAT (Computer Based Aptitude Test for Station Master): Memory Test, Following Directions, Depth Perception, Concentration & Perceptual Speed (Minimum T-score 42 in each battery)',
      'Typing Skill Test: 30 WPM in English OR 25 WPM in Hindi on Personal Computer without editing tools / spell-check'
    ],
    languages: RRB_LANGUAGES,
    physicalStandards: {
      medicalStandard: 'A-2 (Station Master, Goods Train Manager) — 6/9 distant vision without glasses; B-2 (Commercial Supervisor); C-2 (Clerk/Account Assistant).'
    },
    skillTestDetails: 'Typing Skill Test (qualifying) for JAA cum Typist & Senior Clerk cum Typist: 30 WPM English / 25 WPM Hindi (10 mins). CBAT for Station Master carries 30% merit weightage alongside 70% CBT-2.',
    interviewDetails: 'No Interview (abolished for Group B non-gazetted & Group C Railway posts).',
    officialNotificationRef: 'CEN 06/2025 (2025-26 Graduate Cycle)',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    officialSyllabusPdfUrl: '/assets/aistudio/RRB-NTPC-Graduate-2025-CBT1-EN-Official-Answer-Key_887400b5.pdf',
    syllabusPdfLabel: 'RRB NTPC Graduate Reference Paper & Portal',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026',
    linkedMockCategory: 'rrb-ntpc-graduate'
  }),

  buildExamSyllabus({
    id: 'rrb-ntpc-ug',
    examCode: 'RRB-NTPC-UG',
    name: 'RRB NTPC Undergraduate Level',
    shortName: 'RRB NTPC Undergraduate',
    categoryId: 'rrb',
    popular: true,
    authority: 'Railway Recruitment Boards (RRBs), Ministry of Railways',
    introduction:
      'Recruits 12th (+2) passed candidates for Pay Level-2 & Level-3 posts: Commercial cum Ticket Clerk, Accounts Clerk cum Typist, Junior Clerk cum Typist, and Trains Clerk.',
    qualification: '12th (+2 Stage) or its equivalent examination with minimum 50% aggregate marks (pass marks for SC/ST/PwBD/Ex-SM).',
    ageLimit: '18 to 33 years (age relaxation applicable as per Government of India norms).',
    selectionProcess: 'CBT Stage-1 → CBT Stage-2 → Typing Skill Test (for Typist posts) → Document Verification & Medical.',
    stages: [
      { name: 'CBT Stage-1', mode: 'Computer Based Test', qualifyingOnly: true, description: '100 Objective MCQs in 90 minutes for shortlisting.' },
      { name: 'CBT Stage-2', mode: 'Computer Based Test', qualifyingOnly: false, description: '120 Objective MCQs in 90 minutes for final merit.' },
      { name: 'Typing Skill Test', mode: 'Computer Typing', qualifyingOnly: true, description: 'Required for Accounts Clerk cum Typist & Junior Clerk cum Typist.' },
      { name: 'Document Verification & Medical', mode: 'Offline Verification', qualifyingOnly: true, description: 'Original document check and medical fitness (A-3/B-2/C-2).' }
    ],
    examPattern: [
      {
        stageName: 'CBT Stage-1 (100 Qs · 100 Marks · 90 Mins)',
        sections: [
          { subject: 'General Awareness', questions: 40, marks: 40 },
          { subject: 'Mathematics', questions: 30, marks: 30 },
          { subject: 'General Intelligence and Reasoning', questions: 30, marks: 30 }
        ]
      },
      {
        stageName: 'CBT Stage-2 (120 Qs · 120 Marks · 90 Mins)',
        sections: [
          { subject: 'General Awareness', questions: 50, marks: 50 },
          { subject: 'Mathematics', questions: 35, marks: 35 },
          { subject: 'General Intelligence and Reasoning', questions: 35, marks: 35 }
        ]
      }
    ],
    totalQuestions: 'CBT-1: 100 Qs | CBT-2: 120 Qs',
    totalMarks: 'CBT-1: 100 Marks | CBT-2: 120 Marks',
    duration: '90 Minutes per CBT (120 Minutes for PwBD)',
    negativeMarking: '1/3rd mark deducted per incorrect answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CBT 1 & CBT 2', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT 1 & CBT 2', recommendedChapterIds: ['qa-probability'] }),
      fromBlueprint('reasoning', { stageTag: 'CBT 1 & CBT 2' }),
      fromBlueprint('general-science', { subjectId: 'rrb-ntpc-ug-science', subjectName: 'General Science (10th Standard)', stageTag: 'Part of General Awareness' })
    ],
    practicalTechnicalTopics: [
      'Typing Skill Test: 30 WPM in English or 25 WPM in Hindi on computer without backspace/spell-check aid (qualifying)'
    ],
    languages: RRB_LANGUAGES,
    physicalStandards: { medicalStandard: 'A-3 (Trains Clerk), B-2 (Commercial cum Ticket Clerk), C-2 (Accounts/Junior Clerk cum Typist).' },
    skillTestDetails: '30 WPM English or 25 WPM Hindi typing test for Clerk cum Typist posts (8x vacancies called).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN 07/2025 (Undergraduate Cycle)',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)',
    linkedMockCategory: 'rrb-ntpc-ug'
  }),

  buildExamSyllabus({
    id: 'rrb-group-d',
    examCode: 'RRB-GROUP-D',
    name: 'RRB Group D (Level-1)',
    shortName: 'RRB Group D',
    categoryId: 'rrb',
    popular: true,
    authority: 'Railway Recruitment Boards (RRBs) / RRCs',
    introduction:
      'Recruits Level-1 staff across Indian Railways including Track Maintainer Grade-IV, Pointsman, Assistant (Workshop, S&T, Electrical, Loco Shed, Carriage & Wagon).',
    qualification: '10th Pass (Matriculation) OR ITI from NCVT/SCVT recognized institutions OR National Apprenticeship Certificate (NAC) granted by NCVT.',
    ageLimit: '18 to 36 years (as per latest CEN 08/2024–09/2025 relaxation norms).',
    selectionProcess: 'Single-Stage Computer Based Test (CBT) → Physical Efficiency Test (PET) → Document Verification & Medical Examination.',
    stages: [
      { name: 'CBT (Single Stage)', mode: 'Computer Based Test', qualifyingOnly: false, description: '100 objective questions in 90 minutes across Science, Math, Reasoning & GA.' },
      { name: 'Physical Efficiency Test (PET)', mode: 'Ground Physical Test', qualifyingOnly: true, description: 'Qualifying weight-carrying and 1000m running test (3x vacancies shortlisted).' },
      { name: 'DV & Medical', mode: 'Offline Verification', qualifyingOnly: true, description: 'Verification of 10th/ITI certificates and B-1/B-2/C-1 medical standards.' }
    ],
    examPattern: [
      {
        stageName: 'Single-Stage CBT (100 Qs · 100 Marks · 90 Mins)',
        sections: [
          { subject: 'General Science (Class X NCERT)', questions: 25, marks: 25 },
          { subject: 'Mathematics', questions: 25, marks: 25 },
          { subject: 'General Intelligence and Reasoning', questions: 30, marks: 30 },
          { subject: 'General Awareness & Current Affairs', questions: 20, marks: 20 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '90 Minutes (120 Minutes for PwBD)',
    negativeMarking: '1/3rd mark deducted for every wrong answer.',
    subjects: [
      fromBlueprint('general-science', { stageTag: 'CBT (25 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT (25 Marks)', excludeChapterIds: ['qa-trigonometry', 'qa-height-distance'], recommendedChapterIds: ['qa-probability'] }),
      fromBlueprint('reasoning', { stageTag: 'CBT (30 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'CBT (20 Marks)', includeChapterIds: ['ga-science-tech', 'ga-sports', 'ga-awards-honours', 'ga-national-ca', 'ga-international-ca', 'ga-polity', 'ga-indian-economy', 'ga-static-gk', 'ga-govt-schemes'] })
    ],
    practicalTechnicalTopics: [
      'Physical Efficiency Test (Male): Lift & carry 35 kg for 100 metres in 2 minutes (one chance without putting weight down) + Run 1000 metres in 4 mins 15 secs.',
      'Physical Efficiency Test (Female): Lift & carry 20 kg for 100 metres in 2 minutes + Run 1000 metres in 5 mins 40 secs.'
    ],
    languages: RRB_LANGUAGES,
    physicalStandards: {
      petMale: '35 kg for 100m in 2 mins; 1000m run in 4m 15s (1 chance each).',
      petFemale: '20 kg for 100m in 2 mins; 1000m run in 5m 40s (1 chance each).',
      medicalStandard: 'A-2 / B-1 / B-2 / C-1 depending on post (Pointsman requires A-2 vision).'
    },
    skillTestDetails: 'No typing or skill test; Physical Efficiency Test (PET) is mandatory and qualifying.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN 08/2024 & CEN 09/2025 Level-1 Cycle',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)',
    linkedMockCategory: 'rrb-group-d'
  }),

  buildExamSyllabus({
    id: 'rrb-alp',
    examCode: 'RRB-ALP',
    name: 'RRB ALP (Assistant Loco Pilot)',
    shortName: 'RRB ALP',
    categoryId: 'rrb',
    popular: true,
    authority: 'Railway Recruitment Boards (RRBs)',
    introduction:
      'Recruits Assistant Loco Pilots (Pay Level-2) responsible for operating locomotives alongside Loco Pilots across Indian Railways zones.',
    qualification: 'Matriculation / SSLC + ITI (NCVT/SCVT) in designated engineering trades OR Diploma / Degree in Mechanical, Electrical, Electronics, or Automobile Engineering.',
    ageLimit: '18 to 30 years (relaxed up to 33 years in recent CEN 01/2024–2025 cycles).',
    selectionProcess: 'CBT-1 (Screening) → CBT-2 (Part A Merit + Part B Qualifying Trade Test) → CBAT (Psycho Test) → Document Verification & A-1 Medical.',
    stages: [
      { name: 'CBT-1', mode: 'Computer Based Test', qualifyingOnly: true, description: '75 Qs in 60 mins; shortlists 15x candidates for CBT-2.' },
      { name: 'CBT-2 Part A', mode: 'Computer Based Test', qualifyingOnly: false, description: '100 Qs in 90 mins; carries 70% weightage in final merit.' },
      { name: 'CBT-2 Part B (Relevant Trade)', mode: 'Computer Based Test', qualifyingOnly: true, description: '75 Qs in 60 mins (DGT ITI Trade syllabus); minimum 35% marks required to qualify.' },
      { name: 'CBAT (Aptitude Test)', mode: 'Psycho Aptitude Test', qualifyingOnly: false, description: '5 test batteries; minimum T-score 42 in each battery; carries 30% merit weightage.' },
      { name: 'DV & A-1 Medical', mode: 'Medical & Verification', qualifyingOnly: true, description: 'Strict A-1 distant vision (6/6, 6/6 without glasses) and colour vision test.' }
    ],
    examPattern: [
      {
        stageName: 'CBT-1 (75 Qs · 75 Marks · 60 Mins)',
        sections: [
          { subject: 'Mathematics', questions: 20, marks: 20 },
          { subject: 'Mental Ability / Reasoning', questions: 25, marks: 25 },
          { subject: 'General Science', questions: 20, marks: 20 },
          { subject: 'General Awareness & Current Affairs', questions: 10, marks: 10 }
        ]
      },
      {
        stageName: 'CBT-2 Part A (100 Qs · 100 Marks · 90 Mins) + Part B (75 Qs · 75 Marks · 60 Mins)',
        sections: [
          { subject: 'Part A: Mathematics, General Intelligence & Reasoning, Basic Science & Engineering', questions: 100, marks: 100 },
          { subject: 'Part B: Relevant Engineering / ITI Trade Syllabus (Qualifying 35%)', questions: 75, marks: 75 }
        ]
      }
    ],
    totalQuestions: 'CBT-1: 75 | CBT-2: 175 (100+75)',
    totalMarks: 'CBT-1: 75 | CBT-2: 175',
    duration: 'CBT-1: 60 Mins | CBT-2: 2 Hours 30 Mins (90+60)',
    negativeMarking: '1/3rd mark deducted per wrong answer in CBT-1 & CBT-2; No negative marking in CBAT.',
    subjects: [
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT-1 & CBT-2 Part A' }),
      fromBlueprint('reasoning', { stageTag: 'CBT-1 & CBT-2 Part A' }),
      fromBlueprint('general-science', { stageTag: 'CBT-1' }),
      {
        id: 'alp-basic-science-eng',
        name: 'Basic Science and Engineering (CBT-2 Part A)',
        shortName: 'Basic Science & Engg',
        code: 'BSE',
        stageTag: 'CBT-2 Part A',
        chapters: [
          {
            id: 'alp-bse-ed',
            title: 'Engineering Drawing & Projections',
            topicType: 'official',
            subtopics: ['Projections, Views, Drawing Instruments, Lines, Geometric Figures & Symbolic Representation']
          },
          {
            id: 'alp-bse-physics',
            title: 'Units, Mass, Weight, Density, Work, Power, Speed & Velocity',
            topicType: 'official',
            subtopics: ['SI & CGS Units, Work-Energy-Power Calculations, Heat & Temperature, Basic Electricity (Ohm’s Law, Series/Parallel), Levers & Simple Machines']
          },
          {
            id: 'alp-bse-safety',
            title: 'Occupational Safety & Health, Environment & IT Literacy',
            topicType: 'official',
            subtopics: ['Workplace Safety, Fire Extinguishers, First Aid, Environmental Education & Basic Computer Literacy']
          }
        ]
      },
      {
        id: 'alp-trade-part-b',
        name: 'Relevant Trade Syllabus (CBT-2 Part B — DGT Pattern)',
        shortName: 'Trade Syllabus (Part B)',
        code: 'TRADE',
        stageTag: 'CBT-2 Part B (Qualifying 35%)',
        chapters: [
          {
            id: 'alp-trade-elec',
            title: 'Electrical / Electrician / Wireman / Mechanic Motor Vehicle',
            topicType: 'official',
            subtopics: ['AC/DC Fundamentals, Transformers, Motors, Domestic/Industrial Wiring, Earthing, Electrical Measuring Instruments & Battery Maintenance']
          },
          {
            id: 'alp-trade-mech',
            title: 'Fitter / Turner / Machinist / Diesel Mechanic / RAC',
            topicType: 'official',
            subtopics: ['Fitting Tools, Limits-Fits-Tolerances, Lathe/Milling Operations, Welding, IC Engines, Cooling & Lubrication Systems']
          },
          {
            id: 'alp-trade-ece',
            title: 'Electronics Mechanic / Radio & TV / Instrument Mechanic',
            topicType: 'official',
            subtopics: ['Semiconductor Diodes, Transistors, Rectifiers, Amplifiers, Digital Logic Gates, Oscillators & PCB Soldering']
          }
        ]
      }
    ],
    practicalTechnicalTopics: [
      'CBAT 5 Batteries: Memory Test, Following Directions, Depth Perception (Brick Test), Concentration (Table/Digit Search) & Perceptual Speed',
      'Trade Practical Concepts: Vernier Calliper, Micrometer, Megger Insulation Testing, Transformer Oil & Circuit Breaker Operation'
    ],
    languages: RRB_LANGUAGES,
    physicalStandards: {
      medicalStandard: 'Strict A-1 Medical Standard: Distant Vision 6/6, 6/6 without glasses (no LASIK allowed), Near Vision Sn: 0.6, 0.6 without glasses, Colour Vision (Ishihara), Binocular Vision, Night & Mesopic Vision tests.'
    },
    skillTestDetails: 'CBAT (Computer Based Aptitude Test) is mandatory; 8x vacancies shortlisted. Minimum T-score 42 required in each test battery irrespective of category.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN 01/2024 & CEN 01/2025 ALP Cycle',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'rrb-technician-gr1',
    examCode: 'RRB-TECH-G1',
    name: 'RRB Technician Grade 1 (Signal)',
    shortName: 'RRB Technician Gr-1',
    categoryId: 'rrb',
    authority: 'Railway Recruitment Boards (RRBs)',
    introduction:
      'Recruits Pay Level-5 Technician Grade-I Signal personnel responsible for railway signalling, telecommunication equipment, and electronic interlocking systems.',
    qualification: 'B.Sc. in Physics/Electronics/Computer Science/IT/Instrumentation OR 3-Year Diploma OR B.E./B.Tech in relevant Engineering streams.',
    ageLimit: '18 to 36 years.',
    selectionProcess: 'Single-Stage CBT → Document Verification & B-1 Medical Examination.',
    stages: [
      { name: 'Single-Stage CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '100 MCQs in 90 minutes with strong weightage on Basic Science & Engineering (35 marks) and Computer Applications (20 marks).' },
      { name: 'DV & Medical', mode: 'Offline Verification', qualifyingOnly: true, description: 'B-1 medical standard verification.' }
    ],
    examPattern: [
      {
        stageName: 'Single-Stage CBT (100 Qs · 100 Marks · 90 Mins)',
        sections: [
          { subject: 'General Awareness', questions: 10, marks: 10 },
          { subject: 'General Intelligence & Reasoning', questions: 15, marks: 15 },
          { subject: 'Basics of Computers and Applications', questions: 20, marks: 20 },
          { subject: 'Mathematics', questions: 20, marks: 20 },
          { subject: 'Basic Science and Engineering', questions: 35, marks: 35 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '90 Minutes (120 Minutes for PwBD)',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CBT (10 Marks)', includeChapterIds: ['ga-national-ca', 'ga-international-ca', 'ga-polity', 'ga-indian-geography', 'ga-indian-economy', 'ga-static-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'CBT (15 Marks)' }),
      fromBlueprint('computer-it', { stageTag: 'CBT (20 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-number-systems', 'cs-os', 'cs-dbms', 'cs-networks', 'cs-web-tech', 'cs-cyber-security'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT (20 Marks)' }),
      {
        id: 'tech-g1-bse',
        name: 'Basic Science and Engineering (Physics & Electronics Focus)',
        shortName: 'Basic Science & Engg',
        code: 'BSE-G1',
        stageTag: 'CBT (35 Marks)',
        chapters: [
          {
            id: 'tg1-physics',
            title: 'Physics Fundamentals (Units, Force, Work, Heat, Electricity, Magnetism)',
            topicType: 'official',
            subtopics: ['Units & Measurements, Mass/Weight/Density, Work-Power-Energy, Velocity/Speed, Heat & Temperature', 'Electric Field, Electrostatic Potential, Ohm’s Law, Kirchhoff’s Laws, Magnetic Induction & Electromagnetic Waves']
          },
          {
            id: 'tg1-electronics',
            title: 'Electronics & Measurements (Signal Systems Focus)',
            topicType: 'official',
            subtopics: ['Conductors, Semiconductors & Insulators; PN Junction Diodes, Zener, BJT, FET, Rectifiers & Oscillators', 'Number Systems, Logic Gates, Boolean Algebra, Digital Measuring Instruments, CRO/Multimeter & Transducers']
          }
        ]
      }
    ],
    practicalTechnicalTopics: ['Electronic Signalling Measurements: CRO, Multimeter, Logic Analyzers, Transducers & Microprocessor Interfacing'],
    languages: RRB_LANGUAGES,
    physicalStandards: { medicalStandard: 'B-1 Medical Fitness (Distant Vision 6/9, 6/12 with or without glasses; Colour Vision normal).' },
    skillTestDetails: 'No separate skill or typing test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN 02/2024 & CEN 02/2025 Technician Cycle',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'rrb-technician-gr3',
    examCode: 'RRB-TECH-G3',
    name: 'RRB Technician Grade 3',
    shortName: 'RRB Technician Gr-3',
    categoryId: 'rrb',
    authority: 'Railway Recruitment Boards (RRBs)',
    introduction:
      'Recruits Pay Level-2 Technician Grade-III artisans across Fitter, Electrician, Welder, Carpenter, Machinist, Blacksmith, S&T, and Track Machine trades.',
    qualification: 'Matriculation / SSLC + ITI (NCVT/SCVT) in relevant trade OR 10+2 with Physics and Mathematics (for S&T Telecom).',
    ageLimit: '18 to 33 years.',
    selectionProcess: 'Single-Stage CBT → Document Verification & Medical Examination.',
    stages: [
      { name: 'Single-Stage CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '100 objective questions in 90 minutes with 40 marks weightage for General Science.' },
      { name: 'DV & Medical', mode: 'Offline Verification', qualifyingOnly: true, description: 'Verification of ITI/10+2 credentials and B-1/B-2/C-1 medical standards.' }
    ],
    examPattern: [
      {
        stageName: 'Single-Stage CBT (100 Qs · 100 Marks · 90 Mins)',
        sections: [
          { subject: 'Mathematics', questions: 25, marks: 25 },
          { subject: 'General Intelligence & Reasoning', questions: 25, marks: 25 },
          { subject: 'General Science', questions: 40, marks: 40 },
          { subject: 'General Awareness', questions: 10, marks: 10 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '90 Minutes (120 Minutes for PwBD)',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT (25 Marks)' }),
      fromBlueprint('reasoning', { stageTag: 'CBT (25 Marks)' }),
      fromBlueprint('general-science', { stageTag: 'CBT (40 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'CBT (10 Marks)', includeChapterIds: ['ga-national-ca', 'ga-sports', 'ga-awards-honours', 'ga-polity', 'ga-indian-economy', 'ga-static-gk'] })
    ],
    practicalTechnicalTopics: ['No separate trade test in latest CEN; General Science carries 40% weightage (Physics, Chemistry & Life Sciences Class X NCERT).'],
    languages: RRB_LANGUAGES,
    physicalStandards: { medicalStandard: 'B-1 / B-2 / C-1 depending on workshop or S&T post.' },
    skillTestDetails: 'No skill test or typing test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN 02/2024 & CEN 02/2025 Technician Cycle',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'rrb-je',
    examCode: 'RRB-JE',
    name: 'RRB Junior Engineer (JE), DMS & CMA',
    shortName: 'RRB Junior Engineer (JE)',
    categoryId: 'rrb',
    secondaryCategoryIds: ['engineering'],
    popular: true,
    authority: 'Railway Recruitment Boards (RRBs)',
    introduction:
      'Recruits Junior Engineers (Civil, Mechanical, Electrical, Electronics, IT), Depot Material Superintendents (DMS), and Chemical & Metallurgical Assistants (CMA) in Pay Level-6.',
    qualification: '3-Year Diploma or B.E./B.Tech in Civil, Mechanical, Electrical, Electronics, or CS/IT Engineering (B.Sc. Chemistry/Physics for CMA).',
    ageLimit: '18 to 36 years.',
    selectionProcess: 'CBT-1 (Screening) → CBT-2 (Merit with 100 Technical Questions) → Document Verification & Medical Examination.',
    stages: [
      { name: 'CBT-1', mode: 'Computer Based Test', qualifyingOnly: true, description: '100 non-technical questions in 90 minutes (15x shortlisting for CBT-2).' },
      { name: 'CBT-2', mode: 'Computer Based Test', qualifyingOnly: false, description: '150 questions in 120 minutes (50 General/Science/Computer + 100 Technical Abilities).' },
      { name: 'DV & Medical', mode: 'Offline Verification', qualifyingOnly: true, description: 'A-3 / B-1 / B-2 / C-1 medical standards as per Railway Engineering wing.' }
    ],
    examPattern: [
      {
        stageName: 'CBT-1 (100 Qs · 100 Marks · 90 Mins)',
        sections: [
          { subject: 'Mathematics', questions: 30, marks: 30 },
          { subject: 'General Intelligence & Reasoning', questions: 25, marks: 25 },
          { subject: 'General Awareness', questions: 15, marks: 15 },
          { subject: 'General Science', questions: 30, marks: 30 }
        ]
      },
      {
        stageName: 'CBT-2 (150 Qs · 150 Marks · 120 Mins)',
        sections: [
          { subject: 'General Awareness', questions: 15, marks: 15 },
          { subject: 'Physics & Chemistry (up to 10th CBSE)', questions: 15, marks: 15 },
          { subject: 'Basics of Computers & Applications', questions: 10, marks: 10 },
          { subject: 'Basics of Environment & Pollution Control', questions: 10, marks: 10 },
          { subject: 'Technical Abilities (Branch-Specific)', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: 'CBT-1: 100 Qs | CBT-2: 150 Qs',
    totalMarks: 'CBT-1: 100 Marks | CBT-2: 150 Marks',
    duration: 'CBT-1: 90 Mins | CBT-2: 120 Mins',
    negativeMarking: '1/3rd mark deducted per wrong answer in CBT-1 & CBT-2.',
    subjects: [
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT-1 (30 Marks)' }),
      fromBlueprint('reasoning', { stageTag: 'CBT-1 (25 Marks)' }),
      fromBlueprint('general-science', { stageTag: 'CBT-1 (30 Marks) & CBT-2 (15 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'CBT-1 & CBT-2 (15 Marks)' }),
      fromBlueprint('computer-it', { stageTag: 'CBT-2 (10 Marks)', includeChapterIds: ['cs-fundamentals', 'cs-number-systems', 'cs-os', 'cs-dbms', 'cs-networks', 'cs-cyber-security'] }),
      fromBlueprint('eng-civil', { stageTag: 'CBT-2 Technical (Civil Group)' }),
      fromBlueprint('eng-mechanical', { stageTag: 'CBT-2 Technical (Mechanical & Allied)' }),
      fromBlueprint('eng-electrical', { stageTag: 'CBT-2 Technical (Electrical & Allied)' }),
      fromBlueprint('eng-electronics', { stageTag: 'CBT-2 Technical (Electronics & Allied)' })
    ],
    practicalTechnicalTopics: [
      'Environment & Pollution Control (CBT-2 10 Marks): Basics of Environment, Adverse Effects of Pollution, Air/Water/Noise Pollution Control, Waste Management, Global Warming, Acid Rain & Ozone Depletion',
      'Engineering Lab & Field Codes: IS 456, IE Rules, Boiler Safety, CRO Diagnostics & Railway Track Geometry'
    ],
    languages: RRB_LANGUAGES,
    physicalStandards: { medicalStandard: 'A-3 (Track/Signal JE), B-1 (Electrical/Mechanical JE), C-1 (DMS/CMA).' },
    skillTestDetails: 'No typing or skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN 03/2024 & CEN 03/2025 Junior Engineer Cycle',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'rrb-section-controller',
    examCode: 'RRB-SC',
    name: 'RRB Section Controller',
    shortName: 'RRB Section Controller',
    categoryId: 'rrb',
    authority: 'Railway Recruitment Boards (RRBs)',
    introduction:
      'Recruits Section Controllers (Traffic/Operating Department, Pay Level-6) responsible for real-time train movement regulation, section control charting, and crossing/precedence coordination across railway divisions.',
    qualification: 'Bachelor’s Degree in any discipline from a recognized University (refer to zone-specific CEN eligibility).',
    ageLimit: '20 to 33 years (check latest RRB CEN notification for category relaxations).',
    selectionProcess: 'CBT (Objective Test) → CBAT / Aptitude Assessment (where notified) → Document Verification & A-2 Medical Examination.',
    stages: [
      { name: 'Computer Based Test (CBT)', mode: 'Online Objective', qualifyingOnly: false, description: '100 objective questions testing Analytical/Quantitative Ability, Logical Reasoning, and General Awareness.' },
      { name: 'CBAT / Aptitude Test', mode: 'Psycho Aptitude (If notified)', qualifyingOnly: false, description: 'Safety-critical concentration, memory & decision speed assessment.' },
      { name: 'DV & Medical', mode: 'Offline Verification', qualifyingOnly: true, description: 'A-2 Medical Fitness and certificate verification.' }
    ],
    examPattern: [
      {
        stageName: 'CBT Pattern (100 Qs · 100 Marks · 120 Mins — Verify against active CEN)',
        sections: [
          { subject: 'Analytical & Mathematical Capability', questions: 35, marks: 35 },
          { subject: 'Logical & Reasoning Ability', questions: 35, marks: 35 },
          { subject: 'General Awareness & Railway Operations Basics', questions: 30, marks: 30 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '120 Minutes (subject to active CEN schedule)',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT' }),
      fromBlueprint('reasoning', { stageTag: 'CBT' }),
      fromBlueprint('general-awareness', { stageTag: 'CBT', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] })
    ],
    practicalTechnicalTopics: [
      'Train Control Charting, Time-Distance Graphs, Block Section Clearance & Vigilance/Safety Aptitude'
    ],
    languages: RRB_LANGUAGES,
    physicalStandards: { medicalStandard: 'A-2 Medical Standard (Distant Vision 6/9 without glasses).' },
    skillTestDetails: 'CBAT aptitude battery applies when specified in the active CEN.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'RRB Section Controller CEN (Verify 2025/2026 Active Notification)',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Provisional — Verify Notification',
    provisionalNote: 'RRB Section Controller direct recruitment is conducted via specialized CEN notifications (historically also filled via LDCE/GDCE). Verify section-wise weightage against the latest active RRB CEN when published.'
  }),

  buildExamSyllabus({
    id: 'rrb-station-master',
    examCode: 'RRB-SM',
    name: 'RRB Station Master',
    shortName: 'RRB Station Master',
    categoryId: 'rrb',
    authority: 'Railway Recruitment Boards (RRBs)',
    introduction:
      'Recruits Station Masters (Pay Level-6) under RRB NTPC Graduate Level CEN. Station Masters manage station operations, train signalling, passenger safety, and commercial supervision.',
    qualification: 'Bachelor’s Degree in any discipline from a recognized University.',
    ageLimit: '18 to 36 years.',
    selectionProcess: 'CBT-1 → CBT-2 (70% Merit Weightage) → CBAT Aptitude Test (30% Merit Weightage) → Document Verification & A-2 Medical.',
    stages: [
      { name: 'CBT-1', mode: 'Computer Based Test', qualifyingOnly: true, description: '100 Qs in 90 mins common screening test.' },
      { name: 'CBT-2', mode: 'Computer Based Test', qualifyingOnly: false, description: '120 Qs in 90 mins (70% weightage in final Station Master merit).' },
      { name: 'CBAT (Psycho Test)', mode: 'Aptitude Battery', qualifyingOnly: false, description: '5 test batteries; minimum T-score 42 in each; 30% weightage in final merit.' },
      { name: 'DV & A-2 Medical', mode: 'Offline Verification', qualifyingOnly: true, description: 'A-2 medical fitness mandatory (no glasses allowed for distant vision).' }
    ],
    examPattern: [
      {
        stageName: 'CBT-1 (100 Qs · 100 Marks · 90 Mins) & CBT-2 (120 Qs · 120 Marks · 90 Mins)',
        sections: [
          { subject: 'General Awareness (CBT-1: 40 | CBT-2: 50)', questions: 50, marks: 50 },
          { subject: 'Mathematics (CBT-1: 30 | CBT-2: 35)', questions: 35, marks: 35 },
          { subject: 'General Intelligence & Reasoning (CBT-1: 30 | CBT-2: 35)', questions: 35, marks: 35 }
        ]
      }
    ],
    totalQuestions: 'CBT-1: 100 Qs | CBT-2: 120 Qs',
    totalMarks: 'CBT-1: 100 | CBT-2: 120 (+ CBAT T-Score 30%)',
    duration: '90 Minutes per CBT',
    negativeMarking: '1/3rd mark deducted per wrong answer in CBT-1 & CBT-2; None in CBAT.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CBT-1 & CBT-2', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT-1 & CBT-2' }),
      fromBlueprint('reasoning', { stageTag: 'CBT-1 & CBT-2' }),
      fromBlueprint('general-science', { stageTag: 'Part of General Awareness' })
    ],
    practicalTechnicalTopics: [
      'CBAT 5 Batteries: Intelligence Test, Selective Attention Test, Spatial Scanning Test, Information Ordering Test & Personality Test (Minimum 42 T-score in each battery)'
    ],
    languages: RRB_LANGUAGES,
    physicalStandards: { medicalStandard: 'A-2 Medical Standard: Distant vision 6/9, 6/9 without glasses; normal colour vision, binocular vision & field of vision.' },
    skillTestDetails: 'CBAT carries 30% direct weightage in final merit list.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN 06/2025 NTPC Graduate (Station Master Cadre)',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026',
    linkedMockCategory: 'rrb-ntpc-graduate'
  }),

  buildExamSyllabus({
    id: 'rrb-ministerial-isolated',
    examCode: 'RRB-MI',
    name: 'RRB Ministerial and Isolated Categories',
    shortName: 'RRB Ministerial & Isolated',
    categoryId: 'rrb',
    authority: 'Railway Recruitment Boards (RRBs)',
    introduction:
      'Recruits specialized non-technical staff including Junior Stenographers (Hindi/English), Junior Translators (Hindi), Staff & Welfare Inspectors, Chief Law Assistants, Public Prosecutors, Teachers (PGT/TGT/PRT), and Cooks.',
    qualification: 'Post-specific: 12th + Stenography (Steno), Master’s Degree (Translator/PGT), LLB (Law Assistant), B.Ed/D.El.Ed (Teachers).',
    ageLimit: '18 to 33/45 years depending on post.',
    selectionProcess: 'Single-Stage CBT → Stenography / Translation / Teaching / Performance Skill Test (where applicable) → Document Verification & Medical.',
    stages: [
      { name: 'Single-Stage CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '100 objective questions in 90 minutes (50 Professional Ability + 50 General).' },
      { name: 'Skill / Performance / Translation Test', mode: 'Post-Specific Skill Test', qualifyingOnly: false, description: 'Shorthand test for Stenographers; Teaching demonstration for Teachers; Qualifying for others.' },
      { name: 'DV & Medical', mode: 'Offline Verification', qualifyingOnly: true, description: 'C-1 / C-2 medical examination.' }
    ],
    examPattern: [
      {
        stageName: 'Single-Stage CBT (100 Qs · 100 Marks · 90 Mins)',
        sections: [
          { subject: 'Professional Ability (Post-Specific)', questions: 50, marks: 50 },
          { subject: 'General Awareness', questions: 15, marks: 15 },
          { subject: 'General Intelligence & Reasoning', questions: 15, marks: 15 },
          { subject: 'Mathematics', questions: 10, marks: 10 },
          { subject: 'General Science', questions: 10, marks: 10 }
        ]
      }
    ],
    totalQuestions: '100 Questions (Junior Translator: 100 Language Qs)',
    totalMarks: '100 Marks',
    duration: '90 Minutes (120 Minutes for PwBD)',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CBT (15 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('reasoning', { stageTag: 'CBT (15 Marks)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT (10 Marks)' }),
      fromBlueprint('general-science', { stageTag: 'CBT (10 Marks)' }),
      fromBlueprint('english-language', { stageTag: 'Stenographer / Translator Professional Section' }),
      fromBlueprint('specialized-clinical-hindi', { stageTag: 'Junior Translator Professional Section', includeChapterIds: ['sd-ssc-jht'] })
    ],
    practicalTechnicalTopics: [
      'Junior Stenographer (English/Hindi): Shorthand dictation 80 WPM for 10 mins; Transcription 50 mins (Eng) / 65 mins (Hindi) on computer',
      'Railway School Teachers: Teaching Skill / Classroom Demonstration Test (150 Marks combined or qualifying)'
    ],
    languages: RRB_LANGUAGES,
    physicalStandards: { medicalStandard: 'C-1 / C-2 Medical Standard.' },
    skillTestDetails: 'Shorthand 80 WPM (Steno); Translation Test (Hindi Translator); Teaching Skill Test (PGT/TGT/PRT).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN 07/2024 Ministerial & Isolated Cycle',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'rpf-si',
    examCode: 'RPF-SI',
    name: 'RPF Sub-Inspector (Executive)',
    shortName: 'RPF Sub Inspector',
    categoryId: 'rrb',
    secondaryCategoryIds: ['police'],
    popular: true,
    authority: 'Ministry of Railways / Railway Recruitment Boards (RRBs)',
    introduction:
      'Recruits Sub-Inspectors (Executive) in the Railway Protection Force (RPF) and RPSF (Pay Level-6) to protect railway property and passenger security.',
    qualification: 'Graduate from a recognized University.',
    ageLimit: '20 to 28 years (with 3-year COVID/cycle relaxation up to 31 years where notified + reserved relaxations).',
    selectionProcess: 'CBT → Physical Efficiency Test (PET) & Physical Measurement Test (PMT) → Document Verification & Medical.',
    stages: [
      { name: 'Computer Based Test (CBT)', mode: 'Online Objective', qualifyingOnly: false, description: '120 MCQs in 90 minutes (GA 50, Arithmetic 35, Reasoning 35).' },
      { name: 'PET & PMT', mode: 'Physical Ground Test', qualifyingOnly: true, description: '10x vacancies shortlisted for running, long jump, high jump & height/chest checks.' },
      { name: 'Document Verification & Medical', mode: 'Offline', qualifyingOnly: true, description: 'B-1 medical standard verification.' }
    ],
    examPattern: [
      {
        stageName: 'CBT Pattern (120 Qs · 120 Marks · 90 Mins)',
        sections: [
          { subject: 'General Awareness', questions: 50, marks: 50 },
          { subject: 'Arithmetic', questions: 35, marks: 35 },
          { subject: 'General Intelligence & Reasoning', questions: 35, marks: 35 }
        ]
      }
    ],
    totalQuestions: '120 Questions',
    totalMarks: '120 Marks',
    duration: '90 Minutes',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CBT (50 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT Arithmetic (35 Marks)', excludeChapterIds: ['qa-trigonometry', 'qa-height-distance', 'qa-algebra', 'qa-geometry'] }),
      fromBlueprint('reasoning', { stageTag: 'CBT (35 Marks)' })
    ],
    practicalTechnicalTopics: ['RPF Physical Efficiency Test (PET) & Physical Measurement Test (PMT) standards compliance'],
    languages: RRB_LANGUAGES,
    physicalStandards: {
      heightMale: 'UR/OBC: 165 cm | SC/ST: 160 cm | Garhwali/Gorkha/Maratha/Dogra: 163 cm',
      heightFemale: 'UR/OBC: 157 cm | SC/ST: 152 cm | Specified Categories: 155 cm',
      chestMale: 'UR/OBC: 80 cm (Expanded 85 cm) | SC/ST: 76.2 cm (Expanded 81.2 cm)',
      petMale: '1600m run in 6 mins 30 secs | Long Jump: 12 ft | High Jump: 3 ft 9 in',
      petFemale: '800m run in 4 mins | Long Jump: 9 ft | High Jump: 3 ft'
    },
    skillTestDetails: 'No typing or skill test; PET & PMT are qualifying and mandatory.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN RPF 01/2024 (Sub-Inspector)',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'rpf-constable',
    examCode: 'RPF-CONST',
    name: 'RPF Constable (Executive)',
    shortName: 'RPF Constable',
    categoryId: 'rrb',
    secondaryCategoryIds: ['police'],
    popular: true,
    authority: 'Ministry of Railways / Railway Recruitment Boards (RRBs)',
    introduction:
      'Recruits Constables (Executive) in Pay Level-3 for Railway Protection Force (RPF) & RPSF across India.',
    qualification: '10th Pass / Matriculation or equivalent from a recognized Board.',
    ageLimit: '18 to 28 years.',
    selectionProcess: 'CBT (10th Level) → PET & PMT → Document Verification & Medical Examination.',
    stages: [
      { name: 'Computer Based Test (CBT)', mode: 'Online Objective', qualifyingOnly: false, description: '120 MCQs in 90 minutes (GA 50, Arithmetic 35, Reasoning 35).' },
      { name: 'PET & PMT', mode: 'Physical Ground Test', qualifyingOnly: true, description: '1600m/800m run, long jump, high jump & height/chest measurements.' },
      { name: 'DV & Medical', mode: 'Offline', qualifyingOnly: true, description: 'B-1 medical fitness standard.' }
    ],
    examPattern: [
      {
        stageName: 'CBT Pattern (120 Qs · 120 Marks · 90 Mins)',
        sections: [
          { subject: 'General Awareness', questions: 50, marks: 50 },
          { subject: 'Arithmetic', questions: 35, marks: 35 },
          { subject: 'General Intelligence & Reasoning', questions: 35, marks: 35 }
        ]
      }
    ],
    totalQuestions: '120 Questions',
    totalMarks: '120 Marks',
    duration: '90 Minutes',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CBT (50 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CBT Arithmetic (35 Marks)', excludeChapterIds: ['qa-trigonometry', 'qa-height-distance', 'qa-algebra', 'qa-geometry'] }),
      fromBlueprint('reasoning', { stageTag: 'CBT (35 Marks)' })
    ],
    practicalTechnicalTopics: ['1600m Endurance Running (Male) & 800m Running (Female) + Long/High Jump techniques'],
    languages: RRB_LANGUAGES,
    physicalStandards: {
      heightMale: 'UR/OBC: 165 cm | SC/ST: 160 cm',
      heightFemale: 'UR/OBC: 157 cm | SC/ST: 152 cm',
      chestMale: 'UR/OBC: 80–85 cm | SC/ST: 76.2–81.2 cm',
      petMale: '1600m run in 5 mins 45 secs | Long Jump: 14 ft | High Jump: 4 ft',
      petFemale: '800m run in 3 mins 40 secs | Long Jump: 9 ft | High Jump: 3 ft'
    },
    skillTestDetails: 'PET & PMT mandatory qualifying stages.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN RPF 02/2024 & 2025 Constable Cycle',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'rrb-paramedical',
    examCode: 'RRB-PARA',
    name: 'RRB Paramedical Categories',
    shortName: 'RRB Paramedical',
    categoryId: 'rrb',
    authority: 'Railway Recruitment Boards (RRBs)',
    introduction:
      'Recruits Nursing Superintendents, Pharmacists, Dieticians, Health & Malaria Inspectors, Laboratory Superintendents, Radiographers, Physiotherapists, and ECG Technicians in Railway Hospitals.',
    qualification: 'Post-specific: B.Sc. Nursing / GNM (Nursing Supdt), D.Pharm/B.Pharm (Pharmacist), B.Sc. + DMLT (Lab Supdt), etc.',
    ageLimit: '18 to 40/43 years depending on post.',
    selectionProcess: 'Single-Stage CBT → Document Verification & C-1 / C-2 Medical Examination.',
    stages: [
      { name: 'Single-Stage CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: '100 MCQs in 90 minutes (70 Professional Ability + 30 General Subjects).' },
      { name: 'DV & Medical', mode: 'Offline', qualifyingOnly: true, description: 'Certificate, registration council & C-1 medical check.' }
    ],
    examPattern: [
      {
        stageName: 'Single-Stage CBT (100 Qs · 100 Marks · 90 Mins)',
        sections: [
          { subject: 'Professional Ability (Post-Specific Medical/Paramedical)', questions: 70, marks: 70 },
          { subject: 'General Awareness', questions: 10, marks: 10 },
          { subject: 'General Arithmetic, General Intelligence & Reasoning', questions: 10, marks: 10 },
          { subject: 'General Science', questions: 10, marks: 10 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '90 Minutes (120 Minutes for PwBD)',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('specialized-clinical-hindi', { stageTag: 'CBT Professional Ability (70 Marks)', includeChapterIds: ['sd-rrb-paramedical'] }),
      fromBlueprint('general-awareness', { stageTag: 'CBT (10 Marks)', includeChapterIds: ['ga-national-ca', 'ga-polity', 'ga-indian-geography', 'ga-indian-economy', 'ga-static-gk'] }),
      fromBlueprint('general-science', { stageTag: 'CBT (10 Marks)' }),
      fromBlueprint('reasoning', { stageTag: 'CBT (10 Marks Combined)', includeChapterIds: ['rs-analogy', 'rs-number-series', 'rs-coding-decoding', 'rs-blood-relations', 'rs-syllogism', 'rs-data-sufficiency'] })
    ],
    practicalTechnicalTopics: ['Hospital Clinical SOPs, Biomedical Waste Management, Infection Control & Pharmacy Dispensing Rules'],
    languages: RRB_LANGUAGES,
    physicalStandards: { medicalStandard: 'C-1 / C-2 Medical Standard.' },
    skillTestDetails: 'No separate skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CEN 04/2024 & 2025 Paramedical Cycle',
    officialWebsiteUrl: 'https://rrbcdg.gov.in',
    officialNotificationUrl: 'https://rrbcdg.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  })
];
