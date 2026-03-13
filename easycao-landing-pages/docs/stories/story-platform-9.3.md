# Story Platform-9.3 — Feedback UI: Pronunciation & Fluency Tab

**Status:** Ready for Review
**Priority:** P0 (feedback UI)
**Epic:** Platform E9 — Simulator Feedback
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 9, Story 9.3

---

## Story

As a student, I want to see my pronunciation and fluency scores with word-level coloring, so that I can identify which words need improvement.

## Acceptance Criteria

- [x] AC1: Tab "Pronúncia & Fluência"
- [x] AC2: Sentence with word-level coloring: green (>80), yellow (60-80), red (<60)
- [x] AC3: Data source: Azure Speech word/phoneme breakdown
- [x] AC4: Gauge visuals: Pronúncia X% | Fluência Y%
- [x] AC5: List of worst-pronounced words
- [x] AC6: `npm run build` passes

## Tasks

- [x] Task 1: PronunciationFluencyTab component in FeedbackTabs
- [x] Task 2: Gauge visuals with color-coded backgrounds
- [x] Task 3: Word-level coloring by score
- [x] Task 4: Worst words list sorted by score
- [x] Task 5: Verify `npm run build` passes

## File List

- `app/src/components/platform/FeedbackTabs.tsx` — Modified (PronunciationFluencyTab)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- Large gauge boxes with color-coded backgrounds (green/yellow/red zones)
- Words colored individually by pronunciation score
- Worst 5 words (score < 70) listed with scores
- Tab only shows when pronunciation/fluency data available
- Build passes

---

*Story created by @sm (River) on 2026-03-12*
