import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

type Params = {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
};

function exercisesPath(courseId: string, moduleId: string, lessonId: string) {
  return `courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { courseId, moduleId, lessonId } = await params;
  const db = getFirestoreDb();
  const snap = await db
    .collection(exercisesPath(courseId, moduleId, lessonId))
    .orderBy("order")
    .get();
  const exercises = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return NextResponse.json({ exercises });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { courseId, moduleId, lessonId } = await params;
  const db = getFirestoreDb();
  const body = await req.json();

  const docRef = await db
    .collection(exercisesPath(courseId, moduleId, lessonId))
    .add({
      type: body.type || "speaking",
      prompt: body.prompt || "",
      referenceAnswer: body.referenceAnswer || "",
      videoUrl: body.videoUrl || "",
      imageUrl: body.imageUrl || "",
      order: body.order ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  return NextResponse.json({ id: docRef.id }, { status: 201 });
}
