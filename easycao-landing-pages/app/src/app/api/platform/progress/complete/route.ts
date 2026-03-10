import { NextResponse, type NextRequest } from "next/server";
import {
  markLessonComplete,
  countCourseLessons,
} from "@/lib/platform/progress";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { uid, courseId, lessonId } = body;

  if (!uid || !courseId || !lessonId) {
    return NextResponse.json(
      { error: "uid, courseId, and lessonId are required" },
      { status: 400 }
    );
  }

  const totalLessons = await countCourseLessons(courseId);
  const result = await markLessonComplete(uid, courseId, lessonId, totalLessons);

  return NextResponse.json(result);
}
