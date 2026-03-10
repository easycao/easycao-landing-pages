import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  try {
    const db = getFirestoreDb();

    const courseDoc = await db.collection("courses").doc(courseId).get();
    if (!courseDoc.exists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseData = courseDoc.data()!;

    // Get all modules, filter and sort in code
    const modulesSnap = await db
      .collection("courses")
      .doc(courseId)
      .collection("modules")
      .get();

    const modules = [];
    for (const mod of modulesSnap.docs) {
      const modData = mod.data();
      if (modData.status !== "published") continue;

      const lessonsSnap = await db
        .collection("courses")
        .doc(courseId)
        .collection("modules")
        .doc(mod.id)
        .collection("lessons")
        .get();

      const lessons = lessonsSnap.docs
        .filter((l) => l.data().status === "published")
        .map((l) => {
          const ld = l.data();
          return {
            id: l.id,
            title: ld.title || "",
            duration: ld.duration || null,
            kinescopeVideoId: ld.kinescopeVideoId || null,
            order: ld.order ?? 0,
          };
        })
        .sort((a, b) => a.order - b.order);

      modules.push({
        id: mod.id,
        name: modData.name || "",
        order: modData.order ?? 0,
        lessonCount: lessons.length,
        lessons,
      });
    }

    modules.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      course: {
        id: courseDoc.id,
        name: courseData.name,
        description: courseData.description || "",
        thumbnail: courseData.thumbnail || "",
      },
      modules,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
