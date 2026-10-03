# Motus website design source of truth

This file defines the design direction for the Motus agency website. It exists so future changes keep moving toward a high-quality, distinctive site instead of sliding back into a simple stack of cards.

## Design thesis

Motus is the invisible operations layer for small businesses.

The site should make one idea visible: routine work enters the business, passes through a clear route, gets handled, and keeps moving without the owner chasing every step.

The page should feel like following a live operational signal through the business.

## Audience and page job

Audience: UK small-business owners who are busy, practical, and may not care about automation terminology.

The single job of the page: help the visitor recognise one admin bottleneck and request a free workflow review.

The site should answer:

- What does Motus actually improve?
- Where does my time leak?
- What would happen if this was fixed?
- Can I ask about my own process without being sold a giant tech project?

## Benchmark target

ModuloX is the current quality benchmark. The target is parity of craft, not similarity of design.

What to learn from the benchmark:

- the mobile header feels like a designed control, not a leftover nav;
- the first screen has strong hierarchy and CTA focus;
- sections feel connected;
- interface-like proof makes the product feel real;
- scrolling includes contrast, pacing, and intentional motion;
- the page avoids becoming a plain list of cards.

What not to copy:

- brand colours;
- logo treatment;
- screenshots;
- exact section order;
- button styling;
- copy;
- subscription/payment-specific product language.

## Visual identity

Motus should feel operational, calm, premium, and sharp. Not flashy. Not corporate bland. Not fake luxury.

Core palette:

| Token | Hex | Use |
| --- | --- | --- |
| Ink | `#05070A` | main background |
| Graphite | `#101318` | panels, modal surfaces |
| Signal Blue | `#2864FF` | primary action, active signal |
| Electric Mist | `#A9C1FF` | soft highlights and labels |
| Warm Paper | `#F2F0EA` | contrast sections and CTA moments |
| System Green | `#77D7A8` | completed/positive status |
| Muted Steel | `#596576` | secondary text and inactive elements |

Typography:

| Role | Font | Purpose |
| --- | --- | --- |
| Display | Barlow Condensed | compressed, operational, high-impact headlines |
| Body | Manrope | clear, modern, approachable explanation |
| Utility | IBM Plex Mono | small labels, system status, calculated values |

Use big display type with restraint. The personality comes from scale, rhythm, and alignment, not from shouting everywhere.

## Signature element

The signature element is the Motus signal.

It can appear as:

- a connected route through the hero switchboard;
- a scroll-linked vertical rail;
- a moving line through journey stages;
- animated process steps in the example console;
- calculator values changing as the business inputs change;
- a final signal path behind the CTA.

The signal should communicate movement, routing, and handover. If an animation does not support that idea, remove it.

## Layout principles

Prefer:

- asymmetric sections;
- interface-like panels;
- connected paths;
- sticky or fixed controls where they improve orientation;
- high-contrast section changes;
- compact mobile spacing;
- one strong idea per section.

Avoid:

- endless equal cards;
- generic three-column SaaS blocks;
- stock gradient blobs as the main visual idea;
- huge gaps on mobile;
- animation that only says "look at me";
- complicated technical copy near the top of the page.

## Mobile rules

Mobile is the primary review surface because Seun is often checking on a Samsung phone.

Use a mobile viewport around `390x844` for QA.

Mobile must have:

- readable first-screen hierarchy;
- no floating object blocking the text or CTA;
- compact vertical spacing;
- CTA reachable without hunting;
- nav that feels intentionally designed;
- journey/process sections adapted for mobile, not just squeezed desktop layouts;
- calculator controls that are easy to drag and read.

## Motion rules

Motion should make the business process easier to understand.

Good motion:

- shows a signal moving from one step to the next;
- reveals a route as the visitor scrolls;
- confirms an interaction happened;
- makes calculator changes feel live;
- supports a sticky section where the visitor sees the process unfold.

Bad motion:

- every card fading in the same way;
- random floating icons;
- effects that slow the page down;
- movement that hides the actual offer;
- animations with no reduced-motion fallback.

Always respect reduced-motion preferences.

## Component notes

Hero:

- Must be a thesis, not just a headline.
- It should immediately communicate that Motus keeps work moving.
- Primary CTA: free workflow review.

Navigation:

- Fixed capsule-style nav is part of the premium mobile feel.
- It should never block key text.

Friction section:

- Show scattered operational noise: missed calls, slow replies, loose records, forgotten follow-ups.
- The section should make time leakage visible.

Journey section:

- This is the main process explanation.
- It should feel more like following a route than reading cards.

Examples section:

- Keep this interactive.
- Visitors should be able to choose a business situation and see the route.

Calculator section:

- Keep both modes:
  - admin cost;
  - capacity unlocked.
- Calculator wording should stay practical and plain.

90-day experience:

- Keep this as a productised buying journey, not a generic process list.
- The purpose is to show that Motus is a focused three-month experience around one real operational bottleneck.
- Use clear month labels with meaningful outputs:
  - Month 1: identify the bottleneck and map the route;
  - Month 2: build the live route;
  - Month 3: run it properly, improve it, and hand it over.
- Avoid random letters, decorative numbers, or labels that do not explain the content.
- Keep the wording practical and low-pressure.

Review modal:

- Must feel trustworthy, clear, and low-pressure.
- Keep form fields simple.
- Keep the webhook unchanged unless explicitly approved.

## Copy tone

Plain English, but still premium.

Use terms people recognise from work:

- customer;
- enquiry;
- booking;
- reply;
- record;
- handover;
- follow-up;
- routine admin;
- next step.

Use "automation" carefully. Explain the outcome before the technology.

## Quality checklist before pushing UI changes

- The first screen has a strong visual idea.
- The mobile version feels intentionally designed.
- The page does not read as card, card, card, card.
- Motion explains movement or interaction.
- CTA styling feels deliberate.
- The calculator still works.
- The 90-day experience reads like a clear product journey, not random process cards.
- The review form still opens and submits.
- Important buttons and inputs have unique IDs.
- Focus states are visible.
- Reduced motion is respected.
- `npm.cmd run build` passes.
- Browser checks pass at mobile `390x844` and desktop `1440x900`.

## Current direction

The current direction is the continuous Motus signal:

```txt
Request enters
     |
     v
Signal routes the work
     |
     v
Routine action happens
     |
     v
Record and handover stay clear
     |
     v
The customer moves forward
```

This should remain the north star until Seun chooses a different creative direction.
