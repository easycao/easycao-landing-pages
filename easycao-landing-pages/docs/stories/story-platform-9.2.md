# Story Platform-9.2 — Feedback UI: Text & Corrections Tab

**Status:** Ready for Review
**Priority:** P0 (feedback UI)
**Epic:** Platform E9 — Simulator Feedback
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 9, Story 9.2

---

## Story

As a student, I want to see my transcription with clickable error highlights and grouped corrections, so that I can understand my grammar and vocabulary mistakes.

## Acceptance Criteria

- [x] AC1: Tab "Texto & Correções" with transcription text
- [x] AC2: Clickable underlined error words → popover: { error, correction, category, explanation }
- [x] AC3: Categories from GPT-4o mini: structure (11 types) + vocabulary (6 types)
- [x] AC4: Corrections grouped by category with count
- [x] AC5: Full corrected version displayed below
- [x] AC6: `npm run build` passes

## Tasks

- [x] Task 1: Create FeedbackTabs component with TextCorrectionsTab
- [x] Task 2: Implement error word highlighting with popover
- [x] Task 3: Category grouping display
- [x] Task 4: Corrected text display
- [x] Task 5: Verify `npm run build` passes

## File List

- `app/src/components/platform/FeedbackTabs.tsx` — Created (TextCorrectionsTab)
- `app/src/components/platform/index.ts` — Modified (added FeedbackTabs export)
- `app/src/app/(platform)/simulator/exam/[examId]/feedback/page.tsx` — Modified (integrated FeedbackTabs)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- Error words highlighted with wavy red underline
- Click opens popover with correction, category, explanation
- Categories grouped as pills with counts
- Corrected version in green-tinted box
- Build passes

---

*Story created by @sm (River) on 2026-03-12*
