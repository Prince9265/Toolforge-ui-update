/**
 * Public site configuration.
 * All values come from Vite environment variables (`.env`), never hardcoded,
 * so contact details and ad/analytics IDs can be rotated without a code change.
 */

const env = import.meta.env as Record<string, string | undefined>;

export const siteConfig = {
  name: "ToolForge",
  tagline: "Privacy-first browser utilities",
  contactEmail: env["VITE_CONTACT_EMAIL"] ?? "support@toolforge.dev",
  supportLink: env["VITE_SUPPORT_LINK"] ?? "",
  adsenseClientId: env["VITE_ADSENSE_CLIENT_ID"] ?? "",
  analyticsTrackingId: env["VITE_ANALYTICS_TRACKING_ID"] ?? "",
} as const;

export const adsEnabled = Boolean(siteConfig.adsenseClientId);
