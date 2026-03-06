import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import AppBanner from "../../../components/AppBanner";

const PAGE_SLUG = "erros-comuns-prova-icao";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "por-descritor", text: "Erros mais comuns por descritor", level: 2 },
  { id: "estrategia", text: "Erros de estratégia", level: 2 },
  { id: "dia-prova", text: "Erros no dia da prova", level: 2 },
  { id: "como-evitar", text: "Como o app ajuda a evitar esses erros", level: 2 },
];

const faqs = [
  { question: "Qual o erro mais grave na prova ICAO?", answer: "Decorar respostas. O examinador é treinado para detectar respostas memorizadas e penaliza nos descritores Interaction e Fluency." },
  { question: "Posso pedir para o examinador repetir?", answer: "Sim! Pedir para repetir demonstra boa Interaction e Comprehension management. É muito melhor do que responder algo errado por não ter entendido." },
  { question: "Falar rápido ajuda na nota de Fluency?", answer: "Não. Fluency não é sobre velocidade — é sobre fluxo natural. Falar rápido demais pode prejudicar Pronunciation e Comprehension." },
  { question: "Silêncio longo é muito penalizado?", answer: "Sim. Pausas longas (mais de 5-10 segundos) penalizam Fluency. Se precisar de tempo, use fillers como 'well', 'let me think about that'." },
  { question: "Usar vocabulário simples demais prejudica?", answer: "Para Level 4, vocabulário simples mas adequado é suficiente. Para Level 5+, o examinador espera vocabulário 'amplo e preciso'." },
];

export default function ErrosComunsPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="por-descritor">Erros mais comuns por descritor</h2>
      <p>Cada <Link href="/descritores-da-prova-icao">descritor</Link> tem armadilhas específicas. Veja os erros mais frequentes:</p>

      <h3>Pronunciation</h3>
      <ul>
        <li>Não pronunciar consoantes finais (cleared → "clear", wind → "win")</li>
        <li>Confundir "th" com "f" ou "d" (three → "free", this → "dis")</li>
        <li>Entonação muito plana, sem variação</li>
      </ul>

      <h3>Structure</h3>
      <ul>
        <li>Usar apenas frases curtas e simples (limita o score)</li>
        <li>Misturar tempos verbais sem necessidade</li>
        <li>Falta de conectores (so, because, however, although)</li>
      </ul>

      <h3>Vocabulary</h3>
      <ul>
        <li>Usar termos genéricos quando há um termo técnico específico</li>
        <li>Repetir as mesmas palavras sem variar</li>
        <li>Não conhecer vocabulário de emergências e weather</li>
      </ul>

      <h3>Fluency</h3>
      <ul>
        <li>Pausas longas sem usar fillers (silêncio total)</li>
        <li>Traduzir mentalmente do português antes de falar</li>
        <li>Começar frases e não terminar</li>
      </ul>

      <h3>Comprehension</h3>
      <ul>
        <li>Responder algo diferente do que foi perguntado</li>
        <li>Não pedir para repetir quando não entendeu</li>
        <li>Fingir que entendeu para não "parecer fraco"</li>
      </ul>

      <h3>Interaction</h3>
      <ul>
        <li>Dar respostas muito curtas (sim/não) sem desenvolver</li>
        <li>Não pedir clarificação quando necessário</li>
        <li>Não saber gerenciar turn-taking (interromper ou esperar demais)</li>
      </ul>

      <h2 id="estrategia">Erros de estratégia</h2>
      <ul>
        <li><strong>Decorar respostas:</strong> O erro #1. O examinador percebe e penaliza</li>
        <li><strong>Estudar só gramática:</strong> A prova não testa gramática isolada</li>
        <li><strong>Não praticar fala:</strong> A prova é 100% oral — sem prática oral, não tem como passar</li>
        <li><strong>Focar em um descritor só:</strong> Sua nota final é o menor. Preparação equilibrada é essencial</li>
      </ul>

      <h2 id="dia-prova">Erros no dia da prova</h2>
      <ul>
        <li><strong>Nervosismo excessivo:</strong> Afeta Fluency e Interaction. Prática com simulados reduz ansiedade</li>
        <li><strong>Não pedir repetição:</strong> Pedir para repetir NÃO é fraqueza — é boa prática de Interaction</li>
        <li><strong>Respostas muito curtas:</strong> O examinador precisa de material para avaliar. Desenvolva suas ideias</li>
        <li><strong>Chegar atrasado ou estressado:</strong> Afeta todo o desempenho</li>
      </ul>

      <h2 id="como-evitar">Como o app ajuda a evitar esses erros</h2>
      <p>O simulador Easycao mostra exatamente quais <Link href="/descritores-da-prova-icao">descritores</Link> você precisa melhorar, permitindo prática direcionada e eficiente.</p>

      <AppBanner variant="inline" />

      <p>Além do app, as <Link href="/lives">lives gratuitas</Link> com o professor Diogo permitem prática ao vivo com correção imediata por descritor. Saiba mais sobre <Link href="/como-se-preparar-para-a-prova-icao">como se preparar corretamente</Link>.</p>
    </ContentPageLayout>
  );
}
