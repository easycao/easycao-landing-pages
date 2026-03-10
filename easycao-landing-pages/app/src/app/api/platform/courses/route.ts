import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { getAccessibleCourseIds } from "@/lib/platform/access";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  try {
    const db = getFirestoreDb();
    const accessibleIds = await getAccessibleCourseIds(uid);

    if (accessibleIds.length === 0) {
      return NextResponse.json({ courses: [] });
    }

    // Fetch each accessible course directly by ID
    const courses = [];
    for (const courseId of accessibleIds) {
      const doc = await db.collection("courses").doc(courseId).get();
      if (!doc.exists) continue;

      const data = doc.data()!;
      if (data.status !== "published") continue;

      // Count published lessons
      const modulesSnap = await db
        .collection("courses")
        .doc(courseId)
        .collection("modules")
        .get();

      let lessonCount = 0;
      for (const mod of modulesSnap.docs) {
        if (mod.data().status !== "published") continue;
        const lessonsSnap = await db
          .collection("courses")
          .doc(courseId)
          .collection("modules")
          .doc(mod.id)
          .collection("lessons")
          .get();
        lessonCount += lessonsSnap.docs.filter(
          (l) => l.data().status === "published"
        ).length;
      }

      courses.push({
        id: doc.id,
        name: data.name,
        description: data.description || "",
        thumbnail: data.thumbnail || "",
        lessonCount,
        order: data.order ?? 0,
      });
    }

    courses.sort((a, b) => a.order - b.order);

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
