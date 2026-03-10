"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import KinescopePlayer from "@/components/platform/KinescopePlayer";

interface LessonData {
  id: string;
  title: string;
  duration: string | null;
  kinescopeVideoId: string | null;
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
  const [data, setData] = useState<LessonPageData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

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
      setIsCompleted(
        (progressData.completedLessons || []).includes(lessonId)
      );

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
    setCompleting(false);
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto text-center py-16">
        <p className="text-black/50">Aula nao encontrada.</p>
      </div>
    );
  }

  const { lesson, moduleName, courseName, prevLesson, nextLesson } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-black/40">
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
        <span className="text-black/60">{moduleName}</span>
      </div>

      {/* Lesson title */}
      <h1 className="text-xl font-bold text-black">{lesson.title}</h1>

      {/* Video player */}
      {lesson.kinescopeVideoId ? (
        <KinescopePlayer
          videoId={lesson.kinescopeVideoId}
          studentEmail={studentEmail}
        />
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-black shadow-lg">
          <div className="relative flex flex-col items-center justify-center text-white/60" style={{ paddingBottom: "56.25%" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <svg
                className="w-16 h-16 mb-3"
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
              <p className="text-sm">Video sera carregado aqui</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Complete button */}
        <button
          onClick={handleComplete}
          disabled={isCompleted || completing}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
            isCompleted
              ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
              : "bg-primary text-white hover:bg-[#1888e0] active:scale-[0.97]"
          }`}
        >
          {completing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Concluindo...
            </span>
          ) : isCompleted ? (
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
              Aula Concluida
            </span>
          ) : (
            "Concluir Aula"
          )}
        </button>

        {/* Duration */}
        {lesson.duration && (
          <span className="text-xs text-black/40">
            Duracao: {lesson.duration}
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-border">
        {prevLesson ? (
          <Link
            href={`/courses/${courseId}/${moduleId}/${prevLesson.id}`}
            className="flex items-center gap-2 text-sm text-black/50 hover:text-primary transition-colors"
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
            className="flex items-center gap-2 text-sm text-black/50 hover:text-primary transition-colors"
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
