import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

type Params = {
  params: Promise<{
    courseId: string;
    moduleId: string;
    lessonId: string;
    exerciseId: string;
  }>;
};

function exercisePath(
  courseId: string,
  moduleId: string,
  lessonId: string,
  exerciseId: string
) {
  return `courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises/${exerciseId}`;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { courseId, moduleId, lessonId, exerciseId } = await params;
  const db = getFirestoreDb();
  const body = await req.json();
  const allowed = [
    "type",
    "prompt",
    "referenceAnswer",
    "videoUrl",
    "imageUrl",
    "order",
  ];
  const update: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }
  const [collectionPath, docId] = [
    `courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`,
    exerciseId,
  ];
  await db.collection(collectionPath).doc(docId).update(update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { courseId, moduleId, lessonId, exerciseId } = await params;
  const db = getFirestoreDb();
  await db.doc(exercisePath(courseId, moduleId, lessonId, exerciseId)).delete();
  return NextResponse.json({ ok: true });
}
