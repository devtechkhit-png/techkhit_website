require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

// Allow all origins since Vercel is proxying it (and we don't know the exact random Vercel Edge IP)
app.use(cors());

app.post('/api/send-email', async (req, res) => {
  console.log("Received email request...");

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "TechKhit Website";
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const toName = process.env.CONTACT_TO_NAME || "TechKhit Team";

  if (!apiKey || !senderEmail || !toEmail) {
    console.error("Missing environment variables!");
    return res.status(500).json({ error: "Email service is not configured." });
  }

  const { name, email, phone, focus, message, page } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const subject = `New TechKhit inquiry${page ? `: ${page}` : ""}`;
  
  const field = (label, value) => {
    if (!value) return "";
    const escaped = String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<p><strong>${label}:</strong> ${escaped}</p>`;
  };

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
        <p>${String(message).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\n/g, "<br>")}</p>
      </body>
    </html>
  `;

  try {
    // Dynamic import for fetch if using older node, but node 18+ has it globally
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        subject,
        sender: { name: senderName, email: senderEmail },
        to: [{ name: toName, email: toEmail }],
        replyTo: { name, email },
        htmlContent,
      }),
    });

    if (!brevoResponse.ok) {
      const details = await brevoResponse.text();
      console.error("Brevo send failed:", details);
      return res.status(502).json({ error: "Email could not be sent right now." });
    }

    console.log("Email sent successfully!");
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`VPS Email Server running on port ${PORT}`);
});
