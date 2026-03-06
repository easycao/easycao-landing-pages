import type { Metadata } from "next";
import { SITE_URL } from "../../../lib/constants";
import {
  courseSchema,
  personSchema,
  mobileApplicationSchema,
  faqSchema,
  breadcrumbSchema,
} from "../../../lib/schema";
import SalesHero from "./SalesHero";
import ApprovalCarousel from "../../../components/ApprovalCarousel";
import CaseStudies from "./CaseStudies";
import TargetAudience from "./TargetAudience";
import ProblemSection from "./ProblemSection";
import AgitationSection from "./AgitationSection";
import FlightPlan from "./FlightPlan";
import CopilotSection from "./CopilotSection";
import SimulatorSection from "./SimulatorSection";
import MentoriaSection from "./MentoriaSection";
import StudyExperience from "./StudyExperience";
import CommunitySection from "./CommunitySection";

import BonusStack from "./BonusStack";
import ValueStack from "./ValueStack";
import GuaranteeSection from "./GuaranteeSection";
import SalesFAQ from "./SalesFAQ";
import FinalCTA from "./FinalCTA";


export const metadata: Metadata = {
  title: "Método Easycao — Como Ser Aprovado no Exame ICAO | Easycao",
  description:
    "Descubra os 3 fatores que levam qualquer piloto do zero ao ICAO em 6 meses. +1000 pilotos aprovados, simulador exclusivo e garantia de 7 dias.",
  alternates: { canonical: "/metodo" },
  openGraph: {
    title: "Método Easycao — Como Ser Aprovado no Exame ICAO",
    description:
      "Descubra os 3 fatores que levam qualquer piloto do zero ao ICAO em 6 meses. +1000 pilotos aprovados, simulador exclusivo e garantia de 7 dias.",
    url: `${SITE_URL}/metodo`,
    siteName: "Easycao",
    type: "website",
    locale: "pt_BR",
  },
};

const salesFaqs = [
  { question: "Para quem é o Método Easycao?", answer: "Para pilotos que precisam ser aprovados na prova ICAO de proficiência em inglês." },
  { question: "Funciona para quem nunca fez a prova?", answer: "Sim! O método foi criado para preparar você do zero." },
  { question: "Sou iniciante em inglês. Consigo acompanhar?", answer: "Sim. Ensinamos tudo do zero e a maior parte dos nossos alunos começou do zero." },
  { question: "Quanto tempo tenho de acesso?", answer: "A matrícula tem duração de um ano." },
  { question: "Posso parcelar?", answer: "Sim, em até 12x de R$305,82 no cartão." },
  { question: "Como funciona a garantia?", answer: "7 dias, 100% do dinheiro de volta. Basta solicitar direto na Hotmart." },
  { question: "É diferente de outros cursos de inglês? E de outros preparatórios ICAO?", answer: "Sim, focado na prova ICAO por examinador credenciado e treinado pela ANAC." },
  { question: "Por onde acesso o curso?", answer: "O curso é acessado pela plataforma Hotmart. Assim que a matrícula é confirmada, você recebe um e-mail com o link de acesso. Pode assistir no computador, celular, tablet ou TV — e as aulas ficam disponíveis para download e acesso offline." },
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
              { name: "Método Easycao", url: `${SITE_URL}/metodo` },
            ])
          ),
        }}
      />

      <SalesHero />
      <ApprovalCarousel />
      <CaseStudies />
      <TargetAudience />
      <ProblemSection />
      <AgitationSection />
      <FlightPlan />
      <CopilotSection />
      <SimulatorSection />
      <MentoriaSection />
      <StudyExperience />
      <CommunitySection />
      <BonusStack />
      <ValueStack />
      <GuaranteeSection />
      <hr className="border-gray-border max-w-3xl mx-auto" />
      <SalesFAQ />
      <FinalCTA />
    </>
  );
}
