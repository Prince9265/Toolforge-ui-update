import { type ReactNode, useRef } from "react";
import { ClipboardPaste, Eraser, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const ref = useRef<HTMLTextAreaElement>(null);
  const editable = !props.readOnly && !props.disabled;

  /** Write a value into the textarea so React's own onChange handler fires. */
  const setValue = (next: string) => {
    const el = ref.current;
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    setter?.call(el, next);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };

  return (
    <div className="relative">
      <textarea
        ref={ref}
        {...props}
        style={{ overflowWrap: "anywhere", wordBreak: "break-word", ...props.style }}
        className={`w-full resize-y rounded-xl border border-glass-border bg-surface p-3 font-mono text-sm leading-relaxed break-all whitespace-pre-wrap outline-none transition-colors placeholder:text-muted-foreground focus:border-primary ${editable ? "pt-9" : ""} ${props.className ?? ""}`}
      />
      {editable && (
        <div className="pointer-events-none absolute inset-x-2 top-1.5 flex justify-end gap-1">
          <button
            type="button"
            aria-label="Paste from clipboard"
            onClick={async () => {
              try {
                setValue(await navigator.clipboard.readText());
                toast.success("Pasted from clipboard");
              } catch {
                toast.error("Clipboard blocked — use Ctrl/Cmd + V");
              }
            }}
            className="pointer-events-auto inline-flex items-center gap-1 rounded-lg border border-glass-border bg-background/80 px-2 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
          >
            <ClipboardPaste className="size-3.5" aria-hidden="true" />
            Paste
          </button>
          <button
            type="button"
            aria-label="Clear input"
            onClick={() => {
              setValue("");
              toast("Input cleared");
            }}
            className="pointer-events-auto inline-flex items-center gap-1 rounded-lg border border-glass-border bg-background/80 px-2 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
          >
            <Eraser className="size-3.5" aria-hidden="true" />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

/** Copy-to-clipboard action with an instant toast confirmation. */
export function CopyResultButton({ value, label = "Copy result" }: { value: string; label?: string }) {
  return (
    <ActionButton
      variant="ghost"
      ariaLabel={label}
      onClick={async () => {
        if (!value) {
          toast.error("Nothing to copy yet");
          return;
        }
        try {
          await navigator.clipboard.writeText(value);
          toast.success("Copied to clipboard");
        } catch {
          toast.error("Clipboard blocked by your browser");
        }
      }}
    >
      {label}
    </ActionButton>
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
