import { NextResponse, type NextRequest } from "next/server";
import { getStudentProgress } from "@/lib/platform/progress";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const uid = req.nextUrl.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const progress = await getStudentProgress(uid, courseId);
  return NextResponse.json(progress);
}
