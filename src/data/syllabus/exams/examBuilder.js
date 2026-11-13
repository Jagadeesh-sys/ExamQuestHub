/**
 * Helper to construct normalized, 20-point accurate exam syllabus records
 * without duplicating chapter trees unnecessarily while allowing exam-specific
 * overrides and custom official vs recommended topics.
 */

import { SUBJECT_BLUEPRINTS } from '../subjectBlueprints.js';
import { ENGINEERING_BLUEPRINTS } from '../engineeringBlueprints.js';

const ALL_BLUEPRINTS = {
  ...SUBJECT_BLUEPRINTS,
  ...ENGINEERING_BLUEPRINTS
};

/**
 * Builds a clean subject entry referencing a blueprint (optionally filtering
 * specific chapter IDs and/or appending exam-specific chapters).
 */
export function fromBlueprint(
  blueprintId,
  {
    subjectId,
    subjectName,
    stageTag = 'All Stages',
    includeChapterIds = null,
    excludeChapterIds = [],
    extraChapters = [],
    recommendedChapterIds = []
  } = {}
) {
  const bp = ALL_BLUEPRINTS[blueprintId];
  if (!bp) {
    return {
      id: subjectId || blueprintId,
      name: subjectName || blueprintId,
      stageTag,
      chapters: extraChapters
    };
  }

  let chapters = bp.chapters.filter((ch) => {
    if (excludeChapterIds.includes(ch.id)) return false;
    if (Array.isArray(includeChapterIds) && includeChapterIds.length > 0) {
      return includeChapterIds.includes(ch.id);
    }
    return true;
  });

  chapters = chapters.map((ch) => ({
    ...ch,
    topicType: recommendedChapterIds.includes(ch.id) ? 'recommended' : (ch.topicType || 'official')
  }));

  return {
    id: subjectId || bp.id,
    name: subjectName || bp.name,
    shortName: bp.shortName,
    code: bp.code,
    stageTag,
    description: bp.description,
    chapters: [...chapters, ...extraChapters]
  };
}

/**
 * Ensures every exam conforms to the complete 20-point schema with consistent defaults.
 */
export function buildExamSyllabus(config) {
  const {
    id,
    examCode,
    name,
    shortName,
    categoryId,
    secondaryCategoryIds = [],
    scope = 'Central', // 'Central' | 'State'
    state = null,
    popular = false,
    authority,
    introduction,
    qualification,
    ageLimit = 'Refer to official notification for post-wise age limits & category relaxations',
    selectionProcess,
    stages = [],
    examPattern = [],
    totalQuestions,
    totalMarks,
    duration,
    negativeMarking,
    subjects = [],
    practicalTechnicalTopics = [],
    languages = ['English', 'Hindi'],
    physicalStandards = null,
    skillTestDetails = null,
    interviewDetails = null,
    officialNotificationRef,
    officialWebsiteUrl,
    officialNotificationUrl,
    officialSyllabusPdfUrl = null,
    syllabusPdfLabel = 'Official Exam Portal & Syllabus Reference',
    notificationYear = 2026,
    verificationStatus = 'Verified 2026', // 'Verified 2026' | 'Latest Official (2025)' | 'Latest Official (2024)' | 'Provisional — Verify Notification'
    provisionalNote = null,
    lastVerifiedDate = '2026-11-01',
    syllabusVersion = 'v2026.1',
    versionHistory = [],
    status = 'Published', // 'Published' | 'Draft'
    linkedMockCategory = null,
    linkedExamLevel = null
  } = config;

  const resolvedHistory =
    versionHistory.length > 0
      ? versionHistory
      : [
          {
            version: syllabusVersion,
            year: notificationYear,
            updatedAt: lastVerifiedDate,
            notes: `Aligned with ${officialNotificationRef || `${notificationYear} Official Notification`}.`
          }
        ];

  return {
    id,
    examCode,
    name,
    shortName: shortName || name,
    categoryId,
    secondaryCategoryIds,
    scope,
    state,
    popular,
    authority,
    introduction,
    qualification,
    ageLimit,
    selectionProcess,
    stages,
    examPattern,
    totalQuestions,
    totalMarks,
    duration,
    negativeMarking,
    subjects,
    practicalTechnicalTopics,
    languages,
    physicalStandards,
    skillTestDetails,
    interviewDetails,
    officialNotificationRef,
    officialWebsiteUrl,
    officialNotificationUrl: officialNotificationUrl || officialWebsiteUrl,
    officialSyllabusPdfUrl,
    syllabusPdfLabel,
    notificationYear,
    verificationStatus,
    provisionalNote,
    lastVerifiedDate,
    syllabusVersion,
    versionHistory: resolvedHistory,
    status,
    active: status === 'Published',
    linkedMockCategory,
    linkedExamLevel
  };
}
