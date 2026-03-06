import Link from "next/link";

export default function LivesBanner() {
  return (
    <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-5 text-center">
        <h2 className="text-xl lg:text-2xl font-bold text-black mb-4">
          Participe das lives gratuitas toda semana
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-black/60 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Terça 19h — Instagram</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Quinta 13h30 — YouTube</span>
          </div>
        </div>
        <Link
          href="/lives"
          className="group/cta relative inline-flex items-center overflow-hidden bg-primary hover:bg-[#1888e0] text-white font-bold text-[15px] rounded-full px-8 py-3 shadow-[0_2px_8px_rgba(31,150,247,0.3)] hover:shadow-[0_4px_16px_rgba(31,150,247,0.45)] active:scale-[0.97] transition-all duration-300 ease-out"
        >
          <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(45deg,transparent_25%,rgba(52,184,248,0.45)_50%,transparent_75%)] bg-[length:250%_250%] bg-[position:200%_0] group-hover/cta:bg-[position:-100%_0] transition-[background-position] duration-[800ms] ease-out pointer-events-none" />
          <span className="relative">Participar</span>
        </Link>
      </div>
    </section>
  );
}
