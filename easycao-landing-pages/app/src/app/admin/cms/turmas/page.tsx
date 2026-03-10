"use client";

import { useState, useEffect } from "react";

interface Turma {
  id: string;
  name: string;
  courseIds: string[];
  studentCount: number;
}

interface Course {
  id: string;
  name: string;
}

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCourseIds, setNewCourseIds] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCourseIds, setEditCourseIds] = useState<string[]>([]);

  async function fetchData() {
    const [turmasRes, coursesRes] = await Promise.all([
      fetch("/api/admin/turmas"),
      fetch("/api/admin/cms/courses"),
    ]);
    const turmasData = await turmasRes.json();
    const coursesData = await coursesRes.json();
    setTurmas(turmasData.turmas || []);
    setCourses(coursesData.courses || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    await fetch("/api/admin/turmas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), courseIds: newCourseIds }),
    });
    setNewName("");
    setNewCourseIds([]);
    setShowCreate(false);
    setCreating(false);
    fetchData();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deletar turma "${name}"?`)) return;
    await fetch(`/api/admin/turmas/${id}`, { method: "DELETE" });
    fetchData();
  }

  async function handleSaveEdit() {
    if (!editingId || !editName.trim()) return;
    await fetch(`/api/admin/turmas/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim(), courseIds: editCourseIds }),
    });
    setEditingId(null);
    fetchData();
  }

  function toggleCourse(
    courseId: string,
    list: string[],
    setter: (v: string[]) => void
  ) {
    if (list.includes(courseId)) {
      setter(list.filter((id) => id !== courseId));
    } else {
      setter([...list, courseId]);
    }
  }

  function startEdit(turma: Turma) {
    setEditingId(turma.id);
    setEditName(turma.name);
    setEditCourseIds([...turma.courseIds]);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-black">Turmas</h1>
        <div className="ml-auto">
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="text-xs font-medium px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            + Nova Turma
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="rounded-2xl p-5 mb-6 bg-gray-light border border-gray-border space-y-3">
          <h2 className="text-sm font-semibold text-black">Nova Turma</h2>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome da turma"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
          />
          {courses.length > 0 && (
            <div>
              <p className="text-[10px] text-black/50 mb-2">
                Cursos com acesso:
              </p>
              <div className="flex flex-wrap gap-2">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() =>
                      toggleCourse(c.id, newCourseIds, setNewCourseIds)
                    }
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      newCourseIds.includes(c.id)
                        ? "bg-primary/10 border-primary/30 text-primary font-medium"
                        : "border-gray-border text-black/50 hover:border-primary/20"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2">
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
      ) : turmas.length === 0 ? (
        <div className="rounded-2xl p-8 text-center bg-gray-light border border-gray-border">
          <p className="text-black/50">Nenhuma turma criada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {turmas.map((turma) => (
            <div
              key={turma.id}
              className="rounded-2xl bg-gray-light border border-gray-border"
            >
              <div className="px-5 py-4">
                {editingId === turma.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                    />
                    {courses.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {courses.map((c) => (
                          <button
                            key={c.id}
                            onClick={() =>
                              toggleCourse(
                                c.id,
                                editCourseIds,
                                setEditCourseIds
                              )
                            }
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                              editCourseIds.includes(c.id)
                                ? "bg-primary/10 border-primary/30 text-primary font-medium"
                                : "border-gray-border text-black/50"
                            }`}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-black font-semibold">{turma.name}</h3>
                      <p className="text-xs text-black/50 mt-0.5">
                        {turma.studentCount} aluno
                        {turma.studentCount !== 1 ? "s" : ""} &middot;{" "}
                        {turma.courseIds.length} curso
                        {turma.courseIds.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(turma)}
                        className="text-xs px-3 py-1.5 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(turma.id, turma.name)}
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
