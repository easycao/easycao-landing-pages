import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const db = getFirestoreDb();
  const snap = await db
    .collection(`courses/${courseId}/modules`)
    .orderBy("order")
    .get();
  const modules = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    };
  });
  return NextResponse.json({ modules });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const db = getFirestoreDb();
  const body = await req.json();
  const { name, order, status } = body;

  const docRef = await db.collection(`courses/${courseId}/modules`).add({
    name: name || "",
    order: order ?? 0,
    status: status || "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
