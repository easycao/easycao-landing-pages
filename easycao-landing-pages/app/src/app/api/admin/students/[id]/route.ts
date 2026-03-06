import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getSessionFromCookies } from "@/lib/auth";
import { getStudentById, getEnrollments, updateStudent } from "@/lib/crm/students";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { computeStage, daysRemaining } from "@/lib/crm/stages";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const student = await getStudentById(id);
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const enrollments = await getEnrollments(student.id);

  // Compute LTV (exclude refunded enrollments)
  const ltv = enrollments.reduce((sum, e) => {
    if (e.status === "refunded") return sum;
    const price = e.realPricePaid ?? e.pricePaid;
    return sum + (price || 0);
  }, 0);

  // Current enrollment info
  const current = enrollments.find(
    (e) => e.id === student.currentEnrollmentId
  );
  let currentStage = "";
  let currentDaysRemaining = 0;
  if (current) {
    const enrolledAt = current.enrolledAt?.toDate?.() || new Date();
    currentStage = computeStage(enrolledAt);
    currentDaysRemaining = daysRemaining(enrolledAt);
  }

  return NextResponse.json({
    student,
    enrollments: enrollments.map((e) => ({
      ...e,
      enrolledAt: e.enrolledAt?.toDate?.().toISOString() || null,
      expiredAt: e.expiredAt?.toDate?.().toISOString() || null,
      stages: Object.fromEntries(
        Object.entries(e.stages || {}).map(([k, v]) => [
          k,
          v
            ? {
                ...v,
                sentAt:
                  v.sentAt === "migrated"
                    ? "migrated"
                    : v.sentAt?.toDate?.().toISOString() || null,
              }
            : null,
        ])
      ),
    })),
    ltv,
    currentStage,
    currentDaysRemaining,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const student = await getStudentById(id);
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const body = await request.json();

  // Update personal data
  const allowedFields = ["name", "firstName", "lastName", "email", "phone", "document", "city", "state"] as const;
  const studentUpdates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      studentUpdates[field] = body[field];
    }
  }

  // Update hotmartStatus if provided
  if (body.hotmartStatus !== undefined) {
    studentUpdates.hotmartStatus = body.hotmartStatus;
  }

  if (Object.keys(studentUpdates).length > 0) {
    await updateStudent(id, studentUpdates);
  }

  // Update enrollment date
  if (body.enrolledAt && body.enrollmentId) {
    const db = getFirestoreDb();
    const enrolledDate = new Date(body.enrolledAt);
    if (!isNaN(enrolledDate.getTime())) {
      await db
        .collection("students")
        .doc(id)
        .collection("enrollments")
        .doc(body.enrollmentId)
        .update({ enrolledAt: Timestamp.fromDate(enrolledDate) });
    }
  }

  return NextResponse.json({ ok: true });
}
