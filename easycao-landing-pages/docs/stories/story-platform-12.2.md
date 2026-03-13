# Story Platform-12.2 — Playlists: Record & Listen

**Status:** Ready for Review
**Priority:** P1
**Epic:** Platform E12 — Exercise Bank & Playlists
**PRD Reference:** `docs/prd/platform-phase1-prd.md`

---

## Story

As a student, I want to access playlists of exercises from the Playlist_database, record my pronunciation for each exercise, and listen back to all my recordings in a continuous player ("Ouvir minha Play"), so that I can practice and review my performance in a structured sequence.

## Acceptance Criteria

- [x] AC1: `/exercises/playlists` page lists all available playlists sourced from the Playlist_database, showing playlist name, exercise count, and student completion progress.
- [x] AC2: `/exercises/playlists/[playlistId]` page shows the ordered list of exercises in the playlist with prompt text, recording status, and action buttons.
- [x] AC3: Student can record their voice for each exercise in the playlist, with playback preview before confirming submission.
- [x] AC4: Student can delete a previous recording and re-record for any exercise in the playlist, replacing the old submission.
- [x] AC5: "Ouvir minha Play" button starts a continuous audio player that plays all of the student's recorded exercises in the playlist sequentially, with current track indicator and play/pause controls.
- [x] AC6: Progress is saved to Firestore per student per playlist — recorded exercises are tracked and reflected in the playlist list and detail views.
- [x] AC7: `npm run build` passes with no errors.

## Tasks

- [x] Task 1: Create playlists list page at `src/app/(platform)/exercises/playlists/page.tsx` showing all playlists from Playlist_database with progress.
- [x] Task 2: Create playlist detail page at `src/app/(platform)/exercises/playlists/[playlistId]/page.tsx` with exercise list, recording UI, and continuous player.
- [x] Task 3: Create API route `GET /api/exercises/playlists` at `src/app/api/exercises/playlists/route.ts` to list playlists from Playlist_database.
- [x] Task 4: Create API route `GET/POST /api/exercises/playlists/[playlistId]` at `src/app/api/exercises/playlists/[playlistId]/route.ts` to fetch playlist exercises and submit recordings.
- [x] Task 5: Implement continuous player component ("Ouvir minha Play") that plays all recorded exercises sequentially with track indicator.
- [x] Task 6: Implement delete/re-record functionality for playlist exercises.
- [x] Task 7: Implement playlist progress tracking in Firestore per student.
- [x] Task 8: Verify `npm run build` passes.

## File List

- `app/src/app/(platform)/exercises/playlists/page.tsx` — Created (playlist list with progress from Playlist_database)
- `app/src/app/(platform)/exercises/playlists/[playlistId]/page.tsx` — Created (playlist detail with recording UI + continuous player)
- `app/src/app/api/exercises/playlists/route.ts` — Created (GET list playlists)
- `app/src/app/api/exercises/playlists/[playlistId]/route.ts` — Created (GET playlist exercises, POST submit recording)

## Dev Agent Record

Agent Model Used: Claude Opus 4.6

---

*Story created by @sm (River) on 2026-03-12*
