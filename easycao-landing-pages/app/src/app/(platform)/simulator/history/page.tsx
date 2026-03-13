"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

interface SimulationItem {
  id: string;
  part: string;
  mode: string;
  completedAt: string | null;
  createdAt: string | null;
  taskCount: number;
  summary: {
    avgPronunciation: number;
    avgFluency: number;
    totalErrors: number;
    feedbackCount: number;
  };
}

const PART_LABELS: Record<string, string> = {
  P1: "Part 1",
  P2: "Part 2",
  P3: "Part 3",
  P4: "Part 4",
  complete: "Teste Completo",
};

const PART_COLORS: Record<string, string> = {
  P1: "bg-blue-500",
  P2: "bg-emerald-500",
  P3: "bg-purple-500",
  P4: "bg-amber-500",
  complete: "bg-red-500",
};

const FILTER_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "P1", label: "Part 1" },
  { value: "P2", label: "Part 2" },
  { value: "P3", label: "Part 3" },
  { value: "P4", label: "Part 4" },
  { value: "complete", label: "Completo" },
];

export default function SimulatorHistoryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [simulations, setSimulations] = useState<SimulationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [partFilter, setPartFilter] = useState("");

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
    (async () => {
      setLoading(true);
      try {
        const url = partFilter
          ? `/api/simulator/history?part=${partFilter}`
          : "/api/simulator/history";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSimulations(data.simulations || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [partFilter]);

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link
          href="/simulator"
          className={`text-xs font-medium ${textSecondary} hover:opacity-70 transition-colors`}
        >
          &larr; Simulador
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-sm font-bold uppercase tracking-[0.08em] ${
            isDark ? "text-white/50" : "text-black/70"
          }`}
        >
          Histórico de Simulações
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setPartFilter(option.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              partFilter === option.value
                ? "bg-primary text-white"
                : isDark
                  ? "bg-white/[0.06] text-white/60 hover:bg-white/[0.1]"
                  : "bg-gray-100 text-black/50 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Evolution chart placeholder */}
      <div
        className={`${cardClass} p-6 mb-6`}
        style={cardBg}
      >
        <h3 className={`text-sm font-bold ${textPrimary} mb-3`}>
          Evolução
        </h3>
        <div
          className={`h-32 flex items-center justify-center rounded-xl ${
            isDark ? "bg-white/[0.04]" : "bg-gray-50"
          }`}
        >
          <p className={`text-xs ${textSecondary}`}>
            Gráfico de evolução disponível em breve
          </p>
        </div>
      </div>

      {/* Simulations list */}
      {loading ? (
        <div className={`text-center py-16 ${textSecondary} text-sm`}>
          Carregando histórico...
        </div>
      ) : simulations.length === 0 ? (
        <div className={`text-center py-16 ${textSecondary} text-sm`}>
          Nenhuma simulação encontrada.
        </div>
      ) : (
        <div className="space-y-3">
          {simulations.map((sim) => (
            <Link
              key={sim.id}
              href={`/simulator/history/${sim.id}`}
              className={`${cardClass} p-4 block transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg`}
              style={cardBg}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      PART_COLORS[sim.part] || "bg-gray-500"
                    }`}
                  />
                  <span className={`text-sm font-semibold ${textPrimary}`}>
                    {PART_LABELS[sim.part] || sim.part}
                  </span>
                  {sim.mode && sim.mode !== "complete" && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isDark
                          ? "bg-white/[0.06] text-white/40"
                          : "bg-gray-100 text-black/30"
                      } font-medium`}
                    >
                      {sim.mode}
                    </span>
                  )}
                </div>
                <span className={`text-xs ${textSecondary}`}>
                  {formatDate(sim.completedAt)}
                </span>
              </div>

              {/* Scores */}
              {sim.summary.feedbackCount > 0 && (
                <div className="flex items-center gap-4">
                  <div>
                    <span className={`text-[10px] ${textSecondary} uppercase tracking-wider`}>
                      Pronúncia
                    </span>
                    <p
                      className={`text-lg font-bold ${getScoreColor(sim.summary.avgPronunciation)}`}
                    >
                      {sim.summary.avgPronunciation}
                    </p>
                  </div>
                  <div>
                    <span className={`text-[10px] ${textSecondary} uppercase tracking-wider`}>
                      Fluência
                    </span>
                    <p
                      className={`text-lg font-bold ${getScoreColor(sim.summary.avgFluency)}`}
                    >
                      {sim.summary.avgFluency}
                    </p>
                  </div>
                  <div>
                    <span className={`text-[10px] ${textSecondary} uppercase tracking-wider`}>
                      Erros
                    </span>
                    <p className={`text-lg font-bold ${textPrimary}`}>
                      {sim.summary.totalErrors}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs font-bold text-primary`}>
                      Ver detalhes &rarr;
                    </span>
                  </div>
                </div>
              )}

              {sim.summary.feedbackCount === 0 && (
                <p className={`text-xs ${textSecondary}`}>
                  Feedback não disponível
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
