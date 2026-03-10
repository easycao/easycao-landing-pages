import { NextResponse, type NextRequest } from "next/server";
import { checkPlatformAccess } from "@/lib/platform/access";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ hasAccess: false }, { status: 400 });
  }

  const hasAccess = await checkPlatformAccess(uid);
  return NextResponse.json({ hasAccess });
}
