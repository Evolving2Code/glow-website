/**
 * Lightweight illuminance model for the photometric playground.
 *
 * Average levels come from the IES lumen method:
 *   E_avg = (N × lumens × CU × LLF) / area
 * The spatial distribution is a point-by-point inverse-square model with a
 * cos^n intensity distribution around each fixture's aiming axis, normalised
 * so the grid mean equals the lumen-method average. It is an illustration,
 * not a substitute for an IES-file photometric layout.
 */

export type SpaceKey = "warehouse" | "office" | "parking";
export type SystemKey = "legacy" | "glow";

export type FixtureSystem = {
  name: string;
  watts: number;
  lumens: number;
  cu: number;
  llf: number;
  exponent: number;
  cct: number;
  cri: number;
  fieldCondition?: { depreciationMin: number; depreciationMax: number; failedRatio: number };
};

export type Space = {
  key: SpaceKey;
  label: string;
  caption: string;
  width: number;
  depth: number;
  mountHeight: number;
  hoursPerYear: number;
  target: number;
  layout: (w: number, d: number) => { x: number; y: number; h: number; ax: number; ay: number }[];
  systems: Record<SystemKey, FixtureSystem>;
};

const gridLayout = (cols: number, rows: number, h: number) => (w: number, d: number) => {
  const out: { x: number; y: number; h: number; ax: number; ay: number }[] = [];
  const sx = w / cols;
  const sy = d / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = sx * (c + 0.5);
      const y = sy * (r + 0.5);
      out.push({ x, y, h, ax: x, ay: y });
    }
  }
  return out;
};

export const spaces: Record<SpaceKey, Space> = {
  warehouse: {
    key: "warehouse",
    label: "Warehouse",
    caption: "38,400 sq ft distribution floor · 30 ft mounting",
    width: 240,
    depth: 160,
    mountHeight: 30,
    hoursPerYear: 6000,
    target: 30,
    layout: gridLayout(10, 6, 30),
    systems: {
      legacy: {
        name: "400W metal halide",
        watts: 458,
        lumens: 36000,
        cu: 0.6,
        llf: 0.65,
        exponent: 1.4,
        cct: 3700,
        cri: 65,
        fieldCondition: { depreciationMin: 0.5, depreciationMax: 0.9, failedRatio: 0.05 },
      },
      glow: {
        name: "Glow 200W linear high bay",
        watts: 200,
        lumens: 30000,
        cu: 0.82,
        llf: 0.9,
        exponent: 2.2,
        cct: 4000,
        cri: 80,
      },
    },
  },
  office: {
    key: "office",
    label: "Office",
    caption: "10,000 sq ft open plan · 9 ft ceiling",
    width: 125,
    depth: 80,
    mountHeight: 9,
    hoursPerYear: 3500,
    target: 35,
    layout: gridLayout(10, 10, 9),
    systems: {
      legacy: {
        name: "3-lamp T8 fluorescent troffer",
        watts: 86,
        lumens: 5500,
        cu: 0.6,
        llf: 0.78,
        exponent: 1,
        cct: 3500,
        cri: 75,
        fieldCondition: { depreciationMin: 0.65, depreciationMax: 0.95, failedRatio: 0.06 },
      },
      glow: {
        name: "Glow 2×4 back-lit flat panel",
        watts: 40,
        lumens: 5000,
        cu: 0.76,
        llf: 0.9,
        exponent: 1.2,
        cct: 4000,
        cri: 90,
      },
    },
  },
  parking: {
    key: "parking",
    label: "Parking lot",
    caption: "60,000 sq ft surface lot · 12 poles · 30 ft mounting",
    width: 300,
    depth: 200,
    mountHeight: 30,
    hoursPerYear: 4300,
    target: 3,
    layout: gridLayout(4, 3, 30),
    systems: {
      legacy: {
        name: "400W metal halide shoebox",
        watts: 458,
        lumens: 36000,
        cu: 0.45,
        llf: 0.65,
        exponent: 1.1,
        cct: 3700,
        cri: 65,
        fieldCondition: { depreciationMin: 0.5, depreciationMax: 0.9, failedRatio: 0.1 },
      },
      glow: {
        name: "Glow area light, Type V",
        watts: 160,
        lumens: 24000,
        cu: 0.75,
        llf: 0.9,
        exponent: 0.5,
        cct: 4000,
        cri: 70,
      },
    },
  },
};

export const GRID_COLS = 48;
export const GRID_ROWS = 28;

export type PhotometricResult = {
  grid: Float32Array;
  max: number;
  min: number;
  avgFc: number;
  avgLux: number;
  uniformity: number;
  fixtures: number;
  totalWatts: number;
  lpd: number;
  annualKwh: number;
  fixturePoints: { x: number; y: number; failed: boolean }[];
};

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function computePhotometrics(spaceKey: SpaceKey, systemKey: SystemKey): PhotometricResult {
  const space = spaces[spaceKey];
  const sys = space.systems[systemKey];
  const points = space.layout(space.width, space.depth);
  const rand = seeded(spaceKey.length * 97 + (systemKey === "legacy" ? 13 : 71));

  const outputs = points.map(() => {
    if (!sys.fieldCondition) return 1;
    const { depreciationMin, depreciationMax, failedRatio } = sys.fieldCondition;
    if (rand() < failedRatio) return 0;
    return depreciationMin + rand() * (depreciationMax - depreciationMin);
  });

  const meanOutput = outputs.reduce((a, b) => a + b, 0) / outputs.length;
  const area = space.width * space.depth;
  const effectiveLlf = sys.fieldCondition ? meanOutput : sys.llf;
  const lumenMethodAvg = (points.length * sys.lumens * sys.cu * effectiveLlf) / area;

  const grid = new Float32Array(GRID_COLS * GRID_ROWS);
  const cw = space.width / GRID_COLS;
  const ch = space.depth / GRID_ROWS;

  for (let r = 0; r < GRID_ROWS; r++) {
    const py = ch * (r + 0.5);
    for (let c = 0; c < GRID_COLS; c++) {
      const px = cw * (c + 0.5);
      let e = 0;
      for (let i = 0; i < points.length; i++) {
        const out = outputs[i];
        if (out === 0) continue;
        const f = points[i];
        const vx = px - f.x;
        const vy = py - f.y;
        const vz = -f.h;
        const dist = Math.hypot(vx, vy, vz);
        const axx = f.ax - f.x;
        const axy = f.ay - f.y;
        const axz = -f.h;
        const axLen = Math.hypot(axx, axy, axz);
        const cosPsi = (vx * axx + vy * axy + vz * axz) / (dist * axLen);
        if (cosPsi <= 0) continue;
        const intensity = Math.pow(cosPsi, sys.exponent);
        const cosIncidence = f.h / dist;
        e += (out * intensity * cosIncidence) / (dist * dist);
      }
      grid[r * GRID_COLS + c] = e;
    }
  }

  let sum = 0;
  for (let i = 0; i < grid.length; i++) sum += grid[i];
  const rawMean = sum / grid.length;
  const scale = rawMean > 0 ? lumenMethodAvg / rawMean : 0;
  let max = 0;
  let min = Infinity;
  for (let i = 0; i < grid.length; i++) {
    grid[i] *= scale;
    if (grid[i] > max) max = grid[i];
    if (grid[i] < min) min = grid[i];
  }

  const totalWatts = points.length * sys.watts;
  const lpd = totalWatts / area;

  return {
    grid,
    max,
    min,
    avgFc: lumenMethodAvg,
    avgLux: lumenMethodAvg * 10.764,
    uniformity: min > 0 ? lumenMethodAvg / min : Infinity,
    fixtures: points.length,
    totalWatts,
    lpd,
    annualKwh: (totalWatts * space.hoursPerYear) / 1000,
    fixturePoints: points
      .map((p, i) => ({ x: p.x / space.width, y: p.y / space.depth, failed: outputs[i] === 0 }))
      .filter((p) => p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1),
  };
}

/** Sequential single-hue ramp (dark → 4000K amber → near-white) used by the heatmap. */
export const HEAT_RAMP: [number, number, number][] = [
  [17, 16, 20],
  [46, 34, 22],
  [104, 66, 26],
  [176, 112, 36],
  [235, 162, 62],
  [255, 206, 128],
  [255, 238, 208],
];

export function heatColor(t: number): [number, number, number] {
  const safe = Number.isFinite(t) ? t : 0;
  const x = Math.min(1, Math.max(0, safe)) * (HEAT_RAMP.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const a = HEAT_RAMP[i];
  const b = HEAT_RAMP[Math.min(HEAT_RAMP.length - 1, i + 1)];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}
