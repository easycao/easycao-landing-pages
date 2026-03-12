// =============================================================================
// Shared Platform Types
// =============================================================================
// Centralized type definitions for the Easycao platform.
// Extracted from inline definitions + new Phase 2 types.
// =============================================================================

// -----------------------------------------------------------------------------
// Course Hierarchy
// -----------------------------------------------------------------------------

/** A course as seen by the student (platform-facing). */
export interface Course {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  lessonCount: number;
}

/** A course as seen in the CMS (admin-facing). */
export interface CourseData {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  status: string;
}

/** A module within a course. */
export interface Module {
  id: string;
  name: string;
  thumbnail: string;
  order: number;
  status: string;
  lessonCount: number;
}

/** Minimal module info (name + thumbnail only). */
export interface ModuleInfo {
  name: string;
  thumbnail: string;
}

/** A lesson within a module. */
export interface Lesson {
  id: string;
  title: string;
  order: number;
  status: string;
  kinescopeVideoId: string;
  duration: string;
  thumbnail: string;
}

/** Completion status for a lesson. */
export type LessonStatus = "not_started" | "in_progress" | "completed";

// -----------------------------------------------------------------------------
// Lesson Extensions (Phase 2)
// -----------------------------------------------------------------------------

/** The three parts a lesson can be divided into. */
export type LessonPart = "video" | "consolidation" | "exercises";

/** Configuration for the consolidation step of a lesson. */
export interface ConsolidationConfig {
  /** Key concepts the student should review. */
  concepts: string[];
  /** Language of the consolidation content. */
  language: "pt" | "en";
}

// -----------------------------------------------------------------------------
// Exercise Types
// -----------------------------------------------------------------------------

/** An exercise attached to a lesson or exercise bank. */
export interface Exercise {
  id: string;
  /** Type of exercise (e.g. "speaking", "listening", "writing"). */
  type: string;
  /** The prompt or question text shown to the student. */
  prompt: string;
  /** Reference answer used by the feedback pipeline. */
  referenceAnswer: string;
  /** Optional video URL for video-based exercises. */
  videoUrl?: string;
  /** Optional image URL for image-based exercises. */
  imageUrl?: string;
  /** Display order within the lesson/bank. */
  order: number;
}

/** Tracks a student's progress on a single exercise. */
export interface ExerciseProgress {
  completed: boolean;
  /** Firebase Storage URL of the student's recording. */
  recordingUrl?: string;
  /** Whether AI feedback has been generated. */
  feedbackGenerated: boolean;
  /** The generated feedback result. */
  feedback?: FeedbackResult;
  /** Number of attempts the student has made. */
  attempts: number;
  /** Timestamp of the last attempt. */
  lastAttemptAt?: Date;
}

// -----------------------------------------------------------------------------
// Playlist Types
// -----------------------------------------------------------------------------

/** A playlist from the Firestore `playlist_database` collection. */
export interface PlaylistDatabase {
  id: string;
  playlist_name: string;
  playlist_title: string;
  playlist_subtitle: string;
  playlist_image: string;
  /** Maximum number of optimized exercises. */
  max_otimizada: number;
  /** Exercises within this playlist. */
  exercicios: PlaylistExercise[];
}

/** A single exercise within a playlist. */
export interface PlaylistExercise {
  name: string;
  order: number;
  image: string;
  playlistImage: string;
  inputAudioUrl: string;
  inputAudioTitle: string;
  audioQuestion: string;
}

/** Student progress for a playlist. */
export interface PlaylistProgress {
  /** Recordings keyed by exercise order index. */
  recordings: Record<number, PlaylistRecording>;
  completedCount: number;
  lastListenedAt?: Date;
}

/** A single recording within playlist progress. */
export interface PlaylistRecording {
  /** Firebase Storage URL of the recording. */
  url: string;
  /** When the recording was made. */
  recordedAt: Date;
}

// -----------------------------------------------------------------------------
// Simulator Types (basic — expanded in Epic 8)
// -----------------------------------------------------------------------------

/** Summary of a simulation attempt's results. */
export interface SimulationSummary {
  avgPronunciation: number;
  avgFluency: number;
  structureErrors: number;
  vocabularyErrors: number;
  errorCategories: string[];
  comprehensionScore: number;
  comprehensionTotal: number;
}

// -----------------------------------------------------------------------------
// Feedback Types (shared pipeline)
// -----------------------------------------------------------------------------

/** Request payload sent to the feedback pipeline. */
export interface FeedbackRequest {
  /** Firebase Storage URL of the audio to analyze. */
  audioUrl: string;
  /** Reference text for comparison (optional). */
  referenceText?: string;
  /** Key points expected in the answer (optional). */
  keyPoints?: string[];
  /** Type of task being evaluated. */
  taskType: string;
}

/** Result returned by the feedback pipeline. */
export interface FeedbackResult {
  /** Transcription of the student's audio. */
  transcription: string;
  /** Pronunciation score (0-100). */
  pronunciation?: number;
  /** Fluency score (0-100). */
  fluency?: number;
  /** List of errors found in the response. */
  errors: FeedbackError[];
  /** Comprehension assessment (if applicable). */
  comprehension?: ComprehensionResult;
  /** Corrected version of the student's text. */
  correctedText: string;
}

/** A single error identified in the feedback pipeline. */
export interface FeedbackError {
  /** The original text that contains the error. */
  original: string;
  /** The suggested correction. */
  correction: string;
  /** Error category (e.g. "grammar", "vocabulary", "pronunciation"). */
  category: string;
  /** Human-readable explanation of the error. */
  explanation: string;
  /** Position in the transcription where the error occurs. */
  position: number;
}

/** Result of comprehension assessment. */
export interface ComprehensionResult {
  /** Key points and whether the student matched them. */
  keyPoints: { text: string; matched: boolean }[];
  /** Number of matched key points. */
  score: number;
  /** Total number of key points assessed. */
  total: number;
}

// -----------------------------------------------------------------------------
// Learning Profile
// -----------------------------------------------------------------------------

/** Aggregated learning profile for a student across all features. */
export interface LearningProfile {
  courses: Record<string, CourseProgress>;
  exercises: Record<string, ExerciseProgress>;
  simulator: SimulatorProfile;
}

/** Progress data for a single course. */
export interface CourseProgress {
  completedLessons: string[];
  lastLessonId?: string;
  lastAccessedAt?: Date;
  progressPercent: number;
}

/** Simulator-specific profile data. */
export interface SimulatorProfile {
  totalSimulations: number;
  lastSimulationAt?: Date;
  bestScore?: number;
  averageScore?: number;
}

// -----------------------------------------------------------------------------
// Dashboard Types
// -----------------------------------------------------------------------------

/** Dashboard progress data returned by the API. */
export interface DashboardData {
  courseProgress: Record<
    string,
    {
      completedLessons: string[];
      progressPercent: number;
    }
  >;
}
