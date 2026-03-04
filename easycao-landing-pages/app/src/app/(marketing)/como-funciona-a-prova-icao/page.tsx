import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";
import AppBanner from "../../../components/AppBanner";

const PAGE_SLUG = "como-funciona-a-prova-icao";
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
  { id: "4-partes", text: "As 4 partes da prova ICAO", level: 2 },
  { id: "parte-1", text: "Parte 1 — Aviation Topics", level: 3 },
  { id: "parte-2", text: "Parte 2 — Interacting as a Pilot", level: 3 },
  { id: "parte-3", text: "Parte 3 — Unexpected Situations", level: 3 },
  { id: "parte-4", text: "Parte 4 — Picture Description", level: 3 },
  { id: "avaliacao", text: "Como você é avaliado", level: 2 },
  { id: "duracao", text: "Quanto tempo dura a prova", level: 2 },
  { id: "nota", text: "Como funciona a nota", level: 2 },
  { id: "nao-online", text: "A prova ICAO NÃO é online", level: 2 },
  { id: "reprovacao", text: "O que acontece se você reprovar", level: 2 },
];

const faqs = [
  {
    question: "A prova ICAO pode ser feita online?",
    answer:
      "Não. A prova ICAO (SDEA) é obrigatoriamente presencial, realizada em centros credenciados pela ANAC com examinadores certificados. Não existe versão online ou remota da avaliação.",
  },
  {
    question: "Posso reagendar minha prova ICAO?",
    answer:
      "Sim, mas as políticas de reagendamento variam por centro credenciado. A maioria permite reagendamento com antecedência de 48 a 72 horas sem custo adicional. Cancelamentos de última hora podem gerar taxas.",
  },
  {
    question: "O que acontece se eu reprovar na prova ICAO?",
    answer:
      "Se você obtiver Level 3 ou inferior, deve aguardar 60 dias antes de refazer a prova. Este período é obrigatório e determinado pela ANAC. Use esse tempo para se preparar melhor, focando nos descritores onde teve menor pontuação.",
  },
  {
    question: "Preciso fazer a prova ICAO para voos domésticos?",
    answer:
      "Não. A proficiência em inglês é obrigatória apenas para operações internacionais. Pilotos que voam exclusivamente no espaço aéreo brasileiro não são obrigados a ter a certificação ICAO, mas ela é altamente recomendada para progressão de carreira.",
  },
  {
    question: "Quanto tempo leva para sair o resultado?",
    answer:
      "O resultado geralmente é informado ao candidato imediatamente após a prova pelo examinador. O registro oficial no sistema da ANAC pode levar de 5 a 15 dias úteis, dependendo do centro credenciado.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="4-partes">As 4 partes da prova ICAO</h2>
      <p>
        A prova de proficiência linguística da ICAO, conhecida no Brasil como
        SDEA (Santos Dumont English Assessment), é dividida em 4 partes. Cada
        parte avalia diferentes aspectos da sua comunicação em inglês no
        contexto aeronáutico. A prova inteira dura aproximadamente 50 minutos.
      </p>

      <CalloutBox variant="info" title="Duração total">
        A prova ICAO dura aproximadamente 50 minutos e é dividida em 4 partes.
        Todo o exame é oral — não há parte escrita ou de múltipla escolha.
      </CalloutBox>

      <h3 id="parte-1">Parte 1 — Aviation Topics (~5 minutos)</h3>
      <p>
        Nesta parte, o examinador inicia uma conversa sobre temas relacionados
        à aviação. Você pode ser perguntado sobre sua experiência como piloto,
        rotinas de voo, formação aeronáutica ou temas como segurança de voo
        e tecnologia.
      </p>
      <p>
        O objetivo é "quebrar o gelo" e avaliar sua capacidade de conversar
        naturalmente sobre temas profissionais. Dica: não dê respostas curtas
        demais. Desenvolva suas ideias em 3-4 frases.
      </p>

      <h3 id="parte-2">Parte 2 — Interacting as a Pilot (~15 minutos)</h3>
      <p>
        A parte mais longa. Você recebe 5 cenários de voo onde precisa
        interagir com ATC ou outros pilotos. Os cenários incluem situações
        como: solicitar autorizações, reportar posição, pedir informações
        meteorológicas e coordenar com torre de controle.
      </p>
      <p>
        Aqui o examinador avalia fortemente os descritores de Interaction
        e Comprehension. Você precisa demonstrar que consegue manter um
        diálogo profissional, pedir clarificações quando necessário e
        reformular informações.
      </p>

      <h3 id="parte-3">Parte 3 — Unexpected Situations (~15 minutos)</h3>
      <p>
        Você recebe 3 cenários de emergência ou situações imprevistas:
        falha de motor, despressurização, passenger medical emergency,
        bird strike, weather diversions, entre outros.
      </p>
      <p>
        O examinador quer ver como você comunica problemas, toma decisões
        e coordena ações sob pressão. Vocabulário técnico de emergências
        é essencial aqui. Pratique cenários como: "Mayday, Mayday...",
        "Request immediate landing due to...", "Declaring emergency because...".
      </p>

      <h3 id="parte-4">Parte 4 — Picture Description (~10 minutos)</h3>
      <p>
        Você recebe imagens relacionadas à aviação (acidentes, cenários de
        aeroporto, cockpits, weather phenomena) e deve descrevê-las em
        inglês. Após a descrição, o examinador faz perguntas sobre a imagem
        e pede sua opinião sobre as causas ou consequências do que você vê.
      </p>
      <p>
        Esta parte avalia especialmente Vocabulary e Structure. Dica:
        organize sua descrição (foreground → background → details → opinion)
        e use vocabulário descritivo rico. Veja{" "}
        <Link href="/dicas-prova-icao-descricao-imagens">
          dicas específicas para descrição de imagens
        </Link>.
      </p>

      <AppBanner variant="inline" />

      <h2 id="avaliacao">Como você é avaliado</h2>
      <p>
        Ao longo das 4 partes, o examinador avalia seus{" "}
        <Link href="/descritores-da-prova-icao">6 descritores</Link> de forma
        independente: Pronunciation, Structure, Vocabulary, Fluency,
        Comprehension e Interaction. Cada descritor recebe uma nota de 1 a 6.
      </p>
      <p>
        Os examinadores são treinados e credenciados pela ANAC seguindo
        padrões da ICAO. Eles avaliam de forma objetiva usando critérios
        específicos definidos no Doc 9835.
      </p>

      <h2 id="duracao">Quanto tempo dura a prova</h2>
      <p>
        A prova completa dura aproximadamente 50 minutos:
      </p>
      <ul>
        <li>Parte 1 (Aviation Topics): ~5 minutos</li>
        <li>Parte 2 (Interacting): ~15 minutos</li>
        <li>Parte 3 (Unexpected Situations): ~15 minutos</li>
        <li>Parte 4 (Picture Description): ~10 minutos</li>
        <li>Tempo adicional para instruções e transições: ~5 minutos</li>
      </ul>

      <h2 id="nota">Como funciona a nota</h2>
      <p>
        Sua nota final é o menor valor entre os 6 descritores. Se você tirar
        5 em todos menos Interaction (onde tirou 4), seu resultado será
        Level 4. Veja a{" "}
        <Link href="/descritores-da-prova-icao">tabela de descritores</Link>{" "}
        para entender melhor. Para entender o que cada nível significa, veja{" "}
        <Link href="/niveis-icao">níveis ICAO de 1 a 6</Link>.
      </p>

      <h2 id="nao-online">A prova ICAO NÃO é online</h2>

      <CalloutBox variant="warning" title="A prova ICAO é presencial">
        A prova NÃO é online — é obrigatoriamente presencial com examinadores
        credenciados pela ANAC. Não existe versão remota ou digital da
        avaliação. Desconfie de qualquer oferta de prova online.
      </CalloutBox>

      <p>
        A prova deve ser realizada em um dos{" "}
        <Link href="/onde-fazer-a-prova-icao">
          centros credenciados pela ANAC
        </Link>{" "}
        espalhados pelo Brasil. O candidato vai pessoalmente ao centro e
        a avaliação é conduzida face-a-face com o examinador.
      </p>

      <h2 id="reprovacao">O que acontece se você reprovar</h2>
      <p>
        Se sua nota final for Level 3 ou inferior, você é considerado
        reprovado. Nesse caso:
      </p>
      <ul>
        <li>
          <strong>Espera obrigatória de 60 dias:</strong> Você não pode
          refazer a prova antes desse prazo (regra da ANAC)
        </li>
        <li>
          <strong>Nova taxa:</strong> Precisa pagar novamente a taxa do
          centro credenciado (consulte{" "}
          <Link href="/quanto-custa-a-prova-icao">custos da prova</Link>)
        </li>
        <li>
          <strong>Preparação direcionada:</strong> Use os 60 dias para focar
          nos descritores que tiveram menor nota
        </li>
      </ul>
      <p>
        Saiba mais sobre como{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">
          se preparar de forma eficiente
        </Link>{" "}
        para evitar reprovação.
      </p>
    </ContentPageLayout>
  );
}
