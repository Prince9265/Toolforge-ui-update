import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CopyButton,
  DownloadButton,
  Panel,
  ResetButton,
  Stat,
  TextField,
} from "@/components/tool-ui";

const SAMPLE = "";

/* ---------------------------------- Markdown ---------------------------------- */

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function markdownToHtml(md: string): string {
  const lines = escapeHtml(md).split("\n");
  const out: string[] = [];
  let inCode = false;
  let listType: "ul" | "ol" | null = null;

  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };

  const inline = (text: string) =>
    text
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|\W)\*([^*]+)\*/g, "$1<em>$2</em>")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^```/.test(line)) {
      closeList();
      out.push(inCode ? "</code></pre>" : "<pre><code>");
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      out.push(line);
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      closeList();
      const level = heading[1]!.length;
      out.push(`<h${level}>${inline(heading[2]!)}</h${level}>`);
      continue;
    }
    if (/^>\s?/.test(line)) {
      closeList();
      out.push(`<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`);
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line)) {
      closeList();
      out.push("<hr />");
      continue;
    }
    const ul = /^[-*+]\s+(.*)$/.exec(line);
    if (ul) {
      if (listType !== "ul") {
        closeList();
        out.push("<ul>");
        listType = "ul";
      }
      out.push(`<li>${inline(ul[1]!)}</li>`);
      continue;
    }
    const ol = /^\d+\.\s+(.*)$/.exec(line);
    if (ol) {
      if (listType !== "ol") {
        closeList();
        out.push("<ol>");
        listType = "ol";
      }
      out.push(`<li>${inline(ol[1]!)}</li>`);
      continue;
    }
    if (!line.trim()) {
      closeList();
      continue;
    }
    closeList();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  if (inCode) out.push("</code></pre>");
  return out.join("\n");
}

export function MarkdownEditor() {
  const [md, setMd] = useState(
    "# ToolForge\n\nWrite **markdown** on the left, see it rendered on the right.\n\n- 100% client-side\n- Instant preview\n- Copy or download the HTML\n\n> No uploads, ever.\n",
  );
  const html = useMemo(() => markdownToHtml(md), [md]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel
        title="Markdown"
        actions={
          <>
            <CopyButton value={md} />
            <ResetButton onReset={() => setMd(SAMPLE)} label="Clear" />
          </>
        }
      >
        <TextField label="Source" value={md} onChange={setMd} rows={20} />
      </Panel>
      <Panel
        title="Preview"
        actions={
          <>
            <CopyButton value={html} label="Copy HTML" />
            <DownloadButton value={html} filename="document.html" mime="text/html" />
          </>
        }
      >
        <div
          className="prose-toolforge min-h-[26rem] overflow-auto rounded-lg bg-background/60 p-4 text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:font-semibold [&_hr]:my-4 [&_img]:max-w-full [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:my-2 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Panel>
    </div>
  );
}

/* ------------------------------- Case converter ------------------------------- */

const words = (input: string) =>
  input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean);

export const caseTransforms: Record<string, (input: string) => string> = {
  UPPERCASE: (s) => s.toUpperCase(),
  lowercase: (s) => s.toLowerCase(),
  "Title Case": (s) => s.replace(/\w\S*/g, (w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase()),
  "Sentence case": (s) =>
    s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
  camelCase: (s) =>
    words(s)
      .map((w, i) =>
        i === 0 ? w.toLowerCase() : w[0]!.toUpperCase() + w.slice(1).toLowerCase(),
      )
      .join(""),
  PascalCase: (s) =>
    words(s)
      .map((w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase())
      .join(""),
  snake_case: (s) => words(s).map((w) => w.toLowerCase()).join("_"),
  "kebab-case": (s) => words(s).map((w) => w.toLowerCase()).join("-"),
};

export function CaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<keyof typeof caseTransforms>("Title Case");
  const output = text ? caseTransforms[mode]!(text) : "";

  return (
    <div className="space-y-4">
      <Panel title="Input" actions={<ResetButton onReset={() => setText("")} label="Clear" />}>
        <TextField label="Text" value={text} onChange={setText} rows={8} mono={false} />
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.keys(caseTransforms).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={mode === key ? "default" : "outline"}
              onClick={() => setMode(key)}
            >
              {key}
            </Button>
          ))}
        </div>
      </Panel>
      <Panel
        title={`Output · ${mode}`}
        actions={
          <>
            <CopyButton value={output} />
            <DownloadButton value={output} filename="converted.txt" />
          </>
        }
      >
        <TextField label="Result" value={output} rows={8} readOnly mono={false} />
      </Panel>
    </div>
  );
}

/* -------------------------------- Word counter -------------------------------- */

export function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const wordList = trimmed ? trimmed.split(/\s+/) : [];
    const sentences = trimmed ? trimmed.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim()) : [];
    const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter((p) => p.trim()) : [];
    return {
      words: wordList.length,
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, "").length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      lines: text ? text.split("\n").length : 0,
      readingTime: Math.max(wordList.length ? 1 : 0, Math.round(wordList.length / 225)),
    };
  }, [text]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.characters} />
        <Stat label="No spaces" value={stats.charactersNoSpaces} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Lines" value={stats.lines} />
        <Stat label="Reading time" value={`${stats.readingTime} min`} />
        <Stat
          label="Avg word length"
          value={stats.words ? (stats.charactersNoSpaces / stats.words).toFixed(1) : "0"}
        />
      </div>
      <Panel
        title="Your text"
        actions={
          <>
            <CopyButton value={text} />
            <ResetButton onReset={() => setText("")} label="Clear" />
          </>
        }
      >
        <TextField
          label="Paste or type"
          value={text}
          onChange={setText}
          rows={14}
          mono={false}
          placeholder="Start typing to see live statistics…"
        />
      </Panel>
    </div>
  );
}

/* --------------------------- Duplicate line remover --------------------------- */

export function DuplicateLineRemover() {
  const [text, setText] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [trim, setTrim] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [sort, setSort] = useState(false);

  const { output, removed } = useMemo(() => {
    let lines = text.split("\n");
    if (trim) lines = lines.map((l) => l.trim());
    if (removeEmpty) lines = lines.filter((l) => l.length > 0);
    const seen = new Set<string>();
    const unique = lines.filter((line) => {
      const key = caseInsensitive ? line.toLowerCase() : line;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (sort) unique.sort((a, b) => a.localeCompare(b));
    return { output: unique.join("\n"), removed: lines.length - unique.length };
  }, [text, caseInsensitive, trim, removeEmpty, sort]);

  const toggles: [string, boolean, (v: boolean) => void][] = [
    ["Case insensitive", caseInsensitive, setCaseInsensitive],
    ["Trim whitespace", trim, setTrim],
    ["Remove empty lines", removeEmpty, setRemoveEmpty],
    ["Sort A→Z", sort, setSort],
  ];

  return (
    <div className="space-y-4">
      <Panel title="Options">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toggles.map(([label, value, set]) => (
            <div key={label} className="flex items-center gap-3">
              <Switch id={label} checked={value} onCheckedChange={set} />
              <Label htmlFor={label}>{label}</Label>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Input" actions={<ResetButton onReset={() => setText("")} label="Clear" />}>
          <TextField label="Lines" value={text} onChange={setText} rows={16} />
        </Panel>
        <Panel
          title={`Output · ${removed} duplicate${removed === 1 ? "" : "s"} removed`}
          actions={
            <>
              <CopyButton value={output} />
              <DownloadButton value={output} filename="unique-lines.txt" />
            </>
          }
        >
          <TextField label="Unique lines" value={output} rows={16} readOnly />
        </Panel>
      </div>
    </div>
  );
}

/* ----------------------------------- Diff ------------------------------------ */

type DiffRow = { type: "same" | "added" | "removed"; text: string };

export function diffLines(a: string, b: string): DiffRow[] {
  const left = a.split("\n");
  const right = b.split("\n");
  const m = left.length;
  const n = right.length;
  const lcs: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      lcs[i]![j] =
        left[i] === right[j]
          ? lcs[i + 1]![j + 1]! + 1
          : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!);
    }
  }
  const rows: DiffRow[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (left[i] === right[j]) {
      rows.push({ type: "same", text: left[i]! });
      i++;
      j++;
    } else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) {
      rows.push({ type: "removed", text: left[i++]! });
    } else {
      rows.push({ type: "added", text: right[j++]! });
    }
  }
  while (i < m) rows.push({ type: "removed", text: left[i++]! });
  while (j < n) rows.push({ type: "added", text: right[j++]! });
  return rows;
}

export function TextDiff() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const rows = useMemo(() => diffLines(left, right), [left, right]);
  const added = rows.filter((r) => r.type === "added").length;
  const removed = rows.filter((r) => r.type === "removed").length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Original" actions={<ResetButton onReset={() => setLeft("")} label="Clear" />}>
          <TextField label="Version A" value={left} onChange={setLeft} rows={12} />
        </Panel>
        <Panel title="Changed" actions={<ResetButton onReset={() => setRight("")} label="Clear" />}>
          <TextField label="Version B" value={right} onChange={setRight} rows={12} />
        </Panel>
      </div>
      <Panel title={`Differences · +${added} / −${removed}`}>
        <div className="max-h-[28rem] overflow-auto rounded-lg bg-background/60 p-3 font-mono text-[13px]">
          {rows.length === 0 && <p className="text-muted-foreground">Paste text to compare.</p>}
          {rows.map((row, index) => (
            <div
              key={index}
              className={
                row.type === "added"
                  ? "whitespace-pre-wrap bg-primary/10 px-2 text-foreground"
                  : row.type === "removed"
                    ? "whitespace-pre-wrap bg-destructive/10 px-2 text-foreground line-through"
                    : "whitespace-pre-wrap px-2 text-muted-foreground"
              }
            >
              {row.type === "added" ? "+ " : row.type === "removed" ? "− " : "  "}
              {row.text || " "}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------- Lorem ipsum -------------------------------- */

const LOREM = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum`.split(
  " ",
);

export function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");

  const output = useMemo(() => {
    const pick = (n: number, offset: number) =>
      Array.from({ length: n }, (_, i) => LOREM[(i + offset) % LOREM.length]!).join(" ");
    const sentence = (i: number) => {
      const s = pick(8 + (i % 9), i * 7);
      return s[0]!.toUpperCase() + s.slice(1) + ".";
    };
    if (unit === "words") return pick(count, 0);
    if (unit === "sentences") return Array.from({ length: count }, (_, i) => sentence(i)).join(" ");
    return Array.from({ length: count }, (_, p) =>
      Array.from({ length: 4 }, (_, s) => sentence(p * 4 + s)).join(" "),
    ).join("\n\n");
  }, [count, unit]);

  return (
    <div className="space-y-4">
      <Panel title="Options">
        <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="lorem-count">Amount</Label>
            <Input
              id="lorem-count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["paragraphs", "sentences", "words"] as const).map((u) => (
              <Button
                key={u}
                size="sm"
                variant={unit === u ? "default" : "outline"}
                onClick={() => setUnit(u)}
              >
                {u}
              </Button>
            ))}
          </div>
        </div>
      </Panel>
      <Panel
        title="Generated text"
        actions={
          <>
            <CopyButton value={output} />
            <DownloadButton value={output} filename="lorem.txt" />
          </>
        }
      >
        <TextField label="Output" value={output} rows={14} readOnly mono={false} />
      </Panel>
    </div>
  );
}