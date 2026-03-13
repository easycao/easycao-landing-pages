"use client";

import { useReducer, useCallback } from "react";

// --- Types ---

export type TaskState =
  | "watching"
  | "ready_to_record"
  | "recording"
  | "uploading"
  | "uploaded";

export interface TaskData {
  index: number;
  questionId: string;
  videoUrl: string;
  // Part 2/3/4 extensions
  audioUrl?: string;
  imageUrl?: string;
  repeatAudioUrl?: string;
  taskType?: string;
  situationIndex?: number;
  situationType?: "audio" | "image";
  clarifyVideoUrl?: string;
  hideImageOnRepeat?: boolean;
  sharedRepeatGroup?: string;
  autoRepeat?: boolean;
}

export interface CompletedTask {
  index: number;
  questionId: string;
  recordingUrl: string;
  repeatUsed: boolean;
  taskType?: string;
  situationIndex?: number;
}

export interface ExamState {
  currentTaskIndex: number;
  taskState: TaskState;
  repeatUsed: boolean;
  tasks: TaskData[];
  completedTasks: CompletedTask[];
  finished: boolean;
  sharedRepeatUsed: Record<string, boolean>;
  showImage: boolean;
}

type ExamAction =
  | { type: "INIT"; tasks: TaskData[]; startIndex?: number }
  | { type: "VIDEO_ENDED" }
  | { type: "REPEAT_USED" }
  | { type: "START_RECORDING" }
  | { type: "START_UPLOADING" }
  | { type: "UPLOAD_COMPLETE"; recordingUrl: string }
  | { type: "ADVANCE" }
  | { type: "HIDE_IMAGE" };

// --- Reducer ---

const initialState: ExamState = {
  currentTaskIndex: 0,
  taskState: "watching",
  repeatUsed: false,
  tasks: [],
  completedTasks: [],
  finished: false,
  sharedRepeatUsed: {},
  showImage: true,
};

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case "INIT":
      return {
        ...initialState,
        tasks: action.tasks,
        currentTaskIndex: action.startIndex || 0,
      };

    case "VIDEO_ENDED":
      return {
        ...state,
        taskState: "ready_to_record",
      };

    case "REPEAT_USED": {
      const task = state.tasks[state.currentTaskIndex];
      const newSharedRepeat = { ...state.sharedRepeatUsed };
      if (task?.sharedRepeatGroup) {
        newSharedRepeat[task.sharedRepeatGroup] = true;
      }
      return {
        ...state,
        repeatUsed: true,
        taskState: "watching",
        sharedRepeatUsed: newSharedRepeat,
        showImage: task?.hideImageOnRepeat ? false : state.showImage,
      };
    }

    case "HIDE_IMAGE":
      return { ...state, showImage: false };

    case "START_RECORDING":
      return {
        ...state,
        taskState: "recording",
      };

    case "START_UPLOADING":
      return {
        ...state,
        taskState: "uploading",
      };

    case "UPLOAD_COMPLETE": {
      const currentTask = state.tasks[state.currentTaskIndex];
      const completed: CompletedTask = {
        index: currentTask.index,
        questionId: currentTask.questionId,
        recordingUrl: action.recordingUrl,
        repeatUsed: state.repeatUsed,
        taskType: currentTask.taskType,
        situationIndex: currentTask.situationIndex,
      };
      return {
        ...state,
        taskState: "uploaded",
        completedTasks: [...state.completedTasks, completed],
      };
    }

    case "ADVANCE": {
      const nextIndex = state.currentTaskIndex + 1;
      if (nextIndex >= state.tasks.length) {
        return { ...state, finished: true };
      }
      const nextTask = state.tasks[nextIndex];
      const currentTask = state.tasks[state.currentTaskIndex];
      const newSituation = nextTask.situationIndex !== currentTask?.situationIndex;
      return {
        ...state,
        currentTaskIndex: nextIndex,
        taskState: "watching",
        repeatUsed: false,
        showImage: true,
        sharedRepeatUsed: newSituation ? {} : state.sharedRepeatUsed,
      };
    }

    default:
      return state;
  }
}

// --- Hook ---

export function useExamReducer() {
  const [state, dispatch] = useReducer(examReducer, initialState);

  const init = useCallback((tasks: TaskData[], startIndex?: number) => {
    dispatch({ type: "INIT", tasks, startIndex });
  }, []);

  const videoEnded = useCallback(() => {
    dispatch({ type: "VIDEO_ENDED" });
  }, []);

  const repeatUsed = useCallback(() => {
    dispatch({ type: "REPEAT_USED" });
  }, []);

  const startRecording = useCallback(() => {
    dispatch({ type: "START_RECORDING" });
  }, []);

  const startUploading = useCallback(() => {
    dispatch({ type: "START_UPLOADING" });
  }, []);

  const uploadComplete = useCallback((recordingUrl: string) => {
    dispatch({ type: "UPLOAD_COMPLETE", recordingUrl });
  }, []);

  const advance = useCallback(() => {
    dispatch({ type: "ADVANCE" });
  }, []);

  const hideImage = useCallback(() => {
    dispatch({ type: "HIDE_IMAGE" });
  }, []);

  return {
    state,
    init,
    videoEnded,
    repeatUsed,
    startRecording,
    startUploading,
    uploadComplete,
    advance,
    hideImage,
  };
}
