import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/performance/profile?uid=xxx
 * Aggregates data from progress, simulator feedback, and exercise progress
 * into a learning profile.
 */
export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const db = getFirestoreDb();

  try {
    // 1. Simulator evolution — pronunciation + fluency scores over time
    const examsSnap = await db
      .collection("exams")
      .where("uid", "==", uid)
      .where("status", "==", "completed")
      .orderBy("completedAt", "asc")
      .limit(50)
      .get();

    interface SimulatorEntry {
      examId: string;
      part: string;
      date: string;
      avgPronunciation: number;
      avgFluency: number;
      taskCount: number;
    }

    const simulatorEvolution: SimulatorEntry[] = [];

    for (const exam of examsSnap.docs) {
      const examData = exam.data();
      const feedbackSnap = await db
        .collection("exams")
        .doc(exam.id)
        .collection("taskFeedback")
        .get();

      let totalPron = 0;
      let totalFlu = 0;
      let count = 0;

      for (const fb of feedbackSnap.docs) {
        const fbData = fb.data();
        if (fbData.pronunciation != null) {
          totalPron += fbData.pronunciation;
          count++;
        }
        if (fbData.fluency != null) {
          totalFlu += fbData.fluency;
        }
      }

      if (count > 0) {
        simulatorEvolution.push({
          examId: exam.id,
          part: examData.part,
          date: examData.completedAt?.toDate?.()?.toISOString() || examData.createdAt?.toDate?.()?.toISOString() || "",
          avgPronunciation: Math.round(totalPron / count),
          avgFluency: Math.round(totalFlu / count),
          taskCount: feedbackSnap.size,
        });
      }
    }

    // 2. Course progress — per course with module breakdown
    const accessSnap = await db
      .collection("Users")
      .doc(uid)
      .collection("access")
      .get();

    const courseIds = accessSnap.docs
      .filter((d) => d.data().active)
      .map((d) => d.id);

    interface ModuleProgress {
      id: string;
      name: string;
      totalLessons: number;
      completedLessons: number;
      percent: number;
    }

    interface CourseProgress {
      courseId: string;
      courseName: string;
      totalLessons: number;
      completedLessons: number;
      percent: number;
      modules: ModuleProgress[];
    }

    const courseProgress: CourseProgress[] = [];

    for (const courseId of courseIds) {
      const courseDoc = await db.collection("courses").doc(courseId).get();
      if (!courseDoc.exists) continue;
      const courseData = courseDoc.data()!;

      const progressSnap = await db
        .collection("Users")
        .doc(uid)
        .collection("progress")
        .doc(courseId)
        .get();
      const completed: string[] = progressSnap.exists
        ? progressSnap.data()?.completedLessons || []
        : [];

      const modulesSnap = await db
        .collection("courses")
        .doc(courseId)
        .collection("modules")
        .where("status", "==", "published")
        .orderBy("order", "asc")
        .get();

      const modules: ModuleProgress[] = [];
      let courseTotalLessons = 0;
      let courseCompletedLessons = 0;

      for (const mod of modulesSnap.docs) {
        const modData = mod.data();
        const lessonsSnap = await db
          .collection("courses")
          .doc(courseId)
          .collection("modules")
          .doc(mod.id)
          .collection("lessons")
          .where("status", "==", "published")
          .get();

        const modTotal = lessonsSnap.size;
        const modCompleted = lessonsSnap.docs.filter((l) =>
          completed.includes(l.id)
        ).length;

        courseTotalLessons += modTotal;
        courseCompletedLessons += modCompleted;

        modules.push({
          id: mod.id,
          name: modData.name,
          totalLessons: modTotal,
          completedLessons: modCompleted,
          percent: modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0,
        });
      }

      courseProgress.push({
        courseId,
        courseName: courseData.name,
        totalLessons: courseTotalLessons,
        completedLessons: courseCompletedLessons,
        percent:
          courseTotalLessons > 0
            ? Math.round((courseCompletedLessons / courseTotalLessons) * 100)
            : 0,
        modules,
      });
    }

    // 3. Exercise stats — completed per part
    const exerciseProgressSnap = await db
      .collection("Users")
      .doc(uid)
      .collection("exerciseProgress")
      .get();

    const exerciseStats: Record<string, { completed: number; total: number }> = {};
    let totalExercisesCompleted = 0;

    for (const doc of exerciseProgressSnap.docs) {
      const data = doc.data();
      const part = data.part || doc.id;
      exerciseStats[part] = {
        completed: data.completedCount || 0,
        total: data.totalCount || 0,
      };
      totalExercisesCompleted += data.completedCount || 0;
    }

    // Playlist completion
    const playlistProgressSnap = await db
      .collection("Users")
      .doc(uid)
      .collection("playlistProgress")
      .get();

    let playlistsCompleted = 0;
    for (const doc of playlistProgressSnap.docs) {
      const data = doc.data();
      if (data.completed) playlistsCompleted++;
    }

    // 4. Error patterns — aggregate from recent simulations
    const errorCategories: Record<string, number> = {};

    for (const exam of examsSnap.docs) {
      const feedbackSnap = await db
        .collection("exams")
        .doc(exam.id)
        .collection("taskFeedback")
        .get();

      for (const fb of feedbackSnap.docs) {
        const fbData = fb.data();
        if (fbData.errors && Array.isArray(fbData.errors)) {
          for (const err of fbData.errors) {
            const cat = err.category || err.type || "other";
            errorCategories[cat] = (errorCategories[cat] || 0) + 1;
          }
        }
      }
    }

    const topErrors = Object.entries(errorCategories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([category, count]) => ({ category, count }));

    return NextResponse.json({
      simulatorEvolution,
      courseProgress,
      exerciseStats: {
        byPart: exerciseStats,
        totalCompleted: totalExercisesCompleted,
        playlistsCompleted,
      },
      errorPatterns: topErrors,
    });
  } catch (error) {
    console.error("Error building performance profile:", error);
    return NextResponse.json(
      { error: "Failed to build performance profile" },
      { status: 500 }
    );
  }
}
