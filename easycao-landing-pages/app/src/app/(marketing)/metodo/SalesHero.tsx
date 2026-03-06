"use client";

import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";
import { useScrollProgress } from "../../../components/useScrollProgress";
import { HOTMART_CHECKOUT_URL, WHATSAPP_SUPPORT_URL } from "../../../lib/constants";

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
  { Cloud: CloudA, width: "w-56 sm:w-64 lg:w-80", top: "5%", left: "-4%", speed: 0.08, blur: 12 },
  { Cloud: CloudC, width: "w-32 sm:w-36 lg:w-44", top: "58%", left: "6%", speed: 0.2, blur: 14 },
  { Cloud: CloudC, width: "w-28 lg:w-36", top: "12%", left: "36%", speed: 0.18, blur: 10, desktopOnly: true },
];

/* ── Mouse spotlight hook ─────────────────────────────────────── */
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

/* ── 3 Factors data ───────────────────────────────────────────── */
const factors = [
  {
    number: "1",
    text: "Qual o inglês necessário para a aprovação na ICAO e como aprendê-lo de forma simples",
    mobileText: "Qual o Inglês necessário para a aprovação",
  },
  {
    number: "2",
    text: "Como evitar as armadilhas da prova que podem comprometer seu resultado",
    mobileText: "Como evitar armadilhas na prova",
  },
  {
    number: "3",
    text: "O diferencial que separa os pilotos aprovados dos que não passam – algo que vai muito além do inglês",
    mobileText: "O que separa os aprovados dos reprovados",
  },
];

export default function SalesHero() {
  const { containerRef, progress } = useScrollProgress();
  const spotlightRef = useMouseSpotlight();

  return (
    <section
      ref={containerRef}
      className="hero-noise relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary overflow-hidden"
    >
      {/* ── Radial orbs ── */}
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

      {/* ── Content ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center pt-8 lg:pt-10 pb-20 lg:pb-24 flex flex-col items-center">
        {/* Logo + label */}
        <div
          className="hero-animate mb-6 inline-flex items-center gap-3 rounded-full px-5 py-2 text-sm text-white/80"
          style={{
            animationDelay: "0.08s",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <Image
            src="/favicon.webp"
            alt="Easycao"
            width={24}
            height={24}
            className="rounded-sm"
          />
          Método Easycao
        </div>

        {/* Title */}
        <h1
          className="hero-animate font-extrabold leading-[1.08] tracking-[-0.03em] text-transparent bg-clip-text mb-5"
          style={{
            animationDelay: "0.22s",
            fontSize: "clamp(2rem, 5vw + 0.5rem, 3.75rem)",
            backgroundImage: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)",
            WebkitBackgroundClip: "text",
            textShadow: "0 0 40px rgba(31,150,247,0.12), 0 0 80px rgba(31,150,247,0.06)",
          }}
        >
          Como ser aprovado no Exame ICAO
        </h1>

        {/* Subtitle */}
        <p
          className="hero-animate mx-auto mb-5 whitespace-nowrap"
          style={{
            animationDelay: "0.36s",
            fontSize: "clamp(0.6rem, 1vw + 0.55rem, 1.05rem)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          <span className="sm:hidden">Os 3 fatores que levam qualquer piloto ao ICAO</span>
          <span className="hidden sm:inline">Descubra os 3 fatores que levam qualquer piloto do zero ao ICAO em 6 meses</span>
        </p>

        {/* 3 Factor items — single-line rows */}
        <div
          className="hero-animate w-full flex flex-col gap-2 mb-10"
          style={{ animationDelay: "0.44s" }}
        >
          {factors.map((f) => (
            <div
              key={f.number}
              className="text-left rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-3"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <div className="shrink-0 w-7 h-7 rounded-full bg-[#7DCCFF]/20 flex items-center justify-center">
                <span className="text-[#7DCCFF] font-bold text-xs">{f.number}</span>
              </div>
              <p className="text-white/80 whitespace-nowrap" style={{ fontSize: "clamp(0.75rem, 1vw + 0.45rem, 0.875rem)" }}>
                <span className="sm:hidden">{f.mobileText}</span>
                <span className="hidden sm:inline">{f.text}</span>
              </p>
            </div>
          ))}
        </div>

        {/* VSL — YouTube embed with glass frame */}
        <div
          className="hero-animate w-full rounded-2xl p-1 sm:p-1.5 mb-10"
          style={{
            animationDelay: "0.52s",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="w-full aspect-video rounded-xl overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/dmyW0MU7_Xo?rel=0"
              title="Método Easycao — Como ser aprovado no Exame ICAO"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* CTAs */}
        <div
          className="hero-animate flex flex-col sm:flex-row items-stretch justify-center gap-4 w-full max-w-2xl"
          style={{ animationDelay: "0.6s" }}
        >
          {/* Primary CTA */}
          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta relative flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-bold text-white text-[15px] transition-all duration-300 ease-out active:scale-[0.97]"
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
            Quero ser aprovado no exame
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>

          {/* Secondary CTA — WhatsApp button */}
          <a
            href={WHATSAPP_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-bold text-white text-[15px] transition-all duration-300 ease-out active:scale-[0.97]"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.18)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.10)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Fale com nossa equipe
          </a>
        </div>

        {/* Trust badges */}
        <div
          className="hero-animate flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-white/50"
          style={{ animationDelay: "0.68s" }}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#7DCCFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            +1000 pilotos
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#7DCCFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Garantia de 7 dias
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#7DCCFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Acesso imediato
          </span>
        </div>
      </div>
    </section>
  );
}
