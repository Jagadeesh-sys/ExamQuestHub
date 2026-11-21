/**
 * Unified Configurable Exam Hierarchy & Official Pattern Registry
 *
 * Establishes the canonical hierarchy:
 *   EXAM -> EXAM CATEGORY / STAGE -> OFFICIAL PATTERN -> SUBJECT -> TOPIC -> SUBTOPIC
 *
 * Pure JS module (zero UI dependencies) so it executes identically in:
 * - Browser client (Vite / React / Mock Test Engine / Admin Studio)
 * - Node.js batch audit, normalization, and verification scripts
 */

export const EXAM_HIERARCHY_STORAGE_KEY = 'eqh_exam_hierarchy_config_v1';

export const CANONICAL_SUBJECTS = [
  {
    id: 'general-knowledge',
    name: 'General Knowledge',
    shortName: 'GK & GA',
    aliases: ['general awareness', 'gk', 'general knowledge', 'general studies', 'gs']
  },
  {
    id: 'current-affairs',
    name: 'Current Affairs',
    shortName: 'Current Affairs',
    aliases: ['current affairs', 'ca', 'current events']
  },
  {
    id: 'quantitative-aptitude',
    name: 'Quantitative Aptitude',
    shortName: 'Maths / Quant',
    aliases: ['mathematics', 'quantitative aptitude', 'quant', 'maths', 'numerical ability']
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    shortName: 'Reasoning',
    aliases: ['general intelligence and reasoning', 'general intelligence & reasoning', 'mental ability', 'reasoning']
  },
  {
    id: 'general-science',
    name: 'General Science',
    shortName: 'Science',
    aliases: ['general science', 'science', 'science and technology', 'science & technology']
  },
  {
    id: 'english-language',
    name: 'English Language',
    shortName: 'English',
    aliases: ['english comprehension', 'english language', 'english', 'english language and comprehension']
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    shortName: 'Computer',
    aliases: ['computer science', 'computer awareness', 'computer knowledge', 'computer', 'cse']
  }
];

export const SUBJECT_TOPIC_TREE = {
  'general-knowledge': [
    {
      id: 'indian-history',
      name: 'Indian History',
      subtopics: [
        'Indus Valley Civilization & Vedic Age',
        'Buddhism & Jainism',
        'Maurya & Gupta Empires',
        'Delhi Sultanate & Mughal Empire',
        'Maratha, Vijayanagara & Regional Kingdoms',
        'Andhra Pradesh Social & Cultural History',
        'British East India Company & Revolt of 1857',
        'Indian Freedom Struggle (1885-1947)',
        'Social & Religious Reform Movements',
        'Art, Architecture & Historical Monuments'
      ]
    },
    {
      id: 'indian-polity',
      name: 'Indian Polity & Constitution',
      subtopics: [
        'Making of Constitution & Preamble',
        'Fundamental Rights & Duties',
        'Directive Principles of State Policy',
        'Union Executive (President, PM, Council of Ministers)',
        'Parliament (Lok Sabha & Rajya Sabha)',
        'Judiciary (Supreme Court & High Courts)',
        'State Government, Governor & Legislature',
        'Constitutional Amendments & Schedules',
        'Panchayati Raj & Urban Local Bodies',
        'Constitutional & Statutory Bodies (EC, CAG, UPSC, Finance Commission)'
      ]
    },
    {
      id: 'geography',
      name: 'Geography',
      subtopics: [
        'Solar System & Universe',
        'Lithosphere, Rocks, Earthquakes & Volcanoes',
        'Atmosphere, Climate, Winds & Monsoon',
        'Indian Rivers, Lakes, Dams & Waterfalls',
        'Mountains, Passes, Plateaus & Islands',
        'Soils, Forests & Agriculture of India',
        'Mineral & Energy Resources',
        'World Geography, Continents, Capitals & Currencies',
        'Transport, Census & Human Geography'
      ]
    },
    {
      id: 'indian-economy',
      name: 'Indian Economy',
      subtopics: [
        'National Income, GDP & Economic Growth',
        'Banking, RBI & Monetary Policy',
        'Union Budget, Fiscal Policy & Taxation (GST)',
        'Five Year Plans & NITI Aayog',
        'Poverty, Unemployment & Inflation',
        'Indian & AP Economy & Welfare',
        'Agriculture, Industry & Infrastructure',
        'Financial Markets, SEBI & International Institutions (IMF/WTO/World Bank)'
      ]
    },
    {
      id: 'environment-ecology',
      name: 'Environment & Ecology',
      subtopics: [
        'Ecosystems, Food Chains & Biodiversity',
        'National Parks, Wildlife Sanctuaries & Biosphere Reserves',
        'Climate Change, Ozone & Pollution',
        'Environmental Conventions & Summits',
        'Ramsar Wetlands & Endangered Species'
      ]
    },
    {
      id: 'government-schemes',
      name: 'Government Schemes & Society',
      subtopics: [
        'Central Government Welfare Schemes',
        'Employment, Rural & Agricultural Missions',
        'Financial Inclusion & Social Security Schemes',
        'Indian Society, Demography & Social Justice'
      ]
    },
    {
      id: 'static-gk',
      name: 'Static GK & Culture',
      subtopics: [
        'Classical & Folk Dances, Music & Festivals',
        'Books & Authors',
        'National & International Organizations & Headquarters',
        'Awards, Honours & Sports Terminology',
        'Important Days, First in India/World & Research Institutes'
      ]
    }
  ],
  'current-affairs': [
    {
      id: 'national-affairs',
      name: 'National Current Affairs',
      subtopics: [
        'National Events & Policy Decisions',
        'Appointments & Constitutional Heads',
        'State Initiatives & Infrastructure Launches',
        'Bills, Committees & Indices (India Rank)'
      ]
    },
    {
      id: 'international-affairs',
      name: 'International Current Affairs',
      subtopics: [
        'Bilateral Relations & Global Diplomacy',
        'International Summits (G20, BRICS, SCO, UN)',
        'Global Reports & Rankings'
      ]
    },
    {
      id: 'economy-banking-ca',
      name: 'Economy & Banking CA',
      subtopics: [
        'RBI Monetary Updates & Repo Rate',
        'Union Budget & Economic Survey Highlights',
        'MoUs, Trade & GDP Projections'
      ]
    },
    {
      id: 'science-tech-ca',
      name: 'Science, Space & Tech CA',
      subtopics: [
        'ISRO & Space Missions',
        'AI, Digital India & Emerging Technologies',
        'Biotech, Health & Medical Breakthroughs'
      ]
    },
    {
      id: 'sports-awards-ca',
      name: 'Sports & Awards CA',
      subtopics: [
        'Cricket, Olympics & Asian/Commonwealth Games',
        'Grand Slams, Chess & Athletics',
        'Padma Awards, Nobel Prize, Bharat Ratna & Film Awards'
      ]
    },
    {
      id: 'defence-summits-ca',
      name: 'Defence & Exercises CA',
      subtopics: [
        'Joint Military Exercises',
        'DRDO Missiles, Naval Ships & Inductions'
      ]
    }
  ],
  'quantitative-aptitude': [
    {
      id: 'number-system',
      name: 'Number System & Simplification',
      subtopics: [
        'Divisibility, Remainders & Unit Digit',
        'HCF & LCM',
        'BODMAS, Fractions, Surds & Indices',
        'Square Roots, Cube Roots & Decimals'
      ]
    },
    {
      id: 'percentage-profit-loss',
      name: 'Percentage, Profit & Loss & Interest',
      subtopics: [
        'Percentage Change & Population/Election Problems',
        'Profit, Loss & Successive Discount',
        'Simple Interest',
        'Compound Interest & Installments'
      ]
    },
    {
      id: 'ratio-proportion-mixtures',
      name: 'Ratio, Proportion, Averages & Mixtures',
      subtopics: [
        'Ratio & Proportion',
        'Partnership',
        'Problems on Ages',
        'Averages',
        'Alligation & Mixtures'
      ]
    },
    {
      id: 'time-speed-distance-work',
      name: 'Time, Work, Speed & Distance',
      subtopics: [
        'Time & Work (Efficiency & Wages)',
        'Pipes & Cisterns',
        'Time, Speed & Distance',
        'Problems on Trains',
        'Boats & Streams'
      ]
    },
    {
      id: 'algebra-trigonometry',
      name: 'Algebra & Trigonometry',
      subtopics: [
        'Linear & Quadratic Equations',
        'Algebraic Identities & Polynomials',
        'Trigonometric Identities & Ratios',
        'Heights & Distances'
      ]
    },
    {
      id: 'mensuration-geometry',
      name: 'Geometry & Mensuration',
      subtopics: [
        'Lines, Angles, Triangles & Congruence',
        'Circles, Chords & Tangents',
        'Quadrilaterals & Polygons',
        '2D Mensuration (Area & Perimeter)',
        '3D Mensuration (Volume & Surface Area)'
      ]
    },
    {
      id: 'data-interpretation',
      name: 'Data Interpretation, Statistics & Probability',
      subtopics: [
        'Tables, Bar Graphs, Pie Charts & Line Graphs',
        'Mean, Median, Mode & Standard Deviation',
        'Permutation, Combination & Probability'
      ]
    }
  ],
  reasoning: [
    {
      id: 'analogies-classification',
      name: 'Analogy & Classification',
      subtopics: [
        'Word & Semantic Analogy',
        'Number & Letter Analogy',
        'Odd One Out (Classification)'
      ]
    },
    {
      id: 'series-coding-decoding',
      name: 'Series, Coding-Decoding & Operations',
      subtopics: [
        'Number Series & Missing Number',
        'Alphabet & Letter Cluster Series',
        'Coding-Decoding',
        'Mathematical Operations & Sign Interchange',
        'Dictionary & Word Order'
      ]
    },
    {
      id: 'blood-relations-directions',
      name: 'Blood Relations & Direction Sense',
      subtopics: [
        'Blood Relations (Family Tree & Coded)',
        'Direction & Distance',
        'Order, Ranking & Comparison',
        'Calendar & Clock'
      ]
    },
    {
      id: 'syllogism-conclusions',
      name: 'Syllogism, Venn Diagrams & Logic',
      subtopics: [
        'Syllogism (Statements & Conclusions)',
        'Venn Diagrams',
        'Statements, Assumptions & Courses of Action',
        'Data Sufficiency'
      ]
    },
    {
      id: 'puzzles-seating',
      name: 'Puzzles & Seating Arrangement',
      subtopics: [
        'Circular Seating Arrangement',
        'Linear Row Seating Arrangement',
        'Floor, Box & Scheduling Puzzles'
      ]
    },
    {
      id: 'non-verbal-reasoning',
      name: 'Non-Verbal & Visual Reasoning',
      subtopics: [
        'Mirror & Water Images',
        'Paper Folding & Cutting',
        'Cubes & Dice',
        'Counting Figures & Embedded Figures'
      ]
    }
  ],
  'general-science': [
    {
      id: 'physics',
      name: 'Physics',
      subtopics: [
        'SI Units, Measurements & Mechanics',
        'Motion, Gravitation & Work-Energy-Power',
        'Optics (Mirrors, Lenses & Refraction)',
        'Electricity, Magnetism & Circuits',
        'Heat, Thermodynamics & Sound Waves',
        'Nuclear Physics & Scientific Instruments'
      ]
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      subtopics: [
        'Atomic Structure & Periodic Table',
        'Chemical Bonding, Reactions & Equations',
        'Acids, Bases, Salts & pH Scale',
        'Metals, Non-Metals, Ores & Alloys',
        'Carbon Compounds, Polymers & Fuels',
        'Everyday Chemistry & Gas Laws'
      ]
    },
    {
      id: 'biology',
      name: 'Biology',
      subtopics: [
        'Cell Biology, Organelles & Genetics',
        'Human Physiology (Circulatory, Digestive, Nervous, Respiratory)',
        'Vitamins, Nutrition & Deficiency Diseases',
        'Microorganisms, Vaccines & Human Diseases',
        'Plant Kingdom, Photosynthesis & Plant Hormones',
        'Animal Taxonomy & Ecology'
      ]
    }
  ],
  'english-language': [
    {
      id: 'grammar-error-spotting',
      name: 'Grammar, Error Spotting & Sentence Improvement',
      subtopics: [
        'Error Spotting (Tenses, Subject-Verb, Prepositions)',
        'Sentence Improvement / No Substitution',
        'Fill in the Blanks (Grammar & Phrasal Verbs)',
        'Active & Passive Voice',
        'Direct & Indirect Narration'
      ]
    },
    {
      id: 'vocabulary',
      name: 'Vocabulary, Synonyms & Antonyms',
      subtopics: [
        'Synonyms',
        'Antonyms',
        'Contextual Vocabulary & Homonyms'
      ]
    },
    {
      id: 'idioms-phrases',
      name: 'Idioms & Phrases',
      subtopics: ['Idioms & Proverb Meanings']
    },
    {
      id: 'one-word-substitution',
      name: 'One-Word Substitution & Spelling',
      subtopics: [
        'One-Word Substitution',
        'Incorrectly / Correctly Spelt Words'
      ]
    },
    {
      id: 'sentence-rearrangement',
      name: 'Sentence Rearrangement (Para Jumbles)',
      subtopics: ['PQRS / ABCD Para Jumbles']
    },
    {
      id: 'reading-comprehension',
      name: 'Reading Comprehension & Cloze Test',
      subtopics: [
        'Cloze Test Passage',
        'Reading Comprehension Passage'
      ]
    }
  ],
  'computer-science': [
    {
      id: 'computer-fundamentals',
      name: 'Computer Fundamentals & MS Office',
      subtopics: [
        'Computer Architecture, CPU, Memory (RAM/ROM/Cache) & I/O',
        'MS Word, Excel & PowerPoint',
        'Keyboard Shortcuts & File Extensions',
        'Generations of Computers & Supercomputers'
      ]
    },
    {
      id: 'operating-systems',
      name: 'Operating Systems',
      subtopics: [
        'Windows, Linux, Unix & MS-DOS Commands',
        'Process Scheduling, Deadlock & Virtual Memory',
        'File Systems & Device Drivers'
      ]
    },
    {
      id: 'computer-networks',
      name: 'Computer Networks & Internet',
      subtopics: [
        'OSI & TCP/IP Models',
        'Network Protocols (HTTP, HTTPS, FTP, SMTP, DNS)',
        'LAN, WAN, MAN, Topologies & Network Hardware',
        'IP Addressing, Web Browsers & Email'
      ]
    },
    {
      id: 'dbms',
      name: 'Database Management Systems (DBMS)',
      subtopics: [
        'RDBMS, SQL Queries & Keys (Primary/Foreign)',
        'Normalization, ER Model & ACID Properties'
      ]
    },
    {
      id: 'digital-logic',
      name: 'Digital Logic & Number Systems',
      subtopics: [
        'Binary, Octal & Hexadecimal Conversions',
        'Boolean Algebra & Logic Gates',
        'ASCII, Unicode & Registers'
      ]
    },
    {
      id: 'programming-oop',
      name: 'Programming & OOP',
      subtopics: [
        'Compilers, Interpreters & Assemblers',
        'C, C++, Java, Python & OOP Concepts',
        'Web Markup (HTML, XML, CSS)'
      ]
    },
    {
      id: 'data-structures-algorithms',
      name: 'Data Structures & Algorithms',
      subtopics: [
        'Arrays, Stacks, Queues & Linked Lists',
        'Trees, Graphs, Sorting & Time Complexity'
      ]
    },
    {
      id: 'software-engineering',
      name: 'Cyber Security & Software Engineering',
      subtopics: [
        'Malware (Virus, Trojan, Worm, Ransomware, Phishing)',
        'Firewalls, Cryptography & Backup',
        'SDLC, Testing & Agile Models'
      ]
    }
  ]
};

/**
 * Complete hierarchical exam & stage definitions with official exam patterns,
 * per-section quotas, duration, positive marks, and negative marking rules.
 */
export const EXAM_HIERARCHY = [
  {
    examId: 'ssc-cgl',
    name: 'SSC CGL (Combined Graduate Level)',
    shortName: 'SSC CGL',
    agency: 'SSC',
    syllabusVersion: '2025-26 Official Cycle',
    stages: [
      {
        stageId: 'ssc-cgl-tier1',
        name: 'Tier 1 (Preliminary CBE)',
        shortName: 'Tier 1',
        qualifyingOnly: true,
        totalQuestions: 100,
        totalMarks: 200,
        durationMinutes: 60,
        marksPerQuestion: 2,
        negativeMarking: 0.5,
        sections: [
          { id: 'reasoning', name: 'General Intelligence & Reasoning', subjectIds: ['reasoning'], count: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
          { id: 'ga', name: 'General Awareness', subjectIds: ['general-knowledge', 'general-science', 'current-affairs'], count: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
          { id: 'quant', name: 'Quantitative Aptitude', subjectIds: ['quantitative-aptitude'], count: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
          { id: 'english', name: 'English Comprehension', subjectIds: ['english-language'], count: 25, marksPerQuestion: 2, negativeMarking: 0.5 }
        ],
        allowedSubjectIds: ['reasoning', 'general-knowledge', 'general-science', 'current-affairs', 'quantitative-aptitude', 'english-language'],
        excludedTopics: ['Andhra Pradesh Social & Cultural History', 'AP Economy']
      },
      {
        stageId: 'ssc-cgl-tier2',
        name: 'Tier 2 Paper-I (Mains CBE)',
        shortName: 'Tier 2',
        qualifyingOnly: false,
        totalQuestions: 150,
        totalMarks: 450,
        durationMinutes: 135,
        marksPerQuestion: 3,
        negativeMarking: 1,
        sections: [
          { id: 'quant', name: 'Section I: Mathematical Abilities', subjectIds: ['quantitative-aptitude'], count: 30, marksPerQuestion: 3, negativeMarking: 1 },
          { id: 'reasoning', name: 'Section I: Reasoning & General Intelligence', subjectIds: ['reasoning'], count: 30, marksPerQuestion: 3, negativeMarking: 1 },
          { id: 'english', name: 'Section II: English Language & Comprehension', subjectIds: ['english-language'], count: 45, marksPerQuestion: 3, negativeMarking: 1 },
          { id: 'ga', name: 'Section II: General Awareness', subjectIds: ['general-knowledge', 'general-science', 'current-affairs'], count: 25, marksPerQuestion: 3, negativeMarking: 1 },
          { id: 'computer', name: 'Section III: Computer Knowledge Module', subjectIds: ['computer-science'], count: 20, marksPerQuestion: 3, negativeMarking: 1 }
        ],
        allowedSubjectIds: ['quantitative-aptitude', 'reasoning', 'english-language', 'general-knowledge', 'general-science', 'current-affairs', 'computer-science'],
        excludedTopics: ['Andhra Pradesh Social & Cultural History']
      }
    ]
  },
  {
    examId: 'ssc-chsl',
    name: 'SSC CHSL (10+2 Combined Higher Secondary)',
    shortName: 'SSC CHSL',
    agency: 'SSC',
    syllabusVersion: '2025-26 Official Cycle',
    stages: [
      {
        stageId: 'ssc-chsl-tier1',
        name: 'Tier 1 (10+2 Screening CBE)',
        shortName: 'Tier 1',
        qualifyingOnly: true,
        totalQuestions: 100,
        totalMarks: 200,
        durationMinutes: 60,
        marksPerQuestion: 2,
        negativeMarking: 0.5,
        sections: [
          { id: 'english', name: 'English Language', subjectIds: ['english-language'], count: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
          { id: 'reasoning', name: 'General Intelligence', subjectIds: ['reasoning'], count: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
          { id: 'quant', name: 'Quantitative Aptitude', subjectIds: ['quantitative-aptitude'], count: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
          { id: 'ga', name: 'General Awareness', subjectIds: ['general-knowledge', 'general-science', 'current-affairs'], count: 25, marksPerQuestion: 2, negativeMarking: 0.5 }
        ],
        allowedSubjectIds: ['english-language', 'reasoning', 'quantitative-aptitude', 'general-knowledge', 'general-science', 'current-affairs']
      },
      {
        stageId: 'ssc-chsl-tier2',
        name: 'Tier 2 (Mains CBE)',
        shortName: 'Tier 2',
        qualifyingOnly: false,
        totalQuestions: 135,
        totalMarks: 405,
        durationMinutes: 135,
        marksPerQuestion: 3,
        negativeMarking: 1,
        sections: [
          { id: 'quant', name: 'Section I: Mathematical Abilities', subjectIds: ['quantitative-aptitude'], count: 30, marksPerQuestion: 3, negativeMarking: 1 },
          { id: 'reasoning', name: 'Section I: Reasoning', subjectIds: ['reasoning'], count: 30, marksPerQuestion: 3, negativeMarking: 1 },
          { id: 'english', name: 'Section II: English Language', subjectIds: ['english-language'], count: 40, marksPerQuestion: 3, negativeMarking: 1 },
          { id: 'ga', name: 'Section II: General Awareness', subjectIds: ['general-knowledge', 'general-science', 'current-affairs'], count: 20, marksPerQuestion: 3, negativeMarking: 1 },
          { id: 'computer', name: 'Section III: Computer Knowledge', subjectIds: ['computer-science'], count: 15, marksPerQuestion: 3, negativeMarking: 1 }
        ],
        allowedSubjectIds: ['quantitative-aptitude', 'reasoning', 'english-language', 'general-knowledge', 'general-science', 'current-affairs', 'computer-science']
      }
    ]
  },
  {
    examId: 'ssc-mts',
    name: 'SSC MTS & Havaldar',
    shortName: 'SSC MTS',
    agency: 'SSC',
    syllabusVersion: '2025-26 Revised Session I+II Pattern',
    stages: [
      {
        stageId: 'ssc-mts-cbe',
        name: 'Session I & Session II CBE',
        shortName: 'CBE (Session I+II)',
        qualifyingOnly: false,
        totalQuestions: 90,
        totalMarks: 270,
        durationMinutes: 90,
        marksPerQuestion: 3,
        negativeMarking: 1,
        note: 'Session I (Math + Reasoning) has NO negative marking; Session II (GA + English) has -1 negative marking per wrong answer.',
        sections: [
          { id: 'quant', name: 'Session 1: Numerical & Mathematical Ability', subjectIds: ['quantitative-aptitude'], count: 20, marksPerQuestion: 3, negativeMarking: 0, qualifyingOnly: true },
          { id: 'reasoning', name: 'Session 1: Reasoning & Problem Solving', subjectIds: ['reasoning'], count: 20, marksPerQuestion: 3, negativeMarking: 0, qualifyingOnly: true },
          { id: 'ga', name: 'Session 2: General Awareness', subjectIds: ['general-knowledge', 'general-science', 'current-affairs'], count: 25, marksPerQuestion: 3, negativeMarking: 1 },
          { id: 'english', name: 'Session 2: English Language & Comprehension', subjectIds: ['english-language'], count: 25, marksPerQuestion: 3, negativeMarking: 1 }
        ],
        allowedSubjectIds: ['quantitative-aptitude', 'reasoning', 'general-knowledge', 'general-science', 'current-affairs', 'english-language']
      }
    ]
  },
  {
    examId: 'rrb-ntpc',
    name: 'RRB NTPC (CEN 06/2024 – 07/2025)',
    shortName: 'RRB NTPC',
    agency: 'RRB',
    syllabusVersion: 'CEN 06/2025 & CEN 07/2025',
    stages: [
      {
        stageId: 'rrb-ntpc-ug-cbt1',
        name: 'Undergraduate Level (12th) — CBT 1',
        shortName: 'UG CBT-1',
        examLevel: 'Under Graduate',
        qualifyingOnly: true,
        totalQuestions: 100,
        totalMarks: 100,
        durationMinutes: 90,
        marksPerQuestion: 1,
        negativeMarking: 0.33,
        sections: [
          { id: 'quant', name: 'Mathematics', subjectIds: ['quantitative-aptitude'], count: 30, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'reasoning', name: 'General Intelligence & Reasoning', subjectIds: ['reasoning'], count: 30, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'ga', name: 'General Awareness', subjectIds: ['general-knowledge', 'general-science', 'current-affairs', 'computer-science'], count: 40, marksPerQuestion: 1, negativeMarking: 0.33 }
        ],
        allowedSubjectIds: ['quantitative-aptitude', 'reasoning', 'general-knowledge', 'general-science', 'current-affairs', 'computer-science']
      },
      {
        stageId: 'rrb-ntpc-ug-cbt2',
        name: 'Undergraduate Level (12th) — CBT 2',
        shortName: 'UG CBT-2',
        examLevel: 'Under Graduate',
        qualifyingOnly: false,
        totalQuestions: 120,
        totalMarks: 120,
        durationMinutes: 90,
        marksPerQuestion: 1,
        negativeMarking: 0.33,
        sections: [
          { id: 'quant', name: 'Mathematics', subjectIds: ['quantitative-aptitude'], count: 35, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'reasoning', name: 'General Intelligence & Reasoning', subjectIds: ['reasoning'], count: 35, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'ga', name: 'General Awareness', subjectIds: ['general-knowledge', 'general-science', 'current-affairs', 'computer-science'], count: 50, marksPerQuestion: 1, negativeMarking: 0.33 }
        ],
        allowedSubjectIds: ['quantitative-aptitude', 'reasoning', 'general-knowledge', 'general-science', 'current-affairs', 'computer-science']
      },
      {
        stageId: 'rrb-ntpc-grad-cbt1',
        name: 'Graduate Level — CBT 1',
        shortName: 'Graduate CBT-1',
        examLevel: 'Graduate',
        qualifyingOnly: true,
        totalQuestions: 100,
        totalMarks: 100,
        durationMinutes: 90,
        marksPerQuestion: 1,
        negativeMarking: 0.33,
        sections: [
          { id: 'quant', name: 'Mathematics', subjectIds: ['quantitative-aptitude'], count: 30, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'reasoning', name: 'General Intelligence & Reasoning', subjectIds: ['reasoning'], count: 30, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'ga', name: 'General Awareness', subjectIds: ['general-knowledge', 'general-science', 'current-affairs', 'computer-science'], count: 40, marksPerQuestion: 1, negativeMarking: 0.33 }
        ],
        allowedSubjectIds: ['quantitative-aptitude', 'reasoning', 'general-knowledge', 'general-science', 'current-affairs', 'computer-science']
      },
      {
        stageId: 'rrb-ntpc-grad-cbt2',
        name: 'Graduate Level — CBT 2',
        shortName: 'Graduate CBT-2',
        examLevel: 'Graduate',
        qualifyingOnly: false,
        totalQuestions: 120,
        totalMarks: 120,
        durationMinutes: 90,
        marksPerQuestion: 1,
        negativeMarking: 0.33,
        sections: [
          { id: 'quant', name: 'Mathematics', subjectIds: ['quantitative-aptitude'], count: 35, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'reasoning', name: 'General Intelligence & Reasoning', subjectIds: ['reasoning'], count: 35, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'ga', name: 'General Awareness', subjectIds: ['general-knowledge', 'general-science', 'current-affairs', 'computer-science'], count: 50, marksPerQuestion: 1, negativeMarking: 0.33 }
        ],
        allowedSubjectIds: ['quantitative-aptitude', 'reasoning', 'general-knowledge', 'general-science', 'current-affairs', 'computer-science']
      }
    ]
  },
  {
    examId: 'rrb-group-d',
    name: 'RRB Group D (Level-1 Posts)',
    shortName: 'RRB Group D',
    agency: 'RRB',
    syllabusVersion: 'CEN 08/2024 & CEN 09/2025',
    stages: [
      {
        stageId: 'rrb-group-d-cbt',
        name: 'Single Stage CBT (Level-1)',
        shortName: 'Level-1 CBT',
        examLevel: 'Level-1',
        qualifyingOnly: false,
        totalQuestions: 100,
        totalMarks: 100,
        durationMinutes: 90,
        marksPerQuestion: 1,
        negativeMarking: 0.33,
        sections: [
          { id: 'science', name: 'General Science', subjectIds: ['general-science'], count: 25, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'quant', name: 'Mathematics', subjectIds: ['quantitative-aptitude'], count: 25, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'reasoning', name: 'General Intelligence & Reasoning', subjectIds: ['reasoning'], count: 30, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'ga-ca', name: 'General Awareness & Current Affairs', subjectIds: ['general-knowledge', 'current-affairs'], count: 20, marksPerQuestion: 1, negativeMarking: 0.33 }
        ],
        allowedSubjectIds: ['general-science', 'quantitative-aptitude', 'reasoning', 'general-knowledge', 'current-affairs']
      }
    ]
  },
  {
    examId: 'appsc-group-2',
    name: 'APPSC Group 2 Services',
    shortName: 'APPSC Group 2',
    agency: 'APPSC',
    syllabusVersion: 'Revised Screening + Mains Pattern (2024–2025)',
    stages: [
      {
        stageId: 'appsc-group2-prelims',
        name: 'Screening Test (Prelims)',
        shortName: 'Prelims',
        qualifyingOnly: true,
        totalQuestions: 150,
        totalMarks: 150,
        durationMinutes: 150,
        marksPerQuestion: 1,
        negativeMarking: 0.33,
        sections: [
          { id: 'history', name: 'Indian History', subjectIds: ['general-knowledge'], topicIds: ['indian-history'], count: 30, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'geography', name: 'Geography', subjectIds: ['general-knowledge'], topicIds: ['geography'], count: 30, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'society', name: 'Indian Society', subjectIds: ['general-knowledge'], topicIds: ['government-schemes', 'indian-polity', 'static-gk'], count: 30, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'ca', name: 'Current Affairs', subjectIds: ['current-affairs'], count: 30, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'mental-ability', name: 'Mental Ability', subjectIds: ['reasoning', 'quantitative-aptitude'], count: 30, marksPerQuestion: 1, negativeMarking: 0.33 }
        ],
        allowedSubjectIds: ['general-knowledge', 'current-affairs', 'reasoning', 'quantitative-aptitude']
      },
      {
        stageId: 'appsc-group2-mains-p1',
        name: 'Mains Paper-I (AP History & Constitution)',
        shortName: 'Mains Paper-1',
        qualifyingOnly: false,
        totalQuestions: 150,
        totalMarks: 150,
        durationMinutes: 150,
        marksPerQuestion: 1,
        negativeMarking: 0.33,
        sections: [
          { id: 'ap-history', name: 'Social and Cultural History of Andhra Pradesh', subjectIds: ['general-knowledge'], topicIds: ['indian-history'], count: 75, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'constitution', name: 'Indian Constitution', subjectIds: ['general-knowledge'], topicIds: ['indian-polity'], count: 75, marksPerQuestion: 1, negativeMarking: 0.33 }
        ],
        allowedSubjectIds: ['general-knowledge']
      },
      {
        stageId: 'appsc-group2-mains-p2',
        name: 'Mains Paper-II (Economy & Science & Tech)',
        shortName: 'Mains Paper-2',
        qualifyingOnly: false,
        totalQuestions: 150,
        totalMarks: 150,
        durationMinutes: 150,
        marksPerQuestion: 1,
        negativeMarking: 0.33,
        sections: [
          { id: 'economy', name: 'Indian and AP Economy', subjectIds: ['general-knowledge'], topicIds: ['indian-economy'], count: 75, marksPerQuestion: 1, negativeMarking: 0.33 },
          { id: 'sci-tech', name: 'Science and Technology', subjectIds: ['general-science'], count: 75, marksPerQuestion: 1, negativeMarking: 0.33 }
        ],
        allowedSubjectIds: ['general-knowledge', 'general-science']
      }
    ]
  }
];

/**
 * Resolve any stageId (or mock test ID prefix) to its official exam & stage config.
 */
export function getExamStageConfig(stageOrMockId) {
  const id = String(stageOrMockId || '').toLowerCase();
  if (!id) return null;

  for (const exam of EXAM_HIERARCHY) {
    for (const stage of exam.stages) {
      if (stage.stageId === id) {
        return { exam, stage };
      }
    }
  }

  if (id.startsWith('ssc-cgl-tier2')) return getExamStageConfig('ssc-cgl-tier2');
  if (id.startsWith('ssc-cgl')) return getExamStageConfig('ssc-cgl-tier1');
  if (id.startsWith('ssc-chsl-tier2')) return getExamStageConfig('ssc-chsl-tier2');
  if (id.startsWith('ssc-chsl')) return getExamStageConfig('ssc-chsl-tier1');
  if (id.startsWith('ssc-mts')) return getExamStageConfig('ssc-mts-cbe');
  if (id.includes('rrb-ntpc') && id.includes('grad')) {
    return id.includes('cbt2') || id.includes('cbt-2')
      ? getExamStageConfig('rrb-ntpc-grad-cbt2')
      : getExamStageConfig('rrb-ntpc-grad-cbt1');
  }
  if (id.includes('rrb-ntpc')) {
    return id.includes('cbt2') || id.includes('cbt-2')
      ? getExamStageConfig('rrb-ntpc-ug-cbt2')
      : getExamStageConfig('rrb-ntpc-ug-cbt1');
  }
  if (id.includes('group-d') || id.includes('level-1')) return getExamStageConfig('rrb-group-d-cbt');
  if (id.includes('appsc') && (id.includes('prelims') || id.includes('2024'))) return getExamStageConfig('appsc-group2-prelims');
  if (id.includes('appsc') && (id.includes('paper1') || id.includes('paper-1') || id.includes('-p1'))) return getExamStageConfig('appsc-group2-mains-p1');
  if (id.includes('appsc')) return getExamStageConfig('appsc-group2-mains-p2');

  return null;
}

export function getAllExamStagesFlat() {
  const rows = [];
  for (const exam of getConfigurableExamHierarchy()) {
    for (const stage of exam.stages || []) {
      rows.push({
        examId: exam.examId,
        examName: exam.name,
        examShortName: exam.shortName,
        agency: exam.agency,
        syllabusVersion: exam.syllabusVersion,
        ...stage
      });
    }
  }
  return rows;
}

/**
 * Load exam hierarchy with any admin customizations persisted in localStorage.
 */
export function getConfigurableExamHierarchy() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return EXAM_HIERARCHY;
  }
  try {
    const raw = window.localStorage.getItem(EXAM_HIERARCHY_STORAGE_KEY);
    if (!raw) return EXAM_HIERARCHY;
    const overrides = JSON.parse(raw);
    if (!Array.isArray(overrides) || overrides.length === 0) return EXAM_HIERARCHY;
    const overrideMap = new Map(overrides.map((e) => [e.examId, e]));
    return EXAM_HIERARCHY.map((base) => overrideMap.get(base.examId) || base).concat(
      overrides.filter((o) => !EXAM_HIERARCHY.some((b) => b.examId === o.examId))
    );
  } catch {
    return EXAM_HIERARCHY;
  }
}

export function saveExamHierarchyOverride(hierarchyList) {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    if (!Array.isArray(hierarchyList)) return false;
    window.localStorage.setItem(EXAM_HIERARCHY_STORAGE_KEY, JSON.stringify(hierarchyList));
    return true;
  } catch {
    return false;
  }
}

export function resetExamHierarchyOverride() {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    window.localStorage.removeItem(EXAM_HIERARCHY_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
