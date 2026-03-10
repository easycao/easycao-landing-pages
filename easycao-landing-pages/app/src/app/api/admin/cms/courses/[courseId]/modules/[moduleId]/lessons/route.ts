import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function GET(
  _req: NextRequest,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const { courseId, moduleId } = await params;
  const db = getFirestoreDb();
  const snap = await db
    .collection(`courses/${courseId}/modules/${moduleId}/lessons`)
    .orderBy("order")
    .get();
  const lessons = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    };
  });
  return NextResponse.json({ lessons });
}

export async function POST(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const { courseId, moduleId } = await params;
  const db = getFirestoreDb();
  const body = await req.json();
  const { title, order, status, kinescopeVideoId, duration, materials } = body;

  const docRef = await db
    .collection(`courses/${courseId}/modules/${moduleId}/lessons`)
    .add({
      title: title || "",
      order: order ?? 0,
      status: status || "draft",
      kinescopeVideoId: kinescopeVideoId || "",
      duration: duration || "",
      materials: materials || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
