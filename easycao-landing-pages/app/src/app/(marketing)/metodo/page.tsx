import type { Metadata } from "next";
import { SITE_URL, SITE_DESCRIPTION } from "../../../lib/constants";
import {
  courseSchema,
  personSchema,
  mobileApplicationSchema,
  faqSchema,
  breadcrumbSchema,
} from "../../../lib/schema";
import SalesHero from "./SalesHero";
import ProblemSection from "./ProblemSection";
import AgitationSection from "./AgitationSection";
import AuthoritySection from "./AuthoritySection";
import MethodReveal from "./MethodReveal";
import TestimonialsGrid from "./TestimonialsGrid";
import ModuleCards from "./ModuleCards";
import SimulatorSection from "./SimulatorSection";
import CommunitySection from "./CommunitySection";
import BonusStack from "./BonusStack";
import MuralAprovados from "./MuralAprovados";
import ValueStack from "./ValueStack";
import GuaranteeSection from "./GuaranteeSection";
import SalesFAQ from "./SalesFAQ";
import FinalCTA from "./FinalCTA";
import StickyMobileCTA from "./StickyMobileCTA";

export const metadata: Metadata = {
  title: "Metodo Easycao — Seja Aprovado na Prova ICAO | Easycao",
  description:
    "O metodo que ja aprovou mais de 1000 pilotos na prova ICAO. Criado pelo unico examinador credenciado que ensina. Simulador, comunidade e lives gratuitas.",
  alternates: { canonical: "/metodo" },
  openGraph: {
    title: "Metodo Easycao — Seja Aprovado na Prova ICAO",
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/metodo`,
    siteName: "Easycao",
    type: "website",
    locale: "pt_BR",
  },
};

const salesFaqs = [
  { question: "Para quem e o Metodo Easycao?", answer: "Para pilotos que precisam ser aprovados na prova ICAO." },
  { question: "Funciona para quem nunca fez a prova?", answer: "Sim, o metodo prepara do zero." },
  { question: "E para quem ja reprovou?", answer: "Especialmente. O metodo identifica e corrige pontos fracos." },
  { question: "Quanto tempo de acesso?", answer: "Acesso vitalicio ao conteudo." },
  { question: "Posso parcelar?", answer: "Sim, em ate 12x no cartao." },
  { question: "Como funciona a garantia?", answer: "30 dias, 100% do dinheiro de volta." },
  { question: "Tem suporte?", answer: "Sim, via comunidade WhatsApp e equipe." },
  { question: "Quando comecam as aulas?", answer: "Acesso imediato apos pagamento." },
  { question: "E diferente de outros cursos?", answer: "Sim, focado na prova ICAO por examinador credenciado." },
  { question: "Posso acessar pelo celular?", answer: "Sim, em qualquer dispositivo." },
];

export default function MetodoPage() {
  return (
    <>
      {/* JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileApplicationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(salesFaqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: "Metodo Easycao", url: `${SITE_URL}/metodo` },
            ])
          ),
        }}
      />

      <SalesHero />
      <ProblemSection />
      <AgitationSection />
      <AuthoritySection />
      <MethodReveal />
      <TestimonialsGrid />
      <ModuleCards />
      <SimulatorSection />
      <CommunitySection />
      <BonusStack />
      <MuralAprovados />
      <ValueStack />
      <GuaranteeSection />
      <SalesFAQ />
      <FinalCTA />
      <StickyMobileCTA />
    </>
  );
}
