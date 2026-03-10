import { NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function GET() {
  const db = getFirestoreDb();
  const snap = await db.collection("courses").orderBy("order").get();
  const courses = await Promise.all(
    snap.docs.map(async (doc) => {
      const data = doc.data();
      const modulesSnap = await db
        .collection("courses")
        .doc(doc.id)
        .collection("modules")
        .get();
      let lessonCount = 0;
      for (const mod of modulesSnap.docs) {
        const lessonsSnap = await db
          .collection("courses")
          .doc(doc.id)
          .collection("modules")
          .doc(mod.id)
          .collection("lessons")
          .get();
        lessonCount += lessonsSnap.size;
      }
      return {
        id: doc.id,
        ...data,
        moduleCount: modulesSnap.size,
        lessonCount,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      };
    })
  );
  return NextResponse.json({ courses });
}

export async function POST(req: Request) {
  const db = getFirestoreDb();
  const body = await req.json();
  const { name, description, thumbnail, status, order } = body;

  const docRef = await db.collection("courses").add({
    name: name || "",
    description: description || "",
    thumbnail: thumbnail || "",
    status: status || "draft",
    order: order ?? 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
