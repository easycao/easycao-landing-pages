import Image from "next/image";
import Link from "next/link";

export default function CourseNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary flex-shrink-0">
        <div className="px-5 lg:px-8 h-14 lg:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.webp" alt="Easycao" width={32} height={32} />
            <span className="font-bold text-white">Anotações do Curso</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/crm"
              className="text-sm text-white/80 hover:text-white transition-colors duration-200"
            >
              CRM
            </Link>
            <span className="w-px h-4 bg-white/20" />
            <Link
              href="/admin/crm/logs"
              className="text-sm text-white/80 hover:text-white transition-colors duration-200"
            >
              Logs
            </Link>
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
