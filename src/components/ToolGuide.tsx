import { BookOpen, Sparkles, ShieldCheck, Users } from "lucide-react";
import { buildToolGuide } from "@/lib/tool-content";
import type { ToolMeta } from "@/lib/tools";

/** Long-form, indexable content rendered below every tool interface. */
export function ToolGuide({ tool }: { tool: ToolMeta }) {
  const guide = buildToolGuide(tool);

  return (
    <section
      aria-labelledby="guide-heading"
      className="mt-8 rounded-2xl border border-glass-border bg-card p-5 sm:p-8"
    >
      <h2
        id="guide-heading"
        className="flex items-center gap-2 font-display text-xl font-black sm:text-2xl"
      >
        <BookOpen className="size-5 text-primary" aria-hidden="true" />
        How to use {tool.name}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{guide.intro}</p>

      <ol className="mt-5 space-y-3">
        {guide.steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/12 text-xs font-bold text-primary">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <h2 className="mt-9 flex items-center gap-2 font-display text-xl font-black sm:text-2xl">
        <Sparkles className="size-5 text-primary" aria-hidden="true" />
        Features &amp; use cases
      </h2>

      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Key features
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {guide.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <Users className="size-3.5" aria-hidden="true" /> Who it is for
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {guide.useCases.map((u) => (
              <li key={u} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 flex gap-2 rounded-xl border border-glass-border bg-surface p-4 text-sm leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        {guide.privacy}
      </p>
    </section>
  );
}
