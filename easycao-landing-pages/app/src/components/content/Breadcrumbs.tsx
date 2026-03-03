import Link from "next/link";
import { breadcrumbSchema } from "../../lib/schema";
import { SITE_URL } from "../../lib/constants";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const schemaItems = items.map((item, i) => ({
    name: item.label,
    url: item.href ? `${SITE_URL}${item.href}` : `${SITE_URL}`,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(schemaItems)),
        }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-white/50 mb-4">
        {items.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-2">&gt;</span>}
            {item.href && i < items.length - 1 ? (
              <Link
                href={item.href}
                className="text-white/50 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white/70">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
