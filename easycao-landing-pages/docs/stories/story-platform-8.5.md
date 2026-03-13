# Story Platform-8.5 — Part 4 Exam Flow

**Status:** Ready for Review
**Priority:** P0 (simulator core)
**Epic:** Platform E8 — Simulator Core
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 8, Story 8.5

---

## Story

As a student, I want to take a Part 4 exam with image description and video tasks, so that I can practice ICAO extended description skills.

## Acceptance Criteria

- [x] AC1: 1 situation with image shown for all 6 tasks
- [x] AC2: All tasks: image + examiner video + audio recording
- [x] AC3: All tasks have repeat (replay video)
- [x] AC4: T6 Statement: additional Clarify button plays Part4Clarify video
- [x] AC5: Save Part4History with task subcollections
- [x] AC6: `npm run build` passes

## Tasks

- [x] Task 1: Add P4 task mapping in exam page (mapP4Tasks)
- [x] Task 2: Implement Clarify button for T6
- [x] Task 3: Persistent image display across all 6 tasks
- [x] Task 4: Save Part4History with situation subcollections
- [x] Task 5: Verify `npm run build` passes

## File List

- `app/src/hooks/useExamReducer.ts` — Modified (added clarifyVideoUrl, imageUrl to TaskData)
- `app/src/app/(platform)/simulator/exam/[examId]/page.tsx` — Modified (added mapP4Tasks, clarify button, persistent image)
- `app/src/app/api/simulator/exam/[examId]/complete/route.ts` — Modified (Part4History subcollections)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- P4 mapped as: 1 question × 6 tasks (T1-T6), image persistent across all
- T6 has Clarify button that opens a separate video overlay
- Image displayed in card above video for all tasks
- Part4History saves with Situation subcollections
- Build passes

---

*Story created by @sm (River) on 2026-03-12*
