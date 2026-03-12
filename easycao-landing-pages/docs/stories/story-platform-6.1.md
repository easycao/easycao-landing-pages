# Story Platform-6.1 — Shared Platform Types & Audio Recording Component

**Status:** Ready for Review
**Priority:** P0 (foundation for all Phase 2 features)
**Epic:** Platform E6 — Shared Infrastructure
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 6, Story 6.1
**Brief Reference:** `docs/platform-features-brief.md` → Sections 2, 4.5, 11

---

## Story

As a developer, I need shared TypeScript types extracted from inline definitions and reusable AudioRecorder/VideoPlayer components, so that all Phase 2 features (simulator, exercises, course extensions) can build on a consistent foundation.

## Acceptance Criteria

### Shared Types (AC1-AC3)

- [ ] AC1: Create `app/src/lib/platform/types.ts` with these interfaces extracted from inline definitions across the codebase:
  ```typescript
  // Course hierarchy
  Course, Module, Lesson, LessonStatus

  // Lesson extensions (Phase 2)
  LessonPart ("video" | "consolidation" | "exercises")
  ConsolidationConfig { concepts: string[], language: "pt" | "en" }

  // Exercise types
  Exercise { id, type, prompt, referenceAnswer, videoUrl?, imageUrl?, order }
  ExerciseProgress { completed, recordingUrl?, feedbackGenerated, feedback?, attempts, lastAttemptAt }

  // Playlist types
  PlaylistDatabase { id, playlist_name, playlist_title, playlist_subtitle, playlist_image, max_otimizada, exercicios: PlaylistExercise[] }
  PlaylistExercise { name, order, image, playlistImage, inputAudioUrl, inputAudioTitle, audioQuestion }
  PlaylistProgress { recordings: Record<number, PlaylistRecording>, completedCount, lastListenedAt? }

  // Simulator types (basic — expanded in Epic 8)
  SimulationSummary { avgPronunciation, avgFluency, structureErrors, vocabularyErrors, errorCategories, comprehensionScore, comprehensionTotal }

  // Feedback types (shared pipeline)
  FeedbackRequest { audioUrl, referenceText?, keyPoints?, taskType }
  FeedbackResult { transcription, pronunciation?, fluency?, errors: FeedbackError[], comprehension?: ComprehensionResult, correctedText }
  FeedbackError { original, correction, category, explanation, position }
  ComprehensionResult { keyPoints: { text: string, matched: boolean }[], score: number, total: number }

  // Learning profile
  LearningProfile { courses, exercises, simulator }
  ```
- [ ] AC2: Existing inline types in course pages (`CourseInfo`, `ModuleData`, `Lesson` in `/courses/page.tsx`, `/admin/cms/courses/`) are replaced with imports from `types.ts`. Existing pages still work correctly after refactor.
- [ ] AC3: All types are exported with JSDoc comments explaining their purpose.

### AudioRecorder Component (AC4-AC8)

- [ ] AC4: Create `app/src/components/platform/AudioRecorder.tsx` — a reusable client component that:
  - Shows a record button (microphone icon)
  - Uses MediaRecorder API to capture audio (WebM/Opus format)
  - Shows recording state: idle → recording (with timer) → processing → done
  - After recording: shows audio preview (play/pause) and re-record button
- [ ] AC5: Upload functionality:
  - After recording stops, auto-uploads to Firebase Storage at path `recordings/{uid}/{context}/{timestamp}.webm`
  - Shows upload progress indicator
  - Returns the download URL via `onRecordingComplete(url: string)` callback
  - Upload blocks the parent UI from advancing (component exposes `isUploading` state)
- [ ] AC6: Delete/re-record:
  - "Regravar" button: discards current recording, starts fresh
  - Deletes the previous file from Firebase Storage before uploading new one
  - `onRecordingDelete()` callback notifies parent
- [ ] AC7: Error handling:
  - Microphone permission denied → shows friendly message with instructions
  - Upload failure → retry button with error message
  - Browser not supported (no MediaRecorder) → shows fallback message
- [ ] AC8: Props interface:
  ```typescript
  interface AudioRecorderProps {
    uid: string                           // User ID for storage path
    context: string                       // Storage subfolder (e.g., "simulator", "exercises")
    onRecordingComplete: (url: string) => void
    onRecordingDelete?: () => void
    disabled?: boolean                    // Block recording (e.g., video not watched yet)
    maxDuration?: number                  // Max recording seconds (default: 120)
    className?: string
  }
  ```

### VideoPlayer Component (AC9-AC11)

- [ ] AC9: Create `app/src/components/platform/VideoPlayer.tsx` — a reusable client component that:
  - Plays video from a direct URL (Firebase Storage / external CDN)
  - Shows play/pause, progress bar, volume control
  - Supports `onEnded` callback (critical for exam flow — "video finished, enable recording")
  - Supports `onRepeat` callback for repeat button logic
- [ ] AC10: Repeat functionality:
  - Optional `showRepeat` prop: shows a "Repeat" button
  - `repeatCount` prop: number of repeats allowed (default: 1)
  - After repeat used, button disappears or shows disabled
  - `onRepeatUsed()` callback notifies parent
- [ ] AC11: Props interface:
  ```typescript
  interface VideoPlayerProps {
    src: string                          // Video URL
    poster?: string                      // Thumbnail
    onEnded?: () => void                 // Video finished playing
    showRepeat?: boolean                 // Show repeat button
    repeatCount?: number                 // Max repeats (default: 1)
    onRepeatUsed?: () => void            // All repeats consumed
    autoPlay?: boolean
    className?: string
  }
  ```

### Integration & Quality (AC12-AC13)

- [ ] AC12: Components support dark mode (use `useTheme()` context from existing `ThemeContext.tsx`). Follow existing Easycao style: Poppins font, primary blue (#1F96F7), rounded corners, subtle shadows.
- [ ] AC13: `npm run build` passes with no errors. No regressions in existing pages after type refactor.

## Tasks

- [x] Task 1: Create `app/src/lib/platform/types.ts` with all interfaces. Add JSDoc comments.
- [x] Task 2: Refactor existing inline types in course/CMS pages to import from `types.ts`. Verify no regressions.
- [x] Task 3: Create `app/src/components/platform/AudioRecorder.tsx` with MediaRecorder API, Firebase Storage upload, progress indicator, re-record, error handling.
- [x] Task 4: Create `app/src/components/platform/VideoPlayer.tsx` with HTML5 video, repeat functionality, callbacks.
- [x] Task 5: Create `app/src/components/platform/index.ts` barrel export for all new components.
- [x] Task 6: Verify `npm run build` passes, test dark mode, test AudioRecorder permissions flow.

## Technical Notes

### Existing Patterns to Follow
- `KinescopePlayer.tsx` exists for DRM video — the new `VideoPlayer` is for non-DRM content (examiner videos, ATC audio). KinescopePlayer remains for lesson videos.
- `useCachedFetch.ts` hook exists for client-side API calls.
- Firebase client SDK already configured in the app.
- Dark mode via `useTheme()` from `ThemeContext.tsx`.

### Firebase Storage Rules
- Audio recordings path: `recordings/{uid}/{context}/{timestamp}.webm`
- The app already uses Firebase — no new SDK needed. Use `firebase/storage` for upload.

### MediaRecorder Compatibility
- WebM/Opus: supported on all modern browsers (Chrome, Firefox, Edge)
- Safari: may need `audio/mp4` fallback — check `MediaRecorder.isTypeSupported()`

### Files to Modify
- `app/src/app/(platform)/courses/page.tsx` — remove inline `CourseInfo` type, import from types.ts
- `app/src/app/admin/cms/courses/[courseId]/page.tsx` — remove inline `ModuleData` type
- `app/src/app/admin/cms/courses/[courseId]/modules/[moduleId]/page.tsx` — remove inline `Lesson` type

### New Files
- `app/src/lib/platform/types.ts`
- `app/src/components/platform/AudioRecorder.tsx`
- `app/src/components/platform/VideoPlayer.tsx`
- `app/src/components/platform/index.ts`

## File List

- `app/src/lib/platform/types.ts` — Created (all shared platform types with JSDoc)
- `app/src/lib/firebase-client.ts` — Modified (added getClientStorage for Firebase Storage)
- `app/src/components/platform/AudioRecorder.tsx` — Created (MediaRecorder + Firebase Storage upload)
- `app/src/components/platform/VideoPlayer.tsx` — Created (HTML5 video player with repeat)
- `app/src/components/platform/index.ts` — Created (barrel export for all platform components)
- `app/src/app/(platform)/courses/page.tsx` — Modified (replaced inline CourseInfo/DashboardData with imports)
- `app/src/app/admin/cms/courses/[courseId]/page.tsx` — Modified (replaced inline CourseData/ModuleData with imports)
- `app/src/app/admin/cms/courses/[courseId]/modules/[moduleId]/page.tsx` — Modified (replaced inline ModuleInfo/Lesson with imports)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- All 6 tasks completed successfully
- `npm run build` passes with zero errors
- Types extracted from 3 files, all pages still compile correctly
- AudioRecorder supports WebM/Opus + MP4 fallback for Safari
- VideoPlayer includes repeat functionality with count tracking
- Firebase Storage getter added to firebase-client.ts (was missing)

---

*Story created by @sm (River) on 2026-03-12*
