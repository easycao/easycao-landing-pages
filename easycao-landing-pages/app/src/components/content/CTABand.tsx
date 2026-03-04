import Link from "next/link";
import { HOTMART_CHECKOUT_URL } from "../../lib/constants";

interface CTABandProps {
  variant?: "metodo" | "lives";
}

export default function CTABand({ variant = "metodo" }: CTABandProps) {
  if (variant === "lives") {
    return (
      <section className="bg-gradient-to-r from-primary to-primary-dark py-16 text-center">
        <div className="max-w-xl mx-auto px-5">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Participe das lives gratuitas
          </h2>
          <p className="text-white/70 mb-6">
            Aulas ao vivo e simulados toda semana com examinador ICAO credenciado.
          </p>
          <Link
            href="/lives"
            className="inline-block bg-white text-primary font-bold rounded-xl px-8 py-4 hover:bg-white/90 transition-all hover:scale-[1.02]"
          >
            Participar
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-16 text-center">
      <div className="max-w-xl mx-auto px-5">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          Pronto para ser aprovado?
        </h2>
        <p className="text-white/70 mb-6">
          Conheça o método criado pelo único examinador ICAO credenciado que ensina.
        </p>
        <a
          href={HOTMART_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-primary font-bold rounded-xl px-8 py-4 hover:bg-white/90 transition-all hover:scale-[1.02]"
        >
          Conhecer o Metodo
        </a>
      </div>
    </section>
  );
}
