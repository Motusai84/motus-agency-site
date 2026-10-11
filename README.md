# Motus Agency Site

Canonical Agency OS source for the Motus public website.

## Status

- Framework: Next.js
- Production platform: Cloudflare Workers
- Worker: `motus-site`
- Production URL: `https://motusautomation.co.uk`
- Rollback URL: `https://motus-agency-site.vercel.app`
- Deployment policy: Wrangler with explicit production approval

The owner-selected refined typography opening and all four integrated demos
are live as of 11 October 2026, 18:42 UTC. Cloudflare version
`992f14a3-e218-48e2-abea-b7cb2b521db8` serves 100% of traffic. Publication was
explicitly approved by the owner. Pull request #5 merged the tested source as
`e538bf7`; its files match the approved preview source `aae0e55` exactly.
Lint, Next.js build, TypeScript, OpenNext packaging and Wrangler dry run pass.
The prior version `26201c17-5a16-4af0-bb26-052bddb6a3b8`, including its assets,
is retained for rollback. A read-only Worker source export was checked before
and after backup, and immediately before publication (SHA-256
`9a11f7508e3f94756c53b472a17132a0dc19d3fc5b81ffbd2783ff84415b8bc7`).
Rollback uses `npx wrangler versions deploy 26201c17-5a16-4af0-bb26-052bddb6a3b8@100 --yes`.
The owner explicitly deferred the business service
address until after this deployment; it remains an outstanding follow-up.

Post-deployment checks returned HTTP 200 for `/`, `/demos`, all four demo
routes, `/privacy`, `/sitemap.xml` and `/robots.txt`. An empty JSON enquiry
returned HTTP 400 without reaching n8n. The live root serves the typography
opening, with the duplicated hero dashboard and effects toggle removed.
Live 390px phone and 1440px desktop checks cover both themes, the 9.6-second
word cycle, 74px/100px word frames, 44px phone controls, mobile navigation and
Escape/focus return. The calculator changes correctly to 48 hours/week and
£44,928 for a six-person team; the attention filter shows two work items.
No horizontal overflow or browser console warnings/errors were found in those
checks. Comparison previews remain absent from the sitemap. Both webhook
secret names remain present; their values were not read. No real enquiry was
sent, so end-to-end message delivery was not retested. Physical-phone frame
rate and an actual operating-system reduced-motion switch were not measured.

The repository is still connected to Vercel. The reviewed Next.js source
migration was merged to `main` in pull request #1 on 3 October 2026
(`244af4c`). Remote references were refreshed and checked on 10 October 2026.
Do not treat a GitHub branch or Vercel deployment as the current Cloudflare
production site; verify the active Worker before publication.

## Search visibility

The `motusautomation.co.uk` domain property was verified in Google Search Console
under `ayomideautomations@gmail.com` on 3 October 2026 using a Cloudflare DNS
TXT record. Keep that record in place to retain verification; the token itself
must not be copied into this repository.

The Next.js `/sitemap.xml` route lists the canonical public pages and only demos
marked `ready` in `lib/demo-catalog.ts`. `/robots.txt` allows crawling and points
to the sitemap. Submit the sitemap in Search Console after these routes are live.

## Local Development

### Individually quoted projects and client feedback preview

Branch `codex/motus-client-feedback-preview` is a preview-only follow-up. The
owner requested removing advertised website/package fees and reviewing a
barber client feedback section before any production publication.

The homepage removes the three fixed-price packages, monthly care fees, VAT
price note and website starting-price badge. Navigation now calls the section
`Your project`; existing `#pricing` links still resolve. The replacement explains
that the work, quote and support are agreed with the customer. The enquiry form
no longer offers the retired package names. Its optional budget input, admin
cost calculator, four demos and server-side enquiry contract are unchanged.

The client feedback layout uses a generated illustrative barber image, visibly
labelled as not the client, and an expanded draft based on feedback reported by
the owner. Attribution is `Men’s grooming specialist`, London, age 45, as
requested. The five-star design and meaning of `24-hour support` remain labelled
for confirmation. No review schema or external review-platform endorsement is
added. Preserve these review labels until the claims are confirmed; publication
needs a separate owner approval. Image provenance and the generation prompt are
in `public/images/client-feedback/SOURCES.md`; the WebP is about 90 KB.

Local validation: build, TypeScript and lint pass. Desktop 1440px, phone 390px
and narrow 320px checks find no horizontal overflow; both themes render the
image and quote, revised mobile navigation resolves, keyboard focus is visible,
the calculator updates correctly and blank form validation focuses the name.
No browser warnings/errors or real enquiry submissions occurred. The existing
shared reveal/reduced-motion implementation is unchanged.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

### Selected opening and motion previews

Branch `codex/motus-dimensional-hero` was merged for the approved release in
pull request #5. The selected direction is live on the canonical domain.
The owner selected animated words and lighting (direction 3). This is now the
default opening at `/`, as well as `/preview/type`. The two alternative routes
remain available for comparison. Three static routes share the same page:

- `/preview/signal`: a faceted Motus symbol with curved travelling light.
- `/preview/flow`: messages, bookings and invoices converge on Motus, then
  move towards a checked result. A separate mobile arrangement keeps labels legible.
- `/preview/type`: rotating words and moving light, without a central object.

The selected opening holds each phrase for 2.76 seconds and rolls between them
in about 440 milliseconds. Fixed 100px desktop/74px phone slots give the serif
lettering room above and below its baseline, with edge masks including the
WebKit prefix. Responsive type sizes keep every phrase within its frame.
The mobile artwork area is 210px tall, reducing empty space while keeping the
light effect. One moving glow replaces the overlapping glow layers. Mouse
tracking is skipped entirely for the typography direction.

Phone supporting copy is 14px, the headline scales down at narrow widths, and
the theme/menu buttons have 44px touch targets. Existing IDs and navigation
behaviour are retained. No dependency or delivery-contract changes were made.

The top salon website preview, decorative background video and Pause effects
button are removed. The salon demonstration stays in Examples. The full work
queue remains in How it works. Existing business copy, prices, calculator,
form delivery and all four demo routes are preserved.

The openings use local CSS/SVG and installed Framer Motion/GSAP dependencies.
No packages were added. Pointer depth affects only the small symbol layer.
Entrance timings are shorter: the artwork settles in 0.75 seconds, the headline
in 0.65 seconds and section reveals in 0.45 seconds. Removing the hero image
and background video removes their download/decoding work; no numerical speed
or frame-rate improvement has been measured.

Both themes use the same motion, with stronger blue/lavender contrast in light
view. Decorative content is hidden from assistive technology. Continuous effects
pause off screen and in hidden tabs; automatic reduced-motion support remains.
The comparison routes carry noindex metadata and are absent from the sitemap.

Validation on 11 October 2026: build, TypeScript and lint pass. Local browser
checks on the selected opening cover 320x740, 390x844 and 430x932 in both
colour themes, 844x390 landscape navigation, and 1440x900 desktop in both themes,
with no horizontal overflow or clipped phrases. All four primary phone tap
targets measure at least 44px tall. The preceding comparison pass checked all
three openings at 390x844 and 1440x900. Shared-page checks cover mobile navigation and Escape focus
return, visible keyboard focus, example links, work-queue filters, calculator
updates, empty-form validation and offscreen animation pausing. No browser
warnings/errors were reported. OS reduced-motion switching and physical-phone
performance are not tested; reduced-motion guards are reviewed in source.
No real enquiry was sent and no Cloudflare deployment was performed.

Refined selected preview:
https://motus-agency-mobile-review-hvu57x4k0-motusai84s-projects.vercel.app

Vercel deployment `dpl_JBpFoB9dQ4Gnq2XFv7ZqjXhhnBF5` is READY in the
`preview` environment, built from application commit `fa16393`. Authentication
protection remains enabled. The dry-run selection contains 70 application and
public-asset files (2,843,705 bytes), excluding private/generated paths.
Both `/` and `/preview/type` return HTTP 200. Browser verification of the
uploaded homepage confirms the chosen direction, 9.6-second word cycle,
14px phone supporting copy, 74px word slot and 44px controls, with no overflow.
Both themes retain active motion and report no browser warnings/errors.

Preceding comparison review base:
https://motus-agency-mobile-review-kzkr437lz-motusai84s-projects.vercel.app
Use the three `/preview/` paths above to compare the openings.

Vercel deployment `dpl_m6mdoAdcU3DQnvxYcfNdLA5nJ3SY` is READY in the
`preview` environment, built from application commit `26f504d`. Authentication
protection remains enabled. The dry-run file selection includes 70 application
and public-asset files (2,842,554 bytes), with no private/generated paths.
All three comparison routes return HTTP 200; browser checks confirm each
uploaded route presents the correct direction.

The preceding salon-opening preview remains available at
https://motus-agency-mobile-review-d7jvqf92c-motusai84s-projects.vercel.app
(deployment `dpl_59gfYju5hp5r68rmetoLEw21FbL9`, application commit `867a118`).
It is superseded for this design comparison, not deleted.

The explicit `.vercelignore` excludes local backups, private notes, historical
prototypes, generated builds, logs and environment files from CLI previews.
A deployment dry run checks only application source and public assets are
selected. These experiments are not approved for production.

### Historical website prototypes

Local `prototypes/` and `design-handoff/` directories contain rejected or
experimental material. They are not part of the production source or public
routes and are intentionally excluded from this source migration.

### Separate sector demonstrations

The Motus website only catalogues and links a demonstration after it has been
built, reviewed and marked `ready` with a verified URL in `lib/demo-catalog.ts`.
The four current examples are integrated routes under `app/demos/` and are
published with the main website. Planned records do not appear as public examples.

## Lead Capture

The enquiry form posts to the same-origin `/api/leads` route. Configure the
production n8n webhook and its matching Header Auth token as server-only
Cloudflare Worker secrets:

```bash
N8N_LEAD_WEBHOOK_URL=https://n8n.example.com/webhook/lead-capture
N8N_LEAD_WEBHOOK_TOKEN=stored-in-the-approved-secret-store
```

The form reports success only after the webhook returns a successful response.
Do not prefix either variable with `NEXT_PUBLIC_`.

The Worker rejects non-JSON and oversized request bodies and applies a
Cloudflare rate-limit binding of five validated enquiry attempts per client
address per minute. The n8n webhook independently requires the matching private
header credential.

### Enquiry delivery contract

- The website sends the approved minimal enquiry fields, including any
  selected sector or demonstration interest, to the controlled n8n webhook.
- The production workflow must send the internal enquiry notification to
  `ayomideautomations@gmail.com` until the branded Motus address passes inbound,
  authenticated outbound and reply testing.
- The website must not report success unless the webhook confirms successful
  receipt.
- The production destination, provider locations or transfers, and
  workflow-retention settings must stay aligned with `/privacy`.
- The workflow and standalone error handler are registered in
  `03_TECHNICAL/DEPLOYMENT_TARGETS.json` with guarded deployment manifests
  under `01_CLIENTS/motus/`.
- The approved non-home service address must be added to the legal disclosure
  before public release unless the owner explicitly defers that step. On
  10 October 2026 the owner instructed: "We will do the address after, just
  deploy it now." The address remains an outstanding follow-up for this release.
- Do not commit the webhook URL or any provider credential.

### Plain-language preview

The preview branch `codex/motus-plain-language-preview` presents custom websites
and business tools in plain English. The homepage brings four ready
examples forward: Salon website, Appointment Flow (bookings), Ledger Desk
(invoices), and Lead Hub (customer enquiries). Planned catalogue records remain hidden.

Each example links to `/?example=<catalogue-slug>#contact`. Only a ready
catalogue record can preselect the enquiry topic and set `system_interest`.
The form needs a name, business name, email and description; budget, existing
tools, website and topic are optional. Missing optional details use explicit
fallbacks to preserve the existing webhook contract.

Validation covers lint, the Next.js production build, mobile `390x844` and
desktop `1440x900` browser checks, keyboard focus, navigation, the calculator,
all four example enquiry links, and a mocked lead-route check for validation,
rate limiting and upstream failures. No real enquiry was submitted during QA.
Client testimonials remain unpublished pending approval of their exact wording.
Production publication requires separate approval.

### Salon website demonstration

`/demos/salon-website` is a complete fictional salon website under the name Crown & Coil. Its composition extends the existing salon presentation, with entirely new stock photography and neutral content. No original client name, founder, address, contact information, reviews, branded treatment claims or photographs are carried into this demo.

Content lives in `src/clients/salon-demo.ts`, checked against `ClientConfig`. The refined composition has a featured protective styling appointment, a price and duration menu with dotted leaders, four collection pieces illustrated with photographs of actual wigs and extensions, and an asymmetric three-photo editorial gallery. Booking has separate service and time steps with a review before confirmation. Product choices have immediate feedback, quantity limits, totals and removal; dialogs preserve keyboard focus. Every interaction stays in React memory: no personal details, local-storage records, requests to client APIs, bookings, orders, payment or messages. Refreshing resets the demonstration.

The catalog links this fourth example from the homepage and `/demos`. The showroom includes a short fictional-concept design story: the brief, three design decisions and interactions visitors can try. The demo has a persistent identity notice, photo credits, a return to Motus, native dialogs, keyboard focus, responsive layouts and reduced-motion support. Asset provenance is recorded beside the local images in `public/images/salon-demo/SOURCES.md`. Its CSS now contains only the styles used by this demo rather than the former client's unused presentation rules.

Release checks on 10 October 2026: lint, Next.js production build, OpenNext
Cloudflare build and Wrangler deployment dry run pass. Browser checks at
390x844 and 1440x900 cover the salon layout, mobile navigation, booking
preview, collection filters and length selection, bag quantities and totals,
gallery, enquiry preview, Escape/focus return and the salon-to-Motus enquiry
selection. The existing Motus calculator, navigation, themes and effects
pause control were also checked. No live enquiry was sent. Reduced-motion
handling was reviewed in CSS and the effect cleanup; OS preference emulation
and a physical phone were unavailable.

The subsequent refinement pass also passes lint and the Next.js production
build. Desktop and mobile browser checks verify both booking steps and back
navigation, service-specific prices, selected day/time, product lengths,
quantity totals (£225 × 3 = £675), the 10-piece variant limit, removal and
empty state, gallery navigation, enquiry confirmation and the showroom story.
No horizontal overflow or duplicate IDs were found in the salon checks.
The main Motus calculator, mobile menu, empty-form validation and salon enquiry
context were checked again. This pass adds no dependencies or live integrations.

Production remains on version `e4be2364-35ed-466e-9af7-3e9451211ef5`.
The active version was confirmed before and after a read-only source backup
(SHA-256 `c9b84f18f7c9607c08640a445b40b5552435734483eb5f86ddc45fb20908e469`).
The retained Cloudflare version, including its assets, is the rollback target.
Publication is authorised by the owner, but the approved non-home service
address required above has not been supplied.

The final website preview was deployed on 10 October 2026 to the existing
Vercel review project and reached Ready status:
https://motus-agency-mobile-review-h2kr5kste-motusai84s-projects.vercel.app
It includes the complete Motus mock and all four integrated examples, including
the refined salon demo. Existing Vercel authentication protection remains enabled.
The uploaded application source matches commit `47476f8`; deployment inputs
exclude local environment files, Git metadata and historical prototypes.
Desktop and mobile online checks cover the homepage, salon booking and bag,
gallery, design story, example enquiry context, calculator, navigation, theme,
effects controls and empty-form validation. No real enquiry was submitted.
The final OpenNext build and Wrangler dry run pass, and the live-site source
backup still matches the SHA-256 above. The canonical Cloudflare domain has
not been changed by this preview deployment.

Continuation checks on 10 October 2026 confirm both production secret names,
`N8N_LEAD_WEBHOOK_URL` and `N8N_LEAD_WEBHOOK_TOKEN`, are present; their values
were not read. The active Worker remains on the rollback version above.
The source migration is already merged. The remaining source reviews are
pull request #2 (search visibility) followed by pull request #3 (the complete
plain-language mock, motion and salon demo). Neither has been merged by this
release preparation. Add the approved business service address before public
release, then merge the reviewed changes, recheck the live version and backup,
publish, and verify the public routes and enquiry delivery.

The owner subsequently explicitly authorised publishing the reviewed mock to
`motusautomation.co.uk` now and adding the business service address afterwards.
This overrides the address gate for this release only. No address has been
invented or published. The existing webhook secrets and retained Cloudflare
rollback version are preserved.

### Motion preview

The existing sections, visible copy, prices, calculator and demo routes are
preserved. The preview adds a shared panel-border treatment, clearer form focus
states and coordinated motion through `components/SiteMotion.tsx`:

- Framer Motion uses the existing installed package for panel hover responses
  and workspace filter transitions. Hover motion is limited to fine pointers;
  keyboard filter changes are immediate.
- GSAP 3.15.0 handles the hero sequence, section reveals and reading progress.
  It only controls opacity on Motion panels, so the engines do not compete for
  their transforms. Keyboard focus makes a revealed region immediately visible.
- Anime.js 4.5.0 draws the decorative signal routes in the hero and workspace.
  It loads when a route is visible, plays a finite sequence and reverts on unmount.

The stronger effects pass adds a spring-following cursor halo, pointer-responsive
card spotlights, a hero routing field with travelling light and breathing nodes,
a finite heading sheen, and a travelling border light on the hero dashboard and
featured package. Existing content and interactive IDs remain intact; the only
new control is `effects-toggle` for pausing decorative effects. The native cursor
is retained, overlays cannot intercept input, touch input has no cursor effect,
and keyboard input hides the cursor halo immediately.

The implementations are local React/CSS/SVG code using the installed Motion
package, with no additional dependencies or copied library components. Reference
research: React Bits (`DavidHDev/react-bits`, SpotlightCard and BlobCursor),
Magic UI (`magicuidesign/magicui`, Border Beam), and Aceternity's Glowing Effect.
Continuous effects and the existing background video pause when requested or
when the tab is hidden. The hero field/video and border lights also pause when
off screen. Reduced motion keeps a static decorative field. CSS motion paths
are progressive enhancement; unsupported browsers retain the normal panel edge.

Both new engines load dynamically. Content is visible without their JavaScript.
Reduced-motion preferences disable spatial motion and signal drawing, and
changing the preference cleans up active effects. Module-load cancellation and
component cleanup are covered by a mocked lifecycle check. Browser QA covers
390x844 and 1440x900, both colour themes, navigation, filters, calculator inputs,
form validation/focus, all demo routes and example enquiry context. The browser
controller cannot emulate the OS reduced-motion preference; that path was
checked through the lifecycle harness and CSS review, not a physical phone.

The 10 October 2026 release preparation patches Next.js and eslint-config-next
to 16.3.8 and Wrangler to 4.149.0, with compatible transitive security updates.
`npm audit --omit=dev` reports zero vulnerabilities. The complete audit still
reports five high entries tracing to one unpublished fix for `braces` through
the lint-only dependency chain. No framework downgrade or forced audit fix was
applied. Both the Next.js and OpenNext Cloudflare builds pass, as does the
Wrangler deployment dry run. The lockfile records the exact resolved versions.

Public preview pages use the Motus name only, with no founder introduction,
personal initials, personal location or displayed email address. Privacy links
open `/?privacy=1#contact`, which does not require a business name and preserves
the existing lead delivery format with a privacy-question label. Review the
final business identity and contact disclosure before production publication;
this preview does not establish legal compliance. Private delivery settings are
unchanged.

## Validation

```bash
npm ci
npm run build
```

The build uses Google-hosted fonts and therefore requires network access.

## Cloudflare Validation

```bash
npm ci
npm run build
npx opennextjs-cloudflare build
npx wrangler deploy --dry-run
```

## Production Deployment

1. Validate the locked Next.js and OpenNext builds.
2. Publish the change through a branch and pull request.
3. Merge the approved change to `main`.
4. Obtain explicit production deployment approval.
5. Authenticate Wrangler to the Motus Cloudflare account.
6. Verify `N8N_LEAD_WEBHOOK_URL` and `N8N_LEAD_WEBHOOK_TOKEN` are present as
   Worker secrets. Never commit either value.
7. Run `npm run deploy`.
8. Verify the Worker URL, `https://motusautomation.co.uk`, and `/api/leads`.

Agency OS remains the source of truth. The legacy Vercel deployment is retained
only as a rollback while the Cloudflare production site is established.
