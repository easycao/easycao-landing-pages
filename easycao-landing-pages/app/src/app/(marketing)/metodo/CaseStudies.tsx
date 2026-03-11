"use client";

import { useRef, useState, useCallback } from "react";

const cases = [
  {
    role: "Comandante de Jato",
    result: "ICAO 4",
    quote: "Eu já voava um jato, mas faltava o ICAO para poder realizar voos internacionais. Entrando na Easycao eu vi um Curso que ensina você O QUE e COMO estudar, eu saí do Inglês zero ao ICAO 4 e hoje já tenho 4 voos internacionais realizados!",
    videoId: "P4gQYttI34o",
  },
  {
    role: "Comandante",
    result: "ICAO 4",
    quote: "O ICAO era quase impossível pra mim, até que conheci a Easycao, foram 6 meses de muita dedicação e empenho, tanto por parte de mim quanto do Diogo e fui aprovado! A melhor notícia ainda estava pra vir: em menos de 1 mês a oportunidade bateu na porta, um novo emprego e uma nova máquina. Se você ainda não tem o ICAO na carteira, matricule-se na Easycao",
    videoId: "9aXmc7Rxie0",
  },
  {
    role: "Flight Safety",
    result: "ICAO 4",
    quote: "Eu passei por vários instrutores de inglês, cada um deles me ajudou de certa forma, mas eu encontrei no Diogo tudo que precisava, ele consegue juntar todos os elementos e te levar pro ICAO. Hoje eu só estou aqui na Flight Safety porque no início do ano eu fiz o ICAO com ele. O Curso da Easycao realmente é perfeito e eu recomendo a Easycao",
    videoId: "DuVvMBT82Wk",
  },
  {
    role: "Comandante",
    result: "ICAO 4",
    quote: "Eu tinha muita dificuldade no Inglês, gastei uma grana com professor particular e infelizmente sem resultado... Conheci a Easycao e depois de alguns meses consegui o ICAO 4 na carteira. O diferencial do método foram as mentorias ao vivo, me fizeram perder o medo de falar em público e ainda ser corrigido por um avaliador da prova fez muita diferença",
    videoId: "bYrz-gPBWus",
  },
];

export default function CaseStudies() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const touchStartX = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(cases.length - 1, index));
      if (clamped !== active) {
        setPlaying(null);
        setPaused(false);
        setActive(clamped);
      }
    },
    [active]
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

            {/* Video — thumbnail + lazy iframe on click */}
            <div
              className="relative w-full sm:w-72 shrink-0 aspect-[9/12] sm:aspect-[9/16] rounded-xl p-1 sm:p-1.5 cursor-pointer group/video"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
              onClick={() => {
                if (!playing) {
                  setPlaying(c.videoId);
                  setPaused(false);
                } else if (iframeRef.current?.contentWindow) {
                  const cmd = paused ? "playVideo" : "pauseVideo";
                  iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({ event: "command", func: cmd, args: "" }),
                    "*"
                  );
                  setPaused(!paused);
                }
              }}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                {playing === c.videoId ? (
                  <>
                    <iframe
                      ref={iframeRef}
                      src={`https://www.youtube-nocookie.com/embed/${c.videoId}?rel=0&autoplay=1&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&playsinline=1&disablekb=1&fs=0&enablejsapi=1`}
                      title={`Depoimento ${c.role}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      className="w-full h-full"
                    />
                    {/* Transparent overlay — blocks all YouTube UI interaction */}
                    <div className="absolute inset-0" />
                  </>
                ) : (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${c.videoId}/hqdefault.jpg`}
                      alt={`Depoimento ${c.role}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/30 transition-colors">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center group-hover/video:scale-110 transition-transform"
                        style={{
                          background: "rgba(255,255,255,0.20)",
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                          border: "1px solid rgba(255,255,255,0.28)",
                        }}
                      >
                        <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Text content */}
            <div className="flex flex-col flex-1 justify-start min-w-0">
              <p className="font-semibold text-xl lg:text-2xl text-white mb-3 sm:mb-5">{c.role}</p>

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
