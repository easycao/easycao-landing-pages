import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Você Está Quase Lá! — Easycao",
  description:
    "Cadastro confirmado. Entre no grupo do WhatsApp para receber os avisos das lives gratuitas da Easycao.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Você Está Quase Lá! — Easycao",
    description:
      "Cadastro confirmado. Entre no grupo do WhatsApp para receber os avisos das lives gratuitas.",
    siteName: "Easycao",
    type: "website",
    locale: "pt_BR",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
