import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";
import AppBanner from "../../../components/AppBanner";

const PAGE_SLUG = "prova-icao-helicoptero";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "mesma-prova", text: "É a mesma prova de asa fixa?", level: 2 },
  { id: "diferencas", text: "Diferenças nos cenários", level: 2 },
  { id: "vocabulario", text: "Vocabulário específico de helicóptero", level: 2 },
  { id: "operacoes", text: "Operações típicas de asa rotativa", level: 2 },
  { id: "preparacao", text: "Como se preparar", level: 2 },
  { id: "simulador", text: "Simulador ICAO para helicóptero", level: 2 },
];

const faqs = [
  { question: "A prova ICAO para helicóptero é diferente?", answer: "A estrutura e os critérios de avaliação são idênticos. A diferença está nos cenários: o examinador pode usar situações específicas de operações de helicóptero durante a prova." },
  { question: "Preciso de ICAO para voar helicóptero offshore?", answer: "Sim. Operações offshore são internacionais por natureza (plataformas em águas internacionais), exigindo proficiência ICAO Level 4 ou superior." },
  { question: "Posso estudar com material de asa fixa?", answer: "Sim, a base é a mesma. Porém, complemente com vocabulário específico de helicóptero e cenários de operações de asa rotativa." },
  { question: "O examinador sabe que sou piloto de helicóptero?", answer: "Sim, essa informação consta no seu cadastro." },
];

export default function HelicopteroPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="mesma-prova">É a mesma prova de asa fixa?</h2>
      <p>Sim. A prova ICAO (<Link href="/sdea-santos-dumont-english-assessment">SDEA</Link>) para pilotos de helicóptero segue exatamente o mesmo formato, critérios e <Link href="/descritores-da-prova-icao">descritores</Link> da prova para pilotos de asa fixa.</p>
      <p>A <Link href="/como-funciona-a-prova-icao">estrutura da prova</Link> é idêntica: 4 partes, avaliação por 6 descritores holísticos, escala de <Link href="/niveis-icao">níveis 1 a 6</Link>. O que muda são os cenários e o vocabulário utilizado durante a avaliação.</p>

      <CalloutBox variant="info" title="Critérios idênticos">
        Os 6 descritores (Pronunciation, Structure, Vocabulary, Fluency, Comprehension, Interaction) são avaliados da mesma forma para pilotos de helicóptero e avião.
      </CalloutBox>

      <h2 id="diferencas">Diferenças nos cenários</h2>
      <p>O examinador pode adaptar os cenários para incluir situações típicas de operações de asa rotativa:</p>
      <ul>
        <li><strong>Parte 1 (Aviation Topics):</strong> Perguntas sobre sua experiência como piloto de helicóptero, tipos de operação, rotinas</li>
        <li><strong>Parte 2 (Interacting):</strong> Cenários de comunicação ATC específicos de helicóptero (operações em helipontos, FATO, helipads)</li>
        <li><strong>Parte 3 (Unexpected):</strong> Emergências típicas de asa rotativa (autorrotação, perda de cauda, brownout/whiteout)</li>
        <li><strong>Parte 4 (Pictures):</strong> Fotos de operações de helicóptero, offshore, HEMS, montanha</li>
      </ul>

      <h2 id="vocabulario">Vocabulário específico de helicóptero</h2>
      <p>Além do <Link href="/vocabulario-aviacao-ingles">vocabulário geral de aviação</Link>, domine estes termos:</p>
      <ul>
        <li><strong>Componentes:</strong> main rotor, tail rotor, collective, cyclic, skids, floats</li>
        <li><strong>Operações:</strong> hover, autorotation, sling load, hoist, winch, rappelling</li>
        <li><strong>Áreas de pouso:</strong> helipad, heliport, FATO (Final Approach and Takeoff area), TLOF (Touchdown and Liftoff area)</li>
        <li><strong>Emergências:</strong> tail rotor failure, mast bumping, ground resonance, vortex ring state, loss of tail rotor effectiveness (LTE)</li>
        <li><strong>Condições:</strong> brownout, whiteout, recirculation, downdraft, windshear in confined areas</li>
        <li><strong>Operações especiais:</strong> offshore operations, HEMS (Helicopter Emergency Medical Service), SAR (Search and Rescue), firefighting</li>
      </ul>

      <h2 id="operacoes">Operações típicas de asa rotativa</h2>
      <p>Esteja preparado para discutir estas operações em inglês:</p>
      <ul>
        <li><strong>Offshore (petróleo e gás):</strong> Operações em plataformas, deck procedures, passenger briefing, fuel management</li>
        <li><strong>HEMS (resgate aéreo):</strong> Medical emergencies, landing zone assessment, crew resource management</li>
        <li><strong>SAR (busca e salvamento):</strong> Search patterns, survivor recovery, coordination with ground teams</li>
        <li><strong>Utilidade:</strong> Sling load operations, power line inspection, aerial survey, agriculture</li>
        <li><strong>Executivo:</strong> VIP transport, urban heliports, noise abatement procedures</li>
      </ul>

      <h2 id="preparacao">Como se preparar</h2>
      <p>A preparação para pilotos de helicóptero segue os mesmos princípios da <Link href="/como-se-preparar-para-a-prova-icao">preparação geral</Link>, com estas adições:</p>
      <ul>
        <li>Estude vocabulário específico de asa rotativa em inglês</li>
        <li>Pratique descrevendo operações de helicóptero que você realiza no dia a dia</li>
        <li>Prepare-se para discutir emergências específicas (autorrotação, tail rotor failure)</li>
        <li>Familiarize-se com cenários offshore se essa é sua área de atuação</li>
        <li>Use o <Link href="/simulado-prova-icao">simulador Easycao</Link> para praticar todos os descritores</li>
      </ul>
      <p>Evite os <Link href="/erros-comuns-prova-icao">erros mais comuns</Link> e saiba <Link href="/quanto-tempo-preparar-prova-icao">quanto tempo investir na preparação</Link>.</p>

      <h2 id="simulador">Simulador ICAO para helicóptero</h2>
      <p>O <Link href="/simulado-prova-icao">Simulador Easycao</Link> inclui todas as provas de helicóptero: cenários de operações offshore, HEMS, SAR, sling load e muito mais. Você pratica com situações reais de asa rotativa e recebe feedback automático por descritor.</p>
      <p>É a melhor forma de treinar o vocabulário específico de helicóptero em contexto real de prova, com áudios, imagens e perguntas baseadas no Doc 9835 da ICAO.</p>

      <AppBanner variant="inline" />
    </ContentPageLayout>
  );
}
