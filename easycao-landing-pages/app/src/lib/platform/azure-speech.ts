/**
 * Azure Speech Services client for pronunciation and fluency assessment.
 * Uses the REST API directly (no SDK dependency).
 */

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
  if (!nBest?.PronunciationAssessment) {
    throw new Error("No pronunciation assessment data in Azure response");
  }

  const assessment = nBest.PronunciationAssessment;

  // Extract word and phoneme scores
  const words: WordScore[] = (nBest.Words || []).map(
    (w: {
      Word: string;
      PronunciationAssessment?: { AccuracyScore: number };
      Phonemes?: Array<{
        Phoneme: string;
        PronunciationAssessment?: { AccuracyScore: number };
      }>;
    }) => ({
      word: w.Word,
      score: w.PronunciationAssessment?.AccuracyScore ?? 0,
      phonemes: (w.Phonemes || []).map(
        (p: {
          Phoneme: string;
          PronunciationAssessment?: { AccuracyScore: number };
        }) => ({
          phoneme: p.Phoneme,
          score: p.PronunciationAssessment?.AccuracyScore ?? 0,
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
