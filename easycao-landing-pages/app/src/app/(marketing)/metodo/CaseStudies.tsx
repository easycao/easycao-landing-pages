"use client";

import { useRef, useState, useCallback } from "react";

const cases = [
  {
    name: "Renato",
    result: "Level 4",
    duration: "4 meses",
    quote: "Reprovei duas vezes estudando por conta. Com o método, entendi exatamente o que o examinador avalia e passei na terceira tentativa.",
    role: "Piloto Comercial",
  },
  {
    name: "Piloto FlightSafety",
    result: "Level 4",
    duration: "3 meses",
    quote: "O Diogo me mostrou que eu estava estudando inglês geral, não inglês de prova ICAO. Essa mudança de foco fez toda a diferença.",
    role: "Piloto FlightSafety",
  },
  {
    name: "Cmte. Faria",
    result: "Level 5",
    duration: "6 meses",
    quote: "Fiquei anos estagnado no Level 4. Com os módulos Advanced, finalmente consegui o Level 5 e garanti mais tempo sem renovação.",
    role: "Comandante",
  },
  {
    name: "Lucas",
    result: "Level 4",
    duration: "5 meses",
    quote: "Comecei do zero em inglês de aviação. O Módulo Zero me deu a base e em 5 meses eu já estava aprovado na primeira tentativa.",
    role: "Piloto Privado",
  },
];

export default function CaseStudies() {
  const [active, setActive] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartX = useRef(0);

  const pauseAllVideos = useCallback(() => {
    videoRefs.current.forEach((v) => {
      if (v && !v.paused) v.pause();
    });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(cases.length - 1, index));
      if (clamped !== active) {
        pauseAllVideos();
        setActive(clamped);
      }
    },
    [active, pauseAllVideos]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(active + (diff > 0 ? 1 : -1));
    }
  };

  const c = cases[active];

  return (
    <section className="bg-gray-light py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3 text-center">
          Casos reais
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4 text-center">
          Do zero ao ICAO
        </h2>
        <p className="text-black/60 text-center max-w-2xl mx-auto mb-10">
          Conheça histórias reais de pilotos que usaram o Método Easycao para conquistar a aprovação no exame ICAO.
        </p>

        {/* Slider */}
        <div
          className="relative max-w-3xl mx-auto"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Card — horizontal layout */}
          <div className="relative rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-6 bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary overflow-hidden">
            {/* Level tag — top right */}
            <span
              className="absolute top-4 right-4 text-white text-sm font-bold px-3 py-1.5 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.20)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.28)",
              }}
            >
              {c.result}
            </span>

            {/* Video placeholder — 9:16 */}
            <div
              className="w-full sm:w-72 shrink-0 aspect-[9/12] sm:aspect-[9/16] rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <div className="text-center text-white/30">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p className="text-sm">Vídeo em breve</p>
              </div>
              {/* Hidden video elements for future use */}
              {cases.map((_, i) => (
                <video
                  key={i}
                  ref={(el) => { videoRefs.current[i] = el; }}
                  className="hidden"
                  playsInline
                />
              ))}
            </div>

            {/* Text content */}
            <div className="flex flex-col flex-1 justify-start min-w-0">
              <p className="font-semibold text-xl lg:text-2xl text-white mb-2">{c.name}</p>

              <span className="text-base text-white/65 block mb-2 sm:mb-5">
                {c.duration} de preparação &middot; {c.role}
              </span>

              <p className="text-sm sm:text-lg lg:text-xl text-white/75 leading-relaxed italic">
                &ldquo;{c.quote}&rdquo;
              </p>
            </div>
          </div>

        </div>

        {/* Navigation — arrows + dots */}
        <div className="flex items-center justify-center gap-5 mt-6">
          <button
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            style={{
              background: "rgba(31,150,247,0.10)",
              border: "1px solid rgba(31,150,247,0.20)",
            }}
            aria-label="Anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {cases.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === active
                    ? "bg-primary scale-110"
                    : "bg-black/15 hover:bg-black/30"
                }`}
                aria-label={`Depoimento ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(active + 1)}
            disabled={active === cases.length - 1}
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            style={{
              background: "rgba(31,150,247,0.10)",
              border: "1px solid rgba(31,150,247,0.20)",
            }}
            aria-label="Próximo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
