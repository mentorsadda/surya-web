import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { createHash, scryptSync, createHmac } from "node:crypto";
const data = mkdtempSync(join(tmpdir(), "surya-qa-"));
const port = 13040;
const base = `http://127.0.0.1:${port}`;
let child, db;
let logs = "";
const hash = (x) => createHash("sha256").update(x).digest("hex");
async function call(path, body, cookie = "", method = body ? "POST" : "GET") {
  const r = await fetch(base + "/api" + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return {
    status: r.status,
    data,
    cookie: r.headers.get("set-cookie")?.split(";")[0],
  };
}
async function start() {
  child = spawn(process.execPath, ["server/index.mjs"], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      DATA_DIR: data,
      PORT: String(port),
      PUBLIC_URL: base,
      SMTP_HOST: "",
      MAIL_FROM: "",
      RAZORPAY_WEBHOOK_SECRET: "test-only-secret",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (x) => (logs += x));
  child.stderr.on("data", (x) => (logs += x));
  for (let n = 0; n < 80; n++) {
    try {
      if ((await call("/health")).status === 200) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw Error(logs);
}
async function stop() {
  await new Promise((r) => {
    child.once("exit", r);
    child.kill();
  });
}
test("secure coaching workflows and durable persistence", async (t) => {
  try {
    await start();
    db = new DatabaseSync(join(data, "surya.sqlite"));
    const setup = await call("/auth/setup", {
      token: readFileSync(join(data, "bootstrap-token.txt"), "utf8"),
      name: "QA Admin",
      email: "admin@example.test",
      password: "Test-only-password-123!",
    });
    assert.equal(setup.status, 200);
    const admin = setup.cookie;
    await t.test("business contact and public drafts", async () => {
      const p = (await call("/public")).data;
      assert.equal(p.settings.whatsapp, "918299375609");
      assert.equal(p.settings.email, "surya737singh@gmail.com");
      assert.equal(p.programmes.length, 5);
      assert.equal(p.articles.length, 6);
      assert.equal(p.credentials.length, 0);
    });
    await t.test("travel gallery admin edits persist and reject invalid cards", async () => {
      const before=(await call("/public")).data.settings;
      const cards=before.travelCards.map((c,i)=>i===0?{...c,location:"Mumbai, India",caption:"QA saved caption"}:c);
      assert.equal((await call("/admin/settings",{travelCards:cards},admin,"PUT")).status,200);
      const saved=(await call("/public")).data.settings.travelCards;
      assert.equal(saved[0].caption,"QA saved caption");
      assert.equal(saved[1].location,"Goa, India");
      assert.equal((await call("/admin/settings",{travelCards:[{image:"javascript:bad",location:"",caption:"x"}]},admin,"PUT")).status,400);
      assert.equal((await call("/admin/settings",{travelCards:cards},"","PUT")).status,403);
    });
    const fixture = (id, role) => {
      const salt = "test-only-salt";
      db.prepare(
        "INSERT INTO users(id,email,name,password,role,created) VALUES(?,?,?,?,?,?)",
      ).run(
        id,
        id + "@example.test",
        id,
        salt +
          ":" +
          scryptSync("Test-only-password-123!", salt, 64).toString("hex"),
        role,
        new Date().toISOString(),
      );
      const token = "test-only-" + id;
      db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
        hash(token),
        id,
        Date.now() + 3600000,
      );
      return "surya_session=" + token;
    };
    const client = fixture("client-a", "client"),
      other = fixture("client-b", "client"),
      editor = fixture("editor-a", "editor");
    await t.test("consultation privacy, diary lifecycle, imports and registration", async()=>{
      assert.equal((await call('/client/health')).status,401);
      const intake={age:30,height:165,weight:65,goal:'Build a consistent routine',consent:true};
      assert.equal((await call('/client/consultation',{...intake,consent:false},client)).status,400);
      assert.equal((await call('/client/consultation',{...intake,age:12},client)).status,400);
      assert.equal((await call('/client/consultation',intake,client)).status,200);
      assert.equal((await call('/client/health',undefined,other)).data.intakes.length,0);
      assert.equal((await call('/admin/clients/client-a/health',undefined,editor)).status,403);
      assert.equal((await call('/admin/clients/client-a/health',undefined,other)).status,403);
      assert.equal((await call('/admin/clients/client-a/health',undefined,admin)).data.intakes.length,1);
      const row=(await call('/client/health/entry',{date:'2026-01-01',weight:65,steps:5000},client)).data;
      assert.equal((await call('/client/health/entry/'+row.id,{date:'2026-01-01',weight:66},other,'PUT')).status,404);
      assert.equal((await call('/client/health/entry/'+row.id,{date:'2026-01-01',weight:66},client,'PUT')).data.weight,66);
      assert.equal((await call('/client/health/entry',{date:'2026-99-99',weight:65},client)).status,400);
      const batch={entries:[{date:'2026-01-02',weight:64}],source:'Apple Health XML · weight',consent:true};
      assert.equal((await call('/client/health/import',batch,client)).data.added,1);
      assert.equal((await call('/client/health/import',batch,client)).data.skipped,1);
      assert.equal((await call('/client/health/import',{...batch,entries:[{date:'2026-01-03',weight:63},{date:'bad',weight:64}]},client)).status,400);
      assert.equal((await call('/client/health',undefined,client)).data.entries.length,2);
      assert.equal((await call('/client/health/health_diary/'+row.id,{},other,'DELETE')).status,404);
      assert.equal((await call('/client/health/health_diary/'+row.id,{},client,'DELETE')).status,200);
      const reg=await call('/auth/register',{name:'QA New',email:'new@example.test',password:'Test-only-password-123!',terms:true,role:'admin'});
      assert.equal(reg.status,200);assert.equal(reg.data.user.role,'client');
      assert.equal((await call('/auth/login',{email:'new@example.test',password:'Test-only-password-123!'})).status,200);
      assert.equal((await call('/public')).data.consultations,undefined);
    });
    await t.test(
      "authentication, role boundaries and origin protection",
      async () => {
        assert.equal((await call("/admin/overview")).status, 403);
        assert.equal(
          (await call("/admin/settings", {}, client, "PUT")).status,
          403,
        );
        assert.equal(
          (await call("/admin/records/plans", null, editor)).status,
          403,
        );
        const r = await fetch(base + "/api/leads", {
          method: "POST",
          headers: {
            Origin: "https://untrusted.example",
            "Content-Type": "application/json",
          },
          body: "{}",
        });
        assert.equal(r.status, 403);
        assert.equal(
          (
            await call("/auth/login", {
              email: "admin@example.test",
              password: "wrong",
            })
          ).status,
          401,
        );
      },
    );
    const lead = {
      name: "QA Client",
      email: "client-a@example.test",
      phone: "0000000000",
      programme: "online-coaching",
      contactConsent: true,
      marketing: true,
    };
    await t.test(
      "lead deduplication, explicit consent and email delivery state",
      async () => {
        assert.equal(
          (await call("/leads", { ...lead, contactConsent: false })).status,
          400,
        );
        assert.equal((await call("/leads", lead)).status, 200);
        assert.equal((await call("/leads", lead)).status, 200);
        assert.equal(db.prepare("SELECT count(*) AS n FROM leads").get().n, 1);
        assert.equal(db.prepare("SELECT count(*) AS n FROM outbox").get().n, 1);
        assert.equal(
          db.prepare("SELECT status FROM outbox").get().status,
          "setup_required",
        );
      },
    );
    await t.test(
      "concurrent slot requests, request dedupe and closed appointment guards",
      async () => {
        await call("/admin/settings", { bookingMode: "slots" }, admin, "PUT");
        const start = new Date(Date.now() + 4 * 86400000).toISOString();
        assert.equal(
          (await call("/admin/slots", { start }, admin)).status,
          200,
        );
        assert.equal(
          (await call("/admin/slots", { start }, admin)).status,
          409,
        );
        const slot = (await call("/slots")).data.slots[0].id;
        const result = await Promise.all([
          call("/bookings", { ...lead, slot, requestKey: "booking-a" }, client),
          call(
            "/bookings",
            {
              ...lead,
              email: "different@example.test",
              slot,
              requestKey: "booking-b",
            },
            other,
          ),
        ]);
        assert.deepEqual(result.map((x) => x.status).sort(), [200, 409]);
        const b = db.prepare("SELECT * FROM bookings").get();
        assert.equal(
          (
            await call(
              "/bookings",
              {
                ...lead,
                requestKey:
                  b.user_id === "client-a" ? "booking-a" : "booking-b",
              },
              client,
            )
          ).status,
          409,
        );
        assert.equal(
          (
            await call(
              "/bookings/" + b.id,
              { status: "cancelled" },
              b.user_id === "client-a" ? other : client,
              "PATCH",
            )
          ).status,
          403,
        );
        assert.equal(
          (await call("/bookings/" + b.id + "/calendar", null, editor)).status,
          403,
        );
        assert.equal(
          (
            await call(
              "/bookings/" + b.id,
              { status: "cancelled" },
              admin,
              "PATCH",
            )
          ).status,
          200,
        );
        assert.equal(
          (
            await call(
              "/bookings/" + b.id,
              { status: "confirmed", slot },
              admin,
              "PATCH",
            )
          ).status,
          409,
        );
      },
    );
    await t.test("coach approval and per-client plan ownership", async () => {
      const plan = {
        id: "test-plan",
        title: "QA workout",
        owner: "client-a",
        type: "workout",
        status: "published",
        items: [],
      };
      assert.equal(
        (await call("/admin/records/plans", plan, admin)).status,
        400,
      );
      assert.equal(
        (await call("/admin/records/plans", { ...plan, approved: true }, admin))
          .status,
        200,
      );
      assert.equal((await call("/client", null, client)).data.plans.length, 1);
      assert.equal((await call("/client", null, other)).data.plans.length, 0);
      assert.equal(
        (
          await call(
            "/client/completions",
            { plan: plan.id, date: "2026-09-29", completed: true },
            other,
          )
        ).status,
        403,
      );
      assert.equal(
        (
          await call(
            "/client/progress",
            { weight: 68, note: "QA private" },
            client,
          )
        ).status,
        200,
      );
      assert.equal(
        (await call("/client", null, other)).data.progress.length,
        0,
      );
      assert.equal(
        (
          await call(
            "/admin/records/stories",
            { title: "Consent gate", status: "published" },
            admin,
          )
        ).status,
        400,
      );
    });
    await t.test(
      "privacy requests visible only to coaching staff",
      async () => {
        assert.equal(
          (await call("/client/privacy-request", { type: "delete" }, client))
            .status,
          200,
        );
        assert.equal(
          (await call("/admin/records/privacy_requests", null, admin)).data
            .length,
          1,
        );
        assert.equal(
          (await call("/admin/records/privacy_requests", null, editor)).status,
          403,
        );
      },
    );
    await t.test("marketing suppression and campaign dedupe", async () => {
      const l = db.prepare("SELECT * FROM leads WHERE email=?").get(lead.email);
      await call(
        "/client/profile",
        { name: "QA Client", marketing: false },
        client,
        "PUT",
      );
      const campaign = {
        leadIds: [l.id],
        types: ["welcome"],
        campaign: "test-campaign",
      };
      await call("/admin/mail/send", campaign, admin);
      await call("/admin/mail/send", campaign, admin);
      const rows = db
        .prepare(
          "SELECT * FROM outbox WHERE reference LIKE 'campaign:test-campaign:%'",
        )
        .all();
      assert.equal(rows.length, 1);
      assert.equal(rows[0].status, "skipped");
    });
    await t.test("signed payment events grant access once", async () => {
      db.prepare("INSERT INTO payments VALUES(?,?,?,?,?,?,?)").run(
        "order_test",
        "client-a",
        "online-coaching",
        10000,
        "created",
        null,
        new Date().toISOString(),
      );
      const body = JSON.stringify({
        event: "payment.captured",
        payload: {
          payment: {
            entity: {
              id: "pay_test",
              order_id: "order_test",
              currency: "INR",
              amount: 10000,
            },
          },
        },
      });
      const signature = createHmac("sha256", "test-only-secret")
        .update(body)
        .digest("hex");
      for (let n = 0; n < 2; n++) {
        const r = await fetch(base + "/api/payments/webhook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-razorpay-signature": signature,
          },
          body,
        });
        assert.equal(r.status, 200);
      }
      assert.equal(
        db
          .prepare("SELECT count(*) AS n FROM records WHERE kind='enrolments'")
          .get().n,
        1,
      );
      assert.equal(
        (
          await call(
            "/payments/order",
            { programme: "online-coaching" },
            client,
          )
        ).status,
        503,
      );
    });
    await t.test("restart preserves records and login", async () => {
      db.close();
      db = null;
      await stop();
      await start();
      assert.equal((await call('/client/health',undefined,client)).data.intakes.length,1);
      assert.equal(
        (await call("/auth/me", null, admin)).data.user.email,
        "admin@example.test",
      );
      assert.equal((await call("/client", null, client)).data.plans.length, 1);
    });
  } finally {
    db?.close();
    if (child?.exitCode === null) await stop();
    rmSync(data, { recursive: true, force: true });
  }
});
