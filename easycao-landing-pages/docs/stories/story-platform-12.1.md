# Story Platform-12.1 — Exercise Bank: Browse & Practice

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E12 — Exercise Bank & Playlists
**PRD Reference:** `docs/prd/platform-phase1-prd.md`

---

## Story

As a student, I want to browse a bank of pronunciation exercises organized by ICAO parts and practice them by recording my voice and receiving feedback, so that I can improve my aviation English skills at my own pace.

## Acceptance Criteria

- [x] AC1: `/exercises` hub page exists and serves as the main entry point for all exercise features (bank, playlists, etc.), with clear navigation cards linking to each section.
- [x] AC2: `/exercises/bank` page lists all exercise parts/categories available in the bank, showing part name, exercise count, and completion progress per part.
- [x] AC3: `/exercises/bank/[partId]` page displays individual exercises for the selected part, each with a prompt text, a "Record" button, and status indicator (not attempted / completed).
- [x] AC4: Student can record their voice for an exercise, submit the recording, and receive automated pronunciation feedback (score and suggestions).
- [x] AC5: Student can delete a previous recording and re-record for the same exercise, replacing the old submission.
- [x] AC6: Progress is saved to Firestore per student — completed exercises are tracked and reflected in the bank browse view and hub page.
- [x] AC7: `npm run build` passes with no errors.

## Tasks

- [x] Task 1: Create exercises hub page at `src/app/(platform)/exercises/page.tsx` with navigation cards to bank and playlists sections.
- [x] Task 2: Create exercise bank browse page at `src/app/(platform)/exercises/bank/page.tsx` listing parts with progress indicators.
- [x] Task 3: Create individual part page at `src/app/(platform)/exercises/bank/[partId]/page.tsx` with exercise list, recording UI, and feedback display.
- [x] Task 4: Create API route `GET /api/exercises/bank` at `src/app/api/exercises/bank/route.ts` to list exercise parts and exercises from Firestore.
- [x] Task 5: Create API route `GET/POST /api/exercises/bank/[exerciseId]` at `src/app/api/exercises/bank/[exerciseId]/route.ts` to fetch exercise details and submit recordings.
- [x] Task 6: Implement recording component with MediaRecorder API, playback preview, and submit/delete/re-record actions.
- [x] Task 7: Implement progress tracking — save completed exercises per student in Firestore and display on browse pages.
- [x] Task 8: Verify `npm run build` passes.

## File List

- `app/src/app/(platform)/exercises/page.tsx` — Created (exercises hub with navigation cards)
- `app/src/app/(platform)/exercises/bank/page.tsx` — Created (bank browse by part with progress)
- `app/src/app/(platform)/exercises/bank/[partId]/page.tsx` — Created (individual exercises with recording + feedback)
- `app/src/app/api/exercises/bank/route.ts` — Created (GET list exercise parts)
- `app/src/app/api/exercises/bank/[exerciseId]/route.ts` — Created (GET exercise detail, POST submit recording)

## Dev Agent Record

Agent Model Used: Claude Opus 4.6

---

*Story created by @sm (River) on 2026-03-12*
