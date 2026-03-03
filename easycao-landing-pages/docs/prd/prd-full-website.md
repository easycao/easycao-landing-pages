# PRD — Easycao Full Website

**Data:** 2026-03-03
**Autor:** Morgan (@pm)
**Status:** Approved for development
**Brief:** `docs/brief.md`

---

## 1. Product Vision

Transform easycao.com from a 2-page lead capture site into a 22-page authority hub that dominates ICAO exam search queries in Brazil, converts organic traffic into method enrollments, and positions Easycao as the undisputed leader in ICAO preparation — backed by the only credentialed examiner teaching in the market.

---

## 2. Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Pages indexed | 22 | 3 months |
| Organic sessions/month | 5,000 | 6 months |
| Top 10 keywords | 30 | 6 months |
| LCP all pages | < 2.5s | At launch |
| CLS all pages | < 0.1 | At launch |
| /lives conversion | Maintained | Ongoing |

---

## 3. Technical Constraints

- **Stack:** Next.js 16 + React 19 + Tailwind CSS v4 (no new dependencies)
- **Animations:** CSS keyframes + existing `useInView` hook only
- **Images:** AVIF/WebP via next/image (already configured)
- **Font:** Poppins 400-700 (already loaded)
- **Safety:** `/lives` and `/confirma-cadastro-lives` must NEVER break
- **Mobile-first:** 70-80% of Brazilian traffic is mobile
- **Deploy:** Vercel

---

## 4. Epic Structure

| Epic | Phase | Stories | Depends On |
|------|-------|---------|------------|
| E1: Infrastructure | 0 | 3 stories | None |
| E2: Content Components | 1A | 2 stories | E1 |
| E3: Homepage | 1B | 2 stories | E1 |
| E4: Core Content Pages | 1C | 6 stories | E2 |
| E5: Sales Page | 2 | 3 stories | E2 |
| E6: Gap Content Pages | 3 | 4 stories | E2 |
| E7: Niche Content Pages | 4 | 2 stories | E2 |

**Total: 22 stories**

---

## Epic 1: Infrastructure (Phase 0)

### Story 1.1 — Create lib utilities and global constants

**Priority:** P0 (blocks everything)
**Files to create:**
- `src/lib/constants.ts`
- `src/lib/content-pages.ts`
- `src/lib/schema.ts`

#### Acceptance Criteria

- [ ] **AC1:** `src/lib/constants.ts` exports:
  - `SITE_NAME = "Easycao"`
  - `SITE_URL = "https://easycao.com"`
  - `SITE_DESCRIPTION` — generic school description (not lives-specific)
  - `WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/BqNohPkBOY4DAD2T95vxpu"`
  - `WHATSAPP_SUPPORT_URL` — placeholder for pre-sale WhatsApp (use group URL for now)
  - `HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/Y27990783F"`
  - `APP_STORE_URL` — placeholder string (e.g. `"#"`)
  - `PLAY_STORE_URL` — placeholder string (e.g. `"#"`)
  - `INSTAGRAM_URL = "https://www.instagram.com/easycao"`
  - `YOUTUBE_URL = "https://www.youtube.com/@easycao"`
  - `GTM_WEB_ID = "GTM-PDLS5SL"`
  - `DIOGO` object with: `name`, `title`, `credentials` (array), `photo` (path to prof-diogo.webp), `bio` (short paragraph)

- [ ] **AC2:** `src/lib/content-pages.ts` exports a `ContentPage` type and `CONTENT_PAGES` array. Each entry has:
  - `slug: string` (URL path without leading slash, e.g. `"descritores-da-prova-icao"`)
  - `title: string` (H1 text)
  - `seoTitle: string` (meta title, e.g. `"Descritores da Prova ICAO | Easycao"`)
  - `description: string` (meta description 150-160 chars)
  - `keywords: string[]` (primary + secondary)
  - `updatedAt: string` (ISO date)
  - `readingTime: number` (minutes)
  - `relatedSlugs: string[]` (3-4 related page slugs)
  - `category: "core" | "gap" | "niche"`
  - `phase: number` (1, 3, or 4)
  All 18 content pages must be registered (even if not yet built). Export helper functions:
  - `getPageBySlug(slug: string): ContentPage | undefined`
  - `getRelatedPages(slug: string): ContentPage[]`
  - `getPagesByCategory(category: string): ContentPage[]`
  - `getAllPages(): ContentPage[]`

- [ ] **AC3:** `src/lib/schema.ts` exports JSON-LD generator functions (all return `Record<string, unknown>`):
  - `organizationSchema()` — Easycao Organization
  - `personSchema()` — Diogo Verzola with credentials
  - `articleSchema(page: ContentPage)` — Article schema with author
  - `faqSchema(faqs: { question: string; answer: string }[])` — FAQPage
  - `breadcrumbSchema(items: { name: string; url: string }[])` — BreadcrumbList
  - `courseSchema()` — Course for /metodo
  - `mobileApplicationSchema()` — MobileApplication for Easycao app
  All schemas import from `constants.ts` for URLs and author data.

- [ ] **AC4:** `npm run build` passes with no errors

---

### Story 1.2 — Build global components (Navbar, Footer, WhatsAppFloat, AppBanner)

**Priority:** P0 (blocks all pages)
**Files to create:**
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/WhatsAppFloat.tsx`
- `src/components/AppBanner.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `Navbar.tsx` is a client component (`"use client"`) with:
  - Sticky position: `sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-border`
  - Height: `h-14 lg:h-16`
  - Left: Logo image (logo.webp, 32x32) + "Easycao" brand text
  - Center (desktop only): Nav links — "Prova ICAO" (dropdown with content page links), "Metodo" (→ /metodo), "Lives" (→ /lives)
  - "Prova ICAO" dropdown shows 6 core content page titles with links (read from `content-pages.ts` filtered by category "core")
  - Right: CTA button "Matricular" → links to `HOTMART_CHECKOUT_URL` from constants. Style: `bg-primary-light hover:bg-primary text-white font-bold rounded-xl px-6 py-2.5`
  - Mobile: Hamburger icon toggles slide-in menu with all links + CTA
  - Active link highlighting based on current pathname (use `usePathname()`)
  - All links use Next.js `<Link>` component

- [ ] **AC2:** `Footer.tsx` is a server component with:
  - Background: `bg-primary-dark text-white`
  - 4-column layout (stacked 2x2 on mobile):
    - **Easycao:** Logo + short description + social icons (Instagram, YouTube)
    - **Prova ICAO:** Links to all 6 core content pages (from content-pages.ts)
    - **Metodo:** "Conhecer o Metodo" → /metodo, "Lives Gratuitas" → /lives, "Matricular" → HOTMART_CHECKOUT_URL
    - **Contato:** WhatsApp link, Instagram link, YouTube link
  - Bottom bar: "Easycao (c) 2026. Todos os direitos reservados."
  - All links from `content-pages.ts` and `constants.ts`

- [ ] **AC3:** `WhatsAppFloat.tsx` is a client component with:
  - Fixed position: `fixed bottom-6 right-6 z-40`
  - Green circle: `bg-whatsapp hover:bg-whatsapp-hover rounded-full w-14 h-14 shadow-lg`
  - WhatsApp SVG icon (white, 28px)
  - Pulse animation: `animate-pulse-subtle` (existing CSS class)
  - Links to `WHATSAPP_SUPPORT_URL` from constants
  - `target="_blank" rel="noopener noreferrer"`
  - `aria-label="Fale conosco pelo WhatsApp"`

- [ ] **AC4:** `AppBanner.tsx` is a server component with `variant` prop (`"section" | "inline" | "sidebar"`):
  - **section variant:** Full-width section with gradient bg (`from-primary to-primary-dark`), heading "Pratique com o unico simulador ICAO do mercado", 3 feature bullets (record answers, per-descriptor feedback, 283T+ combinations), App Store + Play Store badge links (using constants), phone mockup placeholder (use a div with phone outline styling)
  - **inline variant:** Compact card within article body. `bg-gray-light rounded-2xl p-6`. Small phone icon + "Baixe o App Easycao e pratique com simulados reais" + store badges row
  - **sidebar variant:** Small card. `bg-gray-light rounded-2xl p-4`. App icon + "Baixe gratis" text + store badge links stacked vertically
  - All variants link to App Store and Play Store URLs from constants
  - Store badges are styled `<a>` tags with text (not images — we don't have badge images yet)

- [ ] **AC5:** `npm run build` passes with no errors

---

### Story 1.3 — Setup marketing layout, infrastructure changes, and homepage shell

**Priority:** P0 (blocks all marketing pages)
**Files to create:**
- `src/app/(marketing)/layout.tsx`
- `src/app/(marketing)/page.tsx` (minimal homepage shell)

**Files to modify:**
- `src/app/layout.tsx` — generalize metadata, add WhatsAppFloat
- `src/app/globals.css` — add article prose styles
- `src/app/sitemap.ts` — dynamic from content registry
- `next.config.ts` — remove `/` → `/lives` redirect

**Files to delete:**
- `src/app/page.tsx` (old redirect)

**Files to move:**
- `src/app/lives/ProfessorSection.tsx` → `src/components/ProfessorSection.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `(marketing)/layout.tsx` wraps children with `<Navbar />` above and `<Footer />` below
  ```tsx
  export default function MarketingLayout({ children }) {
    return (
      <>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </>
    );
  }
  ```

- [ ] **AC2:** `(marketing)/page.tsx` is a minimal homepage shell that renders:
  - A temporary hero section with H1 "Tudo que voce precisa para ser aprovado no ICAO" and a CTA link to /metodo
  - This is a placeholder — Epic 3 will build the full homepage
  - Export metadata: `title: "Easycao — Tudo sobre a Prova ICAO"`, `description: SITE_DESCRIPTION` from constants

- [ ] **AC3:** Root `layout.tsx` changes:
  - Title: `"Easycao — Tudo sobre a Prova ICAO"` (was lives-specific)
  - Description: Generic school description from `SITE_DESCRIPTION` constant
  - OG url: `"https://easycao.com"` (was `/lives`)
  - Add `<WhatsAppFloat />` inside `<body>` after `{children}`
  - Keep all GTM scripts, Poppins font, lang="pt-BR" unchanged

- [ ] **AC4:** `next.config.ts` — Remove the redirect block that sends `/` to `/lives`. Keep all headers and image config untouched.

- [ ] **AC5:** Old `src/app/page.tsx` (redirect) is deleted. The new `(marketing)/page.tsx` now serves `/`.

- [ ] **AC6:** `ProfessorSection.tsx` moved from `src/app/lives/` to `src/components/`. Import in `lives/page.tsx` updated to `../../components/ProfessorSection`. Component works identically.

- [ ] **AC7:** `sitemap.ts` imports `getAllPages()` from `content-pages.ts` and generates entries for:
  - `/` (priority 1.0)
  - `/metodo` (priority 0.9)
  - `/lives` (priority 0.8)
  - All content pages from registry (priority 0.7, lastModified from `updatedAt`)

- [ ] **AC8:** `globals.css` adds article prose styles:
  - `.prose h2` — `margin-top: 2.5rem; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 700; color: #353535;`
  - `.prose h3` — `margin-top: 2rem; margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: 600;`
  - `.prose p` — `margin-bottom: 1rem; line-height: 1.75; color: rgba(53,53,53,0.7);`
  - `.prose ul, .prose ol` — `margin-bottom: 1rem; padding-left: 1.5rem;`
  - `.prose li` — `margin-bottom: 0.5rem;`
  - `.prose a` — `color: #1F96F7; text-decoration: underline;`
  - `.prose table` — Basic table styling with borders
  - `scroll-padding-top: 5rem` on `html` (accounts for sticky navbar)

- [ ] **AC9:** `/lives` still works unchanged. `/confirma-cadastro-lives` still works unchanged.

- [ ] **AC10:** `npm run build` passes. `/` renders the homepage shell. `/lives` renders the existing landing page.

---

## Epic 2: Content Component Library (Phase 1A)

### Story 2.1 — Build content page sub-components

**Priority:** P1 (blocks content pages)
**Files to create:**
- `src/components/content/Breadcrumbs.tsx`
- `src/components/content/AuthorBox.tsx`
- `src/components/content/ArticleMeta.tsx`
- `src/components/content/CalloutBox.tsx`
- `src/components/content/FAQAccordion.tsx`
- `src/components/content/TableOfContents.tsx`
- `src/components/content/RelatedPages.tsx`
- `src/components/content/CTABand.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `Breadcrumbs.tsx` — Server component. Props: `items: { label: string; href?: string }[]`. Renders trail: "Home > [Parent] > Current". Last item is plain text (no link). Injects `<script type="application/ld+json">` with `breadcrumbSchema()` from `schema.ts`. Style: `text-sm text-black/50`, links are `text-primary hover:underline`.

- [ ] **AC2:** `AuthorBox.tsx` — Server component. No props (reads from `constants.ts` DIOGO object). Renders: Photo (rounded-full, 64px), name, title ("Examinador ICAO Credenciado"), short bio. Container: `bg-gray-light rounded-2xl p-6 flex gap-4 items-start`. Below article body.

- [ ] **AC3:** `ArticleMeta.tsx` — Server component. Props: `updatedAt: string, readingTime: number`. Renders: "Atualizado em [month in Portuguese] [year]" + "[X] min de leitura" + "Por Diogo Verzola". Style: `text-sm text-black/50 flex gap-4 flex-wrap`.

- [ ] **AC4:** `CalloutBox.tsx` — Server component. Props: `variant: "info" | "warning" | "tip"`, `title?: string`, `children: ReactNode`. Renders a bordered box with icon. Colors: info = blue (primary/10 bg, primary border-l-4), warning = amber (amber-50 bg, amber-500 border-l-4), tip = green (emerald-50 bg, emerald-500 border-l-4). Icons: info = circle-i, warning = triangle, tip = lightbulb (SVG inline).

- [ ] **AC5:** `FAQAccordion.tsx` — Client component (`"use client"`). Props: `faqs: { question: string; answer: string }[]`. Each item is a `<details>` element with `<summary>` for the question. Smooth open/close via CSS `details[open] .faq-answer { max-height: 500px }` with transition. Injects `<script type="application/ld+json">` with `faqSchema()`. Style: `border-b border-gray-border py-4`. Summary: `font-semibold text-black cursor-pointer`. Answer: `text-black/70 mt-2`.

- [ ] **AC6:** `TableOfContents.tsx` — Client component (`"use client"`). Props: `headings: { id: string; text: string; level: 2 | 3 }[]`. Renders sticky sidebar list (`sticky top-24`). Uses `IntersectionObserver` to highlight active section. H2 items are bold, H3 items are indented with `pl-4`. Active item has `text-primary font-semibold` + left border. Links scroll to heading via `href="#id"`.

- [ ] **AC7:** `RelatedPages.tsx` — Server component. Props: `currentSlug: string`. Uses `getRelatedPages()` from content-pages.ts. Renders 3-4 cards in a grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`). Each card: title + description truncated to 2 lines + "Ler mais →" link. Style: `border border-gray-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all`.

- [ ] **AC8:** `CTABand.tsx` — Server component. Props: `variant: "metodo" | "lives"`. Full-width gradient band (`from-primary to-primary-dark`). Centered text + CTA button. Metodo variant: "Pronto para ser aprovado?" + "Conhecer o Metodo" button → /metodo. Lives variant: "Participe das lives gratuitas" + "Participar" button → /lives. Style: `py-16 text-center text-white`.

- [ ] **AC9:** All components use Tailwind CSS only (no new dependencies). All use the design system from style-guide.md.

- [ ] **AC10:** `npm run build` passes.

---

### Story 2.2 — Build ContentPageLayout wrapper

**Priority:** P1 (blocks content pages)
**Files to create:**
- `src/components/content/ContentPageLayout.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `ContentPageLayout.tsx` — Server component. Props:
  ```ts
  interface ContentPageLayoutProps {
    slug: string;
    children: React.ReactNode; // article body content
    headings: { id: string; text: string; level: 2 | 3 }[];
    faqs: { question: string; answer: string }[];
    ctaVariant?: "metodo" | "lives"; // defaults to "metodo"
  }
  ```

- [ ] **AC2:** Layout structure renders in this order:
  1. Hero banner with gradient bg (`from-[#0a3d6b] via-primary-dark to-primary py-16 lg:py-20`)
     - `Breadcrumbs` (Home > Page Title)
     - `<h1>` with page title from content registry
     - `ArticleMeta` with updatedAt and readingTime from registry
  2. Two-column grid (`max-w-7xl mx-auto px-5 lg:px-8 py-12 lg:py-16`):
     - Left column (article, `lg:col-span-2`): `<article className="prose">` wrapping `{children}`
     - Right column (sidebar, `lg:col-span-1`): `TableOfContents` + `AppBanner` sidebar variant + `CTABand` (small sidebar version)
  3. Below columns: `FAQAccordion` (full width)
  4. `AuthorBox`
  5. `RelatedPages` (using slug)
  6. `CTABand` (full width, metodo variant)

- [ ] **AC3:** Injects JSON-LD schemas: `articleSchema(page)` + `breadcrumbSchema` (via Breadcrumbs) + `faqSchema` (via FAQAccordion)

- [ ] **AC4:** Responsive: On mobile, sidebar stacks below article. On desktop, 2/3 + 1/3 grid (`grid-cols-1 lg:grid-cols-3`).

- [ ] **AC5:** `npm run build` passes.

---

## Epic 3: Homepage (Phase 1B)

### Story 3.1 — Build homepage section components

**Priority:** P1
**Files to create:**
- `src/app/(marketing)/HomepageHero.tsx`
- `src/app/(marketing)/TrustStrip.tsx`
- `src/app/(marketing)/WhatIsEasycao.tsx`
- `src/app/(marketing)/ContentHub.tsx`
- `src/app/(marketing)/LivesBanner.tsx`
- `src/app/(marketing)/CTAFinal.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `HomepageHero.tsx` — Server component with client animation wrapper. Text-driven, NO photo.
  - Background: gradient `from-[#0a3d6b] via-primary-dark to-primary` with 3 decorative translucent circles (same pattern as lives hero)
  - Min height: `min-h-[70vh] lg:min-h-[80vh]`
  - Centered layout (not 2-column like lives)
  - H1: "Tudo que voce precisa para ser aprovado no ICAO" — `text-2xl sm:text-3xl lg:text-[44px] font-bold text-white text-center leading-tight`
  - Subtitle: "A maior escola de preparacao para a prova ICAO do Brasil. Criada pelo unico examinador credenciado que ensina." — `text-base lg:text-xl text-white/80 text-center max-w-2xl mx-auto`
  - CTA button: "Conhecer o Metodo" → /metodo — `bg-primary-light hover:bg-primary text-white font-bold rounded-xl px-8 py-4 text-lg`
  - Secondary link: "Ou participe das lives gratuitas" → /lives — `text-white/60 hover:text-white underline`

- [ ] **AC2:** `TrustStrip.tsx` — Server component. 3 badges in a row:
  - "+1000 pilotos aprovados" with checkmark icon
  - "Examinador ICAO credenciado" with shield icon
  - "Lives gratuitas toda semana" with calendar icon
  - Container: `bg-white py-8 lg:py-12`
  - Badge style: `flex items-center gap-3`, icon in `bg-primary/10 rounded-xl p-3`, text `font-semibold text-black`
  - Grid: `grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto`

- [ ] **AC3:** `WhatIsEasycao.tsx` — Server component.
  - Container: `bg-white py-16 lg:py-20`
  - Overline: "Sobre a Easycao" — `text-sm font-medium text-primary uppercase tracking-widest`
  - H2: "A escola que prepara pilotos para o ICAO de verdade"
  - Paragraph explaining philosophy: Easycao is not just a course, it's a complete preparation method created by the only credentialed ICAO examiner teaching in Brazil. Focus on the method, simulator app, community, and weekly lives.
  - Keep it short — 2-3 paragraphs max

- [ ] **AC4:** `ContentHub.tsx` — Server component.
  - Container: `bg-gray-light py-16 lg:py-20`
  - Overline: "Tudo sobre a Prova ICAO"
  - H2: "Entenda tudo sobre o exame"
  - 4 cards linking to top content pages (from content-pages.ts, first 4 core pages):
    - Each card: icon placeholder (SVG) + title + 1-line description + "Ler mais →"
    - Style: `bg-white rounded-2xl p-6 border border-gray-border hover:shadow-lg hover:border-primary/30 transition-all`
  - Grid: `grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto`

- [ ] **AC5:** `LivesBanner.tsx` — Server component.
  - Subtle gradient background: `bg-gradient-to-r from-primary/5 to-primary/10`
  - Content: "Participe das lives gratuitas toda semana" + schedule (Terca 19h Instagram, Quinta 13h30 YouTube) + CTA "Participar" → /lives
  - Single row layout, centered

- [ ] **AC6:** `CTAFinal.tsx` — Server component.
  - Full-width gradient: `from-primary to-primary-dark`
  - H2: "Pronto para ser aprovado no ICAO?" — white, bold, centered
  - Subtitle: brief encouragement text — `text-white/80`
  - CTA button: "Conhecer o Metodo" → /metodo
  - Secondary: "Ou participe das lives gratuitas" → /lives

- [ ] **AC7:** All components follow style-guide.md patterns. Mobile-first. `npm run build` passes.

---

### Story 3.2 — Assemble full homepage with all sections

**Priority:** P1
**Files to modify:**
- `src/app/(marketing)/page.tsx` — replace shell with full homepage

#### Acceptance Criteria

- [ ] **AC1:** Homepage `page.tsx` assembles all 11 sections in order:
  1. `HomepageHero`
  2. `TrustStrip`
  3. `WhatIsEasycao`
  4. `ContentHub`
  5. `ProfessorSection` (imported from `src/components/ProfessorSection.tsx`)
  6. `AppBanner` (section variant)
  7. `ApprovalCarousel` (imported from `src/components/ApprovalCarousel.tsx`)
  8. `LivesBanner`
  9. `CTAFinal`

- [ ] **AC2:** Page exports metadata:
  ```ts
  export const metadata = {
    title: "Easycao — Tudo sobre a Prova ICAO",
    description: "A maior escola de preparacao para a prova ICAO do Brasil. Metodo criado pelo unico examinador ICAO credenciado que ensina. Simulador, comunidade e lives gratuitas.",
    openGraph: { ... },
  }
  ```

- [ ] **AC3:** Page injects JSON-LD schemas: `organizationSchema()`, `personSchema()`, `mobileApplicationSchema()`

- [ ] **AC4:** All sections render correctly on mobile and desktop. Scroll animations work (fade-in-up via useInView where applicable).

- [ ] **AC5:** `npm run build` passes. No broken links. Homepage renders at `/`.

---

## Epic 4: Core Content Pages (Phase 1C)

Each story creates one content page using `ContentPageLayout`. Each page is a `page.tsx` inside `src/app/(marketing)/[slug]/`. Each page exports `metadata` and `generateMetadata` using content registry data.

### Story 4.1 — Content page: /descritores-da-prova-icao

**Priority:** P1 (highest SEO value — recovers 404)
**File:** `src/app/(marketing)/descritores-da-prova-icao/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** Page uses `ContentPageLayout` with proper slug, headings, and FAQs
- [ ] **AC2:** Content covers (2500-3000 words equivalent in JSX):
  - H2: O que sao os descritores holisticos da ICAO — explain the framework, "lowest score = final level" rule
  - H2: Os 6 descritores em detalhe — one H3 per descriptor:
    - H3: Pronunciation — what evaluators look for, common Brazilian errors
    - H3: Structure — grammar patterns tested (NOT traditional grammar)
    - H3: Vocabulary — aviation-specific + general range expected
    - H3: Fluency — speed, pauses, filler words patterns
    - H3: Comprehension — how they test it during the exam
    - H3: Interaction — turn-taking, clarification, recovery strategies
  - H2: Como funciona a nota final — visual explanation: 6 scores → lowest = result. Use a styled table/card showing example scores
  - H2: Palavras-chave de progressao entre niveis — table showing how language shifts (e.g. "frequently" → "only sometimes" → "rarely" between L3/L4/L5)
  - H2: Dicas para melhorar cada descritor — practical tips. Include `AppBanner` inline variant after this section
  - CalloutBox (info): "A nota final e sempre o menor descritor" — highlight this critical rule
  - CalloutBox (tip): Link to ANAC official page about SDEA
  - Internal links to: /niveis-icao, /como-funciona-a-prova-icao, /como-se-preparar-para-a-prova-icao, /metodo
  - External link to ANAC official source
- [ ] **AC3:** FAQ section (5-6 questions):
  - "Quantos descritores sao avaliados?" → 6
  - "Qual descritor e mais dificil?" → Interaction for most Brazilians
  - "Posso tirar 6 em um e 4 em outro?" → Yes, but final = lowest (4)
  - "Como praticar os descritores?" → Mention app simulator + lives
  - "Os descritores mudaram em 2025?" → No, ICAO Doc 9835 standard since 2010
- [ ] **AC4:** Metadata exports with SEO title, description, OG data
- [ ] **AC5:** `npm run build` passes

---

### Story 4.2 — Content page: /como-se-preparar-para-a-prova-icao

**File:** `src/app/(marketing)/como-se-preparar-para-a-prova-icao/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** Page uses `ContentPageLayout`
- [ ] **AC2:** Content (2000-2500 words):
  - H2: Os 3 erros mais comuns na preparacao
    - Decorar respostas (examinador percebe, score drops)
    - Estudar ingles geral (ICAO tests specific aviation contexts)
    - Nao praticar fala (it's an ORAL exam)
  - H2: O que estudar para a prova ICAO — link to /descritores
  - H2: Quanto tempo leva para se preparar — 2-6 months depending on current level
  - H2: Metodo de estudo recomendado — positions Easycao method. Include `AppBanner` inline variant
  - H2: Recursos gratuitos para comecar — lives (link to /lives), YouTube channel
  - H2: Quando voce esta pronto para a prova — self-assessment checklist (5-6 items)
  - CalloutBox (warning): "Decorar respostas e o erro #1 dos pilotos"
  - Internal links: /descritores, /como-funciona, /niveis-icao, /metodo, /lives
  - External link: ANAC SDEA page
- [ ] **AC3:** FAQ (5-6 questions): preparation time, self-study vs course, free resources, when to schedule, Level 4 minimum
- [ ] **AC4:** Metadata + `npm run build` passes

---

### Story 4.3 — Content page: /como-funciona-a-prova-icao

**File:** `src/app/(marketing)/como-funciona-a-prova-icao/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** Page uses `ContentPageLayout`
- [ ] **AC2:** Content (2000-2500 words):
  - H2: As 4 partes da prova ICAO — one H3 per part:
    - H3: Parte 1 — Aviation Topics (~5 min)
    - H3: Parte 2 — Interacting as a Pilot (~15 min, 5 scenarios)
    - H3: Parte 3 — Unexpected Situations (~15 min, 3 emergencies)
    - H3: Parte 4 — Picture Description (~10 min)
  - For each part: what happens, duration, what's evaluated, tips
  - H2: Como voce e avaliado — link to /descritores (6 descriptors)
  - H2: Quanto tempo dura a prova — ~50 minutes total
  - H2: Como funciona a nota — scoring rule, lowest descriptor = final level
  - H2: A prova ICAO NAO e online — myth-busting callout
  - H2: O que acontece se voce reprovar — 60-day rule, link to /reprovado
  - Include `AppBanner` inline after "As 4 partes da prova"
  - CalloutBox (info): "A prova dura aproximadamente 50 minutos"
  - CalloutBox (warning): "A prova NAO e online — e presencial com examinadores credenciados"
  - Internal links: /descritores, /niveis-icao, /onde-fazer, /como-se-preparar, /metodo
  - External link: ANAC official
- [ ] **AC3:** FAQ (5-6 questions): online?, reschedule?, fail consequences, domestic flights, preparation time
- [ ] **AC4:** Metadata + `npm run build` passes

---

### Story 4.4 — Content page: /niveis-icao

**File:** `src/app/(marketing)/niveis-icao/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** Page uses `ContentPageLayout`
- [ ] **AC2:** Content (1800-2200 words):
  - H2: A escala ICAO em resumo — visual comparison table (styled HTML table):
    | Nivel | Nome | Resultado | Validade |
    |-------|------|-----------|----------|
    | 1-3 | Pre-Elementary to Pre-Operational | Reprovado | N/A |
    | 4 | Operational | Aprovado (minimo) | 3 anos |
    | 5 | Extended | Aprovado | 6 anos |
    | 6 | Expert | Aprovado (maximo) | Vitalicio* |
  - H2: Nivel 3 e abaixo — o que significa reprovar — consequences, 60-day wait
  - H2: Nivel 4 — o minimo operacional — what it means, career implications, most common result
  - H2: Nivel 5 — avancado — benefits, 6-year validity, what's different
  - H2: Nivel 6 — expert — 2-stage process explained (from ANAC reference):
    - Stage 1: standard exam identifies candidates
    - Stage 2: advanced verification, 5-part, 45 min, within 60 days
    - Non-passing Stage 2 = retain Level 5
  - H2: Qual nivel as companhias aereas exigem — practical career info
  - H2: Como subir de nivel — link to /como-se-preparar + /metodo
  - CalloutBox (info): "Level 6 e vitalicio mas sujeito a vigilancia continua"
  - Internal links: /descritores, /como-funciona, /como-se-preparar, /metodo
  - External link: ANAC
- [ ] **AC3:** FAQ (5-6 questions): minimum level, Level 6 process, validity, renewal, airline requirements
- [ ] **AC4:** Metadata + `npm run build` passes

---

### Story 4.5 — Content page: /quanto-custa-a-prova-icao

**File:** `src/app/(marketing)/quanto-custa-a-prova-icao/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** Page uses `ContentPageLayout`
- [ ] **AC2:** Content (1500-2000 words):
  - H2: Custo direto da prova em 2026 — table by institution (approximate ranges R$800-R$1,200 based on research). Note: actual prices should be verified, use ranges
  - H2: Custos ocultos que ninguem fala — breakdown card:
    - Passagem aerea (if traveling)
    - Hospedagem
    - Alimentacao + transporte
    - Material de estudo
    - Horas de trabalho perdidas
  - H2: Custo total real — R$1,500-R$2,500 all-in estimate
  - H2: O custo de reprovar — retake math: R$1,000+ per attempt + 60-day delay + career impact
  - H2: Paulo vs Joao — dois caminhos — story comparing: Paulo prepared properly (1 attempt) vs Joao didn't (3 attempts, R$3,000+, 6 months lost)
  - H2: Como economizar na prova ICAO — invest in preparation, choose nearby center, prepare in advance
  - CalloutBox (warning): "Cada reprovacao custa no minimo R$1,000 + 60 dias de espera"
  - CalloutBox (tip): "Investir em preparacao adequada e a maior economia"
  - Internal links: /onde-fazer, /como-se-preparar, /como-funciona, /metodo
  - External link: ANAC
- [ ] **AC3:** FAQ (5 questions): exact price, payment methods, retake cost, employer coverage, cheapest option
- [ ] **AC4:** Metadata + `npm run build` passes

---

### Story 4.6 — Content page: /onde-fazer-a-prova-icao

**File:** `src/app/(marketing)/onde-fazer-a-prova-icao/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** Page uses `ContentPageLayout`
- [ ] **AC2:** Content (2000-2500 words):
  - H2: Quem pode aplicar a prova ICAO — accredited entities only (ANAC regulation)
  - H2: Centros credenciados por regiao — organized by region. Use a styled table/card per region:
    - H3: Sudeste — list centers in SP, RJ, MG (from ANAC reference: includes entities like ICEA, flight schools, etc.)
    - H3: Sul — PR, SC, RS centers
    - H3: Nordeste — available centers
    - H3: Centro-Oeste e Norte — available centers
    For each: name, city, contact info where known. Note: "Consulte a lista atualizada no site da ANAC" with external link
  - H2: Se voce e piloto de companhia aerea — airlines often schedule directly
  - H2: Como agendar sua prova — step by step:
    1. Choose accredited center
    2. Contact for availability
    3. Schedule (typically 2-4 weeks advance)
    4. Prepare documentation
    5. Show up with valid ID + pilot license
  - H2: O que levar no dia da prova — checklist: valid ID, pilot license, calm mindset
  - H2: Dicas para escolher o melhor centro — proximity, availability, reviews
  - CalloutBox (info): "Existem 11+ centros credenciados no Brasil"
  - Internal links: /como-funciona, /como-se-preparar, /quanto-custa, /metodo
  - External link: ANAC list of accredited entities
- [ ] **AC3:** FAQ (5-6 questions): nearest center, scheduling time, reschedule, online option, documentation
- [ ] **AC4:** Metadata + `npm run build` passes

---

## Epic 5: Sales Page /metodo (Phase 2)

### Story 5.1 — Build sales page sections (Hero through ModuleCards)

**Priority:** P2
**Files to create:**
- `src/app/(marketing)/metodo/page.tsx` (shell)
- `src/app/(marketing)/metodo/SalesHero.tsx`
- `src/app/(marketing)/metodo/ProblemSection.tsx`
- `src/app/(marketing)/metodo/AgitationSection.tsx`
- `src/app/(marketing)/metodo/AuthoritySection.tsx`
- `src/app/(marketing)/metodo/MethodReveal.tsx`
- `src/app/(marketing)/metodo/TestimonialsGrid.tsx`
- `src/app/(marketing)/metodo/ModuleCards.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `SalesHero.tsx` — Gradient bg. H1: transformation headline (e.g. "Seja aprovado no ICAO com o metodo do unico examinador credenciado"). VSL placeholder (gray box with play icon, "Video em breve"). Primary CTA: "Quero me matricular" → HOTMART_CHECKOUT_URL. Trust badges below CTA (similar to TrustStrip).

- [ ] **AC2:** `ProblemSection.tsx` — White bg. H2: "Voce estuda mas na hora da prova..." 3-4 pain points with icons:
  - Trava na hora de falar
  - Nao entende o audio com sotaque
  - Nao sabe como descrever imagens
  - Decora respostas mas o examinador percebe

- [ ] **AC3:** `AgitationSection.tsx` — Light bg. H2: "O que acontece quando voce nao passa". 3 consequence cards:
  - Carreira estagnada (can't fly international)
  - Dinheiro perdido (R$1,000+ per attempt)
  - Tempo desperdicado (60-day wait + more study)

- [ ] **AC4:** `AuthoritySection.tsx` — Uses ProfessorSection component with enhanced layout for sales context. Add credential highlights: "Examinador ICAO credenciado pela ANAC", "Certificado Cambridge", "20+ anos de experiencia", "Ex-controlador de trafego aereo". Photo + credential cards layout.

- [ ] **AC5:** `MethodReveal.tsx` — Gradient bg. H2: "Nao e um curso. E um Metodo." Explain what makes it different: created by examiner, based on what's actually tested, focuses on speaking not grammar, 36 techniques, systematic approach. 3-4 differentiator cards.

- [ ] **AC6:** `TestimonialsGrid.tsx` — White bg. H2: "Veja quem ja passou com o Metodo Easycao". Placeholder grid for testimonials (3 cards with placeholder images/text for video thumbnails or WhatsApp screenshots). Each card: quote text + name + result. Style matches approval carousel aesthetic.

- [ ] **AC7:** `ModuleCards.tsx` — Light bg. H2: "O que voce vai aprender". 6 module cards:
  1. Pronunciation & Fluency
  2. Aviation Vocabulary
  3. Communication Strategies
  4. Unexpected Situations
  5. Picture Description
  6. Full Simulation Practice
  Each card: number badge + title + brief description + icon

- [ ] **AC8:** `metodo/page.tsx` assembles all sections built so far (remaining sections come in next stories). Exports metadata with Course schema.

- [ ] **AC9:** `npm run build` passes

---

### Story 5.2 — Build sales page sections (Simulator through ValueStack)

**Files to create:**
- `src/app/(marketing)/metodo/SimulatorSection.tsx`
- `src/app/(marketing)/metodo/CommunitySection.tsx`
- `src/app/(marketing)/metodo/BonusStack.tsx`
- `src/app/(marketing)/metodo/MuralAprovados.tsx`
- `src/app/(marketing)/metodo/ValueStack.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `SimulatorSection.tsx` — Uses `AppBanner` section variant with enhanced sales context. Additional content: "283 trilhoes+ de combinacoes", "Grave suas respostas e receba feedback por descritor", "Disponivel para iOS e Android". Phone mockup placeholder + App Store/Play Store badges.

- [ ] **AC2:** `CommunitySection.tsx` — H2: "A maior comunidade de pilotos preparando para o ICAO". Community benefits: peer support, WhatsApp group access, weekly lives. Placeholder for community preview screenshot. Style: warm, inviting.

- [ ] **AC3:** `BonusStack.tsx` — H2: "E tem mais: bonus exclusivos". 3-4 bonus items with individual "values":
  - Bonus 1: Acesso a comunidade (valor R$X)
  - Bonus 2: Lives semanais com examinador (valor R$X)
  - Bonus 3: App simulador (valor R$X)
  - Bonus 4: Material complementar (valor R$X)
  Each: card with checkmark icon + title + description + strikethrough "value". Style: list with green checkmarks.

- [ ] **AC4:** `MuralAprovados.tsx` — Reuses `ApprovalCarousel` component + additional context. H2: "Mural de aprovados". Subtitle showing count. Full-width carousel.

- [ ] **AC5:** `ValueStack.tsx` — Pricing section. H2: "Quanto custa investir na sua aprovacao". Value stacking: show total of bonuses (R$X), then actual price below. Placeholder pricing (use "A partir de 12x de R$XX,XX" format). PIX discount callout. CTA button → HOTMART_CHECKOUT_URL. Style: centered card with shadow, green accent for price.

- [ ] **AC6:** Add all new sections to `metodo/page.tsx`. `npm run build` passes.

---

### Story 5.3 — Build sales page final sections and complete assembly

**Files to create:**
- `src/app/(marketing)/metodo/GuaranteeSection.tsx`
- `src/app/(marketing)/metodo/SalesFAQ.tsx`
- `src/app/(marketing)/metodo/FinalCTA.tsx`
- `src/app/(marketing)/metodo/StickyMobileCTA.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `GuaranteeSection.tsx` — H2: "Garantia de 30 dias". Shield/badge icon. Text explaining unconditional guarantee. "Se voce nao gostar, devolvemos 100% do seu dinheiro. Sem perguntas." Style: centered, trust-building.

- [ ] **AC2:** `SalesFAQ.tsx` — Uses `FAQAccordion` component with sales-specific questions (10-12):
  - Para quem e o Metodo Easycao?
  - Funciona para quem nunca fez a prova?
  - E para quem ja reprovou?
  - Quanto tempo de acesso?
  - Posso parcelar?
  - Tem desconto no PIX?
  - Como funciona a garantia?
  - Preciso de nivel basico de ingles?
  - Tem suporte?
  - Quando comecam as aulas?
  - E diferente de outros cursos?
  - Posso acessar pelo celular?

- [ ] **AC3:** `FinalCTA.tsx` — Full-width gradient. H2: urgency headline (e.g. "Nao deixe sua carreira esperando"). Final CTA button → HOTMART_CHECKOUT_URL. WhatsApp support link below.

- [ ] **AC4:** `StickyMobileCTA.tsx` — Client component. `fixed bottom-0 left-0 right-0 z-30` on mobile only (`lg:hidden`). White bg with shadow-up. CTA button "Matricular agora" → HOTMART_CHECKOUT_URL. Shows only after scrolling past hero (use scroll event listener). Height: `py-3 px-5`. Button: full-width, `bg-primary-light text-white font-bold rounded-xl py-3`.

- [ ] **AC5:** Complete `metodo/page.tsx` with ALL 16 sections in correct order. Add JSON-LD: `courseSchema()`, `faqSchema()`, `personSchema()`, `breadcrumbSchema()`, `mobileApplicationSchema()`.

- [ ] **AC6:** `npm run build` passes. Full /metodo page renders correctly on mobile and desktop.

---

## Epic 6: Gap Content Pages (Phase 3)

All gap pages follow the same pattern as core content pages using `ContentPageLayout`. Each story creates 2 pages.

### Story 6.1 — Gap pages: validade-e-renovacao + sdea

**Files:**
- `src/app/(marketing)/validade-e-renovacao-prova-icao/page.tsx`
- `src/app/(marketing)/sdea-santos-dumont-english-assessment/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `/validade-e-renovacao-prova-icao` — Content:
  - H2: Validade por nivel (table: L4=3yr, L5=6yr, L6=lifetime with surveillance)
  - H2: Quando renovar — planning timeline
  - H2: Processo de renovacao — same exam, no shortcuts
  - H2: O que acontece se expirar — consequences for career
  - H2: Estrategia de renovacao — study plan for each level
  - FAQ: 5 questions about validity/renewal
  - Internal links to /niveis-icao, /como-funciona, /como-se-preparar

- [ ] **AC2:** `/sdea-santos-dumont-english-assessment` — Content:
  - H2: O que e o SDEA — official ANAC name for ICAO proficiency test
  - H2: SDEA vs "prova ICAO" — same thing, different names
  - H2: Como funciona o SDEA — link to /como-funciona for details
  - H2: Quem aplica o SDEA — accredited entities
  - H2: Historico e mudancas recentes — ANAC updates 2024-2025
  - FAQ: 5 questions about SDEA specifics
  - Internal links to /como-funciona, /onde-fazer, /descritores

- [ ] **AC3:** Both pages use `ContentPageLayout`, have proper metadata, FAQs, and pass build.

---

### Story 6.2 — Gap pages: reprovado + vocabulario

**Files:**
- `src/app/(marketing)/reprovado-na-prova-icao/page.tsx`
- `src/app/(marketing)/vocabulario-aviacao-ingles/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `/reprovado-na-prova-icao` — Content:
  - H2: O que acontece quando voce reprova — Level 3 or below, practical implications
  - H2: A regra dos 60 dias — can only retake after 60 calendar days
  - H2: Entendendo seu resultado — which descriptors were weak
  - H2: Plano de recuperacao — step-by-step recovery plan
  - H2: Quanto custa reprovar — financial + time impact, link to /quanto-custa
  - H2: Como evitar reprovar de novo — preparation strategy, link to /como-se-preparar
  - CalloutBox (warning): "Voce so pode refazer a prova apos 60 dias"
  - Include `AppBanner` inline (practice with simulator to improve weak descriptors)
  - FAQ: 5 questions about failure/retake

- [ ] **AC2:** `/vocabulario-aviacao-ingles` — Glossary page (massive long-tail SEO):
  - H2: Glossario de aviacao em ingles — organized alphabetically or by category
  - Categories: Aerodrome/Airport, Aircraft Systems, ATC Communications, Emergency, Meteorology, Navigation
  - Each term: English term + Portuguese translation + context sentence
  - Minimum 50-60 terms
  - H2: Como usar este vocabulario na prova ICAO
  - H2: Vocabulario por parte da prova — link terms to exam parts
  - Internal links to /descritores, /como-funciona, /como-se-preparar
  - FAQ: 5 questions about vocabulary

- [ ] **AC3:** Both pages pass build with proper metadata and FAQs.

---

### Story 6.3 — Gap pages: simulado + erros-comuns

**Files:**
- `src/app/(marketing)/simulado-prova-icao/page.tsx`
- `src/app/(marketing)/erros-comuns-prova-icao/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `/simulado-prova-icao` — THE app showcase page:
  - H2: O que e um simulado ICAO — what simulation practice means
  - H2: O Simulador Easycao — full feature showcase:
    - How it works: choose scenario → record your answer → get per-descriptor feedback
    - 283 trilhoes+ de combinacoes
    - Available on iOS and Android
    - Based on ICAO Doc 9835 descriptors
  - `AppBanner` section variant (prominent, full-width)
  - H2: Como praticar sem o app — free alternatives (lives, YouTube, self-practice tips)
  - H2: Por que simulados sao essenciais — research/evidence
  - MobileApplication JSON-LD schema
  - Internal links to /descritores, /como-se-preparar, /como-funciona
  - FAQ: 5 questions about simulator/practice

- [ ] **AC2:** `/erros-comuns-prova-icao` — Content:
  - H2: Os erros mais comuns por descritor — one H3 per descriptor with top mistakes
  - H2: Erros de estrategia — studying wrong way, not practicing speaking
  - H2: Erros no dia da prova — nervousness, not asking for repetition
  - H2: Como o app ajuda a evitar esses erros — `AppBanner` inline
  - Internal links to /descritores, /como-se-preparar, /como-funciona
  - FAQ: 5 questions

- [ ] **AC3:** Both pages pass build.

---

### Story 6.4 — Gap pages: como-agendar + quem-precisa

**Files:**
- `src/app/(marketing)/como-agendar-a-prova-icao/page.tsx`
- `src/app/(marketing)/quem-precisa-fazer-prova-icao/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `/como-agendar-a-prova-icao` — Step-by-step:
  - H2: Passo a passo para agendar — numbered steps with details
  - H2: Documentos necessarios — checklist
  - H2: Quanto tempo de antecedencia — typical 2-4 weeks
  - H2: Centros credenciados — brief overview + link to /onde-fazer
  - H2: Dicas para o dia da prova
  - Internal links to /onde-fazer, /quanto-custa, /como-se-preparar
  - FAQ: 5 questions

- [ ] **AC2:** `/quem-precisa-fazer-prova-icao` — Content:
  - H2: Quem precisa do ICAO — pilots operating Brazilian aircraft internationally
  - H2: Tipos de licenca e exigencia — PPL vs CPL vs ATPL requirements
  - H2: Voos domesticos precisam? — not required but valued
  - H2: Excecoes automaticas — pilots with licenses from US, UK, Australia, Canada, Ireland, NZ get auto Level 4
  - H2: E para comissarios? — emerging requirement
  - Internal links to /niveis-icao, /como-funciona, /como-se-preparar
  - FAQ: 5 questions

- [ ] **AC3:** Both pages pass build.

---

## Epic 7: Niche Content Pages (Phase 4)

### Story 7.1 — Niche pages: dicas-descricao-imagens + quanto-tempo

**Files:**
- `src/app/(marketing)/dicas-prova-icao-descricao-imagens/page.tsx`
- `src/app/(marketing)/quanto-tempo-preparar-prova-icao/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `/dicas-prova-icao-descricao-imagens` — Part 4 strategies:
  - H2: Como funciona a Parte 4 — describe photo, answer questions, analyze risks
  - H2: Estrutura ideal de descricao — step-by-step: location, people, actions, risks
  - H2: Vocabulario essencial para descricao — link to /vocabulario
  - H2: Erros comuns na descricao — common mistakes
  - H2: Praticando descricao de imagens — tips + simulator
  - Internal links to /como-funciona, /descritores, /como-se-preparar
  - FAQ: 4-5 questions

- [ ] **AC2:** `/quanto-tempo-preparar-prova-icao` — Timeline:
  - H2: Depende do seu nivel atual — assessment guide
  - H2: Timeline para cada nivel (table):
    - Basico → Level 4: 4-6 meses
    - Intermediario → Level 4/5: 2-4 meses
    - Avancado → Level 5/6: 1-2 meses
  - H2: Plano de estudo semanal — example schedule
  - H2: Como acelerar sua preparacao — method + app + lives
  - Internal links to /como-se-preparar, /niveis-icao, /metodo
  - FAQ: 4-5 questions

- [ ] **AC3:** Both pages pass build.

---

### Story 7.2 — Niche pages: helicoptero + resultado

**Files:**
- `src/app/(marketing)/prova-icao-helicoptero/page.tsx`
- `src/app/(marketing)/resultado-prova-icao/page.tsx`

#### Acceptance Criteria

- [ ] **AC1:** `/prova-icao-helicoptero` — Helicopter SDEA variant:
  - H2: A prova ICAO e diferente para pilotos de helicoptero? — same SDEA but helicopter-specific scenarios
  - H2: O que muda na prova — scenarios involve helicopter operations, heliports, offshore
  - H2: Vocabulario especifico — helicopter terms
  - H2: Como se preparar — same method applies, helicopter scenarios in simulator
  - Internal links to /como-funciona, /descritores, /como-se-preparar
  - FAQ: 4-5 questions (zero competition — unique content)

- [ ] **AC2:** `/resultado-prova-icao` — How to check results:
  - H2: Quando sai o resultado — timeline after exam
  - H2: Como verificar seu resultado — where to check (ANAC system)
  - H2: Entendendo seu resultado — reading the score report
  - H2: Proximo passos apos o resultado — what to do with each level
  - H2: Se voce nao passou — link to /reprovado
  - Internal links to /niveis-icao, /reprovado, /validade-e-renovacao
  - FAQ: 4-5 questions

- [ ] **AC3:** Both pages pass build.

---

## 5. Definition of Done (per story)

- [ ] All acceptance criteria met
- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes (if configured)
- [ ] Mobile responsiveness verified (components render correctly at 375px width)
- [ ] `/lives` page still works unchanged
- [ ] `/confirma-cadastro-lives` still works unchanged
- [ ] Internal links point to correct routes
- [ ] JSON-LD schemas are valid (no syntax errors)
- [ ] No new npm dependencies added

---

## 6. Story Sequencing for @sm

Stories must be created and implemented in this order:

| Order | Story | Epic | Depends On |
|-------|-------|------|------------|
| 1 | 1.1 | E1 | — |
| 2 | 1.2 | E1 | 1.1 |
| 3 | 1.3 | E1 | 1.2 |
| 4 | 2.1 | E2 | 1.3 |
| 5 | 2.2 | E2 | 2.1 |
| 6 | 3.1 | E3 | 1.3 |
| 7 | 3.2 | E3 | 3.1 |
| 8 | 4.1 | E4 | 2.2 |
| 9 | 4.2 | E4 | 2.2 |
| 10 | 4.3 | E4 | 2.2 |
| 11 | 4.4 | E4 | 2.2 |
| 12 | 4.5 | E4 | 2.2 |
| 13 | 4.6 | E4 | 2.2 |
| 14 | 5.1 | E5 | 2.2 |
| 15 | 5.2 | E5 | 5.1 |
| 16 | 5.3 | E5 | 5.2 |
| 17 | 6.1 | E6 | 2.2 |
| 18 | 6.2 | E6 | 2.2 |
| 19 | 6.3 | E6 | 2.2 |
| 20 | 6.4 | E6 | 2.2 |
| 21 | 7.1 | E7 | 2.2 |
| 22 | 7.2 | E7 | 2.2 |

---

*PRD criado por Morgan (@pm) — Synkra AIOS*
