"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSpotlight } from "@/components/ui/use-spotlight";
import {
  GRID_COLS,
  GRID_ROWS,
  HEAT_RAMP,
  computePhotometrics,
  heatColor,
  spaces,
  type SpaceKey,
  type SystemKey,
} from "@/lib/photometrics";
import { cn, formatInt } from "@/lib/utils";

const spaceKeys: SpaceKey[] = ["warehouse", "office", "stadium"];

function useResults() {
  return React.useMemo(() => {
    const out = {} as Record<SpaceKey, Record<SystemKey, ReturnType<typeof computePhotometrics>>>;
    spaceKeys.forEach((k) => {
      out[k] = { legacy: computePhotometrics(k, "legacy"), glow: computePhotometrics(k, "glow") };
    });
    return out;
  }, []);
}

type HeatmapProps = {
  grid: Float32Array;
  scaleMax: number;
  fixtures: { x: number; y: number; failed: boolean }[];
  aspect: number;
  showFixtures: boolean;
};

function Heatmap({ grid, scaleMax, fixtures, aspect, showFixtures }: HeatmapProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const shown = React.useRef<Float32Array>(new Float32Array(grid.length));
  const shownMax = React.useRef(scaleMax);
  const reduce = useReducedMotion();
  const [hover, setHover] = React.useState<{ x: number; y: number; fc: number } | null>(null);

  const draw = React.useCallback((values: Float32Array, max: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !(max > 0)) return;
    const img = ctx.createImageData(GRID_COLS, GRID_ROWS);
    for (let i = 0; i < values.length; i++) {
      const [r, g, b] = heatColor(Math.pow(values[i] / max, 1.6));
      img.data[i * 4] = r;
      img.data[i * 4 + 1] = g;
      img.data[i * 4 + 2] = b;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, []);

  React.useEffect(() => {
    const from = shown.current.slice();
    const fromMax = shownMax.current;
    if (reduce) {
      shown.current = grid.slice();
      shownMax.current = scaleMax;
      draw(grid, scaleMax);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 4);
      const next = new Float32Array(grid.length);
      for (let i = 0; i < grid.length; i++) next[i] = from[i] + (grid[i] - from[i]) * e;
      const max = fromMax + (scaleMax - fromMax) * e;
      shown.current = next;
      shownMax.current = max;
      draw(next, max);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [grid, scaleMax, draw, reduce]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const c = Math.min(GRID_COLS - 1, Math.max(0, Math.floor(x * GRID_COLS)));
    const row = Math.min(GRID_ROWS - 1, Math.max(0, Math.floor(y * GRID_ROWS)));
    setHover({ x, y, fc: grid[row * GRID_COLS + c] });
  };

  return (
    <div
      className="relative w-full cursor-crosshair overflow-hidden rounded-xl"
      style={{ aspectRatio: `${aspect}` }}
      onPointerMove={onMove}
      onPointerLeave={() => setHover(null)}
      role="img"
      aria-label="Plan-view illuminance heatmap. Brighter areas receive more foot-candles."
    >
      <canvas
        ref={canvasRef}
        width={GRID_COLS}
        height={GRID_ROWS}
        className="absolute inset-0 size-full"
        style={{ imageRendering: "auto" }}
      />
      <div aria-hidden className="absolute inset-0 blueprint-grid opacity-70 mix-blend-overlay" />
      {showFixtures &&
        fixtures.map((f, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700",
              f.failed
                ? "size-2 border-[0.5px] border-red-300/70 bg-transparent"
                : "size-[5px] bg-glow-100 shadow-[0_0_6px_1px_rgba(255,236,200,0.9)]",
            )}
            style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%` }}
          />
        ))}
      {hover && (
        <>
          <span aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-white/30" style={{ left: `${hover.x * 100}%` }} />
          <span aria-hidden className="pointer-events-none absolute inset-x-0 h-px bg-white/30" style={{ top: `${hover.y * 100}%` }} />
          <div
            className="glass pointer-events-none absolute z-10 rounded-lg border-[0.5px] border-white/15 px-3 py-2 font-mono text-[11px] shadow-xl"
            style={{
              left: `${hover.x * 100}%`,
              top: `${hover.y * 100}%`,
              transform: `translate(${hover.x > 0.7 ? "calc(-100% - 12px)" : "12px"}, ${hover.y > 0.7 ? "calc(-100% - 12px)" : "12px"})`,
            }}
          >
            <span className="block text-ink tabular">{hover.fc.toFixed(1)} fc</span>
            <span className="block text-steel-400 tabular">{formatInt(hover.fc * 10.764)} lux</span>
          </div>
        </>
      )}
    </div>
  );
}

function Delta({ from, to, invert = false, unit = "%" }: { from: number; to: number; invert?: boolean; unit?: string }) {
  const pct = ((to - from) / from) * 100;
  const good = invert ? pct < 0 : pct > 0;
  return (
    <span
      className={cn(
        "label-mono !tracking-[0.08em] rounded-full px-1.5 py-0.5 tabular",
        good ? "bg-glow-400/12 text-glow-300" : "bg-white/[0.05] text-steel-400",
      )}
    >
      {pct > 0 ? "+" : "−"}
      {Math.abs(pct).toFixed(0)}
      {unit}
    </span>
  );
}

export function PhotometricPlayground() {
  const results = useResults();
  const [space, setSpace] = React.useState<SpaceKey>("warehouse");
  const [system, setSystem] = React.useState<SystemKey>("legacy");
  const [showFixtures, setShowFixtures] = React.useState(true);
  const spot = useSpotlight<HTMLDivElement>();

  const s = spaces[space];
  const current = results[space][system];
  const legacy = results[space].legacy;
  const glow = results[space].glow;
  const scaleMax = Math.max(legacy.max, glow.max);
  const isGlow = system === "glow";

  const metrics = [
    {
      label: "Average illuminance",
      value: current.avgFc,
      format: (n: number) => n.toFixed(1),
      unit: "fc",
      delta: isGlow ? <Delta from={legacy.avgFc} to={glow.avgFc} /> : null,
      sub: `${formatInt(current.avgLux)} lux`,
    },
    {
      label: "Uniformity · avg:min",
      value: current.uniformity,
      format: (n: number) => n.toFixed(1),
      unit: ": 1",
      delta: isGlow ? <Delta from={legacy.uniformity} to={glow.uniformity} invert /> : null,
      sub: isGlow ? "Lower is more even" : "Dark zones between heads",
    },
    {
      label: "Lighting power density",
      value: current.lpd,
      format: (n: number) => n.toFixed(2),
      unit: "W/ft²",
      delta: isGlow ? <Delta from={legacy.lpd} to={glow.lpd} invert /> : null,
      sub: `${formatInt(current.totalWatts / 1000)} kW connected`,
    },
    {
      label: "Annual energy",
      value: current.annualKwh,
      format: (n: number) => formatInt(n),
      unit: "kWh",
      delta: isGlow ? <Delta from={legacy.annualKwh} to={glow.annualKwh} invert /> : null,
      sub: `${formatInt(s.hoursPerYear)} operating hrs / yr`,
    },
  ];

  return (
    <section id="photometrics" aria-labelledby="photometrics-title" className="relative overflow-x-clip py-24 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-40 h-[600px] w-[1100px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,196,107,0.07),transparent)]" />
      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8">
        <SectionHeading
          id="photometrics-title"
          index="01"
          eyebrow="Photometric playground"
          title={
            <>
              See the <span className="text-glow-gradient">foot-candles</span> before you buy them.
            </>
          }
          lede="Pick a space, then switch the legacy system for a Glow package on the same mounting points. The plan view is a point-by-point illuminance model at floor level."
        />

        <div
          ref={spot.ref}
          onPointerMove={spot.onPointerMove}
          onPointerLeave={spot.onPointerLeave}
          className="spotlight mt-14 grid overflow-hidden rounded-[1.75rem] border-[0.5px] border-white/10 bg-obsidian-850/60 shadow-[0_50px_120px_-50px_rgba(0,0,0,0.9)] lg:mt-20 lg:grid-cols-12"
        >
          {/* Plan view */}
          <div className="relative border-white/10 p-4 sm:p-6 lg:col-span-8 lg:border-r-[0.5px] lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div role="tablist" aria-label="Space type" className="relative flex rounded-full border-[0.5px] border-white/10 bg-obsidian-950/60 p-1">
                {spaceKeys.map((k) => (
                  <button
                    key={k}
                    role="tab"
                    type="button"
                    aria-selected={space === k}
                    onClick={() => setSpace(k)}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-[13px] transition-colors sm:px-5",
                      space === k ? "text-obsidian-950" : "text-steel-400 hover:text-ink",
                    )}
                  >
                    {space === k && (
                      <motion.span
                        layoutId="space-pill"
                        className="absolute inset-0 rounded-full bg-ink shadow-[0_0_24px_rgba(255,240,220,0.35)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{spaces[k].label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className={cn("text-[13px] transition-colors", !isGlow ? "text-ink" : "text-steel-500")}>Legacy</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isGlow}
                  aria-label="Switch to Glow fixtures"
                  onClick={() => setSystem(isGlow ? "legacy" : "glow")}
                  className={cn(
                    "relative h-8 w-[3.75rem] rounded-full border-[0.5px] transition-[background,border-color,box-shadow] duration-500",
                    isGlow
                      ? "border-glow-300/70 bg-glow-400/25 shadow-[0_0_30px_-4px_rgba(255,196,107,0.7)]"
                      : "border-white/15 bg-obsidian-950",
                  )}
                >
                  <motion.span
                    className={cn("absolute top-1 size-6 rounded-full", isGlow ? "bg-glow-300 shadow-[0_0_16px_rgba(255,210,140,1)]" : "bg-steel-500")}
                    animate={{ left: isGlow ? 30 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                </button>
                <span className={cn("text-[13px] transition-colors", isGlow ? "text-glow-300" : "text-steel-500")}>Glow</span>
              </div>
            </div>

            <div className="mt-6">
              <Heatmap
                grid={current.grid}
                scaleMax={scaleMax}
                fixtures={current.fixturePoints}
                aspect={s.width / s.depth}
                showFixtures={showFixtures}
              />
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="label-mono text-steel-500 tabular">0</span>
                <span
                  aria-hidden
                  className="h-1.5 w-40 rounded-full sm:w-56"
                  style={{ background: `linear-gradient(90deg, ${HEAT_RAMP.map((c) => `rgb(${c.join(",")})`).join(",")})` }}
                />
                <span className="label-mono whitespace-nowrap text-steel-500 tabular">{scaleMax.toFixed(0)} fc</span>
              </div>
              <div className="flex items-center gap-4">
                <p className="label-mono !tracking-[0.1em] text-steel-500">{s.caption}</p>
                <button
                  type="button"
                  onClick={() => setShowFixtures((v) => !v)}
                  aria-pressed={showFixtures}
                  className="label-mono shrink-0 whitespace-nowrap rounded-full border-[0.5px] border-white/10 px-2.5 py-1 text-steel-400 hover:text-ink"
                >
                  Heads {showFixtures ? "on" : "off"}
                </button>
              </div>
            </div>
          </div>

          {/* Readout */}
          <div className="flex flex-col p-6 sm:p-8 lg:col-span-4">
            <div className="flex items-center justify-between">
              <p className="label-mono text-steel-500">Readout</p>
              <p className={cn("label-mono transition-colors", isGlow ? "text-glow-300" : "text-steel-400")}>
                {isGlow ? "Glow package" : "As-found"}
              </p>
            </div>
            <p className="font-display mt-4 text-2xl font-medium leading-tight tracking-[-0.03em] text-ink">
              {current.fixtures} × {s.systems[system].name}
            </p>
            <p className="mt-2 font-mono text-[11px] text-steel-500">
              {s.systems[system].cct}K · CRI {s.systems[system].cri} · {s.systems[system].watts}W system
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border-[0.5px] border-white/10 bg-white/[0.06] lg:grid-cols-1">
              {metrics.map((m) => (
                <div key={m.label} className="bg-obsidian-900 p-4 lg:px-5">
                  <dt className="label-mono flex items-center justify-between gap-2 text-steel-500">
                    <span>{m.label}</span>
                    <span className="hidden sm:inline">{m.delta}</span>
                  </dt>
                  <dd className="mt-2">
                    <span className="flex items-baseline gap-1.5">
                      <AnimatedNumber value={m.value} format={m.format} className="font-display text-[1.9rem] font-medium leading-none tracking-[-0.04em] text-ink tabular" />
                      <span className="text-[13px] text-steel-400">{m.unit}</span>
                    </span>
                    <span className="mt-1.5 block text-[12px] text-steel-500">{m.sub}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-auto pt-8 text-[12px] leading-relaxed text-steel-500">
              Legacy shown at typical mid-life field condition (lamp depreciation, failed lamps marked ○). Averages
              use the IES lumen method; your project receives a full IES-file layout from our design team.
            </p>
          </div>
        </div>

        <div className="sr-only">
        <table>
          <caption>Modelled illuminance by space and system</caption>
          <thead>
            <tr>
              <th scope="col">Space</th>
              <th scope="col">System</th>
              <th scope="col">Average fc</th>
              <th scope="col">Uniformity avg:min</th>
              <th scope="col">W per sq ft</th>
            </tr>
          </thead>
          <tbody>
            {spaceKeys.flatMap((k) =>
              (["legacy", "glow"] as SystemKey[]).map((sys) => (
                <tr key={`${k}-${sys}`}>
                  <td>{spaces[k].label}</td>
                  <td>{spaces[k].systems[sys].name}</td>
                  <td>{results[k][sys].avgFc.toFixed(1)}</td>
                  <td>{results[k][sys].uniformity.toFixed(1)}</td>
                  <td>{results[k][sys].lpd.toFixed(2)}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
        </div>
      </div>
    </section>
  );
}
