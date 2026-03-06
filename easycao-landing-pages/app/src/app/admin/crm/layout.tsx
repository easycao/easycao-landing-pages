import { redirect } from "next/navigation";
import { getSessionFromCookies, checkIsAdmin } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
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
    <div className="h-screen flex flex-col overflow-hidden bg-white relative">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-primary flex-shrink-0">
        <div className="px-5 lg:px-8 h-14 lg:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.webp" alt="Easycao" width={32} height={32} />
            <span className="font-bold text-white">Easycao CRM</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/crm/logs"
              className="text-sm text-white/80 hover:text-white transition-colors duration-200"
            >
              Logs
            </Link>
            <span className="w-px h-4 bg-white/20" />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-5 lg:px-8 py-6 lg:py-8 flex-1 min-h-0 overflow-y-auto crm-scroll">
        {children}
      </main>
    </div>
  );
}
