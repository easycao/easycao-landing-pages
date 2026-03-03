# Story 2.1.1 — Create lib utilities and global constants

**Status:** Done
**Priority:** P0 (blocks everything)
**Epic:** E1 — Infrastructure (Phase 0)
**PRD Reference:** `docs/prd/prd-full-website.md` → Story 1.1

---

## Story

As a developer, I need to create the foundational utility files (`constants.ts`, `content-pages.ts`, `schema.ts`) in `src/lib/` so that all future pages and components have a single source of truth for site metadata, page registry, and JSON-LD schema generation.

## Acceptance Criteria

- [ ] AC1: `src/lib/constants.ts` exports all site-wide constants:
  - `SITE_NAME = "Easycao"`
  - `SITE_URL = "https://easycao.com"`
  - `SITE_DESCRIPTION` — generic school description (not lives-specific), e.g. "A maior escola de preparacao para a prova ICAO do Brasil. Metodo criado pelo unico examinador ICAO credenciado que ensina."
  - `WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/BqNohPkBOY4DAD2T95vxpu"`
  - `WHATSAPP_SUPPORT_URL` — use group URL for now as placeholder
  - `HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/Y27990783F"`
  - `APP_STORE_URL = "#"` (placeholder)
  - `PLAY_STORE_URL = "#"` (placeholder)
  - `INSTAGRAM_URL = "https://www.instagram.com/easycao"`
  - `YOUTUBE_URL = "https://www.youtube.com/@easycao"`
  - `GTM_WEB_ID = "GTM-PDLS5SL"`
  - `DIOGO` object: `{ name: "Diogo Verzola", title: "Examinador ICAO Credenciado", credentials: ["Examinador ICAO credenciado pela ANAC", "Certificado Cambridge", "20+ anos de experiencia", "Ex-controlador de trafego aereo"], photo: "/prof-diogo.webp", bio: "..." }`

- [ ] AC2: `src/lib/content-pages.ts` exports `ContentPage` type and `CONTENT_PAGES` array with all 18 content pages registered. Type definition:
  ```ts
  export interface ContentPage {
    slug: string;          // e.g. "descritores-da-prova-icao"
    title: string;         // H1 text
    seoTitle: string;      // meta title e.g. "Descritores da Prova ICAO | Easycao"
    description: string;   // meta description 150-160 chars
    keywords: string[];    // primary + secondary
    updatedAt: string;     // ISO date
    readingTime: number;   // minutes
    relatedSlugs: string[];// 3-4 related page slugs
    category: "core" | "gap" | "niche";
    phase: number;         // 1, 3, or 4
  }
  ```
  All 18 pages registered:
  - 6 core: descritores-da-prova-icao, como-se-preparar-para-a-prova-icao, como-funciona-a-prova-icao, niveis-icao, quanto-custa-a-prova-icao, onde-fazer-a-prova-icao
  - 8 gap: validade-e-renovacao-prova-icao, sdea-santos-dumont-english-assessment, reprovado-na-prova-icao, vocabulario-aviacao-ingles, simulado-prova-icao, erros-comuns-prova-icao, como-agendar-a-prova-icao, quem-precisa-fazer-prova-icao
  - 4 niche: dicas-prova-icao-descricao-imagens, quanto-tempo-preparar-prova-icao, prova-icao-helicoptero, resultado-prova-icao
  Exports helper functions:
  - `getPageBySlug(slug: string): ContentPage | undefined`
  - `getRelatedPages(slug: string): ContentPage[]`
  - `getPagesByCategory(category: string): ContentPage[]`
  - `getAllPages(): ContentPage[]`

- [ ] AC3: `src/lib/schema.ts` exports JSON-LD generator functions (all return `Record<string, unknown>`):
  - `organizationSchema()` — Easycao Organization with name, url, logo
  - `personSchema()` — Diogo with name, jobTitle, credentials from constants
  - `articleSchema(page: ContentPage)` — Article with headline, dateModified, author (Person)
  - `faqSchema(faqs: { question: string; answer: string }[])` — FAQPage with mainEntity array
  - `breadcrumbSchema(items: { name: string; url: string }[])` — BreadcrumbList
  - `courseSchema()` — Course for /metodo with provider, instructor
  - `mobileApplicationSchema()` — MobileApplication for Easycao app with name, operatingSystem, applicationCategory
  All schemas import constants from `constants.ts` — no hardcoded URLs or names.

- [ ] AC4: `npm run build` passes with no errors

## Tasks

- [x] Task 1: Create `src/lib/` directory
- [x] Task 2: Create `src/lib/constants.ts` with all exports per AC1
- [x] Task 3: Create `src/lib/content-pages.ts` with type, 18 page entries, and 4 helper functions per AC2
- [x] Task 4: Create `src/lib/schema.ts` with 7 JSON-LD generators per AC3
- [x] Task 5: Verify `npm run build` passes

## Dev Notes

**Content page data references:**
- Titles and keywords: `docs/content-strategy.md` and `docs/reference-search-trends.md`
- SEO titles pattern: `"[Primary Keyword] | Easycao"` — max 60 chars
- Meta descriptions: 150-160 chars, include keyword + CTA
- `updatedAt`: Use `"2026-03-03"` for all pages (today's date)
- `readingTime`: Core pages 8-12 min, Gap pages 6-10 min, Niche pages 4-7 min
- `relatedSlugs`: Each page should link to 3-4 sibling pages (see content-strategy.md topical cluster)

**Schema references:**
- Organization: `@type: "Organization"`, `name: SITE_NAME`, `url: SITE_URL`
- Person: `@type: "Person"`, use DIOGO constant
- Article: `@type: "Article"`, `headline`, `dateModified`, `author` as Person ref
- FAQPage: `@type: "FAQPage"`, `mainEntity` array of `Question` with `acceptedAnswer`
- BreadcrumbList: `@type: "BreadcrumbList"`, `itemListElement` array with position
- Course: `@type: "Course"`, `name: "Metodo Easycao"`, `provider` as Organization
- MobileApplication: `@type: "MobileApplication"`, `name: "Easycao"`, `operatingSystem: "iOS, Android"`

## File List

- `src/lib/constants.ts` — Created
- `src/lib/content-pages.ts` — Created
- `src/lib/schema.ts` — Created

---

## Dev Agent Record

### Debug Log
- Build passed on first attempt, no issues.

### Completion Notes
- All 3 lib files created: constants.ts (14 exports), content-pages.ts (18 pages + 4 helpers), schema.ts (7 generators)
- All 18 content pages registered with proper SEO titles, descriptions, keywords, reading times, and related slugs
- Schema generators cover: Organization, Person, Article, FAQPage, BreadcrumbList, Course, MobileApplication
- `npm run build` passes clean

### Change Log
- Created `src/lib/constants.ts`
- Created `src/lib/content-pages.ts`
- Created `src/lib/schema.ts`
