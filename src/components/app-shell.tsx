import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnchorAd, LeaderboardAd, SkyscraperAd } from "@/components/ads";
import { SiteHeader } from "@/components/site-header";
import { categories } from "@/lib/tools/registry";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <SkyscraperAd side="left" />
      <SkyscraperAd side="right" />
      <LeaderboardAd />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24">{children}</main>
      <footer className="mt-16 border-t border-[var(--surface-border)] py-10">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-bold">ToolForge</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Fast, private, browser-based utilities. Nothing you paste ever leaves your device.
            </p>
          </div>
          {categories.slice(0, 3).map((c) => (
            <div key={c.id}>
              <p className="text-sm font-semibold">{c.name}</p>
              <Link
                to="/category/$categoryId"
                params={{ categoryId: c.id }}
                className="mt-2 inline-block text-sm text-muted-foreground hover:text-foreground"
              >
                Browse tools
              </Link>
            </div>
          ))}
        </div>
      </footer>
      <AnchorAd />
    </div>
  );
}