"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const benefits = [
  "Tire dúvidas ao vivo com o professor Diogo",
  "Treine a prova em tempo real",
  "Receba feedback sobre o seu inglês",
  "Direcionamento personalizado de quais aulas fazer",
  "A aula só acaba quando todos participarem",
];

export default function MentoriaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-20px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
            }}
          >
            <Image
              src="/mentoria.png"
              alt="Mentoria semanal ao vivo no Zoom com o professor Diogo Verzola"
              width={600}
              height={400}
              className="rounded-2xl shadow-lg w-full ring-4 ring-primary"
            />
          </div>

          {/* Text */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(20px)",
              transition: "opacity 0.7s ease-out 0.15s, transform 0.7s ease-out 0.15s",
            }}
          >
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
              Mentoria semanal
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">
              Toda semana, ao vivo, no Zoom
            </h2>
            <p className="text-black/70 leading-relaxed mb-6">
              Toda semana você tem um encontro ao vivo com o professor Diogo para acelerar sua preparação. Você treina a prova, recebe feedback direto sobre o seu inglês e sai de cada sessão sabendo exatamente o que precisa fazer na próxima semana.
            </p>

            <div className="flex flex-col gap-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-black/70">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
