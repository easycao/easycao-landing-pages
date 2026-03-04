export default function ProblemSection() {
  const painPoints = [
    {
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      title: "Trava na hora de falar",
      description: "Você sabe o inglês, mas na pressão da prova as palavras simplesmente não saem.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Não entende o áudio com sotaque",
      description: "O examinador fala com sotaque diferente e você perde informações cruciais.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Não sabe descrever imagens",
      description: "Na Parte 4 da prova, você fica sem vocabulário para descrever a cena.",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
      title: "Decora respostas mas o examinador percebe",
      description: "O examinador muda a abordagem e suas respostas prontas não funcionam.",
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <p className="text-sm font-medium text-red-500 uppercase tracking-widest mb-3 text-center">
          O problema
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10 text-center">
          Você estuda mas na hora da prova...
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="border border-red-100 rounded-2xl p-6 bg-red-50/30"
            >
              <div className="bg-red-100 rounded-xl p-3 w-fit mb-4">
                {point.icon}
              </div>
              <h3 className="font-semibold text-black mb-2">{point.title}</h3>
              <p className="text-sm text-black/60">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
