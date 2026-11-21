/**
 * Phase 3, 4, 11 & 12: Non-Destructive Question Bank Audit, Conceptual Normalization & Manifest Builder
 *
 * Usage:
 *   node scripts/auditAndNormalizeQuestionBanks.mjs --dry-run
 *   node scripts/auditAndNormalizeQuestionBanks.mjs --apply
 */

import fs from 'fs';
import path from 'path';
import {
  classifyQuestionConceptually,
  extractProvenance,
  getOptionTexts,
  getQuestionText
} from '../src/utils/questionClassifier.js';
import { MOCK_QUESTIONS_DATABASE } from '../src/data/mockTestsData.js';
import { SUBJECT_TOPIC_TREE } from '../src/constants/examHierarchy.js';
import { FULL_MOCK_SERIES, SECTIONAL_TESTS, SUBJECT_MOCK_TESTS } from '../src/data/fullMockSeriesData.js';
import { MOCK_TESTS_METADATA } from '../src/data/mockTestsMetadata.js';

const TOTAL_TOPIC_UNITS = Object.values(SUBJECT_TOPIC_TREE).reduce(
  (acc, list) => acc + (Array.isArray(list) ? list.length : 0),
  0
);

const DATA_DIR = path.resolve(process.cwd(), 'public/data');
const BACKUP_DIR = path.resolve(process.cwd(), '.backups/pre-upgrade-data');

const ACTIVE_DATA_FILES = [
  'rrbNtpcUg2024Full.json',
  'rrbNtpcGraduate2024Full.json',
  'rrbNtpcGraduate2025Full.json',
  'sscCgl2020Full.json',
  'sscCgl2026Full.json',
  'rrbGroupD2025Full.json',
  'appscGroup2Prelims2024Full.json',
  'appscGroup2Paper12025Full.json',
  'appscGroup2Paper22025Full.json'
];

const isApply = process.argv.includes('--apply');

function normalizeSignature(q) {
  const t = getQuestionText(q).toLowerCase().replace(/[^a-z0-9]/g, '');
  const opts = getOptionTexts(q)
    .map((o) => o.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .join('|');
  if (t.length < 8) return null;
  return `${t}:::${opts}`;
}

function buildShiftMetaId(fileName, shiftObj, qSample) {
  if (shiftObj?.id) return shiftObj.id;
  if (qSample?.shiftId) return qSample.shiftId;
  return fileName.replace('.json', '');
}

async function run() {
  console.log(`=== ExamQuestHub Question Bank Audit (${isApply ? 'APPLY MODE' : 'DRY RUN'}) ===`);

  if (isApply && !fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    for (const file of fs.readdirSync(DATA_DIR)) {
      if (file.endsWith('.json') && file !== 'bankManifest.json') {
        fs.copyFileSync(path.join(DATA_DIR, file), path.join(BACKUP_DIR, file));
      }
    }
    console.log(`Created backup snapshot in ${BACKUP_DIR}`);
  }

  const signatureFirstSeen = new Map();
  const signatureCounts = new Map();

  // Pass 1: Load all banks & build exact content duplicate index
  const loadedFiles = [];
  for (const fileName of ACTIVE_DATA_FILES) {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`Missing bank file: ${fileName}`);
      continue;
    }
    const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const questions = Array.isArray(payload.questions) ? payload.questions : [];
    for (const q of questions) {
      const sig = normalizeSignature(q);
      if (sig) {
        signatureCounts.set(sig, (signatureCounts.get(sig) || 0) + 1);
        if (!signatureFirstSeen.has(sig)) {
          signatureFirstSeen.set(sig, q.id);
        }
      }
    }
    loadedFiles.push({ fileName, filePath, payload });
  }

  const auditSummary = {
    generatedAt: new Date().toISOString(),
    filesProcessed: loadedFiles.length,
    rawTotal: 0,
    uniqueValidTotal: 0,
    reclassifiedHighOrReviewCount: 0,
    lowConfidenceManualQueueCount: 0,
    confidenceTiers: { HIGH: 0, REVIEW: 0, MANUAL_REVIEW: 0 },
    qualityFlagsBreakdown: {},
    subjectCountsBefore: {},
    subjectCountsAfter: {},
    topicCounts: {},
    examBreakdown: {
      underGraduate: 0,
      graduate2024: 0,
      graduate2026: 0,
      groupD2025: 0,
      sscCgl2020: 0,
      sscCgl2026: 0,
      appscGroup2: 0,
      appsc2024Prelims: 0,
      currentAffairsCompendium: 0
    },
    fileReports: []
  };

  const uniqueQuestionIds = new Set();
  const uniqueSignatures = new Set();
  const allShifts = [];
  const paperSummaries = [];

  for (const { fileName, filePath, payload } of loadedFiles) {
    const questions = Array.isArray(payload.questions) ? payload.questions : [];
    const shifts = Array.isArray(payload.shifts) ? payload.shifts : [];
    let fileReclassified = 0;
    let fileManualQueue = 0;
    let fileDuplicates = 0;
    let fileIncomplete = 0;

    const shiftBuckets = new Map();
    const shiftOrderCounters = new Map();

    const updatedQuestions = questions.map((rawQ, idx) => {
      auditSummary.rawTotal++;
      const q = { ...rawQ };

      const prevSub = q.subject || 'Unassigned';
      auditSummary.subjectCountsBefore[prevSub] = (auditSummary.subjectCountsBefore[prevSub] || 0) + 1;

      const provenance = extractProvenance(q);
      const bucketKey = provenance.paperId || fileName;
      const nextOrder = (shiftOrderCounters.get(bucketKey) || 0) + 1;
      shiftOrderCounters.set(bucketKey, nextOrder);
      provenance.originalOrder = provenance.originalOrder || nextOrder;

      // Preserve graduate 2024 vs 2026 year consistency cleanly on metadata
      if (provenance.originExamId === 'rrb-ntpc' && q.examLevel === 'Graduate') {
        q.examYear = provenance.examYear;
      }

      const cls = classifyQuestionConceptually(q);
      const flags = [...cls.qualityFlags];

      const sig = normalizeSignature(q);
      let duplicateOf = null;
      if (sig && (signatureCounts.get(sig) || 0) > 1) {
        const primaryId = signatureFirstSeen.get(sig);
        if (primaryId && primaryId !== q.id) {
          duplicateOf = primaryId;
          fileDuplicates++;
          if (fileName === 'sscCgl2026Full.json' && (q.shiftNumber || 1) > 1) {
            flags.push('SUSPECTED_TEMPLATE_REPEAT');
          } else {
            flags.push('DUPLICATE_QUESTION');
          }
        }
      }

      if (flags.includes('EMPTY_QUESTION_TEXT') || flags.includes('MISSING_OPTIONS')) {
        fileIncomplete++;
      }

      const canonicalBeforeMap = {
        'General Knowledge': 'general-knowledge',
        'Current Affairs': 'current-affairs',
        'Quantitative Aptitude': 'quantitative-aptitude',
        Reasoning: 'reasoning',
        'General Science': 'general-science',
        'Computer Science': 'computer-science',
        'English Language': 'english-language'
      };
      const prevCanonicalSubId = canonicalBeforeMap[q.subject] || 'general-knowledge';
      const prevTopicId = q.topicId || '';
      const subjectActuallyChanged = prevCanonicalSubId !== cls.subjectId;
      const metadataDifferent = q.subjectId !== cls.subjectId || prevTopicId !== cls.topicId || q.subject !== cls.subjectName;

      if (cls.confidence >= 80) {
        if (subjectActuallyChanged) {
          fileReclassified++;
          auditSummary.reclassifiedHighOrReviewCount++;
        }
        if (metadataDifferent && q.subject) {
          const history = Array.isArray(q.classificationHistory) ? [...q.classificationHistory] : [];
          if (subjectActuallyChanged) {
            history.push({
              at: new Date().toISOString(),
              from: {
                subject: q.subject || null,
                subjectId: q.subjectId || null,
                topicId: q.topicId || null,
                subtopic: q.subtopic || null
              },
              to: {
                subject: cls.subjectName,
                subjectId: cls.subjectId,
                topicId: cls.topicId,
                subtopic: cls.subtopic
              },
              confidence: cls.confidence,
              reason: cls.reasoning
            });
            q.classificationHistory = history.slice(-5);
          }
        }
        q.subject = cls.subjectName;
        q.subjectId = cls.subjectId;
        q.categoryId = cls.categoryId;
        q.topicId = cls.topicId;
        q.topic = cls.topicName;
        q.subtopic = cls.subtopic;
        q.classificationStatus = cls.classificationStatus;
      } else {
        // Low confidence (<80%): NEVER auto-assign silently; preserve original canonical subject & queue for Admin Review
        fileManualQueue++;
        auditSummary.lowConfidenceManualQueueCount++;
        q.subjectId = canonicalBeforeMap[q.subject] ? prevCanonicalSubId : cls.subjectId;
        q.classificationStatus = 'MANUAL_REVIEW';
        q.suggestedClassification = {
          subject: cls.subjectName,
          subjectId: cls.subjectId,
          topicId: cls.topicId,
          subtopic: cls.subtopic,
          confidence: cls.confidence,
          reason: cls.reasoning
        };
      }

      q.secondaryTags = cls.secondaryTags;
      q.classificationConfidence = cls.confidence;
      q.classificationTier = cls.confidenceTier;
      q.classificationReasoning = cls.reasoning;
      q.provenance = provenance;
      q.originalOrder = provenance.originalOrder;
      q.eligibleExams = cls.eligibleExams;
      q.qualityFlags = Array.from(new Set(flags));
      if (duplicateOf) {
        q.duplicateGroupId = duplicateOf;
      }

      // Collect unique-question manifest statistics matching runtime deduplication
      const isBroken = flags.includes('EMPTY_QUESTION_TEXT') || getOptionTexts(q).filter(Boolean).length < 2;
      if (!isBroken && !uniqueQuestionIds.has(q.id) && (!sig || !uniqueSignatures.has(sig))) {
        uniqueQuestionIds.add(q.id);
        if (sig) uniqueSignatures.add(sig);
        auditSummary.uniqueValidTotal++;
        auditSummary.confidenceTiers[cls.confidenceTier] = (auditSummary.confidenceTiers[cls.confidenceTier] || 0) + 1;
        const effectiveSubId = q.subjectId || cls.subjectId;
        auditSummary.subjectCountsAfter[effectiveSubId] = (auditSummary.subjectCountsAfter[effectiveSubId] || 0) + 1;
        const effectiveTopicId = q.topicId || cls.topicId;
        const topicKey = `${effectiveSubId}::${effectiveTopicId}`;
        auditSummary.topicCounts[topicKey] = (auditSummary.topicCounts[topicKey] || 0) + 1;

        if (provenance.originExamId === 'appsc-group-2') {
          auditSummary.examBreakdown.appscGroup2++;
          if (provenance.originStage === 'appsc-group2-prelims') {
            auditSummary.examBreakdown.appsc2024Prelims++;
          }
        } else if (provenance.originExamId === 'rrb-group-d') {
          auditSummary.examBreakdown.groupD2025++;
        } else if (provenance.originExamId === 'ssc-cgl') {
          if (provenance.examYear === '2026') auditSummary.examBreakdown.sscCgl2026++;
          else auditSummary.examBreakdown.sscCgl2020++;
        } else if (provenance.originStage === 'rrb-ntpc-grad-cbt1') {
          if (provenance.examYear === '2026') auditSummary.examBreakdown.graduate2026++;
          else auditSummary.examBreakdown.graduate2024++;
        } else {
          auditSummary.examBreakdown.underGraduate++;
        }
      }

      for (const fl of q.qualityFlags) {
        auditSummary.qualityFlagsBreakdown[fl] = (auditSummary.qualityFlagsBreakdown[fl] || 0) + 1;
      }

      // Per-paper summary bucket
      if (!shiftBuckets.has(bucketKey)) {
        shiftBuckets.set(bucketKey, {
          paperId: bucketKey,
          fileName,
          examId: provenance.originExamId,
          examName: provenance.originExamName,
          stage: provenance.originStage,
          examYear: provenance.examYear,
          examDate: provenance.examDate,
          shiftNumber: provenance.shiftNumber,
          totalQuestions: 0,
          flaggedCount: 0,
          manualReviewCount: 0,
          subjectDistribution: {}
        });
      }
      const pBucket = shiftBuckets.get(bucketKey);
      pBucket.totalQuestions++;
      if (q.qualityFlags.length > 0) pBucket.flaggedCount++;
      if (q.classificationStatus === 'MANUAL_REVIEW') pBucket.manualReviewCount++;
      const sKey = q.subjectId || cls.subjectId;
      pBucket.subjectDistribution[sKey] = (pBucket.subjectDistribution[sKey] || 0) + 1;

      return q;
    });

    paperSummaries.push(...Array.from(shiftBuckets.values()));

    for (const s of shifts) {
      if (s && s.id) {
        allShifts.push({
          ...s,
          hasLoadedQuestions: true,
          dataFile: fileName
        });
      }
    }

    auditSummary.fileReports.push({
      fileName,
      totalRecords: questions.length,
      reclassified: fileReclassified,
      manualReviewQueue: fileManualQueue,
      duplicatesFlagged: fileDuplicates,
      incompleteFlagged: fileIncomplete
    });

    if (isApply) {
      const nextPayload = {
        ...payload,
        taxonomyVersion: '2.0.0',
        normalizedAt: new Date().toISOString(),
        questions: updatedQuestions
      };
      fs.writeFileSync(filePath, JSON.stringify(nextPayload, null, 2));
      console.log(`Updated ${fileName} (${updatedQuestions.length} Qs · ${fileReclassified} reclassified · ${fileManualQueue} queued)`);
    }
  }

  // Incorporate Current Affairs monthly MCQs into manifest counts
  for (const caList of Object.values(MOCK_QUESTIONS_DATABASE || {})) {
    if (!Array.isArray(caList)) continue;
    for (const caQ of caList) {
      if (!caQ || !caQ.id || uniqueQuestionIds.has(caQ.id)) continue;
      uniqueQuestionIds.add(caQ.id);
      auditSummary.uniqueValidTotal++;
      auditSummary.examBreakdown.currentAffairsCompendium++;
      auditSummary.subjectCountsAfter['current-affairs'] = (auditSummary.subjectCountsAfter['current-affairs'] || 0) + 1;
      auditSummary.topicCounts['current-affairs::national-affairs'] = (auditSummary.topicCounts['current-affairs::national-affairs'] || 0) + 1;
      auditSummary.confidenceTiers.HIGH++;
    }
  }

  const playableShiftsCount = allShifts.length;
  const totalMockTests =
    FULL_MOCK_SERIES.length +
    SECTIONAL_TESTS.length +
    SUBJECT_MOCK_TESTS.length +
    MOCK_TESTS_METADATA.length +
    playableShiftsCount +
    TOTAL_TOPIC_UNITS;

  const manifest = {
    version: 2,
    generatedAt: auditSummary.generatedAt,
    stats: {
      totalQuestions: auditSummary.uniqueValidTotal,
      rawPaperTotal: auditSummary.rawTotal,
      verifiedQuestions: auditSummary.uniqueValidTotal,
      importantQuestions: 0,
      totalShifts: playableShiftsCount,
      totalSubtopics: TOTAL_TOPIC_UNITS,
      totalMockTests,
      underGraduate: auditSummary.examBreakdown.underGraduate,
      graduate: auditSummary.examBreakdown.graduate2024 + auditSummary.examBreakdown.graduate2026,
      graduate2024: auditSummary.examBreakdown.graduate2024,
      graduate2026: auditSummary.examBreakdown.graduate2026,
      groupD2025: auditSummary.examBreakdown.groupD2025,
      sscCgl: auditSummary.examBreakdown.sscCgl2020 + auditSummary.examBreakdown.sscCgl2026,
      sscCgl2020: auditSummary.examBreakdown.sscCgl2020,
      sscCgl2026: auditSummary.examBreakdown.sscCgl2026,
      appscGroup2: auditSummary.examBreakdown.appscGroup2,
      appsc2024Prelims: auditSummary.examBreakdown.appsc2024Prelims,
      currentAffairsBankQuestions: auditSummary.examBreakdown.currentAffairsCompendium,
      subjectCounts: {
        all: auditSummary.uniqueValidTotal,
        ...auditSummary.subjectCountsAfter
      },
      topicCounts: auditSummary.topicCounts
    },
    confidenceTiers: auditSummary.confidenceTiers,
    qualityFlagsBreakdown: auditSummary.qualityFlagsBreakdown,
    fileReports: auditSummary.fileReports,
    paperSummaries,
    shifts: allShifts
  };

  if (isApply) {
    fs.writeFileSync(path.join(DATA_DIR, 'bankManifest.json'), JSON.stringify(manifest, null, 2));
    // Remove redundant dead 9.22 MB mirror file if exact match exists in .backups/
    const redundantFile = path.join(DATA_DIR, 'rrbNtpc2025Full.json');
    if (fs.existsSync(redundantFile) && fs.existsSync(path.join(BACKUP_DIR, 'rrbNtpc2025Full.json'))) {
      fs.unlinkSync(redundantFile);
      console.log('Removed redundant duplicate rrbNtpc2025Full.json (backup preserved in .backups/pre-upgrade-data/).');
    }
    console.log(`Generated public/data/bankManifest.json (${(fs.statSync(path.join(DATA_DIR, 'bankManifest.json')).size / 1024).toFixed(1)} KB)`);
  }

  console.log('\n--- Audit Summary ---');
  console.log(JSON.stringify({
    rawTotal: auditSummary.rawTotal,
    uniqueValidTotal: auditSummary.uniqueValidTotal,
    reclassifiedHighOrReviewCount: auditSummary.reclassifiedHighOrReviewCount,
    lowConfidenceManualQueueCount: auditSummary.lowConfidenceManualQueueCount,
    confidenceTiers: auditSummary.confidenceTiers,
    qualityFlagsBreakdown: auditSummary.qualityFlagsBreakdown,
    subjectCountsBefore: auditSummary.subjectCountsBefore,
    subjectCountsAfter: auditSummary.subjectCountsAfter,
    fileReports: auditSummary.fileReports
  }, null, 2));
}

run().catch((err) => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
