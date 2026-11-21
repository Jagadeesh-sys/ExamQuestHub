import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  CANONICAL_SUBJECTS,
  SUBJECT_TOPIC_TREE,
  EXAM_HIERARCHY,
  getExamStageConfig
} from '../src/constants/examHierarchy.js';
import {
  classifyQuestionConceptually,
  extractProvenance
} from '../src/utils/questionClassifier.js';
import {
  isPlayableQuestion,
  generateOfficialFullMock,
  generateCustomOrPracticeMock
} from '../src/services/questionSelectionEngine.js';

const DATA_DIR = path.resolve(process.cwd(), 'public/data');

async function loadJsonBank(fileName) {
  const raw = await fs.readFile(path.join(DATA_DIR, fileName), 'utf8');
  return JSON.parse(raw);
}

test('Exam Hierarchy has 7 canonical subjects and 43 canonical topics', () => {
  assert.equal(CANONICAL_SUBJECTS.length, 7);
  const totalTopics = Object.values(SUBJECT_TOPIC_TREE).reduce(
    (sum, list) => sum + list.length,
    0
  );
  assert.equal(totalTopics, 43);

  assert.ok(EXAM_HIERARCHY.some((e) => e.examId === 'ssc-cgl'));
  assert.ok(EXAM_HIERARCHY.some((e) => e.examId === 'ssc-chsl'));
  assert.ok(EXAM_HIERARCHY.some((e) => e.examId === 'ssc-mts'));
  assert.ok(EXAM_HIERARCHY.some((e) => e.examId === 'rrb-ntpc'));
  assert.ok(EXAM_HIERARCHY.some((e) => e.examId === 'rrb-group-d'));
  assert.ok(EXAM_HIERARCHY.some((e) => e.examId === 'appsc-group-2'));
});

test('Conceptual classifier separates confusing terms (RAM vs Ram seating, circular table, biological vs computer virus)', () => {
  const ramComputer = classifyQuestionConceptually({
    id: 'test-cs-ram',
    question: { en: 'Which type of memory is RAM (Random Access Memory) in a computer CPU?' },
    options: { en: ['Volatile Primary Memory', 'Optical Disk', 'Hard Drive', 'Printer Buffer'] }
  });
  assert.equal(ramComputer.subjectId, 'computer-science');

  const ramSeating = classifyQuestionConceptually({
    id: 'test-reas-ram',
    question: { en: 'Ram sits third to the left of Shyam around a circular table facing the centre.' },
    options: { en: ['Mohan', 'Sita', 'Gita', 'Ravi'] }
  });
  assert.equal(ramSeating.subjectId, 'reasoning');
  assert.equal(ramSeating.topicId, 'puzzles-seating');

  const bioVirus = classifyQuestionConceptually({
    id: 'test-bio-virus',
    question: { en: 'AIDS is caused by which type of pathogen/virus attacking T-lymphocytes?' },
    options: { en: ['Retrovirus (HIV)', 'Bacteria', 'Protozoa', 'Fungus'] }
  });
  assert.equal(bioVirus.subjectId, 'general-science');
  assert.equal(bioVirus.topicId, 'biology');

  const csVirus = classifyQuestionConceptually({
    id: 'test-cs-virus',
    question: { en: 'Which software protects a network against trojan malware and computer virus attacks?' },
    options: { en: ['Antivirus & Firewall', 'Compiler', 'Spreadsheet', 'Assembler'] }
  });
  assert.equal(csVirus.subjectId, 'computer-science');

  const mathPct = classifyQuestionConceptually({
    id: 'test-math-pct',
    question: { en: 'If the population of a town increases by 20% in the first year and 10% in the second year, find the net percentage increase.' },
    options: { en: ['32%', '30%', '28%', '35%'] }
  });
  assert.equal(mathPct.subjectId, 'quantitative-aptitude');
  assert.equal(mathPct.topicId, 'percentage-profit-loss');
  assert.equal(mathPct.subtopic, 'Percentage');

  const polityArt21 = classifyQuestionConceptually({
    id: 'test-polity-art21',
    question: { en: 'Article 21 of the Indian Constitution guarantees which Fundamental Right?' },
    options: { en: ['Protection of Life and Personal Liberty', 'Right to Equality', 'Right to Property', 'Uniform Civil Code'] }
  });
  assert.equal(polityArt21.subjectId, 'general-knowledge');
  assert.equal(polityArt21.topicId, 'indian-polity');

  const capitalGeo = classifyQuestionConceptually({
    id: 'test-geo-capital',
    question: { en: 'What is the capital city of Australia?' },
    options: { en: ['Canberra', 'Sydney', 'Melbourne', 'Perth'] }
  });
  assert.equal(capitalGeo.subjectId, 'general-knowledge');
  assert.equal(capitalGeo.topicId, 'geography');
});

test('Provenance vs Exam Eligibility isolates regional APPSC & English questions accurately', () => {
  const apRegional = {
    id: 'appsc-2025-p1-q1',
    examType: 'APPSC Group II',
    examName: 'APPSC Group-2 Paper-1 (2025)',
    question: { en: 'Under the Andhra Pradesh Reorganisation Act 2014, Polavaram Irrigation Project was declared a National Project.' },
    options: { en: ['Section 90', 'Section 45', 'Section 12', 'Section 5'] }
  };
  const apCls = classifyQuestionConceptually(apRegional);
  assert.ok(apCls.eligibleExams.includes('appsc-group2-mains-p1'));
  assert.ok(!apCls.eligibleExams.includes('ssc-cgl-tier1'));
  assert.ok(!apCls.eligibleExams.includes('rrb-ntpc-ug-cbt1'));

  const englishQ = {
    id: 'ssc-cgl-2020-eng-1',
    examType: 'SSC CGL',
    sectionName: 'English Comprehension',
    question: { en: 'Select the most appropriate synonym of the word ABUNDANT.' },
    options: { en: ['Plentiful', 'Scarce', 'Meager', 'Rare'] }
  };
  const engCls = classifyQuestionConceptually(englishQ);
  assert.equal(engCls.subjectId, 'english-language');
  assert.ok(engCls.eligibleExams.includes('ssc-cgl-tier1'));
  assert.ok(!engCls.eligibleExams.includes('rrb-ntpc-ug-cbt1'));
  assert.ok(!engCls.eligibleExams.includes('rrb-group-d-cbt'));

  const prov = extractProvenance(apRegional);
  assert.equal(prov.originExamId, 'appsc-group-2');
});

test('bankManifest.json integrity and non-destructive normalized JSON files across disk', async () => {
  const manifest = await loadJsonBank('bankManifest.json');
  assert.equal(manifest.version, 2);
  assert.equal(manifest.stats.totalQuestions, 19858);
  assert.equal(manifest.stats.totalShifts, 214);
  assert.equal(manifest.stats.totalSubtopics, 43);
  assert.ok(manifest.confidenceTiers.HIGH > 10000);
  assert.ok(manifest.confidenceTiers.REVIEW > 0);
  assert.ok(manifest.confidenceTiers.MANUAL_REVIEW > 0);
  assert.ok(Array.isArray(manifest.shifts) && manifest.shifts.length === 214);

  const ugBank = await loadJsonBank('rrbNtpcUg2024Full.json');
  const sscBank = await loadJsonBank('sscCgl2020Full.json');
  const appscBank = await loadJsonBank('appscGroup2Prelims2024Full.json');

  assert.ok(ugBank.questions.length > 5000);
  assert.ok(sscBank.questions.length > 1500);
  assert.ok(appscBank.questions.length >= 146);

  for (const sample of [ugBank.questions[0], sscBank.questions[0], appscBank.questions[0]]) {
    assert.ok(sample.id);
    assert.ok(sample.subjectId);
    assert.ok(sample.topicId);
    assert.ok(Array.isArray(sample.eligibleExams));
    assert.ok(sample.provenance && sample.provenance.originExamId);
  }
});

test('Official Full-Length Mock Generation matches stage patterns & marking rules across SSC, RRB, APPSC', async () => {
  const [ugBank, gradBank, groupDBank, ssc20Bank, ssc26Bank, appscPrelims, appscP1, appscP2] =
    await Promise.all([
      loadJsonBank('rrbNtpcUg2024Full.json'),
      loadJsonBank('rrbNtpcGraduate2025Full.json'),
      loadJsonBank('rrbGroupD2025Full.json'),
      loadJsonBank('sscCgl2020Full.json'),
      loadJsonBank('sscCgl2026Full.json'),
      loadJsonBank('appscGroup2Prelims2024Full.json'),
      loadJsonBank('appscGroup2Paper12025Full.json'),
      loadJsonBank('appscGroup2Paper22025Full.json')
    ]);

  const pool = [
    ...ugBank.questions,
    ...gradBank.questions,
    ...groupDBank.questions,
    ...ssc20Bank.questions,
    ...ssc26Bank.questions,
    ...appscPrelims.questions,
    ...appscP1.questions,
    ...appscP2.questions
  ];

  // SSC CGL Tier-1: 100 Qs, +2 / -0.5, 200 Marks
  const sscT1 = generateOfficialFullMock(pool, 'ssc-cgl-tier1');
  assert.equal(sscT1.questions.length, 100);
  assert.equal(sscT1.meta.totalMarks, 200);
  assert.equal(sscT1.meta.timeMinutes, 60);
  assert.ok(sscT1.questions.every((q) => q.marksPerQuestion === 2 && q.negativeMarkingPerQuestion === 0.5));
  assert.ok(sscT1.questions.every(isPlayableQuestion));

  // SSC CGL Tier-2: 150 Qs (30+30+45+25+20), +3 / -1, 450 Marks
  const sscT2 = generateOfficialFullMock(pool, 'ssc-cgl-tier2');
  assert.equal(sscT2.questions.length, 150);
  assert.equal(sscT2.meta.totalMarks, 450);
  assert.ok(sscT2.questions.every((q) => q.marksPerQuestion === 3 && q.negativeMarkingPerQuestion === 1));

  // SSC MTS: 90 Qs, Session 1 (+3 / 0) vs Session 2 (+3 / -1)
  const sscMts = generateOfficialFullMock(pool, 'ssc-mts-cbe');
  assert.equal(sscMts.questions.length, 90);
  assert.equal(sscMts.meta.totalMarks, 270);
  const session1Qs = sscMts.questions.filter((q) => String(q.sectionName || '').includes('Session 1:'));
  const session2Qs = sscMts.questions.filter((q) => String(q.sectionName || '').includes('Session 2:'));
  assert.equal(session1Qs.length, 40);
  assert.equal(session2Qs.length, 50);
  assert.ok(session1Qs.every((q) => q.negativeMarkingPerQuestion === 0));
  assert.ok(session2Qs.every((q) => q.negativeMarkingPerQuestion === 1));

  // RRB NTPC UG CBT-1: 100 Qs (30 Quant + 30 Reas + 40 GA), NO English questions!
  const ntpcUg = generateOfficialFullMock(pool, 'rrb-ntpc-ug-cbt1');
  assert.equal(ntpcUg.questions.length, 100);
  assert.equal(ntpcUg.meta.totalMarks, 100);
  assert.ok(ntpcUg.questions.every((q) => q.subjectId !== 'english-language'));

  // RRB Group D CBT: 100 Qs (25 Sci + 25 Math + 30 Reas + 20 GA/CA)
  const groupD = generateOfficialFullMock(pool, 'rrb-group-d-cbt');
  assert.equal(groupD.questions.length, 100);
  assert.equal(groupD.meta.totalMarks, 100);
  assert.ok(groupD.questions.every((q) => q.subjectId !== 'english-language'));

  // APPSC Group 2 Prelims: 150 Qs (exact official exam stage config check)
  const appscConfig = getExamStageConfig('appsc-group2-prelims');
  assert.equal(appscConfig.stage.totalQuestions, 150);
  assert.equal(appscConfig.stage.durationMinutes, 150);
});

test('Custom Mock Filter & Playability Guard exclude corrupted/empty questions', () => {
  const broken = {
    id: 'broken-q-1',
    question: { en: '' },
    options: { en: ['A', '', '', ''] },
    qualityFlags: ['EMPTY_QUESTION_TEXT', 'MISSING_OPTIONS']
  };
  assert.equal(isPlayableQuestion(broken), false);

  const valid = {
    id: 'valid-q-1',
    subjectId: 'quantitative-aptitude',
    topicId: 'percentage',
    classificationConfidence: 96,
    eligibleExams: ['ssc-cgl-tier1'],
    question: { en: 'What is 25% of 400?' },
    options: { en: ['100', '80', '120', '90'] }
  };
  assert.equal(isPlayableQuestion(valid), true);

  const custom = generateCustomOrPracticeMock([broken, valid], {
    examStageId: 'ssc-cgl-tier1',
    subjectIds: ['quantitative-aptitude'],
    topicIds: ['percentage'],
    count: 10
  });
  assert.equal(custom.questions.length, 1);
  assert.equal(custom.questions[0].id, 'valid-q-1');
  assert.equal(custom.shortfall, 9);
});
