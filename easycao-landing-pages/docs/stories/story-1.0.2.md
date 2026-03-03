# Story 1.0.2 — SEO Technical Infrastructure

**Status:** Done
**Priority:** Critical
**Brief Reference:** FASE 2 — SEO Técnico

---

## Story

As a site owner, I need proper SEO infrastructure (robots.txt, sitemap, complete metadata, OG image, page-level metadata) so that search engines can correctly discover, index, and display the site in results and social sharing previews.

## Acceptance Criteria

- [ ] AC1: `robots.ts` exists at `src/app/robots.ts` and generates valid robots.txt blocking `/api/` and `/confirma-cadastro-lives`
- [ ] AC2: `sitemap.ts` exists at `src/app/sitemap.ts` listing `/lives` with weekly changeFrequency
- [ ] AC3: Root `layout.tsx` metadata includes `metadataBase`, `alternates.canonical`, full `openGraph` with image, and `twitter` card
- [ ] AC4: OG image is in `/public/og-image.png` (copied from project root `OG.png`)
- [ ] AC5: `/confirma-cadastro-lives` has its own `layout.tsx` with title, description, and `robots: { index: false, follow: false }`
- [ ] AC6: Build succeeds with `npm run build`

## Tasks

- [x] Task 1: Create `src/app/robots.ts` with file-based robots configuration (domain: easycao.com)
- [x] Task 2: Create `src/app/sitemap.ts` with sitemap for `/lives` page
- [x] Task 3: Update `src/app/layout.tsx` metadata — add `metadataBase`, `alternates.canonical`, complete `openGraph` (with `siteName`, `url`, `images`), and `twitter` card
- [x] Task 4: Copy `OG.png` from project root to `app/public/og-image.png`
- [x] Task 5: Create `src/app/confirma-cadastro-lives/layout.tsx` with noindex metadata
- [x] Task 6: Verify build succeeds — robots.txt and sitemap.xml routes generated

## Dev Notes

**Domain:** `https://easycao.com`
**OG Image source:** `C:\Users\pcleo\workspace\easycao-landing-pages\OG.png` (536KB, already correct content)
**Instagram:** `https://instagram.com/easycao.official`
**YouTube:** `https://www.youtube.com/@easycaofficial`

### robots.ts
```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/confirma-cadastro-lives"],
    },
    sitemap: "https://easycao.com/sitemap.xml",
  };
}
```

### sitemap.ts
```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://easycao.com/lives",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
```

### layout.tsx metadata additions
Add `metadataBase`, `alternates`, complete `openGraph` with images/siteName/url, and `twitter` card object.

### confirma-cadastro-lives/layout.tsx
```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro Confirmado — Easycao",
  description: "Seu cadastro foi confirmado. Entre no grupo do WhatsApp para receber os avisos das lives.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
```

## File List

- `src/app/robots.ts` — Created
- `src/app/sitemap.ts` — Created
- `src/app/layout.tsx` — Modified (metadata)
- `public/og-image.png` — Created (copied from OG.png)
- `src/app/confirma-cadastro-lives/layout.tsx` — Created

---

## Dev Agent Record

### Debug Log
(none)

### Completion Notes
(pending)

### Change Log
(pending)
