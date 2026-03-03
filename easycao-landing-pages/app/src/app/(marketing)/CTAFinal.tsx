import Link from "next/link";
import { HOTMART_CHECKOUT_URL } from "../../lib/constants";

export default function CTAFinal() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-16 lg:py-20 text-center">
      <div className="max-w-xl mx-auto px-5">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          Pronto para ser aprovado no ICAO?
        </h2>
        <p className="text-white/80 mb-8">
          Junte-se a mais de 1000 pilotos aprovados com o metodo do unico
          examinador ICAO credenciado que ensina no Brasil.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-primary font-bold rounded-xl px-8 py-4 hover:bg-white/90 transition-all hover:scale-[1.02]"
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
