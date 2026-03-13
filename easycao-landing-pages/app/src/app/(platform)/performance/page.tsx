"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCachedFetch } from "@/hooks/useCachedFetch";

interface SimulatorEntry {
  examId: string;
  part: string;
  date: string;
  avgPronunciation: number;
  avgFluency: number;
  taskCount: number;
}

interface ModuleProgress {
  id: string;
  name: string;
  totalLessons: number;
  completedLessons: number;
  percent: number;
}

interface CourseProgress {
  courseId: string;
  courseName: string;
  totalLessons: number;
  completedLessons: number;
  percent: number;
  modules: ModuleProgress[];
}

interface PerformanceData {
  simulatorEvolution: SimulatorEntry[];
  courseProgress: CourseProgress[];
  exerciseStats: {
    byPart: Record<string, { completed: number; total: number }>;
    totalCompleted: number;
    playlistsCompleted: number;
  };
  errorPatterns: { category: string; count: number }[];
}

const PART_COLORS: Record<string, string> = {
  P1: "bg-blue-500",
  P2: "bg-emerald-500",
  P3: "bg-purple-500",
  P4: "bg-amber-500",
  complete: "bg-red-500",
};

export default function PerformancePage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, loading } = useCachedFetch<PerformanceData>({
    key: `performance-${user?.uid}`,
    url: `/api/performance/profile?uid=${user?.uid}`,
    enabled: !!user,
  });

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
      <div className="max-w-5xl mx-auto space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`rounded-2xl h-[200px] animate-pulse ${
              isDark ? "bg-white/[0.04]" : "bg-black/[0.04]"
            }`}
          />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className={`${cardClass} p-10 text-center`} style={cardBg}>
          <h2 className={`text-lg font-bold ${textPrimary} mb-2`}>
            Dados insuficientes
          </h2>
          <p className={`text-sm ${textSecondary}`}>
            Complete algumas atividades para ver seu desempenho.
          </p>
        </div>
      </div>
    );
  }

  const { simulatorEvolution, courseProgress, exerciseStats, errorPatterns } =
    data;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2
        className={`text-sm font-bold uppercase tracking-[0.08em] ${
          isDark ? "text-white/50" : "text-black/70"
        }`}
      >
        Desempenho
      </h2>

      {/* Section 1: Simulator Evolution */}
      <div className={`${cardClass} p-6`} style={cardBg}>
        <h3 className={`text-sm font-bold ${textPrimary} mb-1`}>
          Evolucao no Simulador
        </h3>
        <p className={`text-xs ${textMuted} mb-5`}>
          Pronuncia e fluencia ao longo das simulacoes
        </p>

        {simulatorEvolution.length === 0 ? (
          <p className={`text-sm ${textSecondary} text-center py-6`}>
            Nenhuma simulacao concluida ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {/* Score chart as data bars */}
            <div className="grid gap-2">
              {simulatorEvolution.slice(-10).map((entry) => {
                const date = entry.date
                  ? new Date(entry.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })
                  : "--";
                return (
                  <div key={entry.examId} className="flex items-center gap-3">
                    <span
                      className={`text-[11px] ${textMuted} w-16 flex-shrink-0`}
                    >
                      {date}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        PART_COLORS[entry.part] || "bg-gray-500"
                      }`}
                    />
                    <div className="flex-1 flex items-center gap-2">
                      {/* Pronunciation bar */}
                      <div className="flex-1">
                        <div
                          className={`h-4 ${progressBg} rounded-full overflow-hidden relative`}
                        >
                          <div
                            className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-1.5"
                            style={{
                              width: `${Math.min(100, entry.avgPronunciation)}%`,
                            }}
                          >
                            <span className="text-[9px] font-bold text-white">
                              {entry.avgPronunciation}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Fluency bar */}
                      <div className="flex-1">
                        <div
                          className={`h-4 ${progressBg} rounded-full overflow-hidden relative`}
                        >
                          <div
                            className="h-full bg-emerald-500 rounded-full flex items-center justify-end pr-1.5"
                            style={{
                              width: `${Math.min(100, entry.avgFluency)}%`,
                            }}
                          >
                            <span className="text-[9px] font-bold text-white">
                              {entry.avgFluency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-blue-500" />
                <span className={`text-[11px] ${textSecondary}`}>
                  Pronuncia
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className={`text-[11px] ${textSecondary}`}>
                  Fluencia
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Course Progress */}
      <div className={`${cardClass} p-6`} style={cardBg}>
        <h3 className={`text-sm font-bold ${textPrimary} mb-1`}>
          Progresso nos Cursos
        </h3>
        <p className={`text-xs ${textMuted} mb-5`}>
          Progresso detalhado por modulo
        </p>

        {courseProgress.length === 0 ? (
          <p className={`text-sm ${textSecondary} text-center py-6`}>
            Nenhum curso encontrado.
          </p>
        ) : (
          <div className="space-y-6">
            {courseProgress.map((course) => (
              <div key={course.courseId}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-sm font-semibold ${textPrimary}`}>
                    {course.courseName}
                  </h4>
                  <span className="text-sm font-bold text-primary">
                    {course.percent}%
                  </span>
                </div>
                <div
                  className={`w-full h-2 ${progressBg} rounded-full overflow-hidden mb-3`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-700"
                    style={{ width: `${course.percent}%` }}
                  />
                </div>
                <div className="space-y-1.5 pl-2">
                  {course.modules.map((mod) => (
                    <div key={mod.id} className="flex items-center gap-3">
                      <span
                        className={`text-xs ${textSecondary} flex-1 truncate`}
                      >
                        {mod.name}
                      </span>
                      <div
                        className={`w-20 h-1.5 ${progressBg} rounded-full overflow-hidden`}
                      >
                        <div
                          className="h-full bg-primary/70 rounded-full"
                          style={{ width: `${mod.percent}%` }}
                        />
                      </div>
                      <span
                        className={`text-[11px] ${textMuted} w-12 text-right`}
                      >
                        {mod.completedLessons}/{mod.totalLessons}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Exercise Stats */}
      <div className={`${cardClass} p-6`} style={cardBg}>
        <h3 className={`text-sm font-bold ${textPrimary} mb-1`}>
          Exercicios
        </h3>
        <p className={`text-xs ${textMuted} mb-5`}>
          Questoes completadas por parte e playlists
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          <div
            className={`p-4 rounded-xl ${
              isDark ? "bg-white/[0.03]" : "bg-gray-50"
            }`}
          >
            <p className="text-2xl font-bold text-primary">
              {exerciseStats.totalCompleted}
            </p>
            <p className={`text-xs ${textMuted} mt-1`}>
              exercicios feitos
            </p>
          </div>
          <div
            className={`p-4 rounded-xl ${
              isDark ? "bg-white/[0.03]" : "bg-gray-50"
            }`}
          >
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {exerciseStats.playlistsCompleted}
            </p>
            <p className={`text-xs ${textMuted} mt-1`}>
              playlists concluidas
            </p>
          </div>
          <div
            className={`p-4 rounded-xl ${
              isDark ? "bg-white/[0.03]" : "bg-gray-50"
            }`}
          >
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {Object.keys(exerciseStats.byPart).length}
            </p>
            <p className={`text-xs ${textMuted} mt-1`}>partes praticadas</p>
          </div>
        </div>

        {Object.keys(exerciseStats.byPart).length > 0 && (
          <div className="space-y-2">
            {Object.entries(exerciseStats.byPart).map(([part, stats]) => (
              <div key={part} className="flex items-center justify-between">
                <span className={`text-xs ${textSecondary}`}>{part}</span>
                <span className={`text-xs font-medium ${textPrimary}`}>
                  {stats.completed}
                  {stats.total > 0 ? `/${stats.total}` : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Error Patterns */}
      <div className={`${cardClass} p-6`} style={cardBg}>
        <h3 className={`text-sm font-bold ${textPrimary} mb-1`}>
          Padrao de Erros
        </h3>
        <p className={`text-xs ${textMuted} mb-5`}>
          Categorias mais frequentes de erros nas simulacoes recentes
        </p>

        {errorPatterns.length === 0 ? (
          <p className={`text-sm ${textSecondary} text-center py-6`}>
            Nenhum erro registrado ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {errorPatterns.map((err, i) => {
              const maxCount = errorPatterns[0]?.count || 1;
              const barPercent = Math.round((err.count / maxCount) * 100);
              return (
                <div key={err.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${textSecondary}`}>
                      {err.category}
                    </span>
                    <span className={`text-xs font-bold ${textPrimary}`}>
                      {err.count}x
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 ${progressBg} rounded-full overflow-hidden`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        i === 0
                          ? "bg-red-400"
                          : i === 1
                          ? "bg-orange-400"
                          : "bg-amber-400"
                      }`}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
