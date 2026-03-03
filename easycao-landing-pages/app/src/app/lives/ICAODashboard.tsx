"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const parts = [
  {
    number: "01",
    title: "Aviation Topics",
    description: "Perguntas sobre aviação e experiência como piloto",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: "#34B8F8",
  },
  {
    number: "02",
    title: "Interacting as a Pilot",
    description: "Comunicações entre piloto e controle de tráfego",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "#34B8F8",
  },
  {
    number: "03",
    title: "Unexpected Situations",
    description: "Diálogos de emergência gravados e reporte",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    color: "#34B8F8",
  },
  {
    number: "04",
    title: "Picture Description",
    description: "Descrever fotografias e argumentar temas",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    color: "#34B8F8",
  },
];

/* Positions relative to photo container — distributed across body */
const cardPositions = [
  { top: "5px", left: "12%", rotate: "-2deg", align: "left" },
  { top: "140px", right: "2%", rotate: "2deg", align: "right" },
  { top: "250px", left: "10%", rotate: "1.5deg", align: "left" },
  { top: "350px", right: "0%", rotate: "-1.5deg", align: "right" },
] as const;

export default function ICAODashboard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full">
      {/* Desktop: floating cards — positioned relative to photo container */}
      <div className="hidden lg:block absolute inset-0 z-[1]">
        {parts.map((part, i) => {
          const pos = cardPositions[i];
          return (
            <div
              key={part.number}
              className={`absolute z-0 ${pos.align === "left" ? "w-[42%]" : "w-[52%]"} transition-all duration-700 ${
                visible ? "opacity-55" : "opacity-0"
              }`}
              style={{
                ...pos,
                transform: visible
                  ? `rotate(${pos.rotate}) translateY(0px)`
                  : `rotate(${pos.rotate}) translateY(20px)`,
                transitionDelay: `${100 + i * 100}ms`,
              }}
            >
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <div className={`flex items-center gap-3 mb-2.5 ${pos.align === "right" ? "flex-row-reverse" : ""}`}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${part.color}20` }}
                  >
                    <div style={{ color: part.color }}>{part.icon}</div>
                  </div>
                  <div className={pos.align === "right" ? "text-right" : ""}>
                    <span
                      className="text-[10px] font-bold tracking-wider block"
                      style={{ color: part.color }}
                    >
                      PART {part.number}
                    </span>
                    <h4 className="text-white font-semibold text-sm leading-tight">
                      {part.title}
                    </h4>
                  </div>
                </div>
                <p className={`text-white/50 text-xs leading-relaxed ${pos.align === "right" ? "text-right" : ""}`}>
                  {part.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: compact — photo with cards behind head, glass box at bottom */}
      <div className="lg:hidden">
        <div
          className="relative"
          style={{ height: "220px" }}
        >
          {/* Floating cards — positioned behind Diogo's head/shoulders */}
          {parts.map((part, i) => {
            const mobilePos = [
              { top: "5px", left: "5px", rotate: "-3deg" },
              { top: "0px", right: "5px", rotate: "2.5deg" },
              { top: "80px", left: "0px", rotate: "2deg" },
              { top: "75px", right: "0px", rotate: "-2.5deg" },
            ][i];
            return (
              <div
                key={part.number}
                className={`absolute z-0 transition-all duration-600 ${
                  visible ? "opacity-40" : "opacity-0"
                }`}
                style={{
                  ...mobilePos,
                  transform: `rotate(${mobilePos.rotate})`,
                  transitionDelay: `${50 + i * 75}ms`,
                }}
              >
                <div
                  className="rounded-lg px-3 py-2.5 flex items-center gap-2"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${part.color}20` }}
                  >
                    <div style={{ color: part.color }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {i === 0 && <><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 12l10 5 10-5" /></>}
                        {i === 1 && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
                        {i === 2 && <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /></>}
                        {i === 3 && <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /></>}
                      </svg>
                    </div>
                  </div>
                  <span className="text-white/60 font-semibold text-[10px] whitespace-nowrap">
                    {part.title}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Photo — centered, large, aligned to bottom */}
          <Image
            src="/diogo.webp"
            alt="Prof. Diogo Verzola"
            width={500}
            height={600}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[2] h-[130%] w-auto object-cover object-bottom drop-shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
            priority
          />

          {/* Glass credential box — over photo at bottom */}
          <div
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-[3] w-[92%] max-w-[340px] transition-opacity duration-500 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "12px",
              padding: "10px 16px",
              transitionDelay: "300ms",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-xs">Prof. Diogo Verzola</p>
                <p className="text-white/60 text-[10px]">Examinador ICAO Credenciado</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[10px]">Métrica ICAO</p>
                <p className="text-white font-bold text-xs">Níveis 4 a 6</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
