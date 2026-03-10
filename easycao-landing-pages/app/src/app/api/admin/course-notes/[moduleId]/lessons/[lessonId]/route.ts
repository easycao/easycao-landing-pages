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

type Params = { moduleId: string; lessonId: string };

// GET lesson
export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId, lessonId } = await params;
  const db = getFirestoreDb();

  const moduleDoc = await db.collection("course-notes").doc(moduleId).get();
  if (!moduleDoc.exists) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  const lessonDoc = await db
    .collection("course-notes")
    .doc(moduleId)
    .collection("lessons")
    .doc(lessonId)
    .get();

  if (!lessonDoc.exists) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const data = lessonDoc.data()!;
  return NextResponse.json({
    module: {
      id: moduleDoc.id,
      number: moduleDoc.data()!.number,
      name: moduleDoc.data()!.name,
    },
    lesson: {
      id: lessonDoc.id,
      number: data.number,
      title: data.title || "",
      duration: data.duration || "",
      type: data.type || "teoria",
      hasTask: data.hasTask || false,
      content: data.content || "",
      task: data.task || "",
      featureIdeas: data.featureIdeas || "",
      aiNotes: data.aiNotes || "",
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    },
  });
}

// PATCH update lesson
export async function PATCH(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId, lessonId } = await params;
  const body = await req.json();
  const db = getFirestoreDb();

  const allowedFields = [
    "number", "title", "duration", "type", "hasTask",
    "content", "task", "featureIdeas", "aiNotes",
  ];

  const updates: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = field === "number" ? Number(body[field]) : body[field];
    }
  }

  await db
    .collection("course-notes")
    .doc(moduleId)
    .collection("lessons")
    .doc(lessonId)
    .update(updates);

  return NextResponse.json({ ok: true });
}

// DELETE lesson
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<Params> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId, lessonId } = await params;
  const db = getFirestoreDb();

  await db
    .collection("course-notes")
    .doc(moduleId)
    .collection("lessons")
    .doc(lessonId)
    .delete();

  return NextResponse.json({ ok: true });
}
