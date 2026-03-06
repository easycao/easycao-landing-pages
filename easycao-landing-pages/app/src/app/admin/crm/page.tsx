"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface PipelineStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  engagement: string;
  daysRemaining: number;
  needsManualPrice: boolean;
  enrollmentStatus: string;
  hotmartStatus: string | null;
  courseProgress: number | null;
  tags: string[];
}

interface StageData {
  count: number;
  students: PipelineStudent[];
}

interface Filters {
  hotmartStatus: string;
  engagement: string;
  enrollmentStatus: string;
  tag: string;
}

const ENGAGEMENT_COLORS: Record<string, string> = {
  NONE: "bg-gray-400",
  LOW: "bg-yellow-500",
  MEDIUM: "bg-green-500",
  HIGH: "bg-blue-500",
  VERY_HIGH: "bg-purple-500",
};

const STAGE_ORDER = [
  "dia_0",
  "dia_10",
  "mes_2",
  "mes_3",
  "mes_4",
  "mes_5",
  "mes_6",
  "mes_7",
  "mes_8",
  "mes_9",
  "mes_10",
  "mes_11",
  "mes_12",
  "antigo_aluno",
] as const;

const STAGE_LABELS: Record<string, string> = {
  dia_0: "Dia 0",
  dia_10: "Dia 10",
  mes_2: "Mês 2",
  mes_3: "Mês 3",
  mes_4: "Mês 4",
  mes_5: "Mês 5",
  mes_6: "Mês 6",
  mes_7: "Mês 7",
  mes_8: "Mês 8",
  mes_9: "Mês 9",
  mes_10: "Mês 10",
  mes_11: "Mês 11",
  mes_12: "Mês 12",
  antigo_aluno: "Antigo Aluno",
};

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-xs border border-gray-border rounded-lg px-2.5 py-2 bg-white text-black outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
      title={label}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default function CrmDashboard() {
  const [query, setQuery] = useState("");
  const [stages, setStages] = useState<Record<string, StageData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    hotmartStatus: "",
    engagement: "",
    enrollmentStatus: "",
    tag: "",
  });

  useEffect(() => {
    async function fetchPipeline() {
      try {
        const res = await fetch("/api/admin/crm/pipeline");
        const data = await res.json();
        setStages(data.stages || null);
      } catch {
        setStages(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPipeline();
  }, []);

  // Collect all unique tags from data
  const availableTags = useMemo(() => {
    if (!stages) return [];
    const tagSet = new Set<string>();
    for (const stage of STAGE_ORDER) {
      const data = stages[stage];
      if (!data) continue;
      for (const s of data.students) {
        if (s.tags) s.tags.forEach((t) => tagSet.add(t));
      }
    }
    return Array.from(tagSet).sort();
  }, [stages]);

  const filteredStages = useMemo(() => {
    if (!stages) return null;
    const q = query.trim().toLowerCase();
    const qDigits = q.replace(/\D/g, "");

    const filtered: Record<string, StageData> = {};
    for (const stage of STAGE_ORDER) {
      const data = stages[stage];
      if (!data) continue;
      const matched = data.students.filter((s) => {
        // Text search
        if (q) {
          const matchesText =
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            (qDigits && s.phone.replace(/\D/g, "").includes(qDigits));
          if (!matchesText) return false;
        }

        // Filters
        if (filters.hotmartStatus) {
          if (filters.hotmartStatus === "ACTIVE" && s.hotmartStatus !== "ACTIVE") return false;
          if (filters.hotmartStatus === "BLOCKED" && !s.hotmartStatus?.startsWith("BLOCKED")) return false;
          if (filters.hotmartStatus === "NONE" && s.hotmartStatus) return false;
        }
        if (filters.engagement && s.engagement !== filters.engagement) return false;
        if (filters.enrollmentStatus) {
          if (filters.enrollmentStatus === "active" && s.enrollmentStatus !== "active") return false;
          if (filters.enrollmentStatus === "refunded" && s.enrollmentStatus !== "refunded") return false;
        }
        if (filters.tag && (!s.tags || !s.tags.includes(filters.tag))) return false;

        return true;
      });
      filtered[stage] = { count: matched.length, students: matched };
    }
    return filtered;
  }, [stages, query, filters]);

  const activeCount = useMemo(() => {
    if (!filteredStages) return 0;
    let count = 0;
    for (const stage of STAGE_ORDER) {
      const data = filteredStages[stage];
      if (!data) continue;
      count += data.students.filter((s) => s.hotmartStatus === "ACTIVE").length;
    }
    return count;
  }, [filteredStages]);

  const filteredTotal = useMemo(() => {
    if (!filteredStages) return 0;
    return STAGE_ORDER.reduce((sum, s) => sum + (filteredStages[s]?.count || 0), 0);
  }, [filteredStages]);

  const hasActiveFilters =
    filters.hotmartStatus || filters.engagement || filters.enrollmentStatus || filters.tag;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Search + Filters */}
      <div className="mb-4 flex-shrink-0 space-y-3">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Filtrar por nome, email ou telefone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-border bg-white text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 shadow-sm text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <FilterSelect
              label="Status"
              value={filters.hotmartStatus}
              onChange={(v) => setFilters((f) => ({ ...f, hotmartStatus: v }))}
              options={[
                { value: "ACTIVE", label: "Ativo" },
                { value: "BLOCKED", label: "Bloqueado" },
                { value: "NONE", label: "Sem status" },
              ]}
            />
            <FilterSelect
              label="Engajamento"
              value={filters.engagement}
              onChange={(v) => setFilters((f) => ({ ...f, engagement: v }))}
              options={[
                { value: "NONE", label: "Nenhum" },
                { value: "LOW", label: "Baixo" },
                { value: "MEDIUM", label: "Médio" },
                { value: "HIGH", label: "Alto" },
                { value: "VERY_HIGH", label: "Muito Alto" },
              ]}
            />
            <FilterSelect
              label="Pagamento"
              value={filters.enrollmentStatus}
              onChange={(v) => setFilters((f) => ({ ...f, enrollmentStatus: v }))}
              options={[
                { value: "active", label: "Processado" },
                { value: "refunded", label: "Reembolsado" },
              ]}
            />
            {availableTags.length > 0 && (
              <FilterSelect
                label="Tag"
                value={filters.tag}
                onChange={(v) => setFilters((f) => ({ ...f, tag: v }))}
                options={availableTags.map((t) => ({ value: t, label: t }))}
              />
            )}
            {hasActiveFilters && (
              <button
                onClick={() =>
                  setFilters({ hotmartStatus: "", engagement: "", enrollmentStatus: "", tag: "" })
                }
                className="text-xs text-primary hover:text-primary-dark font-medium px-2 py-2 transition-colors"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Count */}
          {!loading && (
            <span className="text-sm text-black/50 flex-shrink-0 ml-auto">
              {activeCount} ativos{hasActiveFilters || query ? ` / ${filteredTotal}` : ""}
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center flex-1">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      )}

      {/* Kanban board */}
      {!loading && filteredStages && (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-3 h-full min-w-max pb-2">
            {STAGE_ORDER.map((stageKey) => {
              const data = filteredStages[stageKey];
              if (!data) return null;
              return (
                <div
                  key={stageKey}
                  className="flex flex-col min-w-[240px] max-w-[240px] bg-gray-50 rounded-2xl border border-gray-border"
                >
                  {/* Column header */}
                  <div className="sticky top-0 z-10 bg-gray-50 rounded-t-2xl px-3 py-3 border-b border-gray-border">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-black">
                        {STAGE_LABELS[stageKey] || stageKey}
                      </h3>
                      <span className="text-xs font-medium text-black/50 bg-white border border-gray-border px-2 py-0.5 rounded-full">
                        {data.count}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {data.students.map((s) => (
                      <Link
                        key={s.id}
                        href={`/admin/crm/${s.id}`}
                        className="block bg-white rounded-xl border border-gray-border p-3 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-black group-hover:text-primary transition-colors leading-tight truncate">
                            {s.name}
                          </p>
                          {s.engagement && (
                            <span
                              className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${ENGAGEMENT_COLORS[s.engagement] || "bg-gray-400"}`}
                              title={s.engagement}
                            />
                          )}
                        </div>

                        <p className="text-xs text-black/50 truncate">
                          {s.email}
                        </p>

                        {/* Flags */}
                        {(s.needsManualPrice ||
                          s.enrollmentStatus === "refunded" ||
                          s.hotmartStatus?.startsWith("BLOCKED")) && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {s.hotmartStatus?.startsWith("BLOCKED") && (
                              <span className="text-[10px] font-medium text-gray-700 bg-gray-200 px-1.5 py-0.5 rounded-full">
                                Bloqueado
                              </span>
                            )}
                            {s.needsManualPrice && (
                              <span className="text-[10px] font-medium text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded-full">
                                Valor pendente
                              </span>
                            )}
                            {s.enrollmentStatus === "refunded" && (
                              <span className="text-[10px] font-medium text-red-700 bg-red-100 px-1.5 py-0.5 rounded-full">
                                Reembolsado
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    ))}

                    {data.students.length === 0 && (
                      <p className="text-xs text-black/30 text-center py-4">
                        Nenhum aluno
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
