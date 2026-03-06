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
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "por-nivel", text: "Tempo de preparação por nível de inglês", level: 2 },
  { id: "fatores", text: "Fatores que influenciam o tempo", level: 2 },
  { id: "plano-semanal", text: "Plano de estudo semanal recomendado", level: 2 },
  { id: "sinais-pronto", text: "Como saber se você está pronto", level: 2 },
  { id: "aceleradores", text: "Aceleradores de preparação", level: 2 },
];

const faqs = [
  { question: "Consigo me preparar em 1 mês?", answer: "Depende do seu nível atual de inglês. Se você já tem inglês intermediário-avançado e familiaridade com aviação em inglês, 1 mês de estudo focado pode ser suficiente para Level 4." },
  { question: "Estudar 15 minutos por dia é suficiente?", answer: "Para manutenção, sim. Para preparação inicial, recomendamos pelo menos 30-45 minutos diários de prática oral, mais sessões maiores nos fins de semana." },
  { question: "Preciso de professor para me preparar?", answer: "Não é obrigatório, mas orientação profissional acelera significativamente a preparação, especialmente para identificar e corrigir pontos fracos nos descritores." },
  { question: "Quanto tempo para subir de Level 4 para Level 5?", answer: "Tipicamente 3-6 meses de prática consistente. A diferença entre Level 4 e 5 é significativa — Level 5 exige vocabulário 'amplo e preciso' e fluência natural." },
];

export default function QuantoTempoPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="por-nivel">Tempo de preparação por nível de inglês</h2>
      <p>O tempo necessário varia muito de acordo com seu nível atual de inglês. Veja estimativas realistas:</p>

      <div className="overflow-x-auto my-4">
        <table>
          <thead>
            <tr><th>Seu nível atual</th><th>Objetivo</th><th>Tempo estimado</th></tr>
          </thead>
          <tbody>
            <tr><td>Básico (A1-A2)</td><td>Level 4</td><td className="font-medium">8-12 meses</td></tr>
            <tr><td>Intermediário (B1)</td><td>Level 4</td><td className="font-medium">3-6 meses</td></tr>
            <tr><td>Intermediário-avançado (B2)</td><td>Level 4</td><td className="font-medium">1-3 meses</td></tr>
            <tr><td>Avançado (C1)</td><td>Level 4-5</td><td className="font-medium">2-6 semanas</td></tr>
            <tr><td>Já tem Level 4</td><td>Level 5</td><td className="font-medium">3-6 meses</td></tr>
          </tbody>
        </table>
      </div>

      <CalloutBox variant="warning" title="Atenção">
        Essas estimativas assumem estudo consistente e focado na prova ICAO, não inglês geral. Estudar inglês geral sem foco nos <Link href="/descritores-da-prova-icao">descritores</Link> pode triplicar o tempo necessário.
      </CalloutBox>

      <h2 id="fatores">Fatores que influenciam o tempo</h2>
      <ul>
        <li><strong>Nível atual de inglês:</strong> O fator mais importante. Quanto maior seu inglês base, menos tempo precisa</li>
        <li><strong>Experiência com aviação em inglês:</strong> Pilotos que já operam com fraseologia em inglês têm vantagem no vocabulário</li>
        <li><strong>Consistência de estudo:</strong> 30 minutos diários é mais eficaz que 3 horas uma vez por semana</li>
        <li><strong>Método de estudo:</strong> Prática oral focada nos descritores é muito mais eficiente que estudar gramática</li>
        <li><strong>Experiência prévia com a prova:</strong> Quem já fez (mesmo <Link href="/reprovado-na-prova-icao">reprovados</Link>) conhece o formato e precisa de menos tempo</li>
      </ul>

      <h2 id="plano-semanal">Plano de estudo semanal recomendado</h2>
      <p>Um plano realista para quem tem nível intermediário buscando Level 4:</p>
      <ul>
        <li><strong>Segunda a sexta (30-45 min/dia):</strong> Prática oral com o simulador — 1-2 cenários completos</li>
        <li><strong>Sábado (1-2 horas):</strong> Simulado completo + revisão de vocabulário de aviação</li>
        <li><strong>Domingo:</strong> Descanso ou exposição passiva (podcasts de aviação, vídeos em inglês)</li>
      </ul>

      <AppBanner variant="inline" />

      <h2 id="sinais-pronto">Como saber se você está pronto</h2>
      <p>Você provavelmente está pronto para a prova quando:</p>
      <ul>
        <li>Consegue falar sobre qualquer tema de aviação por 2+ minutos sem pausas longas</li>
        <li>Usa <Link href="/vocabulario-aviacao-ingles">vocabulário técnico</Link> de forma natural, sem precisar traduzir mentalmente</li>
        <li>Consegue parafrasear quando não sabe uma palavra específica</li>
        <li>Entende perguntas sobre aviação em inglês sem pedir para repetir mais de uma vez</li>
        <li>Seus simulados mostram consistência em todos os 6 descritores</li>
      </ul>

      <h2 id="aceleradores">Aceleradores de preparação</h2>
      <ul>
        <li><strong>Simulados diários:</strong> O <Link href="/simulado-prova-icao">simulador Easycao</Link> permite prática diária com feedback por descritor</li>
        <li><strong>Lives gratuitas:</strong> As <Link href="/lives">lives da Easycao</Link> oferecem prática ao vivo com correção do professor</li>
        <li><strong>Método estruturado:</strong> Um método focado nos descritores acelera a preparação em até 50% comparado com estudo autodidata</li>
        <li><strong>Imersão:</strong> Mude o idioma do celular, assista vídeos de aviação em inglês, leia NOTAMs e METARs em inglês</li>
      </ul>
      <p>Saiba mais sobre <Link href="/como-se-preparar-para-a-prova-icao">como se preparar de forma eficiente</Link> e evitar os <Link href="/erros-comuns-prova-icao">erros mais comuns</Link>.</p>
    </ContentPageLayout>
  );
}
