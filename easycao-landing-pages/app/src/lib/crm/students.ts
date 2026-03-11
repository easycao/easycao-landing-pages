import { FieldValue } from "firebase-admin/firestore";
import { getFirestoreDb } from "@/lib/firebase-admin";
import type {
  Student,
  Enrollment,
  StageName,
  StageRecord,
  EnrollmentStatus,
} from "./types";

const STUDENTS_COLLECTION = "Users";
const ENROLLMENTS_SUBCOLLECTION = "enrollments";

// --- Student CRUD ---

export async function getStudentByEmail(
  email: string
): Promise<Student | null> {
  const db = getFirestoreDb();
  const snapshot = await db
    .collection(STUDENTS_COLLECTION)
    .where("email", "==", email.toLowerCase())
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Student;
}

export async function getStudentById(id: string): Promise<Student | null> {
  const db = getFirestoreDb();
  const doc = await db.collection(STUDENTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Student;
}

export async function searchStudents(query: string): Promise<Student[]> {
  const db = getFirestoreDb();
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Firestore doesn't support full-text search natively.
  // Filter by totalEnrollments > 0 to exclude freemium app users with no purchases.
  const snapshot = await db
    .collection(STUDENTS_COLLECTION)
    .where("totalEnrollments", ">", 0)
    .get();
  const results: Student[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const name = (data.name || "").toLowerCase();
    const email = (data.email || "").toLowerCase();
    const phone = (data.phone || "").replace(/\D/g, "");
    const searchPhone = q.replace(/\D/g, "");

    if (
      name.includes(q) ||
      email.includes(q) ||
      (searchPhone && phone.includes(searchPhone))
    ) {
      results.push({ id: doc.id, ...data } as Student);
    }

    if (results.length >= 20) break;
  }

  return results;
}

export async function createStudent(
  data: Omit<Student, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const db = getFirestoreDb();
  const docRef = await db.collection(STUDENTS_COLLECTION).add({
    ...data,
    email: data.email.toLowerCase(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

export async function createStudentWithId(
  id: string,
  data: Omit<Student, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  const db = getFirestoreDb();
  await db
    .collection(STUDENTS_COLLECTION)
    .doc(id)
    .set({
      ...data,
      email: data.email.toLowerCase(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
}

export async function updateStudent(
  id: string,
  data: Partial<Omit<Student, "id" | "createdAt">>
): Promise<void> {
  const db = getFirestoreDb();
  await db
    .collection(STUDENTS_COLLECTION)
    .doc(id)
    .update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
}

// --- Enrollment CRUD ---

export async function createEnrollment(
  studentId: string,
  data: Omit<Enrollment, "id">
): Promise<string> {
  const db = getFirestoreDb();
  const docRef = await db
    .collection(STUDENTS_COLLECTION)
    .doc(studentId)
    .collection(ENROLLMENTS_SUBCOLLECTION)
    .add(data);
  return docRef.id;
}

export async function getEnrollments(studentId: string): Promise<Enrollment[]> {
  const db = getFirestoreDb();
  const snapshot = await db
    .collection(STUDENTS_COLLECTION)
    .doc(studentId)
    .collection(ENROLLMENTS_SUBCOLLECTION)
    .orderBy("enrolledAt", "desc")
    .get();

  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Enrollment
  );
}

export async function updateEnrollmentStage(
  studentId: string,
  enrollmentId: string,
  stageName: StageName,
  stageRecord: StageRecord
): Promise<void> {
  const db = getFirestoreDb();
  await db
    .collection(STUDENTS_COLLECTION)
    .doc(studentId)
    .collection(ENROLLMENTS_SUBCOLLECTION)
    .doc(enrollmentId)
    .update({
      [`stages.${stageName}`]: stageRecord,
    });
}

export async function updateEnrollmentStatus(
  studentId: string,
  enrollmentId: string,
  status: EnrollmentStatus
): Promise<void> {
  const db = getFirestoreDb();
  await db
    .collection(STUDENTS_COLLECTION)
    .doc(studentId)
    .collection(ENROLLMENTS_SUBCOLLECTION)
    .doc(enrollmentId)
    .update({ status });
}

export async function findEnrollmentByTransaction(
  transaction: string,
  email?: string
): Promise<{ studentId: string; enrollmentId: string } | null> {
  if (!transaction) return null;
  const db = getFirestoreDb();

  // If email is provided, find student first then check their enrollments (fast)
  if (email) {
    const student = await getStudentByEmail(email);
    if (!student) return null;

    const enrollSnap = await db
      .collection(STUDENTS_COLLECTION)
      .doc(student.id)
      .collection(ENROLLMENTS_SUBCOLLECTION)
      .where("transaction", "==", transaction)
      .limit(1)
      .get();

    if (!enrollSnap.empty) {
      return { studentId: student.id, enrollmentId: enrollSnap.docs[0].id };
    }
    return null;
  }

  // Fallback: scan students with enrollments (slow, but works without email)
  const studentsSnap = await db
    .collection(STUDENTS_COLLECTION)
    .where("totalEnrollments", ">", 0)
    .get();
  for (const studentDoc of studentsSnap.docs) {
    const enrollSnap = await db
      .collection(STUDENTS_COLLECTION)
      .doc(studentDoc.id)
      .collection(ENROLLMENTS_SUBCOLLECTION)
      .where("transaction", "==", transaction)
      .limit(1)
      .get();

    if (!enrollSnap.empty) {
      return { studentId: studentDoc.id, enrollmentId: enrollSnap.docs[0].id };
    }
  }

  return null;
}
