"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  description: string;
  status: string;
  order: number;
  moduleCount: number;
  lessonCount: number;
  updatedAt: string | null;
}

export default function CoursesListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  async function fetchCourses() {
    const res = await fetch("/api/admin/cms/courses");
    const data = await res.json();
    setCourses(data.courses || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    await fetch("/api/admin/cms/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName.trim(),
        order: courses.length,
      }),
    });
    setNewName("");
    setShowCreate(false);
    setCreating(false);
    fetchCourses();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deletar "${name}" e todo seu conteúdo?`)) return;
    await fetch(`/api/admin/cms/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  }

  async function toggleStatus(course: Course) {
    const newStatus = course.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/cms/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchCourses();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-black">Cursos</h1>
        <div className="ml-auto">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="text-xs font-medium px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            + Novo Curso
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="rounded-2xl p-5 mb-6 bg-gray-light border border-gray-border">
          <h2 className="text-sm font-semibold text-black mb-3">Novo Curso</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-[10px] text-black/50 block mb-1">
                Nome do Curso
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Curso Preparatório ICAO"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
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
      ) : courses.length === 0 ? (
        <div className="rounded-2xl p-8 text-center bg-gray-light border border-gray-border">
          <p className="text-black/50 mb-2">Nenhum curso criado ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl bg-gray-light border border-gray-border hover:border-primary/30 transition-all duration-200"
            >
              <div className="px-5 py-4 flex items-center justify-between">
                <Link
                  href={`/admin/cms/courses/${course.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-black font-semibold truncate">
                        {course.name}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          course.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {course.status === "published"
                          ? "Publicado"
                          : "Rascunho"}
                      </span>
                    </div>
                    <p className="text-black/50 text-xs mt-0.5">
                      {course.moduleCount} módulo
                      {course.moduleCount !== 1 ? "s" : ""} &middot;{" "}
                      {course.lessonCount} aula
                      {course.lessonCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleStatus(course)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      course.status === "published"
                        ? "text-amber-600 hover:bg-amber-50"
                        : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {course.status === "published"
                      ? "Despublicar"
                      : "Publicar"}
                  </button>
                  <Link
                    href={`/admin/cms/courses/${course.id}`}
                    className="text-xs px-3 py-1.5 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id, course.name)}
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
    </div>
  );
}
