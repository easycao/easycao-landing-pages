import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

interface CompletedTaskInput {
  index: number;
  questionId: string;
  recordingUrl: string;
  repeatUsed: boolean;
  taskType?: string;
  situationIndex?: number;
}

/**
 * POST /api/simulator/exam/[examId]/complete
 * Mark exam as completed and save history document with situation subcollections.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;

  // Auth via session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sessionUser = await verifySession(sessionCookie);
  if (!sessionUser) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const body = await req.json();
  const { part, completedTasks } = body as {
    part: string;
    completedTasks: CompletedTaskInput[];
  };

  if (!part || !completedTasks) {
    return NextResponse.json(
      { error: "part and completedTasks are required" },
      { status: 400 }
    );
  }

  const uid = sessionUser.uid;
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
    totalTasks: completedTasks.length,
  });

  // Determine history collection name
  const historyCollections: Record<string, string> = {
    P1: "Part1History",
    P2: "Part2History",
    P3: "Part3History",
    P4: "Part4History",
    complete: "TesteICAOCompleto",
  };
  const historyCollection = historyCollections[part] || `Part${part.replace("P", "")}History`;

  // Create history doc
  const historyRef = await db.collection(historyCollection).add({
    uid,
    examId,
    part,
    taskCount: completedTasks.length,
    completedAt: new Date(),
  });

  // Group tasks by situation for P2/P3/P4
  const hasSituations = completedTasks.some((t) => t.situationIndex !== undefined);

  if (hasSituations) {
    // Group by situationIndex
    const situations = new Map<number, CompletedTaskInput[]>();
    for (const task of completedTasks) {
      const sitIdx = task.situationIndex ?? 0;
      if (!situations.has(sitIdx)) situations.set(sitIdx, []);
      situations.get(sitIdx)!.push(task);
    }

    // Save each situation as subcollection
    const batch = db.batch();
    for (const [sitIdx, tasks] of situations) {
      const sitPrefix = part === "P3" ? "PT3_Situation" : "Situation";
      const sitDocRef = historyRef.collection(`${sitPrefix}${sitIdx + 1}`).doc("tasks");
      batch.set(sitDocRef, {
        situationIndex: sitIdx,
        tasks: tasks.map((t) => ({
          questionIndex: t.index,
          questionId: t.questionId,
          recordingUrl: t.recordingUrl,
          repeatUsed: t.repeatUsed,
          taskType: t.taskType || null,
        })),
        savedAt: new Date(),
      });
    }
    await batch.commit();
  } else {
    // Simple flat storage (P1)
    await historyRef.update({
      completedTasks: completedTasks.map((t) => ({
        questionIndex: t.index,
        questionId: t.questionId,
        recordingUrl: t.recordingUrl,
        repeatUsed: t.repeatUsed,
      })),
    });
  }

  return NextResponse.json({ success: true, historyId: historyRef.id });
}
