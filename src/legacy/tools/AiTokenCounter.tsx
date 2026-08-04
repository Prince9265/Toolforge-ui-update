// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { ToolInput } from '@/legacy/ToolUI';

const models = [
  { name: 'GPT-4', tokensPerDollar: 10000, contextWindow: 128000 },
  { name: 'GPT-3.5', tokensPerDollar: 75000, contextWindow: 16000 },
  { name: 'Claude 3 Opus', tokensPerDollar: 15000, contextWindow: 200000 },
  { name: 'Claude 3 Sonnet', tokensPerDollar: 75000, contextWindow: 200000 },
  { name: 'Llama 3', tokensPerDollar: 100000, contextWindow: 8000 },
];

export default function AiTokenCounter() {
  const [text, setText] = useState('');
  const [model, setModel] = useState(models[0].name);

  const stats = useMemo(() => {
    const tokens = Math.ceil(text.length / 4);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const selected = models.find((m) => m.name === model) || models[0];
    const cost = tokens / selected.tokensPerDollar;
    return { tokens, words, chars: text.length, cost, contextWindow: selected.contextWindow };
  }, [text, model]);

  return (
    <div className="space-y-4">
      <ToolInput label="Your Text" value={text} onChange={setText} placeholder="Paste text to count tokens..." rows={6} />
      <div>
        <label className="text-sm font-medium mb-2 block">AI Model</label>
        <select value={model} onChange={(e) => setModel(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
          {models.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center"><p className="text-2xl font-bold text-primary">{stats.tokens.toLocaleString()}</p><p className="text-xs text-muted-foreground">Tokens</p></div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-center"><p className="text-2xl font-bold">{stats.words.toLocaleString()}</p><p className="text-xs text-muted-foreground">Words</p></div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-center"><p className="text-2xl font-bold">{stats.chars.toLocaleString()}</p><p className="text-xs text-muted-foreground">Characters</p></div>
        <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-center"><p className="text-2xl font-bold text-success">${stats.cost.toFixed(4)}</p><p className="text-xs text-muted-foreground">Est. Cost</p></div>
      </div>
      <p className="text-xs text-muted-foreground">Context window: {stats.contextWindow.toLocaleString()} tokens · {stats.tokens > 0 ? `${((stats.tokens / stats.contextWindow) * 100).toFixed(1)}% used` : '0% used'}</p>
    </div>
  );
}
