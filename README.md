# Motus Agency Site

Canonical Agency OS source for the Motus public website.

## Status

- Framework: Next.js
- Production platform: Cloudflare Workers
- Worker: `motus-site`
- Production URL: `https://motusautomation.co.uk`
- Rollback URL: `https://motus-agency-site.vercel.app`
- Deployment policy: Wrangler with explicit production approval

The repository is still connected to Vercel. Its `main` branch contains an older
Vite build until the reviewed Next.js source migration is merged. Do not treat a
Vercel deployment as the current Cloudflare production site.

## Search visibility

The `motusautomation.co.uk` domain property was verified in Google Search Console
under `ayomideautomations@gmail.com` on 3 October 2026 using a Cloudflare DNS
TXT record. Keep that record in place to retain verification; the token itself
must not be copied into this repository.

The Next.js `/sitemap.xml` route lists the canonical public pages and only demos
marked `ready` in `lib/demo-catalog.ts`. `/robots.txt` allows crawling and points
to the sitemap. Submit the sitemap in Search Console after these routes are live.

## Local Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

### Historical website prototypes

Local `prototypes/` and `design-handoff/` directories contain rejected or
experimental material. They are not part of the production source or public
routes and are intentionally excluded from this source migration.

### Separate sector demonstrations

Sector demonstrations are separate projects. The Motus website only catalogues
and links a demonstration after that project has been built, reviewed and
marked `ready` with a verified URL in `lib/demo-catalog.ts`. Planned records do
not appear as public examples.

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
  before public release.
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
all three example enquiry links, and a mocked lead-route check for validation,
rate limiting and upstream failures. No real enquiry was submitted during QA.
Client testimonials remain unpublished pending approval of their exact wording.
Production publication requires separate approval.

### Salon website demonstration

`/demos/salon-website` is a complete fictional salon website under the name Crown & Coil. Its composition extends the existing salon presentation, with entirely new stock photography and neutral content. No original client name, founder, address, contact information, reviews, branded treatment claims or photographs are carried into this demo.

Content lives in `src/clients/salon-demo.ts`, checked against `ClientConfig`. The route includes services, product filters and length selection, a bag with quantities and removal, booking and enquiry previews, and a photo gallery. Every interaction stays in React memory: no personal details, local-storage records, requests to client APIs, bookings, orders, payment or messages. Refreshing resets the demonstration.

The catalog links this fourth example from the homepage and `/demos`. The demo has a persistent identity notice, photo credits, a return to Motus, native dialogs, keyboard focus, responsive layouts and reduced-motion support. Asset provenance is recorded beside the new local images in `public/images/salon-demo/SOURCES.md`.

Release checks on 10 October 2026: lint, Next.js production build, OpenNext
Cloudflare build and Wrangler deployment dry run pass. Browser checks at
390x844 and 1440x900 cover the salon layout, mobile navigation, booking
preview, collection filters and length selection, bag quantities and totals,
gallery, enquiry preview, Escape/focus return and the salon-to-Motus enquiry
selection. The existing Motus calculator, navigation, themes and effects
pause control were also checked. No live enquiry was sent. Reduced-motion
handling was reviewed in CSS and the effect cleanup; OS preference emulation
and a physical phone were unavailable.

Production remains on version `e4be2364-35ed-466e-9af7-3e9451211ef5`.
The active version was confirmed before and after a read-only source backup
(SHA-256 `c9b84f18f7c9607c08640a445b40b5552435734483eb5f86ddc45fb20908e469`).
The retained Cloudflare version, including its assets, is the rollback target.
Publication is authorised by the owner, but the approved non-home service
address required above has not been supplied. The Vercel review upload also
requires renewed authentication; a failed upload did not change production.

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
