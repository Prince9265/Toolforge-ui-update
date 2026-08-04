import { useCallback, useState } from "react";
import { Check, Copy, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  actions,
  className,
  children,
}: {
  title?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("glass rounded-2xl p-4 sm:p-5", className)}>
      {(title || actions) && (
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="truncate font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h2>
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </div>
      )}
      {children}
    </section>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Clipboard unavailable");
    }
  }, [value]);

  return (
    <Button type="button" variant="secondary" size="sm" onClick={onCopy} disabled={!value}>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DownloadButton({
  value,
  filename,
  mime = "text/plain",
  label = "Download",
}: {
  value: string;
  filename: string;
  mime?: string;
  label?: string;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={!value}
      onClick={() => downloadBlob(new Blob([value], { type: mime }), filename)}
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

export function ResetButton({ onReset, label = "Reset" }: { onReset: () => void; label?: string }) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={onReset}>
      <RotateCcw className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  rows = 10,
  readOnly,
  mono = true,
  id,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  mono?: boolean;
  id?: string;
}) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <Textarea
        id={fieldId}
        value={value}
        rows={rows}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn("resize-y bg-background/60", mono && "font-mono text-[13px]")}
      />
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="glass rounded-xl px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

/** Subtle processing state used by heavier utilities. */
export function useProcessing(minMs = 1500) {
  const [processing, setProcessing] = useState(false);

  const run = useCallback(
    async <T,>(work: () => Promise<T> | T): Promise<T | undefined> => {
      setProcessing(true);
      const started = Date.now();
      try {
        const result = await work();
        const wait = Math.max(0, minMs - (Date.now() - started));
        await new Promise((r) => setTimeout(r, wait));
        return result;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
        return undefined;
      } finally {
        setProcessing(false);
      }
    },
    [minMs],
  );

  return { processing, run };
}

export function ProcessingOverlay({ active, label }: { active: boolean; label?: string }) {
  if (!active) return null;
  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span className="text-muted-foreground">{label ?? "Processing in your browser…"}</span>
    </div>
  );
}

export function ErrorNote({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}