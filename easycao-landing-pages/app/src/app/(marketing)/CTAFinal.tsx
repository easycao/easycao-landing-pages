"use client";

import Link from "next/link";

export default function CTAFinal() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-16 lg:py-20 text-center">
      <div className="max-w-xl mx-auto px-5">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          Pronto para ser aprovado no exame ICAO?
        </h2>
        <p className="text-white/80 mb-8">
          Junte-se a mais de 1000 pilotos no Método criado por um Examinador
          ICAO Credenciado
        </p>
        <Link
          href="/metodo"
          className="inline-flex items-center gap-2 rounded-full px-10 py-4 font-bold text-white transition-all duration-300 ease-out active:scale-[0.97]"
          style={{
            fontSize: "clamp(0.95rem, 1vw + 0.5rem, 1.125rem)",
            background: "rgba(255,255,255,0.20)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.28)",
            boxShadow:
              "0 0 20px rgba(31,150,247,0.25), 0 0 60px rgba(31,150,247,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.28)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.38)";
            e.currentTarget.style.boxShadow =
              "0 0 30px rgba(31,150,247,0.4), 0 0 80px rgba(31,150,247,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.20)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)";
            e.currentTarget.style.boxShadow =
              "0 0 20px rgba(31,150,247,0.25), 0 0 60px rgba(31,150,247,0.1)";
          }}
        >
          Conhecer o Método
          <svg
            className="w-5 h-5 transition-transform duration-300"
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
    </section>
  );
}
