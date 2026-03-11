import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { computeStage } from "@/lib/crm/stages";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getFirestoreDb();
  const studentsSnap = await db.collection("Users").where("totalEnrollments", ">", 0).get();

  // Collect all enrollment refs
  const pairs: { doc: FirebaseFirestore.QueryDocumentSnapshot; enrollmentId: string }[] = [];
  for (const doc of studentsSnap.docs) {
    const enrollmentId = doc.data().currentEnrollmentId;
    if (enrollmentId) pairs.push({ doc, enrollmentId });
  }

  const enrollmentRefs = pairs.map(({ doc, enrollmentId }) =>
    db.collection("Users").doc(doc.id).collection("enrollments").doc(enrollmentId)
  );

  // Batch read
  const enrollmentSnaps: FirebaseFirestore.DocumentSnapshot[] = [];
  for (let i = 0; i < enrollmentRefs.length; i += 500) {
    const chunk = enrollmentRefs.slice(i, i + 500);
    const results = await db.getAll(...chunk);
    enrollmentSnaps.push(...results);
  }

  // Aggregate
  const engagementCounts: Record<string, number> = {
    NONE: 0, LOW: 0, MEDIUM: 0, HIGH: 0, VERY_HIGH: 0, unknown: 0,
  };
  const progressBuckets: Record<string, number> = {
    "0%": 0, "1-25%": 0, "26-50%": 0, "51-75%": 0, "76-100%": 0, unknown: 0,
  };
  const stageCounts: Record<string, number> = {};
  let totalActive = 0;
  let totalBlocked = 0;
  let totalApproved = 0;

  for (let i = 0; i < pairs.length; i++) {
    const student = pairs[i].doc.data();
    const enrollSnap = enrollmentSnaps[i];
    if (!enrollSnap.exists) continue;
    const enrollment = enrollSnap.data();
    if (!enrollment || enrollment.status !== "active") continue;

    if (student.hotmartStatus?.startsWith("BLOCKED")) {
      totalBlocked++;
      continue;
    }
    if (student.approved) {
      totalApproved++;
      continue;
    }

    totalActive++;

    // Stage
    const enrolledAt = enrollment.enrolledAt?.toDate?.() || new Date();
    const extensionDays: number = enrollment.extensionDays || 0;
    const stage = computeStage(enrolledAt, extensionDays);
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;

    // Latest engagement from stages
    const stages = enrollment.stages || {};
    let latestEngagement = "unknown";
    for (const s of ["mes_10", "mes_7", "mes_4", "mes_2", "dia_10"]) {
      if (stages[s]?.engagement) {
        latestEngagement = stages[s].engagement;
        break;
      }
    }
    engagementCounts[latestEngagement] = (engagementCounts[latestEngagement] || 0) + 1;

    // Course progress
    const progress: number | null = student.courseProgress ?? null;
    if (progress === null || progress === undefined) {
      progressBuckets["unknown"]++;
    } else if (progress === 0) {
      progressBuckets["0%"]++;
    } else if (progress <= 25) {
      progressBuckets["1-25%"]++;
    } else if (progress <= 50) {
      progressBuckets["26-50%"]++;
    } else if (progress <= 75) {
      progressBuckets["51-75%"]++;
    } else {
      progressBuckets["76-100%"]++;
    }
  }

  return NextResponse.json({
    totalStudents: studentsSnap.size,
    totalActive,
    totalBlocked,
    totalApproved,
    engagementCounts,
    progressBuckets,
    stageCounts,
  });
}
