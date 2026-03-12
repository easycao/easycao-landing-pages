import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const { courseId, moduleId } = await params;
  const db = getFirestoreDb();
  const body = await req.json();
  const allowed = ["name", "order", "status", "thumbnail"];
  const update: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }
  await db
    .collection(`courses/${courseId}/modules`)
    .doc(moduleId)
    .update(update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const { courseId, moduleId } = await params;
  const db = getFirestoreDb();
  const path = `courses/${courseId}/modules/${moduleId}`;

  // Cascade: delete lessons then module
  const lessonsSnap = await db.collection(`${path}/lessons`).get();
  for (const lesson of lessonsSnap.docs) {
    await lesson.ref.delete();
  }
  await db.collection(`courses/${courseId}/modules`).doc(moduleId).delete();

  return NextResponse.json({ ok: true });
}
