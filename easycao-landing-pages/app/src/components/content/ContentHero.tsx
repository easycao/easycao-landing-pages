"use client";

import { useEffect, useRef, useCallback } from "react";
import { useScrollProgress } from "../useScrollProgress";
import Breadcrumbs from "./Breadcrumbs";
import ArticleMeta from "./ArticleMeta";

/* ── SVG Cloud silhouettes ────────────────────────────────── */
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
}[] = [
  { Cloud: CloudA, width: "w-48 lg:w-64", top: "5%", left: "-4%", speed: 0.08, blur: 12 },
  { Cloud: CloudB, width: "w-36 lg:w-48", top: "25%", left: "65%", speed: 0.14, blur: 10 },
  { Cloud: CloudC, width: "w-28 lg:w-36", top: "55%", left: "8%", speed: 0.18, blur: 14 },
];

/* ── Mouse spotlight hook ─────────────────────────────────── */
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

/* ── Component ────────────────────────────────────────────── */
interface ContentHeroProps {
  title: string;
  updatedAt: string;
  readingTime: number;
}

export default function ContentHero({ title, updatedAt, readingTime }: ContentHeroProps) {
  const { containerRef, progress } = useScrollProgress();
  const spotlightRef = useMouseSpotlight();

  return (
    <section
      ref={containerRef}
      className="hero-noise relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary py-16 lg:py-20 overflow-hidden"
    >
      {/* Radial orbs */}
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

      {/* Mouse spotlight */}
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
      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8">
        <div className="hero-animate" style={{ animationDelay: "0.08s" }}>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: title },
            ]}
          />
        </div>
        <h1
          className="hero-animate text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight max-w-3xl text-transparent bg-clip-text"
          style={{
            animationDelay: "0.22s",
            backgroundImage: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          {title}
        </h1>
        <div className="hero-animate" style={{ animationDelay: "0.36s" }}>
          <ArticleMeta updatedAt={updatedAt} readingTime={readingTime} />
        </div>
      </div>
    </section>
  );
}
