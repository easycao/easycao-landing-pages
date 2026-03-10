import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function GET(
  _req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
  }
) {
  const { courseId, moduleId, lessonId } = await params;

  try {
    const db = getFirestoreDb();

    const lessonDoc = await db
      .collection("courses")
      .doc(courseId)
      .collection("modules")
      .doc(moduleId)
      .collection("lessons")
      .doc(lessonId)
      .get();

    if (!lessonDoc.exists) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const data = lessonDoc.data()!;

    // Get module name for breadcrumb
    const moduleDoc = await db
      .collection("courses")
      .doc(courseId)
      .collection("modules")
      .doc(moduleId)
      .get();
    const moduleName = moduleDoc.data()?.name || "";

    // Get course name for breadcrumb
    const courseDoc = await db.collection("courses").doc(courseId).get();
    const courseName = courseDoc.data()?.name || "";

    // Get all published lessons in this module for prev/next navigation
    const lessonsSnap = await db
      .collection("courses")
      .doc(courseId)
      .collection("modules")
      .doc(moduleId)
      .collection("lessons")
      .get();

    const allLessons = lessonsSnap.docs
      .filter((l) => l.data().status === "published")
      .map((l) => ({
        id: l.id,
        title: l.data().title || "",
        order: l.data().order ?? 0,
      }))
      .sort((a, b) => a.order - b.order);

    const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson =
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null;

    return NextResponse.json({
      lesson: {
        id: lessonDoc.id,
        title: data.title || "",
        duration: data.duration || null,
        kinescopeVideoId: data.kinescopeVideoId || null,
        order: data.order ?? 0,
      },
      moduleName,
      courseName,
      moduleId,
      courseId,
      prevLesson,
      nextLesson,
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
