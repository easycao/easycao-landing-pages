"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Types ──────────────────────────────────────────────

interface PartConfig {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  modes: { id: string; label: string; description: string }[];
  icon: React.ReactNode;
}

interface Stats {
  totalCompleted: number;
  thisWeekCount: number;
  weeklyChange: number | null;
  perPart: Record<string, number>;
  avgPronunciation: number | null;
  avgFluency: number | null;
  avgStructurePerTask: number | null;
  avgVocabularyPerTask: number | null;
  avgComprehension: number | null;
  taskTypeErrors: Record<
    string,
    { label: string; avgStructure: number | null; avgVocabulary: number | null; count: number }
  >;
}

interface Simulation {
  id: string;
  part: string;
  mode: string;
  status: "completed" | "in_progress";
  completedAt: string | null;
  createdAt: string | null;
  taskCount: number;
  answeredTasks: number;
  summary: {
    avgPronunciation: number;
    avgFluency: number;
    totalErrors: number;
    feedbackCount: number;
  };
}

// ─── Part config ────────────────────────────────────────

const PARTS: PartConfig[] = [
  {
    id: "P1",
    name: "Part 1 — Aviation Topics",
    description: "Responda perguntas do examinador sobre temas gerais de aviação.",
    taskCount: 3,
    modes: [
      { id: "single", label: "Pergunta Individual", description: "Praticar 1 pergunta por vez" },
      { id: "complete", label: "Parte Completa", description: "3 perguntas sequenciais" },
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    id: "P2",
    name: "Part 2 — Interacting as a Pilot",
    description: "Resolva situações da parte 2 com cotejamento, reporte de intenções, Affirm/Negative e Reported Speech.",
    taskCount: 20,
    modes: [
      { id: "single", label: "Situação de Áudio", description: "Situação tipo 1 — áudio" },
      { id: "single-image", label: "Situação de Imagem", description: "Situação tipo 2 — imagem" },
      { id: "complete", label: "Parte 2 Completa", description: "5 situações (3 áudio + 2 imagem)" },
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    id: "P3",
    name: "Part 3 — Unexpected Situations",
    description: "Simule situações da parte 3 com Reported Speech, Perguntas e comparação.",
    taskCount: 7,
    modes: [
      { id: "single", label: "Situação Individual", description: "1 situação com RS + pergunta" },
      { id: "complete", label: "Parte Completa", description: "3 situações + comparação" },
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    id: "P4",
    name: "Part 4 — Picture Description and Discussion",
    description: "Responda perguntas sobre as imagens da prova ICAO.",
    taskCount: 6,
    modes: [
      { id: "description", label: "Descrição da Foto", description: "Descreva a imagem" },
      { id: "past", label: "Passado", description: "O que aconteceu antes" },
      { id: "future", label: "Futuro", description: "O que vai acontecer" },
      { id: "question", label: "Question", description: "Responda a pergunta" },
      { id: "statement", label: "Statement", description: "Comente a afirmação" },
      { id: "complete", label: "Parte 4 Completa", description: "Todas as 6 tarefas" },
    ],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    ),
  },
];

const PART_LABELS: Record<string, string> = {
  P1: "Part 1",
  P2: "Part 2",
  P3: "Part 3",
  P4: "Part 4",
  complete: "Completo",
};

const MODE_LABELS: Record<string, string> = {
  single: "Individual",
  "single-image": "Imagem",
  complete: "Completa",
  description: "Descrição",
  past: "Passado",
  future: "Futuro",
  question: "Pergunta",
  statement: "Statement",
  sdea: "SDEA",
};

const TASK_TYPE_LABELS: Record<string, string> = {
  P1: "Parte 1: Pergunta",
  P2_T1: "Parte 2: Cotejamento",
  P2_T2: "Parte 2: Sistema ABC",
  P2_T3: "Parte 2: Pane",
  P2_T4: "Parte 2: Reported Speech",
  P3_RS: "Parte 3: Reported Speech",
  P3_Q: "Parte 3: Pergunta",
  P3_CMP: "Parte 3: Comparação",
  P4_DESC: "Parte 4: Presente",
  P4_PAST: "Parte 4: Passado",
  P4_FUTURE: "Parte 4: Futuro",
  P4_Q: "Parte 4: Pergunta",
  P4_STMT: "Parte 4: Statement",
};

const TASK_TYPE_ORDER = Object.keys(TASK_TYPE_LABELS);

const TASK_TYPE_SHORT: Record<string, string> = {
  P1: "Pergunta",
  P2_T1: "Cotejamento",
  P2_T2: "Sistema ABC",
  P2_T3: "Pane",
  P2_T4: "Reported Speech",
  P3_RS: "Reported Speech",
  P3_Q: "Pergunta",
  P3_CMP: "Comparação",
  P4_DESC: "Presente",
  P4_PAST: "Passado",
  P4_FUTURE: "Futuro",
  P4_Q: "Pergunta",
  P4_STMT: "Statement",
};

const TASK_TYPE_GROUPS = [
  { part: "Parte 1", types: ["P1"] },
  { part: "Parte 2", types: ["P2_T1", "P2_T2", "P2_T3", "P2_T4"] },
  { part: "Parte 3", types: ["P3_RS", "P3_Q", "P3_CMP"] },
  { part: "Parte 4", types: ["P4_DESC", "P4_PAST", "P4_FUTURE", "P4_Q", "P4_STMT"] },
];

// ─── Helpers ────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (score >= 60) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-red-500/10 text-red-600 border-red-500/20";
}

function errorHeatColor(avg: number, isDark: boolean): string {
  if (avg === 0) return isDark ? "text-emerald-400" : "text-emerald-600";
  if (avg <= 0.5) return isDark ? "text-emerald-400/70" : "text-emerald-500";
  if (avg <= 1) return isDark ? "text-amber-400" : "text-amber-600";
  if (avg <= 2) return isDark ? "text-orange-400" : "text-orange-600";
  return isDark ? "text-red-400" : "text-red-600";
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

// ─── Main Component ─────────────────────────────────────

export default function SimulatorPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<Simulation[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedPart, setSelectedPart] = useState<PartConfig | null>(null);
  const [creating, setCreating] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(10);

  const emptyStats: Stats = {
    totalCompleted: 0,
    thisWeekCount: 0,
    weeklyChange: null,
    perPart: { P1: 0, P2: 0, P3: 0, P4: 0, complete: 0 },
    avgPronunciation: null,
    avgFluency: null,
    avgStructurePerTask: null,
    avgVocabularyPerTask: null,
    avgComprehension: null,
    taskTypeErrors: Object.fromEntries(
      TASK_TYPE_ORDER.map((t) => [t, { label: TASK_TYPE_LABELS[t], avgStructure: null, avgVocabulary: null, count: 0 }])
    ),
  };

  // Fetch stats and history on mount
  useEffect(() => {
    if (!user) return;
    fetch("/api/simulator/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          console.error("[simulator] stats error:", data);
          setStats(emptyStats);
        } else {
          setStats(data);
        }
      })
      .catch((err) => { console.error("[simulator] stats fetch error:", err); setStats(emptyStats); })
      .finally(() => setLoadingStats(false));

    fetch("/api/simulator/history")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          console.error("[simulator] history error:", data);
        }
        setHistory(data.simulations || []);
      })
      .catch((err) => { console.error("[simulator] history fetch error:", err); })
      .finally(() => setLoadingHistory(false));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtered history
  const filteredHistory = useMemo(() => {
    if (historyFilter === "all") return history;
    return history.filter((s) => s.part === historyFilter);
  }, [history, historyFilter]);

  const visibleHistory = filteredHistory.slice(0, visibleCount);

  // Start exam
  async function startExam(part: string, mode: string) {
    if (!user) return;
    setCreating(true);
    try {
      const res = await fetch("/api/simulator/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ part, mode, uid: user.uid }),
      });
      const data = await res.json();
      if (data.examId) {
        router.push(`/simulator/exam/${data.examId}`);
      }
    } catch {
      setCreating(false);
    }
  }

  function handleCardClick(part: PartConfig) {
    setSelectedPart(part);
  }

  function handleCompleteClick() {
    startExam("complete", "complete");
  }

  // Shared styles
  const cardClass = isDark
    ? "rounded-2xl border border-white/[0.06] backdrop-blur-[20px]"
    : "rounded-2xl bg-white border border-primary/20 shadow-[0_2px_8px_rgba(31,150,247,0.08)]";
  const cardBg = isDark
    ? { background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" }
    : undefined;
  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";
  const textMuted = isDark ? "text-white/30" : "text-black/25";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ─── Page Header ─── */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
          Simulador ICAO
        </h1>
        <p className={`text-sm mt-1 ${textSecondary}`}>
          Pratique cada parte do exame ou faça o teste completo
        </p>
      </div>

      {/* ─── Stats Dashboard ─── */}
      <div className={`${cardClass} overflow-hidden`} style={cardBg}>
        <div className={`px-5 py-3 border-b ${isDark ? "border-white/[0.06]" : "border-primary/10"}`}>
          <h2 className={`text-base font-bold tracking-tight text-primary`}>
            Seu Desempenho
          </h2>
        </div>

        {loadingStats ? (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-16 rounded-xl animate-pulse ${isDark ? "bg-white/[0.04]" : "bg-gray-100"}`} />
              ))}
            </div>
          </div>
        ) : stats ? (
          <div className="p-5 space-y-5">
            {/* Total Simulados — blue gradient */}
            <div className="rounded-xl p-4 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0057B4 0%, #1F96F7 100%)" }}>
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="relative">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/60">Total Simulados</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold">{stats.totalCompleted}</span>
                  {stats.weeklyChange !== null && (
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${stats.weeklyChange >= 0 ? "bg-emerald-400/20 text-emerald-200" : "bg-red-400/20 text-red-200"}`}>
                      {stats.weeklyChange >= 0 ? "+" : ""}{stats.weeklyChange}% sem.
                    </span>
                  )}
                </div>
                {stats.thisWeekCount > 0 && (
                  <p className="text-[10px] mt-0.5 text-white/70">{stats.thisWeekCount} esta semana</p>
                )}
                {/* Per-part sub-boxes */}
                <div className="grid grid-cols-5 gap-1.5 mt-3">
                  {([
                    { key: "P1", label: "P1" },
                    { key: "P2", label: "P2" },
                    { key: "P3", label: "P3" },
                    { key: "P4", label: "P4" },
                    { key: "complete", label: "Full" },
                  ] as const).map(({ key, label }) => (
                    <div key={key} className="rounded-lg bg-white/10 px-2 py-1.5 text-center">
                      <span className="text-sm font-bold block">{stats.perPart[key] || 0}</span>
                      <span className="text-[9px] text-white/70 uppercase">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5 Descriptors Row */}
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-white/40" : "text-black/40"}`}>
                Descritores — últimos 10 simulados
              </p>
              <div className="grid grid-cols-5 gap-2">
                {([
                  { label: "Estrutura", value: stats.avgStructurePerTask, type: "errors" as const },
                  { label: "Vocabulário", value: stats.avgVocabularyPerTask, type: "errors" as const },
                  { label: "Pronúncia", value: stats.avgPronunciation, type: "score" as const },
                  { label: "Fluência", value: stats.avgFluency, type: "score" as const },
                  { label: "Compreensão", value: stats.avgComprehension, type: "score" as const },
                ] as const).map((desc) => (
                  <div
                    key={desc.label}
                    className={`rounded-xl border p-3 text-center ${isDark ? "border-white/[0.06] bg-white/[0.03]" : "border-primary/15 bg-primary/[0.03]"}`}
                  >
                    <span className={`text-xl sm:text-2xl font-bold font-mono block ${
                      desc.value === null
                        ? textMuted
                        : desc.type === "errors"
                          ? errorHeatColor(desc.value, isDark)
                          : scoreColor(desc.value)
                    }`}>
                      {desc.value !== null ? (desc.type === "errors" ? desc.value.toFixed(1) : desc.value) : "—"}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider block mt-1 ${isDark ? "text-white/40" : "text-primary/60"}`}>
                      {desc.label}
                    </span>
                    {desc.value !== null && desc.type === "errors" && (
                      <span className={`text-[9px] block ${textMuted}`}>erros/tarefa</span>
                    )}
                    {desc.value !== null && desc.type === "score" && (
                      <span className={`text-[9px] block ${textMuted}`}>/ 100</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* ─── Hero: Teste ICAO Completo ─── */}
      <button
        onClick={handleCompleteClick}
        disabled={creating}
        className="w-full rounded-2xl overflow-hidden text-left transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(31,150,247,0.25)] disabled:opacity-50 group"
      >
        <div
          className="p-6 sm:p-8 relative"
          style={{ background: "linear-gradient(135deg, #0057B4 0%, #1F96F7 60%, #34B8F8 100%)" }}
        >
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </span>
              <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Simulação Completa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Teste ICAO Completo
            </h2>
            <p className="text-white/70 text-sm max-w-lg mb-4">
              Simule todas as 4 partes do exame exatamente como é na prova ICAO. 36 tarefas sequenciais.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-white/25 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                Iniciar Teste
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <span className="text-white/40 text-xs">~45 minutos</span>
            </div>
          </div>
        </div>
      </button>

      {/* ─── Part Cards Grid ─── */}
      <div>
        <h2 className={`text-base font-bold tracking-tight mb-4 text-primary`}>
          Praticar por Parte
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PARTS.map((part) => (
            <button
              key={part.id}
              onClick={() => handleCardClick(part)}
              disabled={creating}
              className={`${cardClass} overflow-hidden text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 ${isDark ? "hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]" : "hover:shadow-[0_4px_20px_rgba(31,150,247,0.12)]"} disabled:opacity-50 group`}
              style={cardBg}
            >
              <div className="p-5">
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isDark
                      ? "bg-primary/20 text-primary"
                      : "text-white"
                  }`} style={!isDark ? { background: "linear-gradient(135deg, #0057B4, #1F96F7)" } : undefined}>
                    {part.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-[15px] font-bold ${textPrimary} mb-1 group-hover:text-primary transition-colors`}>
                      {part.name}
                    </h3>
                    <p className={`text-xs ${textSecondary} mb-3 line-clamp-2 leading-relaxed`}>
                      {part.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-medium ${textMuted}`}>
                          {part.taskCount} tarefa{part.taskCount !== 1 ? "s" : ""}
                        </span>
                        {stats && stats.perPart[part.id] > 0 && (
                          <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                            isDark ? "bg-white/[0.06] text-white/40" : "bg-primary/[0.06] text-primary/60"
                          }`}>
                            {stats.perPart[part.id]} feito{stats.perPart[part.id] !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Praticar
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Error Cards by Task Type ─── */}
      {stats && (
        <div className={`${cardClass} overflow-hidden`} style={cardBg}>
          <div className={`px-5 py-3 border-b ${isDark ? "border-white/[0.06]" : "border-primary/10"}`}>
            <div className="flex items-center gap-2">
              <h2 className={`text-base font-bold tracking-tight text-primary`}>
                Média de Erros por Tipo de Tarefa
              </h2>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isDark ? "bg-white/[0.06] text-white/40" : "bg-primary/[0.08] text-primary/70"}`}>
                últimas 10 de cada
              </span>
            </div>
            <p className={`text-xs mt-1 ${isDark ? "text-white/40" : "text-black/50"}`}>
              Quanto mais próximo de 0, melhor o desempenho
            </p>
          </div>
          <div className="p-5 space-y-4">
            {TASK_TYPE_GROUPS.map((group) => (
              <div key={group.part}>
                <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? "text-white/70" : "text-primary/60"}`}>
                  {group.part}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  {group.types.map((type) => {
                    const data = stats.taskTypeErrors[type];
                    if (!data) return null;
                    return (
                      <div
                        key={type}
                        className={`rounded-xl border overflow-hidden ${isDark ? "border-white/[0.06]" : "border-primary/15"}`}
                      >
                        {/* Task name — centered, uppercase, blue */}
                        <div className={`px-3 py-2 ${isDark ? "bg-white/[0.03]" : "bg-primary/[0.04]"}`}>
                          <span className={`text-[11px] font-bold uppercase tracking-wider text-center block ${isDark ? "text-white" : "text-primary"}`}>
                            {TASK_TYPE_SHORT[type] || data.label}
                          </span>
                        </div>
                        {/* Divider */}
                        <div className={`h-px ${isDark ? "bg-white/[0.06]" : "bg-primary/10"}`} />
                        {/* Error values: Structure | Vocabulary */}
                        <div className="grid grid-cols-2">
                          <div className={`px-2.5 py-2 text-center border-r ${isDark ? "border-white/[0.06]" : "border-primary/10"}`}>
                            <span className={`text-lg font-bold font-mono block ${
                              data.avgStructure !== null ? errorHeatColor(data.avgStructure, isDark) : textMuted
                            }`}>
                              {data.avgStructure !== null ? data.avgStructure.toFixed(1) : "---"}
                            </span>
                            <span className={`text-[9px] uppercase tracking-wider ${isDark ? "text-white/40" : "text-black/40"}`}>
                              Estru.
                            </span>
                          </div>
                          <div className="px-2.5 py-2 text-center">
                            <span className={`text-lg font-bold font-mono block ${
                              data.avgVocabulary !== null ? errorHeatColor(data.avgVocabulary, isDark) : textMuted
                            }`}>
                              {data.avgVocabulary !== null ? data.avgVocabulary.toFixed(1) : "---"}
                            </span>
                            <span className={`text-[9px] uppercase tracking-wider ${isDark ? "text-white/40" : "text-black/40"}`}>
                              Vocab.
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── History Section ─── */}
      <div>
        <h2 className={`text-base font-bold tracking-tight mb-4 text-primary`}>
          Histórico de Simulações
        </h2>

        {/* Filter tabs */}
        <div className={`inline-flex rounded-xl p-1 mb-4 ${isDark ? "bg-white/[0.04]" : "bg-primary/[0.06] border border-primary/10"}`}>
          {[
            { id: "all", label: "Todos" },
            { id: "P1", label: "P1" },
            { id: "P2", label: "P2" },
            { id: "P3", label: "P3" },
            { id: "P4", label: "P4" },
            { id: "complete", label: "Completo" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setHistoryFilter(tab.id); setVisibleCount(10); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                historyFilter === tab.id
                  ? "text-white shadow-sm"
                  : isDark
                    ? "text-white/40 hover:text-white/60"
                    : "text-black/40 hover:text-black/60"
              }`}
              style={
                historyFilter === tab.id
                  ? { background: "linear-gradient(135deg, #0057B4, #1F96F7)" }
                  : undefined
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* History list */}
        {loadingHistory ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-20 rounded-xl animate-pulse ${isDark ? "bg-white/[0.04]" : "bg-gray-100"}`} />
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className={`${cardClass} p-8 text-center`} style={cardBg}>
            <p className={`text-sm ${textSecondary}`}>
              {historyFilter === "all"
                ? "Nenhuma simulação encontrada. Comece seu primeiro simulado!"
                : `Nenhuma simulação de ${PART_LABELS[historyFilter] || historyFilter} encontrada.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleHistory.map((sim) => (
              <div
                key={sim.id}
                className={`${cardClass} p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-[box-shadow] duration-200 ${isDark ? "hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]" : "hover:shadow-md"}`}
                style={cardBg}
              >
                {/* Left: Date + Part info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${textPrimary}`}>
                      {PART_LABELS[sim.part] || sim.part}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${isDark ? "bg-white/[0.06] text-white/40" : "bg-primary/[0.06] text-primary/50"}`}>
                      {MODE_LABELS[sim.mode] || sim.mode}
                    </span>
                    {/* Status badge */}
                    {sim.status === "in_progress" ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 font-semibold">
                        Em andamento
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold">
                        Concluído
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[11px] ${textMuted}`}>
                      {formatDate(sim.completedAt || sim.createdAt)}
                    </span>
                    <span className={`text-[11px] ${textMuted}`}>
                      {sim.status === "in_progress"
                        ? `${sim.answeredTasks}/${sim.taskCount} tarefas`
                        : `${sim.taskCount} tarefa${sim.taskCount !== 1 ? "s" : ""}`}
                    </span>
                  </div>
                </div>

                {/* Middle: Scores (only for completed) */}
                {sim.status === "completed" && sim.summary.feedbackCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] px-2 py-1 rounded-lg border font-mono font-semibold ${scoreBg(sim.summary.avgPronunciation)}`}>
                      P {sim.summary.avgPronunciation}
                    </span>
                    <span className={`text-[11px] px-2 py-1 rounded-lg border font-mono font-semibold ${scoreBg(sim.summary.avgFluency)}`}>
                      F {sim.summary.avgFluency}
                    </span>
                    {sim.summary.totalErrors > 0 && (
                      <span className={`text-[11px] px-2 py-1 rounded-lg border font-mono font-semibold ${scoreBg(Math.max(0, 100 - sim.summary.totalErrors * 10))}`}>
                        {sim.summary.totalErrors} erro{sim.summary.totalErrors !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}

                {/* Right: Action button */}
                {sim.status === "in_progress" ? (
                  <button
                    onClick={() => router.push(`/simulator/exam/${sim.id}`)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:shadow-md flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #0057B4, #1F96F7)" }}
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    onClick={() => router.push(`/simulator/exam/${sim.id}/feedback`)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex-shrink-0 ${
                      isDark
                        ? "text-primary border border-primary/30 hover:bg-primary/10"
                        : "text-primary border border-primary/20 hover:bg-primary/5"
                    }`}
                  >
                    Ver Feedback
                  </button>
                )}
              </div>
            ))}

            {/* Load more */}
            {filteredHistory.length > visibleCount && (
              <button
                onClick={() => setVisibleCount((c) => c + 10)}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "text-primary/60 hover:text-primary border border-primary/15 hover:bg-primary/[0.06]"
                    : "text-primary/60 hover:text-primary border border-primary/10 hover:bg-primary/[0.03]"
                }`}
              >
                Carregar mais ({filteredHistory.length - visibleCount} restantes)
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─── Mode Selection Modal ─── */}
      {selectedPart && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPart(null)}
        >
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${isDark ? "bg-[#141418] border border-white/[0.06]" : "bg-white border border-primary/15"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isDark ? "bg-primary/25 text-primary" : "text-white"
                }`} style={!isDark ? { background: "linear-gradient(135deg, #0057B4, #1F96F7)" } : undefined}>
                  {selectedPart.icon}
                </div>
                <h3 className={`text-lg font-bold ${textPrimary}`}>
                  {selectedPart.name}
                </h3>
              </div>
              <p className={`text-sm ${textSecondary} mt-2`}>
                Escolha o modo de prática:
              </p>
            </div>

            {/* Mode options */}
            <div className="px-6 pb-2 space-y-2">
              {selectedPart.modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setSelectedPart(null);
                    startExam(selectedPart.id, mode.id);
                  }}
                  disabled={creating}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    isDark
                      ? "border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]"
                      : "border-primary/15 hover:border-primary/30 hover:bg-primary/[0.04]"
                  } disabled:opacity-50`}
                >
                  <span className={`text-sm font-semibold ${textPrimary} block`}>
                    {mode.label}
                  </span>
                  <span className={`text-xs ${textSecondary}`}>
                    {mode.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Cancel */}
            <div className="p-6 pt-3">
              <button
                onClick={() => setSelectedPart(null)}
                className={`w-full py-2.5 rounded-xl text-sm font-medium ${textSecondary} hover:bg-black/5 transition-colors`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
