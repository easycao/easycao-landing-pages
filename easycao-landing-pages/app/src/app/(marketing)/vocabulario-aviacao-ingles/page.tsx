import type { Metadata } from "next";
import Link from "next/link";
import { getPageBySlug } from "../../../lib/content-pages";
import { SITE_URL } from "../../../lib/constants";
import ContentPageLayout from "../../../components/content/ContentPageLayout";

const PAGE_SLUG = "vocabulario-aviacao-ingles";
const page = getPageBySlug(PAGE_SLUG)!;

export const metadata: Metadata = {
  title: page.seoTitle,
  description: page.description,
  alternates: { canonical: `/${PAGE_SLUG}` },
  openGraph: { title: page.seoTitle, description: page.description, url: `${SITE_URL}/${PAGE_SLUG}`, siteName: "Easycao", type: "article", locale: "pt_BR" },
};

const headings: { id: string; text: string; level: 2 | 3 }[] = [
  { id: "glossario", text: "Glossário de aviação em inglês", level: 2 },
  { id: "aeroporto", text: "Aeroporto e Aeródromo", level: 3 },
  { id: "aeronave", text: "Sistemas da Aeronave", level: 3 },
  { id: "atc", text: "Comunicação ATC", level: 3 },
  { id: "emergencia", text: "Emergência", level: 3 },
  { id: "meteorologia", text: "Meteorologia", level: 3 },
  { id: "navegacao", text: "Navegação", level: 3 },
  { id: "como-usar", text: "Como usar este vocabulário na prova ICAO", level: 2 },
  { id: "por-parte", text: "Vocabulário por parte da prova", level: 2 },
];

const faqs = [
  { question: "Quantas palavras de aviação preciso saber para a prova?", answer: "Não há um número exato, mas dominar 150-200 termos técnicos de aviação em inglês, combinado com vocabulário geral, é suficiente para Level 4-5." },
  { question: "Preciso saber vocabulário técnico muito avançado?", answer: "Para Level 4, vocabulário 'suficiente' é adequado. Para Level 5-6, espera-se vocabulário 'amplo e preciso'. Foque nos termos que aparecem em situações reais de comunicação." },
  { question: "Como estudar vocabulário de aviação eficientemente?", answer: "Estude por contexto, não por lista. Agrupe termos por situação (emergência, weather, ATC) e pratique usando-os em frases completas, não apenas memorizando traduções." },
  { question: "A prova cobra vocabulário específico de fraseologia?", answer: "A prova ICAO avalia inglês geral em contexto aeronáutico, não fraseologia padrão (que é avaliada separadamente). Porém, conhecer fraseologia ajuda na compreensão e interação." },
  { question: "Posso usar sinônimos durante a prova?", answer: "Sim. Usar sinônimos e parafrasear demonstra amplitude de vocabulário, o que é positivo para o descritor Vocabulary." },
];

function GlossaryTable({ terms }: { terms: { en: string; pt: string; context: string }[] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table>
        <thead>
          <tr><th>English</th><th>Português</th><th>Contexto</th></tr>
        </thead>
        <tbody>
          {terms.map((t) => (
            <tr key={t.en}><td className="font-medium">{t.en}</td><td>{t.pt}</td><td className="text-sm text-black/60">{t.context}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function VocabularioPage() {
  return (
    <ContentPageLayout slug={PAGE_SLUG} headings={headings} faqs={faqs}>
      <h2 id="glossario">Glossário de aviação em inglês</h2>
      <p>Este glossário reúne os termos mais importantes para a prova ICAO, organizados por categoria. Cada termo inclui a tradução e um contexto de uso.</p>

      <h3 id="aeroporto">Aeroporto e Aeródromo</h3>
      <GlossaryTable terms={[
        { en: "Apron / Ramp", pt: "Pátio de aeronaves", context: "Aircraft parked on the apron" },
        { en: "Runway", pt: "Pista de pouso/decolagem", context: "Runway 27L cleared for takeoff" },
        { en: "Taxiway", pt: "Pista de táxi", context: "Taxi via taxiway Alpha" },
        { en: "Threshold", pt: "Cabeceira da pista", context: "Displaced threshold on runway 09" },
        { en: "Holding bay", pt: "Área de espera", context: "Hold short at holding bay" },
        { en: "Control tower", pt: "Torre de controle", context: "Contact tower on 118.5" },
        { en: "Ground crew", pt: "Equipe de solo", context: "Ground crew clearing the FOD" },
        { en: "Terminal building", pt: "Terminal de passageiros", context: "Gate B12 at terminal 2" },
      ]} />

      <h3 id="aeronave">Sistemas da Aeronave</h3>
      <GlossaryTable terms={[
        { en: "Landing gear", pt: "Trem de pouso", context: "Landing gear failure, unable to extend" },
        { en: "Flaps", pt: "Flapes", context: "Flaps 30 for landing configuration" },
        { en: "Aileron", pt: "Aileron", context: "Aileron control difficulty" },
        { en: "Rudder", pt: "Leme", context: "Rudder pedal stuck" },
        { en: "Fuselage", pt: "Fuselagem", context: "Crack detected in the fuselage" },
        { en: "Engine", pt: "Motor", context: "Left engine flame-out" },
        { en: "Cockpit / Flight deck", pt: "Cabine de comando", context: "Smoke in the cockpit" },
        { en: "Avionics", pt: "Aviônica", context: "Avionics system malfunction" },
      ]} />

      <h3 id="atc">Comunicação ATC</h3>
      <GlossaryTable terms={[
        { en: "Clearance", pt: "Autorização", context: "Request IFR clearance to destination" },
        { en: "Squawk", pt: "Transponder code", context: "Squawk 7700 for emergency" },
        { en: "Altitude", pt: "Altitude", context: "Maintain flight level 350" },
        { en: "Heading", pt: "Proa", context: "Turn left heading 270" },
        { en: "Descent", pt: "Descida", context: "Cleared to descend to 3,000 feet" },
        { en: "Approach", pt: "Aproximação", context: "Request ILS approach runway 27" },
        { en: "Go-around", pt: "Arremetida", context: "Going around due to traffic on runway" },
        { en: "Hold / Holding pattern", pt: "Espera", context: "Hold at waypoint for sequencing" },
      ]} />

      <h3 id="emergencia">Emergência</h3>
      <GlossaryTable terms={[
        { en: "Mayday", pt: "Emergência", context: "Mayday, Mayday, engine failure" },
        { en: "Pan-Pan", pt: "Urgência", context: "Pan-Pan, passenger medical emergency" },
        { en: "Divert", pt: "Desviar", context: "Diverting to alternate airport" },
        { en: "Evacuate", pt: "Evacuar", context: "Evacuate through nearest exit" },
        { en: "Fire", pt: "Incêndio", context: "Engine fire, executing checklist" },
        { en: "Depressurization", pt: "Despressurização", context: "Rapid depressurization, emergency descent" },
        { en: "Bird strike", pt: "Colisão com ave", context: "Bird strike on takeoff, inspecting damage" },
        { en: "Fuel leak", pt: "Vazamento de combustível", context: "Fuel leak detected, requesting priority landing" },
      ]} />

      <h3 id="meteorologia">Meteorologia</h3>
      <GlossaryTable terms={[
        { en: "Turbulence", pt: "Turbulência", context: "Moderate turbulence at FL320" },
        { en: "Thunderstorm", pt: "Trovoada", context: "Thunderstorm activity along the route" },
        { en: "Visibility", pt: "Visibilidade", context: "Visibility reduced to 800 meters" },
        { en: "Crosswind", pt: "Vento de través", context: "Crosswind 15 knots from the right" },
        { en: "Icing", pt: "Formação de gelo", context: "Severe icing conditions reported" },
        { en: "Fog", pt: "Nevoeiro", context: "Fog reducing visibility below minimums" },
        { en: "Wind shear", pt: "Cisalhamento do vento", context: "Wind shear alert on final approach" },
        { en: "Ceiling", pt: "Teto de nuvens", context: "Ceiling 500 feet overcast" },
      ]} />

      <h3 id="navegacao">Navegação</h3>
      <GlossaryTable terms={[
        { en: "Waypoint", pt: "Ponto de referência", context: "Proceeding direct to waypoint ALPHA" },
        { en: "Flight plan", pt: "Plano de voo", context: "Filed flight plan for SBGR to SBBR" },
        { en: "ETA", pt: "Hora estimada de chegada", context: "ETA destination 14:30 UTC" },
        { en: "Alternate", pt: "Alternativa", context: "Alternate airport is SBSP" },
        { en: "SID / STAR", pt: "Saída/Chegada padrão", context: "Cleared SID DUMO2 departure" },
        { en: "VOR / NDB", pt: "Auxílios à navegação", context: "Tracking VOR radial 180" },
      ]} />

      <h2 id="como-usar">Como usar este vocabulário na prova ICAO</h2>
      <p>Na prova, você não será testado diretamente sobre definições. O examinador avalia se você consegue usar esses termos naturalmente em conversas sobre aviação. Dicas:</p>
      <ul>
        <li>Pratique usando os termos em frases completas, não apenas memorizando</li>
        <li>Estude por contexto: imagine cenários e descreva-os usando o vocabulário</li>
        <li>Use sinônimos para demonstrar amplitude de vocabulário</li>
        <li>Conheça os <Link href="/descritores-da-prova-icao">descritores</Link> para entender como Vocabulary é avaliado</li>
      </ul>

      <h2 id="por-parte">Vocabulário por parte da prova</h2>
      <p>Cada <Link href="/como-funciona-a-prova-icao">parte da prova</Link> usa vocabulário diferente:</p>
      <ul>
        <li><strong>Parte 1 (Aviation Topics):</strong> Vocabulário geral de aviação, sua experiência, rotinas</li>
        <li><strong>Parte 2 (Interacting):</strong> ATC communications, clearances, coordenação</li>
        <li><strong>Parte 3 (Unexpected):</strong> Emergências, weather phenomena, malfunctions</li>
        <li><strong>Parte 4 (Pictures):</strong> Descrição visual, aeroporto, acidentes, cenários</li>
      </ul>
    </ContentPageLayout>
  );
}
