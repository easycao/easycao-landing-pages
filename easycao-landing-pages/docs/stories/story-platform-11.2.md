# Story Platform-11.2 — Multi-Part Lesson Progress

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E11 — Course Extensions
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 11, Story 11.2

---

## Story

As a student, I want my lesson progress to track individual parts (video, consolidation, exercises), so that I can see my detailed completion status.

## Acceptance Criteria

- [x] AC1: `Users/{uid}/progress/{courseId}` stores per-lesson: `{ completedParts: number, totalParts: number }`
- [x] AC2: `totalParts` calculated from lesson config (1 + hasConsolidation + hasExercises)
- [x] AC3: Visual ●●○ indicators per lesson in course view
- [x] AC4: Enforce: can't access consolidation before video, can't access exercises before consolidation
- [x] AC5: Backward compatible: existing video-only lessons remain 1/1 = complete
- [x] AC6: `npm run build` passes

## Tasks

- [x] Task 1: Add markLessonPartComplete and getLessonPartsProgress to progress lib
- [x] Task 2: Create POST /api/platform/progress/complete-part endpoint
- [x] Task 3: Update lesson page with part tracking and ●●○ indicators
- [x] Task 4: Enforce ordering: video → consolidation → exercises
- [x] Task 5: Verify `npm run build` passes

## File List

- `app/src/lib/platform/progress.ts` — Modified (added markLessonPartComplete, getLessonPartsProgress, lessonParts in getStudentProgress)
- `app/src/app/api/platform/progress/complete-part/route.ts` — Created
- `app/src/app/(platform)/courses/[courseId]/[moduleId]/[lessonId]/page.tsx` — Modified (multi-part UI)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- lessonParts stored as `Record<string, string[]>` in progress doc
- Auto-marks lesson complete when all parts finished
- Backward compatible: lessons without extensions use original complete flow
- Part indicators shown below navigation
- Build passes

---

*Story created by @sm (River) on 2026-03-12*
