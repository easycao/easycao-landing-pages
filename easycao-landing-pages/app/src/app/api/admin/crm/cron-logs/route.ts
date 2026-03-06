import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getFirestoreDb();
  const snapshot = await db
    .collection("cronLogs")
    .orderBy("executedAt", "desc")
    .limit(90)
    .get();

  const logs = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      executedAt: data.executedAt?.toDate?.().toISOString() ?? null,
      durationMs: data.durationMs ?? 0,
      processed: data.processed ?? 0,
      sent: data.sent ?? 0,
      skippedBlocked: data.skippedBlocked ?? 0,
      autoBlocked: data.autoBlocked ?? 0,
      errors: data.errors ?? 0,
      messages: data.messages ?? [],
      autoBlockedList: data.autoBlockedList ?? [],
      fatalError: data.fatalError ?? null,
    };
  });

  return NextResponse.json({ logs });
}
