import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { getFirebaseStorage } from "@/lib/firebase-admin";
import { createHash } from "crypto";

const CACHE_PREFIX = "polly-cache";

function getPollyClient(): PollyClient {
  const region = process.env.AWS_REGION || "us-east-1";
  return new PollyClient({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

/**
 * Generate reference audio with Amazon Polly (Stephen, neural) for a given text.
 * Caches result in Firebase Storage to avoid re-generating.
 * Returns the public URL of the cached MP3.
 */
export async function generateReferenceAudio(text: string): Promise<string> {
  const hash = createHash("sha256").update(text).digest("hex").slice(0, 16);
  const filePath = `${CACHE_PREFIX}/${hash}.mp3`;

  const storage = getFirebaseStorage();
  const bucket = storage.bucket();
  const file = bucket.file(filePath);

  // Check cache
  const [exists] = await file.exists();
  if (exists) {
    const [metadata] = await file.getMetadata();
    // Return the public URL via Firebase Storage download tokens
    const token = String(
      metadata.metadata?.firebaseStorageDownloadTokens ||
      createHash("md5").update(filePath).digest("hex")
    );
    return buildStorageUrl(bucket.name, filePath, token);
  }

  // Generate with Polly
  const polly = getPollyClient();
  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Stephen",
    Engine: "neural",
    LanguageCode: "en-US",
  });

  const response = await polly.send(command);
  if (!response.AudioStream) {
    throw new Error("Polly returned no audio stream");
  }

  // Read stream to buffer
  const chunks: Uint8Array[] = [];
  const stream = response.AudioStream as AsyncIterable<Uint8Array>;
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const audioBuffer = Buffer.concat(chunks);

  // Upload to Firebase Storage
  const downloadToken = createHash("md5").update(filePath + Date.now()).digest("hex");
  await file.save(audioBuffer, {
    metadata: {
      contentType: "audio/mpeg",
      metadata: { firebaseStorageDownloadTokens: downloadToken },
    },
  });

  return buildStorageUrl(bucket.name, filePath, downloadToken);
}

function buildStorageUrl(bucketName: string, filePath: string, token: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;
}
