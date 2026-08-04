import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";
import { tools } from "@/lib/tools";
import { siteConfig } from "@/lib/site-config";

const title = "About ToolForge — Free Privacy-First Browser Tools";
const description =
  "Who builds ToolForge, why every utility runs 100% client-side, and how the platform stays free, fast and private for developers, creators and marketers.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <LegalLayout title="About ToolForge" updated="August 2026">
      <p>
        ToolForge is an independent, self-funded collection of{" "}
        <strong>{tools.length} free online utilities</strong> for developers, designers, writers,
        marketers and students. It exists because most &ldquo;free online tool&rdquo; sites quietly
        upload your data to a server you know nothing about — and charge you attention, accounts or
        subscriptions for the privilege.
      </p>

      <h2>Our approach</h2>
      <p>
        Every tool on ToolForge is written in JavaScript, WebAssembly or the browser Canvas API and
        executes entirely on your own device. There is no backend that receives your text, images or
        documents, no account system, and no upload step. If a tool cannot be built safely
        client-side, we do not ship it.
      </p>

      <h2>What we build</h2>
      <ul>
        <li>AI &amp; smart utilities — prompt engineering, humanizing, refactoring, social copy</li>
        <li>Developer &amp; data tools — JSON, JWT, SQL, regex, Base64, minifiers</li>
        <li>Image &amp; media tools — compression, resizing, format conversion, SVG and PDF work</li>
        <li>Web &amp; text utilities — Markdown, meta tags, counters, generators</li>
        <li>Calculators &amp; converters — dates, units, percentages, CSS units</li>
      </ul>

      <h2>How ToolForge stays free</h2>
      <p>
        Hosting and development are funded by clearly labelled advertising. Ads are placed in
        dedicated layout regions with generous spacing so they never sit next to a button or cover a
        tool workspace, and they are never allowed to read the content you are processing.
      </p>

      <h2>Get in touch</h2>
      <p>
        Feature requests, bug reports and corrections are always welcome at{" "}
        <a className="text-primary" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalLayout>
  );
}
