import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AdSense-compliant ad containers.
 * Every slot is clearly labelled "ADVERTISEMENT", keeps generous margin buffers
 * away from interactive controls, and reserves layout space to avoid CLS.
 * Replace the placeholder body with your <ins class="adsbygoogle"> unit.
 */

function Label({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "block text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground",
        className,
      )}
    >
      Advertisement
    </span>
  );
}

function Placeholder({ size }: { size: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface">
      <span className="text-xs font-mono text-muted-foreground">Ad slot · {size}</span>
      <span className="pointer-events-none absolute inset-y-0 w-1/3 animate-forge-sweep bg-linear-to-r from-transparent via-foreground/5 to-transparent" />
    </div>
  );
}

/** 1. Top banner — 728x90 desktop / 320x100 mobile. */
export function AdTopBanner({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn("mx-auto my-6 w-full max-w-[760px] px-4 sm:px-0", className)}
    >
      <Label className="mb-1.5 text-center" />
      <div className="h-[100px] w-full sm:h-[90px]">
        <Placeholder size="728x90 / 320x100" />
      </div>
    </aside>
  );
}

/** 2. Sticky skyscraper gutters — hidden below 1440px. */
export function AdSkyscraper({ side }: { side: "left" | "right" }) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        "pointer-events-none fixed top-28 z-20 hidden w-[180px] min-[1440px]:block",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      <div className="pointer-events-auto">
        <Label className="mb-1.5 text-center" />
        <div className="h-[600px] w-[160px]">
          <Placeholder size="160x600" />
        </div>
      </div>
    </aside>
  );
}

/** 3. Native in-feed card — dropped in every 6th grid position. */
export function AdInFeedCard() {
  return (
    <div
      aria-label="Advertisement"
      className="flex min-h-[190px] flex-col rounded-2xl border border-glass-border bg-surface p-4"
    >
      <Label className="mb-2" />
      <div className="flex-1">
        <Placeholder size="Native in-feed" />
      </div>
    </div>
  );
}

/** 4. Workspace native banner — next to tool output. */
export function AdWorkspaceNative({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn("my-8 rounded-2xl border border-glass-border bg-surface p-4", className)}
    >
      <Label className="mb-2" />
      <div className="h-[250px] w-full">
        <Placeholder size="336x280 responsive" />
      </div>
    </aside>
  );
}

/** 5. Mobile sticky bottom anchor with dismiss. */
export function AdMobileAnchor() {
  const [closed, setClosed] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || closed) return null;

  return (
    <aside
      aria-label="Advertisement"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-glass-border bg-background/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-md lg:hidden"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <Label className="mb-1" />
          <div className="h-[50px] w-full">
            <Placeholder size="320x50" />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="Close advertisement"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
