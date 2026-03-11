/**
 * Cleanup Script: Delete dead/legacy Firestore collections
 * Story: Platform-5.1, Phase D (AC18, AC20)
 *
 * Usage:
 *   node app/scripts/cleanup-dead-collections.mjs --dry-run    # Preview only
 *   node app/scripts/cleanup-dead-collections.mjs              # Real deletion
 */

import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// --- Load .env.local ---
const envPath = new URL("../.env.local", import.meta.url).pathname.replace(/^\//, "");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const eqIndex = line.indexOf("=");
  if (eqIndex === -1 || line.startsWith("#")) continue;
  const key = line.slice(0, eqIndex).trim();
  let value = line.slice(eqIndex + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);
const DRY_RUN = process.argv.includes("--dry-run");

// Dead collections to delete (AC18 + AC20)
const DEAD_COLLECTIONS = [
  "Part1_Answers",
  "Part2_Answers",
  "Part3_Answers",
  "Part4_Answers",
  "answersRecordings",
  "TranscribedAudio",
  "audio_recordings",
  "Class_Completion_Checkbox_Collection",
  "Downloadable_Files",
  "pending-enrollments",
  // Top-level FlutterFlow legacy (AC20)
  "modules",
  "classes",
];

console.log(`\n=== Dead Collections Cleanup ===`);
console.log(`Mode: ${DRY_RUN ? "DRY RUN (no changes)" : "REAL DELETION"}\n`);

async function deleteCollection(collectionName) {
  const collRef = db.collection(collectionName);
  const snapshot = await collRef.limit(1).get();

  if (snapshot.empty) {
    console.log(`  ${collectionName}: empty or does not exist — skip`);
    return 0;
  }

  // Count docs
  const countSnap = await collRef.get();
  const count = countSnap.size;
  console.log(`  ${collectionName}: ${count} docs`);

  if (DRY_RUN) {
    console.log(`    Would delete ${count} docs`);
    return count;
  }

  // Delete in batches of 500
  const BATCH_SIZE = 500;
  let deleted = 0;
  let batch = db.batch();
  let batchCount = 0;

  for (const doc of countSnap.docs) {
    batch.delete(doc.ref);
    batchCount++;
    deleted++;

    if (batchCount >= BATCH_SIZE) {
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
      console.log(`    Deleted ${deleted}/${count}...`);
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`    Deleted ${deleted} docs`);
  return deleted;
}

async function cleanup() {
  let totalDeleted = 0;

  for (const name of DEAD_COLLECTIONS) {
    try {
      const count = await deleteCollection(name);
      totalDeleted += count;
    } catch (err) {
      console.error(`  ERROR deleting ${name}: ${err.message}`);
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Collections processed: ${DEAD_COLLECTIONS.length}`);
  console.log(`Total docs ${DRY_RUN ? "would delete" : "deleted"}: ${totalDeleted}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN — no changes" : "REAL — changes applied"}`);
}

cleanup().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
