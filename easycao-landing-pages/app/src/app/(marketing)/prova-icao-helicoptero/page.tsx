import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";

const PAGE_SLUG = "prova-icao-helicoptero";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "mesma-prova", text: "E a mesma prova de asa fixa?", level: 2 },
  { id: "diferencas", text: "Diferencas nos cenarios", level: 2 },
  { id: "vocabulario", text: "Vocabulario especifico de helicoptero", level: 2 },
  { id: "operacoes", text: "Operacoes tipicas de asa rotativa", level: 2 },
  { id: "preparacao", text: "Como se preparar", level: 2 },
];

const faqs = [
  { question: "A prova ICAO para helicoptero e diferente?", answer: "A estrutura e os criterios de avaliacao sao identicos. A diferenca esta nos cenarios: o examinador pode usar situacoes especificas de operacoes de helicoptero durante a prova." },
  { question: "Preciso de ICAO para voar helicoptero offshore?", answer: "Sim. Operacoes offshore sao internacionais por natureza (plataformas em aguas internacionais), exigindo proficiencia ICAO Level 4 ou superior." },
  { question: "Posso estudar com material de asa fixa?", answer: "Sim, a base e a mesma. Porem, complemente com vocabulario especifico de helicoptero e cenarios de operacoes de asa rotativa." },
  { question: "O examinador sabe que sou piloto de helicoptero?", answer: "Sim, essa informacao consta no seu cadastro. O examinador pode adaptar cenarios para incluir situacoes mais relevantes a sua operacao." },
];

export default function HelicopteroPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="mesma-prova">E a mesma prova de asa fixa?</h2>
      <p>Sim. A prova ICAO (<Link href="/sdea-santos-dumont-english-assessment">SDEA</Link>) para pilotos de helicoptero segue exatamente o mesmo formato, criterios e <Link href="/descritores-da-prova-icao">descritores</Link> da prova para pilotos de asa fixa.</p>
      <p>A <Link href="/como-funciona-a-prova-icao">estrutura da prova</Link> e identica: 4 partes, avaliacao por 6 descritores holisticos, escala de <Link href="/niveis-icao">niveis 1 a 6</Link>. O que muda sao os cenarios e o vocabulario utilizado durante a avaliacao.</p>

      <CalloutBox variant="info" title="Criterios identicos">
        Os 6 descritores (Pronunciation, Structure, Vocabulary, Fluency, Comprehension, Interaction) sao avaliados da mesma forma para pilotos de helicoptero e aviao.
      </CalloutBox>

      <h2 id="diferencas">Diferencas nos cenarios</h2>
      <p>O examinador pode adaptar os cenarios para incluir situacoes tipicas de operacoes de asa rotativa:</p>
      <ul>
        <li><strong>Parte 1 (Aviation Topics):</strong> Perguntas sobre sua experiencia como piloto de helicoptero, tipos de operacao, rotinas</li>
        <li><strong>Parte 2 (Interacting):</strong> Cenarios de comunicacao ATC especificos de helicoptero (operacoes em helipontos, FATO, helipads)</li>
        <li><strong>Parte 3 (Unexpected):</strong> Emergencias tipicas de asa rotativa (autorotacao, perda de cauda, brownout/whiteout)</li>
        <li><strong>Parte 4 (Pictures):</strong> Fotos de operacoes de helicoptero, offshore, HEMS, montanha</li>
      </ul>

      <h2 id="vocabulario">Vocabulario especifico de helicoptero</h2>
      <p>Alem do <Link href="/vocabulario-aviacao-ingles">vocabulario geral de aviacao</Link>, domine estes termos:</p>
      <ul>
        <li><strong>Componentes:</strong> main rotor, tail rotor, collective, cyclic, skids, floats</li>
        <li><strong>Operacoes:</strong> hover, autorotation, sling load, hoist, winch, rappelling</li>
        <li><strong>Areas de pouso:</strong> helipad, heliport, FATO (Final Approach and Takeoff area), TLOF (Touchdown and Liftoff area)</li>
        <li><strong>Emergencias:</strong> tail rotor failure, mast bumping, ground resonance, vortex ring state, loss of tail rotor effectiveness (LTE)</li>
        <li><strong>Condicoes:</strong> brownout, whiteout, recirculation, downdraft, windshear in confined areas</li>
        <li><strong>Operacoes especiais:</strong> offshore operations, HEMS (Helicopter Emergency Medical Service), SAR (Search and Rescue), firefighting</li>
      </ul>

      <h2 id="operacoes">Operacoes tipicas de asa rotativa</h2>
      <p>Esteja preparado para discutir estas operacoes em ingles:</p>
      <ul>
        <li><strong>Offshore (petroleo e gas):</strong> Operacoes em plataformas, deck procedures, passenger briefing, fuel management</li>
        <li><strong>HEMS (resgate aereo):</strong> Medical emergencies, landing zone assessment, crew resource management</li>
        <li><strong>SAR (busca e salvamento):</strong> Search patterns, survivor recovery, coordination with ground teams</li>
        <li><strong>Utilidade:</strong> Sling load operations, power line inspection, aerial survey, agriculture</li>
        <li><strong>Executivo:</strong> VIP transport, urban heliports, noise abatement procedures</li>
      </ul>

      <h2 id="preparacao">Como se preparar</h2>
      <p>A preparacao para pilotos de helicoptero segue os mesmos principios da <Link href="/como-se-preparar-para-a-prova-icao">preparacao geral</Link>, com estas adicoes:</p>
      <ul>
        <li>Estude vocabulario especifico de asa rotativa em ingles</li>
        <li>Pratique descrevendo operacoes de helicoptero que voce realiza no dia a dia</li>
        <li>Prepare-se para discutir emergencias especificas (autorotacao, tail rotor failure)</li>
        <li>Familiarize-se com cenarios offshore se essa e sua area de atuacao</li>
        <li>Use o <Link href="/simulado-prova-icao">simulador Easycao</Link> para praticar todos os descritores</li>
      </ul>
      <p>Evite os <Link href="/erros-comuns-prova-icao">erros mais comuns</Link> e saiba <Link href="/quanto-tempo-preparar-prova-icao">quanto tempo investir na preparacao</Link>.</p>
    </ContentPageLayout>
  );
}
