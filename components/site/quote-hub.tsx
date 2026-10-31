"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CornerDownLeft, RotateCcw } from "lucide-react";
import { suites } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn, formatInt } from "@/lib/utils";
import { PREFILL_EVENT } from "./product-bento";

type StepType = "choice" | "multi" | "text" | "email" | "number" | "textarea";

type Step = {
  key: string;
  prompt: string;
  type: StepType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  optional?: boolean;
  autoComplete?: string;
};

const steps: Step[] = [
  {
    key: "suite",
    prompt: "What are we lighting?",
    type: "choice",
    options: [...suites.map((s) => ({ value: s.key, label: s.name })), { value: "mixed", label: "Mixed / not sure yet" }],
  },
  {
    key: "projectType",
    prompt: "What kind of project is it?",
    type: "choice",
    options: [
      { value: "retrofit", label: "Retrofit" },
      { value: "new-construction", label: "New construction" },
      { value: "replacement", label: "Replacement / stock" },
    ],
  },
  { key: "sqft", prompt: "Roughly how many square feet?", type: "number", placeholder: "e.g. 120000" },
  {
    key: "timeline",
    prompt: "When do fixtures need to be on site?",
    type: "choice",
    options: [
      { value: "30d", label: "Within 30 days" },
      { value: "1-3m", label: "1 – 3 months" },
      { value: "3-6m", label: "3 – 6 months" },
      { value: "budgeting", label: "Budgeting only" },
    ],
  },
  {
    key: "services",
    prompt: "Add engineering services?",
    type: "multi",
    optional: true,
    options: [
      { value: "layout", label: "Photometric layout" },
      { value: "audit", label: "On-site energy audit" },
      { value: "rebates", label: "Utility rebate support" },
    ],
  },
  { key: "name", prompt: "Who should we address the quote to?", type: "text", placeholder: "Full name", autoComplete: "name" },
  { key: "company", prompt: "Company?", type: "text", placeholder: "Company name", autoComplete: "organization" },
  { key: "email", prompt: "Best email for the quote?", type: "email", placeholder: "you@company.com", autoComplete: "email" },
  { key: "phone", prompt: "Direct line?", type: "text", optional: true, placeholder: "Optional", autoComplete: "tel" },
  {
    key: "notes",
    prompt: "Anything our engineers should know?",
    type: "textarea",
    optional: true,
    placeholder: "Mounting heights, existing fixtures, drawings to follow…",
  },
];

type Answers = Record<string, string | string[]>;
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function displayValue(step: Step, v: string | string[] | undefined) {
  if (v === undefined || (Array.isArray(v) && v.length === 0) || v === "") return "—";
  if (step.type === "choice") return step.options?.find((o) => o.value === v)?.label ?? String(v);
  if (step.type === "multi") return (v as string[]).map((x) => step.options?.find((o) => o.value === x)?.label ?? x).join(", ");
  if (step.type === "number") return `${formatInt(Number(v))} sq ft`;
  return String(v);
}

export function QuoteHub() {
  const [answers, setAnswers] = React.useState<Answers>({});
  const [index, setIndex] = React.useState(0);
  const [input, setInput] = React.useState("");
  const [multi, setMulti] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<Status>("idle");
  const [reference, setReference] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const [focused, setFocused] = React.useState(false);

  const done = index >= steps.length;
  const step = steps[Math.min(index, steps.length - 1)];

  React.useEffect(() => {
    const onPrefill = (e: Event) => {
      const key = (e as CustomEvent<string>).detail;
      setAnswers((a) => ({ ...a, suite: key }));
      setIndex((i) => (i === 0 ? 1 : i));
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  React.useEffect(() => {
    if (done) return;
    const existing = answers[step.key];
    setInput(typeof existing === "string" && step.type !== "choice" ? existing : "");
    setMulti(Array.isArray(existing) ? existing : []);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  React.useEffect(() => {
    if (focused) inputRef.current?.focus({ preventScroll: true });
  }, [index, focused]);

  const commit = (value: string | string[]) => {
    setAnswers((a) => ({ ...a, [step.key]: value }));
    setIndex((i) => i + 1);
  };

  const submitText = () => {
    const v = input.trim();
    if (!v && !step.optional) return setError("Required — type a response and press Enter.");
    if (step.type === "email" && !EMAIL_RE.test(v)) return setError("That email doesn't look right.");
    if (step.type === "number") {
      const n = Number(v.replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(n) || n <= 0) return setError("Enter a number of square feet, e.g. 120000.");
      return commit(String(Math.round(n)));
    }
    commit(v);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (done) return;
    if (step.type === "choice" || step.type === "multi") {
      const n = Number(e.key);
      if (n >= 1 && n <= (step.options?.length ?? 0)) {
        e.preventDefault();
        const opt = step.options![n - 1];
        if (step.type === "choice") commit(opt.value);
        else setMulti((m) => (m.includes(opt.value) ? m.filter((x) => x !== opt.value) : [...m, opt.value]));
        return;
      }
      if (e.key === "Enter" && step.type === "multi") {
        e.preventDefault();
        commit(multi);
        return;
      }
    }
    if (e.key === "Enter" && (step.type !== "textarea" || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submitText();
    }
    if (e.key === "Backspace" && input === "" && index > 0) {
      e.preventDefault();
      setIndex((i) => i - 1);
    }
  };

  const send = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = (await res.json()) as { ok: boolean; reference?: string; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Request failed");
      setReference(data.reference ?? "");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setAnswers({});
    setIndex(0);
    setStatus("idle");
    setReference("");
  };

  const progress = Math.min(1, index / steps.length);

  const payload = React.useMemo(() => {
    const out: Record<string, unknown> = {};
    steps.forEach((s) => {
      if (answers[s.key] !== undefined) out[s.key] = s.type === "number" ? Number(answers[s.key]) : answers[s.key];
    });
    return out;
  }, [answers]);

  return (
    <section id="quote" aria-labelledby="quote-title" className="relative overflow-x-clip py-24 lg:py-28">
      <div aria-hidden className="pointer-events-none absolute left-0 top-1/3 size-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,196,107,0.08),transparent)]" />
      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8">
        <SectionHeading
          id="quote-title"
          index="05"
          eyebrow="Quote hub"
          title={
            <>
              Ten questions.
              <br />
              <span className="text-steel-500">One engineered quote.</span>
            </>
          }
          lede="No account, no catalogue maze. Answer what you know — an engineer picks it up from there. Use number keys for options, Enter to continue, Backspace to step back."
        />

        <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          {/* Terminal */}
          <div
            ref={terminalRef}
            onClick={() => inputRef.current?.focus()}
            className="theme-dark relative overflow-hidden rounded-[1.5rem] border-[0.5px] border-contrast/12 bg-surface-sunken shadow-[0_50px_120px_-50px_var(--shadow-strong),inset_0_0.5px_0_rgba(255,255,255,0.08)] lg:col-span-8"
          >
            <div className="flex items-center justify-between border-b-[0.5px] border-contrast/10 px-5 py-3.5">
              <p className="font-mono text-[12px] text-steel-500">
                glow<span className="text-steel-600">://</span>quote <span className="text-steel-600">—</span> new request
              </p>
              <p className="label-mono !text-[10px] text-steel-500 tabular">
                {done ? "Ready" : `${String(index + 1).padStart(2, "0")} / ${steps.length}`}
              </p>
            </div>
            <div className="h-px w-full bg-contrast/[0.04]">
              <motion.div className="h-px bg-glow-400 shadow-[0_0_12px_rgba(255,196,107,1)]" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
            </div>

            <div className="min-h-[440px] p-5 font-mono text-[13px] sm:p-8 sm:text-[14px]">
              <p className="text-steel-500">
                <span className="text-accent">glow</span> Engineering desk online. Let&apos;s scope your project.
              </p>

              <ol className="mt-6 space-y-1.5" aria-label="Answers so far">
                {steps.slice(0, Math.min(index, steps.length)).map((s, i) => (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (status === "idle" || status === "error") setIndex(i);
                      }}
                      className="group flex w-full items-baseline gap-3 rounded px-1 py-0.5 text-left transition-colors hover:bg-contrast/[0.03]"
                      aria-label={`Edit ${s.prompt} Current answer: ${displayValue(s, answers[s.key])}`}
                    >
                      <span className="text-glow-500">✓</span>
                      <span className="w-28 shrink-0 text-steel-500 sm:w-36">{s.key}</span>
                      <span className="min-w-0 flex-1 truncate text-ink">{displayValue(s, answers[s.key])}</span>
                      <span className="hidden text-[11px] text-steel-600 group-hover:inline">edit</span>
                    </button>
                  </li>
                ))}
              </ol>

              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mt-8"
                  >
                    <label htmlFor={`q-${step.key}`} className="block text-ink">
                      <span className="text-accent">?</span> {step.prompt}
                      {step.optional && <span className="ml-2 text-steel-600">(optional)</span>}
                    </label>

                    {(step.type === "choice" || step.type === "multi") && (
                      <div className="mt-4 flex flex-wrap gap-2" role={step.type === "choice" ? "radiogroup" : "group"} aria-label={step.prompt}>
                        {step.options!.map((o, i) => {
                          const selected = step.type === "multi" ? multi.includes(o.value) : answers[step.key] === o.value;
                          return (
                            <button
                              key={o.value}
                              type="button"
                              role={step.type === "choice" ? "radio" : "checkbox"}
                              aria-checked={selected}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (step.type === "choice") commit(o.value);
                                else setMulti((m) => (m.includes(o.value) ? m.filter((x) => x !== o.value) : [...m, o.value]));
                              }}
                              className={cn(
                                "group flex items-center gap-2.5 rounded-lg border-[0.5px] px-3 py-2 text-left font-sans text-[13.5px] transition-all",
                                selected
                                  ? "border-glow-400/70 bg-glow-400/10 text-accent shadow-[0_0_20px_-6px_rgba(255,196,107,0.6)]"
                                  : "border-contrast/10 text-ink-dim hover:border-contrast/25 hover:text-ink",
                              )}
                            >
                              <span className={cn("font-mono text-[11px]", selected ? "text-accent" : "text-steel-600")}>{i + 1}</span>
                              {o.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-4 flex items-start gap-3">
                      <span className="pt-[1px] text-accent" aria-hidden>
                        ›
                      </span>
                      {step.type === "textarea" ? (
                        <textarea
                          ref={inputRef}
                          id={`q-${step.key}`}
                          rows={3}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={onKeyDown}
                          onFocus={() => setFocused(true)}
                          placeholder={step.placeholder}
                          className="min-h-[5rem] w-full resize-none bg-transparent text-ink caret-glow-400 placeholder:text-steel-600 focus:outline-none"
                        />
                      ) : step.type === "choice" || step.type === "multi" ? (
                        <input
                          ref={inputRef}
                          id={`q-${step.key}`}
                          readOnly
                          value=""
                          onKeyDown={onKeyDown}
                          onFocus={() => setFocused(true)}
                          aria-describedby={`hint-${step.key}`}
                          className="w-full bg-transparent text-ink caret-glow-400 focus:outline-none"
                          placeholder={step.type === "choice" ? "press 1–" + step.options!.length : "toggle with 1–" + step.options!.length + ", Enter to continue"}
                        />
                      ) : (
                        <input
                          ref={inputRef}
                          id={`q-${step.key}`}
                          type={step.type === "email" ? "email" : "text"}
                          inputMode={step.type === "number" ? "numeric" : undefined}
                          autoComplete={step.autoComplete ?? "off"}
                          value={input}
                          onChange={(e) => {
                            setInput(e.target.value);
                            setError(null);
                          }}
                          onKeyDown={onKeyDown}
                          onFocus={() => setFocused(true)}
                          placeholder={step.placeholder}
                          aria-invalid={!!error}
                          aria-describedby={`hint-${step.key}`}
                          className="w-full bg-transparent text-ink caret-glow-400 placeholder:text-steel-600 focus:outline-none"
                        />
                      )}
                    </div>

                    <div id={`hint-${step.key}`} className="mt-6 flex flex-wrap items-center gap-3">
                      {error ? (
                        <p className="text-[12px] text-red-300" role="alert">
                          ✕ {error}
                        </p>
                      ) : (
                        <p className="flex items-center gap-1.5 text-[11px] text-steel-600">
                          <CornerDownLeft className="size-3" aria-hidden />
                          {step.type === "textarea" ? "⌘/Ctrl + Enter to continue" : "Enter to continue"}
                          {index > 0 && " · Backspace on empty to go back"}
                        </p>
                      )}
                      {(step.type !== "choice") && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (step.type === "multi") commit(multi);
                            else submitText();
                          }}
                          className="ml-auto rounded-md border-[0.5px] border-contrast/15 px-2.5 py-1 font-sans text-[12px] text-ink-dim hover:border-glow-400/60 hover:text-accent"
                        >
                          {step.optional && !input && multi.length === 0 ? "Skip" : "Continue"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="review" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                    {status === "sent" ? (
                      <div role="status">
                        <p className="text-accent">
                          ✓ Request <span className="text-ink">{reference}</span> received.
                        </p>
                        <p className="mt-3 max-w-lg font-sans text-[14px] leading-relaxed text-ink-dim">
                          A Glow project engineer will review your scope and reply to {String(answers.email)} with next steps.
                          Have drawings or a fixture schedule? Reply to that email and attach them.
                        </p>
                        <button type="button" onClick={reset} className="mt-6 inline-flex items-center gap-2 font-sans text-[13px] text-steel-400 hover:text-ink">
                          <RotateCcw className="size-3.5" aria-hidden /> Start another request
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-ink">
                          <span className="text-accent">?</span> Send this request to the engineering desk?
                        </p>
                        {status === "error" && (
                          <p className="mt-3 text-[12px] text-red-300" role="alert">
                            ✕ We couldn&apos;t send that. Check your connection and try again.
                          </p>
                        )}
                        <div className="mt-6 flex flex-wrap items-center gap-3 font-sans">
                          <Magnetic>
                            <Button size="lg" onClick={send} disabled={status === "sending"}>
                              {status === "sending" ? "Transmitting…" : "Send request"}
                              <ArrowRight aria-hidden />
                            </Button>
                          </Magnetic>
                          <Button size="lg" variant="ghost" onClick={() => setIndex(steps.length - 1)}>
                            Back
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Payload + process */}
          <aside className="flex flex-col gap-4 lg:col-span-4" aria-label="Request summary">
            <div className="theme-dark overflow-hidden rounded-[1.5rem] border-[0.5px] border-contrast/10 bg-surface-raised">
              <div className="flex items-center justify-between border-b-[0.5px] border-contrast/10 px-5 py-3.5">
                <p className="font-mono text-[12px] text-steel-500">request.json</p>
                <span className="size-1.5 animate-pulse-glow rounded-full bg-glow-400" aria-hidden />
              </div>
              <pre className="no-scrollbar max-h-[300px] overflow-auto p-5 font-mono text-[12px] leading-relaxed" aria-live="polite">
                <span className="text-steel-500">{"{"}</span>
                {Object.entries(payload).map(([k, v], i, arr) => (
                  <span key={k} className="block pl-4">
                    <span className="text-steel-300">&quot;{k}&quot;</span>
                    <span className="text-steel-500">: </span>
                    <span className={typeof v === "number" ? "text-accent" : "text-glow-100"}>{JSON.stringify(v)}</span>
                    {i < arr.length - 1 && <span className="text-steel-500">,</span>}
                  </span>
                ))}
                {Object.keys(payload).length === 0 && <span className="block pl-4 text-steel-600">// awaiting input</span>}
                <span className="text-steel-500">{"}"}</span>
              </pre>
            </div>

            <div className="flex-1 rounded-[1.5rem] border-[0.5px] border-contrast/10 bg-surface-raised p-6 shadow-[0_30px_80px_-50px_var(--shadow-strong)]">
              <p className="label-mono text-steel-500">What happens next</p>
              <ol className="mt-6 space-y-6">
                {[
                  ["Scope review", "An engineer reads your request and asks for drawings or counts if needed."],
                  ["Layout & VE package", "Photometric layout, fixture schedule and value-engineered alternates."],
                  ["Written quote", "Firm pricing, freight included, with a committed ship date."],
                ].map(([t, d], i) => (
                  <li key={t} className="grid grid-cols-[2rem_1fr] gap-2">
                    <span className="font-mono text-[12px] text-accent">0{i + 1}</span>
                    <span>
                      <span className="block text-[14px] text-ink">{t}</span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-steel-400">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
