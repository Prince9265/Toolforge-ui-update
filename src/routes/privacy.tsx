import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";
import { siteConfig } from "@/lib/site-config";

const title = "Privacy Policy — ToolForge";
const description =
  "How ToolForge handles data: every tool runs client-side, no file uploads, no accounts, and limited advertising cookies.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalLayout title="Privacy Policy" updated="August 2026">
      <p>
        ToolForge is built around a simple promise: <strong>your data stays on your device</strong>.
        Every utility on this site executes in your browser using JavaScript and WebAssembly. Text
        you paste, images you drop and PDFs you open are never transmitted to our servers.
      </p>
      <h2>Information we do not collect</h2>
      <ul>
        <li>File contents, tool inputs or tool outputs.</li>
        <li>Account details — ToolForge has no signup or login.</li>
        <li>Any personally identifying profile data.</li>
      </ul>
      <h2>Information stored in your browser</h2>
      <p>
        Favorites, recently used tools and your light/dark theme preference are saved in
        <strong> localStorage</strong> on your own device. Clearing your browser storage removes
        them permanently.
      </p>
      <h2>Advertising and analytics</h2>
      <p>
        We display advertising supplied by Google AdSense and may measure aggregate traffic with a
        privacy-respecting analytics tag. Third-party vendors, including Google, use cookies to
        serve ads based on prior visits to this or other websites. You can opt out of personalised
        advertising via Google Ads Settings.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a className="text-primary" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </LegalLayout>
  ),
});
