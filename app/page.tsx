import Image from "next/image";
import { aboutPoints, highlights, partners, productGroups, site } from "./content";
import { Header, Logo } from "./components/header";
import { ProductTile } from "./components/product-tile";
import { ContactForm } from "./components/contact-form";
import { Icon } from "./components/icons";

function SectionHeading({ eyebrow, title, intro, id }: { eyebrow: string; title: string; intro?: string; id: string }) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-[1.75rem] font-semibold leading-tight sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{intro}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        {/* Hero */}
        <section id="top" className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(60%_60%_at_20%_0%,rgba(170,195,56,0.16),transparent_70%)]"
          />
          <div className="container-x grid items-center gap-10 pb-14 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-16">
            <div>
              <p className="eyebrow">{site.tagline}</p>
              <h1 className="mt-3 text-[2.375rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                Better light for every commercial space.
              </h1>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-muted sm:text-lg">
                Warehouses, offices, parking lots and everything in between. We source from over 60 suppliers to find
                the right fixture for the job, at prices up to 30% below industry standard.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#contact" className="btn btn-primary px-6 text-base">
                  Request a Quote <Icon.arrow className="size-4" />
                </a>
                <a href="#products" className="btn btn-secondary px-6 text-base">
                  View Products
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
                {["Free shipping", "Fast lead times", "Layouts & audits"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Icon.check className="size-4 text-brand-text" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-soft shadow-[0_30px_60px_-30px_rgba(20,32,46,0.45)] sm:aspect-[16/10] lg:aspect-[4/5]">
                <Image
                  src="/assets/hero-warehouse-v2.jpg"
                  alt="Warehouse aisle evenly lit by LED high bay fixtures"
                  fill
                  priority
                  sizes="(min-width: 1024px) 34rem, (min-width: 640px) 90vw, 100vw"
                  className="object-cover object-[50%_45%]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section aria-label="Why Glow" className="border-y border-line bg-soft">
          <div className="container-x grid gap-px py-2 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h) => {
              const I = Icon[h.icon];
              return (
                <div key={h.title} className="flex gap-4 py-5 sm:px-4 lg:py-8">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-text ring-1 ring-line">
                    <I className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{h.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{h.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Products */}
        <section id="products" aria-labelledby="products-title" className="py-16 sm:py-24">
          <div className="container-x">
            <SectionHeading
              id="products-title"
              eyebrow="Products"
              title="Fixtures for every space, inside and out"
              intro="Tap any product to request a quote. Don't see what you need? Ask us. With 60+ suppliers, we can likely source it."
            />
            {productGroups.map((g) => (
              <div key={g.title} className="mt-10 sm:mt-12">
                <h3 className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-muted">
                  {g.title}
                  <span className="h-px flex-1 bg-line" />
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
                  {g.items.map((p) => (
                    <ProductTile key={p.name} product={p} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section id="partners" aria-labelledby="partners-title" className="border-t border-line bg-soft py-16 sm:py-20">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Our Partners</p>
              <h2 id="partners-title" className="mt-2 text-[1.75rem] font-semibold leading-tight sm:text-4xl">
                Access to over 60 suppliers
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
                No one in the industry can match our reach when it comes to finding your perfect fixture. Here are just a
                few.
              </p>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {partners.map((p) => (
                <li
                  key={p.name}
                  className="flex h-24 items-center justify-center rounded-xl border border-line bg-white px-5 sm:h-28"
                >
                  <Image
                    src={`/img/partners/${p.file}.webp`}
                    alt={p.name}
                    width={p.w}
                    height={p.h}
                    sizes="160px"
                    className={`w-auto max-w-full object-contain ${p.w / p.h < 2 ? "max-h-[4.5rem] sm:max-h-20" : "max-h-12 sm:max-h-14"}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Promise */}
        <section id="promise" aria-labelledby="promise-title" className="py-16 sm:py-24">
          <div className="container-x grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="eyebrow">The Glow Promise</p>
              <h2 id="promise-title" className="mt-2 text-[1.75rem] font-semibold leading-tight sm:text-4xl">
                Nothing works without you, the customer.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg">
              <p>We know this, and it factors into every decision we make.</p>
              <p>
                Our focus is on your business more than our own. When you are more than satisfied, you will feel like you
                have a true partner in this industry.
              </p>
              <p>
                Your company, your margins, your reputation, your lead times and your deliveries are vital to our model.
                If we ever fail to deliver the best service you have ever had, please tell us.
              </p>
              <p className="border-l-4 border-brand pl-4 font-medium text-ink">
                Thank you for trusting Glow LED Lighting with your project.
              </p>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" aria-labelledby="about-title" className="bg-ink py-16 text-white sm:py-24">
          <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative order-last aspect-[4/3] overflow-hidden rounded-2xl lg:order-first lg:aspect-[4/5]">
              <Image
                src="/assets/case-study-manufacturing.jpg"
                alt="Manufacturing floor evenly lit by linear LED high bays"
                fill
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-brand">About Us</p>
              <h2 id="about-title" className="mt-2 text-[1.75rem] font-semibold leading-tight sm:text-4xl">
                Industry-leading LED solutions, built around your project
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
                Our team&apos;s expertise and dedication to quality let us deliver great lighting products and service.
                We take pride in meeting the unique lighting needs of every client.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {aboutPoints.map((t) => (
                  <li key={t} className="flex items-start gap-3 rounded-xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-ink">
                      <Icon.check className="size-4" />
                    </span>
                    <span className="font-medium">{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-base leading-relaxed text-white/75">
                A Glow specialist will work with you and your clients to plan the right layout for the job. We also
                excel at converting old lighting to LED, with many retrofit options.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" aria-labelledby="contact-title" className="py-16 sm:py-24">
          <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <SectionHeading
                id="contact-title"
                eyebrow="Get in Touch"
                title="Contact us or request a quote"
                intro="Send us your project details, fixture list or drawings. We'll find the right product at the right price."
              />
              {(site.phone || site.email) && (
                <ul className="mt-8 space-y-3">
                  {site.phone && (
                    <li>
                      <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 font-medium">
                        <Icon.phone className="size-5 text-brand-text" /> {site.phone}
                      </a>
                    </li>
                  )}
                  {site.email && (
                    <li>
                      <a href={`mailto:${site.email}`} className="flex items-center gap-3 font-medium break-all">
                        <Icon.mail className="size-5 text-brand-text" /> {site.email}
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_20px_50px_-30px_rgba(20,32,46,0.35)] sm:p-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-soft">
        <div className="container-x flex flex-col gap-6 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
            <a href="#products" className="hover:text-ink">Products</a>
            <a href="#about" className="hover:text-ink">About</a>
            <a href="#contact" className="hover:text-ink">Contact</a>
          </nav>
          <p className="text-sm text-muted">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </footer>
    </>
  );
}
