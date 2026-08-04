import { useEffect, useMemo, useState } from "react";
import { Copy, RefreshCw, Hash } from "lucide-react";
import { ActionButton, Panel, TextArea, TextField } from "@/components/ToolKit";
import { copyText } from "./ai";
import { md5, webHash } from "@/lib/hash";

/* ----------------------------- Markdown Live Editor --------------------------- */

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function renderMarkdown(md: string) {
  const blocks = escapeHtml(md).split(/\n{2,}/);
  return blocks
    .map((block) => {
      const b = block.trim();
      if (!b) return "";
      if (/^```/.test(b))
        return `<pre class="rounded-xl bg-surface-2 p-3 overflow-auto"><code>${b.replace(/^```\w*\n?|```$/g, "")}</code></pre>`;
      const heading = b.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        const level = heading[1]!.length;
        const sizes = ["text-3xl", "text-2xl", "text-xl", "text-lg", "text-base", "text-sm"];
        return `<h${level} class="${sizes[level - 1]} font-bold mt-4 mb-2">${inline(heading[2]!)}</h${level}>`;
      }
      if (/^>\s/.test(b))
        return `<blockquote class="border-l-2 border-primary pl-3 italic text-muted-foreground">${inline(b.replace(/^>\s?/gm, ""))}</blockquote>`;
      if (/^([-*+])\s/m.test(b))
        return `<ul class="list-disc pl-5 space-y-1">${b
          .split("\n")
          .map((l) => `<li>${inline(l.replace(/^([-*+])\s/, ""))}</li>`)
          .join("")}</ul>`;
      if (/^\d+\.\s/m.test(b))
        return `<ol class="list-decimal pl-5 space-y-1">${b
          .split("\n")
          .map((l) => `<li>${inline(l.replace(/^\d+\.\s/, ""))}</li>`)
          .join("")}</ol>`;
      if (/^(-{3,}|\*{3,})$/.test(b)) return `<hr class="my-4 border-border" />`;
      return `<p class="leading-relaxed">${inline(b.replace(/\n/g, "<br/>"))}</p>`;
    })
    .join("\n");
}

function inline(s: string) {
  return s
    .replace(/`([^`]+)`/g, '<code class="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.85em]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|\W)\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl" loading="lazy" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>');
}

const SAMPLE_MD = `# ToolForge

Write **markdown** on the left, see it *rendered* instantly on the right.

- 100% client-side
- No signup
- Export to HTML

> Privacy-first by design.`;

export function MarkdownEditor() {
  const [md, setMd] = useState(SAMPLE_MD);
  const html = useMemo(() => renderMarkdown(md), [md]);
  const words = md.trim() ? md.trim().split(/\s+/).length : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title={`Markdown · ${words} words`}>
        <TextArea
          rows={20}
          value={md}
          onChange={(e) => setMd(e.target.value)}
          aria-label="Markdown source"
          spellCheck={false}
        />
      </Panel>
      <Panel
        title="Live preview"
        actions={
          <ActionButton variant="ghost" onClick={() => copyText(html)}>
            <Copy className="size-4" aria-hidden="true" /> Copy HTML
          </ActionButton>
        }
      >
        <div
          className="min-h-[420px] space-y-3 rounded-xl border border-glass-border bg-surface p-4 text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Panel>
    </div>
  );
}

/* ---------------------------- Meta Tag Generator ------------------------------ */

export function MetaTagGenerator() {
  const [title, setTitle] = useState("ToolForge — 14 free browser tools");
  const [description, setDescription] = useState(
    "Fast, private, client-side utilities for developers, creators and marketers.",
  );
  const [url, setUrl] = useState("https://example.com");
  const [image, setImage] = useState("https://example.com/og.jpg");
  const [site, setSite] = useState("@toolforge");

  const tags = `<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />

<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="${site}" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${image}" />`;

  const fields: Array<[string, string, (v: string) => void]> = [
    ["Page title", title, setTitle],
    ["Description", description, setDescription],
    ["Canonical URL", url, setUrl],
    ["Image URL", image, setImage],
    ["Twitter handle", site, setSite],
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Page details">
        <div className="space-y-3">
          {fields.map(([labelText, value, set]) => (
            <label
              key={labelText}
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {labelText}
              <TextField
                value={value}
                onChange={(e) => set(e.target.value)}
                className="mt-1.5 font-normal normal-case tracking-normal"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-glass-border bg-surface p-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Share preview
          </p>
          <div className="overflow-hidden rounded-xl border border-glass-border">
            <div className="aspect-[1.91/1] bg-surface-2">
              {image && (
                <img
                  src={image}
                  alt=""
                  className="size-full object-cover"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-xs uppercase text-muted-foreground">
                {url.replace(/^https?:\/\//, "")}
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold">{title}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
      </Panel>

      <Panel
        title="Meta tags"
        actions={
          <ActionButton variant="ghost" onClick={() => copyText(tags)}>
            <Copy className="size-4" aria-hidden="true" /> Copy
          </ActionButton>
        }
      >
        <pre className="min-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl border border-glass-border bg-surface p-3 font-mono text-xs leading-relaxed">
          {tags}
        </pre>
      </Panel>
    </div>
  );
}

/* ------------------------- Password & Hash Generator -------------------------- */

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};

export function PasswordHashGenerator() {
  const [length, setLength] = useState(20);
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [password, setPassword] = useState("");
  const [text, setText] = useState("hello world");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generate = () => {
    const pool = (Object.keys(SETS) as Array<keyof typeof SETS>)
      .filter((k) => opts[k])
      .map((k) => SETS[k])
      .join("");
    if (!pool) return;
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    setPassword(Array.from(bytes, (b) => pool[b % pool.length]).join(""));
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, string> = { MD5: md5(text) };
      for (const algo of ["SHA-1", "SHA-256", "SHA-512"] as const) {
        next[algo] = await webHash(algo, text);
      }
      if (!cancelled) setHashes(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [text]);

  const entropy = Math.round(
    length *
      Math.log2(
        (Object.keys(SETS) as Array<keyof typeof SETS>)
          .filter((k) => opts[k])
          .reduce((a, k) => a + SETS[k].length, 0) || 1,
      ),
  );
  const strength = entropy > 110 ? "Excellent" : entropy > 80 ? "Strong" : entropy > 55 ? "Fair" : "Weak";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        title="Password generator"
        actions={
          password && (
            <ActionButton variant="ghost" onClick={() => copyText(password)}>
              <Copy className="size-4" aria-hidden="true" /> Copy
            </ActionButton>
          )
        }
      >
        <output className="block break-all rounded-xl border border-glass-border bg-surface p-4 font-mono text-lg">
          {password}
        </output>
        <p className="mt-2 text-sm text-muted-foreground">
          ~{entropy} bits of entropy · <span className="font-semibold text-primary">{strength}</span>
        </p>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Length: {length}
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-2 w-full accent-primary"
            aria-label="Password length"
          />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(Object.keys(SETS) as Array<keyof typeof SETS>).map((k) => (
            <label key={k} className="flex min-h-11 items-center gap-2 text-sm capitalize">
              <input
                type="checkbox"
                checked={opts[k]}
                onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })}
                className="size-4 accent-primary"
              />
              {k}
            </label>
          ))}
        </div>
        <div className="mt-4">
          <ActionButton onClick={generate}>
            <RefreshCw className="size-4" aria-hidden="true" /> Generate new
          </ActionButton>
        </div>
      </Panel>

      <Panel title="Hash generator">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Text to hash
          <TextArea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1.5 normal-case tracking-normal"
            aria-label="Text to hash"
          />
        </label>
        <ul className="mt-4 space-y-2">
          {Object.entries(hashes).map(([algo, value]) => (
            <li
              key={algo}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-glass-border bg-surface p-3"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Hash className="size-3" aria-hidden="true" />
                  {algo}
                </p>
                <p className="break-all font-mono text-xs">{value}</p>
              </div>
              <button
                type="button"
                onClick={() => copyText(value)}
                aria-label={`Copy ${algo} hash`}
                className="grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground hover:text-primary"
              >
                <Copy className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/* --------------------------------- Word Counter ------------------------------- */

const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with", "is", "are",
  "was", "were", "it", "that", "this", "as", "at", "by", "be", "from",
]);

export function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/) : [];
    const sentences = trimmed ? trimmed.split(/[.!?]+\s|[.!?]+$/).filter(Boolean).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter((p) => p.trim()).length : 0;
    const freq = new Map<string, number>();
    words
      .map((w) => w.toLowerCase().replace(/[^a-z0-9'-]/g, ""))
      .filter((w) => w.length > 2 && !STOP.has(w))
      .forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1));
    const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    return {
      words: words.length,
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, "").length,
      sentences,
      paragraphs,
      readMin: Math.max(1, Math.round(words.length / 225)),
      speakMin: Math.max(1, Math.round(words.length / 130)),
      top,
    };
  }, [text]);

  const cards: Array<[string, string | number]> = [
    ["Words", stats.words],
    ["Characters", stats.chars],
    ["No spaces", stats.charsNoSpace],
    ["Sentences", stats.sentences],
    ["Paragraphs", stats.paragraphs],
    ["Read time", `${stats.readMin} min`],
    ["Speak time", `${stats.speakMin} min`],
    ["Avg word len", stats.words ? (stats.charsNoSpace / stats.words).toFixed(1) : 0],
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Panel title="Your text">
        <TextArea
          rows={18}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type to see live counts…"
          aria-label="Text to count"
          className="font-sans"
        />
      </Panel>
      <div className="space-y-4">
        <Panel title="Statistics">
          <dl className="grid grid-cols-2 gap-2">
            {cards.map(([k, v]) => (
              <div key={k} className="rounded-xl border border-glass-border bg-surface p-3">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="font-display text-lg font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel title="Keyword density">
          {stats.top.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add text to see top keywords.</p>
          ) : (
            <ul className="space-y-2">
              {stats.top.map(([word, count]) => (
                <li key={word} className="text-sm">
                  <div className="mb-1 flex justify-between">
                    <span className="truncate font-medium">{word}</span>
                    <span className="text-muted-foreground">
                      {count} · {((count / stats.words) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, (count / (stats.top[0]?.[1] ?? 1)) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
