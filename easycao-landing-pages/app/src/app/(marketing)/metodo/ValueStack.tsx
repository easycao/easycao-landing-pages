import { HOTMART_CHECKOUT_URL } from "../../../lib/constants";

export default function ValueStack() {
  return (
    <section className="bg-gray-light py-16 lg:py-20">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          Investimento
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10">
          Quanto custa investir na sua aprovacao
        </h2>

        <div className="bg-white rounded-2xl border-2 border-primary p-8 shadow-lg">
          <div className="space-y-2 mb-6 text-left max-w-sm mx-auto">
            {[
              { label: "Metodo completo (6 modulos)", value: "R$ 1.997" },
              { label: "Comunidade exclusiva", value: "R$ 497" },
              { label: "Lives semanais", value: "R$ 997" },
              { label: "App Simulador ICAO", value: "R$ 697" },
              { label: "Material complementar", value: "R$ 297" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-black/60">{item.label}</span>
                <span className="text-black/40 line-through">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-border pt-6 mb-6">
            <p className="text-sm text-black/50 line-through mb-1">
              De R$ 4.485
            </p>
            <p className="text-sm text-black/60 mb-2">
              Por apenas
            </p>
            <p className="text-4xl font-bold text-primary mb-1">
              12x de R$ 97
            </p>
            <p className="text-sm text-black/50">
              ou R$ 997 a vista no PIX
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-3 mb-6">
            <p className="text-sm text-green-700 font-medium">
              Desconto de 15% no PIX — economize R$ 167
            </p>
          </div>

          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-primary-light hover:bg-primary text-white font-bold rounded-xl px-8 py-4 text-lg transition-all hover:scale-[1.02]"
          >
            Quero me matricular agora
          </a>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-black/40">
            <span>Acesso imediato</span>
            <span>•</span>
            <span>Garantia de 30 dias</span>
            <span>•</span>
            <span>Pagamento seguro</span>
          </div>
        </div>
      </div>
    </section>
  );
}
