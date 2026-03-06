import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getStudentById, createEnrollment, updateStudent } from "@/lib/crm/students";
import { FieldValue } from "firebase-admin/firestore";
import type { StageName, StageRecord } from "@/lib/crm/types";

export async function POST(
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
  const { pricePaid, paymentType, installments, notes } = body;

  if (!pricePaid || typeof pricePaid !== "number" || pricePaid <= 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const emptyStages: Record<StageName, StageRecord | null> = {
    dia_10: null,
    mes_2: null,
    mes_4: null,
    mes_7: null,
    mes_10: null,
  };

  const enrollmentId = await createEnrollment(student.id, {
    enrolledAt: FieldValue.serverTimestamp() as never,
    expiredAt: null,
    status: "active",
    transaction: `manual-renew-${Date.now()}`,
    offerCode: "manual",
    pricePaid,
    realPricePaid: pricePaid,
    needsManualPrice: false,
    paymentType: paymentType || "manual",
    installments: installments || 1,
    source: "manual",
    stages: emptyStages,
    notes: notes || null,
  });

  await updateStudent(student.id, {
    currentEnrollmentId: enrollmentId,
    totalEnrollments: student.totalEnrollments + 1,
  });

  return NextResponse.json({ success: true, enrollmentId });
}
