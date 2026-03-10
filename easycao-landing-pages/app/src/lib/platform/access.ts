import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * Check if a student has platform access (server-side, uses admin SDK).
 * Returns true if student.platformAccess === true.
 */
export async function checkPlatformAccess(uid: string): Promise<boolean> {
  const db = getFirestoreDb();
  const doc = await db.collection("students").doc(uid).get();
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
  const studentDoc = await db.collection("students").doc(uid).get();
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
 * Link any pending enrollments (purchased before registering) to a newly registered student.
 */
export async function linkPendingEnrollments(
  uid: string,
  email: string
): Promise<void> {
  const db = getFirestoreDb();
  const pendingSnap = await db
    .collection("pending-enrollments")
    .where("email", "==", email.toLowerCase())
    .get();

  if (pendingSnap.empty) return;

  for (const pending of pendingSnap.docs) {
    const data = pending.data();
    // Set platform access on the student
    await db
      .collection("students")
      .doc(uid)
      .update({
        platformAccess: true,
        turmaId: data.turmaId || null,
      });
    // Delete the pending enrollment
    await pending.ref.delete();
  }
}
