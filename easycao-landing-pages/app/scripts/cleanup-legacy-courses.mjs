/**
 * Cleanup Script: Remove FlutterFlow legacy docs from courses collection
 * Story: Platform-5.1, Phase D (AC19)
 *
 * FlutterFlow created top-level course docs without `modules` subcollections.
 * Platform-created courses have `modules` subcollections.
 * This script identifies and deletes the FlutterFlow legacy docs.
 *
 * Usage:
 *   node app/scripts/cleanup-legacy-courses.mjs --dry-run    # Preview only
 *   node app/scripts/cleanup-legacy-courses.mjs              # Real deletion
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

console.log(`\n=== Legacy Courses Cleanup ===`);
console.log(`Mode: ${DRY_RUN ? "DRY RUN (no changes)" : "REAL DELETION"}\n`);

async function cleanup() {
  const coursesSnap = await db.collection("courses").get();
  console.log(`Found ${coursesSnap.size} course docs total.\n`);

  let platform = 0;
  let legacy = 0;
  const legacyDocs = [];

  for (const doc of coursesSnap.docs) {
    const modulesSnap = await doc.ref.collection("modules").limit(1).get();

    if (modulesSnap.empty) {
      // No modules subcollection = FlutterFlow legacy doc
      legacy++;
      legacyDocs.push(doc);
      const data = doc.data();
      console.log(`  LEGACY: courses/${doc.id} — "${data.title || data.name || "(no title)"}" (no modules subcollection)`);
    } else {
      platform++;
      console.log(`  KEEP: courses/${doc.id} — has modules subcollection`);
    }
  }

  if (!DRY_RUN) {
    for (const doc of legacyDocs) {
      await doc.ref.delete();
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Platform courses (kept): ${platform}`);
  console.log(`Legacy courses ${DRY_RUN ? "(would delete)" : "(deleted)"}: ${legacy}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN — no changes" : "REAL — changes applied"}`);
}

cleanup().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
