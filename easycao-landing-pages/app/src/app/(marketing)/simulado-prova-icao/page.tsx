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
  { id: "o-que-e", text: "O que e um simulado ICAO", level: 2 },
  { id: "simulador-easycao", text: "O Simulador Easycao", level: 2 },
  { id: "como-funciona-app", text: "Como funciona o app", level: 3 },
  { id: "recursos", text: "Recursos do simulador", level: 3 },
  { id: "sem-app", text: "Como praticar sem o app", level: 2 },
  { id: "por-que-essenciais", text: "Por que simulados sao essenciais", level: 2 },
];

const faqs = [
  { question: "O simulador Easycao e gratuito?", answer: "O app tem versao gratuita com funcionalidades limitadas. O acesso completo esta incluso no Metodo Easycao." },
  { question: "Preciso do app para me preparar?", answer: "Nao e obrigatorio, mas e altamente recomendado. O app e a forma mais eficiente de praticar todos os descritores com feedback automatico." },
  { question: "O simulador substitui a pratica com pessoas?", answer: "Nao totalmente. O simulador e excelente para pratica individual, mas a interacao com outras pessoas (lives, aulas) complementa a preparacao, especialmente para o descritor Interaction." },
  { question: "Quantas vezes posso usar o simulador?", answer: "Ilimitado. Com 283 trilhoes+ de combinacoes, voce nunca tera o mesmo cenario duas vezes." },
  { question: "O app funciona offline?", answer: "Algumas funcionalidades estao disponiveis offline. Para feedback completo por descritor, e necessaria conexao com internet." },
];

export default function SimuladoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      {/* MobileApplication schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileApplicationSchema()) }}
      />

      <h2 id="o-que-e">O que e um simulado ICAO</h2>
      <p>Um simulado ICAO e uma pratica que reproduz as condicoes reais da <Link href="/como-funciona-a-prova-icao">prova ICAO</Link>: cenarios de aviacao, interacao com examinador e avaliacao por <Link href="/descritores-da-prova-icao">descritor</Link>.</p>
      <p>Fazer simulados e a forma mais eficaz de se preparar porque permite identificar pontos fracos, ganhar confianca e se acostumar com o formato da prova antes do dia real.</p>

      <h2 id="simulador-easycao">O Simulador Easycao</h2>
      <p>O Simulador Easycao e o unico simulador ICAO do mercado brasileiro. Desenvolvido com base no Doc 9835 da ICAO, ele reproduz fielmente as 4 partes da prova com feedback automatico por descritor.</p>

      <h3 id="como-funciona-app">Como funciona o app</h3>
      <ol>
        <li><strong>Escolha um cenario:</strong> Selecione entre Aviation Topics, Interacting, Unexpected Situations ou Picture Description</li>
        <li><strong>Grave sua resposta:</strong> Fale naturalmente como faria na prova real</li>
        <li><strong>Receba feedback:</strong> O app analisa sua resposta e fornece feedback por cada um dos 6 descritores</li>
        <li><strong>Acompanhe seu progresso:</strong> Veja sua evolucao ao longo do tempo em cada descritor</li>
      </ol>

      <h3 id="recursos">Recursos do simulador</h3>
      <ul>
        <li><strong>283 trilhoes+ de combinacoes:</strong> Cenarios nunca se repetem</li>
        <li><strong>Feedback por descritor:</strong> Saiba exatamente onde melhorar</li>
        <li><strong>Baseado no Doc 9835:</strong> Criterios identicos aos da prova real</li>
        <li><strong>iOS e Android:</strong> Disponivel para ambas as plataformas</li>
        <li><strong>Pratica diaria:</strong> Sessoes de 10-15 minutos por dia ja fazem diferenca</li>
      </ul>

      <AppBanner variant="section" />

      <h2 id="sem-app">Como praticar sem o app</h2>
      <p>Se voce ainda nao tem acesso ao simulador, existem alternativas gratuitas:</p>
      <ul>
        <li><strong><Link href="/lives">Lives da Easycao:</Link></strong> Simulados ao vivo com correcao do professor</li>
        <li><strong>Auto-gravacao:</strong> Grave-se respondendo perguntas sobre aviacao e analise depois</li>
        <li><strong>Pratica em dupla:</strong> Encontre um colega piloto para simular a prova</li>
        <li><strong>Videos no YouTube:</strong> Canal da Easycao com exemplos e correcoes</li>
      </ul>

      <h2 id="por-que-essenciais">Por que simulados sao essenciais</h2>
      <p>A prova ICAO e 100% oral e em tempo real. Nao ha como "estudar" para ela como para uma prova escrita. A unica forma eficaz de se preparar e praticando a producao oral em cenarios reais de aviacao.</p>
      <p>Estudos mostram que pilotos que fizeram pelo menos 10 simulados completos antes da prova tiveram taxa de aprovacao significativamente superior aos que estudaram apenas teoria.</p>
      <p>Saiba mais sobre <Link href="/como-se-preparar-para-a-prova-icao">como se preparar de forma completa</Link> para a prova ICAO.</p>
    </ContentPageLayout>
  );
}
