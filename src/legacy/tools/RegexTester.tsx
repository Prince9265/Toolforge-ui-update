// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput, ToolError } from '@/legacy/ToolUI';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const result = useMemo(() => {
    if (!pattern || !text) return null;
    try {
      const re = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups: string[] }[] = [];
      let m: RegExpExecArray | null;
      if (flags.includes('g')) {
        while ((m = re.exec(text)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (m.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        m = re.exec(text);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      setError('');
      return { matches, highlighted: highlightMatches(text, re, flags) };
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }, [pattern, flags, text]);

  function highlightMatches(text: string, re: RegExp, flags: string): { text: string; isMatch: boolean }[] {
    const parts: { text: string; isMatch: boolean }[] = [];
    const globalRe = new RegExp(re.source, flags.includes('g') ? flags : flags + 'g');
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = globalRe.exec(text)) !== null) {
      if (m.index > last) parts.push({ text: text.slice(last, m.index), isMatch: false });
      parts.push({ text: m[0], isMatch: true });
      last = m.index + m[0].length;
      if (m.index === globalRe.lastIndex) globalRe.lastIndex++;
    }
    if (last < text.length) parts.push({ text: text.slice(last), isMatch: false });
    return parts;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground font-mono">/</span>
        <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="pattern" className="flex-1 h-10 rounded-lg border border-input bg-background px-3 font-mono text-sm" />
        <span className="text-muted-foreground font-mono">/</span>
        <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="flags" className="w-20 h-10 rounded-lg border border-input bg-background px-3 font-mono text-sm" />
      </div>

      <ToolInput label="Test Text" value={text} onChange={setText} placeholder="Enter text to test against..." rows={5} />

      {error && <ToolError message={error} />}

      {result && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">Highlighted Matches</h3>
            <div className="rounded-lg border border-border bg-muted/30 p-3 font-mono text-sm whitespace-pre-wrap break-all">
              {result.highlighted.map((part, i) => (
                <mark key={i} className={part.isMatch ? 'bg-success/30 text-foreground rounded px-0.5' : ''}>{part.text}</mark>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Matches ({result.matches.length})</h3>
            {result.matches.length > 0 ? (
              <div className="space-y-2">
                {result.matches.map((m, i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                    <p className="font-mono">Match {i + 1}: <span className="text-primary">{m.match}</span> <span className="text-muted-foreground">(index: {m.index})</span></p>
                    {m.groups.length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Groups: {m.groups.map((g, j) => `$${j + 1}="${g}"`).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No matches found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
