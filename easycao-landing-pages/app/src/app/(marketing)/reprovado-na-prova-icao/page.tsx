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
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "o-que-acontece", text: "O que acontece quando voce reprova", level: 2 },
  { id: "regra-60-dias", text: "A regra dos 60 dias", level: 2 },
  { id: "entendendo-resultado", text: "Entendendo seu resultado", level: 2 },
  { id: "plano-recuperacao", text: "Plano de recuperacao", level: 2 },
  { id: "custo-reprovar", text: "Quanto custa reprovar", level: 2 },
  { id: "evitar-reprovar", text: "Como evitar reprovar de novo", level: 2 },
];

const faqs = [
  { question: "Quanto tempo preciso esperar para refazer a prova?", answer: "60 dias corridos a partir da data da prova. Essa espera e obrigatoria e definida pela ANAC." },
  { question: "Posso escolher outro centro para refazer?", answer: "Sim. Voce pode refazer em qualquer centro credenciado pela ANAC, nao precisa ser o mesmo." },
  { question: "Meu resultado anterior fica registrado?", answer: "Sim, no sistema da ANAC. Porem, cada avaliacao e independente — o resultado anterior nao influencia o proximo." },
  { question: "Quantas vezes posso refazer a prova?", answer: "Nao ha limite de tentativas, mas voce deve respeitar o intervalo de 60 dias entre cada uma." },
  { question: "Reprovacao afeta minha licenca de piloto?", answer: "Nao diretamente. Sua licenca permanece valida, mas voce nao pode operar voos internacionais sem a proficiencia ICAO." },
];

export default function ReprovadoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="o-que-acontece">O que acontece quando voce reprova</h2>
      <p>Se voce obteve Level 3 ou inferior na prova ICAO, voce e considerado reprovado. Isso significa que voce nao atingiu o nivel minimo operacional (Level 4) exigido para voos internacionais.</p>
      <p>Mas calma: reprovar nao e o fim do mundo. Muitos pilotos excelentes reprovaram na primeira tentativa e depois passaram com niveis altos. O importante e entender o que deu errado e se preparar melhor.</p>

      <CalloutBox variant="warning" title="Espera obrigatoria de 60 dias">
        Voce so pode refazer a prova ICAO apos 60 dias corridos da data da avaliacao anterior. Essa regra e da ANAC e nao tem excecoes.
      </CalloutBox>

      <h2 id="regra-60-dias">A regra dos 60 dias</h2>
      <p>A ANAC determina um intervalo minimo de 60 dias corridos entre tentativas. Esse prazo e contado a partir da data da prova, nao da divulgacao do resultado.</p>
      <p>Use esse tempo a seu favor: 60 dias e tempo suficiente para uma preparacao focada e eficiente se voce souber exatamente no que trabalhar.</p>

      <h2 id="entendendo-resultado">Entendendo seu resultado</h2>
      <p>Ao receber seu resultado, preste atencao em cada <Link href="/descritores-da-prova-icao">descritor individualmente</Link>. Identifique quais foram os mais baixos — sao esses que voce precisa priorizar na preparacao.</p>
      <p>Lembre-se: sua nota final e o menor descritor. Se voce tirou 4 em cinco e 3 em um, seu resultado foi Level 3 — reprovado. O foco deve ser subir aquele descritor mais fraco.</p>

      <h2 id="plano-recuperacao">Plano de recuperacao</h2>
      <p>Siga este plano nos 60 dias de espera:</p>
      <ol>
        <li><strong>Semana 1-2:</strong> Identifique seus descritores mais fracos e estude a teoria de cada um</li>
        <li><strong>Semana 3-4:</strong> Comece a praticar fala diariamente, focando nos descritores fracos</li>
        <li><strong>Semana 5-6:</strong> Faca simulados completos e peca feedback</li>
        <li><strong>Semana 7-8:</strong> Simulados finais e ajustes. Agende a prova para a semana seguinte</li>
      </ol>

      <AppBanner variant="inline" />

      <h2 id="custo-reprovar">Quanto custa reprovar</h2>
      <p>Alem do impacto emocional, reprovar tem custo financeiro significativo:</p>
      <ul>
        <li>Nova taxa da prova: R$ 800-1.500</li>
        <li>Custos de deslocamento (se aplicavel)</li>
        <li>60 dias sem poder voar internacionalmente</li>
        <li>Possivel atraso em processos seletivos</li>
      </ul>
      <p>Saiba mais sobre os <Link href="/quanto-custa-a-prova-icao">custos completos da prova ICAO</Link>.</p>

      <h2 id="evitar-reprovar">Como evitar reprovar de novo</h2>
      <p>A melhor forma de evitar uma nova reprovacao e investir em <Link href="/como-se-preparar-para-a-prova-icao">preparacao adequada</Link>. Evite os 3 erros mais comuns: decorar respostas, estudar ingles geral e nao praticar fala.</p>
      <p>Considere buscar orientacao de um especialista. O metodo Easycao foi criado por um examinador credenciado que sabe exatamente o que e avaliado e como melhorar cada descritor.</p>
    </ContentPageLayout>
  );
}
