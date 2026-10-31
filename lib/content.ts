/**
 * Single source of truth for marketing copy, product data and asset slots.
 * Every claim that must be confirmed by Glow before launch is listed in
 * CONTENT_TO_VERIFY at the bottom of this file.
 */

export const site = {
  name: "Glow LED Lighting",
  domain: "glowledlighting.com",
  email: "",
  phone: "",
};

export const navLinks = [
  { label: "Photometrics", href: "#photometrics" },
  { label: "Products", href: "#products" },
  { label: "VE Calculator", href: "#calculator" },
  { label: "The Promise", href: "#promise" },
] as const;

export const heroMetrics = [
  { value: 60, suffix: "+", label: "Global suppliers", detail: "Vetted manufacturing partners" },
  { value: 30, suffix: "%", label: "Lower VE pricing", detail: "Against typical distributor spec" },
  { value: 0, prefix: "$", label: "Freight", detail: "Free shipping on every order" },
  { value: 5, suffix: "", label: "Core suites", detail: "Warehouse floor to parking lot" },
] as const;

export type AssetSpec = {
  id: string;
  title: string;
  width: number;
  height: number;
  format: string;
  lighting: string;
  subject: string;
  notes?: string;
  src?: string;
  alt?: string;
  /** Looping background video. Takes precedence over `src`, which is used as the poster if `video.poster` is unset. */
  video?: { mp4: string; webm?: string; poster?: string };
};

export const assets = {
  hero: {
    id: "A-01",
    title: "Hero — Distribution centre, lights on",
    width: 2400,
    height: 3000,
    format: "AVIF/WebP still, or 8s seamless MP4 loop (H.264, ≤ 6 MB) + poster frame",
    lighting:
      "Blue-hour or night exterior darkness, interior lit only by Glow high bays at 4000K. Deep blacks, no blown highlights on lenses.",
    subject:
      "One-point perspective down a main aisle of a 30–40 ft clear-height warehouse. Polished concrete floor reflecting the fixture rows. No people, no visible brand signage.",
    notes: "Leave the lower-left 40% calm — UI readouts overlay it.",
    src: undefined,
    video: undefined,
    alt: "Warehouse aisle lit by Glow LED high bay fixtures",
  },
  highBay: {
    id: "P-01",
    title: "Linear high bay — studio render",
    width: 1600,
    height: 1200,
    format: "WebP/PNG on near-black seamless (#0D0D11) — no transparency needed",
    lighting: "Single soft key from top-left, lens emitting 4000K, dark seamless background",
    subject: "Fixture at 3/4 elevation, 30° tilt, lens facing camera",
    src: undefined,
    alt: "Glow linear high bay fixture",
  },
  ufo: {
    id: "P-02",
    title: "UFO high bay — studio render",
    width: 1600,
    height: 900,
    format: "WebP/PNG on near-black seamless (#0D0D11) — no transparency needed",
    lighting: "Same camera + key light as P-01 for a matched set",
    subject: "Round UFO, hook mount visible, 3/4 underside showing optic",
    src: undefined,
    alt: "Glow UFO high bay fixture",
  },
  panels: {
    id: "P-03",
    title: "Office panels — in situ",
    width: 1600,
    height: 900,
    format: "AVIF/WebP photograph",
    lighting: "Back-lit 2×4 flat panels on, even 4000K, dusk outside the windows",
    subject: "Open-plan office ceiling grid of flat panels, long lens, ceiling plane dominant",
    src: undefined,
    alt: "Glow back-lit flat panels in an office ceiling",
  },
  vaporTight: {
    id: "P-04",
    title: "Vapor tight — studio render",
    width: 1600,
    height: 1200,
    format: "WebP/PNG on near-black seamless (#0D0D11) — no transparency needed",
    lighting: "Matched to P-01; subtle water beading on lens is welcome",
    subject: "Full-length fixture at 15° tilt, gasketed end cap visible",
    src: undefined,
    alt: "Glow vapor tight fixture",
  },
  area: {
    id: "P-05",
    title: "Area lighting — parking lot at night",
    width: 2000,
    height: 2000,
    format: "AVIF/WebP photograph",
    lighting: "Night, lot lit by pole-mounted area lights, crisp full-cutoff (no sky glow)",
    subject: "Pole-top area light in the foreground, evenly lit lot falling away behind",
    src: undefined,
    alt: "Parking lot lit by Glow LED area lights",
  },
  caseStudy: {
    id: "C-01",
    title: "Case study — completed project",
    width: 1600,
    height: 2000,
    format: "AVIF/WebP photograph",
    lighting: "As-built, all Glow fixtures on, natural exposure",
    subject: "The facility behind the testimonial quote, wide establishing shot",
    src: undefined,
    alt: "Completed Glow LED lighting retrofit",
  },
} satisfies Record<string, AssetSpec>;

export type SuiteKey = "high-bay" | "ufo" | "panels" | "vapor-tight" | "area";

export type Suite = {
  key: SuiteKey;
  index: string;
  name: string;
  tagline: string;
  description: string;
  applications: string[];
  specs: { label: string; value: string }[];
  asset: AssetSpec;
};

/**
 * Suites mirror the supplier catalogue (costlesslighting.com). Spec values are
 * quoted from those product listings; `sources` records where each came from.
 */
export const suites: (Suite & { sources: string[] })[] = [
  {
    key: "high-bay",
    index: "01",
    name: "Linear High Bays",
    tagline: "The workhorse of the clear-height building.",
    description:
      "Linear and linear-adjustable high bays with rotatable optics to put lumens on the rack face, not the ceiling deck. Lumen output and colour temperature are field-selectable, so one SKU covers an entire distribution centre.",
    applications: ["Distribution", "Manufacturing", "Cold storage", "Big-box retail"],
    specs: [
      { label: "Output", value: "24.8k – 43.9k lm" },
      { label: "CCT", value: "3K · 4K · 5K" },
      { label: "Optics", value: "Rotatable" },
      { label: "Controls", value: "0–10V · Sensor" },
    ],
    asset: assets.highBay,
    sources: ["costlesslighting.com/product/linear-adjustable-high-bay-24797-to-43947-lumens-sensor-ready-lumen-and-kelvin-selectable/"],
  },
  {
    key: "ufo",
    index: "02",
    name: "Round (UFO) High Bays",
    tagline: "Compact. Brutally efficient.",
    description:
      "Die-cast round high bays that hang from existing hook points for the fastest retrofit on the floor — field-selectable lumens and Kelvin, screw-in sensor-ready, in black or white.",
    applications: ["Warehouses", "Gyms", "Workshops", "Retrofit"],
    specs: [
      { label: "Output", value: "16k – 47k lm" },
      { label: "Efficacy", value: "Up to 200 lm/W" },
      { label: "Ingress", value: "IP65" },
      { label: "Input", value: "120–277V · 277–480V" },
    ],
    asset: assets.ufo,
    sources: [
      "costlesslighting.com/product/high-efficiency-led-round-high-bay-lumen-kelvin-field-selectable-sensor-ready/",
      "costlesslighting.com/product/led-round-high-bay-lumen-kelvin-field-selectable-high-voltage/",
    ],
  },
  {
    key: "panels",
    index: "03",
    name: "Office Panels & Troffers",
    tagline: "Even, quiet light for the people inside.",
    description:
      "Back-lit flat panels and centre-basket troffers that drop straight into the ceiling grid, with field-selectable lumens and Kelvin and optional emergency drivers.",
    applications: ["Office", "Education", "Healthcare", "Retail"],
    specs: [
      { label: "Sizes", value: "2×2 · 2×4" },
      { label: "Selectable", value: "Lumen & Kelvin" },
      { label: "Dimming", value: "0–10V" },
      { label: "Emergency", value: "EM5 – EM13" },
    ],
    asset: assets.panels,
    sources: [
      "costlesslighting.com/product/2x4-led-back-lit-flat-panel-lumen-kelvin-field-selectable/",
      "costlesslighting.com/product/2x2-led-back-lit-flat-panel-lumen-kelvin-field-selectable/",
    ],
  },
  {
    key: "vapor-tight",
    index: "04",
    name: "Vapor Tights",
    tagline: "Sealed for wash-down, dust and chemicals.",
    description:
      "Polycarbonate housings with stainless steel latches — plus a chemical-resistant acrylic version — for processing plants, car washes and parking structures where open fixtures fail.",
    applications: ["Processing", "Car washes", "Parking"],
    specs: [
      { label: "Lengths", value: "4 ft · 8 ft" },
      { label: "Output", value: "5k – 21k lm" },
      { label: "CCT", value: "3.5K · 4K · 5K" },
      { label: "Sensor", value: "Screw-in ready" },
    ],
    asset: assets.vaporTight,
    sources: [
      "costlesslighting.com/product/vapor-tight-ligh-lumen-fixture-lumen-and-kelvin-field-selectable-sensor-ready/",
      "costlesslighting.com/product/8-ft-vapor-tight-fixture-lumen-and-kelvin-field-selectable-sensor-ready-9386-to-12716-lumens/",
      "costlesslighting.com/product/vapor-tight-chemical-resistant-lumen-and-kelvin-field-selectable/",
    ],
  },
  {
    key: "area",
    index: "05",
    name: "Flood, Area & Wall Packs",
    tagline: "Site lighting with the right throw.",
    description:
      "Multi-purpose area lights with field-selectable lumens, Kelvin and distribution, plus full-cutoff wall packs with integrated photocells — laid out pole-by-pole before anything ships.",
    applications: ["Parking lots", "Perimeters", "Loading docks", "Campus"],
    specs: [
      { label: "Output", value: "Up to 42.6k lm" },
      { label: "Optics", value: "Type III · IV · V" },
      { label: "Mounting", value: "5 options" },
    ],
    asset: assets.area,
    sources: [
      "costlesslighting.com/product/multi-purpose-area-light-28342-42653-lumens-lumen-kelvin-distribution-selectable-copy/",
      "costlesslighting.com/product/led-half-moon-full-cutoff-wall-pack-8165-to-13690-lumens-lumen-kelvin-field-selectable/",
    ],
  },
];

export const promiseRows = [
  {
    key: "lead",
    label: "Lead times",
    commitment: "Committed in writing",
    detail:
      "Every quote carries a ship date sourced directly from our supplier network — not an estimate passed down a distributor chain.",
    norm: "“Subject to availability”",
  },
  {
    key: "freight",
    label: "Freight",
    commitment: "Free shipping, every order",
    detail:
      "Freight is absorbed on every order. The price on the quote is the price that lands on your dock.",
    norm: "Freight billed on invoice",
  },
  {
    key: "layout",
    label: "Layout & photometrics",
    commitment: "Custom layouts, per project",
    detail:
      "Point-by-point photometric layouts built from your drawings, so foot-candle targets are proven before a single fixture is ordered.",
    norm: "Generic spec sheets",
  },
  {
    key: "audit",
    label: "Energy audits",
    commitment: "On-site lighting audits",
    detail:
      "We survey existing fixtures, hours and controls to size the retrofit and document the savings case for ownership.",
    norm: "Self-reported counts",
  },
] as const;

export const testimonial = {
  placeholder: true,
  quote:
    "We cut the fixture package by almost a third and the building reads brighter than the original design intent. The layout work is what sold our owner.",
  name: "Client name",
  role: "Director of Facilities, Company",
  project: "Project · Sq ft · Location",
};

export const CONTENT_TO_VERIFY = [
  "heroMetrics: 60+ suppliers, 30% VE pricing, free shipping",
  "suites[].specs: taken from supplier listings (see suites[].sources); confirm Glow may publish them. Round high bay '47k lm' comes from the listing description, its variants top out at 35k",
  "promiseRows: lead-time, freight, layout and audit commitments",
  "testimonial: replace placeholder with a real, approved client quote",
  "lib/calculator.ts: indicative per-fixture pricing and sq ft per fixture",
  "lib/photometrics.ts: Glow fixture wattages are assumed (~150 lm/W) because the supplier listings do not state watts",
  "site.email / site.phone",
];
