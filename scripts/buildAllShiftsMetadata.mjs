import fs from 'fs';

const ug = JSON.parse(fs.readFileSync('public/data/rrbNtpcUg2024Full.json', 'utf8'));
const grad2024 = JSON.parse(fs.readFileSync('public/data/rrbNtpcGraduate2024Full.json', 'utf8'));
const grad2026 = JSON.parse(fs.readFileSync('public/data/rrbNtpcGraduate2025Full.json', 'utf8'));
const ssc2020 = JSON.parse(fs.readFileSync('public/data/sscCgl2020Full.json', 'utf8'));
const ssc2026 = JSON.parse(fs.readFileSync('public/data/sscCgl2026Full.json', 'utf8'));

// 1. All Shifts Metadata
const allShifts = [
  ...ug.shifts,
  ...grad2024.shifts,
  ...grad2026.shifts,
  ...ssc2020.shifts,
  ...ssc2026.shifts
];

console.log(`Aggregating metadata for ${allShifts.length} total CBT exam shifts...`);

const allShiftsCode = `// Auto-generated ${allShifts.length} CBT Exam Shifts Metadata\nexport const ALL_CBT_SHIFTS = ${JSON.stringify(allShifts, null, 2)};\n`;
fs.writeFileSync('src/data/allShiftsMetadata.js', allShiftsCode, 'utf8');
console.log('Saved src/data/allShiftsMetadata.js successfully.');

// 2. RRB NTPC Metadata with 57 UG shifts & core subjects
const CORE_SUBJECTS = [
  {
    id: 'general-knowledge',
    title: 'General Knowledge',
    name: 'General Knowledge (GK & GA)',
    description: 'Indian History, Geography, Indian Polity, Economy, Static GK, Current Affairs, Schemes',
    color: 'from-amber-600 to-amber-700',
    badge: 'GK & GA',
    topics: [
      'Indian Polity & Constitution',
      'Indian History',
      'Geography',
      'Indian Economy',
      'Static GK & Culture',
      'Current Affairs',
      'Environment & Ecology',
      'Government Schemes'
    ]
  },
  {
    id: 'reasoning',
    title: 'Reasoning',
    name: 'General Intelligence & Reasoning',
    description: 'Analogy, Coding-Decoding, Series, Blood Relations, Direction Sense, Syllogisms & Puzzles',
    color: 'from-emerald-600 to-emerald-700',
    badge: 'Reasoning',
    topics: [
      'Series & Coding-Decoding',
      'Blood Relations & Direction Sense',
      'Syllogisms & Statements',
      'Puzzles & Seating Arrangement',
      'Analogy & Classification',
      'Non-Verbal Reasoning'
    ]
  },
  {
    id: 'quantitative-aptitude',
    title: 'Quantitative Aptitude',
    name: 'Quantitative Aptitude (Quant)',
    description: 'Arithmetic, Percentage, Profit & Loss, SI/CI, Time & Work, Algebra, Geometry & Mensuration',
    color: 'from-blue-600 to-blue-700',
    badge: 'Quant',
    topics: [
      'Number System & Simplification',
      'Percentage, Profit & Loss',
      'Ratio, Proportion & Mixtures',
      'Time, Speed, Distance & Work',
      'Mensuration & Geometry',
      'Algebra & Trigonometry',
      'Data Interpretation'
    ]
  },
  {
    id: 'general-science',
    title: 'General Science',
    name: 'General Science (Physics, Chemistry, Biology)',
    description: 'Physics, Chemistry, Biology, Scientific Principles & Tech',
    color: 'from-purple-600 to-purple-700',
    badge: 'Science',
    topics: ['Physics', 'Chemistry', 'Biology']
  }
];

const rrbNtpcCode = `// Auto-generated RRB NTPC UG 2024 (${ug.shifts.length} Official Shifts) Metadata & Subject Catalog\nexport const RRB_NTPC_SHIFTS = ${JSON.stringify(ug.shifts, null, 2)};\n\nexport const RRB_CORE_SUBJECTS = ${JSON.stringify(CORE_SUBJECTS, null, 2)};\n`;
fs.writeFileSync('src/data/rrbNtpcMetadata.js', rrbNtpcCode, 'utf8');
console.log('Saved src/data/rrbNtpcMetadata.js successfully.');
