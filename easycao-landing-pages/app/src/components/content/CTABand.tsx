"use client";

import Link from "next/link";
import { useScrollProgress } from "../useScrollProgress";

/* ── Cloud silhouettes (matching site-wide pattern) ───────── */
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

const clouds: {
  Cloud: typeof CloudA;
  width: string;
  top: string;
  left: string;
  speed: number;
  blur: number;
}[] = [
  { Cloud: CloudA, width: "w-44 lg:w-56", top: "10%", left: "-3%", speed: 0.1, blur: 12 },
  { Cloud: CloudB, width: "w-32 lg:w-44", top: "40%", left: "70%", speed: 0.16, blur: 10 },
];

interface CTABandProps {
  variant?: "metodo" | "lives";
}

export default function CTABand({ variant = "metodo" }: CTABandProps) {
  const { containerRef, progress } = useScrollProgress();

  const isLives = variant === "lives";
  const heading = isLives
    ? "Participe das lives gratuitas"
    : "Pronto para ser aprovado?";
  const description = isLives
    ? "Aulas ao vivo e simulados toda semana com examinador ICAO credenciado."
    : "Conheça o método criado pelo único examinador ICAO credenciado que ensina.";
  const href = isLives ? "/lives" : "/metodo";
  const label = isLives ? "Participar" : "Conhecer o Método";

  return (
    <section
      ref={containerRef}
      className="hero-noise relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary py-16 text-center overflow-hidden"
    >
      {/* Radial orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute top-[-15%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(52,184,248,0.4) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-15%] left-[-5%] w-[350px] h-[350px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(31,150,247,0.35) 0%, transparent 65%)" }}
        />
      </div>

      {/* Clouds with parallax */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {clouds.map(({ Cloud, width, top, left, speed, blur }, i) => (
          <div
            key={i}
            className={`absolute ${width}`}
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

      {/* Content */}
      <div className="relative z-10 max-w-xl mx-auto px-5">
        <h2
          className="text-2xl lg:text-3xl font-bold mb-4 text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          {heading}
        </h2>
        <p className="text-white/70 mb-6">{description}</p>
        <Link
          href={href}
          className="inline-block font-bold rounded-xl px-8 py-4 text-white transition-all duration-300 active:scale-[0.97]"
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
          {label}
        </Link>
      </div>
    </section>
  );
}
