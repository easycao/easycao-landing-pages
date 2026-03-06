import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";

const PAGE_SLUG = "quanto-custa-a-prova-icao";
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
  { id: "precos-2026", text: "Preços da prova ICAO em 2026", level: 2 },
  { id: "custos-ocultos", text: "Custos ocultos que você precisa considerar", level: 2 },
  { id: "custo-reprovacao", text: "O custo real de uma reprovação", level: 2 },
  { id: "comparativo", text: "Comparativo: investir em preparação vs reprovar", level: 2 },
  { id: "formas-pagamento", text: "Formas de pagamento aceitas", level: 2 },
];

const faqs = [
  {
    question: "Quanto custa a prova ICAO em 2026?",
    answer:
      "O valor varia por instituição, geralmente entre R$ 800 e R$ 1.500. Os preços dependem do centro credenciado e da região. Consulte diretamente o centro para valores atualizados.",
  },
  {
    question: "Preciso pagar novamente se reprovar?",
    answer:
      "Sim. Cada tentativa requer o pagamento integral da taxa de avaliação. Por isso, investir em preparação antes da prova pode economizar significativamente a longo prazo.",
  },
  {
    question: "Existe taxa da ANAC além da taxa do centro?",
    answer:
      "Não. A taxa é cobrada diretamente pelo centro credenciado e já inclui todos os custos da avaliação. Não há taxa separada da ANAC para a prova em si.",
  },
  {
    question: "Os centros parcelam o pagamento?",
    answer:
      "Alguns centros aceitam cartão de crédito com parcelamento. As condições variam. É recomendável entrar em contato diretamente com o centro de sua preferência para consultar opções.",
  },
  {
    question: "O que está incluso no valor da prova?",
    answer:
      "O valor inclui a avaliação completa (4 partes), a emissão do resultado e o registro no sistema da ANAC. Materiais de estudo e preparação não estão inclusos.",
  },
];

export default function QuantoCustaPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="precos-2026">Preços da prova ICAO em 2026</h2>
      <p>
        O custo da prova ICAO varia conforme o centro credenciado pela ANAC.
        Os preços são definidos por cada instituição individualmente. Veja uma
        referência dos valores praticados em 2026:
      </p>

      <div className="overflow-x-auto my-6">
        <table>
          <thead>
            <tr>
              <th>Centro / Região</th>
              <th>Faixa de Preço</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Centros em São Paulo / Rio de Janeiro</td>
              <td>R$ 900 — R$ 1.500</td>
            </tr>
            <tr>
              <td>Centros em capitais (outras regiões)</td>
              <td>R$ 800 — R$ 1.200</td>
            </tr>
            <tr>
              <td>Centros em cidades menores</td>
              <td>R$ 800 — R$ 1.000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CalloutBox variant="info" title="Valores são referenciais">
        Os preços acima são referenciais e podem variar. Consulte diretamente o{" "}
        <Link href="/onde-fazer-a-prova-icao">centro credenciado</Link> de sua
        preferência para valores atualizados.
      </CalloutBox>

      <h2 id="custos-ocultos">Custos ocultos que você precisa considerar</h2>
      <p>
        Além da taxa da prova em si, existem outros custos que muitos pilotos
        não consideram:
      </p>
      <ul>
        <li>
          <strong>Deslocamento:</strong> Se não há centro credenciado na sua
          cidade, considere custos de viagem, hospedagem e alimentação
        </li>
        <li>
          <strong>Dia de trabalho perdido:</strong> A prova é presencial e
          exige disponibilidade de pelo menos meio dia
        </li>
        <li>
          <strong>Material de preparação:</strong> Cursos, livros e simuladores
          (embora existam{" "}
          <Link href="/como-se-preparar-para-a-prova-icao">
            recursos gratuitos
          </Link>
          )
        </li>
        <li>
          <strong>Renovação periódica:</strong> Level 4 exige renovação a cada
          3 anos, Level 5 a cada 6 anos
        </li>
      </ul>

      <h2 id="custo-reprovacao">O custo real de uma reprovação</h2>
      <p>
        Reprovar na prova ICAO tem um impacto financeiro significativo. Vamos
        comparar dois cenários:
      </p>

      <div className="overflow-x-auto my-6">
        <table>
          <thead>
            <tr>
              <th>Cenário</th>
              <th>Paulo (sem preparação)</th>
              <th>João (com preparação)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1a tentativa</td>
              <td>R$ 1.200 (reprovou)</td>
              <td>R$ 1.200 (aprovado Level 5)</td>
            </tr>
            <tr>
              <td>Espera 60 dias</td>
              <td>2 meses sem voar internacionalmente</td>
              <td>—</td>
            </tr>
            <tr>
              <td>2a tentativa</td>
              <td>R$ 1.200 (aprovado Level 4)</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Renovação (3 anos)</td>
              <td>R$ 1.200 (Level 4 = 3 anos)</td>
              <td>— (Level 5 = 6 anos)</td>
            </tr>
            <tr className="font-bold">
              <td>Total em 6 anos</td>
              <td>R$ 3.600 + atrasos na carreira</td>
              <td>R$ 1.200</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CalloutBox variant="warning" title="Reprovação custa caro">
        Cada reprovação significa R$ 800-1.500 jogados fora, 60 dias de espera
        obrigatória e potencial atraso na carreira. Investir em preparação
        adequada é quase sempre mais barato do que reprovar.
      </CalloutBox>

      <h2 id="comparativo">Comparativo: investir em preparação vs reprovar</h2>
      <p>
        Investir em uma boa preparação antes da prova é financeiramente mais
        inteligente. Considere:
      </p>
      <ul>
        <li>
          Uma reprovação custa de R$ 800 a R$ 1.500 (só a taxa), mais custos
          indiretos de deslocamento e tempo
        </li>
        <li>
          Atingir Level 5 em vez de Level 4 economiza uma renovação inteira
          em 6 anos (R$ 800-1.500)
        </li>
        <li>
          Recursos gratuitos como as{" "}
          <Link href="/lives">lives da Easycao</Link> já fazem diferença
          significativa na preparação
        </li>
      </ul>
      <p>
        Saiba mais sobre o{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">
          método de preparação
        </Link>{" "}
        que já aprovou mais de 1000 pilotos.
      </p>

      <h2 id="formas-pagamento">Formas de pagamento aceitas</h2>
      <p>
        As formas de pagamento variam por centro credenciado, mas a maioria
        aceita:
      </p>
      <ul>
        <li>PIX (geralmente com desconto)</li>
        <li>Cartão de crédito (alguns parcelam)</li>
        <li>Boleto bancário</li>
        <li>Transferência bancária</li>
      </ul>
      <p>
        Entre em contato diretamente com o centro de sua escolha para confirmar
        as opções disponíveis. Veja a lista completa de{" "}
        <Link href="/onde-fazer-a-prova-icao">
          centros credenciados pela ANAC
        </Link>
        .
      </p>
    </ContentPageLayout>
  );
}
