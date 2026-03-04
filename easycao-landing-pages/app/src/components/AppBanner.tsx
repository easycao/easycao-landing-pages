"use client";

import Link from "next/link";
import { APP_STORE_URL, PLAY_STORE_URL } from "../lib/constants";

function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-300 active:scale-[0.97]"
        style={{
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.20)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.20)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.20)";
        }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        App Store
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-300 active:scale-[0.97]"
        style={{
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.20)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.20)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.20)";
        }}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.627L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
        </svg>
        Google Play
      </a>
    </div>
  );
}

function SectionVariant() {
  return (
    <section className="hero-noise relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary py-16 lg:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-base font-medium text-[#7DCCFF] uppercase tracking-widest mb-3">
              Simulador ICAO
            </p>
            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
              Pratique com o unico simulador ICAO do mercado
            </h2>
            <ul className="space-y-3 mb-6">
              {[
                "Grave suas respostas e receba feedback por descritor",
                "Banco de perguntas, áudios e imagens completo",
                "Baseado no Doc 9835 da ICAO",
                "Disponivel para iOS e Android",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/80">
                  <svg className="w-5 h-5 text-[#7DCCFF] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <StoreBadges />
          </div>

          {/* Phone mockup placeholder */}
          <div className="flex justify-center">
            <div className="w-64 h-[500px] bg-white/10 rounded-[40px] border-2 border-white/20 flex items-center justify-center">
              <div className="text-center text-white/40">
                <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                <p className="text-sm">App Screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InlineVariant() {
  return (
    <div className="bg-gray-light rounded-2xl p-6 my-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="bg-primary/10 rounded-xl p-3 shrink-0">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-black mb-1">
          Baixe o App Easycao e pratique com simulados reais
        </p>
        <p className="text-sm text-black/60 mb-3">
          Grave suas respostas e receba feedback automatico por descritor.
        </p>
        <StoreBadges />
      </div>
    </div>
  );
}

function SidebarVariant() {
  return (
    <div className="bg-gray-light rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-primary/10 rounded-xl p-2">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-sm text-black">Baixe gratis</p>
          <p className="text-xs text-black/50">Simulador ICAO</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-black text-white rounded-lg px-3 py-2 text-xs font-medium hover:bg-black/80 transition-colors"
        >
          App Store
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-black text-white rounded-lg px-3 py-2 text-xs font-medium hover:bg-black/80 transition-colors"
        >
          Google Play
        </a>
      </div>
    </div>
  );
}

interface AppBannerProps {
  variant: "section" | "inline" | "sidebar";
}

export default function AppBanner({ variant }: AppBannerProps) {
  switch (variant) {
    case "section":
      return <SectionVariant />;
    case "inline":
      return <InlineVariant />;
    case "sidebar":
      return <SidebarVariant />;
  }
}
