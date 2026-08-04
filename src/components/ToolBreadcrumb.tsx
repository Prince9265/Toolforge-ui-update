import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { categoryById, type ToolMeta } from "@/lib/tools";

/** Remembers where the visitor was on the home grid so "Back" feels instant. */
export const HOME_STATE_KEY = "toolforge:home-state";

export function markReturnToHome() {
  try {
    sessionStorage.setItem("toolforge:restore-home", "1");
  } catch {
    /* storage unavailable — restoring scroll is a nicety, not a requirement */
  }
}

/**
 * Back button + Home > Category > Tool breadcrumb shown above every tool title.
 */
export function ToolBreadcrumb({ tool }: { tool: ToolMeta }) {
  const cat = categoryById(tool.category);

  return (
    <div className="mb-5 space-y-3">
      <Link
        to="/"
        onClick={markReturnToHome}
        className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-glass-border bg-surface px-4 text-sm font-semibold backdrop-blur-md transition-all hover:border-primary/60 hover:text-primary active:scale-95"
      >
        <ArrowLeft
          className="size-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back to all tools
      </Link>

      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground sm:text-sm">
          <li className="flex items-center gap-1">
            <Link
              to="/"
              onClick={markReturnToHome}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:text-foreground"
            >
              <Home className="size-3.5" aria-hidden="true" />
              Home
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
          <li>
            <Link
              to="/category/$id"
              params={{ id: cat.id }}
              className="rounded-md px-1.5 py-1 transition-colors hover:text-foreground"
            >
              {cat.emoji} {cat.name}
            </Link>
          </li>
          <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
          <li aria-current="page" className="min-w-0 truncate px-1.5 font-semibold text-foreground">
            {tool.name}
          </li>
        </ol>
      </nav>
    </div>
  );
}
