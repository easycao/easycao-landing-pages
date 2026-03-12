/**
 * GPT-4o mini client for grammar/vocabulary error analysis
 * and comprehension key-point matching.
 */

import OpenAI from "openai";
import type { FeedbackError, ComprehensionResult } from "./types";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
  return new OpenAI({ apiKey });
}

const ERROR_CATEGORIES = [
  // Structure (11)
  "subject_verb_agreement",
  "verb_tense",
  "article",
  "preposition",
  "word_order",
  "plural_singular",
  "pronoun",
  "conditional",
  "passive_voice",
  "relative_clause",
  "conjunction",
  // Vocabulary (6)
  "wrong_word",
  "collocation",
  "false_friend",
  "register",
  "missing_word",
  "redundancy",
];

export interface GrammarAnalysisResult {
  errors: FeedbackError[];
  correctedText: string;
}

/**
 * Analyze transcription for grammar and vocabulary errors.
 */
export async function analyzeGrammarVocabulary(
  transcription: string
): Promise<GrammarAnalysisResult> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an English language expert specializing in ICAO aviation English assessment. Analyze the student's spoken English transcription for grammar and vocabulary errors.

Return a JSON object with:
- "errors": array of error objects, each with:
  - "original": the exact text containing the error
  - "correction": the corrected version
  - "category": one of: ${ERROR_CATEGORIES.join(", ")}
  - "explanation": brief explanation in Portuguese (the student speaks Portuguese)
  - "position": approximate character position in the transcription
- "correctedText": the full transcription with all errors corrected

Be precise. Only flag genuine errors, not stylistic preferences. Focus on errors that affect ICAO proficiency scoring.`,
      },
      {
        role: "user",
        content: `Analyze this English transcription for errors:\n\n"${transcription}"`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return { errors: [], correctedText: transcription };
  }

  try {
    const parsed = JSON.parse(content);
    return {
      errors: (parsed.errors || []).map(
        (e: {
          original?: string;
          correction?: string;
          category?: string;
          explanation?: string;
          position?: number;
        }) => ({
          original: e.original || "",
          correction: e.correction || "",
          category: e.category || "wrong_word",
          explanation: e.explanation || "",
          position: e.position || 0,
        })
      ),
      correctedText: parsed.correctedText || transcription,
    };
  } catch {
    return { errors: [], correctedText: transcription };
  }
}

/**
 * Evaluate comprehension by matching student's response against key points.
 */
export async function evaluateComprehension(
  transcription: string,
  keyPoints: string[]
): Promise<ComprehensionResult> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an English comprehension evaluator for ICAO aviation English assessment. The student listened to an audio and then responded. Evaluate whether their response demonstrates understanding of the key points.

Return a JSON object with:
- "keyPoints": array of objects, each with:
  - "text": the key point text (from the provided list)
  - "matched": boolean, true if the student's response demonstrates understanding of this point
- "score": number of matched key points
- "total": total number of key points

Be fair but rigorous. The student doesn't need to use exact words — semantic equivalence counts.`,
      },
      {
        role: "user",
        content: `Student's response:\n"${transcription}"\n\nKey points to evaluate:\n${keyPoints.map((kp, i) => `${i + 1}. ${kp}`).join("\n")}`,
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
