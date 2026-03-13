import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/exercises/playlists/[playlistId]
 * Returns playlist detail with exercises and user progress.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> }
) {
  const { playlistId } = await params;

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

  const playlistDoc = await db
    .collection("Playlist_database")
    .doc(playlistId)
    .get();

  if (!playlistDoc.exists) {
    return NextResponse.json(
      { error: "Playlist not found" },
      { status: 404 }
    );
  }

  const data = playlistDoc.data()!;
  const exercises = Array.isArray(data.exercicios) ? data.exercicios : [];

  // Fetch user progress for this playlist
  const progressDoc = await db
    .collection("Users")
    .doc(user.uid)
    .collection("playlistProgress")
    .doc(playlistId)
    .get();

  const progress = progressDoc.exists ? progressDoc.data() : null;
  const recordings: Record<string, unknown> = progress?.recordings || {};

  const exercisesWithProgress = exercises.map(
    (ex: Record<string, unknown>, index: number) => ({
      ...ex,
      order: ex.order ?? index,
      hasRecording: !!recordings[String(index)],
      recordingUrl: recordings[String(index)]
        ? (recordings[String(index)] as Record<string, unknown>)?.url || null
        : null,
    })
  );

  return NextResponse.json({
    id: playlistDoc.id,
    playlist_name: data.playlist_name || "",
    playlist_title: data.playlist_title || "",
    playlist_subtitle: data.playlist_subtitle || "",
    playlist_image: data.playlist_image || "",
    max_otimizada: data.max_otimizada || 0,
    exercises: exercisesWithProgress,
    completedCount: Object.keys(recordings).length,
    totalCount: exercises.length,
  });
}
