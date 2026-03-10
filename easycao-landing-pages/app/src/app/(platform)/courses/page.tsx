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

interface ProgressMap {
  [courseId: string]: {
    completedLessons: string[];
    progressPercent: number;
  };
}

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const [coursesRes, dashRes] = await Promise.all([
        fetch(`/api/platform/courses?uid=${user!.uid}`),
        fetch(`/api/platform/progress/dashboard?uid=${user!.uid}`),
      ]);
      const coursesData = await coursesRes.json();
      const dashData = await dashRes.json();
      setCourses(coursesData.courses || []);
      setProgress(dashData.courseProgress || {});
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          <p className="text-sm text-black/50 mb-6">
            Voce ainda nao tem acesso a nenhum curso.
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((course) => {
          const p = progress[course.id];
          const completed = p?.completedLessons.length || 0;
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
                <div className="h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-primary/30"
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
              <div className="p-5">
                <h3 className="text-base font-semibold text-black group-hover:text-primary transition-colors">
                  {course.name}
                </h3>
                {course.description && (
                  <p className="text-xs text-black/50 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                )}
                <p className="text-xs text-black/40 mt-2">
                  {course.lessonCount} aulas
                </p>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-black/40">
                      {completed}/{course.lessonCount} concluidas
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
  );
}
