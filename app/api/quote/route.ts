import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_FIELD = 4000;

function clean(v: unknown) {
  return typeof v === "string" ? v.trim().slice(0, MAX_FIELD) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this in. Pretend success so bots move on.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const lead = {
    name: clean(body.name),
    email: clean(body.email),
    phone: clean(body.phone),
    message: clean(body.message),
  };

  if (!lead.name || !EMAIL_RE.test(lead.email)) {
    return NextResponse.json({ ok: false, error: "Please add your name and a valid email." }, { status: 422 });
  }

  const record = { receivedAt: new Date().toISOString(), source: "glowledlighting.com", ...lead };

  const webhook = process.env.QUOTE_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    }).catch(() => null);
    if (!res || !res.ok) {
      return NextResponse.json({ ok: false, error: "Could not send right now. Please try again." }, { status: 502 });
    }
  } else {
    console.info("[quote] QUOTE_WEBHOOK_URL not set; lead logged only:", record);
  }

  return NextResponse.json({ ok: true });
}
