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
    title: page.title,
    description: page.description,
    url: `${SITE_URL}/${PAGE_SLUG}`,
    siteName: "Easycao",
    type: "article",
    locale: "pt_BR",
  },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "o-que-sao", text: "O que são os descritores holísticos da ICAO", level: 2 },
  { id: "descritores-em-detalhe", text: "Os 6 descritores em detalhe", level: 2 },
  { id: "pronunciation", text: "Pronunciation (Pronúncia)", level: 3 },
  { id: "structure", text: "Structure (Estrutura)", level: 3 },
  { id: "vocabulary", text: "Vocabulary (Vocabulário)", level: 3 },
  { id: "fluency", text: "Fluency (Fluência)", level: 3 },
  { id: "comprehension", text: "Comprehension (Compreensão)", level: 3 },
  { id: "interaction", text: "Interaction (Interação)", level: 3 },
  { id: "nota-final", text: "Como funciona a nota final", level: 2 },
  { id: "palavras-chave", text: "Palavras-chave de progressão entre níveis", level: 2 },
  { id: "dicas", text: "Dicas para melhorar cada descritor", level: 2 },
];

const faqs = [
  {
    question: "Quantos descritores são avaliados na prova ICAO?",
    answer:
      "São 6 descritores holísticos: Pronunciation, Structure, Vocabulary, Fluency, Comprehension e Interaction. Cada um é avaliado de forma independente pelo examinador durante a prova.",
  },
  {
    question: "Qual descritor é mais difícil para pilotos brasileiros?",
    answer:
      "Estrutura, pois vai além da gramática. É necessário que a gramática e a semântica estejam associadas ao contexto do DOC9835.",
  },
  {
    question: "Posso tirar 5 em um descritor e 4 em outro?",
    answer:
      "Sim, mas sua nota final será 4, pois a regra é que o nível final é igual ao menor descritor. Por isso é fundamental não negligenciar nenhum dos 6 descritores na preparação.",
  },
  {
    question: "Como praticar os descritores de forma eficiente?",
    answer:
      "O simulador do app Easycao permite praticar todos os descritores com feedback automático. Nas lives semanais, o professor Diogo também faz simulados ao vivo com correção por descritor.",
  },
  {
    question: "Os descritores da prova ICAO mudaram recentemente?",
    answer:
      "Não. Os 6 descritores holísticos seguem o padrão do Doc 9835 da ICAO, que está em vigor desde 2010. As escalas e critérios de avaliação permanecem os mesmos.",
  },
];

export default function DescritoresPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      {/* O que são os descritores */}
      <h2 id="o-que-sao">O que são os descritores holísticos da ICAO</h2>
      <p>
        Os descritores holísticos são os 6 critérios usados pela ICAO
        (Organização da Aviação Civil Internacional) para avaliar a proficiência
        em inglês de pilotos e controladores de tráfego aéreo. Definidos no{" "}
        <a
          href="https://www.icao.int/safety/lpr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Doc 9835 da ICAO
        </a>
        , esses descritores foram criados especificamente para contextos
        aeronáuticos — não se trata de um teste de inglês geral.
      </p>
      <p>
        Durante a prova ICAO (também chamada de{" "}
        <Link href="/como-funciona-a-prova-icao">SDEA</Link> no Brasil), o
        examinador avalia cada descritor de forma independente, atribuindo uma
        nota de 1 a 6 para cada um. A regra fundamental é:
      </p>

      <CalloutBox variant="info" title="Regra da nota final">
        A nota final da prova ICAO é sempre igual ao menor descritor. Se você
        tirar 5 em cinco descritores e 4 em um, seu resultado será Level 4.
      </CalloutBox>

      <p>
        Isso significa que negligenciar qualquer um dos 6 descritores pode
        comprometer toda a sua prova. A preparação precisa ser equilibrada.
      </p>

      {/* Os 6 descritores em detalhe */}
      <h2 id="descritores-em-detalhe">Os 6 descritores em detalhe</h2>
      <p>
        Cada descritor avalia uma dimensão diferente da sua comunicação em
        inglês. Veja o que os examinadores observam em cada um:
      </p>

      <h3 id="pronunciation">Pronunciation (Pronúncia)</h3>
      <p>
        Avalia se a pronúncia, o ritmo e a entonação são compreensivos. Não
        exige sotaque nativo — o que importa é a inteligibilidade. Erros comuns
        de brasileiros incluem: não pronunciar consoantes finais (como o "d" em
        "cleared"), confundir "th" com "f/d", e entonação muito plana.
      </p>
      <p>
        Para Level 5, deve ser "consistentemente compreensível" com o ritmo e
        entonação de fala mais fluídos, que não gerem dificuldade para o
        examinador entender o que você falou.
      </p>

      <h3 id="structure">Structure (Estrutura)</h3>
      <p>
        Erros que comprometem a estruturação da frase: tempos verbais,
        preposições, artigos, etc... Podem ocasionar erros globais fazendo
        sua nota cair.
      </p>

      <h3 id="vocabulary">Vocabulary (Vocabulário)</h3>
      <p>
        Avalia a amplitude e precisão do vocabulário, tanto{" "}
        <Link href="/vocabulario-aviacao-ingles">
          vocabulário específico de aviação
        </Link>{" "}
        quanto vocabulário geral. Você precisa ter a escolha correta da
        palavra para cada ocasião necessária.
      </p>
      <p>
        Para Level 4, espera-se vocabulário "suficiente para comunicação sobre
        temas comuns, concretos e relacionados ao trabalho". Para Level 5,
        "amplo e idiomático".
      </p>

      <h3 id="fluency">Fluency (Fluência)</h3>
      <p>
        Avalia a velocidade da fala, a naturalidade e o uso de pausas. Não é
        sobre falar rápido — é sobre manter o fluxo da comunicação sem pausas
        longas e desnecessárias. Preenchedores de pausa como "uhnnn", "ehhhh",
        "ihhh" são chamados "fillers" e também comprometem sua nota de fluência.
      </p>
      <p>
        O examinador observa se você consegue desenvolver ideias sem
        interrupções excessivas e se a comunicação flui naturalmente em
        contextos profissionais.
      </p>

      <h3 id="comprehension">Comprehension (Compreensão)</h3>
      <p>
        Avalia a capacidade de entender inglês em contextos aeronáuticos.
        Durante a prova, o examinador testa isso apresentando áudios, fazendo
        perguntas e verificando se você compreende instruções e informações.
        Não é um teste de listening separado — a compreensão é avaliada ao
        longo de toda a prova.
      </p>
      <p>
        Para Level 4, você deve compreender bem temas relacionados ao
        trabalho. Dificuldade com sotaques variados ou velocidade de áudios
        pode reduzir o score.
      </p>

      <h3 id="interaction">Interaction (Interação)</h3>
      <p>
        Avalia a capacidade de manter um diálogo natural. Isso inclui:
        turn-taking (saber quando falar e quando ouvir), pedir clarificações
        quando não entendeu, reformular frases, confirmar informações e
        manter a conversa produtiva.
      </p>
      <p>
        Você precisa ser imediato, apropriado e informativo, respostas
        decoradas não são apropriadas e frequentemente penalizam em interação.
      </p>
      <p>
        Este é frequentemente o descritor mais desafiador para pilotos
        brasileiros, pois exige habilidades conversacionais que não são
        praticadas em cursos tradicionais. A{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">preparação ideal</Link>{" "}
        inclui simulados reais com prática de interação.
      </p>

      {/* Como funciona a nota final */}
      <h2 id="nota-final">Como funciona a nota final</h2>
      <p>
        O examinador atribui uma nota de 1 a 5* para cada descritor. Sua nota
        final é o menor valor entre os 6. Veja um exemplo:
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
        descritores. É por isso que a preparação equilibrada é essencial. Saiba
        mais sobre{" "}
        <Link href="/niveis-icao">o que cada nível significa</Link>.
      </p>

      {/* Palavras-chave de progressão */}
      <h2 id="palavras-chave">Palavras-chave de progressão entre níveis</h2>
      <p>
        Os descritores do Doc 9835 usam palavras específicas para diferenciar os
        níveis. Essas palavras-chave são fundamentais para entender o que o
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
              <td>Pronúncia</td>
              <td>Erros Frequentemente interferem</td>
              <td>Erros Raramente interferem</td>
              <td>Erros Quase nunca interferem</td>
            </tr>
            <tr>
              <td>Estrutura</td>
              <td>Erros Frequentemente interferem</td>
              <td>Erros Raramente interferem</td>
              <td>Erros Quase nunca interferem</td>
            </tr>
            <tr>
              <td>Vocabulário</td>
              <td>Limitado</td>
              <td>Suficiente</td>
              <td>Amplo e preciso</td>
            </tr>
            <tr>
              <td>Fluência</td>
              <td>Pausas longas</td>
              <td>Pausas ocasionais</td>
              <td>Fluxo natural</td>
            </tr>
            <tr>
              <td>Compreensão</td>
              <td>Frequentemente imprecisa</td>
              <td>Geralmente precisa</td>
              <td>Consistentemente precisa</td>
            </tr>
            <tr>
              <td>Interação</td>
              <td>Respostas básicas</td>
              <td>Respostas adequadas</td>
              <td>Respostas imediatas e apropriadas</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Perceba como a diferença entre Level 3 (reprovado) e Level 4 (aprovado)
        está em palavras como "frequentemente" vs "raramente". Entender essas
        nuances ajuda a direcionar sua preparação.
      </p>

      {/* Dicas */}
      <h2 id="dicas">Dicas para melhorar cada descritor</h2>
      <p>
        Melhorar nos descritores exige prática específica e direcionada. Aqui
        estão estratégias práticas:
      </p>
      <ul>
        <li>
          <strong>Pronunciation:</strong> Treine falar em voz alta, além do
          estudo teórico, inclusa sessões de fala para praticar a habilidade
          de pronúncia.
        </li>
        <li>
          <strong>Structure:</strong> Entenda a lógica de montagem de frases
          simples e exercite a aplicação dessas frases no contexto prático
          da prova.
        </li>
        <li>
          <strong>Vocabulary:</strong> Coloque mais a língua inglesa no seu dia
          a dia e cada palavra nova aprendida, procure dar um direcionamento
          prático.
        </li>
        <li>
          <strong>Fluency:</strong> A fluência só pode ser desenvolvida
          treinando, sugere-se que você separe pelo menos 30 minutos do seu
          dia para exercitar a prática.
        </li>
        <li>
          <strong>Comprehension:</strong> Treine seu ouvido com exposição à
          Língua Inglesa, além de áudios de ATC, filmes, podcasts e músicas
          ajudam a treinar o ouvido.
        </li>
        <li>
          <strong>Interaction:</strong> Simule diálogos completos. Pratique pedir
          clarificações e reformular frases.
        </li>
      </ul>

      <AppBanner variant="inline" />

      <CalloutBox variant="tip" title="Pratique com examinador credenciado">
        Nas{" "}
        <Link href="/lives">lives gratuitas da Easycao</Link>, o professor Diogo
        faz simulados ao vivo e corrige cada descritor individualmente. É a
        melhor forma gratuita de praticar. Você também pode praticar no{" "}
        <a
          href="https://www.gov.br/anac/pt-br/assuntos/regulados/profissionais-da-aviacao-civil/processo-de-licencas-e-habilitacoes/proficiencia-linguistica/entidades-credenciadas"
          target="_blank"
          rel="noopener noreferrer"
        >
          portal da ANAC
        </a>{" "}
        onde encontra informações oficiais sobre a avaliação.
      </CalloutBox>
    </ContentPageLayout>
  );
}
