"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import AudioRecorder from "@/components/platform/AudioRecorder";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface PlaylistExerciseItem {
  name: string;
  order: number;
  image: string;
  playlistImage: string;
  inputAudioUrl: string;
  inputAudioTitle: string;
  audioQuestion: string;
  hasRecording: boolean;
  recordingUrl: string | null;
}

interface PlaylistDetail {
  id: string;
  playlist_name: string;
  playlist_title: string;
  playlist_subtitle: string;
  playlist_image: string;
  exercises: PlaylistExerciseItem[];
  completedCount: number;
  totalCount: number;
}

export default function PlaylistDetailPage() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [playlist, setPlaylist] = useState<PlaylistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(-1);

  const cardClass = isDark
    ? "rounded-2xl border border-white/[0.09] backdrop-blur-[20px]"
    : "rounded-2xl bg-white border border-gray-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.06)]";
  const cardBg = isDark
    ? {
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
      }
    : undefined;
  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";

  // Fetch playlist detail
  useEffect(() => {
    if (!playlistId) return;
    (async () => {
      try {
        const res = await fetch(`/api/exercises/playlists/${playlistId}`);
        if (res.ok) {
          const data = await res.json();
          setPlaylist(data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [playlistId]);

  // Handle recording complete for an exercise
  const handleRecordingComplete = useCallback(
    async (recordingUrl: string, exerciseIndex: number) => {
      if (!playlist) return;
      // Update local state
      setPlaylist((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.exercises = prev.exercises.map((ex, idx) =>
          idx === exerciseIndex
            ? { ...ex, hasRecording: true, recordingUrl }
            : ex
        );
        updated.completedCount = updated.exercises.filter(
          (ex) => ex.hasRecording
        ).length;
        return updated;
      });
    },
    [playlist]
  );

  const handleRecordingDelete = useCallback(
    (exerciseIndex: number) => {
      if (!playlist) return;
      setPlaylist((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.exercises = prev.exercises.map((ex, idx) =>
          idx === exerciseIndex
            ? { ...ex, hasRecording: false, recordingUrl: null }
            : ex
        );
        updated.completedCount = updated.exercises.filter(
          (ex) => ex.hasRecording
        ).length;
        return updated;
      });
    },
    [playlist]
  );

  // Play all recordings sequentially
  const playAll = useCallback(() => {
    if (!playlist) return;
    const recordedExercises = playlist.exercises
      .map((ex, idx) => ({ ...ex, originalIndex: idx }))
      .filter((ex) => ex.hasRecording && ex.recordingUrl);

    if (recordedExercises.length === 0) return;

    setPlayingAll(true);
    setPlayingIndex(0);

    let currentIdx = 0;

    function playNext() {
      if (currentIdx >= recordedExercises.length) {
        setPlayingAll(false);
        setPlayingIndex(-1);
        return;
      }

      const ex = recordedExercises[currentIdx];
      setPlayingIndex(ex.originalIndex);

      const audio = new Audio(ex.recordingUrl!);
      audio.onended = () => {
        currentIdx++;
        playNext();
      };
      audio.onerror = () => {
        currentIdx++;
        playNext();
      };
      audio.play().catch(() => {
        currentIdx++;
        playNext();
      });
    }

    playNext();
  }, [playlist]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className={`text-sm ${textSecondary}`}>Carregando playlist...</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-sm text-red-500">Playlist não encontrada.</p>
        <Link
          href="/exercises/playlists"
          className="text-sm text-primary hover:underline"
        >
          Voltar
        </Link>
      </div>
    );
  }

  const progress =
    playlist.totalCount > 0
      ? (playlist.completedCount / playlist.totalCount) * 100
      : 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/exercises/playlists"
          className={`text-xs font-medium ${textSecondary} hover:opacity-70 transition-colors`}
        >
          &larr; Playlists
        </Link>
      </div>

      {/* Playlist info */}
      <div className={`${cardClass} overflow-hidden mb-6`} style={cardBg}>
        {playlist.playlist_image && (
          <div className="aspect-[21/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={playlist.playlist_image}
              alt={playlist.playlist_title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-5">
          <h2 className={`text-lg font-bold ${textPrimary} mb-1`}>
            {playlist.playlist_title || playlist.playlist_name}
          </h2>
          {playlist.playlist_subtitle && (
            <p className={`text-sm ${textSecondary} mb-3`}>
              {playlist.playlist_subtitle}
            </p>
          )}
          <div className="flex items-center gap-3">
            <div
              className={`flex-1 h-1.5 rounded-full ${
                isDark ? "bg-white/10" : "bg-gray-200"
              } overflow-hidden`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`text-xs font-medium ${textSecondary}`}>
              {playlist.completedCount}/{playlist.totalCount}
            </span>
          </div>
        </div>
      </div>

      {/* Play all button */}
      {playlist.completedCount > 0 && (
        <button
          onClick={playAll}
          disabled={playingAll}
          className={`w-full mb-6 py-3 rounded-xl text-sm font-semibold transition-all ${
            playingAll
              ? isDark
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-emerald-50 text-emerald-600"
              : isDark
                ? "bg-primary/20 text-primary hover:bg-primary/30"
                : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {playingAll
            ? "Reproduzindo..."
            : `Ouvir minha Play (${playlist.completedCount} gravações)`}
        </button>
      )}

      {/* Exercises list */}
      <div className="space-y-3">
        {playlist.exercises.map((exercise, index) => {
          const isActive = activeExercise === index;
          const isPlaying = playingAll && playingIndex === index;

          return (
            <div
              key={index}
              className={`${cardClass} overflow-hidden transition-all duration-200 ${
                isPlaying ? (isDark ? "ring-1 ring-emerald-500/40" : "ring-1 ring-emerald-500/30") : ""
              }`}
              style={cardBg}
            >
              {/* Exercise header */}
              <button
                onClick={() => setActiveExercise(isActive ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      exercise.hasRecording
                        ? "bg-emerald-500/20 text-emerald-500"
                        : isDark
                          ? "bg-white/[0.06] text-white/40"
                          : "bg-gray-100 text-black/30"
                    }`}
                  >
                    {exercise.hasRecording ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${textPrimary}`}>
                      {exercise.name || exercise.inputAudioTitle || `Exercício ${index + 1}`}
                    </span>
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 ${textSecondary} transition-transform ${
                    isActive ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>

              {/* Expanded content */}
              {isActive && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Question audio */}
                  {exercise.audioQuestion && (
                    <div>
                      <p
                        className={`text-xs font-medium ${textSecondary} mb-2 uppercase tracking-wider`}
                      >
                        Áudio da questão
                      </p>
                      <audio
                        src={exercise.audioQuestion}
                        controls
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Input audio */}
                  {exercise.inputAudioUrl && (
                    <div>
                      <p
                        className={`text-xs font-medium ${textSecondary} mb-2 uppercase tracking-wider`}
                      >
                        Áudio de referência
                      </p>
                      <audio
                        src={exercise.inputAudioUrl}
                        controls
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Exercise image */}
                  {exercise.image && (
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={exercise.image}
                        alt={exercise.name}
                        className="w-full rounded-xl object-contain max-h-[200px]"
                      />
                    </div>
                  )}

                  {/* Recorder */}
                  <div>
                    <p
                      className={`text-xs font-medium ${textSecondary} mb-2 uppercase tracking-wider`}
                    >
                      Sua gravação
                    </p>
                    <AudioRecorder
                      uid={user?.uid || ""}
                      context={`playlists/${playlistId}/exercise/${index}`}
                      onRecordingComplete={(url) =>
                        handleRecordingComplete(url, index)
                      }
                      onRecordingDelete={() => handleRecordingDelete(index)}
                    />
                  </div>

                  {/* Existing recording playback */}
                  {exercise.hasRecording && exercise.recordingUrl && (
                    <div>
                      <p
                        className={`text-xs font-medium ${textSecondary} mb-2 uppercase tracking-wider`}
                      >
                        Última gravação
                      </p>
                      <audio
                        src={exercise.recordingUrl}
                        controls
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
