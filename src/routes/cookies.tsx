import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";
import { siteConfig } from "@/lib/site-config";

const title = "Cookie Policy — ToolForge";
const description =
  "Which cookies and browser storage ToolForge uses, why they exist, and how to disable them.";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/cookies" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: () => (
    <LegalLayout title="Cookie Policy" updated="August 2026">
      <p>
        ToolForge sets no tracking cookies of its own. The storage we do use falls into two
        categories.
      </p>
      <h2>Essential browser storage</h2>
      <ul>
        <li>
          <strong>Theme preference</strong> — remembers light or dark mode.
        </li>
        <li>
          <strong>Favorites & recent tools</strong> — kept in localStorage so your shortcuts persist.
        </li>
      </ul>
      <h2>Third-party advertising cookies</h2>
      <p>
        Google AdSense and its partners may set cookies to measure ad performance and to limit how
        often you see the same ad. These are controlled by Google, not by ToolForge.
      </p>
      <h2>Managing cookies</h2>
      <p>
        You can block or clear cookies at any time in your browser settings; the tools will continue
        to work. For anything else, contact{" "}
        <a className="text-primary" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalLayout>
  ),
});
