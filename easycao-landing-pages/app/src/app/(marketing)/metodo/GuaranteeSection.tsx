export default function GuaranteeSection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <div className="bg-green-100 rounded-full p-4 w-fit mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">
          Garantia incondicional de 7 dias
        </h2>
        <p className="text-black/70 leading-relaxed max-w-lg mx-auto">
          Se você não gostar do método por qualquer motivo, devolvemos 100% do
          seu dinheiro em até 7 dias. Sem perguntas, sem burocracia. O risco
          é todo nosso.
        </p>
      </div>
    </section>
  );
}
