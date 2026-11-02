import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

// Science keywords for accurate GA classification
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
  'density', 'buoyancy', 'pascal', 'atmospheric pressure', 'barometer'
];

function classifyGAQuestion(questionText, options) {
  const combined = (questionText + ' ' + options.join(' ')).toLowerCase();
  
  // Computer awareness should stay under General Knowledge unless separate
  const isComputer = /\b(cpu|ram|rom|cache|hard disk|software|hardware|lan|wan|ip address|browser|http|url|binary|operating system|windows|linux|firewall|compiler)\b/.test(combined);
  if (isComputer) {
    return { subject: 'General Knowledge', subtopic: 'Computer Awareness' };
  }

  for (const kw of SCIENCE_KEYWORDS) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(combined)) {
      return { subject: 'General Science', subtopic: 'Physics/Chemistry/Biology' };
    }
  }

  return { subject: 'General Knowledge', subtopic: 'General Awareness' };
}

async function run() {
  console.log('Reading PDF file...');
  const pdfPath = 'public/assets/aistudio/RRB-NTPC-UG-2025-EN-All-Papers_copy_f08e8b76.pdf';
  const buf = fs.readFileSync(pdfPath);
  const parser = new PDFParse(new Uint8Array(buf));
  await parser.load();
  
  const numPages = parser.doc.numPages;
  console.log(`PDF Loaded. Total pages: ${numPages}`);

  // Page 2 is the index table
  // Let's parse all pages from 3 to numPages
  // We can track current shift metadata from header "Paper Set X · Date · Timing · English"
  const shifts = [];
  let currentShift = null;

  // Question regex patterns
  // Header line: Paper Set 1 · 07 May 2026 · 12:45 PM - 2:15 PM · English
  const shiftHeaderRegex = /Paper Set\s*(\d+)[\s·]+([^·\n]+)[\s·]+([^·\n]+)[\s·]+English/i;

  for (let pageNum = 3; pageNum <= numPages; pageNum++) {
    const page = await parser.doc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items.filter(it => it.str && it.str.trim() !== '');

    // Check for shift header
    const pageFullText = items.map(it => it.str).join(' ');
    const headerMatch = pageFullText.match(shiftHeaderRegex);
    if (headerMatch) {
      const shiftNum = parseInt(headerMatch[1], 10);
      const shiftDate = headerMatch[2].trim();
      const shiftTime = headerMatch[3].trim();
      
      if (!currentShift || currentShift.shiftNumber !== shiftNum) {
        currentShift = {
          id: `rrb-ntpc-ug-2025-shift-${shiftNum}`,
          examName: 'RRB NTPC Under Graduate (CBT-1)',
          examCode: 'RRB-NTPC-UG-2025',
          year: 2025,
          shiftNumber: shiftNum,
          shiftTitle: `RRB NTPC UG 2025 – Shift ${shiftNum}`,
          examDate: shiftDate,
          shiftTiming: shiftTime,
          pages: [pageNum],
          questions: []
        };
        shifts.push(currentShift);
        console.log(`Detected Shift ${shiftNum} (${shiftDate}, ${shiftTime}) at page ${pageNum}`);
      } else {
        currentShift.pages.push(pageNum);
      }
    } else if (currentShift) {
      currentShift.pages.push(pageNum);
    }
  }

  console.log(`\nFound ${shifts.length} shifts across ${numPages} pages.`);
}

run().catch(console.error);
