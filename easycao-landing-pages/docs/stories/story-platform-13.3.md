# Story Platform-13.3 — Weekly Report & Plan Adaptation

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E13 — Study Planner
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 13, Story 13.3

---

## Story

As a student, I want to see a weekly report of my study progress and adapt my plan when needed, so that I can understand how well I'm following my schedule and adjust course when falling behind.

## Acceptance Criteria

- [x] AC1: `/planner/weekly-report` page displays a weekly summary with planned vs completed task counts, broken down by task type (modules, exercises, simulator).
- [x] AC2: Statistics section shows completion rate percentage, total study time logged, streak days, and comparison to the previous week.
- [x] AC3: Error patterns section highlights recurring gaps — e.g., consistently skipped task types or days with low completion — giving the student actionable insight.
- [x] AC4: A "Refazer plano" button is available on the report page, allowing the student to regenerate their plan based on updated preferences or revised availability.
- [x] AC5: `npm run build` passes with no errors.

## Tasks

- [x] Task 1: Create weekly report page at `src/app/(platform)/planner/weekly-report/page.tsx` with planned vs completed stats, completion rate, streaks, and error patterns.
- [x] Task 2: Create API route `GET /api/planner/weekly-report` at `src/app/api/planner/weekly-report/route.ts` to aggregate weekly data from Firestore plan and completion records.
- [x] Task 3: Implement planned vs completed breakdown logic — count tasks by type per day, compare against plan schedule.
- [x] Task 4: Implement error pattern detection — identify consistently skipped types, low-completion days, and declining trends.
- [x] Task 5: Add "Refazer plano" button that navigates to `/planner/setup` for plan regeneration.
- [x] Task 6: Verify `npm run build` passes.

## File List

- `app/src/app/(platform)/planner/weekly-report/page.tsx` — Created (weekly report with stats, patterns, and refazer plano button)
- `app/src/app/api/planner/weekly-report/route.ts` — Created (GET weekly aggregation with completion rates and pattern detection)

## Dev Agent Record

Agent Model Used: Claude Opus 4.6

### Completion Notes

- Weekly report aggregates 7 days of plan data, computing per-type completion rates and overall percentage.
- Error pattern detection flags task types with <50% completion and days consistently below threshold.
- "Refazer plano" button links to `/planner/setup` with a query param indicating replanning context.

---

*Story created by @sm (River) on 2026-03-12*
