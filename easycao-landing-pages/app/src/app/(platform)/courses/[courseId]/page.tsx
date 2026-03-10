"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface Lesson {
  id: string;
  title: string;
  duration: string | null;
  order: number;
}

interface Module {
  id: string;
  name: string;
  order: number;
  lessonCount: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

interface Progress {
  completedLessons: string[];
  lastLessonId: string | null;
  progressPercent: number;
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Progress>({
    completedLessons: [],
    lastLessonId: null,
    progressPercent: 0,
  });
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const [courseRes, progressRes] = await Promise.all([
        fetch(`/api/platform/courses/${courseId}`),
        fetch(`/api/platform/progress/${courseId}?uid=${user!.uid}`),
      ]);
      const courseData = await courseRes.json();
      const progressData = await progressRes.json();

      setCourse(courseData.course);
      setModules(courseData.modules || []);
      setProgress(progressData);

      // Auto-expand first module
      if (courseData.modules?.length > 0) {
        setExpandedModules(new Set([courseData.modules[0].id]));
      }

      setLoading(false);
    }
    load();
  }, [user, courseId]);

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-black/50">Curso nao encontrado.</p>
      </div>
    );
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lessonCount, 0);
  const completedCount = progress.completedLessons.length;
  const percent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Course header */}
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-xs text-black/40 hover:text-primary transition-colors mb-3"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Meus Cursos
        </Link>
        <h1 className="text-xl font-bold text-black">{course.name}</h1>
        {course.description && (
          <p className="text-sm text-black/50 mt-1">{course.description}</p>
        )}
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl bg-white border border-gray-border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-black/40">
            {completedCount} de {totalLessons} aulas concluidas
          </span>
          <span className="text-sm font-semibold text-primary">{percent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Modules accordion */}
      <div className="space-y-3">
        {modules.map((mod) => {
          const isExpanded = expandedModules.has(mod.id);
          const modCompleted = mod.lessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;

          return (
            <div
              key={mod.id}
              className="rounded-2xl bg-white border border-gray-border shadow-sm overflow-hidden"
            >
              {/* Module header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-black">
                    {mod.name}
                  </h3>
                  <p className="text-[11px] text-black/40 mt-0.5">
                    {modCompleted}/{mod.lessonCount} aulas
                  </p>
                </div>
                <svg
                  className={`w-4 h-4 text-black/30 flex-shrink-0 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Lessons list */}
              {isExpanded && (
                <div className="border-t border-gray-border">
                  {mod.lessons.map((lesson, i) => {
                    const isCompleted = progress.completedLessons.includes(
                      lesson.id
                    );
                    const isLastAccessed =
                      progress.lastLessonId === lesson.id;

                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseId}/${mod.id}/${lesson.id}`}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-border last:border-b-0"
                      >
                        {/* Status icon */}
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          ) : isLastAccessed ? (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
                              <span className="text-[10px] font-medium text-black/30">
                                {i + 1}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Lesson info */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm ${
                              isCompleted
                                ? "text-black/40"
                                : isLastAccessed
                                ? "text-primary font-medium"
                                : "text-black"
                            }`}
                          >
                            {lesson.title}
                          </p>
                          {isLastAccessed && !isCompleted && (
                            <p className="text-[10px] text-primary/60">
                              Em andamento
                            </p>
                          )}
                        </div>

                        {/* Duration */}
                        {lesson.duration && (
                          <span className="text-[11px] text-black/30 flex-shrink-0">
                            {lesson.duration}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
