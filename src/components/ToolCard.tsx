import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { categoryById, type ToolMeta } from "@/lib/tools";
import { useFavorites } from "@/lib/storage";
import { AdInFeedCard } from "./ads/AdSlots";

/**
 * High-density compact card: 2 columns on mobile, 3 on tablet, 4 on desktop.
 */
export function ToolCard({ tool }: { tool: ToolMeta }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(tool.slug);
  const cat = categoryById(tool.category);

  return (
    <motion.article
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group relative flex min-h-[150px] flex-col rounded-2xl border border-glass-border bg-card p-3 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_10px_30px_-12px_var(--primary)] active:translate-y-0 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-glass-border bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span aria-hidden="true">{cat.emoji}</span>
          <span className="hidden sm:inline">{cat.shortName}</span>
        </span>
        <button
          type="button"
          onClick={() => toggle(tool.slug)}
          aria-label={fav ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
          aria-pressed={fav}
          className="relative z-10 -mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-transform hover:bg-surface-2 hover:text-primary active:scale-90"
        >
          <Star className={`size-3.5 ${fav ? "fill-primary text-primary" : ""}`} aria-hidden="true" />
        </button>
      </div>

      <h3 className="mt-2 text-sm font-bold leading-snug sm:text-base">
        <Link
          to="/tools/$slug"
          params={{ slug: tool.slug }}
          className="after:absolute after:inset-0"
        >
          {tool.name}
        </Link>
      </h3>

      <p className="mt-1 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {tool.short}
      </p>

      <span className="mt-2 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open tool →
      </span>
    </motion.article>
  );
}

/** Responsive grid, mobile → ultrawide, with a native ad every 8th card. */
export function ToolGrid({ items, ads = true }: { items: ToolMeta[]; ads?: boolean }) {
  const cells: Array<{ type: "tool"; tool: ToolMeta } | { type: "ad"; key: string }> = [];
  items.forEach((tool, i) => {
    cells.push({ type: "tool", tool });
    if (ads && (i + 1) % 8 === 0 && i + 1 < items.length) {
      cells.push({ type: "ad", key: `ad-${i}` });
    }
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4"
    >
      {cells.map((cell) =>
        cell.type === "tool" ? (
          <ToolCard key={cell.tool.slug} tool={cell.tool} />
        ) : (
          <AdInFeedCard key={cell.key} />
        ),
      )}
    </motion.div>
  );
}
