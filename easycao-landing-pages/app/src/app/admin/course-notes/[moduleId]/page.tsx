"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface LessonSummary {
  id: string;
  number: number;
  title: string;
  duration: string;
  type: string;
  hasTask: boolean;
  hasContent: boolean;
  hasFeatureIdeas: boolean;
  hasAiNotes: boolean;
  updatedAt: string | null;
}

interface ModuleData {
  id: string;
  number: number;
  name: string;
}

const TYPE_LABELS: Record<string, string> = {
  teoria: "Teoria",
  pratica: "Prática",

  revisao: "Revisão",
};

const TYPE_COLORS: Record<string, string> = {
  teoria: "bg-blue-100 text-blue-700",
  pratica: "bg-emerald-100 text-emerald-700",

  revisao: "bg-amber-100 text-amber-700",
};

export default function ModuleLessonsPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = use(params);
  const [mod, setMod] = useState<ModuleData | null>(null);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  async function fetchData() {
    const res = await fetch(`/api/admin/course-notes/${moduleId}`);
    if (!res.ok) return;
    const data = await res.json();
    setMod(data.module);
    setLessons(data.lessons || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [moduleId]);

  async function handleCreate() {
    if (!newNumber || !newTitle.trim()) return;
    setCreating(true);
    await fetch(`/api/admin/course-notes/${moduleId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: Number(newNumber), title: newTitle.trim() }),
    });
    setNewNumber("");
    setNewTitle("");
    setShowCreate(false);
    setCreating(false);
    fetchData();
  }

  async function handleDelete(lessonId: string, title: string) {
    if (!confirm(`Deletar "${title}"?`)) return;
    await fetch(`/api/admin/course-notes/${moduleId}/lessons/${lessonId}`, {
      method: "DELETE",
    });
    fetchData();
  }

  function getStatusDots(lesson: LessonSummary) {
    const dots: { label: string; active: boolean }[] = [
      { label: "Conteúdo", active: lesson.hasContent },
      { label: "Tarefa", active: lesson.hasTask },
      { label: "Features", active: lesson.hasFeatureIdeas },
      { label: "IA", active: lesson.hasAiNotes },
    ];
    return dots;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/course-notes"
          className="text-primary hover:text-primary-dark transition-colors text-sm"
        >
          &larr; Módulos
        </Link>
        {mod && (
          <h1 className="text-xl font-bold text-black">
            Módulo {mod.number} — {mod.name}
          </h1>
        )}
        <div className="ml-auto">
          <button
            onClick={() => {
              setNewNumber(String((lessons.length > 0 ? Math.max(...lessons.map((l) => l.number)) : 0) + 1));
              setShowCreate(!showCreate);
            }}
            className="text-xs font-medium px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            + Nova Aula
          </button>
        </div>
      </div>

      {/* Create lesson form */}
      {showCreate && (
        <div className="rounded-2xl p-5 mb-6 bg-gray-light border border-gray-border">
          <h2 className="text-sm font-semibold text-black mb-3">Nova Aula</h2>
          <div className="flex gap-3 items-end">
            <div className="w-20">
              <label className="text-[10px] text-black/50 block mb-1">Número</label>
              <input
                type="number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-black/50 block mb-1">Título da Aula</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Introduction to ICAO Proficiency Scale"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={creating || !newNumber || !newTitle.trim()}
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {creating ? "Criando..." : "Criar"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-border text-black/60 text-sm hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lesson list */}
      {loading ? (
        <div className="text-black/50 text-center py-12">Carregando...</div>
      ) : lessons.length === 0 ? (
        <div className="rounded-2xl p-8 text-center bg-gray-light border border-gray-border">
          <p className="text-black/50 mb-2">Nenhuma aula neste módulo.</p>
          <p className="text-black/40 text-sm">
            Adicione aulas conforme for assistindo o curso.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="rounded-2xl bg-gray-light border border-gray-border hover:border-primary/30 transition-all duration-200"
            >
              <div className="px-5 py-3.5 flex items-center gap-4">
                {/* Number */}
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                  {lesson.number}
                </span>

                {/* Title + meta */}
                <Link
                  href={`/admin/course-notes/${moduleId}/${lesson.id}`}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2">
                    <h3 className="text-black font-medium text-sm truncate">
                      {lesson.title}
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                        TYPE_COLORS[lesson.type] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {TYPE_LABELS[lesson.type] || lesson.type}
                    </span>
                    {lesson.duration && (
                      <span className="text-[10px] text-black/40 flex-shrink-0">
                        {lesson.duration}
                      </span>
                    )}
                  </div>

                  {/* Status dots */}
                  <div className="flex items-center gap-3 mt-1">
                    {getStatusDots(lesson).map((dot) => (
                      <span
                        key={dot.label}
                        className={`text-[10px] flex items-center gap-1 ${
                          dot.active ? "text-emerald-600" : "text-black/25"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            dot.active ? "bg-emerald-500" : "bg-black/15"
                          }`}
                        />
                        {dot.label}
                      </span>
                    ))}
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/admin/course-notes/${moduleId}/${lesson.id}`}
                    className="text-xs px-3 py-1.5 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(lesson.id, lesson.title)}
                    className="text-xs px-2 py-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      {lessons.length > 0 && (
        <div className="mt-6 text-center text-xs text-black/40">
          {lessons.length} aula{lessons.length !== 1 ? "s" : ""} &middot;{" "}
          {lessons.filter((l) => l.hasContent).length} com anotações
        </div>
      )}
    </div>
  );
}
