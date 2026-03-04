"use client";

import Link from "next/link";
import { useEffect, useRef, useCallback } from "react";
import { useScrollProgress } from "../../components/useScrollProgress";

/* ── SVG Cloud silhouettes (will be heavily blurred) ────────── */
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

/* ── Cloud data ─────────────────────────────────────────────── */
const clouds: {
  Cloud: typeof CloudA;
  width: string;
  top: string;
  left: string;
  speed: number;
  blur: number;
  desktopOnly?: boolean;
}[] = [
  { Cloud: CloudA, width: "w-56 sm:w-64 lg:w-80", top: "5%", left: "-4%", speed: 0.08, blur: 12 },
  { Cloud: CloudB, width: "w-40 sm:w-48 lg:w-60", top: "20%", left: "62%", speed: 0.14, blur: 10 },
  { Cloud: CloudC, width: "w-32 sm:w-36 lg:w-44", top: "58%", left: "6%", speed: 0.2, blur: 14 },
  { Cloud: CloudA, width: "w-48 sm:w-56 lg:w-72", top: "48%", left: "70%", speed: 0.12, blur: 15, desktopOnly: true },
  { Cloud: CloudC, width: "w-28 lg:w-36", top: "12%", left: "36%", speed: 0.18, blur: 10, desktopOnly: true },
];

/* ── Mouse spotlight hook ───────────────────────────────────── */
function useMouseSpotlight() {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: MouseEvent) => {
    const el = overlayRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }, []);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const el = overlayRef.current;
    const parent = el?.parentElement;
    if (!parent) return;

    const onEnter = () => el!.style.setProperty("--spotlight-opacity", "1");
    const onLeave = () => el!.style.setProperty("--spotlight-opacity", "0");

    parent.addEventListener("mousemove", handleMove);
    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMove);
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [handleMove]);

  return overlayRef;
}

export default function HomepageHero() {
  const { containerRef, progress } = useScrollProgress();
  const spotlightRef = useMouseSpotlight();

  return (
    <section
      ref={containerRef}
      className="hero-noise relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* ── Radial orbs for atmospheric depth ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(52,184,248,0.4) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(31,150,247,0.35) 0%, transparent 65%)" }}
        />
      </div>

      {/* ── Mouse spotlight ── */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-500"
        aria-hidden="true"
        style={{
          opacity: "var(--spotlight-opacity, 0)",
          background:
            "radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(52,184,248,0.15), transparent 40%)",
        }}
      />

      {/* ── Heavily blurred clouds with parallax ── */}
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

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center py-20 flex flex-col items-center">
        {/* Credibility badge */}
        <div
          className="hero-animate mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white/75"
          style={{
            animationDelay: "0.08s",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          +1000 alunos Easycao
        </div>

        {/* Title — gradient text */}
        <h1
          className="hero-animate font-extrabold leading-[1.08] tracking-[-0.03em] text-transparent bg-clip-text mb-6"
          style={{
            animationDelay: "0.22s",
            fontSize: "clamp(2.25rem, 5vw + 0.5rem, 4.25rem)",
            backgroundImage: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)",
            WebkitBackgroundClip: "text",
            textShadow: "0 0 40px rgba(31,150,247,0.12), 0 0 80px rgba(31,150,247,0.06)",
          }}
        >
          Tudo que você precisa para ser aprovado na Prova ICAO
        </h1>

        {/* Subtitle */}
        <p
          className="hero-animate mx-auto max-w-[48ch] mb-12"
          style={{
            animationDelay: "0.36s",
            fontSize: "clamp(0.95rem, 1.5vw + 0.5rem, 1.25rem)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          A maior escola preparatória para a Prova ICAO no Brasil.
        </p>

        {/* CTA — glass effect with glow */}
        <div className="hero-animate flex items-center justify-center" style={{ animationDelay: "0.5s" }}>
          <Link
            href="/metodo"
            className="group/cta relative inline-flex items-center gap-2 rounded-full px-10 py-4 font-bold text-white transition-all duration-300 ease-out active:scale-[0.97]"
            style={{
              fontSize: "clamp(0.95rem, 1vw + 0.5rem, 1.125rem)",
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
            Conhecer o Método
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
