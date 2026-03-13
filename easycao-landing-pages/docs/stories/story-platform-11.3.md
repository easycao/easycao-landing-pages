# Story Platform-11.3 — AI Consolidation Chat

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E11 — Course Extensions
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 11, Story 11.3

---

## Story

As a student, I want to chat with an AI about lesson concepts after watching the video, so that I can consolidate my understanding.

## Acceptance Criteria

- [x] AC1: Consolidation section appears on lesson page after video is watched
- [x] AC2: POST `/api/consolidation/chat` with `{ concepts, message, history, language }`
- [x] AC3: GPT-4o mini: receives lesson concepts, asks progressive questions
- [x] AC4: Chat UI: message bubbles, student types response
- [x] AC5: After 3-5 exchanges: LLM evaluates comprehension → marks complete or asks follow-up
- [x] AC6: Locked if video not watched
- [x] AC7: `npm run build` passes

## Tasks

- [x] Task 1: Create POST /api/consolidation/chat route
- [x] Task 2: Create ConsolidationChat component
- [x] Task 3: Integrate into lesson page with lock/unlock logic
- [x] Task 4: Handle [COMPLETE] marker from LLM
- [x] Task 5: Verify `npm run build` passes

## File List

- `app/src/app/api/consolidation/chat/route.ts` — Created
- `app/src/components/platform/ConsolidationChat.tsx` — Created
- `app/src/app/(platform)/courses/[courseId]/[moduleId]/[lessonId]/page.tsx` — Modified

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- GPT-4o mini with system prompt about concepts, progressive questioning
- [COMPLETE] marker triggers onComplete callback
- Chat bubble UI with typing indicator
- Disabled state when video not yet watched
- Lazy OpenAI initialization to avoid build-time env var errors
- Build passes

---

*Story created by @sm (River) on 2026-03-12*
