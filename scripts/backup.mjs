import { DatabaseSync, backup } from "node:sqlite";
import { resolve, join } from "node:path";
import { mkdirSync, cpSync, existsSync } from "node:fs";
try {
  process.loadEnvFile();
} catch {}
const data = resolve(process.env.DATA_DIR || "data");
if (!existsSync(join(data, "surya.sqlite")))
  throw Error("Start the app once before backing up.");
const dest = resolve(
  process.env.BACKUP_DIR || "backups",
  new Date().toISOString().replace(/[:.]/g, "-"),
);
mkdirSync(dest, { recursive: true, mode: 0o700 });
const db = new DatabaseSync(join(data, "surya.sqlite"));
await backup(db, join(dest, "surya.sqlite"));
db.close();
cpSync(join(data, "uploads"), join(dest, "uploads"), { recursive: true });
console.log("Private database and media backup created: " + dest);
