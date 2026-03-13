# Story Platform-8.4 — Part 3 Exam Flow

**Status:** Ready for Review
**Priority:** P0 (simulator core)
**Epic:** Platform E8 — Simulator Core
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 8, Story 8.4

---

## Story

As a student, I want to take a Part 3 exam with reported speech tasks and comparison, so that I can practice ICAO reported speech skills.

## Acceptance Criteria

- [x] AC1: 3 situations × (RS + Question) + Comparison task
- [x] AC2: RS tasks: video auto-repeats (built into video, no repeat button)
- [x] AC3: Question tasks: repeat button replays examiner video
- [x] AC4: Comparison: separate video, has repeat
- [x] AC5: Save Part3History with PT3_Situation subcollections
- [x] AC6: `npm run build` passes

## Tasks

- [x] Task 1: Add P3 task mapping in exam page (mapP3Tasks)
- [x] Task 2: Handle auto-repeat flag (no repeat button for RS tasks)
- [x] Task 3: Save Part3History with PT3_Situation{N} subcollections
- [x] Task 4: Verify `npm run build` passes

## File List

- `app/src/hooks/useExamReducer.ts` — Modified (added autoRepeat flag support)
- `app/src/app/(platform)/simulator/exam/[examId]/page.tsx` — Modified (added mapP3Tasks, P3 flow)
- `app/src/app/api/simulator/exam/[examId]/complete/route.ts` — Modified (PT3_Situation subcollections)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- P3 mapped as: 3 situations × 2 tasks (RS + Question) + 1 Comparison = 7 tasks
- RS tasks have autoRepeat flag — no repeat button shown
- Question and Comparison tasks have normal repeat
- PT3_Situation subcollections in Part3History
- Build passes

---

*Story created by @sm (River) on 2026-03-12*
