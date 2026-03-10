import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { uid, name, email } = body;

  if (!uid || !email) {
    return NextResponse.json(
      { error: "uid and email are required" },
      { status: 400 }
    );
  }

  const db = getFirestoreDb();
  await db
    .collection("students")
    .doc(uid)
    .set(
      {
        name: name || "",
        email,
        role: "student",
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  return NextResponse.json({ ok: true }, { status: 201 });
}
