# Story Platform-8.2 — Exam State Machine & Part 1 Flow

**Status:** Ready for Review
**Priority:** P0 (core exam engine)
**Epic:** Platform E8 — Simulator Core
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 8, Story 8.2

---

## Story

As a student, I want to take a Part 1 exam with video questions and audio recording, so that I can practice ICAO interaction tasks.

## Acceptance Criteria

- [ ] AC1: `useExamReducer` state machine: currentTask, taskState (waiting/recording/uploaded), repeatUsed, completedTasks[]
- [ ] AC2: `/simulator/exam/[examId]` page with task-by-task flow
- [ ] AC3: Video playback of examiner question (Part1_Pergunta field from ICAO_Test_Questions)
- [ ] AC4: Repeat button: plays same video again, disappears after use (per question)
- [ ] AC5: Audio recording with AudioRecorder component after video ends
- [ ] AC6: Upload blocks advancing to next task
- [ ] AC7: After all tasks: save Part1History doc with question refs and recording URLs
- [ ] AC8: POST `/api/simulator/exam/[examId]/task` saves individual task recording
- [ ] AC9: `npm run build` passes

## Tasks

- [x] Task 1: Create `useExamReducer` hook in `app/src/hooks/useExamReducer.ts`
- [x] Task 2: Create exam page `app/src/app/(platform)/simulator/exam/[examId]/page.tsx`
- [x] Task 3: Create task save API `app/src/app/api/simulator/exam/[examId]/task/route.ts`
- [x] Task 4: Implement Part 1 flow: video → repeat → record → upload → next task
- [x] Task 5: Save Part1History after all tasks complete
- [x] Task 6: Verify `npm run build` passes

## Technical Notes

### State Machine
```typescript
type TaskState = "watching" | "ready_to_record" | "recording" | "uploading" | "uploaded";
type ExamState = {
  currentTaskIndex: number;
  taskState: TaskState;
  repeatUsed: boolean;
  tasks: TaskData[];
  completedTasks: CompletedTask[];
};
```

### Flow per task:
1. Show video (examiner question)
2. Video ends → show Repeat button + Record button
3. If repeat clicked → replay video, disable repeat
4. Record audio → upload to Firebase Storage
5. Upload complete → auto-advance to next task
6. After last task → save history, redirect to feedback

## File List

- `app/src/hooks/useExamReducer.ts` — Created (state machine hook with reducer pattern)
- `app/src/app/(platform)/simulator/exam/[examId]/page.tsx` — Created (exam flow page)
- `app/src/app/api/simulator/exam/[examId]/task/route.ts` — Created (POST individual task recording)
- `app/src/app/api/simulator/exam/[examId]/complete/route.ts` — Created (POST exam completion + Part1History)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- useExamReducer implements full state machine: watching → ready_to_record → recording → uploading → uploaded
- Exam page auto-advances 1.5s after upload complete
- VideoPlayer with repeat button (1 repeat per question) integrated
- AudioRecorder shows after video ends (ready_to_record state)
- Task recordings saved as subcollection under exam doc
- Part1History saved on exam completion, exam status updated to "completed"
- Build passes with all new routes registered

---

*Story created by @sm (River) on 2026-03-12*
