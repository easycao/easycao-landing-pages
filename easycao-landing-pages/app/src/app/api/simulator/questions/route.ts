import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/simulator/questions?examId=xxx
 * Fetch questions for an exam based on its stored question indexes.
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
  const indexes: number[] = exam.questionIndexes || [];

  // Fetch all ICAO_Test_Questions docs (they have numeric IDs matching indexes)
  // Since Firestore doesn't support IN queries with > 30 items efficiently,
  // we fetch the full collection and filter
  const questionsSnap = await db
    .collection("ICAO_Test_Questions")
    .get();

  const questionsMap = new Map<number, Record<string, unknown>>();
  for (const doc of questionsSnap.docs) {
    const idx = parseInt(doc.id, 10);
    if (!isNaN(idx)) {
      questionsMap.set(idx, { id: doc.id, ...doc.data() });
    }
  }

  // Map indexes to questions, maintaining order
  const questions = indexes.map((idx) => {
    const q = questionsMap.get(idx);
    if (q) return q;
    // For offset indexes (P2 image, P3, P4), try without offset
    const baseIdx = idx % 1000 || idx;
    return questionsMap.get(baseIdx) || { id: String(idx), missing: true };
  });

  return NextResponse.json({
    examId,
    part: exam.part,
    mode: exam.mode,
    questions,
  });
}
