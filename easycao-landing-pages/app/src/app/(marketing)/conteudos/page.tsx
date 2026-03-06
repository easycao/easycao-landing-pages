import type { Metadata } from "next";
import { SITE_URL } from "../../../lib/constants";
import ConteudosContent from "./ConteudosContent";

export const metadata: Metadata = {
  title: "Tudo sobre a Prova ICAO | Easycao",
  description:
    "Guias completos, dicas práticas e recursos gratuitos para você se preparar e ser aprovado na prova ICAO. Preparação, descritores, níveis, custos e simulados.",
  alternates: { canonical: "/conteudos" },
  openGraph: {
    title: "Tudo sobre a Prova ICAO | Easycao",
    description:
      "Guias completos, dicas práticas e recursos gratuitos para você se preparar e ser aprovado na prova ICAO.",
    url: `${SITE_URL}/conteudos`,
    siteName: "Easycao",
    type: "website",
    locale: "pt_BR",
  },
};

export default function ConteudosPage() {
  return <ConteudosContent />;
}
