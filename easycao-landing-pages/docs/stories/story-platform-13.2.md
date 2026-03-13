# Story Platform-13.2 — Daily Plan View & Task Completion

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E13 — Study Planner
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 13, Story 13.2

---

## Story

As a student, I want to see my daily study tasks and mark them as complete, so that I can follow my personalized plan day by day and track my progress.

## Acceptance Criteria

- [x] AC1: `/planner` page displays today's study tasks pulled from the generated plan, showing task type (module, exercise, simulator), title, estimated duration, and completion status.
- [x] AC2: Student can mark individual tasks as complete, updating the plan in Firestore and reflecting the change immediately in the UI.
- [x] AC3: An upcoming days preview section shows the next 3-5 days of planned tasks, giving the student visibility into what's ahead.
- [x] AC4: Incomplete tasks from previous days are automatically pushed to the current day, clearly labeled as overdue, so nothing is silently dropped.
- [x] AC5: Each task links directly to the corresponding feature — clicking a module task navigates to the course lesson, an exercise task to the exercise, and a simulator task to the simulator.
- [x] AC6: `npm run build` passes with no errors.

## Tasks

- [x] Task 1: Create daily planner page at `src/app/(platform)/planner/page.tsx` with today's task list, completion toggles, and upcoming days preview.
- [x] Task 2: Create API route `GET /api/planner/today` at `src/app/api/planner/today/route.ts` to fetch today's tasks including auto-pushed overdue items.
- [x] Task 3: Create API route `GET/PATCH /api/planner/plan` at `src/app/api/planner/plan/route.ts` to retrieve the full plan and update task completion status.
- [x] Task 4: Implement overdue task auto-push logic — detect incomplete past tasks and surface them in today's view with overdue indicator.
- [x] Task 5: Implement task deep links — map each task type to its destination route (course lesson, exercise part, simulator).
- [x] Task 6: Verify `npm run build` passes.

## File List

- `app/src/app/(platform)/planner/page.tsx` — Created (daily plan view with task list, completion, upcoming preview)
- `app/src/app/api/planner/today/route.ts` — Created (GET today's tasks with overdue auto-push)
- `app/src/app/api/planner/plan/route.ts` — Created (GET full plan, PATCH task completion)

## Dev Agent Record

Agent Model Used: Claude Opus 4.6

### Completion Notes

- Today's view merges scheduled tasks with overdue items, sorted by priority (overdue first).
- Task completion PATCH updates Firestore and returns the updated task for optimistic UI.
- Deep links resolve task type to platform routes: modules → `/courses/[id]/modules/[id]`, exercises → `/exercises/bank/[partId]`, simulator → `/simulador`.

---

*Story created by @sm (River) on 2026-03-12*
