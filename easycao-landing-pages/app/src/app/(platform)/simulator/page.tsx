"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface PartConfig {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  modes: { id: string; label: string; description: string }[];
  color: string;
}

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
    color: "from-blue-500 to-blue-600",
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
    color: "from-emerald-500 to-emerald-600",
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
    color: "from-purple-500 to-purple-600",
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
    color: "from-amber-500 to-amber-600",
  },
  {
    id: "complete",
    name: "Teste ICAO Completo",
    description: "Simule todas as 4 partes do exame exatamente como é na prova ICAO.",
    taskCount: 36,
    modes: [],
    color: "from-red-500 to-red-600",
  },
];

export default function SimulatorPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [selectedPart, setSelectedPart] = useState<PartConfig | null>(null);
  const [creating, setCreating] = useState(false);

  const cardClass = isDark
    ? "rounded-2xl border border-white/[0.09] backdrop-blur-[20px]"
    : "rounded-2xl bg-white border border-gray-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.06)]";
  const cardBg = isDark
    ? { background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" }
    : undefined;
  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";

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
    if (part.id === "complete") {
      startExam("complete", "complete");
    } else {
      setSelectedPart(part);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className={`text-sm font-bold uppercase tracking-[0.08em] mb-5 ${isDark ? "text-white/50" : "text-black/70"}`}>
        Simulador ICAO
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARTS.map((part) => (
          <button
            key={part.id}
            onClick={() => handleCardClick(part)}
            disabled={creating}
            className={`${cardClass} overflow-hidden text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50`}
            style={cardBg}
          >
            <div className={`h-2 bg-gradient-to-r ${part.color}`} />
            <div className="p-5">
              <h3 className={`text-[15px] font-bold ${textPrimary} mb-1`}>
                {part.name}
              </h3>
              <p className={`text-xs ${textSecondary} mb-4 line-clamp-2 leading-relaxed`}>
                {part.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-medium ${textSecondary}`}>
                  {part.taskCount} tarefa{part.taskCount !== 1 ? "s" : ""}
                </span>
                <span className={`text-xs font-bold text-primary`}>
                  Iniciar &rarr;
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Mode Selection Modal */}
      {selectedPart && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPart(null)}
        >
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${isDark ? "bg-[#141418] border border-white/[0.09]" : "bg-white"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-lg font-bold ${textPrimary} mb-1`}>
              {selectedPart.name}
            </h3>
            <p className={`text-sm ${textSecondary} mb-5`}>
              Escolha o modo de prática:
            </p>
            <div className="space-y-3">
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
                      ? "border-white/[0.09] hover:border-primary/40 hover:bg-white/[0.04]"
                      : "border-gray-200 hover:border-primary/30 hover:bg-primary/5"
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
            <button
              onClick={() => setSelectedPart(null)}
              className={`mt-4 w-full py-2.5 rounded-xl text-sm font-medium ${textSecondary} hover:bg-black/5 transition-colors`}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
