import { HOTMART_CHECKOUT_URL, WHATSAPP_SUPPORT_URL } from "../../../lib/constants";

export default function FinalCTA() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-dark py-16 lg:py-20 text-center">
      <div className="max-w-xl mx-auto px-5">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          Nao deixe sua carreira esperando
        </h2>
        <p className="text-white/80 mb-8">
          Cada dia sem a proficiencia ICAO e um dia a menos na sua carreira
          internacional. Comece agora e esteja pronto para a prova.
        </p>
        <a
          href={HOTMART_CHECKOUT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-primary font-bold rounded-xl px-8 py-4 text-lg hover:bg-white/90 transition-all hover:scale-[1.02] mb-4"
        >
          Quero me matricular agora
        </a>
        <p className="text-white/50 text-sm">
          Duvidas?{" "}
          <a
            href={WHATSAPP_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white underline"
          >
            Fale conosco no WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
