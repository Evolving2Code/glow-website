"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight, ArrowDownRight } from "lucide-react";
import { assets, heroMetrics } from "@/lib/content";
import { computePhotometrics } from "@/lib/photometrics";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { AssetSlot } from "@/components/ui/asset-slot";

const ease = [0.16, 1, 0.3, 1] as const;

function HeroVisual() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.62);
  const py = useMotionValue(0.28);
  const sx = useSpring(px, { stiffness: 90, damping: 20 });
  const sy = useSpring(py, { stiffness: 90, damping: 20 });
  const beam = useMotionTemplate`radial-gradient(38% 30% at calc(${sx} * 100%) calc(${sy} * 100%), rgba(255,226,180,0.34), rgba(255,196,107,0.12) 45%, transparent 75%)`;
  const glint = useMotionTemplate`radial-gradient(140px 80px at calc(${sx} * 100%) calc(${sy} * 100% + 46%), rgba(255,214,150,0.18), transparent 70%)`;
  const glow = React.useMemo(() => computePhotometrics("warehouse", "glow"), []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set(Math.min(0.55, (e.clientY - r.top) / r.height));
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease, delay: 0.25 }}
      className="relative"
    >
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(255,196,107,0.22),transparent)] blur-2xl"
      />
      <div className="relative overflow-hidden rounded-[1.75rem] border-[0.5px] border-white/12 bg-obsidian-950 shadow-[0_60px_140px_-40px_rgba(0,0,0,0.95),inset_0_0.5px_0_rgba(255,255,255,0.1)]">
        <AssetSlot spec={assets.hero} priority sizes="(min-width: 1024px) 46vw, 100vw" className="aspect-[4/5] w-full rounded-[1.75rem]" captionAlign="top">
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ backgroundImage: beam }} />
          <motion.div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ backgroundImage: glint }} />
        </AssetSlot>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glow-200/70 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.9 }}
        className="glass absolute -left-4 bottom-8 hidden w-64 rounded-2xl border-[0.5px] border-white/12 p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:block lg:-left-14"
      >
        <div className="flex items-center justify-between">
          <span className="label-mono text-steel-400">Aisle model</span>
          <span className="label-mono flex items-center gap-1.5 text-glow-300">
            <span className="size-1.5 animate-pulse-glow rounded-full bg-glow-400" /> Live
          </span>
        </div>
        <p className="mt-3 flex items-baseline gap-1.5">
          <AnimatedNumber
            value={glow.avgFc}
            format={(n) => n.toFixed(1)}
            duration={1.8}
            className="font-display text-4xl font-medium tabular text-ink"
          />
          <span className="text-sm text-steel-400">fc avg</span>
        </p>
        <dl className="mt-3 grid grid-cols-3 gap-2 border-t-[0.5px] border-white/10 pt-3 font-mono text-[11px]">
          <div>
            <dt className="text-steel-500">CCT</dt>
            <dd className="mt-0.5 text-ink">4000K</dd>
          </div>
          <div>
            <dt className="text-steel-500">W/ft²</dt>
            <dd className="mt-0.5 text-ink tabular">{glow.lpd.toFixed(2)}</dd>
          </div>
          <div>
            <dt className="text-steel-500">Avg:Min</dt>
            <dd className="mt-0.5 text-ink tabular">{glow.uniformity.toFixed(1)}</dd>
          </div>
        </dl>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 1.1 }}
        className="glass absolute -right-3 bottom-40 hidden items-center gap-3 rounded-full border-[0.5px] border-white/12 py-2 pl-2 pr-4 md:flex lg:-right-6"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-glow-400/15 font-mono text-[10px] text-glow-300">
          −56%
        </span>
        <span className="text-[12px] leading-tight text-ink-dim">
          Connected load
          <br />
          <span className="text-steel-500">vs. 400W metal halide</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-12 lg:pt-36">
      {/* Linear "fixture" emitting across the top of the page */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[720px]">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease }}
          className="absolute left-1/2 top-0 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-glow-100 to-transparent"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.4, ease, delay: 0.3 }}
          className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_0%,rgba(255,206,140,0.16),rgba(255,196,107,0.05)_45%,transparent_75%)]"
        />
        <div className="absolute inset-0 blueprint-grid fade-edges opacity-60" />
      </div>
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/3 size-[720px] rounded-full bg-[radial-gradient(closest-side,rgba(245,168,58,0.10),transparent)]" />

      <div className="relative mx-auto grid max-w-[1320px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col lg:col-span-7 lg:pt-6">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="label-mono flex flex-wrap items-center gap-x-3 gap-y-2 text-steel-400"
          >
            <span className="inline-flex items-center gap-2 rounded-full border-[0.5px] border-glow-400/30 bg-glow-400/[0.06] px-2.5 py-1 text-glow-300">
              <span className="size-1.5 rounded-full bg-glow-400 shadow-[0_0_8px_rgba(255,196,107,1)]" />
              Commercial · Industrial · Site
            </span>
            Specified, sourced &amp; shipped
          </motion.p>

          <h1 id="hero-title" className="font-display mt-8 text-[3.4rem] font-medium leading-[0.92] text-ink sm:text-[5rem] lg:text-[5.1rem] xl:text-[6.1rem]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease, delay: 0.1 }}
            >
              Light the <span className="text-glow-gradient drop-shadow-[0_0_38px_rgba(255,196,107,0.45)]">floor.</span>
            </motion.span>
            <motion.span
              className="block text-steel-500"
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease, delay: 0.22 }}
            >
              Not the budget.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.4 }}
            className="mt-8 max-w-xl text-pretty text-[17px] leading-relaxed text-ink-dim"
          >
            Glow engineers the lighting package for warehouses, offices and parking lots — then sources it direct from a
            vetted network of global manufacturers. Same photometric performance. A procurement number your owner
            will actually approve.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.52 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Button asChild size="xl">
                <a href="#quote">
                  Request a Quote
                  <ArrowRight aria-hidden />
                </a>
              </Button>
            </Magnetic>
            <Button asChild size="xl" variant="ghost">
              <a href="#photometrics">
                Model your space
                <ArrowDownRight aria-hidden />
              </a>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
            className="mt-auto grid grid-cols-2 border-t-[0.5px] border-white/10 pt-0 sm:grid-cols-4 lg:mt-20"
          >
            {heroMetrics.map((m, i) => (
              <div
                key={m.label}
                className="relative border-white/10 py-6 pr-4 [&:nth-child(2n)]:pl-5 sm:[&:not(:first-child)]:border-l-[0.5px] sm:[&:not(:first-child)]:pl-5 max-sm:[&:nth-child(2n)]:border-l-[0.5px] max-sm:[&:nth-child(n+3)]:border-t-[0.5px]"
              >
                <dt className="label-mono text-steel-500">{m.label}</dt>
                <dd className="mt-3">
                  <span className="font-display block text-[2.6rem] font-medium leading-none tracking-[-0.05em] text-ink tabular">
                    {"prefix" in m && m.prefix}
                    <AnimatedNumber value={m.value} startOnView duration={1.6 + i * 0.15} />
                    {"suffix" in m && <span className="text-glow-400">{m.suffix}</span>}
                  </span>
                  <span className="mt-2 block text-[12.5px] leading-snug text-steel-400">{m.detail}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="lg:col-span-5">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
