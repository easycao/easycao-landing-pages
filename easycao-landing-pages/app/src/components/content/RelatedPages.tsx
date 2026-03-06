import Link from "next/link";
import { getRelatedPages } from "../../lib/content-pages";

export default function RelatedPages({ currentSlug }: { currentSlug: string }) {
  const related = getRelatedPages(currentSlug);

  if (related.length === 0) return null;

  return (
    <div className="my-12">
      <h2 className="text-2xl font-bold text-black mb-6">
        Conteudo Relacionado
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map((page) => (
          <Link
            key={page.slug}
            href={`/${page.slug}`}
            className="relative border border-gray-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 hover:border-l-4 hover:border-l-primary hover:scale-[1.01] transition-all duration-200 group"
          >
            <h3 className="font-semibold text-black group-hover:text-primary transition-colors mb-2 line-clamp-2">
              {page.title.replace(/:.*/,"").trim()}
            </h3>
            <p className="text-sm text-black/60 line-clamp-2 mb-3">
              {page.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-medium">
                Ler mais &rarr;
              </span>
              <span className="text-xs text-black/40">
                {page.readingTime} min
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
