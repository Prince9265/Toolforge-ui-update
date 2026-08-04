import { useMemo, useState } from "react";
import { Copy, Braces, ShieldAlert, AlignLeft, Minimize2 } from "lucide-react";
import { ActionButton, Panel, TextArea, TextField } from "@/components/ToolKit";
import { copyText } from "./ai";

/* ------------------------------ JSON Formatter -------------------------------- */

function tsTypeOf(value: unknown, name = "Root", depth = 0): { inline: string; extra: string[] } {
  const pad = "  ";
  if (value === null) return { inline: "null", extra: [] };
  if (Array.isArray(value)) {
    if (value.length === 0) return { inline: "unknown[]", extra: [] };
    const first = tsTypeOf(value[0], name, depth);
    return { inline: `${first.inline}[]`, extra: first.extra };
  }
  if (typeof value === "object") {
    const iface = name.charAt(0).toUpperCase() + name.slice(1);
    const extras: string[] = [];
    const lines = Object.entries(value as Record<string, unknown>).map(([k, v]) => {
      const child = tsTypeOf(v, k, depth + 1);
      extras.push(...child.extra);
      const key = /^[A-Za-z_$][\w$]*$/.test(k) ? k : `"${k}"`;
      return `${pad}${key}: ${child.inline};`;
    });
    extras.push(`export interface ${iface} {\n${lines.join("\n")}\n}`);
    return { inline: iface, extra: extras };
  }
  return { inline: typeof value, extra: [] };
}

export function JsonFormatter() {
  const [raw, setRaw] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [types, setTypes] = useState("");

  const parse = () => {
    try {
      const parsed = JSON.parse(raw);
      setError("");
      return parsed;
    } catch (e) {
      setError((e as Error).message);
      return undefined;
    }
  };

  const format = (space: number) => {
    const parsed = parse();
    if (parsed === undefined) return;
    setOutput(JSON.stringify(parsed, null, space));
    setTypes("");
  };

  const genTypes = () => {
    const parsed = parse();
    if (parsed === undefined) return;
    const { extra } = tsTypeOf(parsed, "Root");
    setTypes(extra.reverse().join("\n\n"));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="JSON input">
        <TextArea
          rows={16}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder='{"user":{"id":1,"name":"Ada","tags":["dev"]}}'
          aria-label="JSON input"
          spellCheck={false}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton onClick={() => format(2)}>
            <AlignLeft className="size-4" aria-hidden="true" /> Format
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => format(0)}>
            <Minimize2 className="size-4" aria-hidden="true" /> Minify
          </ActionButton>
          <ActionButton variant="ghost" onClick={genTypes}>
            <Braces className="size-4" aria-hidden="true" /> TypeScript
          </ActionButton>
        </div>
        {error && (
          <p role="alert" className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            Invalid JSON — {error}
          </p>
        )}
      </Panel>

      <Panel
        title={types ? "TypeScript interfaces" : "Output"}
        actions={
          (output || types) && (
            <ActionButton variant="ghost" onClick={() => copyText(types || output)}>
              <Copy className="size-4" aria-hidden="true" /> Copy
            </ActionButton>
          )
        }
      >
        <pre className="min-h-[380px] overflow-auto whitespace-pre-wrap rounded-xl border border-glass-border bg-surface p-3 font-mono text-xs leading-relaxed">
          {types || output || "Formatted output appears here."}
        </pre>
      </Panel>
    </div>
  );
}

/* --------------------------------- JWT Decoder -------------------------------- */

function b64url(input: string) {
  const pad = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = pad + "=".repeat((4 - (pad.length % 4)) % 4);
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

export function JwtDecoder() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    const parts = token.trim().split(".");
    if (parts.length < 2) return null;
    try {
      const header = JSON.parse(b64url(parts[0]!)) as Record<string, unknown>;
      const payload = JSON.parse(b64url(parts[1]!)) as Record<string, unknown>;
      const warnings: string[] = [];
      if (String(header['alg']).toLowerCase() === "none")
        warnings.push("alg is 'none' — the token is unsigned and trivially forgeable.");
      if (!payload['exp']) warnings.push("No exp claim — this token never expires.");
      else if (Number(payload['exp']) * 1000 < Date.now()) warnings.push("Token is expired.");
      else if (Number(payload['exp']) - Number(payload['iat'] ?? 0) > 60 * 60 * 24 * 30)
        warnings.push("Very long lifetime (>30 days) — consider shorter-lived tokens.");
      if (!payload['iss']) warnings.push("No iss claim — issuer cannot be verified.");
      if (!parts[2]) warnings.push("No signature segment present.");
      return { header, payload, warnings };
    } catch {
      return { error: true as const };
    }
  }, [token]);

  const fmtTime = (v: unknown) =>
    typeof v === "number" ? new Date(v * 1000).toLocaleString() : undefined;

  return (
    <div className="space-y-4">
      <Panel title="JWT">
        <TextArea
          rows={5}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
          aria-label="JWT token"
          spellCheck={false}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Decoding happens in your browser. Nothing is uploaded — but never paste production tokens
          into any tool you don't control.
        </p>
      </Panel>

      {decoded && "error" in decoded && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          That doesn't look like a valid JWT.
        </p>
      )}

      {decoded && !("error" in decoded) && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Header">
              <pre className="overflow-auto rounded-xl border border-glass-border bg-surface p-3 font-mono text-xs">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </Panel>
            <Panel title="Payload">
              <pre className="overflow-auto rounded-xl border border-glass-border bg-surface p-3 font-mono text-xs">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
              <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                {fmtTime(decoded.payload['iat']) && <div>Issued: {fmtTime(decoded.payload['iat'])}</div>}
                {fmtTime(decoded.payload['exp']) && <div>Expires: {fmtTime(decoded.payload['exp'])}</div>}
              </dl>
            </Panel>
          </div>
          <Panel title="Security review">
            {decoded.warnings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No obvious issues found.</p>
            ) : (
              <ul className="space-y-2">
                {decoded.warnings.map((w) => (
                  <li key={w} className="flex items-start gap-2 text-sm">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                    {w}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}

/* --------------------------------- SQL Formatter ------------------------------ */

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "JOIN",
  "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "INSERT INTO", "VALUES", "UPDATE",
  "SET", "DELETE FROM", "UNION ALL", "UNION", "ON", "AND", "OR",
];

function formatSql(sql: string) {
  let out = sql.replace(/\s+/g, " ").trim();
  SQL_KEYWORDS.forEach((kw) => {
    out = out.replace(new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi"), `\n${kw}`);
  });
  return out
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (!t) return "";
      return /^(AND|OR|ON)\b/i.test(t) ? `  ${t}` : t;
    })
    .filter(Boolean)
    .join("\n")
    .replace(/,\s*/g, ",\n  ");
}

export function SqlFormatter() {
  const [raw, setRaw] = useState("");
  const [out, setOut] = useState("");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="SQL input">
        <TextArea
          rows={14}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="select id, name from users where active = true order by created_at desc"
          aria-label="SQL input"
          spellCheck={false}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton onClick={() => setOut(formatSql(raw))} disabled={!raw.trim()}>
            <AlignLeft className="size-4" aria-hidden="true" /> Format
          </ActionButton>
          <ActionButton
            variant="ghost"
            onClick={() => setOut(raw.replace(/\s+/g, " ").replace(/\s*([(),])\s*/g, "$1").trim())}
            disabled={!raw.trim()}
          >
            <Minimize2 className="size-4" aria-hidden="true" /> Minify
          </ActionButton>
        </div>
      </Panel>
      <Panel
        title="Result"
        actions={
          out && (
            <ActionButton variant="ghost" onClick={() => copyText(out)}>
              <Copy className="size-4" aria-hidden="true" /> Copy
            </ActionButton>
          )
        }
      >
        <pre className="min-h-[320px] overflow-auto whitespace-pre-wrap rounded-xl border border-glass-border bg-surface p-3 font-mono text-xs leading-relaxed">
          {out || "Formatted SQL appears here."}
        </pre>
      </Panel>
    </div>
  );
}

/* ----------------------------- Regex + Diff Checker --------------------------- */

function diffLines(a: string, b: string) {
  const left = a.split("\n");
  const right = b.split("\n");
  const max = Math.max(left.length, right.length);
  return Array.from({ length: max }, (_, i) => ({
    line: i + 1,
    a: left[i] ?? "",
    b: right[i] ?? "",
    same: (left[i] ?? "") === (right[i] ?? ""),
  }));
}

export function RegexDiff() {
  const [mode, setMode] = useState<"regex" | "diff">("regex");
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [sample, setSample] = useState("Contact ada@forge.dev or grace@forge.dev today.");
  const [left, setLeft] = useState("line one\nline two\nline three");
  const [right, setRight] = useState("line one\nline 2\nline three");

  const matches = useMemo(() => {
    if (mode !== "regex") return { list: [] as RegExpMatchArray[], error: "" };
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
      return { list: Array.from(sample.matchAll(re)), error: "" };
    } catch (e) {
      return { list: [], error: (e as Error).message };
    }
  }, [pattern, flags, sample, mode]);

  const diff = useMemo(() => (mode === "diff" ? diffLines(left, right) : []), [left, right, mode]);

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Mode" className="inline-flex rounded-xl border border-glass-border bg-surface p-1">
        {(["regex", "diff"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`min-h-11 rounded-lg px-4 text-sm font-semibold capitalize transition-colors ${
              mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {m === "regex" ? "Regex tester" : "Diff checker"}
          </button>
        ))}
      </div>

      {mode === "regex" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Pattern">
            <div className="grid grid-cols-[minmax(0,1fr)_88px] gap-2">
              <TextField
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                aria-label="Regular expression"
                className="font-mono"
              />
              <TextField
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                aria-label="Flags"
                className="font-mono"
              />
            </div>
            <TextArea
              rows={10}
              value={sample}
              onChange={(e) => setSample(e.target.value)}
              aria-label="Test string"
              className="mt-3"
            />
            {matches.error && (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {matches.error}
              </p>
            )}
          </Panel>
          <Panel title={`Matches (${matches.list.length})`}>
            {matches.list.length === 0 ? (
              <p className="text-sm text-muted-foreground">No matches yet.</p>
            ) : (
              <ol className="space-y-2">
                {matches.list.map((m, i) => (
                  <li key={i} className="rounded-xl border border-glass-border bg-surface p-3 font-mono text-xs">
                    <span className="text-primary">{m[0]}</span>
                    <span className="ml-2 text-muted-foreground">at index {m.index}</span>
                    {m.length > 1 && (
                      <div className="mt-1 text-muted-foreground">
                        groups: {m.slice(1).map((g) => g ?? "∅").join(" | ")}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </Panel>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Original">
              <TextArea rows={10} value={left} onChange={(e) => setLeft(e.target.value)} aria-label="Original text" />
            </Panel>
            <Panel title="Changed">
              <TextArea rows={10} value={right} onChange={(e) => setRight(e.target.value)} aria-label="Changed text" />
            </Panel>
          </div>
          <Panel title={`Differences (${diff.filter((d) => !d.same).length})`}>
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs">
                <caption className="sr-only">Line by line comparison</caption>
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th scope="col" className="w-12 py-1">#</th>
                    <th scope="col" className="py-1">Original</th>
                    <th scope="col" className="py-1">Changed</th>
                  </tr>
                </thead>
                <tbody>
                  {diff.map((d) => (
                    <tr key={d.line} className={d.same ? "" : "bg-primary/10"}>
                      <td className="py-1 text-muted-foreground">{d.line}</td>
                      <td className="py-1 pr-3 align-top">{d.a || "—"}</td>
                      <td className="py-1 align-top">{d.b || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
