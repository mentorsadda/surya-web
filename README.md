# Train with Surya

Independent fitness coaching website, CMS, lead CRM and private client portal for Surya Singh.

Business email: surya737singh@gmail.com
WhatsApp / phone: +91 82993 75609

## Project knowledge and future sessions

Start with `AGENTS.md` and `docs/context/PROJECT-CONTEXT.md`. The `docs/context/` folder preserves the original master preferences, original Surya prompt, later user corrections, biography evidence, asset provenance, architecture and known implementation gaps. Keep this context with the project; it contains no credentials or client health records.

## Run locally

Requires Node.js 24 or newer. Install with `npm ci`, then `npm run dev`.
Open http://127.0.0.1:3040. The API and website run together.

On this Mac, the system Node is older. Use:

```sh
export PATH='/Users/akhilesh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin':"$PATH"
npm run dev
```

Build: `npm run build`. Validate: `npm test`. Production: `npm start`.

## First administrator

Open `/setup`. Read the private local `data/bootstrap-token.txt` file and paste its one-time key into the setup form. Choose your own password of at least 12 characters. The key file is deleted when setup succeeds. There is no default admin password. The supplied business email is prefilled, but an authorised owner chooses credentials.

The administration area is `/admin`; clients sign in at `/login` and access `/dashboard`. Client and staff accounts are invited from the admin area. Invitations and reset links require the mail service below.

## What is connected

- Responsive public pages, three-scene scroll hero, coaching programmes, six-step programme finder, contact/consultation requests, newsletter and WhatsApp.
- Editable site settings, hero, sections, programmes, articles, consent-gated client stories, credentials, media and seven policy pages.
- Persistent lead records, tags, stages, notes, follow-ups, CSV import/export, account invitations and appointment slots with collision protection.
- Role-based admin/coach/editor/client access. Coach-approved assigned workout/nutrition plans, versions, private progress photos, check-ins, messages, daily workout tracking and calendar downloads.
- Branded transactional email templates, queue, previews, explicit campaign sending, suppression, duplicate prevention and delivery state visibility.
- Payment order integration and signed server-side capture events. Provider credentials are required; no payments have been collected or live-tested.
- Consent-based public analytics, sitemap, metadata, privacy export/request controls and restricted client media.

## Configure services

Copy `.env.example` to `.env` and fill the relevant server-side variables. Do not put secrets in CMS fields or source control.

Email requires SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and MAIL_FROM. Set SMTP_SECURE as appropriate for the provider. Authenticate the sending domain with SPF/DKIM/DMARC. A Gmail contact address does not itself configure email delivery. Existing `setup_required` mail requires an explicit admin retry after configuration. SMTP acceptance is recorded as accepted, not delivered/opened.

Payments require RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET. Configure the provider webhook to `/api/payments/webhook`, enable capture/failure/refund events, and test the provider sandbox before enabling real checkout. Add agreed programme prices only after inclusions and commercial terms are confirmed. No recurring billing is configured.

AI assistance is not activated. Current content and plan editing is manual; no client data is sent to AI services.

## Content and policy operation

Public client results are intentionally empty until genuine stories and publication consent are supplied. The reported Delhi NCR ranking is a private draft pending evidence; there are no fabricated results, client counts or before/after photos. Current portrait is a user-supplied local file; record additional asset consent before publishing identifiable client photos.

Policy drafts cover privacy, terms, bookings/cancellation, payment/refund, fitness/nutrition disclaimer, photo/testimonial consent and cookies. Website CMS → Policies edits them. Commercial details such as cancellation charges, programme expiry and refund deductions are not invented; provide agreed terms before taking a purchase. These pages should reflect the actual business practices when launched.

Privacy requests appear under Privacy requests for admin/coaches. Review identity, respond and record resolution. Deletion across records, providers and backups is an operator process; changing request status does not automatically delete data.

## Persistent storage and backups

SQLite and uploaded photos live in DATA_DIR (default `data`). Preserve this directory across deployments. Keep it private; never serve it as a static folder or commit it. Run `npm run backup` for a consistent SQLite snapshot and a copy of media in `backups/<timestamp>`; set BACKUP_DIR for another private location. Store off-host encrypted copies and test restores. Pause uploads during the backup if a perfectly matching media snapshot is needed.

Restore while the app is stopped: copy the backed-up `surya.sqlite` and `uploads` directory into a fresh DATA_DIR, then start the app. Do not restore a database over live SQLite WAL files. The deployment uses a single Node process; do not use ephemeral/serverless storage or independently replicated SQLite files.

## Production boundary

No hosting deployment, DNS change, payment collection or external email campaign has been performed. To deploy, use a Node 24 server with a persistent private volume, HTTPS reverse proxy, NODE_ENV=production, correct PUBLIC_URL, backups and service credentials. Production session cookies require HTTPS. Test the domain and provider integrations before announcing launch.

## Verification

`tests/workflows.test.mjs` uses a disposable independent database and port. It verifies business settings, role access, CSRF origin rejection, duplicate leads, mail setup status, concurrent booking collisions, calendar ownership, plan approval and client isolation, privacy requests, marketing suppression, payment event idempotency and restart persistence. It does not send emails or make external payments.

Browser checks cover desktop homepage, phone layout, contact and privacy pages, programme finder and navigation. See `docs/QA.md` for exact completion boundaries.
