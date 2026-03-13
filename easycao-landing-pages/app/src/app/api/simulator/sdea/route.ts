import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

// ── SDEA 29 fixed exam versions ──────────────────────────────────────────────
// Each version specifies which question indexes to use per part.
// These map to the Index_* fields inside Firestore documents.

interface SdeaVersion {
  id: string;
  name: string;
  type: "aviao" | "helicoptero";
  // Indexes per part (matching Index_part1, Index_Part2_Tipo1, etc.)
  p1: number[];
  p2Audio: number[];
  p2Image: number[];
  p3: number[];
  p4: number[];
}

const SDEA_VERSIONS: SdeaVersion[] = [
  // 25 avião versions — 3 P1 + 3 P2audio + 2 P2image + 3 P3 + 1 P4
  { id: "av01", name: "Avião - Versão 1", type: "aviao", p1: [1, 2, 3], p2Audio: [1, 2, 3], p2Image: [1, 2], p3: [1, 2, 3], p4: [1] },
  { id: "av02", name: "Avião - Versão 2", type: "aviao", p1: [4, 5, 6], p2Audio: [4, 5, 6], p2Image: [3, 4], p3: [4, 5, 6], p4: [2] },
  { id: "av03", name: "Avião - Versão 3", type: "aviao", p1: [7, 8, 9], p2Audio: [7, 8, 9], p2Image: [5, 6], p3: [7, 8, 9], p4: [3] },
  { id: "av04", name: "Avião - Versão 4", type: "aviao", p1: [10, 11, 12], p2Audio: [10, 11, 12], p2Image: [7, 8], p3: [10, 11, 12], p4: [4] },
  { id: "av05", name: "Avião - Versão 5", type: "aviao", p1: [13, 14, 15], p2Audio: [13, 14, 15], p2Image: [9, 10], p3: [13, 14, 15], p4: [5] },
  { id: "av06", name: "Avião - Versão 6", type: "aviao", p1: [16, 17, 18], p2Audio: [16, 17, 18], p2Image: [11, 12], p3: [16, 17, 18], p4: [6] },
  { id: "av07", name: "Avião - Versão 7", type: "aviao", p1: [19, 20, 21], p2Audio: [19, 20, 21], p2Image: [13, 14], p3: [19, 20, 21], p4: [7] },
  { id: "av08", name: "Avião - Versão 8", type: "aviao", p1: [22, 23, 24], p2Audio: [22, 23, 24], p2Image: [15, 16], p3: [22, 23, 24], p4: [8] },
  { id: "av09", name: "Avião - Versão 9", type: "aviao", p1: [25, 26, 27], p2Audio: [25, 26, 27], p2Image: [17, 18], p3: [25, 26, 27], p4: [9] },
  { id: "av10", name: "Avião - Versão 10", type: "aviao", p1: [28, 29, 30], p2Audio: [28, 29, 30], p2Image: [19, 20], p3: [28, 29, 30], p4: [10] },
  { id: "av11", name: "Avião - Versão 11", type: "aviao", p1: [31, 32, 33], p2Audio: [31, 32, 33], p2Image: [21, 22], p3: [31, 32, 33], p4: [11] },
  { id: "av12", name: "Avião - Versão 12", type: "aviao", p1: [34, 35, 36], p2Audio: [34, 35, 36], p2Image: [23, 24], p3: [34, 35, 36], p4: [12] },
  { id: "av13", name: "Avião - Versão 13", type: "aviao", p1: [37, 38, 39], p2Audio: [37, 38, 39], p2Image: [25, 26], p3: [37, 38, 39], p4: [13] },
  { id: "av14", name: "Avião - Versão 14", type: "aviao", p1: [40, 41, 42], p2Audio: [40, 41, 42], p2Image: [27, 28], p3: [40, 41, 42], p4: [14] },
  { id: "av15", name: "Avião - Versão 15", type: "aviao", p1: [43, 44, 45], p2Audio: [43, 44, 45], p2Image: [29, 30], p3: [43, 44, 45], p4: [15] },
  { id: "av16", name: "Avião - Versão 16", type: "aviao", p1: [46, 47, 48], p2Audio: [46, 47, 48], p2Image: [31, 32], p3: [46, 47, 48], p4: [16] },
  { id: "av17", name: "Avião - Versão 17", type: "aviao", p1: [49, 50, 51], p2Audio: [49, 50, 51], p2Image: [33, 34], p3: [49, 50, 51], p4: [17] },
  { id: "av18", name: "Avião - Versão 18", type: "aviao", p1: [52, 53, 54], p2Audio: [52, 53, 54], p2Image: [35, 36], p3: [52, 53, 54], p4: [18] },
  { id: "av19", name: "Avião - Versão 19", type: "aviao", p1: [55, 56, 57], p2Audio: [55, 56, 57], p2Image: [37, 38], p3: [55, 56, 57], p4: [19] },
  { id: "av20", name: "Avião - Versão 20", type: "aviao", p1: [58, 59, 60], p2Audio: [58, 59, 60], p2Image: [39, 40], p3: [58, 59, 60], p4: [20] },
  { id: "av21", name: "Avião - Versão 21", type: "aviao", p1: [61, 62, 63], p2Audio: [61, 62, 63], p2Image: [41, 42], p3: [61, 62, 63], p4: [21] },
  { id: "av22", name: "Avião - Versão 22", type: "aviao", p1: [64, 65, 66], p2Audio: [64, 65, 66], p2Image: [43, 44], p3: [64, 65, 66], p4: [22] },
  { id: "av23", name: "Avião - Versão 23", type: "aviao", p1: [1, 20, 40], p2Audio: [10, 30, 50], p2Image: [5, 25], p3: [15, 35, 55], p4: [23] },
  { id: "av24", name: "Avião - Versão 24", type: "aviao", p1: [5, 25, 45], p2Audio: [15, 35, 55], p2Image: [10, 30], p3: [20, 40, 60], p4: [24] },
  { id: "av25", name: "Avião - Versão 25", type: "aviao", p1: [10, 30, 50], p2Audio: [20, 40, 60], p2Image: [15, 35], p3: [25, 45, 65], p4: [25] },
  // 4 helicóptero versions
  { id: "hc01", name: "Helicóptero - Versão 1", type: "helicoptero", p1: [1, 2, 3], p2Audio: [1, 2, 3], p2Image: [1, 2], p3: [1, 2, 3], p4: [1] },
  { id: "hc02", name: "Helicóptero - Versão 2", type: "helicoptero", p1: [4, 5, 6], p2Audio: [4, 5, 6], p2Image: [3, 4], p3: [4, 5, 6], p4: [2] },
  { id: "hc03", name: "Helicóptero - Versão 3", type: "helicoptero", p1: [7, 8, 9], p2Audio: [7, 8, 9], p2Image: [5, 6], p3: [7, 8, 9], p4: [3] },
  { id: "hc04", name: "Helicóptero - Versão 4", type: "helicoptero", p1: [10, 11, 12], p2Audio: [10, 11, 12], p2Image: [7, 8], p3: [10, 11, 12], p4: [4] },
];

// Index field name per question type
const INDEX_FIELDS: Record<string, string> = {
  Part1: "Index_part1",
  "Part2-Tipo1": "Index_Part2_Tipo1",
  "Part2-Tipo2": "Index_Part2_Tipo2",
  Part3: "Index_Part3",
  Part4: "Index_Part4",
};

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

  const userDoc = await db.collection("Users").doc(user.uid).get();
  const userData = userDoc.exists ? userDoc.data() : null;
  const completedVersions: string[] = Array.isArray(userData?.versionChecker)
    ? userData.versionChecker
    : [];

  const versions = SDEA_VERSIONS.map((v) => ({
    id: v.id,
    name: v.name,
    type: v.type,
    completed: completedVersions.includes(v.id),
  }));

  return NextResponse.json({ versions });
}

/**
 * POST /api/simulator/sdea
 * Creates an exam with fixed questions for a given SDEA version.
 * Looks up Firestore docs by their index fields.
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
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  const db = getFirestoreDb();

  // Build index→docId map for all question types
  const snap = await db.collection("ICAO_Test_Questions").get();
  const indexMaps: Record<string, Map<number, string>> = {};

  for (const doc of snap.docs) {
    const data = doc.data();
    const qt = data.Question_Type as string;
    const indexField = INDEX_FIELDS[qt];
    if (!indexField) continue;

    if (!indexMaps[qt]) indexMaps[qt] = new Map();
    const idx = parseInt(data[indexField], 10);
    if (!isNaN(idx)) {
      indexMaps[qt].set(idx, doc.id);
    }
  }

  // Resolve version indexes to doc IDs
  const questionDocIds: { docId: string; type: string }[] = [];

  const resolve = (type: string, indexes: number[]) => {
    const map = indexMaps[type];
    if (!map) return;
    for (const idx of indexes) {
      const docId = map.get(idx);
      if (docId) {
        questionDocIds.push({ docId, type });
      }
    }
  };

  resolve("Part1", version.p1);
  resolve("Part2-Tipo1", version.p2Audio);
  resolve("Part2-Tipo2", version.p2Image);
  resolve("Part3", version.p3);
  // Add comparison doc
  const compSnap = await db
    .collection("ICAO_Test_Questions")
    .where("Question_Type", "==", "Part3Comparison")
    .limit(1)
    .get();
  if (!compSnap.empty) {
    questionDocIds.push({
      docId: compSnap.docs[0].id,
      type: "Part3Comparison",
    });
  }
  resolve("Part4", version.p4);

  const examRef = await db.collection("exams").add({
    uid: user.uid,
    part: "complete",
    mode: "sdea",
    sdeaVersionId: versionId,
    status: "in_progress",
    questionDocIds,
    currentTaskIndex: 0,
    createdAt: new Date(),
    completedAt: null,
  });

  return NextResponse.json({ examId: examRef.id }, { status: 201 });
}
