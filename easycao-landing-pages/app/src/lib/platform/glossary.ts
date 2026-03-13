import { getFirestoreDb } from "@/lib/firebase-admin";

export interface GlossaryEntry {
  termo: string;
  definicao: string;
  divisaoSilabica: string;
  pronunciaEasycao: string;
  pronunciaFonetica: string;
  urlAudio: string;
}

/**
 * Fetch glossary entries for a list of words from Firestore.
 * Words are matched by lowercase doc ID.
 * Firestore `in` queries support max 30 values, so we batch automatically.
 */
export async function getGlossaryTerms(
  words: string[]
): Promise<Map<string, GlossaryEntry>> {
  const db = getFirestoreDb();
  const result = new Map<string, GlossaryEntry>();

  // Deduplicate and lowercase
  // Firestore doc IDs use '/' replaced with '_' to match import
  const uniqueWords = [
    ...new Set(words.map((w) => w.toLowerCase().replace(/\//g, "_"))),
  ];
  if (uniqueWords.length === 0) return result;

  // Firestore 'in' supports max 30 values per query
  const BATCH_SIZE = 30;
  for (let i = 0; i < uniqueWords.length; i += BATCH_SIZE) {
    const batch = uniqueWords.slice(i, i + BATCH_SIZE);
    const snap = await db
      .collection("glossary")
      .where("__name__", "in", batch)
      .get();

    for (const doc of snap.docs) {
      const data = doc.data() as GlossaryEntry;
      result.set(doc.id, data);
    }
  }

  return result;
}
