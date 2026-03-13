import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/exercises/playlists
 * Returns all playlists from Playlist_database collection.
 */
export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await verifySession(sessionCookie);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const db = getFirestoreDb();

  // Fetch playlists
  const playlistsSnap = await db.collection("Playlist_database").get();
  const playlists = playlistsSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      playlist_name: data.playlist_name || "",
      playlist_title: data.playlist_title || "",
      playlist_subtitle: data.playlist_subtitle || "",
      playlist_image: data.playlist_image || "",
      max_otimizada: data.max_otimizada || 0,
      exerciseCount: Array.isArray(data.exercicios)
        ? data.exercicios.length
        : 0,
    };
  });

  // Fetch user's playlist progress
  const progressSnap = await db
    .collection("Users")
    .doc(user.uid)
    .collection("playlistProgress")
    .get();

  const progressMap: Record<string, { completedCount: number }> = {};
  progressSnap.docs.forEach((doc) => {
    const data = doc.data();
    progressMap[doc.id] = {
      completedCount: data.completedCount || 0,
    };
  });

  const playlistsWithProgress = playlists.map((p) => ({
    ...p,
    completedCount: progressMap[p.id]?.completedCount || 0,
  }));

  return NextResponse.json({ playlists: playlistsWithProgress });
}
