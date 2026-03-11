import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { enrollmentId, realPricePaid } = body;

  if (!enrollmentId || typeof realPricePaid !== "number" || realPricePaid <= 0) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const db = getFirestoreDb();
  const enrollmentRef = db
    .collection("Users")
    .doc(id)
    .collection("enrollments")
    .doc(enrollmentId);

  const doc = await enrollmentRef.get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  }

  await enrollmentRef.update({
    realPricePaid,
    needsManualPrice: false,
  });

  return NextResponse.json({ success: true });
}
