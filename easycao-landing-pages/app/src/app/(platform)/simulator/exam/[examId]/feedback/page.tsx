"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import FeedbackTabs, { type FeedbackData } from "@/components/platform/FeedbackTabs";

interface TaskFeedback {
  taskIndex: number;
  status: "processing" | "complete" | "error";
  feedback?: {
    transcription: string;
    pronunciation: number | null;
    fluency: number | null;
    errors: { word: string; category: string; correction: string; explanation: string }[];
    correctedText: string;
  };
  error?: string;
}

export default function FeedbackPage() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [taskFeedbacks, setTaskFeedbacks] = useState<Map<number, TaskFeedback>>(new Map());
  const [totalTasks, setTotalTasks] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const sseStarted = useRef(false);

  // Start SSE feedback processing
  useEffect(() => {
    if (!examId || !user || sseStarted.current) return;
    sseStarted.current = true;

    (async () => {
      // First check if feedback already exists
      const existingRes = await fetch(`/api/simulator/exam/${examId}/feedback`);
      if (existingRes.ok) {
        const existing = await existingRes.json();
        if (existing.feedbacks && existing.feedbacks.length > 0) {
          const map = new Map<number, TaskFeedback>();
          for (const f of existing.feedbacks) {
            map.set(f.taskIndex, {
              taskIndex: f.taskIndex,
              status: "complete",
              feedback: f,
            });
          }
          setTaskFeedbacks(map);
          setTotalTasks(existing.feedbacks.length);
          setIsDone(true);
          return;
        }
      }

      // Start SSE processing
      setIsProcessing(true);
      try {
        const res = await fetch(`/api/simulator/exam/${examId}/feedback`, {
          method: "POST",
        });

        if (!res.ok || !res.body) {
          setIsProcessing(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const match = line.match(/^data: (.+)$/m);
            if (!match) continue;
            try {
              const data = JSON.parse(match[1]);

              if (data.status === "done") {
                setTotalTasks(data.total);
                setIsDone(true);
                setIsProcessing(false);
                continue;
              }

              setTaskFeedbacks((prev) => {
                const next = new Map(prev);
                next.set(data.taskIndex, {
                  taskIndex: data.taskIndex,
                  status: data.status,
                  feedback: data.feedback,
                  error: data.error,
                });
                // Update total as we discover tasks
                if (next.size > totalTasks) setTotalTasks(next.size);
                return next;
              });
            } catch {
              // Skip malformed events
            }
          }
        }
      } catch {
        setIsProcessing(false);
      }
    })();
  }, [examId, user, totalTasks]);

  // Retry individual task
  const retryTask = useCallback(
    async (taskIndex: number) => {
      if (!examId) return;
      setTaskFeedbacks((prev) => {
        const next = new Map(prev);
        next.set(taskIndex, { taskIndex, status: "processing" });
        return next;
      });

      try {
        const res = await fetch(
          `/api/simulator/exam/${examId}/feedback?taskIndex=${taskIndex}&retry=true`,
          { method: "POST" }
        );
        if (res.ok) {
          // Refetch from stored feedback
          const fbRes = await fetch(
            `/api/simulator/exam/${examId}/feedback?taskIndex=${taskIndex}`
          );
          if (fbRes.ok) {
            const fb = await fbRes.json();
            setTaskFeedbacks((prev) => {
              const next = new Map(prev);
              next.set(taskIndex, {
                taskIndex,
                status: "complete",
                feedback: fb,
              });
              return next;
            });
            return;
          }
        }
      } catch {
        // Fall through to error
      }

      setTaskFeedbacks((prev) => {
        const next = new Map(prev);
        next.set(taskIndex, {
          taskIndex,
          status: "error",
          error: "Retry failed",
        });
        return next;
      });
    },
    [examId]
  );

  // --- UI ---

  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";
  const cardClass = isDark
    ? "rounded-2xl border border-white/[0.09] backdrop-blur-[20px]"
    : "rounded-2xl bg-white border border-gray-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.06)]";
  const cardBg = isDark
    ? {
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
      }
    : undefined;

  const completedCount = [...taskFeedbacks.values()].filter(
    (f) => f.status === "complete"
  ).length;
  const errorCount = [...taskFeedbacks.values()].filter(
    (f) => f.status === "error"
  ).length;
  const processingCount = [...taskFeedbacks.values()].filter(
    (f) => f.status === "processing"
  ).length;

  const sortedFeedbacks = [...taskFeedbacks.values()].sort(
    (a, b) => a.taskIndex - b.taskIndex
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/simulator")}
          className={`text-xs font-medium ${textSecondary} hover:opacity-70 transition-colors`}
        >
          &larr; Voltar ao Simulador
        </button>
      </div>

      <h2
        className={`text-sm font-bold uppercase tracking-[0.08em] mb-2 ${
          isDark ? "text-white/50" : "text-black/70"
        }`}
      >
        Feedback do Exame
      </h2>

      {/* Progress */}
      <div className={`${cardClass} p-5 mb-6`} style={cardBg}>
        <div className="flex items-center justify-between mb-3">
          <p className={`text-sm font-medium ${textPrimary}`}>
            {isDone
              ? `${completedCount} tarefa${completedCount !== 1 ? "s" : ""} processada${completedCount !== 1 ? "s" : ""}`
              : isProcessing
                ? `Processando ${completedCount}/${totalTasks || "..."}...`
                : "Preparando análise..."}
          </p>
          {errorCount > 0 && (
            <span className="text-xs text-red-500 font-medium">
              {errorCount} erro{errorCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {(totalTasks > 0 || processingCount > 0) && (
          <div
            className={`w-full h-2 rounded-full ${
              isDark ? "bg-white/10" : "bg-gray-200"
            }`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
              style={{
                width: `${
                  totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0
                }%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Feedback Cards */}
      <div className="space-y-4">
        {sortedFeedbacks.map((tf) => (
          <div key={tf.taskIndex} className={`${cardClass} p-5`} style={cardBg}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold ${textSecondary}`}>
                Tarefa {tf.taskIndex + 1}
              </span>
              {tf.status === "processing" && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className={`text-xs ${textSecondary}`}>
                    Processando...
                  </span>
                </div>
              )}
              {tf.status === "complete" && (
                <svg
                  className="w-4 h-4 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
              {tf.status === "error" && (
                <button
                  onClick={() => retryTask(tf.taskIndex)}
                  className="text-xs text-red-500 hover:text-red-400 font-medium"
                >
                  Tentar novamente
                </button>
              )}
            </div>

            {tf.status === "complete" && tf.feedback && (
              <FeedbackTabs data={tf.feedback as FeedbackData} />
            )}

            {tf.status === "error" && (
              <p className="text-xs text-red-500/70">{tf.error}</p>
            )}
          </div>
        ))}
      </div>

      {/* Done — return to simulator */}
      {isDone && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push("/simulator")}
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Voltar ao Simulador
          </button>
        </div>
      )}
    </div>
  );
}
