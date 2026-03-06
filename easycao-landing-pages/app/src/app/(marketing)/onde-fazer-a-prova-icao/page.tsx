import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";

const PAGE_SLUG = "onde-fazer-a-prova-icao";
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
  { id: "centros-credenciados", text: "Centros credenciados pela ANAC", level: 2 },
  { id: "por-regiao", text: "Centros por região do Brasil", level: 2 },
  { id: "sudeste", text: "Sudeste", level: 3 },
  { id: "sul", text: "Sul", level: 3 },
  { id: "nordeste", text: "Nordeste", level: 3 },
  { id: "centro-oeste-norte", text: "Centro-Oeste e Norte", level: 3 },
  { id: "como-agendar", text: "Como agendar sua prova", level: 2 },
  { id: "o-que-levar", text: "O que levar no dia da prova", level: 2 },
  { id: "dicas-escolha", text: "Dicas para escolher o melhor centro", level: 2 },
];

const faqs = [
  {
    question: "Quantos centros credenciados existem no Brasil?",
    answer:
      "Existem cerca de 11 centros credenciados pela ANAC espalhados pelo Brasil, concentrados principalmente na região Sudeste. A lista exata pode ser consultada no site da ANAC.",
  },
  {
    question: "Posso fazer a prova em qualquer centro credenciado?",
    answer:
      "Sim. Você pode escolher qualquer centro credenciado pela ANAC, independente de onde você mora ou onde fez sua formação. A prova é padronizada em todos os centros.",
  },
  {
    question: "Com quanta antecedência devo agendar?",
    answer:
      "Recomenda-se agendar com pelo menos 2 a 4 semanas de antecedência, especialmente em períodos de alta demanda (início do ano e antes de férias). Centros populares em SP e RJ podem ter espera maior.",
  },
  {
    question: "Posso fazer a prova online ou remota?",
    answer:
      "Não. A prova ICAO é obrigatoriamente presencial. Não existe versão online, remota ou digital. Você deve comparecer pessoalmente ao centro credenciado.",
  },
  {
    question: "O que acontece se eu faltar no dia da prova?",
    answer:
      "Falta sem aviso prévio geralmente implica perda do valor pago. A maioria dos centros permite reagendamento com antecedência de 48-72 horas sem custo adicional. Consulte a política do centro escolhido.",
  },
];

export default function OndeFazerPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="centros-credenciados">Centros credenciados pela ANAC</h2>
      <p>
        A prova de proficiência linguística ICAO (SDEA) só pode ser realizada
        em centros oficialmente credenciados pela{" "}
        <a
          href="https://www.gov.br/anac/pt-br/assuntos/regulados/profissionais-da-aviacao-civil/proficiencia-linguistica"
          target="_blank"
          rel="noopener noreferrer"
        >
          ANAC
        </a>
        . Esses centros possuem examinadores treinados e certificados que
        seguem os padrões do Doc 9835 da ICAO.
      </p>
      <p>
        A lista oficial de centros credenciados é atualizada periodicamente
        pela ANAC. Abaixo apresentamos os principais centros organizados por
        região.
      </p>

      <CalloutBox variant="info" title="Lista atualizada da ANAC">
        Os centros listados aqui são referenciais. Para a lista oficial e
        atualizada, consulte o{" "}
        <a
          href="https://www.gov.br/anac/pt-br/assuntos/regulados/profissionais-da-aviacao-civil/proficiencia-linguistica"
          target="_blank"
          rel="noopener noreferrer"
        >
          portal da ANAC
        </a>{" "}
        na seção de Proficiência Linguística.
      </CalloutBox>

      <h2 id="por-regiao">Centros por região do Brasil</h2>

      <h3 id="sudeste">Sudeste</h3>
      <p>
        A região Sudeste concentra a maior quantidade de centros credenciados,
        com opções em São Paulo, Rio de Janeiro e Minas Gerais:
      </p>
      <ul>
        <li><strong>São Paulo (SP):</strong> Maior concentração de centros. Cidades como São Paulo capital, Campinas e São José dos Campos possuem opções</li>
        <li><strong>Rio de Janeiro (RJ):</strong> Centros na capital e região metropolitana</li>
        <li><strong>Minas Gerais (MG):</strong> Centros em Belo Horizonte e região</li>
      </ul>

      <h3 id="sul">Sul</h3>
      <p>
        A região Sul possui centros credenciados nos principais estados:
      </p>
      <ul>
        <li><strong>Paraná (PR):</strong> Centros em Curitiba</li>
        <li><strong>Rio Grande do Sul (RS):</strong> Centros em Porto Alegre</li>
        <li><strong>Santa Catarina (SC):</strong> Opções em Florianópolis e região</li>
      </ul>

      <h3 id="nordeste">Nordeste</h3>
      <p>
        O Nordeste tem opções mais limitadas, geralmente concentradas nas
        capitais:
      </p>
      <ul>
        <li><strong>Bahia (BA):</strong> Centros em Salvador</li>
        <li><strong>Pernambuco (PE):</strong> Opções em Recife</li>
        <li><strong>Ceará (CE):</strong> Centros em Fortaleza</li>
      </ul>

      <h3 id="centro-oeste-norte">Centro-Oeste e Norte</h3>
      <p>
        Estas regiões possuem menos opções, mas há centros disponíveis:
      </p>
      <ul>
        <li><strong>Goiás (GO) / DF:</strong> Centros em Goiânia e Brasília</li>
        <li><strong>Amazonas (AM):</strong> Opções em Manaus</li>
      </ul>
      <p>
        Se não há centro credenciado perto de você, considere planejar uma
        viagem para um centro em capitais próximas. Inclua{" "}
        <Link href="/quanto-custa-a-prova-icao">
          custos de deslocamento
        </Link>{" "}
        no seu planejamento.
      </p>

      <h2 id="como-agendar">Como agendar sua prova</h2>
      <p>
        O processo de agendamento é simples e pode ser feito diretamente com
        o centro credenciado de sua preferência:
      </p>
      <ol>
        <li>
          <strong>Escolha o centro:</strong> Selecione o centro mais
          conveniente (proximidade, disponibilidade, preço)
        </li>
        <li>
          <strong>Entre em contato:</strong> Ligue ou envie e-mail para o
          centro para verificar disponibilidade de datas
        </li>
        <li>
          <strong>Confirme o agendamento:</strong> Faça o pagamento e
          confirme sua data e horário
        </li>
        <li>
          <strong>Receba a confirmação:</strong> O centro enviará os
          detalhes (endereço, horário, documentos necessários)
        </li>
      </ol>

      <CalloutBox variant="tip" title="Agende com antecedência">
        Agende sua prova com pelo menos 2-4 semanas de antecedência.
        Em períodos de alta demanda, centros populares podem ter fila
        de espera. Planeje-se.
      </CalloutBox>

      <h2 id="o-que-levar">O que levar no dia da prova</h2>
      <ul>
        <li>Documento de identidade com foto (RG ou CNH)</li>
        <li>CHT (Certificado de Habilitação Técnica) ou CMA válido</li>
        <li>Comprovante de agendamento/pagamento</li>
        <li>Chegue com pelo menos 15-30 minutos de antecedência</li>
      </ul>

      <h2 id="dicas-escolha">Dicas para escolher o melhor centro</h2>
      <ul>
        <li>
          <strong>Proximidade:</strong> Centros próximos reduzem custos e
          estresse no dia da prova
        </li>
        <li>
          <strong>Reputação:</strong> Converse com outros pilotos sobre
          suas experiências
        </li>
        <li>
          <strong>Disponibilidade:</strong> Centros menores podem oferecer
          datas mais próximas
        </li>
        <li>
          <strong>Preço:</strong> Compare valores, mas não escolha apenas
          pelo preço — conforto e qualidade do ambiente importam
        </li>
      </ul>
      <p>
        Antes de agendar, certifique-se de que está{" "}
        <Link href="/como-se-preparar-para-a-prova-icao">
          realmente preparado
        </Link>
        . Lembre-se: reprovar custa caro em dinheiro e tempo.
      </p>
    </ContentPageLayout>
  );
}
