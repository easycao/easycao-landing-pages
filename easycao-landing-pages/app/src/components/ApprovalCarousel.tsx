"use client";

import Image from "next/image";
import { useInView } from "@/components/useInView";
import { useRef, useCallback } from "react";

export default function ApprovalCarousel() {
  const { ref, isVisible } = useInView(0.1);
  const trackRef = useRef<HTMLDivElement>(null);

  // Placeholder: using same image repeated. Replace with actual images later.
  const approvals = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: "/aprovacoes/1.png",
    alt: `Aprovacao ICAO ${i + 1}`,
  }));

  const pause = useCallback(() => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  }, []);

  const resume = useCallback(() => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  }, []);

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-gray-light overflow-hidden">
      <h2 className="text-2xl lg:text-4xl font-bold text-black text-center mb-4">
        +1000 aprovacoes de alunos Easycao
      </h2>

      <div className="marquee-container mt-10">
        <div
          ref={trackRef}
          className="flex animate-marquee gap-5 w-max"
          style={{
            "--marquee-duration": "40s",
            animationPlayState: isVisible ? "running" : "paused",
          } as React.CSSProperties}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          {[...approvals, ...approvals].map((img, i) => (
            <div
              key={`r1-${i}`}
              className="flex-shrink-0 w-[210px] lg:w-[260px] rounded-xl shadow-md overflow-hidden hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={260}
                height={468}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-primary font-semibold text-base lg:text-lg text-center mt-8">
        Te desafio a ver todas as aprovacoes
      </p>
    </section>
  );
}
