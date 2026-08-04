import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { categories, categoryById, tools, type CategoryId } from "@/lib/tools";
import { ToolGrid } from "@/components/ToolCard";
import { AdTopBanner, AdWorkspaceNative } from "@/components/ads/AdSlots";

export const Route = createFileRoute("/category/$id")({
  loader: ({ params }) => {
    const cat = categories.find((c) => c.id === params.id);
    if (!cat) throw notFound();
    return cat;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Category not found — ToolForge" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} Tools — Free & Browser-Based | ToolForge`;
    const description = `${loaderData.tagline}. Free, private ${loaderData.name.toLowerCase()} tools that run entirely in your browser — no signup, no uploads.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/category/${loaderData.id}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/category/${loaderData.id}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const cat = Route.useLoaderData();
  const items = tools.filter((t) => t.category === (cat.id as CategoryId));

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Category</p>
      <h1 className="mt-1 font-display text-3xl font-black sm:text-5xl">{cat.name}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{cat.tagline}</p>

      <AdTopBanner />

      <ToolGrid items={items} />

      <nav aria-label="Other categories" className="mt-10 flex flex-wrap gap-2">
        {categories
          .filter((c) => c.id !== cat.id)
          .map((c) => (
            <Link
              key={c.id}
              to="/category/$id"
              params={{ id: c.id }}
              className="min-h-11 rounded-xl border border-glass-border bg-surface px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              {categoryById(c.id).name}
            </Link>
          ))}
      </nav>

      <AdWorkspaceNative />
    </div>
  );
}
