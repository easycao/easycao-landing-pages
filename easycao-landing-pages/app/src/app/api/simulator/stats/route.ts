import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

/** Task type labels matching the ICAO exam structure. */
const TASK_TYPE_LABELS: Record<string, string> = {
  P1: "Parte 1: Pergunta",
  P2_T1: "Parte 2: Cotejamento",
  P2_T2: "Parte 2: Sistema ABC",
  P2_T3: "Parte 2: Pane",
  P2_T4: "Parte 2: Reported Speech",
  P3_RS: "Parte 3: Reported Speech",
  P3_Q: "Parte 3: Pergunta",
  P3_CMP: "Parte 3: Comparação",
  P4_DESC: "Parte 4: Presente",
  P4_PAST: "Parte 4: Passado",
  P4_FUTURE: "Parte 4: Futuro",
  P4_Q: "Parte 4: Pergunta",
  P4_STMT: "Parte 4: Statement",
};

const TASK_TYPE_ORDER = Object.keys(TASK_TYPE_LABELS);

/**
 * GET /api/simulator/stats
 * Aggregated stats dashboard: totals, averages, per-task-type error rates.
 */
export async function GET() {
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

  // Fetch last 50 completed exams (enough to cover 10 instances of each task type)
  const completedSnap = await db
    .collection("exams")
    .where("uid", "==", user.uid)
    .where("status", "==", "completed")
    .orderBy("completedAt", "desc")
    .limit(50)
    .get();

  const now = Date.now();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - oneWeekMs;
  const twoWeeksAgo = now - 2 * oneWeekMs;

  let totalCompleted = 0;
  let thisWeekCount = 0;
  let lastWeekCount = 0;
  const perPart: Record<string, number> = { P1: 0, P2: 0, P3: 0, P4: 0, complete: 0 };

  // Collect all feedback grouped by task type (for error averages)
  // and globally (for pronunciation/fluency averages)
  interface FeedbackEntry {
    processedAt: number;
    pronunciation: number | null;
    fluency: number | null;
    structureErrors: number;
    vocabularyErrors: number;
  }
  const feedbackByType: Record<string, FeedbackEntry[]> = {};
  const allFeedback: { pronunciation: number; fluency: number; completedAt: number }[] = [];

  // Process exams and fetch their feedback
  await Promise.all(
    completedSnap.docs.map(async (doc) => {
      const exam = doc.data();
      totalCompleted++;

      const completedAt = exam.completedAt?.toDate?.()?.getTime() || 0;
      if (completedAt >= oneWeekAgo) thisWeekCount++;
      else if (completedAt >= twoWeeksAgo) lastWeekCount++;

      if (exam.part && perPart[exam.part] !== undefined) {
        perPart[exam.part]++;
      }

      // Fetch feedback for this exam
      const fbSnap = await db
        .collection("exams")
        .doc(doc.id)
        .collection("feedback")
        .get();

      let examPronTotal = 0;
      let examFluTotal = 0;
      let examScoreCount = 0;

      fbSnap.docs.forEach((fbDoc) => {
        const fb = fbDoc.data();
        const taskType = fb.taskType || null;

        // Count structure vs vocabulary errors
        let structureErrors = 0;
        let vocabularyErrors = 0;
        if (Array.isArray(fb.errors)) {
          fb.errors.forEach((err: { category?: string }) => {
            if (err.category === "structure") structureErrors++;
            else if (err.category === "vocabulary") vocabularyErrors++;
          });
        }

        if (taskType && TASK_TYPE_LABELS[taskType]) {
          if (!feedbackByType[taskType]) feedbackByType[taskType] = [];
          feedbackByType[taskType].push({
            processedAt: fb.processedAt?.toDate?.()?.getTime() || completedAt,
            pronunciation: fb.pronunciation ?? null,
            fluency: fb.fluency ?? null,
            structureErrors,
            vocabularyErrors,
          });
        }

        if (fb.pronunciation != null) {
          examPronTotal += fb.pronunciation;
          examScoreCount++;
        }
        if (fb.fluency != null) {
          examFluTotal += fb.fluency;
        }
      });

      if (examScoreCount > 0) {
        allFeedback.push({
          pronunciation: Math.round(examPronTotal / examScoreCount),
          fluency: Math.round(examFluTotal / examScoreCount),
          completedAt,
        });
      }
    })
  );

  // Weekly change percentage
  let weeklyChange: number | null = null;
  if (lastWeekCount > 0) {
    weeklyChange = Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);
  } else if (thisWeekCount > 0) {
    weeklyChange = 100; // all new
  }

  // Average pronunciation/fluency from last 10 completed exams
  allFeedback.sort((a, b) => b.completedAt - a.completedAt);
  const last10 = allFeedback.slice(0, 10);
  const avgPronunciation = last10.length > 0
    ? Math.round(last10.reduce((sum, f) => sum + f.pronunciation, 0) / last10.length)
    : null;
  const avgFluency = last10.length > 0
    ? Math.round(last10.reduce((sum, f) => sum + f.fluency, 0) / last10.length)
    : null;

  // Per-task-type error averages (last 10 of each type)
  const taskTypeErrors: Record<string, {
    label: string;
    avgStructure: number | null;
    avgVocabulary: number | null;
    count: number;
  }> = {};

  for (const taskType of TASK_TYPE_ORDER) {
    const entries = (feedbackByType[taskType] || [])
      .sort((a, b) => b.processedAt - a.processedAt)
      .slice(0, 10);

    taskTypeErrors[taskType] = {
      label: TASK_TYPE_LABELS[taskType],
      avgStructure: entries.length > 0
        ? Math.round((entries.reduce((s, e) => s + e.structureErrors, 0) / entries.length) * 10) / 10
        : null,
      avgVocabulary: entries.length > 0
        ? Math.round((entries.reduce((s, e) => s + e.vocabularyErrors, 0) / entries.length) * 10) / 10
        : null,
      count: entries.length,
    };
  }

  return NextResponse.json({
    totalCompleted,
    thisWeekCount,
    weeklyChange,
    perPart,
    avgPronunciation,
    avgFluency,
    taskTypeErrors,
  });
}
