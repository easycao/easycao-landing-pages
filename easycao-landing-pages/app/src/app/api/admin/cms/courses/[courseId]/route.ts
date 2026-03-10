import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const db = getFirestoreDb();
  const doc = await db.collection("courses").doc(courseId).get();
  if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = doc.data()!;
  const modulesSnap = await db
    .collection("courses")
    .doc(courseId)
    .collection("modules")
    .orderBy("order")
    .get();

  const modules = await Promise.all(
    modulesSnap.docs.map(async (mod) => {
      const modData = mod.data();
      const lessonsSnap = await db
        .collection("courses")
        .doc(courseId)
        .collection("modules")
        .doc(mod.id)
        .collection("lessons")
        .get();
      return {
        id: mod.id,
        ...modData,
        lessonCount: lessonsSnap.size,
        createdAt: modData.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: modData.updatedAt?.toDate?.()?.toISOString() || null,
      };
    })
  );

  return NextResponse.json({
    course: {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    },
    modules,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const db = getFirestoreDb();
  const body = await req.json();
  const allowed = ["name", "description", "thumbnail", "status", "order"];
  const update: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }
  await db.collection("courses").doc(courseId).update(update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const db = getFirestoreDb();
  const coursePath = `courses/${courseId}`;

  // Cascade: delete lessons → modules → course
  const modulesSnap = await db.collection(`${coursePath}/modules`).get();
  for (const mod of modulesSnap.docs) {
    const lessonsSnap = await db
      .collection(`${coursePath}/modules/${mod.id}/lessons`)
      .get();
    for (const lesson of lessonsSnap.docs) {
      await lesson.ref.delete();
    }
    await mod.ref.delete();
  }
  await db.collection("courses").doc(courseId).delete();

  return NextResponse.json({ ok: true });
}
