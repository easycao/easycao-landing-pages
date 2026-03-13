"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// --- Glossary Types ---

export interface GlossaryEntry {
  termo: string;
  definicao: string;
  divisaoSilabica: string;
  pronunciaEasycao: string;
  pronunciaFonetica: string;
  urlAudio: string;
}

// --- Types ---

export interface GrammarError {
  word: string;
  category: string;
  subCategory?: string;
  confidence?: string;
  correction: string;
  explanation: string;
}

export interface PhonemeDetail {
  phoneme: string;
  score: number;
}

export interface WordScore {
  word: string;
  score: number;
  phonemes?: PhonemeDetail[];
}

export interface ComprehensionPoint {
  keyPoint: string;
  matched: boolean;
}

export interface WhisperWordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface FeedbackData {
  transcription: string;
  pronunciation: number | null;
  fluency: number | null;
  errors: GrammarError[];
  correctedText: string;
  wordScores?: WordScore[];
  whisperWords?: WhisperWordTimestamp[];
  aiFeedback?: string;
  recordingUrl?: string;
  level4Version?: string;
  level5Version?: string;
  comprehension?: {
    score: number;
    total: number;
    points: ComprehensionPoint[];
  };
  pollyReferenceUrl?: string;
  glossary?: Record<string, GlossaryEntry>;
}

// --- Constants ---

export const DESCRIPTOR_LABELS: Record<string, string> = {
  structure: "Estrutura",
  vocabulary: "Vocabulário",
};

const DESCRIPTOR_ICONS: Record<string, string> = {
  structure: "E",
  vocabulary: "V",
};

// --- Score Helpers ---

export function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function scoreRingStroke(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "Excelente";
  if (score >= 80) return "Muito Bom";
  if (score >= 70) return "Bom";
  if (score >= 60) return "Regular";
  if (score >= 40) return "Precisa Melhorar";
  return "Fraco";
}

function stripPunctuation(s: string): string {
  return s.replace(/^[.,!?;:'"()[\]{}]+|[.,!?;:'"()[\]{}]+$/g, "").toLowerCase();
}

// --- Circular Gauge ---

export function CircularGauge({
  label,
  value,
  size = 104,
}: {
  label: string;
  value: number;
  size?: number;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth="7"
            stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            stroke={scoreRingStroke(value)}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold ${scoreColor(value)}`}>
            {Math.round(value)}
          </span>
        </div>
      </div>
      <p className={`text-[11px] font-medium mt-2 ${isDark ? "text-white/50" : "text-black/50"}`}>
        {label}
      </p>
      <p className={`text-[10px] font-medium ${scoreColor(value)}`}>
        {scoreLabel(value)}
      </p>
    </div>
  );
}

// --- Audio Player ---

function AudioPlayer({
  recordingUrl,
  wordScores,
  whisperWords,
  transcription,
  showWords = true,
}: {
  recordingUrl: string;
  wordScores?: WordScore[];
  whisperWords?: WhisperWordTimestamp[];
  transcription: string;
  showWords?: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIdx, setCurrentWordIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  const hasTimestamps = whisperWords && whisperWords.length > 0;
  const displayWords = hasTimestamps
    ? whisperWords.map((w) => w.word)
    : transcription.split(/\s+/).filter(Boolean);
  const hasWordScores = wordScores && wordScores.length > 0;

  // Estimate duration from Whisper timestamps (webm files often lack duration metadata)
  const estimatedDuration = hasTimestamps
    ? whisperWords[whisperWords.length - 1].end + 0.5
    : 0;

  const startTicking = useCallback(() => {
    function tick() {
      if (!audioRef.current) return;
      const currentTime = audioRef.current.currentTime;
      const duration =
        durationRef.current ||
        (isFinite(audioRef.current.duration) ? audioRef.current.duration : 0) ||
        estimatedDuration ||
        1;
      setProgress(Math.min((currentTime / duration) * 100, 100));

      if (hasTimestamps && whisperWords) {
        let idx = -1;
        for (let j = 0; j < whisperWords.length; j++) {
          if (currentTime >= whisperWords[j].start) idx = j;
          else break;
        }
        setCurrentWordIdx(idx);
      } else {
        const wordDuration = duration / displayWords.length;
        setCurrentWordIdx(
          Math.min(Math.floor(currentTime / wordDuration), displayWords.length - 1)
        );
      }

      if (!audioRef.current.paused) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    }
    animFrameRef.current = requestAnimationFrame(tick);
  }, [displayWords.length, hasTimestamps, whisperWords, estimatedDuration]);

  const playAudio = useCallback((audio: HTMLAudioElement) => {
    audio.play();
    setIsPlaying(true);
    startTicking();
  }, [startTicking]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(recordingUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentWordIdx(-1);
        setProgress(100);
        cancelAnimationFrame(animFrameRef.current);
      };

      // Resolve duration before first play (webm files lack duration metadata)
      audio.addEventListener("loadedmetadata", () => {
        if (audio.duration && isFinite(audio.duration)) {
          durationRef.current = audio.duration;
          playAudio(audio);
        } else {
          // Webm workaround: seek to end to force browser to calculate duration
          audio.currentTime = 1e10;
          audio.addEventListener(
            "seeked",
            () => {
              if (audio.duration && isFinite(audio.duration)) {
                durationRef.current = audio.duration;
              }
              audio.currentTime = 0;
              playAudio(audio);
            },
            { once: true }
          );
        }
      });

      audio.addEventListener("durationchange", () => {
        if (audio.duration && isFinite(audio.duration)) {
          durationRef.current = audio.duration;
        }
      });

      return; // Wait for loadedmetadata → playAudio
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      cancelAnimationFrame(animFrameRef.current);
    } else {
      playAudio(audioRef.current);
    }
  }, [isPlaying, recordingUrl, playAudio]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={`rounded-2xl p-4 border ${
        isDark
          ? "border-white/[0.08] bg-white/[0.03]"
          : "border-gray-border/40 bg-gray-light"
      }`}
    >
      {/* Play button + progress bar */}
      <div className={`flex items-center gap-3 ${showWords ? "mb-4" : ""}`}>
        <button
          onClick={togglePlayback}
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-shadow duration-300 ${
            isPlaying
              ? "bg-primary text-white shadow-[0_0_20px_rgba(31,150,247,0.3)]"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="flex-1">
          <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/[0.15]" : "bg-gray-200"}`}>
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className={`text-[11px] font-medium w-20 text-right ${isDark ? "text-white/40" : "text-black/40"}`}>
          {isPlaying ? "Reproduzindo" : "Ouvir áudio"}
        </p>
      </div>

      {/* Word cloud with karaoke + pronunciation colors */}
      {showWords && (
        <div className="flex flex-wrap gap-x-1.5 gap-y-1">
          {displayWords.map((word, i) => {
            const cleanW = stripPunctuation(word);
            const ws = hasWordScores
              ? wordScores.find((w) => stripPunctuation(w.word) === cleanW)
              : null;
            const isActive = i === currentWordIdx;
            const isPast = i < currentWordIdx;

            let colorClass = isDark ? "text-white/60" : "text-black/60";
            if (ws) colorClass = scoreColor(ws.score);
            if (isActive) colorClass = isDark ? "text-white" : "text-black";
            if (isPast && !ws) colorClass = isDark ? "text-white/80" : "text-black/80";

            return (
              <span
                key={i}
                className={`text-sm rounded-md px-1 py-0.5 ${colorClass} ${
                  isActive ? "bg-primary/15 font-medium scale-105" : ""
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Error Popover ---

function ErrorPopover({
  error,
  onClose,
  position,
}: {
  error: GrammarError;
  onClose: () => void;
  position?: "above" | "below";
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMedium = error.confidence === "medium";
  const pos = position || "above";

  return (
    <div
      className={`absolute z-50 ${
        pos === "above" ? "bottom-full mb-3" : "top-full mt-3"
      } left-1/2 -translate-x-1/2 w-[340px] rounded-2xl shadow-2xl overflow-hidden border-none`}
      style={{ background: "linear-gradient(135deg, #0a3d6b 0%, #0057B4 40%, #1F96F7 100%)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-lg font-medium text-white/60 hover:bg-white/20 hover:text-white"
        >
          &times;
        </button>

        {/* Badge row */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/20 text-white">
            {DESCRIPTOR_LABELS[error.category] || error.category}
          </span>
          {error.subCategory && (
            <span className="text-[12px] text-white/70">
              {error.subCategory}
            </span>
          )}
          {isMedium && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-200">
              sugestão
            </span>
          )}
        </div>

        {/* Correction row */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl mb-4 bg-white/15">
          <span className={`text-sm font-semibold ${isMedium ? "text-amber-400" : "text-red-400"}`}>
            {error.word}
          </span>
          <svg
            className="w-4 h-4 flex-shrink-0 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <span className="text-sm font-semibold text-emerald-300">
            {error.correction}
          </span>
        </div>

        {/* Explanation */}
        <p className="text-[13px] leading-relaxed text-white/85">
          {error.explanation}
        </p>
      </div>
    </div>
  );
}

// --- Section Header ---

export function SectionHeader({ children, isDark }: { children: React.ReactNode; isDark: boolean }) {
  return (
    <p className={`text-[13px] font-bold uppercase tracking-[0.08em] mb-3 ${isDark ? "text-white/40" : "text-black/40"}`}>
      {children}
    </p>
  );
}

// --- Tab: Structure & Vocabulary ---

function TextCorrectionsTab({ data }: { data: FeedbackData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeError, setActiveError] = useState<number | null>(null);
  const [expandedDescriptors, setExpandedDescriptors] = useState<Set<string>>(new Set());

  const errors = (data.errors || []).filter((e) => e.word);

  // Find error phrase positions in the transcription (segment-based, not word-by-word)
  const transcription = data.transcription || "";
  const transLower = transcription.toLowerCase();
  const errorSpans: { start: number; end: number; errIdx: number }[] = [];
  const claimed = new Uint8Array(transcription.length); // track used char positions

  for (let i = 0; i < errors.length; i++) {
    const phrase = errors[i].word.toLowerCase().trim();
    if (!phrase) continue;
    let searchFrom = 0;
    while (searchFrom < transLower.length) {
      const idx = transLower.indexOf(phrase, searchFrom);
      if (idx === -1) break;
      // Check range is not already claimed by another error
      let overlap = false;
      for (let c = idx; c < idx + phrase.length; c++) {
        if (claimed[c]) { overlap = true; break; }
      }
      if (!overlap) {
        errorSpans.push({ start: idx, end: idx + phrase.length, errIdx: i });
        for (let c = idx; c < idx + phrase.length; c++) claimed[c] = 1;
        break;
      }
      searchFrom = idx + 1;
    }
  }
  errorSpans.sort((a, b) => a.start - b.start);

  const byDescriptor = new Map<string, typeof errors>();
  for (const err of errors) {
    const desc = err.category || "vocabulary";
    if (!byDescriptor.has(desc)) byDescriptor.set(desc, []);
    byDescriptor.get(desc)!.push(err);
  }

  // Close popover on outside click
  useEffect(() => {
    if (activeError === null) return;
    const handler = () => setActiveError(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [activeError]);

  return (
    <div className="space-y-6">
      {/* AI Feedback */}
      {data.aiFeedback && (
        <div
          className={`p-4 rounded-2xl border ${
            isDark
              ? "bg-primary/[0.06] border-primary/10"
              : "bg-gradient-to-br from-blue-100/80 to-blue-50/70 border-blue-200/60"
          }`}
        >
          <div className="flex gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDark ? "bg-primary/15" : "bg-primary/10"
              }`}
            >
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </div>
            <p className={`text-[13px] leading-relaxed pt-1 ${isDark ? "text-white/75" : "text-black/70"}`}>
              {data.aiFeedback}
            </p>
          </div>
        </div>
      )}

      {/* Audio Player (no word cloud — just audio) */}
      {data.recordingUrl && (
        <AudioPlayer
          recordingUrl={data.recordingUrl}
          transcription={data.transcription || ""}
          showWords={false}
        />
      )}

      {/* Transcription with inline errors */}
      <div>
        <SectionHeader isDark={isDark}>Sua Resposta</SectionHeader>
        <p className={`text-[15px] leading-[2] font-medium ${isDark ? "text-white/90" : "text-black/90"}`}>
          {(() => {
            const segments: React.ReactNode[] = [];
            let cursor = 0;
            for (const span of errorSpans) {
              // Normal text before this error
              if (span.start > cursor) {
                segments.push(
                  <span key={`t-${cursor}`}>{transcription.slice(cursor, span.start)}</span>
                );
              }
              // Error phrase as a single unit
              const errText = transcription.slice(span.start, span.end);
              const err = errors[span.errIdx];
              const isMediumErr = err?.confidence === "medium";
              const isActive = activeError === span.errIdx;
              const idx = span.errIdx;
              segments.push(
                <span
                  key={`e-${idx}`}
                  className="relative inline-block"
                  onPointerEnter={(e) => {
                    if (e.pointerType === "mouse") setActiveError(idx);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") setActiveError(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveError(isActive ? null : idx);
                  }}
                >
                  <span
                    className={`rounded-md px-1 py-0.5 cursor-pointer border-2 ${
                      isMediumErr
                        ? isActive
                          ? "border-amber-400/80 bg-amber-500/15"
                          : "border-amber-400/50 bg-amber-500/10 hover:border-amber-400/70"
                        : isActive
                          ? "border-red-500/80 bg-red-500/15"
                          : "border-red-500/50 bg-red-500/10 hover:border-red-500/70"
                    }`}
                  >
                    {errText}
                  </span>
                  {isActive && (
                    <ErrorPopover error={err} onClose={() => setActiveError(null)} />
                  )}
                </span>
              );
              cursor = span.end;
            }
            // Remaining text after last error
            if (cursor < transcription.length) {
              segments.push(
                <span key={`t-${cursor}`}>{transcription.slice(cursor)}</span>
              );
            }
            return segments;
          })()}
        </p>
      </div>

      {/* Error Summary by Descriptor */}
      {errors.length > 0 && (
        <div>
          <SectionHeader isDark={isDark}>Correções por Descritor</SectionHeader>
          <div className="space-y-3">
            {[...byDescriptor.entries()].map(([desc, descErrors]) => {
              const isExpanded = expandedDescriptors.has(desc);
              const label = DESCRIPTOR_LABELS[desc] || desc;
              const icon = DESCRIPTOR_ICONS[desc] || "?";
              const highCount = descErrors.filter((e) => e.confidence !== "medium").length;
              const mediumCount = descErrors.filter((e) => e.confidence === "medium").length;

              return (
                <div
                  key={desc}
                  className={`rounded-2xl border overflow-hidden ${
                    isDark
                      ? "border-white/[0.08] bg-white/[0.02]"
                      : `border-blue-200/60 ${isExpanded ? "bg-blue-50" : "bg-white"}`
                  }`}
                >
                  <button
                    onClick={() => setExpandedDescriptors((prev) => {
                      const next = new Set(prev);
                      if (next.has(desc)) next.delete(desc);
                      else next.add(desc);
                      return next;
                    })}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                      style={{ background: "linear-gradient(135deg, #0057B4, #1F96F7)" }}
                    >
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${isDark ? "text-white/90" : "text-black/80"}`}>
                        {label}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-black/40"}`}>
                        {highCount > 0 && `${highCount} correç${highCount > 1 ? "ões" : "ão"}`}
                        {highCount > 0 && mediumCount > 0 && " · "}
                        {mediumCount > 0 && `${mediumCount} sugestão${mediumCount > 1 ? "ões" : ""}`}
                      </p>
                    </div>
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${isExpanded ? "rotate-180" : ""} ${isDark ? "text-white/30" : "text-black/30"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      {descErrors.map((err, j) => {
                        const isMed = err.confidence === "medium";
                        return (
                          <div
                            key={j}
                            className={`p-4 rounded-xl ${
                              isDark ? "bg-white/[0.06] border border-white/[0.08]" : "bg-white border border-blue-200/40"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2.5">
                              {err.subCategory && (
                                <span className={`text-[12px] font-medium ${isDark ? "text-white/65" : "text-black/50"}`}>
                                  {err.subCategory}
                                </span>
                              )}
                              {isMed && (
                                <span
                                  className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                                    isDark ? "bg-amber-500/15 text-amber-400" : "bg-amber-50 text-amber-600"
                                  }`}
                                >
                                  sugestão
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2.5 mb-2.5">
                              <span className={`text-sm font-semibold ${isMed ? "text-amber-500" : "text-red-500"}`}>
                                {err.word}
                              </span>
                              <svg
                                className={`w-3.5 h-3.5 flex-shrink-0 ${isDark ? "text-white/20" : "text-black/15"}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                              <span className={`text-sm font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                                {err.correction}
                              </span>
                            </div>
                            <p className={`text-[13px] leading-relaxed ${isDark ? "text-white/70" : "text-black/60"}`}>
                              {err.explanation}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Corrected version */}
      {data.correctedText && data.correctedText !== data.transcription && (
        <div>
          <SectionHeader isDark={isDark}>Versão Corrigida</SectionHeader>
          <div
            className={`p-4 rounded-2xl border ${
              isDark
                ? "bg-emerald-500/[0.05] border-emerald-500/10"
                : "bg-emerald-50 border-emerald-200/60"
            }`}
          >
            <div className="flex gap-3">
              <svg
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p className={`text-[13px] leading-relaxed ${isDark ? "text-emerald-300/80" : "text-emerald-800/80"}`}>
                {data.correctedText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Level 4 alternative */}
      {data.level4Version && (
        <div>
          <SectionHeader isDark={isDark}>Outra Forma de Falar — Nível 4</SectionHeader>
          <div
            className={`p-4 rounded-2xl border ${
              isDark
                ? "bg-primary/[0.05] border-primary/10"
                : "bg-blue-50 border-blue-200/60"
            }`}
          >
            <div className="flex gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #0057B4, #1F96F7)" }}
              >
                4
              </div>
              <p className={`text-[13px] leading-relaxed ${isDark ? "text-white/75" : "text-black/70"}`}>
                {data.level4Version}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Level 5 alternative */}
      {data.level5Version && (
        <div>
          <SectionHeader isDark={isDark}>Versão Nível 5</SectionHeader>
          <div
            className={`p-4 rounded-2xl border ${
              isDark
                ? "bg-amber-500/[0.04] border-amber-500/10"
                : "bg-amber-50 border-amber-200/60"
            }`}
          >
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold bg-amber-500 text-white">
                5
              </div>
              <p className={`text-[13px] leading-relaxed ${isDark ? "text-amber-200/80" : "text-amber-900/70"}`}>
                {data.level5Version}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No errors */}
      {errors.length === 0 && !data.aiFeedback && (
        <div className={`text-center py-6 ${isDark ? "text-white/50" : "text-black/40"}`}>
          <p className="text-sm font-medium">Nenhum erro encontrado. Excelente trabalho!</p>
        </div>
      )}
    </div>
  );
}

// --- Word Audio Segment Player ---

function WordAudioButton({
  recordingUrl,
  start,
  end,
  label,
  isDark,
}: {
  recordingUrl: string;
  start: number;
  end: number;
  label: string;
  isDark: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const play = useCallback(() => {
    if (playing && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
      clearTimeout(timerRef.current);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(recordingUrl);
    }
    const audio = audioRef.current;
    audio.currentTime = start;
    audio.play();
    setPlaying(true);

    const duration = (end - start) * 1000 + 100; // small buffer
    timerRef.current = setTimeout(() => {
      audio.pause();
      setPlaying(false);
    }, duration);
  }, [playing, recordingUrl, start, end]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <button
      onClick={play}
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition-colors ${
        playing
          ? "bg-primary/20 text-primary"
          : isDark
            ? "bg-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.1]"
            : "bg-gray-100 text-black/50 hover:text-black/70 hover:bg-gray-200"
      }`}
    >
      {playing ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
      {label}
    </button>
  );
}

// --- Glossary Audio Button (plays URL directly) ---

function GlossaryAudioButton({ url, isDark }: { url: string; isDark: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    if (playing && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setPlaying(false);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setPlaying(true);
  }, [playing, url]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <button
      onClick={play}
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg transition-colors ${
        playing
          ? "bg-emerald-500/20 text-emerald-500"
          : isDark
            ? "bg-emerald-500/10 text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/15"
            : "bg-emerald-50 text-emerald-600/70 hover:text-emerald-600 hover:bg-emerald-100"
      }`}
    >
      {playing ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
      Ouvir
    </button>
  );
}

// --- Tab: Pronunciation & Fluency ---

function PronunciationFluencyTab({ data }: { data: FeedbackData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const glossary = data.glossary || {};

  // Match whisperWords to wordScores by sequential position
  const wordTimestampMap = useMemo(() => {
    const map = new Map<number, WhisperWordTimestamp>();
    if (!data.wordScores || !data.whisperWords) return map;

    const azureWords = data.wordScores;
    const whisper = data.whisperWords;
    let wIdx = 0;

    for (let aIdx = 0; aIdx < azureWords.length && wIdx < whisper.length; aIdx++) {
      const azureClean = stripPunctuation(azureWords[aIdx].word);
      const whisperClean = stripPunctuation(whisper[wIdx].word);
      if (azureClean === whisperClean) {
        map.set(aIdx, whisper[wIdx]);
        wIdx++;
      } else {
        // Try to find it nearby (within 3 positions)
        for (let scan = wIdx; scan < Math.min(wIdx + 3, whisper.length); scan++) {
          if (stripPunctuation(whisper[scan].word) === azureClean) {
            map.set(aIdx, whisper[scan]);
            wIdx = scan + 1;
            break;
          }
        }
      }
    }
    return map;
  }, [data.wordScores, data.whisperWords]);

  // Words in spoken order
  const wordsInOrder = useMemo(() => {
    return (data.wordScores || []).map((ws, idx) => ({ ...ws, originalIdx: idx }));
  }, [data.wordScores]);

  return (
    <div className="space-y-6">
      {/* Audio Player with pronunciation word cloud + hesitation markers */}
      {data.recordingUrl && (
        <AudioPlayer
          recordingUrl={data.recordingUrl}
          wordScores={data.wordScores}
          whisperWords={data.whisperWords}
          transcription={data.transcription || ""}
          showWords={true}
        />
      )}

      {/* Polly reference audio (when pronunciation < 70%) */}
      {data.pollyReferenceUrl && (
        <div
          className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
            isDark
              ? "bg-primary/[0.05] border-primary/10"
              : "bg-blue-50/70 border-blue-200/50"
          }`}
        >
          <GlossaryAudioButton url={data.pollyReferenceUrl} isDark={isDark} />
          <p className={`text-[12px] ${isDark ? "text-white/50" : "text-black/50"}`}>
            Ouça a pronúncia correta da frase
          </p>
        </div>
      )}

      {/* Gauges */}
      <div
        className={`grid grid-cols-2 gap-4 p-5 rounded-2xl border ${
          isDark ? "border-white/[0.06] bg-white/[0.02]" : "border-gray-border/30 bg-gray-light"
        }`}
      >
        {data.pronunciation !== null && (
          <CircularGauge label="Pronúncia" value={data.pronunciation} />
        )}
        {data.fluency !== null && (
          <CircularGauge label="Fluência" value={data.fluency} />
        )}
      </div>

      {/* Word-level pronunciation cards */}
      {data.wordScores && data.wordScores.length > 0 && (
        <div>
          <SectionHeader isDark={isDark}>Pronúncia por Palavra</SectionHeader>

          <div className="space-y-2">
            {wordsInOrder.map((ws) => {
              const timestamp = wordTimestampMap.get(ws.originalIdx);
              const glossaryEntry = glossary[ws.word.toLowerCase().replace(/\//g, "_")];
              const hasPhonemes = ws.phonemes && ws.phonemes.length > 0;
              const scorePct = Math.round(ws.score);

              return (
                <div
                  key={ws.originalIdx}
                  className={`p-3 rounded-xl border ${
                    ws.score < 60
                      ? isDark
                        ? "border-red-500/15 bg-red-500/[0.04]"
                        : "border-red-200/50 bg-red-50/50"
                      : ws.score < 80
                        ? isDark
                          ? "border-amber-500/15 bg-amber-500/[0.04]"
                          : "border-amber-200/50 bg-amber-50/50"
                        : isDark
                          ? "border-white/[0.06] bg-white/[0.02]"
                          : "border-gray-border/30 bg-white"
                  }`}
                >
                  {/* Row 1: Word + score bar + play button */}
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold min-w-[80px] ${scoreColor(ws.score)}`}>
                      {ws.word}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/[0.08]" : "bg-gray-200"}`}>
                        <div
                          className={`h-full rounded-full ${
                            scorePct >= 80 ? "bg-emerald-500" : scorePct >= 60 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${scorePct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold w-8 text-right ${scoreColor(ws.score)}`}>
                        {scorePct}
                      </span>
                    </div>
                    {timestamp && data.recordingUrl && (
                      <WordAudioButton
                        recordingUrl={data.recordingUrl}
                        start={timestamp.start}
                        end={timestamp.end}
                        label="Ouvir"
                        isDark={isDark}
                      />
                    )}
                  </div>

                  {/* Row 2: Phoneme pills */}
                  {hasPhonemes && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ws.phonemes!.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            p.score >= 80
                              ? isDark
                                ? "bg-emerald-500/10 text-emerald-400/80"
                                : "bg-emerald-50 text-emerald-700"
                              : p.score >= 60
                                ? isDark
                                  ? "bg-amber-500/10 text-amber-400/80"
                                  : "bg-amber-50 text-amber-700"
                                : isDark
                                  ? "bg-red-500/10 text-red-400/80"
                                  : "bg-red-50 text-red-700"
                          }`}
                        >
                          {p.phoneme} <span className="opacity-60">{Math.round(p.score)}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Row 3: Glossary entry */}
                  {glossaryEntry && (
                    <div className={`mt-2 pt-2 border-t ${isDark ? "border-white/[0.06]" : "border-gray-200/60"}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium ${isDark ? "text-white/45" : "text-black/40"}`}>
                          Dicionário Easycao:
                        </span>
                        <span className={`text-sm font-semibold ${isDark ? "text-primary/80" : "text-primary"}`}>
                          {glossaryEntry.pronunciaEasycao}
                        </span>
                        {glossaryEntry.urlAudio && (
                          <GlossaryAudioButton url={glossaryEntry.urlAudio} isDark={isDark} />
                        )}
                      </div>
                      {glossaryEntry.definicao && (
                        <p className={`text-[11px] leading-relaxed mt-1 ${isDark ? "text-white/40" : "text-black/40"}`}>
                          {glossaryEntry.definicao}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* No data */}
      {data.pronunciation === null && data.fluency === null && (
        <div className={`text-center py-8 ${isDark ? "text-white/40" : "text-black/35"}`}>
          <p className="text-sm">Dados de pronúncia não disponíveis para esta tarefa.</p>
        </div>
      )}
    </div>
  );
}

// --- Tab: Comprehension ---

function ComprehensionTab({ data }: { data: FeedbackData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data.comprehension) return null;

  const { score, total, points } = data.comprehension;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <CircularGauge label={`Compreensão (${score}/${total})`} value={percentage} size={120} />
      </div>

      <div>
        <SectionHeader isDark={isDark}>Pontos-Chave</SectionHeader>
        <div className="space-y-2">
          {points.map((point, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                point.matched
                  ? isDark
                    ? "bg-emerald-500/[0.04] border-emerald-500/10"
                    : "bg-emerald-50/50 border-emerald-100/60"
                  : isDark
                    ? "bg-red-500/[0.04] border-red-500/10"
                    : "bg-red-50/30 border-red-100/60"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  point.matched
                    ? isDark
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-emerald-100 text-emerald-600"
                    : isDark
                      ? "bg-red-500/20 text-red-400"
                      : "bg-red-100 text-red-600"
                }`}
              >
                <span className="text-[10px] font-bold">
                  {point.matched ? "✓" : "✗"}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? "text-white/75" : "text-black/70"}`}>
                {point.keyPoint}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Tabs Component ---

export default function FeedbackTabs({ data }: { data: FeedbackData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const hasComprehension = !!data.comprehension;
  const hasPronunciation =
    data.pronunciation !== null || data.fluency !== null || (data.wordScores && data.wordScores.length > 0);

  type TabId = "text" | "pronunciation" | "comprehension";
  const [activeTab, setActiveTab] = useState<TabId>("text");

  const tabs: { id: TabId; label: string; show: boolean }[] = [
    { id: "text", label: "Estrutura e Vocabulário", show: true },
    { id: "pronunciation", label: "Pronúncia e Fluência", show: !!hasPronunciation },
    { id: "comprehension", label: "Compreensão", show: hasComprehension },
  ];

  const visibleTabs = tabs.filter((t) => t.show);

  return (
    <div>
      {/* Tab headers */}
      {visibleTabs.length > 1 && (
        <div className={`flex gap-1 mb-5 p-1 rounded-2xl ${isDark ? "bg-white/[0.04]" : "bg-gray-100/80"}`}>
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 text-xs font-semibold rounded-xl ${
                activeTab === tab.id
                  ? isDark
                    ? "bg-white/[0.08] text-white"
                    : "bg-white text-black shadow-sm"
                  : isDark
                    ? "text-white/35 hover:text-white/50"
                    : "text-black/35 hover:text-black/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {activeTab === "text" && <TextCorrectionsTab data={data} />}
      {activeTab === "pronunciation" && <PronunciationFluencyTab data={data} />}
      {activeTab === "comprehension" && <ComprehensionTab data={data} />}
    </div>
  );
}
