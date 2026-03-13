import { NextResponse, type NextRequest } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

interface OnboardingAnswers {
  uid: string;
  goal: "exam_prep" | "general_improvement" | "specific_part";
  examDate?: string | null;
  hoursPerDay: number;
  daysPerWeek: number;
  passiveStudyAvailable: boolean;
  passiveStudyHours?: number;
}

interface PlanTask {
  type: "lesson" | "playlist" | "simulator" | "sdea" | "full_simulator";
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
}

interface PlanDay {
  dayNumber: number;
  tasks: PlanTask[];
  status: "pending" | "in_progress" | "completed";
}

/**
 * POST /api/planner/generate
 * Generates a study plan based on onboarding answers.
 * Course ordering: M0->M1->M2->M3->M4->M5 -> Playlist -> Simulator -> SDEA -> Full Simulator
 */
export async function POST(req: NextRequest) {
  const db = getFirestoreDb();

  let body: OnboardingAnswers;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { uid, goal, examDate, hoursPerDay, daysPerWeek, passiveStudyAvailable, passiveStudyHours } = body;

  if (!uid || !goal || !hoursPerDay || !daysPerWeek) {
    return NextResponse.json(
      { error: "uid, goal, hoursPerDay, and daysPerWeek are required" },
      { status: 400 }
    );
  }

  try {
    // Fetch user's courses and modules
    const userDoc = await db.collection("Users").doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all courses the user has access to
    const accessSnap = await db
      .collection("Users")
      .doc(uid)
      .collection("access")
      .get();

    const courseIds = accessSnap.docs
      .filter((d) => d.data().active)
      .map((d) => d.id);

    if (courseIds.length === 0) {
      return NextResponse.json(
        { error: "No active courses found" },
        { status: 400 }
      );
    }

    // Build ordered task list following module ordering rules
    const allTasks: PlanTask[] = [];
    const dailyMinutes = hoursPerDay * 60;
    const passiveMinutes = passiveStudyAvailable ? (passiveStudyHours || 0) * 60 : 0;
    const totalDailyMinutes = dailyMinutes + passiveMinutes;

    for (const courseId of courseIds) {
      // Get modules ordered by order field
      const modulesSnap = await db
        .collection("courses")
        .doc(courseId)
        .collection("modules")
        .where("status", "==", "published")
        .orderBy("order", "asc")
        .get();

      // Get existing progress
      const progressSnap = await db
        .collection("Users")
        .doc(uid)
        .collection("progress")
        .doc(courseId)
        .get();
      const completedLessons: string[] = progressSnap.exists
        ? progressSnap.data()?.completedLessons || []
        : [];

      // For each module: lessons first
      for (const mod of modulesSnap.docs) {
        const modData = mod.data();
        const lessonsSnap = await db
          .collection("courses")
          .doc(courseId)
          .collection("modules")
          .doc(mod.id)
          .collection("lessons")
          .where("status", "==", "published")
          .orderBy("order", "asc")
          .get();

        for (const lesson of lessonsSnap.docs) {
          if (completedLessons.includes(lesson.id)) continue;
          const lessonData = lesson.data();
          allTasks.push({
            type: "lesson",
            id: `${courseId}/${mod.id}/${lesson.id}`,
            title: `${modData.name} - ${lessonData.title}`,
            estimatedMinutes: lessonData.durationMinutes || 30,
            completed: false,
          });
        }

        // Playlist after module completion
        allTasks.push({
          type: "playlist",
          id: `playlist-${mod.id}`,
          title: `Playlist: ${modData.name}`,
          estimatedMinutes: 20,
          completed: false,
        });

        // Simulator after module + playlist
        allTasks.push({
          type: "simulator",
          id: `sim-${mod.id}`,
          title: `Simulado: ${modData.name}`,
          estimatedMinutes: 25,
          completed: false,
        });
      }
    }

    // SDEA after all modules
    allTasks.push({
      type: "sdea",
      id: "sdea",
      title: "SDEA - Self Diagnostic English Assessment",
      estimatedMinutes: 45,
      completed: false,
    });

    // Full simulator after SDEA
    allTasks.push({
      type: "full_simulator",
      id: "full-simulator",
      title: "Simulado Completo ICAO",
      estimatedMinutes: 60,
      completed: false,
    });

    // Distribute tasks into days based on available time
    const days: PlanDay[] = [];
    let currentDay: PlanTask[] = [];
    let currentDayMinutes = 0;
    let dayNumber = 1;

    for (const task of allTasks) {
      if (currentDayMinutes + task.estimatedMinutes > totalDailyMinutes && currentDay.length > 0) {
        days.push({
          dayNumber,
          tasks: currentDay,
          status: "pending",
        });
        dayNumber++;
        currentDay = [];
        currentDayMinutes = 0;
      }
      currentDay.push(task);
      currentDayMinutes += task.estimatedMinutes;
    }

    // Push remaining tasks
    if (currentDay.length > 0) {
      days.push({
        dayNumber,
        tasks: currentDay,
        status: "pending",
      });
    }

    // Calculate start and target dates
    const startDate = new Date().toISOString();
    const targetDate = examDate || null;

    // Store plan
    const planRef = db
      .collection("Users")
      .doc(uid)
      .collection("studyPlans")
      .doc();

    await planRef.set({
      goal,
      examDate: targetDate,
      hoursPerDay,
      daysPerWeek,
      passiveStudyAvailable,
      passiveStudyHours: passiveStudyHours || 0,
      totalDays: days.length,
      currentDay: 1,
      status: "active",
      startDate,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Store each day as subcollection
    const batch = db.batch();
    for (const day of days) {
      const dayRef = planRef.collection("days").doc(`day-${day.dayNumber}`);
      batch.set(dayRef, day);
    }
    await batch.commit();

    // Mark any previous active plans as inactive
    const existingPlans = await db
      .collection("Users")
      .doc(uid)
      .collection("studyPlans")
      .where("status", "==", "active")
      .get();

    const deactivateBatch = db.batch();
    for (const doc of existingPlans.docs) {
      if (doc.id !== planRef.id) {
        deactivateBatch.update(doc.ref, { status: "archived" });
      }
    }
    await deactivateBatch.commit();

    return NextResponse.json(
      {
        planId: planRef.id,
        totalDays: days.length,
        totalTasks: allTasks.length,
        startDate,
        examDate: targetDate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate study plan" },
      { status: 500 }
    );
  }
}
