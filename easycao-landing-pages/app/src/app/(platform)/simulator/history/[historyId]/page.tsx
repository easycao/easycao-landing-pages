"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import FeedbackTabs from "@/components/platform/FeedbackTabs";
import type { FeedbackData } from "@/components/platform/FeedbackTabs";

/* eslint-disable @typescript-eslint/no-explicit-any */

const TASK_LABELS: Record<string, string> = {
  P1: "Pergunta",
  P2_T1: "Cotejamento",
  P2_T2: "ABC",
  P2_T3: "Afirmação/Negação",
  P2_T4: "Reported Speech",
  P3_RS: "Reported Speech",
  P3_Q: "Pergunta",
  P3_CMP: "Comparação",
  P4: "Tarefa",
};

export default function HistoryDetailPage() {
  const { historyId } = useParams<{ historyId: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

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
    if (!historyId) return;
    (async () => {
      try {
        const res = await fetch(
          `/api/simulator/exam/${historyId}/feedback`
        );
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data.feedbacks || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [historyId]);

  function getScoreColor(score: number | null): string {
    if (score == null) return textSecondary;
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className={`text-sm ${textSecondary}`}>
          Carregando feedback...
        </div>
      </div>
    );
  }

  // Calculate summary
  let avgPronunciation = 0;
  let avgFluency = 0;
  let totalErrors = 0;
  let scoreCount = 0;

  feedbacks.forEach((fb) => {
    if (fb.pronunciation != null) {
      avgPronunciation += fb.pronunciation;
      scoreCount++;
    }
    if (fb.fluency != null) {
      avgFluency += fb.fluency;
    }
    if (Array.isArray(fb.errors)) {
      totalErrors += fb.errors.length;
    }
  });

  if (scoreCount > 0) {
    avgPronunciation = Math.round(avgPronunciation / scoreCount);
    avgFluency = Math.round(avgFluency / scoreCount);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/simulator/history"
          className={`text-xs font-medium ${textSecondary} hover:opacity-70 transition-colors`}
        >
          &larr; Histórico
        </Link>
      </div>

      <h2
        className={`text-sm font-bold uppercase tracking-[0.08em] mb-6 ${
          isDark ? "text-white/50" : "text-black/70"
        }`}
      >
        Detalhes da Simulação
      </h2>

      {/* Summary card */}
      <div className={`${cardClass} p-5 mb-6`} style={cardBg}>
        <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>Resumo</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <span
              className={`text-[10px] ${textSecondary} uppercase tracking-wider block mb-1`}
            >
              Pronúncia
            </span>
            <p className={`text-2xl font-bold ${getScoreColor(avgPronunciation)}`}>
              {scoreCount > 0 ? avgPronunciation : "—"}
            </p>
          </div>
          <div className="text-center">
            <span
              className={`text-[10px] ${textSecondary} uppercase tracking-wider block mb-1`}
            >
              Fluência
            </span>
            <p className={`text-2xl font-bold ${getScoreColor(avgFluency)}`}>
              {scoreCount > 0 ? avgFluency : "—"}
            </p>
          </div>
          <div className="text-center">
            <span
              className={`text-[10px] ${textSecondary} uppercase tracking-wider block mb-1`}
            >
              Erros
            </span>
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {totalErrors}
            </p>
          </div>
        </div>
      </div>

      {/* Task feedbacks */}
      {feedbacks.length === 0 ? (
        <div className={`text-center py-16 ${textSecondary} text-sm`}>
          Nenhum feedback disponível para esta simulação.
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((fb, index) => {
            const isExpanded = expandedTask === index;
            const taskLabel =
              TASK_LABELS[fb.taskType] || `Tarefa ${fb.taskIndex + 1}`;

            const feedbackData: FeedbackData = {
              transcription: fb.transcription || "",
              pronunciation: fb.pronunciation ?? null,
              fluency: fb.fluency ?? null,
              errors: (fb.errors || []).map((e: any) => ({
                word: e.original || e.word || "",
                category: e.category || "",
                correction: e.correction || "",
                explanation: e.explanation || "",
              })),
              correctedText: fb.correctedText || "",
            };

            return (
              <div
                key={index}
                className={`${cardClass} overflow-hidden`}
                style={cardBg}
              >
                <button
                  onClick={() =>
                    setExpandedTask(isExpanded ? null : index)
                  }
                  className="w-full p-4 text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isDark
                          ? "bg-white/[0.06] text-white/40"
                          : "bg-gray-100 text-black/30"
                      }`}
                    >
                      {fb.taskIndex + 1}
                    </div>
                    <span
                      className={`text-sm font-medium ${textPrimary}`}
                    >
                      {taskLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {fb.pronunciation != null && (
                      <span
                        className={`text-xs font-bold ${getScoreColor(fb.pronunciation)}`}
                      >
                        {fb.pronunciation}
                      </span>
                    )}
                    <svg
                      className={`w-4 h-4 ${textSecondary} transition-transform ${
                        isExpanded ? "rotate-90" : ""
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
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4">
                    <FeedbackTabs data={feedbackData} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
