import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AdSense-compliant ad containers.
 *
 * Rules enforced here:
 *  - every unit carries a subtle, gray, centered "ADVERTISEMENT" label
 *  - every unit reserves fixed height (no CLS) and keeps a >= 24px buffer
 *    (my-6 / p-6 / gap-6) away from buttons, inputs and tool actions
 *  - the left/right rails are real layout columns (sticky, in-flow) — never
 *    fixed/absolute overlays — so they can never cover tool cards or controls
 *
 * Replace <Placeholder /> with your <ins class="adsbygoogle"> unit.
 */

function Label() {
  return (
    <span className="block text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">
      Advertisement
    </span>
  );
}

function Placeholder({ size }: { size: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface">
      <span className="text-center text-[11px] font-mono text-muted-foreground">{size}</span>
      <span className="pointer-events-none absolute inset-y-0 w-1/3 animate-forge-sweep bg-linear-to-r from-transparent via-foreground/5 to-transparent" />
    </div>
  );
}

/** 1. Top banner — 728x90 desktop / 320x100 mobile. 24px buffer above & below. */
export function AdTopBanner({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn("mx-auto my-6 w-full max-w-[760px]", className)}
    >
      <Label />
      <div className="mt-1.5 h-[100px] w-full sm:h-[90px]">
        <Placeholder size="728x90 / 320x100" />
      </div>
    </aside>
  );
}

/**
 * 2. Sticky rail — rendered INSIDE its own grid column in the root layout.
 * The column itself collapses below 1440px, so no ad can ever overlap content.
 */
export function AdRail({ side }: { side: "left" | "right" }) {
  return (
    <aside aria-label="Advertisement" className="hidden min-[1440px]:block" data-side={side}>
      <div className="sticky top-24 py-6">
        <Label />
        <div className="mt-1.5 h-[600px] w-[160px]">
          <Placeholder size="160x600" />
        </div>
      </div>
    </aside>
  );
}

/** 3. Native in-feed card — dropped into the tool grid. */
export function AdInFeedCard() {
  return (
    <div
      aria-label="Advertisement"
      className="flex min-h-[150px] flex-col rounded-2xl border border-glass-border bg-surface p-3"
    >
      <Label />
      <div className="mt-1.5 flex-1">
        <Placeholder size="Native in-feed" />
      </div>
    </div>
  );
}

/** 4. Workspace native banner — always separated from tool actions by 32px. */
export function AdWorkspaceNative({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn("my-8 rounded-2xl border border-glass-border bg-surface p-6", className)}
    >
      <Label />
      <div className="mt-1.5 h-[250px] w-full">
        <Placeholder size="336x280 responsive" />
      </div>
    </aside>
  );
}

/** 5. Mobile sticky bottom anchor with dismiss control. */
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
      <div className="flex items-center gap-6">
        <div className="min-w-0 flex-1">
          <Label />
          <div className="mt-1 h-[50px] w-full">
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
