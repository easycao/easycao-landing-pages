import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { computeStage, daysRemaining } from "@/lib/crm/stages";

const STAGE_ORDER = [
  "dia_0",
  "dia_10",
  "mes_2",
  "mes_3",
  "mes_4",
  "mes_5",
  "mes_6",
  "mes_7",
  "mes_8",
  "mes_9",
  "mes_10",
  "mes_11",
  "mes_12",
  "antigo_aluno",
] as const;

interface PipelineStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  engagement: string;
  daysRemaining: number;
  needsManualPrice: boolean;
  enrollmentStatus: string;
  hotmartStatus: string | null;
  courseProgress: number | null;
  tags: string[];
}

interface StageData {
  count: number;
  students: PipelineStudent[];
}

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getFirestoreDb();

  // Fetch all students
  const studentsSnap = await db.collection("students").get();

  // Build enrollment document references for batch fetch
  const studentDocs: {
    id: string;
    name: string;
    email: string;
    phone: string;
    currentEnrollmentId: string;
    hotmartStatus: string | null;
    courseProgress: number | null;
    tags: string[];
  }[] = [];

  const enrollmentRefs: FirebaseFirestore.DocumentReference[] = [];

  studentsSnap.forEach((doc) => {
    const data = doc.data();
    const currentEnrollmentId = data.currentEnrollmentId;
    if (currentEnrollmentId) {
      studentDocs.push({
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        currentEnrollmentId,
        hotmartStatus: data.hotmartStatus || null,
        courseProgress: data.courseProgress ?? null,
        tags: data.tags || [],
      });
      enrollmentRefs.push(
        db
          .collection("students")
          .doc(doc.id)
          .collection("enrollments")
          .doc(currentEnrollmentId)
      );
    }
  });

  // Batch fetch all enrollments at once
  const enrollmentSnaps =
    enrollmentRefs.length > 0 ? await db.getAll(...enrollmentRefs) : [];

  // Initialize stages
  const stages: Record<string, StageData> = {};
  for (const stage of STAGE_ORDER) {
    stages[stage] = { count: 0, students: [] };
  }

  // Process each student + enrollment pair
  for (let i = 0; i < studentDocs.length; i++) {
    const student = studentDocs[i];
    const enrollSnap = enrollmentSnaps[i];

    if (!enrollSnap.exists) continue;

    const enrollData = enrollSnap.data()!;
    const enrolledAt = enrollData.enrolledAt?.toDate?.() || new Date();
    let stage = computeStage(enrolledAt);
    const days = daysRemaining(enrolledAt);
    const enrollmentStatus: string = enrollData.status || "";
    const needsManualPrice: boolean = enrollData.needsManualPrice || false;

    // Refunded or BLOCKED students go to "antigo_aluno"
    const isBlocked = student.hotmartStatus?.startsWith("BLOCKED");
    if (enrollmentStatus === "refunded" || isBlocked) {
      stage = "antigo_aluno";
    }

    // Get latest engagement from stages
    let engagement = "";
    const stageRecords = enrollData.stages || {};
    for (const s of ["mes_10", "mes_7", "mes_4", "mes_2", "dia_10"]) {
      if (stageRecords[s]?.engagement) {
        engagement = stageRecords[s].engagement;
        break;
      }
    }

    const card: PipelineStudent = {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      engagement,
      daysRemaining: days,
      needsManualPrice,
      enrollmentStatus,
      hotmartStatus: student.hotmartStatus,
      courseProgress: student.courseProgress,
      tags: student.tags,
    };

    if (stages[stage]) {
      stages[stage].count++;
      stages[stage].students.push(card);
    }
  }

  return NextResponse.json({ stages });
}
