"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DIOGO } from "../../../lib/constants";

const credentials = [
  "Examinador ICAO credenciado pela ANAC",
  "Certificado Cambridge",
  "20+ anos de experiência em aviação",
  "Ex-controlador de tráfego aéreo",
];

export default function CopilotSection() {
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
          {/* Photo */}
          <div
            className="flex justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-20px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
            }}
          >
            <div className="relative">
              <Image
                src={DIOGO.photo}
                alt={DIOGO.name}
                width={400}
                height={400}
                className="rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-white text-sm font-bold rounded-xl px-4 py-2 shadow-lg">
                {DIOGO.title}
              </div>
            </div>
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
              Seu copiloto
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-4">
              Do Zero ao ICAO voando em Ala
            </h2>
            <p className="text-black/70 leading-relaxed mb-6">
              Você não voa sozinho. O professor Diogo Verzola vai estar ao seu lado durante toda a sua preparação — com mentorias semanais ao vivo e correções em tempo real nos simulados. E ao final do seu estudo, você terá um encontro particular de alinhamento com ele para ajustar a proa e garantir que está pronto para a aprovação.
            </p>

            {/* Credential tags */}
            <div className="flex flex-wrap gap-2">
              {credentials.map((cred) => (
                <span
                  key={cred}
                  className="inline-flex items-center gap-1.5 bg-sky-50 text-primary text-sm font-medium rounded-full px-3 py-1.5 border border-primary/20"
                >
                  <svg className="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {cred}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
