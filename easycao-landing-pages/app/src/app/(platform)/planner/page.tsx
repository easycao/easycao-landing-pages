"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCachedFetch } from "@/hooks/useCachedFetch";

interface PlanTask {
  type: string;
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
}

interface TodayData {
  hasPlan: boolean;
  planId?: string;
  planComplete?: boolean;
  today?: {
    dayNumber: number;
    totalDays: number;
    tasks: PlanTask[];
    status: string;
  };
}

interface PlanData {
  hasPlan: boolean;
  plan?: {
    id: string;
    goal: string;
    examDate: string | null;
    hoursPerDay: number;
    daysPerWeek: number;
    totalDays: number;
    currentDay: number;
    status: string;
    progress: {
      totalTasks: number;
      completedTasks: number;
      percent: number;
    };
  };
  upcomingDays?: {
    dayNumber: number;
    tasks: PlanTask[];
    status: string;
  }[];
}

const TYPE_ICONS: Record<string, string> = {
  lesson: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  playlist: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z",
  simulator: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z",
  sdea: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  full_simulator: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z",
};

const TYPE_LABELS: Record<string, string> = {
  lesson: "Aula",
  playlist: "Playlist",
  simulator: "Simulado",
  sdea: "SDEA",
  full_simulator: "Simulado Completo",
};

function getTaskLink(task: PlanTask): string {
  switch (task.type) {
    case "lesson": {
      // id format: courseId/moduleId/lessonId
      const parts = task.id.split("/");
      if (parts.length === 3) {
        return `/courses/${parts[0]}/${parts[1]}/${parts[2]}`;
      }
      return "/courses";
    }
    case "playlist":
      return "/exercises/playlists";
    case "simulator":
      return "/simulator";
    case "sdea":
      return "/simulator/sdea";
    case "full_simulator":
      return "/simulator";
    default:
      return "/dashboard";
  }
}

export default function PlannerPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [completing, setCompleting] = useState<string | null>(null);

  const {
    data: todayData,
    loading: todayLoading,
    refetch: refetchToday,
  } = useCachedFetch<TodayData>({
    key: `planner-today-${user?.uid}`,
    url: `/api/planner/today?uid=${user?.uid}`,
    enabled: !!user,
  });

  const {
    data: planData,
    loading: planLoading,
    refetch: refetchPlan,
  } = useCachedFetch<PlanData>({
    key: `planner-plan-${user?.uid}`,
    url: `/api/planner/plan?uid=${user?.uid}`,
    enabled: !!user,
  });

  const handleComplete = useCallback(
    async (taskId: string) => {
      if (!user || completing) return;
      setCompleting(taskId);
      try {
        await fetch("/api/planner/today", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, taskId }),
        });
        refetchToday();
        refetchPlan();
      } catch {
        // ignore
      } finally {
        setCompleting(null);
      }
    },
    [user, completing, refetchToday, refetchPlan]
  );

  const loading = todayLoading || planLoading;

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
  const textMuted = isDark ? "text-[#606070]" : "text-black/30";
  const progressBg = isDark ? "bg-white/[0.06]" : "bg-black/[0.04]";

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div
          className={`rounded-2xl h-[120px] animate-pulse ${
            isDark ? "bg-white/[0.04]" : "bg-black/[0.04]"
          }`}
        />
        <div
          className={`rounded-2xl h-[300px] animate-pulse ${
            isDark ? "bg-white/[0.04]" : "bg-black/[0.04]"
          }`}
        />
      </div>
    );
  }

  // No plan — show setup CTA
  if (!todayData?.hasPlan && !planData?.hasPlan) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className={`${cardClass} p-10 text-center`} style={cardBg}>
          <div
            className={`w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center ${
              isDark
                ? "bg-white/[0.06]"
                : "bg-gradient-to-br from-primary/10 to-primary/5"
            }`}
          >
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>
            Crie seu plano de estudos
          </h2>
          <p
            className={`text-sm ${textSecondary} mb-8 max-w-sm mx-auto leading-relaxed`}
          >
            Configure suas preferencias e receba um plano personalizado para
            maximizar seu aprendizado.
          </p>
          <Link
            href="/planner/setup"
            className="group/cta relative overflow-hidden inline-flex items-center gap-2 bg-primary hover:bg-[#1888e0] text-white font-bold text-sm rounded-full px-7 py-3 shadow-[0_2px_8px_rgba(31,150,247,0.3)] hover:shadow-[0_4px_16px_rgba(31,150,247,0.45)] active:scale-[0.97] transition-all duration-300"
          >
            <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(45deg,transparent_25%,rgba(52,184,248,0.45)_50%,transparent_75%)] bg-[length:250%_250%] bg-[position:200%_0] group-hover/cta:bg-[position:-100%_0] transition-[background-position] duration-[800ms] ease-out pointer-events-none" />
            <span className="relative">Configurar Plano</span>
          </Link>
        </div>
      </div>
    );
  }

  const plan = planData?.plan;
  const today = todayData?.today;
  const upcomingDays = (planData?.upcomingDays || []).filter(
    (d) => d.dayNumber !== today?.dayNumber
  ).slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Plan overview bar */}
      {plan && (
        <div className={`${cardClass} p-5`} style={cardBg}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`text-[10px] font-semibold ${textMuted} uppercase tracking-[0.15em]`}>
                Progresso do Plano
              </p>
              <p className={`text-sm font-bold ${textPrimary} mt-1`}>
                Dia {plan.currentDay} de {plan.totalDays}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-primary">
                {plan.progress.percent}%
              </span>
              <Link
                href="/planner/weekly-report"
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                  isDark
                    ? "bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                    : "bg-gray-100 text-black/50 hover:bg-gray-200"
                }`}
              >
                Relatorio
              </Link>
            </div>
          </div>
          <div className={`w-full h-2 ${progressBg} rounded-full overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-700"
              style={{ width: `${plan.progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Today's tasks */}
      {today && (
        <div>
          <h2
            className={`text-sm font-bold uppercase tracking-[0.08em] mb-4 ${
              isDark ? "text-white/50" : "text-black/70"
            }`}
          >
            Tarefas de Hoje &mdash; Dia {today.dayNumber}
          </h2>
          <div className="space-y-3">
            {today.tasks.map((task) => (
              <div
                key={task.id}
                className={`${cardClass} p-4 flex items-center gap-4 transition-all duration-200 ${
                  task.completed ? "opacity-60" : ""
                }`}
                style={cardBg}
              >
                {/* Checkbox */}
                <button
                  onClick={() => !task.completed && handleComplete(task.id)}
                  disabled={task.completed || completing === task.id}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? "border-green-500 bg-green-500"
                      : completing === task.id
                      ? "border-primary animate-pulse"
                      : isDark
                      ? "border-white/20 hover:border-primary"
                      : "border-black/20 hover:border-primary"
                  }`}
                >
                  {task.completed && (
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </button>

                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                    isDark ? "bg-white/[0.06]" : "bg-gray-100"
                  }`}
                >
                  <svg
                    className={`w-4.5 h-4.5 ${
                      isDark ? "text-white/50" : "text-black/40"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={TYPE_ICONS[task.type] || TYPE_ICONS.lesson}
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      task.completed
                        ? "line-through " + textMuted
                        : textPrimary
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs ${textSecondary}`}>
                      {TYPE_LABELS[task.type] || task.type}
                    </span>
                    <span className={`text-xs ${textMuted}`}>&middot;</span>
                    <span className={`text-xs ${textMuted}`}>
                      {task.estimatedMinutes} min
                    </span>
                  </div>
                </div>

                {/* Link to feature */}
                {!task.completed && (
                  <Link
                    href={getTaskLink(task)}
                    className="flex-shrink-0 text-xs font-bold text-primary hover:text-primary-light transition-colors"
                  >
                    Ir &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan complete */}
      {todayData?.planComplete && (
        <div className={`${cardClass} p-8 text-center`} style={cardBg}>
          <div className="text-4xl mb-4">&#127881;</div>
          <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
            Plano concluido!
          </h3>
          <p className={`text-sm ${textSecondary} mb-6`}>
            Voce completou todas as tarefas do seu plano de estudos.
          </p>
          <Link
            href="/planner/setup"
            className="text-sm font-bold text-primary hover:text-primary-light transition-colors"
          >
            Criar novo plano &rarr;
          </Link>
        </div>
      )}

      {/* Upcoming days preview */}
      {upcomingDays.length > 0 && (
        <div>
          <h2
            className={`text-sm font-bold uppercase tracking-[0.08em] mb-4 ${
              isDark ? "text-white/50" : "text-black/70"
            }`}
          >
            Proximos Dias
          </h2>
          <div className="space-y-2">
            {upcomingDays.map((day) => {
              const dayCompleted = day.tasks.filter(
                (t) => t.completed
              ).length;
              const dayTotal = day.tasks.length;
              return (
                <div
                  key={day.dayNumber}
                  className={`${cardClass} p-4 flex items-center justify-between`}
                  style={cardBg}
                >
                  <div>
                    <p className={`text-sm font-semibold ${textPrimary}`}>
                      Dia {day.dayNumber}
                    </p>
                    <p className={`text-xs ${textSecondary} mt-0.5`}>
                      {dayTotal} {dayTotal === 1 ? "tarefa" : "tarefas"}
                      {dayCompleted > 0 &&
                        ` (${dayCompleted} ${dayCompleted === 1 ? "concluida" : "concluidas"})`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {day.tasks.slice(0, 4).map((t, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          t.completed
                            ? "bg-green-500"
                            : isDark
                            ? "bg-white/10"
                            : "bg-black/10"
                        }`}
                      />
                    ))}
                    {day.tasks.length > 4 && (
                      <span className={`text-[10px] ${textMuted}`}>
                        +{day.tasks.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
