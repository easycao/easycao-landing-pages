import { NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function GET() {
  const db = getFirestoreDb();
  const snap = await db.collection("turmas").orderBy("name").get();

  const turmas = await Promise.all(
    snap.docs.map(async (doc) => {
      const data = doc.data();
      // Count students in this turma
      const studentsSnap = await db
        .collection("students")
        .where("turmaId", "==", doc.id)
        .get();
      return {
        id: doc.id,
        name: data.name,
        courseIds: data.courseIds || [],
        studentCount: studentsSnap.size,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      };
    })
  );

  return NextResponse.json({ turmas });
}

export async function POST(req: Request) {
  const db = getFirestoreDb();
  const body = await req.json();
  const { name, courseIds } = body;

  const docRef = await db.collection("turmas").add({
    name: name || "",
    courseIds: courseIds || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
