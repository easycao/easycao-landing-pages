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
            <span>Terca 19h — Instagram</span>
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
          className="inline-block bg-primary hover:bg-primary-dark text-white font-bold rounded-xl px-8 py-4 transition-all hover:scale-[1.02]"
        >
          Participar
        </Link>
      </div>
    </section>
  );
}
