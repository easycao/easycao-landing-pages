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

// GET module with lessons
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId } = await params;
  const db = getFirestoreDb();

  const moduleDoc = await db.collection("course-notes").doc(moduleId).get();
  if (!moduleDoc.exists) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  const lessonsSnap = await db
    .collection("course-notes")
    .doc(moduleId)
    .collection("lessons")
    .orderBy("number", "asc")
    .get();

  const lessons = lessonsSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      number: data.number,
      title: data.title || "",
      duration: data.duration || "",
      type: data.type || "teoria",
      hasTask: data.hasTask || false,
      hasContent: !!(data.content?.trim()),
      hasFeatureIdeas: !!(data.featureIdeas?.trim()),
      hasAiNotes: !!(data.aiNotes?.trim()),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    };
  });

  const moduleData = moduleDoc.data()!;
  return NextResponse.json({
    module: {
      id: moduleDoc.id,
      number: moduleData.number,
      name: moduleData.name,
      createdAt: moduleData.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: moduleData.updatedAt?.toDate?.()?.toISOString() || null,
    },
    lessons,
  });
}

// PATCH update module
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId } = await params;
  const body = await req.json();
  const db = getFirestoreDb();

  const updates: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  if (body.name !== undefined) updates.name = body.name.trim();
  if (body.number !== undefined) updates.number = Number(body.number);

  await db.collection("course-notes").doc(moduleId).update(updates);
  return NextResponse.json({ ok: true });
}

// DELETE module
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId } = await params;
  const db = getFirestoreDb();

  // Delete all lessons first
  const lessonsSnap = await db
    .collection("course-notes")
    .doc(moduleId)
    .collection("lessons")
    .get();

  const batch = db.batch();
  lessonsSnap.docs.forEach((doc) => batch.delete(doc.ref));
  batch.delete(db.collection("course-notes").doc(moduleId));
  await batch.commit();

  return NextResponse.json({ ok: true });
}
