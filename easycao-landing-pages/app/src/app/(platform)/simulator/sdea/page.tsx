"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

interface SdeaVersion {
  id: string;
  name: string;
  type: "aviao" | "helicoptero";
  indexes: number[];
  completed: boolean;
}

export default function SdeaPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [versions, setVersions] = useState<SdeaVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);

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
      try {
        const res = await fetch("/api/simulator/sdea");
        if (res.ok) {
          const data = await res.json();
          setVersions(data.versions || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function startExam(versionId: string) {
    setCreating(versionId);
    try {
      const res = await fetch("/api/simulator/sdea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (data.examId) {
        router.push(`/simulator/exam/${data.examId}`);
      }
    } catch {
      setCreating(null);
    }
  }

  const aviaoVersions = versions.filter((v) => v.type === "aviao");
  const heliVersions = versions.filter((v) => v.type === "helicoptero");
  const completedCount = versions.filter((v) => v.completed).length;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className={`text-sm ${textSecondary}`}>
          Carregando provas SDEA...
        </div>
      </div>
    );
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
        <div>
          <h2
            className={`text-sm font-bold uppercase tracking-[0.08em] mb-1 ${
              isDark ? "text-white/50" : "text-black/70"
            }`}
          >
            Provas Prontas SDEA
          </h2>
          <p className={`text-xs ${textSecondary}`}>
            {completedCount} de {versions.length} concluídas
          </p>
        </div>
      </div>

      {/* Avião section */}
      <div className="mb-8">
        <h3
          className={`text-xs font-bold uppercase tracking-wider mb-3 ${
            isDark ? "text-white/40" : "text-black/30"
          }`}
        >
          Avião ({aviaoVersions.length} versões)
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {aviaoVersions.map((version) => (
            <button
              key={version.id}
              onClick={() => startExam(version.id)}
              disabled={creating !== null}
              className={`${cardClass} p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50`}
              style={cardBg}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      version.completed
                        ? "bg-emerald-500/20 text-emerald-500"
                        : isDark
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {version.completed ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-sm font-medium ${textPrimary} block`}
                    >
                      {version.name}
                    </span>
                    <span className={`text-[10px] ${textSecondary}`}>
                      {version.indexes.length} questões
                    </span>
                  </div>
                </div>
                {creating === version.id ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-xs font-bold text-primary">
                    Iniciar &rarr;
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Helicóptero section */}
      <div>
        <h3
          className={`text-xs font-bold uppercase tracking-wider mb-3 ${
            isDark ? "text-white/40" : "text-black/30"
          }`}
        >
          Helicóptero ({heliVersions.length} versões)
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {heliVersions.map((version) => (
            <button
              key={version.id}
              onClick={() => startExam(version.id)}
              disabled={creating !== null}
              className={`${cardClass} p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50`}
              style={cardBg}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      version.completed
                        ? "bg-emerald-500/20 text-emerald-500"
                        : isDark
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {version.completed ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-sm font-medium ${textPrimary} block`}
                    >
                      {version.name}
                    </span>
                    <span className={`text-[10px] ${textSecondary}`}>
                      {version.indexes.length} questões
                    </span>
                  </div>
                </div>
                {creating === version.id ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-xs font-bold text-primary">
                    Iniciar &rarr;
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
