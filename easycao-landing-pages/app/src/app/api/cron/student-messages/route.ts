import { NextRequest, NextResponse } from "next/server";
import { getFirestoreDb } from "@/lib/firebase-admin";
import { getHotmartUserInfo } from "@/lib/hotmart";
import { sendTemplate } from "@/lib/whatsapp";
import { computeStage } from "@/lib/crm/stages";
import { MESSAGE_STAGES, selectTemplate } from "@/lib/crm/messages";
import { updateEnrollmentStage, updateStudent } from "@/lib/crm/students";
import { Timestamp } from "firebase-admin/firestore";
import type { StageName, EngagementLevel } from "@/lib/crm/types";

interface CronMessageLog {
  name: string;
  email: string;
  phone: string;
  stage: string;
  template: string;
  engagement: string;
  progress: number | null;
  success: boolean;
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  let processed = 0;
  let sent = 0;
  let skippedBlocked = 0;
  let skippedApproved = 0;
  let skippedCsDisabled = 0;
  let autoBlocked = 0;
  let errors = 0;
  const messageLogs: CronMessageLog[] = [];
  const autoBlockedEmails: string[] = [];

  try {
    const db = getFirestoreDb();

    // Step 1: Load all students (single query)
    const studentsSnap = await db.collection("students").get();
    const studentDocs = studentsSnap.docs;

    // Step 2: Build enrollment refs for batch read
    const studentsWithEnrollment: {
      doc: FirebaseFirestore.QueryDocumentSnapshot;
      enrollmentId: string;
    }[] = [];

    for (const doc of studentDocs) {
      const enrollmentId = doc.data().currentEnrollmentId;
      if (enrollmentId) {
        studentsWithEnrollment.push({ doc, enrollmentId });
      }
    }

    // Step 3: Batch read all enrollments at once (instead of N sequential reads)
    const enrollmentRefs = studentsWithEnrollment.map(({ doc, enrollmentId }) =>
      db
        .collection("students")
        .doc(doc.id)
        .collection("enrollments")
        .doc(enrollmentId)
    );

    // Firestore getAll supports up to 500 refs — chunk if needed
    const BATCH_SIZE = 500;
    const enrollmentSnaps: FirebaseFirestore.DocumentSnapshot[] = [];
    for (let i = 0; i < enrollmentRefs.length; i += BATCH_SIZE) {
      const chunk = enrollmentRefs.slice(i, i + BATCH_SIZE);
      const results = await db.getAll(...chunk);
      enrollmentSnaps.push(...results);
    }

    // Step 4: Pre-filter — find students that actually need processing
    const candidates: {
      studentId: string;
      student: FirebaseFirestore.DocumentData;
      enrollmentId: string;
      enrollment: FirebaseFirestore.DocumentData;
      stageName: StageName;
      csEnabled: boolean;
    }[] = [];

    const autoBlockCandidates: {
      studentId: string;
      student: FirebaseFirestore.DocumentData;
    }[] = [];

    for (let i = 0; i < studentsWithEnrollment.length; i++) {
      const { doc, enrollmentId } = studentsWithEnrollment[i];
      const enrollSnap = enrollmentSnaps[i];
      const student = doc.data();
      const studentId = doc.id;

      if (!enrollSnap.exists) continue;
      const enrollment = enrollSnap.data();
      if (!enrollment || enrollment.status !== "active") continue;

      // Skip already blocked
      if (student.hotmartStatus?.startsWith("BLOCKED")) {
        skippedBlocked++;
        continue;
      }

      // Skip approved students — they don't need CS automation
      if (student.approved) {
        skippedApproved++;
        continue;
      }

      processed++;

      const enrolledAt = enrollment.enrolledAt?.toDate?.() || new Date();
      const currentStage = computeStage(enrolledAt);

      // Auto-block check
      if (currentStage === "antigo_aluno" && student.hotmartStatus === "ACTIVE") {
        const tags: string[] = student.tags || [];
        const isException =
          tags.includes("Ativos 7 anos") || tags.includes("Ativos antigos");
        if (!isException) {
          autoBlockCandidates.push({ studentId, student });
        }
        continue;
      }

      // Only keep students in a message stage with unsent messages
      if (!MESSAGE_STAGES.includes(currentStage as StageName)) continue;
      const stageName = currentStage as StageName;
      if (enrollment.stages?.[stageName]?.sentAt) continue;

      const csEnabled = student.csEnabled !== false; // default true
      candidates.push({ studentId, student, enrollmentId, enrollment, stageName, csEnabled });
    }

    console.log(
      `Cron: ${studentsSnap.size} students, ${processed} active, ${candidates.length} eligible, ${autoBlockCandidates.length} auto-block`
    );

    // Step 5: Auto-block (parallel writes)
    if (autoBlockCandidates.length > 0) {
      await Promise.all(
        autoBlockCandidates.map(({ studentId }) =>
          updateStudent(studentId, { hotmartStatus: "BLOCKED" })
        )
      );
      autoBlocked = autoBlockCandidates.length;
      for (const { student } of autoBlockCandidates) {
        autoBlockedEmails.push(student.email);
        console.log(`Cron: auto-blocked ${student.email}`);
      }
    }

    // Step 6: Process eligible students (only a handful per day)
    for (const { studentId, student, enrollmentId, enrollment, stageName, csEnabled } of candidates) {
      try {
        // Fetch live engagement from Hotmart
        const hotmartInfo = await getHotmartUserInfo(student.email);
        const currentEngagement = hotmartInfo.engagement;

        // Update student-level status + progress
        await updateStudent(studentId, {
          hotmartStatus: hotmartInfo.status,
          courseProgress: hotmartInfo.progress,
        });

        // Skip if Hotmart says blocked
        if (hotmartInfo.status?.startsWith("BLOCKED")) {
          skippedBlocked++;
          console.log(`Cron: skipped ${student.email} — blocked on Hotmart`);
          continue;
        }

        // Previous engagement for mes_4
        let prevEngagement: EngagementLevel | null = null;
        if (stageName === "mes_4") {
          prevEngagement =
            (enrollment.stages?.mes_2?.engagement as EngagementLevel) || null;
        }

        const templateName = selectTemplate(
          stageName,
          currentEngagement,
          prevEngagement
        );

        // CS disabled: track engagement/progress but don't send WhatsApp
        if (!csEnabled) {
          skippedCsDisabled++;
          await updateEnrollmentStage(studentId, enrollmentId, stageName, {
            engagement: currentEngagement,
            sentAt: "cs_disabled",
            template: templateName,
            progress: hotmartInfo.progress,
          });
          messageLogs.push({
            name: student.name || "",
            email: student.email,
            phone: student.phone,
            stage: stageName,
            template: templateName,
            engagement: currentEngagement,
            progress: hotmartInfo.progress,
            success: false,
          });
          console.log(
            `Cron: CS disabled for ${student.email} | stage=${stageName} | engagement=${currentEngagement} | progress=${hotmartInfo.progress ?? "N/A"}% — message skipped`
          );
          continue;
        }

        // Send WhatsApp message
        const success = await sendTemplate(student.phone, templateName);

        // Log the message attempt
        messageLogs.push({
          name: student.name || "",
          email: student.email,
          phone: student.phone,
          stage: stageName,
          template: templateName,
          engagement: currentEngagement,
          progress: hotmartInfo.progress,
          success,
        });

        if (success) {
          await updateEnrollmentStage(studentId, enrollmentId, stageName, {
            engagement: currentEngagement,
            sentAt: Timestamp.now(),
            template: templateName,
            progress: hotmartInfo.progress,
          });
          sent++;
          console.log(
            `Cron: sent to ${student.email} | phone=${student.phone} | stage=${stageName} | template=${templateName} | engagement=${currentEngagement} | progress=${hotmartInfo.progress ?? "N/A"}%`
          );
        } else {
          errors++;
          console.log(`Cron: WhatsApp failed for ${student.email} | stage=${stageName} | template=${templateName}`);
        }
      } catch (error) {
        console.error(`Cron: error processing ${student.email}:`, error);
        errors++;
      }
    }

    const durationMs = Date.now() - startTime;

    // Step 7: Persist cron log to Firestore
    await db.collection("cronLogs").add({
      executedAt: Timestamp.now(),
      durationMs,
      processed,
      sent,
      skippedBlocked,
      skippedApproved,
      skippedCsDisabled,
      autoBlocked,
      errors,
      messages: messageLogs,
      autoBlockedList: autoBlockedEmails,
    });

    console.log(
      `Cron complete: processed=${processed}, sent=${sent}, skippedBlocked=${skippedBlocked}, skippedApproved=${skippedApproved}, skippedCsDisabled=${skippedCsDisabled}, autoBlocked=${autoBlocked}, errors=${errors}, duration=${durationMs}ms`
    );
    return NextResponse.json({ processed, sent, skippedBlocked, skippedApproved, skippedCsDisabled, autoBlocked, errors, durationMs });
  } catch (error) {
    console.error("Cron fatal error:", error);

    // Try to persist even on fatal error
    try {
      const db = getFirestoreDb();
      await db.collection("cronLogs").add({
        executedAt: Timestamp.now(),
        durationMs: Date.now() - startTime,
        processed,
        sent,
        skippedBlocked,
        skippedApproved,
        skippedCsDisabled,
        autoBlocked,
        errors: errors + 1,
        messages: messageLogs,
        autoBlockedList: autoBlockedEmails,
        fatalError: String(error),
      });
    } catch {
      // If even logging fails, just console.error
    }

    return NextResponse.json(
      { error: "Cron failed", details: String(error) },
      { status: 500 }
    );
  }
}
