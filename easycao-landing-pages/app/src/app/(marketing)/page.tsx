import type { Metadata } from "next";
import { SITE_URL } from "../../lib/constants";
import { organizationSchema, personSchema, mobileApplicationSchema } from "../../lib/schema";
import HomepageHero from "./HomepageHero";
import TrustStrip from "./TrustStrip";
import WhatIsEasycao from "./WhatIsEasycao";
import ContentHub from "./ContentHub";
import ProfessorSection from "../../components/ProfessorSection";
import AppBanner from "../../components/AppBanner";
import ApprovalCarousel from "../../components/ApprovalCarousel";
import LivesBanner from "./LivesBanner";
import CTAFinal from "./CTAFinal";

export const metadata: Metadata = {
  title: "Easycao — Tudo sobre a Prova ICAO",
  description:
    "Tudo que você precisa para ser aprovado na Prova ICAO. A maior escola preparatória para a Prova ICAO no Brasil, com método criado por examinador credenciado.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Easycao — Tudo que Você Precisa para Ser Aprovado na Prova ICAO",
    description:
      "A maior escola preparatória para a Prova ICAO no Brasil. Simulador, comunidade e lives gratuitas com examinador ICAO credenciado.",
    url: SITE_URL,
    siteName: "Easycao",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Easycao — Tudo sobre a Prova ICAO",
      },
    ],
    type: "website",
    locale: "pt_BR",
  },
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileApplicationSchema()) }}
      />

      <HomepageHero />
      <TrustStrip />
      <WhatIsEasycao />
      <ContentHub />
      <ProfessorSection />
      <AppBanner variant="section" />
      <ApprovalCarousel />
      <LivesBanner />
      <CTAFinal />
    </>
  );
}
