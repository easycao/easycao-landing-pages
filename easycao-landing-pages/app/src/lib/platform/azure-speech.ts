/**
 * Azure Speech Services client for pronunciation and fluency assessment.
 * Uses the REST API directly (no SDK dependency).
 * Supports automatic chunking for long audio (>35s) using Whisper timestamps.
 */

import { splitWav } from "@/lib/platform/audio-convert";

export interface AzureSpeechResult {
  /** Pronunciation accuracy score 0-100. */
  pronunciation: number;
  /** Fluency score 0-100. */
  fluency: number;
  /** Phoneme-level breakdown for syllable coloring. */
  phonemes: PhonemeScore[];
  /** Word-level scores. */
  words: WordScore[];
}

export interface PhonemeScore {
  phoneme: string;
  score: number;
}

export interface WordScore {
  word: string;
  score: number;
  phonemes: PhonemeScore[];
}

/**
 * Assess pronunciation and fluency of audio against a reference text.
 * @param audioBuffer - WAV audio buffer (16kHz mono recommended)
 * @param referenceText - The expected text for pronunciation comparison
 * @returns Pronunciation and fluency scores with phoneme breakdown
 */
export async function assessPronunciation(
  audioBuffer: Buffer,
  referenceText: string
): Promise<AzureSpeechResult> {
  const apiKey = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || "brazilsouth";
  if (!apiKey) throw new Error("AZURE_SPEECH_KEY not configured");

  const pronunciationAssessmentConfig = {
    ReferenceText: referenceText,
    GradingSystem: "HundredMark",
    Granularity: "Phoneme",
    Dimension: "Comprehensive",
    EnableMiscue: true,
  };

  const configBase64 = Buffer.from(
    JSON.stringify(pronunciationAssessmentConfig)
  ).toString("base64");

  const url = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
      "Content-Type": "audio/wav",
      "Pronunciation-Assessment": configBase64,
      Accept: "application/json",
    },
    body: new Uint8Array(audioBuffer),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Azure Speech API error (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  // Extract scores from Azure response
  const nBest = data.NBest?.[0];
  if (!nBest) {
    throw new Error(`No NBest in Azure response. RecognitionStatus=${data.RecognitionStatus}`);
  }

  // Azure returns scores in two possible locations depending on API version:
  // 1. Directly on nBest: nBest.AccuracyScore, nBest.FluencyScore
  // 2. Nested: nBest.PronunciationAssessment.AccuracyScore
  const assessment = nBest.PronunciationAssessment || nBest;

  // Extract word and phoneme scores — words also have two formats
  const words: WordScore[] = (nBest.Words || []).map(
    (w: {
      Word: string;
      AccuracyScore?: number;
      PronunciationAssessment?: { AccuracyScore: number };
      Phonemes?: Array<{
        Phoneme: string;
        AccuracyScore?: number;
        PronunciationAssessment?: { AccuracyScore: number };
      }>;
    }) => ({
      word: w.Word,
      score: w.PronunciationAssessment?.AccuracyScore ?? w.AccuracyScore ?? 0,
      phonemes: (w.Phonemes || []).map(
        (p) => ({
          phoneme: p.Phoneme,
          score: p.PronunciationAssessment?.AccuracyScore ?? p.AccuracyScore ?? 0,
        })
      ),
    })
  );

  const phonemes: PhonemeScore[] = words.flatMap((w) => w.phonemes);

  return {
    pronunciation: assessment.AccuracyScore ?? 0,
    fluency: assessment.FluencyScore ?? 0,
    phonemes,
    words,
  };
}

interface WhisperTimestamp {
  word: string;
  start: number;
  end: number;
}

const MAX_CHUNK_SECONDS = 30;

/**
 * Find natural break points in audio using Whisper timestamps.
 * Looks for the largest gap near the target chunk boundary.
 */
function findBreakpoints(whisperWords: WhisperTimestamp[], totalDuration: number): number[] {
  if (totalDuration <= MAX_CHUNK_SECONDS + 5) return []; // small buffer

  const breakpoints: number[] = [];
  let target = MAX_CHUNK_SECONDS;

  while (target < totalDuration - 10) {
    // Find the largest gap within ±5s of the target
    let bestGap = 0;
    let bestTime = target;

    for (let i = 1; i < whisperWords.length; i++) {
      const gapStart = whisperWords[i - 1].end;
      const gapEnd = whisperWords[i].start;
      const gapMid = (gapStart + gapEnd) / 2;
      const gap = gapEnd - gapStart;

      if (gapMid >= target - 5 && gapMid <= target + 5 && gap > bestGap) {
        bestGap = gap;
        bestTime = gapMid;
      }
    }

    breakpoints.push(bestTime);
    target = bestTime + MAX_CHUNK_SECONDS;
  }

  return breakpoints;
}

/**
 * Split the reference text into chunks matching the audio breakpoints.
 * Uses word count proportional to the whisper words in each time segment.
 */
function splitReferenceText(
  referenceText: string,
  whisperWords: WhisperTimestamp[],
  breakpoints: number[]
): string[] {
  const refWords = referenceText.split(/\s+/);
  const times = [0, ...breakpoints, Infinity];
  const chunks: string[] = [];

  let refIdx = 0;
  for (let c = 0; c < times.length - 1; c++) {
    const start = times[c];
    const end = times[c + 1];
    // Count whisper words in this time segment
    const segmentWordCount = whisperWords.filter(
      (w) => w.start >= start && w.start < end
    ).length;

    const chunkWords = refWords.slice(refIdx, refIdx + segmentWordCount);
    chunks.push(chunkWords.join(" "));
    refIdx += segmentWordCount;
  }

  // Append any remaining words to the last chunk
  if (refIdx < refWords.length) {
    chunks[chunks.length - 1] += " " + refWords.slice(refIdx).join(" ");
  }

  return chunks.filter((c) => c.trim());
}

/**
 * Assess pronunciation with automatic chunking for long audio.
 * Uses Whisper timestamps to find natural break points.
 */
export async function assessPronunciationChunked(
  wavBuffer: Buffer,
  referenceText: string,
  whisperWords: WhisperTimestamp[]
): Promise<AzureSpeechResult> {
  const totalDuration = whisperWords.length > 0
    ? whisperWords[whisperWords.length - 1].end
    : 0;

  const breakpoints = findBreakpoints(whisperWords, totalDuration);

  // Short audio — no chunking needed
  if (breakpoints.length === 0) {
    return assessPronunciation(wavBuffer, referenceText);
  }

  // Split audio and text
  const audioChunks = await splitWav(wavBuffer, breakpoints);
  const textChunks = splitReferenceText(referenceText, whisperWords, breakpoints);

  // Process each chunk
  const results: AzureSpeechResult[] = [];
  for (let i = 0; i < audioChunks.length; i++) {
    const text = textChunks[i] || referenceText;
    try {
      const result = await assessPronunciation(audioChunks[i], text);
      results.push(result);
    } catch (err) {
      console.error(`[azure-speech] Chunk ${i} failed:`, err);
    }
  }

  if (results.length === 0) {
    throw new Error("All audio chunks failed pronunciation assessment");
  }

  // Merge results — weighted average by word count
  const allWords = results.flatMap((r) => r.words);
  const allPhonemes = results.flatMap((r) => r.phonemes);
  const totalWords = allWords.length;

  let weightedPron = 0;
  let weightedFlu = 0;
  for (const r of results) {
    const weight = r.words.length / totalWords;
    weightedPron += r.pronunciation * weight;
    weightedFlu += r.fluency * weight;
  }

  return {
    pronunciation: Math.round(weightedPron * 100) / 100,
    fluency: Math.round(weightedFlu * 100) / 100,
    phonemes: allPhonemes,
    words: allWords,
  };
}
