/**
 * Convert audio buffer (webm/mp3/etc.) to WAV 16kHz mono PCM
 * using system ffmpeg, required by Azure Speech API.
 * Also provides WAV splitting for long audio chunking.
 */

import { execFile } from "child_process";
import { writeFile, readFile, unlink, mkdtemp } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

/**
 * Convert an audio buffer to WAV 16kHz mono using ffmpeg.
 * @param inputBuffer - Raw audio bytes (webm, mp3, ogg, etc.)
 * @param inputExt - File extension hint (e.g. "webm", "mp3")
 * @returns WAV buffer suitable for Azure Speech API
 */
export async function convertToWav(
  inputBuffer: Buffer,
  inputExt: string = "webm"
): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), "audio-"));
  const inputPath = join(dir, `input.${inputExt}`);
  const outputPath = join(dir, "output.wav");

  try {
    await writeFile(inputPath, inputBuffer);

    await new Promise<void>((resolve, reject) => {
      execFile(
        "ffmpeg",
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
    // Cleanup temp files
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}

/**
 * Split a WAV buffer into chunks at specified timestamps using ffmpeg.
 * @param wavBuffer - WAV 16kHz mono buffer
 * @param breakpoints - Array of times (seconds) to split at
 * @returns Array of WAV buffers for each chunk
 */
export async function splitWav(
  wavBuffer: Buffer,
  breakpoints: number[]
): Promise<Buffer[]> {
  if (breakpoints.length === 0) return [wavBuffer];

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
        execFile("ffmpeg", args, { timeout: 15000 }, (error, _stdout, stderr) => {
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
