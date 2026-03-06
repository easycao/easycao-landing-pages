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
  openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "parte-4", text: "O que é a Parte 4 da prova", level: 2 },
  { id: "estrutura", text: "Estrutura ideal para descrever imagens", level: 2 },
  { id: "vocabulario", text: "Vocabulário essencial para descrições", level: 2 },
  { id: "erros", text: "Erros comuns na descrição de imagens", level: 2 },
  { id: "exemplos", text: "Exemplos práticos", level: 2 },
  { id: "praticar", text: "Como praticar", level: 2 },
];

const faqs = [
  { question: "Quanto tempo tenho para descrever cada imagem?", answer: "Geralmente 2-3 minutos por imagem. O examinador pode fazer perguntas adicionais sobre a imagem após sua descrição inicial." },
  { question: "Que tipos de imagens aparecem?", answer: "Fotos de aeroportos, acidentes/incidentes aéreos, situações de emergência, operações de solo, cabine de comando, e cenários meteorológicos. Sempre relacionadas a aviação." },
  { question: "Posso inventar detalhes que não estão na imagem?", answer: "Pode especular com cuidado. Usar expressões como 'it seems like', 'it might be', 'I think this could be' mostra boa interação e vocabulário sem comprometer a veracidade." },
  { question: "É melhor descrever muito ou pouco?", answer: "Descreva o suficiente para demonstrar vocabulário e fluência. Respostas muito curtas não dão material suficiente para o examinador avaliar. Busque 1-2 minutos de fala fluida." },
];

export default function DicasImagensPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="parte-4">O que é a Parte 4 da prova</h2>
      <p>A Parte 4 (Picture Description) é a última etapa da <Link href="/como-funciona-a-prova-icao">prova ICAO</Link>. O examinador apresenta uma ou mais fotos relacionadas a aviação e você deve descrevê-las em inglês, discutindo o que vê e respondendo perguntas.</p>
      <p>Essa parte avalia todos os 6 <Link href="/descritores-da-prova-icao">descritores</Link> simultaneamente, com ênfase em Vocabulary, Fluency e Structure.</p>

      <h2 id="estrutura">Estrutura ideal para descrever imagens</h2>
      <p>Siga esta estrutura em 4 passos para organizar sua descrição:</p>
      <ol>
        <li><strong>Visão geral (10-15 segundos):</strong> &quot;In this picture, I can see...&quot; — identifique o cenário geral (aeroporto, pista, cabine, acidente)</li>
        <li><strong>Detalhes principais (30-45 segundos):</strong> Descreva os elementos mais importantes — aeronaves, pessoas, equipamentos, condições meteorológicas</li>
        <li><strong>Especulação e análise (20-30 segundos):</strong> &quot;It seems like...&quot;, &quot;This could be...&quot; — demonstre capacidade analítica</li>
        <li><strong>Conexão com experiência (15-20 segundos):</strong> Relacione a imagem com sua experiência como piloto, se possível</li>
      </ol>

      <CalloutBox variant="tip" title="Frase de abertura">
        Comece sempre com uma frase ampla: &quot;In this picture, I can see an airport scene with...&quot; Isso lhe dá tempo para organizar os pensamentos enquanto já está falando.
      </CalloutBox>

      <h2 id="vocabulario">Vocabulário essencial para descrições</h2>
      <p>Domine estas categorias de <Link href="/vocabulario-aviacao-ingles">vocabulário de aviação</Link> para a Parte 4:</p>
      <ul>
        <li><strong>Localização:</strong> in the foreground/background, on the left/right side, in the center, next to, behind</li>
        <li><strong>Aeroporto:</strong> runway, taxiway, apron, terminal, control tower, hangar, gate</li>
        <li><strong>Aeronave:</strong> fuselage, wing, engine, landing gear, cockpit, tail section</li>
        <li><strong>Condições:</strong> overcast, clear sky, wet runway, foggy conditions, strong winds</li>
        <li><strong>Ações:</strong> taxiing, taking off, landing, parked, being towed, under maintenance</li>
        <li><strong>Emergência:</strong> fire trucks, foam, evacuation, damaged, debris, emergency vehicles</li>
      </ul>

      <h2 id="erros">Erros comuns na descrição de imagens</h2>
      <ul>
        <li><strong>Descrição muito curta:</strong> Dizer apenas &quot;I see a plane at an airport&quot; não demonstra vocabulário nem fluência</li>
        <li><strong>Não especular:</strong> O examinador quer ver sua capacidade de analisar e opinar, não apenas listar objetos</li>
        <li><strong>Vocabulário genérico:</strong> Usar &quot;thing&quot; ou &quot;stuff&quot; quando existe um termo técnico específico</li>
        <li><strong>Pausas longas:</strong> Se não sabe uma palavra, use uma paráfrase — não fique em silêncio</li>
        <li><strong>Não conectar ideias:</strong> Use conectores: &quot;moreover&quot;, &quot;in addition&quot;, &quot;on the other hand&quot;, &quot;it&apos;s worth noting that&quot;</li>
      </ul>

      <h2 id="exemplos">Exemplos práticos</h2>
      <p><strong>Cenário: Foto de um aeroporto com avião sendo carregado no gate</strong></p>
      <p><em>Exemplo de resposta boa:</em> &quot;In this picture, I can see a commercial aircraft parked at a gate. It appears to be a narrow-body jet, possibly an A320 or 737. Ground crew members are loading cargo into the belly of the aircraft using a belt loader. In the background, I can see the terminal building and what seems like a control tower. The weather looks clear with good visibility. This is a typical turnaround scene — the aircraft is probably being prepared for its next departure. In my experience, this process usually takes about 30 to 45 minutes...&quot;</p>

      <h2 id="praticar">Como praticar</h2>
      <p>A melhor forma de praticar descrição de imagens:</p>
      <ul>
        <li><strong>Simulador Easycao:</strong> O app tem cenários específicos de Picture Description com feedback por descritor</li>
        <li><strong>Google Images:</strong> Pesquise &quot;airport scenes&quot;, &quot;aircraft incidents&quot;, &quot;aviation operations&quot; e pratique descrevendo em voz alta</li>
        <li><strong>Grave-se:</strong> Grave suas descrições e ouça depois — identifique pausas, repetições e vocabulário fraco</li>
        <li><strong>Cronometre:</strong> Pratique descrições de 2 minutos para calibrar seu ritmo</li>
      </ul>

      <AppBanner variant="inline" />

      <p>Nas <Link href="/lives">lives gratuitas</Link> da Easycao, o professor Diogo frequentemente pratica descrição de imagens ao vivo com correção imediata. Saiba mais sobre <Link href="/como-se-preparar-para-a-prova-icao">como se preparar de forma completa</Link>.</p>
    </ContentPageLayout>
  );
}
