import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CopyButton,
  DownloadButton,
  ErrorNote,
  Panel,
  ResetButton,
  TextField,
} from "@/components/tool-ui";

/* ------------------------------ JSON formatter ------------------------------- */

function tsTypeOf(value: unknown, name: string, collected: string[], depth = 0): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    return `${tsTypeOf(value[0], name, collected, depth)}[]`;
  }
  if (typeof value === "object") {
    const iface = name.replace(/[^a-zA-Z0-9]/g, "") || "Root";
    const body = Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => {
        const child = tsTypeOf(val, key[0]!.toUpperCase() + key.slice(1), collected, depth + 1);
        const safeKey = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : `"${key}"`;
        return `  ${safeKey}: ${child};`;
      })
      .join("\n");
    collected.push(`export interface ${iface} {\n${body}\n}`);
    return iface;
  }
  return typeof value === "number" ? "number" : typeof value === "boolean" ? "boolean" : "string";
}

export function jsonToTypes(json: unknown): string {
  const collected: string[] = [];
  tsTypeOf(json, "Root", collected);
  return collected.reverse().join("\n\n");
}

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const process = (mode: "pretty" | "minify" | "types") => {
    try {
      const parsed: unknown = JSON.parse(input);
      setError(null);
      if (mode === "pretty") setOutput(JSON.stringify(parsed, null, 2));
      else if (mode === "minify") setOutput(JSON.stringify(parsed));
      else setOutput(jsonToTypes(parsed));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <Panel
        title="JSON input"
        actions={
          <ResetButton
            onReset={() => {
              setInput("");
              setOutput("");
              setError(null);
            }}
            label="Clear"
          />
        }
      >
        <TextField label="Paste JSON" value={input} onChange={setInput} rows={12} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => process("pretty")}>Format</Button>
          <Button variant="outline" onClick={() => process("minify")}>
            Minify
          </Button>
          <Button variant="outline" onClick={() => process("types")}>
            TypeScript types
          </Button>
        </div>
        <ErrorNote message={error} />
        {!error && output && (
          <p className="mt-3 text-sm text-primary">Valid JSON — parsed successfully.</p>
        )}
      </Panel>
      <Panel
        title="Output"
        actions={
          <>
            <CopyButton value={output} />
            <DownloadButton value={output} filename="output.txt" />
          </>
        }
      >
        <TextField label="Result" value={output} rows={14} readOnly />
      </Panel>
    </div>
  );
}

/* -------------------------------- JWT decoder -------------------------------- */

function b64urlDecode(part: string) {
  const padded = part.replace(/-/g, "+").replace(/_/g, "/");
  const json = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return decodeURIComponent(
    Array.from(json)
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

export function JwtDecoder() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: "A JWT needs at least a header and payload segment." };
    try {
      const header: unknown = JSON.parse(b64urlDecode(parts[0]!));
      const payload = JSON.parse(b64urlDecode(parts[1]!)) as Record<string, unknown>;
      return { header, payload, signature: parts[2] ?? "" };
    } catch {
      return { error: "Could not decode this token — check that it is a valid JWT." };
    }
  }, [token]);

  const ts = (value: unknown) =>
    typeof value === "number" ? new Date(value * 1000).toUTCString() : null;

  const exp = decoded && "payload" in decoded ? ts(decoded.payload["exp"]) : null;
  const iat = decoded && "payload" in decoded ? ts(decoded.payload["iat"]) : null;
  const expired =
    decoded && "payload" in decoded && typeof decoded.payload["exp"] === "number"
      ? decoded.payload["exp"] * 1000 < Date.now()
      : null;

  return (
    <div className="space-y-4">
      <Panel title="Token" actions={<ResetButton onReset={() => setToken("")} label="Clear" />}>
        <TextField
          label="Paste a JWT"
          value={token}
          onChange={setToken}
          rows={5}
          placeholder="eyJhbGciOi…"
        />
        <ErrorNote message={decoded && "error" in decoded ? decoded.error : null} />
      </Panel>

      {decoded && "payload" in decoded && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="Header"
              actions={<CopyButton value={JSON.stringify(decoded.header, null, 2)} />}
            >
              <TextField
                label="Decoded header"
                value={JSON.stringify(decoded.header, null, 2)}
                rows={8}
                readOnly
              />
            </Panel>
            <Panel
              title="Payload"
              actions={<CopyButton value={JSON.stringify(decoded.payload, null, 2)} />}
            >
              <TextField
                label="Decoded payload"
                value={JSON.stringify(decoded.payload, null, 2)}
                rows={8}
                readOnly
              />
            </Panel>
          </div>
          <Panel title="Claims">
            <dl className="grid gap-3 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Issued at</dt>
                <dd className="text-sm">{iat ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Expires</dt>
                <dd className="text-sm">{exp ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted-foreground">Status</dt>
                <dd className={`text-sm ${expired ? "text-destructive" : "text-primary"}`}>
                  {expired === null ? "No expiry claim" : expired ? "Expired" : "Active"}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Signature segment: <span className="font-mono break-all">{decoded.signature || "none"}</span>.
              Signatures are never verified here — verification requires your secret key and must
              happen on your server.
            </p>
          </Panel>
        </>
      )}
    </div>
  );
}

/* ------------------------------- SQL formatter ------------------------------- */

const SQL_BREAK = [
  "SELECT",
  "FROM",
  "WHERE",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "JOIN",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "VALUES",
  "INSERT INTO",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "UNION ALL",
  "UNION",
];

export function formatSql(sql: string): string {
  let out = sql.replace(/\s+/g, " ").trim();
  for (const keyword of SQL_BREAK) {
    out = out.replace(new RegExp(`\\s*\\b${keyword}\\b\\s*`, "gi"), `\n${keyword} `);
  }
  out = out.replace(/\s*,\s*/g, ",\n  ");
  out = out.replace(/\s*\bAND\b\s*/gi, "\n  AND ");
  out = out.replace(/\s*\bOR\b\s*/gi, "\n  OR ");
  return out.replace(/\n{2,}/g, "\n").trim();
}

export function sqlInsertToJson(sql: string): string {
  const match = /insert\s+into\s+[\w."`[\]]+\s*\(([^)]+)\)\s*values\s*(.+)/is.exec(sql);
  if (!match) throw new Error("No INSERT ... VALUES statement found.");
  const columns = match[1]!.split(",").map((c) => c.trim().replace(/["`[\]]/g, ""));
  const rowsRaw = match[2]!.match(/\(([^)]*)\)/g) ?? [];
  const rows = rowsRaw.map((row) => {
    const values = (row.slice(1, -1).match(/'(?:[^']|'')*'|[^,]+/g) ?? []).map((v) => {
      const t = v.trim();
      if (/^'.*'$/s.test(t)) return t.slice(1, -1).replace(/''/g, "'");
      if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
      if (/^null$/i.test(t)) return null;
      if (/^(true|false)$/i.test(t)) return t.toLowerCase() === "true";
      return t;
    });
    const record: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      record[col] = values[i] ?? null;
    });
    return record;
  });
  return JSON.stringify(rows, null, 2);
}

export function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Panel
        title="SQL input"
        actions={
          <ResetButton
            onReset={() => {
              setInput("");
              setOutput("");
              setError(null);
            }}
            label="Clear"
          />
        }
      >
        <TextField label="Query" value={input} onChange={setInput} rows={10} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setError(null);
              setOutput(formatSql(input));
            }}
          >
            Format SQL
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              try {
                setOutput(sqlInsertToJson(input));
                setError(null);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Conversion failed");
                setOutput("");
              }
            }}
          >
            SQL → JSON
          </Button>
        </div>
        <ErrorNote message={error} />
      </Panel>
      <Panel
        title="Output"
        actions={
          <>
            <CopyButton value={output} />
            <DownloadButton value={output} filename="query.sql" />
          </>
        }
      >
        <TextField label="Result" value={output} rows={14} readOnly />
      </Panel>
    </div>
  );
}

/* ------------------------------- Regex tester -------------------------------- */

const CHEATS: [string, string][] = [
  [".", "Any character except newline"],
  ["\\d", "Digit 0-9"],
  ["\\w", "Word character [A-Za-z0-9_]"],
  ["\\s", "Whitespace"],
  ["^ $", "Start / end of string (or line with m)"],
  ["*", "0 or more"],
  ["+", "1 or more"],
  ["?", "0 or 1 (or lazy quantifier)"],
  ["{2,5}", "Between 2 and 5 repetitions"],
  ["[abc]", "Any of a, b, c"],
  ["[^abc]", "None of a, b, c"],
  ["(…)", "Capture group"],
  ["(?:…)", "Non-capturing group"],
  ["(?<name>…)", "Named capture group"],
  ["a|b", "Alternation"],
  ["\\b", "Word boundary"],
  ["(?=…)", "Positive lookahead"],
  ["(?<=…)", "Positive lookbehind"],
];

export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w{2,}\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact hello@toolforge.dev or sales@example.com today.");

  const result = useMemo(() => {
    if (!pattern) return { matches: [] as RegExpMatchArray[], error: null };
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      return { matches: Array.from(text.matchAll(re)), error: null };
    } catch (e) {
      return { matches: [], error: e instanceof Error ? e.message : "Invalid pattern" };
    }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-4">
      <Panel title="Pattern">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
          <div className="space-y-2">
            <Label htmlFor="regex-pattern">Regular expression</Label>
            <Input
              id="regex-pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regex-flags">Flags</Label>
            <Input
              id="regex-flags"
              value={flags}
              onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
              className="font-mono"
            />
          </div>
        </div>
        <ErrorNote message={result.error} />
      </Panel>

      <Panel title="Test string" actions={<ResetButton onReset={() => setText("")} label="Clear" />}>
        <TextField label="Sample text" value={text} onChange={setText} rows={8} />
      </Panel>

      <Panel title={`Matches · ${result.matches.length}`}>
        <div className="space-y-2">
          {result.matches.length === 0 && (
            <p className="text-sm text-muted-foreground">No matches yet.</p>
          )}
          {result.matches.map((match, i) => (
            <div key={i} className="rounded-lg bg-background/60 p-3 font-mono text-[13px]">
              <span className="text-primary">#{i + 1}</span> {match[0]}
              {match.length > 1 && (
                <span className="ml-2 text-muted-foreground">
                  groups: {match.slice(1).map((g) => g ?? "∅").join(" · ")}
                </span>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Cheat sheet">
        <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {CHEATS.map(([token, meaning]) => (
            <div key={token} className="flex gap-3 rounded-lg bg-background/60 px-3 py-2 text-sm">
              <dt className="shrink-0 font-mono text-primary">{token}</dt>
              <dd className="text-muted-foreground">{meaning}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </div>
  );
}

/* ---------------------------------- Base64 ----------------------------------- */

export function Base64Tool() {
  const [text, setText] = useState("");
  const [encoded, setEncoded] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fileResult, setFileResult] = useState("");

  const encode = () => {
    try {
      setError(null);
      setEncoded(btoa(String.fromCharCode(...new TextEncoder().encode(text))));
    } catch {
      setError("Could not encode this text.");
    }
  };

  const decode = () => {
    try {
      setError(null);
      const binary = atob(encoded.trim());
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      setText(new TextDecoder().decode(bytes));
    } catch {
      setError("That is not valid Base64.");
    }
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFileResult(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  return (
    <Tabs defaultValue="text" className="space-y-4">
      <TabsList>
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="file">File</TabsTrigger>
      </TabsList>

      <TabsContent value="text" className="space-y-4">
        <Panel
          title="Plain text"
          actions={
            <>
              <CopyButton value={text} />
              <ResetButton onReset={() => setText("")} label="Clear" />
            </>
          }
        >
          <TextField label="Text" value={text} onChange={setText} rows={8} />
        </Panel>
        <div className="flex flex-wrap gap-2">
          <Button onClick={encode}>Encode ↓</Button>
          <Button variant="outline" onClick={decode}>
            Decode ↑
          </Button>
        </div>
        <Panel
          title="Base64"
          actions={
            <>
              <CopyButton value={encoded} />
              <DownloadButton value={encoded} filename="encoded.txt" />
            </>
          }
        >
          <TextField label="Base64" value={encoded} onChange={setEncoded} rows={8} />
        </Panel>
        <ErrorNote message={error} />
      </TabsContent>

      <TabsContent value="file" className="space-y-4">
        <Panel title="Upload a file">
          <Label htmlFor="b64-file">Any file up to a few MB</Label>
          <Input
            id="b64-file"
            type="file"
            className="mt-2"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </Panel>
        <Panel
          title="Data URL"
          actions={
            <>
              <CopyButton value={fileResult} />
              <DownloadButton value={fileResult} filename="file-base64.txt" />
            </>
          }
        >
          <TextField label="Base64 data URL" value={fileResult} rows={10} readOnly />
        </Panel>
      </TabsContent>
    </Tabs>
  );
}

/* --------------------------------- Minifier ---------------------------------- */

export function minifyCode(code: string, kind: "html" | "css" | "js"): string {
  if (kind === "css") {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,>])\s*/g, "$1")
      .replace(/;}/g, "}")
      .trim();
  }
  if (kind === "js") {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1")
      .replace(/\s*\n\s*/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();
  }
  return code
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function beautifyCode(code: string, kind: "html" | "css" | "js"): string {
  const source =
    kind === "css"
      ? code.replace(/\s*{\s*/g, " {\n  ").replace(/;\s*/g, ";\n  ").replace(/\s*}\s*/g, "\n}\n")
      : kind === "html"
        ? code.replace(/></g, ">\n<")
        : code.replace(/;\s*/g, ";\n").replace(/{\s*/g, " {\n").replace(/}\s*/g, "}\n");

  let indent = 0;
  return source
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^(<\/|\})/.test(line)) indent = Math.max(0, indent - 1);
      const rendered = "  ".repeat(indent) + line;
      if (/(\{$)|(^<(?!\/)(?!.*\/>)(?!(area|br|hr|img|input|link|meta)\b)[^>]*>$)/.test(line))
        indent += 1;
      return rendered;
    })
    .join("\n");
}

export function CodeMinifier() {
  const [kind, setKind] = useState<"html" | "css" | "js">("css");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const saved =
    input.length && output.length
      ? Math.max(0, Math.round((1 - output.length / input.length) * 100))
      : 0;

  return (
    <div className="space-y-4">
      <Panel
        title="Source"
        actions={
          <ResetButton
            onReset={() => {
              setInput("");
              setOutput("");
            }}
            label="Clear"
          />
        }
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {(["html", "css", "js"] as const).map((k) => (
            <Button
              key={k}
              size="sm"
              variant={kind === k ? "default" : "outline"}
              onClick={() => setKind(k)}
            >
              {k.toUpperCase()}
            </Button>
          ))}
        </div>
        <TextField label="Code" value={input} onChange={setInput} rows={12} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => setOutput(minifyCode(input, kind))}>Minify</Button>
          <Button variant="outline" onClick={() => setOutput(beautifyCode(input, kind))}>
            Un-minify
          </Button>
        </div>
      </Panel>
      <Panel
        title={saved ? `Output · ${saved}% smaller` : "Output"}
        actions={
          <>
            <CopyButton value={output} />
            <DownloadButton value={output} filename={`output.min.${kind}`} />
          </>
        }
      >
        <TextField label="Result" value={output} rows={12} readOnly />
      </Panel>
    </div>
  );
}