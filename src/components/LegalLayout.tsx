import type { ReactNode } from "react";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6">
      <h1 className="font-display text-3xl font-black sm:text-4xl">{title}</h1>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Last updated {updated}
      </p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">
        {children}
      </div>
    </article>
  );
}
