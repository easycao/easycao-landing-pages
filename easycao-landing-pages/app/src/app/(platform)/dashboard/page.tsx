"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface CourseInfo {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  lessonCount: number;
}

interface DashboardData {
  courseProgress: Record<
    string,
    {
      completedLessons: string[];
      lastLessonId: string | null;
      lastAccessedAt: string | null;
      progressPercent: number;
    }
  >;
  lastAccessed: {
    courseId: string;
    lessonId: string;
  } | null;
}

interface LastLessonInfo {
  courseId: string;
  courseName: string;
  moduleName: string;
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [lastLesson, setLastLesson] = useState<LastLessonInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const [coursesRes, dashRes] = await Promise.all([
        fetch(`/api/platform/courses?uid=${user!.uid}`),
        fetch(`/api/platform/progress/dashboard?uid=${user!.uid}`),
      ]);

      const coursesData = await coursesRes.json();
      const dashData: DashboardData = await dashRes.json();

      setCourses(coursesData.courses || []);
      setDashboard(dashData);

      // Resolve last accessed lesson details
      if (dashData.lastAccessed) {
        const { courseId, lessonId } = dashData.lastAccessed;
        // Find module that contains this lesson
        const courseRes = await fetch(
          `/api/platform/courses/${courseId}`
        );
        const courseDetail = await courseRes.json();
        if (courseDetail.modules) {
          for (const mod of courseDetail.modules) {
            const lesson = mod.lessons?.find(
              (l: { id: string }) => l.id === lessonId
            );
            if (lesson) {
              setLastLesson({
                courseId,
                courseName: courseDetail.course.name,
                moduleName: mod.name,
                moduleId: mod.id,
                lessonId,
                lessonTitle: lesson.title,
              });
              break;
            }
          }
        }
      }

      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl bg-white border border-gray-border p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-black mb-2">
            Nenhum curso disponivel
          </h2>
          <p className="text-sm text-black/50 mb-6 max-w-sm mx-auto">
            Voce ainda nao tem acesso a nenhum curso. Adquira um curso para
            comecar a estudar.
          </p>
          <a
            href="https://easycao.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-[#1888e0] transition-colors"
          >
            Ver cursos disponiveis
          </a>
        </div>
      </div>
    );
  }

  // Calculate overall progress
  const totalLessons = courses.reduce((sum, c) => sum + c.lessonCount, 0);
  const totalCompleted = courses.reduce((sum, c) => {
    const p = dashboard?.courseProgress[c.id];
    return sum + (p?.completedLessons.length || 0);
  }, 0);
  const overallPercent =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Continue where you left off */}
      {lastLesson && (
        <div className="rounded-2xl bg-white border border-gray-border p-5 shadow-sm">
          <p className="text-[11px] font-medium text-black/40 uppercase tracking-wider mb-3">
            Continuar de onde parou
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-black truncate">
                {lastLesson.lessonTitle}
              </h3>
              <p className="text-xs text-black/50 mt-0.5 truncate">
                {lastLesson.courseName} &middot; {lastLesson.moduleName}
              </p>
            </div>
            <Link
              href={`/courses/${lastLesson.courseId}/${lastLesson.moduleId}/${lastLesson.lessonId}`}
              className="flex-shrink-0 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-[#1888e0] transition-colors"
            >
              Continuar
            </Link>
          </div>
        </div>
      )}

      {/* Overall progress */}
      <div className="rounded-2xl bg-white border border-gray-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-medium text-black/40 uppercase tracking-wider">
            Progresso geral
          </p>
          <span className="text-sm font-semibold text-primary">
            {overallPercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <p className="text-xs text-black/40 mt-2">
          {totalCompleted} de {totalLessons} aulas concluidas
        </p>
      </div>

      {/* Course cards */}
      <div>
        <h2 className="text-sm font-semibold text-black mb-3">Meus Cursos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => {
            const progress = dashboard?.courseProgress[course.id];
            const completed = progress?.completedLessons.length || 0;
            const percent =
              course.lessonCount > 0
                ? Math.round((completed / course.lessonCount) * 100)
                : 0;

            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group rounded-2xl bg-white border border-gray-border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
              >
                {course.thumbnail ? (
                  <div className="h-36 bg-gray-100 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-36 bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-primary/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                      />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-black group-hover:text-primary transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-xs text-black/40 mt-1">
                    {course.lessonCount} aulas
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-black/40">
                        {completed}/{course.lessonCount}
                      </span>
                      <span className="text-[10px] font-medium text-primary">
                        {percent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
