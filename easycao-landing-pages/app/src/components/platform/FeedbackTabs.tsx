"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// --- Types ---

export interface GrammarError {
  word: string;
  category: string;
  correction: string;
  explanation: string;
}

export interface PhonemeDetail {
  phoneme: string;
  score: number;
}

export interface WordScore {
  word: string;
  score: number;
  phonemes?: PhonemeDetail[];
}

export interface ComprehensionPoint {
  keyPoint: string;
  matched: boolean;
}

export interface FeedbackData {
  transcription: string;
  pronunciation: number | null;
  fluency: number | null;
  errors: GrammarError[];
  correctedText: string;
  wordScores?: WordScore[];
  comprehension?: {
    score: number;
    total: number;
    points: ComprehensionPoint[];
  };
}

// --- Popovers ---

function ErrorPopover({
  error,
  onClose,
}: {
  error: GrammarError;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl shadow-lg border ${
        isDark
          ? "bg-[#1a1a2e] border-white/10"
          : "bg-white border-gray-200 shadow-xl"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className={`absolute top-2 right-2 text-xs ${isDark ? "text-white/40" : "text-black/30"}`}
      >
        &times;
      </button>
      <p className="text-xs font-bold text-red-500 mb-1">{error.word}</p>
      <p className={`text-xs ${isDark ? "text-emerald-400" : "text-emerald-600"} mb-1`}>
        &rarr; {error.correction}
      </p>
      <p className={`text-[10px] uppercase tracking-wider ${isDark ? "text-white/40" : "text-black/30"} mb-1`}>
        {error.category}
      </p>
      <p className={`text-xs ${isDark ? "text-white/70" : "text-black/60"} leading-relaxed`}>
        {error.explanation}
      </p>
    </div>
  );
}

// --- Tab: Text & Corrections (Story 9.2) ---

function TextCorrectionsTab({ data }: { data: FeedbackData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";

  const [activeError, setActiveError] = useState<number | null>(null);

  // Build annotated transcription
  const errorWords = new Set(data.errors.map((e) => e.word.toLowerCase()));

  const words = data.transcription.split(/(\s+)/);

  // Group errors by category
  const categoryCounts = new Map<string, number>();
  for (const err of data.errors) {
    categoryCounts.set(err.category, (categoryCounts.get(err.category) || 0) + 1);
  }

  return (
    <div className="space-y-5">
      {/* Transcription with error highlights */}
      <div>
        <p className={`text-[11px] font-medium uppercase tracking-wider ${textSecondary} mb-2`}>
          Transcrição
        </p>
        <p className={`text-sm ${textPrimary} leading-relaxed`}>
          {words.map((word, i) => {
            const clean = word.toLowerCase().replace(/[.,!?;:]/g, "");
            const errIdx = data.errors.findIndex(
              (e) => e.word.toLowerCase() === clean
            );
            if (errIdx === -1 || !errorWords.has(clean)) {
              return <span key={i}>{word}</span>;
            }
            return (
              <span key={i} className="relative inline-block">
                <button
                  onClick={() =>
                    setActiveError(activeError === errIdx ? null : errIdx)
                  }
                  className="underline decoration-red-500 decoration-wavy underline-offset-4 cursor-pointer hover:bg-red-500/10 rounded px-0.5"
                >
                  {word}
                </button>
                {activeError === errIdx && (
                  <ErrorPopover
                    error={data.errors[errIdx]}
                    onClose={() => setActiveError(null)}
                  />
                )}
              </span>
            );
          })}
        </p>
      </div>

      {/* Grouped corrections */}
      {categoryCounts.size > 0 && (
        <div>
          <p className={`text-[11px] font-medium uppercase tracking-wider ${textSecondary} mb-2`}>
            Erros por Categoria
          </p>
          <div className="flex flex-wrap gap-2">
            {[...categoryCounts.entries()].map(([cat, count]) => (
              <span
                key={cat}
                className={`text-xs px-2.5 py-1 rounded-full ${
                  isDark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-600"
                }`}
              >
                {cat} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Corrected version */}
      {data.correctedText && (
        <div>
          <p className={`text-[11px] font-medium uppercase tracking-wider ${textSecondary} mb-2`}>
            Versão Corrigida
          </p>
          <p
            className={`text-sm leading-relaxed p-3 rounded-xl ${
              isDark ? "bg-emerald-500/10 text-emerald-300" : "bg-emerald-50 text-emerald-800"
            }`}
          >
            {data.correctedText}
          </p>
        </div>
      )}
    </div>
  );
}

// --- Tab: Pronunciation & Fluency (Story 9.3) ---

function PronunciationFluencyTab({ data }: { data: FeedbackData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";

  function scoreColor(score: number): string {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  }

  function scoreBgColor(score: number): string {
    if (score >= 80) return isDark ? "bg-emerald-500/20" : "bg-emerald-100";
    if (score >= 60) return isDark ? "bg-amber-500/20" : "bg-amber-100";
    return isDark ? "bg-red-500/20" : "bg-red-100";
  }

  // Get worst words
  const worstWords = (data.wordScores || [])
    .filter((w) => w.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Gauge visuals */}
      <div className="grid grid-cols-2 gap-4">
        {data.pronunciation !== null && (
          <div
            className={`p-4 rounded-xl text-center ${scoreBgColor(data.pronunciation)}`}
          >
            <p className={`text-[11px] ${textSecondary} mb-1`}>Pronúncia</p>
            <p className={`text-3xl font-bold ${scoreColor(data.pronunciation)}`}>
              {Math.round(data.pronunciation)}%
            </p>
          </div>
        )}
        {data.fluency !== null && (
          <div className={`p-4 rounded-xl text-center ${scoreBgColor(data.fluency)}`}>
            <p className={`text-[11px] ${textSecondary} mb-1`}>Fluência</p>
            <p className={`text-3xl font-bold ${scoreColor(data.fluency)}`}>
              {Math.round(data.fluency)}%
            </p>
          </div>
        )}
      </div>

      {/* Word-level coloring */}
      {data.wordScores && data.wordScores.length > 0 && (
        <div>
          <p className={`text-[11px] font-medium uppercase tracking-wider ${textSecondary} mb-2`}>
            Pronúncia por Palavra
          </p>
          <p className="text-sm leading-loose">
            {data.wordScores.map((ws, i) => (
              <span
                key={i}
                className={`inline-block mr-1 px-1 rounded ${scoreColor(ws.score)} ${
                  ws.score < 60
                    ? isDark
                      ? "bg-red-500/10"
                      : "bg-red-50"
                    : ""
                }`}
                title={`${ws.word}: ${Math.round(ws.score)}%`}
              >
                {ws.word}
              </span>
            ))}
          </p>
        </div>
      )}

      {/* Worst words */}
      {worstWords.length > 0 && (
        <div>
          <p className={`text-[11px] font-medium uppercase tracking-wider ${textSecondary} mb-2`}>
            Palavras para Melhorar
          </p>
          <div className="space-y-1.5">
            {worstWords.map((w, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? "text-white/80" : "text-black/80"}`}>
                  {w.word}
                </span>
                <span className={`text-xs font-bold ${scoreColor(w.score)}`}>
                  {Math.round(w.score)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Tab: Comprehension (Story 9.4) ---

function ComprehensionTab({ data }: { data: FeedbackData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";

  if (!data.comprehension) return null;

  const { score, total, points } = data.comprehension;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Score */}
      <div
        className={`p-4 rounded-xl text-center ${
          percentage >= 70
            ? isDark
              ? "bg-emerald-500/15"
              : "bg-emerald-50"
            : isDark
              ? "bg-amber-500/15"
              : "bg-amber-50"
        }`}
      >
        <p className={`text-[11px] ${textSecondary} mb-1`}>Compreensão</p>
        <p
          className={`text-3xl font-bold ${
            percentage >= 70 ? "text-emerald-500" : "text-amber-500"
          }`}
        >
          {score}/{total} ({percentage}%)
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-2">
        {points.map((point, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className={`mt-0.5 text-sm ${point.matched ? "text-emerald-500" : "text-red-500"}`}>
              {point.matched ? "✓" : "✗"}
            </span>
            <p className={`text-sm ${textPrimary} leading-relaxed`}>
              {point.keyPoint}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Tabs Component ---

export default function FeedbackTabs({ data }: { data: FeedbackData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";

  const hasComprehension = !!data.comprehension;
  const hasPronunciation = data.pronunciation !== null || data.fluency !== null;

  type TabId = "text" | "pronunciation" | "comprehension";
  const [activeTab, setActiveTab] = useState<TabId>("text");

  const tabs: { id: TabId; label: string; show: boolean }[] = [
    { id: "text", label: "Texto & Correções", show: true },
    { id: "pronunciation", label: "Pronúncia & Fluência", show: hasPronunciation },
    { id: "comprehension", label: "Compreensão", show: hasComprehension },
  ];

  const visibleTabs = tabs.filter((t) => t.show);

  return (
    <div>
      {/* Tab headers */}
      {visibleTabs.length > 1 && (
        <div className={`flex gap-1 mb-4 p-1 rounded-xl ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? isDark
                    ? "bg-white/10 text-white"
                    : "bg-white text-black shadow-sm"
                  : `${textSecondary} hover:opacity-70`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab content */}
      {activeTab === "text" && <TextCorrectionsTab data={data} />}
      {activeTab === "pronunciation" && <PronunciationFluencyTab data={data} />}
      {activeTab === "comprehension" && <ComprehensionTab data={data} />}
    </div>
  );
}
