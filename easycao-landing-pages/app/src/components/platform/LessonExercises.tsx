"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import AudioRecorder from "./AudioRecorder";

interface Exercise {
  id: string;
  type: "speaking" | "listening" | "writing";
  prompt: string;
  referenceAnswer?: string;
  videoUrl?: string;
  imageUrl?: string;
  order: number;
}

interface ExerciseFeedback {
  transcription: string;
  errors: { word: string; category: string; correction: string; explanation: string }[];
  correctedText: string;
}

interface LessonExercisesProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
  uid: string;
  onAllComplete: () => void;
  disabled?: boolean;
}

export default function LessonExercises({
  courseId,
  moduleId,
  lessonId,
  uid,
  onAllComplete,
  disabled,
}: LessonExercisesProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [feedbacks, setFeedbacks] = useState<Record<string, ExerciseFeedback>>({});
  const [loading, setLoading] = useState(true);
  const [processingExercise, setProcessingExercise] = useState<string | null>(null);

  // Load exercises
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/cms/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/exercises`
        );
        if (res.ok) {
          const data = await res.json();
          setExercises(data.exercises || []);
        }
      } catch {
        // silently fail
      }
      setLoading(false);
    })();
  }, [courseId, moduleId, lessonId]);

  // Check completion
  useEffect(() => {
    if (exercises.length > 0 && completedExercises.size >= exercises.length) {
      onAllComplete();
    }
  }, [completedExercises, exercises.length, onAllComplete]);

  const handleRecordingComplete = useCallback(
    async (exerciseId: string, recordingUrl: string) => {
      setProcessingExercise(exerciseId);

      try {
        // Send to feedback pipeline
        const res = await fetch("/api/feedback/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioUrl: recordingUrl,
            taskType: "lesson_exercise",
          }),
        });

        if (res.ok) {
          const feedback = await res.json();
          setFeedbacks((prev) => ({ ...prev, [exerciseId]: feedback }));
        }
      } catch {
        // Continue even without feedback
      }

      setCompletedExercises((prev) => new Set(prev).add(exerciseId));
      setProcessingExercise(null);
    },
    []
  );

  const handleDeleteRecording = useCallback((exerciseId: string) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      next.delete(exerciseId);
      return next;
    });
    setFeedbacks((prev) => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
  }, []);

  if (disabled) {
    return (
      <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
        <p className={`text-sm ${textSecondary}`}>
          Complete as etapas anteriores para desbloquear os exercícios.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className={`p-4 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
        <p className={`text-sm ${textSecondary}`}>
          Nenhum exercício disponível para esta aula.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className={`text-xs font-medium ${textSecondary}`}>
          {completedExercises.size}/{exercises.length} exercício{exercises.length !== 1 ? "s" : ""} concluído{completedExercises.size !== 1 ? "s" : ""}
        </p>
        <div className={`w-24 h-1.5 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(completedExercises.size / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Exercise list */}
      {exercises.map((exercise, idx) => {
        const isCompleted = completedExercises.has(exercise.id);
        const isProcessing = processingExercise === exercise.id;
        const feedback = feedbacks[exercise.id];

        return (
          <div
            key={exercise.id}
            className={`p-4 rounded-xl border ${
              isDark ? "border-white/[0.09] bg-white/[0.03]" : "border-gray-200 bg-white"
            }`}
          >
            {/* Exercise header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-500"
                    : isDark
                      ? "bg-white/10 text-white/50"
                      : "bg-gray-100 text-black/40"
                }`}
              >
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span className={`text-xs uppercase tracking-wider ${textSecondary}`}>
                {exercise.type === "speaking" ? "Fala" : exercise.type === "listening" ? "Escuta" : "Escrita"}
              </span>
            </div>

            {/* Prompt */}
            <p className={`text-sm ${textPrimary} mb-4 leading-relaxed`}>
              {exercise.prompt}
            </p>

            {/* Media */}
            {exercise.imageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={exercise.imageUrl}
                alt="Exercise"
                className="w-full rounded-lg mb-4 max-h-[200px] object-contain"
              />
            )}

            {/* Recorder / Feedback */}
            {!isCompleted && !isProcessing && (
              <AudioRecorder
                uid={uid}
                context={`lesson/${courseId}/${lessonId}/exercise/${exercise.id}`}
                onRecordingComplete={(url) => handleRecordingComplete(exercise.id, url)}
                onRecordingDelete={() => handleDeleteRecording(exercise.id)}
              />
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 py-3">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className={`text-xs ${textSecondary}`}>Analisando resposta...</span>
              </div>
            )}

            {isCompleted && feedback && (
              <div className={`mt-3 p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                <p className={`text-xs ${textSecondary} mb-1`}>Transcrição:</p>
                <p className={`text-sm ${textPrimary} mb-2`}>{feedback.transcription}</p>
                {feedback.errors.length > 0 && (
                  <p className="text-xs text-amber-500">
                    {feedback.errors.length} erro{feedback.errors.length !== 1 ? "s" : ""} encontrado{feedback.errors.length !== 1 ? "s" : ""}
                  </p>
                )}
                {feedback.correctedText && (
                  <p className={`text-xs ${isDark ? "text-emerald-400" : "text-emerald-600"} mt-1`}>
                    Correção: {feedback.correctedText}
                  </p>
                )}
                <button
                  onClick={() => handleDeleteRecording(exercise.id)}
                  className="mt-2 text-xs text-red-500 hover:text-red-400"
                >
                  Regravar
                </button>
              </div>
            )}

            {isCompleted && !feedback && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-xs text-emerald-500">Concluído</span>
                <button
                  onClick={() => handleDeleteRecording(exercise.id)}
                  className="ml-auto text-xs text-red-500 hover:text-red-400"
                >
                  Regravar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
