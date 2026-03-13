"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

const PARTS = [
  {
    id: "P1",
    name: "Part 1 — Interaction",
    description:
      "Responda perguntas do examinador sobre temas gerais de aviação.",
    color: "from-blue-500 to-blue-600",
    iconColor: "text-blue-500",
  },
  {
    id: "P2",
    name: "Part 2 — Situation & Comprehension",
    description:
      "Ouça comunicações ATC e responda sobre situações de voo.",
    color: "from-emerald-500 to-emerald-600",
    iconColor: "text-emerald-500",
  },
  {
    id: "P3",
    name: "Part 3 — Reported Speech",
    description:
      "Ouça e reproduza comunicações em reported speech.",
    color: "from-purple-500 to-purple-600",
    iconColor: "text-purple-500",
  },
  {
    id: "P4",
    name: "Part 4 — Extended Description",
    description:
      "Descreva e discuta uma imagem de forma detalhada.",
    color: "from-amber-500 to-amber-600",
    iconColor: "text-amber-500",
  },
];

export default function ExerciseBankPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/exercises"
          className={`text-xs font-medium ${textSecondary} hover:opacity-70 transition-colors`}
        >
          &larr; Exercícios
        </Link>
      </div>

      <h2
        className={`text-sm font-bold uppercase tracking-[0.08em] mb-5 ${
          isDark ? "text-white/50" : "text-black/70"
        }`}
      >
        Banco de Questões
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {PARTS.map((part) => (
          <Link
            key={part.id}
            href={`/exercises/bank/${part.id}`}
            className={`${cardClass} overflow-hidden text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg block`}
            style={cardBg}
          >
            <div className={`h-2 bg-gradient-to-r ${part.color}`} />
            <div className="p-5">
              <h3 className={`text-[15px] font-bold ${textPrimary} mb-1`}>
                {part.name}
              </h3>
              <p
                className={`text-xs ${textSecondary} mb-4 line-clamp-2 leading-relaxed`}
              >
                {part.description}
              </p>
              <span className="text-xs font-bold text-primary">
                Ver questões &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
