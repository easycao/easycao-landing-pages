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
  const normalizedEmail = email.toLowerCase();

  // Check if a Users doc exists for this email (Hotmart pre-created with authLinked: false)
  const existingSnap = await db
    .collection("Users")
    .where("email", "==", normalizedEmail)
    .where("authLinked", "==", false)
    .limit(1)
    .get();

  if (!existingSnap.empty) {
    // Merge: copy data from old doc to new doc keyed by Firebase Auth UID
    const oldDoc = existingSnap.docs[0];
    const oldData = oldDoc.data();

    await db
      .collection("Users")
      .doc(uid)
      .set(
        {
          ...oldData,
          name: name || oldData.name || "",
          email: normalizedEmail,
          uid,
          authLinked: true,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

    // Move subcollections (enrollments, progress) from old doc to new doc
    for (const subcol of ["enrollments", "progress"]) {
      const subSnap = await oldDoc.ref.collection(subcol).get();
      for (const subDoc of subSnap.docs) {
        await db
          .collection("Users")
          .doc(uid)
          .collection(subcol)
          .doc(subDoc.id)
          .set(subDoc.data());
        await subDoc.ref.delete();
      }
    }

    // Delete the old doc (auto-generated ID)
    if (oldDoc.id !== uid) {
      await oldDoc.ref.delete();
    }
  } else {
    await db
      .collection("Users")
      .doc(uid)
      .set(
        {
          name: name || "",
          email: normalizedEmail,
          uid,
          authLinked: true,
          role: "student",
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
