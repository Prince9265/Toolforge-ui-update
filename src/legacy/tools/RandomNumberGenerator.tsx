// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const generate = () => {
    if (min > max) { showToast('Min must be less than max', 'error'); return; }
    const range = max - min + 1;
    if (unique && count > range) { showToast('Count exceeds range for unique numbers', 'error'); return; }

    const numbers: number[] = [];
    if (unique) {
      const pool = Array.from({ length: range }, (_, i) => min + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      numbers.push(...pool.slice(0, count));
    } else {
      for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * range) + min);
      }
    }
    setResults(numbers);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    showToast('Numbers copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Min</label>
          <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Max</label>
          <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Count</label>
          <input type="number" min="1" max="100" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
        <span className="text-sm">Unique numbers only</span>
      </label>

      <Button onClick={generate} className="w-full">Generate</Button>

      {results.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <p className="flex-1 font-mono text-sm break-all">{results.join(', ')}</p>
          <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors shrink-0" aria-label="Copy">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
