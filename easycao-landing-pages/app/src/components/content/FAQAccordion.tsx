"use client";

import { faqSchema } from "../../lib/schema";

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="my-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(faqs)),
        }}
      />
      <h2 className="text-2xl lg:text-3xl font-bold text-black mb-6">
        Perguntas Frequentes
      </h2>
      <div className="divide-y divide-gray-border">
        {faqs.map((faq, i) => (
          <details key={i} className="group py-4">
            <summary className="font-semibold text-black cursor-pointer list-none flex items-center justify-between gap-4">
              {faq.question}
              <svg
                className="w-5 h-5 text-black/40 shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="faq-answer">
              <p className="text-black/70 mt-2 leading-relaxed">{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
