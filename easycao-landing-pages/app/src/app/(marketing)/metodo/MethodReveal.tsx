export default function MethodReveal() {
  const differentiators = [
    {
      title: "Criado por examinador",
      description: "O metodo foi criado por quem aplica a prova e sabe exatamente o que e avaliado em cada descritor.",
    },
    {
      title: "Foco no que e testado",
      description: "Nao e ingles geral. Cada aula e exercicio e direcionado para os cenarios reais da prova ICAO.",
    },
    {
      title: "Pratica de fala real",
      description: "A prova e 100% oral. O metodo prioriza producao oral com feedback imediato por descritor.",
    },
    {
      title: "Abordagem sistematica",
      description: "36 tecnicas organizadas em 6 modulos que cobrem cada descritor de forma progressiva.",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <p className="text-sm font-medium text-primary-light uppercase tracking-widest mb-3 text-center">
          A solucao
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 text-center">
          Nao e um curso. E um Metodo.
        </h2>
        <p className="text-white/70 text-center max-w-2xl mx-auto mb-10">
          O Metodo Easycao nao e mais um curso de ingles. E um sistema completo
          de preparacao desenvolvido por quem aplica a prova — e sabe exatamente
          o que precisa para voce ser aprovado.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {differentiators.map((item, i) => (
            <div
              key={item.title}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15"
            >
              <div className="bg-primary-light/20 rounded-xl w-10 h-10 flex items-center justify-center mb-4">
                <span className="text-primary-light font-bold">{i + 1}</span>
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
