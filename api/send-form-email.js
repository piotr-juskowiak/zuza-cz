const CONTACT_TO = process.env.RESEND_TO || "kontakt@zuzanna-czuprynska.pl";
const CONTACT_FROM =
  process.env.RESEND_FROM || "Formularze WWW <kontakt@zuzanna-czuprynska.pl>";

const MAX_FIELD_LENGTH = 2000;

function sanitize(value, maxLength = MAX_FIELD_LENGTH) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizeMultiline(value, maxLength = 8000) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return sanitizeMultiline(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function row(label, value) {
  const cleanValue = value || "-";

  return `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #e7dfd0;color:#6b655a;width:170px;">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #e7dfd0;color:#182d25;">${escapeHtml(cleanValue)}</td>
    </tr>
  `;
}

function layout(title, intro, rows, message) {
  return `
    <div style="font-family:Arial,sans-serif;background:#f8f6f1;padding:28px;color:#182d25;">
      <div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #e4d8c0;">
        <div style="padding:26px 28px;border-bottom:3px solid #c5a065;">
          <p style="margin:0 0 8px;color:#c5a065;text-transform:uppercase;letter-spacing:2px;font-size:12px;">Zuzanna Czuprynska</p>
          <h1 style="margin:0;font-size:24px;font-weight:400;color:#182d25;">${escapeHtml(title)}</h1>
          <p style="margin:12px 0 0;color:#6b655a;line-height:1.55;">${escapeHtml(intro)}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
        ${
          message
            ? `<div style="padding:24px 28px;">
                <h2 style="margin:0 0 12px;font-size:16px;color:#182d25;">Wiadomosc</h2>
                <div style="line-height:1.65;color:#182d25;">${escapeHtml(message)}</div>
              </div>`
            : ""
        }
      </div>
    </div>
  `;
}

function textLine(label, value) {
  return `${label}: ${value || "-"}`;
}

function buildContactEmail(payload) {
  const name = sanitize(payload.name, 120);
  const surname = sanitize(payload.surname, 120);
  const email = sanitize(payload.email, 250);
  const phone = sanitize(payload.phone, 80);
  const subject = sanitize(payload.subject || payload.subjectLabel, 180);
  const message = sanitizeMultiline(payload.message, 8000);
  const newsletter = payload.newsletter ? "Tak" : "Nie";
  const pageUrl = sanitize(payload.pageUrl, 500);

  if (!isEmail(email)) {
    throw new Error("INVALID_EMAIL");
  }

  if (!message) {
    throw new Error("EMPTY_MESSAGE");
  }

  const title = "Nowa wiadomosc z formularza kontaktowego";
  const emailSubject = subject
    ? `Nowa wiadomosc ze strony: ${subject}`
    : "Nowa wiadomosc ze strony";

  const rows =
    row("Imie i nazwisko", `${name} ${surname}`.trim()) +
    row("Email", email) +
    row("Telefon", phone) +
    row("Temat", subject) +
    row("Newsletter", newsletter) +
    row("Strona", pageUrl);

  const text = [
    title,
    "",
    textLine("Imie i nazwisko", `${name} ${surname}`.trim()),
    textLine("Email", email),
    textLine("Telefon", phone),
    textLine("Temat", subject),
    textLine("Newsletter", newsletter),
    textLine("Strona", pageUrl),
    "",
    "Wiadomosc:",
    message,
  ].join("\n");

  return {
    subject: emailSubject,
    replyTo: email,
    html: layout(title, "Formularz kontaktowy zostal wypelniony na stronie.", rows, message),
    text,
  };
}

function buildNewsletterEmail(payload) {
  const email = sanitize(payload.email, 250);
  const source = sanitize(payload.source, 120) || "newsletter_form";
  const pageUrl = sanitize(payload.pageUrl, 500);

  if (!isEmail(email)) {
    throw new Error("INVALID_EMAIL");
  }

  const title = "Nowy zapis do newslettera";
  const rows =
    row("Email", email) +
    row("Zrodlo", source) +
    row("Strona", pageUrl);

  const text = [
    title,
    "",
    textLine("Email", email),
    textLine("Zrodlo", source),
    textLine("Strona", pageUrl),
  ].join("\n");

  return {
    subject: "Nowy zapis do newslettera",
    replyTo: email,
    html: layout(title, "Nowy adres zostal zapisany przez formularz newslettera.", rows),
    text,
  };
}

function buildRecruitmentEmail(payload) {
  const name = sanitize(payload.name, 160);
  const age = sanitize(payload.age, 20);
  const address = sanitize(payload.address, 300);
  const email = sanitize(payload.email, 250);
  const phone = sanitize(payload.phone, 80);
  const facebook = sanitize(payload.facebook, 500);
  const team = sanitize(payload.team, 160);
  const motivation = sanitizeMultiline(payload.motivation, 8000);
  const experience = sanitizeMultiline(payload.experience, 8000);
  const consent = payload.consent ? "Tak" : "Nie";
  const pageUrl = sanitize(payload.pageUrl, 500);

  if (!name || !age || !address || !isEmail(email) || !phone || !facebook || !team) {
    throw new Error("INVALID_RECRUITMENT_FORM");
  }

  if (!motivation || !experience) {
    throw new Error("EMPTY_RECRUITMENT_MESSAGE");
  }

  if (!payload.consent) {
    throw new Error("RECRUITMENT_CONSENT_REQUIRED");
  }

  const title = "Nowe zgloszenie do BeeHouses Foundation";
  const rows =
    row("Imie i nazwisko", name) +
    row("Wiek", age) +
    row("Adres", address) +
    row("Email", email) +
    row("Telefon", phone) +
    row("Facebook", facebook) +
    row("Zespol", team) +
    row("Zgoda RODO i wizerunek", consent) +
    row("Strona", pageUrl);

  const message = [
    "Dlaczego chce dolaczyc do Fundacji:",
    motivation,
    "",
    "Doswiadczenie w dzialalnosci spolecznej:",
    experience,
  ].join("\n");

  const text = [
    title,
    "",
    textLine("Imie i nazwisko", name),
    textLine("Wiek", age),
    textLine("Adres", address),
    textLine("Email", email),
    textLine("Telefon", phone),
    textLine("Facebook", facebook),
    textLine("Zespol", team),
    textLine("Zgoda RODO i wizerunek", consent),
    textLine("Strona", pageUrl),
    "",
    message,
  ].join("\n");

  return {
    subject: "Nowe zgloszenie do BeeHouses Foundation",
    replyTo: email,
    html: layout(title, "Formularz rekrutacyjny zostal wypelniony na stronie.", rows, message),
    text,
  };
}

async function sendViaResend(email) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY_MISSING");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      subject: email.subject,
      reply_to: email.replyTo,
      html: email.html,
      text: email.text,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || "RESEND_SEND_FAILED");
  }

  return body;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
    return;
  }

  try {
    const { type, payload = {} } = req.body || {};
    let email;

    if (type === "contact") {
      email = buildContactEmail(payload);
    } else if (type === "newsletter") {
      email = buildNewsletterEmail(payload);
    } else if (type === "recruitment") {
      email = buildRecruitmentEmail(payload);
    } else {
      res.status(400).json({ ok: false, error: "INVALID_FORM_TYPE" });
      return;
    }

    const result = await sendViaResend(email);
    res.status(200).json({ ok: true, id: result.id || null });
  } catch (error) {
    console.error("Form email error:", error.message);
    res.status(500).json({ ok: false, error: "EMAIL_SEND_FAILED" });
  }
};
