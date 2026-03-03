import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "../../../lib/constants";
import { getPagesByCategory, type ContentPage } from "../../../lib/content-pages";

export const metadata: Metadata = {
  title: "Conteudos sobre a Prova ICAO | Easycao",
  description:
    "Todos os guias, artigos e recursos sobre a prova ICAO reunidos em um so lugar. Preparacao, descritores, niveis, custos, simulados e muito mais.",
  alternates: { canonical: "/conteudos" },
  openGraph: {
    title: "Conteudos sobre a Prova ICAO | Easycao",
    description:
      "Todos os guias, artigos e recursos sobre a prova ICAO reunidos em um so lugar.",
    url: `${SITE_URL}/conteudos`,
    siteName: "Easycao",
    type: "website",
    locale: "pt_BR",
  },
};

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  core: {
    label: "Fundamentos da Prova ICAO",
    description: "Tudo que voce precisa saber sobre a prova: como funciona, o que e avaliado, niveis, custos e onde fazer.",
  },
  gap: {
    label: "Preparacao e Pratica",
    description: "Guias praticos para se preparar, praticar e evitar erros comuns. Simulados, vocabulario e recuperacao.",
  },
  niche: {
    label: "Guias Especializados",
    description: "Conteudos para situacoes especificas: descricao de imagens, helicoptero, resultado e planejamento.",
  },
};

function PageCard({ page }: { page: ContentPage }) {
  return (
    <Link
      href={`/${page.slug}`}
      className="bg-white rounded-2xl p-6 border border-gray-border hover:shadow-lg hover:border-primary/30 transition-all group flex flex-col"
    >
      <h3 className="font-semibold text-black group-hover:text-primary transition-colors mb-2 leading-snug">
        {page.title.replace(/:.*/, "").replace(/\[.*\]/, "").trim()}
      </h3>
      <p className="text-sm text-black/60 mb-4 line-clamp-2 flex-1">
        {page.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-black/40">{page.readingTime} min de leitura</span>
        <span className="text-sm text-primary font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Ler mais &rarr;
        </span>
      </div>
    </Link>
  );
}

export default function ConteudosPage() {
  const corePages = getPagesByCategory("core");
  const gapPages = getPagesByCategory("gap");
  const nichePages = getPagesByCategory("niche");

  const sections = [
    { key: "core", pages: corePages },
    { key: "gap", pages: gapPages },
    { key: "niche", pages: nichePages },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
            Tudo sobre a Prova ICAO
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Guias completos, dicas praticas e recursos gratuitos para voce se preparar e ser aprovado na prova ICAO.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <div className="bg-gray-light py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-5 space-y-16">
          {sections.map(({ key, pages }) => {
            const meta = CATEGORY_META[key];
            return (
              <section key={key}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-black mb-2">{meta.label}</h2>
                  <p className="text-black/60">{meta.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pages.map((page) => (
                    <PageCard key={page.slug} page={page} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
