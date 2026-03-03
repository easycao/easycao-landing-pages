import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";

const PAGE_SLUG = "como-agendar-a-prova-icao";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "passo-a-passo", text: "Passo a passo para agendar", level: 2 },
  { id: "documentos", text: "Documentos necessarios", level: 2 },
  { id: "antecedencia", text: "Com quanta antecedencia agendar", level: 2 },
  { id: "escolher-centro", text: "Como escolher o centro", level: 2 },
  { id: "dia-da-prova", text: "Preparacao para o dia da prova", level: 2 },
];

const faqs = [
  { question: "Posso agendar a prova online?", answer: "Depende do centro. Alguns aceitam agendamento por email ou telefone, outros tem formulario online. Consulte a lista de centros credenciados para detalhes de cada um." },
  { question: "Quanto tempo antes preciso agendar?", answer: "Recomendamos pelo menos 30-45 dias de antecedencia. Centros menores podem ter agenda limitada, e centros em Sao Paulo costumam ter mais demanda." },
  { question: "Posso cancelar ou remarcar a prova?", answer: "Sim, mas as politicas variam por centro. A maioria exige aviso previo de pelo menos 7 dias. Verifique a politica de cancelamento antes de agendar." },
  { question: "Preciso ter CMA valido para agendar?", answer: "Nao. O CMA (Certificado Medico Aeronautico) nao e exigido para a prova ICAO. Voce precisa apenas de documentos de identificacao e licenca/habilitacao valida." },
  { question: "A prova pode ser feita a distancia?", answer: "Nao. A prova ICAO e obrigatoriamente presencial. Nao existe versao online ou a distancia aprovada pela ANAC." },
];

export default function ComoAgendarPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="passo-a-passo">Passo a passo para agendar</h2>
      <p>Agendar a prova ICAO envolve etapas simples, mas que exigem atencao. Veja o processo completo:</p>
      <ol>
        <li><strong>Escolha o centro credenciado:</strong> Consulte a lista de <Link href="/onde-fazer-a-prova-icao">centros credenciados pela ANAC</Link> e escolha o mais conveniente para voce</li>
        <li><strong>Entre em contato:</strong> Ligue ou envie email para o centro escolhido. Informe que deseja agendar a avaliacao de proficiencia linguistica (SDEA/ICAO)</li>
        <li><strong>Confirme disponibilidade:</strong> O centro informara as datas disponiveis. Centros maiores costumam ter mais opcoes</li>
        <li><strong>Envie os documentos:</strong> Alguns centros pedem envio previo de copias de documentos</li>
        <li><strong>Realize o pagamento:</strong> A maioria dos centros exige pagamento antecipado. Valores variam de R$ 800 a R$ 1.500</li>
        <li><strong>Receba a confirmacao:</strong> O centro enviara confirmacao com data, horario e local exato</li>
      </ol>

      <CalloutBox variant="info" title="Dica importante">
        Antes de agendar, certifique-se de que sua <Link href="/como-se-preparar-para-a-prova-icao">preparacao</Link> esta adequada. Agendar antes de estar pronto pode resultar em reprovacao e 60 dias de espera obrigatoria.
      </CalloutBox>

      <h2 id="documentos">Documentos necessarios</h2>
      <p>Tenha em maos os seguintes documentos para o agendamento e para o dia da prova:</p>
      <ul>
        <li><strong>Documento de identidade com foto:</strong> RG ou passaporte (original)</li>
        <li><strong>CHT ou licenca de piloto:</strong> Comprovante de habilitacao tecnica valida</li>
        <li><strong>Codigo ANAC:</strong> Seu numero de registro na ANAC</li>
        <li><strong>Comprovante de pagamento:</strong> Recibo ou comprovante da taxa do centro</li>
      </ul>
      <p>Saiba mais sobre <Link href="/quem-precisa-fazer-prova-icao">quem precisa fazer a prova</Link> e os requisitos por tipo de licenca.</p>

      <h2 id="antecedencia">Com quanta antecedencia agendar</h2>
      <p>A antecedencia ideal depende de alguns fatores:</p>
      <ul>
        <li><strong>30-45 dias antes:</strong> Recomendado para garantir vaga na data desejada</li>
        <li><strong>60+ dias antes:</strong> Ideal se voce quer escolher entre varios centros ou precisa de uma data especifica</li>
        <li><strong>Menos de 15 dias:</strong> Possivel em alguns centros, mas arriscado — vagas podem estar esgotadas</li>
      </ul>
      <p>Centros na regiao Sudeste (especialmente Sao Paulo e Rio de Janeiro) costumam ter mais demanda. Centros em outras regioes podem ter mais flexibilidade.</p>

      <CalloutBox variant="warning" title="Regra dos 60 dias">
        Se voce foi <Link href="/reprovado-na-prova-icao">reprovado anteriormente</Link>, lembre-se de que so pode refazer a prova apos 60 dias corridos da data da ultima avaliacao.
      </CalloutBox>

      <h2 id="escolher-centro">Como escolher o centro</h2>
      <p>Existem cerca de 11 <Link href="/onde-fazer-a-prova-icao">centros credenciados pela ANAC</Link> no Brasil. Considere os seguintes criterios:</p>
      <ul>
        <li><strong>Localizacao:</strong> Proximidade reduz custos de deslocamento e estresse no dia da prova</li>
        <li><strong>Disponibilidade:</strong> Centros com mais datas disponiveis oferecem maior flexibilidade</li>
        <li><strong>Preco:</strong> Valores variam significativamente entre centros. Veja os <Link href="/quanto-custa-a-prova-icao">custos detalhados</Link></li>
        <li><strong>Reputacao:</strong> Converse com colegas pilotos sobre suas experiencias em diferentes centros</li>
      </ul>

      <h2 id="dia-da-prova">Preparacao para o dia da prova</h2>
      <p>No dia da prova, siga estas recomendacoes:</p>
      <ul>
        <li><strong>Chegue com antecedencia:</strong> Pelo menos 30 minutos antes do horario agendado</li>
        <li><strong>Leve todos os documentos:</strong> Originais, nao apenas copias</li>
        <li><strong>Descanse bem na vespera:</strong> Uma boa noite de sono impacta diretamente sua Fluency e Interaction</li>
        <li><strong>Evite revisar conteudo na ultima hora:</strong> Confie na sua preparacao. Revisar de ultima hora gera ansiedade</li>
        <li><strong>Vista-se confortavelmente:</strong> Nao ha codigo de vestimenta, mas conforto ajuda na confianca</li>
      </ul>
      <p>Saiba mais sobre <Link href="/como-funciona-a-prova-icao">como funciona a prova</Link> para chegar sem surpresas no dia.</p>
    </ContentPageLayout>
  );
}
