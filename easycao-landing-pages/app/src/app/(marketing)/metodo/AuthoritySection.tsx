import Image from "next/image";
import { DIOGO } from "../../../lib/constants";

export default function AuthoritySection() {
  const credentials = [
    { label: "Examinador ICAO credenciado pela ANAC", icon: "shield" },
    { label: "Certificado Cambridge", icon: "award" },
    { label: "20+ anos de experiencia em aviacao", icon: "clock" },
    { label: "Ex-controlador de trafego aereo", icon: "radio" },
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3 text-center">
          Quem criou o metodo
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10 text-center">
          Criado pelo unico examinador ICAO que ensina
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src={DIOGO.photo}
                alt={DIOGO.name}
                width={320}
                height={320}
                className="rounded-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-white text-sm font-bold rounded-xl px-4 py-2">
                {DIOGO.title}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-black mb-4">{DIOGO.name}</h3>
            <p className="text-black/70 leading-relaxed mb-6">{DIOGO.bio}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {credentials.map((cred) => (
                <div
                  key={cred.label}
                  className="flex items-center gap-3 bg-primary/5 rounded-xl p-3"
                >
                  <svg
                    className="w-5 h-5 text-primary shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-black">
                    {cred.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
