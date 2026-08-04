// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput } from '@/legacy/ToolUI';

const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'as', 'if', 'then', 'than', 'so', 'not', 'no', 'yes']);

export default function KeywordDensityChecker() {
  const [text, setText] = useState('');
  const [excludeStopWords, setExcludeStopWords] = useState(true);

  const results = useMemo(() => {
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const filtered = excludeStopWords ? words.filter((w) => !STOP_WORDS.has(w) && w.length > 2) : words;
    const total = filtered.length;
    const freq: Record<string, number> = {};
    for (const word of filtered) freq[word] = (freq[word] || 0) + 1;
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
    return { total, items: sorted.map(([word, count]) => ({ word, count, density: (count / total) * 100 })) };
  }, [text, excludeStopWords]);

  return (
    <div className="space-y-4">
      <ToolInput label="Your Text" value={text} onChange={setText} placeholder="Paste your content to analyze..." rows={8} />
      <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={excludeStopWords} onChange={(e) => setExcludeStopWords(e.target.checked)} className="h-4 w-4 rounded accent-primary" /><span className="text-sm">Exclude common stop words</span></label>
      {results.total > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{results.total} words analyzed</p>
          <div className="space-y-2">
            {results.items.map(({ word, count, density }, i) => (
              <div key={word} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                <span className="text-sm font-medium w-32 truncate">{word}</span>
                <div className="flex-1 h-6 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary/30 rounded-full" style={{ width: `${Math.min(100, density * 2)}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">{count}x</span>
                <span className="text-xs font-mono w-16 text-right">{density.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
