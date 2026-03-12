/**
 * Groq Whisper API client for audio transcription.
 * Uses whisper-large-v3 model via Groq's OpenAI-compatible API.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

export interface WhisperResult {
  text: string;
}

/**
 * Transcribe audio using Groq Whisper.
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
  formData.append("response_format", "json");

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
  return { text: data.text || "" };
}
