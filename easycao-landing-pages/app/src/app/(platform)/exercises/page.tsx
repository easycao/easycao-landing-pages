"use client";

import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

const SECTIONS = [
  {
    title: "Banco de Questões",
    description:
      "Pratique questões individuais de cada parte do exame ICAO. Escolha a parte e treine no seu ritmo.",
    href: "/exercises/bank",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Playlists",
    description:
      "Grave respostas para playlists temáticas e ouça sua própria reprodução completa.",
    href: "/exercises/playlists",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
        />
      </svg>
    ),
    color: "from-emerald-500 to-emerald-600",
  },
];

export default function ExercisesPage() {
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
      <h2
        className={`text-sm font-bold uppercase tracking-[0.08em] mb-5 ${
          isDark ? "text-white/50" : "text-black/70"
        }`}
      >
        Exercícios
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={`${cardClass} overflow-hidden text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg block`}
            style={cardBg}
          >
            <div className={`h-2 bg-gradient-to-r ${section.color}`} />
            <div className="p-6">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  isDark ? "bg-white/[0.06]" : "bg-gray-100"
                }`}
              >
                <span className={isDark ? "text-white/70" : "text-black/60"}>
                  {section.icon}
                </span>
              </div>
              <h3 className={`text-[15px] font-bold ${textPrimary} mb-2`}>
                {section.title}
              </h3>
              <p
                className={`text-xs ${textSecondary} leading-relaxed line-clamp-3`}
              >
                {section.description}
              </p>
              <div className="mt-4">
                <span className="text-xs font-bold text-primary">
                  Acessar &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
