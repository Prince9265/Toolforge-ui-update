import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";
import { siteConfig } from "@/lib/site-config";
import { tools } from "@/lib/tools";

const title = "Disclaimer — 100% Client-Side, No Data Collection | ToolForge";
const description =
  "ToolForge's disclaimer: all tools run entirely in your browser, no files or text are uploaded, and output is provided as-is without warranty.";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/disclaimer" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: () => (
    <LegalLayout title="Disclaimer" updated="August 2026">
      <p>
        <strong>100% client-side guarantee.</strong> All {tools.length} ToolForge utilities execute
        inside your browser using JavaScript, WebAssembly and the Canvas API. Text, images, PDFs and
        any other input you provide are processed in your device&rsquo;s memory and are never
        uploaded, copied, logged or transmitted to ToolForge or any third party.
      </p>

      <h2>No data collection</h2>
      <ul>
        <li>We operate no database and no file storage for user content.</li>
        <li>We do not require an account, an email address or any personal detail to use a tool.</li>
        <li>
          Favourites and recently used tools are saved only in your browser&rsquo;s local storage and
          can be cleared from your browser settings at any time.
        </li>
      </ul>

      <h2>Accuracy of results</h2>
      <p>
        Tool output is provided for convenience and general information only. Formatters, decoders,
        calculators and converters can misinterpret unusual input, and results should be verified
        before being used for production systems, financial decisions, legal filings, medical
        judgement or any other consequential purpose.
      </p>

      <h2>No professional advice</h2>
      <p>
        Nothing on ToolForge — including calculator output and written guidance on tool pages —
        constitutes legal, financial, medical or professional advice. Consult a qualified
        professional for your specific situation.
      </p>

      <h2>Third-party advertising</h2>
      <p>
        ToolForge displays advertising supplied by third-party networks. We do not control and do not
        endorse the products, services or claims made in those advertisements, and we are not
        responsible for content on external sites they link to.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The service is provided &ldquo;as is&rdquo;, without warranty of any kind. ToolForge is not
        liable for any loss of data, profit or opportunity arising from use of the site. Questions
        about this disclaimer can be sent to{" "}
        <a className="text-primary" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalLayout>
  ),
});
