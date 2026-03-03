"use client";

import { useEffect, useState } from "react";
import { HOTMART_CHECKOUT_URL } from "../../../lib/constants";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-gray-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] py-3 px-5">
      <a
        href={HOTMART_CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-primary-light text-white font-bold rounded-xl py-3 text-center hover:bg-primary transition-colors"
      >
        Matricular agora
      </a>
    </div>
  );
}
