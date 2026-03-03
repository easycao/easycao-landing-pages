# Story 1.0.1 — Secure API Credentials

**Status:** Done
**Priority:** Critical (blocks deploy)
**Brief Reference:** FASE 1 — Segurança

---

## Story

As a developer, I need to move hardcoded Mailchimp credentials from source code to environment variables so that API keys are not exposed in the repository.

## Acceptance Criteria

- [ ] AC1: Mailchimp API key, server, audience ID, and tag are read from `process.env` in `route.ts`
- [ ] AC2: `.env.local` file exists with all 4 variables
- [ ] AC3: `.env.local` is listed in `.gitignore`
- [ ] AC4: No hardcoded credentials remain in any source file
- [ ] AC5: `.env.example` file exists documenting required variables (without real values)

## Tasks

- [x] Task 1: Create `.env.local` in `/app` root with MAILCHIMP_API_KEY, MAILCHIMP_SERVER, MAILCHIMP_AUDIENCE_ID, MAILCHIMP_TAG
- [x] Task 2: Verify `.gitignore` includes `.env.local` (add if missing) — already covered by `.env*` pattern
- [x] Task 3: Refactor `src/app/api/subscribe/route.ts` to use `process.env.*` instead of hardcoded constants
- [x] Task 4: Create `.env.example` with placeholder values for documentation
- [x] Task 5: Verify build succeeds with `npm run build`

## Dev Notes

**File:** `src/app/api/subscribe/route.ts` (lines 3-6)

Replace hardcoded constants with:
```ts
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_TAG = process.env.MAILCHIMP_TAG || "Lives";
```

## File List

- `src/app/api/subscribe/route.ts` — Modified (env vars)
- `.env.local` — Created
- `.env.example` — Created
- `.gitignore` — Modified (if needed)

---

## Dev Agent Record

### Debug Log
(none)

### Completion Notes
(pending)

### Change Log
(pending)
