import { getPageBySlug } from "../../lib/content-pages";
import { articleSchema } from "../../lib/schema";
import Breadcrumbs from "./Breadcrumbs";
import ArticleMeta from "./ArticleMeta";
import TableOfContents from "./TableOfContents";
import AppBanner from "../AppBanner";
import FAQAccordion from "./FAQAccordion";
import AuthorBox from "./AuthorBox";
import RelatedPages from "./RelatedPages";
import CTABand from "./CTABand";
import Link from "next/link";
import { HOTMART_CHECKOUT_URL } from "../../lib/constants";

interface ContentPageLayoutProps {
  slug: string;
  children: React.ReactNode;
  headings: { id: string; text: string; level: 2 | 3 }[];
  faqs: { question: string; answer: string }[];
  ctaVariant?: "metodo" | "lives";
}

export default function ContentPageLayout({
  slug,
  children,
  headings,
  faqs,
  ctaVariant = "metodo",
}: ContentPageLayoutProps) {
  const page = getPageBySlug(slug);

  if (!page) return null;

  return (
    <>
      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema(page)),
        }}
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0a3d6b] via-primary-dark to-primary py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: page.title },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-3xl">
            {page.title}
          </h1>
          <ArticleMeta
            updatedAt={page.updatedAt}
            readingTime={page.readingTime}
          />
        </div>
      </section>

      {/* Two-column content grid */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Article body */}
          <article className="prose lg:col-span-2">
            {children}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-1">
            <TableOfContents headings={headings} />
            <AppBanner variant="sidebar" />
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-center">
              <p className="text-white font-semibold mb-2">
                Pronto para ser aprovado?
              </p>
              <p className="text-white/70 text-sm mb-4">
                Conheca o metodo do unico examinador ICAO que ensina.
              </p>
              <a
                href={HOTMART_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-primary font-bold rounded-xl px-6 py-3 text-sm hover:bg-white/90 transition-all hover:scale-[1.02]"
              >
                Conhecer o Metodo
              </a>
            </div>
          </aside>
        </div>

        {/* FAQ section */}
        {faqs.length > 0 && (
          <div className="my-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-black mb-6">
              Perguntas Frequentes
            </h2>
            <FAQAccordion faqs={faqs} />
          </div>
        )}

        {/* Author box */}
        <div className="my-12">
          <AuthorBox />
        </div>

        {/* Related pages */}
        <RelatedPages currentSlug={slug} />
      </div>

      {/* Full-width CTA band */}
      <CTABand variant={ctaVariant} />
    </>
  );
}
