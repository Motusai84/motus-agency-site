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
and business tools in plain English. The homepage brings the three ready
examples forward: Appointment Flow (bookings), Ledger Desk (invoices), and
Lead Hub (customer enquiries). Planned catalogue records remain hidden.

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
Production publication and any later animation changes require separate review.

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
