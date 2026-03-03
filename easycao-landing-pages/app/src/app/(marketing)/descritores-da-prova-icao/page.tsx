import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";
import AppBanner from "../../../components/AppBanner";

const PAGE_SLUG = "descritores-da-prova-icao";
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
  { id: "o-que-sao", text: "O que sao os descritores holisticos da ICAO", level: 2 },
  { id: "descritores-em-detalhe", text: "Os 6 descritores em detalhe", level: 2 },
  { id: "pronunciation", text: "Pronunciation (Pronuncia)", level: 3 },
  { id: "structure", text: "Structure (Estrutura)", level: 3 },
  { id: "vocabulary", text: "Vocabulary (Vocabulario)", level: 3 },
  { id: "fluency", text: "Fluency (Fluencia)", level: 3 },
  { id: "comprehension", text: "Comprehension (Compreensao)", level: 3 },
  { id: "interaction", text: "Interaction (Interacao)", level: 3 },
  { id: "nota-final", text: "Como funciona a nota final", level: 2 },
  { id: "palavras-chave", text: "Palavras-chave de progressao entre niveis", level: 2 },
  { id: "dicas", text: "Dicas para melhorar cada descritor", level: 2 },
];

const faqs = [
  {
    question: "Quantos descritores sao avaliados na prova ICAO?",
    answer:
      "Sao 6 descritores holisticos: Pronunciation, Structure, Vocabulary, Fluency, Comprehension e Interaction. Cada um e avaliado de forma independente pelo examinador durante a prova.",
  },
  {
    question: "Qual descritor e mais dificil para pilotos brasileiros?",
    answer:
      "Interaction costuma ser o mais desafiador, pois envolve habilidades de turn-taking, pedir clarificacoes e gerenciar a conversa de forma natural — algo que nao se pratica em cursos tradicionais de ingles.",
  },
  {
    question: "Posso tirar 6 em um descritor e 4 em outro?",
    answer:
      "Sim, mas sua nota final sera 4, pois a regra e que o nivel final e igual ao menor descritor. Por isso e fundamental nao negligenciar nenhum dos 6 descritores na preparacao.",
  },
  {
    question: "Como praticar os descritores de forma eficiente?",
    answer:
      "O simulador do app Easycao permite praticar todos os descritores com feedback automatico. Nas lives semanais, o professor Diogo tambem faz simulados ao vivo com correcao por descritor.",
  },
  {
    question: "Os descritores da prova ICAO mudaram recentemente?",
    answer:
      "Nao. Os 6 descritores holisticos seguem o padrao do Doc 9835 da ICAO, que esta em vigor desde 2010. As escalas e criterios de avaliacao permanecem os mesmos.",
  },
];

export default function DescritoresPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      {/* O que sao os descritores */}
      <h2 id="o-que-sao">O que sao os descritores holisticos da ICAO</h2>
      <p>
        Os descritores holisticos sao os 6 criterios usados pela ICAO
        (Organizacao da Aviacao Civil Internacional) para avaliar a proficiencia
        em ingles de pilotos e controladores de trafego aereo. Definidos no{" "}
        <a
          href="https://www.icao.int/safety/lpr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Doc 9835 da ICAO
        </a>
        , esses descritores foram criados especificamente para contextos
        aeronauticos — nao se trata de um teste de ingles geral.
      </p>
      <p>
        Durante a prova ICAO (tambem chamada de{" "}
        <Link href="/como-funciona-a-prova-icao">SDEA</Link> no Brasil), o
        examinador avalia cada descritor de forma independente, atribuindo uma
        nota de 1 a 6 para cada um. A regra fundamental e:
      </p>

      <CalloutBox variant="info" title="Regra da nota final">
        A nota final da prova ICAO e sempre igual ao menor descritor. Se voce
        tirar 5 em cinco descritores e 4 em um, seu resultado sera Level 4.
      </CalloutBox>

      <p>
        Isso significa que negligenciar qualquer um dos 6 descritores pode
        comprometer toda a sua prova. A preparacao precisa ser equilibrada.
      </p>

      {/* Os 6 descritores em detalhe */}
      <h2 id="descritores-em-detalhe">Os 6 descritores em detalhe</h2>
      <p>
        Cada descritor avalia uma dimensao diferente da sua comunicacao em
        ingles. Veja o que os examinadores observam em cada um:
      </p>

      <h3 id="pronunciation">Pronunciation (Pronuncia)</h3>
      <p>
        Avalia se a pronuncia, o ritmo e a entonacao sao compreensivos. Nao
        exige sotaque nativo — o que importa e a inteligibilidade. Erros comuns
        de brasileiros incluem: nao pronunciar consoantes finais (como o "d" em
        "cleared"), confundir "th" com "f/d", e entonacao muito plana.
      </p>
      <p>
        Para Level 4, a pronuncia deve ser "geralmente compreensivel" mesmo com
        influencia da lingua materna. Para Level 5, deve ser "consistentemente
        compreensivel" com rarissimas interferencias.
      </p>

      <h3 id="structure">Structure (Estrutura)</h3>
      <p>
        Avalia o uso de estruturas gramaticais basicas e complexas. Nao e um
        teste de gramatica tradicional — o examinador observa se voce consegue
        usar estruturas variadas (condicionais, voz passiva, reported speech)
        para se comunicar de forma eficaz em situacoes de aviacao.
      </p>
      <p>
        Erros comuns: uso excessivo de frases curtas e simples (limita o score),
        mistura de tempos verbais, e falta de conectores logicos.
      </p>

      <h3 id="vocabulary">Vocabulary (Vocabulario)</h3>
      <p>
        Avalia a amplitude e precisao do vocabulario, tanto{" "}
        <Link href="/vocabulario-aviacao-ingles">
          vocabulario especifico de aviacao
        </Link>{" "}
        quanto vocabulario geral. Voce precisa dominar termos tecnicos
        (weather phenomena, aircraft systems, emergency procedures) e tambem
        conseguir se expressar sobre temas gerais quando necessario.
      </p>
      <p>
        Para Level 4, espera-se vocabulario "suficiente para comunicacao sobre
        temas comuns, concretos e relacionados ao trabalho". Para Level 5,
        "amplo e preciso".
      </p>

      <h3 id="fluency">Fluency (Fluencia)</h3>
      <p>
        Avalia a velocidade da fala, a naturalidade e o uso de pausas. Nao e
        sobre falar rapido — e sobre manter o fluxo da comunicacao sem pausas
        longas e desnecessarias. Preenchedores de pausa como "uh", "well",
        "you know" sao normais ate Level 4, mas devem diminuir em niveis mais
        altos.
      </p>
      <p>
        O examinador observa se voce consegue desenvolver ideias sem
        interrupcoes excessivas e se a comunicacao flui naturalmente em
        contextos profissionais.
      </p>

      <h3 id="comprehension">Comprehension (Compreensao)</h3>
      <p>
        Avalia a capacidade de entender ingles em contextos aeronauticos.
        Durante a prova, o examinador testa isso fazendo perguntas,
        apresentando cenarios e verificando se voce compreende instrucoes
        e informacoes. Nao e um teste de listening separado — a compreensao
        e avaliada ao longo de toda a prova.
      </p>
      <p>
        Para Level 4, voce deve compreender "com precisao" temas relacionados
        ao trabalho. Dificuldade com sotaques variados ou linguagem figurada
        pode reduzir o score.
      </p>

      <h3 id="interaction">Interaction (Interacao)</h3>
      <p>
        Avalia a capacidade de manter um dialogo natural. Isso inclui:
        turn-taking (saber quando falar e quando ouvir), pedir clarificacoes
        quando nao entendeu, reformular frases, confirmar informacoes e
        manter a conversa produtiva.
      </p>
      <p>
        Este e frequentemente o descritor mais desafiador para pilotos
        brasileiros, pois exige habilidades conversacionais que nao sao
        praticadas em cursos tradicionais. A{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">preparacao ideal</Link>{" "}
        inclui simulados reais com pratica de interacao.
      </p>

      {/* Como funciona a nota final */}
      <h2 id="nota-final">Como funciona a nota final</h2>
      <p>
        O examinador atribui uma nota de 1 a 6 para cada descritor. Sua nota
        final e o menor valor entre os 6. Veja um exemplo:
      </p>

      <div className="overflow-x-auto my-6">
        <table>
          <thead>
            <tr>
              <th>Descritor</th>
              <th>Nota do Piloto A</th>
              <th>Nota do Piloto B</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Pronunciation</td><td>5</td><td>4</td></tr>
            <tr><td>Structure</td><td>5</td><td>5</td></tr>
            <tr><td>Vocabulary</td><td>4</td><td>5</td></tr>
            <tr><td>Fluency</td><td>5</td><td>5</td></tr>
            <tr><td>Comprehension</td><td>5</td><td>4</td></tr>
            <tr><td>Interaction</td><td>5</td><td>5</td></tr>
            <tr>
              <td className="font-bold">Resultado Final</td>
              <td className="font-bold">Level 4</td>
              <td className="font-bold">Level 4</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Ambos os pilotos recebem Level 4, mesmo com notas altas na maioria dos
        descritores. E por isso que a preparacao equilibrada e essencial. Saiba
        mais sobre{" "}
        <Link href="/niveis-icao">o que cada nivel significa</Link>.
      </p>

      {/* Palavras-chave de progressao */}
      <h2 id="palavras-chave">Palavras-chave de progressao entre niveis</h2>
      <p>
        Os descritores do Doc 9835 usam palavras especificas para diferenciar os
        niveis. Essas palavras-chave sao fundamentais para entender o que o
        examinador espera:
      </p>

      <div className="overflow-x-auto my-6">
        <table>
          <thead>
            <tr>
              <th>Aspecto</th>
              <th>Level 3</th>
              <th>Level 4</th>
              <th>Level 5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Erros</td>
              <td>Frequentemente interferem</td>
              <td>Raramente interferem</td>
              <td>Quase nunca interferem</td>
            </tr>
            <tr>
              <td>Vocabulario</td>
              <td>Limitado</td>
              <td>Suficiente</td>
              <td>Amplo e preciso</td>
            </tr>
            <tr>
              <td>Fluencia</td>
              <td>Pausas longas</td>
              <td>Pausas ocasionais</td>
              <td>Fluxo natural</td>
            </tr>
            <tr>
              <td>Compreensao</td>
              <td>Frequentemente imprecisa</td>
              <td>Geralmente precisa</td>
              <td>Consistentemente precisa</td>
            </tr>
            <tr>
              <td>Interacao</td>
              <td>Respostas basicas</td>
              <td>Respostas adequadas</td>
              <td>Respostas imediatas e apropriadas</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Perceba como a diferenca entre Level 3 (reprovado) e Level 4 (aprovado)
        esta em palavras como "frequentemente" vs "raramente". Entender essas
        nuances ajuda a direcionar sua preparacao.
      </p>

      {/* Dicas */}
      <h2 id="dicas">Dicas para melhorar cada descritor</h2>
      <p>
        Melhorar nos descritores exige pratica especifica e direcionada. Aqui
        estao estrategias praticas:
      </p>
      <ul>
        <li>
          <strong>Pronunciation:</strong> Grave-se lendo NOTAM e ATIS e compare
          com audio de controllers nativos. Foque em consoantes finais e
          entonacao.
        </li>
        <li>
          <strong>Structure:</strong> Pratique condicionais e reported speech em
          contextos de aviacao. "If the runway had been longer..." vs "The tower
          said that..."
        </li>
        <li>
          <strong>Vocabulary:</strong> Estude termos de weather, emergencies e
          systems. Use o{" "}
          <Link href="/vocabulario-aviacao-ingles">
            glossario de vocabulario de aviacao
          </Link>
          .
        </li>
        <li>
          <strong>Fluency:</strong> Pratique respostas longas (1-2 minutos) sobre
          temas de aviacao. Reduza pausas com pratica regular.
        </li>
        <li>
          <strong>Comprehension:</strong> Ouca podcasts e comunicacoes ATC reais.
          Exponha-se a sotaques variados.
        </li>
        <li>
          <strong>Interaction:</strong> Simule dialogos completos. Pratique pedir
          clarificacoes e reformular frases.
        </li>
      </ul>

      <AppBanner variant="inline" />

      <CalloutBox variant="tip" title="Pratique com examinador credenciado">
        Nas{" "}
        <Link href="/lives">lives gratuitas da Easycao</Link>, o professor Diogo
        faz simulados ao vivo e corrige cada descritor individualmente. E a
        melhor forma gratuita de praticar. Voce tambem pode praticar no{" "}
        <a
          href="https://www.gov.br/anac/pt-br/assuntos/regulados/profissionais-da-aviacao-civil/proficiencia-linguistica"
          target="_blank"
          rel="noopener noreferrer"
        >
          portal da ANAC
        </a>{" "}
        onde encontra informacoes oficiais sobre a avaliacao.
      </CalloutBox>
    </ContentPageLayout>
  );
}
