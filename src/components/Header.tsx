import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Star,
  Moon,
  Sun,
  PanelRightOpen,
  Flame,
  ChevronDown,
  X,
} from "lucide-react";
import { categories, tools } from "@/lib/tools";
import { useFavorites, useTheme } from "@/lib/storage";
import { CommandPalette } from "./CommandPalette";
import { ToolDrawer } from "./ToolDrawer";

export function Header() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const { theme, toggle } = useTheme();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "/" && !(e.target as HTMLElement)?.closest("input,textarea")) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-glass-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="ToolForge home">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Flame className="size-5" aria-hidden="true" />
            </span>
            <span className="truncate font-display text-lg font-bold tracking-tight">
              Tool<span className="text-primary">Forge</span>
            </span>
          </Link>

          <nav aria-label="Tool categories" className="hidden justify-center gap-1 lg:flex">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative"
                onMouseLeave={() => setOpenCat((c) => (c === cat.id ? null : c))}
              >
                <button
                  type="button"
                  aria-expanded={openCat === cat.id}
                  onMouseEnter={() => setOpenCat(cat.id)}
                  onClick={() => navigate({ to: "/category/$id", params: { id: cat.id } })}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  {cat.name}
                  <ChevronDown className="size-3.5" aria-hidden="true" />
                </button>
                {openCat === cat.id && (
                  <div className="glass absolute left-1/2 top-full w-72 -translate-x-1/2 rounded-2xl p-2">
                    {tools
                      .filter((t) => t.category === cat.id)
                      .map((t) => (
                        <Link
                          key={t.slug}
                          to="/tools/$slug"
                          params={{ slug: t.slug }}
                          onClick={() => setOpenCat(null)}
                          className="block rounded-xl px-3 py-2 text-sm transition-colors hover:bg-surface-2"
                        >
                          <span className="block font-medium">{t.name}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {t.short}
                          </span>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-xl border border-glass-border bg-surface px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              <Search className="size-4" aria-hidden="true" />
              Search tools
              <kbd className="ml-2 rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search tools"
              className="grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground sm:hidden"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>

            <Link
              to="/favorites"
              aria-label={`Favorites, ${favorites.length} saved`}
              className="relative grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <Star className="size-5" aria-hidden="true" />
              {favorites.length > 0 && (
                <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {favorites.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={toggle}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              className="grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="size-5" aria-hidden="true" />
              ) : (
                <Moon className="size-5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open quick tool drawer"
              className="grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <PanelRightOpen className="size-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setMobileNav((v) => !v)}
              aria-label="Toggle category menu"
              aria-expanded={mobileNav}
              className="grid size-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden"
            >
              {mobileNav ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <ChevronDown className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileNav && (
          <nav
            aria-label="Categories"
            className="grid grid-cols-2 gap-2 border-t border-glass-border px-4 py-3 lg:hidden"
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/category/$id"
                params={{ id: cat.id }}
                onClick={() => setMobileNav(false)}
                className="rounded-xl border border-glass-border bg-surface px-3 py-2 text-sm font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <ToolDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
