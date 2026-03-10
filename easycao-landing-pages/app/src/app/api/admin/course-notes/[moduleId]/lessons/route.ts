import { NextResponse } from "next/server";
import { getSessionFromCookies, checkIsAdmin } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

async function authorize() {
  const session = await getSessionFromCookies();
  if (!session) return null;
  const isAdmin = await checkIsAdmin(session.uid);
  return isAdmin ? session : null;
}

// POST create lesson
export async function POST(
  req: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId } = await params;
  const body = await req.json();
  const { number, title } = body;

  if (!number || !title) {
    return NextResponse.json({ error: "number and title required" }, { status: 400 });
  }

  const db = getFirestoreDb();

  // Verify module exists
  const moduleDoc = await db.collection("course-notes").doc(moduleId).get();
  if (!moduleDoc.exists) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  const ref = await db
    .collection("course-notes")
    .doc(moduleId)
    .collection("lessons")
    .add({
      number: Number(number),
      title: title.trim(),
      duration: "",
      type: "teoria",
      hasTask: false,
      content: "",
      task: "",
      featureIdeas: "",
      aiNotes: "",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

  return NextResponse.json({ id: ref.id }, { status: 201 });
}
