"use client";

import Link from "next/link";
import { getPagesByCategory } from "../../lib/content-pages";
import { useScrollProgress } from "../../components/useScrollProgress";

/* ── Cloud silhouettes (same as hero, reused) ───────────────── */
function CloudA({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 80" fill="rgba(255,255,255,0.18)" preserveAspectRatio="xMidYMid meet">
      <path d="M20 70 Q20 50 40 50 Q35 30 55 25 Q60 5 85 10 Q100 0 120 10 Q140 2 155 18 Q175 15 180 35 Q200 40 195 55 Q200 70 180 70 Z" />
    </svg>
  );
}

function CloudB({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="rgba(255,255,255,0.14)" preserveAspectRatio="xMidYMid meet">
      <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383" />
    </svg>
  );
}

const clouds = [
  { Cloud: CloudA, width: "w-48 lg:w-64", top: "8%", left: "-3%", speed: 0.06, blur: 12 },
  { Cloud: CloudB, width: "w-32 lg:w-44", top: "65%", left: "75%", speed: 0.12, blur: 14 },
  { Cloud: CloudA, width: "w-36 lg:w-52", top: "40%", left: "80%", speed: 0.09, blur: 15, desktopOnly: true },
];

const ICONS = [
  // Descriptors - chart
  <svg key="d" className="w-6 h-6 text-[#7DCCFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>,
  // Preparation - book
  <svg key="p" className="w-6 h-6 text-[#7DCCFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>,
  // How it works - clipboard
  <svg key="h" className="w-6 h-6 text-[#7DCCFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>,
  // Levels - layers
  <svg key="l" className="w-6 h-6 text-[#7DCCFF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>,
];

export default function ContentHub() {
  const corePages = getPagesByCategory("core").slice(0, 4);
  const { containerRef, progress } = useScrollProgress();

  return (
    <section
      ref={containerRef}
      className="hero-noise relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary py-16 lg:py-20 overflow-hidden"
    >
      {/* ── Radial orbs ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute top-[-10%] right-[-8%] w-[450px] h-[450px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(52,184,248,0.4) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(31,150,247,0.35) 0%, transparent 65%)" }}
        />
      </div>

      {/* ── Blurred clouds with parallax ── */}
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
      <div className="relative z-10 max-w-5xl mx-auto px-5">
        <p className="text-sm font-medium text-[#7DCCFF] uppercase tracking-widest mb-3 text-center">
          Tudo sobre a Prova ICAO
        </p>
        <h2
          className="font-bold mb-10 text-center text-transparent bg-clip-text"
          style={{
            fontSize: "clamp(1.5rem, 3vw + 0.5rem, 2rem)",
            backgroundImage: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)",
            WebkitBackgroundClip: "text",
          }}
        >
          Entenda tudo sobre o exame
        </h2>

        {/* ── Glass cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {corePages.map((page, i) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="group rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              }}
            >
              <div
                className="rounded-xl p-3 w-fit mb-4"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {ICONS[i] || ICONS[0]}
              </div>
              <h3 className="font-semibold text-white mb-2">
                {page.title.replace(/:.*/, "").trim()}
              </h3>
              <p className="text-sm text-white/55 mb-3 line-clamp-2">
                {page.description}
              </p>
              <span className="text-sm text-[#7DCCFF] font-medium">
                Ler mais &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* ── CTA — glass button ── */}
        <div className="text-center mt-10">
          <Link
            href="/conteudos"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-bold text-white transition-all duration-300 active:scale-[0.97]"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.20)",
              boxShadow: "0 0 16px rgba(31,150,247,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.20)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(31,150,247,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.20)";
              e.currentTarget.style.boxShadow = "0 0 16px rgba(31,150,247,0.2)";
            }}
          >
            Ver todos os conteudos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
