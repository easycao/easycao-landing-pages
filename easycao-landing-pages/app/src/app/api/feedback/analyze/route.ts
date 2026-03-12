import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/platform/rate-limiter";
import { transcribeAudio } from "@/lib/platform/whisper";
import { assessPronunciation } from "@/lib/platform/azure-speech";
import {
  analyzeGrammarVocabulary,
  evaluateComprehension,
} from "@/lib/platform/llm-feedback";
import type { FeedbackRequest, FeedbackResult } from "@/lib/platform/types";

/**
 * POST /api/feedback/analyze
 *
 * Orchestrates the feedback pipeline:
 * 1. Download audio from Firebase Storage URL
 * 2. Parallel: Whisper transcription + Azure pronunciation/fluency
 * 3. After transcription: parallel GPT-4o mini grammar + comprehension
 * 4. Return combined FeedbackResult
 */
export async function POST(request: NextRequest) {
  // Auth check
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifySession(sessionCookie);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  // Rate limiting
  if (!checkRateLimit(user.uid)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 }
    );
  }

  // Parse request body
  let body: FeedbackRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { audioUrl, referenceText, keyPoints, taskType } = body;
  if (!audioUrl || !taskType) {
    return NextResponse.json(
      { error: "audioUrl and taskType are required" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Download audio from URL
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: "Failed to download audio" },
        { status: 400 }
      );
    }
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    // Determine filename from URL for mime type detection
    const urlPath = new URL(audioUrl).pathname;
    const ext = urlPath.split(".").pop() || "webm";
    const filename = `audio.${ext}`;

    // Step 2: Run Whisper and Azure in parallel
    // Azure needs reference text — skip if not provided or audio too long
    const audioSizeEstimateSec = audioBuffer.length / (16000 * 2); // rough estimate for 16kHz 16-bit
    const shouldRunAzure = !!referenceText && audioSizeEstimateSec <= 35;

    const [whisperResult, azureResult] = await Promise.allSettled([
      transcribeAudio(audioBuffer, filename),
      shouldRunAzure
        ? assessPronunciation(audioBuffer, referenceText!)
        : Promise.resolve(null),
    ]);

    // Extract transcription (required)
    const transcription =
      whisperResult.status === "fulfilled"
        ? whisperResult.value.text
        : "";

    if (whisperResult.status === "rejected") {
      console.error("Whisper failed:", whisperResult.reason);
    }

    // Extract Azure scores (optional)
    const azure =
      azureResult.status === "fulfilled" ? azureResult.value : null;
    if (azureResult.status === "rejected") {
      console.error("Azure Speech failed:", azureResult.reason);
    }

    // Step 3: Run GPT-4o mini analysis in parallel (grammar + comprehension)
    const [grammarResult, comprehensionResult] = await Promise.allSettled([
      transcription
        ? analyzeGrammarVocabulary(transcription)
        : Promise.resolve({ errors: [], correctedText: "" }),
      transcription && keyPoints && keyPoints.length > 0
        ? evaluateComprehension(transcription, keyPoints)
        : Promise.resolve(null),
    ]);

    // Build result with partial data on failures
    const grammar =
      grammarResult.status === "fulfilled"
        ? grammarResult.value
        : { errors: [], correctedText: transcription };

    if (grammarResult.status === "rejected") {
      console.error("Grammar analysis failed:", grammarResult.reason);
    }

    const comprehension =
      comprehensionResult.status === "fulfilled"
        ? comprehensionResult.value
        : undefined;

    if (comprehensionResult.status === "rejected") {
      console.error("Comprehension failed:", comprehensionResult.reason);
    }

    const result: FeedbackResult = {
      transcription,
      pronunciation: azure?.pronunciation,
      fluency: azure?.fluency,
      errors: grammar.errors,
      comprehension: comprehension || undefined,
      correctedText: grammar.correctedText,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Feedback pipeline error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
