"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  AREA_MAX,
  AREA_MIN,
  FIXTURE_MAX,
  FIXTURE_MIN,
  VE_REDUCTION,
  calcSpaces,
  calculate,
  fromSlider,
  toSlider,
  type CalcMode,
  type CalcSpaceKey,
} from "@/lib/calculator";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { SectionHeading } from "@/components/ui/section-heading";
import { Slider } from "@/components/ui/slider";
import { useSpotlight } from "@/components/ui/use-spotlight";
import { cn, formatInt, formatUSD } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const areaTicks = [5_000, 25_000, 100_000, 500_000, 1_500_000];
const fixtureTicks = [10, 50, 250, 1_000, 5_000];
const tickLabel = (n: number) => (n >= 1_000_000 ? `${n / 1_000_000}M` : n >= 1000 ? `${n / 1000}k` : `${n}`);

export function VECalculator() {
  const [mode, setMode] = React.useState<CalcMode>("area");
  const [spaceKey, setSpaceKey] = React.useState<CalcSpaceKey>("warehouse");
  const [area, setArea] = React.useState(120_000);
  const [fixtures, setFixtures] = React.useState(240);
  const [draft, setDraft] = React.useState<string | null>(null);
  const spot = useSpotlight<HTMLDivElement>();

  const space = calcSpaces.find((s) => s.key === spaceKey)!;
  const value = mode === "area" ? area : fixtures;
  const min = mode === "area" ? AREA_MIN : FIXTURE_MIN;
  const max = mode === "area" ? AREA_MAX : FIXTURE_MAX;
  const setValue = mode === "area" ? setArea : setFixtures;
  const r = calculate(mode, value, space);
  const ticks = mode === "area" ? areaTicks : fixtureTicks;

  const commitDraft = () => {
    if (draft === null) return;
    const n = Number(draft.replace(/[^0-9]/g, ""));
    if (Number.isFinite(n) && n > 0) setValue(Math.min(max, Math.max(min, n)));
    setDraft(null);
  };

  return (
    <section id="calculator" aria-labelledby="calculator-title" className="relative overflow-x-clip py-24 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-contrast/10 to-transparent" />
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <SectionHeading
          id="calculator-title"
          index="03"
          eyebrow="Value engineering calculator"
          title={
            <>
              Same spec.
              <br />
              <span className="text-glow-gradient">Thirty percent lighter.</span>
            </>
          }
          lede="Tell us how big the job is. We model the fixture count and set it against typical distributor pricing for the same performance class."
        />

        <div
          ref={spot.ref}
          onPointerMove={spot.onPointerMove}
          onPointerLeave={spot.onPointerLeave}
          className="spotlight mt-14 grid overflow-hidden rounded-[1.75rem] border-[0.5px] border-contrast/10 bg-surface-raised shadow-[0_40px_100px_-60px_var(--shadow-strong)] lg:mt-20 lg:grid-cols-12"
        >
          {/* Inputs */}
          <div className="border-contrast/10 p-6 sm:p-10 lg:col-span-6 lg:border-r-[0.5px]">
            <fieldset>
              <legend className="label-mono text-steel-500">Size the project by</legend>
              <div className="mt-4 inline-flex rounded-full border-[0.5px] border-contrast/10 bg-surface-sunken/60 p-1">
                {(
                  [
                    ["area", "Square footage"],
                    ["fixtures", "Fixture count"],
                  ] as const
                ).map(([k, label]) => (
                  <label
                    key={k}
                    className={cn(
                      "relative cursor-pointer rounded-full px-4 py-2 text-[13px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-glow-400",
                      mode === k ? "text-surface" : "text-steel-400 hover:text-ink",
                    )}
                  >
                    <input type="radio" name="calc-mode" value={k} checked={mode === k} onChange={() => setMode(k)} className="sr-only" />
                    {mode === k && (
                      <motion.span layoutId="calc-mode" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                    )}
                    <span className="relative">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-10">
              <legend className="label-mono text-steel-500">Space type</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {calcSpaces.map((s) => (
                  <label
                    key={s.key}
                    className={cn(
                      "cursor-pointer rounded-full border-[0.5px] px-3.5 py-1.5 text-[13px] transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-glow-400",
                      spaceKey === s.key
                        ? "border-glow-400/60 bg-glow-400/10 text-accent shadow-[0_0_24px_-6px_rgba(255,196,107,0.6)]"
                        : "border-contrast/10 text-steel-400 hover:border-contrast/25 hover:text-ink",
                    )}
                  >
                    <input type="radio" name="calc-space" value={s.key} checked={spaceKey === s.key} onChange={() => setSpaceKey(s.key)} className="sr-only" />
                    {s.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-12">
              <label htmlFor="calc-value" className="label-mono text-steel-500">
                {mode === "area" ? "Total floor area" : "Number of fixtures"}
              </label>
              <div className="mt-3 flex items-baseline gap-3 border-b-[0.5px] border-contrast/15 pb-3 focus-within:border-glow-400/70">
                <input
                  id="calc-value"
                  inputMode="numeric"
                  autoComplete="off"
                  value={draft ?? formatInt(value)}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitDraft}
                  onKeyDown={(e) => e.key === "Enter" && commitDraft()}
                  className="font-display w-full min-w-0 bg-transparent text-[3.25rem] font-medium leading-none tracking-[-0.05em] text-ink tabular focus:outline-none sm:text-[4.5rem]"
                />
                <span className="shrink-0 font-mono text-sm text-steel-400">{mode === "area" ? "sq ft" : "fixtures"}</span>
              </div>

              <Slider
                className="mt-6"
                aria-label={mode === "area" ? "Floor area" : "Fixture count"}
                min={0}
                max={1000}
                step={1}
                value={[toSlider(value, min, max)]}
                onValueChange={([p]) => {
                  setDraft(null);
                  setValue(fromSlider(p, min, max));
                }}
              />
              <div className="relative mt-1 h-4" aria-hidden>
                {ticks.map((t) => (
                  <span
                    key={t}
                    className="label-mono absolute -translate-x-1/2 !text-[10px] text-steel-600 first:translate-x-0 last:-translate-x-full"
                    style={{ left: `${toSlider(t, min, max) / 10}%` }}
                  >
                    {tickLabel(t)}
                  </span>
                ))}
              </div>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 border-t-[0.5px] border-contrast/10 pt-6">
              <div>
                <dt className="label-mono !text-[10px] text-steel-500">{mode === "area" ? "Est. fixtures" : "Est. coverage"}</dt>
                <dd className="mt-2 font-mono text-[15px] text-ink tabular">
                  {mode === "area" ? formatInt(r.fixtures) : `${formatInt(r.sqft)} ft²`}
                </dd>
              </div>
              <div>
                <dt className="label-mono !text-[10px] text-steel-500">Typical / unit</dt>
                <dd className="mt-2 font-mono text-[15px] text-steel-400 line-through decoration-steel-600 tabular">{formatUSD(space.typicalUnitPrice)}</dd>
              </div>
              <div>
                <dt className="label-mono !text-[10px] text-steel-500">Glow / unit</dt>
                <dd className="mt-2 font-mono text-[15px] text-accent tabular">{formatUSD(r.glowUnit)}</dd>
              </div>
            </dl>
            <p className="mt-4 font-mono text-[11px] text-steel-600">Modelled on {space.fixture.toLowerCase()} · {formatInt(space.sqftPerFixture)} ft² per head</p>
          </div>

          {/* Readout */}
          <div className="relative flex flex-col overflow-hidden p-6 sm:p-10 lg:col-span-6">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(255,196,107,0.16),transparent)]" />
            <p className="label-mono relative text-steel-500">Procurement saving</p>
            <p className="relative mt-4">
              <AnimatedNumber
                value={r.savings}
                format={formatUSD}
                className="font-display block break-all text-[3.5rem] font-medium leading-[0.9] tracking-[-0.055em] text-glow-gradient tabular drop-shadow-[0_0_40px_rgba(255,196,107,0.35)] sm:text-[5.5rem]"
              />
            </p>
            <p className="relative mt-3 text-[14px] text-ink-dim">
              Back in the project budget — a straight <span className="text-accent">{Math.round(VE_REDUCTION * 100)}%</span> reduction on fixtures, with freight included.
            </p>

            <figure className="relative mt-12" aria-label="Typical package cost compared with Glow package cost">
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13px] text-steel-400">Typical distributor package</span>
                    <AnimatedNumber value={r.typical} format={formatUSD} className="font-mono text-[14px] text-steel-300 tabular" />
                  </div>
                  <div className="mt-2.5 h-3 overflow-hidden rounded-[4px] bg-contrast/[0.04]">
                    <motion.div className="h-full rounded-[4px] bg-steel-600" initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1.1, ease }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[13px] text-ink">Glow VE package</span>
                    <AnimatedNumber value={r.glow} format={formatUSD} className="font-mono text-[14px] text-ink tabular" />
                  </div>
                  <div className="relative mt-2.5 flex h-3 gap-[2px]">
                    <motion.div
                      className="h-full rounded-[4px] bg-gradient-to-r from-glow-600 via-glow-400 to-glow-300 shadow-[0_0_24px_rgba(255,196,107,0.55)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(1 - VE_REDUCTION) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.3, ease, delay: 0.15 }}
                    />
                    <motion.div
                      className="h-full flex-1 rounded-[4px] border-[0.5px] border-dashed border-glow-400/50 bg-[repeating-linear-gradient(135deg,rgba(255,196,107,0.18)_0_2px,transparent_2px_7px)]"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    />
                  </div>
                  <div className="mt-2 flex justify-end">
                    <span className="label-mono !tracking-[0.1em] text-accent" style={{ width: `${VE_REDUCTION * 100}%` }}>
                      −{Math.round(VE_REDUCTION * 100)}% saved
                    </span>
                  </div>
                </div>
              </div>
              <figcaption className="sr-only">
                Typical package {formatUSD(r.typical)}, Glow package {formatUSD(r.glow)}, saving {formatUSD(r.savings)}.
              </figcaption>
            </figure>

            <dl className="relative mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-xl border-[0.5px] border-contrast/10 bg-contrast/[0.06]">
              {[
                { label: "Per fixture", value: r.savings / r.fixtures, fmt: formatUSD, prefix: "−" },
                { label: "Per sq ft", value: r.glow / r.sqft, fmt: (n: number) => `$${n.toFixed(2)}`, prefix: "" },
                { label: "Freight", value: 0, fmt: () => "$0", prefix: "" },
              ].map((m) => (
                <div key={m.label} className="bg-surface/95 px-4 py-3.5">
                  <dt className="label-mono !text-[10px] text-steel-500">{m.label}</dt>
                  <dd className="mt-1.5 font-mono text-[15px] text-ink tabular">
                    {m.prefix}
                    <AnimatedNumber value={m.value} format={m.fmt} />
                  </dd>
                </div>
              ))}
            </dl>

            <div className="relative mt-auto flex flex-col gap-4 pt-12 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-[12px] leading-relaxed text-steel-500">
                Indicative only. Your quote is built from your drawings, fixture schedule and photometric targets.
              </p>
              <Magnetic>
                <Button asChild size="lg">
                  <a href="#quote">
                    Lock in this saving <ArrowRight aria-hidden />
                  </a>
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
