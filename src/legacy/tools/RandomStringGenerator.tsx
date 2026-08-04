// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState } from 'react';
import { Button } from '@/legacy/ui/Button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

export default function RandomStringGenerator() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState(-1);
  const { showToast } = useToast();

  const generate = () => {
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}';
    if (!chars) { showToast('Select at least one character type', 'error'); return; }

    const strings: string[] = [];
    for (let n = 0; n < count; n++) {
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      let result = '';
      for (let i = 0; i < length; i++) result += chars[arr[i] % chars.length];
      strings.push(result);
    }
    setResults(strings);
  };

  const copy = async (s: string, idx: number) => {
    await navigator.clipboard.writeText(s);
    setCopiedIdx(idx);
    showToast('String copied', 'success');
    setTimeout(() => setCopiedIdx(-1), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Length: {length}</label>
          <input type="range" min="1" max="128" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Count</label>
          <input type="number" min="1" max="50" value={count} onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Uppercase', val: useUpper, set: setUseUpper },
          { label: 'Lowercase', val: useLower, set: setUseLower },
          { label: 'Numbers', val: useNumbers, set: setUseNumbers },
          { label: 'Symbols', val: useSymbols, set: setUseSymbols },
        ].map((opt) => (
          <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={opt.val} onChange={(e) => opt.set(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>

      <Button onClick={generate} className="w-full">Generate</Button>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((s, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2">
              <code className="flex-1 font-mono text-sm break-all">{s}</code>
              <button onClick={() => copy(s, i)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0" aria-label="Copy">
                {copiedIdx === i ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
