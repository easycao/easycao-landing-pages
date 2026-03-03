import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";

const PAGE_SLUG = "niveis-icao";
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
  { id: "escala-resumo", text: "A escala ICAO em resumo", level: 2 },
  { id: "nivel-3-abaixo", text: "Nivel 3 e abaixo — o que significa reprovar", level: 2 },
  { id: "nivel-4", text: "Nivel 4 — o minimo operacional", level: 2 },
  { id: "nivel-5", text: "Nivel 5 — avancado", level: 2 },
  { id: "nivel-6", text: "Nivel 6 — expert", level: 2 },
  { id: "companhias-aereas", text: "Qual nivel as companhias aereas exigem", level: 2 },
  { id: "validade", text: "Validade de cada nivel", level: 2 },
];

const faqs = [
  {
    question: "Qual e o nivel minimo para ser aprovado na prova ICAO?",
    answer:
      "O nivel minimo e Level 4 (Operational). Pilotos com Level 3 ou inferior sao considerados reprovados e precisam aguardar 60 dias para refazer a prova.",
  },
  {
    question: "Qual a diferenca entre Level 4 e Level 5?",
    answer:
      "Level 4 e o minimo para operar internacionalmente e tem validade de 3 anos. Level 5 demonstra proficiencia avancada, com validade de 6 anos, e e mais valorizado pelas companhias aereas. A diferenca esta na consistencia e naturalidade da comunicacao.",
  },
  {
    question: "E possivel tirar Level 6 direto na prova?",
    answer:
      "Nao diretamente. Se o examinador identificar que voce tem potencial para Level 6, voce passa para um segundo estagio de avaliacao (prova avancada de 45 minutos) dentro de 60 dias. Se nao passar no Stage 2, mantem Level 5.",
  },
  {
    question: "Level 6 realmente nao precisa renovar?",
    answer:
      "Correto. Level 6 (Expert) tem validade vitalicia segundo as normas da ICAO. E o unico nivel que nao exige renovacao periodica. Por isso o processo de avaliacao para Level 6 e mais rigoroso, com duas etapas.",
  },
  {
    question: "Posso voar internacionalmente com Level 4?",
    answer:
      "Sim. Level 4 e o nivel minimo exigido pela ICAO para operacoes internacionais. No entanto, muitas companhias aereas preferem pilotos com Level 5 ou superior em seus processos seletivos.",
  },
];

export default function NiveisIcaoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="escala-resumo">A escala ICAO em resumo</h2>
      <p>
        A escala de proficiencia linguistica da ICAO vai de Level 1 (Pre-Elementary)
        a Level 6 (Expert). Cada nivel descreve um grau diferente de
        habilidade de comunicacao em ingles aeronautico. Veja a tabela resumo:
      </p>

      <div className="overflow-x-auto my-6">
        <table>
          <thead>
            <tr>
              <th>Nivel</th>
              <th>Nome</th>
              <th>Resultado</th>
              <th>Validade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Pre-Elementary</td>
              <td className="text-red-600 font-semibold">Reprovado</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Elementary</td>
              <td className="text-red-600 font-semibold">Reprovado</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Pre-Operational</td>
              <td className="text-red-600 font-semibold">Reprovado</td>
              <td>N/A</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Operational</td>
              <td className="text-green-600 font-semibold">Aprovado (minimo)</td>
              <td>3 anos</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Extended</td>
              <td className="text-green-600 font-semibold">Aprovado</td>
              <td>6 anos</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Expert</td>
              <td className="text-green-600 font-semibold">Aprovado (maximo)</td>
              <td>Vitalicio*</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-black/50">
        *Level 6 requer avaliacao em dois estagios. Veja detalhes abaixo.
      </p>

      <h2 id="nivel-3-abaixo">Nivel 3 e abaixo — o que significa reprovar</h2>
      <p>
        Se voce obtiver Level 3 (Pre-Operational) ou inferior, e considerado
        reprovado e nao pode operar voos internacionais. As consequencias
        praticas sao:
      </p>
      <ul>
        <li>
          <strong>Espera de 60 dias:</strong> Regra da ANAC — nao e possivel
          refazer antes desse prazo
        </li>
        <li>
          <strong>Nova taxa:</strong> Precisa pagar novamente a taxa do
          centro credenciado
        </li>
        <li>
          <strong>Impacto na carreira:</strong> Pode atrasar contratacoes e
          habilitacoes que exigem proficiencia em ingles
        </li>
      </ul>
      <p>
        Se voce reprovou, nao desanime. Use os 60 dias para uma{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">
          preparacao focada
        </Link>{" "}
        nos descritores que tiveram menor nota.
      </p>

      <h2 id="nivel-4">Nivel 4 — o minimo operacional</h2>
      <p>
        Level 4 (Operational) e o nivel minimo exigido pela ICAO para pilotos
        que realizam operacoes internacionais. Significa que voce consegue
        se comunicar de forma adequada em situacoes de rotina e em algumas
        situacoes inesperadas, mesmo com limitacoes.
      </p>
      <p>
        Caracteristicas do Level 4:
      </p>
      <ul>
        <li>Pronuncia geralmente compreensivel com influencia da lingua materna</li>
        <li>Vocabulario suficiente para temas comuns e profissionais</li>
        <li>Erros gramaticais raramente interferem na comunicacao</li>
        <li>Fluencia com pausas ocasionais para buscar expressoes</li>
        <li>Compreensao geralmente precisa em temas profissionais</li>
      </ul>

      <CalloutBox variant="info" title="Level 4 e o resultado mais comum">
        A maioria dos pilotos aprovados obtem Level 4. E um resultado valido
        para operar internacionalmente com validade de 3 anos. Muitos pilotos
        optam por fazer a prova novamente buscando Level 5 para maior validade.
      </CalloutBox>

      <h2 id="nivel-5">Nivel 5 — avancado</h2>
      <p>
        Level 5 (Extended) demonstra proficiencia avancada. A comunicacao e
        fluente, precisa e natural, com rarissimas interferencias da lingua
        materna. As principais vantagens:
      </p>
      <ul>
        <li>
          <strong>Validade de 6 anos</strong> — o dobro do Level 4
        </li>
        <li>
          <strong>Diferencial em processos seletivos</strong> — companhias
          aereas valorizam Level 5+
        </li>
        <li>
          <strong>Menor frequencia de renovacao</strong> — menos burocracia
          e custo a longo prazo
        </li>
      </ul>
      <p>
        A diferenca entre Level 4 e Level 5 esta na consistencia. No Level 5,
        os erros quase nunca interferem, o vocabulario e amplo e preciso, e
        a interacao e imediata e apropriada.
      </p>

      <h2 id="nivel-6">Nivel 6 — expert</h2>
      <p>
        Level 6 (Expert) e o nivel maximo e tem validade vitalicia. Porem,
        nao e possivel obte-lo diretamente em uma unica prova. O processo
        tem duas etapas:
      </p>

      <CalloutBox variant="tip" title="Processo de Level 6 em 2 estagios">
        <strong>Stage 1:</strong> O examinador da prova padrao identifica
        candidatos com potencial para Level 6 (geralmente Level 5+ consistente).
        <br />
        <strong>Stage 2:</strong> Avaliacao avancada de 45 minutos com 5 partes,
        realizada dentro de 60 dias. Se nao passar, mantem Level 5.
      </CalloutBox>

      <p>
        O Stage 2 e mais rigoroso e inclui cenarios complexos, discussao de
        temas abstratos relacionados a aviacao e demonstracao de dominio
        proximo ao nativo. Segundo dados da{" "}
        <a
          href="https://www.gov.br/anac/pt-br/assuntos/regulados/profissionais-da-aviacao-civil/proficiencia-linguistica"
          target="_blank"
          rel="noopener noreferrer"
        >
          ANAC
        </a>
        , menos de 5% dos candidatos atingem Level 6.
      </p>

      <h2 id="companhias-aereas">Qual nivel as companhias aereas exigem</h2>
      <p>
        Embora Level 4 seja o minimo regulatorio, as companhias aereas
        costumam ter suas proprias exigencias:
      </p>
      <ul>
        <li>
          <strong>LATAM, Gol, Azul:</strong> Level 4 minimo para contratacao,
          mas Level 5 e diferencial competitivo
        </li>
        <li>
          <strong>Companhias internacionais:</strong> Frequentemente exigem
          Level 5 ou superior
        </li>
        <li>
          <strong>Aviacao executiva:</strong> Level 4 geralmente suficiente,
          mas Level 5 abre mais oportunidades
        </li>
      </ul>
      <p>
        Investir na preparacao para Level 5 pode ser uma decisao estrategica
        para sua carreira. Veja{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">
          como se preparar
        </Link>{" "}
        para atingir o nivel desejado.
      </p>

      <h2 id="validade">Validade de cada nivel</h2>
      <p>
        A validade determina quando voce precisa refazer a prova:
      </p>
      <ul>
        <li><strong>Level 4:</strong> 3 anos — renovacao mais frequente</li>
        <li><strong>Level 5:</strong> 6 anos — renovacao a cada 6 anos</li>
        <li><strong>Level 6:</strong> Vitalicio — nao precisa renovar</li>
      </ul>
      <p>
        Ao calcular o custo total da certificacao, considere que um piloto
        com Level 4 gastara o dobro em taxas de renovacao comparado a Level 5
        em um periodo de 6 anos. Saiba mais sobre{" "}
        <Link href="/quanto-custa-a-prova-icao">custos da prova ICAO</Link>.
      </p>
    </ContentPageLayout>
  );
}
