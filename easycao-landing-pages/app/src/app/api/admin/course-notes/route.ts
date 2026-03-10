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

// GET all modules
export async function GET() {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getFirestoreDb();
  const snap = await db.collection("course-notes").orderBy("number", "asc").get();

  const modules = await Promise.all(
    snap.docs.map(async (doc) => {
      const lessonsSnap = await db
        .collection("course-notes")
        .doc(doc.id)
        .collection("lessons")
        .get();
      return {
        id: doc.id,
        ...doc.data(),
        lessonCount: lessonsSnap.size,
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
      };
    })
  );

  return NextResponse.json({ modules });
}

// POST create module
export async function POST(req: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { number, name } = body;

  if (!number || !name) {
    return NextResponse.json({ error: "number and name required" }, { status: 400 });
  }

  const db = getFirestoreDb();
  const ref = await db.collection("course-notes").add({
    number: Number(number),
    name: name.trim(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ id: ref.id }, { status: 201 });
}
