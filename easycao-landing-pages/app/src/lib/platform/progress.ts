import { getFirestoreDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Mark a lesson as complete for a student.
 * Adds lessonId to completedLessons array, updates lastLessonId, lastAccessedAt, and recalculates progressPercent.
 */
export async function markLessonComplete(
  uid: string,
  courseId: string,
  lessonId: string,
  totalLessons: number
) {
  const db = getFirestoreDb();
  const progressRef = db
    .collection("Users")
    .doc(uid)
    .collection("progress")
    .doc(courseId);

  const snap = await progressRef.get();
  const existing = snap.exists ? snap.data() : null;
  const completedLessons: string[] = existing?.completedLessons || [];

  if (!completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
  }

  const progressPercent =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  await progressRef.set(
    {
      completedLessons,
      lastLessonId: lessonId,
      lastAccessedAt: FieldValue.serverTimestamp(),
      progressPercent,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { completedLessons, progressPercent };
}

/**
 * Get student progress for a specific course.
 * Filters out completed lessons that no longer exist in the course.
 */
export async function getStudentProgress(uid: string, courseId: string) {
  const db = getFirestoreDb();
  const snap = await db
    .collection("Users")
    .doc(uid)
    .collection("progress")
    .doc(courseId)
    .get();

  if (!snap.exists) {
    return {
      completedLessons: [] as string[],
      lastLessonId: null,
      lastAccessedAt: null,
      progressPercent: 0,
    };
  }

  const data = snap.data()!;
  const rawCompleted: string[] = data.completedLessons || [];

  // Filter against lessons that still exist in the course
  const validLessonIds = await getValidLessonIds(courseId);
  const completedLessons = rawCompleted.filter((id) => validLessonIds.has(id));

  const totalLessons = validLessonIds.size;
  const progressPercent =
    totalLessons > 0
      ? Math.round((completedLessons.length / totalLessons) * 100)
      : 0;

  return {
    completedLessons,
    lastLessonId: data.lastLessonId || null,
    lastAccessedAt: data.lastAccessedAt?.toDate?.()?.toISOString() || null,
    progressPercent,
  };
}

/**
 * Update last accessed lesson for "Continuar de onde parou" feature.
 */
export async function updateLastAccessed(
  uid: string,
  courseId: string,
  lessonId: string
) {
  const db = getFirestoreDb();
  await db
    .collection("Users")
    .doc(uid)
    .collection("progress")
    .doc(courseId)
    .set(
      {
        lastLessonId: lessonId,
        lastAccessedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

/**
 * Get all progress data for the dashboard (across all courses).
 */
export async function getDashboardProgress(uid: string) {
  const db = getFirestoreDb();
  const progressSnap = await db
    .collection("Users")
    .doc(uid)
    .collection("progress")
    .get();

  const courseProgress: Record<
    string,
    {
      completedLessons: string[];
      lastLessonId: string | null;
      lastAccessedAt: string | null;
      progressPercent: number;
    }
  > = {};

  let lastAccessed: {
    courseId: string;
    lessonId: string;
    accessedAt: Date | null;
  } | null = null;

  for (const doc of progressSnap.docs) {
    const data = doc.data();
    const accessedAt = data.lastAccessedAt?.toDate?.() || null;
    const rawCompleted: string[] = data.completedLessons || [];

    // Filter against lessons that still exist
    const validLessonIds = await getValidLessonIds(doc.id);
    const completedLessons = rawCompleted.filter((id) => validLessonIds.has(id));
    const totalLessons = validLessonIds.size;
    const progressPercent =
      totalLessons > 0
        ? Math.round((completedLessons.length / totalLessons) * 100)
        : 0;

    courseProgress[doc.id] = {
      completedLessons,
      lastLessonId: data.lastLessonId || null,
      lastAccessedAt: accessedAt?.toISOString() || null,
      progressPercent,
    };

    if (
      data.lastLessonId &&
      accessedAt &&
      (!lastAccessed || accessedAt > lastAccessed.accessedAt!)
    ) {
      lastAccessed = {
        courseId: doc.id,
        lessonId: data.lastLessonId,
        accessedAt,
      };
    }
  }

  return { courseProgress, lastAccessed };
}

/**
 * Count total lessons in a course (published modules + published lessons).
 */
export async function countCourseLessons(courseId: string): Promise<number> {
  const db = getFirestoreDb();
  const modulesSnap = await db
    .collection("courses")
    .doc(courseId)
    .collection("modules")
    .where("status", "==", "published")
    .get();

  let count = 0;
  for (const mod of modulesSnap.docs) {
    const lessonsSnap = await db
      .collection("courses")
      .doc(courseId)
      .collection("modules")
      .doc(mod.id)
      .collection("lessons")
      .where("status", "==", "published")
      .get();
    count += lessonsSnap.size;
  }
  return count;
}

/**
 * Get the set of valid (published) lesson IDs for a course.
 * Used to filter out progress entries for deleted lessons.
 */
async function getValidLessonIds(courseId: string): Promise<Set<string>> {
  const db = getFirestoreDb();
  const modulesSnap = await db
    .collection("courses")
    .doc(courseId)
    .collection("modules")
    .where("status", "==", "published")
    .get();

  const ids = new Set<string>();
  for (const mod of modulesSnap.docs) {
    const lessonsSnap = await db
      .collection("courses")
      .doc(courseId)
      .collection("modules")
      .doc(mod.id)
      .collection("lessons")
      .where("status", "==", "published")
      .get();
    for (const lesson of lessonsSnap.docs) {
      ids.add(lesson.id);
    }
  }
  return ids;
}
