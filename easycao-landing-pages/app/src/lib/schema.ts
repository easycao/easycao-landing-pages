// JSON-LD schema generators — consistent structured data across all pages.
// All functions return plain objects for injection via <script type="application/ld+json">.

import { SITE_NAME, SITE_URL, DIOGO } from "./constants";
import type { ContentPage } from "./content-pages";

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.webp`,
    sameAs: [
      "https://www.instagram.com/easycao",
      "https://www.youtube.com/@easycao",
    ],
  };
}

export function personSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: DIOGO.name,
    jobTitle: DIOGO.title,
    description: DIOGO.bio,
    image: `${SITE_URL}${DIOGO.photo}`,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function articleSchema(page: ContentPage): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    datePublished: page.updatedAt,
    dateModified: page.updatedAt,
    author: {
      "@type": "Person",
      name: DIOGO.name,
      jobTitle: DIOGO.title,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.webp`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${page.slug}`,
    },
  };
}

export function faqSchema(
  faqs: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function courseSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Metodo Easycao",
    description:
      "Metodo completo de preparacao para a prova ICAO, criado pelo unico examinador credenciado que ensina. 6 modulos, 36 tecnicas, simulador e comunidade.",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    instructor: {
      "@type": "Person",
      name: DIOGO.name,
      jobTitle: DIOGO.title,
    },
    educationalLevel: "Professional",
    inLanguage: "pt-BR",
    url: `${SITE_URL}/metodo`,
  };
}

export function mobileApplicationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "Easycao — Simulador ICAO",
    operatingSystem: "iOS, Android",
    applicationCategory: "EducationalApplication",
    description:
      "Simulador da prova ICAO. Grave suas respostas e receba feedback automatico por descritor baseado no Doc 9835 da ICAO. 283 trilhoes+ de combinacoes.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
