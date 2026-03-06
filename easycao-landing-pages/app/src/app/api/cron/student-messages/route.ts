import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { getHotmartUserInfo } from "@/lib/hotmart";
import { sendTemplate } from "@/lib/whatsapp";
import { computeStage } from "@/lib/crm/stages";
import { MESSAGE_STAGES, selectTemplate } from "@/lib/crm/messages";
import { updateEnrollmentStage, updateStudent } from "@/lib/crm/students";
import { Timestamp } from "firebase-admin/firestore";
import type { StageName, EngagementLevel } from "@/lib/crm/types";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let processed = 0;
  let sent = 0;
  let skippedBlocked = 0;
  let autoBlocked = 0;
  let errors = 0;

  try {
    const db = getFirestoreDb();

    // Get all students
    const studentsSnap = await db.collection("students").get();

    for (const studentDoc of studentsSnap.docs) {
      const student = studentDoc.data();
      const studentId = studentDoc.id;
      const currentEnrollmentId = student.currentEnrollmentId;

      if (!currentEnrollmentId) continue;

      // Get current enrollment
      const enrollmentDoc = await db
        .collection("students")
        .doc(studentId)
        .collection("enrollments")
        .doc(currentEnrollmentId)
        .get();

      if (!enrollmentDoc.exists) continue;

      const enrollment = enrollmentDoc.data();
      if (!enrollment || enrollment.status !== "active") continue;

      // Skip already blocked students early (BLOCKED, BLOCKED_BY_OWNER, etc.)
      if (student.hotmartStatus?.startsWith("BLOCKED")) {
        skippedBlocked++;
        continue;
      }

      processed++;

      // Compute stage
      const enrolledAt = enrollment.enrolledAt?.toDate?.() || new Date();
      const currentStage = computeStage(enrolledAt);

      // Auto-block students entering antigo_aluno (skip tagged exceptions)
      if (currentStage === "antigo_aluno" && student.hotmartStatus === "ACTIVE") {
        const tags: string[] = student.tags || [];
        const isException = tags.includes("Ativos 7 anos") || tags.includes("Ativos antigos");
        if (!isException) {
          await updateStudent(studentId, { hotmartStatus: "BLOCKED" });
          autoBlocked++;
        }
        continue;
      }

      // Check if this stage has a message trigger
      if (!MESSAGE_STAGES.includes(currentStage as StageName)) continue;

      const stageName = currentStage as StageName;
      const stageData = enrollment.stages?.[stageName];

      // Skip if already sent
      if (stageData?.sentAt) continue;

      try {
        // Fetch engagement, status, and progress
        const hotmartInfo = await getHotmartUserInfo(student.email);
        const currentEngagement = hotmartInfo.engagement;

        // Update student-level status + progress
        await updateStudent(studentId, {
          hotmartStatus: hotmartInfo.status,
          courseProgress: hotmartInfo.progress,
        });

        // Skip blocked students — they should not receive messages
        if (hotmartInfo.status?.startsWith("BLOCKED")) {
          skippedBlocked++;
          continue;
        }

        // For mes_4, get previous engagement from mes_2
        let prevEngagement: EngagementLevel | null = null;
        if (stageName === "mes_4") {
          prevEngagement =
            (enrollment.stages?.mes_2?.engagement as EngagementLevel) || null;
        }

        // Select template
        const templateName = selectTemplate(
          stageName,
          currentEngagement,
          prevEngagement
        );

        // Send WhatsApp message
        const success = await sendTemplate(student.phone, templateName);

        if (success) {
          // Update stage record with progress snapshot
          await updateEnrollmentStage(studentId, currentEnrollmentId, stageName, {
            engagement: currentEngagement,
            sentAt: Timestamp.now(),
            template: templateName,
            progress: hotmartInfo.progress,
          });
          sent++;
        } else {
          // Don't update sentAt — will retry next day
          errors++;
        }
      } catch (error) {
        console.error(
          `Cron: error processing student ${student.email}:`,
          error
        );
        errors++;
      }
    }

    console.log(
      `Cron complete: processed=${processed}, sent=${sent}, skippedBlocked=${skippedBlocked}, autoBlocked=${autoBlocked}, errors=${errors}`
    );
    return NextResponse.json({ processed, sent, skippedBlocked, autoBlocked, errors });
  } catch (error) {
    console.error("Cron fatal error:", error);
    return NextResponse.json(
      { error: "Cron failed", details: String(error) },
      { status: 500 }
    );
  }
}
