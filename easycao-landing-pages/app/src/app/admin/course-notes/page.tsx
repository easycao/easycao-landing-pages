"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Module {
  id: string;
  number: number;
  name: string;
  lessonCount: number;
  updatedAt: string | null;
}

export default function CourseNotesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  async function fetchModules() {
    const res = await fetch("/api/admin/course-notes");
    const data = await res.json();
    setModules(data.modules || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchModules();
  }, []);

  async function handleCreate() {
    if (!newNumber || !newName.trim()) return;
    setCreating(true);
    await fetch("/api/admin/course-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: Number(newNumber), name: newName.trim() }),
    });
    setNewNumber("");
    setNewName("");
    setShowCreate(false);
    setCreating(false);
    fetchModules();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Deletar "${name}" e todas as suas aulas?`)) return;
    await fetch(`/api/admin/course-notes/${id}`, { method: "DELETE" });
    fetchModules();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin"
          className="text-primary hover:text-primary-dark transition-colors text-sm"
        >
          &larr; Voltar
        </Link>
        <h1 className="text-xl font-bold text-black">Anotações do Curso</h1>
        <div className="ml-auto flex items-center gap-3">
          <a
            href="/api/admin/course-notes/export"
            className="text-xs font-medium px-3 py-2 rounded-xl border border-gray-border text-black/60 hover:text-black hover:bg-gray-light transition-all duration-200"
          >
            Exportar Markdown
          </a>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="text-xs font-medium px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            + Novo Módulo
          </button>
        </div>
      </div>

      {/* Create module form */}
      {showCreate && (
        <div className="rounded-2xl p-5 mb-6 bg-gray-light border border-gray-border">
          <h2 className="text-sm font-semibold text-black mb-3">Novo Módulo</h2>
          <div className="flex gap-3 items-end">
            <div className="w-20">
              <label className="text-[10px] text-black/50 block mb-1">Número</label>
              <input
                type="number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="1"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-black/50 block mb-1">Nome do Módulo</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Foundations of ICAO English"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary/40 outline-none"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={creating || !newNumber || !newName.trim()}
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

      {/* Module list */}
      {loading ? (
        <div className="text-black/50 text-center py-12">Carregando...</div>
      ) : modules.length === 0 ? (
        <div className="rounded-2xl p-8 text-center bg-gray-light border border-gray-border">
          <p className="text-black/50 mb-2">Nenhum módulo criado ainda.</p>
          <p className="text-black/40 text-sm">
            Crie módulos para organizar suas anotações por seção do curso.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="rounded-2xl bg-gray-light border border-gray-border hover:border-primary/30 transition-all duration-200"
            >
              <div className="px-5 py-4 flex items-center justify-between">
                <Link
                  href={`/admin/course-notes/${mod.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                    {mod.number}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-black font-semibold truncate">{mod.name}</h3>
                    <p className="text-black/50 text-xs mt-0.5">
                      {mod.lessonCount} aula{mod.lessonCount !== 1 ? "s" : ""}
                      {mod.updatedAt && (
                        <>
                          {" "}
                          &middot; Atualizado em{" "}
                          {new Date(mod.updatedAt).toLocaleDateString("pt-BR")}
                        </>
                      )}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/admin/course-notes/${mod.id}`}
                    className="text-xs px-3 py-1.5 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                  >
                    Aulas &rarr;
                  </Link>
                  <button
                    onClick={() => handleDelete(mod.id, mod.name)}
                    className="text-xs px-2 py-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {modules.length > 0 && (
        <div className="mt-6 text-center text-xs text-black/40">
          {modules.length} módulo{modules.length !== 1 ? "s" : ""} &middot;{" "}
          {modules.reduce((sum, m) => sum + m.lessonCount, 0)} aulas total
        </div>
      )}
    </div>
  );
}
