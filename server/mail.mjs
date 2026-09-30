import nodemailer from "nodemailer";
import { db, settings, records, now, id, hash } from "./db.mjs";
export const escape = (x) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const mailConfigured = () =>
  !!(process.env.SMTP_HOST && process.env.MAIL_FROM);
export const baseUrl = () =>
  process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3040}`;
const templates = {
  welcome: [
    "Welcome to your stronger chapter.",
    "Thank you for joining us. Expect thoughtful coaching insights, practical ideas and a little encouragement for the journey ahead.",
  ],
  inquiry: [
    "Let’s find your starting point.",
    "Thank you for getting in touch. Your enquiry is safely with Surya. She will follow up to learn more about your goals and the support that fits your life.",
  ],
  consultation: [
    "Your consultation request is with Surya.",
    "We have received your consultation request. Check your appointment status for confirmation and details.",
  ],
  confirmed: [
    "Your consultation is confirmed.",
    "Your time with Surya is confirmed. Visit your dashboard for the date and details.",
  ],
  reminder: [
    "A little reminder for your consultation.",
    "Your consultation is coming up. You can find the details in your dashboard.",
  ],
  reschedule: [
    "Your appointment has been updated.",
    "Please check your latest appointment details in your dashboard.",
  ],
  enrolment: [
    "Welcome to coaching with Surya.",
    "Your coaching journey starts with a conversation and a plan that fits you. Use your secure client dashboard to see your programme and next steps.",
  ],
  plan: [
    "Your coaching plan is ready.",
    "Surya has shared an updated plan with you. Sign in to your secure dashboard to view it.",
  ],
  checkin: [
    "Time for a little check-in.",
    "How has your week been? Share your progress and questions securely in your dashboard.",
  ],
  article: [
    "A new read for your stronger everyday.",
    "There is something new in the journal. Take a moment to explore the latest article.",
  ],
  reset: [
    "Reset your password.",
    "Use the secure, time-limited link below to choose a new password. If you did not request this, you can ignore this email.",
  ],
  invite: [
    "Your invitation to Train with Surya.",
    "Your client account is ready to set up. Choose a password using the secure link below.",
  ],
};
export function emailTemplate(type, name, body, link, unsubscribe) {
  const s = settings(),
    t = templates[type] || ["A note from Surya", ""];
  const url = baseUrl();
  const blogs = ["welcome", "article", "inquiry", "manual"].includes(type)
    ? records("articles")
        .filter(
          (a) =>
            a.status === "published" &&
            (!a.publishAt || Date.parse(a.publishAt) <= Date.now()),
        )
        .slice(0, 2)
    : [];
  return {
    subject: t[0],
    html: `<!doctype html><html><body style="margin:0;background:#edf4f8;font-family:Arial,sans-serif;color:#173342"><table role="presentation" width="100%"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="640" style="width:100%;max-width:640px;background:#fff"><tr><td style="background:#23485e;padding:36px;color:#fff"><p style="letter-spacing:3px;font-size:12px">TRAIN WITH SURYA</p><h1 style="font-size:32px;line-height:1.15">${escape(t[0])}</h1><img width="120" height="120" style="object-fit:cover;border-radius:60px" src="${escape(new URL(s.portrait || "/images/surya-portrait.jpg", url).href)}" alt="Surya Singh"/></td></tr><tr><td style="padding:36px;line-height:1.8"><p>Hi ${escape(name || "there")},</p><p>${escape(body || t[1]).replace(/\n/g, "<br/>")}</p><p><a href="${escape(link || url + "/programmes")}" style="background:#386982;color:#fff;padding:14px 22px;display:inline-block;text-decoration:none;border-radius:6px">${["reset", "invite"].includes(type) ? "Set your password" : "Visit your stronger chapter"} →</a></p><h3>How can I help you?</h3><p>Reply with your questions. We can find your next step together.</p><p>Warmly,<br/><strong style="font-family:Georgia,serif;font-style:italic;font-size:25px">Surya Singh</strong><br/>Personal Trainer &amp; Fitness Coach<br/>Train With Surya</p>${blogs.map((a) => `<a href="${url}/journal/${escape(a.id)}" style="display:block;color:#23485e;text-decoration:none;margin:20px 0">${a.image ? `<img width="240" style="max-width:100%" src="${escape(new URL(a.image, url).href)}" alt="${escape(a.title)}"/>` : ""}<h3>${escape(a.title)}</h3>Read Story →</a>`).join("")}</td></tr><tr><td style="padding:24px;background:#173342;color:#fff;text-align:center">Stronger every day. With Surya.${unsubscribe ? `<p><a href="${escape(unsubscribe)}" style="color:#b6dcf1">Unsubscribe from marketing</a></p>` : ""}</td></tr></table></td></tr></table></body></html>`,
  };
}
export function queueEmail({
  leadId = null,
  recipient,
  name,
  type = "manual",
  body,
  link,
  subject,
  marketing = false,
  reference,
}) {
  const lead = leadId
    ? db.prepare("SELECT * FROM leads WHERE id=?").get(leadId)
    : null;
  const unsub = lead
    ? `${baseUrl()}/unsubscribe?token=${hash(lead.id + ":" + getMailSecret())}&id=${lead.id}`
    : null;
  const t = emailTemplate(type, name, body, link, marketing ? unsub : null);
  const blocked = marketing && (!lead || !lead.marketing || lead.suppressed);
  const status = blocked
    ? "skipped"
    : mailConfigured()
      ? "queued"
      : "setup_required";
  const i = id();
  db.prepare(
    "INSERT OR IGNORE INTO outbox(id,lead_id,recipient,subject,html,template,marketing,status,reason,reference,created) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
  ).run(
    i,
    leadId,
    recipient,
    subject || t.subject,
    t.html,
    type,
    marketing ? 1 : 0,
    status,
    blocked
      ? "Recipient is not eligible for marketing"
      : mailConfigured()
        ? null
        : "Email provider is not configured",
    reference || id(),
    now(),
  );
  return i;
}
function getMailSecret() {
  let r = db.prepare("SELECT data FROM records WHERE id='mail-secret'").get();
  if (!r) {
    db.prepare("INSERT INTO records VALUES(?,?,?,?,?,?)").run(
      "mail-secret",
      "internal",
      null,
      JSON.stringify({ value: id() + id() }),
      now(),
      now(),
    );
    r = db.prepare("SELECT data FROM records WHERE id='mail-secret'").get();
  }
  return JSON.parse(r.data).value;
}
export function unsubscribeValid(lead, token) {
  return token === hash(lead + ":" + getMailSecret());
}
let working = false;
export async function processOutbox() {
  if (working || !mailConfigured()) return;
  working = true;
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure:
        process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
      connectionTimeout: 10000,
    });
    for (const m of db
      .prepare("SELECT * FROM outbox WHERE status='queued' LIMIT 10")
      .all()) {
      const l = m.lead_id
        ? db.prepare("SELECT * FROM leads WHERE id=?").get(m.lead_id)
        : null;
      if (m.marketing && (!l?.marketing || l?.suppressed)) {
        db.prepare(
          "UPDATE outbox SET status='skipped',reason='Unsubscribed or suppressed' WHERE id=?",
        ).run(m.id);
        continue;
      }
      db.prepare(
        "UPDATE outbox SET status='sending',attempts=attempts+1 WHERE id=?",
      ).run(m.id);
      try {
        const result = await transport.sendMail({
          from: process.env.MAIL_FROM,
          to: m.recipient,
          subject: m.subject,
          html: m.html,
        });
        db.prepare(
          "UPDATE outbox SET status='accepted',provider_id=?,reason=NULL WHERE id=?",
        ).run(result.messageId, m.id);
      } catch (e) {
        db.prepare("UPDATE outbox SET status='failed',reason=? WHERE id=?").run(
          String(e.message).slice(0, 250),
          m.id,
        );
      }
    }
  } finally {
    working = false;
  }
}
// Do not automatically resend messages interrupted during a provider call.
db.prepare(
  "UPDATE outbox SET status='uncertain',reason='Server restarted during send; check provider before retry' WHERE status='sending'",
).run();
