# Story 1.0.3 — Performance & Next.js Configuration

**Status:** Done
**Priority:** High
**Brief Reference:** FASE 3 — Performance & next.config.ts + FASE 5.5 (redirect)

---

## Story

As a site owner, I need the Next.js configuration fully set up with security headers, cache headers, image optimization, AVIF/WebP formats, root-to-lives redirect, and optimized images so that the site scores well on Core Web Vitals and is production-ready.

## Acceptance Criteria

- [ ] AC1: `next.config.ts` includes `poweredByHeader: false`
- [ ] AC2: `next.config.ts` includes `images.formats` with AVIF and WebP
- [ ] AC3: `next.config.ts` includes security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- [ ] AC4: `next.config.ts` includes cache headers for static assets (max-age=31536000, immutable)
- [ ] AC5: `next.config.ts` includes permanent redirect from `/` to `/lives`
- [ ] AC6: `diogo.png` is converted to WebP format with reduced file size
- [ ] AC7: All references to `diogo.png` are updated to the new filename
- [ ] AC8: Unused template assets removed from `/public` (file.svg, globe.svg, next.svg, vercel.svg, window.svg)
- [ ] AC9: `prof-diogo.jpg` converted to WebP
- [ ] AC10: Build succeeds with `npm run build`

## Tasks

- [x] Task 1: Rewrite `next.config.ts` with full production configuration (poweredByHeader, images, headers, redirects)
- [x] Task 2: Convert `public/diogo.png` (795KB → 41KB WebP, 95% reduction) to WebP using sharp-cli
- [x] Task 3: Convert `public/prof-diogo.jpg` (44KB → 19KB WebP, 58% reduction) to WebP
- [x] Task 4: Update all component references from `.png`/`.jpg` to `.webp` for converted images
- [x] Task 5: Remove unused assets from `/public`: file.svg, globe.svg, next.svg, vercel.svg, window.svg + originals
- [x] Task 6: Verify build succeeds

## Dev Notes

### next.config.ts — Full configuration
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|woff2|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/lives",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

### Image conversion
- Use `npx sharp-cli` or `cwebp` to convert PNG/JPG to WebP
- Target quality: 80-85 for photos
- After conversion, update references in: `lives/page.tsx` (diogo.png), `lives/ProfessorSection.tsx` (prof-diogo.jpg)

### Files to remove from /public
- `file.svg` — Next.js template leftover
- `globe.svg` — Next.js template leftover
- `next.svg` — Next.js template leftover
- `vercel.svg` — Next.js template leftover
- `window.svg` — Next.js template leftover

## File List

- `next.config.ts` — Rewritten
- `public/diogo.png` — Removed (replaced by diogo.webp)
- `public/diogo.webp` — Created
- `public/prof-diogo.jpg` — Removed (replaced by prof-diogo.webp)
- `public/prof-diogo.webp` — Created
- `public/file.svg` — Deleted
- `public/globe.svg` — Deleted
- `public/next.svg` — Deleted
- `public/vercel.svg` — Deleted
- `public/window.svg` — Deleted
- `src/app/lives/page.tsx` — Modified (image reference)
- `src/app/lives/ProfessorSection.tsx` — Modified (image reference)

---

## Dev Agent Record

### Debug Log
(none)

### Completion Notes
(pending)

### Change Log
(pending)
