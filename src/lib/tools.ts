import { legacyTools } from "./legacy-tools";

export type CategoryId = "ai" | "dev" | "media" | "web" | "calc";

export interface ToolCategory {
  id: CategoryId;
  name: string;
  /** Short label used by the mobile pill navigation. */
  shortName: string;
  tagline: string;
  icon: string;
  emoji: string;
}

export interface ToolMeta {
  slug: string;
  name: string;
  category: CategoryId;
  short: string;
  description: string;
  keywords: string[];
  /** Tools that show a stylish processing state (heavy client-side work). */
  heavy?: boolean;
  popular?: boolean;
}

export const categories: ToolCategory[] = [
  {
    id: "ai",
    name: "AI & Smart Utilities",
    shortName: "AI",
    tagline: "Prompt craft, humanizing, refactoring and social copy",
    icon: "Sparkles",
    emoji: "✨",
  },
  {
    id: "dev",
    name: "Developer & Data",
    shortName: "Dev",
    tagline: "JSON, JWT, SQL, regex, Base64 and minifiers",
    icon: "Braces",
    emoji: "🧑‍💻",
  },
  {
    id: "media",
    name: "Image & Media",
    shortName: "Media",
    tagline: "Compress, resize, convert and edit fully in-browser",
    icon: "Image",
    emoji: "🖼️",
  },
  {
    id: "web",
    name: "Web & Text Utilities",
    shortName: "Web",
    tagline: "Markdown, meta tags, hashes, counters and text tools",
    icon: "Globe",
    emoji: "🌐",
  },
  {
    id: "calc",
    name: "Calculators & Converters",
    shortName: "Calc",
    tagline: "Dates, units, finance, percentages and CSS units",
    icon: "Calculator",
    emoji: "🧮",
  },
];


const baseTools: ToolMeta[] = [
  {
    slug: "ai-prompt-enhancer",
    name: "AI Prompt Enhancer",
    category: "ai",
    short: "Turn a rough idea into a structured, model-ready prompt.",
    description:
      "Expand raw text into detailed, structured prompts tuned for Midjourney, ChatGPT or Lovable — with role, constraints, style and output format blocks generated automatically.",
    keywords: ["prompt engineering", "midjourney prompt", "chatgpt prompt generator"],
    popular: true,
  },
  {
    slug: "ai-text-humanizer",
    name: "AI Text Detector & Humanizer",
    category: "ai",
    short: "Score AI-sounding text and rewrite it to read naturally.",
    description:
      "Analyse text for AI writing signals — burstiness, sentence uniformity and filler phrases — then apply a humanizing formatter that varies rhythm and removes robotic connectors.",
    keywords: ["ai detector", "humanize ai text", "ai content checker"],
    heavy: true,
    popular: true,
  },
  {
    slug: "social-bio-generator",
    name: "Social Bio & Caption Generator",
    category: "ai",
    short: "Platform-perfect bios and captions with hashtags.",
    description:
      "Generate bios and captions sized for Instagram, X, LinkedIn, TikTok and YouTube, complete with tone control, emoji density and smart hashtag suggestions.",
    keywords: ["instagram bio generator", "caption generator", "linkedin headline"],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter & TS Schema",
    category: "dev",
    short: "Format, validate and turn JSON into TypeScript types.",
    description:
      "Pretty-print or minify JSON, catch syntax errors with line context, and instantly generate TypeScript interfaces from any payload.",
    keywords: ["json formatter", "json validator", "json to typescript"],
    popular: true,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder & Debugger",
    category: "dev",
    short: "Decode headers, claims and spot security issues.",
    description:
      "Decode JWT header and payload locally, inspect expiry and issued-at times, and get security warnings for alg:none, long-lived tokens and missing claims.",
    keywords: ["jwt decoder", "jwt debugger", "token inspector"],
    popular: true,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter & Minifier",
    category: "dev",
    short: "Readable SQL in one click, or compact it back down.",
    description:
      "Format SQL queries with keyword casing and clause indentation, or minify them into a single line for logs and code embedding.",
    keywords: ["sql formatter", "sql beautifier", "sql minifier"],
  },
  {
    slug: "regex-diff",
    name: "Regex Tester & Diff Checker",
    category: "dev",
    short: "Live regex matching plus a side-by-side text diff.",
    description:
      "Test regular expressions with live highlighting, capture group inspection and flag toggles — then switch to diff mode to compare two blocks of text line by line.",
    keywords: ["regex tester", "diff checker", "text compare"],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    category: "media",
    short: "Compress to WebP, JPG or PNG without leaving your browser.",
    description:
      "Drop images in and compress them client-side with quality and max-width control. Convert between WebP, JPEG and PNG and see exact byte savings.",
    keywords: ["image compressor", "webp converter", "compress jpg"],
    heavy: true,
    popular: true,
  },
  {
    slug: "svg-to-png",
    name: "SVG to PNG Converter",
    category: "media",
    short: "Rasterize SVG markup at any scale.",
    description:
      "Paste or upload SVG markup, preview it live and export a crisp PNG at 1x to 8x scale with optional transparent background.",
    keywords: ["svg to png", "svg converter", "rasterize svg"],
    heavy: true,
  },
  {
    slug: "pdf-toolkit",
    name: "PDF Split, Merge & Protect",
    category: "media",
    short: "Merge, split and lock PDFs entirely on-device.",
    description:
      "Merge multiple PDFs, extract page ranges into a new document, or add owner protection — all processed locally so files never leave your machine.",
    keywords: ["merge pdf", "split pdf", "protect pdf"],
    heavy: true,
    popular: true,
  },
  {
    slug: "markdown-editor",
    name: "Markdown Live Editor",
    category: "web",
    short: "Write markdown with instant rendered preview.",
    description:
      "A split-pane markdown editor with real-time preview, live word counts and one-click HTML export.",
    keywords: ["markdown editor", "markdown preview", "md to html"],
    popular: true,
  },
  {
    slug: "meta-tag-generator",
    name: "OpenGraph & Twitter Card Generator",
    category: "web",
    short: "Ship perfect social previews with copy-paste tags.",
    description:
      "Fill in a few fields to generate OpenGraph, Twitter Card and canonical meta tags, with a live preview of how the link will look when shared.",
    keywords: ["opengraph generator", "twitter card", "meta tags"],
  },
  {
    slug: "password-hash-generator",
    name: "Password & Hash Generator",
    category: "web",
    short: "Strong passwords plus MD5 / SHA hashing.",
    description:
      "Generate cryptographically random passwords with strength scoring, and hash any text to MD5, SHA-1, SHA-256 or SHA-512 using the Web Crypto API.",
    keywords: ["password generator", "sha256 hash", "md5 generator"],
  },
  {
    slug: "word-counter",
    name: "Word, Character & Read Time",
    category: "web",
    short: "Counts, densities and reading time at a glance.",
    description:
      "Count words, characters, sentences and paragraphs, estimate reading and speaking time, and see top keyword density for SEO drafts.",
    keywords: ["word counter", "character counter", "reading time"],
    popular: true,
  },
  {
    slug: "code-to-image",
    name: "Code Snippet to Image",
    category: "dev",
    short: "Turn code into a shareable, syntax-highlighted PNG.",
    description:
      "Paste any snippet and export a beautiful dark-mode code image with a gradient backdrop, window chrome, line numbers and syntax highlighting — rendered on canvas in your browser and downloadable as PNG.",
    keywords: ["code to image", "carbon alternative", "code screenshot generator"],
    popular: true,
  },
  {
    slug: "cron-explainer",
    name: "Cron Expression Explainer",
    category: "dev",
    short: "Decode cron syntax and preview the next five runs.",
    description:
      "Translate any 5-field cron expression into plain English, inspect each field, and see exactly when the job fires next — with one-click presets for the most common schedules.",
    keywords: ["cron parser", "crontab explained", "cron next run"],
  },
  {
    slug: "gradient-glass-generator",
    name: "CSS Gradient & Glassmorphism",
    category: "web",
    short: "Design gradients and frosted-glass cards, copy the CSS.",
    description:
      "Interactive sliders for angle, colour stops, blur, saturation, opacity and radius with a live preview — copy production-ready linear-gradient and backdrop-filter CSS instantly.",
    keywords: ["css gradient generator", "glassmorphism generator", "backdrop filter css"],
    popular: true,
  },
  {
    slug: "ai-prompt-formatter",
    name: "AI Prompt Formatter",
    category: "ai",
    short: "Refine a rough idea into a structured ChatGPT, Claude or Midjourney prompt.",
    description:
      "Choose your target model and ToolForge restructures your idea into the format that model responds best to — Markdown sections for ChatGPT, XML tags for Claude, and parameterised image syntax for Midjourney.",
    keywords: ["prompt formatter", "claude xml prompt", "midjourney prompt builder"],
    popular: true,
  },
  {
    slug: "text-to-speech",
    name: "Text to Speech Reader",
    category: "web",
    short: "Listen to any text with adjustable voice, speed and pitch.",
    description:
      "Paste an article, script or study notes and have your device read it aloud using the built-in speech engine — pick a voice, tune rate and pitch, no uploads and no account.",
    keywords: ["text to speech", "read aloud tool", "tts online free"],
  },
];

export const tools: ToolMeta[] = [...baseTools, ...legacyTools];

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);

export const categoryById = (id: CategoryId) => categories.find((c) => c.id === id)!;

export function searchTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((t) =>
    [t.name, t.short, t.description, t.category, ...t.keywords]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function relatedTools(slug: string, limit = 6): ToolMeta[] {
  const tool = toolBySlug(slug);
  if (!tool) return tools.slice(0, limit);
  const sameCat = tools.filter((t) => t.category === tool.category && t.slug !== slug);
  const rest = tools.filter((t) => t.category !== tool.category);
  return [...sameCat, ...rest].slice(0, limit);
}
