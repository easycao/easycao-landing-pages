# Story Platform-8.6 — Full ICAO Test & Exam Resume

**Status:** Ready for Review
**Priority:** P0 (simulator completion)
**Epic:** Platform E8 — Simulator Core
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 8, Story 8.6

---

## Story

As a student, I want to take a complete ICAO test (P1-P4 sequential) and resume an interrupted exam, so that I can simulate the full test experience.

## Acceptance Criteria

- [x] AC1: Full test: P1(3) → P2(20) → P3(7) → P4(6) = 36 tasks sequential
- [x] AC2: Creates TesteICAOCompleto doc linking Part1-4 History docs
- [x] AC3: Exam state persisted to Firestore after each task completion
- [x] AC4: On browser close + return: resume from next incomplete task
- [x] AC5: Cannot go back to completed tasks
- [x] AC6: `npm run build` passes

## Tasks

- [x] Task 1: Complete test already mapped via mapCompleteTasks (from 8.3-8.5)
- [x] Task 2: Add exam resume: fetch currentTaskIndex from Firestore on page load
- [x] Task 3: TesteICAOCompleto doc saved on completion (from complete route)
- [x] Task 4: Verify `npm run build` passes

## File List

- `app/src/app/(platform)/simulator/exam/[examId]/page.tsx` — Modified (added resume logic)
- `app/src/app/api/simulator/exam/[examId]/complete/route.ts` — Already handles TesteICAOCompleto

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- Complete test uses mapCompleteTasks combining P1+P2+P3+P4 mappers
- Resume: on page load, checks exam.currentTaskIndex from Firestore
- Task save API updates currentTaskIndex after each task
- Page initializes state.currentTaskIndex from exam doc
- Cannot go back — no back button, state only advances
- Build passes

---

*Story created by @sm (River) on 2026-03-12*
