import { DatabaseSync } from "node:sqlite";

import {
  mkdirSync,
  existsSync,
  writeFileSync,
  readFileSync,
  chmodSync,
} from "node:fs";
import { resolve, join } from "node:path";
import {
  randomBytes,
  createHash,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { initialSettings, programmes, draftArticles } from "./seed.mjs";
export const dataDir = resolve(process.env.DATA_DIR || "data");
mkdirSync(dataDir, { recursive: true, mode: 0o755 });
mkdirSync(join(dataDir, "uploads"), { recursive: true, mode: 0o755 });
export const db = new DatabaseSync(join(dataDir, "surya.sqlite"));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY CHECK(id=1),data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,password TEXT,role TEXT NOT NULL CHECK(role IN ('admin','coach','editor','client')),active INTEGER DEFAULT 1,created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id) ON DELETE CASCADE,expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS tokens(token TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),kind TEXT NOT NULL,expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS records(id TEXT PRIMARY KEY,kind TEXT NOT NULL,owner TEXT REFERENCES users(id),data TEXT NOT NULL,created TEXT NOT NULL,updated TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS record_kind_owner ON records(kind,owner);
CREATE TABLE IF NOT EXISTS leads(id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,phone TEXT,city TEXT,source TEXT,programme TEXT,message TEXT,status TEXT DEFAULT 'New',marketing INTEGER DEFAULT 0,suppressed INTEGER DEFAULT 0,notes TEXT DEFAULT '',tags TEXT DEFAULT '',follow_up TEXT DEFAULT '',assigned TEXT DEFAULT '',user_id TEXT REFERENCES users(id),created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS slots(id TEXT PRIMARY KEY,start TEXT NOT NULL UNIQUE,end TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS bookings(id TEXT PRIMARY KEY,lead_id TEXT REFERENCES leads(id),user_id TEXT REFERENCES users(id),slot_id TEXT REFERENCES slots(id),status TEXT NOT NULL,preferred TEXT,programme TEXT,created TEXT NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS active_slot ON bookings(slot_id) WHERE status IN ('pending','confirmed');
CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY,lead_id TEXT REFERENCES leads(id),recipient TEXT NOT NULL,subject TEXT NOT NULL,html TEXT NOT NULL,template TEXT,marketing INTEGER DEFAULT 0,status TEXT NOT NULL,reason TEXT,reference TEXT UNIQUE,attempts INTEGER DEFAULT 0,provider_id TEXT,created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY,file TEXT NOT NULL,owner TEXT REFERENCES users(id),private INTEGER DEFAULT 0,alt TEXT,source TEXT,approved INTEGER DEFAULT 0,width INTEGER,height INTEGER,created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,actor TEXT,action TEXT,target TEXT,created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS analytics(id INTEGER PRIMARY KEY AUTOINCREMENT,event TEXT NOT NULL,path TEXT NOT NULL,session TEXT NOT NULL,referrer TEXT,device TEXT,created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS payments(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),programme TEXT,amount INTEGER,status TEXT,provider_payment TEXT UNIQUE,created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS requests(key TEXT PRIMARY KEY,created INTEGER NOT NULL);
`);
export const now = () => new Date().toISOString();
export const id = () => randomBytes(16).toString("hex");
export const hash = (x) => createHash("sha256").update(x).digest("hex");
export function passwordHash(p) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(p, salt, 64).toString("hex");
}
export function passwordOK(p, v) {
  if (!v) return false;
  const [s, h] = v.split(":");
  const b = scryptSync(p, s, 64);
  return h?.length === 128 && timingSafeEqual(b, Buffer.from(h, "hex"));
}
export const settings = () =>
  JSON.parse(db.prepare("SELECT data FROM settings WHERE id=1").get().data);
export const records = (kind, owner) =>
  db
    .prepare(
      `SELECT * FROM records WHERE kind=?${owner !== undefined ? " AND owner=?" : ""} ORDER BY created DESC`,
    )
    .all(...(owner !== undefined ? [kind, owner] : [kind]))
    .map(unpack);
export const unpack = (r) =>
  r
    ? {
        ...JSON.parse(r.data),
        id: r.id,
        kind: r.kind,
        owner: r.owner,
        created: r.created,
        updated: r.updated,
      }
    : null;
export const record = (i) =>
  unpack(db.prepare("SELECT * FROM records WHERE id=?").get(i));
export function saveRecord(kind, i, data, owner = null) {
  db.prepare(
    "INSERT INTO records(id,kind,owner,data,created,updated) VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated=excluded.updated,owner=excluded.owner",
  ).run(i, kind, owner, JSON.stringify(data), now(), now());
  return record(i);
}
export function audit(actor, action, target = "") {
  db.prepare(
    "INSERT INTO audit(actor,action,target,created) VALUES(?,?,?,?)",
  ).run(actor || "system", action, target, now());
}
export function transaction(fn) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const v = fn();
    db.exec("COMMIT");
    return v;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
if (!db.prepare("SELECT id FROM settings WHERE id=1").get()) {
  transaction(() => {
    db.prepare("INSERT INTO settings VALUES(1,?)").run(
      JSON.stringify(initialSettings),
    );
    for (const p of programmes) saveRecord("programmes", p.id, p);
    for (const a of draftArticles) saveRecord("articles", a.id, a);
    saveRecord("credentials", "cult-certificate", {
      title: "CULT Certified Personal Trainer",
      issuer: "cult.fit / CULT Academy",
      date: "2025-02-17",
      status: "draft",
      source: "https://www.instagram.com/stories/highlights/17909423526115042/",
      notes:
        "Observed on supplied social profile; confirm publication context.",
    });
    saveRecord("credentials", "ranking-review", {
      title: "Reported Delhi NCR top-five recognition",
      status: "draft",
      notes:
        "Awaiting ranking category, organisation, metric, months and evidence.",
    });
  });
}
const setupPath = join(dataDir, "bootstrap-token.txt");
if (
  !db.prepare("SELECT id FROM users WHERE role='admin'").get() &&
  !existsSync(setupPath)
)
  writeFileSync(setupPath, randomBytes(32).toString("hex"), { mode: 0o600 });
export function bootstrapMatches(token) {
  return (
    existsSync(setupPath) &&
    typeof token === "string" &&
    hash(token) === hash(readFileSync(setupPath, "utf8").trim())
  );
}
chmodSync(join(dataDir, "surya.sqlite"), 0o600);
