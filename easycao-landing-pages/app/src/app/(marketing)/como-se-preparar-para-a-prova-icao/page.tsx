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
    title: page.seoTitle,
    description: page.description,
    url: `${SITE_URL}/${PAGE_SLUG}`,
    siteName: "Easycao",
    type: "article",
    locale: "pt_BR",
  },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "erros-comuns", text: "Os 3 erros mais comuns na preparacao", level: 2 },
  { id: "o-que-estudar", text: "O que estudar para a prova ICAO", level: 2 },
  { id: "quanto-tempo", text: "Quanto tempo leva para se preparar", level: 2 },
  { id: "metodo-recomendado", text: "Metodo de estudo recomendado", level: 2 },
  { id: "recursos-gratuitos", text: "Recursos gratuitos para comecar", level: 2 },
  { id: "quando-pronto", text: "Quando voce esta pronto para a prova", level: 2 },
];

const faqs = [
  {
    question: "Quanto tempo preciso para me preparar para a prova ICAO?",
    answer:
      "Depende do seu nivel atual de ingles. Pilotos com nivel intermediario costumam precisar de 2 a 4 meses de preparacao focada. Ja pilotos com nivel basico podem precisar de 4 a 6 meses. O importante e ter uma rotina de pratica oral consistente.",
  },
  {
    question: "Consigo me preparar sozinho ou preciso de um curso?",
    answer:
      "E possivel se preparar sozinho se voce ja tem um bom nivel de ingles, mas a maioria dos pilotos se beneficia de orientacao especializada. A prova ICAO avalia habilidades especificas (como interaction e comprehension em contextos de aviacao) que sao dificeis de praticar sem um interlocutor qualificado.",
  },
  {
    question: "Quais recursos gratuitos posso usar?",
    answer:
      "As lives gratuitas da Easycao (terca e quinta) sao o melhor recurso gratuito disponivel. Alem disso, voce pode ouvir comunicacoes ATC reais no LiveATC, assistir videos no canal da Easycao no YouTube e estudar o Doc 9835 da ICAO.",
  },
  {
    question: "Quando devo agendar minha prova?",
    answer:
      "Agende quando conseguir manter uma conversa de 5 minutos sobre temas de aviacao em ingles sem pausas longas e sem precisar traduzir mentalmente do portugues. Use o checklist de auto-avaliacao nesta pagina para verificar.",
  },
  {
    question: "Preciso de Level 4 minimo para quais licencas?",
    answer:
      "Level 4 e obrigatorio para pilotos que realizam operacoes internacionais (CPL e ATPL com habilitacao para voos internacionais). Para voos exclusivamente domesticos, a proficiencia em ingles nao e exigida, mas e altamente recomendada para progressao de carreira.",
  },
];

export default function ComoSePreparar() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="erros-comuns">Os 3 erros mais comuns na preparacao</h2>
      <p>
        Muitos pilotos cometem os mesmos erros ao se preparar para a prova ICAO.
        Conhecer esses erros e o primeiro passo para evita-los:
      </p>

      <CalloutBox variant="warning" title="Decorar respostas e o erro #1 dos pilotos">
        O examinador e treinado para detectar respostas memorizadas. Quando
        percebe que voce esta recitando algo decorado, o score cai em Interaction
        e Fluency. A prova avalia comunicacao real, nao memorizacao.
      </CalloutBox>

      <h3>1. Decorar respostas prontas</h3>
      <p>
        Este e de longe o erro mais grave. Muitos pilotos memorizam respostas
        para perguntas comuns, mas o examinador muda a abordagem e faz
        perguntas inesperadas justamente para verificar se a comunicacao e
        genuina. Quando detecta respostas decoradas, os scores de Interaction
        e Fluency sao penalizados.
      </p>

      <h3>2. Estudar ingles geral em vez de ingles de aviacao</h3>
      <p>
        A prova ICAO nao e um TOEFL ou IELTS. Ela avalia sua capacidade de
        comunicacao em contextos especificos de aviacao — emergencias, weather
        briefings, coordenacao com ATC, descricao de procedimentos. Estudar
        gramatica geral nao vai prepara-lo para esses cenarios.
      </p>

      <h3>3. Nao praticar fala</h3>
      <p>
        A prova e 100% oral. Nao ha parte escrita, listening separado ou
        multiple choice. Se voce so le e ouve ingles mas nunca pratica falar,
        vai ter dificuldade na hora da prova. A pratica oral regular e
        insubstituivel.
      </p>

      <h2 id="o-que-estudar">O que estudar para a prova ICAO</h2>
      <p>
        Sua preparacao deve focar nos{" "}
        <Link href="/descritores-da-prova-icao">6 descritores da ICAO</Link>:
        Pronunciation, Structure, Vocabulary, Fluency, Comprehension e
        Interaction. Cada descritor exige uma abordagem diferente.
      </p>
      <p>
        Alem dos descritores, voce deve conhecer as{" "}
        <Link href="/como-funciona-a-prova-icao">4 partes da prova</Link> e
        praticar cenarios especificos de cada parte: topicos de aviacao,
        interacao como piloto, situacoes inesperadas e descricao de imagens.
      </p>
      <p>
        Entender os{" "}
        <Link href="/niveis-icao">niveis ICAO de 1 a 6</Link> e as
        palavras-chave que diferenciam cada nivel tambem ajuda a direcionar
        sua preparacao para o resultado desejado.
      </p>

      <h2 id="quanto-tempo">Quanto tempo leva para se preparar</h2>
      <p>
        O tempo de preparacao varia conforme seu nivel atual de ingles:
      </p>
      <ul>
        <li>
          <strong>Ingles basico (A1-A2):</strong> 4 a 6 meses de preparacao
          intensiva, com aulas regulares e pratica diaria
        </li>
        <li>
          <strong>Ingles intermediario (B1):</strong> 2 a 4 meses focando em
          vocabulario aeronautico e pratica oral
        </li>
        <li>
          <strong>Ingles avancado (B2+):</strong> 1 a 2 meses para adaptar
          seu ingles ao formato especifico da prova
        </li>
      </ul>
      <p>
        Independente do seu nivel, a pratica oral e vocabulario de aviacao sao
        os pilares da preparacao. Nao adianta ter ingles fluente se voce nao
        conhece os termos tecnicos usados em radiotelefonia e briefings.
      </p>

      <h2 id="metodo-recomendado">Metodo de estudo recomendado</h2>
      <p>
        O metodo mais eficiente combina tres pilares: estudo dos descritores,
        pratica oral regular com simulados e exposicao a ingles aeronautico
        real. Essa abordagem e exatamente o que o metodo Easycao oferece.
      </p>
      <p>
        Com o metodo criado pelo professor Diogo Verzola — o unico examinador
        ICAO credenciado que ensina no Brasil — voce pratica com cenarios
        reais da prova, recebe correcao por descritor e acompanha sua evolucao
        de forma objetiva.
      </p>

      <AppBanner variant="inline" />

      <h2 id="recursos-gratuitos">Recursos gratuitos para comecar</h2>
      <p>
        Se voce esta comecando sua preparacao, esses recursos gratuitos sao
        um otimo ponto de partida:
      </p>
      <ul>
        <li>
          <strong>
            <Link href="/lives">Lives gratuitas da Easycao</Link>:
          </strong>{" "}
          Simulados ao vivo toda semana com correcao por descritor pelo
          professor Diogo
        </li>
        <li>
          <strong>Canal da Easycao no YouTube:</strong> Aulas sobre cada
          descritor, dicas de preparacao e analises de provas
        </li>
        <li>
          <strong>LiveATC:</strong> Ouza comunicacoes ATC reais para treinar
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
          Informacoes oficiais sobre o SDEA e centros credenciados
        </li>
      </ul>

      <h2 id="quando-pronto">Quando voce esta pronto para a prova</h2>
      <p>
        Use este checklist de auto-avaliacao. Se voce consegue marcar todos os
        itens, provavelmente esta pronto para agendar sua prova:
      </p>
      <ul>
        <li>
          Consigo falar sobre temas de aviacao por 2+ minutos sem pausas longas
        </li>
        <li>
          Entendo ATC communications reais sem precisar repetir
        </li>
        <li>
          Consigo descrever uma imagem de aviacao em ingles por 1+ minuto
        </li>
        <li>
          Sei pedir clarificacao e reformular frases quando nao entendo algo
        </li>
        <li>
          Domino vocabulario de weather, emergencies e aircraft systems
        </li>
        <li>
          Ja fiz pelo menos 3 simulados completos com feedback
        </li>
      </ul>
      <p>
        Se ainda nao se sente pronto, nao agende — reprovar tem consequencias.
        Ha uma{" "}
        <Link href="/como-funciona-a-prova-icao">espera de 60 dias</Link> para
        refazer a prova, e o{" "}
        <Link href="/quanto-custa-a-prova-icao">custo de uma nova taxa</Link>{" "}
        pode ser significativo.
      </p>
    </ContentPageLayout>
  );
}
