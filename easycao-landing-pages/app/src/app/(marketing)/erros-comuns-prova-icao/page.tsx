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
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "por-descritor", text: "Erros mais comuns por descritor", level: 2 },
  { id: "estrategia", text: "Erros de estrategia", level: 2 },
  { id: "dia-prova", text: "Erros no dia da prova", level: 2 },
  { id: "como-evitar", text: "Como o app ajuda a evitar esses erros", level: 2 },
];

const faqs = [
  { question: "Qual o erro mais grave na prova ICAO?", answer: "Decorar respostas. O examinador e treinado para detectar respostas memorizadas e penaliza nos descritores Interaction e Fluency." },
  { question: "Posso pedir para o examinador repetir?", answer: "Sim! Pedir para repetir demonstra boa Interaction e Comprehension management. E muito melhor do que responder algo errado por nao ter entendido." },
  { question: "Falar rapido ajuda na nota de Fluency?", answer: "Nao. Fluency nao e sobre velocidade — e sobre fluxo natural. Falar rapido demais pode prejudicar Pronunciation e Comprehension." },
  { question: "Silencio longo e muito penalizado?", answer: "Sim. Pausas longas (mais de 5-10 segundos) penalizam Fluency. Se precisar de tempo, use fillers como 'well', 'let me think about that'." },
  { question: "Usar vocabulario simples demais prejudica?", answer: "Para Level 4, vocabulario simples mas adequado e suficiente. Para Level 5+, o examinador espera vocabulario 'amplo e preciso'." },
];

export default function ErrosComunsPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="por-descritor">Erros mais comuns por descritor</h2>
      <p>Cada <Link href="/descritores-da-prova-icao">descritor</Link> tem armadilhas especificas. Veja os erros mais frequentes:</p>

      <h3>Pronunciation</h3>
      <ul>
        <li>Nao pronunciar consoantes finais (cleared → "clear", wind → "win")</li>
        <li>Confundir "th" com "f" ou "d" (three → "free", this → "dis")</li>
        <li>Entonacao muito plana, sem variacao</li>
      </ul>

      <h3>Structure</h3>
      <ul>
        <li>Usar apenas frases curtas e simples (limita o score)</li>
        <li>Misturar tempos verbais sem necessidade</li>
        <li>Falta de conectores (so, because, however, although)</li>
      </ul>

      <h3>Vocabulary</h3>
      <ul>
        <li>Usar termos genericos quando ha um termo tecnico especifico</li>
        <li>Repetir as mesmas palavras sem variar</li>
        <li>Nao conhecer vocabulario de emergencias e weather</li>
      </ul>

      <h3>Fluency</h3>
      <ul>
        <li>Pausas longas sem usar fillers (silencio total)</li>
        <li>Traduzir mentalmente do portugues antes de falar</li>
        <li>Comecar frases e nao terminar</li>
      </ul>

      <h3>Comprehension</h3>
      <ul>
        <li>Responder algo diferente do que foi perguntado</li>
        <li>Nao pedir para repetir quando nao entendeu</li>
        <li>Fingir que entendeu para nao "parecer fraco"</li>
      </ul>

      <h3>Interaction</h3>
      <ul>
        <li>Dar respostas muito curtas (sim/nao) sem desenvolver</li>
        <li>Nao pedir clarificacao quando necessario</li>
        <li>Nao saber gerenciar turn-taking (interrumpir ou esperar demais)</li>
      </ul>

      <h2 id="estrategia">Erros de estrategia</h2>
      <ul>
        <li><strong>Decorar respostas:</strong> O erro #1. O examinador percebe e penaliza</li>
        <li><strong>Estudar so gramatica:</strong> A prova nao testa gramatica isolada</li>
        <li><strong>Nao praticar fala:</strong> A prova e 100% oral — sem pratica oral, nao tem como passar</li>
        <li><strong>Focar em um descritor so:</strong> Sua nota final e o menor. Preparacao equilibrada e essencial</li>
      </ul>

      <h2 id="dia-prova">Erros no dia da prova</h2>
      <ul>
        <li><strong>Nervosismo excessivo:</strong> Afeta Fluency e Interaction. Pratica com simulados reduz ansiedade</li>
        <li><strong>Nao pedir repeticao:</strong> Pedir para repetir NAO e fraqueza — e boa pratica de Interaction</li>
        <li><strong>Respostas muito curtas:</strong> O examinador precisa de material para avaliar. Desenvolva suas ideias</li>
        <li><strong>Chegar atrasado ou estressado:</strong> Afeta todo o desempenho</li>
      </ul>

      <h2 id="como-evitar">Como o app ajuda a evitar esses erros</h2>
      <p>O simulador Easycao mostra exatamente quais <Link href="/descritores-da-prova-icao">descritores</Link> voce precisa melhorar, permitindo pratica direcionada e eficiente.</p>

      <AppBanner variant="inline" />

      <p>Alem do app, as <Link href="/lives">lives gratuitas</Link> com o professor Diogo permitem pratica ao vivo com correcao imediata por descritor. Saiba mais sobre <Link href="/como-se-preparar-para-a-prova-icao">como se preparar corretamente</Link>.</p>
    </ContentPageLayout>
  );
}
