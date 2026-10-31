# Glow LED Lighting — glowledlighting.com

Next.js (App Router) · Tailwind CSS v4 · shadcn/ui primitives (Radix) · Framer Motion.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build && npm start
```

## Page architecture (`app/page.tsx`)

| § | Section | File |
|---|---------|------|
| — | Glass nav, ⌘K search, scroll-blur, magnetic CTA | `components/site/nav.tsx`, `command-search.tsx` |
| — | Hero, macro-metrics, pointer-lit visual zone | `components/site/hero.tsx` |
| 01 | Photometric playground (point-by-point heatmap) | `components/site/photometric-playground.tsx`, `lib/photometrics.ts` |
| 02 | Product suite bento | `components/site/product-bento.tsx` |
| 03 | VE calculator | `components/site/ve-calculator.tsx`, `lib/calculator.ts` |
| 04 | Glow Promise trust matrix + testimonial | `components/site/trust-matrix.tsx` |
| 05 | Terminal quote hub → `POST /api/quote` | `components/site/quote-hub.tsx`, `app/api/quote/route.ts` |

Design tokens live in `app/globals.css` (`@theme`): obsidian surfaces, steel structure, 4000K `glow` accent.
All copy, specs and asset slots live in `lib/content.ts`.

## Assets required

Every visual is an `AssetSlot` that renders its production brief until a file is supplied.
Drop files in `public/assets/` and set `src` (e.g. `"/assets/hero.avif"`) on the matching entry in `lib/content.ts`.

Any slot can take a looping video instead (used for the hero):

```ts
video: { mp4: "/assets/hero.mp4", webm: "/assets/hero.webm", poster: "/assets/hero-poster.avif" },
```

The poster loads first; the video fades in, plays only while on screen and has a pause control.
With reduced motion or Save-Data, only the poster shows. Export H.264 MP4, muted, ≤ 6 MB, with a poster
frame taken from the first frame so the fade-in is seamless. A 9:16 clip crops cleanly into the 4:5 hero frame.

| ID | Slot | Min size |
|----|------|----------|
| A-01 | Hero — distribution centre, lights on (still or loop) | 2400 × 3000 |
| P-01 | Linear high bay studio render | 1600 × 1200 |
| P-02 | UFO high bay studio render | 1600 × 900 |
| P-03 | Architectural linear in situ | 1600 × 900 |
| P-04 | Vapor tight studio render | 1600 × 1200 |
| P-05 | Sports/area night project photo (subject centred, cropped to wide and tall) | 2000 × 2000 |
| C-01 | Case study project photo | 1600 × 2000 |

## Quote delivery

Set `QUOTE_WEBHOOK_URL` (see `.env.example`) to forward each validated lead as JSON to a CRM, Zapier/Make hook or Slack workflow. Without it, leads are logged server-side only.

## Before launch

`CONTENT_TO_VERIFY` in `lib/content.ts` lists every claim, spec and price that must be confirmed by Glow.
