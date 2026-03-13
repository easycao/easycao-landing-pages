# Story Platform-13.1 — Planner Onboarding & Plan Generation

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E13 — Study Planner
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 13, Story 13.1

---

## Story

As a student, I want to complete an onboarding flow that captures my study preferences and generates a personalized study plan, so that I have a structured roadmap tailored to my schedule and goals.

## Acceptance Criteria

- [x] AC1: A 5-step onboarding wizard exists at `/planner/setup` collecting: (1) weekly available hours, (2) preferred study days, (3) target exam date, (4) current proficiency self-assessment, and (5) priority areas (simulator, exercises, course modules).
- [x] AC2: On submission, the API generates a study plan respecting ordering rules — prerequisite modules before advanced ones, simulator sessions spaced for retention, and exercises interleaved with course content.
- [x] AC3: The generated plan is stored in Firestore under the student's document with daily task breakdowns, allowing retrieval and modification.
- [x] AC4: Student can trigger "Refazer plano" at any time to re-enter onboarding and regenerate the plan from scratch, replacing the previous one.
- [x] AC5: `npm run build` passes with no errors.

## Tasks

- [x] Task 1: Create planner onboarding page at `src/app/(platform)/planner/setup/page.tsx` with 5-step wizard UI, form validation, and progress indicator.
- [x] Task 2: Create API route `POST /api/planner/generate` at `src/app/api/planner/generate/route.ts` to receive onboarding answers and generate a study plan with ordering rules.
- [x] Task 3: Implement plan generation logic — map preferences to daily tasks, enforce prerequisite ordering, space simulator sessions, interleave exercises with modules.
- [x] Task 4: Store generated plan in Firestore with daily breakdown structure and metadata (created date, preferences snapshot).
- [x] Task 5: Implement "Refazer plano" flow — button triggers re-onboarding, new plan replaces previous on generation.
- [x] Task 6: Verify `npm run build` passes.

## File List

- `app/src/app/(platform)/planner/setup/page.tsx` — Created (5-step onboarding wizard with form validation)
- `app/src/app/api/planner/generate/route.ts` — Created (POST plan generation with ordering rules and Firestore persistence)

## Dev Agent Record

Agent Model Used: Claude Opus 4.6

### Completion Notes

- Onboarding wizard uses stepper UI with back/next navigation and input validation per step.
- Plan generation enforces module prerequisites, simulator spacing, and exercise interleaving.
- "Refazer plano" overwrites the existing plan document in Firestore with a fresh generation.

---

*Story created by @sm (River) on 2026-03-12*
