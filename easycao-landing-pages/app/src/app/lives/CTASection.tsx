"use client";

import LeadForm from "@/components/LeadForm";
import { useInView } from "@/components/useInView";

export default function CTASection() {
  const { ref, isVisible } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="bg-gradient-to-br from-primary to-primary-dark py-16 lg:py-20"
    >
      <div className="max-w-xl mx-auto px-5 lg:px-8">
        <h2
          className={`text-2xl lg:text-4xl font-bold text-white text-center mb-3 transition-all duration-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Nao perca a proxima live
        </h2>
        <p
          className={`text-white/80 text-base lg:text-lg text-center mb-10 transition-all duration-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          Cadastre-se agora e entre no grupo para ser avisado
        </p>

        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <LeadForm variant="cta" />
        </div>
      </div>
    </section>
  );
}
