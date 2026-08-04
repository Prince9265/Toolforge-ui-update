import {
  AlignLeft,
  ArrowLeftRight,
  Binary,
  Braces,
  CalendarClock,
  CaseUpper,
  Code2,
  Copy,
  Crop,
  Database,
  Diff,
  Droplet,
  FileImage,
  FileText,
  Files,
  Fingerprint,
  Hash,
  Image as ImageIcon,
  KeyRound,
  Link2,
  ListX,
  Minimize2,
  Percent,
  Regex,
  Ruler,
  Share2,
  Shrink,
  Type,
  type LucideIcon,
} from "lucide-react";

export type CategoryId = "text" | "developer" | "image" | "security" | "calculators" | "pdf";

export type Category = {
  id: CategoryId;
  name: string;
  tagline: string;
};

export type Tool = {
  slug: string;
  name: string;
  short: string;
  description: string;
  category: CategoryId;
  icon: LucideIcon;
  keywords: string[];
  heavy?: boolean;
};

export const categories: Category[] = [
  { id: "text", name: "Text & Writing", tagline: "Write, count, clean and compare text instantly." },
  { id: "developer", name: "Developer & Data", tagline: "Format, decode and debug the formats you live in." },
  { id: "image", name: "Image & Media", tagline: "Compress, resize and convert — never leaves your browser." },
  { id: "security", name: "Security & Web", tagline: "Hashes, passwords, URLs and share-ready metadata." },
  { id: "calculators", name: "Calculators & Units", tagline: "Everyday math, dates and design unit conversions." },
  { id: "pdf", name: "PDF Utilities", tagline: "Merge, split and build PDFs fully client-side." },
];

export const tools: Tool[] = [
  // Text
  {
    slug: "markdown-editor",
    name: "Markdown Live Editor",
    short: "Split-screen markdown editor with real-time preview.",
    description:
      "Write Markdown and see a rendered preview update as you type. Export the HTML or copy the source — everything runs locally in your browser.",
    category: "text",
    icon: FileText,
    keywords: ["markdown", "md", "preview", "editor", "html"],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    short: "Upper, lower, title, camel, snake, kebab and Pascal case.",
    description:
      "Convert any text between seven casing styles instantly, including camelCase, snake_case, kebab-case and PascalCase.",
    category: "text",
    icon: CaseUpper,
    keywords: ["case", "camel", "snake", "kebab", "pascal", "title case"],
  },
  {
    slug: "word-counter",
    name: "Word & Character Counter",
    short: "Words, characters, sentences, paragraphs, reading time.",
    description:
      "Live statistics for any text: word count, characters with and without spaces, sentences, paragraphs and estimated reading time.",
    category: "text",
    icon: AlignLeft,
    keywords: ["word count", "character count", "reading time", "sentences"],
  },
  {
    slug: "duplicate-line-remover",
    name: "Duplicate Line Remover",
    short: "Deduplicate, trim, sort and clean line-based lists.",
    description:
      "Remove duplicate lines from any list with optional case-insensitive matching, trimming, empty-line removal and sorting.",
    category: "text",
    icon: ListX,
    keywords: ["duplicate", "dedupe", "unique lines", "sort", "clean list"],
  },
  {
    slug: "text-diff",
    name: "Text Diff Checker",
    short: "Compare two texts line by line with highlights.",
    description:
      "Paste two versions of a text and see added, removed and unchanged lines highlighted side by side.",
    category: "text",
    icon: Diff,
    keywords: ["diff", "compare", "text difference", "changes"],
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    short: "Placeholder paragraphs, sentences and words.",
    description: "Generate classic lorem ipsum filler copy by paragraph, sentence or word count.",
    category: "text",
    icon: Type,
    keywords: ["lorem", "ipsum", "placeholder", "dummy text"],
  },

  // Developer
  {
    slug: "json-formatter",
    name: "JSON Formatter & TS Types",
    short: "Format, validate, minify and generate TypeScript types.",
    description:
      "Pretty-print or minify JSON, catch syntax errors with precise messages, and generate matching TypeScript interfaces in one click.",
    category: "developer",
    icon: Braces,
    keywords: ["json", "format", "validate", "minify", "typescript", "types"],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder & Inspector",
    short: "Decode header, payload and inspect claims.",
    description:
      "Decode any JSON Web Token locally, inspect header and payload claims, and check expiry and issued-at timestamps.",
    category: "developer",
    icon: KeyRound,
    keywords: ["jwt", "token", "decode", "claims", "auth"],
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter & SQL→JSON",
    short: "Beautify SQL and convert INSERT rows to JSON.",
    description:
      "Format messy SQL into readable, keyword-aligned queries and convert INSERT statements into JSON records.",
    category: "developer",
    icon: Database,
    keywords: ["sql", "format", "beautify", "json", "query"],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester & Cheat Sheet",
    short: "Live matches, groups and a built-in reference.",
    description:
      "Test regular expressions against sample text with live highlighting, capture groups and a searchable cheat sheet.",
    category: "developer",
    icon: Regex,
    keywords: ["regex", "regexp", "pattern", "match", "cheat sheet"],
  },
  {
    slug: "base64",
    name: "Base64 Encoder / Decoder",
    short: "Encode and decode text or files to Base64.",
    description:
      "Convert text or any uploaded file to a Base64 string and back, with UTF-8 safe handling and data URL output.",
    category: "developer",
    icon: Binary,
    keywords: ["base64", "encode", "decode", "data url", "file"],
  },
  {
    slug: "code-minifier",
    name: "HTML / CSS / JS Minifier",
    short: "Minify or beautify web code instantly.",
    description:
      "Strip comments and whitespace from HTML, CSS or JavaScript, or expand minified code back into readable formatting.",
    category: "developer",
    icon: Minimize2,
    keywords: ["minify", "unminify", "beautify", "html", "css", "javascript"],
  },

  // Image
  {
    slug: "image-compressor",
    name: "Image Compressor",
    short: "Compress to WebP, JPG or PNG with a quality slider.",
    description:
      "Compress images entirely in your browser using canvas encoding. Choose the output format and quality, then download the optimised file.",
    category: "image",
    icon: Shrink,
    keywords: ["compress", "optimise", "webp", "jpg", "png", "image size"],
    heavy: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer & Converter",
    short: "Resize, crop and convert image formats.",
    description:
      "Resize images by pixel dimensions or percentage, crop to a region, and export as PNG, JPG or WebP — all offline.",
    category: "image",
    icon: Crop,
    keywords: ["resize", "crop", "convert", "dimensions", "image"],
    heavy: true,
  },
  {
    slug: "svg-png-converter",
    name: "SVG ⇄ PNG Converter",
    short: "Rasterise SVG to PNG or embed PNG in SVG.",
    description:
      "Convert SVG markup into a high-resolution PNG at any scale, or wrap a raster image into an SVG container.",
    category: "image",
    icon: FileImage,
    keywords: ["svg", "png", "convert", "rasterize", "vector"],
    heavy: true,
  },
  {
    slug: "color-studio",
    name: "Color Picker & Palette Studio",
    short: "Pick colors, build palettes and CSS gradients.",
    description:
      "Pick any color, generate harmonious palettes with tints and shades, and build CSS gradients with copyable output.",
    category: "image",
    icon: Droplet,
    keywords: ["color", "palette", "gradient", "hex", "rgb", "hsl"],
  },

  // Security & web
  {
    slug: "password-generator",
    name: "Strong Password Generator",
    short: "Cryptographically random passwords with strength meter.",
    description:
      "Generate secure passwords using the Web Crypto API with configurable length, character sets and a live strength estimate.",
    category: "security",
    icon: Fingerprint,
    keywords: ["password", "random", "secure", "generator", "strength"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    short: "MD5, SHA-1, SHA-256 and SHA-512 digests.",
    description:
      "Hash any text locally with MD5, SHA-1, SHA-256 or SHA-512 and copy the hexadecimal digest.",
    category: "security",
    icon: Hash,
    keywords: ["hash", "md5", "sha1", "sha256", "sha512", "checksum"],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder & Query Parser",
    short: "Encode, decode and break down query strings.",
    description:
      "Percent-encode or decode URLs and split any URL into its parts with a readable query parameter table.",
    category: "security",
    icon: Link2,
    keywords: ["url", "encode", "decode", "query string", "parameters"],
  },
  {
    slug: "og-meta-builder",
    name: "OpenGraph & Twitter Card Builder",
    short: "Generate meta tags with a live card preview.",
    description:
      "Fill in your page details and get ready-to-paste OpenGraph and Twitter Card meta tags with a live social preview.",
    category: "security",
    icon: Share2,
    keywords: ["opengraph", "og", "twitter card", "meta tags", "seo"],
  },
  {
    slug: "uuid-generator",
    name: "UUID / GUID Batch Generator",
    short: "Generate v4 UUIDs in bulk.",
    description:
      "Create up to 500 cryptographically random UUID v4 values at once, with formatting options and one-click copy.",
    category: "security",
    icon: Copy,
    keywords: ["uuid", "guid", "v4", "identifier", "batch"],
  },

  // Calculators
  {
    slug: "age-calculator",
    name: "Age & Date Difference",
    short: "Exact age and the gap between any two dates.",
    description:
      "Work out an exact age in years, months and days, plus total weeks, days and hours between two dates.",
    category: "calculators",
    icon: CalendarClock,
    keywords: ["age", "date difference", "days between", "birthday"],
  },
  {
    slug: "aspect-ratio-rem",
    name: "Aspect Ratio & PX↔REM",
    short: "Scale dimensions and convert px to rem.",
    description:
      "Keep aspect ratios locked while resizing, and convert between pixels and rem for any root font size.",
    category: "calculators",
    icon: Ruler,
    keywords: ["aspect ratio", "px", "rem", "convert", "responsive"],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage & Discount",
    short: "Percent of, change, and discounted prices.",
    description:
      "Calculate percentages, percentage change between values, and final prices after a discount with tax.",
    category: "calculators",
    icon: Percent,
    keywords: ["percentage", "discount", "percent change", "sale price"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    short: "Length, weight, temperature and data units.",
    description: "Convert between common length, weight, temperature and digital storage units.",
    category: "calculators",
    icon: ArrowLeftRight,
    keywords: ["unit", "convert", "length", "weight", "temperature", "bytes"],
  },

  // PDF
  {
    slug: "pdf-merge",
    name: "PDF Merger",
    short: "Combine multiple PDFs into one file.",
    description:
      "Merge any number of PDF documents in your chosen order and download the result — files never leave your device.",
    category: "pdf",
    icon: Files,
    keywords: ["pdf", "merge", "combine", "join"],
    heavy: true,
  },
  {
    slug: "pdf-split",
    name: "PDF Splitter & Page Extractor",
    short: "Extract a page range into a new PDF.",
    description:
      "Pull a specific page range out of a PDF and save it as a new document, processed entirely in the browser.",
    category: "pdf",
    icon: Code2,
    keywords: ["pdf", "split", "extract pages", "range"],
    heavy: true,
  },
  {
    slug: "images-to-pdf",
    name: "Images to PDF",
    short: "Turn JPG and PNG images into a single PDF.",
    description:
      "Combine images into a paginated PDF document with automatic page sizing, fully offline.",
    category: "pdf",
    icon: ImageIcon,
    keywords: ["image to pdf", "jpg to pdf", "png to pdf", "convert"],
    heavy: true,
  },
];

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);

export const toolsByCategory = (id: CategoryId) => tools.filter((t) => t.category === id);

export const categoryById = (id: string) => categories.find((c) => c.id === id);

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((t) =>
    [t.name, t.short, t.category, ...t.keywords].join(" ").toLowerCase().includes(q),
  );
}

export function relatedTools(slug: string, count = 4): Tool[] {
  const tool = toolBySlug(slug);
  if (!tool) return tools.slice(0, count);
  const sameCategory = tools.filter((t) => t.category === tool.category && t.slug !== slug);
  const others = tools.filter((t) => t.category !== tool.category);
  return [...sameCategory, ...others].slice(0, count);
}