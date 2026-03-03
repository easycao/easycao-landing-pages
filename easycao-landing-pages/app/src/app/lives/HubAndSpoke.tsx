"use client";

import Image from "next/image";
import { useInView } from "@/components/useInView";

const spokes = [
  {
    icon: "🎯",
    title: "Como a prova realmente funciona",
    description:
      "Entenda a estrutura completa, os criterios de avaliacao e o que os examinadores esperam de voce em cada uma das 4 partes.",
    stat: "4 partes",
    statLabel: "do exame",
  },
  {
    icon: "🚫",
    title: "Por que decorar respostas nao funciona",
    description:
      "O examinador SEMPRE muda a pergunta. Respostas decoradas travam quando o cenario e diferente. Aprenda a responder com naturalidade.",
    stat: "#1",
    statLabel: "erro dos pilotos",
  },
  {
    icon: "📋",
    title: "O que o examinador realmente avalia",
    description:
      "Evidencias de fala separadas pela Metrica ICAO em 6 descritores. Nao e sobre ingles perfeito — e sobre comportamento linguistico.",
    stat: "6",
    statLabel: "descritores",
  },
  {
    icon: "🎧",
    title: "Como responder sem entender tudo",
    description:
      "Resposta funcional vale mais que compreensao total. Aprenda a lidar com a duvida e reagir bem mesmo quando nao entende cada palavra.",
    stat: "100%",
    statLabel: "pratico",
  },
];

export default function HubAndSpoke() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section ref={ref} className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-light/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-5 lg:px-8 relative">
        <div className="text-center mb-14 lg:mb-20">
          <span
            className={`inline-block text-primary font-medium text-sm uppercase tracking-widest mb-3 transition-all duration-600 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            Toda semana, ao vivo e gratuito
          </span>
          <h2
            className={`text-2xl lg:text-4xl font-bold text-black transition-all duration-600 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            O que voce vai aprender
          </h2>
        </div>

        {/* Desktop layout: 2x2 grid with center hub */}
        <div className="hidden lg:block relative">
          {/* Center hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div
              className={`w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center transition-all duration-800 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <Image
                src="/logo.webp"
                alt="Easycao"
                width={56}
                height={56}
                className="w-14 h-14"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-32 gap-y-6">
            {spokes.map((spoke, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={spoke.title}
                  className={`group relative bg-white border border-gray-border hover:border-primary/30 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : isLeft
                        ? "opacity-0 -translate-x-8"
                        : "opacity-0 translate-x-8"
                  }`}
                  style={{ transitionDelay: `${200 + i * 150}ms` }}
                >
                  {/* Accent line */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderRadius: "1rem 0 0 1rem" }} />

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                      {spoke.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-black text-base group-hover:text-primary transition-colors duration-300">
                        {spoke.title}
                      </h3>
                      <p className="text-black/60 text-sm mt-2 leading-relaxed">
                        {spoke.description}
                      </p>
                    </div>
                  </div>

                  {/* Stat badge */}
                  <div className="absolute -top-3 -right-3 bg-primary text-white rounded-xl px-3 py-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <span className="font-bold text-sm">{spoke.stat}</span>
                    <span className="text-white/70 text-[10px] ml-1">
                      {spoke.statLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden space-y-4">
          {/* Hub icon mobile */}
          <div className="flex justify-center mb-8">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center transition-all duration-600 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            >
              <Image
                src="/logo.webp"
                alt="Easycao"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
          </div>

          {spokes.map((spoke, i) => (
            <div
              key={spoke.title}
              className={`bg-white border border-gray-border rounded-xl p-5 shadow-sm transition-all duration-600 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                  {spoke.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-black text-sm">
                    {spoke.title}
                  </h3>
                  <p className="text-black/60 text-xs mt-1.5 leading-relaxed">
                    {spoke.description}
                  </p>
                  <span className="inline-block text-primary font-bold text-xs bg-primary/10 px-2 py-0.5 rounded-full mt-2">
                    {spoke.stat} <span className="text-primary/60 font-medium">{spoke.statLabel}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
