import { HOTMART_CHECKOUT_URL } from "../../../lib/constants";

export default function SalesHero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary min-h-[70vh] flex items-center overflow-hidden">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-primary-light/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-medium text-primary-light uppercase tracking-widest mb-4">
              Metodo Easycao
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-white leading-tight mb-6">
              Seja aprovado no ICAO com o metodo do unico examinador credenciado
            </h1>
            <p className="text-base lg:text-lg text-white/80 mb-8 max-w-lg">
              O metodo que ja aprovou mais de 1000 pilotos. Criado por quem
              aplica a prova — e sabe exatamente o que e avaliado.
            </p>
            <a
              href={HOTMART_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary-light hover:bg-primary text-white font-bold rounded-xl px-8 py-4 text-lg transition-all hover:scale-[1.02] mb-6"
            >
              Quero me matricular
            </a>
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-light" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                +1000 aprovados
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-light" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Garantia de 30 dias
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-light" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Acesso imediato
              </span>
            </div>
          </div>

          {/* VSL Placeholder */}
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-video bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/15 transition-colors">
              <div className="text-center text-white/50">
                <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p className="text-sm">Video em breve</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
