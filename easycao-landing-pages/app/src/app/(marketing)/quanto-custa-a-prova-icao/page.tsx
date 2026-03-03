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
    title: page.seoTitle,
    description: page.description,
    url: `${SITE_URL}/${PAGE_SLUG}`,
    siteName: "Easycao",
    type: "article",
    locale: "pt_BR",
  },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "precos-2026", text: "Precos da prova ICAO em 2026", level: 2 },
  { id: "custos-ocultos", text: "Custos ocultos que voce precisa considerar", level: 2 },
  { id: "custo-reprovacao", text: "O custo real de uma reprovacao", level: 2 },
  { id: "comparativo", text: "Comparativo: investir em preparacao vs reprovar", level: 2 },
  { id: "formas-pagamento", text: "Formas de pagamento aceitas", level: 2 },
];

const faqs = [
  {
    question: "Quanto custa a prova ICAO em 2026?",
    answer:
      "O valor varia por instituicao, geralmente entre R$ 800 e R$ 1.500. Os precos dependem do centro credenciado e da regiao. Consulte diretamente o centro para valores atualizados.",
  },
  {
    question: "Preciso pagar novamente se reprovar?",
    answer:
      "Sim. Cada tentativa requer o pagamento integral da taxa de avaliacao. Por isso, investir em preparacao antes da prova pode economizar significativamente a longo prazo.",
  },
  {
    question: "Existe taxa da ANAC alem da taxa do centro?",
    answer:
      "Nao. A taxa e cobrada diretamente pelo centro credenciado e ja inclui todos os custos da avaliacao. Nao ha taxa separada da ANAC para a prova em si.",
  },
  {
    question: "Os centros parcelam o pagamento?",
    answer:
      "Alguns centros aceitam cartao de credito com parcelamento. As condicoes variam. E recomendavel entrar em contato diretamente com o centro de sua preferencia para consultar opcoes.",
  },
  {
    question: "O que esta incluso no valor da prova?",
    answer:
      "O valor inclui a avaliacao completa (4 partes), a emissao do resultado e o registro no sistema da ANAC. Materiais de estudo e preparacao nao estao inclusos.",
  },
];

export default function QuantoCustaPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="precos-2026">Precos da prova ICAO em 2026</h2>
      <p>
        O custo da prova ICAO varia conforme o centro credenciado pela ANAC.
        Os precos sao definidos por cada instituicao individualmente. Veja uma
        referencia dos valores praticados em 2026:
      </p>

      <div className="overflow-x-auto my-6">
        <table>
          <thead>
            <tr>
              <th>Centro / Regiao</th>
              <th>Faixa de Preco</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Centros em Sao Paulo / Rio de Janeiro</td>
              <td>R$ 900 — R$ 1.500</td>
            </tr>
            <tr>
              <td>Centros em capitais (outras regioes)</td>
              <td>R$ 800 — R$ 1.200</td>
            </tr>
            <tr>
              <td>Centros em cidades menores</td>
              <td>R$ 800 — R$ 1.000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CalloutBox variant="info" title="Valores sao referenciais">
        Os precos acima sao referenciais e podem variar. Consulte diretamente o{" "}
        <Link href="/onde-fazer-a-prova-icao">centro credenciado</Link> de sua
        preferencia para valores atualizados.
      </CalloutBox>

      <h2 id="custos-ocultos">Custos ocultos que voce precisa considerar</h2>
      <p>
        Alem da taxa da prova em si, existem outros custos que muitos pilotos
        nao consideram:
      </p>
      <ul>
        <li>
          <strong>Deslocamento:</strong> Se nao ha centro credenciado na sua
          cidade, considere custos de viagem, hospedagem e alimentacao
        </li>
        <li>
          <strong>Dia de trabalho perdido:</strong> A prova e presencial e
          exige disponibilidade de pelo menos meio dia
        </li>
        <li>
          <strong>Material de preparacao:</strong> Cursos, livros e simuladores
          (embora existam{" "}
          <Link href="/como-se-preparar-para-a-prova-icao">
            recursos gratuitos
          </Link>
          )
        </li>
        <li>
          <strong>Renovacao periodica:</strong> Level 4 exige renovacao a cada
          3 anos, Level 5 a cada 6 anos
        </li>
      </ul>

      <h2 id="custo-reprovacao">O custo real de uma reprovacao</h2>
      <p>
        Reprovar na prova ICAO tem um impacto financeiro significativo. Vamos
        comparar dois cenarios:
      </p>

      <div className="overflow-x-auto my-6">
        <table>
          <thead>
            <tr>
              <th>Cenario</th>
              <th>Paulo (sem preparacao)</th>
              <th>Joao (com preparacao)</th>
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
              <td>Renovacao (3 anos)</td>
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

      <CalloutBox variant="warning" title="Reprovacao custa caro">
        Cada reprovacao significa R$ 800-1.500 jogados fora, 60 dias de espera
        obrigatoria e potencial atraso na carreira. Investir em preparacao
        adequada e quase sempre mais barato do que reprovar.
      </CalloutBox>

      <h2 id="comparativo">Comparativo: investir em preparacao vs reprovar</h2>
      <p>
        Investir em uma boa preparacao antes da prova e financeiramente mais
        inteligente. Considere:
      </p>
      <ul>
        <li>
          Uma reprovacao custa de R$ 800 a R$ 1.500 (so a taxa), mais custos
          indiretos de deslocamento e tempo
        </li>
        <li>
          Atingir Level 5 em vez de Level 4 economiza uma renovacao inteira
          em 6 anos (R$ 800-1.500)
        </li>
        <li>
          Recursos gratuitos como as{" "}
          <Link href="/lives">lives da Easycao</Link> ja fazem diferenca
          significativa na preparacao
        </li>
      </ul>
      <p>
        Saiba mais sobre o{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">
          metodo de preparacao
        </Link>{" "}
        que ja aprovou mais de 1000 pilotos.
      </p>

      <h2 id="formas-pagamento">Formas de pagamento aceitas</h2>
      <p>
        As formas de pagamento variam por centro credenciado, mas a maioria
        aceita:
      </p>
      <ul>
        <li>PIX (geralmente com desconto)</li>
        <li>Cartao de credito (alguns parcelam)</li>
        <li>Boleto bancario</li>
        <li>Transferencia bancaria</li>
      </ul>
      <p>
        Entre em contato diretamente com o centro de sua escolha para confirmar
        as opcoes disponiveis. Veja a lista completa de{" "}
        <Link href="/onde-fazer-a-prova-icao">
          centros credenciados pela ANAC
        </Link>
        .
      </p>
    </ContentPageLayout>
  );
}
