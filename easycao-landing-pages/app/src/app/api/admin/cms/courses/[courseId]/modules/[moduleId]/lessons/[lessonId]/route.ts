import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
  }
) {
  const { courseId, moduleId, lessonId } = await params;
  const db = getFirestoreDb();
  const body = await req.json();
  const allowed = [
    "title",
    "order",
    "status",
    "kinescopeVideoId",
    "duration",
    "materials",
  ];
  const update: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }
  await db
    .collection(
      `courses/${courseId}/modules/${moduleId}/lessons`
    )
    .doc(lessonId)
    .update(update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
  }
) {
  const { courseId, moduleId, lessonId } = await params;
  const db = getFirestoreDb();
  await db
    .collection(
      `courses/${courseId}/modules/${moduleId}/lessons`
    )
    .doc(lessonId)
    .delete();
  return NextResponse.json({ ok: true });
}
