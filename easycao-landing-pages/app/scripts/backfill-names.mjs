/**
 * Backfill: Reconstruct name from firstName + lastName (Hotmart data) on Users docs
 * where name is missing or came from FlutterFlow display_name.
 * firstName/lastName were migrated from students collection (Hotmart source of truth).
 */
import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const envPath = new URL("../.env.local", import.meta.url).pathname.replace(/^\//, "");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const eqIndex = line.indexOf("=");
  if (eqIndex === -1 || line.startsWith("#")) continue;
  const key = line.slice(0, eqIndex).trim();
  let value = line.slice(eqIndex + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);

async function backfill() {
  const snap = await db.collection("Users").where("totalEnrollments", ">", 0).get();
  let fixed = 0;
  let alreadyOk = 0;
  let noSource = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const currentName = (data.name || "").trim();
    const firstName = (data.firstName || "").trim();
    const lastName = (data.lastName || "").trim();
    const hotmartName = `${firstName} ${lastName}`.trim();

    // If firstName/lastName exist (from Hotmart), always use that as name
    if (hotmartName) {
      if (currentName === hotmartName) {
        alreadyOk++;
        continue;
      }
      await doc.ref.update({ name: hotmartName });
      fixed++;
      if (currentName) {
        console.log(`  Updated: ${doc.id} "${currentName}" → "${hotmartName}"`);
      } else {
        console.log(`  Fixed: ${doc.id} → "${hotmartName}"`);
      }
    } else if (!currentName) {
      noSource++;
      console.log(`  SKIP: ${doc.id} (${data.email}) — no firstName/lastName or name`);
    } else {
      alreadyOk++;
    }
  }

  console.log(`\nDone: ${fixed} names fixed, ${alreadyOk} already correct, ${noSource} no source data.`);
}

backfill().catch((err) => { console.error("Error:", err); process.exit(1); });
