/**
 * Conceptual Multi-Signal Question Classifier, Provenance Separator & Quality Validator
 *
 * Strictly separates:
 *   1. Original Paper Provenance (originExamId, stage, year, shift, paperId, originalOrder)
 *   2. Conceptual Classification (subjectId, topicId, subtopic, confidence, tier, secondaryTags)
 *   3. Exam Eligibility Mapping (eligibleExams[] for full-length & sectional mocks)
 *   4. Non-Destructive Quality Flags (never auto-deletes or mutates correctAnswer/id)
 *
 * Pure JS module (no React/browser-only APIs) shared between Node audit scripts and Vite SPA.
 */

import { CANONICAL_SUBJECTS, SUBJECT_TOPIC_TREE } from '../constants/examHierarchy.js';

const SUBJECT_NAME_BY_ID = Object.fromEntries(CANONICAL_SUBJECTS.map((s) => [s.id, s.name]));

const LEGACY_CATEGORY_BY_SUBJECT_ID = {
  'general-knowledge': 'gk',
  'current-affairs': 'gk',
  'quantitative-aptitude': 'quant',
  reasoning: 'reasoning',
  'general-science': 'gk',
  'english-language': 'english',
  'computer-science': 'cse'
};

const TOPIC_NAME_BY_ID = {};
for (const topics of Object.values(SUBJECT_TOPIC_TREE)) {
  for (const t of topics) {
    TOPIC_NAME_BY_ID[t.id] = t.name;
  }
}

export function getQuestionText(q) {
  if (!q) return '';
  if (typeof q.question === 'string') return q.question.trim();
  if (typeof q.question?.en === 'string' && q.question.en.trim()) return q.question.en.trim();
  if (typeof q.question?.te === 'string' && q.question.te.trim()) return q.question.te.trim();
  if (typeof q.questionText === 'string') return q.questionText.trim();
  return '';
}

export function getOptionTexts(q) {
  if (!q || !q.options) return [];
  if (Array.isArray(q.options?.en)) return q.options.en.map((o) => String(o ?? '').trim());
  if (Array.isArray(q.options)) return q.options.map((o) => String(o ?? '').trim());
  if (typeof q.options === 'object') {
    const letters = ['A', 'B', 'C', 'D'];
    const byLetter = letters.map((l) => q.options[l]).filter((v) => v !== undefined);
    if (byLetter.length > 0) return byLetter.map((o) => String(o ?? '').trim());
    return Object.values(q.options).filter((v) => typeof v === 'string').map((o) => o.trim());
  }
  return [];
}

function getExplanationText(q) {
  if (!q) return '';
  if (typeof q.explanation === 'string') return q.explanation.trim();
  if (typeof q.explanation?.en === 'string') return q.explanation.en.trim();
  return '';
}

function normalizeSectionPrior(sectionName, q = null) {
  const s = String(sectionName || '').toLowerCase().trim();
  if (!s || s === 'none') {
    // RRB NTPC UG 2024 papers strictly follow Q1-30 Math, Q31-60 Reasoning, Q61-100 GA
    const id = String(q?.id || '').toLowerCase();
    const num = Number(q?.questionNumber || 0);
    if (id.startsWith('rrb-ntpc-ug-2024') && num >= 1 && num <= 100) {
      if (num <= 30) return { subjectId: 'quantitative-aptitude', strict: true };
      if (num <= 60) return { subjectId: 'reasoning', strict: true };
      return { subjectId: 'general-knowledge', strict: false, isMixedGA: true };
    }
    return null;
  }

  if (s.includes('english')) return { subjectId: 'english-language', strict: true };
  if (s.includes('mathematics') || s.includes('quantitative') || s.includes('numerical ability')) {
    return { subjectId: 'quantitative-aptitude', strict: true };
  }
  if (s.includes('intelligence') || s.includes('reasoning')) {
    return { subjectId: 'reasoning', strict: true };
  }
  if (s === 'mental ability') {
    // APPSC Prelims Mental Ability mixes Reasoning & Basic Numeracy
    return { subjectId: 'reasoning', strict: false, allowQuantOverride: true };
  }
  if (s === 'general science') {
    return { subjectId: 'general-science', strict: true };
  }
  if (s.includes('science and technology') || s.includes('science & technology')) {
    return { subjectId: 'general-science', strict: false };
  }
  if (s.includes('history')) return { subjectId: 'general-knowledge', topicId: 'indian-history', strict: true };
  if (s.includes('constitution') || s.includes('polity')) return { subjectId: 'general-knowledge', topicId: 'indian-polity', strict: true };
  if (s.includes('geography')) return { subjectId: 'general-knowledge', topicId: 'geography', strict: true };
  if (s.includes('economy')) return { subjectId: 'general-knowledge', topicId: 'indian-economy', strict: true };
  if (s.includes('indian society')) return { subjectId: 'general-knowledge', topicId: 'government-schemes', strict: true };
  if (s === 'current affairs') return { subjectId: 'current-affairs', strict: false };
  if (s.includes('general awareness')) return { subjectId: 'general-knowledge', strict: false, isMixedGA: true };
  return null;
}

/**
 * Extract immutable original paper provenance from any question record.
 */
export function extractProvenance(q) {
  const id = String(q?.id || '');
  const examType = String(q?.examType || '');
  const examLevel = String(q?.examLevel || '');
  const examName = String(q?.examName || '');
  const shiftNum = Number(q?.shiftNumber || q?.setNumber || 1) || 1;
  let originExamId = 'custom';
  let originStage = 'practice';
  let examYear = String(q?.examYear || '');

  if (examType === 'APPSC Group II' || id.includes('appsc')) {
    originExamId = 'appsc-group-2';
    if (q?.paperNumber === 0 || examYear === '2024' || id.includes('2024-prelims') || examName.toLowerCase().includes('prelims')) {
      originStage = 'appsc-group2-prelims';
      examYear = '2024';
    } else if (q?.paperNumber === 1 || id.includes('-p1-') || id.includes('paper1')) {
      originStage = 'appsc-group2-mains-p1';
      examYear = examYear || '2025';
    } else {
      originStage = 'appsc-group2-mains-p2';
      examYear = examYear || '2025';
    }
  } else if (examType === 'RRB Group D' || id.includes('rrb-group-d')) {
    originExamId = 'rrb-group-d';
    originStage = 'rrb-group-d-cbt';
    examYear = examYear || '2025';
  } else if (examType === 'SSC CGL' || id.startsWith('ssc-cgl')) {
    originExamId = 'ssc-cgl';
    originStage = 'ssc-cgl-tier1';
    examYear = examYear || (id.includes('2026') ? '2026' : '2020');
  } else if (examLevel === 'Graduate' || id.includes('rrb-ntpc-grad')) {
    originExamId = 'rrb-ntpc';
    originStage = 'rrb-ntpc-grad-cbt1';
    const is2026 =
      examYear === '2026' ||
      id.includes('grad-2026') ||
      String(q?.examDate || '').includes('2026') ||
      String(q?.examDate || '').includes('Mar');
    examYear = is2026 ? '2026' : '2024';
  } else if (examLevel === 'Under Graduate' || id.includes('rrb-ntpc-ug')) {
    originExamId = 'rrb-ntpc';
    originStage = 'rrb-ntpc-ug-cbt1';
    examYear = examYear || '2024';
  } else if (q?._sourceOrigin === 'current-affairs' || id.startsWith('oct25-') || id.startsWith('nov25-') || id.startsWith('dec25-') || id.startsWith('jan26-')) {
    originExamId = 'current-affairs-compendium';
    originStage = 'current-affairs';
    examYear = id.startsWith('jan26-') ? '2026' : '2025';
  }

  const paperId = q?.shiftId || `${originStage}-${examYear || 'bank'}-shift-${shiftNum}`;
  const originalOrder = Number(q?.originalOrder || q?.questionNumber || 0) || null;

  return {
    originExamId,
    originExamName: examName || examType || 'Custom Question Bank',
    originStage,
    examYear: examYear || null,
    examDate: q?.examDate || null,
    shiftNumber: q?.shiftNumber || q?.setNumber || null,
    paperId,
    sectionName: q?.sectionName || null,
    paperUrl: q?.paperUrl || null,
    paperFileName: q?.paperFileName || null,
    originalOrder
  };
}

function classifyReasoningDetail(t) {
  if (/\b(sitting around|circular table|facing the centre|facing centre|sit in a row|standing in a row|straight line|parallel rows?|immediate left|immediate right|eighth floor|seven floors?|six boxes|seven people [a-z],|eight friends|eight persons)\b/i.test(t)) {
    return { topicId: 'puzzles-seating', subtopic: 'Circular & Linear Seating Arrangement', confidence: 97 };
  }
  if (/\b(syllogism|statements? and conclusions?|statements? and assumptions?|read the given statements|some .* are .*|all .* are .*|no .* is .*|conclusion\s*i|conclusions?\s*(follow|follows))\b/i.test(t)) {
    return { topicId: 'syllogism-conclusions', subtopic: 'Syllogism & Logical Conclusions', confidence: 97 };
  }
  if (/\b(venn diagram|represents? .* best|best illustrates the relationship)\b/i.test(t)) {
    return { topicId: 'syllogism-conclusions', subtopic: 'Venn Diagrams', confidence: 96 };
  }
  if (/\b(mirror image|water image|paper is folded|unfolded|dice|opposite face|cube|embedded figure|next figure|rotates? clockwise)\b/i.test(t)) {
    return { topicId: 'non-verbal-reasoning', subtopic: 'Mirror Image, Dice & Visual Reasoning', confidence: 96 };
  }
  if (/\b(blood relation|daughter of|son of|father of|mother of|sister of|brother of|husband of|wife of|paternal|maternal|uncle|aunt|son-in-law|daughter-in-law|pointing to a photograph|introducing a)\b/i.test(t) || /[#@&$%]\s*means/i.test(t)) {
    return { topicId: 'blood-relations-directions', subtopic: 'Blood Relations', confidence: 96 };
  }
  if (/\b(drives?\s+\d+|walks?\s+\d+|turns? left|turns? right|takes? a (left|right) turn|facing (north|south|east|west)|towards (north|south|east|west)|shortest distance from .* starting point|clockwise|anticlockwise)\b/i.test(t)) {
    return { topicId: 'blood-relations-directions', subtopic: 'Direction & Distance', confidence: 96 };
  }
  if (/\b(standing in a row|rank from (the )?(left|right|top|bottom)|from the (left|right) end|tallest|shortest|heavier than|lighter than|older than|younger than)\b/i.test(t)) {
    return { topicId: 'blood-relations-directions', subtopic: 'Order & Ranking', confidence: 95 };
  }
  if (/\b(calendar|day of the week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|leap year|angle between .* hands of a clock)\b/i.test(t) && /\b(clock|hand|date|january|february|march|april|may|june|july|august|september|october|november|december|day)\b/i.test(t)) {
    return { topicId: 'blood-relations-directions', subtopic: 'Calendar & Clock', confidence: 93 };
  }
  if (/\b(code language|certain code|coded as|decoded as|is written as\s*['"‘]?[A-Z0-9$#@]{2,})\b/i.test(t)) {
    return { topicId: 'series-coding-decoding', subtopic: 'Coding-Decoding', confidence: 97 };
  }
  if (/\b(interchang(ed|ing)|comes? in place of|come in place of|replace the question mark|question mark|\?\s*$|missing number|letter[- ]?number cluster|letter[- ]?cluster|alphabetical order|english alphabetical|english dictionary|meaningful order|denotes\s*['"‘]?[+\-×÷*/]|stands for\s*['"‘]?[+\-×÷*/])\b/i.test(t)) {
    return { topicId: 'series-coding-decoding', subtopic: 'Series & Mathematical Operations', confidence: 96 };
  }
  if (/\b(same relationship|related to the third|odd one out|three of the following four|different from the rest|different in some manner|pair of words|number-?pairs)\b/i.test(t)) {
    return { topicId: 'analogies-classification', subtopic: 'Analogy & Classification', confidence: 96 };
  }
  return { topicId: 'series-coding-decoding', subtopic: 'General Reasoning & Series', confidence: 86 };
}

function classifyQuantDetail(t, optsText = '') {
  const combined = `${t} ${optsText}`;
  if (/\b(sin\s*[θa-z0-9]|cos\s*[θa-z0-9]|tan\s*[θa-z0-9]|cot\s*[θa-z0-9]|sec\s*[θa-z0-9]|cosec\s*[θa-z0-9]|trigonometr|angle of elevation|angle of depression)\b/i.test(combined)) {
    return { topicId: 'algebra-trigonometry', subtopic: 'Trigonometry & Heights/Distances', confidence: 97 };
  }
  if (/\b(polynomial|quadratic|root of the equation|x\s*\+\s*1\/x|x\^2|algebraic|linear equation|simplify.*x|value of k|x\s*-\s*y\s*=|a\s*\+\s*b\s*=)\b/i.test(t)) {
    return { topicId: 'algebra-trigonometry', subtopic: 'Algebra & Equations', confidence: 95 };
  }
  if (/\b(pie chart|bar graph|histogram|line graph|given table|following table|standard deviation|variance|median|mode of|probability|dice is thrown|card is drawn|at random)\b/i.test(t)) {
    return { topicId: 'data-interpretation', subtopic: 'Data Interpretation, Statistics & Probability', confidence: 96 };
  }
  if (/\b(triangle|chord|tangent|secant|congruent|similar triangles|isosceles|equilateral|parallelogram|rhombus|trapezium|cyclic quadrilateral|incentre|circumcentre|orthocentre|centroid|angle\s+[a-z]{3})\b/i.test(t)) {
    return { topicId: 'mensuration-geometry', subtopic: 'Geometry (Triangles, Circles & Angles)', confidence: 96 };
  }
  if (/\b(area of|perimeter of|circumference|volume of|surface area|curved surface|total surface|cylinder|cone|sphere|hemisphere|cuboid|cube|prism|pyramid|radius|diameter|diagonal|mensuration)\b/i.test(t)) {
    return { topicId: 'mensuration-geometry', subtopic: 'Mensuration (2D & 3D)', confidence: 96 };
  }
  if (/\b(simple interest|compound interest|compounded annually|compounded half-yearly|sum of money|rate of interest|per annum|principal)\b/i.test(t)) {
    return { topicId: 'percentage-profit-loss', subtopic: 'Simple & Compound Interest', confidence: 97 };
  }
  if (/\b(cost price|selling price|marked price|profit|loss|gain percent|discount|successive discount|shopkeeper|article for ₹|sold an article)\b/i.test(t)) {
    return { topicId: 'percentage-profit-loss', subtopic: 'Profit, Loss & Discount', confidence: 97 };
  }
  if (/\b(percentage|percent|%\s*(of|more|less|increase|decrease|population|salary|income|expenditure|votes|election))\b/i.test(t)) {
    return { topicId: 'percentage-profit-loss', subtopic: 'Percentage', confidence: 96 };
  }
  if (/\b(pipe|cistern|fill a tank|empty the tank|working alone|can do a piece of work|complete the work|efficiency|men and \d+ women|days to complete|wages)\b/i.test(t)) {
    return { topicId: 'time-speed-distance-work', subtopic: 'Time & Work / Pipes & Cisterns', confidence: 97 };
  }
  if (/\b(speed of|km\/h|kmph|m\/s|train|platform|crosses a pole|upstream|downstream|boat|stream|average speed|relative speed|time taken to cover|distance between)\b/i.test(t)) {
    return { topicId: 'time-speed-distance-work', subtopic: 'Time, Speed, Distance, Trains & Boats', confidence: 97 };
  }
  if (/\b(ratio|proportion|mean proportional|third proportional|fourth proportional|mixture|alligation|milk and water|alloy|partnership|invested|present age|years ago|years hence|average of|average weight|average marks)\b/i.test(t)) {
    return { topicId: 'ratio-proportion-mixtures', subtopic: 'Ratio, Proportion, Averages & Mixtures', confidence: 96 };
  }
  if (/\b(hcf|lcm|greatest common|least common|divisible by|remainder|unit digit|prime number|co-prime|composite|natural numbers|whole numbers|simplify|evaluate|value of|bodmas|fraction|surds|indices|square root|cube root|decimal)\b/i.test(t)) {
    return { topicId: 'number-system', subtopic: 'Number System, HCF/LCM & Simplification', confidence: 95 };
  }
  return { topicId: 'number-system', subtopic: 'Arithmetic & Quantitative Aptitude', confidence: 88 };
}

function classifyEnglishDetail(t) {
  if (/\b(meaning of the given idiom|idiom|phrase|proverb)\b/i.test(t)) {
    return { topicId: 'idioms-phrases', subtopic: 'Idioms & Phrases', confidence: 97 };
  }
  if (/\b(one-?word substitute|group of words|correctly spelt|incorrectly spelt|wrongly spelt|misspelt)\b/i.test(t)) {
    return { topicId: 'one-word-substitution', subtopic: 'One-Word Substitution & Spelling', confidence: 97 };
  }
  if (/\b(synonym|antonym|nearest in meaning|opposite in meaning)\b/i.test(t)) {
    return { topicId: 'vocabulary', subtopic: 'Synonyms & Antonyms', confidence: 97 };
  }
  if (/\b(passage|comprehension|cloze test|blank no\.)\b/i.test(t)) {
    return { topicId: 'reading-comprehension', subtopic: 'Reading Comprehension & Cloze Test', confidence: 97 };
  }
  if (/\b(jumbled order|rearrange|para-?jumble|meaningful and coherent paragraph)\b/i.test(t)) {
    return { topicId: 'sentence-rearrangement', subtopic: 'Sentence Rearrangement (Para Jumbles)', confidence: 96 };
  }
  if (/\b(grammatical error|segment that contains|no substitution|passive voice|active voice|indirect speech|direct speech|reported speech|fill in the blank|appropriate option to substitute|improve the underlined)\b/i.test(t)) {
    return { topicId: 'grammar-error-spotting', subtopic: 'Grammar, Error Spotting & Voice/Narration', confidence: 97 };
  }
  return { topicId: 'grammar-error-spotting', subtopic: 'English Usage & Grammar', confidence: 88 };
}

function classifyComputerDetail(t) {
  if (/\b(sql|rdbms|dbms|database|primary key|foreign key|candidate key|normalization|er diagram|relational algebra|tuple|acid properties)\b/i.test(t)) {
    return { topicId: 'dbms', subtopic: 'DBMS & SQL', confidence: 96 };
  }
  if (/\b(operating system|windows\s+(xp|7|10|11|os|nt)|linux|unix|ms-?dos|kernel|deadlock|paging|virtual memory|scheduling algorithm|booting|file system|command prompt)\b/i.test(t)) {
    return { topicId: 'operating-systems', subtopic: 'Operating Systems', confidence: 96 };
  }
  if (/\b(osi model|tcp\/ip|http|https|ftp|smtp|dns|dhcp|ip address|mac address|lan|wan|man|router|switch|modem|firewall|topology|ethernet|bandwidth|web browser|hypertext|url|e-?mail)\b/i.test(t)) {
    return { topicId: 'computer-networks', subtopic: 'Computer Networks & Internet', confidence: 96 };
  }
  if (/\b(logic gate|nand|nor|xor|truth table|flip-?flop|hexadecimal|octal|binary number|2'?s complement|ascii|unicode|ebcdic|boolean algebra|alu|register)\b/i.test(t)) {
    return { topicId: 'digital-logic', subtopic: 'Digital Logic & Number Systems', confidence: 96 };
  }
  if (/\b(data structure|linked list|binary tree|stack|queue|lifo|fifo|time complexity|big-?o|sorting algorithm|traversal|recursion)\b/i.test(t)) {
    return { topicId: 'data-structures-algorithms', subtopic: 'Data Structures & Algorithms', confidence: 95 };
  }
  if (/\b(compiler|assembler|interpreter|object-?oriented|polymorphism|encapsulation|inheritance|python|java|c\+\+|html|css|xml|javascript|machine language|assembly language|fortran|cobol)\b/i.test(t)) {
    return { topicId: 'programming-oop', subtopic: 'Programming Languages & OOP', confidence: 95 };
  }
  if (/\b(malware|ransomware|phishing|trojan|spyware|adware|worm|antivirus|cyber security|cryptography|encryption|sdlc|waterfall model|agile|software testing)\b/i.test(t)) {
    return { topicId: 'software-engineering', subtopic: 'Cyber Security & Software Engineering', confidence: 95 };
  }
  return { topicId: 'computer-fundamentals', subtopic: 'Computer Fundamentals & MS Office', confidence: 93 };
}

function classifyScienceDetail(t) {
  const phy = /\b(newton|ohm|volt|ampere|watt|joule|hertz|tesla|si unit|velocity|acceleration|momentum|inertia|gravitation|friction|concave|convex|lens|mirror|refraction|reflection|diffraction|dispersion|prism|wavelength|frequency|decibel|sound wave|magnetic|electromagnetic|thermodynamics|specific heat|nuclear|fission|fusion|kinetic energy|potential energy|pressure|buoyancy|archimedes|barometer|ammeter|voltmeter|galvanometer|resistance|capacitance|semiconductor|diode)\b/i.test(t);
  const chem = /\b(atomic number|mass number|isotope|isobar|valency|periodic table|mendeleev|ph value|ph scale|acid|base|alkali|neutralization|salt|oxidation|reduction|redox|catalyst|polymer|vulcanization|alloy|brass|bronze|steel|amalgam|hydrocarbon|alkane|alkene|alkyne|functional group|ethanol|methane|bleaching powder|baking soda|washing soda|plaster of paris|gypsum|noble gas|halogen|electrolysis|ionic bond|covalent bond|avogadro|mole concept|chemical formula)\b/i.test(t);
  const bio = /\b(cell|mitochondria|ribosome|chloroplast|lysosome|nucleus|prokaryot|eukaryot|mitosis|meiosis|dna|rna|chromosome|gene|genetics|mendel|vitamin|deficiency|scurvy|beriberi|rickets|pellagra|haemoglobin|blood group|platelet|rbc|wbc|heart|kidney|nephron|neuron|endocrine|hormone|insulin|thyroid|pituitary|photosynthesis|chlorophyll|xylem|phloem|stomata|transpiration|bryophyte|pteridophyte|angiosperm|bacteria|fungi|protozoa|malaria|tuberculosis|cholera|typhoid|vaccine|enzyme|amylase|pepsin|digestion|respiration|pathogen|retrovirus|hiv|aids|lymphocytes?|antibod(y|ies)|antigens?|viral)\b/i.test(t) || (/\bvirus\b/i.test(t) && !/\b(malware|trojan|antivirus|computer|software|worm|ransomware|phishing|cyber)\b/i.test(t));

  if (bio && !phy && !chem) return { topicId: 'biology', subtopic: 'Biology & Life Sciences', confidence: 96 };
  if (chem && !phy && !bio) return { topicId: 'chemistry', subtopic: 'Chemistry', confidence: 96 };
  if (phy && !chem && !bio) return { topicId: 'physics', subtopic: 'Physics', confidence: 96 };
  if (bio) return { topicId: 'biology', subtopic: 'Biology & Life Sciences', confidence: 90 };
  if (chem) return { topicId: 'chemistry', subtopic: 'Chemistry', confidence: 90 };
  if (phy) return { topicId: 'physics', subtopic: 'Physics', confidence: 90 };
  return { topicId: 'physics', subtopic: 'General Science & Technology', confidence: 82 };
}

function classifyGkDetail(t, sectionTopicId = null) {
  if (sectionTopicId) {
    return {
      topicId: sectionTopicId,
      subtopic: TOPIC_NAME_BY_ID[sectionTopicId] || 'General Knowledge',
      confidence: 96
    };
  }
  if (/\b(constitution|article\s+\d+|amendment|preamble|fundamental rights?|fundamental duties|directive principles?|dpsp|parliament|lok sabha|rajya sabha|president of india|vice[- ]president|prime minister|supreme court|high court|governor|chief minister|election commission|cag|attorney general|finance commission|upsc|niti aayog|panchayati raj|municipality|schedule\s+(of|i+|v|x|\d+)|writ|habeas corpus|mandamus|citizenship|constituent assembly|money bill|ordinance|speaker of lok sabha)\b/i.test(t)) {
    return { topicId: 'indian-polity', subtopic: 'Indian Polity & Constitution', confidence: 96 };
  }
  if (/\b(indus valley|harappa|mohenjo|vedic|rigveda|buddha|buddhism|jainism|mahavira|maurya|ashoka|gupta|chandragupta|harshavardhana|chola|pandya|pallava|satavahana|vijayanagara|krishnadevaraya|delhi sultanate|qutub|iltutmish|alauddin|mughal|babur|akbar|jahangir|shah jahan|aurangzeb|maratha|shivaji|battle of|revolt of 1857|east india company|gandhi|subhas chandra bose|nehru|tilak|bhagat singh|swadeshi|quit india|non-cooperation|civil disobedience|indian national congress|viceroy|governor[- ]general|partition of bengal|diwani)\b/i.test(t)) {
    return { topicId: 'indian-history', subtopic: 'Indian History', confidence: 96 };
  }
  if (/\b(capital(\s+city)?\s+of|currency of|river|tributary|ganga|brahmaputra|godavari|krishna|kaveri|narmada|tapi|indus|mountain|himalaya|peak|plateau|deccan|desert|thar|sahara|soil|alluvial|black soil|laterite|monsoon|climate|latitude|longitude|equator|tropic of cancer|tropic of capricorn|ocean|strait|island|pass|nathu la|khyber|dam|bhakra|hirakud|continent|volcano|earthquake|census|sex ratio|density of population)\b/i.test(t)) {
    return { topicId: 'geography', subtopic: 'Geography', confidence: 95 };
  }
  if (/\b(gdp|gnp|nnp|national income|reserve bank|rbi|repo rate|reverse repo|crr|slr|inflation|deflation|fiscal deficit|monetary policy|gst|goods and services tax|budget|five[- ]year plan|mahalanobis|hindu rate of growth|poverty|unemployment|sebi|stock exchange|world bank|imf|wto|minimum support price|msp|industrial policy|balance of payments|fdi|disinvestment)\b/i.test(t)) {
    return { topicId: 'indian-economy', subtopic: 'Indian Economy', confidence: 95 };
  }
  if (/\b(national park|wildlife sanctuary|biosphere reserve|tiger reserve|ramsar|wetland|biodiversity|ecosystem|food chain|ozone layer|greenhouse|kyoto|montreal protocol|paris agreement|chipko|endangered|iucn|forest cover|mangrove|sundarbans|kaziranga|jim corbett)\b/i.test(t)) {
    return { topicId: 'environment-ecology', subtopic: 'Environment & Ecology', confidence: 95 };
  }
  if (/\b(yojana|abhiyan|pradhan mantri|scheme|mission|jan dhan|ayushman bharat|mgnrega|nrega|swachh bharat|make in india|skill india|atal pension|mudra|pm-?kisan|beti bachao)\b/i.test(t)) {
    return { topicId: 'government-schemes', subtopic: 'Government Schemes & Welfare', confidence: 93 };
  }
  return { topicId: 'static-gk', subtopic: 'Static GK & Culture', confidence: 87 };
}

function classifyCurrentAffairsDetail(t) {
  if (/\b(military exercise|naval exercise|air exercise|joint exercise|drdo|missile|ins\s|tejas|rafale|submarine|defence)\b/i.test(t)) {
    return { topicId: 'defence-summits-ca', subtopic: 'Defence & Joint Exercises CA', confidence: 94 };
  }
  if (/\b(olympic|asian games|commonwealth|world cup|ipl|wimbledon|grand slam|chess|medal|tournament|championship|arjun award|khel ratna|padma|bharat ratna|nobel prize|oscar|grammy|sahitya akademi|jnanpith|dada saheb)\b/i.test(t)) {
    return { topicId: 'sports-awards-ca', subtopic: 'Sports & Awards CA', confidence: 94 };
  }
  if (/\b(isro|gaganyaan|chandrayaan|aditya-l1|nasa|space|satellite|artificial intelligence|quantum|crispr|biotech|launch vehicle)\b/i.test(t)) {
    return { topicId: 'science-tech-ca', subtopic: 'Science, Space & Tech CA', confidence: 94 };
  }
  if (/\b(rbi|budget|economic survey|gdp growth|imf|world bank|trade agreement|mou|repo rate|fintech)\b/i.test(t)) {
    return { topicId: 'economy-banking-ca', subtopic: 'Economy & Banking CA', confidence: 92 };
  }
  if (/\b(g20|brics|sco|asean|un|united nations|summit|bilateral|prime minister of|president of|visited|global index|ranking)\b/i.test(t)) {
    return { topicId: 'international-affairs', subtopic: 'International Current Affairs', confidence: 92 };
  }
  return { topicId: 'national-affairs', subtopic: 'National Current Affairs', confidence: 90 };
}

function isStrongComputerQuestion(t, rawText = '') {
  // Block reasoning / economy / polity false positives cleanly
  if (/\b(sitting around|circular table|facing the centre|statements? and conclusions?|syllogism|hindu rate of growth|industrial policy|mughal|emperor|diwan of|minimum support price|letter[- ]?number|code language)\b/i.test(t)) {
    return false;
  }
  // Biological virus vs software virus disambiguation
  if (/\bvirus\b/i.test(t) && !/\b(malware|trojan|antivirus|computer|software|worm|ransomware|phishing|cyber)\b/i.test(t)) {
    return false;
  }
  // Case-sensitive uppercase acronym guard prevents matching person name "Ram" or letter cluster "MAN"
  const upperAcronyms = /\b(CPU|RAM|ROM|EPROM|EEPROM|BIOS|USB|SSD|HDD|HTTP|HTTPS|FTP|SMTP|DNS|SQL|DBMS|RDBMS|OSI|LAN|WAN|URL|HTML|CSS|XML|ASCII|EBCDIC|FIFO|LIFO)\b/.test(rawText);
  const strongComputerRegex = /\b(central processing unit|random access memory|read only memory|cache memory|motherboard|microprocessor|input device|output device|ms-?word|ms-?excel|ms-?powerpoint|ms-?office|spreadsheet|shortcut key|ctrl\s*\+|alt\s*\+|operating system|ms-?dos|linux|unix|windows\s+(os|xp|7|10|11|explorer|shortcut)|kernel|booting|primary key|foreign key|normalization|relational database|osi model|tcp\/ip|ip address|mac address|metropolitan area network|router|switch|modem|firewall|web browser|hypertext|compiler|interpreter|assembler|programming language|java|python|c\+\+|binary number|hexadecimal|octal|logic gate|nand gate|nor gate|xor gate|flip-?flop|data structure|linked list|binary tree|malware|ransomware|phishing|trojan|spyware|antivirus|cyber security|supercomputer|param\s*\d+|pratyush|mihir|kilobyte|megabyte|gigabyte|terabyte)\b/i;
  return upperAcronyms || strongComputerRegex.test(t);
}

function isStrongEnglishQuestion(t) {
  return /\b(grammatical error|segment that contains|no substitution|synonym|antonym|meaning of the given idiom|one-?word substitute|correctly spelt|incorrectly spelt|wrongly spelt|misspelt|passive voice|active voice|indirect speech|direct speech|reported speech|para-?jumble|jumbled order|meaningful and coherent paragraph|fill in the blank|most appropriate word to fill|most appropriate option to substitute|cloze test|nearest in meaning|opposite in meaning|in the following passage.*blanks)\b/i.test(t);
}

function isStrongScienceQuestion(t) {
  // Exclude 2024-2026 policy/current event launches from hijacking Current Affairs unless clearly textbook science
  if (/\b(pathogen|retrovirus|hiv|aids|lymphocytes?|bacteria|fungi|protozoa|malaria|tuberculosis|cholera|typhoid|vaccine)\b/i.test(t) || (/\bvirus\b/i.test(t) && !/\b(malware|trojan|antivirus|computer|software|worm|ransomware|phishing|cyber)\b/i.test(t))) {
    return true;
  }
  return /\b(si unit|international system of units|newton'?s|ohm'?s|boyle'?s|charles'?|archimedes|avogadro|atomic number|mass number|periodic table|actinoid|lanthanoid|noble gas|halogen|alkali metal|alkaline earth|metalloid|chemical element|valence electron|isotope|isobar|valency|ph value|ph scale|acid|alkali|photosynthesis|autotrophic|heterotrophic|mitochondria|chlorophyll|chromosome|ribosome|enzyme|vitamin|haemoglobin|white blood cells?|red blood cells?|blood cells?|lymph|plasma|viscose|cellulose|xylem|phloem|nephron|concave|convex|focal length|refractive index|refraction|wavelength|frequency|time period|magnetic field|kinetic energy|potential energy|chemical formula|chemical reaction|bleaching powder|baking soda|washing soda|plaster of paris|alloy|brass|bronze|cell wall|prokaryotic|eukaryotic|blood group|deficiency disease|scurvy|beriberi|rickets|goitre|neuron|endocrine|pituitary|thyroid|insulin|cornea|retina|liver|kidney|digestion|respiration)\b/i.test(t);
}

function isStrongMathQuestion(t, opts) {
  const numericOptsCount = opts.filter((o) => o && /^[-+]?[\d.,/%₹Rs\s]+(\s*(cm|m|km|hrs?|mins?|sec|days?|years?|kg|g|l|ml|deg|°|sq\.?\s*(cm|m)|cu\.?\s*(cm|m)|km\/h|m\/s|%))?$/i.test(o)).length;
  const hasMathCue = /\b(evaluate:|simplify:|find the value|thevalue of|value of|if\s+[a-z]\s*[+\-*/=^:]|hcf|lcm|simple interest|compound interest|compounded (annually|half)|per annum|cost price|selling price|marked price|list price|profit|loss|successive discount|discount of \d+%|(increase|decrease)s?\s+by\s+\d+%|ratio\b|proportion(al)?|mean proportional|third proportional|fourth proportional|can complete a piece of work|working alone|(pipes?|taps?).*(fill|empty).*(cistern|tank)|pipes?\s+[a-z]\s+and\s+[a-z]|speed of (the )?(train|boat|car|bus)|km\/h|kmph|upstream|downstream|perimeter of|area of|volume of|surface area|curved surface|triangle|circle|radius|diameter|chord|tangent|rhombus|trapezium|parallelogram|cylinder|cone|sphere|hemisphere|cuboid|sin\s*[θa-z0-9]|cos\s*[θa-z0-9]|tan\s*[θa-z0-9]|average of|average weight|average marks|remainder when|divisible by|quadratic equation|consecutive (even|odd|integers|numbers)|present age|years ago|years hence)\b/i.test(t);
  const hasRatioOrExpr = /\d+\s*:\s*\d+\s*,|\d+\s*[÷×]\s*\d+|√\d+|\d+\/\d+\s*[+\-×÷]\s*\d+|\(\s*-?\d+\s*\)\s*[+\-×÷]|\d+(?:\.\d+)?%/.test(t);
  return hasMathCue || (hasRatioOrExpr && /\b(largest|smallest|fraction|ratio|percent|increase|decrease|price|value|discount|interest|sum|total|remaining)\b/i.test(t)) || (numericOptsCount >= 3 && /\b(how many|what is the value|find|calculate|equal to|equals|what will be|members in group|sum of)\b/i.test(t) && !/\b(article|year|born|died|established|founded|amendment|schedule|census|constituenc(y|ies)|election|assembly|parliament|lok sabha|rajya sabha|president|prime minister|states|districts|si unit|base quantities|population rank)\b/i.test(t));
}

function isStrongReasoningQuestion(t) {
  return /\b(sitting around|circular table|facing the centre|sit in a row|standing in a row|from the (left|right) end|rank from|immediate left|immediate right|different floors|lowermost floor|same ?building|lives? (above|below)|read the given statements and conclusions|syllogism|certain code language|coded as|is written as\s*['"‘]?[A-Z0-9$#@]{2,}|come in place of|in place of\s*[‘'"?]?\?|replace the question mark|letter[- ]?number cluster|letter[- ]?cluster|english ?alphabetical|related to [a-z]{2,} in a certain way|same relationship|related to the third|odd one out|three of the following four|different from the rest|blood relation|daughter of|son of|father of|mother of|sister of|brother of|wife of|husband of|pointing to a photograph|drives?\s+\d+|walks?\s+\d+|turns? left|turns? right|takes? a (left|right) turn|facing north|facing south|facing east|facing west|towards (north|south|east|west)|mirror image|water image|paper is folded|opposite face|embedded figure|interchanging .* signs|denotes\s*['"‘]?[+\-×÷*/]|stands for\s*['"‘]?[+\-×÷*/])\b/i.test(t);
}

function isCurrentAffairsQuestion(t, q) {
  // Never steal explicit Indian Constitution Articles, Ancient/Medieval History, or pure Science facts into Current Affairs
  const isClearStatic = /\b(constitution|article\s+\d+|fundamental rights?|preamble|maurya|mughal|indus valley|harappa|vedic|ashoka|akbar|revolt of 1857|delhi sultanate|photosynthesis|mitochondria|ohm|newton|si unit|atomic number|periodic table|acid|ph value|tropic of cancer|latitude|longitude)\b/i.test(t);
  if (isClearStatic) return false;

  const isRecentYear = /\b(202[3-7])\b/.test(t) || String(q?._sourceOrigin || '') === 'current-affairs';
  const hasCaCue = /\b(202[3-7]|appointed as|took oath|won the|host(ed|ing)|summit|ranking|index\s+202|padma awards?\s+202|nobel prize\s+202|launched\s+(in|by)|union budget\s+202|republic day\s+202|theme of|joint exercise|commemorate.*202|first indigenous.*202)\b/i.test(t);
  return hasCaCue || (isRecentYear && String(q?.sectionName || '').toLowerCase().includes('current affairs'));
}

/**
 * Determine which official exam stages can legitimately include this question in mock tests.
 * Keeps AP regional questions strictly out of SSC/RRB mocks, English out of RRB mocks, etc.
 */
export function computeEligibleExams(q, classification, provenance) {
  const eligible = new Set();
  const subId = classification.subjectId;
  const topicId = classification.topicId;
  const text = getQuestionText(q).toLowerCase();

  // Always eligible for its own origin stage (unless corrupted/broken)
  if (provenance?.originStage && provenance.originStage !== 'practice' && provenance.originStage !== 'current-affairs') {
    eligible.add(provenance.originStage);
  }

  const isApSpecific =
    provenance?.originExamId === 'appsc-group-2' &&
    /\b(andhra pradesh|amaravati|visakhapatnam|vijayawada|tirupati|satavahana|ikshvaku|vishnukundina|kakatiya|reddi kingdom|eastern chalukyas|guntur|krishna district|godavari|rayalaseema|coastal andhra|telangana armed|ap bifurcation|ap state|polavaram|kurnool|kadapa|nellore|srikakulam|vizianagaram|prakasam|anantapur|chittoor)\b/i.test(text);

  if (isApSpecific) {
    // Keep AP regional questions strictly scoped to APPSC stages
    if (topicId === 'indian-history') eligible.add('appsc-group2-mains-p1');
    if (topicId === 'indian-economy') eligible.add('appsc-group2-mains-p2');
    eligible.add('appsc-group2-prelims');
    return Array.from(eligible);
  }

  if (subId === 'english-language') {
    eligible.add('ssc-cgl-tier1');
    eligible.add('ssc-cgl-tier2');
    eligible.add('ssc-chsl-tier1');
    eligible.add('ssc-chsl-tier2');
    eligible.add('ssc-mts-cbe');
    return Array.from(eligible);
  }

  if (subId === 'computer-science') {
    eligible.add('ssc-cgl-tier2');
    eligible.add('ssc-chsl-tier2');
    eligible.add('rrb-ntpc-ug-cbt1');
    eligible.add('rrb-ntpc-ug-cbt2');
    eligible.add('rrb-ntpc-grad-cbt1');
    eligible.add('rrb-ntpc-grad-cbt2');
    return Array.from(eligible);
  }

  if (subId === 'quantitative-aptitude' || subId === 'reasoning') {
    eligible.add('rrb-ntpc-ug-cbt1');
    eligible.add('rrb-ntpc-ug-cbt2');
    eligible.add('rrb-ntpc-grad-cbt1');
    eligible.add('rrb-ntpc-grad-cbt2');
    eligible.add('rrb-group-d-cbt');
    eligible.add('ssc-cgl-tier1');
    eligible.add('ssc-cgl-tier2');
    eligible.add('ssc-chsl-tier1');
    eligible.add('ssc-chsl-tier2');
    eligible.add('ssc-mts-cbe');
    if (provenance?.originExamId === 'appsc-group-2') {
      eligible.add('appsc-group2-prelims');
    }
    return Array.from(eligible);
  }

  if (subId === 'general-science') {
    eligible.add('rrb-group-d-cbt');
    eligible.add('rrb-ntpc-ug-cbt1');
    eligible.add('rrb-ntpc-ug-cbt2');
    eligible.add('rrb-ntpc-grad-cbt1');
    eligible.add('rrb-ntpc-grad-cbt2');
    eligible.add('ssc-cgl-tier1');
    eligible.add('ssc-cgl-tier2');
    eligible.add('ssc-chsl-tier1');
    eligible.add('ssc-mts-cbe');
    eligible.add('appsc-group2-mains-p2');
    return Array.from(eligible);
  }

  // General Knowledge & Current Affairs
  eligible.add('rrb-ntpc-ug-cbt1');
  eligible.add('rrb-ntpc-ug-cbt2');
  eligible.add('rrb-ntpc-grad-cbt1');
  eligible.add('rrb-ntpc-grad-cbt2');
  eligible.add('rrb-group-d-cbt');
  eligible.add('ssc-cgl-tier1');
  eligible.add('ssc-cgl-tier2');
  eligible.add('ssc-chsl-tier1');
  eligible.add('ssc-chsl-tier2');
  eligible.add('ssc-mts-cbe');
  if (subId === 'current-affairs' || ['indian-history', 'geography', 'government-schemes'].includes(topicId)) {
    eligible.add('appsc-group2-prelims');
  }
  if (topicId === 'indian-polity') {
    eligible.add('appsc-group2-mains-p1');
  }
  if (topicId === 'indian-economy') {
    eligible.add('appsc-group2-mains-p2');
  }

  return Array.from(eligible);
}

/**
 * Non-destructive quality validation flags. Never mutates or deletes records.
 */
export function validateQuestionQuality(q, classification = null) {
  const flags = [];
  const text = getQuestionText(q);
  const opts = getOptionTexts(q);
  const validOpts = opts.filter((o) => o.length > 0);
  const exp = getExplanationText(q);
  const ans = q?.correctAnswer;

  if (!text || text.length < 5) flags.push('EMPTY_QUESTION_TEXT');
  if (validOpts.length < 4) flags.push('MISSING_OPTIONS');
  if (validOpts.length >= 2) {
    const uniqueOpts = new Set(validOpts.map((o) => o.toLowerCase()));
    if (uniqueOpts.size < validOpts.length) flags.push('DUPLICATE_OPTIONS');
  }
  if (typeof ans !== 'number' || !Number.isInteger(ans) || ans < 0 || ans > 3) {
    flags.push('INVALID_ANSWER_KEY');
  }
  if (/(\[image|diagram|given figure|shown below|following figure|missing graphic)/i.test(text) && !q?.imageUrl) {
    flags.push('MISSING_IMAGE_ASSET');
  }
  if (!exp || exp.length < 15 || /^verified from official/i.test(exp) || /official answer key\.?$/i.test(exp)) {
    flags.push('GENERIC_EXPLANATION');
  }
  if (classification && classification.confidence < 80) {
    flags.push('LOW_CONFIDENCE_CLASSIFICATION');
  }
  if (!q?.examName && !q?.examType && q?._sourceOrigin !== 'current-affairs') {
    flags.push('MISSING_EXAM_MAPPING');
  }

  return flags;
}

/**
 * Classify a single question conceptually using multi-signal structural analysis.
 * Respects explicit admin manual overrides (`q.manualClassificationOverride === true`).
 */
export function classifyQuestionConceptually(q) {
  const rawText = getQuestionText(q);
  const opts = getOptionTexts(q);
  const optsText = opts.join(' ');
  const t = `${rawText}`.toLowerCase();
  const sectionPrior = normalizeSectionPrior(q?.sectionName, q);

  // Honor explicit Admin manual override if saved on the record
  if (q?.manualClassificationOverride === true && q?.subjectId && q?.topicId) {
    const provenance = q.provenance || extractProvenance(q);
    const base = {
      subjectId: q.subjectId,
      subjectName: SUBJECT_NAME_BY_ID[q.subjectId] || q.subject || 'General Knowledge',
      categoryId: LEGACY_CATEGORY_BY_SUBJECT_ID[q.subjectId] || 'gk',
      topicId: q.topicId,
      topicName: TOPIC_NAME_BY_ID[q.topicId] || q.topic || 'Static GK & Culture',
      subtopic: q.subtopic || TOPIC_NAME_BY_ID[q.topicId] || 'Static GK & Culture',
      secondaryTags: Array.isArray(q.secondaryTags) ? q.secondaryTags : [],
      confidence: 100,
      confidenceTier: 'HIGH',
      classificationStatus: 'MANUAL_APPROVED',
      reasoning: 'Admin manual classification lock'
    };
    base.eligibleExams = Array.isArray(q.eligibleExams) && q.eligibleExams.length > 0
      ? q.eligibleExams
      : computeEligibleExams(q, base, provenance);
    base.qualityFlags = validateQuestionQuality(q, base);
    return base;
  }

  let subjectId = 'general-knowledge';
  let detail = { topicId: 'static-gk', subtopic: 'Static GK & Culture', confidence: 75 };
  let reasoning = '';
  const secondaryTags = [];

  // Guard 1: Very short / completely missing question text
  const validOpts = opts.filter((o) => o.length > 0);
  if (rawText.length < 5) {
    const numericCount = validOpts.filter((o) => /^[-+]?[\d.,/%₹\s]+$/.test(o)).length;
    if (sectionPrior?.subjectId) {
      subjectId = sectionPrior.subjectId;
      detail = {
        topicId: sectionPrior.topicId || (subjectId === 'quantitative-aptitude' ? 'number-system' : subjectId === 'reasoning' ? 'series-coding-decoding' : 'static-gk'),
        subtopic: 'Needs Extraction Review',
        confidence: 48
      };
    } else if (numericCount >= 2) {
      subjectId = 'quantitative-aptitude';
      detail = { topicId: 'number-system', subtopic: 'Incomplete Math Extraction', confidence: 45 };
    } else {
      subjectId = 'general-knowledge';
      detail = { topicId: 'static-gk', subtopic: 'Incomplete Question Extraction', confidence: 35 };
    }
    reasoning = 'Empty question text (possible diagram/fraction PDF extraction loss)';
  }
  // Guard 2: Strict authoritative section priors (e.g., SSC Quant, SSC English, SSC Reasoning, APPSC History/Constitution/Economy, Group D Science/Maths/Reasoning)
  else if (sectionPrior?.strict) {
    subjectId = sectionPrior.subjectId;
    if (subjectId === 'english-language') {
      detail = classifyEnglishDetail(t);
      reasoning = 'Authoritative English section + conceptual stem match';
    } else if (subjectId === 'quantitative-aptitude') {
      detail = classifyQuantDetail(t, optsText);
      reasoning = 'Authoritative Quant/Math section + topic formula match';
    } else if (subjectId === 'reasoning') {
      detail = classifyReasoningDetail(t);
      reasoning = 'Authoritative Reasoning section + logical template match';
    } else if (subjectId === 'general-science') {
      detail = classifyScienceDetail(t);
      reasoning = 'Authoritative General Science section + discipline match';
    } else {
      detail = classifyGkDetail(t, sectionPrior.topicId);
      reasoning = `Authoritative GK section (${q.sectionName})`;
    }
    detail.confidence = Math.max(detail.confidence, 95);
  }
  // Guard 3: Explicit Reasoning templates FIRST (defeats "circular table" -> DBMS and "statements/conclusions" -> OS/Digital Logic)
  else if (isStrongReasoningQuestion(t)) {
    subjectId = 'reasoning';
    detail = classifyReasoningDetail(t);
    reasoning = 'Matched structural reasoning template';
  }
  // Guard 4: Explicit English Comprehension templates
  else if (isStrongEnglishQuestion(t)) {
    subjectId = 'english-language';
    detail = classifyEnglishDetail(t);
    reasoning = 'Matched English grammar/vocabulary template';
  }
  // Guard 5: Explicit Quantitative Aptitude expressions/problems (even if sectionPrior was APPSC Mental Ability or NONE)
  else if (isStrongMathQuestion(t, validOpts)) {
    subjectId = 'quantitative-aptitude';
    detail = classifyQuantDetail(t, optsText);
    reasoning = 'Matched quantitative problem/mathematical expression';
  }
  // Guard 6: Strict Computer Science (requires genuine IT/CS concepts, blocks seating/syllogism/economy false positives)
  else if (isStrongComputerQuestion(t, rawText)) {
    subjectId = 'computer-science';
    detail = classifyComputerDetail(t);
    reasoning = 'Matched verified Computer Science / IT concept';
  }
  // Guard 7: Monthly Current Affairs Compendium or explicit CA date+event without overriding pure Science/Constitution/History
  else if (isCurrentAffairsQuestion(t, q)) {
    subjectId = 'current-affairs';
    detail = classifyCurrentAffairsDetail(t);
    reasoning = 'Matched dated current affairs / recent policy event';
  }
  // Guard 8: General Science (Physics, Chemistry, Biology)
  else if (isStrongScienceQuestion(t) || sectionPrior?.subjectId === 'general-science') {
    subjectId = 'general-science';
    detail = classifyScienceDetail(t);
    reasoning = 'Matched Physics/Chemistry/Biology concept';
  }
  // Guard 9: General Knowledge sub-disciplines (Polity, History, Geography, Economy, Environment, Schemes, Static GK)
  else {
    subjectId = 'general-knowledge';
    detail = classifyGkDetail(t);
    if (detail.topicId !== 'static-gk') {
      reasoning = `Matched General Knowledge (${detail.topicId}) concept`;
    } else if (sectionPrior?.allowQuantOverride) {
      // APPSC Mental Ability fallback when no explicit math/reasoning cue matched
      subjectId = 'reasoning';
      detail = { topicId: 'series-coding-decoding', subtopic: 'Mental Ability & Logic', confidence: 76 };
      reasoning = 'APPSC Mental Ability section fallback (ambiguous stem)';
    } else if (sectionPrior?.isMixedGA) {
      detail = { topicId: 'static-gk', subtopic: 'Static GK & Awareness', confidence: 84 };
      reasoning = 'Mixed General Awareness section static GK';
    } else if (String(q?._sourceOrigin || '') === 'current-affairs') {
      subjectId = 'current-affairs';
      detail = classifyCurrentAffairsDetail(t);
      reasoning = 'Monthly Current Affairs compendium record';
    } else {
      // Fallback: if question lacks sectionName & didn't hit strong GK sub-discipline, mark REVIEW/MANUAL depending on text clarity
      detail = {
        topicId: 'static-gk',
        subtopic: 'Static GK & Culture',
        confidence: rawText.length >= 25 ? 82 : 70
      };
      reasoning = 'General awareness concept without explicit sub-discipline cue';
    }
  }

  // Track helpful secondary cross-tags
  if (subjectId === 'general-science' && /\b(202[3-7]|launched|isro|mission)\b/i.test(t)) {
    secondaryTags.push('current-affairs');
  }
  if (subjectId === 'current-affairs' && /\b(budget|rbi|gdp|economy|bank)\b/i.test(t)) {
    secondaryTags.push('indian-economy');
  }

  // Cap confidence below 80% when options are missing/corrupted so it enters Manual Review Queue
  if (validOpts.length < 4 && detail.confidence >= 80) {
    detail.confidence = validOpts.length < 2 ? 72 : 78;
    reasoning = `${reasoning} (missing options flagged for manual review)`;
  }

  const confidence = Math.max(0, Math.min(100, Math.round(detail.confidence)));
  const confidenceTier = confidence >= 95 ? 'HIGH' : confidence >= 80 ? 'REVIEW' : 'MANUAL_REVIEW';
  const classificationStatus =
    confidenceTier === 'HIGH'
      ? 'AUTO_VERIFIED'
      : confidenceTier === 'REVIEW'
      ? 'SUGGESTED_REVIEW'
      : 'MANUAL_REVIEW';

  const provenance = q?.provenance || extractProvenance(q);
  const result = {
    subjectId,
    subjectName: SUBJECT_NAME_BY_ID[subjectId] || 'General Knowledge',
    categoryId: LEGACY_CATEGORY_BY_SUBJECT_ID[subjectId] || 'gk',
    topicId: detail.topicId,
    topicName: TOPIC_NAME_BY_ID[detail.topicId] || detail.subtopic || 'Static GK & Culture',
    subtopic: detail.subtopic || TOPIC_NAME_BY_ID[detail.topicId] || 'Static GK & Culture',
    secondaryTags,
    confidence,
    confidenceTier,
    classificationStatus,
    reasoning
  };

  result.eligibleExams = computeEligibleExams(q, result, provenance);
  result.qualityFlags = validateQuestionQuality(q, result);
  return result;
}
