import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import { mobileApplicationSchema } from "../../../lib/schema";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import AppBanner from "../../../components/AppBanner";

const PAGE_SLUG = "simulado-prova-icao";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "o-que-e", text: "O que é um simulado ICAO", level: 2 },
  { id: "simulador-easycao", text: "O Simulador Easycao", level: 2 },
  { id: "como-funciona-app", text: "Como funciona o app", level: 3 },
  { id: "recursos", text: "Recursos do simulador", level: 3 },
  { id: "sem-app", text: "Como praticar sem o app", level: 2 },
  { id: "por-que-essenciais", text: "Por que simulados são essenciais", level: 2 },
];

const faqs = [
  { question: "O simulador Easycao é gratuito?", answer: "O app tem versão gratuita com funcionalidades limitadas. O acesso completo está incluso no Método Easycao." },
  { question: "Preciso do app para me preparar?", answer: "Não é obrigatório, mas é altamente recomendado. O app é a forma mais eficiente de praticar todos os descritores com feedback automático." },
  { question: "O simulador substitui a prática com pessoas?", answer: "Não totalmente. O simulador é excelente para prática individual, mas a interação com outras pessoas (lives, aulas) complementa a preparação, especialmente para o descritor Interaction." },
  { question: "Quantas vezes posso usar o simulador?", answer: "Ilimitado. Com 283 trilhões+ de combinações, você nunca terá o mesmo cenário duas vezes." },
  { question: "O app funciona offline?", answer: "Algumas funcionalidades estão disponíveis offline. Para feedback completo por descritor, é necessária conexão com internet." },
];

export default function SimuladoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      {/* MobileApplication schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileApplicationSchema()) }}
      />

      <h2 id="o-que-e">O que é um simulado ICAO</h2>
      <p>Um simulado ICAO é uma prática que reproduz as condições reais da <Link href="/como-funciona-a-prova-icao">prova ICAO</Link>: cenários de aviação, interação com examinador e avaliação por <Link href="/descritores-da-prova-icao">descritor</Link>.</p>
      <p>Fazer simulados é a forma mais eficaz de se preparar porque permite identificar pontos fracos, ganhar confiança e se acostumar com o formato da prova antes do dia real.</p>

      <h2 id="simulador-easycao">O Simulador Easycao</h2>
      <p>O Simulador Easycao é o único simulador ICAO do mercado brasileiro. Desenvolvido com base no Doc 9835 da ICAO, ele reproduz fielmente as 4 partes da prova com feedback automático por descritor.</p>

      <h3 id="como-funciona-app">Como funciona o app</h3>
      <ol>
        <li><strong>Escolha um cenário:</strong> Selecione entre Aviation Topics, Interacting, Unexpected Situations ou Picture Description</li>
        <li><strong>Grave sua resposta:</strong> Fale naturalmente como faria na prova real</li>
        <li><strong>Receba feedback:</strong> O app analisa sua resposta e fornece feedback por cada um dos 6 descritores</li>
        <li><strong>Acompanhe seu progresso:</strong> Veja sua evolução ao longo do tempo em cada descritor</li>
      </ol>

      <h3 id="recursos">Recursos do simulador</h3>
      <ul>
        <li><strong>283 trilhões+ de combinações:</strong> Cenários nunca se repetem</li>
        <li><strong>Feedback por descritor:</strong> Saiba exatamente onde melhorar</li>
        <li><strong>Baseado no Doc 9835:</strong> Critérios idênticos aos da prova real</li>
        <li><strong>iOS e Android:</strong> Disponível para ambas as plataformas</li>
        <li><strong>Prática diária:</strong> Sessões de 10-15 minutos por dia já fazem diferença</li>
      </ul>

      <AppBanner variant="section" />

      <h2 id="sem-app">Como praticar sem o app</h2>
      <p>Se você ainda não tem acesso ao simulador, existem alternativas gratuitas:</p>
      <ul>
        <li><strong><Link href="/lives">Lives da Easycao:</Link></strong> Simulados ao vivo com correção do professor</li>
        <li><strong>Auto-gravação:</strong> Grave-se respondendo perguntas sobre aviação e analise depois</li>
        <li><strong>Prática em dupla:</strong> Encontre um colega piloto para simular a prova</li>
        <li><strong>Vídeos no YouTube:</strong> Canal da Easycao com exemplos e correções</li>
      </ul>

      <h2 id="por-que-essenciais">Por que simulados são essenciais</h2>
      <p>A prova ICAO é 100% oral e em tempo real. Não há como "estudar" para ela como para uma prova escrita. A única forma eficaz de se preparar é praticando a produção oral em cenários reais de aviação.</p>
      <p>Estudos mostram que pilotos que fizeram pelo menos 10 simulados completos antes da prova tiveram taxa de aprovação significativamente superior aos que estudaram apenas teoria.</p>
      <p>Saiba mais sobre <Link href="/como-se-preparar-para-a-prova-icao">como se preparar de forma completa</Link> para a prova ICAO.</p>

    </ContentPageLayout>
  );
}
