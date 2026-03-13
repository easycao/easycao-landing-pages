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

/* eslint-disable @typescript-eslint/no-explicit-any */

// --- Task label helpers ---

const TASK_LABELS: Record<string, string> = {
  P1: "Pergunta",
  P2_T1: "Cotejamento",
  P2_T2: "ABC",
  P2_T3: "Afirmação/Negação",
  P2_T4: "Reported Speech",
  P3_RS: "Reported Speech",
  P3_Q: "Pergunta",
  P3_CMP: "Comparação",
  P4: "Tarefa",
};

function getTaskLabel(task: TaskData, part: string): string {
  if (task.taskType && TASK_LABELS[task.taskType]) return TASK_LABELS[task.taskType];
  if (part === "P1") return "Pergunta";
  return "Tarefa";
}

// --- Question → TaskData mappers per part ---

function mapP1Tasks(questions: any[]): TaskData[] {
  return questions.map((q, i) => ({
    index: i,
    questionId: q.id,
    videoUrl: q.Part1_Pergunta || "",
    taskType: "P1",
  }));
}

function mapP2Tasks(questions: any[]): TaskData[] {
  const tasks: TaskData[] = [];
  let taskIndex = 0;
  questions.forEach((q, sitIdx) => {
    const isImage = q.Part2_Tipo === "Imagem";
    const sharedGroup = `sit${sitIdx}_T3T4`;

    // T1 — Cotejamento
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part2_Video_T1 || q.Part2_Audio_Track1 || "",
      audioUrl: q.Part2_Audio_Track1 || "",
      repeatAudioUrl: q.Part2_RepeatTrack1 || "",
      taskType: "P2_T1",
      situationIndex: sitIdx,
      situationType: isImage ? "image" : "audio",
    });

    // T2 — ABC
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part2_Video_T2 || q.Part2_Audio_Track2 || "",
      imageUrl: isImage ? (q.Part2_Image || "") : undefined,
      taskType: "P2_T2",
      situationIndex: sitIdx,
      situationType: isImage ? "image" : "audio",
      hideImageOnRepeat: true,
    });

    // T3 — Affirm/Negative
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part2_Video_T3 || q.Part2_Audio_Track1 || "",
      audioUrl: q.Part2_Audio_Track1 || "",
      taskType: "P2_T3",
      situationIndex: sitIdx,
      situationType: isImage ? "image" : "audio",
      sharedRepeatGroup: sharedGroup,
    });

    // T4 — Reported Speech
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part2_Video_T4 || "",
      taskType: "P2_T4",
      situationIndex: sitIdx,
      situationType: isImage ? "image" : "audio",
      sharedRepeatGroup: sharedGroup,
    });
  });
  return tasks;
}

function mapP3Tasks(questions: any[]): TaskData[] {
  const tasks: TaskData[] = [];
  let taskIndex = 0;
  questions.forEach((q, sitIdx) => {
    // RS task (auto-repeat built into video)
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part3_RS || "",
      taskType: "P3_RS",
      situationIndex: sitIdx,
      autoRepeat: true,
    });

    // Question task
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part3_Pergunta || "",
      taskType: "P3_Q",
      situationIndex: sitIdx,
    });
  });

  // Comparison task (uses last question's data as reference)
  if (questions.length > 0) {
    const lastQ = questions[questions.length - 1];
    tasks.push({
      index: taskIndex,
      questionId: lastQ.id,
      videoUrl: lastQ.Part3_Comparacao || lastQ.Part3_Pergunta || "",
      taskType: "P3_CMP",
      situationIndex: questions.length,
    });
  }
  return tasks;
}

function mapP4Tasks(questions: any[]): TaskData[] {
  const q = questions[0];
  if (!q) return [];
  const taskLabels = ["T1", "T2", "T3", "T4", "T5", "T6"];
  return taskLabels.map((label, i) => ({
    index: i,
    questionId: q.id,
    videoUrl: q[`Part4_Video_${label}`] || q.Part4_Video || "",
    imageUrl: q.Part4_Image || "",
    taskType: "P4",
    situationIndex: 0,
    clarifyVideoUrl: label === "T6" ? (q.Part4Clarify || "") : undefined,
  }));
}

function mapCompleteTasks(questions: any[], part: string): TaskData[] {
  // For complete test, questions come pre-sorted by part segments
  // Part field in exam tells us this is complete, but questions already
  // have their fields. We detect by available fields.
  // Complete exam: first 3 = P1, next 5 = P2, next 3+1 = P3, last 1 = P4
  // But question indexes have offsets, so we detect by fields present
  if (part !== "complete") return [];

  const tasks: TaskData[] = [];
  let idx = 0;

  // P1 questions (first 3) — have Part1_Pergunta
  const p1Qs = questions.filter((q) => q.Part1_Pergunta);
  const p2Qs = questions.filter((q) => q.Part2_Audio_Track1 || q.Part2_Tipo);
  const p3Qs = questions.filter((q) => q.Part3_RS || q.Part3_Pergunta);
  const p4Qs = questions.filter((q) => q.Part4_Image || q.Part4_Video);

  for (const t of mapP1Tasks(p1Qs)) {
    tasks.push({ ...t, index: idx++ });
  }
  for (const t of mapP2Tasks(p2Qs)) {
    tasks.push({ ...t, index: idx++ });
  }
  for (const t of mapP3Tasks(p3Qs)) {
    tasks.push({ ...t, index: idx++ });
  }
  for (const t of mapP4Tasks(p4Qs)) {
    tasks.push({ ...t, index: idx++ });
  }

  return tasks;
}

function mapQuestions(questions: any[], part: string): TaskData[] {
  switch (part) {
    case "P1": return mapP1Tasks(questions);
    case "P2": return mapP2Tasks(questions);
    case "P3": return mapP3Tasks(questions);
    case "P4": return mapP4Tasks(questions);
    case "complete": return mapCompleteTasks(questions, part);
    default: return mapP1Tasks(questions);
  }
}

// --- Main Component ---

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
  const [showClarify, setShowClarify] = useState(false);
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
        const tasks = mapQuestions(data.questions, data.part);
        init(tasks);
      } catch {
        setError("Erro ao carregar o exame. Tente novamente.");
      } finally {
        setLoading(false);
      }
    })();
  }, [examId, init]);

  // Auto-advance after upload
  useEffect(() => {
    if (state.taskState === "uploaded" && !state.finished) {
      advanceTimerRef.current = setTimeout(() => advance(), 1500);
      return () => {
        if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      };
    }
  }, [state.taskState, state.finished, advance]);

  // Save history when finished
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
            taskType: currentTask.taskType,
            situationIndex: currentTask.situationIndex,
          }),
        });
      } catch {
        // Continue even if save fails
      }
      uploadComplete(recordingUrl);
    },
    [user, examId, state.tasks, state.currentTaskIndex, state.repeatUsed, uploadComplete]
  );

  // --- UI helpers ---

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
        <p className="text-sm text-red-500">{error}</p>
        <button onClick={() => router.push("/simulator")} className="text-sm text-primary hover:underline">
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

  const progress = (state.currentTaskIndex / state.tasks.length) * 100;
  const taskLabel = getTaskLabel(currentTask, examPart);

  // Determine repeat availability
  const isRepeatAvailable = (() => {
    if (state.repeatUsed) return false;
    if (currentTask.autoRepeat) return false; // auto-repeat has no button
    if (currentTask.sharedRepeatGroup) {
      return !state.sharedRepeatUsed[currentTask.sharedRepeatGroup];
    }
    return true;
  })();

  // Situation header
  const showSituationHeader =
    currentTask.situationIndex !== undefined &&
    (state.currentTaskIndex === 0 ||
      state.tasks[state.currentTaskIndex - 1]?.situationIndex !== currentTask.situationIndex);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/simulator")}
          className={`text-xs font-medium ${textSecondary} hover:opacity-70 transition-colors`}
        >
          &larr; Voltar
        </button>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${textSecondary}`}>
            Tarefa {state.currentTaskIndex + 1} de {state.tasks.length}
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

      {/* Situation header */}
      {showSituationHeader && currentTask.situationIndex !== undefined && (
        <div className={`mb-4 flex items-center gap-2`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-white/40" : "text-black/30"}`}>
            Situação {currentTask.situationIndex + 1}
          </span>
          {currentTask.situationType && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              currentTask.situationType === "image"
                ? "bg-amber-500/20 text-amber-500"
                : "bg-blue-500/20 text-blue-500"
            } font-medium`}>
              {currentTask.situationType === "image" ? "Imagem" : "Áudio"}
            </span>
          )}
        </div>
      )}

      {/* Task type badge */}
      <div className={`mb-4 text-xs font-semibold ${isDark ? "text-primary/80" : "text-primary"}`}>
        {taskLabel}
      </div>

      {/* Image display (P2 image type, P4) */}
      {currentTask.imageUrl && state.showImage && (
        <div className={`${cardClass} overflow-hidden mb-4`} style={cardBg}>
          <div className="p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentTask.imageUrl}
              alt="Situação"
              className="w-full rounded-xl object-contain max-h-[300px]"
            />
          </div>
        </div>
      )}

      {/* Video/Audio Card */}
      <div className={`${cardClass} overflow-hidden mb-6`} style={cardBg}>
        <div className="p-1">
          {currentTask.videoUrl ? (
            <VideoPlayer
              src={currentTask.videoUrl}
              onEnded={() => videoEnded()}
              showRepeat={isRepeatAvailable}
              repeatCount={1}
              onRepeatUsed={() => repeatUsed()}
              autoPlay
              className="rounded-xl"
            />
          ) : currentTask.audioUrl ? (
            <div className="p-4">
              <audio
                src={currentTask.audioUrl}
                autoPlay
                onEnded={() => videoEnded()}
                controls
                className="w-full"
              />
            </div>
          ) : (
            <div className={`aspect-video flex items-center justify-center ${textSecondary} text-sm`}>
              Mídia indisponível para esta tarefa
            </div>
          )}
        </div>
      </div>

      {/* Clarify button for P4 T6 */}
      {currentTask.clarifyVideoUrl && !showClarify && state.taskState !== "watching" && (
        <button
          onClick={() => setShowClarify(true)}
          className={`mb-4 w-full py-3 rounded-xl text-sm font-medium border transition-all ${
            isDark
              ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              : "border-amber-500/30 text-amber-600 hover:bg-amber-50"
          }`}
        >
          Clarify Statement
        </button>
      )}
      {showClarify && currentTask.clarifyVideoUrl && (
        <div className={`${cardClass} overflow-hidden mb-4`} style={cardBg}>
          <div className="p-1">
            <VideoPlayer
              src={currentTask.clarifyVideoUrl}
              onEnded={() => setShowClarify(false)}
              autoPlay
              className="rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Status + Recorder */}
      <div className={`${cardClass} p-6`} style={cardBg}>
        {state.taskState === "watching" && (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className={`text-sm ${textSecondary}`}>
              {currentTask.audioUrl && !currentTask.videoUrl
                ? "Ouça o áudio..."
                : "Assista ao vídeo..."}
            </p>
          </div>
        )}

        {(state.taskState === "ready_to_record" || state.taskState === "recording") && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                state.taskState === "recording" ? "bg-red-500 animate-pulse" : "bg-emerald-500"
              }`} />
              <p className={`text-sm font-medium ${textPrimary}`}>
                {state.taskState === "recording" ? "Gravando..." : "Pronto para gravar sua resposta"}
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

        {state.taskState === "uploading" && (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className={`text-sm ${textSecondary}`}>Enviando gravação...</p>
          </div>
        )}

        {state.taskState === "uploaded" && (
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <p className="text-sm font-medium text-emerald-500">
              Resposta enviada! Avançando...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
