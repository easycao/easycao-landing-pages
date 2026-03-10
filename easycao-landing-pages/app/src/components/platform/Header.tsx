"use client";

import { useTheme } from "@/contexts/ThemeContext";

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
  studentName,
  onMenuToggle,
}: {
  pathname: string;
  studentName: string | null;
  onMenuToggle: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header
      className={`h-14 lg:h-16 flex items-center justify-between px-5 lg:px-8 flex-shrink-0 transition-none ${
        isDark
          ? "bg-white/[0.03] backdrop-blur-md border-b border-white/[0.06]"
          : "bg-white/80 backdrop-blur-md border-b border-gray-border/60"
      }`}
    >
      {/* Left: hamburger (mobile) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className={`lg:hidden p-1.5 rounded-lg transition-colors ${
            isDark ? "hover:bg-white/10" : "hover:bg-gray-light"
          }`}
          aria-label="Menu"
        >
          <svg
            className={`w-5 h-5 ${isDark ? "text-white/50" : "text-black/50"}`}
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
      </div>

      {/* Right: theme toggle + level badge + avatar */}
      <div className="flex items-center gap-3">
        {/* Theme switcher */}
        <button
          onClick={toggleTheme}
          className={`relative w-14 h-7 rounded-full flex items-center px-0.5 transition-all duration-300 ${
            isDark
              ? "bg-white/10 border border-white/15"
              : "bg-black/[0.06] border border-black/[0.06]"
          }`}
          aria-label="Alternar tema"
        >
          <div
            className={`w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all duration-300 ${
              isDark
                ? "translate-x-[28px] bg-white/15 text-white"
                : "translate-x-0 bg-white text-amber-500 shadow-sm"
            }`}
          >
            {isDark ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </div>
        </button>

        <div
          className={`hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full ${
            isDark
              ? "text-primary-light bg-white/[0.06] border border-white/10"
              : "text-primary bg-primary/8"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          Nivel 1
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-xs flex items-center justify-center shadow-[0_2px_8px_rgba(31,150,247,0.3)]">
          {getInitials(studentName)}
        </div>
      </div>
    </header>
  );
}
