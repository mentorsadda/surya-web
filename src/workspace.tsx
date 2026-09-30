import { Consultation, HealthReview } from "./consultation";
import { policies } from "./policies";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Dumbbell,
  Leaf,
  Mail,
  Image,
  FileText,
  Settings,
  ShieldCheck,
  Activity,
  LogOut,
  Plus,
  ArrowUpRight,
  Check,
  Download,
  Search,
  Save,
  Upload,
  X,
  ArrowLeft,
  Heart,
  MessageCircle,
  Eye,
  Trash2,
} from "lucide-react";
import {
  api,
  post,
  useSite,
  useAction,
  Status,
  Field,
  date,
  title,
  Entry,
  download,
  csv,
  parseCSV,
} from "./lib";
const moduleLabels: any = {
  programmes: "Programmes",
  articles: "Journal",
  stories: "Transformations",
  testimonials: "Testimonials",
  credentials: "Credentials",
  exercises: "Exercise library",
  social: "Social content",
  plans: "Client plans",
  enrolments: "Enrolments",
  checkins: "Check-ins",
  messages: "Coach messages",
  consents: "Publication consent",
  privacy_requests: "Privacy requests",
  plan_templates: "Plan templates",
};
function Empty({
  title: heading = "A fresh starting point.",
  text = "Your records will appear here.",
  children,
}: any) {
  return (
    <div className="workspace-empty">
      <Activity size={36} strokeWidth={1.2} />
      <h3>{heading}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
}
function Badge({ children }: any) {
  return (
    <span
      className={
        "badge " +
        (["published", "confirmed", "accepted", "active", "paid"].includes(
          children,
        )
          ? "good"
          : "")
      }
    >
      {String(children).replace(/_/g, " ")}
    </span>
  );
}
function ActionButton({ children, ...p }: any) {
  return (
    <button className="button small" {...p}>
      {children}
    </button>
  );
}
function WorkspaceShell({
  items,
  active,
  setActive,
  children,
  title: heading,
  subtitle,
}: any) {
  const { user, setUser } = useSite();
  const navigate = useNavigate();
  return (
    <div className="workspace">
      <aside className="workspace-sidebar">
        <p className="eyebrow">
          {user.role === "client" ? "YOUR COACHING SPACE" : "COACHING STUDIO"}
        </p>
        <div className="workspace-person">
          <span>{user.name[0]}</span>
          <div>
            <strong>{user.name}</strong>
            <small>
              {user.role === "client"
                ? "Your stronger everyday"
                : user.role + " account"}
            </small>
          </div>
        </div>
        <nav aria-label="Dashboard navigation">
          {items.map(([id, label, Icon]: any) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() => setActive(id)}
            >
              {Icon && <Icon size={18} />}
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <button
          className="logout"
          onClick={() =>
            post("/auth/logout", {}).then(() => {
              setUser(null);
              navigate("/login");
            })
          }
        >
          <LogOut size={17} /> Sign out
        </button>
      </aside>
      <div className="workspace-main">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">TRAIN WITH SURYA</p>
            <h1>{heading}</h1>
            <p>{subtitle}</p>
          </div>
          <Link className="text-link" to="/">
            View website <ArrowUpRight size={16} />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
export function MediaUpload({ value, onChange, privateFile = false }: any) {
  const a = useAction(),
    canvasRef = useRef<HTMLCanvasElement>(null);
  const [src, setSrc] = useState(""),
    [crop, setCrop] = useState({ zoom: 1, x: 50, y: 50, ratio: "1" }),
    [alt, setAlt] = useState(""),
    [approved, setApproved] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.onload = () => {
      imageRef.current = img;
      draw();
    };
    img.src = src;
    return () => URL.revokeObjectURL(src);
  }, [src]);
  const draw = () => {
    const c = canvasRef.current,
      img = imageRef.current;
    if (!c || !img) return;
    const ratio = Number(crop.ratio);
    c.width = 800;
    c.height = 800 / ratio;
    const scale =
      Math.max(c.width / img.width, c.height / img.height) * crop.zoom;
    const w = img.width * scale,
      h = img.height * scale;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#f6f3ed";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(
      img,
      (-(w - c.width) * crop.x) / 100,
      (-(h - c.height) * crop.y) / 100,
      w,
      h,
    );
  };
  useEffect(draw, [crop]);
  const upload = () =>
    a.run(async () => {
      if (!canvasRef.current) throw Error("Choose an image first.");
      const blob = await new Promise<Blob | null>((r) =>
        canvasRef.current!.toBlob(r, "image/jpeg", 0.94),
      );
      if (!blob) throw Error("Image could not be prepared.");
      const f = new FormData();
      f.append("file", blob, "crop.jpg");
      f.append("alt", alt);
      f.append("keyword", alt || "coaching");
      f.append("approved", String(approved));
      f.append("private", String(privateFile));
      const r = await api("/media", { method: "POST", body: f });
      onChange(r.url);
      setSrc("");
      return { message: "Image uploaded. Save the record to attach it." };
    });
  return (
    <div className="media-upload">
      {value && (
        <div className="media-current">
          <img src={value} alt="Current upload" />
          <button
            type="button"
            className="text-link"
            onClick={() => onChange("")}
          >
            Remove from this record
          </button>
        </div>
      )}
      <label className="upload-label">
        <Upload size={18} />
        {value ? "Replace image" : "Upload & crop image"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setCrop({ zoom: 1, x: 50, y: 50, ratio: "1" });
              setSrc(URL.createObjectURL(f));
            }
          }}
        />
      </label>
      <small>
        JPG, PNG or WebP · up to 8 MB. Portrait 1200×1500; cover 1600×1000;
        square 1200×1200.
      </small>
      {src && (
        <div className="crop-editor">
          <canvas ref={canvasRef} />
          <div>
            <Field label="Crop shape">
              <select
                value={crop.ratio}
                onChange={(e) => setCrop({ ...crop, ratio: e.target.value })}
              >
                <option value="1">Square</option>
                <option value="0.8">Portrait 4:5</option>
                <option value="1.6">Landscape 8:5</option>
              </select>
            </Field>
            {(["zoom", "x", "y"] as const).map((k) => (
              <Field
                key={k}
                label={
                  k === "zoom"
                    ? "Zoom"
                    : k === "x"
                      ? "Horizontal focus"
                      : "Vertical focus"
                }
              >
                <input
                  type="range"
                  min={k === "zoom" ? 1 : 0}
                  max={k === "zoom" ? 3 : 100}
                  step={0.01}
                  value={crop[k]}
                  onChange={(e) =>
                    setCrop({ ...crop, [k]: Number(e.target.value) })
                  }
                />
              </Field>
            ))}
            <Field label="Image description / alt text">
              <input value={alt} onChange={(e) => setAlt(e.target.value)} />
            </Field>
            {!privateFile && (
              <label className="checkline">
                <input
                  type="checkbox"
                  checked={approved}
                  onChange={(e) => setApproved(e.target.checked)}
                />
                Approved for website use
              </label>
            )}
            <ActionButton type="button" disabled={a.busy} onClick={upload}>
              Crop & upload
            </ActionButton>
            <button
              type="button"
              className="text-link"
              onClick={() => setSrc("")}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <Status action={a} />
    </div>
  );
}
const defaults = (kind: string): Entry => ({
  title: "",
  status: "draft",
  body: "",
  ...(kind === "programmes"
    ? {
        category: "Online",
        summary: "",
        description: "",
        inclusions: [],
        price: null,
        icon: "dumbbell",
        color: "sage",
        order: 10,
      }
    : {}),
  ...(["plans", "plan_templates"].includes(kind)
    ? { type: "workout", items: [], version: 0, approved: false }
    : {}),
  ...(kind === "stories" || kind === "testimonials" ? { consent: false } : {}),
  ...(kind === "enrolments" ? { status: "active" } : {}),
});
function RecordEditor({
  kind,
  initial,
  users,
  programmes,
  onClose,
  onSaved,
}: any) {
  const [b, setB] = useState<Entry>(initial || defaults(kind));
  const a = useAction();
  const set = (k: string, v: any) => setB((x) => ({ ...x, [k]: v }));
  const input = (k: string, label: string, type = "text") => (
    <Field label={label}>
      <input
        type={type}
        value={b[k] ?? ""}
        onChange={(e) =>
          set(
            k,
            type === "number"
              ? e.target.value === ""
                ? null
                : Number(e.target.value)
              : e.target.value,
          )
        }
      />
    </Field>
  );
  const area = (k: string, label: string, rows = 4) => (
    <Field label={label}>
      <textarea
        rows={rows}
        value={b[k] || ""}
        onChange={(e) => set(k, e.target.value)}
      />
    </Field>
  );
  const privateKind = [
    "plans",
    "enrolments",
    "messages",
    "checkins",
    "consents",
    "privacy_requests",
  ].includes(kind);
  return (
    <div className="editor-panel">
      <div className="panel-title">
        <h2>
          {initial ? "Edit" : "Create"} {moduleLabels[kind].toLowerCase()}
        </h2>
        <button
          className="icon-button"
          aria-label="Close editor"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          a.run(() => post("/admin/records/" + kind, b)).then((r) => {
            if (r) onSaved();
          });
        }}
      >
        <div className="form-grid">
          {input("title", "Title / name")}
          {!initial && input("id", "Page identifier (optional, e.g. my-story)")}
          <Field label="Status">
            <select
              value={b.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {(kind === "privacy_requests"
                ? ["pending", "in_review", "resolved", "declined"]
                : kind === "enrolments"
                  ? ["active", "completed", "paused", "archived"]
                  : ["draft", "published", "archived"]
              ).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          {privateKind && (
            <Field label="Client">
              <select
                value={b.owner || ""}
                onChange={(e) => set("owner", e.target.value)}
                required={["plans", "enrolments"].includes(kind)}
              >
                <option value="">Select client</option>
                {users
                  .filter((u: Entry) => u.role === "client")
                  .map((u: Entry) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.email}
                    </option>
                  ))}
              </select>
            </Field>
          )}
          {["programmes", "articles", "exercises"].includes(kind) &&
            input("category", "Category")}
          {["stories", "enrolments"].includes(kind) && (
            <Field label="Programme">
              <select
                value={b.programme || ""}
                onChange={(e) => set("programme", e.target.value)}
              >
                <option value="">Choose programme</option>
                {programmes.map((p: Entry) => (
                  <option key={p.id} value={p.id}>
                    {title(p.title)}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>
        {kind === "programmes" && (
          <>
            <div className="form-grid">
              {input("label", "Short label")}
              {input("order", "Display order", "number")}
              {input("price", "Price in INR (blank = enquire)", "number")}
              {input("duration", "Duration")}
              {input("frequency", "Session frequency")}
              {input("mode", "Delivery format")}
              {input("equipment", "Equipment")}
              {input("support", "Support details")}
              {input("suitable", "Who is it for?")}
              <Field label="Card colour">
                <select
                  value={b.color}
                  onChange={(e) => set("color", e.target.value)}
                >
                  <option>sage</option>
                  <option>cream</option>
                  <option>peach</option>
                </select>
              </Field>
            </div>
            {area("summary", "Short summary", 2)}
            {area("description", "Full programme description")}
            <Field label="Inclusions (one per line)">
              <textarea
                rows={5}
                value={(b.inclusions || []).join("\n")}
                onChange={(e) => set("inclusions", e.target.value.split("\n"))}
              />
            </Field>
            <h3>Programme FAQs</h3>
            {(b.faq || []).map((f: Entry, i: number) => (
              <div className="form-grid" key={i}>
                <Field label="Question">
                  <input
                    value={f.question}
                    onChange={(e) =>
                      set(
                        "faq",
                        b.faq.map((x: Entry, j: number) =>
                          j === i ? { ...x, question: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label="Answer">
                  <input
                    value={f.answer}
                    onChange={(e) =>
                      set(
                        "faq",
                        b.faq.map((x: Entry, j: number) =>
                          j === i ? { ...x, answer: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
            ))}
            <button
              type="button"
              className="text-link"
              onClick={() =>
                set("faq", [...(b.faq || []), { question: "", answer: "" }])
              }
            >
              <Plus size={16} /> Add question
            </button>
          </>
        )}
        {["plans", "plan_templates"].includes(kind) && (
          <>
            <div className="form-grid">
              <Field label="Plan type">
                <select
                  value={b.type}
                  onChange={(e) => set("type", e.target.value)}
                >
                  <option value="workout">Workout</option>
                  <option value="nutrition">Nutrition</option>
                </select>
              </Field>
              {input("week", "Week / date range")}
              {input("preferences", "Preferences and restrictions")}
            </div>
            <h3>
              {b.type === "nutrition"
                ? "Meals & substitutions"
                : "Exercises & instructions"}
            </h3>
            {(b.items || []).map((item: Entry, i: number) => (
              <div className="plan-item-editor" key={i}>
                <div className="form-grid">
                  {[
                    [
                      "name",
                      b.type === "nutrition"
                        ? "Meal / food option"
                        : "Exercise",
                    ],
                    [
                      "prescription",
                      b.type === "nutrition"
                        ? "Portion / coach guidance"
                        : "Sets / reps / rest / time",
                    ],
                    ["alternative", "Alternative / substitution"],
                    ["video", "Demonstration URL"],
                  ].map(([k, label]) => (
                    <Field key={k} label={label}>
                      <input
                        value={item[k] || ""}
                        onChange={(e) =>
                          set(
                            "items",
                            b.items.map((x: Entry, j: number) =>
                              i === j ? { ...x, [k]: e.target.value } : x,
                            ),
                          )
                        }
                      />
                    </Field>
                  ))}
                </div>
                <button
                  type="button"
                  className="text-link"
                  onClick={() =>
                    set(
                      "items",
                      b.items.filter((_: any, j: number) => j !== i),
                    )
                  }
                >
                  Remove item
                </button>
              </div>
            ))}
            <button
              type="button"
              className="button outline small"
              onClick={() =>
                set("items", [
                  ...(b.items || []),
                  { name: "", prescription: "", alternative: "", video: "" },
                ])
              }
            >
              <Plus size={16} /> Add item
            </button>
            {area("body", "Coach notes / safe participation guidance")}
            <label className="checkline">
              <input
                type="checkbox"
                checked={!!b.approved}
                onChange={(e) => set("approved", e.target.checked)}
              />
              I have reviewed and approved this plan within my professional
              scope.
            </label>
            <small>
              Each saved revision retains its previous version. Published plans
              appear only for the assigned client.
            </small>
          </>
        )}
        {kind === "articles" && (
          <>
            {input("excerpt", "Excerpt")}
            {input("author", "Author")}
            {input("publishedAt", "Article date", "date")}
            {input(
              "publishAt",
              "Optional scheduled visibility",
              "datetime-local",
            )}
            {input("readTime", "Read time")}
            {area("body", "English article", 12)}
            {input("titleHi", "Hindi title")}
            {area("bodyHi", "Hindi article", 12)}
            {input("seoTitle", "SEO title")}
            {input("seoDescription", "SEO description")}
          </>
        )}
        {["stories", "testimonials"].includes(kind) && (
          <>
            {input("name", "Approved client name / anonymous label")}
            {input("summary", "Summary")}
            {input("duration", "Actual duration / dates")}
            {area("body", "Approved story / testimonial", 8)}
            <label className="checkline">
              <input
                type="checkbox"
                checked={b.consent === true}
                onChange={(e) => set("consent", e.target.checked)}
              />
              I have recorded separate publication permission for this material.
            </label>
            {input("consentReference", "Consent record reference")}
          </>
        )}
        {kind === "credentials" && (
          <>
            {input("issuer", "Issuer / ranking organisation")}
            {input("date", "Date / applicable period")}
            {input("source", "Evidence URL")}
            {area("notes", "Verification notes")}
          </>
        )}
        {kind === "privacy_requests" && (
          <>
            {input("type", "Request type")}
            {area("note", "Client request")}
            {area("resolution", "Response / resolution notes")}
          </>
        )}
        {kind === "social" && (
          <>
            {input("url", "Exact Instagram / Facebook post URL")}
            {area("body", "Caption")}
          </>
        )}
        {kind === "exercises" && (
          <>
            {input("equipment", "Equipment")}
            {input("video", "Demonstration URL")}
            {area("body", "Coach-written technique cues")}
          </>
        )}
        {["messages", "checkins", "consents", "enrolments"].includes(kind) &&
          area(
            "body",
            kind === "consents"
              ? "Approved material, channels and consent details"
              : "Notes / message",
            6,
          )}
        {!privateKind && kind !== "plan_templates" && (
          <Field label="Featured image">
            <MediaUpload
              value={b.image}
              onChange={(v: string) => set("image", v)}
            />
          </Field>
        )}
        <Status action={a} />
        <div className="editor-actions">
          <ActionButton disabled={a.busy}>
            <Save size={16} /> {a.busy ? "Saving…" : "Save changes"}
          </ActionButton>
          <button
            type="button"
            className="button outline small"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
function RecordsPanel({ kind, overview, onReload }: any) {
  const { data } = useSite();
  const [rows, setRows] = useState<Entry[]>([]),
    [editing, setEditing] = useState<Entry | null | false>(false),
    [search, setSearch] = useState("");
  const a = useAction();
  const load = () =>
    api("/admin/records/" + kind)
      .then(setRows)
      .catch((e) => a.setError(e.message));
  useEffect(() => {
    setEditing(false);
    setSearch("");
    load();
  }, [kind]);
  if (editing !== false)
    return (
      <RecordEditor
        key={kind + (editing?.id || "new")}
        kind={kind}
        initial={editing}
        users={overview.users}
        programmes={data.programmes}
        onClose={() => setEditing(false)}
        onSaved={() => {
          setEditing(false);
          load();
          onReload();
        }}
      />
    );
  return (
    <>
      <div className="toolbar">
        <div className="searchbox">
          <Search size={17} />
          <input
            aria-label="Search records"
            placeholder="Search records…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ActionButton onClick={() => setEditing(null)}>
          <Plus size={16} /> Add {moduleLabels[kind].toLowerCase()}
        </ActionButton>
      </div>
      <Status action={a} />
      {rows.length ? (
        <div className="record-list">
          {rows
            .filter((r) =>
              JSON.stringify(r).toLowerCase().includes(search.toLowerCase()),
            )
            .map((r) => (
              <div className="record-row" key={r.id}>
                <div>
                  <strong>
                    {title(r.title || r.name || r.body?.slice(0, 70) || r.id)}
                  </strong>
                  <p>
                    {r.owner
                      ? overview.users.find((u: Entry) => u.id === r.owner)
                          ?.name
                      : r.category || r.issuer || r.type || ""}{" "}
                    <span className="muted">
                      {r.version ? " · Version " + r.version : ""}
                    </span>
                  </p>
                </div>
                <Badge>{r.status || "submitted"}</Badge>
                <button
                  className="button outline small"
                  onClick={() => setEditing(r)}
                >
                  Edit
                </button>
                <button
                  className="icon-button"
                  aria-label="Archive record"
                  onClick={() =>
                    a
                      .run(
                        () =>
                          api("/admin/records/" + r.id, { method: "DELETE" }),
                        "Archived.",
                      )
                      .then(load)
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
        </div>
      ) : (
        <Empty text="Add your first record. Draft content stays private until you publish it." />
      )}
    </>
  );
}
function SettingsPanel({ overview, reload }: any) {
  const [b, setB] = useState<Entry>(overview.settings),
    [tab, setTab] = useState("Brand & contact");
  const a = useAction();
  const set = (k: string, v: any) => setB({ ...b, [k]: v });
  const input = (k: string, label: string, type = "text") => (
    <Field label={label}>
      <input
        type={type}
        value={b[k] ?? ""}
        onChange={(e) =>
          set(k, type === "number" ? Number(e.target.value) : e.target.value)
        }
      />
    </Field>
  );
  return (
    <div className="editor-panel">
      <div className="filter-row">
        {[
          "Brand & contact",
          "Hero & story",
          "Travel gallery",
          "Homepage sections",
          "Booking",
          "Programme finder",
          "Policies",
          "SEO",
        ].map((x) => (
          <button
            className={tab === x ? "active" : ""}
            key={x}
            onClick={() => setTab(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          a.run(() => post("/admin/settings", b, "PUT")).then((r) => {
            if (r) reload();
          });
        }}
      >
        {tab === "Brand & contact" && (
          <>
            <div className="form-grid">
              {input("brand", "Brand name")}
              {input("tagline", "Tagline")}
              {input("email", "Business email", "email")}
              {input("whatsapp", "WhatsApp number (country code + digits)")}
              {input("location", "Confirmed training location")}
              {input("instagram", "Instagram URL")}
              {input("facebook", "Facebook URL")}
            </div>
            <Field label="Transparent brand logo (PNG or WebP URL)">
              <input
                value={b.logoImage || ""}
                onChange={(e) => set("logoImage", e.target.value)}
                placeholder="/images/brand/surya-logo-light.png"
              />
            </Field>
            <Field label="Footer white logo (PNG or WebP URL)">
              <input value={b.footerLogoImage || ""} onChange={(e) => set("footerLogoImage", e.target.value)} placeholder="/images/brand/surya-logo-white.png" />
            </Field>
            <Field label="Surya portrait">
              <MediaUpload
                value={b.portrait}
                onChange={(v: string) => set("portrait", v)}
              />
            </Field>
          </>
        )}
        {tab === "Hero & story" && (
          <>
            <Field label="Hero background image">
              <MediaUpload
                value={b.heroImage}
                onChange={(v: string) => set("heroImage", v)}
              />
            </Field>
            <Field label="Hero workout video (MP4 URL; leave blank for a still image)">
              <input
                value={b.heroVideo || ""}
                onChange={(e) => set("heroVideo", e.target.value)}
                placeholder="/videos/surya-workout-loop.mp4"
              />
            </Field>
            <Field label="Second hero scene portrait">
              <MediaUpload value={b.secondHeroImage} onChange={(v: string) => set("secondHeroImage", v)} />
            </Field>
            <Field label="Third hero scene image">
              <MediaUpload value={b.thirdHeroImage} onChange={(v: string) => set("thirdHeroImage", v)} />
            </Field>
            <Field label="Coach / about section image">
              <MediaUpload
                value={b.coachImage}
                onChange={(v: string) => set("coachImage", v)}
              />
            </Field>
            {b.hero.map((h: Entry, i: number) => (
              <fieldset key={i}>
                <legend>Hero scene {i + 1}</legend>
                {["eyebrow", "title", "text", "cta", "href"].map((k) => (
                  <Field
                    label={k === "href" ? "Destination (e.g. /book)" : k}
                    key={k}
                  >
                    <textarea
                      rows={k === "text" ? 3 : 2}
                      value={h[k]}
                      onChange={(e) =>
                        set(
                          "hero",
                          b.hero.map((x: Entry, j: number) =>
                            i === j ? { ...x, [k]: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </Field>
                ))}
              </fieldset>
            ))}
            <Field label="About Surya">
              <textarea
                rows={6}
                value={b.aboutText}
                onChange={(e) => set("aboutText", e.target.value)}
              />
            </Field>
          </>
        )}
        {tab === "Travel gallery" && <>
          <h3>Life beyond the workout</h3>
          <p>Edit each photo, location label and caption. The first card is the large featured photo.</p>
          {(b.travelCards || []).map((card: Entry, i: number) => <fieldset key={i}>
            <legend>Travel photo {i+1}</legend>
            <Field label="Photo"><MediaUpload value={card.image} onChange={(v: string)=>set("travelCards",b.travelCards.map((x: Entry,j: number)=>i===j?{...x,image:v}:x))} /></Field>
            <Field label="Location / country"><input required maxLength={80} value={card.location} onChange={e=>set("travelCards",b.travelCards.map((x: Entry,j: number)=>i===j?{...x,location:e.target.value}:x))} /></Field>
            <Field label="Caption"><textarea required maxLength={180} rows={2} value={card.caption} onChange={e=>set("travelCards",b.travelCards.map((x: Entry,j: number)=>i===j?{...x,caption:e.target.value}:x))} /></Field>
          </fieldset>)}
        </>}
        {tab === "Homepage sections" && (
          <>
            <p className="field-hint" style={{ marginBottom: "20px" }}>
              Customise the headings, subtitles, and background watermarks for each section on the homepage.
              To edit individual programme cards or blog posts, use the <strong>Programmes</strong> or <strong>Journal</strong> tabs on the left sidebar menu.
            </p>
            {b.sections.map((s: Entry, i: number) => {
              const friendlyNames: Record<string, string> = {
                programmes: "1. Programmes Section ('A little direction. A stronger you.')",
                about: "2. Meet Surya / About Coach Section ('She knows what starting feels like.')",
                method: "3. The Surya Approach / Method Section ('Big changes start with small steps.')",
                transformations: "4. Transformations & Client Stories Section ('Progress looks different on everyone.')",
                journal: "5. The Fitness Journal / Blog Section ('A little knowledge. A lot of possibility.')",
              };
              return (
                <fieldset key={s.id} style={{ marginBottom: "24px" }}>
                  <legend style={{ fontWeight: 700 }}>
                    {friendlyNames[s.id] || s.id}
                  </legend>
                  <label className="checkline" style={{ marginBottom: "14px" }}>
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={(e) =>
                        set(
                          "sections",
                          b.sections.map((x: Entry, j: number) =>
                            i === j ? { ...x, enabled: e.target.checked } : x,
                          ),
                        )
                      }
                    />
                    Show section on homepage
                  </label>
                  {s.id === "programmes" && (
                    <p className="field-hint" style={{ background: "#eef4f0", padding: "10px 14px", borderRadius: "8px", margin: "0 0 14px 0", color: "#274837" }}>
                      💡 <strong>Note:</strong> To change the 3 programme cards (photos, prices, descriptions, and inclusions), click <strong>"Programmes"</strong> on the left menu.
                    </p>
                  )}
                  <Field label="Eyebrow text">
                    <input
                      value={s.eyebrow || (s.id === "programmes" ? "FIND YOUR WAY FORWARD" : "")}
                      onChange={(e) =>
                        set(
                          "sections",
                          b.sections.map((x: Entry, j: number) =>
                            i === j ? { ...x, eyebrow: e.target.value } : x,
                          ),
                        )
                      }
                      placeholder="e.g. FIND YOUR WAY FORWARD"
                    />
                  </Field>
                  <Field label="Main title (use a new line to split headline)">
                    <textarea
                      rows={2}
                      value={s.title}
                      onChange={(e) =>
                        set(
                          "sections",
                          b.sections.map((x: Entry, j: number) =>
                            i === j ? { ...x, title: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Subtitle / description">
                    <textarea
                      rows={2}
                      value={s.subtitle}
                      onChange={(e) =>
                        set(
                          "sections",
                          b.sections.map((x: Entry, j: number) =>
                            i === j ? { ...x, subtitle: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </Field>
                  {s.id === "programmes" && (
                    <>
                      <Field label="Section background watermark image (optional)">
                        <MediaUpload
                          value={s.watermark || "/images/surya/coach-watermark.png"}
                          onChange={(v: string) =>
                            set(
                              "sections",
                              b.sections.map((x: Entry, j: number) =>
                                i === j ? { ...x, watermark: v } : x,
                              ),
                            )
                          }
                        />
                      </Field>
                      <Field label="Bottom motto / banner text">
                        <input
                          value={s.motto || "STRONG BODY. CLEAR MIND. CONFIDENT YOU."}
                          onChange={(e) =>
                            set(
                              "sections",
                              b.sections.map((x: Entry, j: number) =>
                                i === j ? { ...x, motto: e.target.value } : x,
                              ),
                            )
                          }
                        />
                      </Field>
                    </>
                  )}
                  <button
                    type="button"
                    disabled={!i}
                    className="text-link"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      const sections = [...b.sections];
                      [sections[i], sections[i - 1]] = [
                        sections[i - 1],
                        sections[i],
                      ];
                      set("sections", sections);
                    }}
                  >
                    ↑ Move section up
                  </button>
                </fieldset>
              );
            })}
          </>
        )}
        {tab === "Booking" && (
          <>
            <Field label="Booking mode">
              <select
                value={b.bookingMode}
                onChange={(e) => set("bookingMode", e.target.value)}
              >
                <option value="request">Request a time</option>
                <option value="slots">Choose a published slot</option>
              </select>
            </Field>
            <div className="form-grid">
              {input(
                "consultationMinutes",
                "Session duration (minutes)",
                "number",
              )}
              {input(
                "bufferMinutes",
                "Buffer between slots (minutes)",
                "number",
              )}
              {input(
                "cancellationHours",
                "Self-service change window (hours)",
                "number",
              )}
              {input(
                "reminderHours",
                "Reminder before session (hours)",
                "number",
              )}
            </div>
            <p className="notice">
              This change window controls online rescheduling, not a
              cancellation fee. Agree commercial terms separately.
            </p>
          </>
        )}
        {tab === "Programme finder" && (
          <>
            {b.finderRules.map((rule: Entry, i: number) => (
              <div className="form-grid" key={i}>
                {["field", "value", "programme"].map((k) => (
                  <Field key={k} label={k}>
                    <input
                      value={rule[k]}
                      onChange={(e) =>
                        set(
                          "finderRules",
                          b.finderRules.map((x: Entry, j: number) =>
                            i === j ? { ...x, [k]: e.target.value } : x,
                          ),
                        )
                      }
                    />
                  </Field>
                ))}
              </div>
            ))}
            <p>
              Use goal, location or format fields and an existing programme
              identifier.
            </p>
          </>
        )}
        {tab === "Policies" && (
          <PolicyFields
            value={b.policyOverrides || {}}
            onChange={(value: any) => set("policyOverrides", value)}
          />
        )}{" "}
        {tab === "SEO" && (
          <>
            {input("seoTitle", "Site title")}
            {input("seoDescription", "Site description")}
          </>
        )}
        <Status action={a} />
        <ActionButton disabled={a.busy}>
          <Save size={16} />
          Save website settings
        </ActionButton>
      </form>
    </div>
  );
}
function LeadsPanel({ overview, reload }: any) {
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState("All"),
    [edit, setEdit] = useState<Entry | null>(null),
    [add, setAdd] = useState(false),
    [importRows, setImportRows] = useState<Entry[] | null>(null),
    [mapping, setMapping] = useState<any>({
      name: "name",
      email: "email",
      phone: "phone",
      city: "city",
    });
  const a = useAction();
  const rows = overview.leads.filter(
    (l: Entry) =>
      (status === "All" || l.status === status) &&
      [l.name, l.email, l.phone, l.source, l.tags]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="toolbar">
        <div className="searchbox">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, source…"
          />
        </div>
        <select
          aria-label="Filter lead status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {[
            "All",
            "New",
            "Contacted",
            "Follow-up",
            "Interested",
            "Converted",
            "Closed",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <ActionButton onClick={() => setAdd(!add)}>
          <Plus size={16} />
          Add lead
        </ActionButton>
        <button
          className="button outline small"
          onClick={() => download("surya-leads.csv", csv(rows), "text/csv")}
        >
          <Download size={16} />
          Export
        </button>
        <label className="button outline small">
          Import CSV
          <input
            type="file"
            hidden
            accept=".csv"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) setImportRows(parseCSV(await f.text()));
            }}
          />
        </label>
      </div>
      <Status action={a} />
      {importRows && (
        <div className="editor-panel">
          <h3>Map CSV columns</h3>
          <p>
            {importRows.length} rows found. Imported contacts are not
            automatically opted into marketing.
          </p>
          <div className="form-grid">
            {Object.keys(mapping).map((k) => (
              <Field key={k} label={k}>
                <select
                  value={mapping[k]}
                  onChange={(e) =>
                    setMapping({ ...mapping, [k]: e.target.value })
                  }
                >
                  <option value="">Skip</option>
                  {Object.keys(importRows[0] || {}).map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
              </Field>
            ))}
          </div>
          <ActionButton
            onClick={() =>
              a
                .run(() =>
                  post("/admin/import", {
                    rows: importRows.map((row) =>
                      Object.fromEntries(
                        Object.entries(mapping).map(([k, v]) => [
                          k,
                          row[v as string],
                        ]),
                      ),
                    ),
                  }),
                )
                .then((r) => {
                  if (r) {
                    a.setSuccess(
                      `${r.imported} imported or merged; ${r.invalid} invalid.`,
                    );
                    setImportRows(null);
                    reload();
                  }
                })
            }
          >
            Import records
          </ActionButton>
        </div>
      )}
      {add && (
        <form
          className="editor-panel"
          onSubmit={(e) => {
            e.preventDefault();
            a.run(() =>
              post(
                "/admin/leads",
                Object.fromEntries(new FormData(e.currentTarget)),
              ),
            ).then((r) => {
              if (r) {
                setAdd(false);
                reload();
              }
            });
          }}
        >
          <div className="form-grid">
            {["name", "email", "phone", "city"].map((k) => (
              <Field key={k} label={k}>
                <input
                  name={k}
                  type={k === "email" ? "email" : "text"}
                  required={["name", "email"].includes(k)}
                />
              </Field>
            ))}
          </div>
          <ActionButton>Add lead</ActionButton>
        </form>
      )}
      {edit && (
        <div className="editor-panel">
          <div className="panel-title">
            <h3>{edit.name}</h3>
            <button
              className="icon-button"
              onClick={() => setEdit(null)}
              aria-label="Close"
            >
              <X />
            </button>
          </div>
          <div className="form-grid">
            <Field label="Stage">
              <select
                value={edit.status}
                onChange={(e) => setEdit({ ...edit, status: e.target.value })}
              >
                {[
                  "New",
                  "Contacted",
                  "Follow-up",
                  "Interested",
                  "Converted",
                  "Closed",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Follow-up date">
              <input
                type="date"
                value={edit.follow_up || ""}
                onChange={(e) =>
                  setEdit({ ...edit, follow_up: e.target.value })
                }
              />
            </Field>
            <Field label="Tags">
              <input
                value={edit.tags || ""}
                onChange={(e) => setEdit({ ...edit, tags: e.target.value })}
              />
            </Field>
            <Field label="Assigned to">
              <input
                value={edit.assigned || ""}
                onChange={(e) => setEdit({ ...edit, assigned: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Notes">
            <textarea
              rows={4}
              value={edit.notes || ""}
              onChange={(e) => setEdit({ ...edit, notes: e.target.value })}
            />
          </Field>
          <label className="checkline">
            <input
              type="checkbox"
              checked={!!edit.suppressed}
              onChange={(e) =>
                setEdit({ ...edit, suppressed: e.target.checked })
              }
            />
            Suppress marketing to this contact
          </label>
          <div className="row-actions">
            <ActionButton
              onClick={() =>
                a
                  .run(() => post("/admin/leads/" + edit.id, edit, "PUT"))
                  .then((r) => {
                    if (r) {
                      setEdit(null);
                      reload();
                    }
                  })
              }
            >
              Save lead
            </ActionButton>
            <button
              className="button outline small"
              onClick={() =>
                a
                  .run(() => post("/admin/invite", { leadId: edit.id }))
                  .then(reload)
              }
            >
              Create client & invite
            </button>
          </div>
        </div>
      )}
      {rows.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Source / interest</th>
                <th>Stage</th>
                <th>Marketing</th>
                <th>Added</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((l: Entry) => (
                <tr key={l.id}>
                  <td>
                    <strong>{l.name}</strong>
                    <small>
                      {l.email}
                      <br />
                      {l.phone}
                    </small>
                  </td>
                  <td>
                    {l.source}
                    <small>{l.programme || "General enquiry"}</small>
                  </td>
                  <td>
                    <Badge>{l.status}</Badge>
                  </td>
                  <td>
                    {l.suppressed
                      ? "Suppressed"
                      : l.marketing
                        ? "Opted in"
                        : "Service only"}
                  </td>
                  <td>{date(l.created)}</td>
                  <td>
                    <button className="text-link" onClick={() => setEdit(l)}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty text="Enquiries, subscriptions and bookings will appear here with their source." />
      )}
    </>
  );
}
function BookingsPanel({ overview, reload }: any) {
  const a = useAction();
  return (
    <>
      <div className="editor-panel">
        <h3>Publish an available consultation slot</h3>
        <form
          className="inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            const b = Object.fromEntries(new FormData(e.currentTarget));
            a.run(() =>
              post("/admin/slots", {
                start: new Date(b.start as string).toISOString(),
              }),
            ).then(reload);
          }}
        >
          <Field
            label={`Start time (${Intl.DateTimeFormat().resolvedOptions().timeZone})`}
          >
            <input type="datetime-local" name="start" required />
          </Field>
          <ActionButton>Add available time</ActionButton>
        </form>
        <small>
          Duration and buffer are configured in Website CMS → Booking. Switch to
          slot booking to let visitors choose these times.
        </small>
        <div className="slot-list">
          {overview.slots.map((s: Entry) => (
            <span key={s.id}>
              {date(s.start)}
              <button
                className="icon-button"
                aria-label="Remove slot"
                onClick={() =>
                  a
                    .run(() =>
                      api("/admin/slots/" + s.id, { method: "DELETE" }),
                    )
                    .then(reload)
                }
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>
      <Status action={a} />
      {overview.bookings.length ? (
        <div className="record-list">
          {overview.bookings.map((b: Entry) => (
            <div className="booking-row" key={b.id}>
              <div>
                <strong>{b.name}</strong>
                <p>
                  {b.email} · {b.programme || "Consultation"}
                </p>
                <p>
                  {b.start ? date(b.start) : b.preferred || "Time to confirm"}
                </p>
              </div>
              <Badge>{b.status}</Badge>
              <div className="row-actions">
                {!["completed", "cancelled"].includes(b.status) && (
                  <>
                    <select
                      aria-label={"Assign slot for " + b.name}
                      defaultValue={b.slot_id || ""}
                      onChange={(e) => {
                        if (e.target.value)
                          a.run(() =>
                            post(
                              "/bookings/" + b.id,
                              { slot: e.target.value, status: "confirmed" },
                              "PATCH",
                            ),
                          ).then(reload);
                      }}
                    >
                      <option value="">Confirm available slot</option>
                      {overview.slots.map((s: Entry) => (
                        <option value={s.id} key={s.id}>
                          {date(s.start)}
                        </option>
                      ))}
                    </select>
                    <button
                      className="text-link"
                      onClick={() =>
                        a
                          .run(() =>
                            post(
                              "/bookings/" + b.id,
                              { status: "completed" },
                              "PATCH",
                            ),
                          )
                          .then(reload)
                      }
                    >
                      Complete
                    </button>
                    <button
                      className="text-link"
                      onClick={() =>
                        a
                          .run(() =>
                            post(
                              "/bookings/" + b.id,
                              { status: "cancelled" },
                              "PATCH",
                            ),
                          )
                          .then(reload)
                      }
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty text="Consultation requests and confirmed appointments will appear here." />
      )}
    </>
  );
}
function MailPanel({ overview }: any) {
  const [rows, setRows] = useState<Entry[]>([]),
    [selected, setSelected] = useState<string[]>([]),
    [types, setTypes] = useState(["welcome"]),
    [body, setBody] = useState(""),
    [subject, setSubject] = useState(""),
    [preview, setPreview] = useState(""),
    [force, setForce] = useState(false),
    [campaign, setCampaign] = useState(crypto.randomUUID());
  const a = useAction();
  const load = () => api("/admin/mail").then(setRows);
  useEffect(() => {
    load().catch((e) => a.setError(e.message));
  }, []);
  return (
    <>
      <div
        className={"notice " + (overview.integrations.email ? "success" : "")}
      >
        {overview.integrations.email
          ? "Email provider configured. “Accepted” means accepted by your SMTP provider, not proven inbox delivery."
          : "Email setup required. Messages are saved, but no emails are sent until SMTP is configured."}
      </div>
      <div className="mail-compose editor-panel">
        <h3>Write a note from Surya</h3>
        <div className="form-grid">
          <div>
            <Field label="Subject override (optional)">
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Use the template subject"
              />
            </Field>
            <Field label="Personal message (optional)">
              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </Field>
            <fieldset>
              <legend>Email templates</legend>
              {[
                "welcome",
                "inquiry",
                "enrolment",
                "checkin",
                "article",
                "manual",
              ].map((t) => (
                <label className="checkline" key={t}>
                  <input
                    type="checkbox"
                    checked={types.includes(t)}
                    onChange={(e) =>
                      setTypes(
                        e.target.checked
                          ? [...types, t]
                          : types.filter((x) => x !== t),
                      )
                    }
                  />
                  {t}
                </label>
              ))}
            </fieldset>
          </div>
          <div>
            <h4>Recipients</h4>
            <button
              className="text-link"
              onClick={() =>
                setSelected(
                  overview.leads
                    .filter((l: Entry) => l.marketing && !l.suppressed)
                    .map((l: Entry) => l.id),
                )
              }
            >
              Select active subscribers
            </button>
            <div className="recipient-list">
              {overview.leads.map((l: Entry) => (
                <label className="checkline" key={l.id}>
                  <input
                    type="checkbox"
                    checked={selected.includes(l.id)}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? [...selected, l.id]
                          : selected.filter((x) => x !== l.id),
                      )
                    }
                  />
                  <span>
                    {l.name}
                    <small>
                      {l.email} ·{" "}
                      {l.marketing && !l.suppressed
                        ? "Eligible"
                        : "Will be skipped"}
                    </small>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <label className="checkline">
          <input
            type="checkbox"
            checked={force}
            onChange={(e) => setForce(e.target.checked)}
          />
          Intentional resend — send a new copy even if this campaign was sent
          before. Unsubscribed recipients remain excluded.
        </label>
        <div className="row-actions">
          <button
            className="button outline small"
            onClick={() =>
              a
                .run(() =>
                  post("/admin/mail/preview", {
                    type: types[0] || "manual",
                    body,
                  }),
                )
                .then((r) => {
                  if (r) setPreview(r.html);
                })
            }
          >
            <Eye size={16} />
            Preview
          </button>
          <ActionButton
            disabled={!selected.length || !types.length || a.busy}
            onClick={() =>
              a
                .run(() =>
                  post("/admin/mail/send", {
                    leadIds: selected,
                    types,
                    body,
                    subject,
                    force,
                    campaign,
                  }),
                )
                .then(load)
            }
          >
            Queue {types.length} email{types.length !== 1 ? "s" : ""} per
            recipient
          </ActionButton>
          <button
            className="text-link"
            onClick={() => {
              setCampaign(crypto.randomUUID());
              a.setSuccess("New campaign started.");
            }}
          >
            New campaign
          </button>
        </div>
        <Status action={a} />
        {preview && (
          <div className="email-preview">
            <button className="text-link" onClick={() => setPreview("")}>
              Close preview
            </button>
            <iframe title="Branded email preview" srcDoc={preview} sandbox="" />
          </div>
        )}
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Recipient / subject</th>
              <th>Template</th>
              <th>Status</th>
              <th>Details</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id}>
                <td>
                  <strong>{m.recipient}</strong>
                  <small>{m.subject}</small>
                </td>
                <td>{m.template}</td>
                <td>
                  <Badge>{m.status}</Badge>
                </td>
                <td>{m.reason || `${m.attempts} attempts`}</td>
                <td>
                  <button
                    className="text-link"
                    onClick={() =>
                      a
                        .run(() =>
                          post("/admin/mail/" + m.id + "/retry", { force }),
                        )
                        .then(load)
                    }
                  >
                    Retry
                  </button>
                  <button
                    className="text-link"
                    onClick={() =>
                      api("/admin/mail/" + m.id + "/preview").then((r) =>
                        setPreview(r.html),
                      )
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
function UsersPanel({ overview, reload }: any) {
  const a = useAction();
  return (
    <>
      <div className="editor-panel">
        <h3>Invite a team member</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            a.run(() =>
              post(
                "/admin/users",
                Object.fromEntries(new FormData(e.currentTarget)),
              ),
            ).then(reload);
          }}
        >
          <div className="form-grid">
            <Field label="Name">
              <input name="name" required />
            </Field>
            <Field label="Email">
              <input name="email" type="email" required />
            </Field>
            <Field label="Role">
              <select name="role">
                <option value="coach">Coach — clients and coaching</option>
                <option value="editor">Editor — public content only</option>
              </select>
            </Field>
          </div>
          <ActionButton>Create invitation</ActionButton>
        </form>
      </div>
      <Status action={a} />
      <div className="record-list">
        {overview.users.map((u: Entry) => (
          <div key={u.id} className="record-row">
            <div>
              <strong>{u.name}</strong>
              <p>{u.email}</p>
            </div>
            <Badge>{u.role}</Badge>
            <select
              aria-label={"Role for " + u.name}
              value={u.role}
              onChange={(e) =>
                a
                  .run(() =>
                    post("/admin/users", { ...u, role: e.target.value }),
                  )
                  .then(reload)
              }
            >
              {["admin", "coach", "editor", "client"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <button
              className="text-link"
              onClick={() =>
                a
                  .run(() => post("/admin/users", { ...u, active: !u.active }))
                  .then(reload)
              }
            >
              {u.active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
export function Admin() {
  const { user, refresh, data } = useSite();
  const [active, setActive] = useState("overview"),
    [overview, setOverview] = useState<any>(null);
  const a = useAction();
  const reload = async () => {
    setOverview(await api("/admin/overview"));
    await refresh();
  };
  useEffect(() => {
    if (user && user.role !== "client")
      reload().catch((e) => a.setError(e.message));
  }, [user?.id]);
  if (!user)
    return (
      <div className="page-intro wrap">
        <h1>Your coaching studio.</h1>
        <p>Sign in to manage your website and clients.</p>
        <Link className="button" to="/login">
          Sign in
        </Link>
        <Link className="text-link" to="/setup">
          First-time setup
        </Link>
      </div>
    );
  if (user.role === "client")
    return (
      <div className="page-intro wrap">
        <h1>Your client space is ready.</h1>
        <Link to="/dashboard">Open your dashboard →</Link>
      </div>
    );
  if (!overview)
    return (
      <div className="loading">
        <Status action={a} />
        Loading coaching studio…
      </div>
    );
  const items: any[] = [
    ["overview", "Overview", LayoutDashboard],
    ["settings", "Website CMS", Settings],
    ["programmes", "Programmes", Dumbbell],
    ["leads", "Leads & CRM", Users],
    ["clients", "Clients", Users],
    ["bookings", "Consultations", CalendarDays],
    ["plans", "Client plans", Dumbbell],
    ["plan_templates", "Plan templates", FileText],
    ["checkins", "Check-ins", Activity],
    ["messages", "Coach messages", MessageCircle],
    ["stories", "Transformations", Heart],
    ["privacy_requests", "Privacy requests", ShieldCheck],
    ["enrolments", "Enrolments", Users],
    ["consents", "Publication consents", ShieldCheck],
    ["testimonials", "Testimonials", Heart],
    ["credentials", "Credentials", ShieldCheck],
    ["articles", "Journal", FileText],
    ["exercises", "Exercise library", Dumbbell],
    ["social", "Social content", Image],
    ["mail", "Email centre", Mail],
    ["media", "Media library", Image],
    ["analytics", "Analytics", Activity],
    ["payments", "Payments", FileText],
    ["users", "Users & permissions", ShieldCheck],
    ["integrations", "Integrations", Settings],
    ["audit", "Audit logs", ShieldCheck],
  ];
  const allowed = items.filter(
    ([key]) =>
      user.role === "admin" ||
      (user.role === "editor"
        ? [
            "overview",
            "programmes",
            "stories",
            "testimonials",
            "credentials",
            "articles",
            "exercises",
            "social",
            "media",
          ].includes(key)
        : !["settings", "users", "audit"].includes(key)),
  );
  return (
    <WorkspaceShell
      items={allowed}
      active={active}
      setActive={setActive}
      title={allowed.find((x) => x[0] === active)?.[1] || "Overview"}
      subtitle="A little organisation. More room for meaningful coaching."
    >
      <Status action={a} />
      {active === "consultation" && <Consultation embedded />}
      {active === "overview" && (
        <>
          <div className="stats-grid">
            {[
              ["Enquiries", overview.leads.length],
              [
                "Active clients",
                overview.users.filter(
                  (u: Entry) => u.role === "client" && u.active,
                ).length,
              ],
              [
                "Consultations",
                overview.bookings.filter((b: Entry) => b.status === "confirmed")
                  .length,
              ],
              ["Public page views", overview.counts.visits],
            ].map(([h, n]) => (
              <div className="stat" key={h}>
                <span>{h}</span>
                <strong>{n}</strong>
                <small>From your actual records</small>
              </div>
            ))}
          </div>
          <div className="dashboard-welcome">
            <div>
              <p className="eyebrow">YOUR COACHING, CONNECTED</p>
              <h2>
                Make space for
                <br />
                the next step.
              </h2>
              <p>
                Manage enquiries, share plans and support each client’s journey.
              </p>
              <ActionButton onClick={() => setActive("leads")}>
                Open your leads <ArrowUpRight size={16} />
              </ActionButton>
            </div>
            <SunGraphic />
          </div>
          <div className="two-panels">
            <div className="editor-panel">
              <h3>Recent enquiries</h3>
              {overview.leads.slice(0, 4).map((l: Entry) => (
                <div className="mini-row" key={l.id}>
                  <strong>{l.name}</strong>
                  <span>{l.source}</span>
                </div>
              ))}
              {!overview.leads.length && (
                <p>Your first enquiry will appear here.</p>
              )}
            </div>
            <div className="editor-panel">
              <h3>Setup overview</h3>
              <p>
                <Badge>
                  {overview.integrations.email
                    ? "Email configured"
                    : "Email setup required"}
                </Badge>
              </p>
              <p>
                <Badge>
                  {overview.integrations.payment
                    ? "Payments configured"
                    : "Payments not activated"}
                </Badge>
              </p>
              <p>
                Client stories and credentials stay unpublished until reviewed.
              </p>
            </div>
          </div>
        </>
      )}
      {active === "settings" && (
        <SettingsPanel overview={overview} reload={reload} />
      )}{" "}
      {Object.keys(moduleLabels).includes(active) && (
        <RecordsPanel kind={active} overview={overview} onReload={reload} />
      )}{" "}
      {active === "leads" && <LeadsPanel overview={overview} reload={reload} />}{" "}
      {active === "bookings" && (
        <BookingsPanel overview={overview} reload={reload} />
      )}{" "}
      {active === "mail" && <MailPanel overview={overview} />}{" "}
      {active === "users" && <UsersPanel overview={overview} reload={reload} />}{" "}
      {active === "clients" && (
        <>
          <div className="toolbar">
            <button className="button" onClick={() => setActive("leads")}>
              Invite a client from Leads <ArrowUpRight size={17} />
            </button>
            <button
              className="button outline"
              onClick={() => setActive("enrolments")}
            >
              Manage enrolments
            </button>
          </div>
          {overview.users.filter((u: Entry) => u.role === "client").length ? (
            <div className="record-list">
              {overview.users
                .filter((u: Entry) => u.role === "client")
                .map((u: Entry) => (
                  <div className="record-row" key={u.id}>
                    <div>
                      <strong>{u.name}</strong>
                      <p>{u.email}</p>
                    </div>
                    <Badge>{u.active ? "active" : "inactive"}</Badge>
                    <HealthReview clientId={u.id}/>
                    <button
                      className="text-link"
                      onClick={() => setActive("plans")}
                    >
                      Manage plans
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <Empty text="Convert a lead to create a client account and send an invitation." />
          )}
        </>
      )}{" "}
      {active === "media" && (
        <>
          <div className="editor-panel">
            <MediaUpload onChange={() => reload()} />
          </div>
          <div className="media-grid">
            {overview.media.map((m: Entry) => (
              <div key={m.id}>
                <img
                  src={"/api/media/" + m.id}
                  alt={m.alt || "Uploaded media"}
                />
                <strong>{m.alt || "Untitled image"}</strong>
                <small>
                  {m.width} × {m.height} ·{" "}
                  {m.approved ? "Approved" : "Approval not recorded"}
                </small>
                <button
                  className="text-link"
                  onClick={() =>
                    navigator.clipboard
                      .writeText("/api/media/" + m.id)
                      .then(() => a.setSuccess("Image URL copied."))
                  }
                >
                  Copy image URL
                </button>
              </div>
            ))}
          </div>
        </>
      )}{" "}
      {active === "analytics" && (
        <>
          <div className="notice">
            Opt-in public-page analytics only. City and country are not
            inferred. Private dashboard content is excluded.
          </div>
          <div className="stats-grid">
            <div className="stat">
              <span>Page views</span>
              <strong>{overview.counts.visits}</strong>
            </div>
            <div className="stat">
              <span>Browser sessions</span>
              <strong>{overview.counts.sessions}</strong>
            </div>
          </div>
          <div className="editor-panel">
            <h3>Popular pages</h3>
            {overview.traffic.map((p: Entry) => (
              <div className="traffic-row" key={p.path}>
                <span>{p.path}</span>
                <div>
                  <span
                    style={{
                      width: `${(p.views / Math.max(1, ...overview.traffic.map((x: Entry) => x.views))) * 100}%`,
                    }}
                  />
                </div>
                <b>{p.views}</b>
              </div>
            ))}
          </div>
        </>
      )}{" "}
      {active === "integrations" && (
        <div className="editor-panel prose">
          <h2>Connected with care.</h2>
          <h3>Email</h3>
          <p>
            Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM
            in your server environment. Queued setup-required emails must be
            intentionally retried after configuration.
          </p>
          <h3>Payments</h3>
          <p>
            Configure RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET and
            RAZORPAY_WEBHOOK_SECRET. Webhook endpoint: /api/payments/webhook.
            Test and live keys remain separate. Never paste secrets into public
            CMS fields.
          </p>
          <h3>AI assistance</h3>
          <p>
            Not activated. No client records are sent to AI services. Content
            and coaching plans remain manually reviewed.
          </p>
          <h3>Storage</h3>
          <p>
            Database and media are in the persistent DATA_DIR. Keep this volume
            when redeploying and use the documented backup process.
          </p>
        </div>
      )}{" "}
      {active === "payments" && (
        <div className="record-list">
          {overview.payments.length ? (
            overview.payments.map((p: Entry) => (
              <div key={p.id} className="record-row">
                <div>
                  <strong>₹{p.amount / 100}</strong>
                  <p>{p.programme}</p>
                  <small>{p.id}</small>
                </div>
                <Badge>{p.status}</Badge>
                <span>{date(p.created)}</span>
              </div>
            ))
          ) : (
            <Empty text="Verified payment records will appear here when checkout is configured." />
          )}
        </div>
      )}{" "}
      {active === "audit" && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Actor</th>
                <th>Target</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {overview.audit.map((l: Entry) => (
                <tr key={l.id}>
                  <td>{l.action}</td>
                  <td>
                    {overview.users.find((u: Entry) => u.id === l.actor)
                      ?.name || l.actor}
                  </td>
                  <td>{l.target}</td>
                  <td>{date(l.created)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </WorkspaceShell>
  );
}
function SunGraphic() {
  return <div className="dashboard-sun">✳</div>;
}
export function ClientDashboard() {
  const { user, setUser } = useSite();
  const [active, setActive] = useState("overview"),
    [d, setD] = useState<any>(null),
    [photo, setPhoto] = useState("");
  const a = useAction();
  const load = () => api("/client").then(setD);
  useEffect(() => {
    if (user) load().catch((e) => a.setError(e.message));
  }, [user?.id]);
  if (!user)
    return (
      <div className="page-intro wrap">
        <h1>
          Your stronger chapter
          <br />
          has a home.
        </h1>
        <Link to="/login" className="button">
          Client sign in
        </Link>
      </div>
    );
  if (!d)
    return (
      <div className="loading">
        <Status action={a} />
        Loading your coaching space…
      </div>
    );
  const items = [
    ["overview", "My overview", LayoutDashboard],
    ["consultation", "Consultation & diary", Heart],
    ["workout", "My workouts", Dumbbell],
    ["nutrition", "My nutrition", Leaf],
    ["appointments", "Appointments", CalendarDays],
    ["checkins", "Check-ins", Heart],
    ["progress", "My progress", Activity],
    ["messages", "Messages", MessageCircle],
    ["billing", "Billing", FileText],
    ["profile", "Profile & privacy", ShieldCheck],
  ];
  return (
    <WorkspaceShell
      items={items}
      active={active}
      setActive={setActive}
      title={items.find((x) => x[0] === active)?.[1]}
      subtitle="Your pace. Your progress. Your space."
    >
      <Status action={a} />
      {active === "consultation" && <Consultation embedded />}
      {active === "overview" && (
        <>
          <div className="dashboard-welcome">
            <div>
              <p className="eyebrow">
                WELCOME BACK, {user.name.split(" ")[0].toUpperCase()}
              </p>
              <h2>
                Keep showing up
                <br />
                for yourself.
              </h2>
              <p>Your next step doesn’t need to be a big one.</p>
              <ActionButton onClick={() => setActive("workout")}>
                See my plan <ArrowUpRight size={16} />
              </ActionButton>
            </div>
            <SunGraphic />
          </div>
          <div className="stats-grid">
            {[
              ["Assigned plans", d.plans.length],
              [
                "Workout check-offs",
                d.completions.filter((c: Entry) => c.completed).length,
              ],
              ["Check-ins", d.checkins.length],
              [
                "Upcoming appointments",
                d.bookings.filter(
                  (b: Entry) =>
                    b.status === "confirmed" &&
                    Date.parse(b.start) > Date.now(),
                ).length,
              ],
            ].map(([h, n]) => (
              <div className="stat" key={h}>
                <span>{h}</span>
                <strong>{n}</strong>
              </div>
            ))}
          </div>
          <h3>My programmes</h3>
          {d.enrolments.length ? (
            d.enrolments.map((e: Entry) => (
              <div className="record-row" key={e.id}>
                <strong>{e.title || e.programme}</strong>
                <Badge>{e.status}</Badge>
              </div>
            ))
          ) : (
            <Empty text="Your coach will share your agreed programme here after enrolment." />
          )}
        </>
      )}
      {["workout", "nutrition"].includes(active) && (
        <>
          {d.plans.filter((p: Entry) => p.type === active).length ? (
            d.plans
              .filter((p: Entry) => p.type === active)
              .map((p: Entry) => (
                <div className="editor-panel client-plan" key={p.id}>
                  <div className="panel-title">
                    <div>
                      <p className="eyebrow">
                        COACH APPROVED · VERSION {p.version}
                      </p>
                      <h2>{p.title}</h2>
                      <p>{p.week}</p>
                    </div>
                    <button
                      className="button outline small"
                      onClick={() =>
                        download(
                          "my-coaching-plan.txt",
                          [
                            p.title,
                            p.week,
                            ...(p.items || []).map(
                              (x: Entry) =>
                                `${x.name}: ${x.prescription}\nAlternative: ${x.alternative || "—"}`,
                            ),
                            p.body,
                          ].join("\n\n"),
                        )
                      }
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                  {(p.items || []).map((x: Entry, i: number) => (
                    <div className="client-plan-item" key={i}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{x.name}</h3>
                        <p>{x.prescription}</p>
                        {x.alternative && (
                          <small>Alternative: {x.alternative}</small>
                        )}
                        {x.video && /^https?:\/\//.test(x.video) && (
                          <a
                            className="text-link"
                            href={x.video}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View demonstration ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  <p className="preline">{p.body}</p>
                  {active === "workout" && (
                    <label className="checkline">
                      <input
                        type="checkbox"
                        checked={
                          !!d.completions.find(
                            (c: Entry) =>
                              c.plan === p.id &&
                              c.date === new Date().toISOString().slice(0, 10),
                          )?.completed
                        }
                        onChange={(e) =>
                          a
                            .run(
                              () =>
                                post("/client/completions", {
                                  plan: p.id,
                                  date: new Date().toISOString().slice(0, 10),
                                  completed: e.target.checked,
                                }),
                              "Progress saved.",
                            )
                            .then(load)
                        }
                      />
                      I completed today’s session
                    </label>
                  )}
                </div>
              ))
          ) : (
            <Empty
              text={`Your coach-reviewed ${active === "workout" ? "workout" : "nutrition"} plan will appear here when it’s ready.`}
            />
          )}
        </>
      )}
      {active === "appointments" && (
        <>
          {d.bookings.length ? (
            d.bookings.map((b: Entry) => (
              <div className="editor-panel" key={b.id}>
                <Badge>{b.status}</Badge>
                <h3>{b.start ? date(b.start) : "Requested: " + b.preferred}</h3>
                <p>{b.programme || "Consultation with Surya"}</p>
                {b.start && (
                  <a
                    className="text-link"
                    href={"/api/bookings/" + b.id + "/calendar"}
                  >
                    Add to calendar ↗
                  </a>
                )}
                {!["cancelled", "completed"].includes(b.status) && (
                  <div className="row-actions">
                    <button
                      className="button outline small"
                      onClick={() =>
                        a
                          .run(
                            () =>
                              post(
                                "/bookings/" + b.id,
                                { status: "cancelled" },
                                "PATCH",
                              ),
                            "Appointment cancelled.",
                          )
                          .then(load)
                      }
                    >
                      Cancel appointment
                    </button>
                    <button
                      className="text-link"
                      onClick={() =>
                        a
                          .run(
                            () =>
                              post(
                                "/bookings/" + b.id,
                                {
                                  status: "pending",
                                  preferred: "Please contact me to reschedule.",
                                },
                                "PATCH",
                              ),
                            "Reschedule requested.",
                          )
                          .then(load)
                      }
                    >
                      Request reschedule
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <Empty text="No appointments yet.">
              <Link to="/book" className="button">
                Request a consultation
              </Link>
            </Empty>
          )}
        </>
      )}
      {["checkins", "messages"].includes(active) && (
        <>
          <form
            className="editor-panel"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              a.run(
                () =>
                  post(
                    "/client/" + active,
                    Object.fromEntries(new FormData(form)),
                  ),
                "Shared securely with your coach.",
              ).then((r) => {
                if (r) {
                  form.reset();
                  load();
                }
              });
            }}
          >
            <h3>
              {active === "checkins"
                ? "How has your week been?"
                : "A note for your coach"}
            </h3>
            <Field label="Subject">
              <input name="title" required />
            </Field>
            <Field label="Your message">
              <textarea rows={5} name="body" required />
            </Field>
            <ActionButton disabled={a.busy}>Send to Surya</ActionButton>
          </form>
          {d[active].map((m: Entry) => (
            <div className="editor-panel" key={m.id}>
              <h3>{m.title}</h3>
              <p className="preline">{m.body}</p>
              <small>{date(m.created)}</small>
            </div>
          ))}
        </>
      )}
      {active === "progress" && (
        <>
          <div className="editor-panel">
            <h3>Notice your progress.</h3>
            <p>
              Measurements are optional. Consistency and how you feel matter,
              too.
            </p>
            {d.progress.filter((p: Entry) => p.weight).length > 1 && (
              <div className="progress-chart">
                <svg
                  viewBox="0 0 600 150"
                  role="img"
                  aria-label="Your recorded weight trend"
                >
                  <polyline
                    fill="none"
                    stroke="#244a3c"
                    strokeWidth="3"
                    points={(() => {
                      const r = [...d.progress]
                          .reverse()
                          .filter((p: Entry) => p.weight),
                        lo = Math.min(...r.map((p: Entry) => p.weight)),
                        hi = Math.max(...r.map((p: Entry) => p.weight));
                      return r
                        .map(
                          (p: Entry, i: number) =>
                            `${20 + (i / (r.length - 1)) * 560},${130 - ((p.weight - lo) / Math.max(hi - lo, 1)) * 110}`,
                        )
                        .join(" ");
                    })()}
                  />
                </svg>
                <small>
                  Recorded weight over time — individual measurements shown
                  below.
                </small>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                a.run(
                  () =>
                    post("/client/progress", {
                      ...Object.fromEntries(new FormData(form)),
                      photo,
                    }),
                  "Progress saved privately.",
                ).then((r) => {
                  if (r) {
                    form.reset();
                    setPhoto("");
                    load();
                  }
                });
              }}
            >
              <div className="form-grid">
                <Field label="Date">
                  <input
                    type="date"
                    name="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    required
                  />
                </Field>
                <Field label="Weight in kg (optional)">
                  <input
                    name="weight"
                    type="number"
                    min="20"
                    max="400"
                    step=".1"
                  />
                </Field>
                <Field label="Other measurement / achievement (optional)">
                  <input name="measurement" />
                </Field>
              </div>
              <Field label="How are you feeling?">
                <textarea name="note" rows={3} />
              </Field>
              <MediaUpload privateFile value={photo} onChange={setPhoto} />
              <ActionButton disabled={a.busy}>Save progress</ActionButton>
            </form>
          </div>
          {d.progress.map((p: Entry) => (
            <div className="record-row" key={p.id}>
              <div>
                <strong>{p.date}</strong>
                <p>{p.note}</p>
                {p.photo && (
                  <a href={p.photo} target="_blank" rel="noreferrer">
                    View private photo ↗
                  </a>
                )}
              </div>
              <span>
                {p.weight ? `${p.weight} kg` : ""}
                <small>{p.measurement}</small>
              </span>
            </div>
          ))}
        </>
      )}
      {active === "billing" &&
        (d.payments.length ? (
          d.payments.map((p: Entry) => (
            <div key={p.id} className="record-row">
              <div>
                <strong>₹{p.amount / 100}</strong>
                <small>Reference: {p.id}</small>
                <p>{p.programme}</p>
              </div>
              <Badge>{p.status}</Badge>
            </div>
          ))
        ) : (
          <Empty text="No payment records. Pricing is agreed before enrolment." />
        ))}
      {active === "profile" && (
        <>
          <form
            className="editor-panel"
            onSubmit={(e) => {
              e.preventDefault();
              const b: any = Object.fromEntries(new FormData(e.currentTarget));
              if (!b.password) {
                delete b.password;
                delete b.currentPassword;
              }
              a.run(() => post("/client/profile", b, "PUT")).then((r) => {
                if (r) setUser({ ...user, name: b.name });
              });
            }}
          >
            <h3>Your profile</h3>
            <Field label="Name">
              <input name="name" defaultValue={user.name} required />
            </Field>
            <Field label="Current password (only to change password)">
              <input
                name="currentPassword"
                type="password"
                autoComplete="current-password"
              />
            </Field>
            <Field label="New password (optional, 12+ characters)">
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={12}
              />
            </Field>
            <ActionButton>Save profile</ActionButton>
          </form>
          <div className="editor-panel">
            <h3>Your information, your choices.</h3>
            <div className="row-actions">
              <a className="button outline small" href="/api/client/export">
                Export my information
              </a>
              <button
                className="text-link"
                onClick={() =>
                  a.run(
                    () => post("/client/privacy-request", { type: "delete" }),
                    "Deletion request received. Surya will follow up.",
                  )
                }
              >
                Request account/data deletion
              </button>
              <button
                className="text-link"
                onClick={() =>
                  a.run(
                    () =>
                      post(
                        "/client/profile",
                        { name: user.name, marketing: false },
                        "PUT",
                      ),
                    "Marketing disabled.",
                  )
                }
              >
                Unsubscribe from marketing
              </button>
            </div>
            <Link to="/policies/privacy">Read the privacy policy →</Link>
          </div>
        </>
      )}
    </WorkspaceShell>
  );
}

function PolicyFields({ value, onChange }: any) {
  const [slug, setSlug] = useState("privacy");
  const p = value[slug] || policies[slug];
  const update = (patch: any) =>
    onChange({
      ...value,
      [slug]: {
        ...p,
        ...patch,
        updated: new Date().toISOString().slice(0, 10),
      },
    });
  return (
    <>
      <Field label="Policy page">
        <select value={slug} onChange={(e) => setSlug(e.target.value)}>
          {Object.entries(policies).map(([k, p]) => (
            <option value={k} key={k}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Page title">
        <input
          value={p.title}
          onChange={(e) => update({ title: e.target.value })}
        />
      </Field>
      <Field label="Introduction">
        <textarea
          value={p.intro}
          onChange={(e) => update({ intro: e.target.value })}
        />
      </Field>
      {p.sections.map(([heading, body]: string[], i: number) => (
        <fieldset key={i}>
          <Field label="Section heading">
            <input
              value={heading}
              onChange={(e) =>
                update({
                  sections: p.sections.map((v: any, j: number) =>
                    i === j ? [e.target.value, v[1]] : v,
                  ),
                })
              }
            />
          </Field>
          <Field label="Policy text">
            <textarea
              rows={5}
              value={body}
              onChange={(e) =>
                update({
                  sections: p.sections.map((v: any, j: number) =>
                    i === j ? [v[0], e.target.value] : v,
                  ),
                })
              }
            />
          </Field>
        </fieldset>
      ))}
    </>
  );
}
