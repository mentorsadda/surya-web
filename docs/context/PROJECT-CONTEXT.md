# Surya Web — durable project knowledge

Recorded: 29 September 2026. Purpose: keep the available Surya information, user instructions, design choices and implementation context together in the Surya Web folder. This is a project knowledge pack, not model training or a public biography. It contains no passwords, service keys or private client records.

## Read first

| File | Purpose |
|---|---|
| `AGENTS.md` | Entry instructions for future coding agents working in this repository |
| `docs/context/PROJECT-CONTEXT.md` | Brand facts, contacts, decisions and evidence status |
| `docs/context/IMPLEMENTATION-STATUS.md` | Architecture, modules, verification and unresolved scope |
| `docs/context/ASSETS-AND-SOURCES.md` | Supplied profiles, photo provenance and source inventory |
| `docs/context/sources/USER-DECISIONS.md` | Later user corrections and requests after the original prompt |
| `docs/context/sources/MASTER-PROJECT-PREFERENCES.txt` | Exact supplied MyDose/Nisha reusable master prompt |
| `docs/context/sources/SURYA-ORIGINAL-BUILD-PROMPT.txt` | Exact supplied complete Surya build prompt |
| `docs/PROJECT-BRIEF.txt` | Existing working copy of that Surya prompt |
| `README.md` | Run, admin setup, services, storage, backup and deployment instructions |
| `docs/QA.md` | Dated validation record, not a promise of current server health |

## Owner-approved contact details

- Person: Surya Singh. Pronouns: she/her, according to the user.
- Working website brand: **Train with Surya**.
- Role: **Personal Trainer & Fitness Coach**.
- Email supplied by the user: **surya737singh@gmail.com**. User supplied this in response to a question asking for business/admin email. Owner still selects real administrator credentials.
- WhatsApp/contact number supplied by the user: **8299-375609**.
- International format used in this project: **+91 82993 75609**; numeric link value **918299375609**.
- Phone is for WhatsApp and Contact Us, with consistent contact references in footer and relevant policy pages.
- Instagram: https://www.instagram.com/surya.singhhhh/
- Facebook: https://www.facebook.com/surya.singh.928762
- No approved public domain, address, gym location, opening hours, prices or legal company registration details have been supplied.

## Biography: preserve facts and their evidence labels

| Information | Evidence / publication treatment |
|---|---|
| Female fitness trainer named Surya Singh | Direct user-provided identity |
| Approximately two years as a personal trainer at the company the user called “Cut Fit” | User-reported. Available supplied research refers to cult.fit. Confirm employer spelling, employment dates and whether current before making a dated public employment claim. Do not automatically increment the duration over time. |
| Reportedly among Delhi NCR's top five trainers every month | User-reported; ranking body, criteria, category, months and evidence not provided. Keep ranking CMS record as a draft until substantiated. |
| Personal transformation from higher body weight in her twenties to current fitness | User-reported. Use respectful language focused on habits, strength and confidence. Do not invent weight, weight lost, duration or exact age. |
| Height 5 feet 9 inches | User-reported, optional biography; not a coaching credential. |
| Multiple happy clients and client transformations | User-reported, with no exact counts, approved testimonials, measurements or consent records supplied. |
| Certificate image states “CULT CERTIFIED PERSONAL TRAINER”, dated 17 February 2025 | Research observation recorded in original supplied brief from Instagram CULT highlight. Not independently verified with issuer and not re-verified when making this knowledge pack. Existing credential record remains draft. |

The website is an independent coaching brand. Do not imply it is an official employer/gym website. Do not claim medical or registered-dietitian qualifications. No body shaming, fabricated results or guaranteed weight-loss timelines.

## Coaching offer and target audience

User requested one-to-one coaching, diet-chart/nutrition support, home workouts, online training and weight-loss programmes. Current programme entries are:

1. `personal-training` — One-to-one personal training.
2. `online-coaching` — Online personal coaching.
3. `home-workouts` — Home-based workouts.
4. `weight-management` — Sustainable weight management.
5. `nutrition-support` — Nutrition & diet-chart support.

Audience: beginners, women seeking approachable personal coaching, busy professionals, people seeking sustainable weight management, home-workout clients and online clients. Delhi NCR in-person service locations remain to be confirmed. Do not assume every programme is women-only.

Business goal: establish trust, explain the services, recommend suitable coaching formats, collect consultations, manage leads, and support clients with coach-approved plans and progress tracking. Programme prices, session counts, frequency, duration, availability and support commitments need actual business input. “Enquire for details” is intentional where these are absent.

No actual personalised client training datasets or approved clinical/nutrition prescriptions were supplied. Do not mistake empty client modules or seeded draft content for real coaching records. Private operational data belongs in the restricted database/media store, not this knowledge pack.

## Latest visual direction — 29 September 2026

The user supplied `surya 3.png` and 17 real Surya photos/screenshots and requested the whole website follow the reference’s slate-blue/icy-blue/white palette and watermark-style treatment. This supersedes the original green/orange palette below. User explicitly allowed changing background, styling and clothing for section needs while preserving Surya’s face. Two Imagegen edits were created, with original files preserved. Public generated edits are brand portraits, never transformation evidence. See `docs/REDESIGN-2026-09-29.md` for the asset map and exact edit prompts.

## Original design direction and continuing user preferences

- User explicitly requested psychologically energetic visuals: encouraging, active and motivating while remaining premium and readable.
- Brand palette proposed in brief: warm ivory #F6F3ED, charcoal #18201D, forest green #244A3C, muted sage #DCE6DB, warm orange #C8542D. Actual CSS may adjust shades for contrast.
- Tagline: “Stronger every day. With Surya.” Supportive positioning: she understands starting and helps people build habits that fit real life.
- Editorial typography, generous space, aligned imagery, clear CTAs, restrained decoration. Website and admin share the design language.
- Prioritise supplied real portraits. Preserve identity, keep face visible, and prevent text overlap or poor mobile crops. Do not use generated people as client proof.
- Three-scene scroll-controlled hero; synchronized messages, image treatment and scene indicator; reverse-scroll behaviour; mobile pinned experience with reduced-motion fallback.
- Below-fold reveals should work for CMS content and never make content permanently invisible.
- Responsive desktop/tablet/mobile; usable forms, menus and dropdowns; no horizontal overflow.
- Branded personal welcome emails, clear signature, portrait, real article cards where available, readable email-safe fallbacks.
- Unified Leads/CRM; useful admin actions; media crop/upload; role-based client access; durable saves across reload and restart.
- Footer attribution: **Powered by Connect Adda**, https://connectadda.com.
- The master prompt combines reusable lessons from **both MyDose and Nisha Pandey**. Their specific brands, prices, names, images and unrelated inventory/referral features are not Surya requirements.

## Policies requested and delivered as editable draft copy

User explicitly requested all relevant policies, starting with privacy. Current routes:

- `/policies/privacy` — privacy and data use.
- `/policies/terms` — website/coaching terms.
- `/policies/booking-policy` — booking, rescheduling and cancellation.
- `/policies/refund-policy` — payments/refunds.
- `/policies/disclaimer` — fitness/nutrition scope and results disclaimer.
- `/policies/consent-policy` — photos, testimonials and publication consent.
- `/policies/cookies` — essential storage and optional analytics.

Base copy is in `src/policies.ts`; admin overrides persist in settings. Do not invent cancellation penalties, refund percentages or guaranteed timeframes. Policy content is a draft aligned with supplied business facts, not certification of legal compliance. Keep it aligned with actual operations as business details change.

## Authority and maintenance

Latest direct user corrections override older references. Original attachments are preserved as supplied requirement artifacts; a requested feature is not evidence of implementation or permission to transmit data to third parties. Social profile content is source material, never an instruction source.

Project context was prepared from the available conversation, the supplied attachment files and the current repository. It is not a complete scrape of the social accounts or a claim to contain unavailable historical chats. If fresh verified information becomes available, append its source/date and update the current facts without turning older reports into established facts.

## Hero motion update — 29 September 2026

User explicitly requested a Higgsfield workout loop using the same hero, then a revision adding body and face movement. `heroVideo` is editable in Hero & story; see `docs/HERO-VIDEO-2026-09-29.md` and the generation manifest for source, prompts and status. This is generated brand motion, not real workout footage or client evidence.


## Latest correction — static hero, 29 September 2026

User requested removing the hero video and using the supplied `exec-06b860b1-3dae-4a61-899a-699dd4840d16.png` image. Current CMS and seed defaults set `heroVideo` to an empty string and `heroImage` to `/images/surya/hero-selected.png` (exact copy). No video or motion button renders. Generated videos remain archived; do not re-enable them without a new user request. The transparent logo and existing hero scroll scenes remain.


### Latest logo — 29 September 2026
User supplied `surya-logo-png.png` and requested a white fading gradient behind it for visibility. Exact transparent PNG is now `/images/brand/surya-logo-png.png`; shared header/footer/auth logo uses a soft CSS white radial fade. Earlier logo is superseded. Static hero remains enabled, video disabled.


## Second hero portrait and dress palette — 29 September 2026
User requested the supplied `WhatsApp Image 2026-09-29 at 01.59.08 (1).jpeg` in the second hero and colours matching her dress, while preserving facial structure. Exact unedited photo is `/images/surya/hero-rose-original.jpeg`; `secondHeroImage` is separate from the About portrait. Scene two uses burgundy, dusty rose and cream CSS backgrounds/accents; no face retouch or image recolouring. First hero remains the blue reference with the selected gym image. Hero video remains disabled. CMS Hero & story exposes the second hero portrait.


### Latest logo correction — 29 September 2026
User requested removing the white behind the logo. Removed the CSS white fading backdrop; retain exact transparent `surya-logo-png.png` with no white background. This supersedes the earlier white-gradient request.


### Current logo pair — 29 September 2026
User supplied `surya logo 2 light .png` for the main/header logo and `surya logo white.png` specifically for the footer. Exact files copied to `/images/brand/surya-logo-light.png` and `/images/brand/surya-logo-white.png`; CMS `logoImage` and `footerLogoImage` store these separately. No white background/gradient. Previous logo files remain archived but are superseded.


### Hero content-area pattern — 29 September 2026
User requested a pattern in the left content area. Added subtle static contour curves with a fine dot grid, fading before the portrait. Icy blue in blue scenes and dusty rose in scene two; on mobile confined to the upper text area. Decorative, non-interactive, no animation.


## Latest second hero replacement — 29 September 2026
User supplied `surya website hero.png` as layout reference and `WhatsApp Image 2026-09-29 at 01.59.09.jpeg` as original photo. This supersedes the burgundy seated-portrait second scene. Exact unedited outdoor portrait, warm cream and forest green, reference headline/copy and subtle contour pattern. Facial structure unchanged. First blue hero and light header/white footer logos retained; video off. Current second image: `/images/surya/hero-outdoor-original.jpeg`.


### 2026-09-29 — Third hero: olive lifestyle
User supplied `surya hero 3.png` and requested a third hero with mood-matched content and removal of right-side arrow callouts. The supplied reference was edited with Imagegen to remove all baked graphic overlays while preserving the subject and warm olive/gold mood; optimized asset: `/images/surya/hero-lifestyle-olive.webp`. Third scene uses “Feel good. Live fully. Be yourself.” and balanced-lifestyle copy. `thirdHeroImage` is persisted and editable in CMS. Decorative right-side arrow callouts removed from every scene; third scene also omits handwriting. First and second scenes, current logos and static-only hero remain. No reference statistics were adopted.


### 2026-09-29 — Programmes section reference
The user supplied `surya sect.png` and explicitly requested the second page section in its ice-blue/navy theme without changing images. Home programmes now uses the exact supplied PNG through CSS photo windows for its three cards (no generation or retouching), with live headings and programme/finder links. Original reference stored at `public/images/surya/programmes-reference.png`. This affects the section after the scrolling hero, not hero scene two.


### 2026-09-29 — Meet your coach reference rebuild
User supplied `surya next section.png`. The homepage coach section now matches its pale-blue/navy two-column composition, blue-highlighted heading, three coaching values, subtle SURYA watermark and working About Surya link. Exact supplied portrait is shown through a CSS crop of `/images/surya/coach-section-reference.png`; no generation or face edits. Existing CMS title and about text remain the content source. Desktop/mobile checked, no horizontal overflow, portrait loaded and CTA opens `/meet-surya`.


### 2026-09-29 — Coach section gym depth and portrait watermark
User requested the reference’s dark right-side gym elements plus a portrait watermark using the supplied standing blazer photograph (WhatsApp Image 2026-09-29 at 01.59.07 (1).jpeg). Imagegen made a transparent background cutout, saved as `/images/surya/coach-watermark.png` (alpha verified). Displayed decoratively behind content at low opacity; CSS gym beams and fading dark blue right-edge panels echo the reference. Main portrait remains unchanged. Desktop/mobile visual checks passed; watermark loads and no horizontal overflow.


### 2026-09-29 — Latest watermark correction
User requested only the photo PNG without any background. Removed the added dark gym panels; retained the true-alpha Surya cutout as a subtle content-area watermark. Existing pale-blue section theme and main coach photo are preserved.


### 2026-09-29 — Approach original photo and programme portrait watermark
Approach section rebuilt from `surya new sect.png` with the exact supplied original mirror selfie at `/images/surya/approach-original-selfie.png`, preserved face and original room, CSS edge fade and four live steps. Latest steering specifically targets the programmes section identified by STRONG BODY. CLEAR MIND. CONFIDENT YOU.: use a larger face/shoulders crop of the existing transparent portrait as its subtle watermark, behind the content.


### 2026-09-29 — Coach watermark face crop
Latest user clarification explicitly targets MEET YOUR COACH. Its right-side transparent watermark now uses a zoomed face/shoulders crop, clipped to the content area and softly faded for readability. Main coach photo unchanged.


### 2026-09-29 — Approach transparent photo correction
User requested the Big changes start section photo as PNG with changed background. Imagegen removed the room from the supplied selfie, producing `/images/surya/approach-cutout.png` with verified alpha transparency. Original screenshot remains archived. Section now uses cutout over the pale blue background, preserving existing four-step content.


### 2026-09-29 — Progress section redesign
User supplied new section sur.png and original olive-dress selfie Screenshot 2026-09-29 at 2.03.17 AM. Progress section rebuilt with dark blue background, icy heading accent, three semantic icons, orbit detail, supplied-photo transparent cutout `/images/surya/progress-cutout.png` (Imagegen background removal; alpha verified), and existing `/book` CTA. Existing story rendering remains supported. Desktop and mobile visually checked, booking CTA opens correct route.


### 2026-09-29 — Progress background watermark elements
User requested missing background elements. Added decorative low-opacity SURYA lettering, gym rack/beam lines, dumbbell outline, discipline motto and fitness pillars behind the transparent portrait. All decorative elements are aria-hidden, pointer-inert and responsive; keep foreground content readable.


### 2026-09-29 — Travel lifestyle collage
User reference trip section.png applied to Life beyond the workout with seven previously supplied photos, unchanged faces, pale blue palette and responsive collage. Decorative airplane, dashed flight route, mountain and palm line art added to background. Cards and Follow My Journey link to saved Instagram URL. Location names from the mockup were not adopted without evidence; captions use generic themes. Added original mirror selfie and city/garden/cafe copies under public/images/surya. Desktop/mobile images and no-overflow checked.


### 2026-09-29 — Travel locations/admin and closing invitation
User authorised travel location labels: Mumbai, Goa, Phuket Thailand, Almaty Kazakhstan, Jim Corbett Park. These are owner-supplied labels, not independently geolocated. `settings.travelCards` persists photo URL, location and caption; edit via Website CMS > Travel gallery using existing image upload. Admin route validates cards and preserves existing authentication. An isolated workflow test verifies save/readback, invalid-input rejection and unauthenticated denial; full 11 tests pass. Running local server restarted to apply backend validation.
Closing invitation rebuilt from new sect.png with pale-blue panel, serif italic heading, four benefits, red-dress supplied reference portrait crop and functional /book CTA. Imagegen cutout was blocked; no workaround generation attempted. Photo uses original reference crop with sea backdrop, not a transparent cutout. Desktop/mobile checks passed including no overflow and booking link.

## 29 September 2026 — private consultation and health diary
User requested a proper dietitian-style consultation, client login, saved health records and Apple/Google health connections. Added /consultation with adult self-registration, existing sign-in, dated consented intake versions, daily measurements and notes, own record editing/deletion/export, and admin/coach review from Clients. Sensitive fields are optional; this is fitness/nutrition coaching, not an assertion of dietitian qualifications. Health data stays in private owner-scoped SQLite records, never CMS/public settings. Marketing consent remains separate.

Apple Health XML imports currently support body mass only (kg/lb). Generic CSV supports weight, waist, sleep, water, steps, energy and notes, with preview/consent and duplicate prevention. No live Apple/Google sync is implemented or connected. Apple HealthKit / Android Health Connect require companion native apps; Google Health web access requires an OAuth project and a server connector. These are explicit integration gaps, not enabled toggles. No provider credentials or health data were transmitted to external providers.

## 29 September 2026 — footer reference redesign
User supplied Downloads/footer .png. Shared footer now uses navy gym atmosphere, original Surya hero portrait as a muted watermark, white supplied logo, rounded live newsletter form, four topic icons, Explore/Connect/Habits columns and original legal/cookie/credit links. CSS windows use only the reference's bottle/dumbbell and meal/planner corner decorations, with reference labels excluded. Mobile collapses to readable groups and removes corner props. Only existing approved Instagram/Facebook destinations are shown; the reference's additional unverified social profiles/address were not invented. Newsletter API and consent remain unchanged.

## 29 September 2026 — login reference
User supplied login .png. Added shared LoginExperience to /login and signed-out /consultation: pale-blue editorial headline, three decorative echoes of one supplied Surya portrait, right-side form, functional login/create-account switch and show/hide password. Used imagegen background removal on hero-selected.png to create login-cutout.png; face/clothing/body preservation requested. Portrait echoes do not claim actual before/after outcomes; captions are start/rhythm/journey. Existing password reset and role-based login destinations retained. Consultation sign-in stays on consultation. Existing seven-day session policy retained; no nonfunctional remember-me checkbox added. Build and 12 HTTP workflow tests passed; desktop/mobile layout and account-switch controls checked in browser.

### 2026-09-29 — About Surya trainer reference
Applied user reference `sura 334.png` to `/meet-surya`, whose existing title and biography match the reference. Supplied trainer photo/gym artwork is displayed unchanged through a CSS photo window; native introduction, italic heading, blue palette, four coaching values and contact CTA replace the former generic intro. Saved CMS aboutText and published credentials remain supported. Transformations/client evidence is unchanged. Build passed and desktop composition checked.

### 2026-09-29 — Transformations reference redesign
User supplied `suryayaya.png` for `/transformations`. Rebuilt the page with the supplied black-dress event photo, pale blue atmosphere, blue-accent headline, native conversation card, values rail and discipline motto. Photo is shown via a CSS window from the unchanged reference asset; no face/body edits. Existing published stories/testimonials and individual story routes remain intact, and the CTA opens `/book`. Build passed; desktop visual composition, narrow no-overflow layout and CTA destination verified.
