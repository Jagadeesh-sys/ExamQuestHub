import { buildExamSyllabus, fromBlueprint } from './examBuilder.js';

export const UPSC_EXAMS = [
  buildExamSyllabus({
    id: 'upsc-cse',
    examCode: 'UPSC-CSE',
    name: 'UPSC Civil Services Examination (IAS, IPS, IFS, IRS)',
    shortName: 'UPSC Civil Services (IAS)',
    categoryId: 'upsc',
    popular: true,
    authority: 'Union Public Service Commission (upsc.gov.in)',
    introduction:
      'India’s apex competitive examination for recruitment to All India Services (IAS, IPS, IFoS) and Central Services Group A & B (IFS, IRS, IA&AS, IRMS).',
    qualification: 'Graduate Degree in any discipline from a University incorporated by an Act of Parliament/State Legislature or deemed University.',
    ageLimit: '21 to 32 years (General: 6 attempts; OBC: 35 yrs / 9 attempts; SC/ST: 37 yrs / unlimited attempts).',
    selectionProcess: 'Prelims (GS + CSAT Qualifying) → Mains Written (9 Descriptive Papers: 1750 Merit Marks) → Personality Test / Interview (275 Marks) → Final Merit (2025 Marks).',
    stages: [
      { name: 'Preliminary Exam (Objective)', mode: 'Offline OMR', qualifyingOnly: true, description: 'GS Paper-I (100 Qs/200 Marks — Cutoff) + CSAT Paper-II (80 Qs/200 Marks — 33% Qualifying).' },
      { name: 'Main Examination (Written)', mode: 'Descriptive / Pen & Paper', qualifyingOnly: false, description: '2 Qualifying Language Papers (300 each) + Essay (250) + GS I, II, III, IV (250 each) + Optional Paper I & II (250 each) = 1750 Marks.' },
      { name: 'Personality Test (Interview)', mode: 'UPSC Board Interview', qualifyingOnly: false, description: '275 Marks; combined with 1750 Mains marks for All-India Rank out of 2025.' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (180 Qs · 400 Marks · 2 Hrs per Paper)',
        sections: [
          { subject: 'Paper-I: General Studies (Current Events, History, Geography, Polity, Economy, Ecology, General Science)', questions: 100, marks: 200 },
          { subject: 'Paper-II: CSAT (Comprehension, Reasoning, Numeracy, DI — 33% Qualifying = 66 Marks)', questions: 80, marks: 200 }
        ]
      },
      {
        stageName: 'Mains Written (1750 Merit Marks + 600 Qualifying Languages · 3 Hrs per Paper)',
        sections: [
          { subject: 'Paper A (Indian Language — 8th Schedule) & Paper B (English) — 25% Qualifying Each', questions: 'Descriptive', marks: '300 + 300 (Qualifying)' },
          { subject: 'Paper-I: Essay | Papers II–V: GS I, GS II, GS III, GS IV Ethics (250 each)', questions: 'Descriptive', marks: 1250 },
          { subject: 'Papers VI & VII: Optional Subject Paper-I & Paper-II (250 each)', questions: 'Descriptive', marks: 500 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 180 MCQs | Mains: 9 Descriptive Papers',
    totalMarks: 'Prelims: 400 | Final Merit: 2025 (1750 Mains + 275 Interview)',
    duration: 'Prelims: 2 Hours per Paper | Mains: 3 Hours per Paper',
    negativeMarking: 'Prelims Paper-I & II: 1/3rd mark deducted per wrong answer (0.66 for GS, 0.83 for CSAT).',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Prelims GS Paper-I (200 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('upsc-gs-mains', { stageTag: 'CSAT + Mains Essay & GS Papers I–IV (1250 Marks)' })
    ],
    practicalTechnicalTopics: ['Optional Subject Selection (48 UPSC Subjects), Mains Answer Writing (150/250-word precision) & DAF-based Interview'],
    languages: ['English', 'Hindi', 'Mains papers can be written in English or any 8th Schedule Language'],
    physicalStandards: { medicalStandard: 'IPS, IRPF & DANIPS have physical height/chest/vision requirements.' },
    skillTestDetails: 'No skill test.',
    interviewDetails: '275 Marks Personality Test at Dholpur House, UPSC New Delhi (no minimum qualifying marks in Interview).',
    officialNotificationRef: 'UPSC CSE 2026 Examination Notification',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'upsc-cds',
    examCode: 'UPSC-CDS',
    name: 'UPSC CDS (Combined Defence Services — IMA, INA, AFA, OTA)',
    shortName: 'UPSC CDS',
    categoryId: 'upsc',
    secondaryCategoryIds: ['defence'],
    popular: true,
    authority: 'Union Public Service Commission (upsc.gov.in)',
    introduction:
      'Twice-yearly UPSC examination for Officer entry into Indian Military Academy (IMA), Indian Naval Academy (INA), Air Force Academy (AFA), and Officers’ Training Academy (OTA).',
    qualification: 'IMA/OTA: Degree from recognized University | INA: Engineering Degree | AFA: Degree with Physics & Math at 10+2 or B.E./B.Tech.',
    ageLimit: 'IMA: 19–24 yrs | INA: 19–24 yrs | AFA: 20–24 yrs | OTA: 19–25 yrs (Unmarried).',
    selectionProcess: 'UPSC Written Examination → SSB Interview (5-Day Psychological, GTO & Personal Interview) → Service Medical Examination.',
    stages: [
      { name: 'Written Examination', mode: 'Offline OMR Objective', qualifyingOnly: false, description: 'IMA/INA/AFA: 3 Papers (English + GK + Elementary Math = 300 Marks) | OTA: 2 Papers (English + GK = 200 Marks).' },
      { name: 'SSB Interview (Stage I & II)', mode: '5-Day Assessment', qualifyingOnly: false, description: 'OIR/PPDT Screening followed by Psychology Tests, GTO Ground Tasks & Board Conference (300/200 Marks).' }
    ],
    examPattern: [
      {
        stageName: 'IMA / INA / AFA (300 Marks) & OTA (200 Marks) · 2 Hrs per Paper',
        sections: [
          { subject: 'English (120 Qs)', questions: 120, marks: 100 },
          { subject: 'General Knowledge (120 Qs)', questions: 120, marks: 100 },
          { subject: 'Elementary Mathematics (100 Qs — Not for OTA)', questions: 100, marks: 100 }
        ]
      }
    ],
    totalQuestions: 'IMA/INA/AFA: 340 Qs | OTA: 240 Qs',
    totalMarks: 'Written: 300 (IMA/INA/AFA) / 200 (OTA) + Equal SSB Marks',
    duration: '2 Hours per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'Paper-I English (100 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'Paper-II General Knowledge (100 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('general-science', { stageTag: 'Part of GK Paper (Physics, Chemistry, Biology)' }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Paper-III Elementary Math (100 Marks — Arithmetic, Algebra, Geometry, Trig, Mensuration, Stats)' })
    ],
    practicalTechnicalTopics: ['5-Day SSB Testing: Officer Intelligence Rating (OIR), PPDT, TAT, WAT, SRT, Self-Description & GTO Obstacle Tasks'],
    languages: ['English', 'Hindi (GK & Math bilingual)'],
    physicalStandards: { medicalStandard: 'Service-specific Defence Medical Standards (Height min 157.5 cm Army / 162.5 cm Air Force, 6/6 visual acuity norms).' },
    skillTestDetails: 'SSB Psychological & Group Testing Officer (GTO) tasks.',
    interviewDetails: 'SSB Interview carries equal weightage (300 Marks IMA/INA/AFA; 200 Marks OTA).',
    officialNotificationRef: 'UPSC CDS I & II 2026 Official Cycle',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'upsc-nda',
    examCode: 'UPSC-NDA',
    name: 'UPSC NDA & NA (National Defence Academy & Naval Academy)',
    shortName: 'UPSC NDA',
    categoryId: 'upsc',
    secondaryCategoryIds: ['defence'],
    popular: true,
    authority: 'Union Public Service Commission (upsc.gov.in)',
    introduction:
      'Recruits 10+2 candidates (both Male & Female) for Army, Navy, and Air Force wings of NDA Khadakwasla and Naval Academy Ezhimala.',
    qualification: 'Army Wing: 12th Class pass of 10+2 pattern | Air Force & Naval Wings: 12th Class pass with Physics, Chemistry & Mathematics.',
    ageLimit: '16.5 to 19.5 years (Unmarried).',
    selectionProcess: 'UPSC Written Exam (900 Marks) → 5-Day SSB Interview (900 Marks) → Medical Examination → All India Merit (1800 Marks).',
    stages: [
      { name: 'Written Examination', mode: 'Offline OMR Objective', qualifyingOnly: false, description: 'Paper-I Mathematics (300 Marks) + Paper-II General Ability Test (600 Marks).' },
      { name: 'SSB Interview', mode: '5-Day Assessment', qualifyingOnly: false, description: '900 Marks across Psychological, GTO & Personal Interview.' }
    ],
    examPattern: [
      {
        stageName: 'Written Exam (270 Qs · 900 Marks · 2.5 Hrs per Paper)',
        sections: [
          { subject: 'Paper-I: Mathematics (Algebra, Matrices, Trigonometry, Analytical Geometry 2D/3D, Calculus, Vectors, Statistics & Probability)', questions: 120, marks: 300 },
          { subject: 'Paper-II GAT Part A: English', questions: 50, marks: 200 },
          { subject: 'Paper-II GAT Part B: General Knowledge (Physics, Chemistry, General Science, History, Geography & Current Events)', questions: 100, marks: 400 }
        ]
      }
    ],
    totalQuestions: '270 Questions (120 Math + 150 GAT)',
    totalMarks: '900 Written + 900 SSB = 1800 Marks',
    duration: '2 Hours 30 Minutes per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer (Math: -0.83 | GAT: -1.33).',
    subjects: [
      {
        id: 'nda-10plus2-math',
        name: 'NDA Mathematics (10+2 Standard — 300 Marks)',
        shortName: '10+2 Mathematics',
        code: 'NDA-MATH',
        stageTag: 'Paper-I (300 Marks)',
        chapters: [
          { id: 'nda-algebra', title: 'Algebra, Sets, Relations, Complex Numbers, Matrices & Determinants', topicType: 'official', subtopics: ['Set Theory, Venn Diagrams, Quadratic Equations, Permutations & Combinations, Binomial Theorem, Logarithms & Matrix Inversion'] },
          { id: 'nda-trig-geom', title: 'Trigonometry & Analytical Geometry (2D & 3D)', topicType: 'official', subtopics: ['Trigonometric Identities, Inverse Circular Functions, Properties of Triangles, Straight Lines, Circles, Conic Sections & 3D Direction Cosines/Planes'] },
          { id: 'nda-calc-vec-prob', title: 'Differential & Integral Calculus, Vector Algebra, Statistics & Probability', topicType: 'official', subtopics: ['Limits, Continuity, Derivatives, Maxima/Minima, Definite/Indefinite Integrals, Differential Equations, Dot/Cross Products, Mean/Variance/Correlation & Bayes’ Theorem'] }
        ]
      },
      fromBlueprint('english-language', { stageTag: 'Paper-II GAT Part A (200 Marks)' }),
      fromBlueprint('general-science', { stageTag: 'Paper-II GAT Part B (Physics & Chemistry Focus)' }),
      fromBlueprint('general-awareness', { stageTag: 'Paper-II GAT Part B (History, Geography & CA)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] })
    ],
    practicalTechnicalTopics: ['CPSS (Computerised Pilot Selection System) for Air Force Flying Cadets + SSB GTO Obstacles'],
    languages: ['English', 'Hindi'],
    physicalStandards: { medicalStandard: 'Strict Armed Forces Academy Medical & Visual Standards (Height min 157 cm / Air Force 162.5 cm).' },
    skillTestDetails: 'SSB Interview (900 Marks) + CPSS for Flying Branch.',
    interviewDetails: '900 Marks SSB Interview.',
    officialNotificationRef: 'UPSC NDA & NA I/II 2026 Examination Cycle',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'upsc-capf-ac',
    examCode: 'UPSC-CAPF-AC',
    name: 'UPSC CAPF (Assistant Commandants — BSF, CRPF, CISF, ITBP, SSB)',
    shortName: 'UPSC CAPF AC',
    categoryId: 'upsc',
    secondaryCategoryIds: ['defence', 'police'],
    popular: true,
    authority: 'Union Public Service Commission (upsc.gov.in)',
    introduction:
      'Recruits Group-A Gazetted Officers (Assistant Commandants) in Central Armed Police Forces: BSF, CRPF, CISF, ITBP, and SSB.',
    qualification: 'Bachelor’s Degree from a recognized University.',
    ageLimit: '20 to 25 years.',
    selectionProcess: 'Written Exam (Paper-I Objective 250 + Paper-II Descriptive 200) → PST/PET & Medical → Interview / Personality Test (150 Marks) → Final Merit (600 Marks).',
    stages: [
      { name: 'Paper-I (Objective)', mode: 'Offline OMR', qualifyingOnly: false, description: '125 Qs / 250 Marks in 2 hours (General Ability & Intelligence).' },
      { name: 'Paper-II (Descriptive)', mode: 'Pen & Paper', qualifyingOnly: false, description: '200 Marks in 3 hours: Essay (80 Marks — English/Hindi) + Comprehension, Précis, Counter-Argument & Grammar (120 Marks — English only).' },
      { name: 'PST / PET & Medical', mode: 'Physical Ground Test', qualifyingOnly: true, description: '100m, 800m, Long Jump & Shot Put.' },
      { name: 'Personality Test / Interview', mode: 'UPSC Board', qualifyingOnly: false, description: '150 Marks; Final Merit out of 600 Marks.' }
    ],
    examPattern: [
      {
        stageName: 'Written Examination (450 Marks · Paper-I: 2 Hrs | Paper-II: 3 Hrs)',
        sections: [
          { subject: 'Paper-I: General Ability & Intelligence (Mental Ability, General Science, Current Events, Indian Polity & Economy, History, Geography)', questions: 125, marks: 250 },
          { subject: 'Paper-II Part A: 4 Essays (English or Hindi)', questions: '4 Essays', marks: 80 },
          { subject: 'Paper-II Part B: Précis, Comprehension, Counter-Arguments, Reports & English Grammar', questions: 'Descriptive', marks: 120 }
        ]
      }
    ],
    totalQuestions: 'Paper-I: 125 MCQs | Paper-II: Descriptive',
    totalMarks: '600 Marks (250 + 200 + 150 Interview)',
    duration: 'Paper-I: 2 Hrs | Paper-II: 3 Hrs',
    negativeMarking: 'Paper-I: 1/3rd mark deducted per wrong answer (0.66).',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Paper-I (250 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('general-science', { stageTag: 'Paper-I General Science' }),
      fromBlueprint('reasoning', { stageTag: 'Paper-I General Mental Ability' }),
      fromBlueprint('english-language', { stageTag: 'Paper-II Comprehension, Précis & Grammar (120 Marks)' })
    ],
    practicalTechnicalTopics: ['Internal Security Essays, Counter-Argument Drafting, Report Writing & Physical Endurance'],
    languages: ['English', 'Hindi (Paper-II Part A Essays in English/Hindi; Part B strictly English)'],
    physicalStandards: {
      heightMale: '165 cm | Chest: 81–86 cm | Weight: Min 50 kg',
      heightFemale: '157 cm | Weight: Min 46 kg',
      petMale: '100m in 16s | 800m in 3m 45s | Long Jump 3.5m | Shot Put (7.26 kg) 4.5m',
      petFemale: '100m in 18s | 800m in 4m 45s | Long Jump 3.0m'
    },
    skillTestDetails: 'PET/PST mandatory qualifying stage.',
    interviewDetails: '150 Marks Personality Test by UPSC Board.',
    officialNotificationRef: 'UPSC CAPF (ACs) 2026 Examination Cycle',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'upsc-ese',
    examCode: 'UPSC-ESE',
    name: 'UPSC Engineering Services Examination (ESE / IES)',
    shortName: 'UPSC ESE (IES)',
    categoryId: 'upsc',
    secondaryCategoryIds: ['engineering'],
    popular: true,
    authority: 'Union Public Service Commission (upsc.gov.in)',
    introduction:
      'Recruits Group-A Gazetted Engineers across CPWD, Central Water Engineering, Military Engineering Services, Border Roads, Indian Naval Armament, and Telecom/Power Services in Civil, Mechanical, Electrical, and Electronics & Telecom disciplines.',
    qualification: 'B.E./B.Tech Degree in Engineering (or M.Sc. Wireless/Electronics for specified E&T posts).',
    ageLimit: '21 to 30 years.',
    selectionProcess: 'Stage-I Preliminary Objective (500 Marks) → Stage-II Main Descriptive (600 Marks) → Stage-III Personality Test (200 Marks) → Final Merit (1300 Marks).',
    stages: [
      { name: 'Stage-I Preliminary (Objective)', mode: 'Offline OMR', qualifyingOnly: false, description: 'Paper-I General Studies & Engineering Aptitude (200 Marks) + Paper-II Technical Branch (300 Marks).' },
      { name: 'Stage-II Main (Conventional)', mode: 'Descriptive Pen & Paper', qualifyingOnly: false, description: 'Two 3-hour Technical Conventional Papers (300 + 300 = 600 Marks).' },
      { name: 'Stage-III Personality Test', mode: 'UPSC Interview', qualifyingOnly: false, description: '200 Marks; Final merit out of 1300 Marks.' }
    ],
    examPattern: [
      {
        stageName: 'Prelims (500 Marks) + Mains (600 Marks) + Interview (200 Marks)',
        sections: [
          { subject: 'Prelims Paper-I: General Studies & Engineering Aptitude (2 Hrs)', questions: 100, marks: 200 },
          { subject: 'Prelims Paper-II: Engineering Discipline Objective (3 Hrs)', questions: 150, marks: 300 },
          { subject: 'Mains Paper-I & Paper-II: Engineering Discipline Conventional (3 Hrs each)', questions: 'Descriptive', marks: 600 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 250 MCQs | Mains: 2 Descriptive Papers',
    totalMarks: '1300 Marks Total (500 Prelims + 600 Mains + 200 Interview)',
    duration: 'Prelims: 2 Hrs + 3 Hrs | Mains: 3 Hrs + 3 Hrs',
    negativeMarking: 'Prelims: 1/3rd mark deducted per wrong answer.',
    subjects: [
      {
        id: 'ese-gs-aptitude',
        name: 'General Studies & Engineering Aptitude (Prelims Paper-I — 200 Marks)',
        shortName: 'GS & Engg Aptitude',
        code: 'ESE-GS',
        stageTag: 'Prelims Paper-I',
        chapters: [
          { id: 'ese-gs-10', title: '10 Official Modules of ESE Paper-I', topicType: 'official', subtopics: ['Current Issues & Engineering Aptitude (Logical Reasoning, Analytical Ability)', 'Engineering Mathematics & Numerical Analysis', 'General Principles of Design, Drawing & Importance of Safety', 'Standards & Quality Practices in Production, Construction, Maintenance & Services', 'Basics of Energy & Environment, Project Management, Material Science, ICT & Ethics/Values in Engineering Profession'] }
        ]
      },
      fromBlueprint('eng-civil', { stageTag: 'Civil Engineering (Paper-II & Mains)' }),
      fromBlueprint('eng-mechanical', { stageTag: 'Mechanical Engineering (Paper-II & Mains)' }),
      fromBlueprint('eng-electrical', { stageTag: 'Electrical Engineering (Paper-II & Mains)' }),
      fromBlueprint('eng-electronics', { stageTag: 'Electronics & Telecom (Paper-II & Mains)' })
    ],
    practicalTechnicalTopics: ['Project Management (PERT/CPM), Design & Safety Standards, Engineering Ethics & Quality Control'],
    languages: ['English'],
    physicalStandards: { medicalStandard: 'Gazetted Technical Medical Examination conducted by Railway/CPWD Medical Boards.' },
    skillTestDetails: 'No skill test.',
    interviewDetails: '200 Marks Personality Test.',
    officialNotificationRef: 'UPSC ESE 2026 Examination Cycle',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'upsc-ifos',
    examCode: 'UPSC-IFOS',
    name: 'UPSC Indian Forest Service (IFoS)',
    shortName: 'UPSC IFoS',
    categoryId: 'upsc',
    authority: 'Union Public Service Commission (upsc.gov.in)',
    introduction:
      'All India Service recruitment for Indian Forest Service Officers. Prelims is conducted jointly with UPSC Civil Services Prelims, followed by a separate IFoS Main Examination.',
    qualification: 'Bachelor’s Degree with at least one of: Animal Husbandry & Veterinary Science, Botany, Chemistry, Geology, Mathematics, Physics, Statistics, Zoology, or Agriculture/Forestry/Engineering.',
    ageLimit: '21 to 32 years.',
    selectionProcess: 'CSE Preliminary Exam (Common) → IFoS Main Exam (6 Descriptive Papers = 1400 Marks) → Walking Test & Personality Test (300 Marks) → Final Merit (1700 Marks).',
    stages: [
      { name: 'Preliminary (Combined with CSE)', mode: 'Offline OMR', qualifyingOnly: true, description: 'Same GS + CSAT prelims paper with separate higher IFoS cutoff.' },
      { name: 'IFoS Main Exam', mode: 'Descriptive', qualifyingOnly: false, description: 'General English (300) + General Knowledge (300) + Two Optional Subjects (4 Papers × 200 = 800) = 1400 Marks.' },
      { name: 'Interview & Walking Test', mode: 'UPSC Board + Ground Test', qualifyingOnly: false, description: '300 Marks Interview + 25 km (Male) / 14 km (Female) walk in 4 hours.' }
    ],
    examPattern: [
      {
        stageName: 'IFoS Main Examination (1400 Marks + 300 Interview = 1700 Total)',
        sections: [
          { subject: 'Paper-I: General English (Essay, Précis, Grammar)', questions: 'Descriptive', marks: 300 },
          { subject: 'Paper-II: General Knowledge (Current Events, Indian Polity, History, Geography, Science, Environment)', questions: 'Descriptive', marks: 300 },
          { subject: 'Papers III–VI: Two Optional Subjects (2 Papers × 200 Marks each)', questions: 'Descriptive', marks: 800 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 180 MCQs | Mains: 6 Descriptive Papers',
    totalMarks: '1700 Marks (1400 Mains + 300 Interview)',
    duration: '3 Hours per Mains Paper',
    negativeMarking: 'Prelims: 1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Prelims & Mains GK (300 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('english-language', { stageTag: 'Mains Paper-I General English (300 Marks)' }),
      fromBlueprint('upsc-gs-mains', { stageTag: 'Prelims CSAT & GS Reference', includeChapterIds: ['up-csat'] })
    ],
    practicalTechnicalTopics: ['Forestry / Botany / Zoology / Agriculture / Geology Optional Papers + 25 km (Male) / 14 km (Female) 4-Hour Walking Test'],
    languages: ['English'],
    physicalStandards: { petMale: '25 km walk in 4 hours', petFemale: '14 km walk in 4 hours', heightMale: '150 cm (Chest 79–84 cm)', heightFemale: '140 cm' },
    skillTestDetails: 'Walking test mandatory.',
    interviewDetails: '300 Marks Personality Test.',
    officialNotificationRef: 'UPSC IFoS 2026 Examination Cycle',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'upsc-cms',
    examCode: 'UPSC-CMS',
    name: 'UPSC Combined Medical Services (CMS)',
    shortName: 'UPSC CMS',
    categoryId: 'upsc',
    authority: 'Union Public Service Commission (upsc.gov.in)',
    introduction:
      'Recruits Medical Officers in CHS (General Duty Medical Officers), Indian Railways Assistant Divisional Medical Officers (ADMO), NDMC, and MCD.',
    qualification: 'Passed the written and practical parts of the final M.B.B.S. Examination.',
    ageLimit: 'Must not have attained 32 years of age.',
    selectionProcess: 'Computer Based Examination (Part-I: 500 Marks across 2 Papers) → Personality Test (Part-II: 100 Marks) → Final Merit (600 Marks).',
    stages: [
      { name: 'Part-I Computer Based Exam', mode: 'Online Objective', qualifyingOnly: false, description: 'Two Papers × 120 Qs × 250 Marks = 500 Marks.' },
      { name: 'Part-II Personality Test', mode: 'UPSC Medical Board', qualifyingOnly: false, description: '100 Marks clinical, academic & general awareness interview.' }
    ],
    examPattern: [
      {
        stageName: 'Part-I CBE (240 Qs · 500 Marks · 2 Hrs per Paper)',
        sections: [
          { subject: 'Paper-I: General Medicine (96 Qs) + Paediatrics (24 Qs)', questions: 120, marks: 250 },
          { subject: 'Paper-II: Surgery (40 Qs) + Gynaecology & Obstetrics (40 Qs) + Preventive & Social Medicine (40 Qs)', questions: 120, marks: 250 }
        ]
      }
    ],
    totalQuestions: '240 Questions',
    totalMarks: '600 Marks (500 Written + 100 Personality Test)',
    duration: '2 Hours per Paper',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('specialized-clinical-hindi', { stageTag: 'Paper-I & Paper-II Medical Sciences', includeChapterIds: ['sd-upsc-cms'] })
    ],
    practicalTechnicalTopics: ['Clinical Case Diagnostics, National Immunization & Health Programmes, Emergency Trauma & Obstetrics Protocols'],
    languages: ['English'],
    physicalStandards: { medicalStandard: 'Medical Fitness per Central Health Service / Railway Board rules.' },
    skillTestDetails: 'No skill test.',
    interviewDetails: '100 Marks Personality Test.',
    officialNotificationRef: 'UPSC CMS 2026 Examination Cycle',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'upsc-epfo',
    examCode: 'UPSC-EPFO',
    name: 'UPSC EPFO (Enforcement Officer / Accounts Officer & APFC)',
    shortName: 'UPSC EPFO',
    categoryId: 'upsc',
    authority: 'Union Public Service Commission (for EPFO, Ministry of Labour)',
    introduction:
      'Special UPSC Recruitment Test for Enforcement Officers / Accounts Officers (EO/AO — Level 8) and Assistant Provident Fund Commissioners (APFC — Level 10) in EPFO.',
    qualification: 'Bachelor’s Degree in any subject from a recognized University.',
    ageLimit: 'EO/AO: Up to 30 years | APFC: Up to 35 years.',
    selectionProcess: 'Offline Pen-and-Paper Recruitment Test (RT — 75% Weightage) → Interview (25% Weightage) → Final Merit.',
    stages: [
      { name: 'Recruitment Test (RT)', mode: 'Offline OMR Objective', qualifyingOnly: false, description: '120 MCQs / 300 Marks in 2 hours (75% weightage in final selection).' },
      { name: 'Interview', mode: 'UPSC Board', qualifyingOnly: false, description: '100 Marks (25% weightage in final selection).' }
    ],
    examPattern: [
      {
        stageName: 'Recruitment Test (120 Qs · 300 Marks · 120 Mins)',
        sections: [
          { subject: 'General English, Indian Freedom Struggle, Current Events & Developmental Issues, Indian Polity & Economy', questions: 'Combined', marks: 'Part of 300' },
          { subject: 'General Accounting Principles, Industrial Relations & Labour Laws, Social Security in India', questions: 'Combined', marks: 'Part of 300' },
          { subject: 'General Science, Knowledge of Computer Applications, General Mental Ability & Quantitative Aptitude', questions: 'Combined', marks: 'Part of 300' }
        ]
      }
    ],
    totalQuestions: '120 Questions',
    totalMarks: '300 Marks (75% Weightage) + 100 Interview (25% Weightage)',
    duration: '120 Minutes',
    negativeMarking: '1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'RT General English' }),
      fromBlueprint('general-awareness', { stageTag: 'Freedom Struggle, Polity, Economy & Current Affairs', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('computer-it', { stageTag: 'Computer Applications', includeChapterIds: ['cs-fundamentals', 'cs-os', 'cs-networks', 'cs-cyber-security'] }),
      fromBlueprint('quantitative-aptitude', { stageTag: 'Quantitative Aptitude' }),
      fromBlueprint('reasoning', { stageTag: 'General Mental Ability' }),
      {
        id: 'epfo-labour-accounting',
        name: 'Accounting, Industrial Relations, Labour Laws & Social Security',
        shortName: 'Labour Laws & Accounting',
        code: 'EPFO-CORE',
        stageTag: 'EPFO Special Core',
        chapters: [
          { id: 'epfo-acct', title: 'General Accounting Principles & Auditing', topicType: 'official', subtopics: ['Accounting Concepts, Double-Entry Bookkeeping, Trial Balance, Depreciation, Bank Reconciliation & Financial Statements'] },
          { id: 'epfo-labour', title: 'Industrial Relations, New Labour Codes & Social Security in India', topicType: 'official', subtopics: ['EPF & MP Act 1952, ESI Act, Payment of Gratuity, Maternity Benefit, Code on Wages, Code on Social Security & Industrial Disputes'] }
        ]
      }
    ],
    practicalTechnicalTopics: ['EPF & MP Act 1952 Compliance, Payroll Accounting & Social Security Scheme Governance'],
    languages: ['English', 'Hindi'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: '100 Marks Interview (75:25 RT-to-Interview ratio; min interview qualifying marks 50 UR / 45 OBC / 40 SC-ST).',
    officialNotificationRef: 'UPSC EPFO EO/AO & APFC Latest Official Cycle',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    notificationYear: 2025,
    verificationStatus: 'Latest Official (2025)'
  }),

  buildExamSyllabus({
    id: 'upsc-geoscientist',
    examCode: 'UPSC-GEO',
    name: 'UPSC Combined Geo-Scientist Examination',
    shortName: 'UPSC Geo-Scientist',
    categoryId: 'upsc',
    authority: 'Union Public Service Commission (upsc.gov.in)',
    introduction:
      'Recruits Group-A Geologists, Geophysicists, Chemists in Geological Survey of India (GSI) and Scientist-B (Hydrogeology) in Central Ground Water Board.',
    qualification: 'Master’s Degree in Geology / Applied Geology / Geophysics / Physics / Chemistry / Hydrogeology (discipline-specific).',
    ageLimit: '21 to 32 years.',
    selectionProcess: 'Stage-I Preliminary (CBT 400 Marks) → Stage-II Main Descriptive (600 Marks) → Stage-III Personality Test (200 Marks) → Final Merit (1200 Marks).',
    stages: [
      { name: 'Stage-I Preliminary (CBT)', mode: 'Computer Based Test', qualifyingOnly: false, description: 'Paper-I General Studies (100 Marks) + Paper-II Subject Stream (300 Marks).' },
      { name: 'Stage-II Main (Descriptive)', mode: 'Conventional Pen & Paper', qualifyingOnly: false, description: 'Three 3-hour Technical Subject Papers × 200 Marks = 600 Marks.' },
      { name: 'Stage-III Interview', mode: 'UPSC Board', qualifyingOnly: false, description: '200 Marks Personality Test.' }
    ],
    examPattern: [
      {
        stageName: 'Stage-I Prelims (400 Marks) + Stage-II Mains (600 Marks) + Interview (200 Marks)',
        sections: [
          { subject: 'Prelims Paper-I: General Studies (2 Hrs)', questions: 100, marks: 100 },
          { subject: 'Prelims Paper-II: Geology / Geophysics / Chemistry (2 Hrs)', questions: 120, marks: 300 },
          { subject: 'Mains Papers I, II & III: Subject Specialization (3 Hrs each)', questions: 'Descriptive', marks: 600 }
        ]
      }
    ],
    totalQuestions: 'Prelims: 220 MCQs | Mains: 3 Descriptive Papers',
    totalMarks: '1200 Marks (400 + 600 + 200)',
    duration: 'Prelims: 2 Hrs each | Mains: 3 Hrs each',
    negativeMarking: 'Prelims: 1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('general-awareness', { stageTag: 'Prelims Paper-I GS (100 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      {
        id: 'geo-stream-core',
        name: 'Geology, Geophysics, Hydrogeology & Geochemistry Stream Syllabus',
        shortName: 'Geo-Sciences Core',
        code: 'GEO-CORE',
        stageTag: 'Prelims Paper-II & Mains Papers I–III',
        chapters: [
          { id: 'geo-geology', title: 'Physical Geology, Mineralogy, Petrology, Structural Geology & Stratigraphy', topicType: 'official', subtopics: ['Geomorphology, Plate Tectonics, Optical Mineralogy, Igneous/Sedimentary/Metamorphic Petrology, Paleontology & Economic Geology of India'] },
          { id: 'geo-hydro-geochem', title: 'Hydrogeology, Geophysics & Analytical Chemistry', topicType: 'official', subtopics: ['Aquifer Hydraulics, Well Logging, Seismic/Gravity/Magnetic Exploration, Chemical Thermodynamics, Spectroscopy & Instrumental Analysis'] }
        ]
      }
    ],
    practicalTechnicalTopics: ['GSI Field Mapping, Remote Sensing/GIS, Well-Log Interpretation & Geochemical Assay'],
    languages: ['English'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: '200 Marks Personality Test.',
    officialNotificationRef: 'UPSC Combined Geo-Scientist 2026 Cycle',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  }),

  buildExamSyllabus({
    id: 'upsc-ies-iss',
    examCode: 'UPSC-IES-ISS',
    name: 'UPSC IES / ISS (Indian Economic Service & Indian Statistical Service)',
    shortName: 'UPSC IES / ISS',
    categoryId: 'upsc',
    authority: 'Union Public Service Commission (upsc.gov.in)',
    introduction:
      'Recruits Junior Time Scale (Group-A) Officers in the Indian Economic Service (IES) and Indian Statistical Service (ISS).',
    qualification: 'IES: Post-Graduate Degree in Economics / Applied Economics / Business Economics / Econometrics | ISS: Bachelor’s/Master’s Degree with Statistics / Mathematical Statistics / Applied Statistics.',
    ageLimit: '21 to 30 years.',
    selectionProcess: 'Written Examination (1000 Marks across 6 Papers) → Viva-Voce / Personality Test (200 Marks) → Final Merit (1200 Marks).',
    stages: [
      { name: 'Written Examination', mode: 'Descriptive (ISS Papers I & II Objective)', qualifyingOnly: false, description: 'General English (100) + General Studies (100) + 4 Core Economics / Statistics Papers (200 each = 800).' },
      { name: 'Viva-Voce', mode: 'UPSC Interview', qualifyingOnly: false, description: '200 Marks Personality Test.' }
    ],
    examPattern: [
      {
        stageName: 'IES / ISS Written Exam (1000 Marks · 3 Hrs per Paper, 2 Hrs for ISS Obj)',
        sections: [
          { subject: 'General English + General Studies (Common to IES & ISS)', questions: 'Descriptive', marks: '100 + 100' },
          { subject: 'IES: General Economics I, II, III & Indian Economics (4 Descriptive Papers)', questions: 'Descriptive', marks: 800 },
          { subject: 'ISS: Statistics I & II (Objective 80 Qs/200 each) + Statistics III & IV (Descriptive 200 each)', questions: 'Obj + Desc', marks: 800 }
        ]
      }
    ],
    totalQuestions: '6 Papers (ISS Papers I & II have 80 MCQs each)',
    totalMarks: '1200 Marks (1000 Written + 200 Viva-Voce)',
    duration: '2–3 Hours per Paper',
    negativeMarking: 'ISS Objective Papers I & II: 1/3rd mark deducted per wrong answer.',
    subjects: [
      fromBlueprint('english-language', { stageTag: 'General English (100 Marks)' }),
      fromBlueprint('general-awareness', { stageTag: 'General Studies (100 Marks)', excludeChapterIds: ['ga-ap-gk', 'ga-telangana-gk'] }),
      fromBlueprint('specialized-clinical-hindi', { stageTag: 'IES / ISS Core Papers (800 Marks)', includeChapterIds: ['sd-upsc-ies-iss'] })
    ],
    practicalTechnicalTopics: ['Econometric Modeling, National Accounts Statistics (NAS), NSSO Sampling Surveys & Fiscal Policy Analysis'],
    languages: ['English'],
    physicalStandards: null,
    skillTestDetails: 'No skill test.',
    interviewDetails: '200 Marks Viva-Voce.',
    officialNotificationRef: 'UPSC IES / ISS 2026 Cycle',
    officialWebsiteUrl: 'https://upsc.gov.in',
    officialNotificationUrl: 'https://upsc.gov.in',
    notificationYear: 2026,
    verificationStatus: 'Verified 2026'
  })
];
