import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ToolGrid } from "@/components/tool-card";
import { categoryById, toolsByCategory, type CategoryId } from "@/lib/tools/registry";

export const Route = createFileRoute("/category/$categoryId")({
  loader: ({ params }) => {
    const category = categoryById(params.categoryId);
    if (!category) throw notFound();
    return category;
  },
  head: ({ loaderData, params }) => {
    const title = loaderData
      ? `${loaderData.name} Tools — Free & Client-Side | ToolForge`
      : "Tools | ToolForge";
    const description = loaderData?.tagline ?? "Browse free browser-based tools on ToolForge.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/category/${params.categoryId}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/category/${params.categoryId}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const category = Route.useLoaderData();
  const list = toolsByCategory(category.id as CategoryId);

  return (
    <AppShell>
      <div className="py-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 text-muted-foreground">{category.tagline}</p>
        <div className="mt-8">
          <ToolGrid tools={list} />
        </div>
      </div>
    </AppShell>
  );
}