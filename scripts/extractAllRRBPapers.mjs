import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

// Comprehensive science keywords for classifying General Awareness questions
const SCIENCE_KEYWORDS = [
  'physics', 'chemistry', 'biology', 'biological', 'chemical', 'physical',
  'cell', 'cells', 'tissue', 'tissues', 'organ', 'organs', 'enzyme', 'enzymes',
  'hormone', 'hormones', 'vitamin', 'vitamins', 'protein', 'proteins', 'acid', 'acids',
  'base', 'bases', 'salt', 'ph value', 'element', 'elements', 'periodic table',
  'atom', 'atomic', 'molecule', 'molecular', 'electron', 'proton', 'neutron',
  'gravity', 'gravitation', 'acceleration', 'velocity', 'momentum', 'force',
  'friction', 'inertia', 'energy', 'kinetic', 'potential', 'work', 'power',
  'wavelength', 'frequency', 'spectrum', 'light', 'reflection', 'refraction',
  'lens', 'lenses', 'mirror', 'sound', 'ultrasonic', 'infrasonic', 'echo',
  'heat', 'temperature', 'celsius', 'kelvin', 'thermodynamics', 'conductor',
  'insulator', 'semiconductor', 'current', 'voltage', 'resistance', 'ohm',
  'ampere', 'watt', 'magnet', 'magnetic', 'electromagnetic', 'radiation',
  'photosynthesis', 'chlorophyll', 'respiration', 'digestion', 'circulatory',
  'blood', 'hemoglobin', 'heart', 'kidney', 'liver', 'brain', 'neuron', 'nervous',
  'disease', 'diseases', 'bacteria', 'bacterial', 'virus', 'viral', 'fungus', 'fungal',
  'pathogen', 'immunity', 'vaccine', 'antibiotic', 'deficiency', 'calcium',
  'iron', 'iodine', 'newton', 'einstein', 'faraday', 'bohr', 'mendel', 'darwin',
  'dna', 'rna', 'chromosome', 'gene', 'genetic', 'mitochondria', 'nucleus',
  'ecosystem', 'biodiversity', 'plant', 'plants', 'flora', 'fauna', 'mammal',
  'reptile', 'amphibian', 'vertebrate', 'invertebrate', 'species', 'botany', 'zoology',
  'metal', 'non-metal', 'metalloid', 'alloy', 'ore', 'mineral', 'rusting',
  'corrosion', 'combustion', 'distillation', 'evaporation', 'condensation',
  'density', 'buoyancy', 'pascal', 'atmospheric pressure', 'barometer', 'optics',
  'prism', 'focal length', 'concave', 'convex', 'kinetic energy', 'potential energy',
  'joule', 'newton', 'coulomb', 'radioactivity', 'isotope', 'radioactive',
  'hydrocarbon', 'alkane', 'alkene', 'alkyne', 'methane', 'ethane', 'propane',
  'carbohydrate', 'glucose', 'starch', 'cellulose', 'lipid', 'chloroplast',
  'stomata', 'xylem', 'phloem', 'pollination', 'germination', 'osmosis',
  'diffusion', 'platelets', 'wbc', 'rbc', 'antibodies', 'antigen', 'retina', 'cornea'
];

function fixLigatures(str) {
  if (!str) return '';
  return str
    .replace(/fi\s*rst/gi, 'first')
    .replace(/fi\s*nd/gi, 'find')
    .replace(/de\s*fi\s*ning/gi, 'defining')
    .replace(/pro\s*fi\s*t/gi, 'profit')
    .replace(/fi\s*gure/gi, 'figure')
    .replace(/speci\s*fi\s*c/gi, 'specific')
    .replace(/bene\s*fi\s*t/gi, 'benefit')
    .replace(/signi\s*fi\s*cant/gi, 'significant')
    .replace(/dif\s*fi\s*cult/gi, 'difficult')
    .replace(/suf\s*fi\s*cient/gi, 'sufficient')
    .replace(/ef\s*fi\s*cient/gi, 'efficient')
    .replace(/ef\s*fect/gi, 'effect')
    .replace(/af\s*fect/gi, 'affect')
    .replace(/\s+/g, ' ')
    .trim();
}

function classifyQuestion(section, num, questionText, options) {
  if (section === 'Quant' || (num >= 1 && num <= 30)) {
    return {
      subject: 'Quantitative Aptitude',
      subjectId: 'quantitative-aptitude',
      subtopic: 'Quantitative Aptitude'
    };
  }

  if (section === 'Reasoning' || (num >= 71 && num <= 100)) {
    return {
      subject: 'Reasoning',
      subjectId: 'reasoning',
      subtopic: 'Logical Reasoning'
    };
  }

  // GA Section (Q31 to Q70): Separate General Science from General Knowledge
  const combined = (questionText + ' ' + options.join(' ')).toLowerCase();

  // Explicit Computer Awareness check stays under General Knowledge
  const isComputer = /\b(cpu|ram|rom|cache|hard disk|software|hardware|lan|wan|ip address|browser|http|url|binary|operating system|windows|linux|firewall|compiler|motherboard)\b/.test(combined);
  if (isComputer) {
    return {
      subject: 'General Knowledge',
      subjectId: 'general-knowledge',
      subtopic: 'Computer Awareness'
    };
  }

  for (const kw of SCIENCE_KEYWORDS) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(combined)) {
      return {
        subject: 'General Science',
        subjectId: 'general-science',
        subtopic: `Science (${kw})`
      };
    }
  }

  return {
    subject: 'General Knowledge',
    subjectId: 'general-knowledge',
    subtopic: 'General Awareness & Studies'
  };
}

async function extractAllPapers() {
  const pdfPath = 'public/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf';
  console.log(`Loading PDF from ${pdfPath}...`);
  const buf = fs.readFileSync(pdfPath);
  const parser = new PDFParse(new Uint8Array(buf));
  await parser.load();

  const numPages = parser.doc.numPages;
  console.log(`PDF Loaded successfully. Total pages: ${numPages}`);

  // 1. Identify start page of each shift
  const shiftHeaderRegex = /Paper Set\s*(\d+)[\s·]+([^·\n]+)[\s·]+([^·\n]+)[\s·]+English/i;
  const shiftRanges = [];

  for (let p = 3; p <= numPages; p++) {
    const page = await parser.doc.getPage(p);
    const textContent = await page.getTextContent();
    const str = textContent.items.map(it => it.str).join(' ');
    const m = str.match(shiftHeaderRegex);
    if (m) {
      const shiftNum = parseInt(m[1], 10);
      const shiftDate = m[2].trim();
      const shiftTime = m[3].trim();
      shiftRanges.push({
        shiftNumber: shiftNum,
        examDate: shiftDate,
        shiftTiming: shiftTime,
        startPage: p
      });
    }
  }

  console.log(`Identified ${shiftRanges.length} shifts.`);

  // Set end pages
  for (let i = 0; i < shiftRanges.length; i++) {
    shiftRanges[i].endPage = (i + 1 < shiftRanges.length) ? shiftRanges[i + 1].startPage - 1 : numPages;
  }

  const allShifts = [];
  const allQuestions = [];
  let totalProcessed = 0;
  let totalNeedsReview = 0;

  for (const shiftMeta of shiftRanges) {
    const shiftNum = shiftMeta.shiftNumber;
    console.log(`Processing Shift ${shiftNum} (Pages ${shiftMeta.startPage} - ${shiftMeta.endPage})...`);
    
    const shiftQuestions = [];

    for (let p = shiftMeta.startPage; p <= shiftMeta.endPage; p++) {
      const page = await parser.doc.getPage(p);
      const textContent = await page.getTextContent();
      const items = textContent.items.filter(it => it.str && it.str.trim() !== '');

      // Process 2 columns: Left (x < 290) and Right (x >= 290)
      for (const col of [items.filter(it => it.transform[4] < 290), items.filter(it => it.transform[4] >= 290)]) {
        col.sort((a,b) => b.transform[5] - a.transform[5]);

        let currentQ = null;

        for (let i = 0; i < col.length; i++) {
          const it = col[i];
          const text = it.str.trim();

          const qMatch = text.match(/^Q(\d+)\s*(Quant|GA|Reasoning)?$/);
          if (qMatch) {
            if (currentQ) shiftQuestions.push(currentQ);
            const num = parseInt(qMatch[1], 10);
            let sec = qMatch[2] || '';
            if (!sec) {
              const next = col[i + 1]?.str?.trim();
              if (next === 'Quant' || next === 'GA' || next === 'Reasoning') sec = next;
              else if (num <= 30) sec = 'Quant';
              else if (num <= 70) sec = 'GA';
              else sec = 'Reasoning';
            }

            currentQ = {
              num,
              section: sec,
              qTextParts: [],
              options: { A: [], B: [], C: [], D: [] },
              currentOpt: null,
              optCoords: {},
              ticks: []
            };
            continue;
          }

          if (text === '✓') {
            if (currentQ) currentQ.ticks.push(it.transform[5]);
            continue;
          }

          const optMatch = text.match(/^([A-D])\.\s*(.*)$/);
          if (optMatch && currentQ) {
            const optLetter = optMatch[1];
            currentQ.currentOpt = optLetter;
            currentQ.optCoords[optLetter] = it.transform[5];
            if (optMatch[2]) currentQ.options[optLetter].push(optMatch[2]);
            continue;
          }

          if (currentQ) {
            if (text.includes('Paper Set') || text.includes('Blackbook') || text.includes('--') || text === 'Quant' || text === 'GA' || text === 'Reasoning') {
              continue;
            }
            if (currentQ.currentOpt) {
              currentQ.options[currentQ.currentOpt].push(text);
            } else {
              currentQ.qTextParts.push(text);
            }
          }
        }
        if (currentQ) shiftQuestions.push(currentQ);
      }
    }

    // Deduplicate by question number (take best parsed)
    const qMap = new Map();
    for (const q of shiftQuestions) {
      if (!qMap.has(q.num) || q.qTextParts.length > qMap.get(q.num).qTextParts.length) {
        qMap.set(q.num, q);
      }
    }

    const processedShiftQuestions = [];

    for (let qNum = 1; qNum <= 100; qNum++) {
      const raw = qMap.get(qNum);
      if (!raw) {
        console.warn(`Shift ${shiftNum}: Missing Q${qNum}`);
        continue;
      }

      const qText = fixLigatures(raw.qTextParts.join(' '));
      const optA = fixLigatures(raw.options.A.join(' '));
      const optB = fixLigatures(raw.options.B.join(' '));
      const optC = fixLigatures(raw.options.C.join(' '));
      const optD = fixLigatures(raw.options.D.join(' '));

      // Determine correct answer by nearest option coordinate to tick
      let correctIndex = 0; // default 0 (A)
      let detectedOptionLetter = 'A';
      let hasTick = false;

      if (raw.ticks.length > 0) {
        hasTick = true;
        const tickY = raw.ticks[0];
        let minDiff = 9999;
        const letters = ['A', 'B', 'C', 'D'];
        letters.forEach((letter, idx) => {
          if (raw.optCoords[letter] !== undefined) {
            const diff = Math.abs(raw.optCoords[letter] - tickY);
            if (diff < minDiff) {
              minDiff = diff;
              correctIndex = idx;
              detectedOptionLetter = letter;
            }
          }
        });
      }

      // Check completeness
      const isComplete = qText.length > 5 && optA.length > 0 && optB.length > 0 && optC.length > 0 && optD.length > 0 && hasTick;
      const status = isComplete ? 'Published' : 'Needs Review';
      if (!isComplete) totalNeedsReview++;

      // Subject classification
      const classification = classifyQuestion(raw.section, qNum, qText, [optA, optB, optC, optD]);

      const questionObj = {
        id: `rrb-ntpc-2025-s${shiftNum}-q${qNum}`,
        shiftNumber: shiftNum,
        examName: 'RRB NTPC UG 2025 (CBT-1)',
        examYear: '2025',
        examDate: shiftMeta.examDate,
        shiftTiming: shiftMeta.shiftTiming,
        questionNumber: qNum,
        sectionOriginal: raw.section,
        subject: classification.subject,
        subjectId: classification.subjectId,
        subtopic: classification.subtopic,
        question: {
          en: qText,
          te: '' // Telugu translation placeholder for admin editing
        },
        options: {
          en: [optA, optB, optC, optD],
          te: ['', '', '', '']
        },
        correctAnswer: correctIndex, // 0 = A, 1 = B, 2 = C, 3 = D
        correctLetter: detectedOptionLetter,
        explanation: {
          en: `Official Answer: Option (${detectedOptionLetter}). Excerpt from RRB NTPC UG 2025 CBT-1 Shift ${shiftNum} held on ${shiftMeta.examDate}.`,
          te: ''
        },
        status, // 'Published' | 'Needs Review'
        source: 'RRB Official Answer Key (CEN 07/2025)',
        createdAt: new Date().toISOString()
      };

      processedShiftQuestions.push(questionObj);
      allQuestions.push(questionObj);
      totalProcessed++;
    }

    // Counts per subject in this shift
    const subjectCounts = {
      'Quantitative Aptitude': 0,
      'General Knowledge': 0,
      'General Science': 0,
      'Reasoning': 0
    };
    for (const q of processedShiftQuestions) {
      if (subjectCounts[q.subject] !== undefined) subjectCounts[q.subject]++;
    }

    allShifts.push({
      id: `rrb-ntpc-ug-2025-shift-${shiftNum}`,
      code: `RRB-NTPC-S${shiftNum}`,
      shiftNumber: shiftNum,
      title: `RRB NTPC UG 2025 – Shift ${shiftNum}`,
      subtitle: `${shiftMeta.examDate} · ${shiftMeta.shiftTiming}`,
      examName: 'RRB NTPC Under Graduate 2025 (CEN 07/2025)',
      examYear: '2025',
      examDate: shiftMeta.examDate,
      shiftTiming: shiftMeta.shiftTiming,
      durationMinutes: 90,
      totalMarks: 100,
      negativeMarking: 0.33,
      totalQuestions: processedShiftQuestions.length,
      subjectCounts,
      questionsCount: processedShiftQuestions.length,
      status: 'Published'
    });
  }

  console.log(`\n=== EXTRACTION SUMMARY ===`);
  console.log(`Total Shifts Processed: ${allShifts.length}`);
  console.log(`Total Questions Processed: ${totalProcessed}`);
  console.log(`Total Marked Needs Review: ${totalNeedsReview}`);

  // Ensure output directory exists
  fs.mkdirSync('src/data', { recursive: true });
  fs.mkdirSync('public/data', { recursive: true });

  // Save full JSON to public/data for fast client fetching
  const fullPayload = {
    metadata: {
      generatedAt: new Date().toISOString(),
      examName: 'RRB NTPC UG 2025 (CEN 07/2025)',
      totalShifts: allShifts.length,
      totalQuestions: allQuestions.length,
      subjects: [
        'General Knowledge',
        'Reasoning',
        'Quantitative Aptitude',
        'General Science'
      ]
    },
    shifts: allShifts,
    questions: allQuestions
  };

  fs.writeFileSync('public/data/rrbNtpc2025Full.json', JSON.stringify(fullPayload, null, 2));
  console.log('Saved to public/data/rrbNtpc2025Full.json');

  // Save lightweight metadata & summary in src/data/rrbNtpcMetadata.js
  const metadataJs = `// Auto-generated RRB NTPC UG 2025 Shift Metadata & Subject Catalog
export const RRB_NTPC_SHIFTS = ${JSON.stringify(allShifts, null, 2)};

export const RRB_CORE_SUBJECTS = [
  {
    id: 'general-knowledge',
    title: 'General Knowledge',
    name: 'General Knowledge (GK & GA)',
    description: 'Indian History, Geography, Indian Polity, Economy, Static GK, Current Affairs, Schemes',
    color: 'from-amber-600 to-amber-700',
    badge: 'GK & GA',
    topics: ['Indian History', 'Geography', 'Polity & Constitution', 'Economy', 'Static GK', 'Current Affairs', 'Government Schemes']
  },
  {
    id: 'reasoning',
    title: 'Reasoning',
    name: 'General Intelligence & Reasoning',
    description: 'Analogy, Coding-Decoding, Series, Blood Relations, Direction Sense, Syllogisms & Puzzles',
    color: 'from-emerald-600 to-emerald-700',
    badge: 'Reasoning',
    topics: ['Analogy', 'Coding-Decoding', 'Series', 'Blood Relations', 'Direction Sense', 'Syllogism', 'Venn Diagrams']
  },
  {
    id: 'quantitative-aptitude',
    title: 'Quantitative Aptitude',
    name: 'Quantitative Aptitude (Quant)',
    description: 'Arithmetic, Percentage, Profit & Loss, SI/CI, Time & Work, Algebra, Geometry & Mensuration',
    color: 'from-blue-600 to-blue-700',
    badge: 'Quant',
    topics: ['Percentage', 'Profit & Loss', 'SI & CI', 'Ratio & Proportion', 'Time & Work', 'Algebra', 'Mensuration']
  },
  {
    id: 'general-science',
    title: 'General Science',
    name: 'General Science (Physics, Chemistry, Biology)',
    description: 'Physics, Chemistry, Biology, Human Body, Scientific Principles & Tech extracted from GA',
    color: 'from-purple-600 to-purple-700',
    badge: 'Science',
    topics: ['Physics', 'Chemistry', 'Biology', 'Human Body', 'Scientific Principles', 'Applied Science']
  }
];
`;

  fs.writeFileSync('src/data/rrbNtpcMetadata.js', metadataJs);
  console.log('Saved to src/data/rrbNtpcMetadata.js');
}

extractAllPapers().catch(console.error);
