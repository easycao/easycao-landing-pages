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
  { id: "glossario", text: "Glossario de aviacao em ingles", level: 2 },
  { id: "aeroporto", text: "Aeroporto e Aerodromo", level: 3 },
  { id: "aeronave", text: "Sistemas da Aeronave", level: 3 },
  { id: "atc", text: "Comunicacao ATC", level: 3 },
  { id: "emergencia", text: "Emergencia", level: 3 },
  { id: "meteorologia", text: "Meteorologia", level: 3 },
  { id: "navegacao", text: "Navegacao", level: 3 },
  { id: "como-usar", text: "Como usar este vocabulario na prova ICAO", level: 2 },
  { id: "por-parte", text: "Vocabulario por parte da prova", level: 2 },
];

const faqs = [
  { question: "Quantas palavras de aviacao preciso saber para a prova?", answer: "Nao ha um numero exato, mas dominar 150-200 termos tecnicos de aviacao em ingles, combinado com vocabulario geral, e suficiente para Level 4-5." },
  { question: "Preciso saber vocabulario tecnico muito avancado?", answer: "Para Level 4, vocabulario 'suficiente' e adequado. Para Level 5-6, espera-se vocabulario 'amplo e preciso'. Foque nos termos que aparecem em situacoes reais de comunicacao." },
  { question: "Como estudar vocabulario de aviacao eficientemente?", answer: "Estude por contexto, nao por lista. Agrupe termos por situacao (emergencia, weather, ATC) e pratique usando-os em frases completas, nao apenas memorizando traducoes." },
  { question: "A prova cobra vocabulario especifico de fraseologia?", answer: "A prova ICAO avalia ingles geral em contexto aeronautico, nao fraseologia padrao (que e avaliada separadamente). Porem, conhecer fraseologia ajuda na compreensao e interacao." },
  { question: "Posso usar sinonimos durante a prova?", answer: "Sim. Usar sinonimos e parafrasear demonstra amplitude de vocabulario, o que e positivo para o descritor Vocabulary." },
];

function GlossaryTable({ terms }: { terms: { en: string; pt: string; context: string }[] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table>
        <thead>
          <tr><th>English</th><th>Portugues</th><th>Contexto</th></tr>
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
      <h2 id="glossario">Glossario de aviacao em ingles</h2>
      <p>Este glossario reune os termos mais importantes para a prova ICAO, organizados por categoria. Cada termo inclui a traducao e um contexto de uso.</p>

      <h3 id="aeroporto">Aeroporto e Aerodromo</h3>
      <GlossaryTable terms={[
        { en: "Apron / Ramp", pt: "Patio de aeronaves", context: "Aircraft parked on the apron" },
        { en: "Runway", pt: "Pista de pouso/decolagem", context: "Runway 27L cleared for takeoff" },
        { en: "Taxiway", pt: "Pista de taxi", context: "Taxi via taxiway Alpha" },
        { en: "Threshold", pt: "Cabeceira da pista", context: "Displaced threshold on runway 09" },
        { en: "Holding bay", pt: "Area de espera", context: "Hold short at holding bay" },
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
        { en: "Avionics", pt: "Avionica", context: "Avionics system malfunction" },
      ]} />

      <h3 id="atc">Comunicacao ATC</h3>
      <GlossaryTable terms={[
        { en: "Clearance", pt: "Autorizacao", context: "Request IFR clearance to destination" },
        { en: "Squawk", pt: "Transponder code", context: "Squawk 7700 for emergency" },
        { en: "Altitude", pt: "Altitude", context: "Maintain flight level 350" },
        { en: "Heading", pt: "Proa", context: "Turn left heading 270" },
        { en: "Descent", pt: "Descida", context: "Cleared to descend to 3,000 feet" },
        { en: "Approach", pt: "Aproximacao", context: "Request ILS approach runway 27" },
        { en: "Go-around", pt: "Arremetida", context: "Going around due to traffic on runway" },
        { en: "Hold / Holding pattern", pt: "Espera", context: "Hold at waypoint for sequencing" },
      ]} />

      <h3 id="emergencia">Emergencia</h3>
      <GlossaryTable terms={[
        { en: "Mayday", pt: "Emergencia", context: "Mayday, Mayday, engine failure" },
        { en: "Pan-Pan", pt: "Urgencia", context: "Pan-Pan, passenger medical emergency" },
        { en: "Divert", pt: "Desviar", context: "Diverting to alternate airport" },
        { en: "Evacuate", pt: "Evacuar", context: "Evacuate through nearest exit" },
        { en: "Fire", pt: "Incendio", context: "Engine fire, executing checklist" },
        { en: "Depressurization", pt: "Despressurizacao", context: "Rapid depressurization, emergency descent" },
        { en: "Bird strike", pt: "Colisao com ave", context: "Bird strike on takeoff, inspecting damage" },
        { en: "Fuel leak", pt: "Vazamento de combustivel", context: "Fuel leak detected, requesting priority landing" },
      ]} />

      <h3 id="meteorologia">Meteorologia</h3>
      <GlossaryTable terms={[
        { en: "Turbulence", pt: "Turbulencia", context: "Moderate turbulence at FL320" },
        { en: "Thunderstorm", pt: "Trovoada", context: "Thunderstorm activity along the route" },
        { en: "Visibility", pt: "Visibilidade", context: "Visibility reduced to 800 meters" },
        { en: "Crosswind", pt: "Vento de traves", context: "Crosswind 15 knots from the right" },
        { en: "Icing", pt: "Formacao de gelo", context: "Severe icing conditions reported" },
        { en: "Fog", pt: "Nevoeiro", context: "Fog reducing visibility below minimums" },
        { en: "Wind shear", pt: "Cisalhamento do vento", context: "Wind shear alert on final approach" },
        { en: "Ceiling", pt: "Teto de nuvens", context: "Ceiling 500 feet overcast" },
      ]} />

      <h3 id="navegacao">Navegacao</h3>
      <GlossaryTable terms={[
        { en: "Waypoint", pt: "Ponto de referencia", context: "Proceeding direct to waypoint ALPHA" },
        { en: "Flight plan", pt: "Plano de voo", context: "Filed flight plan for SBGR to SBBR" },
        { en: "ETA", pt: "Hora estimada de chegada", context: "ETA destination 14:30 UTC" },
        { en: "Alternate", pt: "Alternativa", context: "Alternate airport is SBSP" },
        { en: "SID / STAR", pt: "Saida/Chegada padrao", context: "Cleared SID DUMO2 departure" },
        { en: "VOR / NDB", pt: "Auxilios a navegacao", context: "Tracking VOR radial 180" },
      ]} />

      <h2 id="como-usar">Como usar este vocabulario na prova ICAO</h2>
      <p>Na prova, voce nao sera testado diretamente sobre definicoes. O examinador avalia se voce consegue usar esses termos naturalmente em conversas sobre aviacao. Dicas:</p>
      <ul>
        <li>Pratique usando os termos em frases completas, nao apenas memorizando</li>
        <li>Estude por contexto: imagine cenarios e descreva-os usando o vocabulario</li>
        <li>Use sinonimos para demonstrar amplitude de vocabulario</li>
        <li>Conheza os <Link href="/descritores-da-prova-icao">descritores</Link> para entender como Vocabulary e avaliado</li>
      </ul>

      <h2 id="por-parte">Vocabulario por parte da prova</h2>
      <p>Cada <Link href="/como-funciona-a-prova-icao">parte da prova</Link> usa vocabulario diferente:</p>
      <ul>
        <li><strong>Parte 1 (Aviation Topics):</strong> Vocabulario geral de aviacao, sua experiencia, rotinas</li>
        <li><strong>Parte 2 (Interacting):</strong> ATC communications, clearances, coordenacao</li>
        <li><strong>Parte 3 (Unexpected):</strong> Emergencias, weather phenomena, malfunctions</li>
        <li><strong>Parte 4 (Pictures):</strong> Descricao visual, aeroporto, acidentes, cenarios</li>
      </ul>
    </ContentPageLayout>
  );
}
