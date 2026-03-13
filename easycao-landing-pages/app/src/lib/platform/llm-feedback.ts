/**
 * GPT-4o mini client for grammar/vocabulary error analysis
 * and comprehension key-point matching.
 *
 * Prompt adapted from the original FlutterFlow GroqICAOTestCall,
 * with ICAO doc9835 descriptor categories and detailed error definitions.
 */

import OpenAI from "openai";
import type { FeedbackError, ComprehensionResult } from "./types";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
  return new OpenAI({ apiKey });
}

export interface GrammarAnalysisResult {
  errors: FeedbackError[];
  correctedText: string;
  /** Overall AI feedback paragraph for the student (in Portuguese). */
  aiFeedback: string;
  /** Alternative phrasing at ICAO Level 4. */
  level4Version: string;
  /** Alternative phrasing at ICAO Level 5. */
  level5Version: string;
}

// ---------------------------------------------------------------------------
// ICAO Grammar & Vocabulary Analysis
// ---------------------------------------------------------------------------

const ICAO_SYSTEM_PROMPT = `You are an experienced ICAO examiner calibrated to doc9835 Operational Level 4+. Your job is to identify REAL grammar/vocabulary mistakes in a pilot's spoken English — NOT to rewrite their speech into perfect prose.

## CRITICAL: False-Positive Prevention

**Your #1 priority is ACCURACY. Flag only genuine errors. When in doubt, do NOT flag.**

### MUST accept (do NOT flag):
- **Spoken register**: contractions, informal but natural phrasing
- **Correct but less sophisticated** tenses (simple past instead of past perfect, simple present instead of present continuous)
- **Reported speech**: both backshift and simple past are acceptable
- **Multiple valid prepositions**: "in the runway" is wrong (→ on), but "fly to/toward Madrid" are both fine
- **Transcription artifacts**: The input comes from speech-to-text (Whisper). Common artifacts include:
  - Missing/added articles (a/the) — do NOT flag unless clearly wrong in context
  - Minor capitalization or word boundary issues — IGNORE completely
  - Filler words, self-corrections, repetitions — these are natural speech, NOT errors
- **Style preferences**: If two forms are both grammatically correct, accept the student's choice

### MUST flag (genuine errors):
- Errors that would genuinely confuse a controller or pilot in radiotelephony
- Clear structural breakdowns (missing verb, wrong agreement, broken conditionals)
- Wrong word class that changes meaning (verb used as noun, etc.)
- Non-existent English words (invented words from L1 transfer)

### The threshold test:
Before flagging each error, ask yourself: "Would a native English-speaking ICAO examiner at a live test mark this as an error?" If the answer is "probably not" or "it depends on the examiner", do NOT flag it.

---

## Descriptors and Categories

### Structure

- **Missing Subject** — No explicit subject, even with a verb present.
  Example: "Is crossing runway three four left without clearance."

- **Missing Main Verb** — No main verb, preventing a complete clause.
  Example: "The approach unstable due to windshear."

- **Third Person Error** — Missing -s/-es on 3rd person singular present simple.
  Example: "The controller give us vectors to final."

- **Missing Gerund Form** — Structure requires -ing but it wasn't used.
  Example: "We are wait for pushback."

- **Missing Past Form** — Clear past context but verb is not in past form.
  Example: "We land yesterday after sunset."

- **Incorrect Verb After Modal** — Inflected/to-infinitive after modal.
  Example: "We must to follow the new procedure."

- **Incorrect Infinitive Form** — Wrong infinitive form after verbs that require to+base.
  Example: "I want go to the terminal."

- **Incorrect Indefinite Article** — Wrong a/an (phonetic rule).
  Example: "We had an emergency call from a engineer."

- **Singular/Plural Agreement** — Subject and verb/noun don't agree in number.
  Example: "The wheels is chocked."

- **Past Conditionals** — Broken past conditional structure.
  Example: "If the pilot had a warning, he will continue."

- **Present Conditionals** — Broken present conditional structure.
  Example: "If the weather improves, we would depart."

### Vocabulary

- **Word Choice (Adjectives vs. Adverbs)** — Adjective where adverb is needed or vice versa.
  Example: "The aircraft touched down smooth."

- **Word Choice (Verbs vs. Nouns)** — Wrong grammatical class.
  Example: "The aircraft will departure in ten minutes."

- **Word Choice (Uncountable Nouns)** — Uncountable noun incorrectly pluralized.
  Example: "Several informations were shared by ops."

- **Word Choice (Non-existent Words)** — Term does not exist in English (L1 transfer). Use ONLY when no specific category applies.
  Example: "The captain reconfirmated the route."

- **Word Choice (Plural Adjectives)** — Adjectives incorrectly pluralized.
  Example: "We had mechanicals issues."

- **Word Choice (Prepositions)** — Wrong preposition in fixed expressions/collocations.
  Example: "We landed in runway 27." (→ on)

### Category Priority (most specific first):
Word Choice (Prepositions) > (Uncountable Nouns) > (Plural Adjectives) > (Adj vs. Adv) > (Verbs vs. Nouns) > (Non-existent Words)

---

## Output Format

Return a single JSON object:

{
  "corrections": [
    {
      "desc": "Structure" or "Vocabulary",
      "cat": "exact category name from the list above",
      "word": "the erroneous word or short phrase exactly as it appears in the transcription",
      "correction": "the corrected word or phrase",
      "confidence": "high" or "medium",
      "exp": "explanation in simple Portuguese (for a Brazilian pilot student)"
    }
  ],
  "correctedText": "full transcription with ONLY high-confidence corrections applied",
  "level4Version": "Provide an ALTERNATIVE way to express the same idea at ICAO Operational Level 4. IMPORTANT: Do NOT just copy the correctedText — use DIFFERENT vocabulary, DIFFERENT sentence structure, or DIFFERENT phrasing while keeping the same meaning. For example, if correctedText is 'I like flying', level4Version could be 'I enjoy being a pilot' or 'Flying is something I really like'. Be creative with synonyms, restructured sentences, or alternative expressions.",
  "level5Version": "Rewrite the student's response as a native speaker at ICAO Extended Level 5 would say it. Use richer vocabulary, more complex structures (relative clauses, conditionals, passive voice), idiomatic expressions, and natural fluency markers. Show what 'excellent' sounds like.",
  "aiFeedback": "2-3 sentence overall feedback in Portuguese. Be warm and encouraging. IMPORTANT: Vary your opening — do NOT always start with 'Você fez um bom trabalho'. Instead, be specific about what was good (e.g., 'Sua estrutura gramatical está sólida', 'Boa fluência na resposta', 'Vocabulário adequado para o contexto'). If errors exist, mention the main pattern to work on. If no errors, congratulate enthusiastically with specific praise."
}

### Confidence levels:
- **high**: Clear, unambiguous error. Any ICAO examiner would flag it.
- **medium**: Likely an error but could be acceptable in spoken context or could be a transcription artifact.

If there are **no** errors, return corrections as an empty array and write a congratulatory aiFeedback.
If the transcription is very short (< 5 words) or seems garbled, return empty corrections and note this in aiFeedback.

Respond ONLY with valid JSON. No markdown, no explanation.`;

/**
 * Analyze transcription for grammar and vocabulary errors using ICAO doc9835 criteria.
 */
export async function analyzeGrammarVocabulary(
  transcription: string
): Promise<GrammarAnalysisResult> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: ICAO_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Analyze this English transcription for errors:\n\n"${transcription}"`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return { errors: [], correctedText: transcription, aiFeedback: "", level4Version: "", level5Version: "" };
  }

  try {
    const parsed = JSON.parse(content);
    return {
      errors: (parsed.corrections || parsed.errors || []).map(
        (e: {
          word?: string;
          original?: string;
          correction?: string;
          corr?: string;
          desc?: string;
          descriptor?: string;
          cat?: string;
          category?: string;
          subcategory?: string;
          confidence?: string;
          exp?: string;
          explanation?: string;
        }) => {
          // Normalize descriptor to lowercase "structure" / "vocabulary"
          const rawDesc = e.desc || e.descriptor || "";
          const descriptor = rawDesc.toLowerCase().startsWith("s") ? "structure" : "vocabulary";

          // Get the specific sub-category
          const subCategory = e.cat || e.category || e.subcategory || "";

          // Get the erroneous word
          let word = e.word || e.original || "";
          // Handle "wrong - correct" format from corr field
          if (!word && e.corr) {
            const parts = e.corr.split(" - ");
            word = parts[0]?.trim() || "";
          }

          // Get correction
          let correction = e.correction || "";
          if (!correction && e.corr) {
            const parts = e.corr.split(" - ");
            correction = parts[1]?.trim() || parts[0]?.trim() || "";
          }

          return {
            original: word,
            correction,
            category: descriptor,
            explanation: e.exp || e.explanation || "",
            position: 0,
            // Store sub-category for detailed display
            subCategory,
            // Confidence level from V2 prompt
            confidence: e.confidence || "high",
          } as FeedbackError & { subCategory?: string; confidence?: string };
        }
      ),
      correctedText: parsed.correctedText || parsed.corrected_text || transcription,
      aiFeedback: parsed.aiFeedback || parsed.msg || "",
      level4Version: parsed.level4Version || "",
      level5Version: parsed.level5Version || "",
    };
  } catch {
    return { errors: [], correctedText: transcription, aiFeedback: "", level4Version: "", level5Version: "" };
  }
}

// ---------------------------------------------------------------------------
// Comprehension Key-Point Matching
// ---------------------------------------------------------------------------

const COMPREHENSION_SYSTEM_PROMPT = `Você deverá analisar se um texto fornecido cita os pontos-chave listados.

Regras:
- Conte quantos pontos-chave foram mencionados (explícita ou implicitamente), aceitando equivalências corretas (sinônimos/paráfrases) e a conversão FL↔pés (FL x 100 = ft; ft/100 = FL; FL010=1000 ft; FL100=10000 ft; FL250=25000 ft).
- Itens compostos exigem TODOS os atributos (ex.: direção + nós do vento). Parcial = erro.
- Para cada ponto-chave, indique se foi mencionado ou não.

Saída — responda SOMENTE com um objeto JSON:
{
  "keyPoints": [
    { "text": "o ponto-chave", "matched": true/false }
  ],
  "score": <número de matches>,
  "total": <total de pontos-chave>
}

Não inclua explicações, markdown ou qualquer outro texto.`;

/**
 * Evaluate comprehension by matching student's response against key points.
 * Adapted from the original FlutterFlow GroqCompreensaoCall.
 */
export async function evaluateComprehension(
  transcription: string,
  keyPoints: string[]
): Promise<ComprehensionResult> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: COMPREHENSION_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Texto do aluno:\n"${transcription}"\n\nPontos-chave:\n${keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join("\n")}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return {
      keyPoints: keyPoints.map((text) => ({ text, matched: false })),
      score: 0,
      total: keyPoints.length,
    };
  }

  try {
    const parsed = JSON.parse(content);

    // Handle both formats: array of objects or simple number
    if (typeof parsed.number === "number") {
      // Simple format from original FlutterFlow prompt
      return {
        keyPoints: keyPoints.map((text, i) => ({
          text,
          matched: i < parsed.number,
        })),
        score: parsed.number,
        total: keyPoints.length,
      };
    }

    return {
      keyPoints: (parsed.keyPoints || []).map(
        (kp: { text?: string; matched?: boolean }, i: number) => ({
          text: kp.text || keyPoints[i] || "",
          matched: kp.matched || false,
        })
      ),
      score: parsed.score || 0,
      total: parsed.total || keyPoints.length,
    };
  } catch {
    return {
      keyPoints: keyPoints.map((text) => ({ text, matched: false })),
      score: 0,
      total: keyPoints.length,
    };
  }
}
