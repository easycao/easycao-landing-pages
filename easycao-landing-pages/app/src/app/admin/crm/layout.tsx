import { redirect } from "next/navigation";
import { getSessionFromCookies, checkIsAdmin } from "@/lib/auth";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session) redirect("/admin");

  const isAdmin = await checkIsAdmin(session.uid);
  if (!isAdmin) redirect("/admin");

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-border">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-14 lg:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.webp" alt="Easycao" width={32} height={32} />
            <span className="font-bold text-black">CRM</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-black/50 hidden sm:block">
              {session.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
