import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Star } from "lucide-react";
import { toolBySlug, categoryById } from "@/lib/tools";
import { toolRegistry } from "@/components/tools/registry";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolBreadcrumb } from "@/components/ToolBreadcrumb";
import { ToolGuide } from "@/components/ToolGuide";
import { AdTopBanner, AdWorkspaceNative } from "@/components/ads/AdSlots";
import { useFavorites, useRecentlyUsed } from "@/lib/storage";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = toolBySlug(params.slug);
    if (!tool) throw notFound();
    return tool;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Tool not found — ToolForge" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — Free Online Tool | ToolForge`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description.slice(0, 158) },
        { name: "keywords", content: loaderData.keywords.join(", ") },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description.slice(0, 158) },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/tools/${loaderData.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/tools/${loaderData.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: loaderData.name,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any (web browser)",
            description: loaderData.description,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              {
                "@type": "ListItem",
                position: 2,
                name: categoryById(loaderData.category).name,
                item: `/category/${loaderData.category}`,
              },
              { "@type": "ListItem", position: 3, name: loaderData.name },
            ],
          }),
        },
      ],
    };
  },
  component: ToolPage,
});

function ToolPage() {
  const tool = Route.useLoaderData();
  const { push } = useRecentlyUsed();
  const { isFavorite, toggle } = useFavorites();
  const Tool = toolRegistry[tool.slug];

  useEffect(() => {
    push(tool.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool.slug]);

  const fav = isFavorite(tool.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-8 sm:px-6 lg:pb-16">
      <ToolBreadcrumb tool={tool} />
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {categoryById(tool.category).emoji} {categoryById(tool.category).name}
          </p>
          <h1 className="mt-1 text-2xl font-black sm:text-4xl">{tool.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {tool.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggle(tool.slug)}
          aria-pressed={fav}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-glass-border bg-surface px-4 text-sm font-semibold transition-transform active:scale-95"
        >
          <Star className={`size-4 ${fav ? "fill-primary text-primary" : ""}`} aria-hidden="true" />
          <span className="hidden sm:inline">{fav ? "Saved" : "Save"}</span>
        </button>
      </header>

      <AdTopBanner />

      <div className="mt-2">{Tool ? <Tool /> : null}</div>

      <ToolGuide tool={tool} />

      <AdWorkspaceNative />

      <RelatedTools slug={tool.slug} />
    </div>
  );
}

