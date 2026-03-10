"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import Sidebar from "@/components/platform/Sidebar";
import Header from "@/components/platform/Header";

function PlatformShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    async function fetchStudent() {
      try {
        const res = await fetch(`/api/platform/me?uid=${user!.uid}`);
        if (res.ok) {
          const data = await res.json();
          setStudentName(data.name || user!.email);
          setIsAdmin(data.role === "admin");
        } else {
          setStudentName(user!.email || "Aluno");
        }
      } catch {
        setStudentName(user!.email || "Aluno");
      }
      setReady(true);
    }
    fetchStudent();
  }, [user, loading, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (loading || !user || !ready) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1e3d] to-[#0d2a52]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary-light border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-white/40">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen flex overflow-hidden transition-none ${
        isDark
          ? "bg-[#050507]"
          : "bg-gray-light"
      }`}
      style={isDark ? { background: "linear-gradient(160deg, #07070A 0%, #050508 35%, #06060B 65%, #040408 100%)" } : undefined}
    >
      {/* Background effects — grid, ambient lights, sweep */}
      <div className={isDark ? "platform-lights-dark" : "platform-lights-light"} />
      <div className={isDark ? "platform-grid-dark" : "platform-grid-light"} />
      <div className={isDark ? "platform-sweep-dark" : "platform-sweep-light"} />

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[260px] flex-shrink-0 flex-col relative z-10">
        <Sidebar isAdmin={isAdmin} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-[280px] z-50 lg:hidden shadow-2xl">
            <Sidebar
              isAdmin={isAdmin}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header
          pathname={pathname}
          studentName={studentName}
          onMenuToggle={() => setMobileMenuOpen((v) => !v)}
        />
        <main className={`flex-1 overflow-y-auto px-5 lg:px-10 py-6 lg:py-8 ${isDark ? "platform-scroll" : "platform-scroll-light"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PlatformShell>{children}</PlatformShell>
      </ThemeProvider>
    </AuthProvider>
  );
}
