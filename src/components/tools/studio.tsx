import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Image as ImageIcon, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { ActionButton, CopyResultButton, Panel, TextArea, TextField } from "@/components/ToolKit";

/* ============================ Code Snippet to Image ============================ */

const CODE_THEMES = {
  midnight: {
    label: "Midnight",
    bg: "#0d1117",
    frame: ["#1f6feb", "#a371f7"],
    text: "#e6edf3",
    comment: "#8b949e",
    keyword: "#ff7b72",
    string: "#a5d6ff",
    number: "#79c0ff",
    fn: "#d2a8ff",
  },
  ember: {
    label: "Ember",
    bg: "#141210",
    frame: ["#f59e0b", "#ef4444"],
    text: "#f5f0e8",
    comment: "#948b7d",
    keyword: "#ffa657",
    string: "#a3e635",
    number: "#fbbf24",
    fn: "#fca5a5",
  },
  ocean: {
    label: "Ocean",
    bg: "#0b1622",
    frame: ["#22d3ee", "#3b82f6"],
    text: "#e2f3ff",
    comment: "#64798f",
    keyword: "#7dd3fc",
    string: "#5eead4",
    number: "#93c5fd",
    fn: "#c4b5fd",
  },
} as const;

type ThemeKey = keyof typeof CODE_THEMES;

const KEYWORDS =
  /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|class|new|await|async|try|catch|throw|typeof|interface|type|def|print|True|False|None|public|private|static|void|null|undefined|true|false)\b/;

type Token = { text: string; color: keyof (typeof CODE_THEMES)["midnight"] };

function tokenizeLine(line: string): Token[] {
  const out: Token[] = [];
  const commentIdx = line.search(/(\/\/|#\s)/);
  const code = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const comment = commentIdx >= 0 ? line.slice(commentIdx) : "";

  const re = /("[^"]*"|'[^']*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\s\w]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    const [raw, str, num, word] = m;
    if (str) out.push({ text: raw, color: "string" });
    else if (num) out.push({ text: raw, color: "number" });
    else if (word) {
      if (KEYWORDS.test(word)) out.push({ text: raw, color: "keyword" });
      else if (code[re.lastIndex] === "(") out.push({ text: raw, color: "fn" });
      else out.push({ text: raw, color: "text" });
    } else out.push({ text: raw, color: "text" });
  }
  if (comment) out.push({ text: comment, color: "comment" });
  return out;
}

const SAMPLE_CODE = `// ToolForge — everything runs in your browser
export async function forge(input: string) {
  const bytes = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}`;

export function CodeToImage() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [title, setTitle] = useState("forge.ts");
  const [themeKey, setThemeKey] = useState<ThemeKey>("midnight");
  const [padding, setPadding] = useState(48);
  const [fontSize, setFontSize] = useState(16);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = CODE_THEMES[themeKey];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const lines = (code || " ").split("\n");
    const font = `${fontSize}px ui-monospace, "JetBrains Mono", Menlo, monospace`;
    const lineHeight = Math.round(fontSize * 1.65);

    ctx.font = font;
    const gutter = fontSize * 2.6;
    const widest = lines.reduce((w, l) => Math.max(w, ctx.measureText(l).width), 0);
    const cardW = Math.max(360, Math.ceil(widest + gutter + fontSize * 3));
    const cardH = lines.length * lineHeight + fontSize * 5;
    const w = cardW + padding * 2;
    const h = cardH + padding * 2;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = "100%";
    canvas.style.aspectRatio = `${w} / ${h}`;
    ctx.scale(dpr, dpr);

    // gradient backdrop
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, theme.frame[0]);
    grad.addColorStop(1, theme.frame[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // card
    const r = 18;
    ctx.beginPath();
    ctx.roundRect(padding, padding, cardW, cardH, r);
    ctx.fillStyle = theme.bg;
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 18;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // window dots
    const dots = ["#ff5f57", "#febc2e", "#28c840"];
    dots.forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(padding + 26 + i * 20, padding + 26, 6, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();
    });

    ctx.font = `600 ${fontSize * 0.8}px ui-sans-serif, system-ui`;
    ctx.fillStyle = theme.comment;
    ctx.textAlign = "center";
    ctx.fillText(title, padding + cardW / 2, padding + 31);
    ctx.textAlign = "left";

    // code
    ctx.font = font;
    ctx.textBaseline = "top";
    lines.forEach((line, i) => {
      const y = padding + fontSize * 3.4 + i * lineHeight;
      ctx.fillStyle = theme.comment;
      ctx.fillText(String(i + 1).padStart(2, " "), padding + fontSize, y);
      let x = padding + gutter;
      tokenizeLine(line).forEach((tok) => {
        ctx.fillStyle = theme[tok.color] as string;
        ctx.fillText(tok.text, x, y);
        x += ctx.measureText(tok.text).width;
      });
    });
  }, [code, title, themeKey, padding, fontSize]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${title.replace(/\W+/g, "-") || "snippet"}.png`;
    a.click();
    toast.success("PNG downloaded");
  };

  const copyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("no blob"))), "image/png"),
      );
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("Image copied to clipboard");
    } catch {
      toast.error("Image copy unsupported — use Download instead");
    }
  };

  return (
    <div className="space-y-4">
      <Panel title="Code snippet">
        <TextArea
          rows={10}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-label="Code snippet"
          spellCheck={false}
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            File title
            <TextField value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            Theme
            <select
              value={themeKey}
              onChange={(e) => setThemeKey(e.target.value as ThemeKey)}
              className="min-h-11 w-full rounded-xl border border-glass-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              {Object.entries(CODE_THEMES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            Padding · {padding}px
            <input
              type="range"
              min={16}
              max={96}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </label>
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            Font size · {fontSize}px
            <input
              type="range"
              min={12}
              max={24}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </label>
        </div>
      </Panel>

      <Panel
        title="Preview"
        actions={
          <>
            <ActionButton variant="ghost" onClick={copyImage}>
              <ImageIcon className="size-4" aria-hidden="true" />
              Copy image
            </ActionButton>
            <ActionButton onClick={download}>
              <Download className="size-4" aria-hidden="true" />
              Download PNG
            </ActionButton>
          </>
        }
      >
        <canvas ref={canvasRef} className="w-full rounded-xl" aria-label="Code snippet image" />
      </Panel>
    </div>
  );
}

/* ==================== CSS Gradient & Glassmorphism Generator ==================== */

export function GradientGlassGenerator() {
  const [c1, setC1] = useState("#f59e0b");
  const [c2, setC2] = useState("#ef4444");
  const [c3, setC3] = useState("#22d3ee");
  const [useThird, setUseThird] = useState(true);
  const [angle, setAngle] = useState(135);
  const [blur, setBlur] = useState(14);
  const [opacity, setOpacity] = useState(18);
  const [saturation, setSaturation] = useState(140);
  const [radius, setRadius] = useState(20);
  const [borderOpacity, setBorderOpacity] = useState(35);

  const gradientCss = `background: linear-gradient(${angle}deg, ${c1}, ${c2}${useThird ? `, ${c3}` : ""});`;
  const glassCss = `background: rgba(255, 255, 255, ${(opacity / 100).toFixed(2)});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: 1px solid rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)});
border-radius: ${radius}px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);`;

  const Slider = ({
    label,
    value,
    min,
    max,
    onChange,
    unit = "",
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
    unit?: string;
  }) => (
    <label className="block space-y-1 text-xs font-semibold text-muted-foreground">
      {label} · {value}
      {unit}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </label>
  );

  const Swatch = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="size-9 cursor-pointer rounded-lg border border-glass-border bg-surface"
      />
      {label}
    </label>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Controls">
        <div className="flex flex-wrap items-center gap-4">
          <Swatch label="Color 1" value={c1} onChange={setC1} />
          <Swatch label="Color 2" value={c2} onChange={setC2} />
          <Swatch label="Color 3" value={c3} onChange={setC3} />
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <input
              type="checkbox"
              checked={useThird}
              onChange={(e) => setUseThird(e.target.checked)}
              className="size-4 accent-primary"
            />
            Use 3rd stop
          </label>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Slider label="Angle" value={angle} min={0} max={360} onChange={setAngle} unit="°" />
          <Slider label="Blur" value={blur} min={0} max={40} onChange={setBlur} unit="px" />
          <Slider label="Glass opacity" value={opacity} min={0} max={80} onChange={setOpacity} unit="%" />
          <Slider
            label="Saturation"
            value={saturation}
            min={80}
            max={220}
            onChange={setSaturation}
            unit="%"
          />
          <Slider label="Corner radius" value={radius} min={0} max={48} onChange={setRadius} unit="px" />
          <Slider
            label="Border opacity"
            value={borderOpacity}
            min={0}
            max={90}
            onChange={setBorderOpacity}
            unit="%"
          />
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel title="Live preview">
          <div
            className="grid min-h-56 place-items-center rounded-xl p-6"
            style={{
              background: `linear-gradient(${angle}deg, ${c1}, ${c2}${useThird ? `, ${c3}` : ""})`,
            }}
          >
            <div
              className="w-full max-w-xs p-6 text-center"
              style={{
                background: `rgba(255,255,255,${opacity / 100})`,
                backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                border: `1px solid rgba(255,255,255,${borderOpacity / 100})`,
                borderRadius: `${radius}px`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
              }}
            >
              <p className="font-display text-lg font-bold text-white drop-shadow">Glass card</p>
              <p className="mt-1 text-xs text-white/80">Tune the sliders, copy the CSS.</p>
            </div>
          </div>
        </Panel>

        <Panel title="Gradient CSS" actions={<CopyResultButton value={gradientCss} label="Copy CSS" />}>
          <pre className="overflow-auto rounded-xl border border-glass-border bg-surface p-3 font-mono text-xs whitespace-pre-wrap">
            {gradientCss}
          </pre>
        </Panel>

        <Panel
          title="Glassmorphism CSS"
          actions={<CopyResultButton value={glassCss} label="Copy CSS" />}
        >
          <pre className="overflow-auto rounded-xl border border-glass-border bg-surface p-3 font-mono text-xs whitespace-pre-wrap">
            {glassCss}
          </pre>
        </Panel>
      </div>
    </div>
  );
}

/* ============================== AI Prompt Formatter ============================= */

const MODELS = ["ChatGPT", "Claude", "Midjourney"] as const;
type Model = (typeof MODELS)[number];

export function AiPromptFormatter() {
  const [idea, setIdea] = useState("");
  const [role, setRole] = useState("senior product marketer");
  const [audience, setAudience] = useState("early-stage SaaS founders");
  const [tone, setTone] = useState("clear, confident, jargon-free");
  const [format, setFormat] = useState("markdown with headings and bullet points");
  const [model, setModel] = useState<Model>("ChatGPT");

  const prompt = useMemo(() => {
    const goal = idea.trim() || "<describe what you want>";
    if (model === "Midjourney") {
      const subject = goal.replace(/\s+/g, " ");
      return `${subject}, ${tone}, cinematic composition, dramatic volumetric lighting, ultra-detailed, 8k, shot on 35mm --ar 16:9 --style raw --v 6`;
    }
    if (model === "Claude") {
      return `<role>You are a ${role}.</role>

<task>
${goal}
</task>

<audience>${audience}</audience>
<tone>${tone}</tone>

<constraints>
- Be specific and factual; say "I don't know" rather than inventing details.
- Prefer concrete examples over abstract advice.
- Keep it tight — no filler or restating the prompt.
</constraints>

<output_format>
${format}
</output_format>

Think step by step inside <thinking> tags before writing the final answer.`;
    }
    return `# Role
You are a ${role}.

# Task
${goal}

# Audience
${audience}

# Tone & style
${tone}

# Constraints
- Ground every claim in the details provided; ask for missing context instead of assuming.
- No filler, no restating the question.
- Include at least one concrete example.

# Output format
${format}

# Quality bar
Before answering, list the 3 criteria a great answer must meet, then answer so that all 3 are met.`;
  }, [idea, role, audience, tone, format, model]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Your rough idea">
        <TextArea
          rows={6}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="write a launch email for my analytics app"
          aria-label="Rough idea"
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            Target model
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as Model)}
              className="min-h-11 w-full rounded-xl border border-glass-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            Role / persona
            <TextField value={role} onChange={(e) => setRole(e.target.value)} />
          </label>
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            Audience
            <TextField value={audience} onChange={(e) => setAudience(e.target.value)} />
          </label>
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            Tone / style
            <TextField value={tone} onChange={(e) => setTone(e.target.value)} />
          </label>
          <label className="space-y-1 text-xs font-semibold text-muted-foreground sm:col-span-2">
            Output format
            <TextField value={format} onChange={(e) => setFormat(e.target.value)} />
          </label>
        </div>
      </Panel>

      <Panel title="Structured prompt" actions={<CopyResultButton value={prompt} label="Copy prompt" />}>
        <pre
          className="max-h-[32rem] overflow-auto rounded-xl border border-glass-border bg-surface p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap"
          style={{ overflowWrap: "anywhere" }}
        >
          {prompt}
        </pre>
      </Panel>
    </div>
  );
}

/* ============================ Cron Expression Explainer ========================= */

const CRON_NAMES = ["minute", "hour", "day of month", "month", "day of week"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function describeField(field: string, index: number) {
  if (field === "*") return `every ${CRON_NAMES[index]}`;
  if (field.startsWith("*/")) return `every ${field.slice(2)} ${CRON_NAMES[index]}s`;
  if (field.includes("-")) return `${CRON_NAMES[index]} ${field.replace("-", " through ")}`;
  if (field.includes(","))
    return `${CRON_NAMES[index]} ${field.split(",").join(", ")}`;
  if (index === 3) return `in ${MONTHS[Number(field) - 1] ?? field}`;
  if (index === 4) return `on ${DOW[Number(field) % 7] ?? field}`;
  return `${CRON_NAMES[index]} ${field}`;
}

function matches(field: string, value: number, min: number) {
  if (field === "*") return true;
  return field.split(",").some((part) => {
    if (part.startsWith("*/")) return (value - min) % Number(part.slice(2)) === 0;
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      return value >= (a ?? 0) && value <= (b ?? 0);
    }
    return Number(part) === value;
  });
}

export function CronExplainer() {
  const [expr, setExpr] = useState("*/15 9-17 * * 1-5");

  const result = useMemo(() => {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return { error: "A cron expression needs exactly 5 fields." };
    const [min, hour, dom, mon, dow] = parts as [string, string, string, string, string];
    const summary = `Runs ${describeField(min, 0)}, ${describeField(hour, 1)}, ${describeField(dom, 2)}, ${describeField(mon, 3)}, ${describeField(dow, 4)}.`;
    const runs: string[] = [];
    const cursor = new Date();
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);
    for (let i = 0; i < 60 * 24 * 90 && runs.length < 5; i++) {
      if (
        matches(min, cursor.getMinutes(), 0) &&
        matches(hour, cursor.getHours(), 0) &&
        matches(dom, cursor.getDate(), 1) &&
        matches(mon, cursor.getMonth() + 1, 1) &&
        matches(dow, cursor.getDay(), 0)
      ) {
        runs.push(cursor.toLocaleString());
      }
      cursor.setMinutes(cursor.getMinutes() + 1);
    }
    return { summary, runs, parts };
  }, [expr]);

  return (
    <div className="space-y-4">
      <Panel title="Cron expression">
        <TextField
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          aria-label="Cron expression"
          className="font-mono"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ["Every 15 min, weekdays 9–5", "*/15 9-17 * * 1-5"],
            ["Daily at midnight", "0 0 * * *"],
            ["Every Monday 08:30", "30 8 * * 1"],
            ["1st of month", "0 6 1 * *"],
          ].map(([label, value]) => (
            <ActionButton key={value} variant="ghost" onClick={() => setExpr(value!)}>
              {label}
            </ActionButton>
          ))}
        </div>
      </Panel>

      {"error" in result ? (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {result.error}
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Plain English" actions={<CopyResultButton value={result.summary!} />}>
            <p className="text-sm">{result.summary}</p>
            <ul className="mt-3 grid gap-2 text-xs text-muted-foreground">
              {result.parts!.map((p, i) => (
                <li key={CRON_NAMES[i]} className="rounded-lg border border-glass-border bg-surface p-2">
                  <span className="font-mono font-bold text-primary">{p}</span> — {CRON_NAMES[i]}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Next 5 runs" actions={<CopyResultButton value={result.runs!.join("\n")} />}>
            {result.runs!.length ? (
              <ol className="space-y-2 text-sm">
                {result.runs!.map((r) => (
                  <li key={r} className="rounded-lg border border-glass-border bg-surface p-2 font-mono text-xs">
                    {r}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">No runs in the next 90 days.</p>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

/* ============================== Text to Speech Reader =========================== */

export function TextToSpeechReader() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const speak = () => {
    if (!text.trim()) {
      toast.error("Enter some text first");
      return;
    }
    if (!("speechSynthesis" in window)) {
      toast.error("Your browser has no speech engine");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  return (
    <div className="space-y-4">
      <Panel title="Text to read aloud">
        <TextArea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an article, script or study notes…"
          aria-label="Text to speak"
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            Voice
            <select
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-glass-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">System default</option>
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            Speed · {rate.toFixed(1)}x
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </label>
          <label className="space-y-1 text-xs font-semibold text-muted-foreground">
            Pitch · {pitch.toFixed(1)}
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton onClick={speak} disabled={speaking}>
            <Play className="size-4" aria-hidden="true" />
            {speaking ? "Speaking…" : "Read aloud"}
          </ActionButton>
          <ActionButton variant="ghost" onClick={stop}>
            <Square className="size-4" aria-hidden="true" />
            Stop
          </ActionButton>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Uses your device's built-in speech engine — no audio is uploaded anywhere.
        </p>
      </Panel>
    </div>
  );
}
