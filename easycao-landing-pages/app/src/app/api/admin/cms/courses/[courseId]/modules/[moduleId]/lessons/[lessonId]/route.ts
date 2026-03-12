import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
  }
) {
  const { courseId, moduleId, lessonId } = await params;
  const db = getFirestoreDb();
  const doc = await db
    .collection(`courses/${courseId}/modules/${moduleId}/lessons`)
    .doc(lessonId)
    .get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const data = doc.data()!;
  return NextResponse.json({
    lesson: {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    },
  });
}

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
    "thumbnail",
    "hasConsolidation",
    "hasExercises",
    "consolidationConfig",
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
