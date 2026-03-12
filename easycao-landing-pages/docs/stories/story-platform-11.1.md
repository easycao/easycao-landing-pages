# Story Platform-11.1 — CMS Lesson Extensions

**Status:** Ready for Review
**Priority:** P1 (foundation for course extensions)
**Epic:** Platform E11 — Course Extensions
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 11, Story 11.1
**Brief Reference:** `docs/platform-features-brief.md` → Section 4 (Course Extensions)

---

## Story

As an admin, I need to configure lessons with optional consolidation and exercises sections in the CMS, so that the student lesson experience can include AI consolidation and practical exercises beyond just video.

## Acceptance Criteria

### Schema Extension (AC1)

- [ ] AC1: Lesson Firestore schema extended with new fields: `hasConsolidation: boolean` (default false), `hasExercises: boolean` (default false), `consolidationConfig: { concepts: string[], language: "pt" | "en" }`.

### CMS Consolidation Tab (AC2-AC3)

- [ ] AC2: CMS lesson edit page (`/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]`) shows a "Consolidação" tab.
- [ ] AC3: Consolidation tab has: toggle to enable/disable, language selector (PT/EN), concepts textarea (one per line). Saving updates lesson doc in Firestore.

### CMS Exercises Tab (AC4-AC6)

- [ ] AC4: CMS lesson edit page shows an "Exercícios" tab.
- [ ] AC5: Exercises tab has CRUD for exercises: add exercise (type, prompt, referenceAnswer, videoUrl?, imageUrl?, order), edit, delete, reorder.
- [ ] AC6: Exercises stored in `courses/{courseId}/modules/{moduleId}/lessons/{lessonId}/exercises` subcollection.

### API Routes (AC7)

- [ ] AC7: API routes for exercise CRUD:
  - GET `/api/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/exercises` — list exercises
  - POST — create exercise
  - PATCH `/api/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/exercises/[exerciseId]` — update
  - DELETE — delete exercise

### Quality (AC8)

- [ ] AC8: `npm run build` passes with no errors. Existing lesson edit functionality unaffected.

## Tasks

- [x] Task 1: Create lesson edit page `app/src/app/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx` with tabbed UI (Detalhes, Consolidação, Exercícios).
- [x] Task 2: Implement Detalhes tab — existing lesson fields (title, duration, kinescopeVideoId, thumbnail, status) + new toggle fields (hasConsolidation, hasExercises).
- [x] Task 3: Implement Consolidação tab — enable toggle, language selector, concepts textarea.
- [x] Task 4: Implement Exercícios tab — exercise list with CRUD (add, edit, delete, reorder).
- [x] Task 5: Create API routes for exercise CRUD under lesson path.
- [x] Task 6: Update existing lesson PATCH route to support new fields + added GET handler.
- [x] Task 7: Verify `npm run build` passes.

## Technical Notes

### CMS Lesson Edit Page
- Currently there is NO individual lesson edit page — lessons are edited inline in the module page.
- This story creates a dedicated lesson edit page with tabs for the extended functionality.
- The module page's "Editar" button should link to this new page.

### Exercise Schema
```typescript
// Subcollection: courses/{cId}/modules/{mId}/lessons/{lId}/exercises/{eId}
{
  type: string;          // "speaking" | "listening" | "writing"
  prompt: string;        // Question/instruction text
  referenceAnswer: string; // Expected answer for feedback comparison
  videoUrl?: string;     // Optional video for the exercise
  imageUrl?: string;     // Optional image for the exercise
  order: number;         // Display order
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Existing Patterns
- CMS module page: `app/src/app/admin/cms/courses/[courseId]/modules/[moduleId]/page.tsx`
- CMS course page: `app/src/app/admin/cms/courses/[courseId]/page.tsx`
- API patterns: existing lesson CRUD routes under `/api/admin/cms/courses/...`
- Types: `Lesson`, `ConsolidationConfig` from `app/src/lib/platform/types.ts`

### Files to Create
- `app/src/app/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx`
- `app/src/app/api/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/exercises/route.ts`
- `app/src/app/api/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/exercises/[exerciseId]/route.ts`

### Files to Modify
- `app/src/app/admin/cms/courses/[courseId]/modules/[moduleId]/page.tsx` — add link to lesson edit page
- `app/src/app/api/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/route.ts` — support new fields in PATCH

---

## File List

- `app/src/app/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx` — Created (tabbed lesson edit page)
- `app/src/app/api/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/exercises/route.ts` — Created (GET/POST exercises)
- `app/src/app/api/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/exercises/[exerciseId]/route.ts` — Created (PATCH/DELETE exercise)
- `app/src/app/api/admin/cms/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/route.ts` — Modified (added GET handler, new fields in PATCH allowed list)
- `app/src/app/admin/cms/courses/[courseId]/modules/[moduleId]/page.tsx` — Modified (Editar button → Link to lesson edit page)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- Created dedicated lesson edit page with 3 tabs (Detalhes, Consolidação, Exercícios)
- Consolidation tab: toggle, language selector, concepts textarea (one per line)
- Exercises tab: full CRUD with type selector, prompt, reference answer, media URLs
- Added GET handler for individual lesson (needed by edit page)
- Module page "Editar" button now links to new lesson edit page

---

*Story created by @sm (River) on 2026-03-12*
