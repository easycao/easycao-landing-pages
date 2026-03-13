import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";

/**
 * GET /api/planner/plan?uid=xxx
 * Returns the active plan summary + upcoming days.
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
      .where("status", "==", "active")
      .limit(1)
      .get();

    if (plansSnap.empty) {
      return NextResponse.json({ hasPlan: false });
    }

    const planDoc = plansSnap.docs[0];
    const planData = planDoc.data();
    const currentDay = planData.currentDay || 1;

    // Fetch upcoming days (current + next 5)
    const upcomingDays = [];
    for (let i = currentDay; i <= Math.min(currentDay + 5, planData.totalDays); i++) {
      const dayDoc = await planDoc.ref
        .collection("days")
        .doc(`day-${i}`)
        .get();
      if (dayDoc.exists) {
        upcomingDays.push(dayDoc.data());
      }
    }

    // Calculate overall progress
    let totalTasks = 0;
    let completedTasks = 0;

    const allDaysSnap = await planDoc.ref.collection("days").get();
    for (const d of allDaysSnap.docs) {
      const data = d.data();
      const tasks = data.tasks || [];
      totalTasks += tasks.length;
      completedTasks += tasks.filter(
        (t: { completed: boolean }) => t.completed
      ).length;
    }

    return NextResponse.json({
      hasPlan: true,
      plan: {
        id: planDoc.id,
        goal: planData.goal,
        examDate: planData.examDate,
        hoursPerDay: planData.hoursPerDay,
        daysPerWeek: planData.daysPerWeek,
        totalDays: planData.totalDays,
        currentDay,
        status: planData.status,
        startDate: planData.startDate,
        progress: {
          totalTasks,
          completedTasks,
          percent:
            totalTasks > 0
              ? Math.round((completedTasks / totalTasks) * 100)
              : 0,
        },
      },
      upcomingDays,
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch plan" },
      { status: 500 }
    );
  }
}
