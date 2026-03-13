# Story Platform-14.1 — Learning Profile & Performance Dashboard

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E14 — Intelligence & Performance
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 14, Story 14.1

---

## Story

As a student, I want to see a comprehensive performance dashboard that aggregates my learning data across all platform features, so that I can understand my strengths, weaknesses, and overall progress toward ICAO readiness.

## Acceptance Criteria

- [x] AC1: `/performance` page displays a 4-section dashboard: (1) Simulator Evolution — score history chart and trend line, (2) Course Progress — modules and lessons completed with percentage, (3) Exercise Stats — exercises attempted, accuracy rate, and completion by part, (4) Error Patterns — recurring mistake categories across simulator and exercises.
- [x] AC2: A `learningProfile` aggregation is computed server-side, combining data from simulator results, course progress, and exercise submissions into a unified profile stored in Firestore.
- [x] AC3: Simulator Evolution section shows a time-series chart of simulator scores with trend direction (improving, stable, declining) and current ICAO level estimate.
- [x] AC4: Error Patterns section cross-references simulator transcription errors and exercise mistakes to surface the student's weakest areas with specific improvement suggestions.
- [x] AC5: `npm run build` passes with no errors.

## Tasks

- [x] Task 1: Create performance dashboard page at `src/app/(platform)/performance/page.tsx` with 4-section layout: simulator evolution, course progress, exercise stats, and error patterns.
- [x] Task 2: Create API route `GET /api/performance/profile` at `src/app/api/performance/profile/route.ts` to compute and return the aggregated learningProfile.
- [x] Task 3: Implement simulator evolution section — fetch score history, render time-series chart, compute trend direction and ICAO level estimate.
- [x] Task 4: Implement course progress section — aggregate module/lesson completion data and display percentage bars.
- [x] Task 5: Implement exercise stats section — aggregate exercise attempts, accuracy rates, and per-part completion.
- [x] Task 6: Implement error patterns section — cross-reference simulator and exercise errors, categorize by weakness area, generate improvement suggestions.
- [x] Task 7: Implement learningProfile aggregation — combine all data sources into a unified Firestore document with last-updated timestamp.
- [x] Task 8: Verify `npm run build` passes.

## File List

- `app/src/app/(platform)/performance/page.tsx` — Created (4-section performance dashboard)
- `app/src/app/api/performance/profile/route.ts` — Created (GET learningProfile aggregation from simulator, course, and exercise data)

## Dev Agent Record

Agent Model Used: Claude Opus 4.6

### Completion Notes

- Dashboard uses a responsive grid: 2 columns on desktop, stacked on mobile.
- learningProfile aggregation runs on-demand, merging simulator scores, course progress, and exercise results into a single Firestore document.
- Error patterns use category-based grouping (pronunciation, grammar, vocabulary, fluency) with frequency counts and targeted suggestions.
- Simulator trend computed via linear regression on the last 10 scores.

---

*Story created by @sm (River) on 2026-03-12*
