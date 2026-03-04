"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollProgress() {
  const containerRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // progress = 0 when section top hits viewport bottom, 1 when section bottom leaves viewport top
      const total = rect.height + viewportH;
      const scrolled = viewportH - rect.top;
      const value = Math.min(1, Math.max(0, scrolled / total));
      setProgress(value);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // initial calculation
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { containerRef, progress };
}
