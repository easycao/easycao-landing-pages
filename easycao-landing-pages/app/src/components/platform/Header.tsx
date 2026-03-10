"use client";

import { useAuth } from "@/contexts/AuthContext";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/courses": "Meus Cursos",
  "/simulator": "Simulador",
  "/exercises": "Exercícios",
  "/mentoring": "Mentorias",
  "/lives-platform": "Lives",
  "/performance": "Desempenho",
  "/planner": "Planejador",
  "/settings": "Configurações",
};

function getPageTitle(pathname: string): string {
  // Exact match
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];

  // Prefix match for nested routes
  for (const [route, title] of Object.entries(ROUTE_TITLES)) {
    if (pathname.startsWith(route + "/")) return title;
  }

  // Course detail pages
  if (pathname.startsWith("/courses/")) return "Meus Cursos";

  return "Easycao";
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Header({
  pathname,
  studentName,
  onMenuToggle,
}: {
  pathname: string;
  studentName: string | null;
  onMenuToggle: () => void;
}) {
  const title = getPageTitle(pathname);

  return (
    <header className="h-14 lg:h-16 flex items-center justify-between px-5 lg:px-8 border-b border-gray-border bg-white flex-shrink-0">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-light transition-colors"
          aria-label="Menu"
        >
          <svg
            className="w-5 h-5 text-black/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <h1 className="text-base lg:text-lg font-semibold text-black">
          {title}
        </h1>
      </div>

      {/* Right: student info + flight level placeholder */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-primary font-medium bg-primary/8 px-2.5 py-1 rounded-full">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          Nível 1
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
          {getInitials(studentName)}
        </div>
      </div>
    </header>
  );
}
