# Story Platform-8.3 — Part 2 Exam Flow

**Status:** Ready for Review
**Priority:** P0 (simulator core)
**Epic:** Platform E8 — Simulator Core
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 8, Story 8.3

---

## Story

As a student, I want to take a Part 2 exam with audio/image situations and 4 tasks per situation, so that I can practice ICAO situation & comprehension skills.

## Acceptance Criteria

- [x] AC1: 5 situations rendered sequentially (3 audio + 2 image in complete mode)
- [x] AC2: T1 (Cotejamento): video with ATC audio, record response
- [x] AC3: T2 (ABC): audio type = video only; image type = video + image display
- [x] AC4: T3 (Affirm/Negative): ATC audio, record response
- [x] AC5: T4 (Reported Speech): examiner video, record response
- [x] AC6: Shared T3/T4 repeat: if used in T3, disabled in T4 (and vice versa)
- [x] AC7: T1 repeat plays Part2_RepeatTrack1 (ATC audio only)
- [x] AC8: T2 repeat: image NOT shown during repeat
- [x] AC9: Save Part2History with situation subcollections
- [x] AC10: `npm run build` passes

## Tasks

- [x] Task 1: Create Part 2 exam page component with situation-based flow
- [x] Task 2: Implement 4-task-per-situation flow (T1-T4)
- [x] Task 3: Implement shared T3/T4 repeat logic
- [x] Task 4: Save Part2History with situation subcollections
- [x] Task 5: Verify `npm run build` passes

## Technical Notes

### Part 2 Structure
- 5 situations (3 audio-type + 2 image-type in complete mode)
- Each situation has 4 tasks: T1 (Cotejamento), T2 (ABC), T3 (Affirm/Negative), T4 (Reported Speech)
- Total tasks in complete mode: 5 × 4 = 20

### ICAO_Test_Questions fields for P2
- `Part2_Audio_Track1`: audio URL for T1/T3 (ATC communications)
- `Part2_Audio_Track2`: audio URL for T2
- `Part2_Image`: image URL (only for image-type questions)
- `Part2_Tipo`: "Audio" or "Imagem"
- `Part2_RepeatTrack1`: repeat audio for T1
- `Part2_Video_T1` through `Part2_Video_T4`: examiner video per task

### Repeat Rules
- T1: plays Part2_RepeatTrack1 (audio only, no video)
- T2: replays video, but image NOT shown during repeat
- T3/T4 shared: one repeat shared between T3 and T4

## File List

- `app/src/hooks/useExamReducer.ts` — Modified (extended TaskData with audio/image/shared repeat fields)
- `app/src/app/(platform)/simulator/exam/[examId]/page.tsx` — Modified (added mapP2Tasks, situation headers, image display, shared repeat)
- `app/src/app/api/simulator/exam/[examId]/complete/route.ts` — Modified (Part2History with Situation subcollections)
- `app/src/app/api/simulator/exam/[examId]/task/route.ts` — Modified (added taskType, situationIndex fields)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- P2 mapped as: 5 situations × 4 tasks (T1-T4) = 20 tasks in complete mode
- T1 has repeatAudioUrl for ATC repeat
- T2 has hideImageOnRepeat for image-type questions
- T3/T4 share repeat via sharedRepeatGroup per situation
- Situation headers show type badge (audio/image)
- Part2History saves with Situation{N} subcollections
- Build passes

---

*Story created by @sm (River) on 2026-03-12*
