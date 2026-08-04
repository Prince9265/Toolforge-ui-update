import { useState } from "react";
import { toast } from "sonner";
import { Copy, Wand2, Sparkles, RefreshCw } from "lucide-react";
import { ActionButton, Panel, ProcessingOverlay, TextArea, TextField } from "@/components/ToolKit";
import { useProcessing } from "@/lib/storage";

export function copyText(value: string) {
  navigator.clipboard.writeText(value).then(
    () => toast.success("Copied to clipboard"),
    () => toast.error("Clipboard unavailable"),
  );
}

/* ------------------------------- Prompt Enhancer ------------------------------ */

const TARGETS = ["ChatGPT", "Midjourney", "Lovable"] as const;
type Target = (typeof TARGETS)[number];

function buildPrompt(raw: string, target: Target, tone: string, detail: number) {
  const idea = raw.trim() || "your idea";
  if (target === "Midjourney") {
    const detailWords = ["simple", "detailed", "hyper-detailed"][Math.min(detail - 1, 2)];
    return `${idea}, ${tone.toLowerCase()} mood, ${detailWords} rendering, cinematic lighting, volumetric depth, 35mm lens, rich color grading, sharp focus --ar 16:9 --style raw --q 2`;
  }
  if (target === "Lovable") {
    return `Build ${idea}.

Design direction: ${tone} aesthetic, semantic design tokens, responsive from mobile to ultrawide, WCAG AA contrast.
Structure: modular React + TypeScript components, no ad-hoc colors in className.
Must include: clear empty states, loading states, keyboard accessibility and aria-labels.
Do not: add authentication, external APIs, or placeholder lorem text.`;
  }
  return `# Role
You are an expert practitioner in the domain of: ${idea}.

# Task
${idea}

# Context
Tone: ${tone}. Depth level: ${detail}/3.

# Constraints
- Be concrete and specific; avoid filler and generic advice.
- Cite assumptions explicitly when information is missing.
- Prefer examples over abstract explanation.

# Output format
1. Short summary (2 sentences)
2. Step-by-step breakdown
3. Key risks or edge cases
4. A ready-to-use example`;
}

export function AiPromptEnhancer() {
  const [raw, setRaw] = useState("");
  const [target, setTarget] = useState<Target>("ChatGPT");
  const [tone, setTone] = useState("Professional");
  const [detail, setDetail] = useState(2);
  const [out, setOut] = useState("");
  const { busy, label, run } = useProcessing();

  const enhance = () =>
    run(() => setOut(buildPrompt(raw, target, tone, detail)), {
      label: "Forging prompt",
      minMs: 1500,
    });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Your rough idea">
        <TextArea
          rows={8}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="e.g. a landing page for a dog-walking startup"
          aria-label="Raw idea"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Target model
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as Target)}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-glass-border bg-surface px-3 text-sm font-normal normal-case tracking-normal text-foreground"
            >
              {TARGETS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tone
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-glass-border bg-surface px-3 text-sm font-normal normal-case tracking-normal text-foreground"
            >
              {["Professional", "Playful", "Cinematic", "Minimal", "Bold"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:col-span-2">
            Detail level: {detail}/3
            <input
              type="range"
              min={1}
              max={3}
              value={detail}
              onChange={(e) => setDetail(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
              aria-label="Detail level"
            />
          </label>
        </div>
        <div className="mt-4">
          <ActionButton onClick={enhance} disabled={!raw.trim() || busy}>
            <Wand2 className="size-4" aria-hidden="true" /> Enhance prompt
          </ActionButton>
        </div>
      </Panel>

      <Panel
        title="Model-ready prompt"
        actions={
          out && (
            <ActionButton variant="ghost" onClick={() => copyText(out)}>
              <Copy className="size-4" aria-hidden="true" /> Copy
            </ActionButton>
          )
        }
      >
        <ProcessingOverlay label={label} active={busy} />
        <pre className="min-h-[260px] whitespace-pre-wrap rounded-xl border border-glass-border bg-surface p-3 font-mono text-sm">
          {out || "Your enhanced prompt appears here."}
        </pre>
      </Panel>
    </div>
  );
}

/* --------------------------- AI Detector & Humanizer -------------------------- */

const ROBOTIC = [
  "furthermore", "moreover", "in conclusion", "it is important to note",
  "delve", "leverage", "seamless", "tapestry", "in today's world", "additionally",
];

function analyse(text: string) {
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1);
  const variance =
    lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / (lengths.length || 1);
  const burstiness = Math.sqrt(variance);
  const lower = text.toLowerCase();
  const hits = ROBOTIC.filter((p) => lower.includes(p));
  const uniformity = Math.max(0, 40 - burstiness * 4);
  const phraseScore = Math.min(40, hits.length * 12);
  const commaDensity = ((text.match(/,/g) ?? []).length / (sentences.length || 1)) * 6;
  const score = Math.round(Math.min(98, uniformity + phraseScore + commaDensity));
  return { score, burstiness: Math.round(burstiness * 10) / 10, hits, sentences: sentences.length };
}

function humanize(text: string) {
  let out = text;
  const swaps: Array<[RegExp, string]> = [
    [/\bfurthermore\b/gi, "also"],
    [/\bmoreover\b/gi, "and"],
    [/\bin conclusion\b/gi, "so"],
    [/\bit is important to note that\b/gi, "note that"],
    [/\bdelve into\b/gi, "dig into"],
    [/\bleverage\b/gi, "use"],
    [/\butilize\b/gi, "use"],
    [/\bseamless\b/gi, "smooth"],
    [/\bin today's world,?\s*/gi, ""],
    [/\badditionally,?\s*/gi, "Plus, "],
  ];
  swaps.forEach(([re, to]) => (out = out.replace(re, to)));
  return out
    .split(/(?<=[.!?])\s+/)
    .map((s, i) => (i % 3 === 2 && s.length > 90 ? s.replace(/,\s*/, ". ") : s))
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function AiTextHumanizer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReturnType<typeof analyse> | null>(null);
  const [humanized, setHumanized] = useState("");
  const { busy, label, run } = useProcessing();

  const check = () =>
    run(
      () => {
        setResult(analyse(text));
        setHumanized("");
      },
      { label: "Scanning writing signals" },
    );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Paste your text">
        <TextArea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an article, essay or email…"
          aria-label="Text to analyse"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton onClick={check} disabled={!text.trim() || busy}>
            <Sparkles className="size-4" aria-hidden="true" /> Analyse text
          </ActionButton>
          <ActionButton
            variant="ghost"
            onClick={() => setHumanized(humanize(text))}
            disabled={!text.trim()}
          >
            <RefreshCw className="size-4" aria-hidden="true" /> Humanize
          </ActionButton>
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel title="AI likelihood">
          <ProcessingOverlay label={label} active={busy} />
          {result ? (
            <div>
              <div className="flex items-end gap-3">
                <span className="font-display text-5xl font-black text-primary">
                  {result.score}%
                </span>
                <span className="pb-2 text-sm text-muted-foreground">
                  likely AI-generated patterns
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <div className="h-full bg-primary" style={{ width: `${result.score}%` }} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-glass-border bg-surface p-3">
                  <dt className="text-xs text-muted-foreground">Burstiness</dt>
                  <dd className="font-semibold">{result.burstiness}</dd>
                </div>
                <div className="rounded-xl border border-glass-border bg-surface p-3">
                  <dt className="text-xs text-muted-foreground">Sentences</dt>
                  <dd className="font-semibold">{result.sentences}</dd>
                </div>
              </dl>
              {result.hits.length > 0 && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Robotic phrases found: {result.hits.join(", ")}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Run an analysis to see burstiness, uniformity and phrase flags.
            </p>
          )}
        </Panel>

        <Panel
          title="Humanized output"
          actions={
            humanized && (
              <ActionButton variant="ghost" onClick={() => copyText(humanized)}>
                <Copy className="size-4" aria-hidden="true" /> Copy
              </ActionButton>
            )
          }
        >
          <p className="min-h-[120px] whitespace-pre-wrap rounded-xl border border-glass-border bg-surface p-3 text-sm leading-relaxed">
            {humanized || "Rewritten text appears here."}
          </p>
        </Panel>
      </div>
    </div>
  );
}

/* ---------------------------- Social Bio Generator ---------------------------- */

const PLATFORMS = {
  Instagram: 150,
  X: 160,
  LinkedIn: 220,
  TikTok: 80,
  YouTube: 1000,
} as const;

export function SocialBioGenerator() {
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [tone, setTone] = useState("Confident");
  const [platform, setPlatform] = useState<keyof typeof PLATFORMS>("Instagram");
  const [emoji, setEmoji] = useState(true);
  const [items, setItems] = useState<string[]>([]);

  const generate = () => {
    const t = topic.trim() || "creative work";
    const n = name.trim() || "Creator";
    const e = emoji ? ["✨", "🔥", "🚀", "🎯", "💡"] : ["", "", "", "", ""];
    const drafts = [
      `${e[0]} ${n} — helping people win at ${t}. ${tone} takes, zero fluff. New drops weekly.`,
      `${t} obsessive ${e[1]} Turning messy ideas into shipped work. Follow for playbooks, not platitudes.`,
      `Building in public around ${t} ${e[2]} ${tone.toLowerCase()} lessons, real numbers, honest failures.`,
      `${n} | ${t} ${e[3]} I make the complicated part simple. Free resources in the link below.`,
      `Daily ${t} insights ${e[4]} No hacks. No hype. Just what actually works.`,
    ];
    const limit = PLATFORMS[platform];
    setItems(drafts.map((d) => (d.length > limit ? `${d.slice(0, limit - 1).trim()}…` : d)));
  };

  const hashtags = topic
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((w) => `#${w.replace(/[^a-z0-9]/gi, "").toLowerCase()}`)
    .concat(["#creatoreconomy", "#buildinpublic"])
    .join(" ");

  return (
    <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
      <Panel title="Details">
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Name or handle
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="mt-1.5 font-normal normal-case tracking-normal"
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Topic or niche
            <TextField
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="product design"
              className="mt-1.5 font-normal normal-case tracking-normal"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Platform
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as keyof typeof PLATFORMS)}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-glass-border bg-surface px-3 text-sm font-normal normal-case tracking-normal text-foreground"
              >
                {Object.keys(PLATFORMS).map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tone
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-glass-border bg-surface px-3 text-sm font-normal normal-case tracking-normal text-foreground"
              >
                {["Confident", "Friendly", "Witty", "Expert"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={emoji}
              onChange={(e) => setEmoji(e.target.checked)}
              className="size-4 accent-primary"
            />
            Include emoji
          </label>
          <ActionButton onClick={generate}>
            <Sparkles className="size-4" aria-hidden="true" /> Generate 5 options
          </ActionButton>
        </div>
      </Panel>

      <Panel title={`${platform} bios · ${PLATFORMS[platform]} char limit`}>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Generate to see five ready-to-paste bios.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li
                key={i}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-glass-border bg-surface p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm leading-relaxed">{item}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.length} characters</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(item)}
                  aria-label={`Copy bio option ${i + 1}`}
                  className="grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground hover:text-primary"
                >
                  <Copy className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <p className="mt-4 rounded-xl border border-glass-border bg-surface p-3 text-sm">
            <span className="font-semibold">Hashtags:</span> {hashtags}
          </p>
        )}
      </Panel>
    </div>
  );
}
