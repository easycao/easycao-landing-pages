export default function ModuleCards() {
  const modules = [
    {
      number: 1,
      title: "Pronunciation & Fluency",
      description:
        "Tecnicas para pronuncia clara e fala fluida. Exercicios para eliminar pausas excessivas e melhorar entonacao.",
    },
    {
      number: 2,
      title: "Aviation Vocabulary",
      description:
        "Vocabulario especifico de aviacao: weather, emergencies, systems, ATC communication e mais.",
    },
    {
      number: 3,
      title: "Communication Strategies",
      description:
        "Estrategias de interacao: turn-taking, clarification, reformulacao e gerenciamento de dialogo.",
    },
    {
      number: 4,
      title: "Unexpected Situations",
      description:
        "Pratica com cenarios de emergencia e situacoes imprevistas. Desenvolva vocabulario e respostas rapidas.",
    },
    {
      number: 5,
      title: "Picture Description",
      description:
        "Tecnicas para descrever imagens de aviacao com estrutura e vocabulario rico. Pratique a Parte 4 da prova.",
    },
    {
      number: 6,
      title: "Full Simulation Practice",
      description:
        "Simulados completos das 4 partes da prova com feedback detalhado por descritor.",
    },
  ];

  return (
    <section className="bg-gray-light py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3 text-center">
          O conteudo
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10 text-center">
          O que voce vai aprender
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.number}
              className="bg-white rounded-2xl p-6 border border-gray-border hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="bg-primary text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold mb-4">
                {mod.number}
              </div>
              <h3 className="font-semibold text-black mb-2">{mod.title}</h3>
              <p className="text-sm text-black/60">{mod.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
