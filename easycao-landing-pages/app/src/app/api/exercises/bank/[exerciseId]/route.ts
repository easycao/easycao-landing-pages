import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/exercises/bank/[exerciseId]
 * Returns a single exercise (question) from ICAO_Test_Questions.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  const { exerciseId } = await params;

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

  const questionDoc = await db
    .collection("ICAO_Test_Questions")
    .doc(exerciseId)
    .get();

  if (!questionDoc.exists) {
    return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
  }

  const question = { id: questionDoc.id, ...questionDoc.data() };

  // Fetch user's progress for this exercise
  const progressDoc = await db
    .collection("Users")
    .doc(user.uid)
    .collection("exerciseProgress")
    .doc(exerciseId)
    .get();

  const progress = progressDoc.exists ? progressDoc.data() : null;

  return NextResponse.json({ question, progress });
}

/**
 * POST /api/exercises/bank/[exerciseId]
 * Save recording and optionally get feedback.
 * Body: { recordingUrl, taskType, getFeedback? }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  const { exerciseId } = await params;

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await verifySession(sessionCookie);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const body = await req.json();
  const { recordingUrl, taskType, getFeedback } = body;

  if (!recordingUrl) {
    return NextResponse.json(
      { error: "recordingUrl is required" },
      { status: 400 }
    );
  }

  const db = getFirestoreDb();

  // Save progress
  const progressRef = db
    .collection("Users")
    .doc(user.uid)
    .collection("exerciseProgress")
    .doc(exerciseId);

  const progressDoc = await progressRef.get();
  const currentAttempts = progressDoc.exists
    ? (progressDoc.data()?.attempts || 0)
    : 0;

  await progressRef.set(
    {
      completed: true,
      recordingUrl,
      attempts: currentAttempts + 1,
      lastAttemptAt: new Date(),
      feedbackGenerated: false,
    },
    { merge: true }
  );

  // Optionally get feedback
  if (getFeedback) {
    try {
      const feedbackRes = await fetch(
        new URL("/api/feedback/analyze", req.url).toString(),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioUrl: recordingUrl,
            taskType: taskType || "speaking",
          }),
        }
      );

      if (feedbackRes.ok) {
        const feedbackData = await feedbackRes.json();
        await progressRef.set(
          {
            feedbackGenerated: true,
            feedback: feedbackData,
          },
          { merge: true }
        );

        return NextResponse.json({
          success: true,
          feedback: feedbackData,
        });
      }
    } catch {
      // Feedback failed but recording is saved
    }
  }

  return NextResponse.json({ success: true });
}
