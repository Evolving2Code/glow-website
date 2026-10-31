"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, CornerDownLeft, Search } from "lucide-react";
import { suites } from "@/lib/content";
import { cn } from "@/lib/utils";

type Entry = { id: string; group: string; label: string; hint: string; href: string; keywords: string };

const entries: Entry[] = [
  ...suites.map((s) => ({
    id: s.key,
    group: "Product suites",
    label: s.name,
    hint: s.specs.map((x) => x.value).join(" · "),
    href: "#products",
    keywords: [s.name, s.tagline, ...s.applications, ...s.specs.map((x) => `${x.label} ${x.value}`)].join(" ").toLowerCase(),
  })),
  { id: "pm", group: "Tools", label: "Photometric playground", hint: "Foot-candles & lux by space", href: "#photometrics", keywords: "lux foot candle fc photometric layout uniformity" },
  { id: "ve", group: "Tools", label: "VE savings calculator", hint: "Estimate procurement savings", href: "#calculator", keywords: "value engineering cost price savings calculator budget" },
  { id: "promise", group: "Company", label: "The Glow Promise", hint: "Lead times, freight, layouts, audits", href: "#promise", keywords: "shipping freight lead time audit layout warranty" },
  { id: "quote", group: "Company", label: "Request a quote", hint: "Talk to a project engineer", href: "#quote", keywords: "quote contact sales rfq bid" },
];

export function CommandSearch({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    const terms = q.split(/\s+/);
    return entries.filter((e) => terms.every((t) => e.keywords.includes(t) || e.label.toLowerCase().includes(t)));
  }, [query]);

  React.useEffect(() => setActive(0), [query]);

  const go = (entry: Entry) => {
    setOpen(false);
    setQuery("");
    requestAnimationFrame(() => {
      document.querySelector(entry.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", entry.href);
    });
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  let lastGroup = "";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            "group flex h-9 items-center gap-2.5 rounded-full border-[0.5px] border-white/10 bg-white/[0.03] pl-3 pr-1.5 text-[13px] text-steel-400 transition-colors hover:border-white/20 hover:text-ink",
            className,
          )}
          aria-label="Search products and specs"
        >
          <Search className="size-3.5" aria-hidden />
          <span className="hidden xl:inline">Search fixtures, specs, applications</span>
          <span className="xl:hidden">Search</span>
          <kbd className="ml-2 hidden rounded-full border-[0.5px] border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-steel-400 sm:inline">
            ⌘K
          </kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-obsidian-950/70 backdrop-blur-sm" />
        <Dialog.Content
          className="glass fixed left-1/2 top-[12vh] z-[61] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border-[0.5px] border-white/15 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9),0_0_80px_-30px_rgba(255,196,107,0.35)]"
          onKeyDown={onListKey}
        >
          <Dialog.Title className="sr-only">Search Glow LED Lighting</Dialog.Title>
          <Dialog.Description className="sr-only">Search product suites, tools and company information.</Dialog.Description>
          <div className="flex items-center gap-3 border-b-[0.5px] border-white/10 px-5">
            <Search className="size-4 text-glow-400" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “IP66”, “stadium”, “160 lm/W”…"
              className="h-14 w-full bg-transparent text-[15px] text-ink placeholder:text-steel-500 focus:outline-none"
              role="combobox"
              aria-expanded
              aria-controls="search-results"
              aria-activedescendant={results[active] ? `search-${results[active].id}` : undefined}
            />
            <kbd className="rounded border-[0.5px] border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-steel-500">ESC</kbd>
          </div>
          <ul id="search-results" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
            {results.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-steel-400">
                No match. Our engineers source beyond the catalogue —{" "}
                <button className="text-glow-300 underline-offset-4 hover:underline" onClick={() => go(entries[entries.length - 1])}>
                  ask for a spec
                </button>
                .
              </li>
            )}
            {results.map((r, i) => {
              const header = r.group !== lastGroup ? r.group : null;
              lastGroup = r.group;
              return (
                <React.Fragment key={r.id}>
                  {header && <li className="label-mono px-3 pb-1.5 pt-3 text-steel-500" role="presentation">{header}</li>}
                  <li
                    id={`search-${r.id}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2.5 transition-colors",
                      i === active ? "bg-white/[0.06]" : "",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm text-ink">{r.label}</span>
                      <span className="block truncate font-mono text-[11px] text-steel-500">{r.hint}</span>
                    </span>
                    {i === active ? (
                      <CornerDownLeft className="size-3.5 shrink-0 text-glow-400" aria-hidden />
                    ) : (
                      <ArrowUpRight className="size-3.5 shrink-0 text-steel-600" aria-hidden />
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
