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
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "o-que-e", text: "O que e o SDEA", level: 2 },
  { id: "sdea-vs-icao", text: "SDEA vs prova ICAO — e a mesma coisa?", level: 2 },
  { id: "como-funciona", text: "Como funciona o SDEA", level: 2 },
  { id: "quem-aplica", text: "Quem aplica o SDEA", level: 2 },
  { id: "historico", text: "Historico e mudancas recentes", level: 2 },
];

const faqs = [
  { question: "O que significa SDEA?", answer: "SDEA significa Santos Dumont English Assessment. E o nome oficial dado pela ANAC para a avaliacao de proficiencia linguistica em ingles para profissionais da aviacao no Brasil." },
  { question: "SDEA e a mesma coisa que prova ICAO?", answer: "Sim. SDEA e o nome brasileiro para a avaliacao de proficiencia em ingles seguindo os padroes da ICAO. Os criterios, descritores e niveis sao os mesmos definidos no Doc 9835 da ICAO." },
  { question: "O SDEA mudou recentemente?", answer: "A ANAC faz atualizacoes periodicas no regulamento, mas os criterios fundamentais de avaliacao (6 descritores, niveis 1-6) seguem o padrao internacional da ICAO desde 2010." },
  { question: "Posso fazer o SDEA em qualquer centro?", answer: "Sim, desde que o centro seja credenciado pela ANAC. A lista de centros esta disponivel no portal da ANAC." },
  { question: "O resultado do SDEA e valido internacionalmente?", answer: "Sim. O SDEA segue os padroes da ICAO e o resultado e reconhecido internacionalmente como avaliacao de proficiencia linguistica para aviacao." },
];

export default function SDEAPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="o-que-e">O que e o SDEA</h2>
      <p>O SDEA (Santos Dumont English Assessment) e o nome oficial dado pela <a href="https://www.gov.br/anac/pt-br/assuntos/regulados/profissionais-da-aviacao-civil/proficiencia-linguistica" target="_blank" rel="noopener noreferrer">ANAC</a> para a avaliacao de proficiencia linguistica em ingles para pilotos e controladores de trafego aereo no Brasil.</p>
      <p>Criado para atender aos requisitos da ICAO (Organizacao da Aviacao Civil Internacional), o SDEA avalia a capacidade do profissional de se comunicar em ingles em contextos aeronauticos.</p>

      <CalloutBox variant="info" title="SDEA = Prova ICAO">
        SDEA e simplesmente o nome brasileiro para a avaliacao de proficiencia ICAO. Os criterios, descritores e niveis sao identicos ao padrao internacional.
      </CalloutBox>

      <h2 id="sdea-vs-icao">SDEA vs prova ICAO — e a mesma coisa?</h2>
      <p>Sim. "SDEA", "prova ICAO", "prova de proficiencia linguistica" e "avaliacao de ingles da ANAC" sao todos nomes para o mesmo exame. A diferenca e apenas de nomenclatura:</p>
      <ul>
        <li><strong>SDEA:</strong> Nome oficial brasileiro (Santos Dumont English Assessment)</li>
        <li><strong>Prova ICAO:</strong> Nome popular, referenciando o padrao internacional</li>
        <li><strong>EPLIS:</strong> Sigla em ingles (English Proficiency Language for International Standards)</li>
      </ul>
      <p>Independente do nome, o exame avalia os mesmos <Link href="/descritores-da-prova-icao">6 descritores holisticos</Link> e segue a mesma escala de <Link href="/niveis-icao">niveis 1 a 6</Link>.</p>

      <h2 id="como-funciona">Como funciona o SDEA</h2>
      <p>O SDEA segue exatamente o mesmo formato descrito nas normas da ICAO. Saiba tudo sobre <Link href="/como-funciona-a-prova-icao">como funciona a prova ICAO</Link>, incluindo as 4 partes, duracao e sistema de avaliacao.</p>
      <p>Resumidamente: e uma prova presencial, 100% oral, com duracao de aproximadamente 50 minutos, conduzida por examinadores credenciados pela ANAC.</p>

      <h2 id="quem-aplica">Quem aplica o SDEA</h2>
      <p>O SDEA so pode ser aplicado por entidades credenciadas pela ANAC. Existem cerca de 11 centros espalhados pelo Brasil, concentrados principalmente na regiao Sudeste.</p>
      <p>Veja a lista completa de <Link href="/onde-fazer-a-prova-icao">centros credenciados pela ANAC</Link> e saiba como agendar sua avaliacao.</p>

      <h2 id="historico">Historico e mudancas recentes</h2>
      <p>O sistema de avaliacao de proficiencia linguistica no Brasil segue os padroes da ICAO desde 2008, quando os requisitos de proficiencia se tornaram obrigatorios mundialmente. Ao longo dos anos, a ANAC fez ajustes regulatorios:</p>
      <ul>
        <li><strong>2008:</strong> Implementacao inicial dos requisitos ICAO no Brasil</li>
        <li><strong>2010:</strong> Doc 9835 da ICAO estabelece os 6 descritores holisticos definitivos</li>
        <li><strong>2024-2025:</strong> Atualizacoes regulatorias da ANAC sobre centros credenciados e procedimentos</li>
      </ul>
      <p>Os criterios de avaliacao fundamentais (6 descritores, escala 1-6) permanecem estaveis desde 2010 e nao tem previsao de mudanca significativa.</p>
    </ContentPageLayout>
  );
}
