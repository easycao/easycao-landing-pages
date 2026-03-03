export default function TestimonialsGrid() {
  const testimonials = [
    {
      name: "Cap. Marcos R.",
      result: "Level 5",
      quote:
        "Depois de reprovar 2 vezes estudando sozinho, passei com Level 5 no primeiro simulado com o metodo. O Diogo sabe exatamente o que o examinador espera.",
    },
    {
      name: "1o Ten. Fernanda S.",
      result: "Level 4",
      quote:
        "As lives gratuitas ja me ajudaram muito, mas o metodo completo foi o que fez a diferenca. Em 3 meses sai do zero para Level 4.",
    },
    {
      name: "Cmte. Ricardo L.",
      result: "Level 5",
      quote:
        "O simulador do app e incrivel. Pratiquei todos os dias durante 2 meses e fui muito mais confiante para a prova. Recomendo demais.",
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3 text-center">
          Resultados reais
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10 text-center">
          Veja quem ja passou com o Metodo Easycao
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-gray-light rounded-2xl p-6 border border-gray-border"
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-black/70 text-sm leading-relaxed mb-4 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-black">{t.name}</p>
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-lg">
                  {t.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
