"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { assets, promiseRows, testimonial } from "@/lib/content";
import { AssetSlot } from "@/components/ui/asset-slot";
import { SectionHeading } from "@/components/ui/section-heading";

const ease = [0.16, 1, 0.3, 1] as const;

export function TrustMatrix() {
  return (
    <section
      id="promise"
      aria-labelledby="promise-title"
      className="relative overflow-hidden bg-concrete-50 py-24 text-ink-dark lg:py-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 grain opacity-60 mix-blend-multiply" />
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[1200px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,196,107,0.22),transparent)]" />

      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8">
        <SectionHeading
          id="promise-title"
          index="04"
          tone="light"
          eyebrow="The Glow Promise"
          title={
            <>
              Four commitments.
              <br />
              <span className="text-steel-400">Written into every quote.</span>
            </>
          }
          lede="Price only matters if the job lands on time, on the dock, and on the foot-candle target. These are the terms we hold ourselves to."
        />

        {/* Matrix */}
        <div className="mt-16 lg:mt-24" role="table" aria-label="The Glow Promise compared with the typical channel">
          <div role="rowgroup" className="hidden md:block">
            <div role="row" className="grid grid-cols-12 gap-6 border-b-[0.5px] border-steel-300 pb-4">
              <span role="columnheader" className="label-mono col-span-3 text-steel-500">Area</span>
              <span role="columnheader" className="label-mono col-span-6 text-steel-500">The Glow standard</span>
              <span role="columnheader" className="label-mono col-span-3 text-right text-steel-500">Typical channel</span>
            </div>
          </div>
          <div role="rowgroup">
            {promiseRows.map((row, i) => (
              <motion.div
                role="row"
                key={row.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease, delay: i * 0.06 }}
                className="group grid gap-4 border-b-[0.5px] border-steel-300 py-8 transition-colors hover:bg-white md:grid-cols-12 md:gap-6 md:py-10"
              >
                <div role="rowheader" className="flex items-baseline gap-4 md:col-span-3">
                  <span className="label-mono text-glow-700">0{i + 1}</span>
                  <span className="text-[15px] font-medium text-steel-600">{row.label}</span>
                </div>
                <div role="cell" className="md:col-span-6">
                  <p className="font-display flex items-start gap-3 text-[1.75rem] font-medium leading-[1.05] text-ink-dark sm:text-[2.25rem]">
                    <span className="mt-2 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink-dark text-glow-300 shadow-[0_0_0_4px_rgba(255,196,107,0.18)] transition-shadow group-hover:shadow-[0_0_0_6px_rgba(255,196,107,0.35),0_0_24px_rgba(255,196,107,0.5)]">
                      <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                    </span>
                    {row.commitment}
                  </p>
                  <p className="mt-4 max-w-xl pl-9 text-[15px] leading-relaxed text-steel-600">{row.detail}</p>
                </div>
                <div role="cell" className="flex items-center gap-2 pl-9 text-[14px] text-steel-400 md:col-span-3 md:justify-end md:pl-0">
                  <Minus className="size-3.5" aria-hidden />
                  <span className="sr-only">Typical channel: </span>
                  {row.norm}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Editorial testimonial */}
        <figure className="mt-24 grid gap-10 lg:mt-32 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <AssetSlot spec={assets.caseStudy} sizes="(min-width:1024px) 38vw, 100vw" className="aspect-[4/5] w-full rounded-[1.5rem]" />
          </div>
          <div className="flex flex-col justify-between lg:col-span-7 lg:py-4">
            <div>
              <p className="label-mono flex items-center gap-3 text-steel-500">
                <span className="h-px w-8 bg-steel-300" aria-hidden />
                From the field
                {testimonial.placeholder && (
                  <span className="rounded-full border-[0.5px] border-glow-600/50 bg-glow-300/20 px-2 py-0.5 text-glow-700">
                    Sample copy — client quote required
                  </span>
                )}
              </p>
              <blockquote className="font-display mt-8 text-balance text-[2rem] font-medium leading-[1.08] tracking-[-0.035em] text-ink-dark sm:text-[2.9rem]">
                <span aria-hidden className="text-glow-600">“</span>
                {testimonial.quote}
                <span aria-hidden className="text-glow-600">”</span>
              </blockquote>
            </div>
            <figcaption className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t-[0.5px] border-steel-300 pt-6">
              <div>
                <p className="text-[15px] font-medium text-ink-dark">{testimonial.name}</p>
                <p className="mt-1 text-[14px] text-steel-500">{testimonial.role}</p>
              </div>
              <p className="label-mono text-steel-500">{testimonial.project}</p>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
