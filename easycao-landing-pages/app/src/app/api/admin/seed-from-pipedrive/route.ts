import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

// --- Pipedrive API helpers ---

interface PipedriveResponse<T> {
  success: boolean;
  data: T[] | null;
  additional_data?: {
    pagination?: {
      start: number;
      limit: number;
      more_items_in_collection: boolean;
      next_start: number;
    };
  };
}

async function fetchAllPipedrive<T>(
  endpoint: string,
  token: string
): Promise<T[]> {
  const all: T[] = [];
  let start = 0;
  const limit = 500;

  while (true) {
    const url = `https://api.pipedrive.com/v1/${endpoint}?start=${start}&limit=${limit}&api_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Pipedrive ${endpoint}: ${res.status}`);

    const json: PipedriveResponse<T> = await res.json();
    if (!json.success || !json.data) break;

    all.push(...json.data);

    if (!json.additional_data?.pagination?.more_items_in_collection) break;
    start = json.additional_data.pagination.next_start;
  }

  return all;
}

interface PipedrivePerson {
  id: number;
  name: string;
  email: { value: string; primary: boolean }[];
  phone: { value: string; primary: boolean }[];
}

interface PipedriveDeal {
  id: number;
  person_id: { value: number } | number | null;
  value: number;
  currency: string;
  title: string;
}

function extractEmail(person: PipedrivePerson): string {
  const primary = person.email?.find((e) => e.primary);
  return (primary?.value || person.email?.[0]?.value || "").toLowerCase();
}

function extractPhone(person: PipedrivePerson): string {
  const primary = person.phone?.find((p) => p.primary);
  const raw = primary?.value || person.phone?.[0]?.value || "";
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55")) return `+${digits}`;
  return `+55${digits}`;
}

function getPersonId(deal: PipedriveDeal): number | null {
  if (!deal.person_id) return null;
  if (typeof deal.person_id === "number") return deal.person_id;
  return deal.person_id.value ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { error: "Missing ?token= query param" },
        { status: 400 }
      );
    }

    // Step 1: Fetch all persons from Pipedrive
    console.log("Pipedrive sync: fetching persons...");
    const persons = await fetchAllPipedrive<PipedrivePerson>("persons", token);
    console.log(`Pipedrive sync: ${persons.length} persons fetched`);

    // Build person map: id → { email, phone }
    const personById = new Map<
      number,
      { email: string; phone: string }
    >();
    const personByEmail = new Map<
      string,
      { phone: string; personId: number }
    >();

    for (const p of persons) {
      const email = extractEmail(p);
      const phone = extractPhone(p);
      personById.set(p.id, { email, phone });
      if (email) {
        personByEmail.set(email, { phone, personId: p.id });
      }
    }

    // Step 2: Fetch all deals from Pipedrive
    console.log("Pipedrive sync: fetching deals...");
    const deals = await fetchAllPipedrive<PipedriveDeal>("deals", token);
    console.log(`Pipedrive sync: ${deals.length} deals fetched`);

    // Build deal map: email → dealValue (take the most recent / last deal)
    const dealByEmail = new Map<string, number>();
    for (const deal of deals) {
      const pid = getPersonId(deal);
      if (!pid) continue;
      const person = personById.get(pid);
      if (!person?.email) continue;
      // Overwrite — last deal in list wins (Pipedrive returns oldest first)
      dealByEmail.set(person.email, deal.value);
    }

    // Step 3: Fetch all Firebase students
    console.log("Pipedrive sync: fetching Firebase students...");
    const db = getFirestoreDb();
    const studentsSnap = await db.collection("Users").where("totalEnrollments", ">", 0).get();
    console.log(`Pipedrive sync: ${studentsSnap.size} students in Firebase`);

    let matched = 0;
    let phonesUpdated = 0;
    let pricesUpdated = 0;
    const unmatched: string[] = [];
    const errors: string[] = [];

    for (const doc of studentsSnap.docs) {
      const data = doc.data();
      const email = (data.email || "").toLowerCase();

      const pipedriveData = personByEmail.get(email);
      if (!pipedriveData) {
        unmatched.push(email);
        continue;
      }

      matched++;

      try {
        const updates: Record<string, unknown> = {};

        // Update phone if Pipedrive has one
        if (pipedriveData.phone && pipedriveData.phone !== data.phone) {
          updates.phone = pipedriveData.phone;
          phonesUpdated++;
        }

        if (Object.keys(updates).length > 0) {
          await db.collection("Users").doc(doc.id).update(updates);
        }

        // Update enrollment price if needsManualPrice
        const currentEnrollmentId = data.currentEnrollmentId;
        if (currentEnrollmentId) {
          const enrollDoc = await db
            .collection("Users")
            .doc(doc.id)
            .collection("enrollments")
            .doc(currentEnrollmentId)
            .get();

          if (enrollDoc.exists) {
            const enrollData = enrollDoc.data()!;
            if (enrollData.needsManualPrice) {
              const dealValue = dealByEmail.get(email);
              if (dealValue != null) {
                const realPrice = dealValue === 3 ? 1957 : dealValue;
                await enrollDoc.ref.update({
                  realPricePaid: realPrice,
                  needsManualPrice: false,
                });
                pricesUpdated++;
              }
            }
          }
        }
      } catch (err) {
        errors.push(
          `${email}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    console.log(
      `Pipedrive sync complete: matched=${matched}, phones=${phonesUpdated}, prices=${pricesUpdated}, unmatched=${unmatched.length}`
    );

    return NextResponse.json({
      matched,
      phonesUpdated,
      pricesUpdated,
      unmatchedCount: unmatched.length,
      unmatched: unmatched.slice(0, 50),
      errors,
    });
  } catch (error) {
    console.error("Pipedrive sync fatal:", error);
    return NextResponse.json(
      { error: "Sync failed", details: String(error) },
      { status: 500 }
    );
  }
}
