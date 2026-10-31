import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_FIELD = 4000;

type QuotePayload = {
  suite?: string;
  projectType?: string;
  sqft?: string | number;
  timeline?: string;
  services?: string[];
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

function clean(v: unknown) {
  return typeof v === "string" ? v.trim().slice(0, MAX_FIELD) : undefined;
}

export async function POST(request: Request) {
  let body: QuotePayload;
  try {
    body = (await request.json()) as QuotePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const lead = {
    suite: clean(body.suite),
    projectType: clean(body.projectType),
    sqft: Number(body.sqft) || undefined,
    timeline: clean(body.timeline),
    services: Array.isArray(body.services) ? body.services.filter((s) => typeof s === "string").slice(0, 10) : [],
    name: clean(body.name),
    company: clean(body.company),
    email: clean(body.email),
    phone: clean(body.phone),
    notes: clean(body.notes),
  };

  if (!lead.name || !lead.company || !lead.email || !EMAIL_RE.test(lead.email)) {
    return NextResponse.json({ ok: false, error: "Name, company and a valid email are required." }, { status: 422 });
  }

  const reference = `GLW-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const record = { reference, receivedAt: new Date().toISOString(), ...lead };

  const webhook = process.env.QUOTE_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    }).catch(() => null);
    if (!res || !res.ok) {
      return NextResponse.json({ ok: false, error: "Could not deliver request" }, { status: 502 });
    }
  } else {
    console.info("[quote] QUOTE_WEBHOOK_URL not set — lead logged only:", record);
  }

  return NextResponse.json({ ok: true, reference });
}
