export default function BonusStack() {
  const bonuses = [
    {
      title: "Acesso a comunidade exclusiva",
      description: "Grupo no WhatsApp com pilotos e acesso direto ao professor.",
      value: "R$ 497",
    },
    {
      title: "Lives semanais com examinador",
      description: "Simulados ao vivo toda semana com correcao por descritor.",
      value: "R$ 997",
    },
    {
      title: "App Simulador ICAO",
      description: "283T+ combinacoes. Grave respostas e receba feedback automatico.",
      value: "R$ 697",
    },
    {
      title: "Material complementar",
      description: "Vocabulario de aviacao, scripts de emergencia e checklists.",
      value: "R$ 297",
    },
  ];

  return (
    <section className="bg-gray-light py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-5">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3 text-center">
          Bonus exclusivos
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10 text-center">
          E tem mais: bonus inclusos
        </h2>
        <div className="space-y-4">
          {bonuses.map((bonus) => (
            <div
              key={bonus.title}
              className="bg-white rounded-2xl p-5 border border-gray-border flex items-start gap-4"
            >
              <div className="bg-green-100 rounded-full p-2 shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-black">{bonus.title}</h3>
                  <span className="text-sm text-black/40 line-through">
                    {bonus.value}
                  </span>
                </div>
                <p className="text-sm text-black/60">{bonus.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
