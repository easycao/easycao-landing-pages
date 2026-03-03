import { WHATSAPP_GROUP_URL } from "../../../lib/constants";

export default function CommunitySection() {
  const benefits = [
    "Grupo exclusivo no WhatsApp com pilotos preparando para a prova",
    "Troca de experiencias e dicas entre alunos",
    "Lives semanais com o professor Diogo",
    "Suporte direto para duvidas sobre a prova",
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
              Comunidade
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">
              A maior comunidade de pilotos preparando para o ICAO
            </h2>
            <p className="text-black/70 mb-6">
              Voce nao estuda sozinho. Ao entrar no Metodo Easycao, voce faz
              parte de uma comunidade ativa de pilotos que estao no mesmo
              caminho que voce.
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
            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Conhecer a comunidade
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          {/* Community preview placeholder */}
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
                  <p className="text-xs text-black/50">+500 membros ativos</p>
                </div>
              </div>
              <div className="space-y-3">
                {["Pessoal, passei com Level 5! 🎉", "Alguem para simulado amanha?", "Prof, duvida sobre pronunciation..."].map((msg, i) => (
                  <div key={i} className="bg-white rounded-xl px-3 py-2 text-sm text-black/70">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
