import { NextResponse, type NextRequest } from "next/server";
import { updateLastAccessed } from "@/lib/platform/progress";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { uid, courseId, lessonId } = body;

  if (!uid || !courseId || !lessonId) {
    return NextResponse.json(
      { error: "uid, courseId, and lessonId are required" },
      { status: 400 }
    );
  }

  await updateLastAccessed(uid, courseId, lessonId);
  return NextResponse.json({ ok: true });
}
