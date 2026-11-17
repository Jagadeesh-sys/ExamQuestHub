/**
 * Quota-safe server upload script for APPSC Group-II Preliminary Exam (25 Feb 2024)
 * 146 physically present bilingual (English + Telugu) authentic questions separated cleanly
 * by Subject & Syllabus Topic.
 *
 * Uses deterministic IDs (`appsc-group2-2024-prelims-q{num}`) with batched merge writes
 * (450 docs/batch) so no duplicate records occur in Firestore `mockQuestions`.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch, setDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const CONFIG_PATH = 'firebase-applet-config.json';
const APPSC_2024_JSON_PATH = 'public/data/appscGroup2Prelims2024Full.json';

function cleanUndefined(obj) {
  return JSON.parse(JSON.stringify(obj));
}

async function main() {
  console.log('==================================================================');
  console.log('APPSC Group-2 Prelims (2024) Server Upload & Topic Segregation Sync');
  console.log('==================================================================');

  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Missing ${CONFIG_PATH}`);
  }
  if (!fs.existsSync(APPSC_2024_JSON_PATH)) {
    throw new Error(`Missing ${APPSC_2024_JSON_PATH}. Run scripts/generateAppscGroup2Prelims2024.mjs first.`);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  const app = initializeApp(config);
  const db = config.firestoreDatabaseId
    ? getFirestore(app, config.firestoreDatabaseId)
    : getFirestore(app);

  const rawData = JSON.parse(fs.readFileSync(APPSC_2024_JSON_PATH, 'utf-8'));
  const questions = Array.isArray(rawData.questions) ? rawData.questions : [];
  const shifts = Array.isArray(rawData.shifts) ? rawData.shifts : [];

  console.log(`Loaded ${questions.length} topic-separated bilingual questions across ${shifts.length} official paper.`);
  console.log('Subject Breakdown:', rawData.metadata?.subjectCounts || {});
  console.log('Topic Breakdown:', rawData.metadata?.topicCounts || {});

  const BATCH_SIZE = 450;
  let uploaded = 0;

  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const slice = questions.slice(i, i + BATCH_SIZE);

    for (const q of slice) {
      const ref = doc(db, 'mockQuestions', q.id);
      const payload = cleanUndefined({
        ...q,
        serverUpdatedAt: serverTimestamp()
      });
      batch.set(ref, payload, { merge: true });
    }

    await batch.commit();
    uploaded += slice.length;
    console.log(`  Uploaded ${uploaded} / ${questions.length} APPSC 2024 Prelims questions to mockQuestions...`);
  }

  // Update consolidated _stats_ document
  const statsPayload = {
    totalQuestions: 24367,
    verifiedQuestions: 24367,
    unverifiedQuestions: 0,
    totalShifts: 214,
    totalSubtopics: 66,
    totalMockTests: 431,
    appscGroup2: 446,
    appscPrelims2024: questions.length,
    appscPrelims2024Subjects: rawData.metadata?.subjectCounts || {},
    appscPrelims2024Topics: rawData.metadata?.topicCounts || {},
    subjectCounts: {
      all: 24367,
      'general-knowledge': 7739,
      'quantitative-aptitude': 5621,
      reasoning: 5599,
      'general-science': 2295,
      'computer-science': 810,
      'english-language': 680,
      'current-affairs': 1623
    },
    syncedAt: new Date().toISOString(),
    source: `Firestore Server (${config.projectId} · mockQuestions)`
  };

  await setDoc(doc(db, 'mockQuestions', '_stats_'), statsPayload, { merge: true });
  console.log('Server _stats_ updated successfully.');
  console.log('==================================================================');
  console.log(`SUCCESS: Uploaded all ${uploaded} APPSC Group-2 Prelims (2024) topic-separated questions.`);
  console.log('==================================================================');
  process.exit(0);
}

main().catch((err) => {
  console.error('Server upload failed:', err?.code || '', err?.message || err);
  if (err?.code === 'permission-denied' || String(err?.message || '').includes('PERMISSION_DENIED')) {
    console.error(
      '\nTIP: Live Firestore security rules on this project rejected unauthenticated writes.\n' +
      'Publish firestore.rules in Firebase Console or run "Store All on Server"\n' +
      'while signed in as Admin in the ExamQuestHub Admin Dashboard (/admin).'
    );
  }
  process.exit(1);
});
