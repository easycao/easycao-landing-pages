/**
 * Audio conversion utilities.
 * Uses ffmpeg-static when available (local dev), falls back to
 * passing raw audio through when ffmpeg is not available (Vercel).
 */

import { execFile } from "child_process";
import { writeFile, readFile, unlink, mkdtemp } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

/**
 * Try to get ffmpeg path. Returns null if not available.
 */
async function getFfmpegPath(): Promise<string | null> {
  try {
    // Try ffmpeg-static first
    const mod = await import("ffmpeg-static");
    const p = mod.default || mod;
    if (typeof p === "string") return p;
  } catch {
    // Not installed
  }

  // Try system ffmpeg
  return new Promise((resolve) => {
    execFile("ffmpeg", ["-version"], { timeout: 3000 }, (error) => {
      resolve(error ? null : "ffmpeg");
    });
  });
}

/**
 * Convert an audio buffer to WAV 16kHz mono using ffmpeg.
 * Returns null if ffmpeg is not available.
 */
export async function convertToWav(
  inputBuffer: Buffer,
  inputExt: string = "webm"
): Promise<Buffer | null> {
  const ffmpeg = await getFfmpegPath();
  if (!ffmpeg) {
    console.warn("[audio-convert] ffmpeg not available, skipping WAV conversion");
    return null;
  }

  const dir = await mkdtemp(join(tmpdir(), "audio-"));
  const inputPath = join(dir, `input.${inputExt}`);
  const outputPath = join(dir, "output.wav");

  try {
    await writeFile(inputPath, inputBuffer);

    await new Promise<void>((resolve, reject) => {
      execFile(
        ffmpeg,
        [
          "-y",
          "-i", inputPath,
          "-ar", "16000",
          "-ac", "1",
          "-sample_fmt", "s16",
          "-f", "wav",
          outputPath,
        ],
        { timeout: 30000 },
        (error, _stdout, stderr) => {
          if (error) {
            reject(new Error(`ffmpeg failed: ${stderr || error.message}`));
          } else {
            resolve();
          }
        }
      );
    });

    return await readFile(outputPath);
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}

/**
 * Split a WAV buffer into chunks at specified timestamps using ffmpeg.
 * Returns null if ffmpeg is not available.
 */
export async function splitWav(
  wavBuffer: Buffer,
  breakpoints: number[]
): Promise<Buffer[] | null> {
  if (breakpoints.length === 0) return [wavBuffer];

  const ffmpeg = await getFfmpegPath();
  if (!ffmpeg) {
    console.warn("[audio-convert] ffmpeg not available, skipping WAV split");
    return null;
  }

  const dir = await mkdtemp(join(tmpdir(), "split-"));
  const inputPath = join(dir, "input.wav");

  try {
    await writeFile(inputPath, wavBuffer);

    const times = [0, ...breakpoints];
    const chunks: Buffer[] = [];

    for (let i = 0; i < times.length; i++) {
      const outputPath = join(dir, `chunk${i}.wav`);
      const args = [
        "-y",
        "-i", inputPath,
        "-ss", String(times[i]),
        ...(i < times.length - 1 ? ["-to", String(times[i + 1])] : []),
        "-ar", "16000",
        "-ac", "1",
        "-sample_fmt", "s16",
        "-f", "wav",
        outputPath,
      ];

      await new Promise<void>((resolve, reject) => {
        execFile(ffmpeg, args, { timeout: 15000 }, (error, _stdout, stderr) => {
          if (error) reject(new Error(`ffmpeg split failed: ${stderr || error.message}`));
          else resolve();
        });
      });

      chunks.push(await readFile(outputPath));
      await unlink(outputPath).catch(() => {});
    }

    return chunks;
  } finally {
    await unlink(inputPath).catch(() => {});
  }
}
