"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface CourseData {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  status: string;
}

interface ModuleData {
  id: string;
  name: string;
  thumbnail: string;
  order: number;
  status: string;
  lessonCount: number;
}

export default function CourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editModuleFields, setEditModuleFields] = useState<{ name: string; thumbnail: string }>({ name: "", thumbnail: "" });

  async function fetchData() {
    const res = await fetch(`/api/admin/cms/courses/${courseId}`);
    if (!res.ok) return;
    const data = await res.json();
    setCourse(data.course);
    setModules(data.modules || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [courseId]);

  async function saveCourse(update: Partial<CourseData>) {
    setSaving(true);
    await fetch(`/api/admin/cms/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    setSaving(false);
  }

  async function handleCreateModule() {
    if (!newModuleName.trim()) return;
    setCreating(true);
    await fetch(`/api/admin/cms/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newModuleName.trim(),
        order: modules.length,
      }),
    });
    setNewModuleName("");
    setShowCreateModule(false);
    setCreating(false);
    fetchData();
  }

  async function handleDeleteModule(moduleId: string, name: string) {
    if (!confirm(`Deletar "${name}" e suas aulas?`)) return;
    await fetch(`/api/admin/cms/courses/${courseId}/modules/${moduleId}`, {
      method: "DELETE",
    });
    fetchData();
  }

  async function swapOrder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= modules.length) return;
    const a = modules[index];
    const b = modules[target];
    await Promise.all([
      fetch(`/api/admin/cms/courses/${courseId}/modules/${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: b.order }),
      }),
      fetch(`/api/admin/cms/courses/${courseId}/modules/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: a.order }),
      }),
    ]);
    fetchData();
  }

  async function saveModule(mod: ModuleData) {
    const update: Record<string, string> = {};
    if (editModuleFields.name.trim() && editModuleFields.name.trim() !== mod.name) {
      update.name = editModuleFields.name.trim();
    }
    if (editModuleFields.thumbnail !== (mod.thumbnail || "")) {
      update.thumbnail = editModuleFields.thumbnail;
    }
    if (Object.keys(update).length === 0) {
      setEditingModuleId(null);
      return;
    }
    await fetch(`/api/admin/cms/courses/${courseId}/modules/${mod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    setEditingModuleId(null);
    fetchData();
  }

  async function toggleModuleStatus(mod: ModuleData) {
    const newStatus = mod.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/cms/courses/${courseId}/modules/${mod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-black/50 text-center py-12">
        Carregando...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-black/50">Curso não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/cms/courses"
          className="text-primary hover:text-primary-dark transition-colors text-sm"
        >
          &larr; Cursos
        </Link>
        <h1 className="text-xl font-bold text-black truncate">{course.name}</h1>
        {saving && (
          <span className="text-xs text-primary animate-pulse">Salvando...</span>
        )}
      </div>

      {/* Course details */}
      <div className="rounded-2xl p-5 mb-6 bg-gray-light border border-gray-border space-y-4">
        <div>
          <label className="text-[10px] text-black/50 block mb-1">
            Nome do Curso
          </label>
          <input
            type="text"
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
            onBlur={() => saveCourse({ name: course.name })}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] text-black/50 block mb-1">
            Descrição
          </label>
          <textarea
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
            onBlur={() => saveCourse({ description: course.description })}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none resize-none"
          />
        </div>
        <div>
          <label className="text-[10px] text-black/50 block mb-1">
            Thumbnail URL
          </label>
          <input
            type="text"
            value={course.thumbnail}
            onChange={(e) =>
              setCourse({ ...course, thumbnail: e.target.value })
            }
            onBlur={() => saveCourse({ thumbnail: course.thumbnail })}
            placeholder="https://..."
            className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-black/50">Status:</span>
          <button
            onClick={() => {
              const newStatus =
                course.status === "published" ? "draft" : "published";
              setCourse({ ...course, status: newStatus });
              saveCourse({ status: newStatus });
            }}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
              course.status === "published"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {course.status === "published" ? "Publicado" : "Rascunho"}
          </button>
        </div>
      </div>

      {/* Modules */}
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-base font-semibold text-black">Módulos</h2>
        <button
          onClick={() => setShowCreateModule(!showCreateModule)}
          className="text-xs font-medium px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          + Novo Módulo
        </button>
      </div>

      {showCreateModule && (
        <div className="rounded-2xl p-5 mb-4 bg-gray-light border border-gray-border">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-[10px] text-black/50 block mb-1">
                Nome do Módulo
              </label>
              <input
                type="text"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateModule()}
                placeholder="Ex: Foundations of ICAO English"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
              />
            </div>
            <button
              onClick={handleCreateModule}
              disabled={creating || !newModuleName.trim()}
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {creating ? "Criando..." : "Criar"}
            </button>
            <button
              onClick={() => setShowCreateModule(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-border text-black/60 text-sm hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {modules.length === 0 ? (
        <div className="rounded-2xl p-8 text-center bg-gray-light border border-gray-border">
          <p className="text-black/50">Nenhum módulo neste curso.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {modules.map((mod, index) => (
            <div
              key={mod.id}
              className="rounded-2xl bg-gray-light border border-gray-border hover:border-primary/30 transition-all duration-200"
            >
              <div className="px-5 py-3.5">
                {editingModuleId === mod.id ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-[10px] text-black/50 block mb-1">Nome</label>
                        <input
                          type="text"
                          value={editModuleFields.name}
                          onChange={(e) => setEditModuleFields({ ...editModuleFields, name: e.target.value })}
                          autoFocus
                          className="w-full px-3 py-2 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-black/50 block mb-1">Thumbnail URL</label>
                      <input
                        type="text"
                        value={editModuleFields.thumbnail}
                        onChange={(e) => setEditModuleFields({ ...editModuleFields, thumbnail: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveModule(mod)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingModuleId(null)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-border text-black/60 hover:bg-gray-100 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {/* Reorder buttons */}
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
                        disabled={index === modules.length - 1}
                        className="text-black/30 hover:text-black/60 disabled:opacity-20 text-xs"
                      >
                        ▼
                      </button>
                    </div>

                    <Link
                      href={`/admin/cms/courses/${courseId}/modules/${mod.id}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-black font-medium text-sm truncate">
                          {mod.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            mod.status === "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {mod.status === "published" ? "Pub" : "Draft"}
                        </span>
                      </div>
                      <p className="text-[10px] text-black/40 mt-0.5">
                        {mod.lessonCount} aula{mod.lessonCount !== 1 ? "s" : ""}
                      </p>
                    </Link>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => toggleModuleStatus(mod)}
                        className={`text-xs px-2 py-1.5 rounded-lg transition-colors ${
                          mod.status === "published"
                            ? "text-amber-600 hover:bg-amber-50"
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {mod.status === "published" ? "Draft" : "Pub"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingModuleId(mod.id);
                          setEditModuleFields({ name: mod.name, thumbnail: mod.thumbnail || "" });
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                      >
                        Editar
                      </button>
                      <Link
                        href={`/admin/cms/courses/${courseId}/modules/${mod.id}`}
                        className="text-xs px-3 py-1.5 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                      >
                        Aulas
                      </Link>
                      <button
                        onClick={() => handleDeleteModule(mod.id, mod.name)}
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
    </div>
  );
}
