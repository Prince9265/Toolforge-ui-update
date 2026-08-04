import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { relatedTools, categoryById } from "@/lib/tools";

export function RelatedTools({ slug }: { slug: string }) {
  const items = relatedTools(slug);
  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 id="related-heading" className="font-display text-xl font-bold">
          Related tools
        </h2>
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
          Browse all
        </Link>
      </div>
      <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
        {items.map((tool) => (
          <li key={tool.slug} className="w-[260px] shrink-0 snap-start">
            <Link
              to="/tools/$slug"
              params={{ slug: tool.slug }}
              className="card-lift flex h-full flex-col rounded-2xl border border-glass-border bg-card p-4"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                {categoryById(tool.category).name}
              </span>
              <span className="mt-1 text-sm font-bold">{tool.name}</span>
              <span className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">
                {tool.short}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Try it <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
