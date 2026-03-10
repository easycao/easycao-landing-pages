"use client";

import { useState, useEffect, useCallback, useRef, use, type ChangeEvent } from "react";
import Link from "next/link";

interface LessonData {
  id: string;
  number: number;
  title: string;
  duration: string;
  type: string;
  hasTask: boolean;
  content: string;
  task: string;
  featureIdeas: string;
  aiNotes: string;
  updatedAt: string | null;
}

interface ModuleData {
  id: string;
  number: number;
  name: string;
}

function autoResize(el: HTMLTextAreaElement) {
  // Save scroll position of the scrollable parent to prevent jump
  const scrollParent = el.closest(".crm-scroll") as HTMLElement | null;
  const scrollTop = scrollParent?.scrollTop ?? 0;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
  // Restore scroll position immediately
  if (scrollParent) scrollParent.scrollTop = scrollTop;
}

const LESSON_TYPES = [
  { value: "teoria", label: "Teoria" },
  { value: "pratica", label: "Prática" },
  { value: "revisao", label: "Revisão" },
];

function TypeDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LESSON_TYPES.find((t) => t.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="w-32" ref={ref}>
      <label className="text-[10px] text-black/50 block mb-1">Tipo</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm text-left transition-all duration-200 cursor-pointer ${
            open
              ? "border-primary/40 ring-2 ring-primary/30 bg-white"
              : "border-gray-border bg-white hover:border-primary/20"
          }`}
        >
          <span className="text-black">{current?.label || value}</span>
          <svg
            className={`w-3.5 h-3.5 text-black/40 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-gray-border bg-white py-1 z-50 shadow-lg">
            {LESSON_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  onChange(t.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  value === t.value
                    ? "text-primary font-medium bg-primary/5"
                    : "text-black/70 hover:text-black hover:bg-gray-light"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LessonEditorPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = use(params);
  const [mod, setMod] = useState<ModuleData | null>(null);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lessonRef = useRef<LessonData | null>(null);

  async function fetchData() {
    const res = await fetch(
      `/api/admin/course-notes/${moduleId}/lessons/${lessonId}`
    );
    if (!res.ok) return;
    const data = await res.json();
    setMod(data.module);
    setLesson(data.lesson);
    lessonRef.current = data.lesson;
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [moduleId, lessonId]);

  const saveLesson = useCallback(
    async (data: Partial<LessonData>) => {
      setSaving(true);
      try {
        await fetch(
          `/api/admin/course-notes/${moduleId}/lessons/${lessonId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        setLastSaved(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        setDirty(false);
      } finally {
        setSaving(false);
      }
    },
    [moduleId, lessonId]
  );

  // Auto-save after 2 seconds of inactivity on text fields
  const scheduleAutoSave = useCallback(
    (field: string, value: string) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      setDirty(true);
      saveTimeoutRef.current = setTimeout(() => {
        saveLesson({ [field]: value });
      }, 2000);
    },
    [saveLesson]
  );

  // Immediate save for selects/toggles
  function handleImmediateSave(field: string, value: unknown) {
    if (!lesson) return;
    const updated = { ...lesson, [field]: value };
    setLesson(updated);
    lessonRef.current = updated;
    saveLesson({ [field]: value });
  }

  function handleTextChange(field: keyof LessonData, value: string) {
    if (!lesson) return;
    const updated = { ...lesson, [field]: value };
    setLesson(updated);
    lessonRef.current = updated;
    scheduleAutoSave(field, value);
  }

  // Save on Ctrl+S
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (lessonRef.current && dirty) {
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          saveLesson({
            title: lessonRef.current.title,
            duration: lessonRef.current.duration,
            content: lessonRef.current.content,
            task: lessonRef.current.task,
            featureIdeas: lessonRef.current.featureIdeas,
            aiNotes: lessonRef.current.aiNotes,
          });
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dirty, saveLesson]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-black/50 text-center py-12">
        Carregando...
      </div>
    );
  }

  if (!lesson || !mod) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-black/50 mb-4">Aula não encontrada.</p>
        <Link href="/admin/course-notes" className="text-primary text-sm">
          Voltar aos módulos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/admin/course-notes/${moduleId}`}
          className="text-primary hover:text-primary-dark transition-colors text-sm"
        >
          &larr; Módulo {mod.number}
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-black truncate">
            Aula {lesson.number} — {lesson.title}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {saving && (
            <span className="text-xs text-primary animate-pulse">
              Salvando...
            </span>
          )}
          {!saving && dirty && (
            <span className="text-xs text-amber-600">Alterações pendentes</span>
          )}
          {!saving && !dirty && lastSaved && (
            <span className="text-xs text-black/40">Salvo às {lastSaved}</span>
          )}
        </div>
      </div>

      {/* Metadata row */}
      <div className="rounded-2xl p-5 mb-4 bg-gray-light border border-gray-border">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] text-black/50 block mb-1">
              Título da Aula
            </label>
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => handleTextChange("title", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
            />
          </div>
          <div className="w-24">
            <label className="text-[10px] text-black/50 block mb-1">
              Duração
            </label>
            <input
              type="text"
              value={lesson.duration}
              onChange={(e) => handleTextChange("duration", e.target.value)}
              placeholder="12:30"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
            />
          </div>
          <TypeDropdown
            value={lesson.type}
            onChange={(val) => handleImmediateSave("type", val)}
          />
          <div>
            <label className="text-[10px] text-black/50 block mb-1">
              Tem tarefa?
            </label>
            <button
              onClick={() => handleImmediateSave("hasTask", !lesson.hasTask)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                lesson.hasTask
                  ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-500"
              }`}
            >
              {lesson.hasTask ? "Sim" : "Não"}
            </button>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-4">
        {/* Conteúdo */}
        <div className="rounded-2xl p-5 bg-gray-light border border-gray-border">
          <label className="text-sm font-semibold text-black block mb-1">
            Conteúdo da Aula
          </label>
          <p className="text-[10px] text-black/40 mb-3">
            O que a aula ensina? Tópicos, conceitos, exemplos. Escreva
            naturalmente.
          </p>
          <textarea
            value={lesson.content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { handleTextChange("content", e.target.value); autoResize(e.target); }}

            ref={(el) => { if (el) autoResize(el); }}
            rows={4}
            placeholder="Descreva o conteúdo desta aula..."
            className="w-full px-4 py-3 rounded-xl border border-gray-border bg-white text-black text-sm leading-relaxed focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none resize-none overflow-hidden"
          />
        </div>

        {/* Tarefa */}
        {lesson.hasTask && <div className="rounded-2xl p-5 bg-gray-light border border-gray-border">
          <label className="text-sm font-semibold text-black block mb-1">
            Tarefa Pós-Aula
          </label>
          <p className="text-[10px] text-black/40 mb-3">
            Qual a tarefa que o aluno deve fazer após esta aula? (se houver)
          </p>
          <textarea
            value={lesson.task}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { handleTextChange("task", e.target.value); autoResize(e.target); }}

            ref={(el) => { if (el) autoResize(el); }}
            rows={3}
            placeholder="Descreva a tarefa..."
            className="w-full px-4 py-3 rounded-xl border border-gray-border bg-white text-black text-sm leading-relaxed focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none resize-none overflow-hidden"
          />
        </div>}

        {/* Ideias de Features */}
        <div className="rounded-2xl p-5 bg-gray-light border border-gray-border">
          <label className="text-sm font-semibold text-black block mb-1">
            Ideias de Features & Gamificação
          </label>
          <p className="text-[10px] text-black/40 mb-3">
            Ideias de funcionalidades, tipos de exercícios, gamificação
            específica para esta aula ou tipo de aula.
          </p>
          <textarea
            value={lesson.featureIdeas}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { handleTextChange("featureIdeas", e.target.value); autoResize(e.target); }}

            ref={(el) => { if (el) autoResize(el); }}
            rows={3}
            placeholder="Suas ideias..."
            className="w-full px-4 py-3 rounded-xl border border-gray-border bg-white text-black text-sm leading-relaxed focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none resize-none overflow-hidden"
          />
        </div>

        {/* Notas para IA */}
        <div className="rounded-2xl p-5 bg-gray-light border border-gray-border">
          <label className="text-sm font-semibold text-black block mb-1">
            Notas para o Agente IA
          </label>
          <p className="text-[10px] text-black/40 mb-3">
            O que o agente de IA deveria saber para ajudar alunos com dúvidas
            sobre este conteúdo? Regras, exceções, dicas, erros comuns.
          </p>
          <textarea
            value={lesson.aiNotes}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { handleTextChange("aiNotes", e.target.value); autoResize(e.target); }}

            ref={(el) => { if (el) autoResize(el); }}
            rows={3}
            placeholder="Informações para o agente IA..."
            className="w-full px-4 py-3 rounded-xl border border-gray-border bg-white text-black text-sm leading-relaxed focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none resize-none overflow-hidden"
          />
        </div>
      </div>

      {/* Bottom save info */}
      <div className="mt-6 mb-8 text-center text-xs text-black/40">
        Auto-save ativo &middot; Ctrl+S para salvar imediatamente
      </div>
    </div>
  );
}
