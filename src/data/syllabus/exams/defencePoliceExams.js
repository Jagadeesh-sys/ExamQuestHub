import { buildExamSyllabus, fromBlueprint } from './examBuilder.js';

/**
 * Defence & Armed Forces + Police & Paramilitary Examinations (2026)
 * Note: UPSC NDA, UPSC CDS, UPSC CAPF AC appear under 'defence' via secondaryCategoryIds.
 * SSC GD, SSC CPO, Delhi Police Constable/HC, RPF SI/Constable, TG Police SI/Constable
 * appear under 'police' via secondaryCategoryIds.
 */
export const DEFENCE_POLICE_EXAMS = [
  // =========================================================================
  // DEFENCE EXAMINATIONS
  // =========================================================================
  buildExamSyllabus({
    id: 'afcat',
    examCode: 'IAF-AFCAT',
    name: 'AFCAT (Air Force Common Admission Test)',
    shortName: 'AFCAT',
    categoryId: 'defence',
    popular: true,
    authority: 'Indian Air Force (afcat.cdac.in)',
    introduction:
      'Selects Class-I Gazetted Officers in Flying and Ground Duty (Technical and Non-Technical) branches of the Indian Air Force.',
    qualification:
      'Flying & Ground Duty (Non-Tech): Graduation (60% marks) with Physics & Math at 10+2 for Flying | Ground Duty (Tech): 4-year B.E./B.Tech in Aeronautical/ECE/ME/CSE/EE with 60% marks.',
    ageLimit: 'Flying Branch: 20 to 24 years | Ground Duty (Tech/Non-Tech): 20 to 26 years.',
    selectionProcess: 'Online AFCAT Written Test (+ EKT if applicable) → AFSB Testing (5-Day Air Force Selection Board) → Pilot Aptitude / CPSS (Flying) → Medical Examination.',
    stages: [
      { name: 'AFCAT Online Written Test', mode: 'Computer Based Test', qualifyingOnly: false, description: '100 Objective Qs / 300 Marks in 120 minutes across GA, Verbal Ability, Numerical Ability & Reasoning.' },
      { name: 'AFSB Interview (Stage I & II)', mode: '5-Day SSB Assessment', qualifyingOnly: false, description: 'OIR/PPDT Screening, Psychological Tests, Group Tasks, Personal Interview & CPSS (Flying).' }
    ],
    examPattern: [
      {
        stageName: 'AFCAT CBT (100 Qs · 300 Marks · 120 Mins)',
        sections: [
          { subject: 'General Awareness (History, Geo, Polity, Defence, Sports, Environment, Current Affairs)', questions: 25, marks: 75 },
          { subject: 'Verbal Ability in English (Comprehension, Error, Cloze, Vocab, Idioms)', questions: 30, marks: 90 },
          { subject: 'Numerical Ability (Arithmetic, Speed-Time, Mensuration, Ratio, SI/CI, Probability)', questions: 20, marks: 60 },
          { subject: 'Reasoning & Military Aptitude (Verbal & Spatial/Dot Situation)', questions: 25, marks: 75 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '300 Marks (+ AFSB Merit)',
    duration: '2 Hours (120 Minutes)',
    negativeMarking: '1 mark deducted for each incorrect answer (+3 for correct).',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'AFCAT CBT (25 Qs)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('english-language', { stageTag: 'AFCAT CBT (30 Qs)' }),
      fromBlueprint('quantitative-aptitude', {
        stageTag: 'AFCAT CBT (20 Qs)',
        excludeChapterIds: ['qa-algebra', 'qa-geometry', 'qa-trigonometry', 'qa-height-distance', 'qa-statistics']
      }),
      fromBlueprint('reasoning', { stageTag: 'AFCAT CBT — Reasoning & Military Aptitude (25 Qs)' })
    ],
    practicalTechnicalTopics: [
      'Military Aptitude: Dot Situation, Spatial Rotation, Embedded Figures, Pattern Completion & Venn Diagrams',
      'Technical Branch Screening: GATE score / B.E. discipline fundamentals tested during AFSB technical interview'
    ],
    languages: ['English only'],
    physicalStandards: {
      maleHeight: '162.5 cm (Flying), 157.5 cm (Ground Duty)',
      femaleHeight: '162.5 cm (Flying), 152 cm (Ground Duty)',
      medicalStandard: '6/6 vision (Flying without spectacles); leg length & sitting height norms for Fighter/Transport pilots.'
    },
    skillTestDetails: 'CPSS (Computerised Pilot Selection System) for Flying Branch (once-in-a-lifetime test).',
    interviewDetails: '5-Day AFSB at Dehradun, Mysuru, Gandhinagar, or Varanasi.',
    officialNotificationRef: 'AFCAT 01/2026 & 02/2026 Cycle',
    officialWebsiteUrl: 'https://afcat.cdac.in',
    officialNotificationUrl: 'https://afcat.cdac.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'indian-navy-ssr',
    examCode: 'NAVY-SSR',
    name: 'Indian Navy SSR (Senior Secondary Recruit — Agniveer)',
    shortName: 'Indian Navy SSR',
    categoryId: 'defence',
    authority: 'Indian Navy (joinindiannavy.gov.in)',
    introduction:
      'Recruits 10+2 Science candidates into the Senior Secondary Recruit (SSR) Agniveer technical & operational cadre of the Indian Navy.',
    qualification: '10+2 examination with Mathematics & Physics and at least one of Chemistry / Biology / Computer Science (min 50% aggregate).',
    ageLimit: '17.5 to 21 years (Unmarried Male & Female candidates).',
    selectionProcess: 'INET Stage-I Computer Based Test (Shortlisting) → Stage-II Written Exam + PFT (Physical Fitness Test) → Recruitment Medical Exam.',
    stages: [
      { name: 'Stage-I (INET CBT)', mode: 'Computer Based Test', qualifyingOnly: true, description: '100 Objective Qs / 100 Marks in 60 minutes.' },
      { name: 'Stage-II Written + PFT + Medical', mode: 'Written + Ground PFT', qualifyingOnly: false, description: 'Merit written exam combined with PFT qualifying & medical.' }
    ],
    examPattern: [
      {
        stageName: 'INET CBT (100 Qs · 100 Marks · 60 Mins)',
        sections: [
          { subject: 'English', questions: 25, marks: 25 },
          { subject: 'Science (10+2 Physics & General Science)', questions: 25, marks: 25 },
          { subject: 'Mathematics (10+2 Algebra, Trig, Calculus, Vectors, Probability)', questions: 25, marks: 25 },
          { subject: 'General Awareness (GK, Reasoning, Defence, Sports, CA)', questions: 25, marks: 25 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '60 Minutes',
    negativeMarking: '0.25 marks deducted for every wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Section 1 (25 Qs)' }),
      fromBlueprint('general-science', {
        stageTag: 'Section 2 — Physics & Science (25 Qs)',
        extraChapters: [
          {
            id: 'navy-10plus2-phy',
            title: '10+2 Physics (Electromagnetism, Kinematics, Optics & Semiconductors)',
            topicType: 'official',
            subtopics: ['Kinematics, Laws of Motion, Rotational Motion & Gravitation', 'Electrostatics, Current Electricity, EMI & Alternating Current', 'Ray & Wave Optics, Dual Nature of Matter & Communication Systems']
          }
        ]
      }),
      fromBlueprint('quantitative-aptitude', {
        stageTag: 'Section 3 — 10+2 Mathematics (25 Qs)',
        extraChapters: [
          {
            id: 'navy-10plus2-math',
            title: '10+2 Mathematics (Sets, Trigonometry, Calculus, Vectors & Matrices)',
            topicType: 'official',
            subtopics: ['Relations, Functions, Complex Numbers, Quadratic Equations & Matrices/Determinants', 'Differential & Integral Calculus, Vector Algebra & 3D Geometry', 'Binomial Theorem, Permutations, Combinations & Probability']
          }
        ]
      }),
      fromBlueprint('general-awareness', { stageTag: 'Section 4 (25 Qs)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] })
    ],
    practicalTechnicalTopics: ['Naval Terminology, Ships/Submarines of Indian Navy, Maritime Geography & Swimming Proficiency'],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      maleHeight: '157 cm',
      femaleHeight: '152 cm',
      running: '1.6 km run: 6 mins 30 sec (Male), 8 mins (Female)',
      otherEvents: 'Squats (Uthak Baithak): 20 (M) / 15 (F); Push-ups: 15 (M); Bent Knee Sit-ups: 15 (M) / 10 (F).'
    },
    skillTestDetails: 'No skill test; PFT is mandatory & qualifying.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'Indian Navy Agniveer (SSR) 2026 Batch',
    officialWebsiteUrl: 'https://joinindiannavy.gov.in',
    officialNotificationUrl: 'https://joinindiannavy.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'indian-navy-mr',
    examCode: 'NAVY-MR',
    name: 'Indian Navy MR (Matric Recruit — Chef, Steward, Hygienist)',
    shortName: 'Indian Navy MR',
    categoryId: 'defence',
    authority: 'Indian Navy (joinindiannavy.gov.in)',
    introduction:
      'Recruits Matriculation (Class 10th) qualified Agniveers as Chefs, Stewards, and Hygienists in the Indian Navy.',
    qualification: 'Class 10th (Matriculation) examination from a recognized Board of School Education.',
    ageLimit: '17.5 to 21 years (Unmarried Male & Female).',
    selectionProcess: 'Stage-I INET CBT → Stage-II Written Exam + PFT + Medical Examination.',
    stages: [
      { name: 'Stage-I CBT', mode: 'Computer Based Test', qualifyingOnly: true, description: '50 MCQs / 50 Marks in 30 minutes (Class 10th standard).' },
      { name: 'Stage-II Written + PFT + Medical', mode: 'Written + PFT', qualifyingOnly: false, description: 'Final merit written test and physical fitness qualification.' }
    ],
    examPattern: [
      {
        stageName: 'INET MR CBT (50 Qs · 50 Marks · 30 Mins)',
        sections: [
          { subject: 'Science & Mathematics (Class 10th Standard)', questions: 25, marks: 25 },
          { subject: 'General Awareness (GK, Geography, History, Defence, Sports, Current Affairs)', questions: 25, marks: 25 }
        ]
      }
    ],
    totalQuestions: '50 Questions',
    totalMarks: '50 Marks',
    duration: '30 Minutes',
    negativeMarking: '0.25 marks deducted for wrong answers.',
    subjects: [
      fromBlueprint('general-science', { stageTag: 'Section A — Science (Class 10th)' }),
      fromBlueprint('quantitative-aptitude', {
        stageTag: 'Section A — Mathematics (Class 10th)',
        excludeChapterIds: ['qa-data-interpretation', 'qa-statistics', 'qa-probability']
      }),
      fromBlueprint('general-awareness', { stageTag: 'Section B — General Awareness (25 Qs)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] })
    ],
    practicalTechnicalTopics: ['Basic Hygiene, Nutrition, Kitchen Safety & Naval Discipline'],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      maleHeight: '157 cm',
      femaleHeight: '152 cm',
      running: '1.6 km in 6 mins 30 sec (M) / 8 mins (F)',
      otherEvents: 'Squats: 20 (M) / 15 (F); Push-ups: 15 (M); Sit-ups: 15 (M) / 10 (F).'
    },
    skillTestDetails: 'No trade test prior to training.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'Indian Navy Agniveer (MR) 2026 Batch',
    officialWebsiteUrl: 'https://joinindiannavy.gov.in',
    officialNotificationUrl: 'https://joinindiannavy.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'indian-navy-agniveer',
    examCode: 'NAVY-AGNIVEER',
    name: 'Indian Navy Agniveer (Integrated SSR & MR Scheme)',
    shortName: 'Indian Navy Agniveer',
    categoryId: 'defence',
    authority: 'Indian Navy (agniveernavy.cdac.in)',
    introduction:
      'Four-year Agnipath Scheme recruitment portal for Indian Navy Agniveer (SSR 10+2 & MR 10th) technical, seaman, aviation, and support branches.',
    qualification: 'SSR: 10+2 with Maths & Physics | MR: Class 10th Pass.',
    ageLimit: '17.5 to 21 years.',
    selectionProcess: 'INET Stage-I Computer Based Test → Stage-II Written Exam + PFT → INS Chilka Induction Medical.',
    stages: [
      { name: 'Stage-I INET Screening', mode: 'Computer Based Test', qualifyingOnly: true, description: 'SSR: 100 Qs (60 Mins) | MR: 50 Qs (30 Mins).' },
      { name: 'Stage-II Exam & PFT', mode: 'Written + Physical Test', qualifyingOnly: false, description: 'Command-level written test & PFT.' }
    ],
    examPattern: [
      {
        stageName: 'SSR Stream (100 Qs · 100 Marks) / MR Stream (50 Qs · 50 Marks)',
        sections: [
          { subject: 'SSR: English (25), Science (25), Mathematics (25), GA (25)', questions: 100, marks: 100 },
          { subject: 'MR: Science & Mathematics (25), General Awareness (25)', questions: 50, marks: 50 }
        ]
      }
    ],
    totalQuestions: 'SSR: 100 Qs | MR: 50 Qs',
    totalMarks: 'SSR: 100 Marks | MR: 50 Marks',
    duration: 'SSR: 60 Mins | MR: 30 Mins',
    negativeMarking: '0.25 marks per wrong answer.',
    subjects: [
      fromBlueprint('general-science', { stageTag: 'SSR & MR Science' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'SSR & MR Mathematics' }),
      fromBlueprint('english-language', { stageTag: 'SSR Only' }),
      fromBlueprint('general-awareness', { stageTag: 'SSR & MR General Awareness', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] })
    ],
    practicalTechnicalTopics: ['Maritime Domain Awareness, INS Vessels, Ranks & Badges of Indian Navy'],
    languages: ['English', 'Hindi'],
    physicalStandards: { maleHeight: '157 cm', femaleHeight: '152 cm', running: '1.6 km in 6.5 min (M) / 8 min (F)' },
    skillTestDetails: 'Mandatory PFT qualification.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'Indian Navy Agnipath 2026 Cycle',
    officialWebsiteUrl: 'https://joinindiannavy.gov.in',
    officialNotificationUrl: 'https://joinindiannavy.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'iaf-agniveervayu',
    examCode: 'IAF-AGNIVEER',
    name: 'Indian Air Force Agniveervayu (Science & Other Than Science)',
    shortName: 'IAF Agniveervayu',
    categoryId: 'defence',
    popular: true,
    authority: 'Central Airmen Selection Board (CASB), Indian Air Force',
    introduction:
      'Recruits 10+2 / Diploma qualified youth into Science Subjects (Group X equivalent) and Other Than Science Subjects (Group Y equivalent) of the Indian Air Force.',
    qualification: 'Science Subjects: 10+2 with Maths, Physics & English (50% aggregate & 50% in English) OR 3-yr Engg Diploma | Other Than Science: 10+2 in any stream with 50% aggregate & 50% in English.',
    ageLimit: '17.5 to 21 years.',
    selectionProcess: 'Phase-I Online Written Test → Phase-II Document Verification, Physical Fitness Test (PFT) & Adaptability Tests I & II → Phase-III Medical Examination.',
    stages: [
      { name: 'Phase-I Online Test', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Science: 70 Marks (60 Mins) | Non-Science: 50 Marks (45 Mins) | Both: 100 Marks (85 Mins).' },
      { name: 'Phase-II PFT & Adaptability Tests', mode: 'Ground PFT + Psychological', qualifyingOnly: true, description: '1.6 km run, Push-ups, Sit-ups, Squats + Situation Reaction & Group Discussion.' },
      { name: 'Phase-III Medical Exam', mode: 'Air Force Medical Board', qualifyingOnly: true, description: 'Comprehensive medical standards at designated Air Force stations.' }
    ],
    examPattern: [
      {
        stageName: 'Phase-I CBT (Science: 70 Qs · 60 Mins | Non-Science: 50 Qs · 45 Mins)',
        sections: [
          { subject: 'Science Stream: English (20) + Physics (25) + Mathematics (25)', questions: 70, marks: 70 },
          { subject: 'Other Than Science: English (20) + RAGA (Reasoning & General Awareness — 30)', questions: 50, marks: 50 }
        ]
      }
    ],
    totalQuestions: 'Science: 70 | Non-Science: 50 | Both: 100',
    totalMarks: 'Science: 70 | Non-Science: 50 | Both: 100',
    duration: '60 / 45 / 85 Minutes',
    negativeMarking: '0.25 marks deducted for each wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Both Streams (20 Qs)' }),
      fromBlueprint('reasoning', { stageTag: 'RAGA Section (Non-Science)' }),
      fromBlueprint('quantitative-aptitude', {
        stageTag: 'RAGA Arithmetic + Science 10+2 Maths',
        extraChapters: [
          {
            id: 'iaf-10plus2-math-phy',
            title: 'CBSE 10+2 Physics & Mathematics (Science Stream)',
            topicType: 'official',
            subtopics: ['Physics: Physical World, Kinematics, Laws of Motion, Thermodynamics, Waves, Electrostatics, Magnetism, Optics & Electronics', 'Mathematics: Sets, Trigonometry, Complex Numbers, Matrices, Straight Lines, Conics, Calculus, Vectors & Probability']
          }
        ]
      }),
      fromBlueprint('general-awareness', { stageTag: 'RAGA General Awareness', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] })
    ],
    practicalTechnicalTopics: ['Adaptability Test-I (Objective Situation Reaction Test) & Adaptability Test-II (Group Discussion in English)'],
    languages: ['English & Hindi (English paper in English only)'],
    physicalStandards: {
      maleHeight: '152.5 cm',
      femaleHeight: '152 cm',
      maleChest: '77 cm minimum with 5 cm expansion',
      running: '1.6 km run: 7 mins (Male), 8 mins (Female)',
      otherEvents: 'Male: 10 Push-ups, 10 Sit-ups, 20 Squats | Female: 10 Sit-ups, 15 Squats.'
    },
    skillTestDetails: 'Adaptability Test II assesses communication & military environment adjustment.',
    interviewDetails: 'No formal interview; Group Discussion in Phase-II.',
    officialNotificationRef: 'IAF Agniveervayu Intake 01/2026 & 02/2026',
    officialWebsiteUrl: 'https://agnipathvayu.cdac.in',
    officialNotificationUrl: 'https://agnipathvayu.cdac.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'indian-army-agniveer',
    examCode: 'ARMY-AGNIVEER',
    name: 'Indian Army Agniveer (GD, Technical, Clerk/SKT, Tradesman)',
    shortName: 'Indian Army Agniveer',
    categoryId: 'defence',
    popular: true,
    authority: 'Directorate General of Recruiting, Indian Army (joinindianarmy.nic.in)',
    introduction:
      'Pan-India Army Recruitment Office (ARO) rally recruitment under Agnipath for Agniveer General Duty (GD), Technical, Office Assistant / Store Keeper Technical (SKT), and Tradesman.',
    qualification: 'GD: Class 10th (45% aggregate, 33% each) | Technical: 10+2 Science (PCM+Eng 50%) or ITI | Clerk/SKT: 10+2 (60% aggregate, 50% each) | Tradesman: 8th / 10th Pass.',
    ageLimit: '17.5 to 21 years.',
    selectionProcess: 'Phase-I Online CEE (Common Entrance Examination) → Phase-II Recruitment Rally (Physical Fitness Test + Physical Measurement + Medical) → Typing Test (for Clerk).',
    stages: [
      { name: 'Phase-I Online CEE', mode: 'Computer Based Test', qualifyingOnly: false, description: '50 Objective Qs (GD/Tech/Tradesman) or 50 Qs / 200 Marks (Clerk/SKT) in 60 minutes.' },
      { name: 'Phase-II Recruitment Rally (PFT & Medical)', mode: 'Ground Rally + Medical', qualifyingOnly: false, description: '1.6 km Run (Group I/II marks in GD/Tradesman), Pull-ups (Beam), 9 Feet Ditch & Zig-Zag Balance.' }
    ],
    examPattern: [
      {
        stageName: 'Agniveer GD / Tradesman CEE (50 Qs · 100 Marks · 60 Mins)',
        sections: [
          { subject: 'General Knowledge', questions: 15, marks: 30 },
          { subject: 'General Science', questions: 15, marks: 30 },
          { subject: 'Mathematics', questions: 15, marks: 30 },
          { subject: 'Logical Reasoning', questions: 5, marks: 10 }
        ]
      },
      {
        stageName: 'Agniveer Technical (50 Qs · 200 Marks) & Clerk/SKT (50 Qs · 200 Marks)',
        sections: [
          { subject: 'Technical: GK (5), Maths (15), Physics (15), Chemistry (15)', questions: 50, marks: 200 },
          { subject: 'Clerk/SKT: GK (5), GS (5), Computer (5), Maths (10), English (25)', questions: 50, marks: 200 }
        ]
      }
    ],
    totalQuestions: '50 Questions (All Categories)',
    totalMarks: 'GD/Tradesman: 100 Marks (+100 PFT) | Tech/Clerk: 200 Marks',
    duration: '60 Minutes',
    negativeMarking: '25% negative marking (0.50 marks for 2-mark Qs, 1 mark for 4-mark Qs).',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CEE GK Section', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('general-science', { stageTag: 'CEE Science / Tech Physics & Chemistry' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CEE Mathematics' }),
      fromBlueprint('reasoning', { stageTag: 'CEE Reasoning (5 Qs)', includeChapterIds: ['rs-analogy', 'rs-number-series', 'rs-coding-decoding', 'rs-blood-relations', 'rs-direction-sense', 'rs-ranking-order'] }),
      fromBlueprint('english-language', { stageTag: 'Clerk / SKT Only (25 Qs)' }),
      fromBlueprint('computer-it', { stageTag: 'Clerk / SKT Only (5 Qs)', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks'] })
    ],
    practicalTechnicalTopics: ['Clerk Typing Test: 30 WPM in English on Computer (Phase-II) | NCC A/B/C Certificate Bonus Marks'],
    languages: ['English', 'Hindi', 'Assamese', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Marathi', 'Odia', 'Punjabi', 'Tamil', 'Telugu', 'Urdu'],
    physicalStandards: {
      maleHeight: '166–170 cm (region-dependent); 162 cm for Clerk/SKT',
      maleChest: '77 cm (+5 cm expansion)',
      running: '1.6 km Run: Up to 5m 30s (Group I = 60 Marks), 5m 31s–5m 45s (Group II = 48 Marks)',
      otherEvents: 'Pull-ups (10 = 40 Marks down to 6 = 16 Marks), 9 Feet Ditch (Qualifying), Zig-Zag Balance (Qualifying).'
    },
    skillTestDetails: 'Typing test (30 WPM English) mandatory for Agniveer Office Assistant / SKT.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'Indian Army Agniveer Rally Cycle 2026-27',
    officialWebsiteUrl: 'https://joinindianarmy.nic.in',
    officialNotificationUrl: 'https://joinindianarmy.nic.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'coast-guard-navik',
    examCode: 'ICG-NAVIK',
    name: 'Indian Coast Guard Navik (General Duty & Domestic Branch)',
    shortName: 'Coast Guard Navik (GD/DB)',
    categoryId: 'defence',
    authority: 'Indian Coast Guard (joinindiancoastguard.cdac.in)',
    introduction:
      'Recruits personnel for Navik (General Duty — 10+2 Maths/Physics) and Navik (Domestic Branch — 10th) in the Indian Coast Guard.',
    qualification: 'Navik GD: 10+2 with Maths & Physics | Navik DB: Class 10th Pass.',
    ageLimit: '18 to 22 years (SC/ST +5 yrs, OBC +3 yrs).',
    selectionProcess: 'Stage-I CBT (Section I for DB; Section I + II for GD) → Stage-II PFT + Document Verification → Stage-III Final Medical at INS Chilka.',
    stages: [
      { name: 'Stage-I CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Section I (DB & GD): 60 Qs in 45 mins | Section II (GD only): 50 Qs (10+2 Physics & Maths) in 30 mins.' },
      { name: 'Stage-II PFT & DV', mode: 'Physical Fitness + Document Check', qualifyingOnly: true, description: '1.6 km run in 7 mins, 20 Squats, 10 Push-ups.' }
    ],
    examPattern: [
      {
        stageName: 'Section I (DB & GD · 60 Qs · 45 Mins) + Section II (GD · 50 Qs · 30 Mins)',
        sections: [
          { subject: 'Sec I: Maths (20), Science (10), English (15), Reasoning (10), GK (5)', questions: 60, marks: 60 },
          { subject: 'Sec II (GD only): 10+2 Physics (25) + 10+2 Mathematics (25)', questions: 50, marks: 50 }
        ]
      }
    ],
    totalQuestions: 'DB: 60 Qs | GD: 110 Qs',
    totalMarks: 'DB: 60 Marks | GD: 110 Marks',
    duration: 'DB: 45 Mins | GD: 75 Mins',
    negativeMarking: 'No negative marking in ICG Navik CBT.',
    subjects: [
      fromBlueprint('quantitative-aptitude', { stageTag: 'Section I Maths (20 Qs)' }),
      fromBlueprint('general-science', { stageTag: 'Section I Science (10 Qs)' }),
      fromBlueprint('english-language', { stageTag: 'Section I English (15 Qs)' }),
      fromBlueprint('reasoning', { stageTag: 'Section I Reasoning (10 Qs)' }),
      fromBlueprint('general-awareness', { stageTag: 'Section I GK (5 Qs)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] })
    ],
    practicalTechnicalTopics: ['Navik GD Section II: 10+2 NCERT Physics (Mechanics, Heat, Waves, Electricity, Optics) & Maths (Vectors, Calculus, Conics, Probability)'],
    languages: ['English', 'Hindi'],
    physicalStandards: { maleHeight: '157 cm', maleChest: 'Minimum 5 cm expansion', running: '1.6 km in 7 minutes, 20 Squats, 10 Push-ups' },
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'ICG CGEPT 01/2026 & 02/2026',
    officialWebsiteUrl: 'https://joinindiancoastguard.cdac.in',
    officialNotificationUrl: 'https://joinindiancoastguard.cdac.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'coast-guard-yantrik',
    examCode: 'ICG-YANTRIK',
    name: 'Indian Coast Guard Yantrik (Mechanical, Electrical, Electronics)',
    shortName: 'Coast Guard Yantrik',
    categoryId: 'defence',
    secondaryCategoryIds: ['engineering'],
    authority: 'Indian Coast Guard (joinindiancoastguard.cdac.in)',
    introduction:
      'Technical diploma entry into the Indian Coast Guard across Mechanical, Electrical, and Electronics/Telecommunication streams.',
    qualification: 'Class 10th Pass + 3-year AICTE-approved Diploma in Mechanical / Electrical / Electronics & Telecommunication Engineering (or 10+2 + 2/3-year Diploma).',
    ageLimit: '18 to 22 years (SC/ST +5 yrs, OBC +3 yrs).',
    selectionProcess: 'Stage-I CBT (Section I Common + Section III/IV/V Engineering Branch Paper) → Stage-II PFT & DV → Stage-III Final Medical.',
    stages: [
      { name: 'Stage-I CBT', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Section I (60 Qs, 45 Mins) + Branch Technical Paper Sec III/IV/V (50 Qs, 30 Mins).' },
      { name: 'Stage-II PFT & DV', mode: 'Physical Fitness Test', qualifyingOnly: true, description: '1.6 km run (7 mins), 20 Squats, 10 Push-ups & Diploma verification.' }
    ],
    examPattern: [
      {
        stageName: 'Stage-I CBT (110 Qs · 110 Marks · 75 Mins)',
        sections: [
          { subject: 'Section I: Maths (20), Science (10), English (15), Reasoning (10), GK (5)', questions: 60, marks: 60 },
          { subject: 'Section III (Elec) / Sec IV (ECE) / Sec V (Mech): Diploma Engineering Paper', questions: 50, marks: 50 }
        ]
      }
    ],
    totalQuestions: '110 Questions',
    totalMarks: '110 Marks',
    duration: '75 Minutes (45 + 30 Mins)',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('eng-electrical', { stageTag: 'Section III — Electrical Stream (50 Qs)' }),
      fromBlueprint('eng-electronics', { stageTag: 'Section IV — Electronics Stream (50 Qs)' }),
      fromBlueprint('eng-mechanical', { stageTag: 'Section V — Mechanical Stream (50 Qs)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Section I (20 Qs)' }),
      fromBlueprint('english-language', { stageTag: 'Section I (15 Qs)' })
    ],
    practicalTechnicalTopics: ['Marine Propulsion Auxiliaries, Shipboard Power Distribution & Radar/Communication Maintenance'],
    languages: ['English', 'Hindi'],
    physicalStandards: { maleHeight: '157 cm', maleChest: '5 cm expansion', running: '1.6 km in 7 mins, 20 Squats, 10 Push-ups' },
    skillTestDetails: 'No trade test prior to Stage-III.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'ICG CGEPT Yantrik 2026',
    officialWebsiteUrl: 'https://joinindiancoastguard.cdac.in',
    officialNotificationUrl: 'https://joinindiancoastguard.cdac.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  // =========================================================================
  // POLICE & PARAMILITARY EXAMINATIONS
  // =========================================================================
  buildExamSyllabus({
    id: 'crpf-constable',
    examCode: 'CRPF-CT',
    name: 'CRPF Constable (Technical, Tradesmen & General Duty)',
    shortName: 'CRPF Constable',
    categoryId: 'police',
    authority: 'Central Reserve Police Force (rect.crpf.gov.in)',
    introduction:
      'Recruitment for Constable (Technical/Tradesmen — Driver, Motor Mechanic, Carpenter, Bugler, Cook) via direct CRPF CBT, alongside Constable (GD) recruited via SSC GD.',
    qualification: 'Class 10th (Matriculation) from a recognized Board + Heavy Transport Vehicle License (for Driver) or Trade proficiency.',
    ageLimit: '21–27 years (Driver) | 18–23 years (Other Tradesmen/GD) with category relaxations.',
    selectionProcess: 'CBT Written Examination → PST & PET → Trade Test (Practical) → Document Verification & Medical.',
    stages: [
      { name: 'Computer Based Test (CBT)', mode: 'Online Objective', qualifyingOnly: false, description: '100 Objective Qs / 100 Marks in 120 minutes.' },
      { name: 'PST, PET & Trade Test', mode: 'Physical + Practical Trade', qualifyingOnly: true, description: 'Height/Chest measurement, Running & Practical Trade Test (50 Marks qualifying).' }
    ],
    examPattern: [
      {
        stageName: 'CRPF CBT (100 Qs · 100 Marks · 120 Mins)',
        sections: [
          { subject: 'General Intelligence and Reasoning', questions: 25, marks: 25 },
          { subject: 'General Knowledge and General Awareness', questions: 25, marks: 25 },
          { subject: 'Elementary Mathematics', questions: 25, marks: 25 },
          { subject: 'English / Hindi', questions: 25, marks: 25 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '2 Hours (120 Minutes)',
    negativeMarking: '0.25 marks deducted for each wrong answer.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Part A (25 Qs)' }),
      fromBlueprint('general-awareness', { stageTag: 'Part B (25 Qs)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Part C — Elementary Math (25 Qs)', excludeChapterIds: ['qa-algebra', 'qa-geometry', 'qa-trigonometry', 'qa-height-distance', 'qa-statistics', 'qa-probability'] }),
      fromBlueprint('english-language', { stageTag: 'Part D — English Option (25 Qs)' })
    ],
    practicalTechnicalTopics: ['Trade Test (50 Marks, Min 20 Qualifying): Vehicle driving/maintenance (Driver/MMV), tailoring, plumbing, masonry, or culinary skills as per applied trade.'],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      maleHeight: '170 cm (ST: 162.5 cm)',
      femaleHeight: '157 cm (ST: 150 cm)',
      maleChest: '80 cm (+5 cm expansion)',
      running: '5 km in 24 mins (Male) / 1.6 km in 8.5 mins (Female) — Driver/Constable; 1.6 km in 10 mins (Trades).'
    },
    skillTestDetails: 'Practical Trade Test (Qualifying) is compulsory for Technical/Tradesmen.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CRPF Technical & Tradesmen Recruitment Reference',
    officialWebsiteUrl: 'https://rect.crpf.gov.in',
    officialNotificationUrl: 'https://rect.crpf.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'bsf-constable',
    examCode: 'BSF-CT',
    name: 'BSF Constable (Tradesman, Water Wing & GD)',
    shortName: 'BSF Constable',
    categoryId: 'police',
    authority: 'Border Security Force (rectt.bsf.gov.in)',
    introduction:
      'Recruits Constables for Border Security Force Tradesman, Technical/Workshop, and Water Wing cadres (while BSF GD is filled through SSC GD).',
    qualification: 'Class 10th Matriculation + 2-year ITI Certificate / Trade Experience (Tradesman) or 10th pass (GD).',
    ageLimit: '18 to 25 years (Tradesman) | 18 to 23 years (GD).',
    selectionProcess: 'Phase-I PST & PET → Phase-II CBT Written Examination → Phase-III Document Verification, Trade Test & Medical.',
    stages: [
      { name: 'PST & PET', mode: 'Physical Measurement & Run', qualifyingOnly: true, description: 'Height/Chest check & 5 km (Male) / 1.6 km (Female) race.' },
      { name: 'Written Exam (CBT/OMR)', mode: 'Objective MCQ', qualifyingOnly: false, description: '100 Qs / 100 Marks in 120 minutes.' },
      { name: 'Trade Test & Medical', mode: 'Practical + Medical', qualifyingOnly: true, description: 'NSQF / Practical trade verification.' }
    ],
    examPattern: [
      {
        stageName: 'Written Exam (100 Qs · 100 Marks · 120 Mins)',
        sections: [
          { subject: 'General Awareness / General Knowledge', questions: 25, marks: 25 },
          { subject: 'Knowledge of Elementary Mathematics', questions: 25, marks: 25 },
          { subject: 'Analytical Aptitude & Pattern Observation (Reasoning)', questions: 25, marks: 25 },
          { subject: 'Basic Knowledge of English / Hindi', questions: 25, marks: 25 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '120 Minutes',
    negativeMarking: 'No negative marking (BSF direct Tradesman CBT; 0.25 if via SSC GD).',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Part I (25 Qs)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Part II Elementary Maths (25 Qs)', excludeChapterIds: ['qa-algebra', 'qa-geometry', 'qa-trigonometry', 'qa-height-distance', 'qa-statistics', 'qa-probability'] }),
      fromBlueprint('reasoning', { stageTag: 'Part III Reasoning (25 Qs)' }),
      fromBlueprint('english-language', { stageTag: 'Part IV English Option (25 Qs)' })
    ],
    practicalTechnicalTopics: ['Border & Coastal Trade Skills (Cook, Sweeper, Cobbler, Tailor, Electrician, Engine Driver for Water Wing)'],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      maleHeight: '165 cm (Tradesman) / 170 cm (GD)',
      femaleHeight: '155 cm (Tradesman) / 157 cm (GD)',
      maleChest: '75–80 cm (+5 cm expansion)',
      running: '5 km in 24 mins (Male) / 1.6 km in 8.5 mins (Female).'
    },
    skillTestDetails: 'Trade proficiency test (qualifying).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'BSF Recruitment 2025-26',
    officialWebsiteUrl: 'https://rectt.bsf.gov.in',
    officialNotificationUrl: 'https://rectt.bsf.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'cisf-constable',
    examCode: 'CISF-CT',
    name: 'CISF Constable (Fire, Driver & Tradesmen)',
    shortName: 'CISF Constable',
    categoryId: 'police',
    authority: 'Central Industrial Security Force (cisfrectt.cisf.gov.in)',
    introduction:
      'Recruits Constables for Fire Wing (10+2 Science), Constable/Driver, and Tradesmen to safeguard airports, metros, PSUs, and atomic/space installations.',
    qualification: 'Constable Fire: 10+2 with Science subject | Constable Driver/Tradesmen: Class 10th Pass (+ Driving License for Driver).',
    ageLimit: '18 to 23 years (Fire/Tradesmen) | 21 to 27 years (Driver).',
    selectionProcess: 'PET & PST → OMR/CBT Written Examination → Document Verification & Detailed Medical Exam.',
    stages: [
      { name: 'PET & PST', mode: 'Physical Efficiency & Standard', qualifyingOnly: true, description: '5 km run in 24 mins (Fire) / 800m + Long Jump + High Jump (Driver).' },
      { name: 'Written Examination', mode: 'OMR / CBT Objective', qualifyingOnly: false, description: '100 Qs / 100 Marks in 120 minutes.' },
      { name: 'Medical & DV', mode: 'Medical Board', qualifyingOnly: true, description: 'CAPF medical standards.' }
    ],
    examPattern: [
      {
        stageName: 'Written Exam (100 Qs · 100 Marks · 120 Mins)',
        sections: [
          { subject: 'General Intelligence and Reasoning', questions: 25, marks: 25 },
          { subject: 'General Knowledge and Awareness', questions: 25, marks: 25 },
          { subject: 'Elementary Mathematics', questions: 25, marks: 25 },
          { subject: 'English / Hindi', questions: 25, marks: 25 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '120 Minutes',
    negativeMarking: 'No negative marking in CISF Constable direct CBT.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Part A (25 Qs)' }),
      fromBlueprint('general-awareness', { stageTag: 'Part B (25 Qs)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Part C (25 Qs)', excludeChapterIds: ['qa-algebra', 'qa-geometry', 'qa-trigonometry', 'qa-height-distance', 'qa-statistics', 'qa-probability'] }),
      fromBlueprint('english-language', { stageTag: 'Part D (25 Qs)' })
    ],
    practicalTechnicalTopics: ['Industrial & Aviation Fire Safety Basics (for Fire Wing) & Driving/Traffic Rules (for Constable Driver)'],
    languages: ['English', 'Hindi'],
    physicalStandards: { maleHeight: '170 cm', maleChest: '80–85 cm', running: '5 km in 24 minutes (Constable Fire)' },
    skillTestDetails: 'Driving test (Light & Heavy Vehicle) for Constable Driver; Trade Test for Tradesmen.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CISF Constable Fire/Driver/Tradesmen Recruitment',
    officialWebsiteUrl: 'https://cisfrectt.cisf.gov.in',
    officialNotificationUrl: 'https://cisfrectt.cisf.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'itbp-constable',
    examCode: 'ITBP-CT',
    name: 'ITBP Constable (Tradesman, Animal Transport, Telecom & Driver)',
    shortName: 'ITBP Constable',
    categoryId: 'police',
    authority: 'Indo-Tibetan Border Police Force (recruitment.itbpolice.nic.in)',
    introduction:
      'Recruits Constables for specialized high-altitude border duties across Tradesmen, Pioneer, Telecommunication, Animal Transport, and Motor Transport cadres.',
    qualification: 'Class 10th Pass (plus ITI/diploma or Driving License depending on specific post).',
    ageLimit: '18 to 23/25 years (21–27 for Driver).',
    selectionProcess: 'Phase-I PET & PST → Phase-II Written Examination → Phase-III Verification of Documents/Skill Test & Medical.',
    stages: [
      { name: 'Phase-I PET & PST', mode: 'Physical Race & Measurement', qualifyingOnly: true, description: '1.6 km in 7.30 mins (Male) / 800m in 4.45 mins (Female), Long Jump (11 ft) & High Jump (3.5 ft).' },
      { name: 'Phase-II Written Exam', mode: 'CBT / OMR', qualifyingOnly: false, description: '100 Qs (or 50 Qs for Tradesman) objective test.' }
    ],
    examPattern: [
      {
        stageName: 'Written Exam (100 Qs · 100 Marks · 120 Mins — Telecom/Driver/AT)',
        sections: [
          { subject: 'General Awareness / General Knowledge', questions: 25, marks: 25 },
          { subject: 'Knowledge of Elementary Mathematics', questions: 25, marks: 25 },
          { subject: 'Analytical Aptitude & Reasoning', questions: 25, marks: 25 },
          { subject: 'English / Hindi', questions: 25, marks: 25 }
        ]
      }
    ],
    totalQuestions: '100 Questions (50 for selected Trades)',
    totalMarks: '100 Marks',
    duration: '120 Minutes',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Written Test', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Written Test', excludeChapterIds: ['qa-algebra', 'qa-geometry', 'qa-trigonometry', 'qa-height-distance', 'qa-statistics', 'qa-probability'] }),
      fromBlueprint('reasoning', { stageTag: 'Written Test' }),
      fromBlueprint('english-language', { stageTag: 'Written Test' })
    ],
    practicalTechnicalTopics: ['Basic Physics/Telecommunication (for Constable Telecom) & Trade Skill Test'],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      maleHeight: '170 cm (165 cm for Dogra/Garhwali/Gorkha/ST relaxations)',
      femaleHeight: '157 cm',
      maleChest: '80–85 cm',
      running: '1.6 km in 7m 30s (Male) / 800m in 4m 45s (Female), Long Jump 11 ft, High Jump 3.5 ft.'
    },
    skillTestDetails: 'Trade/Driving Skill Test applicable for Tradesmen & Driver posts.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'ITBP Direct Constable Recruitment 2025',
    officialWebsiteUrl: 'https://recruitment.itbpolice.nic.in',
    officialNotificationUrl: 'https://recruitment.itbpolice.nic.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'ssb-constable',
    examCode: 'SSB-CT',
    name: 'SSB Constable (Tradesman, Driver & Veterinary)',
    shortName: 'SSB Constable',
    categoryId: 'police',
    authority: 'Sashastra Seema Bal (ssbrectt.gov.in)',
    introduction:
      'Recruits Constables for Sashastra Seema Bal deployed along Indo-Nepal and Indo-Bhutan borders across Tradesman, Driver, Lab Assistant, and Veterinary cadres.',
    qualification: 'Class 10th Pass (with Heavy Vehicle Driving License for Driver; Science/Trade experience where specified).',
    ageLimit: '18 to 23/25 years (21–27 for Driver).',
    selectionProcess: 'PET & PST → Common Entrance Test (CET) → Documentation & Skill/Trade Test → Detailed Medical Exam.',
    stages: [
      { name: 'PET & PST', mode: 'Physical Test', qualifyingOnly: true, description: '4.8 km run in 24 mins (Male) / 2.4 km in 18 mins (Female).' },
      { name: 'Common Entrance Test (CET)', mode: 'Computer Based Test', qualifyingOnly: false, description: '100 Objective Qs / 100 Marks in 120 minutes.' },
      { name: 'Skill / Trade Test', mode: 'Practical Verification', qualifyingOnly: true, description: '50 Marks practical test (60% qualifying).' }
    ],
    examPattern: [
      {
        stageName: 'CET Written (100 Qs · 100 Marks · 120 Mins)',
        sections: [
          { subject: 'General Knowledge', questions: 25, marks: 25 },
          { subject: 'Mathematics', questions: 25, marks: 25 },
          { subject: 'Reasoning', questions: 25, marks: 25 },
          { subject: 'General English / General Hindi', questions: 25, marks: 25 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '2 Hours',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'CET GK (25 Qs)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'CET Maths (25 Qs)', excludeChapterIds: ['qa-algebra', 'qa-geometry', 'qa-trigonometry', 'qa-height-distance', 'qa-statistics', 'qa-probability'] }),
      fromBlueprint('reasoning', { stageTag: 'CET Reasoning (25 Qs)' }),
      fromBlueprint('english-language', { stageTag: 'CET English Option (25 Qs)' })
    ],
    practicalTechnicalTopics: ['50-Mark Practical Trade/Driving Skill Assessment (Minimum 60% marks required to qualify)'],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      maleHeight: '170 cm (167.5 cm for specified trades)',
      femaleHeight: '157 cm',
      maleChest: '80–85 cm',
      running: '4.8 km in 24 minutes (Male) / 2.4 km in 18 minutes (Female).'
    },
    skillTestDetails: 'Practical Trade Test of 50 Marks (qualifying).',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSB Constable Tradesman Recruitment',
    officialWebsiteUrl: 'https://ssbrectt.gov.in',
    officialNotificationUrl: 'https://ssbrectt.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'crpf-si',
    examCode: 'CRPF-SI',
    name: 'CRPF Sub-Inspector (GD via SSC CPO & Technical/Radio Operator)',
    shortName: 'CRPF SI',
    categoryId: 'police',
    authority: 'SSC (for SI GD) / CRPF Directorate (for SI Tech/RO/Cipher)',
    introduction:
      'Recruitment for Sub-Inspector (GD) conducted through SSC CPO, and direct recruitment for Sub-Inspector (Radio Operator, Crypto, Technical, Civil) by CRPF.',
    qualification: 'SI GD: Any Bachelor’s Degree | SI RO/Crypto/Tech: Bachelor’s Degree with Physics, Chemistry & Mathematics OR B.E./B.Tech (ECE/CS/IT).',
    ageLimit: '20 to 25 years (SI GD via SSC CPO) | Below 30 years (SI Technical/RO).',
    selectionProcess: 'Paper-I Written Exam → PST/PET → Paper-II (English for CPO / Technical Paper for RO/Tech) → Document Verification & Medical.',
    stages: [
      { name: 'Written Paper-I', mode: 'Computer Based Test', qualifyingOnly: false, description: 'SI GD: 200 Qs/200 Marks (SSC CPO) | SI Tech/RO: 100 Qs/200 Marks (Part A Non-Tech + Part B Tech).' },
      { name: 'PST & PET', mode: 'Physical Test', qualifyingOnly: true, description: '1.6 km in 6.5 mins (M) / 800m in 4 mins (F), 100m sprint, Long Jump, High Jump & Shot Put.' },
      { name: 'Paper-II', mode: 'CBT', qualifyingOnly: false, description: 'English Comprehension (200 Marks for SI GD) / Technical Specialization (for Signal/RO).' }
    ],
    examPattern: [
      {
        stageName: 'SI (GD) via SSC CPO Paper-I (200 Qs · 200 Marks) + Paper-II (200 Marks)',
        sections: [
          { subject: 'Paper-I: Reasoning (50), GK (50), Quant (50), English (50)', questions: 200, marks: 200 },
          { subject: 'Paper-II: English Language & Comprehension', questions: 200, marks: 200 }
        ]
      }
    ],
    totalQuestions: 'SI GD: 400 Qs (Paper I+II) | SI Tech: 100 Qs',
    totalMarks: 'SI GD: 400 Marks | SI Tech: 200 Marks',
    duration: '2 Hours per Paper',
    negativeMarking: '0.25 marks (SSC CPO) | 0.50 marks for 2-mark Qs (CRPF SI Tech).',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Paper-I' }),
      fromBlueprint('general-awareness', { stageTag: 'Paper-I', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Paper-I' }),
      fromBlueprint('english-language', { stageTag: 'Paper-I & Paper-II' }),
      fromBlueprint('eng-electronics', { stageTag: 'SI Radio Operator / Technical Option', topicType: 'recommended' })
    ],
    practicalTechnicalTopics: ['Signal & Radio Engineering (for SI RO/Crypto/Tech): Analog/Digital Communication, Microprocessors, Networking & Cryptography'],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      maleHeight: '170 cm (ST: 162.5 cm)',
      femaleHeight: '157 cm (ST: 154 cm)',
      maleChest: '80–85 cm',
      running: '100m in 16s & 1.6 km in 6.5 mins (Male); 100m in 18s & 800m in 4 mins (Female); Long Jump 3.65m (M)/2.7m (F).'
    },
    skillTestDetails: 'No typing test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC CPO 2026 & CRPF Signal Staff Ref.',
    officialWebsiteUrl: 'https://rect.crpf.gov.in',
    officialNotificationUrl: 'https://ssc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'bsf-si',
    examCode: 'BSF-SI',
    name: 'BSF Sub-Inspector (GD via SSC CPO & Works/Electrical/Water Wing)',
    shortName: 'BSF SI',
    categoryId: 'police',
    authority: 'SSC (for SI GD) / BSF Directorate (for SI Works/Electrical/Master)',
    introduction:
      'Recruits Sub-Inspectors for BSF General Duty through SSC CPO and Technical Sub-Inspectors (Works Civil, Junior Engineer Electrical, Master/Engine Driver) directly by BSF.',
    qualification: 'SI GD: Bachelor’s Degree | SI Works/JE Electrical: 3-year Diploma in Civil / Electrical Engineering.',
    ageLimit: '20 to 25 years (SI GD) | Up to 30 years (SI Technical/Works).',
    selectionProcess: 'Paper-I Written Exam → PST/PET & Practical Trade Test (Tech) → Paper-II (English/Descriptive Technical) → Medical.',
    stages: [
      { name: 'Paper-I Written', mode: 'CBT / OMR', qualifyingOnly: false, description: 'SI GD: 200 Marks (SSC CPO) | SI Works/Elec: 100 Qs (GI+GA+Tech Subject).' },
      { name: 'PST & PET', mode: 'Physical Test', qualifyingOnly: true, description: 'Height, Chest, 1.6 km Run, Long Jump & High Jump.' },
      { name: 'Paper-II', mode: 'CBT / Descriptive', qualifyingOnly: false, description: '200 Marks English (SI GD) / Engineering Drawing & Design (SI Works).' }
    ],
    examPattern: [
      {
        stageName: 'SI GD (SSC CPO Pattern) & SI Works/Electrical Pattern',
        sections: [
          { subject: 'SI GD Paper-I: Reasoning (50), GK (50), Quant (50), English (50)', questions: 200, marks: 200 },
          { subject: 'SI Works/Elec Paper-I: Reasoning (25), GA (25), Civil/Electrical Engg (50)', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: 'SI GD: 400 | SI Works: 100 (+Paper II)',
    totalMarks: 'SI GD: 400 | SI Works: 200',
    duration: '2 Hours per Paper',
    negativeMarking: '0.25 marks (SSC CPO); check specific BSF direct technical notice.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Paper-I' }),
      fromBlueprint('general-awareness', { stageTag: 'Paper-I', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Paper-I (SI GD)' }),
      fromBlueprint('english-language', { stageTag: 'Paper-I & Paper-II (SI GD)' }),
      fromBlueprint('eng-civil', { stageTag: 'SI (Works) Technical Option' })
    ],
    practicalTechnicalTopics: ['Border Infrastructure, Fencing, Road/Building Construction (SI Works) & Boat Handling/Marine Engines (Water Wing)'],
    languages: ['English', 'Hindi'],
    physicalStandards: {
      maleHeight: '170 cm (GD) / 165 cm (Tech)',
      femaleHeight: '157 cm',
      maleChest: '80–85 cm',
      running: '1.6 km in 6m 30s, 100m in 16s, Long Jump 3.65m, High Jump 1.2m (SI GD Male).'
    },
    skillTestDetails: 'No typing test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'SSC CPO 2026 & BSF Engg Recruitment',
    officialWebsiteUrl: 'https://rectt.bsf.gov.in',
    officialNotificationUrl: 'https://rectt.bsf.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'cisf-asi',
    examCode: 'CISF-ASI',
    name: 'CISF ASI (Assistant Sub-Inspector — Stenographer & Executive)',
    shortName: 'CISF ASI',
    categoryId: 'police',
    authority: 'Central Industrial Security Force (cisfrectt.cisf.gov.in) / SSC',
    introduction:
      'Recruits Assistant Sub-Inspector (Stenographer) directly by CISF for ministerial duties and ASI (Executive) through CAPF/departmental channels.',
    qualification: 'ASI Stenographer: 10+2 (Intermediate) from a recognized Board + Dictation & Transcription Skill Test.',
    ageLimit: '18 to 25 years (with SC/ST/OBC age relaxations).',
    selectionProcess: 'PST & Documentation → Computer Based Written Exam (100 Marks) → Stenography Skill Test → Medical Exam.',
    stages: [
      { name: 'PST & Documentation', mode: 'Physical Standard & Certificates', qualifyingOnly: true, description: 'Height & Chest verification.' },
      { name: 'Written Exam (CBT/OMR)', mode: 'Objective Test', qualifyingOnly: false, description: '100 Objective Qs / 100 Marks in 120 minutes.' },
      { name: 'Skill Test (Stenography)', mode: 'Dictation + Typing Transcription', qualifyingOnly: true, description: '10 mins dictation @ 80 WPM; transcription 50 mins English / 65 mins Hindi on computer.' }
    ],
    examPattern: [
      {
        stageName: 'CISF ASI Steno CBT (100 Qs · 100 Marks · 120 Mins)',
        sections: [
          { subject: 'General Intelligence', questions: 25, marks: 25 },
          { subject: 'General Knowledge', questions: 25, marks: 25 },
          { subject: 'Arithmetic', questions: 25, marks: 25 },
          { subject: 'General English or Hindi', questions: 25, marks: 25 }
        ]
      }
    ],
    totalQuestions: '100 Questions',
    totalMarks: '100 Marks',
    duration: '120 Minutes',
    negativeMarking: 'No negative marking in CISF ASI direct test.',
    subjects: [
      fromBlueprint('reasoning', { stageTag: 'Part A (25 Qs)' }),
      fromBlueprint('general-awareness', { stageTag: 'Part B (25 Qs)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Part C Arithmetic (25 Qs)', excludeChapterIds: ['qa-algebra', 'qa-geometry', 'qa-trigonometry', 'qa-height-distance', 'qa-statistics', 'qa-probability'] }),
      fromBlueprint('english-language', { stageTag: 'Part D English Option (25 Qs)' })
    ],
    practicalTechnicalTopics: ['Shorthand Dictation (80 WPM for 10 mins) and Computer Transcription (50 mins English / 65 mins Hindi)'],
    languages: ['English', 'Hindi'],
    physicalStandards: { maleHeight: '165 cm (ST: 162.5 cm)', femaleHeight: '155 cm (ST: 150 cm)', maleChest: '77–82 cm' },
    skillTestDetails: 'Stenography Skill Test (80 WPM dictation + transcription) is mandatory & qualifying.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'CISF ASI (Steno) & HC (Min) Recruitment',
    officialWebsiteUrl: 'https://cisfrectt.cisf.gov.in',
    officialNotificationUrl: 'https://cisfrectt.cisf.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'state-police-constable',
    examCode: 'STATE-PC',
    name: 'State Police Constable (Civil, AR, Armed Reserve & Battalion)',
    shortName: 'State Police Constable',
    categoryId: 'police',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    authority: 'State Level Police Recruitment Boards (SLPRBs / PRB)',
    introduction:
      'Unified blueprint for State Police Constable recruitments across India (UP Police, Bihar, MP, Rajasthan, Maharashtra, Karnataka, Tamil Nadu, AP & Telangana) covering written exam, PST, and PET.',
    qualification: '10+2 (Intermediate) or Class 10th depending on State Police Service Rules.',
    ageLimit: '18 to 22/25/28 years (varies by State and Category).',
    selectionProcess: 'Written Examination (CBT/OMR) → Physical Measurement Test (PMT/PST) → Physical Efficiency Test (PET) → Document Verification & Medical.',
    stages: [
      { name: 'Written Examination', mode: 'OMR / CBT Objective', qualifyingOnly: false, description: 'General Knowledge, Reasoning, Numerical Ability, State GK & General Hindi/English/Regional Language.' },
      { name: 'PST / PMT & PET', mode: 'Physical Ground Test', qualifyingOnly: false, description: 'Height/Chest measurement followed by Running (1600m/4.8km), Long Jump, High Jump/Shot Put.' }
    ],
    examPattern: [
      {
        stageName: 'Standard State Police Constable Pattern (100–150 Qs · 2–3 Hrs)',
        sections: [
          { subject: 'General Knowledge, General Science & Current Affairs', questions: 40, marks: 40 },
          { subject: 'State History, Geography, Culture & Police Act Basics', questions: 20, marks: 20 },
          { subject: 'Numerical & Mental Ability (Arithmetic)', questions: 20, marks: 20 },
          { subject: 'Reasoning & Language (English / Hindi / State Language)', questions: 20, marks: 20 }
        ]
      }
    ],
    totalQuestions: '100 to 150 Questions (Varies by State)',
    totalMarks: '100 to 300 Marks (Varies by State)',
    duration: '120 to 180 Minutes',
    negativeMarking: 'Varies by State (Nil in AP/Bihar/MP; 0.25–0.50 in UP/Rajasthan/Delhi).',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'GK & State Awareness' }),
      fromBlueprint('general-science', { stageTag: 'Everyday Science' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Arithmetic & Numerical Ability', excludeChapterIds: ['qa-trigonometry', 'qa-height-distance', 'qa-statistics'] }),
      fromBlueprint('reasoning', { stageTag: 'Mental Ability & Reasoning' }),
      fromBlueprint('english-language', { stageTag: 'Language Section' })
    ],
    practicalTechnicalTopics: ['Indian Penal Code / Bharatiya Nyaya Sanhita (BNS) Basics, Traffic Signals, Mental Aptitude & Law-Order Scenario Questions'],
    languages: ['English', 'Hindi', 'Respective State Official Language'],
    physicalStandards: {
      maleHeight: '167.6–168 cm (General/OBC), 160–162 cm (ST)',
      femaleHeight: '152–155 cm',
      maleChest: '81–86.3 cm (approx. 5 cm expansion)',
      running: '1600m / 4.8 km run (varies by State), Long Jump & High Jump/Shot Put.'
    },
    skillTestDetails: 'Driving/Computer test only for Driver/Operator cadres.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'All-State Police Constable Reference Guide 2026',
    officialWebsiteUrl: 'https://police.gov.in',
    officialNotificationUrl: 'https://www.mha.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'state-police-si',
    examCode: 'STATE-SI',
    name: 'State Police Sub-Inspector (SI Civil / Armed / Platoon Commander)',
    shortName: 'State Police SI',
    categoryId: 'police',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    authority: 'State Police Recruitment Boards / State PSCs',
    introduction:
      'Gazetted/Non-Gazetted Executive Sub-Inspector (SI) blueprint covering General Studies, Criminal Law (BNS, BNSS, BSA), Reasoning, Arithmetic, and Physical Efficiency across Indian States.',
    qualification: 'Bachelor’s Degree in any discipline from a recognized University.',
    ageLimit: '21 to 28 years (with State-specific category relaxations).',
    selectionProcess: 'Prelims (where applicable) → Physical Measurement & Physical Efficiency Test (PMT/PET) → Mains Written Exam → Document Verification & Medical.',
    stages: [
      { name: 'Preliminary / Screening Test', mode: 'OMR / CBT', qualifyingOnly: true, description: 'Objective GS, Reasoning & Arithmetic screening (in states like AP, Telangana, Bihar, Rajasthan).' },
      { name: 'PMT & PET', mode: 'Physical Ground Test', qualifyingOnly: false, description: 'Height/Chest check + 1600m/800m/100m Run, Long Jump, High Jump, Shot Put.' },
      { name: 'Mains Written Exam', mode: 'OMR / CBT Objective + Language', qualifyingOnly: false, description: 'General Studies + Constitution/Law + Arithmetic/Reasoning + Qualifying Language Paper.' }
    ],
    examPattern: [
      {
        stageName: 'Standard State Police SI Mains Pattern (2 Papers · 200 Marks each)',
        sections: [
          { subject: 'Paper I: Arithmetic & Mental Ability + Language (English / State Language)', questions: 200, marks: 200 },
          { subject: 'Paper II: General Studies (History, Polity, Geo, Economy, Science, BNS/Law & State GK)', questions: 200, marks: 200 }
        ]
      }
    ],
    totalQuestions: '200 to 400 Questions (State-wise)',
    totalMarks: '400 Marks (Typical Mains)',
    duration: '2 to 3 Hours per Paper',
    negativeMarking: 'Varies by State (Nil in UP/MP; 0.20–0.33 in Bihar/Rajasthan/AP-Mains).',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'General Studies & Law Paper' }),
      fromBlueprint('general-science', { stageTag: 'General Science' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Arithmetic & Test of Reasoning' }),
      fromBlueprint('reasoning', { stageTag: 'Logical & Analytical Reasoning' }),
      fromBlueprint('english-language', { stageTag: 'English / Language Paper' })
    ],
    practicalTechnicalTopics: ['New Criminal Laws: Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), Bharatiya Sakshya Adhiniyam (BSA 2023) & IT Act / POCSO Act'],
    languages: ['English', 'Hindi', 'State Official Language'],
    physicalStandards: {
      maleHeight: '167.6 cm (General), 160 cm (ST)',
      femaleHeight: '152.5 cm',
      maleChest: '86.3 cm with 5 cm expansion',
      running: '1600m run + 100m sprint + Long Jump + Shot Put (varies by State).'
    },
    skillTestDetails: 'No typing test.',
    interviewDetails: 'No Interview for SI in most States (check State PSC notices for DSP/Gazetted roles).',
    officialNotificationRef: 'State Police Sub-Inspector Reference Guide 2026',
    officialWebsiteUrl: 'https://www.mha.gov.in',
    officialNotificationUrl: 'https://www.mha.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'ap-police-constable',
    examCode: 'APSLPRB-PC',
    name: 'AP Police Constable (SCT PC Civil & APSP)',
    shortName: 'AP Police Constable',
    categoryId: 'police',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Andhra Pradesh',
    popular: true,
    authority: 'Andhra Pradesh State Level Police Recruitment Board (slprb.ap.gov.in)',
    introduction:
      'State-level recruitment by APSLPRB for Stipendiary Cadet Trainee (SCT) Police Constable (Civil — Men & Women) and APSP (Men).',
    qualification: 'Intermediate (10+2) or equivalent examination (SSC/10th for SC/ST candidates who studied up to Intermediate).',
    ageLimit: '18 to 24/26 years (with AP Govt category relaxations).',
    selectionProcess: 'Preliminary Written Test (PWT — 200 Marks) → PMT & PET (Physical Measurement & Efficiency Test) → Final Written Examination (FWE — 200 Marks).',
    stages: [
      { name: 'Preliminary Written Test (PWT)', mode: 'Offline OMR Objective', qualifyingOnly: true, description: '200 Qs / 200 Marks in 3 hours; 40% OC, 35% BC, 30% SC/ST/Ex-SM qualifying marks.' },
      { name: 'PMT & PET', mode: 'Physical Ground Test', qualifyingOnly: false, description: '1600m Run (mandatory), plus 100m Run & Long Jump (any 1 of 2 for Civil; 1600m + 100m + Long Jump marks counted for APSP merit).' },
      { name: 'Final Written Examination (FWE)', mode: 'Offline OMR Objective', qualifyingOnly: false, description: '200 Qs / 200 Marks in 3 hours. Civil merit = 100% FWE; APSP merit = FWE + PET.' }
    ],
    examPattern: [
      {
        stageName: 'Preliminary & Final Written Exam (200 Qs · 200 Marks · 3 Hrs)',
        sections: [
          { subject: 'English', questions: 30, marks: 30 },
          { subject: 'Arithmetic (Quantitative Aptitude)', questions: 40, marks: 40 },
          { subject: 'Test of Reasoning / Mental Ability', questions: 35, marks: 35 },
          { subject: 'General Science, History, Polity, Geography, Economy & Current Affairs (incl. AP GK)', questions: 95, marks: 95 }
        ]
      }
    ],
    totalQuestions: 'PWT: 200 Qs | FWE: 200 Qs',
    totalMarks: '200 Marks (PWT & FWE each)',
    duration: '3 Hours per Paper',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'PWT & FWE' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'PWT & FWE — Arithmetic' }),
      fromBlueprint('reasoning', { stageTag: 'PWT & FWE — Mental Ability' }),
      fromBlueprint('general-science', { stageTag: 'PWT & FWE — General Science' }),
      fromBlueprint('general-awareness', { stageTag: 'PWT & FWE — GS & AP GK', excludeChapterIds: ['ga-telangana-gk'] })
    ],
    practicalTechnicalTopics: ['AP Reorganization Act 2014, AP Geography/History/Culture & National/AP Current Events'],
    languages: ['English', 'Telugu', 'Urdu'],
    physicalStandards: {
      maleHeight: '167.6 cm (160 cm for ST Agency areas)',
      femaleHeight: '152.5 cm (150 cm for ST Agency areas)',
      maleChest: '86.3 cm with minimum 5 cm expansion',
      running: '1600m Run (8 mins Male, 10m 30s Female) + 100m Run (15s M / 18s F) + Long Jump (3.80m M / 2.75m F).'
    },
    skillTestDetails: 'No skill test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'APSLPRB SCT PC (Civil & APSP) Official Pattern',
    officialWebsiteUrl: 'https://slprb.ap.gov.in',
    officialNotificationUrl: 'https://slprb.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'ap-police-si',
    examCode: 'APSLPRB-SI',
    name: 'AP Police SI (SCT Sub-Inspector of Police — Civil & Reserve)',
    shortName: 'AP Police SI',
    categoryId: 'police',
    secondaryCategoryIds: ['state-govt'],
    scope: 'State',
    state: 'Andhra Pradesh',
    popular: true,
    authority: 'Andhra Pradesh State Level Police Recruitment Board (slprb.ap.gov.in)',
    introduction:
      'State-level graduate recruitment by APSLPRB for Stipendiary Cadet Trainee Sub-Inspector of Police (Civil — Men & Women) and Reserve Sub-Inspector (APSP — Men).',
    qualification: 'Bachelor’s Degree awarded by any University in India (Intermediate for SC/ST candidates under specific relaxations).',
    ageLimit: '21 to 27 years (with AP Govt category relaxations).',
    selectionProcess: 'Preliminary Written Test (2 Papers: 200 Marks) → PMT & PET → Final Written Examination (4 Papers: 400 Merit + 200 Qualifying).',
    stages: [
      { name: 'Preliminary Written Test (PWT)', mode: 'Offline OMR (2 Papers)', qualifyingOnly: true, description: 'Paper I: Arithmetic & Reasoning (100 Marks) + Paper II: General Studies (100 Marks) — 3 hrs each.' },
      { name: 'PMT & PET', mode: 'Physical Efficiency Test', qualifyingOnly: false, description: '1600m Run (mandatory) + 100m Run + Long Jump (marks counted for RSI APSP).' },
      { name: 'Final Written Examination (FWE)', mode: 'Offline OMR + Descriptive (4 Papers)', qualifyingOnly: false, description: 'Paper I English (100 Qual.), Paper II Telugu/Urdu (100 Qual.), Paper III Arithmetic & Reasoning (200 Merit), Paper IV General Studies (200 Merit).' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (200 Marks) & Mains Merit (400 Marks + 200 Language Qualifying)',
        sections: [
          { subject: 'Prelims Paper I & Mains Paper III: Arithmetic & Test of Reasoning / Mental Ability', questions: '100 (P) / 200 (M)', marks: '100 (P) / 200 (M)' },
          { subject: 'Prelims Paper II & Mains Paper IV: General Studies (GS, Polity, AP History/Geo, Current Affairs)', questions: '100 (P) / 200 (M)', marks: '100 (P) / 200 (M)' },
          { subject: 'Mains Paper I (English) & Paper II (Telugu/Urdu) — Qualifying (40% OC / 35% BC / 30% SC-ST)', questions: 'Descriptive + Obj', marks: '100 + 100 (Qualifying)' }
        ]
      }
    ],
    totalQuestions: 'Prelims: 200 Qs | Mains Merit: 400 Qs + 2 Language Papers',
    totalMarks: 'Prelims: 200 | Final Merit: 400 (Civil) / 400 + PET (APSP)',
    duration: '3 Hours per Paper',
    negativeMarking: 'No negative marking.',
    subjects: [
      fromBlueprint('quantitative-aptitude', { stageTag: 'Prelims Paper I & Mains Paper III' }),
      fromBlueprint('reasoning', { stageTag: 'Prelims Paper I & Mains Paper III' }),
      fromBlueprint('general-awareness', { stageTag: 'Prelims Paper II & Mains Paper IV', excludeChapterIds: ['ga-telangana-gk'] }),
      fromBlueprint('general-science', { stageTag: 'General Studies Paper' }),
      fromBlueprint('english-language', { stageTag: 'Mains Paper I (Qualifying — Descriptive & Grammar)' })
    ],
    practicalTechnicalTopics: [
      'Mains Paper I & II Descriptive: Essay, Precis Writing, Letter/Report Writing, Reading Comprehension & Translation (English ↔ Telugu/Urdu)'
    ],
    languages: ['English', 'Telugu', 'Urdu'],
    physicalStandards: {
      maleHeight: '167.6 cm (160 cm for ST Agency areas)',
      femaleHeight: '152.5 cm (150 cm for ST Agency areas)',
      maleChest: '86.3 cm with 5 cm expansion',
      running: '1600m Run (8 mins M / 10.5 mins F), 100m Run (15s M / 18s F), Long Jump (3.80m M / 2.75m F).'
    },
    skillTestDetails: 'No typing test.',
    interviewDetails: 'No Interview.',
    officialNotificationRef: 'APSLPRB SCT SI (Civil & APSP) Official Pattern',
    officialWebsiteUrl: 'https://slprb.ap.gov.in',
    officialNotificationUrl: 'https://slprb.ap.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  })
];
