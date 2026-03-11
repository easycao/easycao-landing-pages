import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function: onUserCreated
 * Triggers when a new doc is created in Users/{uid}.
 *
 * Purpose: Auto-deduplicate when FlutterFlow creates a Users doc for someone
 * who already has a Hotmart pre-created doc (authLinked: false).
 *
 * Flow:
 * 1. New Users/{uid} created (by FlutterFlow app sign-up)
 * 2. Check if another Users doc exists with same email + authLinked: false
 * 3. If found: merge CRM/enrollment data into new doc, move subcollections, delete old doc
 */
export const onUserCreated = functions.firestore
  .document("Users/{uid}")
  .onCreate(async (snap, context) => {
    const newData = snap.data();
    const newDocId = context.params.uid;
    const email = (newData.email || "").toLowerCase();

    if (!email) {
      functions.logger.info(`onUserCreated: no email on Users/${newDocId}, skipping`);
      return;
    }

    // Skip if this doc itself is authLinked: false (Hotmart pre-created)
    if (newData.authLinked === false) {
      functions.logger.info(`onUserCreated: Users/${newDocId} is authLinked:false, skipping`);
      return;
    }

    // Find existing doc with same email and authLinked: false
    const existingSnap = await db
      .collection("Users")
      .where("email", "==", email)
      .where("authLinked", "==", false)
      .limit(1)
      .get();

    if (existingSnap.empty) {
      functions.logger.info(`onUserCreated: no pre-existing doc for ${email}`);
      return;
    }

    const oldDoc = existingSnap.docs[0];
    const oldData = oldDoc.data();
    const oldDocId = oldDoc.id;

    // Don't merge with self
    if (oldDocId === newDocId) return;

    functions.logger.info(
      `onUserCreated: merging Users/${oldDocId} → Users/${newDocId} for ${email}`
    );

    // Merge CRM fields from old doc into new doc
    const mergeFields: Record<string, unknown> = {};
    const crmKeys = [
      "hotmartUserId", "hotmartStatus", "turmaId", "platformAccess",
      "csEnabled", "approved", "approvedAt", "tags", "totalEnrollments",
      "currentEnrollmentId", "phone", "document", "city", "state",
      "firstName", "lastName", "courseProgress",
    ];

    for (const key of crmKeys) {
      if (oldData[key] !== undefined && oldData[key] !== null && oldData[key] !== "") {
        // Don't overwrite if new doc already has a value (except for CRM-specific fields)
        if (newData[key] === undefined || newData[key] === null || newData[key] === "") {
          mergeFields[key] = oldData[key];
        }
      }
    }

    // Always set authLinked and uid on the new doc
    mergeFields.authLinked = true;
    mergeFields.uid = newDocId;

    // Always take enrollment data from old doc (CRM source of truth)
    if (oldData.totalEnrollments > 0) {
      mergeFields.totalEnrollments = oldData.totalEnrollments;
      mergeFields.currentEnrollmentId = oldData.currentEnrollmentId;
      mergeFields.platformAccess = oldData.platformAccess;
      mergeFields.turmaId = oldData.turmaId;
    }

    const newDocRef = db.collection("Users").doc(newDocId);
    await newDocRef.set(mergeFields, { merge: true });

    // Move subcollections (enrollments, progress)
    for (const subcol of ["enrollments", "progress"]) {
      const subSnap = await oldDoc.ref.collection(subcol).get();
      for (const subDoc of subSnap.docs) {
        const targetRef = newDocRef.collection(subcol).doc(subDoc.id);
        const existing = await targetRef.get();
        if (!existing.exists) {
          await targetRef.set(subDoc.data());
        }
        await subDoc.ref.delete();
      }
      functions.logger.info(
        `onUserCreated: moved ${subSnap.size} ${subcol} docs from ${oldDocId} → ${newDocId}`
      );
    }

    // Delete old doc
    await oldDoc.ref.delete();

    functions.logger.info(
      `onUserCreated: merge complete — deleted Users/${oldDocId}, enriched Users/${newDocId} for ${email}`,
      { oldDocId, newDocId, email, fieldsMerged: Object.keys(mergeFields) }
    );
  });
