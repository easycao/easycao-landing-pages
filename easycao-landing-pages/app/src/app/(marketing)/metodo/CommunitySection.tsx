const benefits = [
  "Tire dúvidas na comunidade",
  "Troque experiências com pilotos que estão no mesmo caminho",
  "Receba atualizações do método",
  "Motive-se com as aprovações dos colegas",
];

export default function CommunitySection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
              Contate a Torre
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">
              Você nunca voa sozinho
            </h2>
            <p className="text-black/70 mb-6">
              Na aviação, a torre de controle é seu suporte em cada fase do voo.
              No Método Easycao, a comunidade funciona assim — suporte real,
              em tempo real, para cada etapa da sua preparação.
            </p>
            <ul className="space-y-3 mb-6">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-black/70 text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Community preview */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm bg-gray-light rounded-2xl border border-gray-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-black">Comunidade Easycao</p>
                  <p className="text-xs text-black/50">+1000 alunos ativos</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  "Qual o correto: request to descend ou request for descend?",
                  "Qual o melhor lugar pra fazer a prova?",
                  "Pessoal, acabei de receber minha nota! ICAO 4! Muito obrigado a todos pela força, confiem no método!",
                  "Na aula 15 do Módulo 2, o cotejamento do cenário 3 é com ou sem call sign?",
                ].map((msg, i) => (
                  <div key={i} className="bg-white rounded-xl px-3 py-2 text-sm text-black/70">
                    {msg}
                  </div>
                ))}
                <div className="bg-primary/10 rounded-xl px-3 py-2 flex items-start gap-2.5">
                  <p className="text-sm text-primary font-medium flex-1">Bora pra mentoria de hoje! Link aqui abaixo 👇</p>
                  <img src="/prof-diogo.webp" alt="Prof. Diogo" className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 ring-2 ring-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
