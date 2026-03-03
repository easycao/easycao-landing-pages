import { NextResponse } from "next/server";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY!;
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER!;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
const MAILCHIMP_TAG = process.env.MAILCHIMP_TAG || "Lives";

export async function POST(request: Request) {
  try {
    const { name, email, phone } = await request.json();

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
          HORASDEVOO: "",
        },
      }),
    });

    const data = await response.json();
    const md5Email = await getMd5Hash(email.toLowerCase());

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
            merge_fields: { FNAME: name, PHONE: phone },
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

      console.error("Mailchimp error:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Erro ao cadastrar. Tente novamente.", debug: data },
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

async function getMd5Hash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("MD5", data).catch(() => {
    // Fallback: simple hash for environments without MD5 in crypto.subtle
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash.toString(16);
  });

  if (hashBuffer instanceof ArrayBuffer) {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  return String(hashBuffer);
}
