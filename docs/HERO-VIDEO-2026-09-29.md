# Surya hero workout video

## Request and source

On 29 September 2026 the user explicitly requested Higgsfield to animate Surya doing a workout in the same slate-blue hero, looping on the website. The follow-up requested visible body and face movement too.

Input is `assets/references/2026-09-29/hero-blue-edited.png`, the prior identity-preserving brand edit of the supplied real gym photograph. Animation is AI-generated brand imagery, not original recorded workout footage, exercise instruction, or transformation evidence. Source originals remain preserved.

Generation project, reference media ID, exact prompts and job outcomes are recorded in `docs/context/hero-video-generation.json`. Retain these identifiers for future revisions; do not create a new Higgsfield project for each revision. No private client health data was supplied to the provider.

## Website behaviour

- `heroVideo` CMS setting selects the MP4; clearing it restores a still-photo hero.
- One muted inline video loops in the first and third hero scenes. The middle coach scene retains its portrait and pauses the video.
- Pause/play control preserves manual pause through scene changes.
- Playback pauses when the hero leaves the viewport or document becomes hidden.
- Reduced-motion preference omits the video and displays the static first scene. A CSS fallback also hides motion.
- On video error the original photo remains and the unavailable motion control disappears.
- Existing hero photo, text, scroll transitions and contact links remain intact.
- Admin: Website CMS → Hero & story → Hero workout video. Set an MP4 path or URL; empty means still image. This field is a URL control, not a new video-upload workflow.

## Validation

Initial integration: production build and all 10 existing workflow tests passed. Browser inspection confirmed muted looping playback, pause holds at a fixed timestamp, playback resumes, middle scene pauses playback, 1440px desktop and 390px mobile layouts with no mobile horizontal overflow. Generated first/middle/final frames were inspected. Reduced-motion and error fallbacks were implemented and reviewed in code; OS preference and network-failure simulation were not performed.

Local preview only: http://127.0.0.1:3040/. No public deployment performed.

## Final revision

Kling v3.0 job `6dd4d8ae-c13d-41df-b4c2-3be8f676bf76` completed. Current asset: `public/videos/surya-workout-body-face-loop.mp4`, 1440×960, approximately 8.04 seconds, 672,908 bytes, H.264 faststart without audio. First/middle/final frames show head turn, eye contact, a small smile and subtle torso/shoulder movement, returning to the original pose. The old 6-second loop is retained separately. The new asset loaded and played after a fresh browser reload; muted loop/pause controls remain shared with the verified initial integration.

## Supplied logo

User supplied `/Users/akhilesh/Downloads/Surya Web/Logo /surya logo 2.png`. It already has an alpha channel and is not opaque. Exact bytes were copied to `public/images/brand/surya-fitness-logo.png` and preserved in the reference archive; no background was added and no AI redraw was needed. Shared Logo component updates header, footer and auth pages. CMS Brand & contact has a transparent logo URL field. Browser confirmed both header/footer images load, with no mobile overflow.


## Latest correction — static hero, 29 September 2026

User requested removing the hero video and using the supplied `exec-06b860b1-3dae-4a61-899a-699dd4840d16.png` image. Current CMS and seed defaults set `heroVideo` to an empty string and `heroImage` to `/images/surya/hero-selected.png` (exact copy). No video or motion button renders. Generated videos remain archived; do not re-enable them without a new user request. The transparent logo and existing hero scroll scenes remain.
