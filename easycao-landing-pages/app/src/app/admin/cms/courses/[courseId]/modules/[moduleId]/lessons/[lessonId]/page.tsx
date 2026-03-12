"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

interface LessonData {
  id: string;
  title: string;
  status: string;
  kinescopeVideoId: string;
  duration: string;
  thumbnail: string;
  hasConsolidation?: boolean;
  hasExercises?: boolean;
  consolidationConfig?: {
    concepts: string[];
    language: "pt" | "en";
  };
}

interface ExerciseData {
  id: string;
  type: string;
  prompt: string;
  referenceAnswer: string;
  videoUrl: string;
  imageUrl: string;
  order: number;
}

type Tab = "details" | "consolidation" | "exercises";

export default function LessonEditPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
}) {
  const { courseId, moduleId, lessonId } = use(params);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("details");

  // Exercise form state
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({
    type: "speaking",
    prompt: "",
    referenceAnswer: "",
    videoUrl: "",
    imageUrl: "",
  });
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editExerciseFields, setEditExerciseFields] = useState<Partial<ExerciseData>>({});

  const basePath = `/api/admin/cms/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`;

  async function fetchLesson() {
    const res = await fetch(basePath);
    if (!res.ok) return;
    const data = await res.json();
    setLesson(data.lesson);
    setLoading(false);
  }

  async function fetchExercises() {
    const res = await fetch(`${basePath}/exercises`);
    if (!res.ok) return;
    const data = await res.json();
    setExercises(data.exercises || []);
  }

  useEffect(() => {
    fetchLesson();
    fetchExercises();
  }, [courseId, moduleId, lessonId]);

  async function saveField(update: Partial<LessonData>) {
    setSaving(true);
    await fetch(basePath, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    setSaving(false);
  }

  async function handleAddExercise() {
    if (!newExercise.prompt.trim()) return;
    await fetch(`${basePath}/exercises`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newExercise, order: exercises.length }),
    });
    setNewExercise({ type: "speaking", prompt: "", referenceAnswer: "", videoUrl: "", imageUrl: "" });
    setShowAddExercise(false);
    fetchExercises();
  }

  async function handleDeleteExercise(exerciseId: string) {
    if (!confirm("Deletar este exercício?")) return;
    await fetch(`${basePath}/exercises/${exerciseId}`, { method: "DELETE" });
    fetchExercises();
  }

  async function handleSaveExercise(exerciseId: string) {
    await fetch(`${basePath}/exercises/${exerciseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editExerciseFields),
    });
    setEditingExerciseId(null);
    fetchExercises();
  }

  if (loading || !lesson) {
    return (
      <div className="max-w-4xl mx-auto text-black/50 text-center py-12">
        Carregando...
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "details", label: "Detalhes" },
    { id: "consolidation", label: "Consolidação" },
    { id: "exercises", label: "Exercícios" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/admin/cms/courses/${courseId}/modules/${moduleId}`}
          className="text-primary hover:text-primary-dark transition-colors text-sm"
        >
          &larr; Aulas
        </Link>
        <h1 className="text-xl font-bold text-black truncate">{lesson.title}</h1>
        {saving && (
          <span className="text-xs text-primary animate-pulse">Salvando...</span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-black/40 hover:text-black/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === "details" && (
        <div className="rounded-2xl p-5 bg-gray-light border border-gray-border space-y-4">
          <div>
            <label className="text-[10px] text-black/50 block mb-1">Título</label>
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
              onBlur={() => saveField({ title: lesson.title })}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-black/50 block mb-1">Kinescope Video ID</label>
              <input
                type="text"
                value={lesson.kinescopeVideoId}
                onChange={(e) => setLesson({ ...lesson, kinescopeVideoId: e.target.value })}
                onBlur={() => saveField({ kinescopeVideoId: lesson.kinescopeVideoId })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-black/50 block mb-1">Duração</label>
              <input
                type="text"
                value={lesson.duration}
                onChange={(e) => setLesson({ ...lesson, duration: e.target.value })}
                onBlur={() => saveField({ duration: lesson.duration })}
                placeholder="12:30"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-black/50 block mb-1">Thumbnail URL</label>
            <input
              type="text"
              value={lesson.thumbnail}
              onChange={(e) => setLesson({ ...lesson, thumbnail: e.target.value })}
              onBlur={() => saveField({ thumbnail: lesson.thumbnail })}
              placeholder="https://..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-black/50">Status:</span>
              <button
                onClick={() => {
                  const newStatus = lesson.status === "published" ? "draft" : "published";
                  setLesson({ ...lesson, status: newStatus });
                  saveField({ status: newStatus });
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  lesson.status === "published"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {lesson.status === "published" ? "Publicado" : "Rascunho"}
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lesson.hasConsolidation || false}
                onChange={(e) => {
                  const val = e.target.checked;
                  setLesson({ ...lesson, hasConsolidation: val });
                  saveField({ hasConsolidation: val } as Partial<LessonData>);
                }}
                className="accent-primary w-4 h-4"
              />
              <span className="text-xs text-black/60">Consolidação</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lesson.hasExercises || false}
                onChange={(e) => {
                  const val = e.target.checked;
                  setLesson({ ...lesson, hasExercises: val });
                  saveField({ hasExercises: val } as Partial<LessonData>);
                }}
                className="accent-primary w-4 h-4"
              />
              <span className="text-xs text-black/60">Exercícios</span>
            </label>
          </div>
        </div>
      )}

      {/* Consolidation Tab */}
      {activeTab === "consolidation" && (
        <div className="rounded-2xl p-5 bg-gray-light border border-gray-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-black">Configuração da Consolidação</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lesson.hasConsolidation || false}
                onChange={(e) => {
                  const val = e.target.checked;
                  setLesson({ ...lesson, hasConsolidation: val });
                  saveField({ hasConsolidation: val } as Partial<LessonData>);
                }}
                className="accent-primary w-4 h-4"
              />
              <span className="text-xs text-black/60">Ativada</span>
            </label>
          </div>

          {!lesson.hasConsolidation ? (
            <p className="text-sm text-black/40 py-4 text-center">
              Ative a consolidação para configurar os conceitos.
            </p>
          ) : (
            <>
              <div>
                <label className="text-[10px] text-black/50 block mb-1">Idioma</label>
                <select
                  value={lesson.consolidationConfig?.language || "en"}
                  onChange={(e) => {
                    const config = {
                      concepts: lesson.consolidationConfig?.concepts || [],
                      language: e.target.value as "pt" | "en",
                    };
                    setLesson({ ...lesson, consolidationConfig: config });
                    saveField({ consolidationConfig: config } as Partial<LessonData>);
                  }}
                  className="px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                >
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-black/50 block mb-1">
                  Conceitos-chave (um por linha)
                </label>
                <textarea
                  value={(lesson.consolidationConfig?.concepts || []).join("\n")}
                  onChange={(e) => {
                    const concepts = e.target.value
                      .split("\n")
                      .filter((c) => c.trim());
                    const config = {
                      language: lesson.consolidationConfig?.language || ("en" as const),
                      concepts,
                    };
                    setLesson({ ...lesson, consolidationConfig: config });
                  }}
                  onBlur={() => {
                    saveField({
                      consolidationConfig: lesson.consolidationConfig,
                    } as Partial<LessonData>);
                  }}
                  rows={6}
                  placeholder="Ex: ICAO proficiency scale levels&#10;Level 4 requirements&#10;Pronunciation assessment criteria"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none resize-none"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Exercises Tab */}
      {activeTab === "exercises" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-black">
              Exercícios da Aula ({exercises.length})
            </h3>
            <button
              onClick={() => setShowAddExercise(!showAddExercise)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              + Novo Exercício
            </button>
          </div>

          {/* Add exercise form */}
          {showAddExercise && (
            <div className="rounded-2xl p-5 bg-gray-light border border-gray-border space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-black/50 block mb-1">Tipo</label>
                  <select
                    value={newExercise.type}
                    onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                  >
                    <option value="speaking">Speaking</option>
                    <option value="listening">Listening</option>
                    <option value="writing">Writing</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-black/50 block mb-1">Pergunta / Instrução</label>
                <textarea
                  value={newExercise.prompt}
                  onChange={(e) => setNewExercise({ ...newExercise, prompt: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-black/50 block mb-1">Resposta de Referência</label>
                <textarea
                  value={newExercise.referenceAnswer}
                  onChange={(e) => setNewExercise({ ...newExercise, referenceAnswer: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-black/50 block mb-1">Video URL (opcional)</label>
                  <input
                    type="text"
                    value={newExercise.videoUrl}
                    onChange={(e) => setNewExercise({ ...newExercise, videoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-black/50 block mb-1">Image URL (opcional)</label>
                  <input
                    type="text"
                    value={newExercise.imageUrl}
                    onChange={(e) => setNewExercise({ ...newExercise, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-border bg-white text-black text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddExercise}
                  disabled={!newExercise.prompt.trim()}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  Criar
                </button>
                <button
                  onClick={() => setShowAddExercise(false)}
                  className="px-4 py-2 rounded-xl border border-gray-border text-black/60 text-sm hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Exercise list */}
          {exercises.length === 0 ? (
            <div className="rounded-2xl p-8 text-center bg-gray-light border border-gray-border">
              <p className="text-black/50 text-sm">Nenhum exercício nesta aula.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {exercises.map((ex, index) => (
                <div
                  key={ex.id}
                  className="rounded-2xl bg-gray-light border border-gray-border"
                >
                  <div className="px-5 py-3.5">
                    {editingExerciseId === ex.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-black/50 block mb-1">Tipo</label>
                            <select
                              value={editExerciseFields.type || "speaking"}
                              onChange={(e) => setEditExerciseFields({ ...editExerciseFields, type: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-gray-border bg-white text-black text-sm outline-none"
                            >
                              <option value="speaking">Speaking</option>
                              <option value="listening">Listening</option>
                              <option value="writing">Writing</option>
                            </select>
                          </div>
                        </div>
                        <textarea
                          value={editExerciseFields.prompt || ""}
                          onChange={(e) => setEditExerciseFields({ ...editExerciseFields, prompt: e.target.value })}
                          placeholder="Pergunta"
                          rows={2}
                          className="w-full px-3 py-2 rounded-xl border border-gray-border bg-white text-black text-sm outline-none resize-none"
                        />
                        <textarea
                          value={editExerciseFields.referenceAnswer || ""}
                          onChange={(e) => setEditExerciseFields({ ...editExerciseFields, referenceAnswer: e.target.value })}
                          placeholder="Resposta de referência"
                          rows={2}
                          className="w-full px-3 py-2 rounded-xl border border-gray-border bg-white text-black text-sm outline-none resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveExercise(ex.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingExerciseId(null)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-gray-border text-black/60 hover:bg-gray-100 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              ex.type === "speaking" ? "bg-blue-100 text-blue-700" :
                              ex.type === "listening" ? "bg-purple-100 text-purple-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                              {ex.type}
                            </span>
                          </div>
                          <p className="text-sm text-black mt-1 line-clamp-2">{ex.prompt}</p>
                          {ex.referenceAnswer && (
                            <p className="text-[10px] text-black/40 mt-1 line-clamp-1">
                              Ref: {ex.referenceAnswer}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditingExerciseId(ex.id);
                              setEditExerciseFields({
                                type: ex.type,
                                prompt: ex.prompt,
                                referenceAnswer: ex.referenceAnswer,
                                videoUrl: ex.videoUrl,
                                imageUrl: ex.imageUrl,
                              });
                            }}
                            className="text-xs px-3 py-1.5 rounded-lg text-primary hover:bg-primary/5 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteExercise(ex.id)}
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
      )}
    </div>
  );
}
