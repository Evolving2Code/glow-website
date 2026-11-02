/**
 * All copy and images for the site. Wording follows the original Wix site
 * (glowledlighting.com) so claims stay the same.
 */

export const site = {
  name: "Glow LED Lighting",
  tagline: "Commercial LED Solutions",
  url: "https://glowledlighting.com",
  // Add these when ready; they show in the contact section and footer when set.
  phone: "",
  email: "",
};

export const nav = [
  { label: "Products", href: "#products" },
  { label: "Partners", href: "#partners" },
  { label: "Our Promise", href: "#promise" },
  { label: "About", href: "#about" },
];

export const highlights = [
  { icon: "network", title: "60+ suppliers", detail: "The right fixture for every job, sourced from our partner network." },
  { icon: "tag", title: "30% lower VE pricing", detail: "Value-engineered pricing below industry standard." },
  { icon: "truck", title: "Free shipping", detail: "On almost every order, with industry-leading lead times." },
  { icon: "layout", title: "Layouts & audits", detail: "A Glow specialist plans the right layout or LED retrofit." },
] as const;

export type Product = { name: string; image: string };

const p = (name: string, file: string): Product => ({ name, image: `/img/products/${file}.webp` });

export const productGroups: { title: string; items: Product[] }[] = [
  {
    title: "Indoor",
    items: [
      p("High Bays", "high-bays"),
      p("UFO High Bays", "ufos"),
      p("Flat Panels", "flat-panel"),
      p("Downlights", "downlights"),
      p("Troffers", "troffers"),
      p("Architectural Linears", "architectural-linears"),
      p("Vapor Tights", "vapor-tights"),
      p("Exit Signs", "exits"),
      p("Temp Work Lights", "temp-work-lights"),
    ],
  },
  {
    title: "Outdoor",
    items: [
      p("Area Lights", "area-light"),
      p("Wall Packs", "wall-packs"),
      p("Flood Lights", "flood-lights"),
      p("Stadium Lights", "stadium-lights"),
      p("Bollards", "bollard"),
      p("Canopy Lights", "canopy"),
      p("Dusk to Dawn", "dusk-to-dawn"),
      p("Roadway", "roadway"),
      p("Post Tops", "post-top"),
    ],
  },
];

export const partners = [
  { name: "Acolyte", file: "acolyte", w: 263, h: 69 },
  { name: "Amerlux", file: "amerlux", w: 246, h: 130 },
  { name: "Everbrite", file: "everbrite", w: 244, h: 79 },
  { name: "Focal Point", file: "focal-point", w: 244, h: 186 },
  { name: "Illuminating US", file: "illuminating-us", w: 252, h: 80 },
  { name: "Isolite", file: "isolite", w: 244, h: 102 },
  { name: "Integer Lights", file: "integer", w: 252, h: 212 },
  { name: "Liteline", file: "liteline", w: 252, h: 72 },
];

export const aboutPoints = [
  "Industry-leading lead times",
  "Free shipping on almost every order",
  "VE pricing 30% lower than industry standard",
  "Design layouts and lighting audits",
];
