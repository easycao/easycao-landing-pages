"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function CheckAnimation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-16 h-16 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#1F96F7"
          strokeWidth="4"
          strokeDasharray="283"
          strokeDashoffset={show ? 0 : 283}
          style={{
            transition: "stroke-dashoffset 0.8s ease-out",
          }}
        />
        <polyline
          points="30,52 45,65 70,38"
          fill="none"
          stroke="#1F96F7"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="100"
          strokeDashoffset={show ? 0 : 100}
          style={{
            transition: "stroke-dashoffset 0.5s ease-out 0.5s",
          }}
        />
      </svg>
    </div>
  );
}

export default function ConfirmaCadastroPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event: "page_view", page_path: "/confirma-cadastro-lives" });
    }
  }, []);

  function handleWhatsAppClick() {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({ event: "whatsapp_click", page: "confirma-cadastro-lives" });
    }
    window.open("https://chat.whatsapp.com/BqNohPkBOY4DAD2T95vxpu", "_blank");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center px-5 py-16 relative overflow-x-hidden">
      {/* Wrapper — cards + main box */}
      <div className="relative max-w-lg w-full overflow-visible">
        {/* Floating Instagram card — desktop: left side, mobile: top-left */}
        <div
          className="absolute z-0 opacity-40 pointer-events-none left-2 -top-20 lg:-left-[280px] lg:top-[38%] scale-100 lg:scale-150 -rotate-6 origin-center"
        >
          <div
            className="rounded-2xl px-8 py-6 flex items-center gap-4"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(52,184,248,0.13)" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34B8F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider block text-[#34B8F8]">
                TERÇA 19H
              </span>
              <span className="text-white font-semibold text-base whitespace-nowrap">Instagram Live</span>
            </div>
          </div>
        </div>

        {/* Floating YouTube card — desktop: right side, mobile: bottom-right */}
        <div
          className="absolute z-0 opacity-40 pointer-events-none right-2 -bottom-20 lg:-right-[280px] lg:bottom-auto lg:top-[48%] scale-100 lg:scale-150 rotate-[5deg] origin-center"
        >
          <div
            className="rounded-2xl px-8 py-6 flex items-center gap-4"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(52,184,248,0.13)" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34B8F8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider block text-[#34B8F8]">
                QUINTA 13H30
              </span>
              <span className="text-white font-semibold text-base whitespace-nowrap">YouTube Live</span>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-2xl w-full p-10 lg:p-14 text-center relative z-10">
        <CheckAnimation />

        <h1 className="text-2xl lg:text-3xl font-bold text-black mt-6">
          Você está quase lá!
        </h1>

        <p className="text-black/70 text-base lg:text-lg mt-4">
          Agora entre no grupo do WhatsApp para receber os avisos das lives
        </p>

        <button
          onClick={handleWhatsAppClick}
          className="w-full mt-8 py-5 bg-whatsapp hover:bg-whatsapp-hover text-white font-bold text-sm lg:text-base uppercase rounded-xl shadow-lg hover:scale-[1.03] transition-all duration-300 animate-pulse-subtle flex items-center justify-center gap-3"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          ENTRAR NO GRUPO DO WHATSAPP
        </button>

        <div className="mt-8 pt-6 border-t border-gray-border">
          <p className="text-black/50 font-semibold text-xs uppercase tracking-wider">
            Horários das lives:
          </p>
          <div className="mt-3 space-y-1">
            <p className="text-black/60 text-sm">
              📅 Terça 19h — Aula ao vivo (Instagram)
            </p>
            <p className="text-black/60 text-sm">
              📅 Quinta 13h30 — Simulado ICAO (YouTube)
            </p>
          </div>
        </div>

        <div className="mt-8">
          <Image
            src="/logo.webp"
            alt="Easycao"
            width={32}
            height={32}
            className="mx-auto opacity-30"
          />
        </div>
      </div>
      </div>
    </main>
  );
}
