import { Link, useRouterState } from "@tanstack/react-router";
import { X, Star, Clock } from "lucide-react";
import { categories, tools, toolBySlug } from "@/lib/tools";
import { useFavorites, useRecentlyUsed } from "@/lib/storage";

export function ToolDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { favorites } = useFavorites();
  const { recent } = useRecentlyUsed();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!open) return null;

  const quick = [
    { label: "Favorites", icon: Star, slugs: favorites },
    { label: "Recently used", icon: Clock, slugs: recent },
  ].filter((g) => g.slugs.length > 0);

  return (
    <div
      className="fixed inset-0 z-[55] bg-foreground/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Quick tool drawer"
      onMouseDown={(e) => e.target === e.currentTarget && onOpenChange(false)}
    >
      <div className="glass ml-auto flex h-full w-[min(22rem,90vw)] flex-col rounded-l-3xl">
        <div className="flex items-center justify-between border-b border-glass-border px-5 py-4">
          <h2 className="font-display text-base font-bold">Quick switch</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close drawer"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {quick.map((group) => (
            <section key={group.label} className="mb-5">
              <h3 className="mb-2 flex items-center gap-1.5 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <group.icon className="size-3.5" aria-hidden="true" />
                {group.label}
              </h3>
              <ul className="space-y-0.5">
                {group.slugs.map((slug) => {
                  const tool = toolBySlug(slug);
                  if (!tool) return null;
                  return (
                    <li key={`${group.label}-${slug}`}>
                      <DrawerLink slug={slug} name={tool.name} pathname={pathname} onGo={() => onOpenChange(false)} />
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {categories.map((cat) => (
            <section key={cat.id} className="mb-5">
              <h3 className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {cat.name}
              </h3>
              <ul className="space-y-0.5">
                {tools
                  .filter((t) => t.category === cat.id)
                  .map((t) => (
                    <li key={t.slug}>
                      <DrawerLink
                        slug={t.slug}
                        name={t.name}
                        pathname={pathname}
                        onGo={() => onOpenChange(false)}
                      />
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function DrawerLink({
  slug,
  name,
  pathname,
  onGo,
}: {
  slug: string;
  name: string;
  pathname: string;
  onGo: () => void;
}) {
  const active = pathname === `/tools/${slug}`;
  return (
    <Link
      to="/tools/$slug"
      params={{ slug }}
      onClick={onGo}
      className={`block truncate rounded-xl px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-primary/15 font-semibold text-foreground"
          : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
      }`}
    >
      {name}
    </Link>
  );
}
