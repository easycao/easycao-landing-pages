"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";

interface CronMessageLog {
  name: string;
  email: string;
  phone: string;
  stage: string;
  template: string;
  engagement: string;
  progress: number | null;
  success: boolean;
}

interface CronLog {
  id: string;
  executedAt: string | null;
  durationMs: number;
  processed: number;
  sent: number;
  skippedBlocked: number;
  autoBlocked: number;
  errors: number;
  messages: CronMessageLog[];
  autoBlockedList: string[];
  fatalError: string | null;
}

const STAGE_LABELS: Record<string, string> = {
  dia_10: "Dia 10",
  mes_2: "Mês 2",
  mes_4: "Mês 4",
  mes_7: "Mês 7",
  mes_10: "Mês 10",
};

const STAGE_ORDER: Record<string, number> = {
  dia_10: 0,
  mes_2: 1,
  mes_4: 2,
  mes_7: 3,
  mes_10: 4,
};

const ENGAGEMENT_LABELS: Record<string, string> = {
  NONE: "Nenhum",
  LOW: "Baixo",
  MEDIUM: "Médio",
  HIGH: "Alto",
  VERY_HIGH: "Muito Alto",
};

const ENGAGEMENT_COLORS: Record<string, string> = {
  NONE: "bg-gray-100 text-gray-600",
  LOW: "bg-red-100 text-red-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-emerald-100 text-emerald-700",
  VERY_HIGH: "bg-violet-100 text-violet-700",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const remainSecs = secs % 60;
  return `${mins}m${remainSecs}s`;
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const local =
    digits.startsWith("55") && digits.length >= 12
      ? digits.slice(2)
      : digits;
  if (local.length === 11) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }
  if (local.length === 10) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }
  return phone;
}

type DateFilter = "last_10" | "today" | "yesterday" | "last_month" | "all" | "custom";

const DATE_FILTER_LABELS: Record<DateFilter, string> = {
  today: "Hoje",
  yesterday: "Ontem",
  last_10: "Últimos 10 dias",
  last_month: "Último mês",
  all: "Máximo",
  custom: "Personalizado",
};

const DATE_FILTER_OPTIONS: DateFilter[] = ["today", "yesterday", "last_10", "last_month", "all", "custom"];

function getDateRange(filter: DateFilter): { start: Date | null; end: Date | null } {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter) {
    case "today":
      return { start: startOfToday, end: null };
    case "yesterday": {
      const yesterday = new Date(startOfToday);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: startOfToday };
    }
    case "last_10": {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - 10);
      return { start: d, end: null };
    }
    case "last_month": {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - 30);
      return { start: d, end: null };
    }
    case "all":
      return { start: null, end: null };
    case "custom":
      return { start: null, end: null };
  }
}

export default function CronLogsPage() {
  const [logs, setLogs] = useState<CronLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>("last_10");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/admin/crm/cron-logs")
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredLogs = useMemo(() => {
    if (dateFilter === "all") return logs;

    let start: Date | null;
    let end: Date | null;

    if (dateFilter === "custom") {
      start = customStart ? new Date(customStart + "T00:00:00") : null;
      end = customEnd ? new Date(customEnd + "T23:59:59") : null;
    } else {
      const range = getDateRange(dateFilter);
      start = range.start;
      end = range.end;
    }

    return logs.filter((log) => {
      if (!log.executedAt) return false;
      const d = new Date(log.executedAt);
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });
  }, [logs, dateFilter, customStart, customEnd]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/crm"
          className="text-primary hover:text-primary-dark transition-colors text-sm"
        >
          &larr; Voltar
        </Link>
        <h1 className="text-xl font-bold text-black">Log de Mensagens</h1>

        <div className="ml-auto flex items-center gap-3">
          {/* Date filter dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer border-primary/30 text-primary bg-primary/5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{DATE_FILTER_LABELS[dateFilter]}</span>
              <svg className={`w-3 h-3 transition-transform ${filterOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {filterOpen && (
              <div className="absolute top-full right-0 mt-1.5 min-w-[200px] rounded-xl border border-gray-border bg-white py-1 z-50 shadow-lg">
                {DATE_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDateFilter(opt);
                      if (opt !== "custom") setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      dateFilter === opt ? "text-primary font-medium bg-primary/5" : "text-black/70 hover:text-black hover:bg-gray-light"
                    }`}
                  >
                    {DATE_FILTER_LABELS[opt]}
                  </button>
                ))}

                {/* Custom date inputs */}
                {dateFilter === "custom" && (
                  <div className="px-3 py-2 border-t border-gray-border space-y-2">
                    <div>
                      <label className="text-[10px] text-black/50 block mb-0.5">Início</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-border bg-white text-xs text-black focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-black/50 block mb-0.5">Fim</label>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-border bg-white text-xs text-black focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
                      />
                    </div>
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="w-full text-xs font-medium text-white bg-primary hover:bg-primary-dark px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Count */}
          {!loading && (
            <span className="text-xs text-black/50">
              {filteredLogs.length} log{filteredLogs.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-black/50 text-center py-12">Carregando...</div>
      ) : filteredLogs.length === 0 ? (
        <div className="rounded-2xl p-8 text-center bg-gray-light border border-gray-border">
          <p className="text-black/50">
            {logs.length === 0
              ? "Nenhum log encontrado. Os logs serão criados automaticamente quando o cron rodar."
              : "Nenhum log encontrado para o período selecionado."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const isExpanded = expandedId === log.id;
            const hasErrors = log.errors > 0 || log.fatalError;

            return (
              <div
                key={log.id}
                className="rounded-2xl overflow-hidden transition-all duration-200 bg-gray-light border border-gray-border"
              >
                {/* Collapsed header */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : log.id)
                  }
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-black font-semibold">
                      {log.executedAt
                        ? formatDate(log.executedAt)
                        : "Data desconhecida"}
                    </span>
                    {log.executedAt && (
                      <span className="text-black/50 text-sm">
                        {formatTime(log.executedAt)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Summary pills */}
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                      {log.sent} enviada{log.sent !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-black/60 font-medium">
                      {log.processed} processados
                    </span>
                    {hasErrors && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                        {log.errors} erro{log.errors !== 1 ? "s" : ""}
                      </span>
                    )}
                    {log.autoBlocked > 0 && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                        {log.autoBlocked} bloqueado{log.autoBlocked !== 1 ? "s" : ""}
                      </span>
                    )}

                    {/* Chevron */}
                    <svg
                      className={`w-5 h-5 text-black/40 transition-transform duration-200 ml-2 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-border">
                    {/* Stats row */}
                    <div className="flex flex-wrap gap-4 py-4 text-sm">
                      <div>
                        <span className="text-black/50">Duração: </span>
                        <span className="text-black font-medium">
                          {formatDuration(log.durationMs)}
                        </span>
                      </div>
                      <div>
                        <span className="text-black/50">Processados: </span>
                        <span className="text-black font-medium">
                          {log.processed}
                        </span>
                      </div>
                      <div>
                        <span className="text-black/50">Enviados: </span>
                        <span className="text-emerald-700 font-medium">
                          {log.sent}
                        </span>
                      </div>
                      <div>
                        <span className="text-black/50">Bloqueados: </span>
                        <span className="text-black font-medium">
                          {log.skippedBlocked}
                        </span>
                      </div>
                      {log.autoBlocked > 0 && (
                        <div>
                          <span className="text-black/50">Auto-bloqueados: </span>
                          <span className="text-amber-700 font-medium">
                            {log.autoBlocked}
                          </span>
                        </div>
                      )}
                      {log.errors > 0 && (
                        <div>
                          <span className="text-black/50">Erros: </span>
                          <span className="text-red-700 font-medium">
                            {log.errors}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Fatal error */}
                    {log.fatalError && (
                      <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                        <span className="font-semibold">Erro fatal: </span>
                        {log.fatalError}
                      </div>
                    )}

                    {/* Messages table */}
                    {log.messages.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-black/50 text-left text-xs uppercase tracking-wider">
                              <th className="pb-2 pr-4 font-medium">Nome</th>
                              <th className="pb-2 pr-4 font-medium">Email</th>
                              <th className="pb-2 pr-4 font-medium">Telefone</th>
                              <th className="pb-2 pr-4 font-medium">Etapa</th>
                              <th className="pb-2 pr-4 font-medium">Template</th>
                              <th className="pb-2 pr-4 font-medium">Engajamento</th>
                              <th className="pb-2 pr-4 font-medium">Progresso</th>
                              <th className="pb-2 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const sorted = [...log.messages].sort((a, b) => (STAGE_ORDER[a.stage] ?? 99) - (STAGE_ORDER[b.stage] ?? 99));
                              return sorted.map((msg, i) => {
                                const isFirst = i === 0;
                                const isLast = i === sorted.length - 1;
                                return (
                                  <tr
                                    key={i}
                                    className="bg-white border-x border-t border-gray-border last:border-b"
                                  >
                                    <td className={`py-2.5 pl-4 pr-4 text-black font-medium ${isFirst ? "rounded-tl-xl" : ""} ${isLast ? "rounded-bl-xl" : ""}`}>
                                      {msg.name}
                                    </td>
                                    <td className="py-2.5 pr-4 text-black/60 text-xs">
                                      {msg.email}
                                    </td>
                                    <td className="py-2.5 pr-4 text-black/50 text-xs">
                                      {formatPhone(msg.phone)}
                                    </td>
                                    <td className="py-2.5 pr-4 text-black font-medium">
                                      {STAGE_LABELS[msg.stage] || msg.stage}
                                    </td>
                                    <td className="py-2.5 pr-4 text-black/50 font-mono text-xs">
                                      {msg.template}
                                    </td>
                                    <td className="py-2.5 pr-4">
                                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${ENGAGEMENT_COLORS[msg.engagement] || "bg-gray-100 text-gray-600"}`}>
                                        {ENGAGEMENT_LABELS[msg.engagement] || msg.engagement}
                                      </span>
                                    </td>
                                    <td className="py-2.5 pr-4 text-black">
                                      {msg.progress != null
                                        ? `${msg.progress}%`
                                        : "—"}
                                    </td>
                                    <td className={`py-2.5 pr-4 ${isFirst ? "rounded-tr-xl" : ""} ${isLast ? "rounded-br-xl" : ""}`}>
                                      {msg.success ? (
                                        <span className="text-emerald-700 font-medium">
                                          Enviado
                                        </span>
                                      ) : (
                                        <span className="text-red-700 font-medium">
                                          Falhou
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-black/50 text-sm py-2">
                        Nenhuma mensagem elegível neste dia.
                      </p>
                    )}

                    {/* Auto-blocked list */}
                    {log.autoBlockedList.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-border">
                        <p className="text-black/50 text-xs uppercase tracking-wider mb-2 font-medium">
                          Auto-bloqueados
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {log.autoBlockedList.map((email) => (
                            <span
                              key={email}
                              className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700"
                            >
                              {email}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
