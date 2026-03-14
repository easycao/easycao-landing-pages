import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/simulator/history?part=P1|P2|P3|P4|complete
 * Returns student's simulation history including in-progress exams (with ≥1 task).
 * In-progress exams have status "in_progress"; completed have "completed".
 */
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await verifySession(sessionCookie);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const partFilter = searchParams.get("part");

  const db = getFirestoreDb();
  const validParts = ["P1", "P2", "P3", "P4", "complete"];

  // Build base query constraints
  const baseConstraints = {
    uid: user.uid,
    ...(partFilter && validParts.includes(partFilter) ? { part: partFilter } : {}),
  };

  // Fetch completed exams
  let completedQuery = db
    .collection("exams")
    .where("uid", "==", baseConstraints.uid)
    .where("status", "==", "completed")
    .orderBy("completedAt", "desc")
    .limit(50);

  if (baseConstraints.part) {
    completedQuery = db
      .collection("exams")
      .where("uid", "==", baseConstraints.uid)
      .where("status", "==", "completed")
      .where("part", "==", baseConstraints.part)
      .orderBy("completedAt", "desc")
      .limit(50);
  }

  // Fetch in-progress exams (with at least 1 task answered: currentTaskIndex > 0)
  let inProgressQuery = db
    .collection("exams")
    .where("uid", "==", baseConstraints.uid)
    .where("status", "==", "in_progress")
    .orderBy("createdAt", "desc")
    .limit(20);

  if (baseConstraints.part) {
    inProgressQuery = db
      .collection("exams")
      .where("uid", "==", baseConstraints.uid)
      .where("status", "==", "in_progress")
      .where("part", "==", baseConstraints.part)
      .orderBy("createdAt", "desc")
      .limit(20);
  }

  let completedSnap;
  let inProgressSnap: { docs: FirebaseFirestore.QueryDocumentSnapshot[] };
  try {
    completedSnap = await completedQuery.get();
  } catch (err) {
    console.error("[history] completedQuery error:", err);
    return NextResponse.json({ error: "Failed to query completed exams", details: String(err) }, { status: 500 });
  }
  try {
    inProgressSnap = await inProgressQuery.get();
  } catch {
    inProgressSnap = { docs: [] as FirebaseFirestore.QueryDocumentSnapshot[] };
  }

  console.log(`[history] uid=${user.uid}, completed=${completedSnap.docs.length}, inProgress=${inProgressSnap.docs.length}, filter=${partFilter}`);

  // Process completed exams with feedback summaries
  const completedSimulations = await Promise.all(
    completedSnap.docs.map(async (doc) => {
      const exam = doc.data();

      const feedbackSnap = await db
        .collection("exams")
        .doc(doc.id)
        .collection("feedback")
        .get();

      let avgPronunciation = 0;
      let avgFluency = 0;
      let totalErrors = 0;
      let feedbackCount = 0;

      feedbackSnap.docs.forEach((fbDoc) => {
        const fb = fbDoc.data();
        if (fb.pronunciation != null) {
          avgPronunciation += fb.pronunciation;
          feedbackCount++;
        }
        if (fb.fluency != null) {
          avgFluency += fb.fluency;
        }
        if (Array.isArray(fb.errors)) {
          totalErrors += fb.errors.length;
        }
      });

      if (feedbackCount > 0) {
        avgPronunciation = Math.round(avgPronunciation / feedbackCount);
        avgFluency = Math.round(avgFluency / feedbackCount);
      }

      return {
        id: doc.id,
        part: exam.part,
        mode: exam.mode,
        status: "completed" as const,
        completedAt: exam.completedAt?.toDate?.()?.toISOString() || null,
        createdAt: exam.createdAt?.toDate?.()?.toISOString() || null,
        taskCount: exam.questionDocIds?.length || exam.questionIndexes?.length || 0,
        answeredTasks: exam.currentTaskIndex || 0,
        summary: {
          avgPronunciation,
          avgFluency,
          totalErrors,
          feedbackCount,
        },
      };
    })
  );

  // Process in-progress exams (only include those with ≥1 task answered)
  const inProgressSimulations = inProgressSnap.docs
    .filter((doc) => {
      const exam = doc.data();
      return (exam.currentTaskIndex || 0) > 0;
    })
    .map((doc) => {
      const exam = doc.data();
      return {
        id: doc.id,
        part: exam.part,
        mode: exam.mode,
        status: "in_progress" as const,
        completedAt: null,
        createdAt: exam.createdAt?.toDate?.()?.toISOString() || null,
        taskCount: exam.questionDocIds?.length || exam.questionIndexes?.length || 0,
        answeredTasks: exam.currentTaskIndex || 0,
        summary: {
          avgPronunciation: 0,
          avgFluency: 0,
          totalErrors: 0,
          feedbackCount: 0,
        },
      };
    });

  // Merge: in-progress first, then completed (sorted by date)
  const simulations = [
    ...inProgressSimulations,
    ...completedSimulations,
  ];

  return NextResponse.json({ simulations });
}
