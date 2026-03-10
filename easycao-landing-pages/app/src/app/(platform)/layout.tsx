"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/platform/Sidebar";
import Header from "@/components/platform/Header";

function PlatformShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
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

    // Fetch student data via API (avoids Firestore client rules issues)
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (loading || !user || !ready) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-black/50">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[260px] flex-shrink-0 border-r border-gray-border flex-col">
        <Sidebar isAdmin={isAdmin} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 lg:hidden shadow-2xl">
            <Sidebar
              isAdmin={isAdmin}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          pathname={pathname}
          studentName={studentName}
          onMenuToggle={() => setMobileMenuOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto px-5 lg:px-8 py-6 lg:py-8">
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
      <PlatformShell>{children}</PlatformShell>
    </AuthProvider>
  );
}
