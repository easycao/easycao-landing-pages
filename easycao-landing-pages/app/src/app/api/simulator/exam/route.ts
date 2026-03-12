import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * POST /api/simulator/exam
 * Create a new exam session with randomized question indexes.
 */
export async function POST(req: NextRequest) {
  const db = getFirestoreDb();
  const body = await req.json();
  const { part, mode, uid } = body;

  if (!part || !uid) {
    return NextResponse.json(
      { error: "part and uid are required" },
      { status: 400 }
    );
  }

  // Generate randomized question indexes based on part
  const questionIndexes = generateIndexes(part, mode);

  const examRef = await db.collection("exams").add({
    uid,
    part,
    mode: mode || "complete",
    status: "in_progress",
    questionIndexes,
    currentTaskIndex: 0,
    createdAt: new Date(),
    completedAt: null,
  });

  return NextResponse.json({ examId: examRef.id }, { status: 201 });
}

/**
 * Generate random unique indexes for each part.
 */
function generateIndexes(part: string, mode?: string): number[] {
  switch (part) {
    case "P1":
      return mode === "single"
        ? pickRandom(152, 1)
        : pickRandom(152, 3);
    case "P2": {
      // 3 audio situations + 2 image situations = 5 total
      const audio = pickRandom(75, mode === "single" ? 1 : 3);
      const image = pickRandom(51, mode === "single" ? 0 : 2, 1000); // offset to avoid collision
      return [...audio, ...image];
    }
    case "P3":
      return mode === "single"
        ? pickRandom(30, 1)
        : pickRandom(30, 3);
    case "P4":
      return pickRandom(20, 1);
    case "complete":
      return [
        ...pickRandom(152, 3),        // P1: 3
        ...pickRandom(75, 3, 200),     // P2 audio: 3
        ...pickRandom(51, 2, 1000),    // P2 image: 2
        ...pickRandom(30, 3, 2000),    // P3: 3
        ...pickRandom(20, 1, 3000),    // P4: 1
      ];
    default:
      return [];
  }
}

/**
 * Pick `count` unique random numbers from 1..max, with optional offset.
 */
function pickRandom(max: number, count: number, offset: number = 0): number[] {
  const available = Array.from({ length: max }, (_, i) => i + 1 + offset);
  const result: number[] = [];
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    result.push(available[idx]);
    available.splice(idx, 1);
  }
  return result;
}
