import { type ReactNode } from "react";
import { Loader2 } from "lucide-react";

const STEPS = ["Reading input", "Optimising", "Finalising output"];

export function ProcessingOverlay({ label, active }: { label: string; active: boolean }) {
  if (!active) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-20 grid place-items-center rounded-2xl bg-background/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <div className="relative grid size-16 place-items-center">
          <span className="absolute inset-0 animate-forge-pulse rounded-full bg-primary/30" />
          <Loader2 className="size-7 animate-spin text-primary" aria-hidden="true" />
        </div>
        <p className="font-display text-sm font-bold">{label}…</p>
        <ul className="flex flex-wrap justify-center gap-2">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className="rounded-full border border-glass-border bg-surface px-2.5 py-1 text-[11px] text-muted-foreground"
              style={{ animation: `forge-pulse 1.4s ${i * 0.35}s ease-in-out infinite` }}
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Panel({
  title,
  children,
  actions,
  className = "",
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative rounded-2xl border border-glass-border bg-card p-4 sm:p-5 ${className}`}>
      <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h2 className="truncate font-display text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </h2>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:brightness-110 glow"
      : "border border-glass-border bg-surface text-foreground hover:bg-surface-2";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full resize-y rounded-xl border border-glass-border bg-surface p-3 font-mono text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus:border-primary ${props.className ?? ""}`}
    />
  );
}

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`min-h-11 w-full rounded-xl border border-glass-border bg-surface px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary ${props.className ?? ""}`}
    />
  );
}
