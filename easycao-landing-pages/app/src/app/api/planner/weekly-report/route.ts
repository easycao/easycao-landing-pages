import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/planner/weekly-report?uid=xxx
 * Generates/returns a weekly report from plan progress, simulator feedback, and exercises.
 */
export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "uid is required" }, { status: 400 });
  }

  const db = getFirestoreDb();

  try {
    // Find active plan
    const plansSnap = await db
      .collection("Users")
      .doc(uid)
      .collection("studyPlans")
      .where("status", "in", ["active", "completed"])
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (plansSnap.empty) {
      return NextResponse.json({ hasReport: false });
    }

    const planDoc = plansSnap.docs[0];
    const planData = planDoc.data();

    // Count tasks planned vs completed across all days
    const daysSnap = await planDoc.ref.collection("days").get();
    let tasksPlanned = 0;
    let tasksCompleted = 0;
    const taskTypeStats: Record<string, { planned: number; completed: number }> = {};

    for (const dayDoc of daysSnap.docs) {
      const dayData = dayDoc.data();
      const tasks = dayData.tasks || [];
      tasksPlanned += tasks.length;
      for (const task of tasks) {
        if (!taskTypeStats[task.type]) {
          taskTypeStats[task.type] = { planned: 0, completed: 0 };
        }
        taskTypeStats[task.type].planned++;
        if (task.completed) {
          tasksCompleted++;
          taskTypeStats[task.type].completed++;
        }
      }
    }

    // Get recent simulator exams (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const examsSnap = await db
      .collection("exams")
      .where("uid", "==", uid)
      .where("status", "==", "completed")
      .orderBy("completedAt", "desc")
      .limit(20)
      .get();

    let totalPronunciation = 0;
    let totalFluency = 0;
    let simCount = 0;
    const errorCategories: Record<string, number> = {};

    for (const exam of examsSnap.docs) {
      const examData = exam.data();
      // Get feedback for this exam
      const feedbackSnap = await db
        .collection("exams")
        .doc(exam.id)
        .collection("taskFeedback")
        .get();

      for (const fb of feedbackSnap.docs) {
        const fbData = fb.data();
        if (fbData.pronunciation) {
          totalPronunciation += fbData.pronunciation;
          simCount++;
        }
        if (fbData.fluency) {
          totalFluency += fbData.fluency;
        }
        if (fbData.errors && Array.isArray(fbData.errors)) {
          for (const err of fbData.errors) {
            const cat = err.category || err.type || "other";
            errorCategories[cat] = (errorCategories[cat] || 0) + 1;
          }
        }
      }
    }

    // Get exercise completion count
    const exerciseProgressSnap = await db
      .collection("Users")
      .doc(uid)
      .collection("exerciseProgress")
      .get();

    let exercisesCompleted = 0;
    for (const doc of exerciseProgressSnap.docs) {
      const data = doc.data();
      exercisesCompleted += data.completedCount || 0;
    }

    // Sort error categories by frequency
    const topErrors = Object.entries(errorCategories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Build improvements list
    const improvements: string[] = [];
    const completionRate = tasksPlanned > 0
      ? Math.round((tasksCompleted / tasksPlanned) * 100)
      : 0;

    if (completionRate >= 80) {
      improvements.push("Excelente taxa de conclusao de tarefas!");
    } else if (completionRate >= 50) {
      improvements.push("Boa consistencia, tente manter o ritmo.");
    } else {
      improvements.push("Tente dedicar mais tempo ao plano de estudos.");
    }

    if (simCount > 0) {
      const avgPron = Math.round(totalPronunciation / simCount);
      if (avgPron >= 80) {
        improvements.push("Pronuncia em otimo nivel!");
      } else {
        improvements.push("Foque em exercicios de pronuncia.");
      }
    }

    return NextResponse.json({
      hasReport: true,
      report: {
        period: {
          start: sevenDaysAgo.toISOString(),
          end: new Date().toISOString(),
        },
        tasks: {
          planned: tasksPlanned,
          completed: tasksCompleted,
          completionRate,
          byType: taskTypeStats,
        },
        simulations: {
          count: examsSnap.size,
          avgPronunciation: simCount > 0 ? Math.round(totalPronunciation / simCount) : null,
          avgFluency: simCount > 0 ? Math.round(totalFluency / simCount) : null,
        },
        exercises: {
          completed: exercisesCompleted,
        },
        topErrors,
        improvements,
        plan: {
          goal: planData.goal,
          currentDay: planData.currentDay,
          totalDays: planData.totalDays,
          status: planData.status,
        },
      },
    });
  } catch (error) {
    console.error("Error generating weekly report:", error);
    return NextResponse.json(
      { error: "Failed to generate weekly report" },
      { status: 500 }
    );
  }
}
