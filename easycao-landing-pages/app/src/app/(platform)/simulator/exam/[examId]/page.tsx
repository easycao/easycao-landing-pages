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
  P2_T2: "Sistema ABC",
  P2_T3: "Affirm / Negative",
  P2_T4: "What did the controller say",
  P3_RS: "Reported Speech",
  P3_Q: "Pergunta",
  P3_CMP: "Comparação",
  P4_DESC: "Descrição da Foto",
  P4_PAST: "Passado",
  P4_FUTURE: "Futuro",
  P4_Q: "Question",
  P4_STMT: "Statement",
};

function getTaskLabel(task: TaskData, part: string): string {
  if (task.taskType && TASK_LABELS[task.taskType]) return TASK_LABELS[task.taskType];
  if (part === "P1") return "Pergunta";
  return "Tarefa";
}

// --- Question → TaskData mappers per part ---
// Field names match actual Firestore document structure

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
    const isImage = q.questionType === "Part2-Tipo2" || q.Question_Type === "Part2-Tipo2";
    const sharedGroup = `sit${sitIdx}_T3T4`;

    // T1 — Cotejamento: listen to cenário + track 1
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part2_Cenario_e_Track1 || "",
      repeatAudioUrl: q.Part2_RepeatTrack1 || "",
      taskType: "P2_T1",
      situationIndex: sitIdx,
      situationType: isImage ? "image" : "audio",
    });

    // T2 — Sistema ABC: show pane video, image side-by-side if Tipo2
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part2_Pane || "",
      imageUrl: isImage ? (q.Part2_Image || "") : undefined,
      taskType: "P2_T2",
      situationIndex: sitIdx,
      situationType: isImage ? "image" : "audio",
      imageSideBySide: isImage,
    });

    // T3 — Affirm / Negative: listen to track 2 (shared repeat with T4)
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part2_Track2 || "",
      taskType: "P2_T3",
      situationIndex: sitIdx,
      situationType: isImage ? "image" : "audio",
      sharedRepeatGroup: sharedGroup,
    });

    // T4 — What did the controller say: pergunta final, repeat = Track2 (shared with T3)
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part2_Pergunta_Final || "",
      repeatAudioUrl: q.Part2_Track2 || "",
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

  // Separate regular P3 questions from comparison doc
  const regularQs = questions.filter(
    (q) => (q.questionType || q.Question_Type) !== "Part3Comparison"
  );
  const comparisonDoc = questions.find(
    (q) => (q.questionType || q.Question_Type) === "Part3Comparison"
  );

  regularQs.forEach((q, sitIdx) => {
    // RS task — listen to the communication track
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part3_Track1 || "",
      taskType: "P3_RS",
      situationIndex: sitIdx,
      autoRepeat: true,
    });

    // Question task
    tasks.push({
      index: taskIndex++,
      questionId: q.id,
      videoUrl: q.Part3_Question || "",
      taskType: "P3_Q",
      situationIndex: sitIdx,
    });
  });

  // Comparison task (single doc in collection)
  if (comparisonDoc) {
    tasks.push({
      index: taskIndex,
      questionId: comparisonDoc.id,
      videoUrl: comparisonDoc.Part3Comparison || "",
      taskType: "P3_CMP",
      situationIndex: regularQs.length,
    });
  }

  return tasks;
}

function mapP4Tasks(questions: any[], mode?: string): TaskData[] {
  const q = questions[0];
  if (!q) return [];

  const sharedGroup = "p4_stmt_clarify";

  // All possible Part4 tasks in order (6 tasks total)
  const allTasks: TaskData[] = [
    // 0 — Descrição da Foto
    {
      index: 0,
      questionId: q.id,
      videoUrl: q.Part4Question1 || "",
      imageUrl: q.Part4Image || "",
      imageSideBySide: true,
      taskType: "P4_DESC",
      situationIndex: 0,
    },
    // 1 — Passado
    {
      index: 1,
      questionId: q.id,
      videoUrl: q.Part4Question2 || "",
      imageUrl: q.Part4Image || "",
      imageSideBySide: true,
      taskType: "P4_PAST",
      situationIndex: 0,
    },
    // 2 — Futuro
    {
      index: 2,
      questionId: q.id,
      videoUrl: q.Part4Question3 || "",
      imageUrl: q.Part4Image || "",
      imageSideBySide: true,
      taskType: "P4_FUTURE",
      situationIndex: 0,
    },
    // 3 — Question 4
    {
      index: 3,
      questionId: q.id,
      videoUrl: q.Part4Question4 || "",
      imageUrl: q.Part4Image || "",
      imageSideBySide: true,
      taskType: "P4_Q",
      situationIndex: 0,
    },
    // 4 — Question 5
    {
      index: 4,
      questionId: q.id,
      videoUrl: q.Part4Question5 || "",
      imageUrl: q.Part4Image || "",
      imageSideBySide: true,
      taskType: "P4_Q",
      situationIndex: 0,
    },
    // 5 — Statement (with clarify + shared repeat)
    {
      index: 5,
      questionId: q.id,
      videoUrl: q.Part4Statement || "",
      imageUrl: q.Part4Image || "",
      imageSideBySide: true,
      taskType: "P4_STMT",
      situationIndex: 0,
      clarifyVideoUrl: q.Part4Clarify || "",
      sharedRepeatGroup: sharedGroup,
    },
  ];

  // Filter by mode
  const modeFilter: Record<string, string[]> = {
    description: ["P4_DESC"],
    past: ["P4_PAST"],
    future: ["P4_FUTURE"],
    question: ["P4_Q"],
    statement: ["P4_STMT"],
  };

  let tasks: TaskData[];
  if (mode && modeFilter[mode]) {
    const filtered = allTasks.filter((t) => modeFilter[mode].includes(t.taskType!));
    // For "question" mode, randomly pick one of Q4/Q5
    if (mode === "question" && filtered.length > 1) {
      const pick = filtered[Math.floor(Math.random() * filtered.length)];
      tasks = [pick];
    } else {
      tasks = filtered;
    }
  } else {
    tasks = allTasks; // complete
  }

  // Re-index
  return tasks.map((t, i) => ({ ...t, index: i }));
}

function mapCompleteTasks(questions: any[]): TaskData[] {
  const tasks: TaskData[] = [];
  let idx = 0;

  // Split by questionType (set by the questions API)
  const p1Qs = questions.filter((q) => q.questionType === "Part1");
  const p2Qs = questions.filter(
    (q) => q.questionType === "Part2-Tipo1" || q.questionType === "Part2-Tipo2"
  );
  const p3Qs = questions.filter(
    (q) => q.questionType === "Part3" || q.questionType === "Part3Comparison"
  );
  const p4Qs = questions.filter((q) => q.questionType === "Part4");

  for (const t of mapP1Tasks(p1Qs)) {
    tasks.push({ ...t, index: idx++ });
  }
  for (const t of mapP2Tasks(p2Qs)) {
    tasks.push({ ...t, index: idx++ });
  }
  for (const t of mapP3Tasks(p3Qs)) {
    tasks.push({ ...t, index: idx++ });
  }
  for (const t of mapP4Tasks(p4Qs, "complete")) {
    tasks.push({ ...t, index: idx++ });
  }

  return tasks;
}

function mapQuestions(questions: any[], part: string, mode?: string): TaskData[] {
  switch (part) {
    case "P1": return mapP1Tasks(questions);
    case "P2": return mapP2Tasks(questions);
    case "P3": return mapP3Tasks(questions);
    case "P4": return mapP4Tasks(questions, mode);
    case "complete": return mapCompleteTasks(questions);
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

  const { state, init, videoEnded, repeatUsed, repeatAudioStart, repeatAudioEnd, startRecording, uploadComplete, advance } =
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

        // If exam is already completed, redirect
        if (data.status === "completed") {
          router.push("/simulator");
          return;
        }

        const tasks = mapQuestions(data.questions, data.part, data.mode);
        // Resume from last saved task index
        const resumeIndex = Math.min(data.currentTaskIndex || 0, tasks.length - 1);
        init(tasks, resumeIndex > 0 ? resumeIndex : undefined);
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
        router.push(`/simulator/exam/${examId}/feedback`);
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
    if (currentTask.autoRepeat) return false;
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

      {/* Side-by-side layout for P2 Type 2 T2 (image + video) */}
      {currentTask.imageSideBySide && currentTask.imageUrl && state.showImage ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className={`${cardClass} overflow-hidden`} style={cardBg}>
            <div className="p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentTask.imageUrl}
                alt="Situação"
                className="w-full rounded-xl object-contain"
              />
            </div>
          </div>
          <div className={`${cardClass} overflow-hidden`} style={cardBg}>
            <div className="p-1">
              {currentTask.videoUrl ? (
                <VideoPlayer
                  key={state.currentTaskIndex}
                  src={currentTask.videoUrl}
                  onEnded={() => videoEnded()}
                  showRepeat={isRepeatAvailable}
                  repeatCount={1}
                  onRepeatUsed={() => !currentTask.repeatAudioUrl && repeatUsed()}
                  repeatSrc={currentTask.repeatAudioUrl}
                  onRepeatStart={currentTask.repeatAudioUrl ? repeatAudioStart : undefined}
                  onRepeatEnd={currentTask.repeatAudioUrl ? repeatAudioEnd : undefined}
                  autoPlay
                  className="rounded-xl"
                />
              ) : (
                <div className={`aspect-video flex items-center justify-center ${textSecondary} text-sm`}>
                  Mídia indisponível
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
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

          {/* Video/Audio Card — shows clarify video when active, otherwise main video */}
          <div className={`${cardClass} overflow-hidden mb-6`} style={cardBg}>
            <div className="p-1">
              {showClarify && currentTask.clarifyVideoUrl ? (
                <VideoPlayer
                  key={`${state.currentTaskIndex}-clarify`}
                  src={currentTask.clarifyVideoUrl}
                  onEnded={() => videoEnded()}
                  showRepeat={isRepeatAvailable}
                  repeatCount={1}
                  onRepeatUsed={() => repeatUsed()}
                  autoPlay
                  className="rounded-xl"
                />
              ) : currentTask.videoUrl ? (
                <VideoPlayer
                  key={state.currentTaskIndex}
                  src={currentTask.videoUrl}
                  onEnded={() => videoEnded()}
                  showRepeat={isRepeatAvailable}
                  repeatCount={1}
                  onRepeatUsed={() => !currentTask.repeatAudioUrl && repeatUsed()}
                  repeatSrc={currentTask.repeatAudioUrl}
                  onRepeatStart={currentTask.repeatAudioUrl ? repeatAudioStart : undefined}
                  onRepeatEnd={currentTask.repeatAudioUrl ? repeatAudioEnd : undefined}
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
        </>
      )}

      {/* Clarify button for P4 Statement — replaces the main video */}
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

      {/* Status + Recorder */}
      <div className={`${cardClass} p-6`} style={cardBg}>
        {state.taskState === "watching" && (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className={`text-sm ${textSecondary}`}>
              {(currentTask.audioUrl && !currentTask.videoUrl) || (state.repeatUsed && currentTask.repeatAudioUrl)
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
              showPreview={false}
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
