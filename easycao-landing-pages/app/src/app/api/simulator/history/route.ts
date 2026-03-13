import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/simulator/history?part=P1|P2|P3|P4|complete
 * Returns student's simulation history from exams collection.
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

  // Query completed exams for this user
  let query = db
    .collection("exams")
    .where("uid", "==", user.uid)
    .where("status", "==", "completed")
    .orderBy("completedAt", "desc")
    .limit(50);

  if (
    partFilter &&
    ["P1", "P2", "P3", "P4", "complete"].includes(partFilter)
  ) {
    query = db
      .collection("exams")
      .where("uid", "==", user.uid)
      .where("status", "==", "completed")
      .where("part", "==", partFilter)
      .orderBy("completedAt", "desc")
      .limit(50);
  }

  const examsSnap = await query.get();

  const simulations = await Promise.all(
    examsSnap.docs.map(async (doc) => {
      const exam = doc.data();

      // Fetch feedback summary for this exam
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
        completedAt: exam.completedAt?.toDate?.()?.toISOString() || null,
        createdAt: exam.createdAt?.toDate?.()?.toISOString() || null,
        taskCount: exam.questionDocIds?.length || exam.questionIndexes?.length || 0,
        summary: {
          avgPronunciation,
          avgFluency,
          totalErrors,
          feedbackCount,
        },
      };
    })
  );

  return NextResponse.json({ simulations });
}
