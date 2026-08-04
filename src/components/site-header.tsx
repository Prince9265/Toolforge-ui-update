import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Command, LayoutGrid, Moon, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolForgeLogo } from "@/components/logo";
import { CommandPalette } from "@/components/command-palette";
import { categories, tools } from "@/lib/tools/registry";
import { useTheme } from "@/lib/prefs";

export function SiteHeader() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--surface-border)] bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <ToolForgeLogo className="h-9 w-9 shrink-0" />
          <span className="truncate font-display text-xl font-bold tracking-tight">
            Tool<span className="text-gradient">Forge</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="mr-2 hidden items-center gap-1 lg:flex">
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to="/category/$categoryId"
                params={{ categoryId: c.id }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-foreground bg-muted" }}
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <Button
            variant="outline"
            className="gap-2 text-muted-foreground"
            onClick={() => setPaletteOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search tools</span>
            <kbd className="hidden items-center gap-0.5 rounded border border-border px-1.5 text-[10px] sm:flex">
              <Command className="h-3 w-3" />K
            </kbd>
          </Button>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open quick tool switcher">
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[320px] sm:w-[380px]">
              <SheetHeader>
                <SheetTitle>Quick tool switcher</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100dvh-6rem)] pr-3">
                <div className="space-y-5 pb-10">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {category.name}
                      </p>
                      <div className="space-y-0.5">
                        {tools
                          .filter((t) => t.category === category.id)
                          .map((tool) => (
                            <Link
                              key={tool.slug}
                              to="/tools/$slug"
                              params={{ slug: tool.slug }}
                              onClick={() => setDrawerOpen(false)}
                              className="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted"
                              activeProps={{ className: "bg-muted font-medium" }}
                            >
                              <tool.icon className="h-4 w-4 shrink-0 text-primary" />
                              <span className="truncate">{tool.name}</span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggle}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}