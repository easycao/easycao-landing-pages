"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

interface PlaylistItem {
  id: string;
  playlist_name: string;
  playlist_title: string;
  playlist_subtitle: string;
  playlist_image: string;
  exerciseCount: number;
  completedCount: number;
}

export default function PlaylistsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/exercises/playlists");
        if (res.ok) {
          const data = await res.json();
          setPlaylists(data.playlists || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className={`text-sm ${textSecondary}`}>
          Carregando playlists...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/exercises"
          className={`text-xs font-medium ${textSecondary} hover:opacity-70 transition-colors`}
        >
          &larr; Exercícios
        </Link>
      </div>

      <h2
        className={`text-sm font-bold uppercase tracking-[0.08em] mb-5 ${
          isDark ? "text-white/50" : "text-black/70"
        }`}
      >
        Playlists
      </h2>

      {playlists.length === 0 ? (
        <div className={`text-center py-16 ${textSecondary} text-sm`}>
          Nenhuma playlist encontrada.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => {
            const progress =
              playlist.exerciseCount > 0
                ? (playlist.completedCount / playlist.exerciseCount) * 100
                : 0;
            const isComplete =
              playlist.exerciseCount > 0 &&
              playlist.completedCount >= playlist.exerciseCount;

            return (
              <Link
                key={playlist.id}
                href={`/exercises/playlists/${playlist.id}`}
                className={`${cardClass} overflow-hidden text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg block`}
                style={cardBg}
              >
                {/* Thumbnail */}
                {playlist.playlist_image && (
                  <div className="aspect-[16/9] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={playlist.playlist_image}
                      alt={playlist.playlist_title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  <h3
                    className={`text-sm font-bold ${textPrimary} mb-1 line-clamp-1`}
                  >
                    {playlist.playlist_title || playlist.playlist_name}
                  </h3>
                  {playlist.playlist_subtitle && (
                    <p
                      className={`text-xs ${textSecondary} mb-3 line-clamp-2 leading-relaxed`}
                    >
                      {playlist.playlist_subtitle}
                    </p>
                  )}

                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex-1 h-1.5 rounded-full ${
                        isDark ? "bg-white/10" : "bg-gray-200"
                      } overflow-hidden`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete
                            ? "bg-emerald-500"
                            : "bg-gradient-to-r from-blue-500 to-blue-600"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-medium ${textSecondary}`}>
                      {playlist.completedCount}/{playlist.exerciseCount}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
