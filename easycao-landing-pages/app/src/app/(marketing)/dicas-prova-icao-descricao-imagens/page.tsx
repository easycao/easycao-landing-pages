import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";
import CalloutBox from "../../../components/content/CalloutBox";
import AppBanner from "../../../components/AppBanner";

const PAGE_SLUG = "dicas-prova-icao-descricao-imagens";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "parte-4", text: "O que e a Parte 4 da prova", level: 2 },
  { id: "estrutura", text: "Estrutura ideal para descrever imagens", level: 2 },
  { id: "vocabulario", text: "Vocabulario essencial para descricoes", level: 2 },
  { id: "erros", text: "Erros comuns na descricao de imagens", level: 2 },
  { id: "exemplos", text: "Exemplos praticos", level: 2 },
  { id: "praticar", text: "Como praticar", level: 2 },
];

const faqs = [
  { question: "Quanto tempo tenho para descrever cada imagem?", answer: "Geralmente 2-3 minutos por imagem. O examinador pode fazer perguntas adicionais sobre a imagem apos sua descricao inicial." },
  { question: "Que tipos de imagens aparecem?", answer: "Fotos de aeroportos, acidentes/incidentes aereos, situacoes de emergencia, operacoes de solo, cabine de comando, e cenarios meteorologicos. Sempre relacionadas a aviacao." },
  { question: "Posso inventar detalhes que nao estao na imagem?", answer: "Pode especular com cuidado. Usar expressoes como 'it seems like', 'it might be', 'I think this could be' mostra boa interacao e vocabulario sem comprometer a veracidade." },
  { question: "E melhor descrever muito ou pouco?", answer: "Descreva o suficiente para demonstrar vocabulario e fluencia. Respostas muito curtas nao dao material suficiente para o examinador avaliar. Busque 1-2 minutos de fala fluida." },
];

export default function DicasImagensPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="parte-4">O que e a Parte 4 da prova</h2>
      <p>A Parte 4 (Picture Description) e a ultima etapa da <Link href="/como-funciona-a-prova-icao">prova ICAO</Link>. O examinador apresenta uma ou mais fotos relacionadas a aviacao e voce deve descreve-las em ingles, discutindo o que ve e respondendo perguntas.</p>
      <p>Essa parte avalia todos os 6 <Link href="/descritores-da-prova-icao">descritores</Link> simultaneamente, com enfase em Vocabulary, Fluency e Structure.</p>

      <h2 id="estrutura">Estrutura ideal para descrever imagens</h2>
      <p>Siga esta estrutura em 4 passos para organizar sua descricao:</p>
      <ol>
        <li><strong>Visao geral (10-15 segundos):</strong> &quot;In this picture, I can see...&quot; — identifique o cenario geral (aeroporto, pista, cabine, acidente)</li>
        <li><strong>Detalhes principais (30-45 segundos):</strong> Descreva os elementos mais importantes — aeronaves, pessoas, equipamentos, condicoes meteorologicas</li>
        <li><strong>Especulacao e analise (20-30 segundos):</strong> &quot;It seems like...&quot;, &quot;This could be...&quot; — demonstre capacidade analitica</li>
        <li><strong>Conexao com experiencia (15-20 segundos):</strong> Relacione a imagem com sua experiencia como piloto, se possivel</li>
      </ol>

      <CalloutBox variant="tip" title="Frase de abertura">
        Comece sempre com uma frase ampla: &quot;In this picture, I can see an airport scene with...&quot; Isso lhe da tempo para organizar os pensamentos enquanto ja esta falando.
      </CalloutBox>

      <h2 id="vocabulario">Vocabulario essencial para descricoes</h2>
      <p>Domine estas categorias de <Link href="/vocabulario-aviacao-ingles">vocabulario de aviacao</Link> para a Parte 4:</p>
      <ul>
        <li><strong>Localizacao:</strong> in the foreground/background, on the left/right side, in the center, next to, behind</li>
        <li><strong>Aeroporto:</strong> runway, taxiway, apron, terminal, control tower, hangar, gate</li>
        <li><strong>Aeronave:</strong> fuselage, wing, engine, landing gear, cockpit, tail section</li>
        <li><strong>Condicoes:</strong> overcast, clear sky, wet runway, foggy conditions, strong winds</li>
        <li><strong>Acoes:</strong> taxiing, taking off, landing, parked, being towed, under maintenance</li>
        <li><strong>Emergencia:</strong> fire trucks, foam, evacuation, damaged, debris, emergency vehicles</li>
      </ul>

      <h2 id="erros">Erros comuns na descricao de imagens</h2>
      <ul>
        <li><strong>Descricao muito curta:</strong> Dizer apenas &quot;I see a plane at an airport&quot; nao demonstra vocabulario nem fluencia</li>
        <li><strong>Nao especular:</strong> O examinador quer ver sua capacidade de analisar e opinar, nao apenas listar objetos</li>
        <li><strong>Vocabulario generico:</strong> Usar &quot;thing&quot; ou &quot;stuff&quot; quando existe um termo tecnico especifico</li>
        <li><strong>Pausas longas:</strong> Se nao sabe uma palavra, use uma parafrase — nao fique em silencio</li>
        <li><strong>Nao conectar ideias:</strong> Use conectores: &quot;moreover&quot;, &quot;in addition&quot;, &quot;on the other hand&quot;, &quot;it&apos;s worth noting that&quot;</li>
      </ul>

      <h2 id="exemplos">Exemplos praticos</h2>
      <p><strong>Cenario: Foto de um aeroporto com aviao sendo carregado no gate</strong></p>
      <p><em>Exemplo de resposta boa:</em> &quot;In this picture, I can see a commercial aircraft parked at a gate. It appears to be a narrow-body jet, possibly an A320 or 737. Ground crew members are loading cargo into the belly of the aircraft using a belt loader. In the background, I can see the terminal building and what seems like a control tower. The weather looks clear with good visibility. This is a typical turnaround scene — the aircraft is probably being prepared for its next departure. In my experience, this process usually takes about 30 to 45 minutes...&quot;</p>

      <h2 id="praticar">Como praticar</h2>
      <p>A melhor forma de praticar descricao de imagens:</p>
      <ul>
        <li><strong>Simulador Easycao:</strong> O app tem cenarios especificos de Picture Description com feedback por descritor</li>
        <li><strong>Google Images:</strong> Pesquise &quot;airport scenes&quot;, &quot;aircraft incidents&quot;, &quot;aviation operations&quot; e pratique descrevendo em voz alta</li>
        <li><strong>Grave-se:</strong> Grave suas descricoes e ouca depois — identifique pausas, repeticoes e vocabulario fraco</li>
        <li><strong>Cronometre:</strong> Pratique descricoes de 2 minutos para calibrar seu ritmo</li>
      </ul>

      <AppBanner variant="inline" />

      <p>Nas <Link href="/lives">lives gratuitas</Link> da Easycao, o professor Diogo frequentemente pratica descricao de imagens ao vivo com correcao imediata. Saiba mais sobre <Link href="/como-se-preparar-para-a-prova-icao">como se preparar de forma completa</Link>.</p>
    </ContentPageLayout>
  );
}
