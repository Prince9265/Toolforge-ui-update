import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  CopyButton,
  DownloadButton,
  ErrorNote,
  Panel,
  ResetButton,
  TextField,
} from "@/components/tool-ui";
import { md5 } from "@/lib/md5";

/* ----------------------------- Password generator ---------------------------- */

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>/?",
};

export function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [opts, setOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [password, setPassword] = useState("");

  const generate = () => {
    const pool = (Object.keys(SETS) as (keyof typeof SETS)[])
      .filter((k) => opts[k])
      .map((k) => SETS[k])
      .join("");
    if (!pool) {
      setPassword("");
      return;
    }
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    setPassword(Array.from(bytes, (b) => pool[b % pool.length]).join(""));
  };

  useEffect(generate, []); // eslint-disable-line react-hooks/exhaustive-deps

  const entropy = useMemo(() => {
    const poolSize = (Object.keys(SETS) as (keyof typeof SETS)[])
      .filter((k) => opts[k])
      .reduce((sum, k) => sum + SETS[k].length, 0);
    return poolSize ? Math.round(length * Math.log2(poolSize)) : 0;
  }, [length, opts]);

  const strength = entropy > 110 ? "Excellent" : entropy > 75 ? "Strong" : entropy > 50 ? "Fair" : "Weak";

  return (
    <div className="space-y-4">
      <Panel title="Generated password" actions={<CopyButton value={password} />}>
        <p className="break-all rounded-xl bg-background/60 p-4 font-mono text-lg">
          {password || "Select at least one character set"}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={generate}>Regenerate</Button>
          <span className="text-sm text-muted-foreground">
            ~{entropy} bits of entropy · <span className="text-primary">{strength}</span>
          </span>
        </div>
      </Panel>

      <Panel title="Options">
        <Label htmlFor="pw-length">Length · {length}</Label>
        <Slider
          id="pw-length"
          className="mt-4"
          min={6}
          max={64}
          step={1}
          value={[length]}
          onValueChange={([v]) => setLength(v ?? 20)}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {(Object.keys(SETS) as (keyof typeof SETS)[]).map((key) => (
            <div key={key} className="flex items-center gap-3">
              <Switch
                id={`pw-${key}`}
                checked={opts[key]}
                onCheckedChange={(v) => setOpts({ ...opts, [key]: v })}
              />
              <Label htmlFor={`pw-${key}`} className="capitalize">
                {key}
              </Label>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ------------------------------- Hash generator ------------------------------ */

async function webHash(algo: "SHA-1" | "SHA-256" | "SHA-512", text: string) {
  const buffer = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function HashGenerator() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    if (!text) {
      setHashes({});
      return;
    }
    (async () => {
      const [sha1, sha256, sha512] = await Promise.all([
        webHash("SHA-1", text),
        webHash("SHA-256", text),
        webHash("SHA-512", text),
      ]);
      if (!cancelled) setHashes({ MD5: md5(text), "SHA-1": sha1, "SHA-256": sha256, "SHA-512": sha512 });
    })();
    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <div className="space-y-4">
      <Panel title="Input" actions={<ResetButton onReset={() => setText("")} label="Clear" />}>
        <TextField label="Text to hash" value={text} onChange={setText} rows={6} />
      </Panel>
      <div className="grid gap-3">
        {["MD5", "SHA-1", "SHA-256", "SHA-512"].map((algo) => (
          <Panel key={algo} title={algo} actions={<CopyButton value={hashes[algo] ?? ""} />}>
            <code className="block break-all rounded-lg bg-background/60 p-3 text-sm">
              {hashes[algo] ?? "—"}
            </code>
          </Panel>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- URL utilities ------------------------------- */

export function UrlEncoder() {
  const [raw, setRaw] = useState("");
  const [encoded, setEncoded] = useState("");
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    try {
      const url = new URL(raw);
      return {
        parts: [
          ["Protocol", url.protocol],
          ["Host", url.host],
          ["Path", url.pathname],
          ["Hash", url.hash || "—"],
        ] as [string, string][],
        params: Array.from(url.searchParams.entries()),
      };
    } catch {
      return null;
    }
  }, [raw]);

  return (
    <div className="space-y-4">
      <Panel
        title="URL or text"
        actions={
          <>
            <CopyButton value={raw} />
            <ResetButton onReset={() => setRaw("")} label="Clear" />
          </>
        }
      >
        <TextField label="Decoded value" value={raw} onChange={setRaw} rows={5} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setError(null);
              setEncoded(encodeURIComponent(raw));
            }}
          >
            Encode →
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              try {
                setRaw(decodeURIComponent(encoded));
                setError(null);
              } catch {
                setError("That value contains an invalid percent-encoding sequence.");
              }
            }}
          >
            ← Decode
          </Button>
        </div>
        <ErrorNote message={error} />
      </Panel>

      <Panel title="Encoded" actions={<CopyButton value={encoded} />}>
        <TextField label="Percent-encoded" value={encoded} onChange={setEncoded} rows={5} />
      </Panel>

      {parsed && (
        <Panel title="Query string breakdown">
          <dl className="grid gap-2 sm:grid-cols-4">
            {parsed.parts.map(([label, value]) => (
              <div key={label} className="rounded-lg bg-background/60 p-3">
                <dt className="text-xs uppercase text-muted-foreground">{label}</dt>
                <dd className="truncate text-sm">{value}</dd>
              </div>
            ))}
          </dl>
          {parsed.params.length > 0 && (
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-muted-foreground">
                  <th className="py-2">Parameter</th>
                  <th className="py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {parsed.params.map(([key, value], i) => (
                  <tr key={`${key}-${i}`} className="border-t border-border">
                    <td className="py-2 font-mono">{key}</td>
                    <td className="break-all py-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      )}
    </div>
  );
}

/* ------------------------------ OG meta builder ------------------------------ */

export function OgMetaBuilder() {
  const [meta, setMeta] = useState({
    title: "ToolForge — 28 free browser tools",
    description: "Fast, private, client-side utilities for developers, writers and designers.",
    url: "https://example.com",
    image: "https://example.com/og.jpg",
    site: "@toolforge",
    type: "website",
  });

  const tags = `<meta property="og:title" content="${meta.title}" />
<meta property="og:description" content="${meta.description}" />
<meta property="og:url" content="${meta.url}" />
<meta property="og:type" content="${meta.type}" />
<meta property="og:image" content="${meta.image}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="${meta.site}" />
<meta name="twitter:title" content="${meta.title}" />
<meta name="twitter:description" content="${meta.description}" />
<meta name="twitter:image" content="${meta.image}" />`;

  const fields: [keyof typeof meta, string][] = [
    ["title", "Title"],
    ["description", "Description"],
    ["url", "Canonical URL"],
    ["image", "Image URL"],
    ["site", "Twitter handle"],
    ["type", "OG type"],
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Page details">
          <div className="grid gap-4">
            {fields.map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`og-${key}`}>{label}</Label>
                <Input
                  id={`og-${key}`}
                  value={meta[key]}
                  onChange={(e) => setMeta({ ...meta, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Live card preview">
          <div className="overflow-hidden rounded-xl border border-border bg-background/60">
            <div className="aspect-[1.91/1] w-full bg-muted">
              {meta.image && (
                <img
                  src={meta.image}
                  alt="Social card preview"
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                />
              )}
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {meta.url.replace(/^https?:\/\//, "")}
              </p>
              <p className="mt-1 font-display font-semibold">{meta.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{meta.description}</p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Meta tags"
        actions={
          <>
            <CopyButton value={tags} />
            <DownloadButton value={tags} filename="meta-tags.html" mime="text/html" />
          </>
        }
      >
        <TextField label="Paste into your <head>" value={tags} rows={12} readOnly />
      </Panel>
    </div>
  );
}

/* ------------------------------ UUID generator ------------------------------- */

export function UuidGenerator() {
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [braces, setBraces] = useState(false);
  const [ids, setIds] = useState<string[]>([]);

  const generate = () => {
    const list = Array.from({ length: count }, () => crypto.randomUUID());
    setIds(list);
  };

  useEffect(generate, []); // eslint-disable-line react-hooks/exhaustive-deps

  const output = ids
    .map((id) => {
      const value = uppercase ? id.toUpperCase() : id;
      return braces ? `{${value}}` : value;
    })
    .join("\n");

  return (
    <div className="space-y-4">
      <Panel title="Options">
        <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="uuid-count">How many (1–500)</Label>
            <Input
              id="uuid-count"
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) => setCount(Math.min(500, Math.max(1, Number(e.target.value) || 1)))}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="uuid-upper" checked={uppercase} onCheckedChange={setUppercase} />
            <Label htmlFor="uuid-upper">Uppercase</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="uuid-braces" checked={braces} onCheckedChange={setBraces} />
            <Label htmlFor="uuid-braces">Wrap in braces</Label>
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={generate}>Generate UUIDs</Button>
        </div>
      </Panel>
      <Panel
        title={`Output · ${ids.length}`}
        actions={
          <>
            <CopyButton value={output} />
            <DownloadButton value={output} filename="uuids.txt" />
          </>
        }
      >
        <TextField label="UUID v4 list" value={output} rows={14} readOnly />
      </Panel>
    </div>
  );
}