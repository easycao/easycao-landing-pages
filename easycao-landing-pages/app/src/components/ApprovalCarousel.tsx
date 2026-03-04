"use client";

import Image from "next/image";
import { useRef, useCallback, useEffect, useState } from "react";

export default function ApprovalCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setIsVisible(true), 700);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const approvals = Array.from({ length: 160 }, (_, i) => ({
    id: 160 - i,
    src: `/aprovacoes/${160 - i}.webp`,
    alt: `Aprovação ICAO ${160 - i}`,
  }));

  const pause = useCallback(() => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  }, []);

  const resume = useCallback(() => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 bg-gray-light overflow-hidden">
      <h2 className="text-2xl lg:text-4xl font-bold text-black text-center mb-4">
        Aprovações de Alunos Easycao
      </h2>

      <div className="marquee-container mt-10">
        <div
          ref={trackRef}
          className="flex animate-marquee gap-5 w-max"
          style={{
            "--marquee-duration": "300s",
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
                width={540}
                height={960}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-primary font-semibold text-base lg:text-lg text-center mt-8">
        Te desafio a ver todas as aprovações
      </p>
    </section>
  );
}
