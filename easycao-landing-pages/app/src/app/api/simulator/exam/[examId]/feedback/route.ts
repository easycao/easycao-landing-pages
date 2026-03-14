import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { transcribeAudio, type WhisperWord } from "@/lib/platform/whisper";
import { assessPronunciationChunked } from "@/lib/platform/azure-speech";
import { convertToWav } from "@/lib/platform/audio-convert";
import {
  analyzeGrammarVocabulary,
  evaluateComprehension,
} from "@/lib/platform/llm-feedback";
import { generateReferenceAudio } from "@/lib/platform/polly";
import { getGlossaryTerms } from "@/lib/platform/glossary";

/**
 * POST /api/simulator/exam/[examId]/feedback
 * Process all task recordings in parallel, streaming results via SSE.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;

  // Auth
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = await verifySession(sessionCookie);
  if (!user) {
    return new Response("Invalid session", { status: 401 });
  }

  const db = getFirestoreDb();

  // Verify exam
  const examDoc = await db.collection("exams").doc(examId).get();
  if (!examDoc.exists) {
    return new Response("Exam not found", { status: 404 });
  }
  const exam = examDoc.data()!;
  if (exam.uid !== user.uid) {
    console.error(`[feedback] UID mismatch: exam.uid=${exam.uid}, session.uid=${user.uid}`);
    return new Response("Unauthorized", { status: 403 });
  }

  // Get all task recordings
  const tasksSnap = await db
    .collection("exams")
    .doc(examId)
    .collection("tasks")
    .orderBy("taskIndex")
    .get();

  const tasks = tasksSnap.docs.map((doc) => doc.data());

  // SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(data: Record<string, unknown>) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      }

      // Send total task count immediately so the client knows upfront
      sendEvent({ status: "init", totalTasks: tasks.length });

      // Process tasks in batches with concurrency limit
      const CONCURRENCY = 3;
      const queue = [...tasks];

      async function processTask(task: Record<string, unknown>) {
        const taskIndex = task.taskIndex as number;
        const recordingUrl = task.recordingUrl as string;
        const MAX_RETRIES = 3;

        sendEvent({ taskIndex, status: "processing", phase: "downloading" });

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            // Download audio
            const audioResponse = await fetch(recordingUrl);
            if (!audioResponse.ok) throw new Error(`Download failed: ${audioResponse.status}`);
            const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
            const filename = "audio.webm";

            // Step 1: Transcribe with Whisper (word-level timestamps)
            sendEvent({ taskIndex, status: "processing", phase: "transcribing" });
            let transcription = "";
            let whisperWords: WhisperWord[] = [];
            try {
              const whisperResult = await transcribeAudio(audioBuffer, filename);
              transcription = whisperResult.text;
              whisperWords = whisperResult.words;
            } catch (err) {
              console.error(`[feedback] Whisper failed for task ${taskIndex}:`, err);
            }

            // Step 2: Pronunciation assessment (try WAV conversion, fall back to webm)
            sendEvent({ taskIndex, status: "processing", phase: "pronunciation" });
            let azure: Awaited<ReturnType<typeof assessPronunciationChunked>> | null = null;
            if (transcription) {
              try {
                const wavBuffer = await convertToWav(audioBuffer, "webm");
                if (wavBuffer) {
                  azure = await assessPronunciationChunked(wavBuffer, transcription, whisperWords, true);
                } else {
                  console.warn(`[feedback] ffmpeg not available, sending webm to Azure`);
                  azure = await assessPronunciationChunked(audioBuffer, transcription, whisperWords, false);
                }
              } catch (err) {
                console.error(`[feedback] Azure Speech failed for task ${taskIndex}:`, err);
              }
            }

            // Step 3: Grammar + vocabulary analysis
            sendEvent({ taskIndex, status: "processing", phase: "grammar" });
            let grammar: Awaited<ReturnType<typeof analyzeGrammarVocabulary>> = {
              errors: [],
              correctedText: transcription,
              aiFeedback: "",
              level4Version: "",
              level5Version: "",
            };
            if (transcription) {
              try {
                grammar = await analyzeGrammarVocabulary(transcription);
              } catch (err) {
                console.error(`[feedback] Grammar failed for task ${taskIndex}:`, err);
              }
            }

            // Step 4: Fetch glossary entries for assessed words
            let glossary: Record<string, unknown> = {};
            if (azure && azure.words.length > 0) {
              try {
                const wordsList = azure.words.map((w) => w.word);
                const glossaryMap = await getGlossaryTerms(wordsList);
                glossary = Object.fromEntries(glossaryMap);
              } catch (err) {
                console.error(`[feedback] Glossary failed for task ${taskIndex}:`, err);
              }
            }

            // Step 5: Generate Polly reference audio if pronunciation < 70%
            let pollyReferenceUrl: string | null = null;
            if (azure && azure.pronunciation < 70 && grammar.correctedText) {
              try {
                pollyReferenceUrl = await generateReferenceAudio(grammar.correctedText);
              } catch (err) {
                console.error(`[feedback] Polly failed for task ${taskIndex}:`, err);
              }
            }

            // Step 6: Comprehension evaluation (P2_T1, P2_T4, P3_RS only)
            let comprehension: { score: number; total: number; points: { keyPoint: string; matched: boolean }[] } | null = null;
            const taskType = task.taskType as string | null;
            const comprehensionTypes = ["P2_T1", "P2_T4", "P3_RS"];
            if (transcription && taskType && comprehensionTypes.includes(taskType)) {
              try {
                sendEvent({ taskIndex, status: "processing", phase: "comprehension" });
                // Fetch question doc to get key points
                const questionId = task.questionId as string;
                const questionDoc = await db.collection("ICAO_Test_Questions").doc(questionId).get();
                if (questionDoc.exists) {
                  const qData = questionDoc.data()!;
                  // Extract key points based on task type
                  const prefix = taskType === "P2_T4" ? "T2" : "T1";
                  const totalField = `${prefix}_Total_Pontos_Chaves`;
                  const total = Number(qData[totalField]) || 0;
                  const keyPoints: string[] = [];
                  for (let i = 1; i <= total; i++) {
                    const val = qData[`${prefix}_Ponto_Chave_${i}`];
                    if (val && typeof val === "string") keyPoints.push(val);
                  }
                  if (keyPoints.length > 0) {
                    const result = await evaluateComprehension(transcription, keyPoints);
                    comprehension = {
                      score: result.score,
                      total: result.total,
                      points: result.keyPoints.map((kp) => ({
                        keyPoint: kp.text,
                        matched: kp.matched,
                      })),
                    };
                  }
                }
              } catch (err) {
                console.error(`[feedback] Comprehension failed for task ${taskIndex}:`, err);
              }
            }

            const feedback = {
              transcription,
              recordingUrl,
              pronunciation: azure?.pronunciation ?? null,
              fluency: azure?.fluency ?? null,
              wordScores: azure?.words ?? [],
              whisperWords,
              // Map `original` → `word` for frontend compatibility
              errors: grammar.errors.map((e) => {
                const extra = e as unknown as Record<string, unknown>;
                return {
                  word: e.original || "",
                  category: e.category || "",
                  subCategory: (extra.subCategory as string) || "",
                  confidence: (extra.confidence as string) || "high",
                  correction: e.correction || "",
                  explanation: e.explanation || "",
                };
              }),
              correctedText: grammar.correctedText,
              aiFeedback: grammar.aiFeedback || "",
              level4Version: grammar.level4Version || "",
              level5Version: grammar.level5Version || "",
              ...(comprehension && { comprehension }),
              ...(pollyReferenceUrl && { pollyReferenceUrl }),
              ...(Object.keys(glossary).length > 0 && { glossary }),
            };

            // Save feedback to Firestore
            await db
              .collection("exams")
              .doc(examId)
              .collection("feedback")
              .doc(String(taskIndex))
              .set({
                ...feedback,
                taskIndex,
                taskType: task.taskType || null,
                situationIndex: task.situationIndex ?? null,
                processedAt: new Date(),
              });

            sendEvent({
              taskIndex,
              status: "complete",
              feedback,
            });
            return;
          } catch (err) {
            if (attempt === MAX_RETRIES) {
              const errorMsg = err instanceof Error ? err.message : "Unknown error";
              sendEvent({ taskIndex, status: "error", error: errorMsg });
            }
          }
        }
      }

      // Process in batches for concurrency control
      for (let i = 0; i < queue.length; i += CONCURRENCY) {
        const batch = queue.slice(i, i + CONCURRENCY);
        await Promise.allSettled(batch.map((task) => processTask(task)));
      }

      sendEvent({ status: "done", total: tasks.length });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/**
 * GET /api/simulator/exam/[examId]/feedback?taskIndex=N
 * Fetch individual task feedback from Firestore.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params;
  const { searchParams } = new URL(req.url);
  const taskIndex = searchParams.get("taskIndex");

  const db = getFirestoreDb();

  if (taskIndex !== null) {
    // Single task feedback
    const feedbackDoc = await db
      .collection("exams")
      .doc(examId)
      .collection("feedback")
      .doc(taskIndex)
      .get();

    if (!feedbackDoc.exists) {
      return new Response(JSON.stringify({ error: "Feedback not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(feedbackDoc.data()), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // All feedbacks
  const feedbackSnap = await db
    .collection("exams")
    .doc(examId)
    .collection("feedback")
    .orderBy("taskIndex")
    .get();

  const feedbacks = feedbackSnap.docs.map((doc) => doc.data());
  return new Response(JSON.stringify({ feedbacks }), {
    headers: { "Content-Type": "application/json" },
  });
}
