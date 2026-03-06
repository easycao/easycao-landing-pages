"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-white/80 hover:text-white transition-colors duration-200"
    >
      Sair
    </button>
  );
}
