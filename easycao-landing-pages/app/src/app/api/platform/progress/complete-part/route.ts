import { NextResponse, type NextRequest } from "next/server";
import {
  markLessonPartComplete,
  countCourseLessons,
} from "@/lib/platform/progress";

/**
 * POST /api/platform/progress/complete-part
 * Mark a specific lesson part as complete (video, consolidation, exercises).
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { uid, courseId, lessonId, part, totalParts } = body;

  if (!uid || !courseId || !lessonId || !part) {
    return NextResponse.json(
      { error: "uid, courseId, lessonId, and part are required" },
      { status: 400 }
    );
  }

  const validParts = ["video", "consolidation", "exercises"];
  if (!validParts.includes(part)) {
    return NextResponse.json(
      { error: "part must be one of: video, consolidation, exercises" },
      { status: 400 }
    );
  }

  const totalLessons = await countCourseLessons(courseId);
  const result = await markLessonPartComplete(
    uid,
    courseId,
    lessonId,
    part,
    totalParts || 1,
    totalLessons
  );

  return NextResponse.json(result);
}
