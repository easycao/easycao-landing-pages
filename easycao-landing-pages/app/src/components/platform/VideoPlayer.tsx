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
  autoPlay = false,
  className = "",
}: VideoPlayerProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatsUsed, setRepeatsUsed] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);

  const repeatsRemaining = repeatCount - repeatsUsed;

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setHasEnded(true);
    onEnded?.();
  }, [onEnded]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!videoRef.current) return;
      const vol = parseFloat(e.target.value);
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    },
    []
  );

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const muted = !videoRef.current.muted;
    videoRef.current.muted = muted;
    setIsMuted(muted);
  }, []);

  const handleRepeat = useCallback(() => {
    if (!videoRef.current || repeatsRemaining <= 0) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setHasEnded(false);

    const newUsed = repeatsUsed + 1;
    setRepeatsUsed(newUsed);

    if (newUsed >= repeatCount) {
      onRepeatUsed?.();
    }
  }, [repeatsUsed, repeatsRemaining, repeatCount, onRepeatUsed]);

  // Sync play state from external events (e.g. user clicks native controls)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const controlsBg = isDark
    ? "bg-black/60 backdrop-blur-sm"
    : "bg-white/90 backdrop-blur-sm shadow-sm";
  const textColor = isDark ? "text-white" : "text-black";
  const textMuted = isDark ? "text-white/60" : "text-black/50";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden group ${isDark ? "bg-black" : "bg-black"} ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="w-full aspect-video object-contain"
        playsInline
      />

      {/* Custom controls overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 py-3 ${controlsBg} transition-opacity duration-200 opacity-0 group-hover:opacity-100`}
      >
        {/* Progress bar */}
        <div className="relative mb-2">
          <div
            className={`w-full h-1 rounded-full ${isDark ? "bg-white/20" : "bg-black/10"}`}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-100"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className={`${textColor} hover:text-primary transition-colors`}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Time */}
          <span className={`text-xs ${textMuted} font-mono min-w-[80px]`}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <button
            onClick={toggleMute}
            className={`${textColor} hover:text-primary transition-colors`}
          >
            {isMuted || volume === 0 ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 accent-primary cursor-pointer"
          />

          {/* Repeat button */}
          {showRepeat && hasEnded && repeatsRemaining > 0 && (
            <button
              onClick={handleRepeat}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Repetir ({repeatsRemaining})
            </button>
          )}
          {showRepeat && repeatsRemaining <= 0 && (
            <span className={`text-xs ${textMuted}`}>Sem repetições</span>
          )}
        </div>
      </div>

      {/* Center play button when paused & not hovering */}
      {!isPlaying && currentTime === 0 && (
        <button
          onClick={togglePlay}
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
  );
}

