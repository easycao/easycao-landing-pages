"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export interface VideoPlayerProps {
  /** Video URL. */
  src: string;
  /** Thumbnail / poster image. */
  poster?: string;
  /** Called when video finishes playing. */
  onEnded?: () => void;
  /** Show the repeat button. */
  showRepeat?: boolean;
  /** Max number of repeats allowed (default: 1). */
  repeatCount?: number;
  /** Called when all repeats have been consumed. */
  onRepeatUsed?: () => void;
  /** Alternative audio/video URL to play on repeat (e.g., P2 T4 plays T3's audio). */
  repeatSrc?: string;
  autoPlay?: boolean;
  className?: string;
}

export default function VideoPlayer({
  src,
  poster,
  onEnded,
  showRepeat = false,
  repeatCount = 1,
  onRepeatUsed,
  repeatSrc,
  autoPlay = false,
  className = "",
}: VideoPlayerProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const videoRef = useRef<HTMLVideoElement>(null);
  const repeatAudioRef = useRef<HTMLAudioElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [repeatsUsed, setRepeatsUsed] = useState(0);
  const [playingRepeatAudio, setPlayingRepeatAudio] = useState(false);

  const repeatsRemaining = repeatCount - repeatsUsed;

  const handleEnded = useCallback(() => {
    setHasEnded(true);
    onEnded?.();
  }, [onEnded]);

  const handlePlay = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.play();
    setHasStarted(true);
    setHasEnded(false);
  }, []);

  const handleRepeat = useCallback(() => {
    if (repeatsRemaining <= 0) return;

    const newUsed = repeatsUsed + 1;
    setRepeatsUsed(newUsed);

    if (repeatSrc) {
      // Play alternative audio source (e.g., P2 T4 repeats T3's audio)
      if (repeatAudioRef.current) {
        repeatAudioRef.current.pause();
        repeatAudioRef.current = null;
      }
      const audio = new Audio(repeatSrc);
      repeatAudioRef.current = audio;
      setPlayingRepeatAudio(true);
      audio.onended = () => {
        setPlayingRepeatAudio(false);
        if (newUsed >= repeatCount) onRepeatUsed?.();
      };
      audio.play().catch(() => {
        setPlayingRepeatAudio(false);
      });
    } else {
      // Replay the same video
      if (!videoRef.current) return;
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setHasEnded(false);
    }

    if (!repeatSrc && newUsed >= repeatCount) {
      onRepeatUsed?.();
    }
  }, [repeatsUsed, repeatsRemaining, repeatCount, onRepeatUsed, repeatSrc]);

  // Auto-play on mount
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().then(() => {
        setHasStarted(true);
      }).catch(() => {
        // Auto-play blocked by browser, show play button
      });
    }
  }, [autoPlay]);

  // Cleanup repeat audio on unmount
  useEffect(() => {
    return () => {
      if (repeatAudioRef.current) {
        repeatAudioRef.current.pause();
        repeatAudioRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Video — no controls, no seeking */}
      <div className="relative rounded-2xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          onEnded={handleEnded}
          className="w-full aspect-video object-contain"
          playsInline
        />

        {/* Center play button before video starts */}
        {!hasStarted && !autoPlay && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-primary ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Repeat button — outside the player */}
      {showRepeat && hasEnded && repeatsRemaining > 0 && !playingRepeatAudio && (
        <button
          onClick={handleRepeat}
          className={`w-full py-3 rounded-xl text-sm font-medium border transition-all duration-200 flex items-center justify-center gap-2 ${
            isDark
              ? "border-white/[0.12] text-white hover:bg-white/[0.06]"
              : "border-gray-200 text-black hover:bg-gray-50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          Repetir ({repeatsRemaining})
        </button>
      )}
      {playingRepeatAudio && (
        <div className={`w-full py-3 rounded-xl text-sm font-medium border flex items-center justify-center gap-2 ${
          isDark
            ? "border-white/[0.12] text-white/60"
            : "border-gray-200 text-black/50"
        }`}>
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Reproduzindo áudio...
        </div>
      )}
      {showRepeat && hasEnded && repeatsRemaining <= 0 && !playingRepeatAudio && (
        <p className={`text-center text-xs ${isDark ? "text-white/40" : "text-black/30"}`}>
          Sem repetições restantes
        </p>
      )}
    </div>
  );
}
