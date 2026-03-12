"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { getClientStorage } from "@/lib/firebase-client";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export interface AudioRecorderProps {
  /** User ID for storage path. */
  uid: string;
  /** Storage subfolder (e.g., "simulator", "exercises"). */
  context: string;
  /** Called with the download URL after upload completes. */
  onRecordingComplete: (url: string) => void;
  /** Called when a recording is deleted / re-recorded. */
  onRecordingDelete?: () => void;
  /** Called when upload state changes (true = uploading, false = idle/done). */
  onUploadingChange?: (isUploading: boolean) => void;
  /** Block recording (e.g., video not watched yet). */
  disabled?: boolean;
  /** Max recording seconds (default: 120). */
  maxDuration?: number;
  className?: string;
}

type RecorderState = "idle" | "recording" | "processing" | "done";

export default function AudioRecorder({
  uid,
  context,
  onRecordingComplete,
  onRecordingDelete,
  onUploadingChange,
  disabled = false,
  maxDuration = 120,
  className = "",
}: AudioRecorderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [state, setState] = useState<RecorderState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isUploading = state === "processing";

  // Notify parent of upload state changes
  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const getMimeType = useCallback(() => {
    if (typeof MediaRecorder === "undefined") return null;
    if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus"))
      return "audio/webm;codecs=opus";
    if (MediaRecorder.isTypeSupported("audio/webm")) return "audio/webm";
    if (MediaRecorder.isTypeSupported("audio/mp4")) return "audio/mp4";
    return null;
  }, []);

  const getFileExtension = useCallback((mime: string) => {
    if (mime.includes("webm")) return "webm";
    if (mime.includes("mp4")) return "m4a";
    return "webm";
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);

    if (typeof MediaRecorder === "undefined") {
      setError(
        "Seu navegador não suporta gravação de áudio. Use Chrome, Firefox ou Edge."
      );
      return;
    }

    const mimeType = getMimeType();
    if (!mimeType) {
      setError("Nenhum formato de áudio suportado neste navegador.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;

        const blob = new Blob(chunksRef.current, { type: mimeType });
        uploadRecording(blob, mimeType);
      };

      recorder.start(1000); // collect data every second
      setState("recording");
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= maxDuration) {
            stopRecording();
            return prev + 1;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError(
          "Permissão do microfone negada. Habilite o microfone nas configurações do navegador e tente novamente."
        );
      } else {
        setError("Erro ao acessar o microfone. Tente novamente.");
      }
    }
  }, [getMimeType, maxDuration]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const uploadRecording = useCallback(
    async (blob: Blob, mimeType: string) => {
      setState("processing");
      setUploadProgress(0);

      const ext = getFileExtension(mimeType);
      const timestamp = Date.now();
      const path = `recordings/${uid}/${context}/${timestamp}.${ext}`;

      try {
        const storage = getClientStorage();
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(Math.round(progress));
          },
          (uploadError) => {
            console.error("Upload error:", uploadError);
            setError("Erro no upload. Tente novamente.");
            setState("idle");
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setAudioUrl(url);
            setStoragePath(path);
            setState("done");
            onRecordingComplete(url);
          }
        );
      } catch {
        setError("Erro no upload. Tente novamente.");
        setState("idle");
      }
    },
    [uid, context, getFileExtension, onRecordingComplete]
  );

  const handleReRecord = useCallback(async () => {
    // Delete previous recording from storage
    if (storagePath) {
      try {
        const storage = getClientStorage();
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
      } catch {
        // Ignore deletion errors — file may already be gone
      }
    }

    // Reset state
    setAudioUrl(null);
    setStoragePath(null);
    setElapsed(0);
    setUploadProgress(0);
    setState("idle");
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onRecordingDelete?.();
  }, [storagePath, onRecordingDelete]);

  const togglePlayback = useCallback(() => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioUrl, isPlaying]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Style helpers
  const cardBg = isDark
    ? "bg-white/[0.06] border-white/[0.09]"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";

  return (
    <div className={`rounded-2xl border p-5 ${cardBg} ${className}`}>
      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700 font-medium"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Idle state */}
      {state === "idle" && (
        <button
          onClick={startRecording}
          disabled={disabled}
          className={`flex items-center gap-3 w-full rounded-xl px-5 py-4 transition-all duration-200 ${
            disabled
              ? "opacity-40 cursor-not-allowed bg-black/[0.03]"
              : "hover:bg-primary/5 active:scale-[0.98]"
          } ${isDark ? "hover:bg-white/[0.04]" : ""}`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              disabled
                ? isDark
                  ? "bg-white/[0.06]"
                  : "bg-gray-100"
                : "bg-primary/10"
            }`}
          >
            <svg
              className={`w-6 h-6 ${disabled ? "text-gray-400" : "text-primary"}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </div>
          <span className={`text-sm font-medium ${textPrimary}`}>
            {disabled ? "Aguarde para gravar" : "Gravar áudio"}
          </span>
        </button>
      )}

      {/* Recording state */}
      {state === "recording" && (
        <div className="flex items-center gap-4">
          <button
            onClick={stopRecording}
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center flex-shrink-0 transition-colors active:scale-[0.95]"
          >
            <div className="w-4 h-4 rounded-sm bg-white" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className={`text-sm font-medium ${textPrimary}`}>
                Gravando...
              </span>
            </div>
            <span className={`text-xs ${textSecondary}`}>
              {formatTime(elapsed)} / {formatTime(maxDuration)}
            </span>
          </div>
          {/* Progress bar */}
          <div
            className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-black/[0.04]"}`}
          >
            <div
              className="h-full bg-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${(elapsed / maxDuration) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Processing/uploading state */}
      {state === "processing" && (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-primary animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <span className={`text-sm font-medium ${textPrimary}`}>
              Enviando... {uploadProgress}%
            </span>
            <div
              className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-black/[0.04]"}`}
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Done state — preview + re-record */}
      {state === "done" && (
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayback}
            className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            {isPlaying ? (
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-primary ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div className="flex-1">
            <span className={`text-sm font-medium ${textPrimary}`}>
              {isPlaying ? "Reproduzindo..." : "Gravação concluída"}
            </span>
            <span className={`block text-xs ${textSecondary}`}>
              {formatTime(elapsed)}
            </span>
          </div>
          <button
            onClick={handleReRecord}
            className="text-xs font-medium px-4 py-2 rounded-xl border border-primary/20 text-primary hover:bg-primary/5 transition-colors"
          >
            Regravar
          </button>
        </div>
      )}
    </div>
  );
}

