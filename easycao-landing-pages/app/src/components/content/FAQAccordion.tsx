"use client";

import { useState } from "react";
import { faqSchema } from "../../lib/schema";

interface FAQ {
  question: string;
  answer: string;
}

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 ${
        isOpen ? "border-primary/30 shadow-sm" : "border-gray-border"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full font-semibold text-black text-left cursor-pointer flex items-center justify-between gap-4 px-5 py-4"
      >
        {faq.question}
        <svg
          className={`w-5 h-5 text-black/40 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="text-black/70 leading-relaxed px-5 pb-4">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqs)),
        }}
      />
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  );
}
