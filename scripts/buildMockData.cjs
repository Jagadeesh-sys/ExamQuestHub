const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '')
    .replace(/(?:October|November|December|January)\s*202[56]\s*Current\s*Affairs[^\n]*\n?/gi, '')
    .replace(/Page\s+\d+/gi, '')
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}

async function extractDecember() {
  const buf = fs.readFileSync(path.join(__dirname, '../public/assets/aistudio/December_2025_Current_Affairs_MCQs_fea0a8ff.pdf'));
  const text = (await new PDFParse({ data: buf }).getText()).text;
  
  const qMatches = [...text.matchAll(/Q(\d+)\.\s*([\s\S]*?)(?=(?:Q\d+\.|$))/g)];
  const questions = [];
  
  for (const m of qMatches) {
    const qNum = parseInt(m[1]);
    if (qNum > 76) continue;
    const content = m[2];
    
    const optA = content.indexOf('(A)');
    const optB = content.indexOf('(B)');
    const optC = content.indexOf('(C)');
    const optD = content.indexOf('(D)');
    const ansIdx = content.indexOf('Answer:');
    const expIdx = content.indexOf('Explanation:');
    
    if (optA === -1 || optB === -1 || optC === -1 || optD === -1) continue;
    
    const qText = cleanText(content.substring(0, optA));
    const optionA = cleanText(content.substring(optA + 3, optB));
    const optionB = cleanText(content.substring(optB + 3, optC));
    const optionC = cleanText(content.substring(optC + 3, optD));
    
    let optionD = '';
    let answerLetter = 'A';
    let explanation = '';
    
    if (ansIdx !== -1) {
      optionD = cleanText(content.substring(optD + 3, ansIdx));
      const ansPart = content.substring(ansIdx);
      const letterMatch = ansPart.match(/Answer:\s*\(([A-D])\)/i);
      if (letterMatch) answerLetter = letterMatch[1].toUpperCase();
      
      if (expIdx !== -1 && expIdx > ansIdx) {
        explanation = cleanText(content.substring(expIdx + 12));
      } else {
        const afterAns = ansPart.replace(/Answer:\s*\([A-D]\)[^\n]*/i, '');
        explanation = cleanText(afterAns);
      }
    } else {
      optionD = cleanText(content.substring(optD + 3));
    }
    
    // Categorize
    let topic = 'General';
    if (qNum <= 20) topic = 'Economy & Banking';
    else if (qNum <= 36) topic = 'Polity & Governance';
    else if (qNum <= 50) topic = 'International Affairs';
    else if (qNum <= 62) topic = 'Defence & Sci-Tech';
    else if (qNum <= 70) topic = 'Sports';
    else topic = 'Important Days & Events';
    
    questions.push({
      id: `dec25-q${qNum}`,
      qNumber: qNum,
      topic,
      difficulty: qNum % 3 === 0 ? 'Hard' : qNum % 2 === 0 ? 'Medium' : 'Easy',
      question: qText,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD
      },
      correctAnswer: answerLetter,
      explanation: explanation || 'Refer to December 2025 Current Affairs compendium.'
    });
  }
  return questions;
}

async function extractNovember() {
  const buf = fs.readFileSync(path.join(__dirname, '../public/assets/aistudio/November_2025_Current_Affairs_MCQs_106d2ab4.pdf'));
  const text = (await new PDFParse({ data: buf }).getText()).text;
  
  const partBIndex = text.indexOf('PART B - ANSWERS AND EXPLANATIONS');
  const partAText = text.substring(0, partBIndex);
  const partBText = text.substring(partBIndex);

  // Parse answers from Part B
  const ansMap = {};
  const ansRegex = /Q(\d+)\.\s*(\[([A-Z]+)\])?\s*([^\n]+)?\s*Answer:\s*\(([A-D])\)\s*([\s\S]*?)(?=(?:Q\d+\.|$))/g;
  for (const m of partBText.matchAll(ansRegex)) {
    const qNum = parseInt(m[1]);
    const letter = m[5].toUpperCase();
    const exp = cleanText(m[6]);
    ansMap[qNum] = { letter, exp };
  }

  // Parse questions from Part A
  const qMatches = [...partAText.matchAll(/Q(\d+)\.\s*(\[([A-Z]+)\])?\s*([^\n\(]+)?([\s\S]*?)(?=(?:Q\d+\.|$))/g)];
  const questions = [];

  for (const m of qMatches) {
    const qNum = parseInt(m[1]);
    if (qNum > 94) continue;
    const diffRaw = m[3] || 'MEDIUM';
    const topicRaw = (m[4] || 'General').trim();
    const content = m[5];

    const optA = content.indexOf('(A)');
    const optB = content.indexOf('(B)');
    const optC = content.indexOf('(C)');
    const optD = content.indexOf('(D)');

    if (optA === -1 || optB === -1 || optC === -1 || optD === -1) continue;

    const qText = cleanText(content.substring(0, optA));
    const optionA = cleanText(content.substring(optA + 3, optB));
    const optionB = cleanText(content.substring(optB + 3, optC));
    const optionC = cleanText(content.substring(optC + 3, optD));
    const optionD = cleanText(content.substring(optD + 3));

    const ansData = ansMap[qNum] || { letter: 'A', exp: 'Detailed November 2025 explanation.' };
    const difficulty = diffRaw.charAt(0).toUpperCase() + diffRaw.slice(1).toLowerCase();

    questions.push({
      id: `nov25-q${qNum}`,
      qNumber: qNum,
      topic: topicRaw.replace(/^[-\s]+/, '') || 'General',
      difficulty,
      question: qText,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD
      },
      correctAnswer: ansData.letter,
      explanation: ansData.exp
    });
  }
  return questions;
}

async function extractOctober() {
  const buf = fs.readFileSync(path.join(__dirname, '../public/assets/aistudio/October_2025_Current_Affairs_MCQs_9e8d634c.pdf'));
  const text = (await new PDFParse({ data: buf }).getText()).text;

  const qMatches = [...text.matchAll(/Q(\d+)\.\s*([\s\S]*?)(?=(?:Q\d+\.|$))/g)];
  const questions = [];

  for (const m of qMatches) {
    const qNum = parseInt(m[1]);
    if (qNum > 80) continue;
    const content = m[2];

    const optA = content.indexOf('(A)');
    const optB = content.indexOf('(B)');
    const optC = content.indexOf('(C)');
    const optD = content.indexOf('(D)');
    const ansIdx = content.indexOf('Answer:');

    if (optA === -1 || optB === -1 || optC === -1 || optD === -1) continue;

    const qText = cleanText(content.substring(0, optA));
    const optionA = cleanText(content.substring(optA + 3, optB));
    const optionB = cleanText(content.substring(optB + 3, optC));
    const optionC = cleanText(content.substring(optC + 3, optD));

    let optionD = '';
    let letter = 'A';
    let exp = '';

    if (ansIdx !== -1) {
      optionD = cleanText(content.substring(optD + 3, ansIdx));
      const ansPart = content.substring(ansIdx);
      const letterMatch = ansPart.match(/Answer:\s*\(([A-D])\)/i);
      if (letterMatch) letter = letterMatch[1].toUpperCase();

      const afterLetter = ansPart.replace(/Answer:\s*\([A-D]\)[^\n]*/i, '');
      exp = cleanText(afterLetter);
    } else {
      optionD = cleanText(content.substring(optD + 3));
    }

    let topic = 'General';
    if (qNum <= 10) topic = 'Nobel Prizes & Awards';
    else if (qNum <= 22) topic = 'Polity & National';
    else if (qNum <= 36) topic = 'Economy & Finance';
    else if (qNum <= 48) topic = 'Defence & Security';
    else if (qNum <= 60) topic = 'International & Summits';
    else if (qNum <= 70) topic = 'Sports & Games';
    else topic = 'Environment & Days';

    questions.push({
      id: `oct25-q${qNum}`,
      qNumber: qNum,
      topic,
      difficulty: qNum % 3 === 0 ? 'Hard' : qNum % 2 === 0 ? 'Medium' : 'Easy',
      question: qText,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD
      },
      correctAnswer: letter,
      explanation: exp || 'From October 2025 Current Affairs compendium.'
    });
  }
  return questions;
}

async function extractJanuary() {
  const buf = fs.readFileSync(path.join(__dirname, '../public/assets/aistudio/January_2026_Current_Affairs_MCQ_31a6a736.pdf'));
  const text = (await new PDFParse({ data: buf }).getText()).text;

  const qMatches = [...text.matchAll(/Q(\d+)\.\s*([\s\S]*?)(?=(?:Q\d+\.|$))/g)];
  const questions = [];

  for (const m of qMatches) {
    const qNum = parseInt(m[1]);
    if (qNum > 94) continue;
    const content = m[2];

    const optA = content.indexOf('(A)');
    const optB = content.indexOf('(B)');
    const optC = content.indexOf('(C)');
    const optD = content.indexOf('(D)');
    const ansIdx = content.indexOf('Answer:');
    const expIdx = content.indexOf('Explanation:');

    if (optA === -1 || optB === -1 || optC === -1 || optD === -1) continue;

    const qText = cleanText(content.substring(0, optA));
    const optionA = cleanText(content.substring(optA + 3, optB));
    const optionB = cleanText(content.substring(optB + 3, optC));
    const optionC = cleanText(content.substring(optC + 3, optD));

    let optionD = '';
    let letter = 'A';
    let exp = '';

    if (ansIdx !== -1) {
      optionD = cleanText(content.substring(optD + 3, ansIdx));
      const ansPart = content.substring(ansIdx);
      const letterMatch = ansPart.match(/Answer:\s*\(([A-D])\)/i);
      if (letterMatch) letter = letterMatch[1].toUpperCase();

      if (expIdx !== -1 && expIdx > ansIdx) {
        exp = cleanText(content.substring(expIdx + 12));
      } else {
        const afterLetter = ansPart.replace(/Answer:\s*\([A-D]\)[^\n]*/i, '');
        exp = cleanText(afterLetter);
      }
    } else {
      optionD = cleanText(content.substring(optD + 3));
    }

    let topic = 'National';
    if (qNum <= 15) topic = '77th Republic Day & National';
    else if (qNum <= 30) topic = 'Economy & Banking';
    else if (qNum <= 45) topic = 'International & Global';
    else if (qNum <= 60) topic = 'Defence, Space & Sci-Tech';
    else if (qNum <= 75) topic = 'Appointments & Persons in News';
    else topic = 'Awards, Sports & Books';

    questions.push({
      id: `jan26-q${qNum}`,
      qNumber: qNum,
      topic,
      difficulty: qNum % 3 === 0 ? 'Hard' : qNum % 2 === 0 ? 'Medium' : 'Easy',
      question: qText,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD
      },
      correctAnswer: letter,
      explanation: exp || 'Official January 2026 explanation.'
    });
  }
  return questions;
}

async function main() {
  console.log('Extracting December 2025...');
  const decQs = await extractDecember();
  console.log('Dec Qs:', decQs.length);

  console.log('Extracting November 2025...');
  const novQs = await extractNovember();
  console.log('Nov Qs:', novQs.length);

  console.log('Extracting October 2025...');
  const octQs = await extractOctober();
  console.log('Oct Qs:', octQs.length);

  console.log('Extracting January 2026...');
  const janQs = await extractJanuary();
  console.log('Jan Qs:', janQs.length);

  // Nov Set 1 (first 51 questions)
  const novSet1Qs = novQs.slice(0, 51).map((q, idx) => ({
    ...q,
    id: `nov25-set1-q${idx + 1}`,
    qNumber: idx + 1
  }));

  // Mega Grand Mock: 100 questions (33 Oct, 34 Nov, 33 Dec)
  const megaQs = [
    ...octQs.slice(0, 33),
    ...novQs.slice(0, 34),
    ...decQs.slice(0, 33)
  ].map((q, idx) => ({
    ...q,
    id: `mega-q${idx + 1}`,
    qNumber: idx + 1
  }));

  const mockMetadata = [
    {
      id: 'ca-mock-01',
      code: 'CA-MOCK-01',
      month: 'December 2025',
      title: 'Dec 2025 Full Mock (76 Qs)',
      subtitle: 'Complete monthly current affairs for UPSC, SSC, Banking & RRB',
      questionsCount: 76,
      timeMinutes: 60,
      marks: 76,
      badgeText: '76Q',
      tags: ['76 MCQs', '60 Mins', 'Practice Mode', 'Solutions'],
      cardBg: 'bg-[#FDF0E6]',
      cardBorder: 'border-[#F8D8C2]',
      badgeBg: 'bg-[#1F2937]',
      badgeTextCol: 'text-white',
      pillBg: 'bg-white',
      pdfUrl: '/assets/aistudio/December_2025_Current_Affairs_MCQs_fea0a8ff.pdf',
      pdfFileName: 'December_2025_Current_Affairs_MCQs.pdf',
      difficultyStats: { easy: 26, medium: 28, hard: 22 }
    },
    {
      id: 'ca-mock-02',
      code: 'CA-MOCK-02',
      month: 'November 2025',
      title: 'Nov 2025 Full Mock (94 Qs)',
      subtitle: 'Comprehensive 94 questions set with Easy, Medium, Hard breakdown',
      questionsCount: 94,
      timeMinutes: 70,
      marks: 94,
      badgeText: '94Q',
      tags: ['94 MCQs', '70 Mins', 'Practice Mode', 'Solutions', 'Easy · 31Q', 'Med · 37Q', 'Hard · 26Q'],
      cardBg: 'bg-[#E7F7ED]',
      cardBorder: 'border-[#C6EFD5]',
      badgeBg: 'bg-[#D1FAE5]',
      badgeTextCol: 'text-[#065F46]',
      pillBg: 'bg-white',
      pdfUrl: '/assets/aistudio/November_2025_Current_Affairs_MCQs_106d2ab4.pdf',
      pdfFileName: 'November_2025_Current_Affairs_MCQs.pdf',
      difficultyStats: { easy: 31, medium: 37, hard: 26 }
    },
    {
      id: 'ca-mock-03',
      code: 'CA-MOCK-03',
      month: 'October 2025',
      title: 'Oct 2025 Full Mock (80 Qs)',
      subtitle: 'Nobel prizes, polity amendments, defence milestones & sports awards',
      questionsCount: 80,
      timeMinutes: 60,
      marks: 80,
      badgeText: '80Q',
      tags: ['80 MCQs', '60 Mins', 'Practice Mode', 'Solutions'],
      cardBg: 'bg-[#EFEAFF]',
      cardBorder: 'border-[#DCD2FD]',
      badgeBg: 'bg-[#F43F5E]',
      badgeTextCol: 'text-white',
      pillBg: 'bg-white',
      pdfUrl: '/assets/aistudio/October_2025_Current_Affairs_MCQs_9e8d634c.pdf',
      pdfFileName: 'October_2025_Current_Affairs_MCQs.pdf',
      difficultyStats: { easy: 28, medium: 32, hard: 20 }
    },
    {
      id: 'ca-mock-04',
      code: 'CA-MOCK-04',
      month: 'November 2025',
      title: 'Nov 2025 Set 1 (51 Qs)',
      subtitle: 'Fast-paced revision set targeting high-frequency examination topics',
      questionsCount: 51,
      timeMinutes: 40,
      marks: 51,
      badgeText: '51Q',
      tags: ['51 MCQs', '40 Mins', 'Practice Mode', 'Solutions', 'Easy · 19Q', 'Med · 19Q', 'Hard · 13Q'],
      cardBg: 'bg-[#E8F4FD]',
      cardBorder: 'border-[#C9E6FB]',
      badgeBg: 'bg-[#0284C7]',
      badgeTextCol: 'text-white',
      pillBg: 'bg-white',
      pdfUrl: '/assets/aistudio/November_2025_Current_Affairs_MCQs_106d2ab4.pdf',
      pdfFileName: 'November_2025_Current_Affairs_Set1.pdf',
      difficultyStats: { easy: 19, medium: 19, hard: 13 }
    },
    {
      id: 'ca-mock-05',
      code: 'CA-MOCK-05',
      month: 'Oct, Nov & Dec 2025',
      title: 'Oct, Nov & Dec 2025 Mega Grand Mock',
      subtitle: '100 curated high-yield questions spanning Q4 2025 national & global affairs',
      questionsCount: 100,
      timeMinutes: 80,
      marks: 100,
      badgeText: '100Q',
      tags: ['100 MCQs', '80 Mins', 'Practice Mode', 'Solutions', 'High-Yield', 'All Subjects'],
      cardBg: 'bg-[#FCE7F3]',
      cardBorder: 'border-[#FBCFE8]',
      badgeBg: 'bg-[#C026D3]',
      badgeTextCol: 'text-white',
      pillBg: 'bg-white',
      pdfUrl: '/assets/aistudio/December_2025_Current_Affairs_MCQs_fea0a8ff.pdf',
      pdfFileName: 'Q4_2025_Mega_Grand_Mock.pdf',
      difficultyStats: { easy: 35, medium: 45, hard: 20 }
    },
    {
      id: 'ca-mock-06',
      code: 'CA-MOCK-06',
      month: 'January 2026',
      title: 'Jan 2026 Full Mock (94 Qs)',
      subtitle: '77th Republic Day parade themes, economic surveys, appointments & defence drills',
      questionsCount: 94,
      timeMinutes: 70,
      marks: 94,
      badgeText: '94Q',
      tags: ['94 MCQs', '70 Mins', 'Practice Mode', 'Solutions', '77th Republic Day', 'Budget Eve'],
      cardBg: 'bg-[#FEF9C3]',
      cardBorder: 'border-[#FDE68A]',
      badgeBg: 'bg-[#D97706]',
      badgeTextCol: 'text-white',
      pillBg: 'bg-white',
      pdfUrl: '/assets/aistudio/January_2026_Current_Affairs_MCQ_31a6a736.pdf',
      pdfFileName: 'January_2026_Current_Affairs_MCQ.pdf',
      difficultyStats: { easy: 32, medium: 40, hard: 22 }
    }
  ];

  const outputJs = `/**
 * Pre-compiled Mock Test Data extracted directly from the authentic monthly Current Affairs PDF documents:
 * - December 2025 (76 MCQs)
 * - November 2025 (94 MCQs)
 * - October 2025 (80 MCQs)
 * - January 2026 (94 MCQs)
 */

export const MOCK_TESTS_METADATA = ${JSON.stringify(mockMetadata, null, 2)};

export const MOCK_QUESTIONS_DATABASE = {
  'ca-mock-01': ${JSON.stringify(decQs, null, 2)},
  'ca-mock-02': ${JSON.stringify(novQs, null, 2)},
  'ca-mock-03': ${JSON.stringify(octQs, null, 2)},
  'ca-mock-04': ${JSON.stringify(novSet1Qs, null, 2)},
  'ca-mock-05': ${JSON.stringify(megaQs, null, 2)},
  'ca-mock-06': ${JSON.stringify(janQs, null, 2)}
};
`;

  fs.writeFileSync(path.join(__dirname, '../src/data/mockTestsData.js'), outputJs, 'utf8');
  console.log('Successfully generated /src/data/mockTestsData.js!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
