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
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "validade-por-nivel", text: "Validade por nivel", level: 2 },
  { id: "quando-renovar", text: "Quando renovar", level: 2 },
  { id: "processo-renovacao", text: "Processo de renovacao", level: 2 },
  { id: "se-expirar", text: "O que acontece se expirar", level: 2 },
  { id: "estrategia", text: "Estrategia de renovacao", level: 2 },
];

const faqs = [
  { question: "Quanto tempo vale a proficiencia ICAO Level 4?", answer: "Level 4 tem validade de 3 anos a partir da data da prova. Apos esse periodo, voce precisa refazer a avaliacao." },
  { question: "Quanto tempo vale o Level 5?", answer: "Level 5 tem validade de 6 anos. E o dobro do Level 4, o que representa economia significativa em taxas de renovacao." },
  { question: "Level 6 realmente nao precisa renovar?", answer: "Correto. Level 6 (Expert) tem validade vitalicia segundo as normas da ICAO. E o unico nivel com validade permanente." },
  { question: "Posso subir de nivel na renovacao?", answer: "Sim. A renovacao e uma nova avaliacao completa. Voce pode buscar um nivel superior ao que tem atualmente." },
  { question: "O que acontece se minha proficiencia vencer?", answer: "Voce perde a habilitacao para voos internacionais ate refazer e ser aprovado na prova." },
];

export default function ValidadeRenovacaoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="validade-por-nivel">Validade por nivel</h2>
      <p>Cada nivel ICAO tem uma validade diferente, definida pelas normas internacionais:</p>
      <div className="overflow-x-auto my-6">
        <table>
          <thead><tr><th>Nivel</th><th>Validade</th><th>Renovacao</th></tr></thead>
          <tbody>
            <tr><td>Level 4 (Operational)</td><td>3 anos</td><td>Refazer prova completa</td></tr>
            <tr><td>Level 5 (Extended)</td><td>6 anos</td><td>Refazer prova completa</td></tr>
            <tr><td>Level 6 (Expert)</td><td>Vitalicio</td><td>Nao necessario</td></tr>
          </tbody>
        </table>
      </div>
      <p>A validade comeca a contar a partir da data da prova. Saiba mais sobre o que cada <Link href="/niveis-icao">nivel ICAO significa</Link>.</p>

      <h2 id="quando-renovar">Quando renovar</h2>
      <p>O planejamento da renovacao deve comecar com antecedencia para evitar ficar sem a habilitacao:</p>
      <ul>
        <li><strong>Level 4:</strong> Comece a se preparar pelo menos 6 meses antes do vencimento</li>
        <li><strong>Level 5:</strong> Inicie a preparacao 3-4 meses antes</li>
        <li><strong>Agende com antecedencia:</strong> Centros credenciados podem ter fila de espera</li>
      </ul>
      <CalloutBox variant="warning" title="Nao deixe para a ultima hora">
        Se sua proficiencia vencer antes de voce refazer a prova, voce perde a habilitacao para voos internacionais. Planeje-se com antecedencia.
      </CalloutBox>

      <h2 id="processo-renovacao">Processo de renovacao</h2>
      <p>A renovacao e exatamente igual a primeira avaliacao. Nao ha atalhos:</p>
      <ul>
        <li>Agendar em um <Link href="/onde-fazer-a-prova-icao">centro credenciado</Link></li>
        <li>Pagar a taxa completa (mesma da primeira vez)</li>
        <li>Fazer a prova completa (4 partes)</li>
        <li>Ser avaliado nos 6 descritores</li>
      </ul>
      <p>A boa noticia e que voce pode buscar um nivel mais alto na renovacao. Muitos pilotos aproveitam para subir de Level 4 para 5.</p>

      <h2 id="se-expirar">O que acontece se expirar</h2>
      <p>Se sua proficiencia vencer:</p>
      <ul>
        <li>Voce <strong>nao pode mais realizar voos internacionais</strong></li>
        <li>Precisa refazer a prova e ser aprovado antes de retomar operacoes internacionais</li>
        <li>Voos domesticos nao sao afetados (proficiencia nao e obrigatoria para operacoes nacionais)</li>
      </ul>

      <h2 id="estrategia">Estrategia de renovacao</h2>
      <p>Aproveite a renovacao para buscar um nivel superior. Subir de Level 4 para 5 <Link href="/quanto-custa-a-prova-icao">economiza significativamente</Link> a longo prazo, pois a validade dobra de 3 para 6 anos.</p>
      <p>A melhor estrategia e <Link href="/como-se-preparar-para-a-prova-icao">se preparar adequadamente</Link> para cada renovacao, focando nos descritores que foram mais fracos na avaliacao anterior.</p>
    </ContentPageLayout>
  );
}
