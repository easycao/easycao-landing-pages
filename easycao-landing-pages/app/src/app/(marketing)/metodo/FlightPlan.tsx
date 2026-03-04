"use client";

import { useScrollProgress } from "../../../components/useScrollProgress";
import { HOTMART_CHECKOUT_URL } from "../../../lib/constants";

/* ── SVG Cloud silhouettes ────────────────────────────────────── */
function CloudA({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 80" fill="rgba(255,255,255,0.18)" preserveAspectRatio="xMidYMid meet">
      <path d="M20 70 Q20 50 40 50 Q35 30 55 25 Q60 5 85 10 Q100 0 120 10 Q140 2 155 18 Q175 15 180 35 Q200 40 195 55 Q200 70 180 70 Z" />
    </svg>
  );
}

function CloudB({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="rgba(255,255,255,0.15)" preserveAspectRatio="xMidYMid meet">
      <path d="M4.5 9.75a6 6 0 0 1 11.573-2.226 3.75 3.75 0 0 1 4.133 4.303A4.5 4.5 0 0 1 18 20.25H6.75a5.25 5.25 0 0 1-2.23-10.004 6.072 6.072 0 0 1-.02-.496Z" />
    </svg>
  );
}

function CloudC({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="rgba(255,255,255,0.14)" preserveAspectRatio="xMidYMid meet">
      <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383" />
    </svg>
  );
}

const clouds: {
  Cloud: typeof CloudA;
  width: string;
  top: string;
  left: string;
  speed: number;
  blur: number;
  desktopOnly?: boolean;
}[] = [
  { Cloud: CloudA, width: "w-56 sm:w-64 lg:w-80", top: "3%", left: "-8%", speed: 0.06, blur: 12 },
  { Cloud: CloudB, width: "w-40 sm:w-48 lg:w-60", top: "25%", left: "78%", speed: 0.1, blur: 10 },
  { Cloud: CloudC, width: "w-32 sm:w-36 lg:w-44", top: "55%", left: "-6%", speed: 0.14, blur: 14 },
  { Cloud: CloudA, width: "w-48 sm:w-56 lg:w-72", top: "75%", left: "80%", speed: 0.08, blur: 15, desktopOnly: true },
  { Cloud: CloudC, width: "w-28 lg:w-36", top: "15%", left: "82%", speed: 0.12, blur: 10, desktopOnly: true },
];

/* ── Flight phases ────────────────────────────────────────────── */

interface FlightPhase {
  number: number;
  phase: string;
  title: string;
  description: string;
  eta: string;
  lessonCount: number;
  lessonLabel?: string;
  topics: string[];
}

const flightPhases: FlightPhase[] = [
  {
    number: 1,
    phase: "Clearance",
    title: "Aprenda a Falar Inglês",
    description: "Construa sua base e comece a falar inglês dentro da métrica ICAO, mesmo começando do zero.",
    eta: "28 dias",
    lessonCount: 44,
    topics: [
      "Orientação e cronograma de estudo",
      "A Técnica do 1,2,3",
      "Tempos verbais: presente, passado e futuro",
      "Presente contínuo e terceira pessoa",
      "Verbos especiais e modais",
      "Negativo e interrogativo",
      "Condicionais (IF / IF passado)",
      "Voz ativa e voz passiva",
      "Possessivos (my, your, his, her, its, their, our)",
      "Artigos e preposições",
      "Gerúndio e sujeito indeterminado",
    ],
  },
  {
    number: 2,
    phase: "Taxiing",
    title: "Vocabulário ICAO",
    description: "Domine o vocabulário aeronáutico essencial para qualquer situação da prova ICAO.",
    eta: "21 dias",
    lessonCount: 22,
    topics: [
      "Fumaça, fogo e temperatura",
      "Meteorologia e condições adversas",
      "Motor e sistemas de combustível",
      "Trem de pouso e pneus",
      "Pressurização e portas",
      "Sistemas hidráulicos e elétricos",
      "Bird strike e colisões",
      "Passageiros, saúde e tripulação",
    ],
  },
  {
    number: 3,
    phase: "Takeoff",
    title: "Parte 2: Interacting as a Pilot",
    description: "Aprenda os 8 passos da parte 2 da prova ICAO e como responder em cada um desses passos.",
    eta: "21 dias",
    lessonCount: 71,
    topics: [
      "Técnica dos Cenários e os 8 Passos",
      "Funções Report e Request",
      "Cotejamento (Readback) aprofundado",
      "Sistema ABC e Coringas",
      "Reported Speech completo",
      "Told Me / Asked Me",
      "Moldes de respostas fechadas",
    ],
  },
  {
    number: 4,
    phase: "Departure",
    title: "Parte 3: Unexpected Situations",
    description: "Domine as situações de emergência da prova ICAO com uma fórmula que funciona em qualquer situação.",
    eta: "28 dias",
    lessonCount: 57,
    lessonLabel: "57 aulas e 25 exercícios",
    topics: [
      "Jogo das 4 Pontas (Causa, Consequência, Evitar, Lidar)",
      "Frases de abertura e fechamento",
      "Comparativo e Superlativo",
      "Técnica da Escadinha",
      "Elaboração por cenário de pane",
      "Scripts de áudio e Reported Speech",
      "Exercícios de consolidação",
    ],
  },
  {
    number: 5,
    phase: "Cruise",
    title: "Parte 4: Picture Description",
    description: "Entenda como descrever cada uma das imagens da prova ICAO.",
    eta: "21 dias",
    lessonCount: 38,
    topics: [
      "Fórmula da Descrição de Figuras",
      "Danos, meteorologia e adjetivos",
      "Técnica dos Quadrantes",
      "Perguntas 1 a 6 da Parte 4",
      "Tipos de figuras (acidentes, operações, simulador)",
      "Passado, futuro e desfechos",
      "Statements e abridas",
    ],
  },
  {
    number: 6,
    phase: "Descent",
    title: "Parte 1: Aviation Topics",
    description: "Aqui você ficará pronto para responder qualquer uma das perguntas abertas do exame.",
    eta: "21 dias",
    lessonCount: 8,
    topics: [
      "Chave 1",
      "Chave 2",
      "Chave 3",
      "Chave 4",
      "Chave 5",
      "Chave 6",
      "Chave 7",
      "Sessões de prática guiada",
    ],
  },
  {
    number: 7,
    phase: "Approach",
    title: "Simulador ICAO + Mentorias",
    description: "Aplicação prática com correções em tempo real e apoio semanal do examinador ICAO.",
    eta: "21 dias",
    lessonCount: 25,
    topics: [
      "25 versões de simulados no App Easycao",
      "Mentorias semanais ao vivo",
      "Ajustes e correções em tempo real",
    ],
  },
  {
    number: 8,
    phase: "Landing",
    title: "Encontro de Alinhamento",
    description: "Encontro particular de 1h comigo para ajustar a proa e garantir que você está pronto para a aprovação.",
    eta: "7 dias",
    lessonCount: 1,
    topics: [
      "Sessão particular de 1 hora",
      "Análise personalizada do seu nível",
      "Ajuste de proa para a aprovação",
    ],
  },
];

const totalLessons = flightPhases.reduce((sum, p) => sum + p.lessonCount, 0);

export default function FlightPlan() {
  const { containerRef, progress } = useScrollProgress();

  return (
    <section
      ref={containerRef}
      className="hero-noise relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary py-16 lg:py-24 overflow-hidden"
    >
      {/* ── Clouds with parallax ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {clouds.map(({ Cloud, width, top, left, speed, blur, desktopOnly }, i) => (
          <div
            key={i}
            className={`absolute ${width} ${desktopOnly ? "hidden lg:block" : ""}`}
            style={{
              top,
              left,
              filter: `blur(${blur}px)`,
              transform: `translate3d(0, ${-progress * speed * 150}px, 0)`,
              willChange: "transform",
            }}
          >
            <Cloud className="w-full h-auto" />
          </div>
        ))}
      </div>

      {/* ── Radial orbs ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(52,184,248,0.35) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-5%] left-[-5%] w-[350px] h-[350px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(31,150,247,0.3) 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5">
        {/* Header */}
        <p className="text-sm font-medium text-[#7DCCFF] uppercase tracking-widest mb-3 text-center">
          Plano de voo
        </p>
        <h2 className="text-2xl lg:text-4xl font-bold text-white mb-12 text-center">
          Seu plano de voo até a aprovação
        </h2>

        {/* Accordion — 8 flight phases */}
        <div className="space-y-4">
          {flightPhases.map((fp) => (
            <details
              key={fp.number}
              className="group rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <summary
                className="cursor-pointer list-none p-5 sm:p-6 flex items-start gap-4"
              >
                {/* Phase number badge */}
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#7DCCFF]/20 flex items-center justify-center">
                  <span className="text-[#7DCCFF] font-bold text-sm">{fp.number}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-[#7DCCFF] text-xs font-semibold uppercase tracking-wider">
                      {fp.phase}
                    </span>
                    <span className="text-white/30 text-xs">•</span>
                    <span className="text-white/40 text-xs">{fp.lessonLabel || `${fp.lessonCount} ${fp.lessonCount === 1 ? "aula" : "aulas"}`}</span>
                    <span className="text-white/30 text-xs">•</span>
                    <span className="text-white/40 text-xs">ETA: {fp.eta}</span>
                  </div>
                  <h3 className="font-semibold text-white text-base sm:text-lg">{fp.title}</h3>
                  <p className="text-sm text-white/80 mt-1 hidden sm:block">{fp.description}</p>
                </div>

                {/* Chevron */}
                <svg
                  className="w-5 h-5 text-white/40 shrink-0 mt-2.5 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              {/* Expandable topics */}
              <div className="faq-answer">
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3">
                  {/* Description on mobile */}
                  <p className="text-sm text-white/80 mb-4 sm:hidden">{fp.description}</p>

                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 sm:grid-flow-col gap-2.5"
                    style={{ gridTemplateRows: `repeat(${Math.ceil(fp.topics.length / 2)}, minmax(0, 1fr))` }}
                  >
                    {fp.topics.map((topic, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl px-4 py-3"
                        style={{
                          background: "rgba(255,255,255,0.10)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.08)",
                        }}
                      >
                        <div className="shrink-0 w-6 h-6 rounded-full bg-[#7DCCFF]/15 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-[#7DCCFF]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-white/80">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>

        {/* Counter bar */}
        <div className="mt-12 text-center">
          <div
            className="inline-flex items-center gap-6 rounded-full px-8 py-3 mb-8"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{totalLessons}+</p>
              <p className="text-xs text-white/40">aulas</p>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-xs text-white/40">fases</p>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">6</p>
              <p className="text-xs text-white/40">meses</p>
            </div>
          </div>

          {/* Glass CTA */}
          <div>
            <a
              href={HOTMART_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-10 py-4 font-bold text-white transition-all duration-300 ease-out active:scale-[0.97]"
              style={{
                background: "rgba(255,255,255,0.20)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.28)",
                boxShadow: "0 0 20px rgba(31,150,247,0.25), 0 0 60px rgba(31,150,247,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.28)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.38)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(31,150,247,0.4), 0 0 80px rgba(31,150,247,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.20)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(31,150,247,0.25), 0 0 60px rgba(31,150,247,0.1)";
              }}
            >
              Quero começar meu plano de voo
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
