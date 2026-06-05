const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function field(label, value) {
  if (!value) return "";
  return `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`;
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "TechKhit Website";
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const toName = process.env.CONTACT_TO_NAME || "TechKhit Team";

  if (!apiKey || !senderEmail || !toEmail) {
    return response.status(500).json({
      error: "Email service is not configured.",
    });
  }

  const { name, email, phone, focus, message, page } = request.body || {};

  if (!name || !email || !message) {
    return response.status(400).json({
      error: "Name, email, and message are required.",
    });
  }

  const subject = `New TechKhit inquiry${page ? `: ${page}` : ""}`;
  const htmlContent = `
    <html>
      <body>
        <h2>New TechKhit Website Inquiry</h2>
        ${field("Page", page)}
        ${field("Name", name)}
        ${field("Email", email)}
        ${field("Phone / Telegram", phone)}
        ${field("Focus", focus)}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      </body>
    </html>
  `;

  const brevoResponse = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      subject,
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          name: toName,
          email: toEmail,
        },
      ],
      replyTo: {
        name,
        email,
      },
      htmlContent,
    }),
  });

  if (!brevoResponse.ok) {
    const details = await brevoResponse.text();
    console.error("Brevo send failed:", details);
    return response.status(502).json({
      error: "Email could not be sent right now.",
    });
  }

  return response.status(200).json({ ok: true });
};
