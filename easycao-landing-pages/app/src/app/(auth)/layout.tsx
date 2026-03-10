import Image from "next/image";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Easycao — Entrar",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-light flex flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <Image src="/logo.webp" alt="Easycao" width={40} height={40} />
            <span className="text-xl font-bold text-primary tracking-tight">
              Easycao
            </span>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-border p-8">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
