"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

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
  enrolledAt: string;
  pricePaid: number;
  ltv: number;
  approved: boolean;
  csEnabled: boolean;
  extensionDays: number;
  authLinked: boolean;
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
  approved: string;
  csEnabled: string;
}

const ENGAGEMENT_COLORS: Record<string, string> = {
  NONE: "bg-gray-100 text-gray-600",
  LOW: "bg-red-100 text-red-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-emerald-100 text-emerald-700",
  VERY_HIGH: "bg-violet-100 text-violet-700",
};

const ENGAGEMENT_LABELS: Record<string, string> = {
  NONE: "NENHUM",
  LOW: "BAIXO",
  MEDIUM: "MEDIO",
  HIGH: "ALTO",
  VERY_HIGH: "MUITO ALTO",
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

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 13 && digits.startsWith("55")) {
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  if (digits.length === 12 && digits.startsWith("55")) {
    return `(${digits.slice(2, 4)}) ${digits.slice(4, 8)}-${digits.slice(8)}`;
  }
  return phone;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
          value
            ? "border-primary/30 text-primary bg-primary/5"
            : "border-gray-border text-black bg-white hover:border-gray-300"
        }`}
      >
        {icon}
        <span>{selectedLabel || label}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 min-w-[160px] rounded-xl border border-gray-border bg-white py-1 z-50 shadow-lg">
          <button
            onClick={() => { onChange(""); setOpen(false); }}
            className={`w-full text-left px-3 py-2 text-xs transition-colors ${
              !value ? "text-primary font-medium" : "text-black/50 hover:text-black hover:bg-gray-light"
            }`}
          >
            {label}
          </button>
          {options.map((o) => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                value === o.value ? "text-primary font-medium bg-primary/5" : "text-black/70 hover:text-black hover:bg-gray-light"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CrmDashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [stages, setStages] = useState<Record<string, StageData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    hotmartStatus: "",
    engagement: "",
    enrollmentStatus: "",
    tag: "",
    approved: "",
    csEnabled: "",
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
        if (filters.approved === "approved" && !s.approved) return false;
        if (filters.approved === "not_approved" && s.approved) return false;
        if (filters.csEnabled === "enabled" && !s.csEnabled) return false;
        if (filters.csEnabled === "disabled" && s.csEnabled) return false;

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
    filters.hotmartStatus || filters.engagement || filters.enrollmentStatus || filters.tag || filters.approved || filters.csEnabled;

  return (
    <div className="flex flex-col h-full">
      {/* Search + Filters */}
      <div className="mb-4 flex-shrink-0 space-y-3">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40"
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
              className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-border bg-white text-black placeholder:text-black/40 focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none transition-all duration-200 text-sm"
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
            <FilterSelect
              label="ICAO"
              value={filters.approved}
              onChange={(v) => setFilters((f) => ({ ...f, approved: v }))}
              options={[
                { value: "approved", label: "Aprovado" },
                { value: "not_approved", label: "Não aprovado" },
              ]}
            />
            <FilterSelect
              label="CS"
              value={filters.csEnabled}
              onChange={(v) => setFilters((f) => ({ ...f, csEnabled: v }))}
              options={[
                { value: "enabled", label: "CS ativo" },
                { value: "disabled", label: "CS desativado" },
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
                  setFilters({ hotmartStatus: "", engagement: "", enrollmentStatus: "", tag: "", approved: "", csEnabled: "" })
                }
                className="text-xs text-primary hover:text-primary-dark font-medium px-2 py-2 transition-colors"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Count */}
          {!loading && (
            <span className="text-base text-black font-semibold flex-shrink-0 ml-auto">
              {activeCount} ativos{hasActiveFilters || query ? ` / ${filteredTotal}` : ""}
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center flex-1">
          <svg
            className="animate-spin h-8 w-8 text-[#7DCCFF]"
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
        <div className="flex-1 overflow-x-auto overflow-y-hidden crm-scroll-h">
          <div className="flex gap-4 h-full min-w-max pb-2">
            {STAGE_ORDER.map((stageKey) => {
              const data = filteredStages[stageKey];
              if (!data) return null;
              return (
                <div
                  key={stageKey}
                  className="flex flex-col min-w-[320px] max-w-[320px] rounded-2xl border border-gray-border bg-gray-light"
                >
                  {/* Column header */}
                  <div className="sticky top-0 z-10 rounded-t-2xl px-3 py-3 border-b border-gray-border bg-gray-light">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-black">
                        {STAGE_LABELS[stageKey] || stageKey}
                      </h3>
                      <span className="text-xs font-medium text-black/70 px-2 py-0.5 rounded-full bg-gray-light border border-gray-border">
                        {data.count}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 crm-scroll">
                    {data.students.map((s) => (
                      <div
                        key={s.id}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          if (window.getSelection()?.toString()) return;
                          e.preventDefault();
                          router.push(`/admin/crm/${s.id}`);
                        }}
                        onKeyDown={(e) => { if (e.key === "Enter") router.push(`/admin/crm/${s.id}`); }}
                        className={`rounded-2xl bg-white p-4 transition-all duration-200 group cursor-pointer select-text ${
                          s.approved
                            ? "border-2 border-emerald-400 hover:border-emerald-500"
                            : !s.csEnabled
                            ? "border-2 border-red-400 hover:border-red-500"
                            : "border border-gray-border hover:border-gray-300"
                        }`}
                      >
                        {/* Name + Engagement badge */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-semibold text-black leading-tight truncate">
                            {s.name}
                          </p>
                          {s.engagement && (
                            <span
                              className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full ${ENGAGEMENT_COLORS[s.engagement] || "bg-gray-100 text-gray-600"}`}
                            >
                              {ENGAGEMENT_LABELS[s.engagement] || s.engagement}
                            </span>
                          )}
                        </div>

                        {/* Email */}
                        <p className="text-xs text-black/60 truncate">
                          {s.email}
                        </p>

                        {/* Phone */}
                        {s.phone && (
                          <p className="text-xs text-black/50 truncate mt-1">
                            {formatPhone(s.phone)}
                          </p>
                        )}

                        {/* Enrolled date + Price */}
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[13px] text-black/70">
                            {s.enrolledAt ? new Date(s.enrolledAt).toLocaleDateString("pt-BR") : "—"}
                          </span>
                          <span className="text-[13px] font-semibold text-black/70">
                            R$ {s.pricePaid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        {/* LTV + Progress number */}
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-[13px] font-bold text-primary px-2.5 py-1 rounded-full bg-primary/10">
                            LTV R$ {s.ltv.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                          {s.courseProgress != null && (
                            <span className="text-[13px] text-black/70">Progresso: {s.courseProgress}%</span>
                          )}
                        </div>

                        {/* Flags */}
                        {(s.needsManualPrice ||
                          s.enrollmentStatus === "refunded" ||
                          s.hotmartStatus?.startsWith("BLOCKED") ||
                          s.extensionDays > 0 ||
                          !s.authLinked) && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {!s.authLinked && (
                              <span className="text-[11px] font-bold text-orange-600 px-2 py-0.5 rounded-full bg-orange-50">
                                Sem conta
                              </span>
                            )}
                            {s.extensionDays > 0 && (
                              <span className="text-[11px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                                Extensão +{s.extensionDays}d
                              </span>
                            )}
                            {s.hotmartStatus?.startsWith("BLOCKED") && (
                              <span className="text-[11px] font-bold text-gray-600 px-2 py-0.5 rounded-full bg-gray-100">
                                Bloqueado
                              </span>
                            )}
                            {s.needsManualPrice && (
                              <span className="text-[11px] font-bold text-amber-600 px-2 py-0.5 rounded-full bg-amber-50">
                                Valor pendente
                              </span>
                            )}
                            {s.enrollmentStatus === "refunded" && (
                              <span className="text-[11px] font-bold text-red-600 px-2 py-0.5 rounded-full bg-red-50">
                                Reembolsado
                              </span>
                            )}
                          </div>
                        )}
                      </div>
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
