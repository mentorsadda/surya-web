import { installConsultation } from "./consultation.mjs";
import "node:process";
try {
  process.loadEnvFile();
} catch {}
const {
  db,
  dataDir,
  id,
  now,
  hash,
  passwordHash,
  passwordOK,
  settings,
  record,
  records,
  saveRecord,
  audit,
  transaction,
  bootstrapMatches,
} = await import("./db.mjs");
const {
  queueEmail,
  emailTemplate,
  processOutbox,
  mailConfigured,
  unsubscribeValid,
  baseUrl,
} = await import("./mail.mjs");
import express from "express";
import helmet from "helmet";
import multer from "multer";
import sharp from "sharp";
import { join, resolve } from "node:path";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { createHmac, timingSafeEqual } from "node:crypto";
export const app = express();
const prod = process.env.NODE_ENV === "production";
app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: prod
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://checkout.razorpay.com"],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              "https://fonts.googleapis.com",
            ],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:", "https:"],
            connectSrc: ["'self'"],
            frameSrc: ["https://www.instagram.com", "https://api.razorpay.com"],
            upgradeInsecureRequests: null,
          },
        }
      : false,
  }),
);
app.use("/api", (_q, r, n) => {
  r.set("Cache-Control", "no-store");
  n();
});
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret)
      return res.status(503).json({ error: "Webhook not configured" });
    const expected = createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");
    const actual = req.get("x-razorpay-signature") || "";
    if (
      actual.length !== expected.length ||
      !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
    )
      return res.status(401).json({ error: "Invalid signature" });
    try {
      const event = JSON.parse(req.body),
        p = event.payload?.payment?.entity;
      if (p && event.event === "payment.captured")
        transaction(() => {
          const order = db
            .prepare("SELECT * FROM payments WHERE id=?")
            .get(p.order_id);
          if (
            order &&
            p.currency === "INR" &&
            p.amount === order.amount &&
            order.status !== "paid"
          ) {
            db.prepare(
              "UPDATE payments SET status='paid',provider_payment=? WHERE id=?",
            ).run(p.id, order.id);
            saveRecord(
              "enrolments",
              `enrol-${order.id}`,
              {
                programme: order.programme,
                status: "active",
                payment: order.id,
              },
              order.user_id,
            );
            audit("webhook", "payment.captured", order.id);
          }
        });
      if (p && event.event === "payment.failed")
        db.prepare(
          "UPDATE payments SET status='failed' WHERE id=? AND status!='paid'",
        ).run(p.order_id);
      if (event.event === "refund.processed") {
        const refund = event.payload?.refund?.entity;
        if (refund)
          saveRecord("refunds", refund.id, {
            payment: refund.payment_id,
            amount: refund.amount,
            status: "processed",
          });
      }
      res.json({ ok: true });
    } catch {
      res.status(400).json({ error: "Invalid event" });
    }
  },
);
app.use(express.json({ limit: "2mb" }));
const limits = new Map();
app.use("/api", (req, res, next) => {
  const key =
    (req.socket.remoteAddress || "") +
    ":" +
    (req.path.startsWith("/auth") ? "auth" : "api");
  const t = Date.now(),
    l = limits.get(key) || { n: 0, t };
  if (t - l.t > 60000) {
    l.n = 0;
    l.t = t;
  }
  l.n++;
  limits.set(key, l);
  if (limits.size > 2000)
    for (const [k, v] of limits) if (t - v.t > 60000) limits.delete(k);
  if (l.n > (req.path.startsWith("/auth") ? 30 : 300))
    return res
      .status(429)
      .json({ error: "Please wait a minute and try again." });
  if (!["GET", "HEAD"].includes(req.method)) {
    const origin = req.get("origin");
    if (origin) {
      try {
        if (
          new URL(origin).host !== req.get("host") &&
          origin !== process.env.PUBLIC_URL
        )
          return res.status(403).json({ error: "Invalid origin" });
      } catch {
        return res.status(403).json({ error: "Invalid origin" });
      }
    }
  }
  const cookie = req
    .get("cookie")
    ?.split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith("surya_session="))
    ?.split("=")[1];
  req.user = cookie
    ? db
        .prepare(
          "SELECT u.id,u.name,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>? AND u.active=1",
        )
        .get(hash(cookie), Date.now())
    : null;
  next();
});
const wrap = (fn) => (q, r, n) =>
  Promise.resolve()
    .then(() => fn(q, r))
    .catch(n);
const requireUser = (q, r, n) =>
  q.user ? n() : r.status(401).json({ error: "Please sign in." });
const staff = (q, r, n) =>
  ["admin", "coach", "editor"].includes(q.user?.role)
    ? n()
    : r.status(403).json({ error: "You do not have access." });
const coach = (q, r, n) =>
  ["admin", "coach"].includes(q.user?.role)
    ? n()
    : r.status(403).json({ error: "Coach access required." });
const admin = (q, r, n) =>
  q.user?.role === "admin"
    ? n()
    : r.status(403).json({ error: "Administrator access required." });
function fail(message, status = 400) {
  const e = new Error(message);
  e.status = status;
  throw e;
}
function text(v, max = 1000) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
const email = (v) => text(v, 254).toLowerCase();
function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function publicRecord(r) {
  return (
    r.status === "published" &&
    (!r.publishAt || Date.parse(r.publishAt) <= Date.now())
  );
}
function session(res, u) {
  const token = id() + id();
  db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
    hash(token),
    u.id,
    Date.now() + 7 * 86400000,
  );
  res.cookie("surya_session", token, {
    httpOnly: true,
    secure: prod,
    sameSite: "lax",
    maxAge: 7 * 86400000,
    path: "/",
  });
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}
installConsultation(app,{db,id,now,hash,records,saveRecord,record,transaction,audit,requireUser,coach,wrap,fail,text});
app.get("/api/health", (_q, r) =>
  r.json({ ok: true, project: "train-with-surya" }),
);
app.get("/api/public", (_q, r) =>
  r.json({
    settings: settings(),
    programmes: records("programmes")
      .filter(publicRecord)
      .sort((a, b) => a.order - b.order),
    articles: records("articles").filter(publicRecord),
    stories: records("stories").filter(
      (x) => publicRecord(x) && x.consent === true,
    ),
    testimonials: records("testimonials").filter(
      (x) => publicRecord(x) && x.consent === true,
    ),
    credentials: records("credentials").filter(publicRecord),
    exercises: records("exercises").filter(publicRecord),
    social: records("social").filter(publicRecord),
    user: null,
  }),
);
app.get("/api/auth/me", (q, r) =>
  r.json({
    user: q.user || null,
    setupRequired: !db.prepare("SELECT id FROM users WHERE role='admin'").get(),
  }),
);
app.post(
  "/api/auth/setup",
  wrap((q, r) => {
    if (db.prepare("SELECT id FROM users WHERE role='admin'").get())
      fail("Setup already completed.", 409);
    if (!bootstrapMatches(q.body.token)) fail("Invalid setup key.", 403);
    const e = email(q.body.email);
    if (!validEmail(e) || q.body.password?.length < 12)
      fail("Use a valid email and a password of at least 12 characters.");
    const u = {
      id: id(),
      email: e,
      name: text(q.body.name, 100) || "Surya Singh",
      role: "admin",
    };
    db.prepare(
      "INSERT INTO users(id,email,name,password,role,created) VALUES(?,?,?,?,?,?)",
    ).run(u.id, e, u.name, passwordHash(q.body.password), u.role, now());
    unlinkSync(join(dataDir, "bootstrap-token.txt"));
    audit(u.id, "account.setup");
    r.json({ user: session(r, u) });
  }),
);
app.post("/api/auth/register", wrap((q,r)=>{
 const name=text(q.body.name,100), mail=email(q.body.email), password=String(q.body.password||"");
 if(!name||!validEmail(mail)||password.length<12||password.length>200||q.body.terms!==true)fail("Enter your name, valid email and a password of 12–200 characters, and accept the privacy terms.");
 if(db.prepare("SELECT id FROM users WHERE email=?").get(mail))fail("Unable to create this account. Try signing in or resetting your password.");
 const u={id:id(),name,email:mail,role:"client"};
 db.prepare("INSERT INTO users(id,email,name,password,role,created) VALUES(?,?,?,?,?,?)").run(u.id,mail,name,passwordHash(password),"client",now());
 audit(u.id,"account.registered");r.json({user:session(r,u)});
}));
app.post(
  "/api/auth/login",
  wrap((q, r) => {
    const u = db
      .prepare("SELECT * FROM users WHERE email=? AND active=1")
      .get(email(q.body.email));
    if (!u || !passwordOK(String(q.body.password || ""), u.password))
      fail("Email or password is incorrect.", 401);
    audit(u.id, "account.login");
    r.json({ user: session(r, u) });
  }),
);
app.post("/api/auth/logout", (q, r) => {
  const token = q
    .get("cookie")
    ?.split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith("surya_session="))
    ?.split("=")[1];
  if (token) db.prepare("DELETE FROM sessions WHERE token=?").run(hash(token));
  r.clearCookie("surya_session");
  r.json({ ok: true });
});
app.post(
  "/api/auth/forgot",
  wrap((q, r) => {
    const u = db
      .prepare("SELECT * FROM users WHERE email=? AND active=1")
      .get(email(q.body.email));
    if (u) {
      const token = id() + id();
      db.prepare("INSERT INTO tokens VALUES(?,?,?,?)").run(
        hash(token),
        u.id,
        "reset",
        Date.now() + 3600000,
      );
      queueEmail({
        recipient: u.email,
        name: u.name,
        type: "reset",
        link: baseUrl() + "/reset?token=" + token,
        reference: id(),
      });
    }
    r.json({
      message:
        "If an account exists, a reset email will be sent when the email service is configured.",
    });
  }),
);
app.post(
  "/api/auth/reset",
  wrap((q, r) => {
    if (q.body.password?.length < 12) fail("Use at least 12 characters.");
    const t = db
      .prepare("SELECT * FROM tokens WHERE token=? AND expires>?")
      .get(hash(String(q.body.token)), Date.now());
    if (!t) fail("This link is invalid or expired.");
    transaction(() => {
      db.prepare("UPDATE users SET password=? WHERE id=?").run(
        passwordHash(q.body.password),
        t.user_id,
      );
      db.prepare("DELETE FROM tokens WHERE user_id=?").run(t.user_id);
      db.prepare("DELETE FROM sessions WHERE user_id=?").run(t.user_id);
      audit(t.user_id, "password.reset");
    });
    r.json({ ok: true });
  }),
);
function upsertLead(b, source) {
  const e = email(b.email),
    name = text(b.name, 100);
  if (!validEmail(e) || !name)
    fail("Please provide your name and a valid email.");
  const old = db.prepare("SELECT * FROM leads WHERE email=?").get(e);
  if (old) {
    db.prepare(
      "UPDATE leads SET name=?,phone=CASE WHEN ?!='' THEN ? ELSE phone END WHERE id=?",
    ).run(name, text(b.phone, 30), text(b.phone, 30), old.id);
    if (b.marketing && !old.suppressed)
      db.prepare("UPDATE leads SET marketing=1 WHERE id=?").run(old.id);
    saveRecord("lead_events", id(), {
      lead: old.id,
      source,
      message: text(b.message),
      programme: text(b.programme, 100),
    });
    return db.prepare("SELECT * FROM leads WHERE id=?").get(old.id);
  }
  const i = id();
  db.prepare(
    "INSERT INTO leads(id,email,name,phone,city,source,programme,message,marketing,created) VALUES(?,?,?,?,?,?,?,?,?,?)",
  ).run(
    i,
    e,
    name,
    text(b.phone, 30),
    text(b.city, 100),
    source,
    text(b.programme, 100),
    text(b.message),
    b.marketing ? 1 : 0,
    now(),
  );
  return db.prepare("SELECT * FROM leads WHERE id=?").get(i);
}
app.post(
  "/api/leads",
  wrap((q, r) => {
    if (q.body.website) fail("Unable to submit.");
    if (!q.body.contactConsent)
      fail("Please agree to be contacted about your enquiry.");
    const l = transaction(() =>
      upsertLead(
        q.body,
        ["inquiry", "newsletter", "finder", "popup"].includes(q.body.source)
          ? q.body.source
          : "inquiry",
      ),
    );
    queueEmail({
      leadId: l.id,
      recipient: l.email,
      name: l.name,
      type: q.body.source === "newsletter" ? "welcome" : "inquiry",
      marketing: q.body.source === "newsletter",
      reference: `${q.body.source || "inquiry"}:${l.id}`,
    });
    r.json({ ok: true, message: "Thank you. Your message is with Surya." });
  }),
);
app.post("/api/finder", (q, r) => {
  const s = settings();
  const ids = s.finderRules
    .filter((x) => q.body[x.field] === x.value)
    .map((x) => x.programme);
  if (!ids.length) ids.push("personal-training");
  const p = [...new Set(ids)]
    .map(record)
    .filter((x) => x && publicRecord(x))
    .slice(0, 2);
  r.json({
    programmes: p,
    reason:
      "These options match your chosen goal, location or coaching preference. Surya will help you confirm the right fit.",
  });
});
app.get("/api/slots", (_q, r) => {
  const s = settings();
  r.json({
    mode: s.bookingMode,
    slots: db
      .prepare(
        "SELECT * FROM slots WHERE start>? AND id NOT IN (SELECT slot_id FROM bookings WHERE slot_id IS NOT NULL AND status IN ('pending','confirmed')) ORDER BY start LIMIT 80",
      )
      .all(now()),
    duration: s.consultationMinutes,
  });
});
app.post(
  "/api/bookings",
  wrap((q, r) => {
    if (!q.body.contactConsent) fail("Please agree to be contacted.");
    if (q.body.website) fail("Unable to submit");
    const key = text(q.body.requestKey, 100);
    const result = transaction(() => {
      if (key && db.prepare("SELECT key FROM requests WHERE key=?").get(key))
        fail("This request was already received.", 409);
      const l = upsertLead(q.body, "booking");
      let slot = null;
      if (q.body.slot) {
        slot = db
          .prepare("SELECT * FROM slots WHERE id=? AND start>?")
          .get(q.body.slot, now());
        if (!slot || settings().bookingMode !== "slots")
          fail("This time is no longer available.", 409);
      }
      const i = id();
      try {
        db.prepare("INSERT INTO bookings VALUES(?,?,?,?,?,?,?,?)").run(
          i,
          l.id,
          q.user?.id || l.user_id || null,
          slot?.id || null,
          slot ? "confirmed" : "pending",
          text(q.body.preferred, 200),
          text(q.body.programme, 100),
          now(),
        );
      } catch {
        fail("This time was just booked. Please select another.", 409);
      }
      if (key)
        db.prepare("INSERT INTO requests VALUES(?,?)").run(key, Date.now());
      return { i, l, slot };
    });
    queueEmail({
      leadId: result.l.id,
      recipient: result.l.email,
      name: result.l.name,
      type: result.slot ? "confirmed" : "consultation",
      body: result.slot
        ? "Your consultation is confirmed for " +
          new Date(result.slot.start).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          }) +
          " IST. Surya will confirm meeting arrangements. Contact " +
          settings().email +
          " or +" +
          settings().whatsapp +
          " for help."
        : undefined,
      reference: "booking:" + result.i,
    });
    r.json({
      ok: true,
      status: result.slot ? "confirmed" : "pending",
      message: result.slot
        ? "Your consultation is confirmed."
        : "Your consultation request is saved. Surya will confirm a time.",
    });
  }),
);
app.get(
  "/api/unsubscribe",
  wrap((q, r) => {
    if (!unsubscribeValid(String(q.query.id), String(q.query.token)))
      fail("Invalid link");
    db.prepare("UPDATE leads SET marketing=0,suppressed=1 WHERE id=?").run(
      q.query.id,
    );
    r.json({ ok: true });
  }),
);
app.post("/api/analytics", (q, r) => {
  const events = [
    "page_view",
    "whatsapp_click",
    "programme_view",
    "finder_complete",
  ];
  if (
    events.includes(q.body.event) &&
    typeof q.body.path === "string" &&
    !/^\/(admin|dashboard|reset|setup)/.test(q.body.path)
  ) {
    db.prepare(
      "INSERT INTO analytics(event,path,session,referrer,device,created) VALUES(?,?,?,?,?,?)",
    ).run(
      q.body.event,
      text(q.body.path.split("?")[0], 200),
      hash(text(q.body.session, 100)),
      text(q.body.referrer, 200),
      text(q.body.device, 30),
      now(),
    );
  }
  r.json({ ok: true });
});
app.get(
  "/api/admin/overview",
  staff,
  wrap((q, r) => {
    const sensitive = q.user.role !== "editor";
    r.json({
      users: sensitive
        ? db
            .prepare("SELECT id,name,email,role,active,created FROM users")
            .all()
        : [],
      leads: sensitive
        ? db.prepare("SELECT * FROM leads ORDER BY created DESC").all()
        : [],
      bookings: sensitive
        ? db
            .prepare(
              "SELECT b.*,l.name,l.email,s.start,s.end FROM bookings b LEFT JOIN leads l ON b.lead_id=l.id LEFT JOIN slots s ON b.slot_id=s.id ORDER BY b.created DESC",
            )
            .all()
        : [],
      slots: sensitive
        ? db.prepare("SELECT * FROM slots ORDER BY start").all()
        : [],
      counts: {
        visits: db
          .prepare(
            "SELECT COUNT(*) AS n FROM analytics WHERE event='page_view'",
          )
          .get().n,
        sessions: db
          .prepare("SELECT COUNT(DISTINCT session) AS n FROM analytics")
          .get().n,
      },
      traffic: db
        .prepare(
          "SELECT path,COUNT(*) AS views FROM analytics GROUP BY path ORDER BY views DESC LIMIT 10",
        )
        .all(),
      audit:
        q.user.role === "admin"
          ? db.prepare("SELECT * FROM audit ORDER BY id DESC LIMIT 100").all()
          : [],
      settings: settings(),
      integrations: {
        email: mailConfigured(),
        payment: !!(
          process.env.RAZORPAY_KEY_ID &&
          process.env.RAZORPAY_KEY_SECRET &&
          process.env.RAZORPAY_WEBHOOK_SECRET
        ),
        ai: false,
      },
      media: db
        .prepare("SELECT * FROM media WHERE private=0 ORDER BY created DESC")
        .all(),
      payments: sensitive
        ? db.prepare("SELECT * FROM payments ORDER BY created DESC").all()
        : [],
    });
  }),
);
app.put(
  "/api/admin/settings",
  admin,
  wrap((q, r) => {
    const s = { ...settings(), ...q.body };
    delete s.password;
    if (s.travelCards && (!Array.isArray(s.travelCards) || s.travelCards.length > 20 || s.travelCards.some(c => !c || typeof c.location !== "string" || !c.location.trim() || c.location.length > 80 || typeof c.caption !== "string" || !c.caption.trim() || c.caption.length > 180 || typeof c.image !== "string" || !/^(\/(?!\/)|https:\/\/|data:image\/)/.test(c.image)))) fail("Travel cards need a valid photo, location (up to 80 characters) and caption (up to 180 characters).");

    if (s.policyOverrides) {
      for (const p of Object.values(s.policyOverrides)) {
        if (
          !p ||
          typeof p.title !== "string" ||
          typeof p.intro !== "string" ||
          !Array.isArray(p.sections) ||
          p.sections.some(
            (x) =>
              !Array.isArray(x) ||
              x.length !== 2 ||
              x.some((v) => typeof v !== "string"),
          )
        )
          fail(
            "Policy pages need a title, introduction and heading/text sections.",
          );
      }
    }
    for (const field of ["instagram", "facebook"])
      if (s[field] && !/^https:\/\//.test(s[field]))
        fail("Social links must use https.");
    if (
      !Array.isArray(s.hero) ||
      s.hero.length !== 3 ||
      !Array.isArray(s.sections)
    )
      fail("Keep three hero scenes and valid sections.");
    if (s.email && !validEmail(s.email)) fail("Invalid business email");
    s.consultationMinutes = Math.max(
      15,
      Math.min(180, Number(s.consultationMinutes) || 30),
    );
    s.bufferMinutes = Math.max(0, Math.min(60, Number(s.bufferMinutes) || 0));
    db.prepare("UPDATE settings SET data=? WHERE id=1").run(JSON.stringify(s));
    audit(q.user.id, "settings.update");
    r.json({ ok: true });
  }),
);
const kinds = [
  "programmes",
  "articles",
  "stories",
  "testimonials",
  "credentials",
  "exercises",
  "social",
  "plans",
  "enrolments",
  "checkins",
  "messages",
  "consents",
  "plan_templates",
  "privacy_requests",
];
const privateKinds = [
  "plans",
  "enrolments",
  "checkins",
  "messages",
  "consents",
  "plan_templates",
  "privacy_requests",
];
app.get(
  "/api/admin/records/:kind",
  staff,
  wrap((q, r) => {
    if (!kinds.includes(q.params.kind)) fail("Unknown module", 404);
    if (privateKinds.includes(q.params.kind) && q.user.role === "editor")
      fail("Access denied", 403);
    r.json(records(q.params.kind));
  }),
);
app.post(
  "/api/admin/records/:kind",
  staff,
  wrap((q, r) => {
    const kind = q.params.kind;
    if (!kinds.includes(kind)) fail("Unknown module", 404);
    if (privateKinds.includes(kind) && q.user.role === "editor")
      fail("Access denied", 403);
    const b = q.body;
    if (typeof b !== "object" || Array.isArray(b)) fail("Invalid record");
    const i = text(b.id, 100) || id();
    if (!/^[a-zA-Z0-9_-]+$/.test(i))
      fail("Use letters, numbers and hyphens in the identifier.");
    const old = record(i);
    if (old && old.kind !== kind) fail("Identifier already in use.", 409);
    if (
      ["stories", "testimonials"].includes(kind) &&
      b.status === "published" &&
      b.consent !== true
    )
      fail("Publication consent is required.");
    if (
      kind === "articles" &&
      b.status === "published" &&
      (!text(b.body) || !text(b.title))
    )
      fail("Add title and article content before publishing.");
    if (kind === "plans" && b.status === "published" && b.approved !== true)
      fail("A coach must approve the plan.");
    if (
      kind === "programmes" &&
      b.price != null &&
      (isNaN(Number(b.price)) || Number(b.price) <= 0)
    )
      fail("Use a positive price or leave it empty.");
    let owner = privateKinds.includes(kind) ? b.owner || null : null;
    if (
      owner &&
      !db
        .prepare("SELECT id FROM users WHERE id=? AND role='client'")
        .get(owner)
    )
      fail("Select an existing client.");
    if (["plans", "enrolments"].includes(kind) && !owner)
      fail("Select a client.");
    if (kind === "plans" && old)
      saveRecord("plan_versions", id(), old, old.owner);
    const saved = saveRecord(
      kind,
      i,
      { ...b, version: kind === "plans" ? (old?.version || 0) + 1 : b.version },
      owner,
    );
    audit(q.user.id, kind + ".save", i);
    if (kind === "plans" && b.status === "published") {
      const u = db.prepare("SELECT * FROM users WHERE id=?").get(owner);
      queueEmail({
        recipient: u.email,
        name: u.name,
        type: "plan",
        link: baseUrl() + "/dashboard",
        reference: "plan:" + i + ":" + saved.version,
      });
    }
    r.json(saved);
  }),
);
app.delete(
  "/api/admin/records/:id",
  staff,
  wrap((q, r) => {
    const old = record(q.params.id);
    if (!old || !kinds.includes(old.kind)) fail("Not found", 404);
    if (privateKinds.includes(old.kind) && q.user.role === "editor")
      fail("Access denied", 403);
    saveRecord(old.kind, old.id, { ...old, status: "archived" }, old.owner);
    audit(q.user.id, old.kind + ".archive", old.id);
    r.json({ ok: true });
  }),
);
app.post(
  "/api/admin/leads",
  coach,
  wrap((q, r) => r.json(upsertLead(q.body, "manual"))),
);
app.put(
  "/api/admin/leads/:id",
  coach,
  wrap((q, r) => {
    const l = db.prepare("SELECT * FROM leads WHERE id=?").get(q.params.id);
    if (!l) fail("Not found", 404);
    const b = q.body;
    db.prepare(
      "UPDATE leads SET status=?,notes=?,tags=?,follow_up=?,assigned=?,suppressed=? WHERE id=?",
    ).run(
      text(b.status, 30) || l.status,
      text(b.notes, 5000),
      text(b.tags, 200),
      text(b.follow_up, 40),
      text(b.assigned, 100),
      b.suppressed ? 1 : 0,
      l.id,
    );
    audit(q.user.id, "lead.update", l.id);
    r.json({ ok: true });
  }),
);
app.post(
  "/api/admin/import",
  coach,
  wrap((q, r) => {
    if (!Array.isArray(q.body.rows) || q.body.rows.length > 500)
      fail("Import up to 500 rows.");
    let imported = 0,
      invalid = 0;
    for (const row of q.body.rows) {
      try {
        upsertLead({ ...row, marketing: false }, "import");
        imported++;
      } catch {
        invalid++;
      }
    }
    audit(q.user.id, "leads.import", String(imported));
    r.json({ imported, invalid });
  }),
);
app.post(
  "/api/admin/invite",
  coach,
  wrap((q, r) => {
    const l = db.prepare("SELECT * FROM leads WHERE id=?").get(q.body.leadId);
    if (!l) fail("Lead not found", 404);
    let u = db.prepare("SELECT * FROM users WHERE email=?").get(l.email);
    if (u && u.role !== "client")
      fail("This email belongs to a staff account.");
    if (!u) {
      u = { id: id(), name: l.name, email: l.email, role: "client" };
      db.prepare(
        "INSERT INTO users(id,email,name,role,created) VALUES(?,?,?,?,?)",
      ).run(u.id, u.email, u.name, "client", now());
    }
    db.prepare("UPDATE leads SET user_id=?,status='Converted' WHERE id=?").run(
      u.id,
      l.id,
    );
    db.prepare("UPDATE bookings SET user_id=? WHERE lead_id=?").run(u.id, l.id);
    const token = id() + id();
    db.prepare("INSERT INTO tokens VALUES(?,?,?,?)").run(
      hash(token),
      u.id,
      "invite",
      Date.now() + 86400000,
    );
    queueEmail({
      leadId: l.id,
      recipient: u.email,
      name: u.name,
      type: "invite",
      link: baseUrl() + "/reset?token=" + token,
      reference: id(),
    });
    audit(q.user.id, "client.invite", u.id);
    r.json({
      ok: true,
      message: mailConfigured()
        ? "Invitation queued."
        : "Client created. Configure email to deliver the invitation.",
    });
  }),
);
app.post(
  "/api/admin/users",
  admin,
  wrap((q, r) => {
    const b = q.body;
    if (b.id) {
      if (b.id === q.user.id && (b.role !== "admin" || !b.active))
        fail("You cannot remove your own administrator access.");
      if (!["admin", "coach", "editor", "client"].includes(b.role))
        fail("Invalid role");
      db.prepare("UPDATE users SET role=?,active=? WHERE id=?").run(
        b.role,
        b.active ? 1 : 0,
        b.id,
      );
      db.prepare("DELETE FROM sessions WHERE user_id=?").run(b.id);
    } else {
      if (!validEmail(email(b.email))) fail("Valid email required");
      if (!["coach", "editor", "client"].includes(b.role)) fail("Invalid role");
      const i = id();
      db.prepare(
        "INSERT INTO users(id,email,name,role,created) VALUES(?,?,?,?,?)",
      ).run(i, email(b.email), text(b.name, 100), b.role, now());
      const token = id() + id();
      db.prepare("INSERT INTO tokens VALUES(?,?,?,?)").run(
        hash(token),
        i,
        "invite",
        Date.now() + 86400000,
      );
      queueEmail({
        recipient: email(b.email),
        name: b.name,
        type: "invite",
        link: baseUrl() + "/reset?token=" + token,
      });
    }
    audit(q.user.id, "user.update", b.id || b.email);
    r.json({ ok: true });
  }),
);
app.post(
  "/api/admin/slots",
  coach,
  wrap((q, r) => {
    const start = new Date(q.body.start);
    if (isNaN(start) || start < Date.now()) fail("Choose a future date.");
    const s = settings(),
      end = new Date(+start + s.consultationMinutes * 60000),
      buffer = s.bufferMinutes * 60000;
    if (
      db
        .prepare("SELECT id FROM slots WHERE start<? AND end>?")
        .get(
          new Date(+end + buffer).toISOString(),
          new Date(+start - buffer).toISOString(),
        )
    )
      fail("This time overlaps an existing slot or buffer.", 409);
    db.prepare("INSERT INTO slots VALUES(?,?,?)").run(
      id(),
      start.toISOString(),
      end.toISOString(),
    );
    r.json({ ok: true });
  }),
);
app.delete(
  "/api/admin/slots/:id",
  coach,
  wrap((q, r) => {
    if (db.prepare("SELECT id FROM bookings WHERE slot_id=?").get(q.params.id))
      fail("This slot has a booking. Update the booking first.");
    db.prepare("DELETE FROM slots WHERE id=?").run(q.params.id);
    r.json({ ok: true });
  }),
);
app.patch(
  "/api/bookings/:id",
  requireUser,
  wrap((q, r) => {
    const b = db
      .prepare(
        "SELECT b.*,s.start FROM bookings b LEFT JOIN slots s ON b.slot_id=s.id WHERE b.id=?",
      )
      .get(q.params.id);
    if (!b) fail("Not found", 404);
    const isCoach = ["admin", "coach"].includes(q.user.role);
    if (!isCoach && b.user_id !== q.user.id) fail("Access denied", 403);
    if (
      !isCoach &&
      b.start &&
      Date.parse(b.start) - Date.now() < settings().cancellationHours * 3600000
    )
      fail("Please contact Surya to change this appointment.");
    if (q.body.slot) {
      if (!isCoach) fail("Ask your coach to assign a new slot.", 403);
      if (
        !db
          .prepare("SELECT id FROM slots WHERE id=? AND start>?")
          .get(q.body.slot, now())
      )
        fail("Choose a future available slot.", 409);
    }
    const status = q.body.status;
    if (!["pending", "confirmed", "cancelled", "completed"].includes(status))
      fail("Invalid status");
    if (!isCoach && !["cancelled", "pending"].includes(status))
      fail("Access denied", 403);
    if (["cancelled", "completed"].includes(b.status))
      fail("This appointment is already closed.", 409);
    if (status === "confirmed" && !q.body.slot && !b.slot_id)
      fail("Assign an available slot before confirming.");
    try {
      db.prepare(
        "UPDATE bookings SET status=?,slot_id=?,preferred=? WHERE id=?",
      ).run(
        status,
        q.body.slot || (status === "pending" ? null : b.slot_id),
        text(q.body.preferred, 200) || b.preferred,
        b.id,
      );
    } catch {
      fail("Slot is unavailable.", 409);
    }
    const l = db.prepare("SELECT * FROM leads WHERE id=?").get(b.lead_id);
    queueEmail({
      leadId: l.id,
      recipient: l.email,
      name: l.name,
      type: status === "confirmed" ? "confirmed" : "reschedule",
      reference: id(),
    });
    audit(q.user.id, "booking." + status, b.id);
    r.json({ ok: true });
  }),
);
app.get(
  "/api/bookings/:id/calendar",
  requireUser,
  wrap((q, r) => {
    const b = db
      .prepare(
        "SELECT b.*,s.start,s.end FROM bookings b JOIN slots s ON s.id=b.slot_id WHERE b.id=?",
      )
      .get(q.params.id);
    if (!b) fail("Not found", 404);
    if (b.user_id !== q.user.id && !["admin", "coach"].includes(q.user.role))
      fail("Access denied", 403);
    const date = (s) => s.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    r.type("text/calendar")
      .attachment("surya-consultation.ics")
      .send(
        `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Train with Surya//Coaching//EN\r\nBEGIN:VEVENT\r\nUID:${b.id}@trainwithsurya\r\nDTSTAMP:${date(now())}\r\nDTSTART:${date(b.start)}\r\nDTEND:${date(b.end)}\r\nSUMMARY:Consultation with Surya Singh\r\nEND:VEVENT\r\nEND:VCALENDAR`,
      );
  }),
);
app.get("/api/admin/mail", coach, (_q, r) =>
  r.json(
    db
      .prepare(
        "SELECT id,lead_id,recipient,subject,template,marketing,status,reason,attempts,created FROM outbox ORDER BY created DESC LIMIT 200",
      )
      .all(),
  ),
);
app.get(
  "/api/admin/mail/:id/preview",
  coach,
  wrap((q, r) => {
    const m = db.prepare("SELECT html FROM outbox WHERE id=?").get(q.params.id);
    if (!m) fail("Not found", 404);
    r.json({ html: m.html });
  }),
);
app.post("/api/admin/mail/preview", coach, (q, r) =>
  r.json(emailTemplate(q.body.type, q.body.name || "there", q.body.body)),
);
app.post(
  "/api/admin/mail/send",
  coach,
  wrap((q, r) => {
    if (!Array.isArray(q.body.leadIds) || q.body.leadIds.length > 500)
      fail("Select up to 500 recipients.");
    const allowed = [
      "welcome",
      "inquiry",
      "enrolment",
      "checkin",
      "article",
      "manual",
    ];
    const types = (q.body.types || ["manual"]).filter((x) =>
      allowed.includes(x),
    );
    if (!types.length) fail("Select a valid template.");
    const campaign = text(q.body.campaign, 100) || id();
    let queued = 0;
    for (const leadId of new Set(q.body.leadIds)) {
      const l = db.prepare("SELECT * FROM leads WHERE id=?").get(leadId);
      if (!l) continue;
      for (const type of types) {
        queueEmail({
          leadId: l.id,
          recipient: l.email,
          name: l.name,
          type,
          body: q.body.body,
          subject: q.body.subject,
          marketing: true,
          reference: `campaign:${campaign}:${l.id}:${type}${q.body.force ? ":" + id() : ""}`,
        });
        queued++;
      }
    }
    audit(q.user.id, "campaign.queue", campaign);
    r.json({
      ok: true,
      count: queued,
      message: mailConfigured()
        ? "Campaign queued. Check each recipient status."
        : "Saved with setup required. Configure email before sending.",
    });
  }),
);
app.post(
  "/api/admin/mail/:id/retry",
  coach,
  wrap((q, r) => {
    const m = db.prepare("SELECT * FROM outbox WHERE id=?").get(q.params.id);
    if (!m) fail("Not found", 404);
    if (["accepted", "uncertain"].includes(m.status) && !q.body.force)
      fail("Explicit resend confirmation is required.");
    const l = m.lead_id
      ? db.prepare("SELECT * FROM leads WHERE id=?").get(m.lead_id)
      : null;
    if (m.marketing && (!l?.marketing || l?.suppressed))
      fail("Recipient is not eligible for marketing.");
    if (!mailConfigured()) fail("Configure SMTP before retrying.", 503);
    db.prepare("UPDATE outbox SET status='queued',reason=NULL WHERE id=?").run(
      m.id,
    );
    audit(q.user.id, "email.retry", m.id);
    r.json({ ok: true });
  }),
);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_q, f, cb) =>
    cb(null, ["image/jpeg", "image/png", "image/webp"].includes(f.mimetype)),
});
app.post(
  "/api/media",
  requireUser,
  upload.single("file"),
  wrap(async (q, r) => {
    if (!q.file) fail("Choose a JPG, PNG or WebP image, up to 8 MB.");
    const privateFile = q.user.role === "client" || q.body.private === "true";
    if (!privateFile && !["admin", "coach", "editor"].includes(q.user.role))
      fail("Access denied", 403);
    const i = id(),
      slug =
        text(q.body.keyword, 60)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") || "image";
    const file = `surya-singh-${slug}-${i}.webp`;
    const out = await sharp(q.file.buffer, { limitInputPixels: 40e6 })
      .rotate()
      .resize({
        width: 1800,
        height: 1800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 86 })
      .toFile(join(dataDir, "uploads", file));
    db.prepare("INSERT INTO media VALUES(?,?,?,?,?,?,?,?,?,?)").run(
      i,
      file,
      q.user.id,
      privateFile ? 1 : 0,
      text(q.body.alt, 200),
      text(q.body.source, 500),
      q.body.approved === "true" ? 1 : 0,
      out.width,
      out.height,
      now(),
    );
    audit(q.user.id, "media.upload", i);
    r.json({
      id: i,
      url: "/api/media/" + i,
      width: out.width,
      height: out.height,
    });
  }),
);
app.get(
  "/api/media/:id",
  wrap((q, r) => {
    const m = db.prepare("SELECT * FROM media WHERE id=?").get(q.params.id);
    if (!m) fail("Image not found", 404);
    if (
      m.private &&
      (!q.user ||
        (q.user.id !== m.owner && !["admin", "coach"].includes(q.user.role)))
    )
      fail("Access denied", 403);
    r.set(
      "Cache-Control",
      m.private ? "private, no-store" : "public, max-age=86400",
    );
    r.sendFile(join(dataDir, "uploads", m.file));
  }),
);
app.delete(
  "/api/media/:id",
  staff,
  wrap((q, r) => {
    const m = db.prepare("SELECT * FROM media WHERE id=?").get(q.params.id);
    if (!m) fail("Not found", 404);
    if (m.private && q.user.role === "editor") fail("Access denied", 403);
    if (
      db
        .prepare("SELECT id FROM records WHERE data LIKE ?")
        .get("%" + m.id + "%") ||
      JSON.stringify(settings()).includes(m.id)
    )
      fail("This image is in use. Replace its references first.");
    db.prepare("DELETE FROM media WHERE id=?").run(m.id);
    unlinkSync(join(dataDir, "uploads", m.file));
    audit(q.user.id, "media.delete", m.id);
    r.json({ ok: true });
  }),
);
app.get(
  "/api/client",
  requireUser,
  wrap((q, r) => {
    const owner = q.user.id;
    r.json({
      plans: records("plans", owner).filter((x) => x.status === "published"),
      enrolments: records("enrolments", owner),
      checkins: records("checkins", owner),
      messages: records("messages", owner),
      progress: records("progress", owner),
      completions: records("completions", owner),
      bookings: db
        .prepare(
          "SELECT b.*,s.start,s.end FROM bookings b LEFT JOIN slots s ON b.slot_id=s.id WHERE b.user_id=? ORDER BY b.created DESC",
        )
        .all(owner),
      payments: db.prepare("SELECT * FROM payments WHERE user_id=?").all(owner),
      user: q.user,
    });
  }),
);
app.post(
  "/api/client/privacy-request",
  requireUser,
  wrap((q, r) => {
    r.json(
      saveRecord(
        "privacy_requests",
        id(),
        {
          type: ["export", "delete", "correct"].includes(q.body.type)
            ? q.body.type
            : "export",
          note: text(q.body.note),
          status: "pending",
        },
        q.user.id,
      ),
    );
    audit(q.user.id, "privacy.request");
  }),
);
app.post(
  "/api/client/:kind",
  requireUser,
  wrap((q, r) => {
    const kind = q.params.kind;
    if (
      !["progress", "checkins", "messages", "completions", "consents"].includes(
        kind,
      )
    )
      fail("Unknown action", 404);
    const b = q.body;
    if (JSON.stringify(b).length > 15000) fail("Entry is too long");
    let data;
    if (kind === "progress") {
      const w = b.weight === "" || b.weight == null ? null : Number(b.weight);
      if (w !== null && (!Number.isFinite(w) || w < 20 || w > 400))
        fail("Enter a valid optional weight.");
      data = {
        date: text(b.date, 20) || now().slice(0, 10),
        weight: w,
        measurement: text(b.measurement, 100),
        note: text(b.note, 2000),
        photo: text(b.photo, 200),
      };
    } else if (kind === "completions") {
      const p = record(b.plan);
      if (!p || p.owner !== q.user.id || p.status !== "published")
        fail("Plan unavailable", 403);
      data = {
        plan: p.id,
        date: text(b.date, 20),
        completed: !!b.completed,
        note: text(b.note, 1000),
      };
    } else
      data = {
        title: text(b.title, 200),
        body: text(b.body, 5000),
        date: now(),
        status: "submitted",
      };
    if (data.photo) {
      const m = db
        .prepare("SELECT * FROM media WHERE id=?")
        .get(data.photo.split("/").pop());
      if (!m || !m.private || m.owner !== q.user.id)
        fail("Choose your own private image.");
    }
    const i =
      kind === "completions"
        ? `done-${q.user.id}-${data.plan}-${data.date}`
        : id();
    r.json(saveRecord(kind, i, data, q.user.id));
  }),
);
app.put(
  "/api/client/profile",
  requireUser,
  wrap((q, r) => {
    if (!text(q.body.name, 100)) fail("Name required");
    db.prepare("UPDATE users SET name=? WHERE id=?").run(
      text(q.body.name, 100),
      q.user.id,
    );
    if (q.body.password) {
      const u = db.prepare("SELECT * FROM users WHERE id=?").get(q.user.id);
      if (
        !passwordOK(String(q.body.currentPassword || ""), u.password) ||
        q.body.password.length < 12
      )
        fail(
          "Check current password and use 12+ characters for the new password.",
        );
      db.prepare("UPDATE users SET password=? WHERE id=?").run(
        passwordHash(q.body.password),
        q.user.id,
      );
      db.prepare("DELETE FROM sessions WHERE user_id=?").run(q.user.id);
      session(r, u);
    }
    if (typeof q.body.marketing === "boolean")
      db.prepare("UPDATE leads SET marketing=?,suppressed=? WHERE email=?").run(
        q.body.marketing ? 1 : 0,
        q.body.marketing ? 0 : 1,
        q.user.email,
      );
    audit(q.user.id, "profile.update");
    r.json({ ok: true });
  }),
);
app.get(
  "/api/client/export",
  requireUser,
  wrap((q, r) => {
    r.attachment("my-surya-data.json").json({
      user: q.user,
      records: db
        .prepare("SELECT * FROM records WHERE owner=?")
        .all(q.user.id)
        .map((x) => ({ ...x, data: JSON.parse(x.data) })),
    });
  }),
);
app.post(
  "/api/payments/order",
  requireUser,
  wrap(async (q, r) => {
    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET ||
      !process.env.RAZORPAY_WEBHOOK_SECRET
    )
      fail("Online payment is not yet configured.", 503);
    const p = record(q.body.programme);
    if (!p || p.kind !== "programmes" || !publicRecord(p) || !Number(p.price))
      fail("Please enquire about this programme.");
    const amount = Math.round(Number(p.price) * 100);
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_KEY_SECRET,
          ).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency: "INR", receipt: id() }),
    });
    const data = await response.json();
    if (!response.ok) fail("Unable to create payment. Please try later.", 502);
    db.prepare("INSERT INTO payments VALUES(?,?,?,?,?,?,?)").run(
      data.id,
      q.user.id,
      p.id,
      amount,
      "created",
      null,
      now(),
    );
    r.json({
      order: data,
      key: process.env.RAZORPAY_KEY_ID,
      name: q.user.name,
      email: q.user.email,
    });
  }),
);
app.get("/robots.txt", (_q, r) =>
  r
    .type("text/plain")
    .send(
      `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nDisallow: /api\nSitemap: ${baseUrl()}/sitemap.xml`,
    ),
);
app.get("/sitemap.xml", (_q, r) => {
  const paths = [
    "",
    "meet-surya",
    "programmes",
    "transformations",
    "journal",
    "contact",
    "book",
    ...records("programmes")
      .filter(publicRecord)
      .map((p) => "programmes/" + p.id),
    ...records("articles")
      .filter(publicRecord)
      .map((p) => "journal/" + p.id),
  ];
  r.type("application/xml").send(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${baseUrl()}/${p}</loc></url>`).join("")}</urlset>`,
  );
});
app.use("/api", (_q, r) => r.status(404).json({ error: "Not found" }));
app.use((e, q, r, n) => {
  console.error(e.message);
  r.status(e.status || 400).json({
    error: e.status
      ? e.message
      : e.code === "SQLITE_CONSTRAINT_UNIQUE"
        ? "This entry already exists."
        : "Unable to save this request. Check the fields and try again.",
  });
});
if (prod) {
  app.use(express.static(resolve("dist")));
  app.get("/{*path}", (_q, r) => r.sendFile(resolve("dist/index.html")));
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true, hmr: { port: Number(process.env.PORT || 3040) + 21000 } },
    appType: "spa",
  });
  app.use(vite.middlewares);
}
const port = Number(process.env.PORT || 3040),
  host = process.env.HOST || "127.0.0.1";
app.listen(port, host, () => {
  console.log(`Train with Surya: http://${host}:${port}`);
  if (existsSync(join(dataDir, "bootstrap-token.txt")))
    console.log(
      "First-time admin setup key is in " +
        join(dataDir, "bootstrap-token.txt"),
    );
});
const timer = setInterval(() => {
  processOutbox().catch(console.error);
  const horizon = new Date(
    Date.now() + settings().reminderHours * 3600000,
  ).toISOString();
  for (const b of db
    .prepare(
      "SELECT b.*,s.start,l.email,l.name FROM bookings b JOIN slots s ON s.id=b.slot_id JOIN leads l ON l.id=b.lead_id WHERE b.status='confirmed' AND s.start>? AND s.start<?",
    )
    .all(now(), horizon))
    queueEmail({
      leadId: b.lead_id,
      recipient: b.email,
      name: b.name,
      type: "reminder",
      reference: "reminder:" + b.id + ":" + b.start,
    });
}, 30000);
timer.unref();
