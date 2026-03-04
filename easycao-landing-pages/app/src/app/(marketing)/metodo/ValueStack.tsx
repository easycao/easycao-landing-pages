import { HOTMART_CHECKOUT_URL } from "../../../lib/constants";

export default function ValueStack() {
  return (
    <section className="bg-gray-light py-16 lg:py-20">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          Investimento
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10">
          Comece a se preparar agora com a Easycao
        </h2>

        <div className="bg-white rounded-2xl border-2 border-primary p-8 shadow-lg">
          <p className="text-4xl font-bold text-primary mb-1">
            R$ 2.957 <span className="text-xl font-semibold">à vista</span>
          </p>
          <p className="text-sm text-black/40 mb-6">
            ou 12x de R$ 305,82
          </p>

          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta relative inline-flex items-center justify-center w-full overflow-hidden bg-primary hover:bg-[#1888e0] text-white font-bold text-lg rounded-full px-8 py-4 shadow-[0_2px_8px_rgba(31,150,247,0.3)] hover:shadow-[0_4px_16px_rgba(31,150,247,0.45)] active:scale-[0.97] transition-all duration-300 ease-out"
          >
            <span className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(45deg,transparent_25%,rgba(52,184,248,0.45)_50%,transparent_75%)] bg-[length:250%_250%] bg-[position:200%_0] group-hover/cta:bg-[position:-100%_0] transition-[background-position] duration-[800ms] ease-out pointer-events-none" />
            <span className="relative">Quero ser aprovado no ICAO</span>
          </a>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-black/40">
            <span>Acesso imediato</span>
            <span>•</span>
            <span>Garantia de 7 dias</span>
            <span>•</span>
            <span>Pagamento seguro</span>
          </div>
        </div>
      </div>
    </section>
  );
}
