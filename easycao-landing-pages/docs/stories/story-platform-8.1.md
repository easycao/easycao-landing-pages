# Story Platform-8.1 — Simulator Dashboard & Exam Creation

**Status:** Ready for Review
**Priority:** P0 (entry point for all simulator features)
**Epic:** Platform E8 — Simulator Core
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 8, Story 8.1
**Brief Reference:** `docs/platform-features-brief.md` → Section 3 (Simulator)

---

## Story

As a student, I want to see a simulator dashboard with 5 exam parts, select a mode, and start an exam, so that I can practice for the ICAO proficiency test.

## Acceptance Criteria

### Dashboard Page (AC1-AC2)

- [ ] AC1: `/simulator` page shows 5 cards: Part 1 (Interaction), Part 2 (Situation & Comprehension), Part 3 (Reported Speech), Part 4 (Extended Description), Complete Test (all 4 parts).
- [ ] AC2: Each card shows: part name, brief description, number of tasks, quick stat (e.g., "3 simulações feitas").

### Mode Selection (AC3)

- [ ] AC3: Clicking a part card opens a mode selection popup. For example, P1 offers "Pergunta Individual" or "Parte Completa". Complete Test has no mode selection — starts full flow.

### Exam Creation API (AC4-AC5)

- [ ] AC4: POST `/api/simulator/exam` accepts `{ part, mode, uid }`, creates an exam doc in Firestore, returns `{ examId }`.
- [ ] AC5: GET `/api/simulator/questions?part=X&mode=Y` returns randomized questions from `ICAO_Test_Questions` collection. Randomization: unique indexes per part (P1: 3 of 152, etc.).

### Navigation (AC6)

- [ ] AC6: Sidebar shows "Simulador" navigation item linking to `/simulator`.

### Quality (AC7)

- [ ] AC7: `npm run build` passes with no errors.

## Tasks

- [x] Task 1: Create `/simulator` page with 5 part cards.
- [x] Task 2: Create mode selection modal/popup component (inline in page).
- [x] Task 3: Create POST `/api/simulator/exam` route — creates exam doc, returns examId.
- [x] Task 4: Create GET `/api/simulator/questions` route — fetch questions by exam indexes.
- [x] Task 5: Enable "Simulador" in platform sidebar navigation (was disabled).
- [x] Task 6: Verify `npm run build` passes.

## Technical Notes

### ICAO_Test_Questions Collection
This Firestore collection contains exam questions shared with FlutterFlow. Key fields:
- `Part1_Pergunta`: video URL for Part 1 questions
- `Part2_Audio_Track1`: audio URL for Part 2 T1
- `Part2_Audio_Track2`: audio URL for Part 2 T2
- `Part2_Image`: image URL for Part 2 image-type questions
- `Part3_RS`: video URL for Part 3 RS tasks
- `Part3_Pergunta`: video URL for Part 3 questions
- `Part4_Image`: image URL for Part 4
- `Part4_Video`: video URL for Part 4
- Type fields: `Part2_Tipo` ("Audio" or "Imagem")

### Question Randomization
- Part 1: 3 random indexes from 152 total (indexes 1-152)
- Part 2: 3 audio + 2 image = 5 situations (audio indexes from ~75, image from ~51)
- Part 3: 3 random from available P3 questions
- Part 4: 1 random from available P4 questions
- Complete: P1(3) + P2(5) + P3(3) + P4(1) = unique non-repeating

### Exam Document Schema
```
exams/{examId}
{
  uid: string,
  part: "P1" | "P2" | "P3" | "P4" | "complete",
  mode: string,
  status: "in_progress" | "completed" | "abandoned",
  questionIndexes: number[],
  createdAt: Timestamp,
  completedAt?: Timestamp,
}
```

### Existing Patterns
- Platform pages under `app/src/app/(platform)/`
- Sidebar: `app/src/components/platform/Sidebar.tsx`
- Auth: `useAuth()` from `AuthContext.tsx`

### Files to Create
- `app/src/app/(platform)/simulator/page.tsx`
- `app/src/app/api/simulator/exam/route.ts`
- `app/src/app/api/simulator/questions/route.ts`

### Files to Modify
- `app/src/components/platform/Sidebar.tsx` — add Simulador nav item

---

## File List

- `app/src/app/(platform)/simulator/page.tsx` — Modified (replaced ComingSoon with full dashboard)
- `app/src/app/api/simulator/exam/route.ts` — Created (POST exam creation with randomization)
- `app/src/app/api/simulator/questions/route.ts` — Created (GET questions by exam indexes)
- `app/src/components/platform/Sidebar.tsx` — Modified (enabled Simulador nav item)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- 5 part cards with color-coded headers and task counts
- Mode selection modal with part-specific options
- Question randomization uses offset strategy for multi-type parts (P2 audio+image)
- Sidebar "Simulador" enabled (was already present but disabled)
- Complete test mode starts directly without mode popup

---

*Story created by @sm (River) on 2026-03-12*
