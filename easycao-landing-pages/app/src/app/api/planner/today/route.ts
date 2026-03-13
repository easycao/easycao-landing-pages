import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * GET /api/planner/today?uid=xxx
 * Returns today's plan day tasks.
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
      return NextResponse.json({ hasPlan: false, today: null });
    }

    const planDoc = plansSnap.docs[0];
    const planData = planDoc.data();
    const currentDay = planData.currentDay || 1;

    // Get today's day document
    const dayDoc = await planDoc.ref
      .collection("days")
      .doc(`day-${currentDay}`)
      .get();

    if (!dayDoc.exists) {
      return NextResponse.json({ hasPlan: true, today: null, planComplete: true });
    }

    const dayData = dayDoc.data()!;

    // Check for incomplete tasks from yesterday and push them forward
    if (currentDay > 1) {
      const yesterdayDoc = await planDoc.ref
        .collection("days")
        .doc(`day-${currentDay - 1}`)
        .get();

      if (yesterdayDoc.exists) {
        const yesterdayData = yesterdayDoc.data()!;
        const incompleteTasks = (yesterdayData.tasks || []).filter(
          (t: { completed: boolean }) => !t.completed
        );

        if (incompleteTasks.length > 0) {
          // Merge incomplete tasks into today
          const todayTasks = [...incompleteTasks, ...(dayData.tasks || [])];
          // Remove duplicates by id
          const seen = new Set<string>();
          const uniqueTasks = todayTasks.filter((t: { id: string }) => {
            if (seen.has(t.id)) return false;
            seen.add(t.id);
            return true;
          });
          dayData.tasks = uniqueTasks;
        }
      }
    }

    return NextResponse.json({
      hasPlan: true,
      planId: planDoc.id,
      today: {
        dayNumber: currentDay,
        totalDays: planData.totalDays,
        tasks: dayData.tasks || [],
        status: dayData.status,
      },
    });
  } catch (error) {
    console.error("Error fetching today's plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch today's plan" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/planner/today
 * Marks a task as complete and advances day if all tasks done.
 */
export async function POST(req: NextRequest) {
  const db = getFirestoreDb();

  let body: { uid: string; taskId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { uid, taskId } = body;
  if (!uid || !taskId) {
    return NextResponse.json(
      { error: "uid and taskId are required" },
      { status: 400 }
    );
  }

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
      return NextResponse.json({ error: "No active plan" }, { status: 404 });
    }

    const planDoc = plansSnap.docs[0];
    const planData = planDoc.data();
    const currentDay = planData.currentDay || 1;

    // Update task in current day
    const dayRef = planDoc.ref.collection("days").doc(`day-${currentDay}`);
    const dayDoc = await dayRef.get();

    if (!dayDoc.exists) {
      return NextResponse.json({ error: "Day not found" }, { status: 404 });
    }

    const dayData = dayDoc.data()!;
    const tasks = (dayData.tasks || []).map(
      (t: { id: string; completed: boolean }) =>
        t.id === taskId ? { ...t, completed: true } : t
    );

    const allCompleted = tasks.every(
      (t: { completed: boolean }) => t.completed
    );

    await dayRef.update({
      tasks,
      status: allCompleted ? "completed" : "in_progress",
    });

    // If all tasks completed, advance to next day
    if (allCompleted && currentDay < planData.totalDays) {
      await planDoc.ref.update({
        currentDay: currentDay + 1,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else if (allCompleted && currentDay >= planData.totalDays) {
      await planDoc.ref.update({
        status: "completed",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({
      success: true,
      allCompleted,
      advancedDay: allCompleted && currentDay < planData.totalDays,
    });
  } catch (error) {
    console.error("Error completing task:", error);
    return NextResponse.json(
      { error: "Failed to complete task" },
      { status: 500 }
    );
  }
}
