export default function BonusStack() {
  const items = [
    { title: "Curso Easycao — Do zero ao ICAO", tag: "266+ aulas", detail: "Todos os módulos, do Módulo Zero ao Módulo 6" },
    { title: "App Simulador ICAO", tag: "Ilimitado", detail: "25 versões de simulado com feedback automático" },
    { title: "Maior Comunidade de pilotos para ICAO", tag: "+1000 alunos", detail: "Grupo exclusivo com suporte em tempo real" },
    { title: "Mentorias semanais ao vivo", tag: "Toda semana", detail: "Encontros no Zoom com o professor Diogo" },
    { title: "Suporte ativo até sua aprovação", tag: "Dedicado", detail: "Acompanhamento personalizado do seu progresso" },
    { title: "Alinhamento particular", tag: "1h exclusiva", detail: "Encontro individual no final do curso para ajustar a proa" },
    { title: "Curso ICAO Advanced", tag: "Nível 5 e 6", detail: "4 módulos avançados de estrutura, fluência, vocabulário e pronúncia" },
  ];

  return (
    <section className="hero-noise relative bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary py-16 lg:py-20 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto px-5">
        <p className="text-sm font-medium text-[#7DCCFF] uppercase tracking-widest mb-3 text-center">
          Tudo que você terá acesso
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-10 text-center">
          Tudo incluso no Método Easycao
        </h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl px-5 py-4 flex items-center gap-4"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div className="shrink-0 w-9 h-9 rounded-full bg-[#7DCCFF]/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#7DCCFF]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">{item.title}</span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider text-[#7DCCFF] px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(125,204,255,0.15)",
                      border: "1px solid rgba(125,204,255,0.25)",
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
                <p className="text-sm text-white/60 mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
