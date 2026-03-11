import type { Timestamp } from "firebase-admin/firestore";

// --- Enums / Union Types ---

export type EngagementLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

export type EnrollmentStatus = "active" | "expired" | "refunded";

export type EnrollmentSource = "hotmart" | "manual";

export type StageName = "dia_10" | "mes_2" | "mes_4" | "mes_7" | "mes_10";

// --- Stage Record ---

export interface StageRecord {
  engagement: EngagementLevel | null;
  sentAt: Timestamp | "migrated" | "cs_disabled" | null;
  template: string | null;
  progress: number | null;
}

// --- Student ---

export interface Student {
  id: string;
  uid: string | null;
  authLinked: boolean;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  document: string;
  city: string;
  state: string;
  hotmartUserId: string | null;
  hotmartStatus: string | null;
  courseProgress: number | null;
  tags: string[];
  totalEnrollments: number;
  currentEnrollmentId: string;
  approved: boolean;
  approvedAt: Timestamp | null;
  csEnabled: boolean;
  platformAccess?: boolean;
  turmaId?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// --- Enrollment ---

export interface Enrollment {
  id: string;
  enrolledAt: Timestamp;
  expiredAt: Timestamp | null;
  status: EnrollmentStatus;
  transaction: string;
  offerCode: string;
  pricePaid: number;
  realPricePaid: number | null;
  needsManualPrice: boolean;
  paymentType: string;
  installments: number;
  source: EnrollmentSource;
  extensionDays: number;
  stages: Record<StageName, StageRecord | null>;
  notes: string | null;
}
