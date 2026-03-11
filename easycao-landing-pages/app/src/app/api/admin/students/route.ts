import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { searchStudents } from "@/lib/crm/students";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { computeStage, daysRemaining } from "@/lib/crm/stages";

export async function GET(request: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") || "";
  const students = await searchStudents(q);

  // Enrich with current enrollment data
  const db = getFirestoreDb();
  const enriched = await Promise.all(
    students.map(async (student) => {
      let stage = "";
      let engagement = "";
      let days = 0;
      let enrollmentStatus = "";
      let needsManualPrice = false;

      if (student.currentEnrollmentId) {
        const enrollDoc = await db
          .collection("Users")
          .doc(student.id)
          .collection("enrollments")
          .doc(student.currentEnrollmentId)
          .get();

        if (enrollDoc.exists) {
          const data = enrollDoc.data();
          const enrolledAt = data?.enrolledAt?.toDate?.() || new Date();
          stage = computeStage(enrolledAt);
          days = daysRemaining(enrolledAt);
          enrollmentStatus = data?.status || "";
          needsManualPrice = data?.needsManualPrice || false;

          // Get latest engagement from stages
          const stages = data?.stages || {};
          for (const s of ["mes_10", "mes_7", "mes_4", "mes_2", "dia_10"]) {
            if (stages[s]?.engagement) {
              engagement = stages[s].engagement;
              break;
            }
          }
        }
      }

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        stage,
        engagement,
        daysRemaining: days,
        enrollmentStatus,
        needsManualPrice,
        hotmartStatus: student.hotmartStatus || null,
        courseProgress: student.courseProgress ?? null,
      };
    })
  );

  return NextResponse.json({ students: enriched });
}
