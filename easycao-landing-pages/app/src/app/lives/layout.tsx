import type { Metadata } from "next";
import { SITE_URL } from "../../lib/constants";

export const metadata: Metadata = {
  title: "Lives Gratuitas — Seja Aprovado no Exame ICAO | Easycao",
  description:
    "Seja aprovado no exame ICAO e garanta as melhores oportunidades. Aulas ao vivo gratuitas toda terça e quinta-feira com examinador ICAO credenciado.",
  alternates: { canonical: "/lives" },
  openGraph: {
    title: "Lives Gratuitas — Seja Aprovado no Exame ICAO | Easycao",
    description:
      "Aulas ao vivo gratuitas toda terça e quinta-feira. +1000 pilotos aprovados com o método do único examinador ICAO credenciado que ensina.",
    url: `${SITE_URL}/lives`,
    siteName: "Easycao",
    type: "website",
    locale: "pt_BR",
  },
};

export default function LivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
