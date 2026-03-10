import { NextResponse, type NextRequest } from "next/server";
import { getDashboardProgress } from "@/lib/platform/progress";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const data = await getDashboardProgress(uid);
  return NextResponse.json(data);
}
