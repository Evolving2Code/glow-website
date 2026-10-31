export type CalcSpaceKey = "warehouse" | "manufacturing" | "office" | "retail" | "site";

export type CalcSpace = {
  key: CalcSpaceKey;
  label: string;
  sqftPerFixture: number;
  typicalUnitPrice: number;
  fixture: string;
};

/** Indicative figures for the VE calculator. Replace with Glow's own program pricing. */
export const calcSpaces: CalcSpace[] = [
  { key: "warehouse", label: "Warehouse", sqftPerFixture: 640, typicalUnitPrice: 289, fixture: "Linear high bay" },
  { key: "manufacturing", label: "Manufacturing", sqftPerFixture: 480, typicalUnitPrice: 312, fixture: "Round (UFO) high bay" },
  { key: "office", label: "Office", sqftPerFixture: 100, typicalUnitPrice: 149, fixture: "2×4 back-lit flat panel" },
  { key: "retail", label: "Retail", sqftPerFixture: 90, typicalUnitPrice: 176, fixture: "Panel / downlight mix" },
  { key: "site", label: "Parking / site", sqftPerFixture: 5000, typicalUnitPrice: 429, fixture: "Pole-mounted area light" },
];

export const VE_REDUCTION = 0.3;

export type CalcMode = "area" | "fixtures";

export const AREA_MIN = 5_000;
export const AREA_MAX = 1_500_000;
export const FIXTURE_MIN = 10;
export const FIXTURE_MAX = 5_000;

/** Map a 0–1000 slider position to a value on a logarithmic scale. */
export const fromSlider = (pos: number, min: number, max: number) =>
  Math.round(Math.exp(Math.log(min) + (pos / 1000) * (Math.log(max) - Math.log(min))));

export const toSlider = (value: number, min: number, max: number) =>
  Math.round(((Math.log(Math.min(max, Math.max(min, value))) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 1000);

export function calculate(mode: CalcMode, value: number, space: CalcSpace) {
  const fixtures = mode === "area" ? Math.max(1, Math.ceil(value / space.sqftPerFixture)) : value;
  const sqft = mode === "area" ? value : value * space.sqftPerFixture;
  const typical = fixtures * space.typicalUnitPrice;
  const glow = typical * (1 - VE_REDUCTION);
  return {
    fixtures,
    sqft,
    typical,
    glow,
    savings: typical - glow,
    glowUnit: space.typicalUnitPrice * (1 - VE_REDUCTION),
  };
}
