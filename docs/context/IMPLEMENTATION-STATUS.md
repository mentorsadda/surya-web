# Implementation and handover snapshot

Recorded 29 September 2026. This is a dated code/handover snapshot; verify the repository and runtime before making new completion claims. The complete requested scope remains in the original build prompt. A listed requirement is not automatically finished.

## Architecture and files

- React + TypeScript + Vite frontend; React Router and Lucide icons.
- Express backend with Node built-in SQLite. **Node 24+ is required**; the Mac's default Node 20 cannot run `node:sqlite`.
- `src/main.tsx`: public pages, routing, hero, forms, programme finder, auth and policies.
- `src/workspace.tsx`: CMS, CRM, media editor, admin and client dashboard.
- `src/styles.css`: visual system, responsive layout and motion.
- `src/policies.ts`: seven base policies; saved CMS overrides live in database settings.
- `server/index.mjs`: API, permissions, booking, upload, payment and SPA server.
- `server/db.mjs`: schema, durable storage, auth helpers and initial seeding.
- `server/seed.mjs`: initial brand settings, five programmes, article/credential drafts. Do not overwrite existing database settings when changing seed defaults.
- `server/mail.mjs`: templates, outbox, suppression, retry state and SMTP processing.
- `tests/workflows.test.mjs`: isolated HTTP workflow regression suite.
- `scripts/backup.mjs`: consistent SQLite backup plus uploaded media copy.
- `data/surya.sqlite` and `data/uploads/`: operational private storage, excluded from source control. Actual client information remains here rather than in documentation.

## Public routes

`/`, `/meet-surya`, `/programmes`, `/programmes/:id`, `/finder`, `/book`, `/contact`, `/transformations`, `/transformations/:id`, `/journal`, `/journal/:id`, `/policies/:slug`, `/login`, `/setup`, `/forgot-password`, `/reset`, `/unsubscribe`, `/admin`, `/dashboard`.

## Implemented scope and boundaries

| Area | Implemented | Boundary / next verification |
|---|---|---|
| Public design | Real portrait, responsive editorial design, hero scenes, programme cards, story/method, social profile links, WhatsApp, footer | More approved photos and real social content can extend it; no fabricated client proof |
| Programme finder | Six-step selection and rule-based programme suggestions | Matching is coaching-format guidance, not a medical assessment |
| Contact/CRM | Durable enquiries, newsletter opt-in, deduplication, sources, lead stages/notes/tags/follow-up, CSV operations | Full master-prompt CRM scope should be audited before declaring every advanced control complete |
| CMS | Settings, hero, section enable/order, programmes, articles, stories, testimonials, credentials, exercises, social records and policies | Not every public phrase or requested advanced module is necessarily CMS-editable; verify field-to-page behaviour |
| Booking | Request/slot modes, duration/buffer, collision protection, status changes, client access, calendar export, reminder queue | Confirm real availability/location, service terms and live email before customer use |
| Accounts | One-time owner setup; admin/coach/editor/client roles, server enforcement, reset/invite tokens | Owner chooses real password; invitation/reset delivery depends on SMTP |
| Client coaching | Assigned coach-approved workout/nutrition plans, versions, check-ins, messages, private progress photos/measurements, daily completion and downloads | Genuine training content requires coach input; templates exist but full one-click assignment and comprehensive onboarding need further work |
| Email | Branded templates, outbox, previews, campaigns, suppression, dedupe and retries | SMTP not configured/live-tested. Accepted does not mean delivered/opened. Advanced editable templates/preheaders, test-send UX and provider delivery tracking need further work |
| Payments | Provider order API, signed capture/failure events, idempotent enrolment and refund-event records | No live credentials, approved prices or real checkout test. Refund initiation and complete refund-to-entitlement lifecycle need further work |
| Privacy | Seven policy pages, separate marketing choice, client export/request, admin privacy-request records, private-media access | Resolving a request does not automatically erase all data/providers/backups; manual handling remains necessary |
| Media | Upload/crop/preview, WebP conversion, metadata and restricted private files | Additional actual assets and publication consent remain required |
| Analytics/SEO | Consent-gated public events, basic actual metrics/top pages, metadata/canonical/schema, robots/sitemap | Full requested date filters, attribution/conversion reporting, per-content social previews and measured performance audit are not established |
| Storage | Persistent SQLite/media, non-overwriting seed, private backup script | Restore procedure documented but full disaster-recovery rehearsal not established |
| AI | Clear inactive integration state | AI drafting/coaching automation is not implemented as a working external integration |

Other full-brief follow-ups: editable biography timeline; comprehensive exercise/video library and social embeds; configurable newsletter popup; richer scheduled-blog notifications; consent-withdrawal lifecycle; complete responsive/reduced-motion/full-scroll QA. Do not collapse these into “everything complete”. Reconcile each against current code before starting; the snapshot can become stale.

## Validation already recorded

Previous implementation run completed a production build and **10 passing automated tests**. Tests used a disposable independent database and exercised contact settings, role/origin checks, lead deduplication, mail setup state, concurrent booking collisions, calendar ownership, plan approval/client isolation, privacy requests, marketing suppression, payment event idempotency and restart persistence.

Browser checks recorded: desktop homepage; phone width 390 without horizontal overflow on inspected pages; contact number/email and privacy content; initial finder navigation; isolated QA admin login and policy save; client login, assigned workout and completion surviving reload. This is not an exhaustive browser audit of every module. No test clients/credentials were added to the business database. Backup creation was exercised; live email/payment and production hosting were not.

These are historical results from `docs/QA.md` and the prior task work, not new test runs performed just to save this knowledge pack.

## Run and access

Default local preview: http://127.0.0.1:3040. A local process must be running; this is not a permanent hosted URL. Verify `/api/health` reports `train-with-surya` and the listener belongs to this directory before sharing it.

Use Node 24+ (`README.md` contains the bundled Mac runtime path). Commands: `npm ci`, `npm run dev`, `npm run build`, `npm test`, `npm run backup`.

Real administrator setup: `/setup`, using the local one-time `data/bootstrap-token.txt` and an owner-chosen password. Do not put its contents into docs or create a default password. Admin `/admin`; client `/dashboard`.

## External dependencies still needed

- Verified programme pricing, durations, support arrangements and locations.
- Genuine client outcomes and publication consents; evidence/approved wording for ranking and credentials.
- SMTP configuration and authenticated sender; contact Gmail alone is not an email integration.
- Razorpay server keys and webhook secret, sandbox tests, then explicit launch decision.
- Chosen public domain/hosting, persistent storage, HTTPS and deployment authorisation.
- AI provider/approved workflow if that remaining feature is implemented; do not send private health data by default.

No production deployment, external marketing campaign, real payment or social-account publishing was authorised or performed in the recorded implementation.

## Latest visual update

A slate-blue reference redesign replaced the earlier green/orange presentation. New hero and coach portraits, programme images, lifestyle photos, watermark treatment and CMS image controls are documented in `docs/REDESIGN-2026-09-29.md`. This visual update does not mark earlier outstanding business/integration features complete.

## Hero video and logo update

29 September 2026: Higgsfield-generated 8-second body/face-motion loop added to first/third hero scenes, with pause/play, visibility pausing, reduced-motion and error poster fallback. Exact user-supplied transparent logo replaces the previous text logo in the shared component. Both asset paths are persisted CMS settings and initial defaults. See `docs/HERO-VIDEO-2026-09-29.md` for provenance and verification boundaries.


## Latest correction — static hero, 29 September 2026

User requested removing the hero video and using the supplied `exec-06b860b1-3dae-4a61-899a-699dd4840d16.png` image. Current CMS and seed defaults set `heroVideo` to an empty string and `heroImage` to `/images/surya/hero-selected.png` (exact copy). No video or motion button renders. Generated videos remain archived; do not re-enable them without a new user request. The transparent logo and existing hero scroll scenes remain.

### Consultation update — 29 September 2026
- /consultation plus Dashboard → Consultation & diary; /book and /login link to onboarding.
- New self-registered accounts are server-forced client role; no email verification yet. Existing login/invite/reset continue unchanged. SMTP remains necessary for real password-reset delivery.
- Required age 18–100, height, weight and goals; optional target, food habits/preferences/allergies, routine, health conditions, medications, injuries, sleep/water and expectations. Explicit dated health consent. Each save creates an intake version.
- Owner-scoped diary CRUD, health JSON export, historical intake deletion, coach/admin read access with audit event; editors and other clients blocked.
- CSV + Apple Health body-weight XML import, local parsing/preview, transaction validation, source labels and deterministic duplicate prevention. XML up to 15 MB and 1,000 supported records; not a full Apple export importer. No provider OAuth/native sync, background sync or native application has been built.
- Verified build, 12 passing HTTP tests (including registration, privacy, validation, duplicate/atomic import, edit/delete and restart persistence). Isolated browser QA verified login, intake save, diary save and Apple XML lb→kg preview/save; mobile 390px layout inspected. Actual client data/accounts were not used for testing.
