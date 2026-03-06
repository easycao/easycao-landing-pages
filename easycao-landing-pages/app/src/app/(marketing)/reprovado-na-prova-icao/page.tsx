import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";
import AppBanner from "../../../components/AppBanner";

const PAGE_SLUG = "reprovado-na-prova-icao";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "o-que-acontece", text: "O que acontece quando você reprova", level: 2 },
  { id: "regra-60-dias", text: "A regra dos 60 dias", level: 2 },
  { id: "entendendo-resultado", text: "Entendendo seu resultado", level: 2 },
  { id: "plano-recuperacao", text: "Plano de recuperação", level: 2 },
  { id: "custo-reprovar", text: "Quanto custa reprovar", level: 2 },
  { id: "evitar-reprovar", text: "Como evitar reprovar de novo", level: 2 },
];

const faqs = [
  { question: "Quanto tempo preciso esperar para refazer a prova?", answer: "60 dias corridos a partir da data da prova. Essa espera é obrigatória e definida pela ANAC." },
  { question: "Posso escolher outro centro para refazer?", answer: "Sim. Você pode refazer em qualquer centro credenciado pela ANAC, não precisa ser o mesmo." },
  { question: "Meu resultado anterior fica registrado?", answer: "Sim, no sistema da ANAC. Porém, cada avaliação é independente — o resultado anterior não influencia o próximo." },
  { question: "Quantas vezes posso refazer a prova?", answer: "Não há limite de tentativas, mas você deve respeitar o intervalo de 60 dias entre cada uma." },
  { question: "Reprovação afeta minha licença de piloto?", answer: "Não diretamente. Sua licença permanece válida, mas você não pode operar voos internacionais sem a proficiência ICAO." },
];

export default function ReprovadoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="o-que-acontece">O que acontece quando você reprova</h2>
      <p>Se você obteve Level 3 ou inferior na prova ICAO, você é considerado reprovado. Isso significa que você não atingiu o nível mínimo operacional (Level 4) exigido para voos internacionais.</p>
      <p>Mas calma: reprovar não é o fim do mundo. Muitos pilotos excelentes reprovaram na primeira tentativa e depois passaram com níveis altos. O importante é entender o que deu errado e se preparar melhor.</p>

      <CalloutBox variant="warning" title="Espera obrigatória de 60 dias">
        Você só pode refazer a prova ICAO após 60 dias corridos da data da avaliação anterior. Essa regra é da ANAC e não tem exceções.
      </CalloutBox>

      <h2 id="regra-60-dias">A regra dos 60 dias</h2>
      <p>A ANAC determina um intervalo mínimo de 60 dias corridos entre tentativas. Esse prazo é contado a partir da data da prova, não da divulgação do resultado.</p>
      <p>Use esse tempo a seu favor: 60 dias é tempo suficiente para uma preparação focada e eficiente se você souber exatamente no que trabalhar.</p>

      <h2 id="entendendo-resultado">Entendendo seu resultado</h2>
      <p>Ao receber seu resultado, preste atenção em cada <Link href="/descritores-da-prova-icao">descritor individualmente</Link>. Identifique quais foram os mais baixos — são esses que você precisa priorizar na preparação.</p>
      <p>Lembre-se: sua nota final é o menor descritor. Se você tirou 4 em cinco e 3 em um, seu resultado foi Level 3 — reprovado. O foco deve ser subir aquele descritor mais fraco.</p>

      <h2 id="plano-recuperacao">Plano de recuperação</h2>
      <p>Siga este plano nos 60 dias de espera:</p>
      <ol>
        <li><strong>Semana 1-2:</strong> Identifique seus descritores mais fracos e estude a teoria de cada um</li>
        <li><strong>Semana 3-4:</strong> Comece a praticar fala diariamente, focando nos descritores fracos</li>
        <li><strong>Semana 5-6:</strong> Faça simulados completos e peça feedback</li>
        <li><strong>Semana 7-8:</strong> Simulados finais e ajustes. Agende a prova para a semana seguinte</li>
      </ol>

      <AppBanner variant="inline" />

      <h2 id="custo-reprovar">Quanto custa reprovar</h2>
      <p>Além do impacto emocional, reprovar tem custo financeiro significativo:</p>
      <ul>
        <li>Nova taxa da prova: R$ 800-1.500</li>
        <li>Custos de deslocamento (se aplicável)</li>
        <li>60 dias sem poder voar internacionalmente</li>
        <li>Possível atraso em processos seletivos</li>
      </ul>
      <p>Saiba mais sobre os <Link href="/quanto-custa-a-prova-icao">custos completos da prova ICAO</Link>.</p>

      <h2 id="evitar-reprovar">Como evitar reprovar de novo</h2>
      <p>A melhor forma de evitar uma nova reprovação é investir em <Link href="/como-se-preparar-para-a-prova-icao">preparação adequada</Link>. Evite os 3 erros mais comuns: decorar respostas, estudar inglês geral e não praticar fala.</p>
      <p>Considere buscar orientação de um especialista. O método Easycao foi criado por um examinador credenciado que sabe exatamente o que é avaliado e como melhorar cada descritor.</p>
    </ContentPageLayout>
  );
}
