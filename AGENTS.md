# AGENTS.md - Motus agency website instructions

These instructions apply inside `06_BUILDS/websites/motus-agency-site/`. They are the local source of truth for this website and should be followed by Codex, Claude Code, Cursor, Copilot, or any other AI coding assistant working here.

## Project context

- Site: Motus agency landing page
- Live production URL: `https://motusautomation.co.uk`
- Current benchmark reference: `https://www.modulox.io/`
- Goal: build a website that feels comparable in quality to ModuloX without copying its visual identity, structure, copy, assets, or brand.
- Audience: UK small-business owners who need operational admin to move faster without being scared by technical language.

## Live deployment lock

`https://motusautomation.co.uk` is the only canonical, public Motus website.

- It is currently served by the Cloudflare Worker named `motus-site`.
- This Next.js source was reconciled against the active Cloudflare Worker on 1 October 2026. Its GitHub `main` branch is still an older Vite version until the reviewed source migration is merged. Recheck the live Worker version before every production change; a previous reconciliation is not permission to overwrite later work.
- Never roll back, replace, redirect, or otherwise alter `motusautomation.co.uk` unless Seun explicitly authorises that exact live change.
- Before any future live-site work, first reconcile the active Cloudflare Worker source and create a recoverable backup/version. Do not infer that GitHub `main`, a Vercel deployment, or this directory matches production.
- Old Vercel deployments may be reviewed and removed only after Seun explicitly confirms the exact deployments to delete. They are not a substitute for the live site.

## Design direction

Read `DESIGN.md` for the original Motus design intent, but preserve the currently deployed site's typography, colours, layout and interactions as the visual baseline. Do not use older design notes to trigger a wholesale redesign.

The Motus site should feel like an invisible operations layer: work enters, gets routed, gets recorded, and keeps moving. The signature visual idea is the Motus signal, not generic luxury decoration.

Do not default to repeated card grids, stock SaaS gradients, random fade-ins, or decorative animations that do not explain the offer. Complexity should feel purposeful.

The wider AGENCY_OS frontend rule about warm gold luxury landing pages applies to booking-menu/client template work. For this Motus agency website, follow the Motus signal system in `DESIGN.md` instead.

## Required skill usage

Before making visual, layout, animation, interaction, or copy-structure changes, use the installed `frontend-design` skill.

Apply it by checking:

- one clear subject, audience, and page job;
- a compact color/type/layout/signature plan;
- one justified signature element;
- mobile responsiveness;
- visible focus states;
- reduced-motion support;
- a self-critique after the build.

## ModuloX quality benchmark

ModuloX quality comes from the overall craft, not from one component. When comparing Motus against it, check for:

- a fixed mobile header that feels intentional and usable;
- clear visual hierarchy within the first screen;
- connected sections rather than isolated blocks;
- contrast changes that make scrolling feel like a journey;
- product or process proof, not only marketing claims;
- smooth, useful motion;
- strong CTA treatment;
- compact mobile spacing with no giant dead gaps.

Do not copy ModuloX colours, icons, screenshots, layout, wording, or brand motifs.

## Copy and terminology

Keep terminology plain but not childish.

Prefer:

- workflow review;
- routine admin;
- enquiries;
- bookings;
- follow-up;
- customer response;
- records;
- handover;
- next step.

Avoid leading with technical words unless the surrounding copy explains them in plain English.

## Components that must be protected

Do not remove these unless Seun explicitly asks:

- free workflow review CTA;
- review form and webhook;
- calculator section;
- calculator cost/capacity modes;
- mobile navigation;
- descriptive `id` attributes on buttons, links, inputs, and important interactive controls.

The review form currently posts to:

`https://seunayomide.app.n8n.cloud/webhook/lead-capture`

Do not change this webhook without explicit approval.

## Build and test rules

Before pushing UI changes:

1. Run `npm.cmd run build`.
2. Preview locally.
3. Browser-test at Samsung/mobile size around `390x844`.
4. Browser-test desktop around `1440x900`.
5. Check the hero, mobile nav, journey section, examples section, calculator, review modal, and final CTA.
6. Check visible focus states for key buttons/inputs.
7. Check reduced-motion support when animation changes are made.

If browser testing cannot be completed, say exactly what could not be verified before pushing.

## Deployment workflow

- Work on a branch first.
- Push to GitHub for Vercel preview.
- Do not promote to production unless Seun explicitly approves.
- Keep production safe while iterating.

## Implementation standards

- Use React/Vite conventions already present in this repo.
- Keep animation purposeful and tied to the Motus signal concept.
- Prefer updating existing components over creating parallel versions.
- Avoid broad dependency or build-system changes unless the benefit, risk, and rollback path are clear.
- Keep generated code readable for a future developer.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
