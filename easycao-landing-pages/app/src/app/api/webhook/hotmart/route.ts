import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import {
  getStudentByEmail,
  createStudent,
  updateStudent,
  createEnrollment,
  findEnrollmentByTransaction,
  updateEnrollmentStatus,
} from "@/lib/crm/students";
import type { StageName } from "@/lib/crm/types";

const WEBHOOK_SECRET = process.env.HOTMART_WEBHOOK_SECRET;

function normalizePhone(phone: string, phoneCode: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("55")) return `+${digits}`;
  if (phoneCode) return `+55${digits}`;
  return `+55${digits}`;
}

function emptyStages(): Record<StageName, null> {
  return {
    dia_10: null,
    mes_2: null,
    mes_4: null,
    mes_7: null,
    mes_10: null,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Validate hottok
    const hottok = request.headers.get("x-hotmart-hottok");
    if (!hottok || hottok !== WEBHOOK_SECRET) {
      console.error("Webhook: invalid hottok");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const event = payload.event;
    const data = payload.data;

    if (!event || !data) {
      return NextResponse.json({ received: true });
    }

    // Handle PURCHASE_APPROVED
    if (event === "PURCHASE_APPROVED") {
      const buyer = data.buyer;
      const purchase = data.purchase;

      if (!buyer?.email || !purchase?.transaction) {
        console.error("Webhook: missing buyer email or transaction");
        return NextResponse.json({ received: true });
      }

      const transaction = purchase.transaction;
      const email = buyer.email.toLowerCase();

      // Idempotency: check if transaction already exists
      const existing = await findEnrollmentByTransaction(transaction, email);
      if (existing) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      const phone = normalizePhone(
        buyer.checkout_phone || "",
        buyer.checkout_phone_code || ""
      );

      const pricePaid = purchase.price?.value || 0;
      const enrolledAt = purchase.approved_date
        ? Timestamp.fromMillis(purchase.approved_date)
        : Timestamp.now();

      const enrollmentData = {
        enrolledAt,
        expiredAt: null,
        status: "active" as const,
        transaction,
        offerCode: purchase.offer?.code || "",
        pricePaid,
        realPricePaid: null,
        needsManualPrice: pricePaid <= 5,
        paymentType: purchase.payment?.type || "UNKNOWN",
        installments: purchase.payment?.installments_number || 1,
        source: "hotmart" as const,
        extensionDays: 0,
        stages: emptyStages(),
        notes: null,
      };

      // Check if student exists
      const existingStudent = await getStudentByEmail(email);

      if (existingStudent) {
        // Update student + create new enrollment
        const enrollmentId = await createEnrollment(
          existingStudent.id,
          enrollmentData
        );
        await updateStudent(existingStudent.id, {
          name: `${buyer.first_name || ""} ${buyer.last_name || ""}`.trim(),
          firstName: buyer.first_name || existingStudent.firstName,
          lastName: buyer.last_name || existingStudent.lastName,
          phone: phone || existingStudent.phone,
          document: buyer.document || existingStudent.document,
          city: buyer.address?.city || existingStudent.city,
          state: buyer.address?.state || existingStudent.state,
          currentEnrollmentId: enrollmentId,
          totalEnrollments: (existingStudent.totalEnrollments || 0) + 1,
        });
      } else {
        // Create new student + enrollment
        const studentId = await createStudent({
          name: `${buyer.first_name || ""} ${buyer.last_name || ""}`.trim(),
          firstName: buyer.first_name || "",
          lastName: buyer.last_name || "",
          email,
          phone,
          document: buyer.document || "",
          city: buyer.address?.city || "",
          state: buyer.address?.state || "",
          hotmartUserId: null,
          hotmartStatus: null,
          courseProgress: null,
          tags: [],
          totalEnrollments: 1,
          currentEnrollmentId: "", // Will be updated below
          approved: false,
          approvedAt: null,
          csEnabled: true,
        });

        const enrollmentId = await createEnrollment(
          studentId,
          enrollmentData
        );
        await updateStudent(studentId, {
          currentEnrollmentId: enrollmentId,
        });
      }

      return NextResponse.json({ received: true, event: "PURCHASE_APPROVED" });
    }

    // Handle PURCHASE_REFUNDED / PURCHASE_CHARGEBACK
    if (
      event === "PURCHASE_REFUNDED" ||
      event === "PURCHASE_CHARGEBACK"
    ) {
      const transaction = data.purchase?.transaction;
      if (!transaction) {
        return NextResponse.json({ received: true });
      }

      const buyerEmail = data.buyer?.email?.toLowerCase();
      const found = await findEnrollmentByTransaction(transaction, buyerEmail);
      if (found) {
        await updateEnrollmentStatus(
          found.studentId,
          found.enrollmentId,
          "refunded"
        );
      }

      return NextResponse.json({ received: true, event });
    }

    // Unknown event — acknowledge
    return NextResponse.json({ received: true, event });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Webhook error:", errMsg);
    // Always return 200 to prevent Hotmart retries on our errors
    return NextResponse.json({ received: true, error: errMsg });
  }
}
