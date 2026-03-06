import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";

const PAGE_SLUG = "quem-precisa-fazer-prova-icao";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "por-licenca", text: "Requisitos por tipo de licença", level: 2 },
  { id: "pp", text: "Piloto Privado (PP/PPL)", level: 3 },
  { id: "pc", text: "Piloto Comercial (PC/CPL)", level: 3 },
  { id: "pla", text: "Piloto de Linha Aérea (PLA/ATPL)", level: 3 },
  { id: "atc", text: "Controladores de tráfego aéreo", level: 3 },
  { id: "outros", text: "Outros profissionais", level: 3 },
  { id: "domestico-vs-internacional", text: "Voos domésticos vs internacionais", level: 2 },
  { id: "quando-fazer", text: "Quando fazer a prova", level: 2 },
  { id: "excecoes", text: "Exceções e casos especiais", level: 2 },
];

const faqs = [
  { question: "Piloto privado precisa de ICAO?", answer: "Somente se você pretende voar internacionalmente. Para voos domésticos com PP, não é obrigatório. Porém, muitos pilotos privados fazem para se preparar para a licença comercial." },
  { question: "Comissários de bordo precisam fazer a prova?", answer: "Não. A prova ICAO é destinada a pilotos e controladores de tráfego aéreo. Comissários têm avaliações diferentes de proficiência." },
  { question: "Instrutores de voo precisam do ICAO?", answer: "Se o instrutor opera voos internacionais ou instrui em inglês, sim. Para instrução exclusivamente doméstica em português, não é obrigatório." },
  { question: "Mecânicos de aeronaves precisam?", answer: "Não. A prova ICAO avalia proficiência em comunicação oral para operações de voo, o que não se aplica a mecânicos." },
  { question: "Posso voar internacional sem ICAO?", answer: "Não. A proficiência linguística Level 4 ou superior é requisito obrigatório para operações internacionais, conforme regulamentação da ANAC e da ICAO." },
];

export default function QuemPrecisaPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="por-licenca">Requisitos por tipo de licença</h2>
      <p>A obrigatoriedade da prova ICAO depende do tipo de licença e do tipo de operação que você realiza. Veja os requisitos para cada categoria:</p>


      <h3 id="pp">Piloto Privado (PP/PPL)</h3>
      <ul>
        <li><strong>Voos domésticos:</strong> Não obrigatório</li>
        <li><strong>Voos internacionais:</strong> Obrigatório — Level 4 mínimo</li>
        <li><strong>Recomendação:</strong> Mesmo para voos domésticos, ter o ICAO é um diferencial na progressão de carreira</li>
      </ul>

      <h3 id="pc">Piloto Comercial (PC/CPL)</h3>
      <ul>
        <li><strong>Voos domésticos:</strong> Não obrigatório pela regulamentação, mas muitas empresas aéreas brasileiras exigem</li>
        <li><strong>Voos internacionais:</strong> Obrigatório — Level 4 mínimo</li>
        <li><strong>Processos seletivos:</strong> A maioria das companhias aéreas exige Level 4+ como requisito para contratação, mesmo para rotas domésticas</li>
      </ul>

      <CalloutBox variant="info" title="Tendência do mercado">
        Cada vez mais companhias aéreas brasileiras exigem proficiência ICAO Level 4+ mesmo para pilotos que operam apenas rotas domésticas. Ter a certificação amplia suas opções de carreira.
      </CalloutBox>

      <h3 id="pla">Piloto de Linha Aérea (PLA/ATPL)</h3>
      <ul>
        <li><strong>Obrigatório para operações internacionais:</strong> Level 4 mínimo (muitas companhias exigem Level 5)</li>
        <li><strong>Operações domésticas:</strong> Regulamentação não obriga, mas na prática todas as companhias exigem</li>
        <li><strong>Progressão de carreira:</strong> Level 5 ou 6 é um diferencial competitivo significativo</li>
      </ul>

      <h3 id="atc">Controladores de tráfego aéreo</h3>
      <ul>
        <li><strong>Obrigatório:</strong> Todos os controladores que operam posições com tráfego internacional precisam de Level 4 mínimo</li>
        <li><strong>DECEA/CINDACTA:</strong> O órgão responsável define as exigências específicas por posição</li>
        <li><strong>Formato da prova:</strong> O mesmo SDEA, mas com cenários voltados para controle de tráfego</li>
      </ul>

      <h3 id="outros">Outros profissionais</h3>
      <ul>
        <li><strong>Comissários de bordo:</strong> Não precisam da prova ICAO</li>
        <li><strong>Mecânicos de aeronaves:</strong> Não precisam da prova ICAO</li>
        <li><strong>Despachantes de voo:</strong> Podem precisar dependendo da operação</li>
        <li><strong>Instrutores de voo:</strong> Precisam se operam internacionalmente ou se a escola exige</li>
      </ul>

      <h2 id="domestico-vs-internacional">Voos domésticos vs internacionais</h2>
      <p>A principal diferença está no tipo de operação:</p>
      <ul>
        <li><strong>Voos domésticos:</strong> Regulamentação da ANAC não exige proficiência ICAO, mas o mercado de trabalho cada vez mais exige</li>
        <li><strong>Voos internacionais:</strong> Proficiência ICAO Level 4+ é obrigatória desde 2008 (exigência global da ICAO)</li>
        <li><strong>Voos para países limítrofes:</strong> Mesmo voos curtos para Argentina, Uruguai ou Paraguai exigem proficiência ICAO</li>
      </ul>
      <p>Entenda os <Link href="/niveis-icao">níveis ICAO</Link> e quanto tempo cada nível é válido antes de precisar renovar.</p>

      <h2 id="quando-fazer">Quando fazer a prova</h2>
      <p>O momento ideal para fazer a prova depende da sua situação:</p>
      <ul>
        <li><strong>Durante a formação (PC):</strong> Muitos pilotos fazem durante o curso de piloto comercial, já se preparando para o mercado</li>
        <li><strong>Antes de processos seletivos:</strong> Tenha seu ICAO Level 4+ antes de se candidatar a vagas em companhias aéreas</li>
        <li><strong>Renovação:</strong> Level 4 vale 3 anos, Level 5 vale 6 anos. Planeje a <Link href="/validade-e-renovacao-prova-icao">renovação</Link> com antecedência</li>
        <li><strong>Upgrade de nível:</strong> Se você tem Level 4 e quer Level 5, pode refazer a qualquer momento (sem espera de 60 dias)</li>
      </ul>
      <p>Saiba <Link href="/como-agendar-a-prova-icao">como agendar sua prova</Link> e escolher o melhor centro.</p>

      <h2 id="excecoes">Exceções e casos especiais</h2>
      <ul>
        <li><strong>Pilotos estrangeiros operando no Brasil:</strong> Precisam validar sua proficiência conforme regulamentação da ANAC</li>
        <li><strong>Pilotos com licença de país anglófono:</strong> Podem ter procedimentos simplificados, mas a ANAC pode exigir avaliação</li>
        <li><strong>Pilotos militares:</strong> Têm regulamentação própria do Comando da Aeronáutica</li>
        <li><strong>Helicópteros:</strong> Os mesmos requisitos se aplicam a <Link href="/prova-icao-helicoptero">pilotos de helicóptero</Link> em operações internacionais</li>
      </ul>
      <p>Para entender completamente como a avaliação funciona, leia sobre os <Link href="/descritores-da-prova-icao">6 descritores</Link> e <Link href="/como-funciona-a-prova-icao">como a prova é estruturada</Link>.</p>
    </ContentPageLayout>
  );
}
