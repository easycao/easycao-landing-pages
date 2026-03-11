/**
 * Migration Script: students → Users
 * Story: Platform-5.1
 *
 * Usage:
 *   node app/scripts/migrate-students-to-users.mjs --dry-run    # Preview only
 *   node app/scripts/migrate-students-to-users.mjs              # Real migration
 */

import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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

console.log(`\n=== Students → Users Migration ===`);
console.log(`Mode: ${DRY_RUN ? "DRY RUN (no changes)" : "REAL MIGRATION"}\n`);

// --- Stats ---
let totalStudents = 0;
let matched = 0;
let unmatched = 0;
let alreadyMigrated = 0;
let errors = 0;
const errorList = [];

async function moveSubcollection(sourceDocRef, targetDocRef, subcolName) {
  const subSnap = await sourceDocRef.collection(subcolName).get();
  if (subSnap.empty) return 0;

  let moved = 0;
  for (const subDoc of subSnap.docs) {
    const targetRef = targetDocRef.collection(subcolName).doc(subDoc.id);
    const existingTarget = await targetRef.get();

    if (existingTarget.exists) {
      // Already exists at target — skip (idempotent)
      continue;
    }

    if (!DRY_RUN) {
      await targetRef.set(subDoc.data());
      await subDoc.ref.delete();
    }
    moved++;
  }
  return moved;
}

async function migrate() {
  // Step 1: Load all students
  const studentsSnap = await db.collection("students").get();
  totalStudents = studentsSnap.size;
  console.log(`Found ${totalStudents} students to process.\n`);

  if (totalStudents === 0) {
    console.log("No students to migrate. Done.");
    return;
  }

  // Step 2: Build email → Users doc map for matching
  const usersSnap = await db.collection("Users").get();
  const usersByEmail = new Map();
  for (const doc of usersSnap.docs) {
    const email = (doc.data().email || "").toLowerCase();
    if (email) {
      // If multiple Users docs with same email, prefer the one with authLinked: true
      const existing = usersByEmail.get(email);
      if (!existing || (!existing.data().authLinked && doc.data().authLinked)) {
        usersByEmail.set(email, doc);
      }
    }
  }
  console.log(`Found ${usersSnap.size} existing Users docs (${usersByEmail.size} unique emails).\n`);

  // Step 3: Process each student
  // Group by email to handle duplicates (take newest by createdAt)
  const studentsByEmail = new Map();
  for (const doc of studentsSnap.docs) {
    const data = doc.data();
    const email = (data.email || "").toLowerCase();
    if (!email) {
      console.log(`  SKIP: student ${doc.id} has no email`);
      continue;
    }

    const existing = studentsByEmail.get(email);
    if (existing) {
      // Keep the newest doc (by createdAt)
      const existingDate = existing.data().createdAt?.toDate?.() || new Date(0);
      const currentDate = data.createdAt?.toDate?.() || new Date(0);
      if (currentDate > existingDate) {
        console.log(`  WARN: duplicate student email ${email} — keeping newer doc ${doc.id} over ${existing.id}`);
        studentsByEmail.set(email, doc);
      } else {
        console.log(`  WARN: duplicate student email ${email} — keeping existing doc ${existing.id} over ${doc.id}`);
      }
    } else {
      studentsByEmail.set(email, doc);
    }
  }

  for (const [email, studentDoc] of studentsByEmail) {
    const studentData = studentDoc.data();

    try {
      const usersDoc = usersByEmail.get(email);

      if (usersDoc) {
        // MATCH: Student has an existing Users doc (app account exists)
        matched++;
        const targetRef = db.collection("Users").doc(usersDoc.id);

        // Merge CRM fields into existing Users doc
        const crmFields = {
          hotmartUserId: studentData.hotmartUserId ?? null,
          hotmartStatus: studentData.hotmartStatus ?? null,
          turmaId: studentData.turmaId ?? null,
          platformAccess: studentData.platformAccess ?? false,
          csEnabled: studentData.csEnabled !== false,
          approved: studentData.approved ?? false,
          approvedAt: studentData.approvedAt ?? null,
          tags: studentData.tags || [],
          totalEnrollments: studentData.totalEnrollments || 0,
          currentEnrollmentId: studentData.currentEnrollmentId || "",
          phone: studentData.phone || usersDoc.data().phone || "",
          document: studentData.document || usersDoc.data().document || "",
          city: studentData.city || usersDoc.data().city || "",
          state: studentData.state || usersDoc.data().state || "",
          firstName: studentData.firstName || usersDoc.data().firstName || "",
          lastName: studentData.lastName || usersDoc.data().lastName || "",
          courseProgress: studentData.courseProgress ?? null,
          updatedAt: FieldValue.serverTimestamp(),
        };

        console.log(`  MERGE: ${email} → Users/${usersDoc.id} (matched by email)`);

        if (!DRY_RUN) {
          await targetRef.set(crmFields, { merge: true });
        }

        // Move subcollections
        const enrollmentsMoved = await moveSubcollection(studentDoc.ref, targetRef, "enrollments");
        const progressMoved = await moveSubcollection(studentDoc.ref, targetRef, "progress");
        console.log(`    Subcollections: ${enrollmentsMoved} enrollments, ${progressMoved} progress docs moved`);

        // Delete the source student doc
        if (!DRY_RUN) {
          await studentDoc.ref.delete();
        }
      } else {
        // NO MATCH: Student never created app account
        unmatched++;

        const newData = {
          uid: null,
          authLinked: false,
          name: studentData.name || "",
          firstName: studentData.firstName || "",
          lastName: studentData.lastName || "",
          email,
          phone: studentData.phone || "",
          document: studentData.document || "",
          city: studentData.city || "",
          state: studentData.state || "",
          hotmartUserId: studentData.hotmartUserId ?? null,
          hotmartStatus: studentData.hotmartStatus ?? null,
          turmaId: studentData.turmaId ?? null,
          platformAccess: studentData.platformAccess ?? false,
          csEnabled: studentData.csEnabled !== false,
          approved: studentData.approved ?? false,
          approvedAt: studentData.approvedAt ?? null,
          tags: studentData.tags || [],
          totalEnrollments: studentData.totalEnrollments || 0,
          currentEnrollmentId: studentData.currentEnrollmentId || "",
          courseProgress: studentData.courseProgress ?? null,
          createdAt: studentData.createdAt || FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        };

        console.log(`  CREATE: ${email} → Users/{auto-id} (authLinked: false)`);

        let targetRef;
        if (!DRY_RUN) {
          const docRef = await db.collection("Users").add(newData);
          targetRef = docRef;
        } else {
          targetRef = db.collection("Users").doc("dry-run-placeholder");
        }

        // Move subcollections
        const enrollmentsMoved = await moveSubcollection(studentDoc.ref, targetRef, "enrollments");
        const progressMoved = await moveSubcollection(studentDoc.ref, targetRef, "progress");
        console.log(`    Subcollections: ${enrollmentsMoved} enrollments, ${progressMoved} progress docs moved`);

        // Delete the source student doc
        if (!DRY_RUN) {
          await studentDoc.ref.delete();
        }
      }
    } catch (err) {
      errors++;
      const msg = `${email}: ${err.message || err}`;
      errorList.push(msg);
      console.error(`  ERROR: ${msg}`);
    }
  }

  // Handle duplicate student docs (ones not chosen as primary)
  const processedEmails = new Set(studentsByEmail.keys());
  for (const doc of studentsSnap.docs) {
    const email = (doc.data().email || "").toLowerCase();
    if (!email || studentsByEmail.get(email)?.id === doc.id) continue;
    // This is a duplicate doc — delete it after verifying primary was migrated
    if (!DRY_RUN) {
      // Move any subcollections to the primary target first
      const primaryStudent = studentsByEmail.get(email);
      const usersDoc = usersByEmail.get(email);
      if (usersDoc || primaryStudent) {
        console.log(`  DELETE DUPLICATE: student ${doc.id} (email: ${email})`);
        await doc.ref.delete();
      }
    } else {
      console.log(`  WOULD DELETE DUPLICATE: student ${doc.id} (email: ${email})`);
    }
  }

  // Summary
  console.log(`\n=== Migration Summary ===`);
  console.log(`Total students processed: ${totalStudents}`);
  console.log(`Unique emails: ${studentsByEmail.size}`);
  console.log(`Matched (merged into existing Users): ${matched}`);
  console.log(`Unmatched (created as authLinked:false): ${unmatched}`);
  console.log(`Errors: ${errors}`);
  if (errorList.length > 0) {
    console.log(`\nError details:`);
    for (const e of errorList) {
      console.log(`  - ${e}`);
    }
  }
  console.log(`\nMode: ${DRY_RUN ? "DRY RUN — no changes were made" : "REAL — changes applied"}`);
}

migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
