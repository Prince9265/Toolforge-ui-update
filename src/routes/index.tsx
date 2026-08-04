import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Zap, ShieldCheck, Clock, Star } from "lucide-react";
import { categories, searchTools, tools, toolBySlug } from "@/lib/tools";
import { ToolGrid } from "@/components/ToolCard";
import { AdTopBanner, AdWorkspaceNative } from "@/components/ads/AdSlots";
import { useFavorites, useRecentlyUsed } from "@/lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `ToolForge — ${tools.length}+ Free Browser-Based Web Utilities` },
      {
        name: "description",
        content:
          "Fast, private, 100% client-side tools: JSON formatter, JWT decoder, image compressor, PDF merge, markdown editor, prompt enhancer and more. No signup.",
      },
      { property: "og:title", content: "ToolForge — Free All-in-One Web Utility Platform" },
      {
        property: "og:description",
        content: `${tools.length}+ privacy-first browser tools for developers, creators and marketers.`,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ToolForge",
          description: "All-in-one client-side web utility platform.",
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const { recent } = useRecentlyUsed();
  const { favorites } = useFavorites();

  const results = useMemo(() => {
    const base = searchTools(query);
    return cat === "all" ? base : base.filter((t) => t.category === cat);
  }, [query, cat]);

  const popular = tools.filter((t) => t.popular).slice(0, 5);

  return (
    <>
      <section className="halo relative overflow-hidden px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-glass-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            100% client-side · no signup
          </p>
          <h1 className="font-display text-4xl font-black leading-[1.05] sm:text-6xl">
            Every utility you need,{" "}
            <span className="forge-gradient-text">forged in your browser</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            {tools.length}+ fast, private tools for developers, creators and marketers. Your files
            never leave this device.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools… (press ⌘K anywhere)"
              aria-label="Search tools"
              className="glass h-14 w-full rounded-2xl pl-12 pr-4 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {popular.map((t) => (
              <li key={t.slug}>
                <Link
                  to="/tools/$slug"
                  params={{ slug: t.slug }}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-glass-border bg-surface px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <Zap className="size-3 text-primary" aria-hidden="true" />
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AdTopBanner />

      <div className="mx-auto max-w-[1600px] px-4 pb-20 sm:px-6">
        {recent.length > 0 && (
          <section aria-labelledby="recent-heading" className="mb-8">
            <h2
              id="recent-heading"
              className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            >
              <Clock className="size-3.5" aria-hidden="true" /> Recently used
            </h2>
            <ul className="flex gap-2 overflow-x-auto pb-2">
              {recent.map((slug) => {
                const tool = toolBySlug(slug);
                if (!tool) return null;
                return (
                  <li key={slug} className="shrink-0">
                    <Link
                      to="/tools/$slug"
                      params={{ slug }}
                      className="inline-flex min-h-11 items-center rounded-xl border border-glass-border bg-card px-4 text-sm font-medium"
                    >
                      {tool.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {favorites.length > 0 && (
          <section aria-labelledby="fav-heading" className="mb-8">
            <h2
              id="fav-heading"
              className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            >
              <Star className="size-3.5 text-primary" aria-hidden="true" /> Your favorites
            </h2>
            <ToolGrid
              items={favorites.map(toolBySlug).filter(Boolean) as typeof tools}
              ads={false}
            />
          </section>
        )}

        <div role="tablist" aria-label="Filter by category" className="mb-5 flex flex-wrap gap-2">
          {[{ id: "all", name: "All tools" }, ...categories].map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={cat === c.id}
              onClick={() => setCat(c.id)}
              className={`min-h-11 rounded-xl px-4 text-sm font-semibold transition-colors ${
                cat === c.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-glass-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {results.length === 0 ? (
          <p className="rounded-2xl border border-glass-border bg-card p-10 text-center text-sm text-muted-foreground">
            No tools match “{query}”. Try a different keyword.
          </p>
        ) : (
          <ToolGrid items={results} />
        )}

        <AdWorkspaceNative />
      </div>
    </>
  );
}
