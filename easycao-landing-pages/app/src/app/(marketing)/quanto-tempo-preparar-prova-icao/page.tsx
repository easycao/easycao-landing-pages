import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";
import AppBanner from "../../../components/AppBanner";

const PAGE_SLUG = "quanto-tempo-preparar-prova-icao";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "por-nivel", text: "Tempo de preparacao por nivel de ingles", level: 2 },
  { id: "fatores", text: "Fatores que influenciam o tempo", level: 2 },
  { id: "plano-semanal", text: "Plano de estudo semanal recomendado", level: 2 },
  { id: "sinais-pronto", text: "Como saber se voce esta pronto", level: 2 },
  { id: "aceleradores", text: "Aceleradores de preparacao", level: 2 },
];

const faqs = [
  { question: "Consigo me preparar em 1 mes?", answer: "Depende do seu nivel atual de ingles. Se voce ja tem ingles intermediario-avancado e familiaridade com aviacao em ingles, 1 mes de estudo focado pode ser suficiente para Level 4." },
  { question: "Estudar 15 minutos por dia e suficiente?", answer: "Para manutencao, sim. Para preparacao inicial, recomendamos pelo menos 30-45 minutos diarios de pratica oral, mais sessoes maiores nos fins de semana." },
  { question: "Preciso de professor para me preparar?", answer: "Nao e obrigatorio, mas orientacao profissional acelera significativamente a preparacao, especialmente para identificar e corrigir pontos fracos nos descritores." },
  { question: "Quanto tempo para subir de Level 4 para Level 5?", answer: "Tipicamente 3-6 meses de pratica consistente. A diferenca entre Level 4 e 5 e significativa — Level 5 exige vocabulario 'amplo e preciso' e fluencia natural." },
];

export default function QuantoTempoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="por-nivel">Tempo de preparacao por nivel de ingles</h2>
      <p>O tempo necessario varia muito de acordo com seu nivel atual de ingles. Veja estimativas realistas:</p>

      <div className="overflow-x-auto my-4">
        <table>
          <thead>
            <tr><th>Seu nivel atual</th><th>Objetivo</th><th>Tempo estimado</th></tr>
          </thead>
          <tbody>
            <tr><td>Basico (A1-A2)</td><td>Level 4</td><td className="font-medium">8-12 meses</td></tr>
            <tr><td>Intermediario (B1)</td><td>Level 4</td><td className="font-medium">3-6 meses</td></tr>
            <tr><td>Intermediario-avancado (B2)</td><td>Level 4</td><td className="font-medium">1-3 meses</td></tr>
            <tr><td>Avancado (C1)</td><td>Level 4-5</td><td className="font-medium">2-6 semanas</td></tr>
            <tr><td>Ja tem Level 4</td><td>Level 5</td><td className="font-medium">3-6 meses</td></tr>
          </tbody>
        </table>
      </div>

      <CalloutBox variant="warning" title="Atencao">
        Essas estimativas assumem estudo consistente e focado na prova ICAO, nao ingles geral. Estudar ingles geral sem foco nos <Link href="/descritores-da-prova-icao">descritores</Link> pode triplicar o tempo necessario.
      </CalloutBox>

      <h2 id="fatores">Fatores que influenciam o tempo</h2>
      <ul>
        <li><strong>Nivel atual de ingles:</strong> O fator mais importante. Quanto maior seu ingles base, menos tempo precisa</li>
        <li><strong>Experiencia com aviacao em ingles:</strong> Pilotos que ja operam com fraseologia em ingles tem vantagem no vocabulario</li>
        <li><strong>Consistencia de estudo:</strong> 30 minutos diarios e mais eficaz que 3 horas uma vez por semana</li>
        <li><strong>Metodo de estudo:</strong> Pratica oral focada nos descritores e muito mais eficiente que estudar gramatica</li>
        <li><strong>Experiencia previa com a prova:</strong> Quem ja fez (mesmo <Link href="/reprovado-na-prova-icao">reprovados</Link>) conhece o formato e precisa de menos tempo</li>
      </ul>

      <h2 id="plano-semanal">Plano de estudo semanal recomendado</h2>
      <p>Um plano realista para quem tem nivel intermediario buscando Level 4:</p>
      <ul>
        <li><strong>Segunda a sexta (30-45 min/dia):</strong> Pratica oral com o simulador — 1-2 cenarios completos</li>
        <li><strong>Sabado (1-2 horas):</strong> Simulado completo + revisao de vocabulario de aviacao</li>
        <li><strong>Domingo:</strong> Descanso ou exposicao passiva (podcasts de aviacao, videos em ingles)</li>
      </ul>

      <AppBanner variant="inline" />

      <h2 id="sinais-pronto">Como saber se voce esta pronto</h2>
      <p>Voce provavelmente esta pronto para a prova quando:</p>
      <ul>
        <li>Consegue falar sobre qualquer tema de aviacao por 2+ minutos sem pausas longas</li>
        <li>Usa <Link href="/vocabulario-aviacao-ingles">vocabulario tecnico</Link> de forma natural, sem precisar traduzir mentalmente</li>
        <li>Consegue parafrasear quando nao sabe uma palavra especifica</li>
        <li>Entende perguntas sobre aviacao em ingles sem pedir para repetir mais de uma vez</li>
        <li>Seus simulados mostram consistencia em todos os 6 descritores</li>
      </ul>

      <h2 id="aceleradores">Aceleradores de preparacao</h2>
      <ul>
        <li><strong>Simulados diarios:</strong> O <Link href="/simulado-prova-icao">simulador Easycao</Link> permite pratica diaria com feedback por descritor</li>
        <li><strong>Lives gratuitas:</strong> As <Link href="/lives">lives da Easycao</Link> oferecem pratica ao vivo com correcao do professor</li>
        <li><strong>Metodo estruturado:</strong> Um metodo focado nos descritores acelera a preparacao em ate 50% comparado com estudo autodidata</li>
        <li><strong>Imersao:</strong> Mude o idioma do celular, assista videos de aviacao em ingles, leia NOTAMs e METARs em ingles</li>
      </ul>
      <p>Saiba mais sobre <Link href="/como-se-preparar-para-a-prova-icao">como se preparar de forma eficiente</Link> e evitar os <Link href="/erros-comuns-prova-icao">erros mais comuns</Link>.</p>
    </ContentPageLayout>
  );
}
