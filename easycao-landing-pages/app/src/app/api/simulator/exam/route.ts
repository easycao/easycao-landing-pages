import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";

/**
 * POST /api/simulator/exam
 * Create a new exam session by picking random questions from Firestore.
 * Questions are selected by Question_Type, and Firestore doc IDs are stored.
 */
export async function POST(req: NextRequest) {
  // Auth — use session cookie as source of truth for UID
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sessionUser = await verifySession(sessionCookie);
  if (!sessionUser) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const db = getFirestoreDb();
  const body = await req.json();
  const { part, mode } = body;
  const uid = sessionUser.uid; // Always use session UID

  if (!part) {
    return NextResponse.json(
      { error: "part is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch all questions grouped by type
    const snap = await db.collection("ICAO_Test_Questions").get();
    const byType: Record<string, string[]> = {};
    for (const doc of snap.docs) {
      const qt = (doc.data().Question_Type as string) || "unknown";
      if (!byType[qt]) byType[qt] = [];
      byType[qt].push(doc.id);
    }

    // Pick random doc IDs based on part
    const questionDocIds = pickQuestionIds(part, mode, byType);

    if (questionDocIds.length === 0) {
      return NextResponse.json(
        { error: "No questions available for this part" },
        { status: 400 }
      );
    }

    const examRef = await db.collection("exams").add({
      uid,
      part,
      mode: mode || "complete",
      status: "in_progress",
      questionDocIds,
      currentTaskIndex: 0,
      createdAt: new Date(),
      completedAt: null,
    });

    return NextResponse.json({ examId: examRef.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json(
      { error: "Failed to create exam" },
      { status: 500 }
    );
  }
}

/**
 * Pick random question doc IDs based on part and mode.
 * Returns an array of objects with { docId, type } to preserve type info.
 */
function pickQuestionIds(
  part: string,
  mode: string | undefined,
  byType: Record<string, string[]>
): { docId: string; type: string }[] {
  const single = mode === "single";

  switch (part) {
    case "P1":
      return pickRandom(byType["Part1"] || [], single ? 1 : 3).map((id) => ({
        docId: id,
        type: "Part1",
      }));

    case "P2": {
      if (mode === "single-image") {
        return pickRandom(byType["Part2-Tipo2"] || [], 1).map(
          (id) => ({ docId: id, type: "Part2-Tipo2" })
        );
      }
      const audio = pickRandom(byType["Part2-Tipo1"] || [], single ? 1 : 3).map(
        (id) => ({ docId: id, type: "Part2-Tipo1" })
      );
      const image = pickRandom(byType["Part2-Tipo2"] || [], single ? 0 : 2).map(
        (id) => ({ docId: id, type: "Part2-Tipo2" })
      );
      return [...audio, ...image];
    }

    case "P3": {
      const questions = pickRandom(byType["Part3"] || [], single ? 1 : 3).map(
        (id) => ({ docId: id, type: "Part3" })
      );
      // Add comparison doc only in complete mode
      if (!single) {
        const COMPARISON_DOC_ID = "SmYjvRNBdaLI4tT8Afpn";
        questions.push({ docId: COMPARISON_DOC_ID, type: "Part3Comparison" });
      }
      return questions;
    }

    case "P4":
      return pickRandom(byType["Part4"] || [], 1).map((id) => ({
        docId: id,
        type: "Part4",
      }));

    case "complete":
      return [
        ...pickRandom(byType["Part1"] || [], 3).map((id) => ({
          docId: id,
          type: "Part1",
        })),
        ...pickRandom(byType["Part2-Tipo1"] || [], 3).map((id) => ({
          docId: id,
          type: "Part2-Tipo1",
        })),
        ...pickRandom(byType["Part2-Tipo2"] || [], 2).map((id) => ({
          docId: id,
          type: "Part2-Tipo2",
        })),
        ...pickRandom(byType["Part3"] || [], 3).map((id) => ({
          docId: id,
          type: "Part3",
        })),
        { docId: "SmYjvRNBdaLI4tT8Afpn", type: "Part3Comparison" },
        ...pickRandom(byType["Part4"] || [], 1).map((id) => ({
          docId: id,
          type: "Part4",
        })),
      ];

    default:
      return [];
  }
}

/**
 * Pick `count` unique random items from an array.
 */
function pickRandom(arr: string[], count: number): string[] {
  const available = [...arr];
  const result: string[] = [];
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    result.push(available[idx]);
    available.splice(idx, 1);
  }
  return result;
}
