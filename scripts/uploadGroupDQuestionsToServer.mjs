/**
 * Quota-safe server upload script for RRB Group D 2025 (CEN 09/2025 · 48 Sets / 4,800 Qs)
 * separated cleanly by Subject & Syllabus Topic.
 *
 * Uses deterministic IDs (`rrb-group-d-2025-s{set}-q{num}`) with batched merge writes
 * (450 docs/batch) so no full-collection read or duplicate records occur on Firestore.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch, setDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const CONFIG_PATH = 'firebase-applet-config.json';
const GROUP_D_JSON_PATH = 'public/data/rrbGroupD2025Full.json';

function cleanUndefined(obj) {
  return JSON.parse(JSON.stringify(obj));
}

async function main() {
  console.log('==================================================================');
  console.log('RRB Group D 2025 Server Upload & Topic Segregation Sync');
  console.log('==================================================================');

  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Missing ${CONFIG_PATH}`);
  }
  if (!fs.existsSync(GROUP_D_JSON_PATH)) {
    throw new Error(`Missing ${GROUP_D_JSON_PATH}. Run scripts/extractRRBGroupD2025.mjs first.`);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  const app = initializeApp(config);
  const db = config.firestoreDatabaseId
    ? getFirestore(app, config.firestoreDatabaseId)
    : getFirestore(app);

  const rawData = JSON.parse(fs.readFileSync(GROUP_D_JSON_PATH, 'utf-8'));
  const questions = Array.isArray(rawData.questions) ? rawData.questions : [];
  const shifts = Array.isArray(rawData.shifts) ? rawData.shifts : [];

  console.log(`Loaded ${questions.length} topic-separated questions across ${shifts.length} shifts.`);
  console.log('Subject Breakdown:', rawData.metadata?.subjectCounts || {});

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
    console.log(`  Uploaded ${uploaded} / ${questions.length} Group D questions to mockQuestions...`);
  }

  // Update consolidated _stats_ document
  const statsPayload = {
    totalQuestions: 23921,
    verifiedQuestions: 23921,
    unverifiedQuestions: 0,
    totalShifts: 211,
    totalMockTests: 428,
    groupD2025: questions.length,
    groupDShifts: shifts.length,
    groupDSubjects: rawData.metadata?.subjectCounts || {},
    groupDTopics: rawData.metadata?.topicCounts || {},
    syncedAt: new Date().toISOString(),
    source: `Firestore Server (${config.projectId} · mockQuestions)`
  };

  await setDoc(doc(db, 'mockQuestions', '_stats_'), statsPayload, { merge: true });
  console.log('Server _stats_ updated successfully.');
  console.log('==================================================================');
  console.log(`SUCCESS: Uploaded all ${uploaded} RRB Group D 2025 topic-separated questions.`);
  console.log('==================================================================');
  process.exit(0);
}

main().catch((err) => {
  console.error('Server upload failed:', err?.code || '', err?.message || err);
  if (err?.code === 'permission-denied' || String(err?.message || '').includes('PERMISSION_DENIED')) {
    console.error(
      '\nTIP: Live Firestore security rules on this project rejected unauthenticated writes.\n' +
      'Publish firestore.rules in Firebase Console or run "Store All on Server" / "Upload Group D 2025"\n' +
      'while signed in as Admin in the ExamQuestHub Admin Dashboard (/admin).'
    );
  }
  process.exit(1);
});
