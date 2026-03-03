# Story 2.1.2 — Build global components (Navbar, Footer, WhatsAppFloat, AppBanner)

**Status:** Done
**Priority:** P0 (blocks all pages)
**Epic:** E1 — Infrastructure (Phase 0)
**PRD Reference:** `docs/prd/prd-full-website.md` → Story 1.2

---

## Story

As a developer, I need to build the 4 global components (Navbar, Footer, WhatsAppFloat, AppBanner) so that all new marketing pages can share consistent navigation, footer, WhatsApp integration, and app promotion across the site.

## Acceptance Criteria

- [ ] AC1: `Navbar.tsx` — client component, sticky blur header with logo, nav links ("Prova ICAO" dropdown, "Metodo", "Lives"), CTA "Matricular", mobile hamburger
- [ ] AC2: `Footer.tsx` — server component, 4-column layout (Easycao, Prova ICAO, Metodo, Contato), bg-primary-dark
- [ ] AC3: `WhatsAppFloat.tsx` — client component, fixed bottom-right green button, pulse animation
- [ ] AC4: `AppBanner.tsx` — server component, 3 variants (section/inline/sidebar)
- [ ] AC5: `npm run build` passes with no errors

## Tasks

- [x] Task 1: Create `src/components/Navbar.tsx`
- [x] Task 2: Create `src/components/Footer.tsx`
- [x] Task 3: Create `src/components/WhatsAppFloat.tsx`
- [x] Task 4: Create `src/components/AppBanner.tsx`
- [x] Task 5: Verify `npm run build` passes

## Dev Notes

See PRD Story 1.2 for full component specs.

## File List

- `src/components/Navbar.tsx` — Created
- `src/components/Footer.tsx` — Created
- `src/components/WhatsAppFloat.tsx` — Created
- `src/components/AppBanner.tsx` — Created

---

## Dev Agent Record

### Debug Log
- Build passed on first attempt.

### Completion Notes
- Navbar: sticky blur, logo, desktop nav with dropdown, mobile hamburger, CTA button
- Footer: 4-column, all page links, social icons, copyright
- WhatsAppFloat: fixed green button with WhatsApp SVG + pulse animation
- AppBanner: 3 variants (section with phone mockup, inline card, sidebar compact)
- All components use constants.ts and content-pages.ts — no hardcoded values

### Change Log
- Created `src/components/Navbar.tsx`
- Created `src/components/Footer.tsx`
- Created `src/components/WhatsAppFloat.tsx`
- Created `src/components/AppBanner.tsx`
