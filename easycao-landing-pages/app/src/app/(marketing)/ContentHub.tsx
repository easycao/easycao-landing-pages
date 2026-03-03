import Link from "next/link";
import { getPagesByCategory } from "../../lib/content-pages";

const ICONS = [
  // Descriptors - chart
  <svg key="d" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>,
  // Preparation - book
  <svg key="p" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>,
  // How it works - clipboard
  <svg key="h" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>,
  // Levels - layers
  <svg key="l" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>,
];

export default function ContentHub() {
  const corePages = getPagesByCategory("core").slice(0, 4);

  return (
    <section className="bg-gray-light py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3 text-center">
          Tudo sobre a Prova ICAO
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-black mb-10 text-center">
          Entenda tudo sobre o exame
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {corePages.map((page, i) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="bg-white rounded-2xl p-6 border border-gray-border hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              <div className="bg-primary/10 rounded-xl p-3 w-fit mb-4">
                {ICONS[i] || ICONS[0]}
              </div>
              <h3 className="font-semibold text-black group-hover:text-primary transition-colors mb-2">
                {page.title.replace(/:.*/, "").trim()}
              </h3>
              <p className="text-sm text-black/60 mb-3 line-clamp-2">
                {page.description}
              </p>
              <span className="text-sm text-primary font-medium">
                Ler mais &rarr;
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/conteudos"
            className="inline-block bg-white border-2 border-primary text-primary font-bold rounded-xl px-8 py-3 hover:bg-primary hover:text-white transition-all"
          >
            Ver todos os conteudos
          </Link>
        </div>
      </div>
    </section>
  );
}
