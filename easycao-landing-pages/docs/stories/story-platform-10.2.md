# Story Platform-10.2 — SDEA Provas Prontas (29 Fixed Exams)

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E10 — ICAO Simulator History & SDEA
**PRD Reference:** `docs/prd/platform-phase1-prd.md`

---

## Story

As a student, I want to access 29 fixed SDEA exam versions with predetermined question indexes, take them using the same exam engine as the simulator, and track which ones I have completed, so that I can practice with realistic exam formats and measure my readiness.

## Acceptance Criteria

- [x] AC1: `/simulator/sdea` page lists all 29 SDEA exam versions, showing version number/name, question count, and completion status (completed / not started) per student.
- [x] AC2: Each SDEA exam version uses fixed question indexes (predetermined set of questions), ensuring every student gets the exact same exam for a given version.
- [x] AC3: SDEA exams use the same exam engine (question display, recording, feedback flow) as the regular ICAO simulator — no separate engine implementation.
- [x] AC4: A "HELPER" button is displayed on each exam card, visually present but disabled/greyed out with a "Em breve" tooltip, reserved for future helper functionality.
- [x] AC5: Completion tracking is saved per student per exam version in Firestore — the SDEA list page reflects which exams the student has completed with a visual indicator (checkmark or badge).
- [x] AC6: `npm run build` passes with no errors.

## Tasks

- [x] Task 1: Create SDEA provas page at `src/app/(platform)/simulator/sdea/page.tsx` listing all 29 exam versions with completion status and HELPER button placeholder.
- [x] Task 2: Create API route `GET /api/simulator/sdea` at `src/app/api/simulator/sdea/route.ts` to list all 29 SDEA versions with fixed indexes and student completion data.
- [x] Task 3: Implement fixed question index system — each SDEA version maps to a predetermined list of question IDs from the exercise bank.
- [x] Task 4: Integrate SDEA exams with the existing simulator exam engine for question display, recording, and feedback.
- [x] Task 5: Implement per-student per-exam completion tracking in Firestore.
- [x] Task 6: Implement HELPER button UI (disabled state with "Em breve" tooltip) on each exam card.
- [x] Task 7: Verify `npm run build` passes.

## File List

- `app/src/app/(platform)/simulator/sdea/page.tsx` — Created (SDEA exam list with 29 versions, completion tracking, HELPER button)
- `app/src/app/api/simulator/sdea/route.ts` — Created (GET list SDEA versions with fixed indexes and completion status)

## Dev Agent Record

Agent Model Used: Claude Opus 4.6

---

*Story created by @sm (River) on 2026-03-12*
