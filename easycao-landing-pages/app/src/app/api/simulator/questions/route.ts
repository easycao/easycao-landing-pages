import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/simulator/questions?examId=xxx
 * Fetch questions for an exam based on its stored question doc IDs.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const examId = searchParams.get("examId");

  if (!examId) {
    return NextResponse.json(
      { error: "examId is required" },
      { status: 400 }
    );
  }

  const db = getFirestoreDb();

  // Get exam doc
  const examDoc = await db.collection("exams").doc(examId).get();
  if (!examDoc.exists) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  const exam = examDoc.data()!;
  const questionDocIds: { docId: string; type: string }[] =
    exam.questionDocIds || [];

  // Fetch each question doc by its Firestore ID
  const questions = await Promise.all(
    questionDocIds.map(async (entry) => {
      const docRef = db.collection("ICAO_Test_Questions").doc(entry.docId);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return { id: entry.docId, questionType: entry.type, missing: true };
      }
      return {
        id: docSnap.id,
        questionType: entry.type,
        ...docSnap.data(),
      };
    })
  );

  return NextResponse.json({
    examId,
    part: exam.part,
    mode: exam.mode,
    status: exam.status,
    currentTaskIndex: exam.currentTaskIndex || 0,
    questions,
  });
}
