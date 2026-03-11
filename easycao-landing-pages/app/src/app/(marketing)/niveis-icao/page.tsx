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
    title: page.title,
    description: page.description,
    url: `${SITE_URL}/${PAGE_SLUG}`,
    siteName: "Easycao",
    type: "article",
    locale: "pt_BR",
  },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "escala-resumo", text: "A escala ICAO em resumo", level: 2 },
  { id: "nivel-3-abaixo", text: "Nível 3 e abaixo — o que significa reprovar", level: 2 },
  { id: "nivel-4", text: "Nível 4 — o mínimo operacional", level: 2 },
  { id: "nivel-5", text: "Nível 5 — avançado", level: 2 },
  { id: "nivel-6", text: "Nível 6 — expert", level: 2 },
  { id: "companhias-aereas", text: "Qual nível as companhias aéreas exigem", level: 2 },
  { id: "validade", text: "Validade de cada nível", level: 2 },
];

const faqs = [
  {
    question: "Qual é o nível mínimo para ser aprovado na prova ICAO?",
    answer:
      "O nível mínimo é Level 4 (Operational). Pilotos com Level 3 ou inferior são considerados reprovados e precisam aguardar 60 dias para refazer a prova.",
  },
  {
    question: "Qual a diferença entre Level 4 e Level 5?",
    answer:
      "Level 4 é o mínimo para operar internacionalmente e tem validade de 3 anos. Level 5 demonstra proficiência avançada, com validade de 6 anos, e é mais valorizado pelas companhias aéreas. A diferença está na consistência e naturalidade da comunicação.",
  },
  {
    question: "É possível obter Level 6 direto na prova?",
    answer:
      "Não diretamente. Se o examinador identificar que você tem potencial para Level 6, você passa para um segundo estágio de avaliação (prova avançada de 45 minutos) dentro de 60 dias. Se não passar no Stage 2, mantém Level 5.",
  },
  {
    question: "Level 6 realmente não precisa renovar?",
    answer:
      "Correto. Level 6 (Expert) tem validade vitalícia segundo as normas da ICAO. É o único nível que não exige renovação periódica. Por isso o processo de avaliação para Level 6 é mais rigoroso, com duas etapas.",
  },
  {
    question: "Posso voar internacionalmente com Level 4?",
    answer:
      "Sim. Level 4 é o nível mínimo exigido pela ICAO para operações internacionais. No entanto, muitas companhias aéreas preferem pilotos com Level 5 ou superior em seus processos seletivos.",
  },
];

export default function NiveisIcaoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="escala-resumo">A escala ICAO em resumo</h2>
      <p>
        A escala de proficiência linguística da ICAO vai de Level 1 (Pre-Elementary)
        a Level 6 (Expert), O SDEA avalia apenas até o ICAO 5, caso o candidato
        demonstre indícios de que ele pode ser ICAO 6, ele será chamado para fazer
        uma prova complementar para aferir ou não o ICAO 6, caso ele não tenha um
        bom desempenho, ele ficará com o ICAO 5. Cada nível descreve um grau
        diferente de habilidade de comunicação em inglês aeronáutico. Veja a
        tabela resumo:
      </p>

      <div className="overflow-x-auto my-6">
        <table>
          <thead>
            <tr>
              <th>Nível</th>
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
              <td className="text-green-600 font-semibold">Aprovado (mínimo)</td>
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
              <td className="text-green-600 font-semibold">Aprovado (máximo)</td>
              <td>Vitalício*</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-black/50">
        *Level 6 requer avaliação em dois estágios. Veja detalhes abaixo.
      </p>

      <h2 id="nivel-3-abaixo">Nível 3 e abaixo — o que significa reprovar</h2>
      <p>
        Se você obtiver Level 3 (Pre-Operational) ou inferior, é considerado
        reprovado e não pode operar voos internacionais. As consequências
        práticas são:
      </p>
      <ul>
        <li>
          <strong>Espera de 60 dias:</strong> Regra da ANAC — não é possível
          refazer antes desse prazo
        </li>
        <li>
          <strong>Nova taxa:</strong> Precisa pagar novamente a taxa do
          centro credenciado
        </li>
        <li>
          <strong>Impacto na carreira:</strong> Pode atrasar contratações e
          habilitações que exigem proficiência em inglês
        </li>
      </ul>
      <p>
        Se você reprovou, não desanime. Use os 60 dias para uma{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">
          preparação focada
        </Link>{" "}
        nos descritores que tiveram menor nota.
      </p>

      <h2 id="nivel-4">Nível 4 — o mínimo operacional</h2>
      <p>
        Level 4 (Operational) é o nível mínimo exigido pela ICAO para pilotos
        que realizam operações internacionais. Significa que você consegue
        se comunicar de forma adequada em situações de rotina e em algumas
        situações inesperadas, mesmo com limitações.
      </p>
      <p>
        Características do Level 4:
      </p>
      <ul>
        <li>Pronúncia geralmente compreensível com influência da língua materna</li>
        <li>Vocabulário suficiente para temas comuns e profissionais</li>
        <li>Erros gramaticais raramente interferem na comunicação</li>
        <li>Fluência com pausas ocasionais para buscar expressões</li>
        <li>Compreensão geralmente precisa em temas profissionais</li>
      </ul>

      <CalloutBox variant="info" title="Level 4 é o resultado mais comum">
        A maioria dos pilotos aprovados obtém Level 4. É um resultado válido
        para operar internacionalmente com validade de 3 anos. Muitos pilotos
        optam por fazer a prova novamente buscando Level 5 para maior validade.
      </CalloutBox>

      <h2 id="nivel-5">Nível 5 — avançado</h2>
      <p>
        Level 5 (Extended) demonstra proficiência avançada. A comunicação é
        fluente, precisa e natural, com raríssimas interferências da língua
        materna. As principais vantagens:
      </p>
      <ul>
        <li>
          <strong>Validade de 6 anos</strong> — o dobro do Level 4
        </li>
        <li>
          <strong>Diferencial em processos seletivos</strong> — Algumas
          empresas dão preferência a ICAO 5
        </li>
        <li>
          <strong>Menor frequência de renovação</strong> — menos burocracia
          e custo a longo prazo
        </li>
      </ul>
      <p>
        A diferença entre Level 4 e Level 5 está na consistência. No Level 5,
        os erros quase nunca interferem, o vocabulário é amplo e preciso, e
        a interação é imediata e apropriada.
      </p>

      <h2 id="nivel-6">Nível 6 — expert</h2>
      <p>
        Level 6 (Expert) é o nível máximo e tem validade vitalícia. Porém,
        não é possível obtê-lo diretamente em uma única prova. O processo
        tem duas etapas:
      </p>

      <CalloutBox variant="tip" title="Processo de Level 6 em 2 estágios">
        <strong>Stage 1:</strong> O examinador da prova padrão identifica
        candidatos com potencial para Level 6 (geralmente Level 5+ consistente).
        <br />
        <strong>Stage 2:</strong> Avaliação avançada de 45 minutos com 5 partes,
        realizada dentro de 60 dias. Se não passar, mantém Level 5.
      </CalloutBox>

      <p>
        O Stage 2 é mais rigoroso e inclui cenários complexos, discussão de
        temas abstratos relacionados a aviação e demonstração de domínio
        próximo ao nativo.
      </p>

      <h2 id="companhias-aereas">Qual nível as companhias aéreas exigem</h2>
      <p>
        Embora Level 4 seja o mínimo regulatório, as companhias aéreas
        costumam ter suas próprias exigências:
      </p>
      <ul>
        <li>
          <strong>LATAM, Gol, Azul:</strong> Level 4 mínimo para contratação,
          mas Level 5 é diferencial competitivo
        </li>
        <li>
          <strong>Companhias internacionais:</strong> Frequentemente exigem
          Level 5 ou superior
        </li>
        <li>
          <strong>Aviação executiva:</strong> Level 4 geralmente suficiente,
          mas Level 5 abre mais oportunidades
        </li>
      </ul>
      <p>
        Investir na preparação para Level 5 pode ser uma decisão estratégica
        para sua carreira. Veja{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">
          como se preparar
        </Link>{" "}
        para atingir o nível desejado.
      </p>

      <h2 id="validade">Validade de cada nível</h2>
      <p>
        A validade determina quando você precisa refazer a prova:
      </p>
      <ul>
        <li><strong>Level 4:</strong> 3 anos — renovação mais frequente</li>
        <li><strong>Level 5:</strong> 6 anos — renovação a cada 6 anos</li>
        <li><strong>Level 6:</strong> Vitalício — não precisa renovar</li>
      </ul>
      <p>
        Ao calcular o custo total da certificação, considere que um piloto
        com Level 4 gastará o dobro em taxas de renovação comparado a Level 5
        em um período de 6 anos. Saiba mais sobre{" "}
        <Link href="/quanto-custa-a-prova-icao">custos da prova ICAO</Link>.
      </p>
    </ContentPageLayout>
  );
}
