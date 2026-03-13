"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import AudioRecorder from "@/components/platform/AudioRecorder";
import FeedbackTabs from "@/components/platform/FeedbackTabs";
import type { FeedbackData } from "@/components/platform/FeedbackTabs";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ExerciseItem {
  id: string;
  prompt: string;
  mediaType: "video" | "audio" | "image";
  mediaUrl: string;
  completed: boolean;
}

const PART_LABELS: Record<string, string> = {
  P1: "Part 1 — Interaction",
  P2: "Part 2 — Situation & Comprehension",
  P3: "Part 3 — Reported Speech",
  P4: "Part 4 — Extended Description",
};

const PART_COLORS: Record<string, string> = {
  P1: "from-blue-500 to-blue-600",
  P2: "from-emerald-500 to-emerald-600",
  P3: "from-purple-500 to-purple-600",
  P4: "from-amber-500 to-amber-600",
};

export default function PartExercisesPage() {
  const { partId } = useParams<{ partId: string }>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [exerciseDetail, setExerciseDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  // Fetch exercises for this part
  useEffect(() => {
    if (!partId) return;
    (async () => {
      try {
        const res = await fetch(`/api/exercises/bank?part=${partId}`);
        if (res.ok) {
          const data = await res.json();
          setExercises(data.exercises || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [partId]);

  // Fetch individual exercise detail
  const openExercise = useCallback(async (exerciseId: string) => {
    setSelectedExercise(exerciseId);
    setFeedback(null);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/exercises/bank/${exerciseId}`);
      if (res.ok) {
        const data = await res.json();
        setExerciseDetail(data);
        // If there's existing feedback, show it
        if (data.progress?.feedback) {
          setFeedback(data.progress.feedback);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // Handle recording complete
  const handleRecordingComplete = useCallback(
    async (recordingUrl: string) => {
      if (!selectedExercise) return;
      setSubmitting(true);
      try {
        const res = await fetch(`/api/exercises/bank/${selectedExercise}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recordingUrl,
            taskType: partId === "P1" ? "speaking" : "comprehension",
            getFeedback: true,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.feedback) {
            setFeedback(data.feedback);
          }
          // Mark as completed in the list
          setExercises((prev) =>
            prev.map((ex) =>
              ex.id === selectedExercise ? { ...ex, completed: true } : ex
            )
          );
        }
      } catch {
        // ignore
      } finally {
        setSubmitting(false);
      }
    },
    [selectedExercise, partId]
  );

  const handleRecordingDelete = useCallback(() => {
    setFeedback(null);
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className={`text-sm ${textSecondary}`}>Carregando questões...</div>
      </div>
    );
  }

  const partLabel = PART_LABELS[partId] || partId;
  const partColor = PART_COLORS[partId] || "from-gray-500 to-gray-600";
  const completedCount = exercises.filter((e) => e.completed).length;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/exercises/bank"
          className={`text-xs font-medium ${textSecondary} hover:opacity-70 transition-colors`}
        >
          &larr; Banco de Questões
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className={`text-sm font-bold uppercase tracking-[0.08em] mb-1 ${
              isDark ? "text-white/50" : "text-black/70"
            }`}
          >
            {partLabel}
          </h2>
          <p className={`text-xs ${textSecondary}`}>
            {completedCount} de {exercises.length} concluídas
          </p>
        </div>
        <div
          className={`h-2 w-24 rounded-full ${
            isDark ? "bg-white/10" : "bg-gray-200"
          } overflow-hidden`}
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r ${partColor} transition-all duration-500`}
            style={{
              width: exercises.length
                ? `${(completedCount / exercises.length) * 100}%`
                : "0%",
            }}
          />
        </div>
      </div>

      {/* Exercise list */}
      <div className="space-y-2">
        {exercises.map((exercise, index) => (
          <button
            key={exercise.id}
            onClick={() => openExercise(exercise.id)}
            className={`w-full ${cardClass} p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
              selectedExercise === exercise.id
                ? isDark
                  ? "ring-1 ring-primary/40"
                  : "ring-1 ring-primary/30"
                : ""
            }`}
            style={cardBg}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    exercise.completed
                      ? "bg-emerald-500/20 text-emerald-500"
                      : isDark
                        ? "bg-white/[0.06] text-white/40"
                        : "bg-gray-100 text-black/30"
                  }`}
                >
                  {exercise.completed ? (
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
                    Questão {index + 1}
                  </span>
                  <span className={`text-xs ${textSecondary} ml-2`}>
                    {exercise.prompt}
                  </span>
                </div>
              </div>
              <svg
                className={`w-4 h-4 ${textSecondary}`}
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
            </div>
          </button>
        ))}
      </div>

      {exercises.length === 0 && (
        <div className={`text-center py-16 ${textSecondary} text-sm`}>
          Nenhuma questão encontrada para esta parte.
        </div>
      )}

      {/* Exercise detail modal */}
      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedExercise(null);
            setExerciseDetail(null);
            setFeedback(null);
          }}
        >
          <div
            className={`w-full max-w-lg max-h-[85vh] overflow-y-auto ${
              isDark ? "bg-[#1a1a2e]" : "bg-white"
            } rounded-2xl shadow-2xl p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            {loadingDetail ? (
              <div className={`text-center py-8 ${textSecondary} text-sm`}>
                Carregando...
              </div>
            ) : exerciseDetail ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${textPrimary}`}>
                    Questão
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedExercise(null);
                      setExerciseDetail(null);
                      setFeedback(null);
                    }}
                    className={`text-sm ${textSecondary} hover:opacity-70`}
                  >
                    Fechar
                  </button>
                </div>

                {/* Media display */}
                {exerciseDetail.question?.Part1_Pergunta && (
                  <div className={`${cardClass} overflow-hidden`} style={cardBg}>
                    <div className="p-1">
                      <video
                        src={exerciseDetail.question.Part1_Pergunta}
                        controls
                        className="w-full rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {exerciseDetail.question?.Part2_Audio_Track1 && (
                  <div className={`${cardClass} p-4`} style={cardBg}>
                    <audio
                      src={exerciseDetail.question.Part2_Audio_Track1}
                      controls
                      className="w-full"
                    />
                  </div>
                )}

                {exerciseDetail.question?.Part4_Image && (
                  <div className={`${cardClass} overflow-hidden`} style={cardBg}>
                    <div className="p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={exerciseDetail.question.Part4_Image}
                        alt="Exercício"
                        className="w-full rounded-xl object-contain max-h-[250px]"
                      />
                    </div>
                  </div>
                )}

                {/* Audio recorder */}
                <div className={`${cardClass} p-5`} style={cardBg}>
                  <p
                    className={`text-xs font-medium ${textSecondary} mb-3 uppercase tracking-wider`}
                  >
                    Sua resposta
                  </p>
                  <AudioRecorder
                    uid={user?.uid || ""}
                    context={`exercises/bank/${selectedExercise}`}
                    onRecordingComplete={handleRecordingComplete}
                    onRecordingDelete={handleRecordingDelete}
                    disabled={submitting}
                  />
                  {submitting && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className={`text-xs ${textSecondary}`}>
                        Analisando...
                      </span>
                    </div>
                  )}
                </div>

                {/* Feedback */}
                {feedback && (
                  <div>
                    <p
                      className={`text-xs font-medium ${textSecondary} mb-3 uppercase tracking-wider`}
                    >
                      Feedback
                    </p>
                    <FeedbackTabs data={feedback} />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
