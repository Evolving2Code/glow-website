"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

export const PRODUCT_EVENT = "glow:product";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [message, setMessage] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  // A product tile was tapped: prefill the message and focus the first field.
  useEffect(() => {
    const onProduct = (e: Event) => {
      const product = (e as CustomEvent<string>).detail;
      setMessage((m) => (m.trim() ? m : `I'd like a quote on ${product}.`));
      setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 400);
    };
    window.addEventListener(PRODUCT_EVENT, onProduct);
    return () => window.removeEventListener(PRODUCT_EVENT, onProduct);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      form.reset();
      setMessage("");
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className="flex min-h-[22rem] flex-col items-center justify-center text-center" role="status">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand/20 text-brand-text">
          <Icon.check className="size-6" />
        </span>
        <h3 className="mt-4 text-xl font-semibold">Thanks, we got it.</h3>
        <p className="mt-2 max-w-xs text-muted">A Glow specialist will get back to you shortly.</p>
        <button type="button" className="btn btn-secondary mt-6" onClick={() => setStatus({ kind: "idle" })}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate={false}>
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="text-sm font-medium">Name / Company</span>
        <input ref={nameRef} name="name" required autoComplete="organization" className="field" />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">Email</span>
        <input name="email" type="email" required autoComplete="email" inputMode="email" className="field" />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium">
          Phone <span className="font-normal text-muted">(optional)</span>
        </span>
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className="field" />
      </label>
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="text-sm font-medium">Message</span>
        <textarea
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about the project: space type, size, fixtures you need, timeline."
          className="field resize-y"
        />
      </label>
      {/* Spam trap: hidden from people, bots fill it in */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted" aria-live="polite">
          {status.kind === "error" ? <span className="text-red-700">{status.message}</span> : "A Glow specialist will be in touch."}
        </p>
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send Message"}
          {status.kind !== "sending" && <Icon.arrow className="size-4" />}
        </button>
      </div>
    </form>
  );
}
