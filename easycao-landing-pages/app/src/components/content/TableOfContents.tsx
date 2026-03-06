"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      className="sticky top-24 bg-gray-light/50 rounded-xl p-4 border border-gray-border/50"
      aria-label="Indice do artigo"
    >
      <p className="text-xs font-medium text-black/40 uppercase tracking-widest mb-3">
        Neste artigo
      </p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block text-sm py-1 rounded-lg transition-colors ${
                h.level === 3 ? "pl-4" : ""
              } ${
                activeId === h.id
                  ? "text-primary font-semibold bg-primary/5 border-l-2 border-primary pl-3"
                  : "text-black/50 hover:text-black/80"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
