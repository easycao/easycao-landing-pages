import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * POST /api/simulator/exam/[examId]/discard
 * Mark an in-progress exam as discarded so it no longer appears in history.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await verifySession(sessionCookie);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const db = getFirestoreDb();
  const examDoc = await db.collection("exams").doc(examId).get();

  if (!examDoc.exists) {
    return NextResponse.json({ error: "Exam not found" }, { status: 404 });
  }

  const exam = examDoc.data()!;
  if (exam.uid !== user.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (exam.status !== "in_progress") {
    return NextResponse.json({ error: "Only in-progress exams can be discarded" }, { status: 400 });
  }

  await db.collection("exams").doc(examId).update({
    status: "discarded",
    discardedAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
