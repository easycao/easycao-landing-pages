import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * POST /api/simulator/exam/[examId]/task
 * Save an individual task recording for an exam.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;
  const body = await req.json();
  const { uid, taskIndex, questionId, recordingUrl, repeatUsed } = body;

  if (!uid || taskIndex === undefined || !questionId || !recordingUrl) {
    return NextResponse.json(
      { error: "uid, taskIndex, questionId, and recordingUrl are required" },
      { status: 400 }
    );
  }

  const db = getFirestoreDb();

  // Verify exam exists and belongs to user
  const examDoc = await db.collection("exams").doc(examId).get();
  if (!examDoc.exists) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }
  const exam = examDoc.data()!;
  if (exam.uid !== uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Save task recording as subcollection doc
  await db
    .collection("exams")
    .doc(examId)
    .collection("tasks")
    .doc(String(taskIndex))
    .set({
      taskIndex,
      questionId,
      recordingUrl,
      repeatUsed: repeatUsed || false,
      savedAt: new Date(),
    });

  // Update exam currentTaskIndex
  await db.collection("exams").doc(examId).update({
    currentTaskIndex: taskIndex + 1,
  });

  return NextResponse.json({ success: true });
}
