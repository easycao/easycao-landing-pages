import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

// ── SDEA 29 fixed exam versions ──────────────────────────────────────────────

interface SdeaVersion {
  id: string;
  name: string;
  type: "aviao" | "helicoptero";
  indexes: number[];
}

const SDEA_VERSIONS: SdeaVersion[] = [
  // 25 avião versions
  { id: "av01", name: "Avião - Versão 1", type: "aviao", indexes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { id: "av02", name: "Avião - Versão 2", type: "aviao", indexes: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
  { id: "av03", name: "Avião - Versão 3", type: "aviao", indexes: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { id: "av04", name: "Avião - Versão 4", type: "aviao", indexes: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21] },
  { id: "av05", name: "Avião - Versão 5", type: "aviao", indexes: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
  { id: "av06", name: "Avião - Versão 6", type: "aviao", indexes: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27] },
  { id: "av07", name: "Avião - Versão 7", type: "aviao", indexes: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
  { id: "av08", name: "Avião - Versão 8", type: "aviao", indexes: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33] },
  { id: "av09", name: "Avião - Versão 9", type: "aviao", indexes: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36] },
  { id: "av10", name: "Avião - Versão 10", type: "aviao", indexes: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39] },
  { id: "av11", name: "Avião - Versão 11", type: "aviao", indexes: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42] },
  { id: "av12", name: "Avião - Versão 12", type: "aviao", indexes: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45] },
  { id: "av13", name: "Avião - Versão 13", type: "aviao", indexes: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48] },
  { id: "av14", name: "Avião - Versão 14", type: "aviao", indexes: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51] },
  { id: "av15", name: "Avião - Versão 15", type: "aviao", indexes: [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54] },
  { id: "av16", name: "Avião - Versão 16", type: "aviao", indexes: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57] },
  { id: "av17", name: "Avião - Versão 17", type: "aviao", indexes: [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60] },
  { id: "av18", name: "Avião - Versão 18", type: "aviao", indexes: [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63] },
  { id: "av19", name: "Avião - Versão 19", type: "aviao", indexes: [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66] },
  { id: "av20", name: "Avião - Versão 20", type: "aviao", indexes: [58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69] },
  { id: "av21", name: "Avião - Versão 21", type: "aviao", indexes: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72] },
  { id: "av22", name: "Avião - Versão 22", type: "aviao", indexes: [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75] },
  { id: "av23", name: "Avião - Versão 23", type: "aviao", indexes: [1, 10, 20, 30, 40, 50, 60, 70, 75, 3, 13, 23] },
  { id: "av24", name: "Avião - Versão 24", type: "aviao", indexes: [2, 12, 22, 32, 42, 52, 62, 72, 5, 15, 25, 35] },
  { id: "av25", name: "Avião - Versão 25", type: "aviao", indexes: [6, 16, 26, 36, 46, 56, 66, 11, 21, 31, 41, 51] },
  // 4 helicóptero versions
  { id: "hc01", name: "Helicóptero - Versão 1", type: "helicoptero", indexes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { id: "hc02", name: "Helicóptero - Versão 2", type: "helicoptero", indexes: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] },
  { id: "hc03", name: "Helicóptero - Versão 3", type: "helicoptero", indexes: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
  { id: "hc04", name: "Helicóptero - Versão 4", type: "helicoptero", indexes: [1, 4, 7, 10, 13, 16, 19, 2, 5, 8, 11, 14] },
];

/**
 * GET /api/simulator/sdea
 * Returns SDEA versions with user's completion status.
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

  // Fetch user's versionChecker
  const userDoc = await db.collection("Users").doc(user.uid).get();
  const userData = userDoc.exists ? userDoc.data() : null;
  const completedVersions: string[] = Array.isArray(userData?.versionChecker)
    ? userData.versionChecker
    : [];

  const versions = SDEA_VERSIONS.map((v) => ({
    ...v,
    completed: completedVersions.includes(v.id),
  }));

  return NextResponse.json({ versions });
}

/**
 * POST /api/simulator/sdea
 * Creates an exam with fixed indexes for a given SDEA version.
 * Body: { versionId }
 */
export async function POST(req: NextRequest) {
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
  const { versionId } = body;

  const version = SDEA_VERSIONS.find((v) => v.id === versionId);
  if (!version) {
    return NextResponse.json(
      { error: "Version not found" },
      { status: 404 }
    );
  }

  const db = getFirestoreDb();

  const examRef = await db.collection("exams").add({
    uid: user.uid,
    part: "complete",
    mode: "sdea",
    sdeaVersionId: versionId,
    status: "in_progress",
    questionIndexes: version.indexes,
    currentTaskIndex: 0,
    createdAt: new Date(),
    completedAt: null,
  });

  return NextResponse.json({ examId: examRef.id }, { status: 201 });
}
