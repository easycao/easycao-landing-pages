import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";

const PAGE_SLUG = "resultado-prova-icao";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "quando-sai", text: "Quando sai o resultado", level: 2 },
  { id: "como-verificar", text: "Como verificar seu resultado", level: 2 },
  { id: "interpretar", text: "Como interpretar sua nota", level: 2 },
  { id: "aprovado", text: "Se você foi aprovado", level: 2 },
  { id: "reprovado", text: "Se você não atingiu Level 4", level: 2 },
];

const faqs = [
  { question: "Quanto tempo demora para sair o resultado?", answer: "Geralmente 5 a 15 dias úteis após a prova, dependendo do centro. Alguns centros mais ágeis divulgam em 5-7 dias." },
  { question: "O resultado sai por email ou no sistema da ANAC?", answer: "O centro geralmente envia o resultado por email. Além disso, o resultado é registrado no sistema da ANAC e fica disponível para consulta." },
  { question: "Posso contestar meu resultado?", answer: "Sim. Se você discorda do resultado, pode solicitar revisão ao centro ou apresentar recurso à ANAC. Consulte o regulamento do centro para o procedimento." },
  { question: "O resultado fica no meu histórico permanentemente?", answer: "Sim. Todos os resultados ficam registrados no sistema da ANAC. Porém, cada avaliação é independente — um resultado anterior não influencia o próximo." },
  { question: "Como saber meu nível em cada descritor?", answer: "O resultado detalhado mostra o nível obtido em cada um dos 6 descritores individualmente. Sua nota final é o menor nível entre todos os descritores." },
];

export default function ResultadoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="quando-sai">Quando sai o resultado</h2>
      <p>O prazo para divulgação do resultado da prova ICAO varia por centro credenciado:</p>
      <ul>
        <li><strong>Prazo médio:</strong> 5 a 15 dias úteis após a data da prova</li>
        <li><strong>Centros mais ágeis:</strong> Alguns divulgam em 5-7 dias</li>
        <li><strong>Centros com mais demanda:</strong> Podem levar até 15-20 dias úteis</li>
      </ul>
      <p>O centro deve informar o prazo estimado no momento do agendamento. Se o prazo expirar sem resposta, entre em contato diretamente com o centro.</p>

      <h2 id="como-verificar">Como verificar seu resultado</h2>
      <p>Existem duas formas de acessar seu resultado:</p>
      <ol>
        <li><strong>Pelo centro credenciado:</strong> O centro envia o resultado por email ou disponibiliza em portal próprio. Este é geralmente o canal mais rápido</li>
        <li><strong>Pelo sistema da ANAC:</strong> O resultado é registrado no sistema da <a href="https://www.gov.br/anac/pt-br/assuntos/regulados/profissionais-da-aviacao-civil/proficiencia-linguistica" target="_blank" rel="noopener noreferrer">ANAC</a> e pode ser consultado online</li>
      </ol>

      <CalloutBox variant="info" title="Guarde seu resultado">
        Salve o documento oficial do resultado. Você precisará dele para comprovar sua proficiência em processos seletivos, renovação de licença e operações internacionais.
      </CalloutBox>

      <h2 id="interpretar">Como interpretar sua nota</h2>
      <p>O resultado da prova ICAO mostra:</p>
      <ul>
        <li><strong>Nível em cada descritor:</strong> Nota individual (1 a 6) para cada um dos 6 <Link href="/descritores-da-prova-icao">descritores</Link> (Pronunciation, Structure, Vocabulary, Fluency, Comprehension, Interaction)</li>
        <li><strong>Nível final:</strong> O <strong>menor nível</strong> entre todos os 6 descritores. Se você tirou 5 em cinco descritores e 4 em um, seu nível final é 4</li>
      </ul>
      <p>Entenda o que cada <Link href="/niveis-icao">nível ICAO</Link> significa e quanto tempo cada um é válido.</p>

      <div className="overflow-x-auto my-4">
        <table>
          <thead>
            <tr><th>Nível</th><th>Significado</th><th>Validade</th></tr>
          </thead>
          <tbody>
            <tr><td className="font-medium">Level 6</td><td>Expert — proficiência nativa ou equivalente</td><td>Vitalício</td></tr>
            <tr><td className="font-medium">Level 5</td><td>Extended — acima do mínimo operacional</td><td>6 anos</td></tr>
            <tr><td className="font-medium">Level 4</td><td>Operational — mínimo para voos internacionais</td><td>3 anos</td></tr>
            <tr><td className="font-medium">Level 3</td><td>Pre-operational — reprovado</td><td>N/A</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="aprovado">Se você foi aprovado</h2>
      <p>Parabéns! Se você obteve Level 4 ou superior:</p>
      <ul>
        <li><strong>Anotação na licença:</strong> Seu nível será anotado na sua CHT/licença de piloto</li>
        <li><strong>Validade:</strong> Level 4 vale 3 anos, Level 5 vale 6 anos, Level 6 é vitalício. Planeje sua <Link href="/validade-e-renovacao-prova-icao">renovação</Link> com antecedência</li>
        <li><strong>Voos internacionais:</strong> Você está autorizado a operar voos internacionais</li>
        <li><strong>Upgrade opcional:</strong> Se obteve Level 4, pode fazer a prova novamente a qualquer momento para tentar Level 5 (sem espera de 60 dias)</li>
      </ul>

      <h2 id="reprovado">Se você não atingiu Level 4</h2>
      <p>Se seu resultado foi Level 3 ou inferior, não desanime. Muitos pilotos excelentes não passam na primeira tentativa.</p>

      <CalloutBox variant="warning" title="Espera obrigatória">
        Você só pode refazer a prova após 60 dias corridos da data da avaliação. Use esse tempo para uma preparação focada.
      </CalloutBox>

      <p>Passos recomendados:</p>
      <ol>
        <li><strong>Analise seus descritores:</strong> Identifique quais foram os mais baixos — esses são sua prioridade</li>
        <li><strong>Monte um plano de 60 dias:</strong> Veja nosso guia completo para <Link href="/reprovado-na-prova-icao">quem foi reprovado</Link></li>
        <li><strong>Foque nos pontos fracos:</strong> Evite os <Link href="/erros-comuns-prova-icao">erros mais comuns</Link></li>
        <li><strong>Pratique diariamente:</strong> O <Link href="/simulado-prova-icao">simulador Easycao</Link> permite prática focada por descritor</li>
        <li><strong>Agende com antecedência:</strong> <Link href="/como-agendar-a-prova-icao">Agende a nova prova</Link> assim que os 60 dias se completarem</li>
      </ol>
    </ContentPageLayout>
  );
}
