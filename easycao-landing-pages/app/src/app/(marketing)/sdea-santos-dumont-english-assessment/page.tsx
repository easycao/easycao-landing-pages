import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";

const PAGE_SLUG = "sdea-santos-dumont-english-assessment";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "o-que-e", text: "O que é o SDEA", level: 2 },
  { id: "sdea-vs-icao", text: "SDEA vs prova ICAO — é a mesma coisa?", level: 2 },
  { id: "como-funciona", text: "Como funciona o SDEA", level: 2 },
  { id: "quem-aplica", text: "Quem aplica o SDEA", level: 2 },
  { id: "historico", text: "Histórico e mudanças recentes", level: 2 },
];

const faqs = [
  { question: "O que significa SDEA?", answer: "SDEA significa Santos Dumont English Assessment. É o nome oficial dado pela ANAC para a avaliação de proficiência linguística em inglês para profissionais da aviação no Brasil." },
  { question: "SDEA é a mesma coisa que prova ICAO?", answer: "Sim. SDEA é o nome brasileiro para a avaliação de proficiência em inglês seguindo os padrões da ICAO. Os critérios, descritores e níveis são os mesmos definidos no Doc 9835 da ICAO." },
  { question: "O SDEA mudou recentemente?", answer: "A ANAC faz atualizações periódicas no regulamento, mas os critérios fundamentais de avaliação (6 descritores, níveis 1-6) seguem o padrão internacional da ICAO desde 2010." },
  { question: "Posso fazer o SDEA em qualquer centro?", answer: "Sim, desde que o centro seja credenciado pela ANAC. A lista de centros está disponível no portal da ANAC." },
  { question: "O resultado do SDEA é válido internacionalmente?", answer: "Sim. O SDEA segue os padrões da ICAO e o resultado é reconhecido internacionalmente como avaliação de proficiência linguística para aviação." },
];

export default function SDEAPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="o-que-e">O que é o SDEA</h2>
      <p>O SDEA (Santos Dumont English Assessment) é o nome oficial dado pela <a href="https://www.gov.br/anac/pt-br/assuntos/regulados/profissionais-da-aviacao-civil/proficiencia-linguistica" target="_blank" rel="noopener noreferrer">ANAC</a> para a avaliação de proficiência linguística em inglês para pilotos e controladores de tráfego aéreo no Brasil.</p>
      <p>Criado para atender aos requisitos da ICAO (Organização da Aviação Civil Internacional), o SDEA avalia a capacidade do profissional de se comunicar em inglês em contextos aeronáuticos.</p>

      <CalloutBox variant="info" title="SDEA = Prova ICAO">
        SDEA é simplesmente o nome brasileiro para a avaliação de proficiência ICAO. Os critérios, descritores e níveis são idênticos ao padrão internacional.
      </CalloutBox>

      <h2 id="sdea-vs-icao">SDEA vs prova ICAO — é a mesma coisa?</h2>
      <p>Sim. "SDEA", "prova ICAO", "prova de proficiência linguística" e "avaliação de inglês da ANAC" são todos nomes para o mesmo exame. A diferença é apenas de nomenclatura:</p>
      <ul>
        <li><strong>SDEA:</strong> Nome oficial brasileiro (Santos Dumont English Assessment)</li>
        <li><strong>Prova ICAO:</strong> Nome popular, referenciando o padrão internacional</li>
        <li><strong>EPLIS:</strong> Sigla em inglês (English Proficiency Language for International Standards)</li>
      </ul>
      <p>Independente do nome, o exame avalia os mesmos <Link href="/descritores-da-prova-icao">6 descritores holísticos</Link> e segue a mesma escala de <Link href="/niveis-icao">níveis 1 a 6</Link>.</p>

      <h2 id="como-funciona">Como funciona o SDEA</h2>
      <p>O SDEA segue exatamente o mesmo formato descrito nas normas da ICAO. Saiba tudo sobre <Link href="/como-funciona-a-prova-icao">como funciona a prova ICAO</Link>, incluindo as 4 partes, duração e sistema de avaliação.</p>
      <p>Resumidamente: é uma prova presencial, 100% oral, com duração de aproximadamente 50 minutos, conduzida por examinadores credenciados pela ANAC.</p>

      <h2 id="quem-aplica">Quem aplica o SDEA</h2>
      <p>O SDEA só pode ser aplicado por entidades credenciadas pela ANAC. Existem cerca de 11 centros espalhados pelo Brasil, concentrados principalmente na região Sudeste.</p>
      <p>Veja a lista completa de <Link href="/onde-fazer-a-prova-icao">centros credenciados pela ANAC</Link> e saiba como agendar sua avaliação.</p>

      <h2 id="historico">Histórico e mudanças recentes</h2>
      <p>O sistema de avaliação de proficiência linguística no Brasil segue os padrões da ICAO desde 2008, quando os requisitos de proficiência se tornaram obrigatórios mundialmente. Ao longo dos anos, a ANAC fez ajustes regulatórios:</p>
      <ul>
        <li><strong>2008:</strong> Implementação inicial dos requisitos ICAO no Brasil</li>
        <li><strong>2010:</strong> Doc 9835 da ICAO estabelece os 6 descritores holísticos definitivos</li>
        <li><strong>2024-2025:</strong> Atualizações regulatórias da ANAC sobre centros credenciados e procedimentos</li>
      </ul>
      <p>Os critérios de avaliação fundamentais (6 descritores, escala 1-6) permanecem estáveis desde 2010 e não têm previsão de mudança significativa.</p>
    </ContentPageLayout>
  );
}
