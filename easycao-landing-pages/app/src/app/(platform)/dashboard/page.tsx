"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";
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

      if (dashData.lastAccessed) {
        const { courseId, lessonId } = dashData.lastAccessed;
        const courseRes = await fetch(`/api/platform/courses/${courseId}`);
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Card style based on theme — dark uses Duarte Studio glass effect
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

  if (courses.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className={`${cardClass} p-12 text-center`} style={cardBg}>
          <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center ${isDark ? "bg-white/[0.06]" : "bg-gradient-to-br from-primary/10 to-primary/5"}`}>
            <svg
              className="w-10 h-10 text-primary"
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
          <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>
            Nenhum curso disponivel
          </h2>
          <p className={`text-sm ${textSecondary} mb-8 max-w-sm mx-auto leading-relaxed`}>
            Voce ainda nao tem acesso a nenhum curso. Adquira um curso para
            comecar a estudar.
          </p>
          <a
            href="https://easycao.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta relative overflow-hidden inline-flex items-center gap-2 bg-primary hover:bg-[#1888e0] text-white font-bold text-[15px] rounded-full px-7 py-3 shadow-[0_2px_8px_rgba(31,150,247,0.3)] hover:shadow-[0_4px_16px_rgba(31,150,247,0.45)] active:scale-[0.97] transition-all duration-300"
          >
            <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(45deg,transparent_25%,rgba(52,184,248,0.45)_50%,transparent_75%)] bg-[length:250%_250%] bg-[position:200%_0] group-hover/cta:bg-[position:-100%_0] transition-[background-position] duration-[800ms] ease-out pointer-events-none" />
            <span className="relative">Ver cursos disponiveis</span>
          </a>
        </div>
      </div>
    );
  }

  const totalLessons = courses.reduce((sum, c) => sum + c.lessonCount, 0);
  const totalCompleted = courses.reduce((sum, c) => {
    const p = dashboard?.courseProgress[c.id];
    return sum + (p?.completedLessons.length || 0);
  }, 0);
  const overallPercent =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome hero banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0e4f85] via-primary-dark to-primary p-8 lg:p-10 hero-noise">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(52,184,248,0.5) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(31,150,247,0.4) 0%, transparent 65%)" }} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-[-0.02em] leading-tight">
              Boas-vindas de volta
            </h1>
            <p className="text-sm text-white/50 mt-2 max-w-md leading-relaxed">
              Continue sua jornada de aprendizado. Cada aula te aproxima da fluencia no ingles aeronautico.
            </p>
          </div>

          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="url(#progressGrad)" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - overallPercent / 100)}`}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34B8F8" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{overallPercent}%</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white">{totalCompleted} de {totalLessons}</p>
              <p className="text-xs text-white/40">aulas concluidas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue where you left off */}
      {lastLesson && (
        <div className={`${cardClass} p-5 lg:p-6`} style={cardBg}>
          <p className={`text-[10px] font-semibold ${textMuted} uppercase tracking-[0.15em] mb-3`}>
            Continuar de onde parou
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h3 className={`text-base font-bold ${textPrimary} truncate`}>
                {lastLesson.lessonTitle}
              </h3>
              <p className={`text-xs ${textLabel} mt-1 truncate`}>
                {lastLesson.courseName} &middot; {lastLesson.moduleName}
              </p>
            </div>
            <Link
              href={`/courses/${lastLesson.courseId}/${lastLesson.moduleId}/${lastLesson.lessonId}`}
              className="group/cta relative overflow-hidden flex-shrink-0 bg-primary hover:bg-[#1888e0] text-white font-bold text-sm rounded-full px-6 py-2.5 shadow-[0_2px_8px_rgba(31,150,247,0.25)] hover:shadow-[0_4px_12px_rgba(31,150,247,0.4)] active:scale-[0.97] transition-all duration-300"
            >
              <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(45deg,transparent_25%,rgba(52,184,248,0.45)_50%,transparent_75%)] bg-[length:250%_250%] bg-[position:200%_0] group-hover/cta:bg-[position:-100%_0] transition-[background-position] duration-[800ms] ease-out pointer-events-none" />
              <span className="relative flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Continuar
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Course cards */}
      <div>
        <h2 className={`text-sm font-bold uppercase tracking-[0.08em] mb-4 ${isDark ? "text-white/50" : "text-black/70"}`}>
          Meus Cursos
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
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
                className={`group overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 ${
                  isDark
                    ? "rounded-[16px] border border-white/[0.06] backdrop-blur-[20px] hover:border-white/[0.12] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                    : "rounded-2xl bg-white border border-gray-border/40 hover:border-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                }`}
                style={isDark ? { background: "rgba(255,255,255,0.03)" } : undefined}
              >
                {course.thumbnail ? (
                  <div className="h-40 bg-gray-light overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-[#0e4f85] via-primary-dark to-primary flex items-center justify-center relative overflow-hidden hero-noise">
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(52,184,248,0.5) 0%, transparent 70%)" }} />
                    <svg
                      className="w-12 h-12 text-white/20 relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                      />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <h3 className={`text-[15px] font-bold group-hover:text-primary transition-colors duration-200 ${textPrimary}`}>
                    {course.name}
                  </h3>
                  {course.description && (
                    <p className={`text-xs ${textLabel} mt-1 line-clamp-2 leading-relaxed`}>
                      {course.description}
                    </p>
                  )}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[11px] ${textLabel} font-medium`}>
                        {completed} de {course.lessonCount} aulas
                      </span>
                      <span className="text-[11px] font-bold text-primary">
                        {percent}%
                      </span>
                    </div>
                    <div className={`w-full h-1.5 ${progressBg} rounded-full overflow-hidden`}>
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-700"
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
