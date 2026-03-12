# Story Platform-6.2 — Feedback Pipeline API (Server-Side)

**Status:** Ready for Review
**Priority:** P0 (required by simulator, exercises, and course extensions)
**Epic:** Platform E6 — Shared Infrastructure
**PRD Reference:** `docs/prd/platform-phase2-prd.md` → Epic 6, Story 6.2
**Brief Reference:** `docs/platform-features-brief.md` → Section 5 (Feedback Pipeline)

---

## Story

As a developer, I need a server-side feedback pipeline API that processes student audio recordings through transcription (Whisper), pronunciation/fluency assessment (Azure Speech), and grammar/vocabulary analysis (GPT-4o mini), so that all platform features can get consistent AI-powered feedback.

## Acceptance Criteria

### API Route (AC1-AC3)

- [ ] AC1: POST `/api/feedback/analyze` accepts `{ audioUrl, referenceText?, keyPoints?, taskType }`. Returns `{ transcription, pronunciation?, fluency?, errors[], comprehension?, correctedText }`.
- [ ] AC2: Route requires authentication (verify session cookie). Rate limiting: max 50 requests/min per user.
- [ ] AC3: All API keys are server-side only (environment variables). No keys exposed to client.

### Audio Processing (AC4)

- [ ] AC4: Server downloads audio from Firebase Storage URL, converts MP3/WebM to WAV (16kHz mono) for optimal Whisper/Azure quality. Uses ffmpeg via fluent-ffmpeg or similar.

### Whisper Transcription (AC5)

- [ ] AC5: Audio sent to Groq API (model: whisper-large-v3, language: "en"). Returns transcription text. Handles errors gracefully (timeout, API unavailable).

### Azure Speech Assessment (AC6)

- [ ] AC6: Audio sent to Azure Speech Services (brazilsouth region) for pronunciation + fluency assessment. Returns pronunciation score (0-100), fluency score (0-100), and phoneme-level breakdown. Skipped for audio > 35 seconds (Azure limit).

### GPT-4o mini Analysis (AC7-AC8)

- [ ] AC7: Transcription sent to GPT-4o mini for grammar/vocabulary error analysis. Returns structured JSON with errors: `{ original, correction, category, explanation, position }`. Categories: 11 structure types + 6 vocabulary types (17 total from brief).
- [ ] AC8: When `keyPoints` provided, GPT-4o mini evaluates comprehension: which key points were addressed. Returns `{ keyPoints: [{text, matched}], score, total }`.

### Pipeline Orchestration (AC9-AC10)

- [ ] AC9: After audio download + conversion, run Whisper and Azure in parallel. After transcription available, run GPT-4o mini analysis (grammar + comprehension) in parallel with Azure.
- [ ] AC10: On failure of any step: include partial results (e.g., transcription succeeded but Azure failed → return transcription + errors without pronunciation). Log failures for monitoring.

### Corrected Text (AC11)

- [ ] AC11: GPT-4o mini returns a `correctedText` field: the student's transcription with all errors fixed.

## Tasks

- [x] Task 1: Install dependencies: `openai` SDK. Azure Speech and Whisper use REST APIs directly (no heavy SDKs). FFmpeg skipped — Groq Whisper accepts WebM natively.
- [x] Task 2: Audio conversion skipped — Groq Whisper accepts WebM/MP3 natively. Azure receives raw buffer. Download handled in API route.
- [x] Task 3: Create Whisper client `app/src/lib/platform/whisper.ts` — Groq API integration (whisper-large-v3).
- [x] Task 4: Create Azure Speech client `app/src/lib/platform/azure-speech.ts` — pronunciation + fluency assessment via REST.
- [x] Task 5: Create GPT-4o mini client `app/src/lib/platform/llm-feedback.ts` — grammar/vocab error analysis + comprehension key-point matching.
- [x] Task 6: Create API route `app/src/app/api/feedback/analyze/route.ts` — orchestrates pipeline with parallel execution.
- [x] Task 7: Add rate limiting `app/src/lib/platform/rate-limiter.ts` — in-memory (50 req/min per user).
- [x] Task 8: Verify `npm run build` passes.

## Technical Notes

### Environment Variables Required
```
GROQ_API_KEY=...              # Groq Whisper API
AZURE_SPEECH_KEY=...          # Azure Speech Services
AZURE_SPEECH_REGION=brazilsouth
OPENAI_API_KEY=...            # OpenAI GPT-4o mini
```

### Pipeline Flow
```
audioUrl → download → WAV conversion
                          ├── Whisper (Groq) → transcription
                          └── Azure Speech → pronunciation + fluency
                                    │
                          transcription ready
                          ├── GPT-4o mini → errors[] + correctedText
                          └── GPT-4o mini → comprehension (if keyPoints)
                                    │
                          → FeedbackResult
```

### FFmpeg on Vercel
- Vercel serverless functions have limited binary support
- Option A: Use `@ffmpeg/ffmpeg` (WebAssembly, runs in Node.js)
- Option B: Use a pre-built static ffmpeg binary bundled with the function
- Option C: Skip conversion — send WebM directly to Whisper (Groq supports WebM). Azure may need WAV.
- Recommended: Try sending WebM directly to Whisper first. Only convert if quality is poor.

### GPT-4o mini Prompt Structure
The LLM receives the transcription and returns structured JSON with error categories:
- **Structure (11 types):** subject_verb_agreement, verb_tense, article, preposition, word_order, plural_singular, pronoun, conditional, passive_voice, relative_clause, conjunction
- **Vocabulary (6 types):** wrong_word, collocation, false_friend, register, missing_word, redundancy

### Azure Speech API
- Pronunciation Assessment REST API (not SDK-heavy)
- Endpoint: `https://brazilsouth.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`
- Returns phoneme-level scores — store for syllable coloring in Story 9.3

### Rate Limiting
- Simple in-memory rate limiter (Map<uid, timestamps[]>)
- 50 requests per minute per user
- Vercel serverless functions are stateless — for production, consider Vercel KV or Upstash Redis

### Files to Create
- `app/src/lib/platform/audio-convert.ts`
- `app/src/lib/platform/whisper.ts`
- `app/src/lib/platform/azure-speech.ts`
- `app/src/lib/platform/llm-feedback.ts`
- `app/src/app/api/feedback/analyze/route.ts`

### Existing Patterns
- Server-side Firebase admin: `app/src/lib/firebase-admin.ts`
- Auth verification: `verifySession()` from `app/src/lib/auth.ts`
- Types: `FeedbackRequest`, `FeedbackResult`, `FeedbackError`, `ComprehensionResult` from `app/src/lib/platform/types.ts`

---

## File List

- `app/src/lib/platform/whisper.ts` — Created (Groq Whisper transcription client)
- `app/src/lib/platform/azure-speech.ts` — Created (Azure Speech pronunciation/fluency assessment)
- `app/src/lib/platform/llm-feedback.ts` — Created (GPT-4o mini grammar/vocab + comprehension)
- `app/src/lib/platform/rate-limiter.ts` — Created (in-memory rate limiter)
- `app/src/app/api/feedback/analyze/route.ts` — Created (pipeline orchestration API)
- `app/package.json` — Modified (added openai dependency)

## Dev Agent Record

### Agent Model Used
Claude Opus 4.6

### Completion Notes
- Used REST APIs for Whisper (Groq) and Azure Speech — avoids heavy SDK dependencies
- OpenAI SDK used for GPT-4o mini (structured JSON output)
- Audio conversion (ffmpeg) skipped: Groq Whisper natively accepts WebM/MP3
- Pipeline runs Whisper + Azure in parallel, then grammar + comprehension in parallel
- Partial results returned on failure (e.g., transcription without pronunciation)
- Rate limiter is in-memory (ephemeral on Vercel) — sufficient for MVP, upgrade to Redis later

---

*Story created by @sm (River) on 2026-03-12*
