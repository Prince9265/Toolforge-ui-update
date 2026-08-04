import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Fragment } from "react";
import { InFeedAd } from "@/components/ads";
import { useFavorites } from "@/lib/prefs";
import type { Tool } from "@/lib/tools/registry";
import { cn } from "@/lib/utils";

export function ToolCard({ tool }: { tool: Tool }) {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(tool.slug);

  return (
    <div className="glass group relative flex h-full flex-col rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-1">
      <button
        type="button"
        onClick={() => toggle(tool.slug)}
        aria-label={favorite ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
        aria-pressed={favorite}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
      >
        <Star className={cn("h-4 w-4", favorite && "fill-primary text-primary")} />
      </button>

      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-[var(--shadow-glow)]">
        <tool.icon className="h-5 w-5" />
      </div>

      <h3 className="pr-8 font-display text-base font-semibold leading-tight">
        <Link to="/tools/$slug" params={{ slug: tool.slug }} className="after:absolute after:inset-0">
          {tool.name}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{tool.short}</p>
    </div>
  );
}

export function ToolGrid({ tools, withAds = true }: { tools: Tool[]; withAds?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool, index) => (
        <Fragment key={tool.slug}>
          <ToolCard tool={tool} />
          {withAds && (index + 1) % 6 === 0 && index !== tools.length - 1 && <InFeedAd />}
        </Fragment>
      ))}
    </div>
  );
}