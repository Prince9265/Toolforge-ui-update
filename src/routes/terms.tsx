import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";
import { siteConfig } from "@/lib/site-config";

const title = "Terms of Service — ToolForge";
const description =
  "The terms that govern your use of ToolForge's free, browser-based utilities, including acceptable use and liability limits.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalLayout title="Terms of Service" updated="August 2026">
      <p>
        By using ToolForge you agree to these terms. The service is provided free of charge, as-is,
        and without warranty of any kind.
      </p>
      <h2>Acceptable use</h2>
      <ul>
        <li>Do not use the tools to process material you have no right to process.</li>
        <li>Do not attempt to disrupt, overload or reverse-engineer the service.</li>
        <li>Automated scraping of the site is not permitted.</li>
      </ul>
      <h2>No warranty</h2>
      <p>
        Tool output is provided for convenience. Always verify results before relying on them for
        production, legal or financial decisions. ToolForge is not liable for data loss or damages
        arising from use of the site.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these terms as the platform evolves. Continued use after an update means you
        accept the revised terms. Questions:{" "}
        <a className="text-primary" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalLayout>
  ),
});
