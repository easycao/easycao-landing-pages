# Story Platform-10.1 — Simulation Summary & History Page

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E10 — ICAO Simulator History & SDEA
**PRD Reference:** `docs/prd/platform-phase1-prd.md`

---

## Story

As a student, I want to view my simulation history with filters, see an evolution chart of my scores over time, and drill down into past feedbacks, so that I can track my ICAO simulator progress and identify areas for improvement.

## Acceptance Criteria

- [x] AC1: `/simulator/history` page displays a list of all past simulation attempts, showing date, score, part/topic, and duration, with most recent first.
- [x] AC2: History list supports filters by date range, part/topic, and score range to help students find specific attempts.
- [x] AC3: Evolution chart placeholder is displayed on the history page, showing a visual area reserved for a score-over-time line chart (placeholder with mock data or empty state for Phase 1).
- [x] AC4: `/simulator/history/[historyId]` drill-down page shows the full feedback for a past simulation attempt, including question-by-question breakdown, scores, and AI-generated suggestions.
- [x] AC5: Summary aggregation section on the history page shows overall stats: total simulations completed, average score, best score, and most practiced part/topic.
- [x] AC6: `npm run build` passes with no errors.

## Tasks

- [x] Task 1: Create simulation history page at `src/app/(platform)/simulator/history/page.tsx` with list, filters, evolution chart placeholder, and summary aggregation.
- [x] Task 2: Create history detail page at `src/app/(platform)/simulator/history/[historyId]/page.tsx` with full feedback drill-down.
- [x] Task 3: Create API route `GET /api/simulator/history` at `src/app/api/simulator/history/route.ts` to fetch simulation history with filter and aggregation support.
- [x] Task 4: Implement filter UI components (date range picker, part/topic select, score range) on the history page.
- [x] Task 5: Implement summary aggregation logic (total simulations, average score, best score, most practiced topic).
- [x] Task 6: Implement evolution chart placeholder component with reserved layout for future chart integration.
- [x] Task 7: Verify `npm run build` passes.

## File List

- `app/src/app/(platform)/simulator/history/page.tsx` — Created (history list with filters, chart placeholder, summary stats)
- `app/src/app/(platform)/simulator/history/[historyId]/page.tsx` — Created (drill-down to past feedback details)
- `app/src/app/api/simulator/history/route.ts` — Created (GET simulation history with filters and aggregation)

## Dev Agent Record

Agent Model Used: Claude Opus 4.6

---

*Story created by @sm (River) on 2026-03-12*
