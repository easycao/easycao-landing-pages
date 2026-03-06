import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";
import AppBanner from "../../../components/AppBanner";

const PAGE_SLUG = "como-se-preparar-para-a-prova-icao";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: {
    title: page.title,
    description: page.description,
    url: `${SITE_URL}/${PAGE_SLUG}`,
    siteName: "Easycao",
    type: "article",
    locale: "pt_BR",
  },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "erros-comuns", text: "Os 3 erros mais comuns na preparação", level: 2 },
  { id: "o-que-estudar", text: "O que estudar para a prova ICAO", level: 2 },
  { id: "quanto-tempo", text: "Quanto tempo leva para se preparar", level: 2 },
  { id: "metodo-recomendado", text: "Método de estudo recomendado", level: 2 },
  { id: "recursos-gratuitos", text: "Recursos gratuitos para começar", level: 2 },
  { id: "quando-pronto", text: "Quando você está pronto para a prova", level: 2 },
];

const faqs = [
  {
    question: "Quanto tempo preciso para me preparar para a prova ICAO?",
    answer:
      "Depende do seu nível atual de inglês. Pilotos com nível intermediário costumam precisar de 2 a 4 meses de preparação focada. Já pilotos com nível básico podem precisar de 4 a 6 meses. O importante é ter uma rotina de prática oral consistente.",
  },
  {
    question: "Consigo me preparar sozinho ou preciso de um curso?",
    answer:
      "É possível se preparar sozinho se você já tem um bom nível de inglês, mas a maioria dos pilotos se beneficia de orientação especializada. A prova ICAO avalia habilidades específicas (como interaction e comprehension em contextos de aviação) que são difíceis de praticar sem um interlocutor qualificado.",
  },
  {
    question: "Quais recursos gratuitos posso usar?",
    answer:
      "As lives gratuitas da Easycao (terça e quinta) são o melhor recurso gratuito disponível. Além disso, você pode ouvir comunicações ATC reais no LiveATC, assistir vídeos no canal da Easycao no YouTube e estudar o Doc 9835 da ICAO.",
  },
  {
    question: "Quando devo agendar minha prova?",
    answer:
      "Agende quando conseguir manter uma conversa de 5 minutos sobre temas de aviação em inglês sem pausas longas e sem precisar traduzir mentalmente do português. Use o checklist de auto-avaliação nesta página para verificar.",
  },
  {
    question: "Preciso de Level 4 mínimo para quais licenças?",
    answer:
      "Level 4 é obrigatório para pilotos que realizam operações internacionais (CPL e ATPL com habilitação para voos internacionais). Para voos exclusivamente domésticos, a proficiência em inglês não é exigida, mas é altamente recomendada para progressão de carreira.",
  },
];

export default function ComoSePreparar() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="erros-comuns">Os 3 erros mais comuns na preparação</h2>
      <p>
        Muitos pilotos cometem os mesmos erros ao se preparar para a prova ICAO.
        Conhecer esses erros é o primeiro passo para evitá-los:
      </p>

      <CalloutBox variant="warning" title="Decorar respostas é o erro #1 dos pilotos">
        O examinador é treinado para detectar respostas memorizadas. Quando
        percebe que você está recitando algo decorado, o score cai em Interaction
        e Fluency. A prova avalia comunicação real, não memorização.
      </CalloutBox>

      <h3>1. Decorar respostas prontas</h3>
      <p>
        Este é de longe o erro mais grave. Muitos pilotos memorizam respostas
        para perguntas comuns, mas o examinador muda a abordagem e faz
        perguntas inesperadas justamente para verificar se a comunicação é
        genuína. Quando detecta respostas decoradas, os scores de Interaction
        e Fluency são penalizados.
      </p>

      <h3>2. Estudar inglês geral em vez de inglês de aviação</h3>
      <p>
        A prova ICAO não é um TOEFL ou IELTS. Ela avalia sua capacidade de
        comunicação em contextos específicos de aviação — emergências, weather
        briefings, coordenação com ATC, descrição de procedimentos. Estudar
        gramática geral não vai prepará-lo para esses cenários.
      </p>

      <h3>3. Não praticar fala</h3>
      <p>
        A prova é 100% oral. Não há parte escrita, listening separado ou
        multiple choice. Se você só lê e ouve inglês mas nunca pratica falar,
        vai ter dificuldade na hora da prova. A prática oral regular é
        insubstituível.
      </p>

      <h2 id="o-que-estudar">O que estudar para a prova ICAO</h2>
      <p>
        Sua preparação deve focar nos{" "}
        <Link href="/descritores-da-prova-icao">6 descritores da ICAO</Link>:
        Pronunciation, Structure, Vocabulary, Fluency, Comprehension e
        Interaction. Cada descritor exige uma abordagem diferente.
      </p>
      <p>
        Além dos descritores, você deve conhecer as{" "}
        <Link href="/como-funciona-a-prova-icao">4 partes da prova</Link> e
        praticar cenários específicos de cada parte: tópicos de aviação,
        interação como piloto, situações inesperadas e descrição de imagens.
      </p>
      <p>
        Entender os{" "}
        <Link href="/niveis-icao">níveis ICAO de 1 a 6</Link> e as
        palavras-chave que diferenciam cada nível também ajuda a direcionar
        sua preparação para o resultado desejado.
      </p>

      <h2 id="quanto-tempo">Quanto tempo leva para se preparar</h2>
      <p>
        O tempo de preparação varia conforme seu nível atual de inglês:
      </p>
      <ul>
        <li>
          <strong>Inglês básico (A1-A2):</strong> 4 a 6 meses de preparação
          intensiva, com aulas regulares e prática diária
        </li>
        <li>
          <strong>Inglês intermediário (B1):</strong> 2 a 4 meses focando em
          vocabulário aeronáutico e prática oral
        </li>
        <li>
          <strong>Inglês avançado (B2+):</strong> 1 a 2 meses para adaptar
          seu inglês ao formato específico da prova
        </li>
      </ul>
      <p>
        Independente do seu nível, a prática oral e vocabulário de aviação são
        os pilares da preparação. Não adianta ter inglês fluente se você não
        conhece os termos técnicos usados em radiotelefonia e briefings.
      </p>

      <h2 id="metodo-recomendado">Método de estudo recomendado</h2>
      <p>
        O método mais eficiente combina três pilares: estudo dos descritores,
        prática oral regular com simulados e exposição a inglês aeronáutico
        real. Essa abordagem é exatamente o que o método Easycao oferece.
      </p>
      <p>
        Com o método criado pelo professor Diogo Verzola — o único examinador
        ICAO credenciado que ensina no Brasil — você pratica com cenários
        reais da prova, recebe correção por descritor e acompanha sua evolução
        de forma objetiva.
      </p>

      <AppBanner variant="inline" />

      <h2 id="recursos-gratuitos">Recursos gratuitos para começar</h2>
      <p>
        Se você está começando sua preparação, esses recursos gratuitos são
        um ótimo ponto de partida:
      </p>
      <ul>
        <li>
          <strong>
            <Link href="/lives">Lives gratuitas da Easycao</Link>:
          </strong>{" "}
          Simulados ao vivo toda semana com correção por descritor pelo
          professor Diogo
        </li>
        <li>
          <strong>Canal da Easycao no YouTube:</strong> Aulas sobre cada
          descritor, dicas de preparação e análises de provas
        </li>
        <li>
          <strong>LiveATC:</strong> Ouça comunicações ATC reais para treinar
          comprehension com sotaques variados
        </li>
        <li>
          <strong>
            <a
              href="https://www.gov.br/anac/pt-br/assuntos/regulados/profissionais-da-aviacao-civil/proficiencia-linguistica"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portal da ANAC
            </a>
            :
          </strong>{" "}
          Informações oficiais sobre o SDEA e centros credenciados
        </li>
      </ul>

      <h2 id="quando-pronto">Quando você está pronto para a prova</h2>
      <p>
        Use este checklist de auto-avaliação. Se você consegue marcar todos os
        itens, provavelmente está pronto para agendar sua prova:
      </p>
      <ul>
        <li>
          Consigo falar sobre temas de aviação por 2+ minutos sem pausas longas
        </li>
        <li>
          Entendo ATC communications reais sem precisar repetir
        </li>
        <li>
          Consigo descrever uma imagem de aviação em inglês por 1+ minuto
        </li>
        <li>
          Sei pedir clarificação e reformular frases quando não entendo algo
        </li>
        <li>
          Domino vocabulário de weather, emergencies e aircraft systems
        </li>
        <li>
          Já fiz pelo menos 3 simulados completos com feedback
        </li>
      </ul>
      <p>
        Se ainda não se sente pronto, não agende — reprovar tem consequências.
        Há uma{" "}
        <Link href="/como-funciona-a-prova-icao">espera de 60 dias</Link> para
        refazer a prova, e o{" "}
        <Link href="/quanto-custa-a-prova-icao">custo de uma nova taxa</Link>{" "}
        pode ser significativo.
      </p>
    </ContentPageLayout>
  );
}
