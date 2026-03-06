import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";

const PAGE_SLUG = "validade-e-renovacao-prova-icao";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "validade-por-nivel", text: "Validade por nível", level: 2 },
  { id: "quando-renovar", text: "Quando renovar", level: 2 },
  { id: "processo-renovacao", text: "Processo de renovação", level: 2 },
  { id: "se-expirar", text: "O que acontece se expirar", level: 2 },
  { id: "estrategia", text: "Estratégia de renovação", level: 2 },
];

const faqs = [
  { question: "Quanto tempo vale a proficiência ICAO Level 4?", answer: "Level 4 tem validade de 3 anos a partir da data da prova. Após esse período, você precisa refazer a avaliação." },
  { question: "Quanto tempo vale o Level 5?", answer: "Level 5 tem validade de 6 anos. É o dobro do Level 4, o que representa economia significativa em taxas de renovação." },
  { question: "Level 6 realmente não precisa renovar?", answer: "Correto. Level 6 (Expert) tem validade vitalícia segundo as normas da ICAO. É o único nível com validade permanente." },
  { question: "Posso subir de nível na renovação?", answer: "Sim. A renovação é uma nova avaliação completa. Você pode buscar um nível superior ao que tem atualmente." },
  { question: "O que acontece se minha proficiência vencer?", answer: "Você perde a habilitação para voos internacionais até refazer e ser aprovado na prova." },
];

export default function ValidadeRenovacaoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="validade-por-nivel">Validade por nível</h2>
      <p>Cada nível ICAO tem uma validade diferente, definida pelas normas internacionais:</p>
      <div className="overflow-x-auto my-6">
        <table>
          <thead><tr><th>Nível</th><th>Validade</th><th>Renovação</th></tr></thead>
          <tbody>
            <tr><td>Level 4 (Operational)</td><td>3 anos</td><td>Refazer prova completa</td></tr>
            <tr><td>Level 5 (Extended)</td><td>6 anos</td><td>Refazer prova completa</td></tr>
            <tr><td>Level 6 (Expert)</td><td>Vitalício</td><td>Não necessário</td></tr>
          </tbody>
        </table>
      </div>
      <p>A validade começa a contar a partir da data da prova. Saiba mais sobre o que cada <Link href="/niveis-icao">nível ICAO significa</Link>.</p>

      <h2 id="quando-renovar">Quando renovar</h2>
      <p>O planejamento da renovação deve começar com antecedência para evitar ficar sem a habilitação:</p>
      <ul>
        <li><strong>Level 4:</strong> Comece a se preparar pelo menos 6 meses antes do vencimento</li>
        <li><strong>Level 5:</strong> Inicie a preparação 3-4 meses antes</li>
        <li><strong>Agende com antecedência:</strong> Centros credenciados podem ter fila de espera</li>
      </ul>
      <CalloutBox variant="warning" title="Não deixe para a última hora">
        Se sua proficiência vencer antes de você refazer a prova, você perde a habilitação para voos internacionais. Planeje-se com antecedência.
      </CalloutBox>

      <h2 id="processo-renovacao">Processo de renovação</h2>
      <p>A renovação é exatamente igual a primeira avaliação. Não há atalhos:</p>
      <ul>
        <li>Agendar em um <Link href="/onde-fazer-a-prova-icao">centro credenciado</Link></li>
        <li>Pagar a taxa completa (mesma da primeira vez)</li>
        <li>Fazer a prova completa (4 partes)</li>
        <li>Ser avaliado nos 6 descritores</li>
      </ul>
      <p>A boa notícia é que você pode buscar um nível mais alto na renovação. Muitos pilotos aproveitam para subir de Level 4 para 5.</p>

      <h2 id="se-expirar">O que acontece se expirar</h2>
      <p>Se sua proficiência vencer:</p>
      <ul>
        <li>Você <strong>não pode mais realizar voos internacionais</strong></li>
        <li>Precisa refazer a prova e ser aprovado antes de retomar operações internacionais</li>
        <li>Voos domésticos não são afetados (proficiência não é obrigatória para operações nacionais)</li>
      </ul>

      <h2 id="estrategia">Estratégia de renovação</h2>
      <p>Aproveite a renovação para buscar um nível superior. Subir de Level 4 para 5 <Link href="/quanto-custa-a-prova-icao">economiza significativamente</Link> a longo prazo, pois a validade dobra de 3 para 6 anos.</p>
      <p>A melhor estratégia é <Link href="/como-se-preparar-para-a-prova-icao">se preparar adequadamente</Link> para cada renovação, focando nos descritores que foram mais fracos na avaliação anterior.</p>
    </ContentPageLayout>
  );
}
