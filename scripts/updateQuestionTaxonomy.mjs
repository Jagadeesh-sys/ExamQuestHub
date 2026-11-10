import fs from 'fs';
import path from 'path';

function classifyQuestion(q) {
  const text = ((q.question?.en || '') + ' ' + (q.subtopic || '') + ' ' + ((q.options?.en || []).join(' '))).toLowerCase();
  const rawSub = (q.subject || '').toLowerCase();
  const rawCat = (q.categoryId || '').toLowerCase();

  let subject = 'General Knowledge';
  let categoryId = 'gk';
  let subjectId = 'general-knowledge';
  let subtopic = q.subtopic || 'Static GK & Culture';

  // 1. English Language
  if (rawSub.includes('english') || rawCat === 'english' || q.sectionName?.includes('English')) {
    subject = 'English Language';
    categoryId = 'english';
    subjectId = 'english-language';
    subtopic = 'Grammar & Error Spotting';
    if (text.includes('idiom') || text.includes('phrase')) subtopic = 'Idioms & Phrases';
    else if (text.includes('synonym') || text.includes('antonym')) subtopic = 'Vocabulary, Synonyms & Antonyms';
    else if (text.includes('one word') || text.includes('spelt') || text.includes('spelling') || text.includes('misspelt')) subtopic = 'One Word Substitution & Spelling';
    else if (text.includes('passage') || text.includes('comprehension') || text.includes('cloze')) subtopic = 'Reading Comprehension & Cloze Test';
    else if (text.includes('jumbled') || text.includes('rearrangement') || text.includes('rearrange')) subtopic = 'Sentence Rearrangement & Para Jumbles';
  }
  // 2. Computer Science
  else if (
    rawSub.includes('computer') || rawCat === 'cse' ||
    q.subtopic?.includes('Computer') || q.subtopic === 'Operating Systems' || q.subtopic === 'Computer Networks' || q.subtopic === 'Database Management Systems' || q.subtopic === 'Programming & OOP' || q.subtopic === 'Software Engineering' || q.subtopic === 'Digital Logic & Computer Organization' ||
    text.includes('operating system') || text.includes('windows') || text.includes('linux') || text.includes('kernel') || text.includes('ms-dos') ||
    text.includes('ip address') || text.includes('lan ') || text.includes('wan ') || text.includes('computer network') || text.includes('tcp/ip') || text.includes('router') ||
    text.includes('database') || text.includes('dbms') || text.includes('sql') || text.includes('rdbms') ||
    text.includes('compiler') || text.includes('programming') || text.includes('algorithm') || text.includes('binary tree') ||
    text.includes('ms office') || text.includes('ms word') || text.includes('ms excel') || text.includes('spreadsheet') || text.includes('powerpoint') ||
    text.includes('motherboard') || text.includes('microprocessor') || text.includes('logic gate') || text.includes('digital logic')
  ) {
    subject = 'Computer Science';
    categoryId = 'cse';
    subjectId = 'computer-science';
    subtopic = 'Computer Fundamentals & Awareness';
    if (text.includes('operating system') || text.includes('windows') || text.includes('linux') || text.includes('kernel')) subtopic = 'Operating Systems';
    else if (text.includes('network') || text.includes('ip address') || text.includes('lan ') || text.includes('internet') || text.includes('protocol')) subtopic = 'Computer Networks';
    else if (text.includes('database') || text.includes('dbms') || text.includes('sql')) subtopic = 'Database Management Systems';
    else if (text.includes('programming') || text.includes('compiler') || text.includes('java') || text.includes('python')) subtopic = 'Programming & OOP';
    else if (text.includes('software') || text.includes('testing') || text.includes('malware') || text.includes('virus')) subtopic = 'Software Engineering';
    else if (text.includes('logic gate') || text.includes('binary') || text.includes('digital logic')) subtopic = 'Digital Logic & Computer Organization';
  }
  // 3. Quantitative Aptitude
  else if (rawSub.includes('quant') || rawSub.includes('math') || rawCat === 'quant' || q.sectionName?.includes('Quantitative')) {
    subject = 'Quantitative Aptitude';
    categoryId = 'quant';
    subjectId = 'quantitative-aptitude';
    subtopic = 'Number System & Simplification';
    if (text.includes('work') || text.includes('pipe') || text.includes('cistern') || text.includes('speed') || text.includes('distance') || text.includes('train') || text.includes('boat')) subtopic = 'Time, Speed, Distance & Work';
    else if (text.includes('profit') || text.includes('loss') || text.includes('discount') || text.includes('interest') || text.includes('percent')) subtopic = 'Percentage, Profit & Loss';
    else if (text.includes('ratio') || text.includes('proportion') || text.includes('mixture') || text.includes('average') || text.includes('partnership')) subtopic = 'Ratio, Proportion & Mixtures';
    else if (text.includes('area') || text.includes('perimeter') || text.includes('volume') || text.includes('surface') || text.includes('triangle') || text.includes('circle') || text.includes('cylinder') || text.includes('cone') || text.includes('sphere') || text.includes('prism')) subtopic = 'Mensuration & Geometry';
    else if (text.includes('algebra') || text.includes('equation') || text.includes('trigonometr') || text.includes('sin ') || text.includes('cos ') || text.includes('tan ') || text.includes('sec ') || text.includes('cosec ') || text.includes('cot ')) subtopic = 'Algebra & Trigonometry';
    else if (text.includes('pie chart') || text.includes('bar graph') || text.includes('histogram') || text.includes('table')) subtopic = 'Data Interpretation';
  }
  // 4. Reasoning
  else if (rawSub.includes('reason') || rawCat === 'reasoning' || q.sectionName?.includes('Intelligence') || q.sectionName?.includes('Reasoning')) {
    subject = 'Reasoning';
    categoryId = 'reasoning';
    subjectId = 'reasoning';
    subtopic = 'Series & Coding-Decoding';
    if (text.includes('blood') || text.includes('direction') || text.includes('facing') || text.includes('turns left') || text.includes('turns right')) subtopic = 'Blood Relations & Direction Sense';
    else if (text.includes('syllogism') || text.includes('conclusion') || text.includes('statement') || text.includes('assumption')) subtopic = 'Syllogisms & Statements';
    else if (text.includes('seating') || text.includes('circular table') || text.includes('row') || text.includes('floor') || text.includes('puzzle')) subtopic = 'Puzzles & Seating Arrangement';
    else if (text.includes('mirror') || text.includes('water image') || text.includes('paper fold') || text.includes('cube') || text.includes('dice') || text.includes('figure')) subtopic = 'Non-Verbal Reasoning';
    else if (text.includes('analogy') || text.includes('related') || text.includes('odd one') || text.includes('share the same relationship')) subtopic = 'Analogy & Classification';
  }
  // 5. General Science
  else if (
    rawSub.includes('science') || rawCat === 'general-science' || rawCat === 'science' ||
    text.includes('acid') || text.includes('base') || text.includes('element') || text.includes('compound') || text.includes('metal') || text.includes('chemical') || text.includes('periodic table') ||
    text.includes('cell') || text.includes('tissue') || text.includes('organ') || text.includes('vitamin') || text.includes('protein') || text.includes('disease') || text.includes('bacteria') || text.includes('virus') || text.includes('blood') || text.includes('plant') || text.includes('respiration') ||
    text.includes('force') || text.includes('gravity') || text.includes('motion') || text.includes('energy') || text.includes('lens') || text.includes('optics') || text.includes('sound') || text.includes('frequency') || text.includes('voltage') || text.includes('resistance') || text.includes('newton') || text.includes('watt')
  ) {
    subject = 'General Science';
    categoryId = 'general-science';
    subjectId = 'general-science';
    subtopic = 'Physics';
    if (text.includes('cell') || text.includes('tissue') || text.includes('organ') || text.includes('vitamin') || text.includes('disease') || text.includes('blood') || text.includes('plant') || text.includes('biology')) subtopic = 'Biology';
    else if (text.includes('acid') || text.includes('base') || text.includes('chemical') || text.includes('reaction') || text.includes('metal') || text.includes('chemistry')) subtopic = 'Chemistry';
  }
  // 6. General Knowledge
  else {
    subject = 'General Knowledge';
    categoryId = 'gk';
    subjectId = 'general-knowledge';
    subtopic = 'Static GK & Culture';
    if (text.includes('article') || text.includes('constitution') || text.includes('amendment') || text.includes('court') || text.includes('parliament') || text.includes('president') || text.includes('polity') || text.includes('fundamental rights') || text.includes('lok sabha') || text.includes('rajya sabha')) subtopic = 'Indian Polity & Constitution';
    else if (text.includes('dynasty') || text.includes('battle') || text.includes('british') || text.includes('gandhi') || text.includes('mughal') || text.includes('history') || text.includes('harappa') || text.includes('ashoka') || text.includes('akbar')) subtopic = 'Indian History';
    else if (text.includes('river') || text.includes('mountain') || text.includes('soil') || text.includes('climate') || text.includes('geography') || text.includes('lake') || text.includes('ocean') || text.includes('pass') || text.includes('tributary')) subtopic = 'Geography';
    else if (text.includes('rbi') || text.includes('gdp') || text.includes('bank') || text.includes('inflation') || text.includes('economy') || text.includes('budget') || text.includes('tax') || text.includes('five year plan')) subtopic = 'Indian Economy';
    else if (text.includes('national park') || text.includes('sanctuary') || text.includes('biosphere') || text.includes('wetland') || text.includes('ecology') || text.includes('environment')) subtopic = 'Environment & Ecology';
    else if (text.includes('scheme') || text.includes('yojana') || text.includes('pradhan mantri')) subtopic = 'Government Schemes';
    else if (text.includes('2024') || text.includes('2025') || text.includes('2026') || text.includes('olympic') || text.includes('summit') || text.includes('award') || text.includes('current affair')) subtopic = 'Current Affairs';
  }

  return {
    ...q,
    subject,
    categoryId,
    subjectId,
    subtopic
  };
}

const files = ['rrbNtpc2025Full.json', 'rrbNtpcGraduate2025Full.json', 'sscCgl2020Full.json', 'sscCgl2026Full.json'];
for (const f of files) {
  const filePath = path.join('public', 'data', f);
  if (!fs.existsSync(filePath)) continue;
  const d = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updated = 0;
  if (Array.isArray(d.questions)) {
    d.questions = d.questions.map((q) => {
      updated++;
      return classifyQuestion(q);
    });
  }
  fs.writeFileSync(filePath, JSON.stringify(d, null, 2), 'utf8');
  console.log(`Updated ${updated} questions in ${f}`);
}
console.log('All questions updated and segregated by topic successfully!');
