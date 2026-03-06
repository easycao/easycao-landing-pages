const GRAPH_API = "https://graph.facebook.com/v21.0";

export async function sendTemplate(
  phone: string,
  templateName: string,
  languageCode: string = "pt_BR"
): Promise<boolean> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_ID;
  const token = process.env.WHATSAPP_TOKEN;

  // Remove + prefix if present
  const cleanPhone = phone.replace(/^\+/, "");

  try {
    const res = await fetch(`${GRAPH_API}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: cleanPhone,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(
        `WhatsApp send failed — phone: ${cleanPhone}, template: ${templateName}, status: ${res.status}, body: ${body}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      `WhatsApp send error — phone: ${cleanPhone}, template: ${templateName}:`,
      error
    );
    return false;
  }
}
