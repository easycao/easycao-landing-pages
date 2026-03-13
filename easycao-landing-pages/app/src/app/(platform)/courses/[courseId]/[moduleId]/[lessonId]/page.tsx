"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import KinescopePlayer from "@/components/platform/KinescopePlayer";
import ConsolidationChat from "@/components/platform/ConsolidationChat";
import LessonExercises from "@/components/platform/LessonExercises";

interface LessonData {
  id: string;
  title: string;
  duration: string | null;
  kinescopeVideoId: string | null;
  hasConsolidation?: boolean;
  hasExercises?: boolean;
  consolidationConfig?: {
    concepts: string[];
    language: "pt" | "en";
  };
}

interface NavLesson {
  id: string;
  title: string;
}

interface LessonPageData {
  lesson: LessonData;
  moduleName: string;
  courseName: string;
  moduleId: string;
  courseId: string;
  prevLesson: NavLesson | null;
  nextLesson: NavLesson | null;
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
}) {
  const { courseId, moduleId, lessonId } = use(params);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<LessonPageData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [completedParts, setCompletedParts] = useState<string[]>([]);
  const [videoWatched, setVideoWatched] = useState(false);

  useEffect(() => {
    if (!user) return;
    setStudentEmail(user.email || "");

    async function load() {
      const [lessonRes, progressRes, meRes] = await Promise.all([
        fetch(
          `/api/platform/courses/${courseId}/${moduleId}/${lessonId}`
        ),
        fetch(`/api/platform/progress/${courseId}?uid=${user!.uid}`),
        fetch(`/api/platform/me?uid=${user!.uid}`),
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        setStudentName(meData.name || "");
      }

      const lessonData: LessonPageData = await lessonRes.json();
      const progressData = await progressRes.json();

      setData(lessonData);
      const lessonIsCompleted = (progressData.completedLessons || []).includes(lessonId);
      setIsCompleted(lessonIsCompleted);

      // Load lesson parts progress
      const partsData = progressData.lessonParts?.[lessonId] || [];
      setCompletedParts(partsData);
      setVideoWatched(lessonIsCompleted || partsData.includes("video"));

      // Track last accessed
      fetch("/api/platform/progress/last-accessed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user!.uid,
          courseId,
          lessonId,
        }),
      });

      setLoading(false);
    }
    load();
  }, [user, courseId, moduleId, lessonId]);

  async function handleComplete() {
    if (!user || isCompleted || completing) return;
    setCompleting(true);

    const lesson = data?.lesson;
    const hasExtensions = lesson?.hasConsolidation || lesson?.hasExercises;

    if (hasExtensions) {
      // Mark video part complete
      const totalParts = 1 + (lesson?.hasConsolidation ? 1 : 0) + (lesson?.hasExercises ? 1 : 0);
      await fetch("/api/platform/progress/complete-part", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          courseId,
          lessonId,
          part: "video",
          totalParts,
        }),
      });
      setVideoWatched(true);
      setCompletedParts((prev) => prev.includes("video") ? prev : [...prev, "video"]);
    } else {
      // No extensions — mark fully complete
      await fetch("/api/platform/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          courseId,
          lessonId,
        }),
      });
      setIsCompleted(true);
    }

    setCompleting(false);
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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto text-center py-16">
        <p className={textSecondary}>Aula nao encontrada.</p>
      </div>
    );
  }

  const { lesson, moduleName, courseName, prevLesson, nextLesson } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className={`flex items-center gap-1.5 text-xs ${textMuted}`}>
        <Link href="/courses" className="hover:text-primary transition-colors">
          Cursos
        </Link>
        <span>/</span>
        <Link
          href={`/courses/${courseId}`}
          className="hover:text-primary transition-colors"
        >
          {courseName}
        </Link>
        <span>/</span>
        <span className={textSecondary}>{moduleName}</span>
      </div>

      {/* Lesson title */}
      <h1 className={`text-xl font-bold ${textPrimary}`}>{lesson.title}</h1>

      {/* Video player */}
      {lesson.kinescopeVideoId ? (
        <div className={`rounded-2xl overflow-hidden ${isDark ? "shadow-[0_4px_20px_rgba(0,0,0,0.4)]" : "shadow-lg"}`}>
          <KinescopePlayer
            videoId={lesson.kinescopeVideoId}
            studentEmail={studentEmail}
          />
        </div>
      ) : (
        <div className={`relative rounded-2xl overflow-hidden ${isDark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-black"} shadow-lg`}>
          <div className="relative flex flex-col items-center justify-center" style={{ paddingBottom: "56.25%" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <svg
                className={`w-16 h-16 mb-3 ${isDark ? "text-white/20" : "text-white/60"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <p className={`text-sm ${isDark ? "text-white/30" : "text-white/60"}`}>Video sera carregado aqui</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions bar */}
      <div className={`${cardClass} p-4 flex items-center justify-between gap-4 flex-wrap`} style={cardBg}>
        {/* Complete button */}
        <button
          onClick={handleComplete}
          disabled={isCompleted || completing || videoWatched}
          className={`group/cta relative overflow-hidden px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
            isCompleted || videoWatched
              ? isDark
                ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-default"
                : "bg-green-50 text-green-600 border border-green-200 cursor-default"
              : "bg-primary text-white hover:bg-[#1888e0] shadow-[0_2px_8px_rgba(31,150,247,0.25)] hover:shadow-[0_4px_12px_rgba(31,150,247,0.4)] active:scale-[0.97]"
          }`}
        >
          {!isCompleted && !completing && !videoWatched && (
            <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(45deg,transparent_25%,rgba(52,184,248,0.45)_50%,transparent_75%)] bg-[length:250%_250%] bg-[position:200%_0] group-hover/cta:bg-[position:-100%_0] transition-[background-position] duration-[800ms] ease-out pointer-events-none" />
          )}
          {completing ? (
            <span className="relative flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Concluindo...
            </span>
          ) : isCompleted || videoWatched ? (
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {videoWatched && !isCompleted ? "Vídeo Concluído" : "Aula Concluida"}
            </span>
          ) : (
            <span className="relative">
              {data?.lesson.hasConsolidation || data?.lesson.hasExercises
                ? "Concluir Vídeo"
                : "Concluir Aula"}
            </span>
          )}
        </button>

        {/* Duration */}
        {lesson.duration && (
          <span className={`text-xs ${textMuted}`}>
            Duracao: {lesson.duration}
          </span>
        )}
      </div>

      {/* Consolidation Section */}
      {lesson.hasConsolidation && lesson.consolidationConfig && (
        <div className={`${cardClass} p-5`} style={cardBg}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className={`text-sm font-bold ${textPrimary}`}>Consolidação</h3>
            {completedParts.includes("consolidation") && (
              <span className="text-xs text-emerald-500 font-medium">✓ Concluída</span>
            )}
            {!videoWatched && (
              <span className={`text-xs ${textSecondary}`}>(assista o vídeo primeiro)</span>
            )}
          </div>
          {completedParts.includes("consolidation") ? (
            <p className={`text-sm ${textSecondary}`}>
              Consolidação concluída com sucesso.
            </p>
          ) : (
            <ConsolidationChat
              concepts={lesson.consolidationConfig.concepts}
              language={lesson.consolidationConfig.language}
              disabled={!videoWatched}
              onComplete={async () => {
                if (!user) return;
                const totalParts = 1 + (lesson.hasConsolidation ? 1 : 0) + (lesson.hasExercises ? 1 : 0);
                await fetch("/api/platform/progress/complete-part", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    uid: user.uid,
                    courseId,
                    lessonId,
                    part: "consolidation",
                    totalParts,
                  }),
                });
                setCompletedParts((prev) => [...prev, "consolidation"]);
              }}
            />
          )}
        </div>
      )}

      {/* Exercises Section */}
      {lesson.hasExercises && (
        <div className={`${cardClass} p-5`} style={cardBg}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className={`text-sm font-bold ${textPrimary}`}>Exercícios Práticos</h3>
            {completedParts.includes("exercises") && (
              <span className="text-xs text-emerald-500 font-medium">✓ Concluídos</span>
            )}
          </div>
          <LessonExercises
            courseId={courseId}
            moduleId={moduleId}
            lessonId={lessonId}
            uid={user?.uid || ""}
            disabled={
              (lesson.hasConsolidation && !completedParts.includes("consolidation")) ||
              !videoWatched
            }
            onAllComplete={async () => {
              if (!user) return;
              const totalParts = 1 + (lesson.hasConsolidation ? 1 : 0) + (lesson.hasExercises ? 1 : 0);
              await fetch("/api/platform/progress/complete-part", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  uid: user.uid,
                  courseId,
                  lessonId,
                  part: "exercises",
                  totalParts,
                }),
              });
              setCompletedParts((prev) => [...prev, "exercises"]);
            }}
          />
        </div>
      )}

      {/* Part progress indicator */}
      {(lesson.hasConsolidation || lesson.hasExercises) && (
        <div className="flex items-center gap-1.5 justify-center">
          <div className={`w-2.5 h-2.5 rounded-full ${videoWatched ? "bg-emerald-500" : isDark ? "bg-white/20" : "bg-gray-300"}`} title="Vídeo" />
          {lesson.hasConsolidation && (
            <div className={`w-2.5 h-2.5 rounded-full ${completedParts.includes("consolidation") ? "bg-emerald-500" : isDark ? "bg-white/20" : "bg-gray-300"}`} title="Consolidação" />
          )}
          {lesson.hasExercises && (
            <div className={`w-2.5 h-2.5 rounded-full ${completedParts.includes("exercises") ? "bg-emerald-500" : isDark ? "bg-white/20" : "bg-gray-300"}`} title="Exercícios" />
          )}
        </div>
      )}

      {/* Navigation */}
      <div className={`flex items-center justify-between gap-4 pt-4 border-t ${isDark ? "border-white/[0.06]" : "border-gray-border/40"}`}>
        {prevLesson ? (
          <Link
            href={`/courses/${courseId}/${moduleId}/${prevLesson.id}`}
            className={`flex items-center gap-2 text-sm ${textSecondary} hover:text-primary transition-colors`}
          >
            <svg
              className="w-4 h-4"
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
            <span className="hidden sm:inline">Anterior:</span>{" "}
            <span className="truncate max-w-[150px]">{prevLesson.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/courses/${courseId}/${moduleId}/${nextLesson.id}`}
            className={`flex items-center gap-2 text-sm ${textSecondary} hover:text-primary transition-colors`}
          >
            <span className="truncate max-w-[150px]">{nextLesson.title}</span>{" "}
            <span className="hidden sm:inline">:Proxima</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
