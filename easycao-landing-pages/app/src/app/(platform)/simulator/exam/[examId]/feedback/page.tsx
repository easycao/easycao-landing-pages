"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import FeedbackTabs, {
  type FeedbackData,
  CircularGauge,
  scoreColor,
  DESCRIPTOR_LABELS,
} from "@/components/platform/FeedbackTabs";

type Phase = "downloading" | "transcribing" | "pronunciation" | "grammar" | null;

interface TaskFeedback {
  taskIndex: number;
  status: "processing" | "complete" | "error";
  phase?: Phase;
  feedback?: FeedbackData;
  error?: string;
}

const PHASE_LABELS: Record<string, string> = {
  downloading: "Preparando sua gravação...",
  transcribing: "Ouvindo sua resposta...",
  pronunciation: "Analisando sua pronúncia...",
  grammar: "Analisando gramática e vocabulário...",
};

const PHASE_PROGRESS: Record<string, number> = {
  downloading: 10,
  transcribing: 35,
  pronunciation: 60,
  grammar: 80,
};

// --- Exam Dashboard Types ---

interface ExamDashboard {
  avgPronunciation: number | null;
  avgFluency: number | null;
  errorsByDescriptor: { descriptor: string; count: number }[];
  topSubcategories: { name: string; count: number }[];
  comprehension: { score: number; total: number } | null;
  insight: string;
}

// --- Aggregate Exam Stats ---

function computeDashboard(feedbacks: FeedbackData[]): ExamDashboard {
  const pronunciations: number[] = [];
  const fluencies: number[] = [];
  const descriptorCounts: Record<string, number> = {};
  const subCategoryCounts: Record<string, number> = {};
  let compScore = 0;
  let compTotal = 0;

  for (const fb of feedbacks) {
    if (fb.pronunciation !== null) pronunciations.push(fb.pronunciation);
    if (fb.fluency !== null) fluencies.push(fb.fluency);

    for (const err of fb.errors || []) {
      const desc = err.category || "vocabulary";
      descriptorCounts[desc] = (descriptorCounts[desc] || 0) + 1;
      if (err.subCategory) {
        subCategoryCounts[err.subCategory] = (subCategoryCounts[err.subCategory] || 0) + 1;
      }
    }

    if (fb.comprehension) {
      compScore += fb.comprehension.score;
      compTotal += fb.comprehension.total;
    }
  }

  const avgPronunciation =
    pronunciations.length > 0
      ? Math.round(pronunciations.reduce((a, b) => a + b, 0) / pronunciations.length)
      : null;
  const avgFluency =
    fluencies.length > 0
      ? Math.round(fluencies.reduce((a, b) => a + b, 0) / fluencies.length)
      : null;

  const errorsByDescriptor = Object.entries(descriptorCounts)
    .map(([descriptor, count]) => ({ descriptor, count }))
    .sort((a, b) => b.count - a.count);

  const topSubcategories = Object.entries(subCategoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const comprehension = compTotal > 0 ? { score: compScore, total: compTotal } : null;

  const totalErrors = errorsByDescriptor.reduce((s, d) => s + d.count, 0);

  // Auto insight
  let insight = "";
  if (totalErrors === 0 && avgPronunciation !== null && avgPronunciation >= 80) {
    insight = "Excelente desempenho! Continue praticando para manter a consistência.";
  } else if (totalErrors > 0) {
    const topDesc = errorsByDescriptor[0];
    const descLabel = DESCRIPTOR_LABELS[topDesc.descriptor] || topDesc.descriptor;
    if (topSubcategories.length > 0) {
      insight = `Seu principal ponto de atenção é ${descLabel.toLowerCase()} — especialmente "${topSubcategories[0].name}" (${topSubcategories[0].count}x). Foque em revisar esse padrão.`;
    } else {
      insight = `Seu principal ponto de atenção é ${descLabel.toLowerCase()} com ${topDesc.count} erro${topDesc.count > 1 ? "s" : ""}. Revise as correções sugeridas.`;
    }
  } else if (avgPronunciation !== null && avgPronunciation < 70) {
    insight = "Sua pronúncia precisa de atenção. Pratique ouvindo e repetindo as palavras destacadas.";
  } else if (avgFluency !== null && avgFluency < 70) {
    insight = "Sua fluência pode melhorar. Tente falar com mais naturalidade, sem pausas longas.";
  } else if (comprehension && comprehension.total > 0) {
    const pct = Math.round((comprehension.score / comprehension.total) * 100);
    if (pct < 70) {
      insight = "A compreensão ficou abaixo do esperado. Revise os pontos-chave que não foram cobertos.";
    } else {
      insight = "Bom desempenho geral! Revise os detalhes nas tarefas individuais para evoluir ainda mais.";
    }
  } else {
    insight = "Revise as tarefas individuais para identificar seus pontos de melhoria.";
  }

  return { avgPronunciation, avgFluency, errorsByDescriptor, topSubcategories, comprehension, insight };
}

// --- Dashboard Section Component ---

function ExamDashboardSection({
  dashboard,
  isDark,
}: {
  dashboard: ExamDashboard;
  isDark: boolean;
}) {
  const compPct =
    dashboard.comprehension && dashboard.comprehension.total > 0
      ? Math.round((dashboard.comprehension.score / dashboard.comprehension.total) * 100)
      : null;

  return (
    <div
      className={`rounded-2xl border p-5 mb-6 ${
        isDark
          ? "border-white/[0.09] bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-[20px]"
          : "bg-white border-gray-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      }`}
    >
      <p
        className={`text-[13px] font-bold uppercase tracking-[0.08em] mb-5 ${
          isDark ? "text-white/40" : "text-black/40"
        }`}
      >
        Visão Geral do Exame
      </p>

      {/* Insight (top position) */}
      <div
        className={`p-4 rounded-xl border mb-5 ${
          isDark
            ? "bg-primary/[0.06] border-primary/10"
            : "bg-gradient-to-br from-blue-100/80 to-blue-50/70 border-blue-200/60"
        }`}
      >
        <div className="flex gap-3">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
              isDark ? "bg-primary/15" : "bg-primary/10"
            }`}
          >
            <svg
              className="w-3.5 h-3.5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
          </div>
          <p className={`text-[13px] leading-relaxed pt-0.5 ${isDark ? "text-white/75" : "text-black/70"}`}>
            {dashboard.insight}
          </p>
        </div>
      </div>

      {/* Error descriptors + top subcategories (primary metrics) */}
      {(dashboard.errorsByDescriptor.length > 0 || dashboard.topSubcategories.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Errors by descriptor */}
          {dashboard.errorsByDescriptor.length > 0 && (
            <div
              className={`rounded-xl p-4 border ${
                isDark ? "border-white/[0.06] bg-white/[0.03]" : "border-gray-border/30 bg-gray-50"
              }`}
            >
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.06em] mb-3 ${
                  isDark ? "text-white/35" : "text-black/35"
                }`}
              >
                Erros por Descritor
              </p>
              <div className="space-y-2">
                {dashboard.errorsByDescriptor.map((d) => {
                  const icon = d.descriptor === "structure" ? "E" : "V";
                  const label = DESCRIPTOR_LABELS[d.descriptor] || d.descriptor;
                  return (
                    <div key={d.descriptor} className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #0057B4, #1F96F7)" }}
                      >
                        {icon}
                      </div>
                      <span
                        className={`text-sm flex-1 ${isDark ? "text-white/75" : "text-black/70"}`}
                      >
                        {label}
                      </span>
                      <span
                        className={`text-sm font-bold ${isDark ? "text-white/90" : "text-black/80"}`}
                      >
                        {d.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top subcategories */}
          {dashboard.topSubcategories.length > 0 && (
            <div
              className={`rounded-xl p-4 border ${
                isDark ? "border-white/[0.06] bg-white/[0.03]" : "border-gray-border/30 bg-gray-50"
              }`}
            >
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.06em] mb-3 ${
                  isDark ? "text-white/35" : "text-black/35"
                }`}
              >
                Mais Comuns
              </p>
              <div className="space-y-2">
                {dashboard.topSubcategories.map((sc, i) => (
                  <div key={sc.name} className="flex items-center gap-2.5">
                    <span
                      className={`text-[11px] font-bold w-5 text-center flex-shrink-0 ${
                        isDark ? "text-white/30" : "text-black/30"
                      }`}
                    >
                      {i + 1}.
                    </span>
                    <span
                      className={`text-sm flex-1 truncate ${
                        isDark ? "text-white/75" : "text-black/70"
                      }`}
                    >
                      {sc.name}
                    </span>
                    <span
                      className={`text-xs font-bold ${isDark ? "text-white/50" : "text-black/45"}`}
                    >
                      {sc.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pronunciation, fluency, comprehension gauges (secondary metrics) */}
      {(dashboard.avgPronunciation !== null || dashboard.avgFluency !== null || compPct !== null) && (
        <div className="flex flex-wrap justify-center gap-5 mb-5">
          {dashboard.avgPronunciation !== null && (
            <CircularGauge label="Pronúncia" value={dashboard.avgPronunciation} size={76} />
          )}
          {dashboard.avgFluency !== null && (
            <CircularGauge label="Fluência" value={dashboard.avgFluency} size={76} />
          )}
          {compPct !== null && (
            <CircularGauge
              label={`Compreensão (${dashboard.comprehension!.score}/${dashboard.comprehension!.total})`}
              value={compPct}
              size={76}
            />
          )}
        </div>
      )}

      {/* No-data fallback */}
      {dashboard.avgPronunciation === null && dashboard.avgFluency === null && dashboard.errorsByDescriptor.length === 0 && (
        <p className={`text-sm ${isDark ? "text-white/40" : "text-black/40"}`}>
          Revise as tarefas individuais para identificar seus pontos de melhoria.
        </p>
      )}
    </div>
  );
}

// --- Task Badges Component ---

function TaskBadges({ feedback, isDark }: { feedback: FeedbackData; isDark: boolean }) {
  const errors = (feedback.errors || []).filter((e) => e.word);
  const errorCount = errors.length;

  function badgeBg(color: string) {
    if (color === "text-emerald-500")
      return isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-700";
    if (color === "text-amber-500")
      return isDark ? "bg-amber-500/15 text-amber-400" : "bg-amber-50 text-amber-700";
    return isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-700";
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* Errors badge */}
      {errorCount === 0 ? (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isDark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          ✓
        </span>
      ) : (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-700"
          }`}
        >
          {errorCount} erro{errorCount > 1 ? "s" : ""}
        </span>
      )}

      {/* Pronunciation */}
      {feedback.pronunciation !== null && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg(
            scoreColor(feedback.pronunciation)
          )}`}
        >
          P {Math.round(feedback.pronunciation)}
        </span>
      )}

      {/* Fluency */}
      {feedback.fluency !== null && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg(
            scoreColor(feedback.fluency)
          )}`}
        >
          F {Math.round(feedback.fluency)}
        </span>
      )}

      {/* Comprehension */}
      {feedback.comprehension && (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg(
            scoreColor(
              feedback.comprehension.total > 0
                ? Math.round((feedback.comprehension.score / feedback.comprehension.total) * 100)
                : 0
            )
          )}`}
        >
          C {feedback.comprehension.score}/{feedback.comprehension.total}
        </span>
      )}
    </div>
  );
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
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const sseStarted = useRef(false);
  const prevCompletedRef = useRef<Set<number>>(new Set());

  // Start SSE feedback processing
  useEffect(() => {
    if (!examId || !user || sseStarted.current) return;
    sseStarted.current = true;

    (async () => {
      // Check URL for ?force to skip cache
      const urlParams = new URLSearchParams(window.location.search);
      const forceReprocess = urlParams.has("force");

      // First check if feedback already exists (skip if force)
      if (!forceReprocess) {
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
            // All collapsed when loaded from cache
            return;
          }
        }
      }

      // Start SSE processing
      setIsProcessing(true);
      try {
        const res = await fetch(`/api/simulator/exam/${examId}/feedback`, {
          method: "POST",
        });

        if (!res.ok || !res.body) {
          console.error(`POST feedback failed: ${res.status} ${res.statusText}`);
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
              if (data.status === "init") {
                setTotalTasks(data.totalTasks);
                continue;
              }
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
                  phase: data.phase || null,
                  feedback: data.feedback,
                  error: data.error,
                });
                return next;
              });
            } catch {
              // Skip malformed events
            }
          }
        }
      } catch (err) {
        console.error("SSE error:", err);
        setIsProcessing(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, user]);

  // Auto-expand tasks as they complete during streaming
  useEffect(() => {
    if (isDone) {
      // When done, collapse all so user sees dashboard first
      setExpandedTasks(new Set());
      return;
    }

    // During streaming: auto-expand newly completed tasks
    const newCompleted = new Set<number>();
    for (const [idx, tf] of taskFeedbacks) {
      if (tf.status === "complete") newCompleted.add(idx);
    }

    const toExpand: number[] = [];
    for (const idx of newCompleted) {
      if (!prevCompletedRef.current.has(idx)) {
        toExpand.push(idx);
      }
    }
    prevCompletedRef.current = newCompleted;

    if (toExpand.length > 0) {
      setExpandedTasks((prev) => {
        const next = new Set(prev);
        for (const idx of toExpand) next.add(idx);
        return next;
      });
    }
  }, [taskFeedbacks, isDone]);

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

  // Toggle task expansion
  const toggleTask = useCallback((taskIndex: number) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskIndex)) next.delete(taskIndex);
      else next.add(taskIndex);
      return next;
    });
  }, []);

  // Expand/collapse all
  const expandAll = useCallback(() => {
    const all = new Set<number>();
    for (const tf of taskFeedbacks.values()) {
      if (tf.status === "complete") all.add(tf.taskIndex);
    }
    setExpandedTasks(all);
  }, [taskFeedbacks]);

  const collapseAll = useCallback(() => {
    setExpandedTasks(new Set());
  }, []);

  // Dashboard data (only when done)
  const dashboard = useMemo(() => {
    if (!isDone) return null;
    const completeFeedbacks: FeedbackData[] = [];
    for (const tf of taskFeedbacks.values()) {
      if (tf.status === "complete" && tf.feedback) {
        completeFeedbacks.push(tf.feedback);
      }
    }
    if (completeFeedbacks.length === 0) return null;
    return computeDashboard(completeFeedbacks);
  }, [isDone, taskFeedbacks]);

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

  // Build full task list: show all tasks from 0..totalTasks-1
  const sortedFeedbacks: TaskFeedback[] = useMemo(() => {
    if (totalTasks === 0) return [...taskFeedbacks.values()].sort((a, b) => a.taskIndex - b.taskIndex);
    const list: TaskFeedback[] = [];
    for (let i = 0; i < totalTasks; i++) {
      const existing = taskFeedbacks.get(i);
      list.push(existing || { taskIndex: i, status: "processing" as const, phase: null });
    }
    return list;
  }, [taskFeedbacks, totalTasks]);

  const allExpanded = completedCount > 0 && expandedTasks.size >= completedCount;

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
        {(() => {
          // Determine the current active phase from any processing task
          const activeTask = [...taskFeedbacks.values()].find(
            (f) => f.status === "processing"
          );
          const currentPhase = activeTask?.phase;
          const phaseLabel = currentPhase ? PHASE_LABELS[currentPhase] : null;

          // Calculate overall progress
          let progressPercent = 0;
          if (isDone) {
            progressPercent = 100;
          } else if (totalTasks > 0) {
            const completedPart = (completedCount / totalTasks) * 100;
            const processingPart = currentPhase
              ? ((PHASE_PROGRESS[currentPhase] || 0) / 100) * (100 / totalTasks)
              : 0;
            progressPercent = Math.min(completedPart + processingPart, 99);
          } else if (isProcessing) {
            progressPercent = currentPhase ? PHASE_PROGRESS[currentPhase] || 10 : 10;
          }

          return (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {!isDone && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  )}
                  {isDone && (
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  <div>
                    <p className={`text-sm font-medium ${textPrimary}`}>
                      {isDone
                        ? "Análise concluída!"
                        : phaseLabel || "Preparando análise..."}
                    </p>
                    {!isDone && totalTasks > 0 && (
                      <p className={`text-xs mt-0.5 ${textSecondary}`}>
                        {completedCount}/{totalTasks} tarefa{totalTasks !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
                {errorCount > 0 && (
                  <span className="text-xs text-red-500 font-medium">
                    {errorCount} erro{errorCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div
                className={`w-full h-2 rounded-full overflow-hidden ${
                  isDark ? "bg-white/10" : "bg-gray-200"
                }`}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out bg-gradient-to-r from-primary to-primary-light"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </>
          );
        })()}
      </div>

      {/* Exam Dashboard (only when done) */}
      {isDone && dashboard && <ExamDashboardSection dashboard={dashboard} isDark={isDark} />}

      {/* Expand/Collapse All button */}
      {isDone && completedCount > 1 && (
        <div className="flex justify-end mb-3">
          <button
            onClick={allExpanded ? collapseAll : expandAll}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              isDark
                ? "text-white/50 hover:text-white/70 hover:bg-white/[0.06]"
                : "text-black/45 hover:text-black/65 hover:bg-gray-100"
            }`}
          >
            {allExpanded ? "Recolher todas" : "Expandir todas"}
          </button>
        </div>
      )}

      {/* Feedback Cards */}
      <div className="space-y-4">
        {sortedFeedbacks.map((tf) => {
          const isExpanded = expandedTasks.has(tf.taskIndex);
          const isComplete = tf.status === "complete";

          return (
            <div key={tf.taskIndex} className={cardClass} style={cardBg}>
              {/* Clickable header */}
              <button
                onClick={() => isComplete && toggleTask(tf.taskIndex)}
                className={`w-full flex items-center justify-between p-5 text-left ${
                  isComplete ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-3 flex-wrap min-w-0">
                  <span className={`text-lg font-bold flex-shrink-0 ${isDark ? "text-[#F0F0F5]" : "text-black"}`}>
                    Tarefa {tf.taskIndex + 1}
                  </span>

                  {/* Badges (only for complete tasks) */}
                  {isComplete && tf.feedback && (
                    <TaskBadges feedback={tf.feedback} isDark={isDark} />
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {tf.status === "processing" && tf.phase && (
                    <>
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className={`text-xs ${textSecondary}`}>
                        {PHASE_LABELS[tf.phase] || "Processando..."}
                      </span>
                    </>
                  )}
                  {tf.status === "processing" && !tf.phase && (
                    <span className={`text-xs ${textSecondary}`}>
                      Aguardando...
                    </span>
                  )}
                  {tf.status === "error" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        retryTask(tf.taskIndex);
                      }}
                      className="text-xs text-red-500 hover:text-red-400 font-medium"
                    >
                      Tentar novamente
                    </button>
                  )}
                  {isComplete && (
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      } ${isDark ? "text-white/30" : "text-black/30"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Expandable content */}
              {isExpanded && isComplete && tf.feedback && (
                <div className="px-5 pb-5">
                  <FeedbackTabs data={tf.feedback} />
                </div>
              )}

              {tf.status === "error" && (
                <div className="px-5 pb-5">
                  <p className="text-xs text-red-500/70">{tf.error}</p>
                </div>
              )}
            </div>
          );
        })}
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
