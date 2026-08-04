import { categories } from "@/lib/tools";

/**
 * Sticky horizontal category pill navigation so mobile users can jump
 * between categories without endless vertical scrolling.
 */
export function CategoryPills({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  const items = [{ id: "all", shortName: "All", emoji: "🧰" }, ...categories];

  return (
    <div className="sticky top-16 z-30 -mx-4 mb-5 border-y border-glass-border bg-background/90 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div
        role="tablist"
        aria-label="Filter by category"
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((c) => (
          <button
            key={c.id}
            role="tab"
            type="button"
            aria-selected={active === c.id}
            onClick={() => onChange(c.id)}
            className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-all duration-150 active:scale-95 ${
              active === c.id
                ? "bg-primary text-primary-foreground shadow-[0_6px_20px_-8px_var(--primary)]"
                : "border border-glass-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            <span aria-hidden="true">{c.emoji}</span>
            {c.shortName}
          </button>
        ))}
      </div>
    </div>
  );
}
