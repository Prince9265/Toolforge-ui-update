import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function AdLabel() {
  return (
    <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
      Advertisement
    </span>
  );
}

function AdFrame({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        "glass flex flex-col items-center justify-center gap-2 rounded-xl border-dashed p-3 text-center",
        className,
      )}
      style={style}
    >
      <AdLabel />
      <div className="flex flex-1 w-full items-center justify-center rounded-lg bg-muted/40 text-xs text-muted-foreground">
        {children ?? "Ad slot"}
      </div>
    </aside>
  );
}

/** Sticky 160x600 / 300x600 skyscrapers, only on ultra-wide viewports. */
export function SkyscraperAd({ side }: { side: "left" | "right" }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed top-28 z-20 hidden min-[1440px]:block",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      <AdFrame className="pointer-events-auto h-[600px] w-[160px] min-[1700px]:w-[300px]">
        160x600
      </AdFrame>
    </div>
  );
}

/** 728x90 desktop / 320x100 mobile leaderboard under the header. */
export function LeaderboardAd() {
  return (
    <div className="mx-auto w-full max-w-[728px] px-4 py-4">
      <AdFrame className="h-[100px] md:h-[90px]">728x90 · 320x100</AdFrame>
    </div>
  );
}

/** In-feed native ad used inside tool grids. */
export function InFeedAd() {
  return <AdFrame className="min-h-[220px]">In-feed native</AdFrame>;
}

/** Ad placed below a tool's output zone, with generous spacing from controls. */
export function WorkspaceAd() {
  return (
    <div className="mt-10">
      <AdFrame className="h-[260px] md:h-[280px]">336x280</AdFrame>
    </div>
  );
}

/** Dismissible 320x50 mobile anchor. */
export function AnchorAd() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-2 pb-2 lg:hidden">
      <div className="glass relative flex h-[50px] w-[320px] max-w-full items-center justify-center rounded-xl">
        <span className="absolute left-2 top-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Advertisement
        </span>
        <span className="text-xs text-muted-foreground">320x50</span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss advertisement"
          className="absolute -top-3 right-1 grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}