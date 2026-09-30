import { createContext, useContext, useState } from "react";
export type Entry = Record<string, any>;
export const SiteContext = createContext<any>(null);
export const useSite = () => useContext(SiteContext);
export async function api(path: string, options: RequestInit = {}) {
  const r = await fetch("/api" + path, {
    ...options,
    headers:
      options.body instanceof FormData
        ? options.headers
        : { "Content-Type": "application/json", ...options.headers },
  });
  const d = await r.json();
  if (!r.ok)
    throw new Error(d.error || "Something went wrong. Please try again.");
  return d;
}
export const post = (path: string, body: any, method = "POST") =>
  api(path, { method, body: JSON.stringify(body) });
export function useAction() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const run = async (
    fn: () => Promise<any>,
    message = "Saved successfully.",
  ) => {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const r = await fn();
      setSuccess(r?.message || message);
      return r;
    } catch (e: any) {
      setError(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, success, run, setError, setSuccess };
}
export const date = (v: any) =>
  v
    ? new Date(v).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "To be confirmed";
export const title = (s: string) => s.replace(/\n/g, " ");
export function download(name: string, value: string, type = "text/plain") {
  const u = URL.createObjectURL(new Blob([value], { type }));
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
export function csv(rows: Entry[]) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const quote = (v: any) =>
    '"' +
    String(v ?? "")
      .replace(/^([=+@-])/, "'$1")
      .replace(/"/g, '""') +
    '"';
  return [
    keys.map(quote).join(","),
    ...rows.map((r) => keys.map((k) => quote(r[k])).join(",")),
  ].join("\n");
}
export function parseCSV(s: string) {
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"') {
      if (quoted && s[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" && !quoted) {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const headers = rows.shift() || [];
  return rows
    .filter((r) => r.some(Boolean))
    .map((r) =>
      Object.fromEntries(
        headers.map((h, i) => [h.trim().toLowerCase(), r[i]?.trim() || ""]),
      ),
    );
}
export function Status({ action }: { action: ReturnType<typeof useAction> }) {
  return (
    <>
      {action.error && (
        <p role="alert" className="notice error">
          {action.error}
        </p>
      )}
      {action.success && (
        <p role="status" className="notice success">
          {action.success}
        </p>
      )}
    </>
  );
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export const initialBlank: any = { title: "", status: "draft", body: "" };
