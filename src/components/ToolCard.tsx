import { Link } from "@tanstack/react-router";
import { Star, ArrowUpRight } from "lucide-react";
import { categoryById, type ToolMeta } from "@/lib/tools";
import { useFavorites } from "@/lib/storage";
import { AdInFeedCard } from "./ads/AdSlots";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(tool.slug);

  return (
    <article className="card-lift group relative flex min-h-[190px] flex-col rounded-2xl border border-glass-border bg-card p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            {categoryById(tool.category).name}
          </span>
          <h3 className="mt-1 truncate text-base font-bold">
            <Link to="/tools/$slug" params={{ slug: tool.slug }} className="after:absolute after:inset-0">
              {tool.name}
            </Link>
          </h3>
        </div>
        <button
          type="button"
          onClick={() => toggle(tool.slug)}
          aria-label={fav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
          aria-pressed={fav}
          className="relative z-10 grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-2 hover:text-primary"
        >
          <Star className={`size-4 ${fav ? "fill-primary text-primary" : ""}`} aria-hidden="true" />
        </button>
      </div>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.short}</p>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        Open tool
        <ArrowUpRight
          className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </article>
  );
}

/** Responsive grid, mobile → ultrawide, with a native ad every 6th card. */
export function ToolGrid({ items, ads = true }: { items: ToolMeta[]; ads?: boolean }) {
  const cells: Array<{ type: "tool"; tool: ToolMeta } | { type: "ad"; key: string }> = [];
  items.forEach((tool, i) => {
    cells.push({ type: "tool", tool });
    if (ads && (i + 1) % 6 === 0 && i + 1 < items.length) {
      cells.push({ type: "ad", key: `ad-${i}` });
    }
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4">
      {cells.map((cell) =>
        cell.type === "tool" ? (
          <ToolCard key={cell.tool.slug} tool={cell.tool} />
        ) : (
          <AdInFeedCard key={cell.key} />
        ),
      )}
    </div>
  );
}
