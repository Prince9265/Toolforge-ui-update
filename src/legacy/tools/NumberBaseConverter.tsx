// @ts-nocheck -- ported verbatim from the ToolForge tool library
/* eslint-disable */
import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/legacy/contexts/ToastContext';

const bases = [
  { label: 'Binary', value: 2, prefix: '0b' },
  { label: 'Octal', value: 8, prefix: '0o' },
  { label: 'Decimal', value: 10, prefix: '' },
  { label: 'Hexadecimal', value: 16, prefix: '0x' },
];

export default function NumberBaseConverter() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [copiedKey, setCopiedKey] = useState('');
  const { showToast } = useToast();

  const results = useMemo(() => {
    if (!input.trim()) return {};
    const num = parseInt(input, fromBase);
    if (isNaN(num)) return {};
    const res: Record<string, string> = {};
    for (const b of bases) {
      res[b.label] = num.toString(b.value).toUpperCase();
    }
    return res;
  }, [input, fromBase]);

  const copy = async (key: string, val: string) => {
    await navigator.clipboard.writeText(val);
    setCopiedKey(key);
    showToast(`${key} copied`, 'success');
    setTimeout(() => setCopiedKey(''), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter number" className="h-10 flex-1 rounded-lg border border-input bg-background px-3 font-mono text-sm" />
        <select value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
          {bases.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {Object.entries(results).map(([label, val]) => (
          <div key={label} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-2">
            <span className="text-sm font-medium w-24">{label}</span>
            <code className="flex-1 font-mono text-sm">{val}</code>
            <button onClick={() => copy(label, val)} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Copy">
              {copiedKey === label ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
