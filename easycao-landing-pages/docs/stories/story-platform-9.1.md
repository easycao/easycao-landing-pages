# Story Platform-9.1 — Feedback Generation with SSE

**Status:** Ready for Review
**Priority:** P0 (feedback engine)
**Epic:** Platform E9 — Simulator Feedback
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 9, Story 9.1

---

## Story

As a student, I want to receive AI feedback on all my exam recordings in parallel with real-time progress, so that I can see results as they arrive.

## Acceptance Criteria

- [x] AC1: POST `/api/simulator/exam/[examId]/feedback` processes ALL tasks in parallel
- [x] AC2: SSE stream sends `{ taskIndex, status, feedback }` per task as it completes
- [x] AC3: `/simulator/exam/[examId]/feedback` page shows progress ("Processando 14/20...")
- [x] AC4: Each feedback card appears as its task completes
- [x] AC5: On failure (after 3 retries): "Tentar novamente" button per task
- [x] AC6: Button re-triggers feedback for that specific task
- [x] AC7: `npm run build` passes

## Tasks

- [x] Task 1: Create SSE feedback API route
- [x] Task 2: Create feedback page with real-time progress
- [x] Task 3: Individual task retry endpoint
- [x] Task 4: Update exam page to redirect to feedback page on completion
- [x] Task 5: Verify `npm run build` passes

## Technical Notes

### SSE Pattern
```typescript
// API sends text/event-stream
// Each event: data: { taskIndex, status: "processing"|"complete"|"error", feedback? }
```

### Feedback Pipeline
Uses existing `/api/feedback/analyze` pipeline per task recording:
- Download audio → Whisper transcription → Azure pronunciation → GPT-4o mini analysis
- Run tasks in parallel with Promise.allSettled

## File List

- `app/src/app/api/simulator/exam/[examId]/feedback/route.ts` — Created (POST SSE + GET individual/all)
- `app/src/app/(platform)/simulator/exam/[examId]/feedback/page.tsx` — Created (real-time feedback page)
- `app/src/app/(platform)/simulator/exam/[examId]/page.tsx` — Modified (redirect to feedback on completion)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- SSE endpoint processes all tasks in parallel with concurrency limit of 5
- 3 retry attempts per task before marking as error
- Feedback saved to Firestore subcollection `exams/{examId}/feedback/{taskIndex}`
- Page checks for existing feedback before starting SSE (idempotent)
- Retry button per failed task triggers re-processing
- Exam page redirects to feedback page after completion instead of simulator
- Build passes

---

*Story created by @sm (River) on 2026-03-12*
