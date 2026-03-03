import Link from "next/link";
import { HOTMART_CHECKOUT_URL } from "../../lib/constants";

export default function HomepageHero() {
  return (
    <section className="relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-primary-light/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 text-center py-20">
        <h1 className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-white leading-tight mb-6">
          Tudo que voce precisa para ser aprovado no ICAO
        </h1>
        <p className="text-base lg:text-xl text-white/80 max-w-2xl mx-auto mb-10">
          A maior escola de preparacao para a prova ICAO do Brasil. Criada pelo
          unico examinador credenciado que ensina.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-light hover:bg-primary text-white font-bold rounded-xl px-8 py-4 text-lg transition-all hover:scale-[1.02]"
          >
            Conhecer o Metodo
          </a>
          <Link
            href="/lives"
            className="text-white/60 hover:text-white underline transition-colors"
          >
            Ou participe das lives gratuitas
          </Link>
        </div>
      </div>
    </section>
  );
}
