import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getSessionFromCookies } from "@/lib/auth";
import { getAllClubUsers, getAllSales, type ClubUser, type HotmartSale } from "@/lib/hotmart";
import {
  getStudentByEmail,
  createStudent,
  createEnrollment,
  updateStudent,
} from "@/lib/crm/students";
import { STAGE_THRESHOLDS } from "@/lib/crm/stages";
import type { StageName, StageRecord } from "@/lib/crm/types";

function computeMigratedStages(
  enrolledAt: Date,
  seedDate: Date
): Record<StageName, StageRecord | null> {
  const daysSinceEnrolled = Math.floor(
    (seedDate.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  const stages: Record<string, StageRecord | null> = {};

  for (const [name, threshold] of Object.entries(STAGE_THRESHOLDS)) {
    if (daysSinceEnrolled >= threshold) {
      stages[name] = { engagement: null, sentAt: "migrated", template: null, progress: null };
    } else {
      stages[name] = null;
    }
  }

  return stages as Record<StageName, StageRecord | null>;
}

function normalizePhone(phone?: string, code?: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("55")) return `+${digits}`;
  return `+55${digits}`;
}

export async function POST() {
  try {
    // Verify admin session
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const seedDate = new Date();
    let created = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Step 1: Fetch all club users
    console.log("Seed: fetching club users...");
    const clubUsers = await getAllClubUsers();
    const clubMap = new Map<string, ClubUser>();
    for (const user of clubUsers) {
      if (user.email) clubMap.set(user.email.toLowerCase(), user);
    }
    console.log(`Seed: ${clubMap.size} club users fetched`);

    // Step 2: Fetch all sales
    console.log("Seed: fetching sales...");
    const allSales = await getAllSales();
    const salesMap = new Map<string, HotmartSale[]>();
    for (const sale of allSales) {
      const email = sale.buyer?.email?.toLowerCase();
      if (!email) continue;
      if (!salesMap.has(email)) salesMap.set(email, []);
      salesMap.get(email)!.push(sale);
    }
    console.log(`Seed: ${allSales.length} sales fetched for ${salesMap.size} unique emails`);

    // Step 3: Union of all emails
    const allEmails = new Set([...clubMap.keys(), ...salesMap.keys()]);
    console.log(`Seed: ${allEmails.size} unique emails to process`);

    let processed = 0;
    for (const email of allEmails) {
      try {
        processed++;
        if (processed % 100 === 0) {
          console.log(`Seed: processed ${processed}/${allEmails.size}`);
        }

        // Skip if already exists
        const existing = await getStudentByEmail(email);
        if (existing) {
          skipped++;
          continue;
        }

        const clubUser = clubMap.get(email);
        const sales = salesMap.get(email) || [];

        // Sort sales by approved_date ascending
        sales.sort(
          (a, b) =>
            (a.purchase?.approved_date || 0) - (b.purchase?.approved_date || 0)
        );

        // Determine student data from sales (preferred) or club
        const firstSale = sales[0];
        const buyer = firstSale?.buyer;

        const studentData = {
          name: buyer?.name || clubUser?.name || email,
          firstName: buyer?.first_name || "",
          lastName: buyer?.last_name || "",
          email,
          phone: normalizePhone(
            buyer?.checkout_phone,
            buyer?.checkout_phone_code
          ),
          document: buyer?.document || "",
          city: buyer?.address?.city || "",
          state: buyer?.address?.state || "",
          hotmartUserId: clubUser?.user_id || null,
          hotmartStatus: clubUser?.status || null,
          courseProgress: clubUser?.progress?.completed_percentage ?? null,
          tags: [],
          totalEnrollments: Math.max(sales.length, 1),
          currentEnrollmentId: "",
          approved: false,
          approvedAt: null,
          csEnabled: true,
        };

        const studentId = await createStudent(studentData);

        // Create enrollments from sales
        let lastEnrollmentId = "";

        if (sales.length > 0) {
          for (const sale of sales) {
            const approvedDate = sale.purchase?.approved_date
              ? new Date(sale.purchase.approved_date)
              : new Date();

            const pricePaid = sale.purchase?.price?.value || 0;
            const isRefunded =
              sale.purchase?.status === "REFUNDED" ||
              sale.purchase?.status === "CHARGEBACK";

            const enrollmentId = await createEnrollment(studentId, {
              enrolledAt: Timestamp.fromDate(approvedDate),
              expiredAt: null,
              status: isRefunded ? "refunded" : "active",
              transaction: sale.purchase?.transaction || "",
              offerCode: sale.purchase?.offer?.code || "",
              pricePaid,
              realPricePaid: null,
              needsManualPrice: pricePaid <= 5,
              paymentType: sale.purchase?.payment?.type || "UNKNOWN",
              installments: sale.purchase?.payment?.installments_number || 1,
              source: "hotmart",
              extensionDays: 0,
              stages: isRefunded
                ? { dia_10: null, mes_2: null, mes_4: null, mes_7: null, mes_10: null }
                : computeMigratedStages(approvedDate, seedDate),
              notes: null,
            });

            if (!isRefunded) lastEnrollmentId = enrollmentId;
          }
        } else {
          // Club user with no sales — create minimal enrollment
          const purchaseDate = clubUser?.purchase_date
            ? new Date(clubUser.purchase_date)
            : new Date();

          lastEnrollmentId = await createEnrollment(studentId, {
            enrolledAt: Timestamp.fromDate(purchaseDate),
            expiredAt: null,
            status: "active",
            transaction: "",
            offerCode: "",
            pricePaid: 0,
            realPricePaid: null,
            needsManualPrice: true,
            paymentType: "UNKNOWN",
            installments: 1,
            source: "hotmart",
            extensionDays: 0,
            stages: computeMigratedStages(purchaseDate, seedDate),
            notes: "Imported from Club API — no matching sale found",
          });
        }

        if (lastEnrollmentId) {
          await updateStudent(studentId, {
            currentEnrollmentId: lastEnrollmentId,
          });
        }

        created++;
      } catch (error) {
        const msg = `Error for ${email}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`Seed: ${msg}`);
        errors.push(msg);
      }
    }

    console.log(
      `Seed complete: created=${created}, skipped=${skipped}, errors=${errors.length}`
    );

    return NextResponse.json({ created, skipped, errors });
  } catch (error) {
    console.error("Seed fatal error:", error);
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
