"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";
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

  const cardClass = isDark
    ? "rounded-[16px] border border-white/[0.09] backdrop-blur-[20px] backdrop-saturate-[1.4] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_0_0_0.5px_rgba(255,255,255,0.03)]"
    : "rounded-2xl bg-white border border-gray-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]";
  const cardBg = isDark
    ? { background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" }
    : undefined;
  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";
  const textMuted = isDark ? "text-[#606070]" : "text-black/30";
  const textLabel = isDark ? "text-[#9090A0]" : "text-black/35";
  const progressBg = isDark ? "bg-white/[0.06]" : "bg-black/[0.04]";

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className={textSecondary}>Curso nao encontrado.</p>
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
          className={`inline-flex items-center gap-1 text-xs ${textMuted} hover:text-primary transition-colors mb-3`}
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
        <h1 className={`text-xl font-bold ${textPrimary}`}>{course.name}</h1>
        {course.description && (
          <p className={`text-sm ${textSecondary} mt-1`}>{course.description}</p>
        )}
      </div>

      {/* Progress bar */}
      <div className={`${cardClass} p-5`} style={cardBg}>
        <div className="flex items-center justify-between mb-2.5">
          <span className={`text-xs ${textLabel} font-medium`}>
            {completedCount} de {totalLessons} aulas concluidas
          </span>
          <span className="text-sm font-bold text-primary">{percent}%</span>
        </div>
        <div className={`w-full h-2 ${progressBg} rounded-full overflow-hidden`}>
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-700"
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
              className={`overflow-hidden ${
                isDark
                  ? "rounded-[16px] border border-white/[0.06]"
                  : "rounded-2xl bg-white border border-gray-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]"
              }`}
              style={isDark ? { background: "rgba(255,255,255,0.03)" } : undefined}
            >
              {/* Module header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                  isDark ? "hover:bg-white/[0.03]" : "hover:bg-gray-50"
                }`}
              >
                <div className="min-w-0">
                  <h3 className={`text-sm font-bold ${textPrimary}`}>
                    {mod.name}
                  </h3>
                  <p className={`text-[11px] ${textLabel} mt-0.5`}>
                    {modCompleted}/{mod.lessonCount} aulas
                  </p>
                </div>
                <svg
                  className={`w-4 h-4 ${textMuted} flex-shrink-0 transition-transform duration-200 ${
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
                <div className={`border-t ${isDark ? "border-white/[0.06]" : "border-gray-border/40"}`}>
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
                        className={`flex items-center gap-3 px-5 py-3 transition-colors border-b last:border-b-0 ${
                          isDark
                            ? "border-white/[0.04] hover:bg-white/[0.03]"
                            : "border-gray-border/30 hover:bg-gray-50"
                        }`}
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
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_8px_rgba(31,150,247,0.4)]">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isDark ? "border-white/[0.12]" : "border-gray-200"
                            }`}>
                              <span className={`text-[10px] font-medium ${textMuted}`}>
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
                                ? isDark ? "text-[#606070]" : "text-black/40"
                                : isLastAccessed
                                ? "text-primary font-medium"
                                : textPrimary
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
                          <span className={`text-[11px] ${textMuted} flex-shrink-0`}>
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
