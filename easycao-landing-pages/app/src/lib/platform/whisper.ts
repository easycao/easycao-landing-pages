/**
 * Groq Whisper API client for audio transcription.
 * Uses whisper-large-v3 model via Groq's OpenAI-compatible API.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

export interface WhisperWord {
  word: string;
  start: number;
  end: number;
}

export interface WhisperResult {
  text: string;
  /** Word-level timestamps for karaoke playback. */
  words: WhisperWord[];
}

/**
 * Aviation-context prompt that conditions Whisper to recognize
 * ICAO callsigns, phonetic alphabet, and radiotelephony patterns.
 *
 * IMPORTANT: The prompt also instructs Whisper to transcribe verbatim —
 * preserving grammatical errors as spoken. This is critical because the
 * grammar analysis step downstream needs the original (uncorrected) speech.
 */
const AVIATION_PROMPT = `Transcribe exactly as spoken, word for word. Do not correct grammar, verb tenses, or word choices. Preserve all errors as the speaker said them. ANAC123, ANAC456, ANAC789, Brasília Approach, São Paulo Control, Guarulhos Tower, runway two seven, flight level three five zero, squawk 7500, ATIS information Bravo, ILS approach, VOR DME, holding pattern, go-around, cleared to land, taxi to gate, pushback approved, wind two seven zero at ten knots, QNH one zero one three, TCAS RA, GPWS, EGPWS, windshear, microburst.`;

/**
 * Transcribe audio using Groq Whisper with word-level timestamps.
 * @param audioBuffer - Raw audio buffer (WebM, MP3, WAV, etc.)
 * @param filename - Filename with extension for content-type detection
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string = "audio.webm"
): Promise<WhisperResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(audioBuffer)]), filename);
  formData.append("model", "whisper-large-v3");
  formData.append("language", "en");
  formData.append("prompt", AVIATION_PROMPT);
  formData.append("temperature", "0");
  formData.append("response_format", "verbose_json");
  formData.append("timestamp_granularities[]", "word");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Whisper API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // Extract word-level timestamps
  const words: WhisperWord[] = (data.words || []).map(
    (w: { word?: string; start?: number; end?: number }) => ({
      word: (w.word || "").trim(),
      start: w.start || 0,
      end: w.end || 0,
    })
  );

  return { text: data.text || "", words };
}
