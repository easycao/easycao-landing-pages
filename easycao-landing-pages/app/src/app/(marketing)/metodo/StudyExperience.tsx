const experiences = [
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    ),
    title: "Aulas Easycao",
    description: "Aulas curtas e objetivas de 10-15 minutos, feitas para caber na rotina de quem voa. Assista entre voos, no hotel ou no intervalo do trabalho — online ou offline, no celular ou computador. Cada aula é um passo a mais rumo à aprovação.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: "Momento Easycao",
    description: "São os momentos do seu dia onde você treina sem precisar estar ativamente estudando. Ouça suas próprias respostas, repita respostas corretas e cristalize o conhecimento do curso na sua fala — no carro, no ônibus ou entre voos.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Acompanhamento Personalizado",
    description: "Acompanhamos o seu progresso durante todo o curso e te ajudamos de forma particular a atingir suas metas. Um suporte dedicado para garantir que você não fique travado em nenhuma fase.",
  },
];

export default function StudyExperience() {
  return (
    <section className="bg-gray-light py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3 text-center">
          Como você estuda
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10 text-center">
          Experiência de estudo pensada para pilotos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div
              key={exp.title}
              className="bg-white rounded-2xl p-8 border border-gray-border"
            >
              <div className="bg-primary/10 rounded-xl p-3 w-fit mb-4">
                {exp.icon}
              </div>
              <h3 className="text-lg font-bold text-black mb-3">{exp.title}</h3>
              <p className="text-sm text-black/60 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
