/**
 * Canonical 2026 Government Competitive Exams Syllabus Registry
 *
 * Aggregates all 12 categories and 90+ non-duplicate canonical exam syllabi,
 * builds normalized subject & topic indexes for Firestore seeding/querying,
 * and exposes fast search/filter helpers.
 */

import { EXAM_CATEGORIES } from './examCategoriesData.js';
import { RAILWAY_EXAMS } from './exams/railwayExams.js';
import { SSC_EXAMS } from './exams/sscExams.js';
import { APPSC_EXAMS } from './exams/appscExams.js';
import { TGPSC_EXAMS } from './exams/tgpscExams.js';
import { UPSC_EXAMS } from './exams/upscExams.js';
import { BANKING_EXAMS } from './exams/bankingExams.js';
import { DEFENCE_POLICE_EXAMS } from './exams/defencePoliceExams.js';
import { ENGINEERING_TEACHING_OTHER_EXAMS } from './exams/engineeringTeachingOtherExams.js';
import { SUBJECT_BLUEPRINTS } from './subjectBlueprints.js';
import { ENGINEERING_BLUEPRINTS } from './engineeringBlueprints.js';

const RAW_EXAMS = [
  ...RAILWAY_EXAMS,
  ...SSC_EXAMS,
  ...APPSC_EXAMS,
  ...TGPSC_EXAMS,
  ...UPSC_EXAMS,
  ...BANKING_EXAMS,
  ...DEFENCE_POLICE_EXAMS,
  ...ENGINEERING_TEACHING_OTHER_EXAMS
];

// Enforce unique exam IDs & examCodes at module load time
const seenIds = new Set();
const seenCodes = new Set();

export const INITIAL_EXAM_SYLLABI = RAW_EXAMS.filter((exam) => {
  if (!exam || !exam.id) return false;
  if (seenIds.has(exam.id)) return false;
  if (exam.examCode && seenCodes.has(exam.examCode)) return false;
  seenIds.add(exam.id);
  if (exam.examCode) seenCodes.add(exam.examCode);
  return true;
});

export { EXAM_CATEGORIES, SUBJECT_BLUEPRINTS, ENGINEERING_BLUEPRINTS };

const CATEGORY_MAP = new Map(EXAM_CATEGORIES.map((c) => [c.id, c]));

export function getCategoryById(categoryId) {
  return CATEGORY_MAP.get(categoryId) || null;
}

/**
 * Checks whether an exam belongs to a category (either primary or secondary).
 */
export function examMatchesCategory(exam, categoryId) {
  if (!categoryId || categoryId === 'all') return true;
  if (exam.categoryId === categoryId) return true;
  return Array.isArray(exam.secondaryCategoryIds) && exam.secondaryCategoryIds.includes(categoryId);
}

/**
 * Counts how many published syllabi belong to each of the 12 categories.
 */
export function getSyllabusCategoryCounts(exams = INITIAL_EXAM_SYLLABI) {
  const counts = { all: exams.length };
  for (const cat of EXAM_CATEGORIES) {
    counts[cat.id] = exams.filter((exam) => examMatchesCategory(exam, cat.id)).length;
  }
  return counts;
}

/**
 * Counts total chapters across an exam's subject list.
 */
export function getExamChapterCount(exam) {
  if (!exam || !Array.isArray(exam.subjects)) return 0;
  return exam.subjects.reduce(
    (sum, subject) => sum + (Array.isArray(subject.chapters) ? subject.chapters.length : 0),
    0
  );
}

/**
 * Builds normalized `examSubjects` and `examTopics` records derived from the
 * canonical blueprint & exam list so Firestore collections stay clean and flat.
 */
export function buildNormalizedSubjectsAndTopics(exams = INITIAL_EXAM_SYLLABI) {
  const examSubjects = [];
  const examTopics = [];
  const seenSubjectKeys = new Set();
  const seenTopicKeys = new Set();

  for (const bp of [...Object.values(SUBJECT_BLUEPRINTS), ...Object.values(ENGINEERING_BLUEPRINTS)]) {
    if (!seenSubjectKeys.has(bp.id)) {
      seenSubjectKeys.add(bp.id);
      examSubjects.push({
        id: bp.id,
        name: bp.name,
        shortName: bp.shortName || bp.name,
        code: bp.code || bp.id.toUpperCase(),
        description: bp.description || '',
        chapterCount: Array.isArray(bp.chapters) ? bp.chapters.length : 0,
        sourceType: 'blueprint'
      });
    }

    for (const ch of bp.chapters || []) {
      const topicId = `${bp.id}__${ch.id}`;
      if (!seenTopicKeys.has(topicId)) {
        seenTopicKeys.add(topicId);
        examTopics.push({
          id: topicId,
          subjectId: bp.id,
          chapterId: ch.id,
          title: ch.title,
          topicType: ch.topicType || 'official',
          subtopics: Array.isArray(ch.subtopics) ? ch.subtopics : []
        });
      }
    }
  }

  for (const exam of exams) {
    for (const subj of exam.subjects || []) {
      for (const ch of subj.chapters || []) {
        if (ch.id && !seenTopicKeys.has(`${subj.id}__${ch.id}`)) {
          const topicId = `${exam.id}__${subj.id}__${ch.id}`;
          if (!seenTopicKeys.has(topicId)) {
            seenTopicKeys.add(topicId);
            examTopics.push({
              id: topicId,
              examId: exam.id,
              subjectId: subj.id,
              chapterId: ch.id,
              title: ch.title,
              topicType: ch.topicType || 'official',
              subtopics: Array.isArray(ch.subtopics) ? ch.subtopics : []
            });
          }
        }
      }
    }
  }

  return { examSubjects, examTopics };
}
