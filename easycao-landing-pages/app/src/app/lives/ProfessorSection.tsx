"use client";

import Image from "next/image";
import { useInView } from "@/components/useInView";

export default function ProfessorSection() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Photo */}
          <div
            className={`lg:col-span-2 flex justify-center transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-5"
            }`}
          >
            <div className="w-64 h-80 lg:w-full lg:h-[420px] rounded-2xl shadow-xl overflow-hidden">
              <Image
                src="/prof-diogo.webp"
                alt="Prof. Diogo Verzola"
                width={860}
                height={840}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div
            className={`lg:col-span-3 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-5"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <p className="text-primary font-medium text-sm uppercase tracking-widest">
              Quem vai te preparar
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-black mt-2">
              Diogo Verzola
            </h2>

            <p className="text-black/70 text-base lg:text-lg mt-6 leading-relaxed">
              Examinador ICAO credenciado e criador do Metodo Easycao.
              Especialista em preparacao para a prova ICAO, ja ajudou
              milhares de pilotos a alcancarem a certificacao necessaria
              para avancarem em suas carreiras.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <div className="bg-sky-50 border border-primary/20 rounded-lg px-5 py-3 flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1F96F7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-primary-dark font-medium text-sm">
                  Examinador ICAO Credenciado
                </span>
              </div>
              <div className="bg-sky-50 border border-primary/20 rounded-lg px-5 py-3 flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1F96F7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-primary-dark font-medium text-sm">
                  Criador do Metodo Easycao
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
