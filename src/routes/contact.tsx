import { createFileRoute } from "@tanstack/react-router";
import { Mail, LifeBuoy, Clock } from "lucide-react";
import { LegalLayout } from "@/components/LegalLayout";
import { siteConfig } from "@/lib/site-config";

const title = "Contact ToolForge — Support, Feedback & Bug Reports";
const description =
  "Reach the ToolForge team by email for bug reports, feature requests, advertising questions, DMCA notices and privacy enquiries.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact ToolForge",
          description,
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalLayout title="Contact Us" updated="August 2026">
      <p>
        ToolForge is maintained by a small independent team. We read every message and reply to
        genuine enquiries — there is no ticket system and no chatbot in between.
      </p>

      <div className="not-prose grid gap-4 sm:grid-cols-2">
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="flex items-start gap-3 rounded-2xl border border-glass-border bg-card p-5 transition-transform hover:-translate-y-0.5"
        >
          <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-sm font-bold text-foreground">Email us</span>
            <span className="block truncate text-sm text-muted-foreground">
              {siteConfig.contactEmail}
            </span>
          </span>
        </a>

        {siteConfig.supportLink ? (
          <a
            href={siteConfig.supportLink}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-start gap-3 rounded-2xl border border-glass-border bg-card p-5 transition-transform hover:-translate-y-0.5"
          >
            <LifeBuoy className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block text-sm font-bold text-foreground">Support &amp; feedback</span>
              <span className="block truncate text-sm text-muted-foreground">
                {siteConfig.supportLink}
              </span>
            </span>
          </a>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-glass-border bg-card p-5">
            <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <span className="block text-sm font-bold text-foreground">Response time</span>
              <span className="block text-sm text-muted-foreground">
                Usually within 2 business days
              </span>
            </span>
          </div>
        )}
      </div>

      <h2>What to write about</h2>
      <ul>
        <li>
          <strong>Bug reports</strong> — tell us the tool name, your browser and what you expected.
        </li>
        <li>
          <strong>Feature requests</strong> — new tools and options are prioritised by demand.
        </li>
        <li>
          <strong>Advertising</strong> — questions about ad placement or the ads shown on the site.
        </li>
        <li>
          <strong>Privacy</strong> — data requests, even though we do not collect personal data.
        </li>
        <li>
          <strong>Legal / DMCA</strong> — copyright and takedown notices.
        </li>
      </ul>

      <h2>What we cannot help with</h2>
      <p>
        Because processing happens in your browser and nothing is stored on our side, we cannot
        recover a file, a document or output you have already closed. Always save your results
        before leaving a tool page.
      </p>
    </LegalLayout>
  );
}
