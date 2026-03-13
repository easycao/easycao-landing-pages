"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

type Goal = "exam_prep" | "general_improvement" | "specific_part";

const GOALS: { value: Goal; label: string; description: string }[] = [
  {
    value: "exam_prep",
    label: "Preparacao para o exame",
    description: "Quero me preparar para o exame ICAO com data definida.",
  },
  {
    value: "general_improvement",
    label: "Melhoria geral",
    description: "Quero melhorar meu ingles de aviacao no geral.",
  },
  {
    value: "specific_part",
    label: "Foco em uma parte",
    description: "Quero focar em uma parte especifica do exame.",
  },
];

export default function PlannerSetupPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [passiveStudy, setPassiveStudy] = useState(false);
  const [passiveHours, setPassiveHours] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5;

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

  const canAdvance = () => {
    switch (step) {
      case 1:
        return goal !== null;
      case 2:
        return true; // exam date is optional
      case 3:
        return hoursPerDay >= 1 && hoursPerDay <= 4;
      case 4:
        return daysPerWeek >= 1 && daysPerWeek <= 7;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    if (!user || !goal) return;
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          goal,
          examDate: examDate || null,
          hoursPerDay,
          daysPerWeek,
          passiveStudyAvailable: passiveStudy,
          passiveStudyHours: passiveStudy ? passiveHours : 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao gerar plano");
      }

      router.push("/planner");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2
        className={`text-sm font-bold uppercase tracking-[0.08em] mb-5 ${
          isDark ? "text-white/50" : "text-black/70"
        }`}
      >
        Configurar Plano de Estudos
      </h2>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i + 1 === step
                ? "bg-primary w-7"
                : i + 1 < step
                ? "bg-primary/60"
                : isDark
                ? "bg-white/10"
                : "bg-black/10"
            }`}
          />
        ))}
      </div>

      <div className={`${cardClass} p-6 lg:p-8`} style={cardBg}>
        {/* Step 1: Goal */}
        {step === 1 && (
          <div>
            <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
              Qual seu objetivo?
            </h3>
            <p className={`text-sm ${textSecondary} mb-6`}>
              Selecione o que melhor descreve sua meta de estudo.
            </p>
            <div className="space-y-3">
              {GOALS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGoal(g.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    goal === g.value
                      ? "border-primary bg-primary/10"
                      : isDark
                      ? "border-white/[0.06] hover:border-white/[0.12]"
                      : "border-gray-border/30 hover:border-gray-border/60"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      goal === g.value ? "text-primary" : textPrimary
                    }`}
                  >
                    {g.label}
                  </p>
                  <p className={`text-xs ${textSecondary} mt-1`}>
                    {g.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Exam Date */}
        {step === 2 && (
          <div>
            <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
              Tem data do exame?
            </h3>
            <p className={`text-sm ${textSecondary} mb-6`}>
              Opcional. Se tiver, o plano sera ajustado para essa data.
            </p>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className={`w-full p-3 rounded-xl border text-sm ${
                isDark
                  ? "bg-white/[0.04] border-white/[0.09] text-[#F0F0F5]"
                  : "bg-white border-gray-border/40 text-black"
              }`}
            />
            <p className={`text-xs ${textMuted} mt-2`}>
              Deixe em branco se nao tiver data definida.
            </p>
          </div>
        )}

        {/* Step 3: Hours per day */}
        {step === 3 && (
          <div>
            <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
              Horas por dia para estudo ativo
            </h3>
            <p className={`text-sm ${textSecondary} mb-6`}>
              Quanto tempo voce pode dedicar por dia assistindo aulas e praticando?
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={4}
                step={0.5}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span
                className={`text-2xl font-bold ${textPrimary} min-w-[60px] text-center`}
              >
                {hoursPerDay}h
              </span>
            </div>
            <div className={`flex justify-between text-xs ${textMuted} mt-2`}>
              <span>1h</span>
              <span>4h</span>
            </div>
          </div>
        )}

        {/* Step 4: Days per week */}
        {step === 4 && (
          <div>
            <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
              Dias por semana
            </h3>
            <p className={`text-sm ${textSecondary} mb-6`}>
              Quantos dias por semana voce pretende estudar?
            </p>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => setDaysPerWeek(d)}
                  className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200 ${
                    daysPerWeek === d
                      ? "bg-primary text-white"
                      : isDark
                      ? "bg-white/[0.04] text-white/60 border border-white/[0.06] hover:border-white/[0.12]"
                      : "bg-gray-100 text-black/60 border border-gray-border/30 hover:border-gray-border/60"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className={`text-xs ${textMuted} mt-3`}>
              {daysPerWeek} {daysPerWeek === 1 ? "dia" : "dias"} por semana
            </p>
          </div>
        )}

        {/* Step 5: Passive study */}
        {step === 5 && (
          <div>
            <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
              Tempo de estudo passivo
            </h3>
            <p className={`text-sm ${textSecondary} mb-6`}>
              Voce tem tempo extra para ouvir playlists ou podcasts (no carro,
              caminhada, etc.)?
            </p>
            <label
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                passiveStudy
                  ? "border-primary bg-primary/10"
                  : isDark
                  ? "border-white/[0.06]"
                  : "border-gray-border/30"
              }`}
            >
              <input
                type="checkbox"
                checked={passiveStudy}
                onChange={(e) => setPassiveStudy(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              <span className={`text-sm ${textPrimary}`}>
                Sim, tenho tempo para estudo passivo
              </span>
            </label>

            {passiveStudy && (
              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={0.5}
                    max={3}
                    step={0.5}
                    value={passiveHours}
                    onChange={(e) => setPassiveHours(Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span
                    className={`text-xl font-bold ${textPrimary} min-w-[50px] text-center`}
                  >
                    {passiveHours}h
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
              step === 1
                ? "opacity-30 cursor-not-allowed"
                : isDark
                ? "text-white/60 hover:text-white hover:bg-white/[0.04]"
                : "text-black/40 hover:text-black hover:bg-black/[0.04]"
            }`}
          >
            Voltar
          </button>

          {step < totalSteps ? (
            <button
              onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
              disabled={!canAdvance()}
              className={`text-sm font-bold px-6 py-2.5 rounded-full transition-all ${
                canAdvance()
                  ? "bg-primary hover:bg-[#1888e0] text-white shadow-[0_2px_8px_rgba(31,150,247,0.3)]"
                  : "bg-primary/30 text-white/40 cursor-not-allowed"
              }`}
            >
              Proximo
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="group/cta relative overflow-hidden text-sm font-bold px-7 py-2.5 rounded-full bg-primary hover:bg-[#1888e0] text-white shadow-[0_2px_8px_rgba(31,150,247,0.3)] hover:shadow-[0_4px_16px_rgba(31,150,247,0.45)] active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(45deg,transparent_25%,rgba(52,184,248,0.45)_50%,transparent_75%)] bg-[length:250%_250%] bg-[position:200%_0] group-hover/cta:bg-[position:-100%_0] transition-[background-position] duration-[800ms] ease-out pointer-events-none" />
              <span className="relative">
                {generating ? "Gerando..." : "Gerar Plano"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
