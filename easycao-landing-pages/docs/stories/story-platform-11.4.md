# Story Platform-11.4 — Lesson Practical Exercises

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E11 — Course Extensions
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 11, Story 11.4

---

## Story

As a student, I want to complete practical exercises with audio recording and AI feedback after lesson consolidation, so that I can practice what I learned.

## Acceptance Criteria

- [x] AC1: Exercise section appears on lesson page after consolidation (or after video if no consolidation)
- [x] AC2: Lists exercises from lesson's exercises subcollection
- [x] AC3: Each exercise: prompt display + audio recording + feedback
- [x] AC4: Feedback uses shared pipeline (Epic 6.2)
- [x] AC5: Delete recording button → re-record
- [x] AC6: Progress: exercises_completed / total_exercises
- [x] AC7: Marks lesson part complete when all exercises done
- [x] AC8: `npm run build` passes

## Tasks

- [x] Task 1: Create LessonExercises component
- [x] Task 2: Integrate with shared feedback pipeline
- [x] Task 3: Delete/re-record functionality
- [x] Task 4: Progress tracking with completion callback
- [x] Task 5: Integrate into lesson page with lock logic
- [x] Task 6: Verify `npm run build` passes

## File List

- `app/src/components/platform/LessonExercises.tsx` — Created
- `app/src/app/(platform)/courses/[courseId]/[moduleId]/[lessonId]/page.tsx` — Modified

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- Loads exercises from CMS API (existing from Story 11.1)
- AudioRecorder per exercise with feedback pipeline
- Delete recording resets exercise completion
- Auto-marks exercises part complete when all done
- Locked until consolidation complete (or video if no consolidation)
- Build passes

---

*Story created by @sm (River) on 2026-03-12*
