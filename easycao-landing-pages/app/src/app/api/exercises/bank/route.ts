import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/exercises/bank?part=P1|P2|P3|P4
 * Returns questions from ICAO_Test_Questions for the given part.
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
  const part = searchParams.get("part");

  if (!part || !["P1", "P2", "P3", "P4"].includes(part)) {
    return NextResponse.json(
      { error: "part must be P1, P2, P3, or P4" },
      { status: 400 }
    );
  }

  const db = getFirestoreDb();

  // Fetch questions from ICAO_Test_Questions
  const questionsSnap = await db.collection("ICAO_Test_Questions").get();
  const allQuestions = questionsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Filter questions that have fields for this part
  type QuestionDoc = Record<string, unknown> & { id: string };
  const partQuestions = allQuestions.filter((q: QuestionDoc) => {
    switch (part) {
      case "P1":
        return !!q.Part1_Pergunta;
      case "P2":
        return !!q.Part2_Audio_Track1 || !!q.Part2_Tipo;
      case "P3":
        return !!q.Part3_RS || !!q.Part3_Pergunta;
      case "P4":
        return !!q.Part4_Image || !!q.Part4_Video;
      default:
        return false;
    }
  });

  // Fetch user's exercise progress
  const progressSnap = await db
    .collection("Users")
    .doc(user.uid)
    .collection("exerciseProgress")
    .get();

  const progressMap: Record<string, boolean> = {};
  progressSnap.docs.forEach((doc) => {
    const data = doc.data();
    progressMap[doc.id] = data.completed === true;
  });

  // Map questions to exercise items
  const exercises = partQuestions.map((q: QuestionDoc) => {
    let prompt = "";
    let mediaType: "video" | "audio" | "image" = "video";
    let mediaUrl = "";

    switch (part) {
      case "P1":
        prompt = `Pergunta de interação`;
        mediaType = "video";
        mediaUrl = (q.Part1_Pergunta as string) || "";
        break;
      case "P2":
        prompt = `Situação de compreensão`;
        mediaType = q.Part2_Tipo === "Imagem" ? "image" : "audio";
        mediaUrl = (q.Part2_Audio_Track1 as string) || "";
        break;
      case "P3":
        prompt = `Reported Speech`;
        mediaType = "video";
        mediaUrl = (q.Part3_RS as string) || "";
        break;
      case "P4":
        prompt = `Descrição estendida`;
        mediaType = "image";
        mediaUrl = (q.Part4_Image as string) || "";
        break;
    }

    return {
      id: q.id,
      prompt,
      mediaType,
      mediaUrl,
      completed: progressMap[q.id] || false,
    };
  });

  return NextResponse.json({
    part,
    exercises,
    totalCount: exercises.length,
    completedCount: exercises.filter(
      (e: { completed: boolean }) => e.completed
    ).length,
  });
}
