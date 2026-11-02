# Glow LED Lighting — glowledlighting.com

A simple, fast, mobile-first refresh of the original Wix site. Same sections, same message, cleaner look.

Next.js (App Router) + Tailwind CSS v4. No other UI libraries.

```bash
npm install
npm run dev       # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | File |
|------|------|
| All text, products, partners, phone/email | `app/content.ts` |
| Page sections (hero, highlights, products, partners, promise, about, contact, footer) | `app/page.tsx` |
| Header + mobile menu | `app/components/header.tsx` |
| Contact form | `app/components/contact-form.tsx` → `POST /api/quote` |
| Colors and fonts | `app/globals.css` |
| Product photos (4:3, 960×720 WebP) | `public/img/products/` |
| Partner logos | `public/img/partners/` |
| Hero and About photos | `public/assets/` |
| Favicon / home-screen icon | `app/icon.png`, `app/apple-icon.png` |

To add a phone number or email, fill in `site.phone` / `site.email` in `app/content.ts`; they then show in the contact section.

To change a product photo, drop a 4:3 image in `public/img/products/` with the same file name.

## Contact form delivery

Set `QUOTE_WEBHOOK_URL` (see `.env.example`) to forward each message as JSON to email (e.g. a Zapier/Make hook), a CRM or Slack.
Without it, messages are only written to the server log. **Set this before going live.**

## Going live

Deploy to Vercel (or any Next.js host), set `QUOTE_WEBHOOK_URL`, then point the glowledlighting.com domain at the new host instead of Wix.
