"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { nav, site } from "../content";
import { Icon } from "./icons";

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <Image src="/img/logo-icon.png" alt="" width={36} height={36} className="size-9" priority />
      <span className="leading-tight">
        <span className="block text-[1.0625rem] font-semibold tracking-tight">Glow LED Lighting</span>
        <span className="block text-[0.6875rem] font-medium text-brand-text">{site.tagline}</span>
      </span>
    </a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    // Lock page scroll while the full-screen menu is open.
    const root = document.documentElement;
    const prevRoot = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      root.style.overflow = prevRoot;
    };
  }, [open]);

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        open ? "bg-white" : "bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80"
      } ${scrolled || open ? "border-line" : "border-transparent"}`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-[0.9375rem] font-medium text-ink-soft transition-colors hover:bg-soft hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary ml-2">
            Get a Quote
          </a>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg text-ink hover:bg-soft md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Icon.close className="size-6" /> : <Icon.menu className="size-6" />}
        </button>
      </div>

    </header>

    {/* Full-screen mobile menu. Sits outside the header so it covers the whole viewport below it. */}
    <div
      id="mobile-menu"
      hidden={!open}
      className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto overscroll-contain bg-white md:hidden"
    >
      <nav aria-label="Mobile" className="container-x flex min-h-full flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        {nav.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="border-b border-line py-5 text-[1.75rem] font-semibold tracking-tight text-ink active:text-brand-text"
          >
            {l.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="btn btn-primary mt-auto min-h-14 w-full text-lg"
        >
          Get a Quote
        </a>
      </nav>
    </div>
    </>
  );
}
