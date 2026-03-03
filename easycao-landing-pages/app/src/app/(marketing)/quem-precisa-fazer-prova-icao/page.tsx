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
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "por-licenca", text: "Requisitos por tipo de licenca", level: 2 },
  { id: "pp", text: "Piloto Privado (PP/PPL)", level: 3 },
  { id: "pc", text: "Piloto Comercial (PC/CPL)", level: 3 },
  { id: "pla", text: "Piloto de Linha Aerea (PLA/ATPL)", level: 3 },
  { id: "atc", text: "Controladores de trafego aereo", level: 3 },
  { id: "outros", text: "Outros profissionais", level: 3 },
  { id: "domestico-vs-internacional", text: "Voos domesticos vs internacionais", level: 2 },
  { id: "quando-fazer", text: "Quando fazer a prova", level: 2 },
  { id: "excecoes", text: "Excecoes e casos especiais", level: 2 },
];

const faqs = [
  { question: "Piloto privado precisa de ICAO?", answer: "Somente se voce pretende voar internacionalmente. Para voos domesticos com PP, nao e obrigatorio. Porem, muitos pilotos privados fazem para se preparar para a licenca comercial." },
  { question: "Comissarios de bordo precisam fazer a prova?", answer: "Nao. A prova ICAO e destinada a pilotos e controladores de trafego aereo. Comissarios tem avaliacoes diferentes de proficiencia." },
  { question: "Instrutores de voo precisam do ICAO?", answer: "Se o instrutor opera voos internacionais ou instrui em ingles, sim. Para instrucao exclusivamente domestica em portugues, nao e obrigatorio." },
  { question: "Mecanicos de aeronaves precisam?", answer: "Nao. A prova ICAO avalia proficiencia em comunicacao oral para operacoes de voo, o que nao se aplica a mecanicos." },
  { question: "Posso voar internacional sem ICAO?", answer: "Nao. A proficiencia linguistica Level 4 ou superior e requisito obrigatorio para operacoes internacionais, conforme regulamentacao da ANAC e da ICAO." },
];

export default function QuemPrecisaPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="por-licenca">Requisitos por tipo de licenca</h2>
      <p>A obrigatoriedade da prova ICAO depende do tipo de licenca e do tipo de operacao que voce realiza. Veja os requisitos para cada categoria:</p>

      <h3 id="pp">Piloto Privado (PP/PPL)</h3>
      <ul>
        <li><strong>Voos domesticos:</strong> Nao obrigatorio</li>
        <li><strong>Voos internacionais:</strong> Obrigatorio — Level 4 minimo</li>
        <li><strong>Recomendacao:</strong> Mesmo para voos domesticos, ter o ICAO e um diferencial na progressao de carreira</li>
      </ul>

      <h3 id="pc">Piloto Comercial (PC/CPL)</h3>
      <ul>
        <li><strong>Voos domesticos:</strong> Nao obrigatorio pela regulamentacao, mas muitas empresas aereas brasileiras exigem</li>
        <li><strong>Voos internacionais:</strong> Obrigatorio — Level 4 minimo</li>
        <li><strong>Processos seletivos:</strong> A maioria das companhias aereas exige Level 4+ como requisito para contratacao, mesmo para rotas domesticas</li>
      </ul>

      <CalloutBox variant="info" title="Tendencia do mercado">
        Cada vez mais companhias aereas brasileiras exigem proficiencia ICAO Level 4+ mesmo para pilotos que operam apenas rotas domesticas. Ter a certificacao amplia suas opcoes de carreira.
      </CalloutBox>

      <h3 id="pla">Piloto de Linha Aerea (PLA/ATPL)</h3>
      <ul>
        <li><strong>Obrigatorio para operacoes internacionais:</strong> Level 4 minimo (muitas companhias exigem Level 5)</li>
        <li><strong>Operacoes domesticas:</strong> Regulamentacao nao obriga, mas na pratica todas as companhias exigem</li>
        <li><strong>Progressao de carreira:</strong> Level 5 ou 6 e um diferencial competitivo significativo</li>
      </ul>

      <h3 id="atc">Controladores de trafego aereo</h3>
      <ul>
        <li><strong>Obrigatorio:</strong> Todos os controladores que operam posicoes com trafego internacional precisam de Level 4 minimo</li>
        <li><strong>DECEA/CINDACTA:</strong> O orgao responsavel define as exigencias especificas por posicao</li>
        <li><strong>Formato da prova:</strong> O mesmo SDEA, mas com cenarios voltados para controle de trafego</li>
      </ul>

      <h3 id="outros">Outros profissionais</h3>
      <ul>
        <li><strong>Comissarios de bordo:</strong> Nao precisam da prova ICAO</li>
        <li><strong>Mecanicos de aeronaves:</strong> Nao precisam da prova ICAO</li>
        <li><strong>Despachantes de voo:</strong> Podem precisar dependendo da operacao</li>
        <li><strong>Instrutores de voo:</strong> Precisam se operam internacionalmente ou se a escola exige</li>
      </ul>

      <h2 id="domestico-vs-internacional">Voos domesticos vs internacionais</h2>
      <p>A principal diferenca esta no tipo de operacao:</p>
      <ul>
        <li><strong>Voos domesticos:</strong> Regulamentacao da ANAC nao exige proficiencia ICAO, mas o mercado de trabalho cada vez mais exige</li>
        <li><strong>Voos internacionais:</strong> Proficiencia ICAO Level 4+ e obrigatoria desde 2008 (exigencia global da ICAO)</li>
        <li><strong>Voos para paises limitrofes:</strong> Mesmo voos curtos para Argentina, Uruguai ou Paraguai exigem proficiencia ICAO</li>
      </ul>
      <p>Entenda os <Link href="/niveis-icao">niveis ICAO</Link> e quanto tempo cada nivel e valido antes de precisar renovar.</p>

      <h2 id="quando-fazer">Quando fazer a prova</h2>
      <p>O momento ideal para fazer a prova depende da sua situacao:</p>
      <ul>
        <li><strong>Durante a formacao (PC):</strong> Muitos pilotos fazem durante o curso de piloto comercial, ja se preparando para o mercado</li>
        <li><strong>Antes de processos seletivos:</strong> Tenha seu ICAO Level 4+ antes de se candidatar a vagas em companhias aereas</li>
        <li><strong>Renovacao:</strong> Level 4 vale 3 anos, Level 5 vale 6 anos. Planeje a <Link href="/validade-e-renovacao-prova-icao">renovacao</Link> com antecedencia</li>
        <li><strong>Upgrade de nivel:</strong> Se voce tem Level 4 e quer Level 5, pode refazer a qualquer momento (sem espera de 60 dias)</li>
      </ul>
      <p>Saiba <Link href="/como-agendar-a-prova-icao">como agendar sua prova</Link> e escolher o melhor centro.</p>

      <h2 id="excecoes">Excecoes e casos especiais</h2>
      <ul>
        <li><strong>Pilotos estrangeiros operando no Brasil:</strong> Precisam validar sua proficiencia conforme regulamentacao da ANAC</li>
        <li><strong>Pilotos com licenca de pais anglofono:</strong> Podem ter procedimentos simplificados, mas a ANAC pode exigir avaliacao</li>
        <li><strong>Pilotos militares:</strong> Tem regulamentacao propria do Comando da Aeronautica</li>
        <li><strong>Helicopteros:</strong> Os mesmos requisitos se aplicam a <Link href="/prova-icao-helicoptero">pilotos de helicoptero</Link> em operacoes internacionais</li>
      </ul>
      <p>Para entender completamente como a avaliacao funciona, leia sobre os <Link href="/descritores-da-prova-icao">6 descritores</Link> e <Link href="/como-funciona-a-prova-icao">como a prova e estruturada</Link>.</p>
    </ContentPageLayout>
  );
}
