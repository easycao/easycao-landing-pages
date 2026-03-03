"use client";

import { useInView } from "@/components/useInView";

const lives = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    title: "Aula ao Vivo",
    day: "Terca-feira",
    time: "19h (Brasilia)",
    description:
      "Toda terca eu explico a prova ICAO do zero e tiro todas as suas duvidas ao vivo. Voce vai entender como o exame funciona, o que o examinador avalia e como se preparar do jeito certo — sem decorar respostas, sem metodos ultrapassados. E o melhor: ao vivo, interativo, com espaco pra perguntar.",
    tag: "Instagram Live",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
    title: "Simulado ICAO",
    day: "Quinta-feira",
    time: "13h30 (Brasilia)",
    description:
      "Toda quinta eu aplico uma Prova ICAO ao vivo usando o simulador ICAO, lendo e corrigindo as respostas que voces mandarem no chat em tempo real. Voce vai praticar exatamente como seria na prova de verdade — com feedback imediato do que funcionou e do que precisa melhorar.",
    tag: "YouTube Live",
  },
];

export default function LivesCards() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {lives.map((live, i) => (
        <div
          key={live.title}
          className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 lg:p-8 hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">{live.icon}</div>
            <span className="text-white text-xs font-medium bg-white/10 px-3 py-1 rounded-full">
              {live.tag}
            </span>
          </div>

          <h3 className="text-white font-bold text-xl lg:text-2xl mt-4">
            {live.title}
          </h3>
          <p className="text-white/80 font-medium text-sm lg:text-base mt-2">
            {live.day}
          </p>
          <p className="text-primary-light font-bold text-lg lg:text-xl">
            {live.time}
          </p>

          <p className="text-white/70 text-sm mt-4 leading-relaxed">
            {live.description}
          </p>
        </div>
      ))}
    </div>
  );
}
