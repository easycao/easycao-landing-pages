import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * Check if a student has platform access (server-side, uses admin SDK).
 * Returns true if student.platformAccess === true.
 */
export async function checkPlatformAccess(uid: string): Promise<boolean> {
  const db = getFirestoreDb();
  const doc = await db.collection("Users").doc(uid).get();
  if (!doc.exists) return false;
  return doc.data()?.platformAccess === true;
}

/**
 * Check platform access from the client side via API.
 */
export async function checkPlatformAccessClient(
  uid: string
): Promise<boolean> {
  // This is called from the client — delegates to an API route
  const res = await fetch(`/api/platform/access?uid=${uid}`);
  if (!res.ok) return false;
  const data = await res.json();
  return data.hasAccess === true;
}

/**
 * Get the list of course IDs a student can access based on their turma.
 * Returns empty array if student has no turma or turma has no courses.
 */
export async function getAccessibleCourseIds(uid: string): Promise<string[]> {
  const db = getFirestoreDb();
  const studentDoc = await db.collection("Users").doc(uid).get();
  if (!studentDoc.exists) return [];

  const turmaId = studentDoc.data()?.turmaId;
  if (!turmaId) return [];

  const turmaDoc = await db.collection("turmas").doc(turmaId).get();
  if (!turmaDoc.exists) return [];

  return turmaDoc.data()?.courseIds || [];
}

/**
 * Check if a student can access a specific course via their turma.
 */
export async function hasCourseAccess(
  uid: string,
  courseId: string
): Promise<boolean> {
  const accessibleCourseIds = await getAccessibleCourseIds(uid);
  return accessibleCourseIds.includes(courseId);
}

/**
 * Link an authLinked:false Users doc (Hotmart pre-created) to a newly registered user.
 * Merges data and subcollections from the old doc into the new Users/{uid} doc.
 */
export async function linkPreCreatedUser(
  uid: string,
  email: string
): Promise<boolean> {
  const db = getFirestoreDb();
  const existingSnap = await db
    .collection("Users")
    .where("email", "==", email.toLowerCase())
    .where("authLinked", "==", false)
    .limit(1)
    .get();

  if (existingSnap.empty) return false;

  const oldDoc = existingSnap.docs[0];
  if (oldDoc.id === uid) return false; // Already the same doc

  const oldData = oldDoc.data();

  // Merge CRM fields into the new Users/{uid} doc
  await db
    .collection("Users")
    .doc(uid)
    .set(
      {
        ...oldData,
        uid,
        authLinked: true,
      },
      { merge: true }
    );

  // Move subcollections (enrollments, progress)
  for (const subcol of ["enrollments", "progress"]) {
    const subSnap = await oldDoc.ref.collection(subcol).get();
    for (const subDoc of subSnap.docs) {
      await db
        .collection("Users")
        .doc(uid)
        .collection(subcol)
        .doc(subDoc.id)
        .set(subDoc.data());
      await subDoc.ref.delete();
    }
  }

  // Delete the old doc
  await oldDoc.ref.delete();
  return true;
}
