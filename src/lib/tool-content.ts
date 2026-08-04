import { categoryById, type ToolMeta } from "./tools";

export interface ToolGuide {
  intro: string;
  steps: string[];
  features: string[];
  useCases: string[];
  privacy: string;
}

/**
 * Builds the unique long-form "How to Use" + "Features & Use Cases" copy that
 * sits below every tool interface (150–300 words of structured, indexable
 * content — an AdSense content-quality requirement).
 *
 * Copy is derived from each tool's own metadata, so no two tools share text.
 */
export function buildToolGuide(tool: ToolMeta): ToolGuide {
  const cat = categoryById(tool.category);
  const kw = tool.keywords;
  const primary = kw[0] ?? tool.name.toLowerCase();

  return {
    intro: `${tool.name} is a free, browser-based utility in the ${cat.name} collection on ToolForge. ${tool.description} Everything runs locally with JavaScript inside this page, so there is no upload step, no queue and no account — open the tool, work, and close the tab. Because the processing happens on your own hardware, results appear instantly even for large inputs, and the tool keeps working if your connection drops.`,
    steps: [
      `Open ${tool.name} and paste, type or drop your input into the workspace above.`,
      `Adjust the available options so the output matches the format you need for ${primary}.`,
      `Review the live result — errors and invalid input are reported inline instead of failing silently.`,
      `Copy or download the output, then press Reset or Clear to wipe the workspace before your next run.`,
    ],
    features: [
      "100% client-side processing — nothing is transmitted to a server",
      "Instant, live output with clear inline error handling",
      "Reset and clear controls on every input and result panel",
      "Works offline once the page has loaded, on desktop and mobile",
      `Optimised for ${kw.slice(0, 3).join(", ") || tool.name.toLowerCase()}`,
    ],
    useCases: buildUseCases(tool),
    privacy: `ToolForge never stores, logs or transmits the data you place into ${tool.name}. Favourites and recently used tools are kept in your own browser's local storage and can be cleared at any time from your browser settings.`,
  };
}

function buildUseCases(tool: ToolMeta): string[] {
  const byCategory: Record<string, string[]> = {
    ai: [
      "Writers and marketers polishing drafts before publishing",
      "Prompt engineers building reusable, structured prompt templates",
      "Teams keeping tone and formatting consistent across channels",
    ],
    dev: [
      "Developers debugging API payloads, tokens and query output",
      "QA engineers validating data shapes before filing a bug report",
      "Students learning how encoding, parsing and formatting work",
    ],
    media: [
      "Designers preparing lighter assets for faster page loads",
      "Bloggers converting and resizing images before upload",
      "Anyone handling confidential documents that must not leave the device",
    ],
    web: [
      "SEO specialists preparing metadata and previewing snippets",
      "Content editors counting words and estimating reading time",
      "Developers generating safe strings, hashes and identifiers",
    ],
    calc: [
      "Planners running quick date, unit and percentage checks",
      "Front-end developers converting between CSS units",
      "Shoppers and finance users comparing discounts and totals",
    ],
  };

  return byCategory[tool.category] ?? [`Everyday tasks involving ${tool.name.toLowerCase()}`];
}
