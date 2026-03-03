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
  { id: "avaliacao", text: "Como voce e avaliado", level: 2 },
  { id: "duracao", text: "Quanto tempo dura a prova", level: 2 },
  { id: "nota", text: "Como funciona a nota", level: 2 },
  { id: "nao-online", text: "A prova ICAO NAO e online", level: 2 },
  { id: "reprovacao", text: "O que acontece se voce reprovar", level: 2 },
];

const faqs = [
  {
    question: "A prova ICAO pode ser feita online?",
    answer:
      "Nao. A prova ICAO (SDEA) e obrigatoriamente presencial, realizada em centros credenciados pela ANAC com examinadores certificados. Nao existe versao online ou remota da avaliacao.",
  },
  {
    question: "Posso reagendar minha prova ICAO?",
    answer:
      "Sim, mas as politicas de reagendamento variam por centro credenciado. A maioria permite reagendamento com antecedencia de 48 a 72 horas sem custo adicional. Cancelamentos de ultima hora podem gerar taxas.",
  },
  {
    question: "O que acontece se eu reprovar na prova ICAO?",
    answer:
      "Se voce obtiver Level 3 ou inferior, deve aguardar 60 dias antes de refazer a prova. Este periodo e obrigatorio e determinado pela ANAC. Use esse tempo para se preparar melhor, focando nos descritores onde teve menor pontuacao.",
  },
  {
    question: "Preciso fazer a prova ICAO para voos domesticos?",
    answer:
      "Nao. A proficiencia em ingles e obrigatoria apenas para operacoes internacionais. Pilotos que voam exclusivamente no espaco aereo brasileiro nao sao obrigados a ter a certificacao ICAO, mas ela e altamente recomendada para progressao de carreira.",
  },
  {
    question: "Quanto tempo leva para sair o resultado?",
    answer:
      "O resultado geralmente e informado ao candidato imediatamente apos a prova pelo examinador. O registro oficial no sistema da ANAC pode levar de 5 a 15 dias uteis, dependendo do centro credenciado.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="4-partes">As 4 partes da prova ICAO</h2>
      <p>
        A prova de proficiencia linguistica da ICAO, conhecida no Brasil como
        SDEA (Santos Dumont English Assessment), e dividida em 4 partes. Cada
        parte avalia diferentes aspectos da sua comunicacao em ingles no
        contexto aeronautico. A prova inteira dura aproximadamente 50 minutos.
      </p>

      <CalloutBox variant="info" title="Duracao total">
        A prova ICAO dura aproximadamente 50 minutos e e dividida em 4 partes.
        Todo o exame e oral — nao ha parte escrita ou de multipla escolha.
      </CalloutBox>

      <h3 id="parte-1">Parte 1 — Aviation Topics (~5 minutos)</h3>
      <p>
        Nesta parte, o examinador inicia uma conversa sobre temas relacionados
        a aviacao. Voce pode ser perguntado sobre sua experiencia como piloto,
        rotinas de voo, formacao aeronautica ou temas como seguranca de voo
        e tecnologia.
      </p>
      <p>
        O objetivo e "quebrar o gelo" e avaliar sua capacidade de conversar
        naturalmente sobre temas profissionais. Dica: nao de respostas curtas
        demais. Desenvolva suas ideias em 3-4 frases.
      </p>

      <h3 id="parte-2">Parte 2 — Interacting as a Pilot (~15 minutos)</h3>
      <p>
        A parte mais longa. Voce recebe 5 cenarios de voo onde precisa
        interagir com ATC ou outros pilotos. Os cenarios incluem situacoes
        como: solicitar autorizacoes, reportar posicao, pedir informacoes
        meteorologicas e coordenar com torre de controle.
      </p>
      <p>
        Aqui o examinador avalia fortemente os descritores de Interaction
        e Comprehension. Voce precisa demonstrar que consegue manter um
        dialogo profissional, pedir clarificacoes quando necessario e
        reformular informacoes.
      </p>

      <h3 id="parte-3">Parte 3 — Unexpected Situations (~15 minutos)</h3>
      <p>
        Voce recebe 3 cenarios de emergencia ou situacoes imprevistas:
        falha de motor, despressurizacao, passenger medical emergency,
        bird strike, weather diversions, entre outros.
      </p>
      <p>
        O examinador quer ver como voce comunica problemas, toma decisoes
        e coordena acoes sob pressao. Vocabulario tecnico de emergencias
        e essencial aqui. Pratique cenarios como: "Mayday, Mayday...",
        "Request immediate landing due to...", "Declaring emergency because...".
      </p>

      <h3 id="parte-4">Parte 4 — Picture Description (~10 minutos)</h3>
      <p>
        Voce recebe imagens relacionadas a aviacao (acidentes, cenarios de
        aeroporto, cockpits, weather phenomena) e deve descreve-las em
        ingles. Apos a descricao, o examinador faz perguntas sobre a imagem
        e pede sua opiniao sobre as causas ou consequencias do que voce ve.
      </p>
      <p>
        Esta parte avalia especialmente Vocabulary e Structure. Dica:
        organize sua descricao (foreground → background → details → opinion)
        e use vocabulario descritivo rico. Veja{" "}
        <Link href="/dicas-prova-icao-descricao-imagens">
          dicas especificas para descricao de imagens
        </Link>.
      </p>

      <AppBanner variant="inline" />

      <h2 id="avaliacao">Como voce e avaliado</h2>
      <p>
        Ao longo das 4 partes, o examinador avalia seus{" "}
        <Link href="/descritores-da-prova-icao">6 descritores</Link> de forma
        independente: Pronunciation, Structure, Vocabulary, Fluency,
        Comprehension e Interaction. Cada descritor recebe uma nota de 1 a 6.
      </p>
      <p>
        Os examinadores sao treinados e credenciados pela ANAC seguindo
        padroes da ICAO. Eles avaliam de forma objetiva usando criterios
        especificos definidos no Doc 9835.
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
        <li>Tempo adicional para instrucoes e transicoes: ~5 minutos</li>
      </ul>

      <h2 id="nota">Como funciona a nota</h2>
      <p>
        Sua nota final e o menor valor entre os 6 descritores. Se voce tirar
        5 em todos menos Interaction (onde tirou 4), seu resultado sera
        Level 4. Veja a{" "}
        <Link href="/descritores-da-prova-icao">tabela de descritores</Link>{" "}
        para entender melhor. Para entender o que cada nivel significa, veja{" "}
        <Link href="/niveis-icao">niveis ICAO de 1 a 6</Link>.
      </p>

      <h2 id="nao-online">A prova ICAO NAO e online</h2>

      <CalloutBox variant="warning" title="A prova ICAO e presencial">
        A prova NAO e online — e obrigatoriamente presencial com examinadores
        credenciados pela ANAC. Nao existe versao remota ou digital da
        avaliacao. Desconfie de qualquer oferta de prova online.
      </CalloutBox>

      <p>
        A prova deve ser realizada em um dos{" "}
        <Link href="/onde-fazer-a-prova-icao">
          centros credenciados pela ANAC
        </Link>{" "}
        espalhados pelo Brasil. O candidato vai pessoalmente ao centro e
        a avaliacao e conduzida face-a-face com o examinador.
      </p>

      <h2 id="reprovacao">O que acontece se voce reprovar</h2>
      <p>
        Se sua nota final for Level 3 ou inferior, voce e considerado
        reprovado. Nesse caso:
      </p>
      <ul>
        <li>
          <strong>Espera obrigatoria de 60 dias:</strong> Voce nao pode
          refazer a prova antes desse prazo (regra da ANAC)
        </li>
        <li>
          <strong>Nova taxa:</strong> Precisa pagar novamente a taxa do
          centro credenciado (consulte{" "}
          <Link href="/quanto-custa-a-prova-icao">custos da prova</Link>)
        </li>
        <li>
          <strong>Preparacao direcionada:</strong> Use os 60 dias para focar
          nos descritores que tiveram menor nota
        </li>
      </ul>
      <p>
        Saiba mais sobre como{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">
          se preparar de forma eficiente
        </Link>{" "}
        para evitar reprovacao.
      </p>
    </ContentPageLayout>
  );
}
