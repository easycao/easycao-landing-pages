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
}

export interface CompletedTask {
  index: number;
  questionId: string;
  recordingUrl: string;
  repeatUsed: boolean;
}

export interface ExamState {
  currentTaskIndex: number;
  taskState: TaskState;
  repeatUsed: boolean;
  tasks: TaskData[];
  completedTasks: CompletedTask[];
  finished: boolean;
}

type ExamAction =
  | { type: "INIT"; tasks: TaskData[] }
  | { type: "VIDEO_ENDED" }
  | { type: "REPEAT_USED" }
  | { type: "START_RECORDING" }
  | { type: "START_UPLOADING" }
  | { type: "UPLOAD_COMPLETE"; recordingUrl: string }
  | { type: "ADVANCE" };

// --- Reducer ---

const initialState: ExamState = {
  currentTaskIndex: 0,
  taskState: "watching",
  repeatUsed: false,
  tasks: [],
  completedTasks: [],
  finished: false,
};

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case "INIT":
      return {
        ...initialState,
        tasks: action.tasks,
      };

    case "VIDEO_ENDED":
      return {
        ...state,
        taskState: "ready_to_record",
      };

    case "REPEAT_USED":
      return {
        ...state,
        repeatUsed: true,
        taskState: "watching",
      };

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
      return {
        ...state,
        currentTaskIndex: nextIndex,
        taskState: "watching",
        repeatUsed: false,
      };
    }

    default:
      return state;
  }
}

// --- Hook ---

export function useExamReducer() {
  const [state, dispatch] = useReducer(examReducer, initialState);

  const init = useCallback((tasks: TaskData[]) => {
    dispatch({ type: "INIT", tasks });
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

  return {
    state,
    init,
    videoEnded,
    repeatUsed,
    startRecording,
    startUploading,
    uploadComplete,
    advance,
  };
}
