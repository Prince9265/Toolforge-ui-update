import { Link } from "@tanstack/react-router";
import { Flame, Mail, ShieldCheck, LifeBuoy } from "lucide-react";
import { categories, tools } from "@/lib/tools";
import { siteConfig } from "@/lib/site-config";

const legal = [
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/disclaimer", label: "Disclaimer" },
  { to: "/adsense-disclaimer", label: "AdSense Disclaimer" },
  { to: "/cookies", label: "Cookie Policy" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-glass-border bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Flame className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold">
              Tool<span className="text-primary">Forge</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {tools.length}+ fast, free utilities for developers, creators and marketers — every
            one running entirely inside your browser.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-glass-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            100% Client-Side Privacy Guarantee
          </p>
        </div>

        <nav aria-label="Quick links">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Quick links
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                All tools
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="text-muted-foreground hover:text-foreground">
                Favorite tools
              </Link>
            </li>
            {tools
              .filter((t) => t.popular)
              .slice(0, 4)
              .map((t) => (
                <li key={t.slug}>
                  <Link
                    to="/tools/$slug"
                    params={{ slug: t.slug }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <nav aria-label="Categories">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Categories
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to="/category/$id"
                  params={{ id: c.id }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Legal & contact
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {legal.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Mail className="size-4" aria-hidden="true" />
                {siteConfig.contactEmail}
              </a>
            </li>
            {siteConfig.supportLink && (
              <li>
                <a
                  href={siteConfig.supportLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <LifeBuoy className="size-4" aria-hidden="true" />
                  Support & feedback
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-glass-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © 2024–{year} ToolForge. All rights reserved. Nothing you paste or upload ever leaves your
        device.
      </div>
    </footer>
  );
}
