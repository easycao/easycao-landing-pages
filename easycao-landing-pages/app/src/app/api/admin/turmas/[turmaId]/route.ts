import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ turmaId: string }> }
) {
  const { turmaId } = await params;
  const db = getFirestoreDb();
  const body = await req.json();
  const allowed = ["name", "courseIds"];
  const update: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }
  await db.collection("turmas").doc(turmaId).update(update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ turmaId: string }> }
) {
  const { turmaId } = await params;
  const db = getFirestoreDb();
  await db.collection("turmas").doc(turmaId).delete();
  return NextResponse.json({ ok: true });
}
