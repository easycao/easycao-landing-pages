export default function AgitationSection() {
  const consequences = [
    {
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      title: "Carreira estagnada",
      description:
        "Sem a proficiência ICAO, você não pode voar internacionalmente. Oportunidades em companhias aéreas passam — e você fica para trás.",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Dinheiro perdido",
      description:
        "Cada tentativa custa R$ 800-1.500. Reprovar 2-3 vezes significa R$ 3.000+ jogados fora, além dos custos de deslocamento e tempo.",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Tempo desperdiçado",
      description:
        "60 dias de espera obrigatória entre tentativas. Meses de estudo sem direção. Enquanto isso, outros pilotos passam e avançam na carreira.",
    },
  ];

  return (
    <section className="bg-gray-light py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10 text-center">
          O que acontece quando você não passa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {consequences.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 border border-gray-border text-center"
            >
              <div className="bg-amber-100 rounded-full p-4 w-fit mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-black mb-2">{item.title}</h3>
              <p className="text-sm text-black/60">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
