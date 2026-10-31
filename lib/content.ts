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
  { value: 5, suffix: "", label: "Core suites", detail: "Industrial to arena-grade" },
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
  linear: {
    id: "P-03",
    title: "Architectural linear — in situ",
    width: 1600,
    height: 900,
    format: "AVIF/WebP photograph",
    lighting: "Continuous suspended runs over an open-plan office, dusk exterior",
    subject: "Long-lens compression of linear runs, ceiling plane dominant",
    src: undefined,
    alt: "Glow architectural linear fixtures suspended in an office",
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
    title: "Sports & area — night project photo",
    width: 2000,
    height: 2000,
    format: "AVIF/WebP photograph",
    lighting: "Night, field lit by Glow floods, visible beam control (no sky glow)",
    subject: "Pole-top fixture cluster in the foreground, field falling away behind",
    src: undefined,
    alt: "Stadium lit by Glow LED sports lighting",
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

export type SuiteKey = "high-bay" | "ufo" | "linear" | "vapor-tight" | "area";

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

export const suites: Suite[] = [
  {
    key: "high-bay",
    index: "01",
    name: "Linear High Bays",
    tagline: "The workhorse of the clear-height building.",
    description:
      "Wide-aisle and narrow-aisle optics engineered to put lumens on the rack face, not the ceiling deck. Field-selectable wattage and CCT let one SKU cover an entire distribution centre.",
    applications: ["Distribution", "Manufacturing", "Cold storage", "Big-box retail"],
    specs: [
      { label: "Output", value: "12k – 45k lm" },
      { label: "Efficacy", value: "Up to 160 lm/W" },
      { label: "CCT", value: "4000 / 5000K" },
      { label: "Controls", value: "0–10V · Occupancy" },
    ],
    asset: assets.highBay,
  },
  {
    key: "ufo",
    index: "02",
    name: "UFO High Bays",
    tagline: "Compact. Brutally efficient.",
    description:
      "A die-cast round form factor that drops into existing metal-halide hook points for the fastest retrofit on the floor.",
    applications: ["Gyms", "Workshops", "Retrofit"],
    specs: [
      { label: "Output", value: "14k – 40k lm" },
      { label: "Optic", value: "60° · 90° · 120°" },
    ],
    asset: assets.ufo,
  },
  {
    key: "linear",
    index: "03",
    name: "Architectural Linears",
    tagline: "Continuous light as a design language.",
    description:
      "Suspended, surface and recessed profiles that run seamlessly from lobby to open office, with the glare control specifiers ask for.",
    applications: ["Office", "Education", "Healthcare"],
    specs: [
      { label: "UGR", value: "< 19" },
      { label: "CRI", value: "90+" },
    ],
    asset: assets.linear,
  },
  {
    key: "vapor-tight",
    index: "04",
    name: "Vapor Tights",
    tagline: "Sealed for wash-down, dust and freeze.",
    description:
      "Gasketed housings for food processing, parking structures and cold chain — rated for the places other fixtures fail.",
    applications: ["Food & bev", "Parking", "Cold chain"],
    specs: [
      { label: "Ingress", value: "IP65 / IP66" },
      { label: "Ambient", value: "-40° to 50°C" },
    ],
    asset: assets.vaporTight,
  },
  {
    key: "area",
    index: "05",
    name: "Area & Stadium",
    tagline: "Precision floods with zero wasted sky.",
    description:
      "Sports floods, area lights and wall packs with asymmetric optics and visor control, modelled pole-by-pole before anything ships.",
    applications: ["Stadiums", "Parking lots", "Ports", "Campus"],
    specs: [
      { label: "Output", value: "Up to 160k lm" },
      { label: "Beam", value: "15° – 60° · Type II–V" },
      { label: "Surge", value: "10 kV / 20 kV" },
    ],
    asset: assets.area,
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
  "suites[].specs: lumen ranges, efficacy, IP ratings, ambient ratings, surge",
  "promiseRows: lead-time, freight, layout and audit commitments",
  "testimonial: replace placeholder with a real, approved client quote",
  "lib/calculator.ts: indicative per-fixture pricing and sq ft per fixture",
  "lib/photometrics.ts: fixture lumens / wattages used in the playground",
  "site.email / site.phone",
];
