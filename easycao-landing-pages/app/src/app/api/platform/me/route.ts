import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const db = getFirestoreDb();
  const doc = await db.collection("Users").doc(uid).get();

  if (!doc.exists) {
    return NextResponse.json({ name: null, role: "student" });
  }

  const data = doc.data()!;
  return NextResponse.json({
    name: data.name || data.display_name || null,
    role: data.role || "student",
  });
}
