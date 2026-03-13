import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * POST /api/simulator/exam/[examId]/complete
 * Mark exam as completed and save Part1History document.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;
  const body = await req.json();
  const { uid, part, completedTasks } = body;

  if (!uid || !part || !completedTasks) {
    return NextResponse.json(
      { error: "uid, part, and completedTasks are required" },
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

  // Mark exam as completed
  await db.collection("exams").doc(examId).update({
    status: "completed",
    completedAt: new Date(),
  });

  // Save history document
  const historyCollection =
    part === "P1" ? "Part1History" : `Part${part.replace("P", "")}History`;

  await db.collection(historyCollection).add({
    uid,
    examId,
    part,
    completedTasks: completedTasks.map(
      (t: { index: number; questionId: string; recordingUrl: string; repeatUsed: boolean }) => ({
        questionIndex: t.index,
        questionId: t.questionId,
        recordingUrl: t.recordingUrl,
        repeatUsed: t.repeatUsed,
      })
    ),
    completedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
