"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  useExamReducer,
  type TaskData,
} from "@/hooks/useExamReducer";
import VideoPlayer from "@/components/platform/VideoPlayer";
import AudioRecorder from "@/components/platform/AudioRecorder";

interface QuestionData {
  id: string;
  Part1_Pergunta?: string;
  [key: string]: unknown;
}

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { state, init, videoEnded, repeatUsed, startRecording, uploadComplete, advance } =
    useExamReducer();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examPart, setExamPart] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch exam questions on mount
  useEffect(() => {
    if (!examId) return;
    (async () => {
      try {
        const res = await fetch(`/api/simulator/questions?examId=${examId}`);
        if (!res.ok) throw new Error("Falha ao carregar exame");
        const data = await res.json();
        setExamPart(data.part);

        const tasks: TaskData[] = (data.questions as QuestionData[]).map(
          (q: QuestionData, i: number) => ({
            index: i,
            questionId: q.id,
            videoUrl: q.Part1_Pergunta || "",
          })
        );
        init(tasks);
      } catch {
        setError("Erro ao carregar o exame. Tente novamente.");
      } finally {
        setLoading(false);
      }
    })();
  }, [examId, init]);

  // Auto-advance after upload complete
  useEffect(() => {
    if (state.taskState === "uploaded" && !state.finished) {
      advanceTimerRef.current = setTimeout(() => {
        advance();
      }, 1500);
      return () => {
        if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      };
    }
  }, [state.taskState, state.finished, advance]);

  // Save Part1History when finished
  useEffect(() => {
    if (!state.finished || !user || !examId) return;
    (async () => {
      setSaving(true);
      try {
        await fetch(`/api/simulator/exam/${examId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            part: examPart,
            completedTasks: state.completedTasks,
          }),
        });
        router.push(`/simulator`);
      } catch {
        setError("Erro ao salvar resultado. Tente novamente.");
        setSaving(false);
      }
    })();
  }, [state.finished, state.completedTasks, user, examId, examPart, router]);

  const handleRecordingComplete = useCallback(
    async (recordingUrl: string) => {
      if (!user || !examId) return;
      const currentTask = state.tasks[state.currentTaskIndex];

      // Save individual task recording
      try {
        await fetch(`/api/simulator/exam/${examId}/task`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            taskIndex: state.currentTaskIndex,
            questionId: currentTask.questionId,
            recordingUrl,
            repeatUsed: state.repeatUsed,
          }),
        });
      } catch {
        // Continue even if save fails — url is already in state
      }

      uploadComplete(recordingUrl);
    },
    [user, examId, state.tasks, state.currentTaskIndex, state.repeatUsed, uploadComplete]
  );

  const handleVideoEnded = useCallback(() => {
    videoEnded();
  }, [videoEnded]);

  const handleRepeatUsed = useCallback(() => {
    repeatUsed();
  }, [repeatUsed]);

  const handleRecordStart = useCallback(() => {
    startRecording();
  }, [startRecording]);

  // --- UI ---

  const textPrimary = isDark ? "text-[#F0F0F5]" : "text-black";
  const textSecondary = isDark ? "text-[#9090A0]" : "text-black/50";
  const cardClass = isDark
    ? "rounded-2xl border border-white/[0.09] backdrop-blur-[20px]"
    : "rounded-2xl bg-white border border-gray-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.06)]";
  const cardBg = isDark
    ? { background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" }
    : undefined;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className={`text-sm ${textSecondary}`}>Carregando exame...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className={`text-sm text-red-500`}>{error}</p>
        <button
          onClick={() => router.push("/simulator")}
          className="text-sm text-primary hover:underline"
        >
          Voltar ao Simulador
        </button>
      </div>
    );
  }

  if (state.finished || saving) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className={`text-sm font-medium ${textPrimary}`}>
          {saving ? "Salvando resultado..." : "Exame concluído!"}
        </p>
      </div>
    );
  }

  const currentTask = state.tasks[state.currentTaskIndex];
  if (!currentTask) return null;

  const progress = ((state.currentTaskIndex) / state.tasks.length) * 100;
  const showRecorder = state.taskState === "ready_to_record" || state.taskState === "recording" || state.taskState === "uploading" || state.taskState === "uploaded";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/simulator")}
          className={`text-xs font-medium ${textSecondary} hover:${isDark ? "text-white" : "text-black"} transition-colors`}
        >
          &larr; Voltar
        </button>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${textSecondary}`}>
            Pergunta {state.currentTaskIndex + 1} de {state.tasks.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`w-full h-1.5 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"} mb-8`}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Video Card */}
      <div className={`${cardClass} overflow-hidden mb-6`} style={cardBg}>
        <div className="p-1">
          {currentTask.videoUrl ? (
            <VideoPlayer
              src={currentTask.videoUrl}
              onEnded={handleVideoEnded}
              showRepeat={!state.repeatUsed}
              repeatCount={1}
              onRepeatUsed={handleRepeatUsed}
              autoPlay
              className="rounded-xl"
            />
          ) : (
            <div className={`aspect-video flex items-center justify-center ${textSecondary} text-sm`}>
              Video indisponível para esta pergunta
            </div>
          )}
        </div>
      </div>

      {/* Status + Recorder */}
      <div className={`${cardClass} p-6`} style={cardBg}>
        {state.taskState === "watching" && (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className={`text-sm ${textSecondary}`}>
              Assista ao vídeo do examinador...
            </p>
          </div>
        )}

        {state.taskState === "ready_to_record" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className={`text-sm font-medium ${textPrimary}`}>
                Pronto para gravar sua resposta
              </p>
            </div>
            <AudioRecorder
              uid={user?.uid || ""}
              context={`exam/${examId}/task/${state.currentTaskIndex}`}
              onRecordingComplete={handleRecordingComplete}
              onUploadingChange={setIsUploading}
              disabled={isUploading}
            />
          </div>
        )}

        {state.taskState === "recording" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className={`text-sm font-medium ${textPrimary}`}>
                Gravando...
              </p>
            </div>
            <AudioRecorder
              uid={user?.uid || ""}
              context={`exam/${examId}/task/${state.currentTaskIndex}`}
              onRecordingComplete={handleRecordingComplete}
              onUploadingChange={setIsUploading}
              disabled={false}
            />
          </div>
        )}

        {state.taskState === "uploading" && (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className={`text-sm ${textSecondary}`}>
              Enviando gravação...
            </p>
          </div>
        )}

        {state.taskState === "uploaded" && (
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <p className={`text-sm font-medium text-emerald-500`}>
              Resposta enviada! Avançando...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
