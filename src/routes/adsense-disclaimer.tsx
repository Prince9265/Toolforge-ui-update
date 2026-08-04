import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";
import { siteConfig } from "@/lib/site-config";

const title = "AdSense Disclaimer — ToolForge";
const description =
  "How advertising works on ToolForge, our Google AdSense relationship, and our ad placement standards.";

export const Route = createFileRoute("/adsense-disclaimer")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/adsense-disclaimer" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/adsense-disclaimer" }],
  }),
  component: () => (
    <LegalLayout title="AdSense Disclaimer" updated="August 2026">
      <p>
        ToolForge is free to use and funded by advertising. We participate in Google AdSense, a
        third-party advertising network operated by Google LLC.
      </p>
      <h2>How ads are served</h2>
      <p>
        Google and its partners use cookies and device identifiers to serve ads based on your prior
        visits to this and other websites. Ads may be personalised or non-personalised depending on
        your region and consent choices.
      </p>
      <h2>Our placement standards</h2>
      <ul>
        <li>Every ad container is labelled <strong>ADVERTISEMENT</strong>.</li>
        <li>Ads keep a clear buffer from buttons and tool controls to prevent accidental clicks.</li>
        <li>Ads never obscure tool output or block navigation, and sticky units can be dismissed.</li>
        <li>We do not click our own ads or encourage others to do so.</li>
      </ul>
      <h2>Editorial independence</h2>
      <p>
        Advertisers have no influence over which tools we build or how results are calculated.
        Report a problematic ad to{" "}
        <a className="text-primary" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalLayout>
  ),
});
