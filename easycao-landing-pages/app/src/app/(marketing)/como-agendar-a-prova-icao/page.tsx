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
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "passo-a-passo", text: "Passo a passo para agendar", level: 2 },
  { id: "documentos", text: "Documentos necessários", level: 2 },
  { id: "antecedencia", text: "Com quanta antecedência agendar", level: 2 },
  { id: "escolher-centro", text: "Como escolher o centro", level: 2 },
  { id: "dia-da-prova", text: "Preparação para o dia da prova", level: 2 },
];

const faqs = [
  { question: "Posso agendar a prova online?", answer: "Depende do centro. Alguns aceitam agendamento por email ou telefone, outros têm formulário online. Consulte a lista de centros credenciados para detalhes de cada um." },
  { question: "Quanto tempo antes preciso agendar?", answer: "Recomendamos pelo menos 30-45 dias de antecedência. Centros menores podem ter agenda limitada, e centros em São Paulo costumam ter mais demanda." },
  { question: "Posso cancelar ou remarcar a prova?", answer: "Sim, mas as políticas variam por centro. A maioria exige aviso prévio de pelo menos 7 dias. Verifique a política de cancelamento antes de agendar." },
  { question: "Preciso ter CMA válido para agendar?", answer: "Não. O CMA (Certificado Médico Aeronáutico) não é exigido para a prova ICAO. Você precisa apenas de documentos de identificação e licença/habilitação válida." },
  { question: "A prova pode ser feita a distância?", answer: "Não. A prova ICAO é obrigatoriamente presencial. Não existe versão online ou a distância aprovada pela ANAC." },
];

export default function ComoAgendarPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="passo-a-passo">Passo a passo para agendar</h2>
      <p>Agendar a prova ICAO envolve etapas simples, mas que exigem atenção. Veja o processo completo:</p>
      <ol>
        <li><strong>Escolha o centro credenciado:</strong> Consulte a lista de <Link href="/onde-fazer-a-prova-icao">centros credenciados pela ANAC</Link> e escolha o mais conveniente para você</li>
        <li><strong>Entre em contato:</strong> Ligue ou envie email para o centro escolhido. Informe que deseja agendar a avaliação de proficiência linguística (SDEA/ICAO)</li>
        <li><strong>Confirme disponibilidade:</strong> O centro informará as datas disponíveis. Centros maiores costumam ter mais opções</li>
        <li><strong>Envie os documentos:</strong> Alguns centros pedem envio prévio de cópias de documentos</li>
        <li><strong>Realize o pagamento:</strong> A maioria dos centros exige pagamento antecipado. Valores variam de R$ 800 a R$ 1.500</li>
        <li><strong>Receba a confirmação:</strong> O centro enviará confirmação com data, horário e local exato</li>
      </ol>

      <CalloutBox variant="info" title="Dica importante">
        Antes de agendar, certifique-se de que sua <Link href="/como-se-preparar-para-a-prova-icao">preparação</Link> está adequada. Agendar antes de estar pronto pode resultar em reprovação e 60 dias de espera obrigatória.
      </CalloutBox>

      <h2 id="documentos">Documentos necessários</h2>
      <p>Tenha em mãos os seguintes documentos para o agendamento e para o dia da prova:</p>
      <ul>
        <li><strong>Documento de identidade com foto:</strong> RG ou passaporte (original)</li>
        <li><strong>CHT ou licença de piloto:</strong> Comprovante de habilitação técnica válida</li>
        <li><strong>Código ANAC:</strong> Seu número de registro na ANAC</li>
        <li><strong>Comprovante de pagamento:</strong> Recibo ou comprovante da taxa do centro</li>
      </ul>
      <p>Saiba mais sobre <Link href="/quem-precisa-fazer-prova-icao">quem precisa fazer a prova</Link> e os requisitos por tipo de licença.</p>

      <h2 id="antecedencia">Com quanta antecedência agendar</h2>
      <p>A antecedência ideal depende de alguns fatores:</p>
      <ul>
        <li><strong>30-45 dias antes:</strong> Recomendado para garantir vaga na data desejada</li>
        <li><strong>60+ dias antes:</strong> Ideal se você quer escolher entre vários centros ou precisa de uma data específica</li>
        <li><strong>Menos de 15 dias:</strong> Possível em alguns centros, mas arriscado — vagas podem estar esgotadas</li>
      </ul>
      <p>Centros na região Sudeste (especialmente São Paulo e Rio de Janeiro) costumam ter mais demanda. Centros em outras regiões podem ter mais flexibilidade.</p>

      <CalloutBox variant="warning" title="Regra dos 60 dias">
        Se você foi <Link href="/reprovado-na-prova-icao">reprovado anteriormente</Link>, lembre-se de que só pode refazer a prova após 60 dias corridos da data da última avaliação.
      </CalloutBox>

      <h2 id="escolher-centro">Como escolher o centro</h2>
      <p>Existem cerca de 11 <Link href="/onde-fazer-a-prova-icao">centros credenciados pela ANAC</Link> no Brasil. Considere os seguintes critérios:</p>
      <ul>
        <li><strong>Localização:</strong> Proximidade reduz custos de deslocamento e estresse no dia da prova</li>
        <li><strong>Disponibilidade:</strong> Centros com mais datas disponíveis oferecem maior flexibilidade</li>
        <li><strong>Preço:</strong> Valores variam significativamente entre centros. Veja os <Link href="/quanto-custa-a-prova-icao">custos detalhados</Link></li>
        <li><strong>Reputação:</strong> Converse com colegas pilotos sobre suas experiências em diferentes centros</li>
      </ul>

      <h2 id="dia-da-prova">Preparação para o dia da prova</h2>
      <p>No dia da prova, siga estas recomendações:</p>
      <ul>
        <li><strong>Chegue com antecedência:</strong> Pelo menos 30 minutos antes do horário agendado</li>
        <li><strong>Leve todos os documentos:</strong> Originais, não apenas cópias</li>
        <li><strong>Descanse bem na véspera:</strong> Uma boa noite de sono impacta diretamente sua Fluency e Interaction</li>
        <li><strong>Evite revisar conteúdo na última hora:</strong> Confie na sua preparação. Revisar de última hora gera ansiedade</li>
        <li><strong>Vista-se confortavelmente:</strong> Não há código de vestimenta, mas conforto ajuda na confiança</li>
      </ul>
      <p>Saiba mais sobre <Link href="/como-funciona-a-prova-icao">como funciona a prova</Link> para chegar sem surpresas no dia.</p>
    </ContentPageLayout>
  );
}
