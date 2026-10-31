"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { suites, type Suite, type SuiteKey } from "@/lib/content";
import { AssetSlot } from "@/components/ui/asset-slot";
import { SectionHeading } from "@/components/ui/section-heading";
import { useSpotlight } from "@/components/ui/use-spotlight";
import { cn } from "@/lib/utils";

export const PREFILL_EVENT = "glow:prefill-suite";

export function requestSuiteQuote(key: SuiteKey) {
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: key }));
  document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

type Layout = "feature" | "stack" | "wide";

const layoutFor: Record<SuiteKey, { layout: Layout; className: string; assetClass: string }> = {
  "high-bay": { layout: "feature", className: "lg:col-span-7 lg:row-span-2", assetClass: "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[340px]" },
  ufo: { layout: "stack", className: "lg:col-span-5", assetClass: "aspect-[16/9]" },
  panels: { layout: "stack", className: "lg:col-span-5", assetClass: "aspect-[16/9]" },
  "vapor-tight": { layout: "stack", className: "lg:col-span-4", assetClass: "aspect-[4/3]" },
  area: { layout: "wide", className: "lg:col-span-8", assetClass: "aspect-[2/1] md:aspect-auto md:h-full" },
};

function SpecTable({ specs, columns = 2 }: { specs: Suite["specs"]; columns?: number }) {
  return (
    <dl
      className={cn(
        "grid gap-px overflow-hidden rounded-xl border-[0.5px] border-contrast/[0.08] bg-contrast/[0.06]",
        columns === 4 ? "grid-cols-2 sm:grid-cols-4" : columns === 3 ? "grid-cols-3" : "grid-cols-2",
      )}
    >
      {specs.map((s) => (
        <div key={s.label} className="bg-surface/95 px-3.5 py-3">
          <dt className="label-mono !text-[10px] text-steel-500">{s.label}</dt>
          <dd className="mt-1 font-mono text-[12.5px] text-ink tabular">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function NodeHeader({ suite }: { suite: Suite }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <p className="label-mono shrink-0 whitespace-nowrap text-steel-500">
        <span className="text-accent">{suite.index}</span> / Suite
      </p>
      <ul className="flex flex-wrap justify-end gap-1.5">
        {suite.applications.map((a) => (
          <li key={a} className="rounded-full border-[0.5px] border-contrast/10 px-2 py-0.5 text-[11px] text-steel-400">
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SpecButton({ suite }: { suite: Suite }) {
  return (
    <button
      type="button"
      onClick={() => requestSuiteQuote(suite.key)}
      className="group/btn inline-flex items-center gap-2 text-[13px] text-ink transition-colors hover:text-accent"
    >
      Spec this suite
      <span className="flex size-7 items-center justify-center rounded-full border-[0.5px] border-contrast/15 transition-all duration-300 group-hover/btn:rotate-45 group-hover/btn:border-glow-400/60 group-hover/btn:bg-glow-400/10">
        <ArrowUpRight className="size-3.5" aria-hidden />
      </span>
    </button>
  );
}

function BentoNode({ suite, i }: { suite: Suite; i: number }) {
  const spot = useSpotlight<HTMLElement>();
  const { layout, className, assetClass } = layoutFor[suite.key];

  return (
    <motion.article
      ref={spot.ref as React.Ref<HTMLElement>}
      onPointerMove={spot.onPointerMove}
      onPointerLeave={spot.onPointerLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
      aria-labelledby={`suite-${suite.key}`}
      className={cn(
        "spotlight group relative flex overflow-hidden rounded-[1.5rem] border-[0.5px] border-contrast/10 bg-gradient-to-b from-surface-raised to-surface-raised shadow-[inset_0_0.5px_0_rgba(255,255,255,0.07)]",
        layout === "wide" ? "flex-col md:flex-row" : "flex-col",
        className,
      )}
    >
      {layout === "feature" && (
        <>
          <div className="p-6 sm:p-9">
            <NodeHeader suite={suite} />
            <h3 id={`suite-${suite.key}`} className="font-display mt-10 text-4xl font-medium leading-[0.95] text-ink sm:text-[3.4rem]">
              {suite.name}
            </h3>
            <p className="mt-3 text-lg text-accent">{suite.tagline}</p>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-dim">{suite.description}</p>
          </div>
          <div className="relative mx-6 flex flex-1 flex-col sm:mx-9">
            <div aria-hidden className="absolute -inset-x-10 -top-6 h-24 bg-[radial-gradient(closest-side,rgba(255,196,107,0.18),transparent)] opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
            <AssetSlot spec={suite.asset} sizes="(min-width:1024px) 50vw, 100vw" className={cn("rounded-2xl", assetClass)} />
          </div>
          <div className="grid gap-6 p-6 sm:p-9 sm:pt-7">
            <SpecTable specs={suite.specs} columns={4} />
            <SpecButton suite={suite} />
          </div>
        </>
      )}

      {layout === "stack" && (
        <>
          <div className="p-6 sm:p-8">
            <NodeHeader suite={suite} />
            <h3 id={`suite-${suite.key}`} className="font-display mt-8 text-[2rem] font-medium leading-none text-ink">
              {suite.name}
            </h3>
            <p className="mt-2 text-[15px] text-accent">{suite.tagline}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">{suite.description}</p>
          </div>
          <div className="mx-6 sm:mx-8">
            <AssetSlot spec={suite.asset} density="compact" sizes="(min-width:1024px) 40vw, 100vw" className={cn("rounded-xl", assetClass)} />
          </div>
          <div className="mt-auto flex flex-col gap-5 p-6 sm:p-8">
            <SpecTable specs={suite.specs} />
            <SpecButton suite={suite} />
          </div>
        </>
      )}

      {layout === "wide" && (
        <>
          <div className="flex flex-col p-6 sm:p-8 md:w-[58%]">
            <NodeHeader suite={suite} />
            <h3 id={`suite-${suite.key}`} className="font-display mt-8 text-[2.4rem] font-medium leading-none text-ink">
              {suite.name}
            </h3>
            <p className="mt-2 text-[15px] text-accent">{suite.tagline}</p>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-dim">{suite.description}</p>
            <div className="mt-8 flex flex-col gap-5 md:mt-auto md:pt-8">
              <SpecTable specs={suite.specs} columns={3} />
              <SpecButton suite={suite} />
            </div>
          </div>
          <div className="relative min-h-[240px] px-6 pb-6 md:w-[42%] md:p-3 md:pl-0">
            <AssetSlot spec={suite.asset} density="compact" sizes="(min-width:1024px) 30vw, 100vw" className={cn("size-full rounded-2xl", assetClass)} />
          </div>
        </>
      )}
    </motion.article>
  );
}

export function ProductBento() {
  return (
    <section id="products" aria-labelledby="products-title" className="relative py-24 lg:py-28">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <SectionHeading
          id="products-title"
          index="02"
          eyebrow="Commercial product suites"
          title={
            <>
              Five suites.
              <br />
              <span className="text-steel-500">Every ceiling covered.</span>
            </>
          }
          lede="Grouped by the job they do on the building, not by catalogue page. Each suite is specified, value-engineered and sourced as a system."
        />

        <div className="mt-14 grid gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-12">
          {suites.map((s, i) => (
            <BentoNode key={s.key} suite={s} i={i} />
          ))}
        </div>

        <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-[1.5rem] border-[0.5px] border-dashed border-contrast/12 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
          <p className="text-[14px] text-ink-dim">
            <span className="text-ink">Not in a suite?</span> Canopy lights, strip lights, recessed cans, LED tubes,
            exit &amp; emergency, sensors and wiring devices are sourced through the same supplier network.
          </p>
          <a href="#quote" className="label-mono inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-accent hover:text-accent">
            Send us a spec <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
