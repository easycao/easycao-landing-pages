"use client";

import { WHATSAPP_SUPPORT_URL } from "../../../lib/constants";

export default function FinalCTA() {
  return (
    <section className="hero-noise relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary py-16 lg:py-20 overflow-hidden">
      <div className="relative z-10 max-w-xl mx-auto px-5 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          Ficou com alguma dúvida?
        </h2>
        <p className="text-white/70 mb-8">
          Estamos prontos para ajudar. Fale diretamente com nossa equipe pelo
          WhatsApp.
        </p>

        <a
          href={WHATSAPP_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-10 py-4 font-bold text-white transition-all duration-300 ease-out active:scale-[0.97]"
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
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
          Tirar dúvidas
        </a>
      </div>
    </section>
  );
}
