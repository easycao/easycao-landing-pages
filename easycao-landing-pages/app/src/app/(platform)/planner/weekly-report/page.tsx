"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCachedFetch } from "@/hooks/useCachedFetch";

interface WeeklyReportData {
  hasReport: boolean;
  report?: {
    period: {
      start: string;
      end: string;
    };
    tasks: {
      planned: number;
      completed: number;
      completionRate: number;
      byType: Record<string, { planned: number; completed: number }>;
    };
    simulations: {
      count: number;
      avgPronunciation: number | null;
      avgFluency: number | null;
    };
    exercises: {
      completed: number;
    };
    topErrors: { category: string; count: number }[];
    improvements: string[];
    plan: {
      goal: string;
      currentDay: number;
      totalDays: number;
      status: string;
    };
  };
}

const TYPE_LABELS: Record<string, string> = {
  lesson: "Aulas",
  playlist: "Playlists",
  simulator: "Simulados",
  sdea: "SDEA",
  full_simulator: "Simulado Completo",
};

export default function WeeklyReportPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, loading } = useCachedFetch<WeeklyReportData>({
    key: `weekly-report-${user?.uid}`,
    url: `/api/planner/weekly-report?uid=${user?.uid}`,
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
      <div className="max-w-3xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`rounded-2xl h-[160px] animate-pulse ${
              isDark ? "bg-white/[0.04]" : "bg-black/[0.04]"
            }`}
          />
        ))}
      </div>
    );
  }

  if (!data?.hasReport || !data.report) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className={`${cardClass} p-10 text-center`} style={cardBg}>
          <h2 className={`text-lg font-bold ${textPrimary} mb-2`}>
            Nenhum relatorio disponivel
          </h2>
          <p className={`text-sm ${textSecondary} mb-6`}>
            Crie um plano de estudos para comecar a acompanhar seu progresso.
          </p>
          <Link
            href="/planner/setup"
            className="text-sm font-bold text-primary hover:text-primary-light transition-colors"
          >
            Criar plano &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const report = data.report;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className={`text-sm font-bold uppercase tracking-[0.08em] ${
            isDark ? "text-white/50" : "text-black/70"
          }`}
        >
          Relatorio Semanal
        </h2>
        <Link
          href="/planner"
          className={`text-xs font-medium ${textSecondary} hover:text-primary transition-colors`}
        >
          &larr; Voltar ao plano
        </Link>
      </div>

      {/* Tasks summary */}
      <div className={`${cardClass} p-6`} style={cardBg}>
        <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>
          Tarefas Planejadas vs Concluidas
        </h3>
        <div className="flex items-center gap-6 mb-4">
          <div>
            <p className="text-3xl font-bold text-primary">
              {report.tasks.completed}
            </p>
            <p className={`text-xs ${textMuted}`}>concluidas</p>
          </div>
          <div className={`text-lg ${textMuted}`}>/</div>
          <div>
            <p className={`text-3xl font-bold ${textPrimary}`}>
              {report.tasks.planned}
            </p>
            <p className={`text-xs ${textMuted}`}>planejadas</p>
          </div>
          <div className="flex-1" />
          <div
            className={`text-2xl font-bold ${
              report.tasks.completionRate >= 80
                ? "text-green-500"
                : report.tasks.completionRate >= 50
                ? "text-amber-500"
                : "text-red-400"
            }`}
          >
            {report.tasks.completionRate}%
          </div>
        </div>
        <div
          className={`w-full h-2.5 ${progressBg} rounded-full overflow-hidden`}
        >
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              report.tasks.completionRate >= 80
                ? "bg-green-500"
                : report.tasks.completionRate >= 50
                ? "bg-amber-500"
                : "bg-red-400"
            }`}
            style={{ width: `${report.tasks.completionRate}%` }}
          />
        </div>

        {/* By type breakdown */}
        <div className="mt-5 space-y-2">
          {Object.entries(report.tasks.byType).map(([type, stats]) => (
            <div
              key={type}
              className="flex items-center justify-between text-xs"
            >
              <span className={textSecondary}>
                {TYPE_LABELS[type] || type}
              </span>
              <span className={textPrimary}>
                {stats.completed}/{stats.planned}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Simulations */}
      <div className={`${cardClass} p-6`} style={cardBg}>
        <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>
          Simulacoes Realizadas
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-bold text-primary">
              {report.simulations.count}
            </p>
            <p className={`text-xs ${textMuted}`}>simulados</p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {report.simulations.avgPronunciation ?? "--"}
            </p>
            <p className={`text-xs ${textMuted}`}>pronuncia media</p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${textPrimary}`}>
              {report.simulations.avgFluency ?? "--"}
            </p>
            <p className={`text-xs ${textMuted}`}>fluencia media</p>
          </div>
        </div>
      </div>

      {/* Error patterns */}
      {report.topErrors.length > 0 && (
        <div className={`${cardClass} p-6`} style={cardBg}>
          <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>
            Erros Mais Frequentes
          </h3>
          <div className="space-y-3">
            {report.topErrors.map((err) => (
              <div
                key={err.category}
                className="flex items-center justify-between"
              >
                <span className={`text-sm ${textSecondary}`}>
                  {err.category}
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-24 h-1.5 ${progressBg} rounded-full overflow-hidden`}
                  >
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (err.count /
                            Math.max(
                              1,
                              report.topErrors[0]?.count || 1
                            )) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${textPrimary}`}>
                    {err.count}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {report.improvements.length > 0 && (
        <div className={`${cardClass} p-6`} style={cardBg}>
          <h3 className={`text-sm font-bold ${textPrimary} mb-4`}>
            Analise e Recomendacoes
          </h3>
          <ul className="space-y-2">
            {report.improvements.map((item, i) => (
              <li
                key={i}
                className={`text-sm ${textSecondary} flex items-start gap-2`}
              >
                <span className="text-primary mt-0.5">&#8226;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Redo plan CTA */}
      <div className="text-center pt-4 pb-8">
        <Link
          href="/planner/setup"
          className={`text-sm font-medium px-5 py-2.5 rounded-lg transition-all ${
            isDark
              ? "bg-white/[0.04] text-white/60 hover:bg-white/[0.08] border border-white/[0.06]"
              : "bg-gray-100 text-black/50 hover:bg-gray-200 border border-gray-border/30"
          }`}
        >
          Refazer Plano
        </Link>
      </div>
    </div>
  );
}
