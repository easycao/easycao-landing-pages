# Story 2.1.3 — Setup marketing layout, infrastructure changes, and homepage shell

**Status:** Done
**Priority:** P0 (blocks all marketing pages)
**Epic:** E1 — Infrastructure (Phase 0)
**PRD Reference:** `docs/prd/prd-full-website.md` → Story 1.3

---

## Story

As a developer, I need to set up the (marketing) route group, modify root layout, remove the redirect, update sitemap, add prose styles, and move ProfessorSection so that the site has proper infrastructure for all new pages while keeping /lives untouched.

## Tasks

- [x] Task 1: Create `src/app/(marketing)/layout.tsx` with Navbar + Footer
- [x] Task 2: Create `src/app/(marketing)/page.tsx` (homepage shell)
- [x] Task 3: Modify root `layout.tsx` (generalize metadata, add WhatsAppFloat)
- [x] Task 4: Remove redirect from `next.config.ts`
- [x] Task 5: Delete old `src/app/page.tsx`
- [x] Task 6: Move ProfessorSection to components/, update import
- [x] Task 7: Update `sitemap.ts` to use content registry
- [x] Task 8: Add prose styles to `globals.css`
- [x] Task 9: Verify build + /lives still works

## File List

- `src/app/(marketing)/layout.tsx` — Created
- `src/app/(marketing)/page.tsx` — Created
- `src/app/layout.tsx` — Modified
- `next.config.ts` — Modified
- `src/app/page.tsx` — Deleted
- `src/components/ProfessorSection.tsx` — Moved from lives/
- `src/app/lives/page.tsx` — Modified (import path)
- `src/app/sitemap.ts` — Modified
- `src/app/globals.css` — Modified

---

## Dev Agent Record

### Debug Log
- First build failed due to stale .next type cache from deleted page.tsx. Cleared .next/ and rebuilt successfully.

### Completion Notes
- (marketing) route group created with Navbar + Footer wrapper
- Homepage shell with hero, schemas, and metadata at /
- Root layout generalized (no longer lives-specific), WhatsAppFloat added globally
- Redirect removed from next.config.ts
- ProfessorSection moved to components/, lives/page.tsx import updated
- Sitemap now dynamically generates from content registry (21 URLs)
- Prose styles added: h2/h3 spacing, paragraphs, lists, links, tables, FAQ transitions
- scroll-padding-top: 5rem for anchor navigation with sticky navbar

### Change Log
- Created `src/app/(marketing)/layout.tsx`
- Created `src/app/(marketing)/page.tsx`
- Modified `src/app/layout.tsx` (generalized metadata, added WhatsAppFloat)
- Modified `next.config.ts` (removed / → /lives redirect)
- Deleted `src/app/page.tsx`
- Copied `src/app/lives/ProfessorSection.tsx` → `src/components/ProfessorSection.tsx`
- Modified `src/app/lives/page.tsx` (updated ProfessorSection import)
- Modified `src/app/sitemap.ts` (dynamic from content registry)
- Modified `src/app/globals.css` (prose styles, scroll-padding, FAQ transitions)
