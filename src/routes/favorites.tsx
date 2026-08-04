import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { toolBySlug, type ToolMeta } from "@/lib/tools";
import { ToolGrid } from "@/components/ToolCard";
import { useFavorites, useHydrated } from "@/lib/storage";
import { AdWorkspaceNative } from "@/components/ads/AdSlots";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Your Favorite Tools — ToolForge" },
      {
        name: "description",
        content:
          "Your bookmarked ToolForge utilities, saved privately in this browser for one-click access.",
      },
      { property: "og:title", content: "Your Favorite Tools — ToolForge" },
      {
        property: "og:description",
        content: "Quick access to the browser tools you use most.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/favorites" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/favorites" }],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites } = useFavorites();
  const hydrated = useHydrated();
  const items = favorites.map(toolBySlug).filter(Boolean) as ToolMeta[];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6">
      <h1 className="flex items-center gap-2 font-display text-3xl font-black sm:text-5xl">
        <Star className="size-7 fill-primary text-primary" aria-hidden="true" />
        Favorites
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Saved locally in this browser — nothing is ever sent to a server.
      </p>

      <div className="mt-8">
        {!hydrated ? null : items.length === 0 ? (
          <p className="rounded-2xl border border-glass-border bg-card p-10 text-center text-sm text-muted-foreground">
            No favorites yet. Tap the star on any tool page to pin it here.{" "}
            <Link to="/" className="font-semibold text-primary">
              Browse tools
            </Link>
          </p>
        ) : (
          <ToolGrid items={items} />
        )}
      </div>

      <AdWorkspaceNative />
    </div>
  );
}
