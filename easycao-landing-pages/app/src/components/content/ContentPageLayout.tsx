import { getPageBySlug } from "../../lib/content-pages";
import { articleSchema } from "../../lib/schema";
import ContentHero from "./ContentHero";
import TableOfContents from "./TableOfContents";
import AppBanner from "../AppBanner";
import FAQAccordion from "./FAQAccordion";
import AuthorBox from "./AuthorBox";
import RelatedPages from "./RelatedPages";
import CTABand from "./CTABand";
import Link from "next/link";

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
      <ContentHero
        title={page.title}
        updatedAt={page.updatedAt}
        readingTime={page.readingTime}
      />

      {/* Two-column content grid */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Article body */}
          <article className="prose lg:col-span-2">
            {children}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-1">
            <AppBanner variant="sidebar" />
            <div
              className="hero-noise relative overflow-hidden bg-gradient-to-br from-[#0a3d6b] via-primary-dark to-primary rounded-2xl p-5 text-center"
            >
              {/* Radial orb */}
              <div
                className="pointer-events-none absolute top-[-30%] right-[-20%] w-[200px] h-[200px] rounded-full opacity-25"
                aria-hidden="true"
                style={{ background: "radial-gradient(circle, rgba(52,184,248,0.4) 0%, transparent 70%)" }}
              />
              <p className="relative text-white font-semibold mb-2">
                Pronto para ser aprovado?
              </p>
              <p className="relative text-white/70 text-sm mb-4">
                Conheça o método do único examinador ICAO que ensina.
              </p>
              <Link
                href="/metodo"
                className="relative inline-block font-bold rounded-xl px-6 py-3 text-sm text-white transition-all active:scale-[0.97]"
                style={{
                  background: "rgba(255,255,255,0.20)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  boxShadow: "0 0 20px rgba(31,150,247,0.25), 0 0 60px rgba(31,150,247,0.1)",
                }}
              >
                Conhecer o Método
              </Link>
            </div>
            <TableOfContents headings={headings} />
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
