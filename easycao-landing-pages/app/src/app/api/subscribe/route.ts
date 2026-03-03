import { NextResponse } from "next/server";
import { createHash } from "crypto";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_TAG = process.env.MAILCHIMP_TAG || "Lives";

export async function POST(request: Request) {
  try {
    const { name, email, phone, flightHours } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const url = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
          PHONE: phone,
          HORASDEVOO: flightHours || "0",
        },
      }),
    });

    const data = await response.json();
    const md5Email = getMd5Hash(email.toLowerCase());

    if (!response.ok) {
      if (data.title === "Member Exists") {
        // Already subscribed — update fields
        const updateUrl = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${md5Email}`;

        await fetch(updateUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            merge_fields: { FNAME: name, PHONE: phone, HORASDEVOO: flightHours || "0" },
          }),
        });

        // Add tag separately
        const tagUrl = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${md5Email}/tags`;
        await fetch(tagUrl, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: [{ name: MAILCHIMP_TAG, status: "active" }],
          }),
        });

        return NextResponse.json({ success: true, alreadySubscribed: true });
      }

      return NextResponse.json(
        { error: "Erro ao cadastrar. Tente novamente." },
        { status: 500 }
      );
    }

    // Add tag separately (tags are read-only on create endpoint)
    const tagUrl = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members/${md5Email}/tags`;
    await fetch(tagUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: [{ name: MAILCHIMP_TAG, status: "active" }],
      }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}

function getMd5Hash(input: string): string {
  return createHash("md5").update(input).digest("hex");
}
