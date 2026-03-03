import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro Confirmado — Easycao",
  description: "Seu cadastro foi confirmado. Entre no grupo do WhatsApp para receber os avisos das lives.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
