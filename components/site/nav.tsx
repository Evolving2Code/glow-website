"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { navLinks } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { CommandSearch } from "./command-search";
import { Logo } from "./logo";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<string>("");
  const last = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 12);
    const delta = y - last.current;
    if (Math.abs(delta) > 6) setHidden(delta > 0 && y > 640 && !open);
    last.current = y;
  });

  React.useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1)).concat("quote");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? -96 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-[1320px] items-center justify-between gap-4 rounded-full pl-5 pr-2 transition-[background,backdrop-filter,box-shadow,border-color] duration-500",
          scrolled
            ? "glass border-[0.5px] border-white/10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9),inset_0_0.5px_0_rgba(255,255,255,0.08)]"
            : "border-[0.5px] border-transparent bg-transparent",
        )}
      >
        <a href="#top" className="shrink-0" aria-label="Glow LED Lighting — home">
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[13px] transition-colors",
                    active === l.href ? "text-ink" : "text-steel-400 hover:text-ink",
                  )}
                >
                  {active === l.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.06] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.1)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <CommandSearch className="hidden sm:flex" />
          <Magnetic strength={0.25} className="hidden sm:inline-flex">
            <Button asChild size="sm" className="h-9 pl-4 pr-3">
              <a href="#quote">
                Request a Quote
                <ArrowRight aria-hidden />
              </a>
            </Button>
          </Magnetic>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border-[0.5px] border-white/10 text-ink lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="glass mx-auto mt-2 max-w-[1320px] rounded-3xl border-[0.5px] border-white/10 p-3 lg:hidden"
          >
            <CommandSearch className="mb-2 w-full sm:hidden" />
            <ul className="divide-y-[0.5px] divide-white/[0.06]">
              {navLinks.map((l, i) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3 py-4 text-lg text-ink"
                  >
                    <span className="font-display">{l.label}</span>
                    <span className="label-mono text-steel-500">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-3 w-full">
              <a href="#quote" onClick={() => setOpen(false)}>
                Request a Quote <ArrowRight aria-hidden />
              </a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
