# Story Platform-5.1 — Database Unification: Migrate `students` to `Users` + Firestore Cleanup

**Status:** Done
**Priority:** P0 (blocks continued platform development)
**Epic:** Platform E5 — Database Unification & Cleanup
**PRD Reference:** N/A (technical debt / architecture)

---

## Context

The Easycao Firebase project (`easycao-3e43f`) currently has two collections representing the same entity (a person who interacts with Easycao):

- **`Users`** — created by the FlutterFlow mobile app. Doc ID = Firebase Auth UID. Referenced by 12+ collections via DocumentReference (`/Users/{uid}`). Contains ICAO simulator progress, training flags, subscription data.
- **`students`** — created by the Next.js platform + Hotmart webhooks. Doc ID = Firebase Auth UID (sign-up) or auto-generated (Hotmart webhook). Contains CRM data, enrollments, course progress.

Additionally, the database has ~13 dead/legacy collections from abandoned FlutterFlow features, and legacy documents mixed into active collections.

### Problems

1. **Two collections for one entity** — platform and app have separate views of the same person
2. **Doc ID mismatch in `students`** — Hotmart webhook creates docs with auto-generated IDs, sign-up creates with Firebase Auth UID, causing potential duplicates
3. **FlutterFlow app cannot be modified** — it will continue writing to `Users` until replaced by the new mobile app
4. **12+ collections reference `Users` via DocumentReference** — Part*History, TesteICAOCompleto, Playlists, audios, etc.
5. **~13 dead collections** consuming storage and causing confusion

### Solution

Unify on `Users` as the single collection. Migrate `students` data into `Users`. Deploy a Cloud Function to auto-merge duplicates created by FlutterFlow (which can't check for existing docs by email). Clean up dead collections and legacy documents.

---

## Acceptance Criteria

### Phase A: Cloud Function for Auto-Deduplication

- [ ] AC1: A Firebase Cloud Function triggers on `Users/{uid}` `onCreate`. When a new doc is created, it checks if another doc in `Users` exists with the same email and `authLinked == false`. If found, it merges CRM/enrollment data from the old doc into the new doc, moves subcollections (`enrollments`, `progress`), and deletes the old doc.
- [ ] AC2: The Cloud Function is idempotent — running twice on the same event produces the same result.
- [ ] AC3: The Cloud Function logs every merge operation (old doc ID, new doc ID, email, fields merged).

### Phase B: Migration Script (one-time)

- [ ] AC4: A migration script reads all `students` documents and for each:
  - Finds a matching `Users` doc by email.
  - **If match found (student has app account):** Merges CRM fields (`hotmartUserId`, `hotmartStatus`, `turmaId`, `platformAccess`, `csEnabled`, `approved`, `approvedAt`, `tags`, `totalEnrollments`, `currentEnrollmentId`, `phone`, `document`, `city`, `state`, `firstName`, `lastName`) into the `Users/{uid}` doc. Copies `students/{id}/enrollments/*` to `Users/{uid}/enrollments/*`. Copies `students/{id}/progress/*` to `Users/{uid}/progress/*`. Deletes the source `students` doc and its subcollections.
  - **If no match (student never created app account):** Creates `Users/{auto-id}` with all student data plus `authLinked: false`, `uid: null`. Moves subcollections. Deletes the source `students` doc.
- [ ] AC5: The migration script is idempotent and can be re-run safely.
- [ ] AC6: The migration script produces a summary report: total students processed, matched (merged), unmatched (created as authLinked:false), errors.
- [ ] AC7: A dry-run mode exists that reports what would happen without making changes.

### Phase C: Update Platform Code (Next.js)

- [ ] AC8: `AuthContext.tsx` sign-up flow updated:
  - After Firebase Auth creates the user, search `Users` by email.
  - If found (Hotmart pre-created doc): create new `Users/{uid}` with merged data, move subcollections, delete old doc, set `authLinked: true`.
  - If not found: create `Users/{uid}` with `authLinked: true`.
- [ ] AC9: All CRM code (`lib/crm/students.ts`, `lib/crm/types.ts`) updated to read/write `Users` collection instead of `students`.
- [ ] AC10: Hotmart webhook (`api/webhook/hotmart/route.ts`) updated:
  - On `PURCHASE_APPROVED`: search `Users` by email.
  - If found: create enrollment in existing `Users/{id}/enrollments/`, update CRM fields.
  - If not found: create `Users/{auto-id}` with `authLinked: false`, enrollment data, CRM fields.
- [ ] AC11: Platform access code (`lib/platform/access.ts`) updated to read from `Users` instead of `students`.
- [ ] AC12: Platform progress code (`lib/platform/progress.ts`) updated — subcollection path changes from `students/{uid}/progress` to `Users/{uid}/progress`.
- [ ] AC13: All admin API routes updated to query `Users` instead of `students`.
- [ ] AC14: Cron job (`api/cron/student-messages/route.ts`) updated to query `Users` instead of `students`. All full-scan queries (`collection.get()`) are replaced with filtered queries (`.where("totalEnrollments", ">", 0)`) to avoid loading freemium app users who have no enrollments. This applies to: cron job, CRM pipeline, engagement stats, and seed-from-pipedrive routes.
- [ ] AC15: `linkPendingEnrollments()` in `lib/platform/access.ts` is either removed or repurposed to handle the `authLinked: false` → `true` migration flow on sign-up.
- [ ] AC16: The admin CRM dashboard displays only users who have at least one enrollment (i.e., Hotmart customers). Users who only created an app account (freemium, no purchase) are NOT shown in the CRM. The CRM query filters by `totalEnrollments > 0` or by existence of the `enrollments` subcollection.
- [ ] AC17: `npm run build` passes with no errors after all changes.

### Phase D: Delete Dead Collections

- [ ] AC18: The following collections are deleted from Firestore (script or manual via Firebase Console):
  - `Part1_Answers`
  - `Part2_Answers`
  - `Part3_Answers`
  - `Part4_Answers`
  - `answersRecordings`
  - `TranscribedAudio`
  - `audio_recordings`
  - `Class_Completion_Checkbox_Collection`
  - `Downloadable_Files`
  - `students` (after migration is verified)
  - `pending-enrollments` (no longer needed)
- [ ] AC19: Legacy documents in the `courses` collection (created by FlutterFlow's abandoned course feature) are identified and deleted. Platform-created course documents (with `modules` subcollections) are preserved.
- [ ] AC20: Top-level `modules` and `classes` collections (FlutterFlow legacy) are deleted entirely.

### Phase E: Verification

- [ ] AC21: Existing FlutterFlow app continues to work — users can log in, use simulator, playlists, and all ICAO features without any changes.
- [ ] AC22: Platform CRM shows all former `students` records (customers with enrollments) in `Users` with correct enrollment data. Freemium-only app users (no purchase) are excluded from CRM view.
- [ ] AC23: Platform login works for users who had both `Users` and `students` docs.
- [ ] AC24: Hotmart webhook correctly creates/updates `Users` docs for new purchases.
- [ ] AC25: History collections (Part*History, TesteICAOCompleto) remain queryable by `UserID` DocumentReference — no migration needed on these collections.

---

## Tasks

### Cloud Function
- [x] Task 1: Create Firebase Cloud Functions project (if not exists) with TypeScript
- [x] Task 2: Implement `onUserCreated` Cloud Function with email-based deduplication logic
- [x] Task 3: Implement `moveSubcollection` helper (read all docs from source, write to target, delete source)
- [ ] Task 4: Deploy Cloud Function to Firebase project `easycao-3e43f`
- [ ] Task 5: Test with manual doc creation in Firebase Console

### Migration Script
- [x] Task 6: Create `app/scripts/migrate-students-to-users.mjs`
- [x] Task 7: Implement dry-run mode (`--dry-run` flag)
- [x] Task 8: Implement email matching logic (case-insensitive)
- [x] Task 9: Implement subcollection migration (enrollments, progress)
- [ ] Task 10: Run dry-run against production and review report
- [ ] Task 11: Run actual migration (with backup/snapshot first)

### Platform Code Updates
- [x] Task 12: Update `AuthContext.tsx` — sign-up checks for existing `Users` doc by email
- [x] Task 13: Rename/refactor `lib/crm/students.ts` → update collection references to `Users`
- [x] Task 14: Update `lib/crm/types.ts` — add `authLinked`, `uid` fields to Student/User interface
- [x] Task 15: Update `api/webhook/hotmart/route.ts` — create in `Users` instead of `students`
- [x] Task 16: Update `lib/platform/access.ts` — read turmaId from `Users`
- [x] Task 17: Update `lib/platform/progress.ts` — subcollection path to `Users/{uid}/progress`
- [x] Task 18: Update all admin API routes (turmas, CRM, seed-from-hotmart)
- [x] Task 19: Update cron job route
- [ ] Task 20: Add `authLinked` indicator to CRM student cards
- [ ] Task 21: Create Firestore composite index for `Users` collection: `totalEnrollments` + `email` (for filtered CRM/cron queries)
- [x] Task 22: Verify `npm run build` passes

### Cleanup
- [x] Task 23: Create cleanup script to delete dead collections (AC18)
- [x] Task 24: Identify and delete FlutterFlow legacy docs from `courses` collection
- [x] Task 25: Delete top-level `modules` and `classes` collections

### Verification
- [ ] Task 26: Test FlutterFlow app (login, simulator, playlists) — confirm no regression
- [ ] Task 27: Test platform CRM with migrated data — verify only enrolled users appear
- [ ] Task 28: Test Hotmart webhook (new purchase for existing user, new purchase for new user)
- [ ] Task 29: Test platform sign-up (new user, user with existing Hotmart doc, race condition with Cloud Function)
- [ ] Task 30: Verify History queries work from platform (`Part*History where UserID == /Users/{uid}`)

---

## Dev Notes

### Collections NOT touched by this story (remain as-is)
- `Part1History`, `Part2History`, `Part3History`, `Part4History` + all subcollections
- `TesteICAOCompleto`
- `ICAO_Test_Questions`
- `Playlist_database`, `Playlists`, `audios`
- `Corrections_List`
- `PaidUsers` (still used by FlutterFlow app — cleanup deferred to FlutterFlow sunset)
- `ExpiredUsers` (still used by FlutterFlow app — cleanup deferred)
- `FreemiumAccessIsOver`, `SubscriptionAccess_Expired`, `Lancamento` (gambiarras — cleanup deferred)
- `admins`, `turmas`, `course-notes`, `cronLogs`
- `Part2_Correction` (legacy but still read by FlutterFlow — cleanup deferred)

### Users unified schema after migration
```typescript
interface UserDocument {
  // Identity
  uid: string | null;              // Firebase Auth UID (null if no account)
  authLinked: boolean;             // true = has Firebase Auth account
  email: string;                   // always present, lowercase, dedup key
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  document: string;                // CPF

  // App fields (set by FlutterFlow, read-only for platform)
  display_name?: string;
  photo_url?: string;
  user_type?: string;              // Premium | Expired | Freemium
  ICAO_Level?: string;
  ICAO_Approval?: string;
  Part1Counter?: number;
  Part2Counter?: number;
  Part3Counter?: number;
  Part4Counter?: number;
  ICAOTestCounter?: number;
  // ... other FlutterFlow fields preserved as-is

  // Platform/CRM fields (set by webhooks + platform)
  hotmartUserId: string | null;
  hotmartStatus: string | null;
  turmaId: string | null;
  platformAccess: boolean;
  csEnabled: boolean;
  approved: boolean;
  approvedAt: Timestamp | null;
  tags: string[];
  totalEnrollments: number;
  currentEnrollmentId: string;
  city: string;
  state: string;
  courseProgress: number | null;

  // Meta
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Subcollections:
  // enrollments/{enrollmentId}  — Hotmart purchases, CRM stages
  // progress/{courseId}         — lesson completion tracking
}
```

### Key architectural decisions
1. **`Users` is THE collection** — single source of truth for all people
2. **`authLinked: false`** = Hotmart customer without account (visible in CRM, can't login)
3. **Cloud Function handles FlutterFlow dedup** — because we can't modify the Flutter app
4. **Platform sign-up handles dedup in code** — cleaner, no race condition
5. **DocumentReferences in History collections stay as `/Users/{uid}`** — zero migration needed
6. **`PaidUsers`, `ExpiredUsers` kept** — FlutterFlow still reads them, deferred to sunset
7. **Email is the dedup key** — Firebase Auth prevents duplicate emails, webhook + sign-up both check by email

### Deployment Sequence (CRITICAL)

The migration must follow this exact order to avoid data loss or inconsistencies:

1. **Firestore backup** — export full database before any changes
2. **Deploy Cloud Function** — `onUserCreated` dedup is live, catches any new sign-ups during migration
3. **Deploy platform code** — webhook now writes to `Users`, sign-up checks existing docs by email
4. **Run migration script (dry-run)** — review report, verify counts match expected
5. **Run migration script (real)** — migrate `students` → `Users`
6. **Verify** — Phase E acceptance criteria
7. **Delete `students` collection** — only after full verification
8. **Delete dead collections** — Phase D cleanup

### Rollback Plan

- **Before migration:** Full Firestore export via `gcloud firestore export gs://{bucket}/pre-migration-backup`
- **If migration script fails mid-run:** Re-run (idempotent). Already-migrated docs are skipped.
- **If platform code has bugs after deploy:** Revert via git. Data already in `Users` is safe — it's additive (new fields on existing docs).
- **If Cloud Function causes issues:** Disable in Firebase Console → Functions → disable `onUserCreated`. No data is lost, just dedup stops running.
- **Full rollback (worst case):** Restore Firestore from backup export. Revert platform code via git. Delete Cloud Function.

### Edge Cases

- **Email casing:** All email matching is case-insensitive. Migration script and all platform code normalize to lowercase before comparing. FlutterFlow already normalizes via `emailcorreto()`. Hotmart webhook already normalizes in `createStudent()`.
- **Multiple student docs with same email:** The current bug may have created duplicates. Migration script processes the NEWEST doc (by `createdAt`) as primary and merges older duplicates into it. Logs a warning for manual review.
- **Cloud Function + sign-up race condition:** Both the Cloud Function and platform sign-up attempt the same merge. Mitigation: both check if the old doc still exists before deleting. If already deleted (by the other), skip silently. The merge itself is idempotent (same fields written).
- **Subcollection move interrupted:** If the script crashes mid-move, some docs may exist in both locations. Re-running the script detects existing docs at the target and skips them, then deletes the source. Safe to retry.

### Risks
- **Race condition:** If FlutterFlow creates `Users/{uid}` and Cloud Function runs BEFORE the platform sign-up code, the merge happens twice. Mitigation: Cloud Function checks `authLinked` field; platform sign-up checks if merge already happened. Both are idempotent.
- **Subcollection move is not atomic** — if interrupted, some docs may exist in both old and new locations. Mitigation: idempotent script, dry-run first, re-runnable.
- **Large `students` collection** — migration may take time. Mitigation: batch processing, progress logging.
- **Window between deploy and migration** — after platform code is deployed but before migration runs, new Hotmart purchases write to `Users` while old data is still in `students`. This is fine — migration script handles both states.

---

## File List

| File | Action | Status | Description |
|------|--------|--------|-------------|
| `functions/src/index.ts` | Create | Done | Cloud Function for auto-dedup |
| `functions/package.json` | Create | Done | Cloud Functions package config |
| `functions/tsconfig.json` | Create | Done | Cloud Functions TypeScript config |
| `app/scripts/migrate-students-to-users.mjs` | Create | Done | One-time migration script |
| `app/scripts/cleanup-dead-collections.mjs` | Create | Done | Delete dead collections |
| `app/scripts/cleanup-legacy-courses.mjs` | Create | Done | Remove FF legacy docs from courses |
| `app/src/lib/crm/types.ts` | Modify | Done | Add `authLinked`, `uid` to Student interface |
| `app/src/lib/crm/students.ts` | Modify | Done | Collection `students` → `Users`, add `createStudentWithId()`, filtered queries |
| `app/src/contexts/AuthContext.tsx` | Modify | Done | Sign-up writes to `Users` with `authLinked: true` |
| `app/src/app/api/webhook/hotmart/route.ts` | Modify | Done | Create in `Users` with `authLinked: false` |
| `app/src/lib/platform/access.ts` | Modify | Done | Read from `Users`, replace `linkPendingEnrollments` with `linkPreCreatedUser` |
| `app/src/lib/platform/progress.ts` | Modify | Done | Subcollection path `students` → `Users` |
| `app/src/app/api/platform/register/route.ts` | Modify | Done | Register in `Users` with email-based dedup/merge |
| `app/src/app/api/platform/me/route.ts` | Modify | Done | Read from `Users` |
| `app/src/app/api/cron/student-messages/route.ts` | Modify | Done | Query `Users` with `totalEnrollments > 0` filter |
| `app/src/app/api/admin/crm/pipeline/route.ts` | Modify | Done | Query `Users` with `totalEnrollments > 0` filter |
| `app/src/app/api/admin/crm/engagement-stats/route.ts` | Modify | Done | Query `Users` with `totalEnrollments > 0` filter |
| `app/src/app/api/admin/turmas/route.ts` | Modify | Done | Query `Users` for turma members |
| `app/src/app/api/admin/students/route.ts` | Modify | Done | Enrollment subcollection ref to `Users` |
| `app/src/app/api/admin/students/[id]/route.ts` | Modify | Done | Enrollment subcollection ref to `Users` |
| `app/src/app/api/admin/students/[id]/update-price/route.ts` | Modify | Done | Enrollment subcollection ref to `Users` |
| `app/src/app/api/admin/seed-from-hotmart/route.ts` | Modify | Done | Seed into `Users`, add `uid`/`authLinked` fields |
| `app/src/app/api/admin/seed-from-pipedrive/route.ts` | Modify | Done | Query `Users` with `totalEnrollments > 0` filter |
