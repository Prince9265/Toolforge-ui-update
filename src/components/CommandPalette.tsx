import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, CornerDownLeft, X } from "lucide-react";
import { searchTools, categoryById } from "@/lib/tools";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchTools(query).slice(0, 8), [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (i + 1) % Math.max(results.length, 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
      }
      if (e.key === "Enter" && results[active]) {
        e.preventDefault();
        onOpenChange(false);
        navigate({ to: "/tools/$slug", params: { slug: results[active].slug } });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, navigate, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-foreground/40 px-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      onMouseDown={(e) => e.target === e.currentTarget && onOpenChange(false)}
    >
      <div className="glass w-full max-w-xl overflow-hidden rounded-2xl">
        <div className="flex items-center gap-3 border-b border-glass-border px-4">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search 14 tools…"
            aria-label="Search tools"
            className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close search"
            className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="max-h-[52vh] overflow-y-auto p-2" role="listbox">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No tools match “{query}”.
            </li>
          )}
          {results.map((tool, i) => (
            <li key={tool.slug}>
              <button
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  onOpenChange(false);
                  navigate({ to: "/tools/$slug", params: { slug: tool.slug } });
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  i === active ? "bg-primary/15 text-foreground" : "hover:bg-surface-2"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{tool.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {tool.short}
                  </span>
                </span>
                <span className="shrink-0 rounded-full border border-glass-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {categoryById(tool.category).name}
                </span>
                {i === active && (
                  <CornerDownLeft className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
