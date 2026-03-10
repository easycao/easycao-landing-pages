"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  order: number;
  status: string;
  kinescopeVideoId: string;
  duration: string;
}

export default function ModuleLessonsPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const { courseId, moduleId } = use(params);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Partial<Lesson>>({});

  const basePath = `/api/admin/cms/courses/${courseId}/modules/${moduleId}/lessons`;

  async function fetchLessons() {
    const res = await fetch(basePath);
    const data = await res.json();
    setLessons(data.lessons || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchLessons();
  }, [courseId, moduleId]);

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setCreating(true);
    await fetch(basePath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), order: lessons.length }),
    });
    setNewTitle("");
    setShowCreate(false);
    setCreating(false);
    fetchLessons();
  }

  async function handleDelete(lessonId: string, title: string) {
    if (!confirm(`Deletar "${title}"?`)) return;
    await fetch(`${basePath}/${lessonId}`, { method: "DELETE" });
    fetchLessons();
  }

  async function saveLesson(lessonId: string, update: Partial<Lesson>) {
    await fetch(`${basePath}/${lessonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    setEditingId(null);
    fetchLessons();
  }

  async function swapOrder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= lessons.length) return;
    const a = lessons[index];
    const b = lessons[target];
    await Promise.all([
      fetch(`${basePath}/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`${basePath}/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: a.order }),
      }),
    ]);
    fetchLessons();
  }

  async function toggleStatus(lesson: Lesson) {
    const newStatus = lesson.status === "published" ? "draft" : "published";
    await fetch(`${basePath}/${lesson.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchLessons();
  }

  function startEdit(lesson: Lesson) {
    setEditingId(lesson.id);
    setEditFields({
      title: lesson.title,
      kinescopeVideoId: lesson.kinescopeVideoId,
      duration: lesson.duration,
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/admin/cms/courses/${courseId}`}
          className="text-primary hover:text-primary-dark transition-colors text-sm"
        >
          &larr; Módulos
        </Link>
        <h1 className="text-xl font-bold text-black">Aulas do Módulo</h1>
        <div className="ml-auto">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="text-xs font-medium px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            + Nova Aula
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="rounded-2xl p-5 mb-4 bg-gray-light border border-gray-border">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-[10px] text-black/50 block mb-1">
                Título da Aula
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Ex: Introduction to ICAO Proficiency Scale"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={creating || !newTitle.trim()}
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

      {loading ? (
        <div className="text-black/50 text-center py-12">Carregando...</div>
      ) : lessons.length === 0 ? (
        <div className="rounded-2xl p-8 text-center bg-gray-light border border-gray-border">
          <p className="text-black/50">Nenhuma aula neste módulo.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="rounded-2xl bg-gray-light border border-gray-border"
            >
              <div className="px-5 py-3.5">
                {editingId === lesson.id ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={editFields.title || ""}
                        onChange={(e) =>
                          setEditFields({ ...editFields, title: e.target.value })
                        }
                        placeholder="Título"
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                      />
                      <input
                        type="text"
                        value={editFields.duration || ""}
                        onChange={(e) =>
                          setEditFields({
                            ...editFields,
                            duration: e.target.value,
                          })
                        }
                        placeholder="12:30"
                        className="w-20 px-3 py-2 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      value={editFields.kinescopeVideoId || ""}
                      onChange={(e) =>
                        setEditFields({
                          ...editFields,
                          kinescopeVideoId: e.target.value,
                        })
                      }
                      placeholder="Kinescope Video ID"
                      className="w-full px-3 py-2 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveLesson(lesson.id, editFields)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-border text-black/60 hover:bg-gray-100 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => swapOrder(index, -1)}
                        disabled={index === 0}
                        className="text-black/30 hover:text-black/60 disabled:opacity-20 text-xs"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => swapOrder(index, 1)}
                        disabled={index === lessons.length - 1}
                        className="text-black/30 hover:text-black/60 disabled:opacity-20 text-xs"
                      >
                        ▼
                      </button>
                    </div>

                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-black font-medium text-sm truncate">
                          {lesson.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            lesson.status === "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {lesson.status === "published" ? "Pub" : "Draft"}
                        </span>
                        {lesson.duration && (
                          <span className="text-[10px] text-black/40">
                            {lesson.duration}
                          </span>
                        )}
                      </div>
                      {lesson.kinescopeVideoId && (
                        <p className="text-[10px] text-black/30 mt-0.5 truncate">
                          Video: {lesson.kinescopeVideoId}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleStatus(lesson)}
                        className={`text-xs px-2 py-1.5 rounded-lg transition-colors ${
                          lesson.status === "published"
                            ? "text-amber-600 hover:bg-amber-50"
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {lesson.status === "published" ? "Draft" : "Pub"}
                      </button>
                      <button
                        onClick={() => startEdit(lesson)}
                        className="text-xs px-3 py-1.5 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id, lesson.title)}
                        className="text-xs px-2 py-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {lessons.length > 0 && (
        <div className="mt-6 text-center text-xs text-black/40">
          {lessons.length} aula{lessons.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
