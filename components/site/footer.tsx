import { navLinks, site, suites } from "@/lib/content";
import { Logo } from "./logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t-[0.5px] border-white/10 pt-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(60%_100%_at_50%_100%,rgba(255,196,107,0.12),transparent)]" />
      <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-steel-400">
              Commercial and industrial LED lighting — engineered, value-engineered and shipped from a global supplier
              network.
            </p>
            {(site.email || site.phone) && (
              <address className="mt-6 space-y-1 not-italic">
                {site.email && (
                  <a href={`mailto:${site.email}`} className="block text-[14px] text-ink hover:text-glow-300">
                    {site.email}
                  </a>
                )}
                {site.phone && (
                  <a href={`tel:${site.phone.replace(/[^+0-9]/g, "")}`} className="block font-mono text-[13px] text-steel-400 hover:text-ink">
                    {site.phone}
                  </a>
                )}
              </address>
            )}
          </div>
          <nav aria-label="Product suites" className="lg:col-span-3">
            <p className="label-mono text-steel-500">Suites</p>
            <ul className="mt-5 space-y-2.5">
              {suites.map((s) => (
                <li key={s.key}>
                  <a href="#products" className="text-[14px] text-ink-dim hover:text-ink">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer" className="lg:col-span-2">
            <p className="label-mono text-steel-500">Explore</p>
            <ul className="mt-5 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[14px] text-ink-dim hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#quote" className="text-[14px] text-glow-300 hover:text-glow-200">
                  Request a Quote
                </a>
              </li>
            </ul>
          </nav>
          <div className="lg:col-span-2">
            <p className="label-mono text-steel-500">Standards</p>
            <ul className="mt-5 space-y-2.5 font-mono text-[12.5px] text-steel-400">
              <li>IES photometrics</li>
              <li>0–10V dimming</li>
              <li>4000K / 5000K</li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="font-display pointer-events-none mt-20 select-none bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center text-[22vw] font-semibold leading-[0.75] tracking-[-0.07em] text-transparent lg:text-[17rem]"
        >
          GLOW
        </p>

        <div className="relative flex flex-col gap-3 border-t-[0.5px] border-white/10 py-6 text-[12px] text-steel-500 sm:flex-row sm:justify-between">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p className="font-mono">{site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
